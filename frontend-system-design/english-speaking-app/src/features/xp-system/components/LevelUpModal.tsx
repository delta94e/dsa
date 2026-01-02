'use client';

import { useEffect, useState } from 'react';
import { Modal, Box, Text, Title, Button, Stack } from '@mantine/core';
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from 'framer-motion';
import confetti from 'canvas-confetti';

interface LevelUpModalProps {
    opened: boolean;
    onClose: () => void;
    newLevel: number;
    levelName: string;
    badge: string;
    xpGained?: number;
}

// Glow pulsing animation
const glowVariants = {
    animate: {
        boxShadow: [
            '0 0 20px rgba(255,215,0,0.3)',
            '0 0 60px rgba(255,215,0,0.8)',
            '0 0 20px rgba(255,215,0,0.3)',
        ],
        scale: [1, 1.05, 1],
        transition: {
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut' as const,
        },
    },
};

// Badge entrance with bounce
const badgeVariants = {
    hidden: { scale: 0, opacity: 0, rotate: -180 },
    visible: {
        scale: 1,
        opacity: 1,
        rotate: 0,
        transition: {
            type: 'spring' as const,
            stiffness: 200,
            damping: 12,
            delay: 0.2,
        },
    },
};

// Content slide up
const contentVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            delay: 0.5,
            duration: 0.6,
            ease: [0.22, 1, 0.36, 1] as const,
        },
    },
};

// Level number pop
const levelVariants = {
    hidden: { opacity: 0, scale: 0.5 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            delay: 0.7,
            type: 'spring' as const,
            stiffness: 300,
            damping: 15,
        },
    },
};

const buttonVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            delay: 1,
            duration: 0.4,
        },
    },
    hover: {
        scale: 1.05,
        transition: { duration: 0.2 },
    },
    tap: { scale: 0.95 },
};

// Animated XP Counter Component
function AnimatedXpCounter({ value }: { value: number }) {
    const count = useMotionValue(0);
    const rounded = useTransform(count, (v) => `+${Math.round(v)} XP`);
    const [displayValue, setDisplayValue] = useState('+0 XP');

    useEffect(() => {
        const controls = animate(count, value, {
            duration: 1.5,
            ease: 'easeOut',
            onUpdate: (v) => setDisplayValue(`+${Math.round(v)} XP`),
        });
        return controls.stop;
    }, [value, count]);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, type: 'spring', stiffness: 200 }}
        >
            <Text
                style={{
                    fontSize: '1.5rem',
                    fontWeight: 700,
                    color: '#FFD700',
                    textShadow: '0 0 10px rgba(255,215,0,0.5)',
                }}
            >
                {displayValue}
            </Text>
        </motion.div>
    );
}

// Sparkle particle component
function Sparkles() {
    return (
        <Box style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
            {[...Array(12)].map((_, i) => (
                <motion.div
                    key={i}
                    initial={{
                        opacity: 0,
                        x: '50%',
                        y: '50%',
                        scale: 0,
                    }}
                    animate={{
                        opacity: [0, 1, 0],
                        x: `${50 + (Math.random() - 0.5) * 100}%`,
                        y: `${50 + (Math.random() - 0.5) * 100}%`,
                        scale: [0, 1, 0],
                    }}
                    transition={{
                        duration: 2,
                        delay: i * 0.1,
                        repeat: Infinity,
                        repeatDelay: 1,
                    }}
                    style={{
                        position: 'absolute',
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        background: '#FFD700',
                        boxShadow: '0 0 10px #FFD700',
                    }}
                />
            ))}
        </Box>
    );
}

export function LevelUpModal({
    opened,
    onClose,
    newLevel,
    levelName,
    badge,
    xpGained = 100,
}: LevelUpModalProps) {
    useEffect(() => {
        if (opened) {
            // Enhanced confetti burst
            const colors = ['#667eea', '#764ba2', '#FFD700', '#FF6B6B', '#4ECDC4'];
            
            // Initial burst
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
                colors,
            });

            // Continuous side confetti
            const duration = 3000;
            const end = Date.now() + duration;

            const frame = () => {
                confetti({
                    particleCount: 2,
                    angle: 60,
                    spread: 55,
                    origin: { x: 0 },
                    colors,
                });
                confetti({
                    particleCount: 2,
                    angle: 120,
                    spread: 55,
                    origin: { x: 1 },
                    colors,
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
                backgroundOpacity: 0.8,
                blur: 5,
            }}
            styles={{
                content: {
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    overflow: 'visible',
                },
            }}
        >
            <AnimatePresence>
                {opened && (
                    <Stack align="center" gap="lg" py="xl" style={{ position: 'relative' }}>
                        <Sparkles />
                        
                        {/* Glowing Badge */}
                        <motion.div
                            variants={badgeVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            <motion.div
                                variants={glowVariants}
                                animate="animate"
                                style={{
                                    width: 140,
                                    height: 140,
                                    borderRadius: '50%',
                                    background: 'linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.1) 100%)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    border: '3px solid rgba(255,215,0,0.5)',
                                }}
                            >
                                <motion.span
                                    animate={{ rotate: [0, -5, 5, 0] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    style={{ fontSize: '5rem' }}
                                >
                                    {badge}
                                </motion.span>
                            </motion.div>
                        </motion.div>

                        {/* Content */}
                        <motion.div
                            variants={contentVariants}
                            initial="hidden"
                            animate="visible"
                            style={{ textAlign: 'center' }}
                        >
                            <motion.div
                                animate={{
                                    scale: [1, 1.1, 1],
                                }}
                                transition={{
                                    duration: 0.5,
                                    delay: 0.6,
                                }}
                            >
                                <Text c="white" size="xl" fw={600}>
                                    🎊 LEVEL UP! 🎊
                                </Text>
                            </motion.div>
                        </motion.div>

                        {/* Level Number with Pop Effect */}
                        <motion.div
                            variants={levelVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            <Title
                                order={1}
                                c="white"
                                ta="center"
                                style={{
                                    fontSize: '3.5rem',
                                    textShadow: '0 0 20px rgba(255,255,255,0.5)',
                                }}
                            >
                                Level {newLevel}
                            </Title>
                            <Text c="white" ta="center" size="xl" fw={600}>
                                {levelName}
                            </Text>
                        </motion.div>

                        {/* Animated XP Counter */}
                        <AnimatedXpCounter value={xpGained} />

                        {/* Button */}
                        <motion.div
                            variants={buttonVariants}
                            initial="hidden"
                            animate="visible"
                            whileHover="hover"
                            whileTap="tap"
                        >
                            <Button
                                variant="white"
                                color="violet"
                                size="lg"
                                onClick={onClose}
                                style={{
                                    boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                                }}
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

