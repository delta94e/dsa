'use client';

import { useState } from 'react';
import { Box, Container, Title, Text, Stack, Button, SegmentedControl, Group } from '@mantine/core';
import { motion } from 'framer-motion';
import { IconRefresh } from '@tabler/icons-react';

import {
    AnimatedLeaderboard,
    PodiumLeaderboard,
    XPLeaderboard,
    LeaderboardUser,
} from '@/shared/components/ui/AnimatedLeaderboard';

const demoUsers: LeaderboardUser[] = [
    { id: '1', name: 'Minh', score: 2450, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=minh' },
    { id: '2', name: 'Lan', score: 3120, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=lan' },
    { id: '3', name: 'Hùng', score: 1890, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=hung' },
    { id: '4', name: 'Mai', score: 2780, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mai', isCurrentUser: true },
    { id: '5', name: 'Dũng', score: 3450, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=dung' },
    { id: '6', name: 'Hoa', score: 2100, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=hoa' },
    { id: '7', name: 'Tuấn', score: 2650, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=tuan' },
];

const weeklyUsers: LeaderboardUser[] = [
    { id: '1', name: 'An', score: 580 },
    { id: '2', name: 'Bình', score: 720 },
    { id: '3', name: 'Châu', score: 450 },
    { id: '4', name: 'Dương', score: 890, isCurrentUser: true },
    { id: '5', name: 'Em', score: 650 },
];

export default function LeaderboardDemoPage() {
    const [key, setKey] = useState(0);
    const [viewMode, setViewMode] = useState<'bars' | 'podium' | 'list'>('bars');

    const resetAnimation = () => {
        setKey(prev => prev + 1);
    };

    return (
        <Box
            style={{
                minHeight: '100vh',
                background: 'linear-gradient(180deg, #0F0F1A 0%, #1A1A2E 50%, #16213E 100%)',
            }}
        >
            <Container size="lg" py={60}>
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <Box
                        ta="center"
                        mb="xl"
                        p="xl"
                        style={{
                            background: 'rgba(255, 255, 255, 0.05)',
                            backdropFilter: 'blur(20px)',
                            borderRadius: 24,
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                        }}
                    >
                        <Text size="sm" mb="xs" style={{ color: 'rgba(255,255,255,0.5)' }}>
                            Inspired by Telegiv Behance
                        </Text>
                        <Title order={2} mb="md" style={{ color: 'white' }}>
                            Animated Leaderboard Demo
                        </Title>
                        <Text style={{ color: 'rgba(255,255,255,0.7)' }} maw={600} mx="auto" mb="lg">
                            Bars grow dựa trên score với staggered animations.
                            Winner có gold highlight và crown icon.
                        </Text>

                        <Group justify="center" gap="md">
                            <SegmentedControl
                                value={viewMode}
                                onChange={(v) => {
                                    setViewMode(v as typeof viewMode);
                                    setKey(prev => prev + 1);
                                }}
                                data={[
                                    { label: '📊 Bars', value: 'bars' },
                                    { label: '🏆 Podium', value: 'podium' },
                                    { label: '📋 List', value: 'list' },
                                ]}
                                style={{ background: 'rgba(255,255,255,0.1)' }}
                            />
                            <Button
                                leftSection={<IconRefresh size={18} />}
                                onClick={resetAnimation}
                                variant="light"
                                color="grape"
                            >
                                Replay
                            </Button>
                        </Group>
                    </Box>
                </motion.div>

                <Stack gap="xl" key={key}>
                    {/* Main Leaderboard */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <Box
                            p="xl"
                            style={{
                                background: 'rgba(255, 255, 255, 0.05)',
                                backdropFilter: 'blur(20px)',
                                borderRadius: 20,
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                            }}
                        >
                            {viewMode === 'bars' && (
                                <>
                                    <Text size="sm" mb="lg" ta="center" style={{ color: 'rgba(255,255,255,0.5)' }}>
                                        📊 AnimatedLeaderboard - Growing Bars
                                    </Text>
                                    <AnimatedLeaderboard
                                        users={demoUsers}
                                        title="Bảng xếp hạng XP"
                                        containerHeight={200}
                                    />
                                </>
                            )}

                            {viewMode === 'podium' && (
                                <>
                                    <Text size="sm" mb="lg" ta="center" style={{ color: 'rgba(255,255,255,0.5)' }}>
                                        🏆 PodiumLeaderboard - Top 3 Podium
                                    </Text>
                                    <PodiumLeaderboard users={demoUsers} />
                                </>
                            )}

                            {viewMode === 'list' && (
                                <>
                                    <Text size="sm" mb="lg" ta="center" style={{ color: 'rgba(255,255,255,0.5)' }}>
                                        📋 XPLeaderboard - List View
                                    </Text>
                                    <XPLeaderboard 
                                        users={demoUsers} 
                                        currentUserId="4"
                                    />
                                </>
                            )}
                        </Box>
                    </motion.div>

                    {/* Secondary Leaderboard */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <Box
                            p="xl"
                            style={{
                                background: 'rgba(255, 255, 255, 0.05)',
                                backdropFilter: 'blur(20px)',
                                borderRadius: 20,
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                            }}
                        >
                            <Text size="sm" mb="lg" ta="center" style={{ color: 'rgba(255,255,255,0.5)' }}>
                                📅 Weekly Leaderboard
                            </Text>
                            <AnimatedLeaderboard
                                users={weeklyUsers}
                                title="Tuần này"
                                containerHeight={150}
                            />
                        </Box>
                    </motion.div>

                    {/* Features */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <Box
                            p="xl"
                            style={{
                                background: 'rgba(255, 255, 255, 0.05)',
                                backdropFilter: 'blur(20px)',
                                borderRadius: 24,
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                            }}
                        >
                            <Text fw={600} size="lg" mb="lg" style={{ color: 'white' }}>
                                Animation Features
                            </Text>
                            <Group gap="md" wrap="wrap">
                                {[
                                    { icon: '📊', label: 'Growing Bars', desc: 'Height theo score' },
                                    { icon: '⏱️', label: 'Staggered Entry', desc: 'FadeInRight delays' },
                                    { icon: '📐', label: 'mapRange', desc: 'Proportional heights' },
                                    { icon: '🏆', label: 'Gold Highlight', desc: 'Winner glow effect' },
                                    { icon: '✨', label: 'Text Fade', desc: 'Score fade sau bar' },
                                    { icon: '👑', label: 'Crown Icon', desc: 'Winner icon' },
                                ].map((feature) => (
                                    <Box
                                        key={feature.label}
                                        p="md"
                                        style={{
                                            background: 'rgba(255,255,255,0.05)',
                                            borderRadius: 12,
                                            flex: '1 1 150px',
                                        }}
                                    >
                                        <Text span style={{ marginRight: 8 }}>{feature.icon}</Text>
                                        <Text span fw={500} c="white" size="sm">{feature.label}</Text>
                                        <Text size="xs" c="dimmed" mt={4}>
                                            {feature.desc}
                                        </Text>
                                    </Box>
                                ))}
                            </Group>
                        </Box>
                    </motion.div>
                </Stack>
            </Container>
        </Box>
    );
}
