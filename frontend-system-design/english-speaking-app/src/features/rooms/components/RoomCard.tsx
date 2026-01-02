'use client';

import { useState } from 'react';
import { Card, Badge, Group, Text, Avatar, Button, Box, ActionIcon, Tooltip } from '@mantine/core';
import { IconUsers, IconVideo, IconLock, IconWorld, IconHeart, IconShare, IconBookmark } from '@tabler/icons-react';
import { Room, LEVEL_COLORS } from '@/types';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface RoomCardProps {
    room: Room;
    index?: number;
}

// Gradient colors for cards
const gradientColors = [
    ['#667eea', '#764ba2'],
    ['#f093fb', '#f5576c'],
    ['#4facfe', '#00f2fe'],
    ['#43e97b', '#38f9d7'],
    ['#fa709a', '#fee140'],
    ['#a18cd1', '#fbc2eb'],
];

// Live indicator
function LiveBadge() {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                background: 'rgba(255, 59, 48, 0.9)',
                padding: '4px 10px',
                borderRadius: 20,
                backdropFilter: 'blur(10px)',
            }}
        >
            <motion.div
                animate={{
                    scale: [1, 1.3, 1],
                    opacity: [1, 0.7, 1],
                }}
                transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: 'easeInOut' as const,
                }}
                style={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: 'white',
                }}
            />
            <Text size="xs" fw={700} style={{ color: 'white', letterSpacing: 0.5 }}>
                LIVE
            </Text>
        </motion.div>
    );
}

