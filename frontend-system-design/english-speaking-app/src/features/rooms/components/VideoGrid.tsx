'use client';

import { Box, SimpleGrid, Text } from '@mantine/core';
import { AnimatePresence } from 'framer-motion';
import { VideoPlayer } from './VideoPlayer';
import { RoomParticipant } from '@/types';

interface VideoGridProps {
    localStream: MediaStream | null;
    remoteStreams: Map<string, MediaStream>;
    participants: RoomParticipant[];
    currentUserId: string;
    isLocalVideoEnabled: boolean;
    isLocalMuted: boolean;
}

export function VideoGrid({
    localStream,
    remoteStreams,
    participants,
    currentUserId,
    isLocalVideoEnabled,
    isLocalMuted,
}: VideoGridProps) {
    const currentUser = participants.find(p => p.id === currentUserId);
    const otherParticipants = participants.filter(p => p.id !== currentUserId);
    const totalParticipants = participants.length;

    // Calculate grid columns based on participant count
    const getGridCols = () => {
        if (totalParticipants <= 1) return 1;
        if (totalParticipants <= 2) return 2;
        if (totalParticipants <= 4) return 2;
        if (totalParticipants <= 6) return 3;
        return 4;
    };

    // Calculate grid size for responsive layout
    const getGridHeight = () => {
        if (totalParticipants <= 2) return 'calc(100vh - 200px)';
        if (totalParticipants <= 4) return 'calc(100vh - 200px)';
        return 'auto';
    };

    if (totalParticipants === 0) {
        return (
            <Box
                style={{
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Text c="dimmed">Waiting for participants...</Text>
            </Box>
        );
    }

    return (
        <Box
            style={{
                height: getGridHeight(),
                padding: 16,
            }}
        >
            <SimpleGrid
                cols={getGridCols()}
                spacing="md"
                style={{
                    height: '100%',
                }}
            >
                <AnimatePresence mode="popLayout">
                    {/* Local Video - Always first */}
                    {currentUser && (
                        <Box key={currentUserId} style={{ minHeight: 200 }}>
                            <VideoPlayer
                                stream={localStream}
                                name={currentUser.name}
                                avatarUrl={currentUser.avatarUrl}
                                isMuted={isLocalMuted}
                                isVideoEnabled={isLocalVideoEnabled}
                                isSpeaking={currentUser.isSpeaking}
                                isLocal
                            />
                        </Box>
                    )}

                    {/* Remote Videos */}
                    {otherParticipants.map(participant => (
                        <Box key={participant.id} style={{ minHeight: 200 }}>
                            <VideoPlayer
                                stream={remoteStreams.get(participant.id) || null}
                                name={participant.name}
                                avatarUrl={participant.avatarUrl}
                                isMuted={participant.isMuted}
                                isVideoEnabled={participant.isVideoEnabled}
                                isSpeaking={participant.isSpeaking}
                            />
                        </Box>
                    ))}
                </AnimatePresence>
            </SimpleGrid>
        </Box>
    );
}
