import { Controller, Post, Body, Get, Param, Req, HttpException, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Request } from 'express';
import { AIService } from './ai.service';
import { RateLimitService } from './rate-limit.service';
import { AIChatRequest, AIMessageDto } from '../types';

@ApiTags('ai')
@Controller('ai')
export class AIController {
    constructor(
        private readonly aiService: AIService,
        private readonly rateLimitService: RateLimitService,
    ) { }

    @Post('chat')
    @ApiOperation({ summary: 'Chat with AI tutor' })
    @ApiResponse({ status: 429, description: 'Rate limited - too many messages' })
    @ApiResponse({ status: 403, description: 'Permanently blocked or IP blocked - contact admin' })
    async chat(@Body() request: AIChatRequest, @Req() req: Request): Promise<AIMessageDto> {
        // Extract user ID from auth token or use IP as fallback
        const userId = (req as any).user?.sub ||
            req.cookies?.auth_token?.split('.')?.[1] ||
            req.ip ||
            'anonymous';

        // Get client IP for IP blocking
        const clientIp = req.ip || req.headers['x-forwarded-for']?.toString().split(',')[0] || 'unknown';

        // Check rate limit (throws if limited/blocked)
        this.rateLimitService.checkRateLimit(userId, clientIp);

        return this.aiService.chat(request);
    }

    @Get('rate-limit/status/:userId')
    @ApiOperation({ summary: 'Get user rate limit status (admin)' })
    getRateLimitStatus(@Param('userId') userId: string) {
        const status = this.rateLimitService.getUserStatus(userId);
        if (!status) {
            return { userId, status: 'no_data' };
        }
        return { userId, ...status };
    }

    @Post('rate-limit/unblock/:userId')
    @ApiOperation({ summary: 'Unblock a user (admin)' })
    unblockUser(@Param('userId') userId: string) {
        const success = this.rateLimitService.unblockUser(userId);
        if (!success) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }
        return {
            success: true,
            message: `User ${userId} has been unblocked`,
            userId,
        };
    }

    @Get('rate-limit/blocked')
    @ApiOperation({ summary: 'Get all blocked users (admin)' })
    getBlockedUsers() {
        return this.rateLimitService.getBlockedUsers();
    }

    @Post('rate-limit/unblock-ip/:ip')
    @ApiOperation({ summary: 'Unblock an IP address (admin)' })
    unblockIP(@Param('ip') ip: string) {
        // Handle URL-encoded IP (colons are encoded)
        const decodedIp = decodeURIComponent(ip);
        const success = this.rateLimitService.unblockIP(decodedIp);
        if (!success) {
            throw new HttpException('IP not found in blocked list', HttpStatus.NOT_FOUND);
        }
        return {
            success: true,
            message: `IP ${decodedIp} has been unblocked`,
            ip: decodedIp,
        };
    }

    @Get('rate-limit/blocked-ips')
    @ApiOperation({ summary: 'Get all blocked IPs (admin)' })
    getBlockedIPs() {
        return this.rateLimitService.getBlockedIPs();
    }

    @Get('rate-limit/blocked-accounts')
    @ApiOperation({ summary: 'Get all banned accounts (admin)' })
    getBlockedAccounts() {
        return this.rateLimitService.getBlockedAccounts();
    }

    @Post('rate-limit/unblock-account/:userId')
    @ApiOperation({ summary: 'Unblock a banned account (admin)' })
    unblockAccount(@Param('userId') userId: string) {
        const success = this.rateLimitService.unblockAccount(userId);
        if (!success) {
            throw new HttpException('Account not found in banned list', HttpStatus.NOT_FOUND);
        }
        return {
            success: true,
            message: `Account ${userId} has been unbanned`,
            userId,
        };
    }

    @Get('rate-limit/check-account/:userId')
    @ApiOperation({ summary: 'Check if account is banned' })
    checkAccountStatus(@Param('userId') userId: string) {
        const status = this.rateLimitService.isAccountBlocked(userId);
        return {
            userId,
            banned: status.blocked,
            ...(status.data || {}),
        };
    }
}
