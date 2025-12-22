import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Query,
    Req,
    NotFoundException,
    UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { Request } from 'express';
import { RoomsService } from './rooms.service';
import { CreateRoomDto, Level, RoomResponse } from '../types';

@ApiTags('rooms')
@Controller('rooms')
export class RoomsController {
    constructor(private readonly roomsService: RoomsService) { }

    @Get()
    @ApiOperation({ summary: 'Get all rooms' })
    @ApiQuery({ name: 'level', required: false, enum: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] })
    @ApiQuery({ name: 'search', required: false })
    getAllRooms(
        @Query('level') level?: Level,
        @Query('search') search?: string,
    ): RoomResponse[] {
        return this.roomsService.getAllRooms(level, search);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get room by ID' })
    getRoom(@Param('id') id: string): RoomResponse {
        const room = this.roomsService.getRoom(id);
        if (!room) {
            throw new NotFoundException('Room not found');
        }
        return room;
    }

    @Post()
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create a new room (requires auth)' })
    createRoom(@Body() dto: CreateRoomDto, @Req() req: Request): RoomResponse {
        const userId = (req.user as any)?.id || 'anonymous';
        const room = this.roomsService.createRoom(dto, userId);
        return this.roomsService.getRoom(room.id)!;
    }

    @Get(':id/check-level')
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Check if user level is sufficient for room (requires auth)' })
    @ApiQuery({ name: 'userLevel', required: true })
    checkLevelRequirement(
        @Param('id') id: string,
        @Query('userLevel') userLevel: string,
    ) {
        return this.roomsService.checkLevelRequirement(id, parseInt(userLevel, 10));
    }
}
