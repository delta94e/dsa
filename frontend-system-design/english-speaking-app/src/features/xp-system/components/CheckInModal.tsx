'use client';

import { useState, useEffect } from 'react';
import {
    Modal,
    Box,
    Text,
    Title,
    Button,
    Group,
    Stack,
    Badge,
} from '@mantine/core';
import { IconCalendarCheck, IconFlame, IconGift, IconCoin } from '@tabler/icons-react';
import { motion, AnimatePresence, useMotionValue, animate } from 'framer-motion';

interface CheckInModalProps {
    opened: boolean;
    onClose: () => void;
    onCheckIn: () => Promise<{
        success: boolean;
        xpGained: number;
        streak: number;
        error?: string;
    }>;
    currentStreak: number;
    lastCheckIn?: Date;
}

const STREAK_REWARDS = [10, 15, 20, 25, 30, 40, 50];

// Fire flame animation
const fireVariants = {
    animate: {
        scale: [1, 1.2, 1],
        rotate: [0, -5, 5, 0],
        filter: [
            'drop-shadow(0 0 10px orange)',
            'drop-shadow(0 0 20px orange)',
            'drop-shadow(0 0 10px orange)',
        ],
        transition: {
            duration: 0.5,
            repeat: Infinity,
            ease: 'easeInOut' as const,
        },
    },
};

// Bouncing coin animation
const coinBounceVariants = {
    hidden: { y: -100, opacity: 0, scale: 0 },
    visible: {
        y: 0,
        opacity: 1,
        scale: 1,
        transition: {
            type: 'spring' as const,
            stiffness: 300,
            damping: 10,
            delay: 0.3,
        },
    },
    bounce: {
        y: [0, -20, 0],
        transition: {
            duration: 0.6,
            repeat: Infinity,
            ease: 'easeInOut' as const,
        },
    },
};

// Celebration burst
const celebrationVariants = {
    hidden: { scale: 0, opacity: 0, rotate: -180 },
    visible: {
        scale: 1,
        opacity: 1,
        rotate: 0,
        transition: {
            type: 'spring' as const,
            stiffness: 200,
            damping: 12,
        },
    },
};

// Stagger children for day boxes
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.08,
            delayChildren: 0.2,
        },
    },
};

const dayBoxVariants = {
    hidden: { scale: 0, opacity: 0, y: 20 },
    visible: {
        scale: 1,
        opacity: 1,
        y: 0,
        transition: {
            type: 'spring' as const,
            stiffness: 400,
            damping: 15,
        },
    },
};

// XP counter animation
function AnimatedXpGain({ value }: { value: number }) {
    const count = useMotionValue(0);
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
        const controls = animate(count, value, {
            duration: 1,
            ease: 'easeOut',
            onUpdate: (v) => setDisplayValue(Math.round(v)),
        });
        return controls.stop;
    }, [value, count]);

    return (
        <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4, type: 'spring', stiffness: 200 }}
        >
            <Title order={2} ta="center" style={{ 
                background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '0 0 20px rgba(255,215,0,0.3)',
            }}>
                +{displayValue} XP
            </Title>
        </motion.div>
    );
}

// Fire particles effect
function FireParticles() {
    return (
        <Box style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
            {[...Array(6)].map((_, i) => (
                <motion.div
                    key={i}
                    animate={{
                        y: [0, -30, 0],
                        x: [(i - 3) * 5, (i - 3) * 8, (i - 3) * 5],
                        opacity: [0.8, 0.4, 0.8],
                        scale: [1, 0.6, 1],
                    }}
                    transition={{
                        duration: 1 + Math.random() * 0.5,
                        repeat: Infinity,
                        delay: i * 0.1,
                    }}
                    style={{
                        position: 'absolute',
                        left: '50%',
                        bottom: '60%',
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        background: `hsl(${30 + i * 5}, 100%, 50%)`,
                        boxShadow: `0 0 10px hsl(${30 + i * 5}, 100%, 50%)`,
                    }}
                />
            ))}
        </Box>
    );
}

