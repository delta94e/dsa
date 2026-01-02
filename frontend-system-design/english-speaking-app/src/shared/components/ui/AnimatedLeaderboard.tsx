'use client';

import { useState, useEffect, useMemo } from 'react';
import { Box, Text, Avatar, Badge, Group, Stack } from '@mantine/core';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import { IconCrown, IconTrophy, IconMedal, IconFlame } from '@tabler/icons-react';

// ═══════════════════════════════════════════════════════════════
// Configuration
// ═══════════════════════════════════════════════════════════════
const _avatarSize = 32;
const _spacing = 4;
const _staggerDuration = 50;
const _initialDelayDuration = 500;
const _containerHeight = 180;

// ═══════════════════════════════════════════════════════════════
// Helper Functions
// ═══════════════════════════════════════════════════════════════
function mapRange(
    value: number,
    low1: number,
    high1: number,
    low2: number,
    high2: number
): number {
    return low2 + ((high2 - low2) * (value - low1)) / (high1 - low1);
}

function getMinMax(users: LeaderboardUser[]): [number, number] {
    return users.reduce<[number, number]>(
        (acc, user) => {
            if (user.score < acc[0]) acc[0] = user.score;
            if (user.score > acc[1]) acc[1] = user.score;
            return acc;
        },
        [Infinity, -Infinity]
    );
}

// ═══════════════════════════════════════════════════════════════
// Types
// ═══════════════════════════════════════════════════════════════
export interface LeaderboardUser {
    id: string;
    name: string;
    score: number;
    avatar?: string;
    isCurrentUser?: boolean;
}

interface PlaceProps {
    user: LeaderboardUser;
    index: number;
    minMax: [number, number];
    containerHeight: number;
    isAnimating: boolean;
    isWinner: boolean;
    rank: number;
}

