'use client';

import { useEffect, useState, useRef } from 'react';
import {
    Card,
    Group,
    Text,
    Progress,
    Badge,
    ThemeIcon,
    Box,
} from '@mantine/core';
import { IconCheck, IconStar } from '@tabler/icons-react';
import { motion, AnimatePresence } from 'framer-motion';

interface QuestCardProps {
    id: string;
    name: string;
    description: string;
    type: 'daily' | 'weekly' | 'achievement';
    xpReward: number;
    icon: string;
    progress: number;
    target: number;
    completed: boolean;
}

// Completion burst particles
function CompletionBurst() {
    return (
        <Box style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
            {[...Array(8)].map((_, i) => (
                <motion.div
                    key={i}
                    initial={{
                        opacity: 1,
                        scale: 0,
                        x: '50%',
                        y: '50%',
                    }}
                    animate={{
                        opacity: 0,
                        scale: 1,
                        x: `${50 + Math.cos((i / 8) * Math.PI * 2) * 80}%`,
                        y: `${50 + Math.sin((i / 8) * Math.PI * 2) * 80}%`,
                    }}
                    transition={{
                        duration: 0.6,
                        delay: i * 0.05,
                        ease: 'easeOut' as const,
                    }}
                    style={{
                        position: 'absolute',
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        background: i % 2 === 0 ? '#FFCC00' : '#667eea',
                    }}
                />
            ))}
        </Box>
    );
}

