'use client';

import { Box, SimpleGrid, Text } from '@mantine/core';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
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

// Video tile animations
const tileVariants = {
    hidden: { 
        opacity: 0, 
        scale: 0.8,
        y: 20,
    },
    visible: { 
        opacity: 1, 
        scale: 1,
        y: 0,
        transition: {
            type: 'spring' as const,
            stiffness: 300,
            damping: 25,
        },
    },
    exit: { 
        opacity: 0, 
        scale: 0.8,
        y: -20,
        transition: { duration: 0.3 },
    },
};

// Spotlight animation for speaker
const spotlightVariants = {
    inactive: {
        scale: 1,
        zIndex: 1,
        boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
    },
    active: {
        scale: 1.02,
        zIndex: 10,
        boxShadow: '0 0 30px rgba(34, 197, 94, 0.4), 0 10px 40px rgba(0,0,0,0.2)',
        transition: {
            duration: 0.3,
        },
    },
};

// Empty state animation
const emptyStateVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
        opacity: 1, 
        y: 0,
        transition: {
            duration: 0.5,
            ease: 'easeOut',
        },
    },
};

// Waiting dots animation
function WaitingDots() {
    return (
        <Box style={{ display: 'flex', gap: 4 }}>
            {[0, 1, 2].map((i) => (
                <motion.div
                    key={i}
                    style={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        background: 'var(--mantine-color-dimmed)',
                    }}
                    animate={{
                        y: [0, -8, 0],
                        opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                        duration: 0.8,
                        repeat: Infinity,
                        delay: i * 0.15,
                    }}
                />
            ))}
        </Box>
    );
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
    
    // Find speaking participant for spotlight
    const speakingParticipant = participants.find(p => p.isSpeaking);

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
            <motion.div
                variants={emptyStateVariants}
                initial="hidden"
                animate="visible"
            >
                <Box
                    style={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 16,
                    }}
                >
                    <motion.div
                        animate={{
                            scale: [1, 1.05, 1],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: 'easeInOut',
                        }}
                    >
                        <Text size="xl">🎙️</Text>
                    </motion.div>
                    <Text c="dimmed" size="lg">Waiting for participants</Text>
                    <WaitingDots />
                </Box>
            </motion.div>
        );
    }

    return (
        <LayoutGroup>
            <motion.div
                layout
                style={{
                    height: getGridHeight(),
                    padding: 16,
                }}
                transition={{
                    layout: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
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
                            <motion.div
                                key={currentUserId}
                                layout
                                layoutId={currentUserId}
                                variants={tileVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                style={{ minHeight: 200 }}
                            >
                                <motion.div
                                    variants={spotlightVariants}
                                    animate={currentUser.isSpeaking ? 'active' : 'inactive'}
                                    style={{
                                        height: '100%',
                                        borderRadius: 12,
                                        overflow: 'hidden',
                                    }}
                                >
                                    <VideoPlayer
                                        stream={localStream}
                                        name={currentUser.name}
                                        avatarUrl={currentUser.avatarUrl}
                                        isMuted={isLocalMuted}
                                        isVideoEnabled={isLocalVideoEnabled}
                                        isSpeaking={currentUser.isSpeaking}
                                        isLocal
                                    />
                                </motion.div>
                            </motion.div>
                        )}

                        {/* Remote Videos with stagger */}
                        {otherParticipants.map((participant, index) => (
                            <motion.div
                                key={participant.id}
                                layout
                                layoutId={participant.id}
                                variants={tileVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                transition={{
                                    delay: 0.1 * (index + 1),
                                }}
                                style={{ minHeight: 200 }}
                            >
                                <motion.div
                                    variants={spotlightVariants}
                                    animate={participant.isSpeaking ? 'active' : 'inactive'}
                                    style={{
                                        height: '100%',
                                        borderRadius: 12,
                                        overflow: 'hidden',
                                        position: 'relative',
                                    }}
                                >
                                    {/* Speaker indicator glow */}
                                    {participant.isSpeaking && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ 
                                                opacity: [0.3, 0.6, 0.3],
                                            }}
                                            transition={{
                                                duration: 1.5,
                                                repeat: Infinity,
                                            }}
                                            style={{
                                                position: 'absolute',
                                                inset: -3,
                                                borderRadius: 15,
                                                border: '3px solid #22c55e',
                                                zIndex: 0,
                                            }}
                                        />
                                    )}
                                    <VideoPlayer
                                        stream={remoteStreams.get(participant.id) || null}
                                        name={participant.name}
                                        avatarUrl={participant.avatarUrl}
                                        isMuted={participant.isMuted}
                                        isVideoEnabled={participant.isVideoEnabled}
                                        isSpeaking={participant.isSpeaking}
                                    />
                                </motion.div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </SimpleGrid>
            </motion.div>
        </LayoutGroup>
    );
}

