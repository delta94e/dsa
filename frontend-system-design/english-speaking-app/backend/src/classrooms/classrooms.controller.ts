import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Req,
    HttpException,
    HttpStatus,
    UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Request } from 'express';
import { ClassroomsService } from './classrooms.service';
import { CreateClassroomDto } from '../types';

@ApiTags('classrooms')
@Controller('classrooms')
export class ClassroomsController {
    constructor(private readonly classroomsService: ClassroomsService) { }

    @Post()
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create a new classroom (teacher only)' })
    async createClassroom(
        @Body() dto: CreateClassroomDto,
        @Req() req: Request,
    ) {
        const teacherId = (req.user as any)?.id;
        if (!teacherId) {
            throw new HttpException('Authentication required', HttpStatus.UNAUTHORIZED);
        }
        const classroom = await this.classroomsService.createClassroom(dto, teacherId);
        return {
            message: 'Classroom created successfully',
            classroom,
            inviteLink: `http://localhost:3001/join/${classroom.inviteCode}`,
        };
    }

    @Get('teacher/:teacherId')
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get all classrooms for a teacher' })
    async getTeacherClassrooms(@Param('teacherId') teacherId: string) {
        return this.classroomsService.getTeacherClassrooms(teacherId);
    }

    @Get('student/:studentId')
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get all classrooms for a student' })
    async getStudentClassrooms(@Param('studentId') studentId: string) {
        return this.classroomsService.getStudentClassrooms(studentId);
    }

    @Get('invite/:inviteCode')
    @ApiOperation({ summary: 'Validate invite code and get classroom info (public)' })
    async validateInvite(@Param('inviteCode') inviteCode: string) {
        const result = await this.classroomsService.validateInviteCode(inviteCode);
        if (!result.valid) {
            throw new HttpException(result.error || 'Invalid invite', HttpStatus.BAD_REQUEST);
        }
        return {
            valid: true,
            classroom: result.classroom,
        };
    }

    @Get(':id')
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get classroom by ID' })
    async getClassroom(@Param('id') id: string) {
        const classroom = await this.classroomsService.getClassroomById(id);
        if (!classroom) {
            throw new HttpException('Classroom not found', HttpStatus.NOT_FOUND);
        }
        return classroom;
    }

    @Post(':id/regenerate-invite')
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Regenerate invite code (teacher only)' })
    async regenerateInvite(
        @Param('id') id: string,
        @Req() req: Request,
    ) {
        const teacherId = (req.user as any)?.id;
        const classroom = await this.classroomsService.regenerateInviteCode(id, teacherId);
        if (!classroom) {
            throw new HttpException('Classroom not found or unauthorized', HttpStatus.NOT_FOUND);
        }
        return {
            message: 'Invite code regenerated',
            inviteCode: classroom.inviteCode,
            inviteExpiry: classroom.inviteExpiry,
            inviteLink: `http://localhost:3001/join/${classroom.inviteCode}`,
        };
    }

    @Get(':id/enrollments')
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get enrollments for a classroom' })
    async getEnrollments(@Param('id') id: string) {
        return this.classroomsService.getEnrollmentsByClassroom(id);
    }

    @Get(':id/enrollments/pending')
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get pending enrollments for a classroom' })
    async getPendingEnrollments(@Param('id') id: string) {
        return this.classroomsService.getPendingEnrollments(id);
    }

    @Post(':id/enroll')
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Apply to enroll in a classroom' })
    async applyToEnroll(
        @Param('id') id: string,
        @Req() req: Request,
    ) {
        const studentId = (req.user as any)?.id;
        const classroom = await this.classroomsService.getClassroomById(id);
        if (!classroom) {
            throw new HttpException('Classroom not found', HttpStatus.NOT_FOUND);
        }
        const enrollment = await this.classroomsService.applyToClassroom(id, studentId);
        return {
            message: 'Enrollment application submitted. Waiting for teacher approval.',
            enrollment,
        };
    }

    @Post(':id/approve-student/:studentId')
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Approve a student enrollment (teacher only)' })
    async approveStudent(
        @Param('id') id: string,
        @Param('studentId') studentId: string,
    ) {
        const enrollment = await this.classroomsService.approveEnrollment(id, studentId);
        if (!enrollment) {
            throw new HttpException('Enrollment not found', HttpStatus.NOT_FOUND);
        }
        return {
            message: 'Student approved',
            enrollment,
        };
    }

    @Post(':id/reject-student/:studentId')
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Reject a student enrollment (teacher only)' })
    async rejectStudent(
        @Param('id') id: string,
        @Param('studentId') studentId: string,
    ) {
        const enrollment = await this.classroomsService.rejectEnrollment(id, studentId);
        if (!enrollment) {
            throw new HttpException('Enrollment not found', HttpStatus.NOT_FOUND);
        }
        return {
            message: 'Student rejected',
            enrollment,
        };
    }
}
