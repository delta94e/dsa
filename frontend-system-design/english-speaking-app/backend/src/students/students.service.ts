import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import {
    StudentProfile,
    CreateStudentDto,
    User,
} from '../types';

@Injectable()
export class StudentsService {
    // In-memory storage (use database in production)
    private students = new Map<string, StudentProfile>();
    private users = new Map<string, User>();

    async registerStudent(dto: CreateStudentDto): Promise<{ user: User; student: StudentProfile }> {
        const userId = uuidv4();

        const user: User = {
            id: userId,
            email: dto.email,
            name: dto.name,
            avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(dto.name)}&background=random`,
            nativeLanguage: 'Vietnamese',
            learningLevel: 'A1',
            country: 'Vietnam',
            countryFlag: '🇻🇳',
            role: 'student',
        };

        const student: StudentProfile = {
            userId,
            school: dto.school,
            grade: dto.grade,
            className: dto.className,
            parentName: dto.parentName,
            parentPhone: dto.parentPhone,
            parentEmail: dto.parentEmail,
            createdAt: new Date(),
        };

        this.users.set(userId, user);
        this.students.set(userId, student);

        return { user, student };
    }

    async getStudentByUserId(userId: string): Promise<StudentProfile | null> {
        return this.students.get(userId) || null;
    }

    getUserById(userId: string): User | null {
        return this.users.get(userId) || null;
    }

    async getAllStudents(): Promise<Array<{ user: User; student: StudentProfile }>> {
        const all: Array<{ user: User; student: StudentProfile }> = [];

        for (const [userId, student] of this.students.entries()) {
            const user = this.users.get(userId);
            if (user) {
                all.push({ user, student });
            }
        }

        return all;
    }
}
