'use client';

import { useEffect, useCallback, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useRoom } from './useRooms';
import { useRoomSocket } from './useRoomSocket';
import { useWebRTC } from './useWebRTC';
import { useMediaStore } from '../stores/mediaStore';
import { useAuthStore } from '@/stores/authStore';
import { User, RoomParticipant, Level } from '@/types';
import {
    playLeaveSound,
    playMuteSound,
    playUnmuteSound,
    playUserJoinedSound,
    playUserLeftSound
} from '@/shared/utils/sounds';
import { useReactions } from '../components/FloatingReactions';
import { ReactionType } from '../components/VoiceControls';

// ═══════════════════════════════════════════════════════════════
// Types
// ═══════════════════════════════════════════════════════════════
interface UseRoomSessionOptions {
    roomId: string;
}

interface UseRoomSessionReturn {
    // Room data
    room: ReturnType<typeof useRoom>['data'];
    isRoomLoading: boolean;
    roomError: ReturnType<typeof useRoom>['error'];

    // Connection
    isConnected: boolean;

    // Participants
    displayParticipants: RoomParticipant[];
    remoteStreams: Map<string, MediaStream>;

    // Current user
    currentUser: User;
    isMuted: boolean;
    isVideoEnabled: boolean;
    vadActive: boolean;
    isHandRaised: boolean;
    localStream: MediaStream | null;

    // Actions
    handleToggleMute: () => void;
    handleToggleVideo: () => void;
    handleLeave: () => void;
    handleToggleHand: () => void;
    sendReaction: (type: ReactionType) => void;

    // Reactions
    reactions: ReturnType<typeof useReactions>['reactions'];

    // Password modal
    showPasswordModal: boolean;
    passwordErrorMsg: string | undefined;
    joinWithPassword: (password: string) => void;
    closePasswordModal: () => void;
}