export function CheckInModal({
    opened,
    onClose,
    onCheckIn,
    currentStreak,
    lastCheckIn,
}: CheckInModalProps) {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<{
        success: boolean;
        xpGained: number;
        streak: number;
    } | null>(null);

    const handleCheckIn = async () => {
        setLoading(true);
        try {
            const res = await onCheckIn();
            setResult(res);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setResult(null);
        onClose();
    };

    const isCheckedInToday = () => {
        if (!lastCheckIn) return false;
        const today = new Date();
        const lastDate = new Date(lastCheckIn);
        return (
            today.getFullYear() === lastDate.getFullYear() &&
            today.getMonth() === lastDate.getMonth() &&
            today.getDate() === lastDate.getDate()
        );
    };

    const alreadyCheckedIn = isCheckedInToday();

    return (
        <Modal
            opened={opened}
            onClose={handleClose}
            title={
                <Group gap="xs">
                    <motion.div
                        animate={{ rotate: [0, -10, 10, 0] }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <IconCalendarCheck size={24} color="var(--mantine-color-violet-6)" />
                    </motion.div>
                    <Title order={3}>Điểm Danh Hàng Ngày</Title>
                </Group>
            }
            centered
            size="md"
        >
            <AnimatePresence mode="wait">
                {result ? (
                    <motion.div
                        key="result"
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                    >
                        <Stack align="center" gap="lg" py="xl">
                            {/* Celebration Badge with Fire */}
                            <motion.div variants={celebrationVariants} style={{ position: 'relative' }}>
                                <FireParticles />
                                <motion.div
                                    animate={{
                                        scale: [1, 1.1, 1],
                                        boxShadow: [
                                            '0 0 20px rgba(255,165,0,0.3)',
                                            '0 0 40px rgba(255,165,0,0.6)',
                                            '0 0 20px rgba(255,165,0,0.3)',
                                        ],
                                    }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                    style={{
                                        width: 100,
                                        height: 100,
                                        borderRadius: '50%',
                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <Text size="3rem">🎉</Text>
                                </motion.div>
                            </motion.div>

                            {/* Animated XP Gain */}
                            <AnimatedXpGain value={result.xpGained} />

                            {/* Streak with Fire */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                            >
                                <Group gap="xs">
                                    <motion.div variants={fireVariants} animate="animate">
                                        <IconFlame size={24} color="orange" />
                                    </motion.div>
                                    <Text fw={700} size="lg" c="orange">
                                        {result.streak} ngày liên tiếp! 🔥
                                    </Text>
                                </Group>
                            </motion.div>

                            {/* Week completion bonus */}
                            {result.streak === 7 && (
                                <motion.div
                                    variants={coinBounceVariants}
                                    initial="hidden"
                                    animate={["visible", "bounce"]}
                                >
                                    <Badge 
                                        color="yellow" 
                                        size="xl" 
                                        leftSection={<IconGift size={16} />}
                                        style={{
                                            boxShadow: '0 0 20px rgba(255,215,0,0.5)',
                                        }}
                                    >
                                        🎁 Bonus tuần hoàn thành! +100 XP
                                    </Badge>
                                </motion.div>
                            )}

                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.8 }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Button onClick={handleClose} variant="gradient" gradient={{ from: 'violet', to: 'grape' }} size="lg" mt="md">
                                    Tuyệt vời! 🎉
                                </Button>
                            </motion.div>
                        </Stack>
                    </motion.div>
                ) : (
                    <motion.div
                        key="form"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <Stack gap="lg">
                            {/* Streak Display with Fire Animation */}
                            <Box ta="center" py="md">
                                <Group justify="center" gap="xs" mb="sm">
                                    <motion.div variants={fireVariants} animate="animate">
                                        <IconFlame size={32} color="orange" />
                                    </motion.div>
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: 'spring', stiffness: 300 }}
                                    >
                                        <Text size="xl" fw={700} style={{
                                            background: 'linear-gradient(135deg, #FF6B6B 0%, #FFD700 100%)',
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent',
                                        }}>
                                            {currentStreak} ngày liên tiếp
                                        </Text>
                                    </motion.div>
                                </Group>
                                <Text size="sm" c="dimmed">
                                    Điểm danh mỗi ngày để tăng streak và nhận thêm XP!
                                </Text>
                            </Box>

                            {/* Weekly Progress with Stagger Animation */}
                            <Box>
                                <Text size="sm" fw={600} mb="xs">
                                    Phần thưởng trong tuần:
                                </Text>
                                <motion.div
                                    variants={containerVariants}
                                    initial="hidden"
                                    animate="visible"
                                >
                                    <Group gap="xs" justify="center">
                                        {STREAK_REWARDS.map((xp, index) => {
                                            const day = index + 1;
                                            const isCompleted = currentStreak >= day;
                                            const isToday = currentStreak + 1 === day && !alreadyCheckedIn;

                                            return (
                                                <motion.div
                                                    key={day}
                                                    variants={dayBoxVariants}
                                                    whileHover={{ 
                                                        scale: 1.15, 
                                                        y: -5,
                                                        transition: { duration: 0.2 }
                                                    }}
                                                    whileTap={{ scale: 0.95 }}
                                                >
                                                    <Box
                                                        style={{
                                                            textAlign: 'center',
                                                            padding: '8px',
                                                            borderRadius: '12px',
                                                            background: isCompleted
                                                                ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                                                                : isToday
                                                                ? 'linear-gradient(135deg, rgba(102, 126, 234, 0.3) 0%, rgba(118, 75, 162, 0.3) 100%)'
                                                                : 'rgba(0,0,0,0.05)',
                                                            border: isToday ? '2px solid #667eea' : 'none',
                                                            minWidth: 50,
                                                            boxShadow: isCompleted 
                                                                ? '0 4px 15px rgba(102, 126, 234, 0.4)' 
                                                                : isToday 
                                                                    ? '0 0 15px rgba(102, 126, 234, 0.3)' 
                                                                    : 'none',
                                                        }}
                                                    >
                                                        <Text size="xs" c={isCompleted ? 'white' : 'dimmed'} fw={500}>
                                                            Day {day}
                                                        </Text>
                                                        <Group gap={2} justify="center">
                                                            <IconCoin size={12} color={isCompleted ? 'white' : '#FFD700'} />
                                                            <Text size="xs" fw={700} c={isCompleted ? 'white' : 'dark'}>
                                                                {xp}
                                                            </Text>
                                                        </Group>
                                                        {day === 7 && (
                                                            <motion.div
                                                                animate={{ rotate: [0, -10, 10, 0] }}
                                                                transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
                                                            >
                                                                <Text size="xs">🎁</Text>
                                                            </motion.div>
                                                        )}
                                                    </Box>
                                                </motion.div>
                                            );
                                        })}
                                    </Group>
                                </motion.div>
                            </Box>

                            {/* Check-in Button */}
                            <motion.div 
                                whileHover={{ scale: 1.02 }} 
                                whileTap={{ scale: 0.98 }}
                            >
                                <Button
                                    size="lg"
                                    fullWidth
                                    loading={loading}
                                    disabled={alreadyCheckedIn}
                                    onClick={handleCheckIn}
                                    variant="gradient"
                                    gradient={alreadyCheckedIn ? undefined : { from: 'violet', to: 'grape' }}
                                    leftSection={
                                        <motion.div
                                            animate={!alreadyCheckedIn ? { rotate: [0, -10, 10, 0] } : {}}
                                            transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 1 }}
                                        >
                                            <IconCalendarCheck size={20} />
                                        </motion.div>
                                    }
                                    style={{
                                        boxShadow: !alreadyCheckedIn ? '0 4px 20px rgba(102, 126, 234, 0.4)' : undefined,
                                    }}
                                >
                                    {alreadyCheckedIn ? 'Đã điểm danh hôm nay ✓' : 'Điểm danh ngay!'}
                                </Button>
                            </motion.div>
                        </Stack>
                    </motion.div>
                )}
            </AnimatePresence>
        </Modal>
    );
}

export default CheckInModal;

