import { z } from 'zod';
import { router, publicProcedure, protectedProcedure, teacherProcedure } from '../trpc';
import { ClassroomsService } from '../../classrooms/classrooms.service';
import { TRPCError } from '@trpc/server';

// Input schemas - match CreateClassroomDto
const createClassroomInput = z.object({
    name: z.string().min(1).max(100),
    subject: z.string().min(1).max(100),
    grade: z.string().default(''),
    school: z.string().default(''),
    maxStudents: z.number().min(1).max(100).optional(),
});

const getClassroomInput = z.object({
    id: z.string().uuid(),
});

const enrollInput = z.object({
    classroomId: z.string().uuid(),
});

const approveRejectInput = z.object({
    classroomId: z.string().uuid(),
    studentId: z.string(),
});

const validateInviteInput = z.object({
    inviteCode: z.string().min(1),
});

/**
 * Classrooms Router
 */
export const createClassroomsRouter = (classroomsService: ClassroomsService) => {
    return router({
        /**
         * Get teacher's classrooms
         */
        listByTeacher: protectedProcedure
            .query(async ({ ctx }) => {
                return classroomsService.getTeacherClassrooms(ctx.user.id);
            }),

        /**
         * Get student's classrooms
         */
        listByStudent: protectedProcedure
            .query(async ({ ctx }) => {
                return classroomsService.getStudentClassrooms(ctx.user.id);
            }),

        /**
         * Get classroom by ID
         */
        get: protectedProcedure
            .input(getClassroomInput)
            .query(async ({ input }) => {
                const classroom = await classroomsService.getClassroomById(input.id);
                if (!classroom) {
                    throw new TRPCError({ code: 'NOT_FOUND', message: 'Classroom not found' });
                }
                return classroom;
            }),

        /**
         * Create classroom (teacher only)
         */
        create: teacherProcedure
            .input(createClassroomInput)
            .mutation(async ({ input, ctx }) => {
                return classroomsService.createClassroom(input, ctx.user.id);
            }),

        /**
         * Validate invite code
         */
        validateInvite: publicProcedure
            .input(validateInviteInput)
            .query(async ({ input }) => {
                return classroomsService.validateInviteCode(input.inviteCode);
            }),

        /**
         * Enroll in classroom (student)
         */
        enroll: protectedProcedure
            .input(enrollInput)
            .mutation(async ({ input, ctx }) => {
                return classroomsService.applyToClassroom(input.classroomId, ctx.user.id);
            }),

        /**
         * Approve enrollment (teacher)
         */
        approveStudent: teacherProcedure
            .input(approveRejectInput)
            .mutation(async ({ input }) => {
                const result = await classroomsService.approveEnrollment(input.classroomId, input.studentId);
                if (!result) {
                    throw new TRPCError({ code: 'NOT_FOUND', message: 'Enrollment not found' });
                }
                return result;
            }),

        /**
         * Reject enrollment (teacher)
         */
        rejectStudent: teacherProcedure
            .input(approveRejectInput)
            .mutation(async ({ input }) => {
                const result = await classroomsService.rejectEnrollment(input.classroomId, input.studentId);
                if (!result) {
                    throw new TRPCError({ code: 'NOT_FOUND', message: 'Enrollment not found' });
                }
                return result;
            }),

        /**
         * Get pending enrollments for classroom
         */
        getPendingEnrollments: teacherProcedure
            .input(getClassroomInput)
            .query(async ({ input }) => {
                return classroomsService.getPendingEnrollments(input.id);
            }),

        /**
         * Regenerate invite code
         */
        regenerateInvite: teacherProcedure
            .input(getClassroomInput)
            .mutation(async ({ input, ctx }) => {
                const result = await classroomsService.regenerateInviteCode(input.id, ctx.user.id);
                if (!result) {
                    throw new TRPCError({ code: 'FORBIDDEN', message: 'Not authorized to regenerate invite' });
                }
                return result;
            }),
    });
};

export type ClassroomsRouter = ReturnType<typeof createClassroomsRouter>;
