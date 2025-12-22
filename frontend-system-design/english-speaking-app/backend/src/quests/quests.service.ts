import { Injectable } from '@nestjs/common';
import {
    Quest,
    UserQuestProgress,
    DEFAULT_QUESTS,
    QuestType,
} from '../types';
import { ProgressService } from '../progress/progress.service';

@Injectable()
export class QuestsService {
    // In-memory storage (use database in production)
    private userQuestProgress = new Map<string, UserQuestProgress[]>();
    private dailyProgress = new Map<string, Map<string, number>>(); // userId -> questId -> progress

    constructor(private readonly progressService: ProgressService) { }

    getQuests(type?: QuestType): Quest[] {
        if (type) {
            return DEFAULT_QUESTS.filter(q => q.type === type);
        }
        return DEFAULT_QUESTS;
    }

    getQuestById(questId: string): Quest | undefined {
        return DEFAULT_QUESTS.find(q => q.id === questId);
    }

    async getUserQuestProgress(userId: string): Promise<UserQuestProgress[]> {
        return this.userQuestProgress.get(userId) || [];
    }

    async updateQuestProgress(
        userId: string,
        questId: string,
        progressAmount: number
    ): Promise<{ completed: boolean; xpGained?: number; quest?: Quest }> {
        const quest = this.getQuestById(questId);
        if (!quest) return { completed: false };

        // Get or create user progress
        let userProgress = this.userQuestProgress.get(userId) || [];
        let questProgress = userProgress.find(p => p.questId === questId);

        // For achievements, check if already completed
        if (quest.type === 'achievement' && questProgress?.completed) {
            return { completed: false };
        }

        if (!questProgress) {
            questProgress = {
                questId,
                userId,
                progress: 0,
                completed: false,
            };
            userProgress.push(questProgress);
            this.userQuestProgress.set(userId, userProgress);
        }

        // Update progress
        questProgress.progress += progressAmount;

        // Check if completed
        if (questProgress.progress >= quest.condition.target && !questProgress.completed) {
            questProgress.completed = true;
            questProgress.completedAt = new Date();

            // Award XP
            await this.progressService.addXp(userId, quest.xpReward);

            return {
                completed: true,
                xpGained: quest.xpReward,
                quest,
            };
        }

        return { completed: false };
    }

    // Track activity for quest progress
    async trackActivity(
        userId: string,
        activityType: 'message_sent' | 'room_joined' | 'room_created' | 'speaking_time',
        amount = 1
    ): Promise<Array<{ questId: string; completed: boolean; xpGained?: number }>> {
        const results: Array<{ questId: string; completed: boolean; xpGained?: number }> = [];

        // Map activity type to quest condition type
        const conditionTypeMap: Record<string, string> = {
            message_sent: 'message_count',
            room_joined: 'room_join',
            room_created: 'room_create',
            speaking_time: 'speaking_time',
        };

        const conditionType = conditionTypeMap[activityType];

        // Find relevant quests
        const relevantQuests = DEFAULT_QUESTS.filter(
            q => q.condition.type === conditionType
        );

        for (const quest of relevantQuests) {
            const result = await this.updateQuestProgress(userId, quest.id, amount);
            if (result.completed) {
                results.push({
                    questId: quest.id,
                    completed: true,
                    xpGained: result.xpGained,
                });
            }
        }

        return results;
    }

    // Reset daily quests (called by scheduler or manually)
    async resetDailyQuests(): Promise<void> {
        for (const [userId, progress] of this.userQuestProgress.entries()) {
            const filtered = progress.filter(p => {
                const quest = this.getQuestById(p.questId);
                return quest?.type !== 'daily';
            });
            this.userQuestProgress.set(userId, filtered);
        }
    }

    // Reset weekly quests
    async resetWeeklyQuests(): Promise<void> {
        for (const [userId, progress] of this.userQuestProgress.entries()) {
            const filtered = progress.filter(p => {
                const quest = this.getQuestById(p.questId);
                return quest?.type !== 'weekly';
            });
            this.userQuestProgress.set(userId, filtered);
        }
    }
}
