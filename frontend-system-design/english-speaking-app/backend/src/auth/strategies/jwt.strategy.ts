import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../../users/users.service';

export interface JwtPayload {
    sub: string; // user id
    email: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(private readonly usersService: UsersService) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                // Extract from cookie
                (req: any) => {
                    return req?.cookies?.['auth_token'] || null;
                },
                // Also try Authorization header
                ExtractJwt.fromAuthHeaderAsBearerToken(),
            ]),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET || 'super-secret-jwt-key',
        });
    }

    async validate(payload: JwtPayload) {
        const user = this.usersService.findById(payload.sub);
        if (!user) {
            return null;
        }
        return user;
    }
}
