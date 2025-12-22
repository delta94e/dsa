'use client';

import { useEffect, useState, useCallback } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';

// ═══════════════════════════════════════════════════════════════
// Types
// ═══════════════════════════════════════════════════════════════
export type TeacherStatus = 'pending' | 'approved' | 'rejected';

export interface Teacher {
    user: {
        id: string;
        name: string;
        email: string;
    };
    teacher: {
        school: string;
        subjects: string[];
        grades: string[];
        phoneNumber: string;
        status: TeacherStatus;
        createdAt: string;
    };
}

interface UseTeachersReturn {
    teachers: Teacher[];
    isLoading: boolean;
    error: string | null;
    actionLoading: string | null;
    pendingCount: number;
    refetch: () => Promise<void>;
    approveTeacher: (userId: string) => Promise<void>;
    rejectTeacher: (userId: string) => Promise<void>;
    clearError: () => void;
}

// ═══════════════════════════════════════════════════════════════
// Hook Implementation
// ═══════════════════════════════════════════════════════════════
export function useTeachers(): UseTeachersReturn {
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    const fetchTeachers = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_URL}/admin/teachers`);
            if (!response.ok) throw new Error('Failed to fetch');
            const data = await response.json();
            setTeachers(data);
        } catch (err) {
            setError('Không thể tải danh sách giáo viên');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTeachers();
    }, [fetchTeachers]);

    const approveTeacher = useCallback(async (userId: string) => {
        setActionLoading(userId);
        try {
            const response = await fetch(`${API_URL}/admin/teachers/${userId}/approve`, {
                method: 'POST',
            });
            if (!response.ok) throw new Error('Failed to approve');
            await fetchTeachers();
        } catch (err) {
            setError('Không thể phê duyệt giáo viên');
        } finally {
            setActionLoading(null);
        }
    }, [fetchTeachers]);

    const rejectTeacher = useCallback(async (userId: string) => {
        setActionLoading(userId);
        try {
            const response = await fetch(`${API_URL}/admin/teachers/${userId}/reject`, {
                method: 'POST',
            });
            if (!response.ok) throw new Error('Failed to reject');
            await fetchTeachers();
        } catch (err) {
            setError('Không thể từ chối giáo viên');
        } finally {
            setActionLoading(null);
        }
    }, [fetchTeachers]);

    const clearError = useCallback(() => setError(null), []);

    const pendingCount = teachers.filter((t) => t.teacher.status === 'pending').length;

    return {
        teachers,
        isLoading,
        error,
        actionLoading,
        pendingCount,
        refetch: fetchTeachers,
        approveTeacher,
        rejectTeacher,
        clearError,
    };
}
