'use client';

import { Badge, Group, Text, Title, SimpleGrid, Box, Stack } from '@mantine/core';
import { IconArrowLeft, IconWifi, IconWifiOff, IconUsers } from '@tabler/icons-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { LEVEL_COLORS, Level, RoomParticipant } from '@/types';
import { ParticipantCard } from './ParticipantCard';

// ═══════════════════════════════════════════════════════════════
// Connection Status Badge (Dark Theme)
// ═══════════════════════════════════════════════════════════════
interface ConnectionStatusProps {
    isConnected: boolean;
}

export function ConnectionStatus({ isConnected }: ConnectionStatusProps) {
    return (
        <motion.div
            animate={isConnected ? {} : { opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
        >
            <Badge
                color={isConnected ? 'green' : 'yellow'}
                variant="light"
                leftSection={isConnected ? <IconWifi size={12} /> : <IconWifiOff size={12} />}
                style={{
                    background: isConnected 
                        ? 'rgba(52, 199, 89, 0.2)' 
                        : 'rgba(255, 204, 0, 0.2)',
                }}
            >
                {isConnected ? 'Đã kết nối' : 'Đang kết nối...'}
            </Badge>
        </motion.div>
    );
}

// ═══════════════════════════════════════════════════════════════
// Room Header Component (Dark Theme)
// ═══════════════════════════════════════════════════════════════
interface RoomHeaderProps {
    name: string;
    topic: string;
    level: Level;
    participantCount: number;
    maxParticipants: number;
    isConnected: boolean;
    backHref?: string;
}

export function RoomHeader({
    name,
    topic,
    level,
    participantCount,
    maxParticipants,
    isConnected,
    backHref = '/rooms',
}: RoomHeaderProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
        >
            <Box
                p="lg"
                mb="lg"
                style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: 20,
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
            >
                <Group justify="space-between" wrap="nowrap">
                    <Box style={{ flex: 1, minWidth: 0 }}>
                        <Group gap="sm" mb="sm">
                            <Link href={backHref} style={{ textDecoration: 'none' }}>
                                <motion.div whileHover={{ x: -4 }} whileTap={{ scale: 0.95 }}>
                                    <Group
                                        gap={6}
                                        p="xs"
                                        style={{
                                            borderRadius: 8,
                                            cursor: 'pointer',
                                            color: 'rgba(255,255,255,0.7)',
                                        }}
                                    >
                                        <IconArrowLeft size={16} />
                                        <Text size="sm">Quay lại</Text>
                                    </Group>
                                </motion.div>
                            </Link>
                            <ConnectionStatus isConnected={isConnected} />
                        </Group>
                        
                        <Title order={2} mb={4} style={{ color: 'white' }}>
                            {name}
                        </Title>
                        <Text style={{ color: 'rgba(255,255,255,0.6)' }}>{topic}</Text>
                    </Box>
                    
                    <Stack align="flex-end" gap="xs">
                        <Badge
                            size="xl"
                            color={LEVEL_COLORS[level]}
                            variant="filled"
                            style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}
                        >
                            {level}
                        </Badge>
                        <Group gap={4}>
                            <IconUsers size={16} style={{ color: 'rgba(255,255,255,0.5)' }} />
                            <Text size="sm" style={{ color: 'rgba(255,255,255,0.6)' }}>
                                {participantCount}/{maxParticipants} người
                            </Text>
                        </Group>
                    </Stack>
                </Group>
            </Box>
        </motion.div>
    );
}

// ═══════════════════════════════════════════════════════════════
// Current User Info Component (Dark Theme)
// ═══════════════════════════════════════════════════════════════
interface CurrentUserInfoProps {
    name: string;
    countryFlag: string;
    isMuted: boolean;
    isSpeaking: boolean;
    streamCount: number;
}

export function CurrentUserInfo({
    name,
    countryFlag,
    isMuted,
    isSpeaking,
    streamCount,
}: CurrentUserInfoProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <Box
                p="md"
                mb="lg"
                style={{
                    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.2), rgba(118, 75, 162, 0.2))',
                    backdropFilter: 'blur(20px)',
                    borderRadius: 16,
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
            >
                <Group gap="md" wrap="wrap">
                    <Group gap="sm">
                        <Text size="sm" style={{ color: 'rgba(255,255,255,0.7)' }}>
                            Bạn:
                        </Text>
                        <Text fw={600} style={{ color: 'white' }}>
                            {countryFlag} {name}
                        </Text>
                    </Group>
                    
                    <Badge
                        color={isMuted ? 'red' : 'green'}
                        variant="light"
                        style={{
                            background: isMuted 
                                ? 'rgba(255, 59, 48, 0.2)' 
                                : 'rgba(52, 199, 89, 0.2)',
                        }}
                    >
                        {isMuted ? '🔇 Đang tắt mic' : '🔊 Đang bật mic'}
                    </Badge>
                    
                    {isSpeaking && (
                        <motion.div
                            animate={{ scale: [1, 1.05, 1] }}
                            transition={{ duration: 0.5, repeat: Infinity }}
                        >
                            <Badge
                                color="green"
                                variant="filled"
                                style={{
                                    background: '#34C759',
                                    boxShadow: '0 0 12px rgba(52, 199, 89, 0.5)',
                                }}
                            >
                                🎤 Đang nói
                            </Badge>
                        </motion.div>
                    )}
                    
                    <Badge
                        variant="outline"
                        style={{
                            borderColor: 'rgba(255,255,255,0.2)',
                            color: 'rgba(255,255,255,0.7)',
                        }}
                    >
                        {streamCount} audio streams
                    </Badge>
                </Group>
            </Box>
        </motion.div>
    );
}

// ═══════════════════════════════════════════════════════════════
// Participants Grid Component (Dark Theme)
// ═══════════════════════════════════════════════════════════════
interface ParticipantsGridProps {
    participants: RoomParticipant[];
    hostId: string;
}

export function ParticipantsGrid({ participants, hostId }: ParticipantsGridProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
        >
            <Box
                p="xl"
                mb="lg"
                style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: 20,
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
            >
                <Title order={4} mb="lg" style={{ color: 'white' }}>
                    Người tham gia ({participants.length})
                </Title>
                
                {participants.length === 0 ? (
                    <Box ta="center" py="xl">
                        <Text style={{ color: 'rgba(255,255,255,0.5)' }}>
                            Chưa có ai tham gia. Bạn là người đầu tiên!
                        </Text>
                    </Box>
                ) : (
                    <SimpleGrid cols={{ base: 3, sm: 4, md: 6 }} spacing="xl">
                        {participants.map((participant, index) => (
                            <motion.div
                                key={participant.id}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <ParticipantCard
                                    participant={participant}
                                    isHost={participant.id === hostId}
                                />
                            </motion.div>
                        ))}
                    </SimpleGrid>
                )}
            </Box>
        </motion.div>
    );
}
