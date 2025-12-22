'use client';

import { Group, ActionIcon, Tooltip, Box, Text } from '@mantine/core';
import {
    IconMicrophone,
    IconMicrophoneOff,
    IconVideo,
    IconVideoOff,
    IconPhoneOff,
    IconHandStop,
    IconHandOff,
    IconHeart,
    IconThumbUp,
} from '@tabler/icons-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFlags } from '@/shared/components/ui/FeatureFlagMenu';

export type ReactionType = 'raise_hand' | 'clap' | 'thumbs_up' | 'heart';

interface VoiceControlsProps {
    isMuted: boolean;
    isVideoEnabled: boolean;
    isHandRaised: boolean;
    onToggleMute: () => void;
    onToggleVideo: () => void;
    onToggleHand: () => void;
    onReaction: (type: ReactionType) => void;
    onLeave: () => void;
}

// Framer motion variants
const pulseVariants = {
    pulse: {
        scale: [1, 1.1, 1],
        transition: {
            duration: 1,
            repeat: Infinity,
            ease: 'easeInOut' as const,
        },
    },
    idle: {
        scale: 1,
    },
};

const buttonVariants = {
    tap: { scale: 0.95 },
    hover: { scale: 1.05 },
};

export function VoiceControls({
    isMuted,
    isVideoEnabled,
    isHandRaised,
    onToggleMute,
    onToggleVideo,
    onToggleHand,
    onReaction,
    onLeave,
}: VoiceControlsProps) {
    const flags = useFlags();

    return (
        <Group
            justify="center"
            gap="md"
            p="lg"
            style={{
                borderTop: '1px solid var(--mantine-color-gray-3)',
                background: 'var(--mantine-color-gray-0)',
            }}
        >
            {/* Mute Button */}
            <Tooltip label={isMuted ? 'Unmute' : 'Mute'}>
                <motion.div whileTap="tap" whileHover="hover" variants={buttonVariants}>
                    <ActionIcon
                        size="xl"
                        radius="xl"
                        variant={isMuted ? 'filled' : 'light'}
                        color={isMuted ? 'red' : 'gray'}
                        onClick={onToggleMute}
                    >
                        {isMuted ? <IconMicrophoneOff size={24} /> : <IconMicrophone size={24} />}
                    </ActionIcon>
                </motion.div>
            </Tooltip>

            {/* Video Toggle Button */}
            <Tooltip label={isVideoEnabled ? 'Turn Off Camera' : 'Turn On Camera'}>
                <motion.div whileTap="tap" whileHover="hover" variants={buttonVariants}>
                    <ActionIcon
                        size="xl"
                        radius="xl"
                        variant={isVideoEnabled ? 'light' : 'filled'}
                        color={isVideoEnabled ? 'blue' : 'gray'}
                        onClick={onToggleVideo}
                    >
                        {isVideoEnabled ? <IconVideo size={24} /> : <IconVideoOff size={24} />}
                    </ActionIcon>
                </motion.div>
            </Tooltip>

            {/* Raise Hand Button - Feature Flag Controlled */}
            <AnimatePresence>
                {flags.raise_hand.enabled && (
                    <Tooltip label={isHandRaised ? 'Lower Hand' : 'Raise Hand'}>
                        <motion.div
                            variants={pulseVariants}
                            animate={isHandRaised ? 'pulse' : 'idle'}
                            whileTap="tap"
                            whileHover="hover"
                        >
                            <ActionIcon
                                size="xl"
                                radius="xl"
                                variant={isHandRaised ? 'filled' : 'light'}
                                color={isHandRaised ? 'yellow' : 'gray'}
                                onClick={onToggleHand}
                            >
                                {isHandRaised ? <IconHandStop size={24} /> : <IconHandOff size={24} />}
                            </ActionIcon>
                        </motion.div>
                    </Tooltip>
                )}
            </AnimatePresence>

            {/* Divider - only show if reactions are enabled */}
            {flags.reactions.enabled && (
                <Box style={{ width: 1, height: 40, background: 'var(--mantine-color-gray-4)' }} />
            )}

            {/* Reaction Buttons - Feature Flag Controlled */}
            {flags.reactions.enabled && (
                <>
                    <Tooltip label="Clap 👏">
                        <motion.div whileTap={{ scale: 0.9 }} whileHover={{ scale: 1.1 }}>
                            <ActionIcon
                                size="xl"
                                radius="xl"
                                variant="light"
                                color="orange"
                                onClick={() => onReaction('clap')}
                            >
                                <Text size="xl">👏</Text>
                            </ActionIcon>
                        </motion.div>
                    </Tooltip>

                    <Tooltip label="Thumbs Up 👍">
                        <motion.div whileTap={{ scale: 0.9 }} whileHover={{ scale: 1.1 }}>
                            <ActionIcon
                                size="xl"
                                radius="xl"
                                variant="light"
                                color="blue"
                                onClick={() => onReaction('thumbs_up')}
                            >
                                <IconThumbUp size={24} />
                            </ActionIcon>
                        </motion.div>
                    </Tooltip>

                    <Tooltip label="Heart ❤️">
                        <motion.div whileTap={{ scale: 0.9 }} whileHover={{ scale: 1.1 }}>
                            <ActionIcon
                                size="xl"
                                radius="xl"
                                variant="light"
                                color="pink"
                                onClick={() => onReaction('heart')}
                            >
                                <IconHeart size={24} />
                            </ActionIcon>
                        </motion.div>
                    </Tooltip>
                </>
            )}

            {/* Divider */}
            <Box style={{ width: 1, height: 40, background: 'var(--mantine-color-gray-4)' }} />

            {/* Leave Button */}
            <Tooltip label="Leave Room">
                <motion.div whileTap={{ scale: 0.9 }} whileHover={{ scale: 1.05 }}>
                    <ActionIcon size="xl" radius="xl" variant="filled" color="red" onClick={onLeave}>
                        <IconPhoneOff size={24} />
                    </ActionIcon>
                </motion.div>
            </Tooltip>
        </Group>
    );
}
