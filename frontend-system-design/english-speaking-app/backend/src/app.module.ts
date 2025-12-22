import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { RoomsModule } from './rooms/rooms.module';
import { GatewayModule } from './gateway/gateway.module';
import { AIModule } from './ai/ai.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AppCacheModule } from './cache/cache.module';
import { FeatureFlagsModule } from './feature-flags/feature-flags.module';
import { AccountBanGuard } from './ai/account-ban.guard';
// Classroom system modules
import { TeachersModule } from './teachers/teachers.module';
import { StudentsModule } from './students/students.module';
import { ClassroomsModule } from './classrooms/classrooms.module';
import { AdminModule } from './admin/admin.module';
// XP & Level system modules
import { ProgressModule } from './progress/progress.module';
import { QuestsModule } from './quests/quests.module';
// tRPC module
import { TrpcModule } from './trpc';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        // GraphQL Module with Apollo Driver
        GraphQLModule.forRoot<ApolloDriverConfig>({
            driver: ApolloDriver,
            autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
            sortSchema: true,
            playground: true,
            introspection: true,
            context: ({ req, res }: { req: Request; res: Response }) => ({ req, res }),
        }),
        AppCacheModule,
        RoomsModule,
        GatewayModule,
        AIModule,
        AuthModule,
        UsersModule,
        FeatureFlagsModule,
        // Classroom system
        TeachersModule,
        StudentsModule,
        ClassroomsModule,
        AdminModule,
        // XP & Level system
        ProgressModule,
        QuestsModule,
        // tRPC
        TrpcModule,
    ],
    providers: [
        {
            provide: APP_GUARD,
            useClass: AccountBanGuard,
        },
    ],
})
export class AppModule { }
