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
    IconScreenShare,
    IconScreenShareOff,
    IconChalkboard,
    IconChalkboardOff,
} from '@tabler/icons-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFlags } from '@/shared/components/ui/FeatureFlagMenu';

export type ReactionType = 'raise_hand' | 'clap' | 'thumbs_up' | 'heart';

interface VoiceControlsProps {
    isMuted: boolean;
    isVideoEnabled: boolean;
    isScreenSharing: boolean;
    isWhiteboardOpen: boolean;
    isHandRaised: boolean;
    onToggleMute: () => void;
    onToggleVideo: () => void;
    onToggleScreenShare: () => void;
    onToggleWhiteboard: () => void;
    onToggleHand: () => void;
    onReaction: (type: ReactionType) => void;
    onLeave: () => void;
}

const buttonVariants = {
    tap: { scale: 0.9 },
    hover: { scale: 1.1 },
};

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

// Control Button Component
function ControlButton({
    icon,
    label,
    isActive,
    activeColor,
    onClick,
    isPulsing,
}: {
    icon: React.ReactNode;
    label: string;
    isActive: boolean;
    activeColor: string;
    onClick: () => void;
    isPulsing?: boolean;
}) {
    return (
        <Tooltip label={label}>
            <motion.div
                variants={isPulsing ? pulseVariants : buttonVariants}
                animate={isPulsing && isActive ? 'pulse' : 'idle'}
                whileTap="tap"
                whileHover="hover"
            >
                <ActionIcon
                    size={56}
                    radius="xl"
                    onClick={onClick}
                    style={{
                        background: isActive 
                            ? activeColor 
                            : 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        color: 'white',
                        boxShadow: isActive 
                            ? `0 8px 24px ${activeColor}40` 
                            : 'none',
                        transition: 'all 0.2s',
                    }}
                >
                    {icon}
                </ActionIcon>
            </motion.div>
        </Tooltip>
    );
}

export function VoiceControls({
    isMuted,
    isVideoEnabled,
    isScreenSharing,
    isWhiteboardOpen,
    isHandRaised,
    onToggleMute,
    onToggleVideo,
    onToggleScreenShare,
    onToggleWhiteboard,
    onToggleHand,
    onReaction,
    onLeave,
}: VoiceControlsProps) {
    const flags = useFlags();

    return (
        <Group
            justify="center"
            gap="md"
            p="xl"
            style={{
                background: 'transparent',
            }}
        >
            {/* Mute Button */}
            <ControlButton
                icon={isMuted ? <IconMicrophoneOff size={26} /> : <IconMicrophone size={26} />}
                label={isMuted ? 'Bật mic' : 'Tắt mic'}
                isActive={isMuted}
                activeColor="#FF3B30"
                onClick={onToggleMute}
            />

            {/* Video Button */}
            <ControlButton
                icon={isVideoEnabled ? <IconVideo size={26} /> : <IconVideoOff size={26} />}
                label={isVideoEnabled ? 'Tắt camera' : 'Bật camera'}
                isActive={isVideoEnabled}
                activeColor="#007AFF"
                onClick={onToggleVideo}
            />

            {/* Screen Share Button */}
            <ControlButton
                icon={isScreenSharing ? <IconScreenShare size={26} /> : <IconScreenShareOff size={26} />}
                label={isScreenSharing ? 'Dừng chia sẻ' : 'Chia sẻ màn hình'}
                isActive={isScreenSharing}
                activeColor="#34C759"
                onClick={onToggleScreenShare}
                isPulsing
            />

            {/* Whiteboard Button */}
            <ControlButton
                icon={isWhiteboardOpen ? <IconChalkboard size={26} /> : <IconChalkboardOff size={26} />}
                label={isWhiteboardOpen ? 'Đóng bảng' : 'Mở bảng'}
                isActive={isWhiteboardOpen}
                activeColor="#AF52DE"
                onClick={onToggleWhiteboard}
                isPulsing
            />

            {/* Raise Hand Button */}
            <AnimatePresence>
                {flags.raise_hand.enabled && (
                    <ControlButton
                        icon={isHandRaised ? <IconHandStop size={26} /> : <IconHandOff size={26} />}
                        label={isHandRaised ? 'Hạ tay' : 'Giơ tay'}
                        isActive={isHandRaised}
                        activeColor="#FFCC00"
                        onClick={onToggleHand}
                        isPulsing
                    />
                )}
            </AnimatePresence>

            {/* Divider */}
            {flags.reactions.enabled && (
                <Box
                    style={{
                        width: 1,
                        height: 40,
                        background: 'rgba(255, 255, 255, 0.2)',
                        margin: '0 8px',
                    }}
                />
            )}

            {/* Reaction Buttons */}
            {flags.reactions.enabled && (
                <>
                    <Tooltip label="Vỗ tay 👏">
                        <motion.div whileTap={{ scale: 0.9 }} whileHover={{ scale: 1.15 }}>
                            <ActionIcon
                                size={48}
                                radius="xl"
                                onClick={() => onReaction('clap')}
                                style={{
                                    background: 'rgba(255, 149, 0, 0.2)',
                                    border: '1px solid rgba(255, 149, 0, 0.3)',
                                }}
                            >
                                <Text size="xl">👏</Text>
                            </ActionIcon>
                        </motion.div>
                    </Tooltip>

                    <Tooltip label="Thích 👍">
                        <motion.div whileTap={{ scale: 0.9 }} whileHover={{ scale: 1.15 }}>
                            <ActionIcon
                                size={48}
                                radius="xl"
                                onClick={() => onReaction('thumbs_up')}
                                style={{
                                    background: 'rgba(0, 122, 255, 0.2)',
                                    border: '1px solid rgba(0, 122, 255, 0.3)',
                                    color: '#007AFF',
                                }}
                            >
                                <IconThumbUp size={22} />
                            </ActionIcon>
                        </motion.div>
                    </Tooltip>

                    <Tooltip label="Yêu thích ❤️">
                        <motion.div whileTap={{ scale: 0.9 }} whileHover={{ scale: 1.15 }}>
                            <ActionIcon
                                size={48}
                                radius="xl"
                                onClick={() => onReaction('heart')}
                                style={{
                                    background: 'rgba(255, 45, 85, 0.2)',
                                    border: '1px solid rgba(255, 45, 85, 0.3)',
                                    color: '#FF2D55',
                                }}
                            >
                                <IconHeart size={22} />
                            </ActionIcon>
                        </motion.div>
                    </Tooltip>
                </>
            )}

            {/* Divider */}
            <Box
                style={{
                    width: 1,
                    height: 40,
                    background: 'rgba(255, 255, 255, 0.2)',
                    margin: '0 8px',
                }}
            />

            {/* Leave Button */}
            <Tooltip label="Rời phòng">
                <motion.div whileTap={{ scale: 0.9 }} whileHover={{ scale: 1.1 }}>
                    <ActionIcon
                        size={56}
                        radius="xl"
                        onClick={onLeave}
                        style={{
                            background: '#FF3B30',
                            color: 'white',
                            boxShadow: '0 8px 24px rgba(255, 59, 48, 0.4)',
                        }}
                    >
                        <IconPhoneOff size={26} />
                    </ActionIcon>
                </motion.div>
            </Tooltip>
        </Group>
    );
}
