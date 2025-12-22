'use client';

import { Avatar, Box, Text, Badge, Indicator, Stack, Group } from '@mantine/core';
import { IconMicrophoneOff, IconMicrophone, IconHandStop } from '@tabler/icons-react';
import { motion, AnimatePresence } from 'framer-motion';
import { RoomParticipant } from '@/types';

interface ParticipantCardProps {
    participant: RoomParticipant;
    isHost?: boolean;
}

// Framer motion variants
const pulseVariants = {
    speaking: {
        scale: 1.1,
        boxShadow: '0 0 0 4px rgba(34, 197, 94, 0.3), 0 0 20px rgba(34, 197, 94, 0.5)',
    },
    handRaised: {
        scale: 1.05,
        boxShadow: '0 0 0 4px rgba(234, 179, 8, 0.3), 0 0 15px rgba(234, 179, 8, 0.4)',
    },
    idle: {
        scale: 1,
        boxShadow: 'none',
    },
};

const badgeVariants = {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 },
};

export function ParticipantCard({ participant, isHost }: ParticipantCardProps) {
    const { name, avatarUrl, countryFlag, isMuted, isSpeaking, isHandRaised } = participant;

    const getAvatarState = () => {
        if (isSpeaking) return 'speaking';
        if (isHandRaised) return 'handRaised';
        return 'idle';
    };

    return (
        <Stack align="center" gap="xs" style={{ width: 100, position: 'relative' }}>
            {/* Hand Raised Emoji - Animated with framer-motion */}
            <AnimatePresence>
                {isHandRaised && (
                    <motion.div
                        style={{
                            position: 'absolute',
                            top: -10,
                            right: 10,
                            fontSize: '1.5rem',
                            zIndex: 10,
                        }}
                        initial={{ opacity: 0, y: -10, rotate: 0 }}
                        animate={{
                            opacity: 1,
                            y: 0,
                            rotate: [0, -10, 10, -10, 0],
                        }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{
                            rotate: { duration: 0.5, repeat: Infinity, ease: 'easeInOut' },
                            opacity: { duration: 0.2 },
                            y: { duration: 0.2 },
                        }}
                    >
                        ✋
                    </motion.div>
                )}
            </AnimatePresence>

            <Indicator
                inline
                processing={isSpeaking}
                color={isSpeaking ? 'green' : isHandRaised ? 'yellow' : 'transparent'}
                size={16}
                offset={7}
                position="bottom-end"
                withBorder
                disabled={!isSpeaking && !isHandRaised}
            >
                <motion.div
                    variants={pulseVariants}
                    animate={getAvatarState()}
                    transition={{ duration: 0.2 }}
                >
                    <Avatar
                        src={avatarUrl}
                        alt={name}
                        size="lg"
                        radius="xl"
                        style={{
                            border: isSpeaking
                                ? '4px solid #22c55e'
                                : isHandRaised
                                ? '4px solid #eab308'
                                : '4px solid transparent',
                        }}
                    />
                </motion.div>
            </Indicator>

            <Box ta="center">
                <Text size="sm" fw={500} lineClamp={1}>
                    {countryFlag} {name}
                </Text>
                {isHost && (
                    <Badge size="xs" color="yellow" variant="light">
                        Host
                    </Badge>
                )}
            </Box>

            {/* Status badges with AnimatePresence */}
            <Group gap={4}>
                <AnimatePresence mode="wait">
                    {isHandRaised && (
                        <motion.div
                            key="hand"
                            variants={badgeVariants}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                        >
                            <Badge
                                size="xs"
                                color="yellow"
                                variant="filled"
                                leftSection={<IconHandStop size={10} />}
                            >
                                Hand
                            </Badge>
                        </motion.div>
                    )}
                    {isSpeaking && (
                        <motion.div
                            key="speaking"
                            variants={badgeVariants}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                        >
                            <Badge
                                size="xs"
                                color="green"
                                variant="filled"
                                leftSection={<IconMicrophone size={10} />}
                            >
                                Speaking
                            </Badge>
                        </motion.div>
                    )}
                    {!isSpeaking && isMuted && (
                        <motion.div
                            key="muted"
                            variants={badgeVariants}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                        >
                            <Badge
                                size="xs"
                                color="red"
                                variant="light"
                                leftSection={<IconMicrophoneOff size={10} />}
                            >
                                Muted
                            </Badge>
                        </motion.div>
                    )}
                </AnimatePresence>
            </Group>
        </Stack>
    );
}