// ═══════════════════════════════════════════════════════════════
// Place Bar Component
// ═══════════════════════════════════════════════════════════════
function PlaceBar({
    user,
    index,
    minMax,
    containerHeight,
    isAnimating,
    isWinner,
    rank,
}: PlaceProps) {
    const targetHeight = mapRange(
        user.score,
        minMax[0],
        minMax[1],
        _spacing * 6,
        containerHeight - _avatarSize - _spacing * 2
    );

    const getBarColor = () => {
        if (isWinner) return 'linear-gradient(to top, #FFD700, #FFA500)';
        if (rank === 2) return 'linear-gradient(to top, #C0C0C0, #A0A0A0)';
        if (rank === 3) return 'linear-gradient(to top, #CD7F32, #8B4513)';
        if (user.isCurrentUser) return 'linear-gradient(to top, #667eea, #764ba2)';
        return 'rgba(255,255,255,0.1)';
    };

    const getRankIcon = () => {
        if (rank === 1) return <IconCrown size={14} color="#FFD700" />;
        if (rank === 2) return <IconMedal size={14} color="#C0C0C0" />;
        if (rank === 3) return <IconMedal size={14} color="#CD7F32" />;
        return null;
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
                delay: _initialDelayDuration / 1000 + (index * _staggerDuration) / 1000,
                type: 'spring',
                damping: 80,
                stiffness: 200,
            }}
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: _spacing,
            }}
        >
            {/* Bar Container */}
            <motion.div
                initial={{ height: _avatarSize + _spacing * 2 }}
                animate={{
                    height: isAnimating ? targetHeight + _avatarSize + _spacing * 2 : _avatarSize + _spacing * 2,
                }}
                transition={{
                    delay: isAnimating ? (index * _staggerDuration) / 1000 : 0,
                    type: 'spring',
                    damping: 80,
                    stiffness: 200,
                }}
                style={{
                    background: getBarColor(),
                    borderRadius: isAnimating ? 8 : _avatarSize / 2 + _spacing,
                    borderTopLeftRadius: _avatarSize / 2 + _spacing,
                    borderTopRightRadius: _avatarSize / 2 + _spacing,
                    padding: _spacing,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: _spacing,
                    minWidth: _avatarSize + _spacing * 2,
                    boxShadow: isWinner ? '0 0 20px rgba(255, 215, 0, 0.4)' : 'none',
                }}
            >
                {/* Avatar */}
                <Box
                    style={{
                        width: _avatarSize,
                        height: _avatarSize,
                        borderRadius: _avatarSize / 2,
                        border: '2px dashed rgba(255,255,255,0.3)',
                        padding: 2,
                        background: 'rgba(0,0,0,0.2)',
                    }}
                >
                    <Avatar
                        src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`}
                        size={_avatarSize - 6}
                        radius="xl"
                    />
                </Box>

                {/* Score */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isAnimating ? 1 : 0 }}
                    transition={{
                        delay: isAnimating ? 0.3 + (index * _staggerDuration) / 1000 : 0,
                        duration: 0.3,
                    }}
                >
                    <Text
                        fw={700}
                        size="xs"
                        style={{ color: isWinner || rank <= 3 ? 'rgba(0,0,0,0.8)' : 'white' }}
                    >
                        {user.score}
                    </Text>
                </motion.div>
            </motion.div>

            {/* Name & Rank */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                    delay: _initialDelayDuration / 1000 + 0.3 + (index * _staggerDuration) / 1000,
                }}
                style={{ textAlign: 'center' }}
            >
                <Group gap={2} justify="center">
                    {getRankIcon()}
                    <Text size="xs" c="dimmed" lineClamp={1} maw={60}>
                        {user.name}
                    </Text>
                </Group>
            </motion.div>
        </motion.div>
    );
}

// ═══════════════════════════════════════════════════════════════
// Animated Leaderboard Component
// ═══════════════════════════════════════════════════════════════
interface AnimatedLeaderboardProps {
    users: LeaderboardUser[];
    containerHeight?: number;
    title?: string;
    showRanks?: boolean;
    autoAnimate?: boolean;
    animationDelay?: number;
}

export function AnimatedLeaderboard({
    users,
    containerHeight = _containerHeight,
    title,
    showRanks = true,
    autoAnimate = true,
    animationDelay = 500,
}: AnimatedLeaderboardProps) {
    const [isAnimating, setIsAnimating] = useState(false);
    const minMax = useMemo(() => getMinMax(users), [users]);

    // Sort users by score for ranking
    const sortedUsers = useMemo(() => 
        [...users].sort((a, b) => b.score - a.score),
        [users]
    );

    // Get rank for each user
    const getRank = (userId: string) => {
        return sortedUsers.findIndex(u => u.id === userId) + 1;
    };

    // Auto animate on mount
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsAnimating(true);
        }, animationDelay);
        return () => clearTimeout(timer);
    }, [animationDelay]);

    const maxScore = minMax[1];

    return (
        <Box>
            {title && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <Group gap="sm" mb="md" justify="center">
                        <IconTrophy size={20} color="#FFD700" />
                        <Text fw={700} size="lg" c="white">
                            {title}
                        </Text>
                    </Group>
                </motion.div>
            )}

            <Box
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: _spacing * 2,
                    justifyContent: 'center',
                    alignItems: 'flex-end',
                    height: containerHeight + 40, // Extra space for names
                    padding: _spacing,
                }}
            >
                {users.map((user, index) => (
                    <PlaceBar
                        key={user.id}
                        user={user}
                        index={index}
                        minMax={minMax}
                        containerHeight={containerHeight}
                        isAnimating={isAnimating}
                        isWinner={user.score === maxScore}
                        rank={getRank(user.id)}
                    />
                ))}
            </Box>
        </Box>
    );
}

// ═══════════════════════════════════════════════════════════════
// Podium Leaderboard (Top 3 style)
// ═══════════════════════════════════════════════════════════════
interface PodiumLeaderboardProps {
    users: LeaderboardUser[];
}

export function PodiumLeaderboard({ users }: PodiumLeaderboardProps) {
    const [isAnimating, setIsAnimating] = useState(false);

    // Sort and get top 3
    const topThree = useMemo(() => {
        const sorted = [...users].sort((a, b) => b.score - a.score).slice(0, 3);
        // Reorder: 2nd, 1st, 3rd for podium display
        if (sorted.length >= 3) {
            return [sorted[1], sorted[0], sorted[2]];
        }
        return sorted;
    }, [users]);

    const podiumHeights = [100, 140, 80]; // 2nd, 1st, 3rd
    const podiumColors = [
        'linear-gradient(to top, #C0C0C0, #E8E8E8)', // Silver
        'linear-gradient(to top, #FFD700, #FFA500)', // Gold
        'linear-gradient(to top, #CD7F32, #B8860B)', // Bronze
    ];
    const rankLabels = ['2', '1', '3'];

    useEffect(() => {
        const timer = setTimeout(() => setIsAnimating(true), 500);
        return () => clearTimeout(timer);
    }, []);

    return (
        <Box
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'flex-end',
                gap: 8,
                padding: 20,
            }}
        >
            {topThree.map((user, index) => (
                <motion.div
                    key={user.id}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                        delay: 0.3 + index * 0.15,
                        type: 'spring',
                        damping: 20,
                    }}
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 8,
                    }}
                >
                    {/* Avatar with crown for 1st */}
                    <Box style={{ position: 'relative' }}>
                        {index === 1 && (
                            <motion.div
                                initial={{ scale: 0, rotate: -30 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ delay: 1, type: 'spring' }}
                                style={{
                                    position: 'absolute',
                                    top: -20,
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                }}
                            >
                                <IconCrown size={24} color="#FFD700" fill="#FFD700" />
                            </motion.div>
                        )}
                        <Avatar
                            src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`}
                            size={index === 1 ? 60 : 50}
                            radius="xl"
                            style={{
                                border: `3px solid ${index === 1 ? '#FFD700' : index === 0 ? '#C0C0C0' : '#CD7F32'}`,
                            }}
                        />
                    </Box>

                    {/* Name */}
                    <Text size="sm" fw={600} c="white" lineClamp={1} maw={80} ta="center">
                        {user.name}
                    </Text>

                    {/* Podium */}
                    <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: isAnimating ? podiumHeights[index] : 0 }}
                        transition={{
                            delay: 0.5 + index * 0.1,
                            type: 'spring',
                            damping: 15,
                        }}
                        style={{
                            width: index === 1 ? 80 : 70,
                            background: podiumColors[index],
                            borderTopLeftRadius: 8,
                            borderTopRightRadius: 8,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'flex-start',
                            paddingTop: 12,
                            boxShadow: index === 1 ? '0 0 30px rgba(255, 215, 0, 0.3)' : 'none',
                        }}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: isAnimating ? 1 : 0, scale: isAnimating ? 1 : 0 }}
                            transition={{ delay: 0.8 + index * 0.1 }}
                        >
                            <Text
                                fw={900}
                                size="xl"
                                style={{ color: 'rgba(0,0,0,0.7)' }}
                            >
                                {rankLabels[index]}
                            </Text>
                        </motion.div>
                        
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: isAnimating ? 1 : 0 }}
                            transition={{ delay: 1 + index * 0.1 }}
                        >
                            <Group gap={2} mt="xs">
                                <IconFlame size={14} color="rgba(0,0,0,0.5)" />
                                <Text size="sm" fw={700} style={{ color: 'rgba(0,0,0,0.7)' }}>
                                    {user.score}
                                </Text>
                            </Group>
                        </motion.div>
                    </motion.div>
                </motion.div>
            ))}
        </Box>
    );
}

