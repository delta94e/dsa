import { Injectable } from '@nestjs/common';
import { User } from '../types';
import { v4 as uuidv4 } from 'uuid';

export interface StoredUser extends User {
    googleId: string;
    email: string;
    createdAt: Date;
    lastLoginAt: Date;
}

@Injectable()
export class UsersService {
    // In-memory storage (replace with database in production)
    private users = new Map<string, StoredUser>();

    findByGoogleId(googleId: string): StoredUser | null {
        for (const user of this.users.values()) {
            if (user.googleId === googleId) {
                return user;
            }
        }
        return null;
    }

    findById(id: string): StoredUser | null {
        return this.users.get(id) || null;
    }

    findByEmail(email: string): StoredUser | null {
        for (const user of this.users.values()) {
            if (user.email === email) {
                return user;
            }
        }
        return null;
    }

    create(profile: {
        googleId: string;
        email: string;
        name: string;
        avatarUrl: string;
    }): StoredUser {
        const user: StoredUser = {
            id: uuidv4(),
            googleId: profile.googleId,
            email: profile.email,
            name: profile.name,
            avatarUrl: profile.avatarUrl,
            nativeLanguage: 'English',
            learningLevel: 'B1',
            country: 'Unknown',
            countryFlag: '🌍',
            role: 'user', // Default role
            createdAt: new Date(),
            lastLoginAt: new Date(),
        };

        this.users.set(user.id, user);
        console.log(`Created user: ${user.name} (${user.email})`);
        return user;
    }

    updateLastLogin(id: string): void {
        const user = this.users.get(id);
        if (user) {
            user.lastLoginAt = new Date();
        }
    }

    getAll(): StoredUser[] {
        return Array.from(this.users.values());
    }
}
