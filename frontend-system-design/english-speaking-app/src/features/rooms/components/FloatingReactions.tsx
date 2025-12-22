'use client';

import { useState, useCallback } from 'react';
import { Box, Text } from '@mantine/core';
import { motion, AnimatePresence } from 'framer-motion';

interface Reaction {
    id: string;
    userId: string;
    userName: string;
    type: 'raise_hand' | 'clap' | 'thumbs_up' | 'heart';
    x: number;
}

const REACTION_EMOJIS = {
    raise_hand: '✋',
    clap: '👏',
    thumbs_up: '👍',
    heart: '❤️',
};

// Framer motion variants for floating animation
const floatUpVariants = {
    initial: {
        y: 0,
        opacity: 1,
        scale: 1,
    },
    animate: {
        y: -180,
        opacity: 0,
        scale: 1.2,
        transition: {
            duration: 2,
            ease: 'easeOut' as const,
        },
    },
    exit: {
        opacity: 0,
    },
};

interface FloatingReactionsProps {
    reactions: Reaction[];
}

export function FloatingReactions({ reactions }: FloatingReactionsProps) {
    return (
        <Box
            style={{
                position: 'fixed',
                bottom: 100,
                left: 0,
                right: 0,
                height: 200,
                pointerEvents: 'none',
                overflow: 'hidden',
                zIndex: 1000,
            }}
        >
            <AnimatePresence>
                {reactions.map((reaction) => (
                    <motion.div
                        key={reaction.id}
                        style={{
                            position: 'absolute',
                            left: `${reaction.x}%`,
                            bottom: 0,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                        variants={floatUpVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                    >
                        <Text size="2rem" style={{ lineHeight: 1 }}>
                            {REACTION_EMOJIS[reaction.type]}
                        </Text>
                        <Text size="xs" c="dimmed" fw={500}>
                            {reaction.userName}
                        </Text>
                    </motion.div>
                ))}
            </AnimatePresence>
        </Box>
    );
}

// Hook to manage reactions with auto-removal
export function useReactions() {
    const [reactions, setReactions] = useState<Reaction[]>([]);

    const addReaction = useCallback((userId: string, userName: string, type: Reaction['type']) => {
        const newReaction: Reaction = {
            id: `${Date.now()}-${Math.random()}`,
            userId,
            userName,
            type,
            x: 20 + Math.random() * 60, // Random position between 20% and 80%
        };

        setReactions((prev) => [...prev, newReaction]);

        // Remove after animation completes
        setTimeout(() => {
            setReactions((prev) => prev.filter((r) => r.id !== newReaction.id));
        }, 2000);
    }, []);

    return { reactions, addReaction };
}
