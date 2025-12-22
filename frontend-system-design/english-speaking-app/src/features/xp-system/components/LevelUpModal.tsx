'use client';

import { useEffect } from 'react';
import { Modal, Box, Text, Title, Button, Stack } from '@mantine/core';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

interface LevelUpModalProps {
    opened: boolean;
    onClose: () => void;
    newLevel: number;
    levelName: string;
    badge: string;
}

// Framer motion variants
const badgeVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
        scale: 1,
        opacity: 1,
        transition: {
            type: 'spring' as const,
            stiffness: 200,
            damping: 15,
            delay: 0.1,
        },
    },
};

const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            delay: 0.4,
            duration: 0.5,
            ease: 'easeOut' as const,
        },
    },
};

const buttonVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            delay: 0.7,
            duration: 0.3,
        },
    },
};

export function LevelUpModal({
    opened,
    onClose,
    newLevel,
    levelName,
    badge,
}: LevelUpModalProps) {
    useEffect(() => {
        if (opened) {
            // Trigger confetti
            const duration = 2 * 1000;
            const end = Date.now() + duration;

            const frame = () => {
                confetti({
                    particleCount: 3,
                    angle: 60,
                    spread: 55,
                    origin: { x: 0 },
                    colors: ['#667eea', '#764ba2', '#FFD700'],
                });
                confetti({
                    particleCount: 3,
                    angle: 120,
                    spread: 55,
                    origin: { x: 1 },
                    colors: ['#667eea', '#764ba2', '#FFD700'],
                });

                if (Date.now() < end) {
                    requestAnimationFrame(frame);
                }
            };
            frame();
        }
    }, [opened]);

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            withCloseButton={false}
            centered
            size="sm"
            overlayProps={{
                backgroundOpacity: 0.7,
                blur: 3,
            }}
            styles={{
                content: {
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                },
            }}
        >
            <AnimatePresence>
                {opened && (
                    <Stack align="center" gap="lg" py="xl">
                        <motion.div
                            variants={badgeVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            <Box
                                style={{
                                    width: 120,
                                    height: 120,
                                    borderRadius: '50%',
                                    background: 'rgba(255,255,255,0.2)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxShadow: '0 0 30px rgba(255,215,0,0.5)',
                                }}
                            >
                                <Text style={{ fontSize: '4rem' }}>{badge}</Text>
                            </Box>
                        </motion.div>

                        <motion.div
                            variants={contentVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            <Text c="white" size="lg" ta="center" mb="xs">
                                🎊 LEVEL UP! 🎊
                            </Text>
                            <Title order={1} c="white" ta="center">
                                Level {newLevel}
                            </Title>
                            <Text c="white" ta="center" size="xl" fw={600}>
                                {levelName}
                            </Text>
                        </motion.div>

                        <motion.div
                            variants={buttonVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            <Button
                                variant="white"
                                color="violet"
                                size="lg"
                                onClick={onClose}
                            >
                                Tuyệt vời! 🎉
                            </Button>
                        </motion.div>
                    </Stack>
                )}
            </AnimatePresence>
        </Modal>
    );
}

export default LevelUpModal;
