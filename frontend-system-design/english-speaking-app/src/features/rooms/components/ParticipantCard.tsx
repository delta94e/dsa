'use client';

import { Avatar, Box, Text, Badge, Indicator, Stack, Group } from '@mantine/core';
import { IconMicrophoneOff, IconMicrophone, IconHandStop } from '@tabler/icons-react';
import { motion, AnimatePresence } from 'framer-motion';
import { RoomParticipant } from '@/types';

interface ParticipantCardProps {
    participant: RoomParticipant;
    isHost?: boolean;
    isNew?: boolean;
}

// Card entrance/exit animation
const cardVariants = {
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
            damping: 20,
        },
    },
    exit: { 
        opacity: 0, 
        scale: 0.8, 
        y: -20,
        transition: { duration: 0.2 },
    },
};

// Speaking pulse animation
const speakingVariants = {
    speaking: {
        scale: 1.08,
        boxShadow: '0 0 0 4px rgba(52, 199, 89, 0.4), 0 0 30px rgba(52, 199, 89, 0.3)',
        transition: {
            scale: { duration: 0.3 },
            boxShadow: { duration: 0.5, repeat: Infinity, repeatType: 'reverse' as const },
        },
    },
    handRaised: {
        scale: 1.05,
        boxShadow: '0 0 0 4px rgba(255, 204, 0, 0.4), 0 0 20px rgba(255, 204, 0, 0.3)',
    },
    idle: {
        scale: 1,
        boxShadow: '0 0 0 0px transparent',
    },
};

const badgeVariants = {
    initial: { opacity: 0, scale: 0.5, y: 10 },
    animate: { 
        opacity: 1, 
        scale: 1, 
        y: 0,
        transition: {
            type: 'spring' as const,
            stiffness: 400,
            damping: 15,
        },
    },
    exit: { opacity: 0, scale: 0.5, y: -10 },
};

// Audio wave bars
function AudioWaves() {
    return (
        <Box style={{ display: 'flex', gap: 2, alignItems: 'center', height: 12 }}>
            {[0, 1, 2, 3].map((i) => (
                <motion.div
                    key={i}
                    animate={{
                        height: ['40%', '100%', '60%', '90%', '40%'],
                    }}
                    transition={{
                        duration: 0.5,
                        repeat: Infinity,
                        delay: i * 0.1,
                        ease: 'easeInOut' as const,
                    }}
                    style={{
                        width: 3,
                        background: 'linear-gradient(to top, #34C759, #86efac)',
                        borderRadius: 2,
                    }}
                />
            ))}
        </Box>
    );
}

export function ParticipantCard({ participant, isHost, isNew }: ParticipantCardProps) {
    const { name, avatarUrl, countryFlag, isMuted, isSpeaking, isHandRaised } = participant;

    const getAvatarState = () => {
        if (isSpeaking) return 'speaking';
        if (isHandRaised) return 'handRaised';
        return 'idle';
    };

    return (
        <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            layout
            whileHover={{ scale: 1.05 }}
        >
            <Stack 
                align="center" 
                gap="xs" 
                p="sm"
                style={{ 
                    width: 110, 
                    position: 'relative',
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: 16,
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
            >
                {/* New participant indicator */}
                <AnimatePresence>
                    {isNew && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ 
                                opacity: [1, 0.5, 1],
                                scale: 1,
                            }}
                            exit={{ opacity: 0, scale: 0 }}
                            transition={{
                                opacity: { duration: 1, repeat: 3 },
                            }}
                            style={{
                                position: 'absolute',
                                top: -8,
                                left: '50%',
                                transform: 'translateX(-50%)',
                                background: 'linear-gradient(135deg, #34C759, #16a34a)',
                                padding: '2px 8px',
                                borderRadius: 10,
                                zIndex: 20,
                            }}
                        >
                            <Text size="xs" c="white" fw={600}>Mới!</Text>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Hand Raised Emoji */}
                <AnimatePresence>
                    {isHandRaised && (
                        <motion.div
                            style={{
                                position: 'absolute',
                                top: 0,
                                right: 0,
                                fontSize: '1.3rem',
                                zIndex: 10,
                            }}
                            initial={{ opacity: 0, y: 20, scale: 0, rotate: 0 }}
                            animate={{
                                opacity: 1,
                                y: 0,
                                scale: 1,
                                rotate: [0, -15, 15, -15, 0],
                            }}
                            exit={{ opacity: 0, y: -20, scale: 0 }}
                            transition={{
                                rotate: { duration: 0.6, repeat: Infinity, ease: 'easeInOut' as const },
                                default: { type: 'spring' as const, stiffness: 300 },
                            }}
                        >
                            <motion.span
                                animate={{
                                    filter: [
                                        'drop-shadow(0 0 5px rgba(255, 204, 0, 0.5))',
                                        'drop-shadow(0 0 15px rgba(255, 204, 0, 0.8))',
                                        'drop-shadow(0 0 5px rgba(255, 204, 0, 0.5))',
                                    ],
                                }}
                                transition={{ duration: 1, repeat: Infinity }}
                            >
                                ✋
                            </motion.span>
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
                        variants={speakingVariants}
                        animate={getAvatarState()}
                        style={{ borderRadius: '50%' }}
                    >
                        <Avatar
                            src={avatarUrl}
                            alt={name}
                            size={60}
                            radius="xl"
                            style={{
                                border: isSpeaking
                                    ? '3px solid #34C759'
                                    : isHandRaised
                                    ? '3px solid #FFCC00'
                                    : '3px solid rgba(255,255,255,0.2)',
                                transition: 'border-color 0.2s',
                            }}
                        />
                    </motion.div>
                </Indicator>

                <Box ta="center">
                    <Group gap={4} justify="center" wrap="nowrap">
                        <Text size="sm" fw={500} lineClamp={1} style={{ color: 'white' }}>
                            {countryFlag} {name}
                        </Text>
                        {isSpeaking && <AudioWaves />}
                    </Group>
                    {isHost && (
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring' as const, stiffness: 400 }}
                        >
                            <Badge 
                                size="xs"
                                variant="gradient"
                                gradient={{ from: '#FFCC00', to: '#FF9500' }}
                                style={{ marginTop: 4 }}
                            >
                                👑 Host
                            </Badge>
                        </motion.div>
                    )}
                </Box>

                {/* Status badges */}
                <Group gap={4} justify="center">
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
                                    variant="gradient"
                                    gradient={{ from: '#FFCC00', to: '#FF9500' }}
                                    leftSection={<IconHandStop size={10} />}
                                >
                                    Giơ tay
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
                                    variant="gradient"
                                    gradient={{ from: '#34C759', to: '#30D158' }}
                                    leftSection={<IconMicrophone size={10} />}
                                    style={{
                                        boxShadow: '0 0 10px rgba(52, 199, 89, 0.4)',
                                    }}
                                >
                                    Đang nói
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
                                    variant="light"
                                    style={{
                                        background: 'rgba(255, 59, 48, 0.2)',
                                        color: '#FF3B30',
                                    }}
                                    leftSection={<IconMicrophoneOff size={10} />}
                                >
                                    Tắt mic
                                </Badge>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </Group>
            </Stack>
        </motion.div>
    );
}
