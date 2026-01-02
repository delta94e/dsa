'use client';

import { motion } from 'framer-motion';
import { Text, Title, Button, Group, Stack, Avatar, Box } from '@mantine/core';
import { IconVideo, IconUsers, IconArrowRight } from '@tabler/icons-react';
import Link from 'next/link';

interface AnimatedHeroProps {
    showAIPractice?: boolean;
}

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.1,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease: [0.22, 1, 0.36, 1] as const,
        },
    },
};

// Mock connected users for social proof
const connectedUsers = [
    { id: 1, avatar: 'https://i.pravatar.cc/150?img=1', name: 'Mai' },
    { id: 2, avatar: 'https://i.pravatar.cc/150?img=2', name: 'John' },
    { id: 3, avatar: 'https://i.pravatar.cc/150?img=3', name: 'Sarah' },
    { id: 4, avatar: 'https://i.pravatar.cc/150?img=4', name: 'Tuan' },
    { id: 5, avatar: 'https://i.pravatar.cc/150?img=5', name: 'Emma' },
];

export function AnimatedHero({ showAIPractice = true }: AnimatedHeroProps) {
    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <Stack align="center" gap="xl" py={80}>
                {/* Live indicator */}
                <motion.div variants={itemVariants}>
                    <Group
                        gap="xs"
                        style={{
                            background: '#E7F3FF',
                            padding: '8px 16px',
                            borderRadius: 20,
                        }}
                    >
                        <motion.div
                            animate={{
                                scale: [1, 1.2, 1],
                                opacity: [1, 0.7, 1],
                            }}
                            transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                ease: 'easeInOut' as const,
                            }}
                            style={{
                                width: 8,
                                height: 8,
                                borderRadius: '50%',
                                background: '#31A24C',
                            }}
                        />
                        <Text size="sm" fw={500} style={{ color: '#1877F2' }}>
                            1,234 người đang online
                        </Text>
                    </Group>
                </motion.div>

                {/* Main Title */}
                <motion.div variants={itemVariants} style={{ textAlign: 'center' }}>
                    <Title
                        order={1}
                        style={{
                            fontSize: 'clamp(2.5rem, 6vw, 4rem)',
                            fontWeight: 800,
                            color: '#1C1E21',
                            lineHeight: 1.1,
                            letterSpacing: '-0.02em',
                        }}
                    >
                        Luyện nói tiếng Anh
                        <br />
                        <Text
                            component="span"
                            inherit
                            style={{
                                background: 'linear-gradient(90deg, #1877F2, #0866FF)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                            }}
                        >
                            cùng cộng đồng toàn cầu
                        </Text>
                    </Title>
                </motion.div>

                {/* Subtitle */}
                <motion.div variants={itemVariants}>
                    <Text
                        size="xl"
                        ta="center"
                        maw={550}
                        style={{
                            color: '#65676B',
                            lineHeight: 1.6,
                        }}
                    >
                        Tham gia phòng voice để thực hành với người học từ khắp nơi trên thế giới. 
                        Miễn phí, dễ dàng, hiệu quả.
                    </Text>
                </motion.div>

                {/* Connected Users Social Proof */}
                <motion.div variants={itemVariants}>
                    <Group gap="md" align="center">
                        <Avatar.Group spacing="sm">
                            {connectedUsers.map((user, index) => (
                                <motion.div
                                    key={user.id}
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{
                                        delay: 0.8 + index * 0.1,
                                        type: 'spring' as const,
                                        stiffness: 300,
                                    }}
                                >
                                    <Avatar
                                        src={user.avatar}
                                        size={40}
                                        radius="xl"
                                        style={{
                                            border: '3px solid white',
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                        }}
                                    />
                                </motion.div>
                            ))}
                        </Avatar.Group>
                        <Text size="sm" c="dimmed">
                            + 10,000 người đang luyện tập
                        </Text>
                    </Group>
                </motion.div>

                {/* CTA Buttons */}
                <motion.div variants={itemVariants}>
                    <Group mt="md" gap="md">
                        <Link href="/rooms" style={{ textDecoration: 'none' }}>
                            <motion.div
                                whileHover={{ scale: 1.03, y: -2 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <Button
                                    size="xl"
                                    radius="xl"
                                    leftSection={<IconVideo size={22} />}
                                    style={{
                                        background: '#1877F2',
                                        height: 56,
                                        padding: '0 32px',
                                        fontSize: '1rem',
                                        fontWeight: 600,
                                        boxShadow: '0 4px 12px rgba(24, 119, 242, 0.4)',
                                    }}
                                >
                                    Vào phòng ngay
                                </Button>
                            </motion.div>
                        </Link>

                        <Link href="/create-room" style={{ textDecoration: 'none' }}>
                            <motion.div
                                whileHover={{ scale: 1.03, y: -2 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <Button
                                    size="xl"
                                    radius="xl"
                                    variant="light"
                                    leftSection={<IconUsers size={22} />}
                                    style={{
                                        height: 56,
                                        padding: '0 32px',
                                        fontSize: '1rem',
                                        fontWeight: 600,
                                        background: '#E7F3FF',
                                        color: '#1877F2',
                                    }}
                                >
                                    Tạo phòng mới
                                </Button>
                            </motion.div>
                        </Link>
                    </Group>
                </motion.div>

                {/* Feature Pills */}
                <motion.div variants={itemVariants}>
                    <Group gap="xs" mt="md">
                        {['Miễn phí', 'Không cần đăng ký', 'Video HD', 'Chat thời gian thực'].map((feature, index) => (
                            <motion.div
                                key={feature}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1.2 + index * 0.1 }}
                            >
                                <Box
                                    style={{
                                        background: '#F0F2F5',
                                        padding: '6px 14px',
                                        borderRadius: 16,
                                    }}
                                >
                                    <Text size="sm" fw={500} c="dimmed">
                                        ✓ {feature}
                                    </Text>
                                </Box>
                            </motion.div>
                        ))}
                    </Group>
                </motion.div>
            </Stack>
        </motion.div>
    );
}

export default AnimatedHero;
