import { router } from './trpc';
import { createRoomsRouter } from './routers/rooms.router';
import { createClassroomsRouter } from './routers/classrooms.router';
import { createAuthRouter } from './routers/auth.router';
import { createAIRouter } from './routers/ai.router';
import { createQuestsRouter } from './routers/quests.router';
import { RoomsService } from '../rooms/rooms.service';
import { ClassroomsService } from '../classrooms/classrooms.service';
import { AIService } from '../ai/ai.service';
import { QuestsService } from '../quests/quests.service';

/**
 * Services interface for dependency injection
 */
export interface TRPCServices {
    roomsService: RoomsService;
    classroomsService: ClassroomsService;
    aiService: AIService;
    questsService: QuestsService;
}

/**
 * Create the root app router with all sub-routers
 */
export function createAppRouter(services: TRPCServices) {
    return router({
        rooms: createRoomsRouter(services.roomsService),
        classrooms: createClassroomsRouter(services.classroomsService),
        auth: createAuthRouter(),
        ai: createAIRouter(services.aiService),
        quests: createQuestsRouter(services.questsService),
    });
}

/**
 * Export the AppRouter type for the frontend
 * This is the key to tRPC's end-to-end type safety!
 */
export type AppRouter = ReturnType<typeof createAppRouter>;
