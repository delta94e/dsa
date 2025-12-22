import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import {
    Classroom,
    CreateClassroomDto,
    ClassroomResponse,
    ClassroomEnrollment,
    EnrollmentStatus,
} from '../types';

@Injectable()
export class ClassroomsService {
    // In-memory storage (use database in production)
    private classrooms = new Map<string, Classroom>();
    private enrollments = new Map<string, ClassroomEnrollment[]>();

    private generateInviteCode(): string {
        // Generate 8-character alphanumeric code
        return Math.random().toString(36).substring(2, 10).toUpperCase();
    }

    async createClassroom(dto: CreateClassroomDto, teacherId: string): Promise<Classroom> {
        const id = uuidv4();
        const inviteCode = this.generateInviteCode();

        // Invite expires in 7 days
        const inviteExpiry = new Date();
        inviteExpiry.setDate(inviteExpiry.getDate() + 7);

        const classroom: Classroom = {
            id,
            name: dto.name,
            teacherId,
            subject: dto.subject,
            grade: dto.grade,
            school: dto.school,
            inviteCode,
            inviteExpiry,
            maxStudents: dto.maxStudents || 50,
            isActive: true,
            createdAt: new Date(),
        };

        this.classrooms.set(id, classroom);
        this.enrollments.set(id, []);

        return classroom;
    }

    async getClassroomById(id: string): Promise<Classroom | null> {
        return this.classrooms.get(id) || null;
    }

    async getClassroomByInviteCode(inviteCode: string): Promise<Classroom | null> {
        for (const classroom of this.classrooms.values()) {
            if (classroom.inviteCode === inviteCode) {
                return classroom;
            }
        }
        return null;
    }

    async validateInviteCode(inviteCode: string): Promise<{ valid: boolean; classroom?: Classroom; error?: string }> {
        const classroom = await this.getClassroomByInviteCode(inviteCode);

        if (!classroom) {
            return { valid: false, error: 'Invalid invite code' };
        }

        if (!classroom.isActive) {
            return { valid: false, error: 'Classroom is no longer active' };
        }

        if (new Date() > classroom.inviteExpiry) {
            return { valid: false, error: 'Invite link has expired' };
        }

        const enrollmentList = this.enrollments.get(classroom.id) || [];
        const approvedCount = enrollmentList.filter(e => e.status === 'approved').length;

        if (approvedCount >= classroom.maxStudents) {
            return { valid: false, error: 'Classroom is full' };
        }

        return { valid: true, classroom };
    }

    async getTeacherClassrooms(teacherId: string): Promise<ClassroomResponse[]> {
        const result: ClassroomResponse[] = [];

        for (const classroom of this.classrooms.values()) {
            if (classroom.teacherId === teacherId) {
                const enrollmentList = this.enrollments.get(classroom.id) || [];
                const studentCount = enrollmentList.filter(e => e.status === 'approved').length;

                result.push({
                    ...classroom,
                    studentCount,
                });
            }
        }

        return result;
    }

    async regenerateInviteCode(classroomId: string, teacherId: string): Promise<Classroom | null> {
        const classroom = this.classrooms.get(classroomId);
        if (!classroom || classroom.teacherId !== teacherId) {
            return null;
        }

        classroom.inviteCode = this.generateInviteCode();
        classroom.inviteExpiry = new Date();
        classroom.inviteExpiry.setDate(classroom.inviteExpiry.getDate() + 7);

        return classroom;
    }

    // Enrollment methods
    async applyToClassroom(classroomId: string, studentId: string): Promise<ClassroomEnrollment> {
        const id = uuidv4();
        const enrollment: ClassroomEnrollment = {
            id,
            classroomId,
            studentId,
            status: 'pending',
            appliedAt: new Date(),
        };

        const enrollmentList = this.enrollments.get(classroomId) || [];
        enrollmentList.push(enrollment);
        this.enrollments.set(classroomId, enrollmentList);

        return enrollment;
    }

    async getEnrollmentsByClassroom(classroomId: string): Promise<ClassroomEnrollment[]> {
        return this.enrollments.get(classroomId) || [];
    }

    async getPendingEnrollments(classroomId: string): Promise<ClassroomEnrollment[]> {
        const enrollmentList = this.enrollments.get(classroomId) || [];
        return enrollmentList.filter(e => e.status === 'pending');
    }

    async approveEnrollment(classroomId: string, studentId: string): Promise<ClassroomEnrollment | null> {
        const enrollmentList = this.enrollments.get(classroomId) || [];
        const enrollment = enrollmentList.find(e => e.studentId === studentId);

        if (!enrollment) return null;

        enrollment.status = 'approved';
        enrollment.approvedAt = new Date();

        return enrollment;
    }

    async rejectEnrollment(classroomId: string, studentId: string): Promise<ClassroomEnrollment | null> {
        const enrollmentList = this.enrollments.get(classroomId) || [];
        const enrollment = enrollmentList.find(e => e.studentId === studentId);

        if (!enrollment) return null;

        enrollment.status = 'rejected';
        return enrollment;
    }

    async getStudentClassrooms(studentId: string): Promise<ClassroomResponse[]> {
        const result: ClassroomResponse[] = [];

        for (const [classroomId, enrollmentList] of this.enrollments.entries()) {
            const enrollment = enrollmentList.find(e => e.studentId === studentId && e.status === 'approved');
            if (enrollment) {
                const classroom = this.classrooms.get(classroomId);
                if (classroom) {
                    const studentCount = enrollmentList.filter(e => e.status === 'approved').length;
                    result.push({
                        ...classroom,
                        studentCount,
                    });
                }
            }
        }

        return result;
    }
}
