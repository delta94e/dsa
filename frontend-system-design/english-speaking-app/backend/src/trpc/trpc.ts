import { initTRPC, TRPCError } from '@trpc/server';
import { Request, Response } from 'express';

/**
 * tRPC Context - contains request info and user session
 */
export interface TRPCContext {
    req: Request;
    res: Response;
    user: {
        id: string;
        email: string;
        name: string;
        role: 'student' | 'teacher' | 'admin';
    } | null;
}

/**
 * Create context from request
 */
export function createContext(opts: { req: Request; res: Response }): TRPCContext {
    // Extract user from JWT cookie or header
    const user = extractUserFromRequest(opts.req);

    return {
        req: opts.req,
        res: opts.res,
        user,
    };
}

/**
 * Extract user from request (JWT cookie or Bearer token)
 */
function extractUserFromRequest(req: Request): TRPCContext['user'] {
    try {
        // Try to get token from cookie first
        let authToken = req.cookies?.['auth_token'];

        // If no cookie, check Authorization header for Bearer token
        if (!authToken) {
            const authHeader = req.headers['authorization'] as string | undefined;
            if (authHeader?.startsWith('Bearer ')) {
                authToken = authHeader.substring(7);
            }
        }

        if (!authToken) return null;

        // Decode JWT payload (base64)
        const payload = authToken.split('.')[1];
        if (!payload) return null;

        const decoded = JSON.parse(Buffer.from(payload, 'base64').toString());

        // Check token expiration
        if (decoded.exp && decoded.exp * 1000 < Date.now()) {
            return null;
        }

        return {
            id: decoded.sub || decoded.id,
            email: decoded.email,
            name: decoded.name,
            role: decoded.role || 'student',
        };
    } catch {
        return null;
    }
}

/**
 * Initialize tRPC
 */
const t = initTRPC.context<TRPCContext>().create({
    errorFormatter({ shape, error }) {
        return {
            ...shape,
            data: {
                ...shape.data,
                zodError: error.cause instanceof Error ? error.cause.message : null,
            },
        };
    },
});

/**
 * Export reusable router and procedure helpers
 */
export const router = t.router;
export const publicProcedure = t.procedure;
export const middleware = t.middleware;

/**
 * Auth middleware - requires authenticated user
 */
const isAuthed = middleware(({ ctx, next }) => {
    if (!ctx.user) {
        throw new TRPCError({
            code: 'UNAUTHORIZED',
            message: 'You must be logged in to access this resource',
        });
    }
    return next({
        ctx: {
            ...ctx,
            user: ctx.user, // user is now non-null
        },
    });
});

/**
 * Protected procedure - requires authentication
 */
export const protectedProcedure = publicProcedure.use(isAuthed);

/**
 * Role-based middleware
 */
const hasRole = (allowedRoles: Array<'student' | 'teacher' | 'admin'>) =>
    middleware(({ ctx, next }) => {
        if (!ctx.user) {
            throw new TRPCError({ code: 'UNAUTHORIZED' });
        }
        if (!allowedRoles.includes(ctx.user.role)) {
            throw new TRPCError({
                code: 'FORBIDDEN',
                message: `This action requires one of these roles: ${allowedRoles.join(', ')}`,
            });
        }
        return next({
            ctx: {
                ...ctx,
                user: ctx.user, // user is now guaranteed non-null
            },
        });
    });

/**
 * Teacher-only procedure
 */
export const teacherProcedure = protectedProcedure.use(hasRole(['teacher', 'admin']));

/**
 * Admin-only procedure
 */
export const adminProcedure = protectedProcedure.use(hasRole(['admin']));