export function RoomCard({ room, index = 0 }: RoomCardProps) {
    const [isHovered, setIsHovered] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    
    const hasSpeakingParticipant = room.participants.some(p => p.isSpeaking);
    const isPrivate = room.type === 'private';
    const [gradientStart, gradientEnd] = gradientColors[index % gradientColors.length];

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                duration: 0.5,
                delay: index * 0.08,
                ease: [0.22, 1, 0.36, 1] as const,
            }}
            whileHover={{ y: -8, scale: 1.02 }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            style={{ height: '100%' }}
        >
            <Card
                padding={0}
                radius="xl"
                style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(20px)',
                    overflow: 'hidden',
                    height: '100%',
                    boxShadow: isHovered 
                        ? '0 25px 50px -12px rgba(0, 0, 0, 0.5)' 
                        : '0 10px 40px -10px rgba(0, 0, 0, 0.2)',
                    transition: 'box-shadow 0.3s',
                }}
            >
                {/* Gradient Header */}
                <Box
                    style={{
                        position: 'relative',
                        height: 100,
                        background: `linear-gradient(135deg, ${gradientStart} 0%, ${gradientEnd} 100%)`,
                        overflow: 'hidden',
                    }}
                >
                    {/* Animated shine effect */}
                    <motion.div
                        animate={{
                            x: isHovered ? '200%' : '-100%',
                        }}
                        transition={{ duration: 0.6, ease: 'easeOut' as const }}
                        style={{
                            position: 'absolute',
                            inset: 0,
                            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                            transform: 'skewX(-20deg)',
                        }}
                    />

                    {/* Top row: Live + Level */}
                    <Group justify="space-between" p="sm">
                        <Group gap={6}>
                            {hasSpeakingParticipant && <LiveBadge />}
                            {isPrivate && (
                                <Badge
                                    leftSection={<IconLock size={10} />}
                                    size="sm"
                                    style={{
                                        background: 'rgba(0,0,0,0.4)',
                                        backdropFilter: 'blur(10px)',
                                        color: 'white',
                                    }}
                                >
                                    Private
                                </Badge>
                            )}
                        </Group>
                        <Badge
                            color={LEVEL_COLORS[room.level]}
                            variant="filled"
                            size="md"
                            style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}
                        >
                            {room.level}
                        </Badge>
                    </Group>

                    {/* Avatars - positioned at bottom */}
                    <Box
                        style={{
                            position: 'absolute',
                            bottom: -16,
                            left: 16,
                            zIndex: 10,
                        }}
                    >
                        <Avatar.Group spacing="sm">
                            {room.participants.slice(0, 4).map((p, pIndex) => (
                                <motion.div
                                    key={p.id}
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.2 + pIndex * 0.1 }}
                                    style={{ position: 'relative' }}
                                >
                                    <Avatar
                                        src={p.avatarUrl}
                                        size={36}
                                        radius="xl"
                                        style={{
                                            border: p.isSpeaking 
                                                ? '3px solid #FF3B30' 
                                                : '3px solid rgba(26, 26, 46, 1)',
                                            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                                        }}
                                    />
                                    {p.isSpeaking && (
                                        <motion.div
                                            animate={{ scale: [1, 1.2, 1] }}
                                            transition={{ duration: 1, repeat: Infinity }}
                                            style={{
                                                position: 'absolute',
                                                inset: -3,
                                                borderRadius: '50%',
                                                border: '2px solid #FF3B30',
                                            }}
                                        />
                                    )}
                                </motion.div>
                            ))}
                            {room.participantCount > 4 && (
                                <Avatar
                                    size={36}
                                    radius="xl"
                                    style={{
                                        background: `linear-gradient(135deg, ${gradientStart}, ${gradientEnd})`,
                                        border: '3px solid rgba(26, 26, 46, 1)',
                                        fontWeight: 700,
                                        fontSize: '0.75rem',
                                    }}
                                >
                                    +{room.participantCount - 4}
                                </Avatar>
                            )}
                        </Avatar.Group>
                    </Box>
                </Box>

                {/* Content */}
                <Box p="md" pt={24}>
                    {/* Room name & topic */}
                    <Text fw={700} size="lg" mb={4} lineClamp={1} style={{ color: 'white' }}>
                        {room.name}
                    </Text>
                    <Text size="sm" mb="sm" lineClamp={2} lh={1.5} style={{ color: 'rgba(255,255,255,0.6)' }}>
                        {room.topic}
                    </Text>

                    {/* Tags */}
                    {room.tags.length > 0 && (
                        <Group gap={6} mb="md">
                            {room.tags.slice(0, 3).map((tag) => (
                                <motion.div key={tag} whileHover={{ scale: 1.05 }}>
                                    <Badge
                                        variant="outline"
                                        size="sm"
                                        style={{
                                            borderColor: 'rgba(255,255,255,0.2)',
                                            color: 'rgba(255,255,255,0.7)',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        #{tag}
                                    </Badge>
                                </motion.div>
                            ))}
                        </Group>
                    )}

                    {/* Stats & Actions */}
                    <Group justify="space-between" mb="md">
                        <Group gap="md">
                            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                <Tooltip label={isLiked ? 'Bỏ thích' : 'Thích'}>
                                    <ActionIcon
                                        variant="subtle"
                                        color={isLiked ? 'red' : 'gray'}
                                        onClick={() => setIsLiked(!isLiked)}
                                        style={{ color: isLiked ? '#FF3B30' : 'rgba(255,255,255,0.5)' }}
                                    >
                                        <IconHeart size={18} fill={isLiked ? 'currentColor' : 'none'} />
                                    </ActionIcon>
                                </Tooltip>
                            </motion.div>
                            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                <Tooltip label="Chia sẻ">
                                    <ActionIcon variant="subtle" style={{ color: 'rgba(255,255,255,0.5)' }}>
                                        <IconShare size={18} />
                                    </ActionIcon>
                                </Tooltip>
                            </motion.div>
                            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                <Tooltip label={isSaved ? 'Đã lưu' : 'Lưu'}>
                                    <ActionIcon
                                        variant="subtle"
                                        onClick={() => setIsSaved(!isSaved)}
                                        style={{ color: isSaved ? '#F7B928' : 'rgba(255,255,255,0.5)' }}
                                    >
                                        <IconBookmark size={18} fill={isSaved ? 'currentColor' : 'none'} />
                                    </ActionIcon>
                                </Tooltip>
                            </motion.div>
                        </Group>

                        <Group gap={4}>
                            <IconUsers size={14} style={{ color: 'rgba(255,255,255,0.5)' }} />
                            <Text size="sm" style={{ color: 'rgba(255,255,255,0.6)' }}>
                                {room.participantCount}/{room.maxParticipants}
                            </Text>
                        </Group>
                    </Group>

                    {/* Join Button */}
                    <Link href={`/rooms/${room.id}`} style={{ textDecoration: 'none' }}>
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Button
                                fullWidth
                                leftSection={<IconVideo size={18} />}
                                radius="xl"
                                size="md"
                                style={{
                                    background: `linear-gradient(135deg, ${gradientStart}, ${gradientEnd})`,
                                    fontWeight: 700,
                                    fontSize: '0.95rem',
                                    boxShadow: `0 8px 24px ${gradientStart}40`,
                                    border: 'none',
                                }}
                            >
                                Tham gia ngay
                            </Button>
                        </motion.div>
                    </Link>
                </Box>
            </Card>
        </motion.div>
    );
}

export default RoomCard;
