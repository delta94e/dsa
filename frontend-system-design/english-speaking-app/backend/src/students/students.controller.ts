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
import { StudentsService } from './students.service';
import { CreateStudentDto } from '../types';

@ApiTags('students')
@Controller('students')
export class StudentsController {
    constructor(private readonly studentsService: StudentsService) { }

    @Post('register')
    @ApiOperation({ summary: 'Register a new student (via invite link)' })
    async registerStudent(@Body() dto: CreateStudentDto) {
        // TODO: Validate invite code with ClassroomsService
        const result = await this.studentsService.registerStudent(dto);
        return {
            message: 'Student registered successfully. Waiting for teacher approval.',
            user: result.user,
            student: result.student,
        };
    }

    @Get(':userId')
    @ApiOperation({ summary: 'Get student profile by user ID' })
    async getStudent(@Param('userId') userId: string) {
        const student = await this.studentsService.getStudentByUserId(userId);
        if (!student) {
            throw new HttpException('Student not found', HttpStatus.NOT_FOUND);
        }
        const user = this.studentsService.getUserById(userId);
        return { user, student };
    }
}
