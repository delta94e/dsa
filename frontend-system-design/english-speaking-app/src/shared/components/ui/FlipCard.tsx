'use client';

import { useState, useEffect } from 'react';
import { Box, Text, Group, Progress, Stack } from '@mantine/core';
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from 'framer-motion';

interface FlipCardProps {
    front: React.ReactNode;
    back: React.ReactNode;
    isFlipped?: boolean;
    onFlip?: (flipped: boolean) => void;
}

// ═══════════════════════════════════════════════════════════════
// Animated Counter Component (like ReText in React Native)
// ═══════════════════════════════════════════════════════════════
interface AnimatedCounterProps {
    value: number;
    duration?: number;
    suffix?: string;
    prefix?: string;
    style?: React.CSSProperties;
}

export function AnimatedCounter({ 
    value, 
    duration = 1, 
    suffix = '', 
    prefix = '',
    style 
}: AnimatedCounterProps) {
    const count = useMotionValue(0);
    const rounded = useTransform(count, (v) => Math.round(v));
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
        const controls = animate(count, value, {
            duration,
            ease: [0.37, 0, 0.63, 1], // easeInOutQuart
        });

        const unsubscribe = rounded.on('change', (v) => {
            setDisplayValue(v);
        });

        return () => {
            controls.stop();
            unsubscribe();
        };
    }, [value, duration, count, rounded]);

    return (
        <motion.span style={style}>
            {prefix}{displayValue}{suffix}
        </motion.span>
    );
}

// ═══════════════════════════════════════════════════════════════
// Animated Progress Indicator
// ═══════════════════════════════════════════════════════════════
interface ProgressIndicatorProps {
    percentage: number;
    color?: string;
    showLabel?: boolean;
}

export function ProgressIndicator({ 
    percentage, 
    color = '#FA75BB',
    showLabel = true 
}: ProgressIndicatorProps) {
    return (
        <Box style={{ width: '100%' }}>
            {showLabel && (
                <Text 
                    size="sm" 
                    fw={700} 
                    ta="center" 
                    mb={8}
                    style={{ color }}
                >
                    <AnimatedCounter value={percentage} suffix="%" />
                </Text>
            )}
            <Box
                style={{
                    height: 8,
                    background: 'rgba(0,0,0,0.2)',
                    borderRadius: 100,
                    overflow: 'hidden',
                }}
            >
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ 
                        duration: 1, 
                        ease: [0.37, 0, 0.63, 1] 
                    }}
                    style={{
                        height: '100%',
                        background: color,
                        borderRadius: 100,
                    }}
                />
            </Box>
        </Box>
    );
}

