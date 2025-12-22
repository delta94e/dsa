import { Injectable, HttpException, HttpStatus } from '@nestjs/common';

export interface UserRateLimitData {
    messageCount: number;
    windowStart: number;
    violations: number;
    cooldownUntil: number | null;
    permanentlyBlocked: boolean;
    attemptsWhileBlocked: number;
}

export interface BlockedAccountData {
    blockedAt: number;
    blockedUntil: number;
    reason: string;
}

// Rate limit configuration
const RATE_LIMIT_CONFIG = {
    maxMessagesPerWindow: 20, // Max messages allowed
    windowDurationMs: 60000, // 1 minute window
    cooldownDurationMs: 5 * 60000, // 5 minutes cooldown after 1st violation
    maxAttemptsWhileBlocked: 5, // Max attempts while blocked before IP is banned
    accountBlockDurationMs: 24 * 60 * 60000, // 1 day account block
};

@Injectable()
export class RateLimitService {
    // In production, use Redis for persistence across instances
    private userLimits: Map<string, UserRateLimitData> = new Map();
    private blockedIPs: Map<string, { blockedAt: number; reason: string }> = new Map();
    private blockedAccounts: Map<string, BlockedAccountData> = new Map();

    /**
     * Check if account is blocked (for login check)
     */
    isAccountBlocked(userId: string): { blocked: boolean; data?: BlockedAccountData } {
        const accountData = this.blockedAccounts.get(userId);
        if (!accountData) {
            return { blocked: false };
        }

        // Check if ban has expired
        if (Date.now() >= accountData.blockedUntil) {
            this.blockedAccounts.delete(userId);
            return { blocked: false };
        }

        return { blocked: true, data: accountData };
    }

