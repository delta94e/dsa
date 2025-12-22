'use client';

import { useState } from 'react';
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
import { IconCalendarCheck, IconFlame, IconGift } from '@tabler/icons-react';
import { motion, AnimatePresence } from 'framer-motion';

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

// Framer motion variants
const pulseVariants = {
    animate: {
        scale: [1, 1.05, 1],
        transition: {
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut' as const,
        },
    },
};

// Framer motion variants
const celebrationVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
        scale: 1,
        opacity: 1,
        transition: {
            type: 'spring' as const,
            stiffness: 200,
            damping: 15,
        },
    },
};

const fadeInVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { delay: 0.2 },
    },
};

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
                    <IconCalendarCheck size={24} color="var(--mantine-color-violet-6)" />
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
                            <motion.div variants={celebrationVariants}>
                                <motion.div
                                    variants={pulseVariants}
                                    animate="animate"
                                >
                                    <Box
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
                                    </Box>
                                </motion.div>
                            </motion.div>

                            <motion.div variants={fadeInVariants}>
                                <Title order={2} ta="center">
                                    +{result.xpGained} XP
                                </Title>
                            </motion.div>

                            <motion.div variants={fadeInVariants}>
                                <Group gap="xs">
                                    <IconFlame size={20} color="orange" />
                                    <Text fw={600} c="orange">
                                        Streak: {result.streak} ngày
                                    </Text>
                                </Group>
                            </motion.div>

                            {result.streak === 7 && (
                                <motion.div variants={fadeInVariants}>
                                    <Badge color="yellow" size="lg" leftSection={<IconGift size={14} />}>
                                        Bonus tuần hoàn thành!
                                    </Badge>
                                </motion.div>
                            )}

                            <motion.div variants={fadeInVariants}>
                                <Button onClick={handleClose} variant="light" size="lg" mt="md">
                                    Tuyệt vời!
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
                            {/* Streak Display */}
                            <Box ta="center" py="md">
                                <Group justify="center" gap="xs" mb="sm">
                                    <IconFlame size={28} color="orange" />
                                    <Text size="xl" fw={700}>
                                        {currentStreak} ngày liên tiếp
                                    </Text>
                                </Group>
                                <Text size="sm" c="dimmed">
                                    Điểm danh mỗi ngày để tăng streak và nhận thêm XP!
                                </Text>
                            </Box>

                            {/* Weekly Progress */}
                            <Box>
                                <Text size="sm" fw={600} mb="xs">
                                    Phần thưởng trong tuần:
                                </Text>
                                <Group gap="xs" justify="center">
                                    {STREAK_REWARDS.map((xp, index) => {
                                        const day = index + 1;
                                        const isCompleted = currentStreak >= day;
                                        const isToday = currentStreak + 1 === day && !alreadyCheckedIn;

                                        return (
                                            <motion.div
                                                key={day}
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                <Box
                                                    style={{
                                                        textAlign: 'center',
                                                        padding: '8px',
                                                        borderRadius: '8px',
                                                        background: isCompleted
                                                            ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                                                            : isToday
                                                            ? 'rgba(102, 126, 234, 0.2)'
                                                            : '#f0f0f0',
                                                        border: isToday ? '2px solid #667eea' : 'none',
                                                        minWidth: 45,
                                                    }}
                                                >
                                                    <Text size="xs" c={isCompleted ? 'white' : 'dimmed'}>
                                                        Day {day}
                                                    </Text>
                                                    <Text size="xs" fw={700} c={isCompleted ? 'white' : 'dark'}>
                                                        {xp}
                                                    </Text>
                                                    {day === 7 && <Text size="xs">🎁</Text>}
                                                </Box>
                                            </motion.div>
                                        );
                                    })}
                                </Group>
                            </Box>

                            {/* Check-in Button */}
                            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                <Button
                                    size="lg"
                                    fullWidth
                                    loading={loading}
                                    disabled={alreadyCheckedIn}
                                    onClick={handleCheckIn}
                                    style={{
                                        background: alreadyCheckedIn
                                            ? undefined
                                            : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    }}
                                    leftSection={<IconCalendarCheck size={20} />}
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