// ═══════════════════════════════════════════════════════════════
// Hook Implementation
// ═══════════════════════════════════════════════════════════════
export function useRoomSession({ roomId }: UseRoomSessionOptions): UseRoomSessionReturn {
    const router = useRouter();
    const audioContextRef = useRef<AudioContext | null>(null);
    const [vadActive, setVadActive] = useState(false);
    const [isHandRaised, setIsHandRaised] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [passwordErrorMsg, setPasswordErrorMsg] = useState<string | undefined>();

    // Auth user
    const { user: authUser } = useAuthStore();

    // Convert auth user to User type
    const currentUser: User = authUser ? {
        id: authUser.id,
        name: authUser.name,
        avatarUrl: authUser.avatarUrl,
        nativeLanguage: authUser.nativeLanguage || 'English',
        learningLevel: (authUser.learningLevel || 'B1') as Level,
        country: authUser.country || 'Unknown',
        countryFlag: authUser.countryFlag || '🌍',
    } : {
        id: `guest-${Date.now()}`,
        name: 'Guest',
        avatarUrl: 'https://i.pravatar.cc/150?u=guest',
        nativeLanguage: 'English',
        learningLevel: 'B1' as Level,
        country: 'Unknown',
        countryFlag: '🌍',
    };

    // Fetch room data
    const { data: room, isLoading: isRoomLoading, error: roomError } = useRoom(roomId);

    // Media controls
    const { isMuted, isVideoEnabled, toggleMute, toggleVideo, initMedia, cleanup, localStream, trackVersion } = useMediaStore();

    // Signal handler ref
    const signalHandlerRef = useRef<(from: string, type: string, data: unknown) => void>();

    // Reactions
    const { reactions, addReaction } = useReactions();

    // Socket connection
    const {
        isConnected,
        participants: socketParticipants,
        sendSignal,
        sendMuteToggle,
        sendSpeaking,
        sendVideoToggle,
        leaveRoom,
        sendRaiseHand,
        sendReaction,
        joinWithPassword,
    } = useRoomSocket({
        roomId,
        user: currentUser,
        onSignal: (from, type, data) => signalHandlerRef.current?.(from, type, data),
        onUserJoined: (user) => {
            console.log('User joined:', user.name);
            playUserJoinedSound();
        },
        onUserLeft: (userId) => {
            console.log('User left:', userId);
            playUserLeftSound();
        },
        onHandRaised: (userId, userName, isRaised) => {
            if (isRaised) addReaction(userId, userName, 'raise_hand');
        },
        onReaction: (userId, userName, type) => addReaction(userId, userName, type as any),
        onPasswordRequired: () => {
            setShowPasswordModal(true);
            setPasswordErrorMsg(undefined);
        },
        onPasswordError: (error) => setPasswordErrorMsg(error),
    });

    // WebRTC
    const { remoteStreams, handleSignal } = useWebRTC({
        localStream,
        trackVersion,
        participants: socketParticipants,
        currentUserId: currentUser.id,
        onSignal: sendSignal,
    });

    // Update signal handler ref
    useEffect(() => {
        signalHandlerRef.current = handleSignal;
    }, [handleSignal]);

    // Initialize media
    useEffect(() => {
        initMedia();
        return () => {
            cleanup();
            audioContextRef.current?.close();
        };
    }, [initMedia, cleanup]);

    // Voice Activity Detection
    useEffect(() => {
        if (!localStream || isMuted) {
            setVadActive(false);
            sendSpeaking(false);
            return;
        }

        let cleanupFn: (() => void) | null = null;

        const setupVAD = async () => {
            try {
                const audioContext = new AudioContext({ sampleRate: 48000 });
                if (audioContext.state === 'suspended') await audioContext.resume();
                audioContextRef.current = audioContext;

                const analyser = audioContext.createAnalyser();
                const source = audioContext.createMediaStreamSource(localStream);
                source.connect(analyser);
                analyser.fftSize = 1024;
                analyser.smoothingTimeConstant = 0.3;

                const bufferLength = analyser.frequencyBinCount;
                const dataArray = new Uint8Array(bufferLength);
                const nyquist = audioContext.sampleRate / 2;
                const binWidth = nyquist / bufferLength;
                const voiceLowBin = Math.floor(85 / binWidth);
                const voiceHighBin = Math.ceil(400 / binWidth);

                let isSpeaking = false;
                let speakingStartTime = 0;
                let silenceStartTime = 0;
                const SPEAK_THRESHOLD = 25;
                const SPEAK_MIN_DURATION = 150;
                const SILENCE_DURATION = 200;

                const checkAudio = () => {
                    if (audioContext.state !== 'running') return;
                    analyser.getByteFrequencyData(dataArray);

                    let voiceSum = 0;
                    for (let i = voiceLowBin; i <= voiceHighBin && i < bufferLength; i++) {
                        voiceSum += dataArray[i];
                    }
                    const voiceAverage = voiceSum / (voiceHighBin - voiceLowBin + 1);
                    const now = Date.now();
                    const isAboveThreshold = voiceAverage > SPEAK_THRESHOLD;

                    if (isAboveThreshold) {
                        silenceStartTime = 0;
                        if (!isSpeaking) {
                            if (speakingStartTime === 0) speakingStartTime = now;
                            else if (now - speakingStartTime >= SPEAK_MIN_DURATION) {
                                isSpeaking = true;
                                sendSpeaking(true);
                                setVadActive(true);
                            }
                        }
                    } else {
                        speakingStartTime = 0;
                        if (isSpeaking) {
                            if (silenceStartTime === 0) silenceStartTime = now;
                            else if (now - silenceStartTime >= SILENCE_DURATION) {
                                isSpeaking = false;
                                sendSpeaking(false);
                                setVadActive(false);
                            }
                        }
                    }
                };

                const interval = setInterval(checkAudio, 30);
                cleanupFn = () => {
                    clearInterval(interval);
                    audioContext.close();
                };
            } catch (err) {
                console.error('VAD setup error:', err);
            }
        };

        setupVAD();
        return () => cleanupFn?.();
    }, [localStream, isMuted, sendSpeaking]);

    // Handlers
    const handleToggleMute = useCallback(() => {
        if (isMuted) playUnmuteSound();
        else playMuteSound();
        toggleMute();
        sendMuteToggle(!isMuted);
    }, [toggleMute, sendMuteToggle, isMuted]);

    const handleLeave = useCallback(() => {
        playLeaveSound();
        leaveRoom();
        cleanup();
        router.push('/rooms');
    }, [leaveRoom, cleanup, router]);

    const handleToggleVideo = useCallback(() => {
        toggleVideo();
        // Sync video state to other participants
        sendVideoToggle(!isVideoEnabled);
    }, [toggleVideo, sendVideoToggle, isVideoEnabled]);

    const handleToggleHand = useCallback(() => {
        const newState = !isHandRaised;
        setIsHandRaised(newState);
        sendRaiseHand(newState);
    }, [isHandRaised, sendRaiseHand]);

    const closePasswordModal = useCallback(() => {
        setShowPasswordModal(false);
        router.push('/rooms');
    }, [router]);

    // Display participants
    const displayParticipants: RoomParticipant[] =
        isConnected && socketParticipants.length > 0
            ? socketParticipants
            : ((room?.participants || []) as RoomParticipant[]);

    return {
        room,
        isRoomLoading,
        roomError,
        isConnected,
        displayParticipants,
        remoteStreams,
        currentUser,
        isMuted,
        isVideoEnabled,
        vadActive,
        isHandRaised,
        localStream,
        handleToggleMute,
        handleToggleVideo,
        handleLeave,
        handleToggleHand,
        sendReaction,
        reactions,
        showPasswordModal,
        passwordErrorMsg,
        joinWithPassword,
        closePasswordModal,
    };
}
