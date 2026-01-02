'use client';

import { useState, useCallback, useMemo } from 'react';
import { Box, Text } from '@mantine/core';
import { motion, AnimatePresence } from 'framer-motion';

interface Reaction {
    id: string;
    userId: string;
    userName: string;
    type: 'raise_hand' | 'clap' | 'thumbs_up' | 'heart';
    x: number;
    // Physics properties for unique animation per reaction
    drift: number;
    wobbleSpeed: number;
    wobbleAmount: number;
    floatDuration: number;
    scale: number;
}

const REACTION_EMOJIS = {
    raise_hand: '✋',
    clap: '👏',
    thumbs_up: '👍',
    heart: '❤️',
};

// Get random physics values for natural-looking animation
function getRandomPhysics() {
    return {
        drift: (Math.random() - 0.5) * 100, // -50 to 50px horizontal drift
        wobbleSpeed: 0.5 + Math.random() * 0.5, // 0.5s to 1s per wobble
        wobbleAmount: 10 + Math.random() * 15, // 10 to 25 degrees rotation
        floatDuration: 2 + Math.random() * 1.5, // 2s to 3.5s float time
        scale: 0.9 + Math.random() * 0.4, // 0.9 to 1.3 scale
    };
}

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
                height: 250,
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
                        initial={{ 
                            y: 0, 
                            opacity: 0, 
                            scale: 0,
                            x: 0,
                        }}
                        animate={{
                            y: -200,
                            opacity: [0, 1, 1, 0.8, 0],
                            scale: [0, reaction.scale * 1.2, reaction.scale, reaction.scale * 0.9, 0],
                            x: [0, reaction.drift * 0.3, reaction.drift * 0.6, reaction.drift],
                            rotate: [0, -reaction.wobbleAmount, reaction.wobbleAmount, -reaction.wobbleAmount * 0.5, 0],
                        }}
                        exit={{
                            opacity: 0,
                            scale: 0,
                            transition: { duration: 0.2 },
                        }}
                        transition={{
                            duration: reaction.floatDuration,
                            ease: [0.25, 0.46, 0.45, 0.94], // Custom easing for natural feel
                            rotate: {
                                duration: reaction.wobbleSpeed,
                                repeat: Math.floor(reaction.floatDuration / reaction.wobbleSpeed),
                                ease: 'easeInOut',
                            },
                        }}
                    >
                        {/* Emoji with glow effect */}
                        <motion.div
                            animate={{
                                filter: [
                                    'drop-shadow(0 0 0px rgba(255,255,255,0))',
                                    'drop-shadow(0 0 10px rgba(255,255,255,0.5))',
                                    'drop-shadow(0 0 5px rgba(255,255,255,0.3))',
                                ],
                            }}
                            transition={{
                                duration: 0.5,
                                repeat: Infinity,
                                repeatType: 'reverse',
                            }}
                        >
                            <Text 
                                size="2.5rem" 
                                style={{ 
                                    lineHeight: 1,
                                    textShadow: '0 2px 10px rgba(0,0,0,0.2)',
                                }}
                            >
                                {REACTION_EMOJIS[reaction.type]}
                            </Text>
                        </motion.div>
                        
                        {/* Username with fade in/out */}
                        <motion.div
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ 
                                opacity: [0, 1, 1, 0],
                                y: [5, 0, 0, -5],
                            }}
                            transition={{
                                duration: reaction.floatDuration,
                                times: [0, 0.1, 0.7, 1],
                            }}
                        >
                            <Text 
                                size="xs" 
                                c="dimmed" 
                                fw={600}
                                style={{
                                    background: 'rgba(0,0,0,0.5)',
                                    padding: '2px 8px',
                                    borderRadius: 10,
                                    color: 'white',
                                }}
                            >
                                {reaction.userName}
                            </Text>
                        </motion.div>
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
        const physics = getRandomPhysics();
        const newReaction: Reaction = {
            id: `${Date.now()}-${Math.random()}`,
            userId,
            userName,
            type,
            x: 20 + Math.random() * 60, // Random position between 20% and 80%
            ...physics,
        };

        setReactions((prev) => [...prev, newReaction]);

        // Remove after animation completes
        setTimeout(() => {
            setReactions((prev) => prev.filter((r) => r.id !== newReaction.id));
        }, physics.floatDuration * 1000 + 200);
    }, []);

    return { reactions, addReaction };
}

