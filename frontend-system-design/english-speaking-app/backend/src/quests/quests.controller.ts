import {
    Controller,
    Get,
    Post,
    Param,
    Query,
    Body,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { QuestsService } from './quests.service';
import { QuestType } from '../types';

@ApiTags('quests')
@Controller('quests')
export class QuestsController {
    constructor(private readonly questsService: QuestsService) { }

    @Get()
    @ApiOperation({ summary: 'Get all quests' })
    getQuests(@Query('type') type?: QuestType) {
        return this.questsService.getQuests(type);
    }

    @Get('user/:userId')
    @ApiOperation({ summary: 'Get user quest progress' })
    async getUserProgress(@Param('userId') userId: string) {
        const quests = this.questsService.getQuests();
        const progress = await this.questsService.getUserQuestProgress(userId);

        return quests.map(quest => {
            const questProgress = progress.find(p => p.questId === quest.id);
            return {
                ...quest,
                progress: questProgress?.progress || 0,
                completed: questProgress?.completed || false,
                completedAt: questProgress?.completedAt,
            };
        });
    }

    @Post('track')
    @ApiOperation({ summary: 'Track user activity for quests' })
    async trackActivity(
        @Body() body: {
            userId: string;
            activityType: 'message_sent' | 'room_joined' | 'room_created' | 'speaking_time';
            amount?: number;
        }
    ) {
        const results = await this.questsService.trackActivity(
            body.userId,
            body.activityType,
            body.amount || 1
        );

        return {
            tracked: true,
            completedQuests: results.filter(r => r.completed),
        };
    }

    @Post('reset/daily')
    @ApiOperation({ summary: 'Reset daily quests (admin)' })
    async resetDaily() {
        await this.questsService.resetDailyQuests();
        return { success: true, message: 'Daily quests reset' };
    }

    @Post('reset/weekly')
    @ApiOperation({ summary: 'Reset weekly quests (admin)' })
    async resetWeekly() {
        await this.questsService.resetWeeklyQuests();
        return { success: true, message: 'Weekly quests reset' };
    }
}
