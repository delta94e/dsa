import {
    Controller,
    Get,
    Post,
    Param,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { TeachersService } from '../teachers/teachers.service';

@ApiTags('admin')
@Controller('admin')
export class AdminController {
    constructor(private readonly teachersService: TeachersService) { }

    @Get('teachers/pending')
    @ApiOperation({ summary: 'Get all pending teacher registrations' })
    async getPendingTeachers() {
        return this.teachersService.getPendingTeachers();
    }

    @Get('teachers')
    @ApiOperation({ summary: 'Get all teachers' })
    async getAllTeachers() {
        return this.teachersService.getAllTeachers();
    }

    @Post('teachers/:userId/approve')
    @ApiOperation({ summary: 'Approve a teacher registration' })
    async approveTeacher(@Param('userId') userId: string) {
        // TODO: Get admin ID from auth
        const adminId = 'admin-placeholder';
        const teacher = await this.teachersService.approveTeacher(userId, adminId);
        if (!teacher) {
            throw new HttpException('Teacher not found', HttpStatus.NOT_FOUND);
        }
        return {
            message: 'Teacher approved successfully',
            teacher,
        };
    }

    @Post('teachers/:userId/reject')
    @ApiOperation({ summary: 'Reject a teacher registration' })
    async rejectTeacher(@Param('userId') userId: string) {
        const teacher = await this.teachersService.rejectTeacher(userId);
        if (!teacher) {
            throw new HttpException('Teacher not found', HttpStatus.NOT_FOUND);
        }
        return {
            message: 'Teacher rejected',
            teacher,
        };
    }
}
