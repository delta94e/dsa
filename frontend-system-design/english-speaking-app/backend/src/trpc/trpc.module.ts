import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { createExpressMiddleware } from '@trpc/server/adapters/express';
import { createAppRouter } from './root';
import { createContext } from './trpc';
import { RoomsModule } from '../rooms/rooms.module';
import { ClassroomsModule } from '../classrooms/classrooms.module';
import { AIModule } from '../ai/ai.module';
import { QuestsModule } from '../quests/quests.module';
import { RoomsService } from '../rooms/rooms.service';
import { ClassroomsService } from '../classrooms/classrooms.service';
import { AIService } from '../ai/ai.service';
import { QuestsService } from '../quests/quests.service';

@Module({
    imports: [RoomsModule, ClassroomsModule, AIModule, QuestsModule],
})
export class TrpcModule implements NestModule {
    constructor(
        private readonly roomsService: RoomsService,
        private readonly classroomsService: ClassroomsService,
        private readonly aiService: AIService,
        private readonly questsService: QuestsService,
    ) { }

    configure(consumer: MiddlewareConsumer) {
        // Create the app router with injected services
        const appRouter = createAppRouter({
            roomsService: this.roomsService,
            classroomsService: this.classroomsService,
            aiService: this.aiService,
            questsService: this.questsService,
        });

        // Create tRPC Express middleware
        const trpcMiddleware = createExpressMiddleware({
            router: appRouter,
            createContext,
        });

        // Apply middleware to /trpc route
        consumer.apply(trpcMiddleware).forRoutes('/trpc');
    }
}
