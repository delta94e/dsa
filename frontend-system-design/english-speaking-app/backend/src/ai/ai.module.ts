import { Module } from '@nestjs/common';
import { AIController } from './ai.controller';
import { AIService } from './ai.service';
import { RateLimitService } from './rate-limit.service';
import { AccountBanGuard } from './account-ban.guard';

@Module({
    controllers: [AIController],
    providers: [AIService, RateLimitService, AccountBanGuard],
    exports: [AIService, RateLimitService, AccountBanGuard],
})
export class AIModule { }

