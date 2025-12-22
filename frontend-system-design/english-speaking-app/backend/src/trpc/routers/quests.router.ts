import { z } from 'zod';
import { router, protectedProcedure } from '../trpc';
import { QuestsService } from '../../quests/quests.service';

// Input schemas
const trackActivityInput = z.object({
    activityType: z.enum(['message_sent', 'room_joined', 'room_created', 'speaking_time']),
    amount: z.number().optional(),
});

const questTypeInput = z.object({
    type: z.enum(['daily', 'weekly', 'achievement']).optional(),
});

/**
 * Quests Router - handles quest tracking
 */
export const createQuestsRouter = (questsService: QuestsService) => {
    return router({
        /**
         * Get all available quests
         */
        list: protectedProcedure
            .input(questTypeInput)
            .query(({ input }) => {
                return questsService.getQuests(input.type);
            }),

        /**
         * Get user's quest progress
         */
        userProgress: protectedProcedure
            .query(async ({ ctx }) => {
                return questsService.getUserQuestProgress(ctx.user.id);
            }),

        /**
         * Track activity for quest progress
         */
        trackActivity: protectedProcedure
            .input(trackActivityInput)
            .mutation(async ({ input, ctx }) => {
                const result = await questsService.trackActivity(
                    ctx.user.id,
                    input.activityType,
                    input.amount || 1
                );
                return result;
            }),
    });
};

export type QuestsRouter = ReturnType<typeof createQuestsRouter>;
