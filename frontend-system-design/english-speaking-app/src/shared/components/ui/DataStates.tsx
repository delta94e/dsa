'use client';

import { ReactNode } from 'react';
import { Center, Loader, Alert, Box, Text, Button, Stack } from '@mantine/core';
import { IconAlertCircle, IconPlus, IconSearch } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface DataStatesProps {
    variant?: 'light' | 'dark';
}

// ═══════════════════════════════════════════════════════════════
// Loading State Component
// ═══════════════════════════════════════════════════════════════
interface LoadingStateProps extends DataStatesProps {
    message?: string;
}

export function LoadingState({ message, variant = 'dark' }: LoadingStateProps) {
    const isDark = variant === 'dark';
    
    return (
        <Center py={80}>
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
            >
                <Stack align="center" gap="md">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' as const }}
                    >
                        <Loader 
                            size="lg" 
                            color={isDark ? 'violet' : 'blue'}
                        />
                    </motion.div>
                    {message && (
                        <Text 
                            c={isDark ? 'rgba(255,255,255,0.6)' : 'dimmed'}
                            size="sm"
                        >
                            {message}
                        </Text>
                    )}
                </Stack>
            </motion.div>
        </Center>
    );
}

// ═══════════════════════════════════════════════════════════════
// Error State Component
// ═══════════════════════════════════════════════════════════════
interface ErrorStateProps extends DataStatesProps {
    title?: string;
    message: string;
    onRetry?: () => void;
}

export function ErrorState({ 
    title = 'Lỗi', 
    message, 
    onRetry,
    variant = 'dark'
}: ErrorStateProps) {
    const isDark = variant === 'dark';
    
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <Box
                p="xl"
                style={{
                    background: isDark 
                        ? 'rgba(255, 59, 48, 0.1)' 
                        : 'rgba(255, 59, 48, 0.05)',
                    borderRadius: 16,
                    border: `1px solid ${isDark ? 'rgba(255, 59, 48, 0.3)' : 'rgba(255, 59, 48, 0.2)'}`,
                }}
            >
                <Stack align="center" gap="md">
                    <Box
                        style={{
                            width: 48,
                            height: 48,
                            borderRadius: 12,
                            background: 'rgba(255, 59, 48, 0.2)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <IconAlertCircle size={24} color="#FF3B30" />
                    </Box>
                    <Box ta="center">
                        <Text 
                            fw={600} 
                            size="lg" 
                            mb={4}
                            style={{ color: isDark ? 'white' : '#1C1E21' }}
                        >
                            {title}
                        </Text>
                        <Text 
                            size="sm" 
                            c={isDark ? 'rgba(255,255,255,0.6)' : 'dimmed'}
                        >
                            {message}
                        </Text>
                    </Box>
                    {onRetry && (
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                            <Button 
                                variant="light" 
                                color="red" 
                                radius="xl"
                                onClick={onRetry}
                            >
                                Thử lại
                            </Button>
                        </motion.div>
                    )}
                </Stack>
            </Box>
        </motion.div>
    );
}

// ═══════════════════════════════════════════════════════════════
// Empty State Component
// ═══════════════════════════════════════════════════════════════
interface EmptyStateProps extends DataStatesProps {
    title: string;
    description?: string;
    actionLabel?: string;
    actionHref?: string;
    icon?: ReactNode;
}

export function EmptyState({ 
    title, 
    description, 
    actionLabel, 
    actionHref,
    icon,
    variant = 'dark'
}: EmptyStateProps) {
    const isDark = variant === 'dark';
    
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
        >
            <Center py={80}>
                <Stack align="center" gap="lg" maw={400}>
                    <motion.div
                        animate={{ y: [0, -8, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' as const }}
                    >
                        <Box
                            style={{
                                width: 80,
                                height: 80,
                                borderRadius: 20,
                                background: isDark 
                                    ? 'linear-gradient(135deg, rgba(102, 126, 234, 0.2), rgba(118, 75, 162, 0.2))'
                                    : 'linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1))',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}`,
                            }}
                        >
                            {icon || <IconSearch size={36} color={isDark ? '#667eea' : '#764ba2'} />}
                        </Box>
                    </motion.div>
                    
                    <Box ta="center">
                        <Text 
                            size="xl" 
                            fw={700} 
                            mb="xs"
                            style={{ color: isDark ? 'white' : '#1C1E21' }}
                        >
                            {title}
                        </Text>
                        {description && (
                            <Text 
                                c={isDark ? 'rgba(255,255,255,0.6)' : 'dimmed'}
                                size="md"
                            >
                                {description}
                            </Text>
                        )}
                    </Box>
                    
                    {actionLabel && actionHref && (
                        <Link href={actionHref} style={{ textDecoration: 'none' }}>
                            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                                <Button 
                                    leftSection={<IconPlus size={18} />}
                                    radius="xl"
                                    size="md"
                                    style={{
                                        background: 'linear-gradient(135deg, #667eea, #764ba2)',
                                        fontWeight: 600,
                                        boxShadow: '0 8px 24px rgba(102, 126, 234, 0.4)',
                                    }}
                                >
                                    {actionLabel}
                                </Button>
                            </motion.div>
                        </Link>
                    )}
                </Stack>
            </Center>
        </motion.div>
    );
}