    /**
     * Check if user is allowed to send message
     * @throws HttpException if rate limited or blocked
     */
    checkRateLimit(userId: string, clientIp?: string): void {
        const now = Date.now();

        // Check if account is banned (1 day ban)
        const accountStatus = this.isAccountBlocked(userId);
        if (accountStatus.blocked) {
            const remainingHours = Math.ceil((accountStatus.data!.blockedUntil - now) / (60 * 60000));
            throw new HttpException(
                {
                    error: 'ACCOUNT_BANNED',
                    message: `Your account has been banned. Time remaining: ${remainingHours} hour(s).`,
                    blockedUntil: accountStatus.data!.blockedUntil,
                    forceLogout: true,
                },
                HttpStatus.FORBIDDEN
            );
        }

        // Check if IP is blocked first
        if (clientIp && this.blockedIPs.has(clientIp)) {
            const ipData = this.blockedIPs.get(clientIp)!;
            throw new HttpException(
                {
                    error: 'IP_BLOCKED',
                    message: 'Your IP address has been blocked due to repeated abuse. Please contact an administrator.',
                    blockedAt: ipData.blockedAt,
                    reason: ipData.reason,
                },
                HttpStatus.FORBIDDEN
            );
        }

        let userData = this.userLimits.get(userId);

        // Initialize user data if not exists
        if (!userData) {
            userData = {
                messageCount: 0,
                windowStart: now,
                violations: 0,
                cooldownUntil: null,
                permanentlyBlocked: false,
                attemptsWhileBlocked: 0,
            };
            this.userLimits.set(userId, userData);
        }

        // Check if permanently blocked (2nd violation)
        if (userData.permanentlyBlocked) {
            userData.attemptsWhileBlocked++;

            // Block IP AND Account if too many attempts while blocked
            if (clientIp && userData.attemptsWhileBlocked >= RATE_LIMIT_CONFIG.maxAttemptsWhileBlocked) {
                this.blockedIPs.set(clientIp, {
                    blockedAt: now,
                    reason: `User ${userId} made ${userData.attemptsWhileBlocked} attempts while permanently blocked`,
                });

                // Also block the account for 1 day
                this.blockedAccounts.set(userId, {
                    blockedAt: now,
                    blockedUntil: now + RATE_LIMIT_CONFIG.accountBlockDurationMs,
                    reason: `Excessive attempts (${userData.attemptsWhileBlocked}) while blocked`,
                });

                console.log(`🔥 IP ${clientIp} + ACCOUNT ${userId} BLOCKED for 1 day (${userData.attemptsWhileBlocked} attempts while blocked)`);

                // Throw with forceLogout flag
                throw new HttpException(
                    {
                        error: 'ACCOUNT_BANNED',
                        message: 'Your account has been banned for 1 day due to abuse. You will be logged out.',
                        blockedUntil: now + RATE_LIMIT_CONFIG.accountBlockDurationMs,
                        forceLogout: true,
                    },
                    HttpStatus.FORBIDDEN
                );
            }

            throw new HttpException(
                {
                    error: 'PERMANENTLY_BLOCKED',
                    message: 'Your account has been blocked due to repeated violations. Please contact an administrator to unlock.',
                    blockedAt: userData.cooldownUntil,
                    attemptsWhileBlocked: userData.attemptsWhileBlocked,
                    warningIpBlock: userData.attemptsWhileBlocked >= 3
                        ? `⚠️ Warning: ${RATE_LIMIT_CONFIG.maxAttemptsWhileBlocked - userData.attemptsWhileBlocked} more attempts will block your IP and ban your account for 1 day!`
                        : undefined,
                },
                HttpStatus.FORBIDDEN
            );
        }

        // Check if in cooldown period (1st violation)
        if (userData.cooldownUntil && now < userData.cooldownUntil) {
            userData.attemptsWhileBlocked++;
            const remainingSeconds = Math.ceil((userData.cooldownUntil - now) / 1000);
            const remainingMinutes = Math.ceil(remainingSeconds / 60);

            // Block IP AND Account if too many attempts during cooldown
            if (clientIp && userData.attemptsWhileBlocked >= RATE_LIMIT_CONFIG.maxAttemptsWhileBlocked) {
                this.blockedIPs.set(clientIp, {
                    blockedAt: now,
                    reason: `User ${userId} made ${userData.attemptsWhileBlocked} attempts during cooldown period`,
                });

                // Also block the account for 1 day
                this.blockedAccounts.set(userId, {
                    blockedAt: now,
                    blockedUntil: now + RATE_LIMIT_CONFIG.accountBlockDurationMs,
                    reason: `Excessive attempts (${userData.attemptsWhileBlocked}) during cooldown`,
                });

                console.log(`🔥 IP ${clientIp} + ACCOUNT ${userId} BLOCKED for 1 day (${userData.attemptsWhileBlocked} attempts during cooldown)`);

                throw new HttpException(
                    {
                        error: 'ACCOUNT_BANNED',
                        message: 'Your account has been banned for 1 day due to abuse. You will be logged out.',
                        blockedUntil: now + RATE_LIMIT_CONFIG.accountBlockDurationMs,
                        forceLogout: true,
                    },
                    HttpStatus.FORBIDDEN
                );
            }

            throw new HttpException(
                {
                    error: 'RATE_LIMITED',
                    message: `You are temporarily blocked from chatting. Please wait ${remainingMinutes} minute(s) before trying again.`,
                    cooldownUntil: userData.cooldownUntil,
                    remainingSeconds,
                    attemptsWhileBlocked: userData.attemptsWhileBlocked,
                    warningIpBlock: userData.attemptsWhileBlocked >= 3
                        ? `⚠️ Warning: ${RATE_LIMIT_CONFIG.maxAttemptsWhileBlocked - userData.attemptsWhileBlocked} more attempts will block your IP and ban your account!`
                        : undefined,
                },
                HttpStatus.TOO_MANY_REQUESTS
            );
        }

        // Reset cooldown if expired
        if (userData.cooldownUntil && now >= userData.cooldownUntil) {
            userData.cooldownUntil = null;
            userData.attemptsWhileBlocked = 0; // Reset attempts counter
        }

        // Check if window has expired, reset counter
        if (now - userData.windowStart > RATE_LIMIT_CONFIG.windowDurationMs) {
            userData.messageCount = 0;
            userData.windowStart = now;
        }

        // Check if exceeds rate limit
        if (userData.messageCount >= RATE_LIMIT_CONFIG.maxMessagesPerWindow) {
            userData.violations++;

            if (userData.violations >= 2) {
                // 2nd violation: permanently block + BAN ACCOUNT FOR 1 DAY
                userData.permanentlyBlocked = true;
                userData.cooldownUntil = now;

                // Also ban the account for 1 day
                this.blockedAccounts.set(userId, {
                    blockedAt: now,
                    blockedUntil: now + RATE_LIMIT_CONFIG.accountBlockDurationMs,
                    reason: `Permanent block after ${userData.violations} violations`,
                });

                console.log(`🚫 User ${userId} PERMANENTLY BLOCKED + ACCOUNT BANNED FOR 1 DAY (${userData.violations} violations)`);

                throw new HttpException(
                    {
                        error: 'ACCOUNT_BANNED',
                        message: 'Your account has been banned for 1 day due to repeated violations. You will be logged out.',
                        violations: userData.violations,
                        blockedUntil: now + RATE_LIMIT_CONFIG.accountBlockDurationMs,
                        forceLogout: true,
                    },
                    HttpStatus.FORBIDDEN
                );
            } else {
                // 1st violation: 5 minute cooldown
                userData.cooldownUntil = now + RATE_LIMIT_CONFIG.cooldownDurationMs;
                userData.messageCount = 0;
                userData.windowStart = now;

                console.log(`⚠️ User ${userId} rate limited for 5 minutes (violation #${userData.violations})`);

                throw new HttpException(
                    {
                        error: 'RATE_LIMITED',
                        message: 'You are sending messages too fast. Please wait 5 minutes before trying again.',
                        cooldownUntil: userData.cooldownUntil,
                        remainingSeconds: RATE_LIMIT_CONFIG.cooldownDurationMs / 1000,
                        violation: userData.violations,
                    },
                    HttpStatus.TOO_MANY_REQUESTS
                );
            }
        }

        // Increment message count
        userData.messageCount++;
    }

