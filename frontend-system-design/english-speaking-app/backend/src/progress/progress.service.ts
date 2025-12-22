import { Injectable } from '@nestjs/common';
import {
    UserProgress,
    XP_LEVELS,
    STREAK_XP_REWARDS,
    UserXpLevel,
} from '../types';

@Injectable()
export class ProgressService {
    // In-memory storage (use database in production)
    private userProgress = new Map<string, UserProgress>();

    private getLevelForXp(totalXp: number): UserXpLevel {
        let currentLevel = XP_LEVELS[0];
        for (const level of XP_LEVELS) {
            if (totalXp >= level.totalXp) {
                currentLevel = level;
            } else {
                break;
            }
        }
        return currentLevel;
    }

    private getXpForNextLevel(currentLevel: number): number {
        const nextLevel = XP_LEVELS.find(l => l.level === currentLevel + 1);
        return nextLevel ? nextLevel.xpRequired : 0;
    }

    async getOrCreateProgress(userId: string): Promise<UserProgress> {
        let progress = this.userProgress.get(userId);
        if (!progress) {
            progress = {
                userId,
                level: 1,
                currentXp: 0,
                totalXp: 0,
                streak: 0,
                completedQuests: [],
                achievements: [],
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            this.userProgress.set(userId, progress);
        }
        return progress;
    }

    async getProgress(userId: string): Promise<UserProgress | null> {
        return this.userProgress.get(userId) || null;
    }

    async addXp(userId: string, amount: number): Promise<{ progress: UserProgress; leveledUp: boolean; newLevel?: UserXpLevel }> {
        const progress = await this.getOrCreateProgress(userId);
        const oldLevel = progress.level;

        progress.totalXp += amount;
        progress.updatedAt = new Date();

        // Calculate new level
        const newLevelInfo = this.getLevelForXp(progress.totalXp);
        progress.level = newLevelInfo.level;

        // Calculate current XP within level
        const currentLevelInfo = XP_LEVELS.find(l => l.level === progress.level);
        const nextLevelInfo = XP_LEVELS.find(l => l.level === progress.level + 1);

        if (currentLevelInfo && nextLevelInfo) {
            progress.currentXp = progress.totalXp - currentLevelInfo.totalXp;
        } else {
            progress.currentXp = 0; // Max level reached
        }

        const leveledUp = newLevelInfo.level > oldLevel;

        return {
            progress,
            leveledUp,
            newLevel: leveledUp ? newLevelInfo : undefined,
        };
    }

    async dailyCheckIn(userId: string): Promise<{
        success: boolean;
        xpGained: number;
        streak: number;
        progress: UserProgress;
        error?: string;
    }> {
        const progress = await this.getOrCreateProgress(userId);
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        // Check if already checked in today
        if (progress.lastCheckIn) {
            const lastCheckInDate = new Date(progress.lastCheckIn);
            const lastCheckInDay = new Date(
                lastCheckInDate.getFullYear(),
                lastCheckInDate.getMonth(),
                lastCheckInDate.getDate()
            );

            if (lastCheckInDay.getTime() === today.getTime()) {
                return {
                    success: false,
                    xpGained: 0,
                    streak: progress.streak,
                    progress,
                    error: 'Already checked in today',
                };
            }

            // Check if streak is broken (more than 1 day gap)
            const diffDays = Math.floor((today.getTime() - lastCheckInDay.getTime()) / (1000 * 60 * 60 * 24));
            if (diffDays > 1) {
                progress.streak = 0; // Reset streak
            }
        }

        // Increase streak
        progress.streak += 1;
        progress.lastCheckIn = now;

        // Calculate XP reward based on streak (max 7 days cycle)
        const streakIndex = Math.min(progress.streak - 1, STREAK_XP_REWARDS.length - 1);
        const xpGained = STREAK_XP_REWARDS[streakIndex];

        // Add XP
        const result = await this.addXp(userId, xpGained);

        return {
            success: true,
            xpGained,
            streak: progress.streak,
            progress: result.progress,
        };
    }

    async getLeaderboard(limit = 10): Promise<Array<{ userId: string; totalXp: number; level: number }>> {
        const users = Array.from(this.userProgress.values());
        return users
            .sort((a, b) => b.totalXp - a.totalXp)
            .slice(0, limit)
            .map(u => ({
                userId: u.userId,
                totalXp: u.totalXp,
                level: u.level,
            }));
    }

    getLevelInfo(level: number): UserXpLevel | undefined {
        return XP_LEVELS.find(l => l.level === level);
    }

    getAllLevels(): UserXpLevel[] {
        return XP_LEVELS;
    }
}
