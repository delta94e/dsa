'use client';

import { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useRoomSocket } from '@/features/rooms/hooks/useRoomSocket';
import { useWebRTC } from '@/features/rooms/hooks/useWebRTC';
import { useMediaStore } from '@/features/rooms/stores/mediaStore';
import { useReactions, ReactionType } from '@/features/rooms';
import { useAuthStore } from '@/stores/authStore';
import { User, RoomParticipant, Level } from '@/types';
import {
    playLeaveSound,
    playMuteSound,
    playUnmuteSound,
    playUserJoinedSound,
    playUserLeftSound
} from '@/shared/utils/sounds';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';

// ═══════════════════════════════════════════════════════════════
// Types
// ═══════════════════════════════════════════════════════════════
export interface Classroom {
    id: string;
    name: string;
    subject: string;
    grade: string;
    school: string;
    teacherId: string;
    maxStudents: number;
    isActive: boolean;
}

interface UseClassroomSessionOptions {
    classroomId: string;
}

interface UseClassroomSessionReturn {
    // Classroom data
    classroom: Classroom | null;
    isLoading: boolean;
    error: string | null;

    // Connection
    isConnected: boolean;
    participants: RoomParticipant[];
    remoteStreams: Map<string, MediaStream>;

    // User
    currentUser: User;
    isTeacher: boolean;
    isMuted: boolean;
    isHandRaised: boolean;

    // Actions
    handleMuteToggle: () => void;
    handleLeave: () => void;
    handleRaiseHand: () => void;
    handleReaction: (type: ReactionType) => void;

    // Reactions
    reactions: ReturnType<typeof useReactions>['reactions'];
}

// ═══════════════════════════════════════════════════════════════
// Hook Implementation
// ═══════════════════════════════════════════════════════════════
export function useClassroomSession({ classroomId }: UseClassroomSessionOptions): UseClassroomSessionReturn {
    const router = useRouter();
    const { user: authUser } = useAuthStore();

    const [classroom, setClassroom] = useState<Classroom | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isHandRaised, setIsHandRaised] = useState(false);

    const signalHandlerRef = useRef<(from: string, type: string, data: unknown) => void>();

    // Current user data
    const currentUser: User = useMemo(() => ({
        id: authUser?.id || `guest-${Date.now()}`,
        name: authUser?.name || 'Guest',
        avatarUrl: authUser?.avatarUrl || 'https://i.pravatar.cc/150?u=guest',
        nativeLanguage: 'Vietnamese',
        learningLevel: 'B1' as Level,
        country: 'Vietnam',
        countryFlag: '🇻🇳',
    }), [authUser]);

    const isTeacher = useMemo(() => classroom?.teacherId === currentUser.id, [classroom, currentUser]);

    const { isMuted, toggleMute, initMedia, cleanup, localStream } = useMediaStore();
    const { reactions, addReaction } = useReactions();

    // Socket connection
    const {
        isConnected,
        participants,
        sendSignal,
        sendMuteToggle,
        leaveRoom,
        sendRaiseHand,
        sendReaction,
    } = useRoomSocket({
        roomId: classroomId,
        user: currentUser,
        onSignal: (from, type, data) => signalHandlerRef.current?.(from, type, data),
        onUserJoined: (user) => {
            console.log('User joined classroom:', user.name);
            playUserJoinedSound();
        },
        onUserLeft: (userId) => {
            console.log('User left classroom:', userId);
            playUserLeftSound();
        },
        onHandRaised: (userId, userName, raised) => {
            if (raised) addReaction(userId, userName, 'raise_hand');
        },
        onReaction: (userId, userName, type) => addReaction(userId, userName, type as ReactionType),
    });

    // WebRTC
    const { remoteStreams, handleSignal } = useWebRTC({
        localStream,
        participants,
        currentUserId: currentUser.id,
        onSignal: sendSignal,
    });

    // Set signal handler ref
    useEffect(() => {
        signalHandlerRef.current = handleSignal;
    }, [handleSignal]);

    // Fetch classroom data
    useEffect(() => {
        const fetchClassroom = async () => {
            try {
                const response = await fetch(`${API_URL}/classrooms/${classroomId}`);
                if (!response.ok) throw new Error('Classroom not found');
                setClassroom(await response.json());
            } catch (err) {
                setError('Không tìm thấy lớp học');
            } finally {
                setIsLoading(false);
            }
        };
        fetchClassroom();
    }, [classroomId]);

    // Initialize media
    useEffect(() => {
        initMedia();
        return () => cleanup();
    }, [initMedia, cleanup]);

    // Handlers
    const handleMuteToggle = useCallback(() => {
        if (isMuted) playUnmuteSound();
        else playMuteSound();
        toggleMute();
        sendMuteToggle(!isMuted);
    }, [toggleMute, sendMuteToggle, isMuted]);

    const handleLeave = useCallback(() => {
        playLeaveSound();
        leaveRoom();
        cleanup();
        router.push(isTeacher ? '/teacher' : '/student');
    }, [leaveRoom, cleanup, router, isTeacher]);

    const handleRaiseHand = useCallback(() => {
        const newState = !isHandRaised;
        setIsHandRaised(newState);
        sendRaiseHand(newState);
    }, [isHandRaised, sendRaiseHand]);

    const handleReaction = useCallback((type: ReactionType) => {
        sendReaction(type);
        addReaction(currentUser.id, currentUser.name, type);
    }, [sendReaction, addReaction, currentUser]);

    return {
        classroom,
        isLoading,
        error,
        isConnected,
        participants,
        remoteStreams,
        currentUser,
        isTeacher,
        isMuted,
        isHandRaised,
        handleMuteToggle,
        handleLeave,
        handleRaiseHand,
        handleReaction,
        reactions,
    };
}