// ═══════════════════════════════════════════════════════════════
// Basic Flip Card Component
// ═══════════════════════════════════════════════════════════════
export function FlipCard({ front, back, isFlipped: controlledFlipped, onFlip }: FlipCardProps) {
    const [internalFlipped, setInternalFlipped] = useState(false);
    const isFlipped = controlledFlipped ?? internalFlipped;

    const handleFlip = () => {
        const newValue = !isFlipped;
        if (onFlip) {
            onFlip(newValue);
        } else {
            setInternalFlipped(newValue);
        }
    };

    return (
        <motion.div
            onClick={handleFlip}
            style={{
                cursor: 'pointer',
                perspective: 1000,
                position: 'relative',
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
        >
            <AnimatePresence mode="wait">
                {!isFlipped ? (
                    <motion.div
                        key="front"
                        initial={{ rotateX: -90, opacity: 0 }}
                        animate={{ rotateX: 0, opacity: 1 }}
                        exit={{ rotateX: -180, opacity: 0 }}
                        transition={{ 
                            type: 'spring',
                            stiffness: 300,
                            damping: 25,
                        }}
                        style={{
                            transformStyle: 'preserve-3d',
                            backfaceVisibility: 'hidden',
                        }}
                    >
                        {front}
                    </motion.div>
                ) : (
                    <motion.div
                        key="back"
                        initial={{ rotateY: 90, opacity: 0 }}
                        animate={{ rotateY: 0, opacity: 1 }}
                        exit={{ rotateY: -90, opacity: 0 }}
                        transition={{ 
                            type: 'spring',
                            stiffness: 300,
                            damping: 25,
                        }}
                        style={{
                            transformStyle: 'preserve-3d',
                            backfaceVisibility: 'hidden',
                        }}
                    >
                        {back}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

// ═══════════════════════════════════════════════════════════════
// Goals Card Component (inspired by the RN example)
// ═══════════════════════════════════════════════════════════════
interface GoalCardProps {
    icon: string;
    name: string;
    saved: number;
    goal: number;
    index?: number;
}

const colors = {
    primary: '#3F226D',
    secondary: '#FA75BB',
    bg: '#3E1870',
};

export function GoalCard({ icon, name, saved, goal, index = 0 }: GoalCardProps) {
    const [isFlipped, setIsFlipped] = useState(false);
    const percentage = Math.round((saved / goal) * 100);

    const FrontContent = (
        <Box
            p="lg"
            style={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(20px)',
                borderRadius: 24,
                border: '1px solid rgba(255, 255, 255, 0.1)',
                minHeight: 120,
            }}
        >
            <Group justify="space-between" align="center">
                <Group gap="md">
                    <Box
                        style={{
                            width: 56,
                            height: 56,
                            borderRadius: '50%',
                            background: 'rgba(255,255,255,0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1.8rem',
                        }}
                    >
                        {icon}
                    </Box>
                    <Box>
                        <Text fw={700} size="lg" style={{ color: 'white' }}>
                            {name}
                        </Text>
                        <Text size="sm" style={{ color: 'rgba(255,255,255,0.6)' }}>
                            Nhấn để xem chi tiết
                        </Text>
                    </Box>
                </Group>
                <Stack align="flex-end" gap={0}>
                    <Text fw={700} size="lg" style={{ color: colors.secondary }}>
                        ${saved.toLocaleString()}
                    </Text>
                    <Text size="xs" style={{ color: 'rgba(255,255,255,0.5)' }}>
                        Đã tiết kiệm
                    </Text>
                </Stack>
            </Group>
        </Box>
    );

    const BackContent = (
        <Box
            p="lg"
            style={{
                background: `linear-gradient(135deg, ${colors.primary}, ${colors.bg})`,
                borderRadius: 24,
                minHeight: 120,
            }}
        >
            <Group justify="space-between" align="center">
                <Stack align="center" gap={2}>
                    <Text fw={700} size="lg" style={{ color: 'white' }}>
                        ${saved.toLocaleString()}
                    </Text>
                    <Text size="xs" style={{ color: 'rgba(255,255,255,0.7)' }}>
                        Đã tiết kiệm
                    </Text>
                </Stack>

                <Box style={{ flex: 1, padding: '0 20px' }}>
                    <ProgressIndicator 
                        percentage={percentage} 
                        color={colors.secondary}
                    />
                </Box>

                <Stack align="center" gap={2}>
                    <Text fw={700} size="lg" style={{ color: 'white' }}>
                        ${goal.toLocaleString()}
                    </Text>
                    <Text size="xs" style={{ color: 'rgba(255,255,255,0.7)' }}>
                        Mục tiêu
                    </Text>
                </Stack>
            </Group>
        </Box>
    );

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
        >
            <FlipCard
                front={FrontContent}
                back={BackContent}
                isFlipped={isFlipped}
                onFlip={setIsFlipped}
            />
        </motion.div>
    );
}

// ═══════════════════════════════════════════════════════════════
// Quest Flip Card (adapted for quest system)
// ═══════════════════════════════════════════════════════════════
interface QuestFlipCardProps {
    icon: string;
    name: string;
    description: string;
    progress: number;
    target: number;
    xpReward: number;
    completed: boolean;
    index?: number;
}

export function QuestFlipCard({
    icon,
    name,
    description,
    progress,
    target,
    xpReward,
    completed,
    index = 0,
}: QuestFlipCardProps) {
    const [isFlipped, setIsFlipped] = useState(false);
    const percentage = Math.min(Math.round((progress / target) * 100), 100);

    const FrontContent = (
        <Box
            p="lg"
            style={{
                background: completed 
                    ? 'linear-gradient(135deg, rgba(52, 199, 89, 0.2), rgba(102, 126, 234, 0.2))'
                    : 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(20px)',
                borderRadius: 24,
                border: `1px solid ${completed ? 'rgba(52, 199, 89, 0.3)' : 'rgba(255, 255, 255, 0.1)'}`,
                minHeight: 100,
            }}
        >
            <Group justify="space-between" align="center" wrap="nowrap">
                <Group gap="md" wrap="nowrap" style={{ flex: 1 }}>
                    <motion.div
                        animate={completed ? { 
                            rotate: [0, -10, 10, 0],
                            scale: [1, 1.1, 1],
                        } : {}}
                        transition={{ duration: 0.5, repeat: completed ? 2 : 0 }}
                    >
                        <Box
                            style={{
                                width: 48,
                                height: 48,
                                borderRadius: 14,
                                background: completed 
                                    ? 'linear-gradient(135deg, #34C759, #30D158)'
                                    : 'rgba(102, 126, 234, 0.2)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '1.5rem',
                                boxShadow: completed 
                                    ? '0 4px 15px rgba(52, 199, 89, 0.4)'
                                    : 'none',
                            }}
                        >
                            {completed ? '✓' : icon}
                        </Box>
                    </motion.div>
                    <Box style={{ minWidth: 0, flex: 1 }}>
                        <Text 
                            fw={600} 
                            lineClamp={1}
                            style={{ 
                                color: 'white',
                                textDecoration: completed ? 'line-through' : 'none',
                                opacity: completed ? 0.7 : 1,
                            }}
                        >
                            {name}
                        </Text>
                        <Text 
                            size="sm" 
                            lineClamp={1}
                            style={{ color: 'rgba(255,255,255,0.6)' }}
                        >
                            {description}
                        </Text>
                    </Box>
                </Group>
                <Box
                    style={{
                        background: completed 
                            ? 'linear-gradient(135deg, #34C759, #30D158)'
                            : 'linear-gradient(135deg, #667eea, #764ba2)',
                        padding: '6px 12px',
                        borderRadius: 20,
                        boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                    }}
                >
                    <Text size="sm" fw={700} style={{ color: 'white' }}>
                        +{xpReward} XP
                    </Text>
                </Box>
            </Group>
        </Box>
    );

    const BackContent = (
        <Box
            p="lg"
            style={{
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                borderRadius: 24,
                minHeight: 100,
            }}
        >
            <Group justify="space-between" align="center">
                <Stack align="center" gap={2}>
                    <Text fw={700} size="xl" style={{ color: 'white' }}>
                        {progress}
                    </Text>
                    <Text size="xs" style={{ color: 'rgba(255,255,255,0.7)' }}>
                        Hiện tại
                    </Text>
                </Stack>

                <Box style={{ flex: 1, padding: '0 20px' }}>
                    <ProgressIndicator 
                        percentage={percentage} 
                        color={completed ? '#34C759' : '#fff'}
                    />
                </Box>

                <Stack align="center" gap={2}>
                    <Text fw={700} size="xl" style={{ color: 'white' }}>
                        {target}
                    </Text>
                    <Text size="xs" style={{ color: 'rgba(255,255,255,0.7)' }}>
                        Mục tiêu
                    </Text>
                </Stack>
            </Group>
        </Box>
    );

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
            style={{ marginBottom: 16 }}
        >
            <FlipCard
                front={FrontContent}
                back={BackContent}
                isFlipped={isFlipped}
                onFlip={setIsFlipped}
            />
        </motion.div>
    );
}

export default FlipCard;