export function QuestCard({
    name,
    description,
    type,
    xpReward,
    icon,
    progress,
    target,
    completed,
}: QuestCardProps) {
    const percentage = Math.min((progress / target) * 100, 100);
    const [wasCompleted, setWasCompleted] = useState(completed);
    const [showBurst, setShowBurst] = useState(false);
    const prevProgressRef = useRef(progress);

    useEffect(() => {
        if (completed && !wasCompleted) {
            setShowBurst(true);
            setTimeout(() => setShowBurst(false), 1000);
        }
        setWasCompleted(completed);
    }, [completed, wasCompleted]);

    const progressIncreased = progress > prevProgressRef.current;
    useEffect(() => {
        prevProgressRef.current = progress;
    }, [progress]);

    const typeColors: Record<string, { gradient: string; bg: string }> = {
        daily: { gradient: 'linear-gradient(135deg, #007AFF, #5856D6)', bg: 'rgba(0, 122, 255, 0.2)' },
        weekly: { gradient: 'linear-gradient(135deg, #AF52DE, #FF2D55)', bg: 'rgba(175, 82, 222, 0.2)' },
        achievement: { gradient: 'linear-gradient(135deg, #FFCC00, #FF9500)', bg: 'rgba(255, 204, 0, 0.2)' },
    };

    const typeLabels: Record<string, string> = {
        daily: 'Hàng ngày',
        weekly: 'Hàng tuần',
        achievement: 'Thành tựu',
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{ height: '100%' }}
        >
            <Card
                padding="lg"
                radius="xl"
                style={{
                    position: 'relative',
                    overflow: 'hidden',
                    height: '100%',
                    background: completed
                        ? 'linear-gradient(135deg, rgba(52, 199, 89, 0.15), rgba(102, 126, 234, 0.15))'
                        : 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(20px)',
                    border: `1px solid ${completed ? 'rgba(52, 199, 89, 0.3)' : 'rgba(255, 255, 255, 0.1)'}`,
                    boxShadow: completed
                        ? '0 8px 32px rgba(52, 199, 89, 0.2)'
                        : '0 8px 32px rgba(0, 0, 0, 0.2)',
                }}
            >
                {/* Completion burst effect */}
                <AnimatePresence>
                    {showBurst && <CompletionBurst />}
                </AnimatePresence>

                <Group justify="space-between" mb="sm" align="flex-start">
                    <Group gap="sm" style={{ flex: 1 }}>
                        {/* Animated Icon */}
                        <motion.div
                            animate={progressIncreased ? {
                                scale: [1, 1.3, 1],
                                rotate: [0, -15, 15, 0],
                            } : {}}
                            transition={{ duration: 0.5 }}
                        >
                            <Box
                                style={{
                                    width: 48,
                                    height: 48,
                                    borderRadius: 14,
                                    background: typeColors[type].bg,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '1.5rem',
                                }}
                            >
                                {icon}
                            </Box>
                        </motion.div>

                        <div style={{ flex: 1 }}>
                            <Text fw={600} size="md" style={{ color: 'white' }}>
                                {name}
                            </Text>
                            <Text size="sm" lineClamp={2} style={{ color: 'rgba(255,255,255,0.6)' }}>
                                {description}
                            </Text>
                        </div>
                    </Group>

                    {/* Completion badge or XP reward */}
                    {completed ? (
                        <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: 'spring' as const, stiffness: 300, damping: 15 }}
                        >
                            <ThemeIcon
                                size="lg"
                                radius="xl"
                                style={{
                                    background: 'linear-gradient(135deg, #34C759, #30D158)',
                                    boxShadow: '0 0 20px rgba(52, 199, 89, 0.5)',
                                }}
                            >
                                <IconCheck size={18} />
                            </ThemeIcon>
                        </motion.div>
                    ) : (
                        <motion.div
                            animate={progressIncreased ? { scale: [1, 1.2, 1] } : {}}
                            transition={{ duration: 0.3 }}
                        >
                            <Badge
                                size="lg"
                                variant="gradient"
                                style={{
                                    background: 'linear-gradient(135deg, #667eea, #764ba2)',
                                    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
                                }}
                            >
                                +{xpReward} XP
                            </Badge>
                        </motion.div>
                    )}
                </Group>

                <Group justify="space-between" mb="sm">
                    <Badge
                        size="sm"
                        variant="light"
                        style={{
                            background: typeColors[type].bg,
                            color: 'white',
                        }}
                    >
                        {typeLabels[type]}
                    </Badge>
                    <motion.div
                        animate={progressIncreased ? { scale: [1, 1.2, 1] } : {}}
                        transition={{ duration: 0.3 }}
                    >
                        <Text size="sm" fw={500} style={{ color: completed ? '#34C759' : 'rgba(255,255,255,0.7)' }}>
                            {progress}/{target}
                        </Text>
                    </motion.div>
                </Group>

                {/* Animated Progress Bar */}
                <Box style={{ position: 'relative' }}>
                    <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        style={{ transformOrigin: 'left' }}
                    >
                        <Progress
                            value={percentage}
                            size="md"
                            radius="xl"
                            striped={!completed}
                            animated={!completed && progress > 0}
                            style={{
                                background: 'rgba(255,255,255,0.1)',
                            }}
                            styles={{
                                section: {
                                    background: completed
                                        ? 'linear-gradient(90deg, #34C759, #30D158)'
                                        : typeColors[type].gradient,
                                },
                            }}
                        />
                    </motion.div>

                    {/* Progress glow */}
                    {progressIncreased && !completed && (
                        <motion.div
                            initial={{ opacity: 0.8, scale: 1 }}
                            animate={{ opacity: 0, scale: 1.5 }}
                            transition={{ duration: 0.5 }}
                            style={{
                                position: 'absolute',
                                left: `${percentage}%`,
                                top: '50%',
                                transform: 'translate(-50%, -50%)',
                                width: 12,
                                height: 12,
                                borderRadius: '50%',
                                background: '#667eea',
                                boxShadow: '0 0 20px #667eea',
                            }}
                        />
                    )}
                </Box>

                {/* Star at 50%+ */}
                {percentage >= 50 && percentage < 100 && !completed && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                        style={{
                            position: 'absolute',
                            right: 12,
                            bottom: 12,
                        }}
                    >
                        <motion.div
                            animate={{ rotate: [0, 10, -10, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            <IconStar size={16} color="#FFCC00" fill="#FFCC00" />
                        </motion.div>
                    </motion.div>
                )}
            </Card>
        </motion.div>
    );
}

export default QuestCard;
