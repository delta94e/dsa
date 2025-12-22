import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback, Profile } from 'passport-google-oauth20';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor() {
        const clientID = process.env.GOOGLE_CLIENT_ID || 'your-client-id';
        const clientSecret = process.env.GOOGLE_CLIENT_SECRET || 'your-client-secret';

        console.log('Google OAuth Config:');
        console.log('  Client ID:', clientID.substring(0, 20) + '...');
        console.log('  Client Secret:', clientSecret.substring(0, 10) + '...');

        super({
            clientID,
            clientSecret,
            callbackURL: 'http://localhost:3002/auth/google/callback',
            scope: ['email', 'profile'],
        });
    }

    async validate(
        accessToken: string,
        refreshToken: string,
        profile: Profile,
        done: VerifyCallback,
    ): Promise<any> {
        const { id, displayName, emails, photos } = profile;

        const user = {
            googleId: id,
            email: emails?.[0]?.value || '',
            name: displayName,
            avatarUrl: photos?.[0]?.value || '',
            accessToken,
        };

        console.log('Google user validated:', user.email);
        done(null, user);
    }
}
