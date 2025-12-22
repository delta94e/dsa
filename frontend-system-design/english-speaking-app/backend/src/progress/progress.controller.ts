import {
    Controller,
    Get,
    Post,
    Param,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ProgressService } from './progress.service';

@ApiTags('progress')
@Controller('progress')
export class ProgressController {
    constructor(private readonly progressService: ProgressService) { }

    @Get('levels')
    @ApiOperation({ summary: 'Get all levels info' })
    getAllLevels() {
        return this.progressService.getAllLevels();
    }

    @Get('leaderboard')
    @ApiOperation({ summary: 'Get XP leaderboard' })
    async getLeaderboard() {
        return this.progressService.getLeaderboard(10);
    }

    @Get(':userId')
    @ApiOperation({ summary: 'Get user progress' })
    async getProgress(@Param('userId') userId: string) {
        const progress = await this.progressService.getOrCreateProgress(userId);
        const levelInfo = this.progressService.getLevelInfo(progress.level);
        const nextLevelInfo = this.progressService.getLevelInfo(progress.level + 1);

        return {
            ...progress,
            levelInfo,
            nextLevelInfo,
            xpToNextLevel: nextLevelInfo ? nextLevelInfo.totalXp - progress.totalXp : 0,
        };
    }

    @Post(':userId/check-in')
    @ApiOperation({ summary: 'Daily check-in' })
    async dailyCheckIn(@Param('userId') userId: string) {
        const result = await this.progressService.dailyCheckIn(userId);

        if (!result.success) {
            throw new HttpException(result.error || 'Check-in failed', HttpStatus.BAD_REQUEST);
        }

        const levelInfo = this.progressService.getLevelInfo(result.progress.level);

        return {
            success: true,
            xpGained: result.xpGained,
            streak: result.streak,
            progress: result.progress,
            levelInfo,
        };
    }

    @Post(':userId/add-xp/:amount')
    @ApiOperation({ summary: 'Add XP to user (admin/testing)' })
    async addXp(
        @Param('userId') userId: string,
        @Param('amount') amount: string,
    ) {
        const xpAmount = parseInt(amount, 10);
        if (isNaN(xpAmount) || xpAmount <= 0) {
            throw new HttpException('Invalid XP amount', HttpStatus.BAD_REQUEST);
        }

        const result = await this.progressService.addXp(userId, xpAmount);

        return {
            xpAdded: xpAmount,
            leveledUp: result.leveledUp,
            newLevel: result.newLevel,
            progress: result.progress,
        };
    }
}