// ═══════════════════════════════════════════════════════════════
// XP Leaderboard (Gamified variant)
// ═══════════════════════════════════════════════════════════════
interface XPLeaderboardProps {
    users: LeaderboardUser[];
    currentUserId?: string;
}

export function XPLeaderboard({ users, currentUserId }: XPLeaderboardProps) {
    const sortedUsers = useMemo(() => 
        [...users].sort((a, b) => b.score - a.score),
        [users]
    );

    return (
        <Stack gap="sm">
            {sortedUsers.map((user, index) => {
                const isCurrentUser = user.id === currentUserId;
                const isTop3 = index < 3;

                return (
                    <motion.div
                        key={user.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <Box
                            p="sm"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 12,
                                background: isCurrentUser 
                                    ? 'linear-gradient(90deg, rgba(102, 126, 234, 0.2), transparent)'
                                    : 'rgba(255,255,255,0.05)',
                                borderRadius: 12,
                                border: isCurrentUser ? '1px solid rgba(102, 126, 234, 0.3)' : 'none',
                            }}
                        >
                            {/* Rank */}
                            <Box
                                style={{
                                    width: 32,
                                    height: 32,
                                    borderRadius: 8,
                                    background: index === 0 
                                        ? 'linear-gradient(135deg, #FFD700, #FFA500)'
                                        : index === 1
                                        ? 'linear-gradient(135deg, #C0C0C0, #A0A0A0)'
                                        : index === 2
                                        ? 'linear-gradient(135deg, #CD7F32, #8B4513)'
                                        : 'rgba(255,255,255,0.1)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <Text fw={700} size="sm" c={isTop3 ? 'dark' : 'white'}>
                                    {index + 1}
                                </Text>
                            </Box>

                            {/* Avatar */}
                            <Avatar
                                src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`}
                                size={36}
                                radius="xl"
                            />

                            {/* Name */}
                            <Text fw={500} c="white" style={{ flex: 1 }}>
                                {user.name}
                                {isCurrentUser && (
                                    <Badge ml="xs" size="xs" color="grape">Bạn</Badge>
                                )}
                            </Text>

                            {/* Score */}
                            <Group gap={4}>
                                <IconFlame size={16} color="#FFD700" />
                                <Text fw={700} c="#FFD700">
                                    {user.score.toLocaleString()}
                                </Text>
                            </Group>
                        </Box>
                    </motion.div>
                );
            })}
        </Stack>
    );
}

export default AnimatedLeaderboard;
