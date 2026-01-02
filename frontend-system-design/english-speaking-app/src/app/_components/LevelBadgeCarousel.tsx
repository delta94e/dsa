'use client';

import { motion } from 'framer-motion';
import { Badge, Group, Title } from '@mantine/core';
import { LEVELS } from '@/types';

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

const badgeVariants = {
    hidden: { opacity: 0, scale: 0.5, y: 20 },
    visible: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: {
            type: 'spring' as const,
            stiffness: 300,
            damping: 20,
        },
    },
};

const glowColors: Record<string, string> = {
    green: 'rgba(64, 192, 87, 0.5)',
    lime: 'rgba(130, 201, 30, 0.5)',
    yellow: 'rgba(250, 176, 5, 0.5)',
    orange: 'rgba(253, 126, 20, 0.5)',
    red: 'rgba(250, 82, 82, 0.5)',
    grape: 'rgba(190, 75, 219, 0.5)',
};

export function LevelBadgeCarousel() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{ textAlign: 'center' }}
        >
            <Title
                order={2}
                mb="xl"
                style={{
                    color: 'white',
                    fontWeight: 700,
                    textShadow: '0 2px 20px rgba(0,0,0,0.2)',
                }}
            >
                All CEFR Levels Supported
            </Title>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-50px' }}
            >
                <Group justify="center" gap="md" wrap="wrap">
                    {LEVELS.map((level) => (
                        <motion.div
                            key={level.code}
                            variants={badgeVariants}
                            whileHover={{
                                scale: 1.1,
                                y: -5,
                                transition: { type: 'spring' as const, stiffness: 400 },
                            }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <motion.div
                                animate={{
                                    boxShadow: [
                                        `0 0 10px ${glowColors[level.color] || 'transparent'}`,
                                        `0 0 25px ${glowColors[level.color] || 'transparent'}`,
                                        `0 0 10px ${glowColors[level.color] || 'transparent'}`,
                                    ],
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: 'easeInOut' as const,
                                }}
                                style={{
                                    borderRadius: 24,
                                }}
                            >
                                <Badge
                                    size="xl"
                                    color={level.color}
                                    variant="filled"
                                    style={{
                                        padding: '14px 28px',
                                        fontSize: '0.95rem',
                                        fontWeight: 700,
                                        cursor: 'pointer',
                                        textTransform: 'none',
                                    }}
                                >
                                    {level.code} - {level.name}
                                </Badge>
                            </motion.div>
                        </motion.div>
                    ))}
                </Group>
            </motion.div>
        </motion.div>
    );
}

export default LevelBadgeCarousel;
