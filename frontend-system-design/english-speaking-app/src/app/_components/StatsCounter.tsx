'use client';

import { useEffect, useState } from 'react';
import { motion, useMotionValue, animate } from 'framer-motion';
import { Text, Group, Stack } from '@mantine/core';
import { IconUsers, IconWorld, IconMessage, IconClock } from '@tabler/icons-react';

interface StatItemProps {
    icon: React.ReactNode;
    iconBg: string;
    value: number;
    suffix: string;
    label: string;
    delay: number;
}

function StatItem({ icon, iconBg, value, suffix, label, delay }: StatItemProps) {
    const count = useMotionValue(0);
    const [displayValue, setDisplayValue] = useState('0');

    useEffect(() => {
        const controls = animate(count, value, {
            duration: 2,
            delay,
            ease: 'easeOut' as const,
            onUpdate: (v) => setDisplayValue(Math.round(v).toLocaleString()),
        });
        return controls.stop;
    }, [value, count, delay]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
                duration: 0.5,
                delay,
                ease: [0.22, 1, 0.36, 1] as const,
            }}
        >
            <Stack align="center" gap={8}>
                <motion.div
                    whileHover={{ scale: 1.1 }}
                    style={{
                        width: 48,
                        height: 48,
                        borderRadius: 12,
                        background: iconBg,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    {icon}
                </motion.div>
                <Text
                    style={{
                        fontSize: '2rem',
                        fontWeight: 800,
                        color: '#1C1E21',
                        lineHeight: 1,
                    }}
                >
                    {displayValue}{suffix}
                </Text>
                <Text size="sm" fw={500} c="dimmed">
                    {label}
                </Text>
            </Stack>
        </motion.div>
    );
}

export function StatsCounter() {
    const stats = [
        { icon: <IconUsers size={24} color="#1877F2" />, iconBg: '#E7F3FF', value: 10000, suffix: '+', label: 'Người học', delay: 0 },
        { icon: <IconWorld size={24} color="#31A24C" />, iconBg: '#E6F4E7', value: 50, suffix: '+', label: 'Quốc gia', delay: 0.1 },
        { icon: <IconMessage size={24} color="#F7B928" />, iconBg: '#FFF4E0', value: 50000, suffix: '+', label: 'Cuộc hội thoại', delay: 0.2 },
        { icon: <IconClock size={24} color="#E4405F" />, iconBg: '#FCE4E8', value: 24, suffix: '/7', label: 'Luôn sẵn sàng', delay: 0.3 },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            style={{
                padding: '40px 24px',
                background: 'white',
                borderRadius: 16,
                border: '1px solid #E4E6EB',
            }}
        >
            <Group justify="center" gap={60} wrap="wrap">
                {stats.map((stat, index) => (
                    <StatItem key={index} {...stat} />
                ))}
            </Group>
        </motion.div>
    );
}

export default StatsCounter;
