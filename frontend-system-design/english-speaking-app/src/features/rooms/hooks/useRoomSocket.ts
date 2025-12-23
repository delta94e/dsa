'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { User, RoomParticipant } from '@/types';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3002';

// Socket event payloads
interface JoinedPayload {
    participants: RoomParticipant[];
}

interface UserJoinedPayload {
    user: RoomParticipant;
}

interface UserLeftPayload {
    userId: string;
}

interface MutePayload {
    userId: string;
    isMuted: boolean;
}

interface SpeakingPayload {
    userId: string;
    isSpeaking: boolean;
}

interface VideoPayload {
    userId: string;
    isVideoEnabled: boolean;
}

interface SignalPayload {
    from: string;
    type: string;
    data: unknown;
}

interface UseRoomSocketProps {
    roomId: string;
    user: User;
    onUserJoined?: (user: RoomParticipant) => void;
    onUserLeft?: (userId: string) => void;
    onParticipantMute?: (userId: string, isMuted: boolean) => void;
    onParticipantSpeaking?: (userId: string, isSpeaking: boolean) => void;
    onParticipantVideo?: (userId: string, isVideoEnabled: boolean) => void;
    onSignal?: (from: string, type: string, data: unknown) => void;
    onHandRaised?: (userId: string, userName: string, isRaised: boolean) => void;
    onReaction?: (userId: string, userName: string, type: string) => void;
    onPasswordRequired?: () => void; // Called when room requires password
    onPasswordError?: (error: string) => void; // Called when password is incorrect
    onWhiteboardToggled?: (isOpen: boolean, userId: string) => void; // Called when whiteboard state changes
    onWhiteboardStateOnJoin?: (isOpen: boolean) => void; // Called on join with current whiteboard state
}

