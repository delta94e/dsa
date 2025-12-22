import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService, StoredUser } from '../users/users.service';
import { v4 as uuidv4 } from 'uuid';

export interface GoogleProfile {
    googleId: string;
    email: string;
    name: string;
    avatarUrl: string;
}

export interface TokenPayload {
    sub: string;
    email: string;
}

export interface Tokens {
    accessToken: string;
    refreshToken: string;
}

@Injectable()
export class AuthService {
    // In-memory refresh token store (use Redis in production)
    private refreshTokens = new Map<string, { userId: string; expiresAt: Date }>();

    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
    ) { }

    async validateGoogleUser(profile: GoogleProfile): Promise<StoredUser> {
        let user = this.usersService.findByGoogleId(profile.googleId);

        if (user) {
            this.usersService.updateLastLogin(user.id);
            console.log(`Existing user logged in: ${user.name}`);
        } else {
            user = this.usersService.create(profile);
            console.log(`New user created: ${user.name}`);
        }

        return user;
    }

    generateAccessToken(user: StoredUser): string {
        const payload: TokenPayload = {
            sub: user.id,
            email: user.email,
        };
        return this.jwtService.sign(payload, { expiresIn: '15m' });
    }

    generateRefreshToken(userId: string): string {
        const refreshToken = uuidv4();
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

        this.refreshTokens.set(refreshToken, { userId, expiresAt });
        console.log(`Refresh token generated for user ${userId}`);

        return refreshToken;
    }

    async login(user: StoredUser): Promise<{ accessToken: string; refreshToken: string; user: StoredUser }> {
        const accessToken = this.generateAccessToken(user);
        const refreshToken = this.generateRefreshToken(user.id);

        return {
            accessToken,
            refreshToken,
            user,
        };
    }

    async refreshAccessToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string } | null> {
        const tokenData = this.refreshTokens.get(refreshToken);

        if (!tokenData) {
            console.log('Refresh token not found');
            return null;
        }

        if (new Date() > tokenData.expiresAt) {
            console.log('Refresh token expired');
            this.refreshTokens.delete(refreshToken);
            return null;
        }

        const user = this.usersService.findById(tokenData.userId);
        if (!user) {
            console.log('User not found for refresh token');
            this.refreshTokens.delete(refreshToken);
            return null;
        }

        // Revoke old refresh token and generate new one (token rotation)
        this.refreshTokens.delete(refreshToken);
        const newAccessToken = this.generateAccessToken(user);
        const newRefreshToken = this.generateRefreshToken(user.id);

        return {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
        };
    }

    revokeRefreshToken(refreshToken: string): void {
        this.refreshTokens.delete(refreshToken);
        console.log('Refresh token revoked');
    }

    revokeAllUserTokens(userId: string): void {
        for (const [token, data] of this.refreshTokens.entries()) {
            if (data.userId === userId) {
                this.refreshTokens.delete(token);
            }
        }
        console.log(`All refresh tokens revoked for user ${userId}`);
    }

    async getUserFromToken(token: string): Promise<StoredUser | null> {
        try {
            const payload = this.jwtService.verify(token);
            return this.usersService.findById(payload.sub);
        } catch (error) {
            return null;
        }
    }

    verifyToken(token: string): TokenPayload | null {
        try {
            return this.jwtService.verify<TokenPayload>(token);
        } catch {
            return null;
        }
    }
}
