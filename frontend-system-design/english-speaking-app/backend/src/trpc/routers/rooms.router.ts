import { z } from 'zod';
import { router, publicProcedure, protectedProcedure } from '../trpc';
import { RoomsService } from '../../rooms/rooms.service';
import { TRPCError } from '@trpc/server';

// Input validation schemas
const levelSchema = z.enum(['A1', 'A2', 'B1', 'B2', 'C1', 'C2']);

const getRoomsInput = z.object({
    level: levelSchema.optional(),
    search: z.string().optional(),
});

const getRoomInput = z.object({
    id: z.string().uuid(),
});

const createRoomInput = z.object({
    name: z.string().min(1).max(100),
    topic: z.string().min(1).max(500),
    level: levelSchema,
    type: z.enum(['public', 'private']),
    maxParticipants: z.number().min(2).max(20).default(8),
    tags: z.array(z.string()).max(5).default([]),
    password: z.string().optional(),
});

const joinRoomInput = z.object({
    roomId: z.string().uuid(),
    password: z.string().optional(),
});

/**
 * Rooms Router - handles all room-related procedures
 */
export const createRoomsRouter = (roomsService: RoomsService) => {
    return router({
        /**
         * Get all rooms with optional filters
         */
        list: publicProcedure
            .input(getRoomsInput)
            .query(({ input }) => {
                const rooms = roomsService.getAllRooms(
                    input.level as any,
                    input.search
                );
                return rooms;
            }),

        /**
         * Get a single room by ID
         */
        get: publicProcedure
            .input(getRoomInput)
            .query(({ input }) => {
                const room = roomsService.getRoom(input.id);
                if (!room) {
                    throw new TRPCError({
                        code: 'NOT_FOUND',
                        message: 'Room not found',
                    });
                }
                return room;
            }),

        /**
         * Create a new room (requires auth)
         */
        create: protectedProcedure
            .input(createRoomInput)
            .mutation(({ input, ctx }) => {
                const room = roomsService.createRoom(
                    {
                        name: input.name,
                        topic: input.topic,
                        level: input.level as any,
                        type: input.type,
                        maxParticipants: input.maxParticipants,
                        tags: input.tags,
                        password: input.password,
                    },
                    ctx.user.id
                );
                return room;
            }),

        /**
         * Verify room password
         */
        verifyPassword: publicProcedure
            .input(joinRoomInput)
            .query(({ input, ctx }) => {
                const result = roomsService.verifyRoomPassword(
                    input.roomId,
                    input.password,
                    ctx.user?.id
                );
                return result;
            }),

        /**
         * Check level requirement for joining room
         */
        checkLevelRequirement: protectedProcedure
            .input(z.object({
                roomId: z.string().uuid(),
                userLevel: z.number().min(1),
            }))
            .query(({ input }) => {
                return roomsService.checkLevelRequirement(
                    input.roomId,
                    input.userLevel
                );
            }),
    });
};

export type RoomsRouter = ReturnType<typeof createRoomsRouter>;