export function useRoomSocket({
    roomId,
    user,
    onUserJoined,
    onUserLeft,
    onParticipantMute,
    onParticipantSpeaking,
    onParticipantVideo,
    onSignal,
    onHandRaised,
    onReaction,
    onPasswordRequired,
    onPasswordError,
    onWhiteboardToggled,
    onWhiteboardStateOnJoin,
}: UseRoomSocketProps) {
    const socketRef = useRef<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [participants, setParticipants] = useState<RoomParticipant[]>([]);
    const [passwordError, setPasswordError] = useState<string | null>(null);

    // Store callbacks in refs to avoid re-connecting on every render
    const callbacksRef = useRef({
        onUserJoined,
        onUserLeft,
        onParticipantMute,
        onParticipantSpeaking,
        onParticipantVideo,
        onSignal,
        onHandRaised,
        onReaction,
        onPasswordRequired,
        onPasswordError,
        onWhiteboardToggled,
        onWhiteboardStateOnJoin,
    });

    // Update refs when callbacks change
    useEffect(() => {
        callbacksRef.current = {
            onUserJoined,
            onUserLeft,
            onParticipantMute,
            onParticipantSpeaking,
            onParticipantVideo,
            onSignal,
            onHandRaised,
            onReaction,
            onPasswordRequired,
            onPasswordError,
            onWhiteboardToggled,
            onWhiteboardStateOnJoin,
        };
    });

    // Store user in ref to avoid re-connecting
    const userRef = useRef(user);
    useEffect(() => {
        userRef.current = user;
    }, [user]);

    // Connect to socket - only depends on roomId
    useEffect(() => {
        // Don't connect if already connected
        if (socketRef.current?.connected) {
            return;
        }

        const socket = io(SOCKET_URL, {
            transports: ['websocket'],
            autoConnect: true,
        });

        socketRef.current = socket;

        socket.on('connect', () => {
            console.log('Socket connected');
            setIsConnected(true);

            // Join room with current user
            socket.emit('join_room', { roomId, user: userRef.current });
        });

        socket.on('disconnect', () => {
            console.log('Socket disconnected');
            setIsConnected(false);
        });

        socket.on('joined', ({ participants: roomParticipants, isWhiteboardOpen }: JoinedPayload & { isWhiteboardOpen?: boolean }) => {
            console.log('Joined room with participants:', roomParticipants, 'whiteboard:', isWhiteboardOpen);
            setPasswordError(null); // Clear any previous errors
            setParticipants(roomParticipants);
            // Notify about whiteboard state on join
            if (isWhiteboardOpen !== undefined) {
                callbacksRef.current.onWhiteboardStateOnJoin?.(isWhiteboardOpen);
            }
        });

        // Handle password errors
        socket.on('error', ({ type, message }: { type?: string; message: string }) => {
            console.log('Socket error:', { type, message });
            if (type === 'password_required') {
                setPasswordError('password_required');
                callbacksRef.current.onPasswordRequired?.();
            } else if (type === 'invalid_password') {
                setPasswordError('invalid_password');
                callbacksRef.current.onPasswordError?.('Incorrect password');
            }
        });

        socket.on('user_joined', ({ user: newUser }: UserJoinedPayload) => {
            console.log('User joined:', newUser);
            setParticipants((prev) => [...prev, newUser]);
            callbacksRef.current.onUserJoined?.(newUser);
        });

        socket.on('user_left', ({ userId }: UserLeftPayload) => {
            console.log('User left:', userId);
            setParticipants((prev) => prev.filter((p) => p.id !== userId));
            callbacksRef.current.onUserLeft?.(userId);
        });

        socket.on('participant_mute', ({ userId, isMuted }: MutePayload) => {
            setParticipants((prev) =>
                prev.map((p) => (p.id === userId ? { ...p, isMuted } : p))
            );
            callbacksRef.current.onParticipantMute?.(userId, isMuted);
        });

        socket.on('participant_speaking', ({ userId, isSpeaking }: SpeakingPayload) => {
            setParticipants((prev) =>
                prev.map((p) => (p.id === userId ? { ...p, isSpeaking } : p))
            );
            callbacksRef.current.onParticipantSpeaking?.(userId, isSpeaking);
        });

        socket.on('participant_hand_raised', ({ userId, userName, isRaised }: { userId: string; userName: string; isRaised: boolean }) => {
            console.log(`${userName} ${isRaised ? 'raised' : 'lowered'} hand`);
            setParticipants((prev) =>
                prev.map((p) => (p.id === userId ? { ...p, isHandRaised: isRaised } : p))
            );
            callbacksRef.current.onHandRaised?.(userId, userName, isRaised);
        });

        socket.on('reaction', ({ userId, userName, type }: { userId: string; userName: string; type: string }) => {
            console.log(`${userName} reacted with ${type}`);
            callbacksRef.current.onReaction?.(userId, userName, type);
        });

        socket.on('participant_video', ({ userId, isVideoEnabled }: VideoPayload) => {
            console.log(`User ${userId} video: ${isVideoEnabled}`);
            setParticipants((prev) =>
                prev.map((p) => (p.id === userId ? { ...p, isVideoEnabled } : p))
            );
            callbacksRef.current.onParticipantVideo?.(userId, isVideoEnabled);
        });

        socket.on('signal', ({ from, type, data }: SignalPayload) => {
            console.log('Signal received:', { from, type });
            callbacksRef.current.onSignal?.(from, type, data);
        });

        // Whiteboard toggle sync
        socket.on('whiteboard:toggled', ({ isOpen, userId }: { isOpen: boolean; userId: string }) => {
            console.log(`Whiteboard ${isOpen ? 'opened' : 'closed'} by ${userId}`);
            callbacksRef.current.onWhiteboardToggled?.(isOpen, userId);
        });

        return () => {
            socket.emit('leave_room', roomId);
            socket.disconnect();
            socketRef.current = null;
        };
    }, [roomId]); // Only reconnect when roomId changes

    // Send signal to specific user
    const sendSignal = useCallback(
        (targetUserId: string, type: 'offer' | 'answer' | 'ice-candidate', data: unknown) => {
            socketRef.current?.emit('signal', {
                roomId,
                targetUserId,
                type,
                data,
            });
        },
        [roomId]
    );

    // Toggle mute
    const sendMuteToggle = useCallback(
        (isMuted: boolean) => {
            socketRef.current?.emit('mute_toggle', { roomId, isMuted });
        },
        [roomId]
    );

    // Send speaking state
    const sendSpeaking = useCallback(
        (isSpeaking: boolean) => {
            socketRef.current?.emit('speaking', { roomId, isSpeaking });
        },
        [roomId]
    );

    // Leave room
    const leaveRoom = useCallback(() => {
        socketRef.current?.emit('leave_room', roomId);
        socketRef.current?.disconnect();
    }, [roomId]);

    // Send raise hand
    const sendRaiseHand = useCallback(
        (isRaised: boolean) => {
            socketRef.current?.emit('raise_hand', { roomId, isRaised });
        },
        [roomId]
    );

    // Send reaction
    const sendReaction = useCallback(
        (type: 'raise_hand' | 'clap' | 'thumbs_up' | 'heart') => {
            socketRef.current?.emit('reaction', { roomId, type });
        },
        [roomId]
    );

    // Send video toggle
    const sendVideoToggle = useCallback(
        (isVideoEnabled: boolean) => {
            socketRef.current?.emit('video_toggle', { roomId, isVideoEnabled });
        },
        [roomId]
    );

    // Join room with password (for retry after password_required)
    const joinWithPassword = useCallback(
        (password: string) => {
            if (socketRef.current?.connected) {
                socketRef.current.emit('join_room', {
                    roomId,
                    user: userRef.current,
                    password,
                });
            }
        },
        [roomId]
    );

    // Send whiteboard toggle
    const sendWhiteboardToggle = useCallback(
        (isOpen: boolean) => {
            socketRef.current?.emit('whiteboard:toggle', { roomId, isOpen, userId: userRef.current.id });
        },
        [roomId]
    );

    return {
        isConnected,
        participants,
        passwordError,
        sendSignal,
        sendMuteToggle,
        sendSpeaking,
        sendVideoToggle,
        leaveRoom,
        sendRaiseHand,
        sendReaction,
        joinWithPassword,
        sendWhiteboardToggle,
    };
}
