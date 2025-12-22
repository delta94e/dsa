import { z } from 'zod';
import { router, publicProcedure, protectedProcedure } from '../trpc';

/**
 * Auth Router - handles authentication status
 */
export const createAuthRouter = () => {
    return router({
        /**
         * Get current user info
         */
        me: protectedProcedure
            .query(({ ctx }) => {
                return ctx.user;
            }),

        /**
         * Check auth status
         */
        status: publicProcedure
            .query(({ ctx }) => {
                return {
                    isAuthenticated: !!ctx.user,
                    user: ctx.user,
                };
            }),
    });
};

export type AuthRouter = ReturnType<typeof createAuthRouter>;
