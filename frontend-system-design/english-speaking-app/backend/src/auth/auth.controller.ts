import {
    Controller,
    Get,
    Post,
    Req,
    Res,
    Body,
    UseGuards,
    UnauthorizedException,
    ForbiddenException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { StoredUser } from '../users/users.service';
import { RateLimitService } from '../ai/rate-limit.service';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly rateLimitService: RateLimitService,
    ) { }

    @Get('google')
    @UseGuards(AuthGuard('google'))
    async googleAuth() {
        // This route initiates Google OAuth flow
        // Passport automatically redirects to Google
    }

    @Get('google/callback')
    @UseGuards(AuthGuard('google'))
    async googleCallback(@Req() req: Request, @Res() res: Response) {
        const googleUser = req.user as {
            googleId: string;
            email: string;
            name: string;
            avatarUrl: string;
        };

        // Validate/create user in our system
        const user = await this.authService.validateGoogleUser(googleUser);

        // Check if account is banned before allowing login
        const banStatus = this.rateLimitService.isAccountBlocked(user.id);
        if (banStatus.blocked) {
            const remainingHours = Math.ceil((banStatus.data!.blockedUntil - Date.now()) / (60 * 60 * 1000));
            res.redirect(`http://localhost:3001/login?banned=true&hours=${remainingHours}`);
            return;
        }

        // Generate tokens
        const { accessToken, refreshToken } = await this.authService.login(user);

        // Set access token in cookie
        res.cookie('auth_token', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 15 * 60 * 1000, // 15 minutes
        });

        // Set refresh token in separate cookie
        res.cookie('refresh_token', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        // Redirect to frontend
        res.redirect('http://localhost:3001?login=success');
    }

    @Get('me')
    @UseGuards(AuthGuard('jwt'))
    async getMe(@Req() req: Request) {
        const user = req.user as StoredUser;

        // Check if account is banned
        const banStatus = this.rateLimitService.isAccountBlocked(user.id);
        if (banStatus.blocked) {
            const remainingHours = Math.ceil((banStatus.data!.blockedUntil - Date.now()) / (60 * 60 * 1000));
            throw new ForbiddenException({
                error: 'ACCOUNT_BANNED',
                message: `Your account is banned. Remaining time: ${remainingHours} hour(s).`,
                blockedUntil: banStatus.data!.blockedUntil,
            });
        }

        return user;
    }

    @Post('refresh')
    async refreshToken(@Req() req: Request, @Res() res: Response) {
        const refreshToken = req.cookies?.['refresh_token'];

        if (!refreshToken) {
            throw new UnauthorizedException('Refresh token not found');
        }

        const tokens = await this.authService.refreshAccessToken(refreshToken);

        if (!tokens) {
            // Clear invalid cookies
            res.clearCookie('auth_token');
            res.clearCookie('refresh_token');
            throw new UnauthorizedException('Invalid or expired refresh token');
        }

        // Set new access token
        res.cookie('auth_token', tokens.accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 15 * 60 * 1000, // 15 minutes
        });

        // Set new refresh token (token rotation)
        res.cookie('refresh_token', tokens.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        return res.json({
            success: true,
            accessToken: tokens.accessToken,
        });
    }

    @Get('status')
    async getStatus(@Req() req: Request, @Res() res: Response) {
        let token = req.cookies?.['auth_token'];
        const refreshToken = req.cookies?.['refresh_token'];

        // Try to get user from access token
        let user = token ? await this.authService.getUserFromToken(token) : null;

        // If access token is invalid but refresh token exists, try to refresh
        if (!user && refreshToken) {
            const tokens = await this.authService.refreshAccessToken(refreshToken);
            if (tokens) {
                token = tokens.accessToken;
                user = await this.authService.getUserFromToken(token);

                // Set new cookies
                res.cookie('auth_token', tokens.accessToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'lax',
                    maxAge: 15 * 60 * 1000,
                });
                res.cookie('refresh_token', tokens.refreshToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'lax',
                    maxAge: 7 * 24 * 60 * 60 * 1000,
                });
            }
        }

        if (!user) {
            return res.json({ isAuthenticated: false, user: null, token: null });
        }

        // Check if account is banned
        const banStatus = this.rateLimitService.isAccountBlocked(user.id);
        if (banStatus.blocked) {
            const remainingHours = Math.ceil((banStatus.data!.blockedUntil - Date.now()) / (60 * 60 * 1000));
            return res.json({
                isAuthenticated: false,
                user: null,
                token: null,
                banned: true,
                message: `Your account is banned for ${remainingHours} more hour(s).`,
                blockedUntil: banStatus.data!.blockedUntil,
            });
        }

        return res.json({ isAuthenticated: true, user, token });
    }

    @Get('logout')
    async logout(@Req() req: Request, @Res() res: Response) {
        // Revoke refresh token
        const refreshToken = req.cookies?.['refresh_token'];
        if (refreshToken) {
            this.authService.revokeRefreshToken(refreshToken);
        }

        res.clearCookie('auth_token');
        res.clearCookie('refresh_token');
        res.redirect('http://localhost:3001?logout=success');
    }
}
