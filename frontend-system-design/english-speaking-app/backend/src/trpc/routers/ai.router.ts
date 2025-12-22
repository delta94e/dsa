import { z } from 'zod';
import { router, protectedProcedure } from '../trpc';
import { AIService } from '../../ai/ai.service';
import { TRPCError } from '@trpc/server';
import { Level } from '../../types';

// Input schemas
const chatInput = z.object({
    topic: z.string().min(1).max(200),
    level: z.enum(['A1', 'A2', 'B1', 'B2', 'C1', 'C2']),
    messages: z.array(z.object({
        role: z.enum(['user', 'assistant']),
        content: z.string(),
    })),
});

/**
 * AI Router - handles AI chat interactions
 */
export const createAIRouter = (aiService: AIService) => {
    return router({
        /**
         * Send message to AI
         */
        chat: protectedProcedure
            .input(chatInput)
            .mutation(async ({ input }) => {
                try {
                    const response = await aiService.chat({
                        topic: input.topic,
                        level: input.level as Level,
                        messages: input.messages,
                    });
                    return response;
                } catch (error: any) {
                    if (error.status === 429) {
                        throw new TRPCError({
                            code: 'TOO_MANY_REQUESTS',
                            message: error.message || 'Rate limit exceeded',
                        });
                    }
                    throw new TRPCError({
                        code: 'INTERNAL_SERVER_ERROR',
                        message: error.message || 'AI service error',
                    });
                }
            }),
    });
};

export type AIRouter = ReturnType<typeof createAIRouter>;
