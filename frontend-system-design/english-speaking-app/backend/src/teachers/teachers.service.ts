import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import {
    TeacherProfile,
    CreateTeacherDto,
    TeacherStatus,
    User,
} from '../types';

@Injectable()
export class TeachersService {
    // In-memory storage (use database in production)
    private teachers = new Map<string, TeacherProfile>();
    private users = new Map<string, User>();

    async registerTeacher(dto: CreateTeacherDto): Promise<{ user: User; teacher: TeacherProfile }> {
        // Create user
        const userId = uuidv4();
        const user: User = {
            id: userId,
            email: dto.email,
            name: dto.name,
            avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(dto.name)}&background=random`,
            nativeLanguage: 'Vietnamese',
            learningLevel: 'B1',
            country: 'Vietnam',
            countryFlag: '🇻🇳',
            role: 'teacher',
        };

        // Create teacher profile with pending status
        const teacher: TeacherProfile = {
            userId,
            school: dto.school,
            subjects: dto.subjects,
            grades: dto.grades,
            phoneNumber: dto.phoneNumber,
            status: 'pending',
            createdAt: new Date(),
        };

        this.users.set(userId, user);
        this.teachers.set(userId, teacher);

        return { user, teacher };
    }

    async getTeacherByUserId(userId: string): Promise<TeacherProfile | null> {
        return this.teachers.get(userId) || null;
    }

    async getPendingTeachers(): Promise<Array<{ user: User; teacher: TeacherProfile }>> {
        const pending: Array<{ user: User; teacher: TeacherProfile }> = [];

        for (const [userId, teacher] of this.teachers.entries()) {
            if (teacher.status === 'pending') {
                const user = this.users.get(userId);
                if (user) {
                    pending.push({ user, teacher });
                }
            }
        }

        return pending;
    }

    async approveTeacher(userId: string, adminId: string): Promise<TeacherProfile | null> {
        const teacher = this.teachers.get(userId);
        if (!teacher) return null;

        teacher.status = 'approved';
        teacher.approvedBy = adminId;
        teacher.approvedAt = new Date();

        return teacher;
    }

    async rejectTeacher(userId: string): Promise<TeacherProfile | null> {
        const teacher = this.teachers.get(userId);
        if (!teacher) return null;

        teacher.status = 'rejected';
        return teacher;
    }

    async getAllTeachers(): Promise<Array<{ user: User; teacher: TeacherProfile }>> {
        const all: Array<{ user: User; teacher: TeacherProfile }> = [];

        for (const [userId, teacher] of this.teachers.entries()) {
            const user = this.users.get(userId);
            if (user) {
                all.push({ user, teacher });
            }
        }

        return all;
    }

    async getApprovedTeachers(): Promise<Array<{ user: User; teacher: TeacherProfile }>> {
        const approved: Array<{ user: User; teacher: TeacherProfile }> = [];

        for (const [userId, teacher] of this.teachers.entries()) {
            if (teacher.status === 'approved') {
                const user = this.users.get(userId);
                if (user) {
                    approved.push({ user, teacher });
                }
            }
        }

        return approved;
    }

    getUserById(userId: string): User | null {
        return this.users.get(userId) || null;
    }
}
