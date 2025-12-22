import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { TeachersService } from './teachers.service';
import { CreateTeacherDto } from '../types';

@ApiTags('teachers')
@Controller('teachers')
export class TeachersController {
    constructor(private readonly teachersService: TeachersService) { }

    @Post('register')
    @ApiOperation({ summary: 'Register a new teacher (pending approval)' })
    async registerTeacher(@Body() dto: CreateTeacherDto) {
        const result = await this.teachersService.registerTeacher(dto);
        return {
            message: 'Registration submitted. Waiting for admin approval.',
            user: result.user,
            teacher: result.teacher,
        };
    }

    @Get(':userId')
    @ApiOperation({ summary: 'Get teacher profile by user ID' })
    async getTeacher(@Param('userId') userId: string) {
        const teacher = await this.teachersService.getTeacherByUserId(userId);
        if (!teacher) {
            throw new HttpException('Teacher not found', HttpStatus.NOT_FOUND);
        }
        const user = this.teachersService.getUserById(userId);
        return { user, teacher };
    }

    @Get()
    @ApiOperation({ summary: 'Get all approved teachers' })
    async getApprovedTeachers() {
        return this.teachersService.getApprovedTeachers();
    }
}