    /**
     * Admin: Unblock a user
     */
    unblockUser(userId: string): boolean {
        const userData = this.userLimits.get(userId);

        if (!userData) {
            return false;
        }

        userData.permanentlyBlocked = false;
        userData.violations = 0;
        userData.cooldownUntil = null;
        userData.messageCount = 0;
        userData.windowStart = Date.now();
        userData.attemptsWhileBlocked = 0;

        console.log(`✅ Admin unblocked user ${userId}`);

        return true;
    }

    /**
     * Admin: Unblock an account (remove 1-day ban)
     */
    unblockAccount(userId: string): boolean {
        if (!this.blockedAccounts.has(userId)) {
            return false;
        }

        this.blockedAccounts.delete(userId);
        // Also reset the user's rate limit data
        this.unblockUser(userId);
        console.log(`✅ Admin unblocked account ${userId}`);

        return true;
    }

    /**
     * Admin: Unblock an IP
     */
    unblockIP(ip: string): boolean {
        if (!this.blockedIPs.has(ip)) {
            return false;
        }

        this.blockedIPs.delete(ip);
        console.log(`✅ Admin unblocked IP ${ip}`);

        return true;
    }

    /**
     * Get user's rate limit status
     */
    getUserStatus(userId: string): UserRateLimitData | null {
        return this.userLimits.get(userId) || null;
    }

    /**
     * Get all blocked users
     */
    getBlockedUsers(): { userId: string; data: UserRateLimitData }[] {
        const blocked: { userId: string; data: UserRateLimitData }[] = [];

        this.userLimits.forEach((data, userId) => {
            if (data.permanentlyBlocked || (data.cooldownUntil && Date.now() < data.cooldownUntil)) {
                blocked.push({ userId, data });
            }
        });

        return blocked;
    }

    /**
     * Get all blocked accounts (1-day ban)
     */
    getBlockedAccounts(): { userId: string; data: BlockedAccountData }[] {
        const blocked: { userId: string; data: BlockedAccountData }[] = [];

        this.blockedAccounts.forEach((data, userId) => {
            blocked.push({ userId, data });
        });

        return blocked;
    }

    /**
     * Get all blocked IPs
     */
    getBlockedIPs(): { ip: string; blockedAt: number; reason: string }[] {
        const blocked: { ip: string; blockedAt: number; reason: string }[] = [];

        this.blockedIPs.forEach((data, ip) => {
            blocked.push({ ip, ...data });
        });

        return blocked;
    }
}
