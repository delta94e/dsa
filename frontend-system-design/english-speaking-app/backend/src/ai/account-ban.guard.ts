import {
    Injectable,
    CanActivate,
    ExecutionContext,
    ForbiddenException,
} from '@nestjs/common';
import { RateLimitService } from './rate-limit.service';
import { Request } from 'express';

@Injectable()
export class AccountBanGuard implements CanActivate {
    constructor(private readonly rateLimitService: RateLimitService) { }

    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest<Request>();

        // Skip for GraphQL requests (they don't have standard HTTP request path)
        if (!request?.path) {
            return true;
        }

        // Skip ban check for unblock endpoints (admin functions)
        const path = request.path;
        if (
            path.includes('/rate-limit/unblock') ||
            path.includes('/rate-limit/blocked') ||
            path.includes('/rate-limit/check-account') ||
            path.includes('/auth/logout') ||
            path.includes('/auth/google') || // Allow Google OAuth flow
            path.includes('/auth/status') || // Allow status check (will return banned: true)
            path.includes('/feature-flags') || // Allow feature flags (will be skipped anyway on login)
            path.includes('/graphql') // Allow GraphQL endpoint
        ) {
            return true;
        }

        // Get user ID from various sources
        const userId = this.extractUserId(request);

        if (!userId) {
            // No user ID - allow the request (might be unauthenticated endpoint)
            return true;
        }

        // Check if account is banned
        const banStatus = this.rateLimitService.isAccountBlocked(userId);
        if (banStatus.blocked) {
            const remainingHours = Math.ceil(
                (banStatus.data!.blockedUntil - Date.now()) / (60 * 60 * 1000)
            );
            throw new ForbiddenException({
                error: 'ACCOUNT_BANNED',
                message: `Your account is banned. Remaining time: ${remainingHours} hour(s). Please contact an administrator.`,
                blockedUntil: banStatus.data!.blockedUntil,
                reason: banStatus.data!.reason,
            });
        }

        // Check if IP is blocked
        const clientIp = request.ip || request.headers['x-forwarded-for']?.toString().split(',')[0];
        if (clientIp) {
            const blockedIPs = this.rateLimitService.getBlockedIPs();
            const isIpBlocked = blockedIPs.some(blocked => blocked.ip === clientIp);
            if (isIpBlocked) {
                throw new ForbiddenException({
                    error: 'IP_BLOCKED',
                    message: 'Your IP address has been blocked due to abuse. Please contact an administrator.',
                });
            }
        }

        return true;
    }

    private extractUserId(request: Request): string | null {
        // Try to get from JWT user (if authenticated)
        if ((request as any).user?.sub) {
            return (request as any).user.sub;
        }
        if ((request as any).user?.id) {
            return (request as any).user.id;
        }

        // Try to get from auth cookie
        const authToken = request.cookies?.['auth_token'];
        if (authToken) {
            try {
                // Decode JWT payload (base64)
                const payload = authToken.split('.')[1];
                const decoded = JSON.parse(Buffer.from(payload, 'base64').toString());
                return decoded.sub || decoded.id || null;
            } catch (e) {
                return null;
            }
        }

        return null;
    }
}
