'use client';

import { useMemo, useState, useEffect, useCallback } from 'react';
import { Box, Text, TextProps } from '@mantine/core';
import { motion, AnimatePresence, Variants } from 'framer-motion';

// ═══════════════════════════════════════════════════════════════
// Animated Sentence Component
// ═══════════════════════════════════════════════════════════════
interface AnimatedSentenceProps {
    children: string;
    onEnterFinish?: (wordCount: number) => void;
    onExitFinish?: () => void;
    stagger?: number;
    fontSize?: number;
    color?: string;
    fontWeight?: number;
    className?: string;
    style?: React.CSSProperties;
    animationKey?: string | number;
}

export function AnimatedSentence({
    children,
    onEnterFinish,
    onExitFinish,
    stagger = 100,
    fontSize = 32,
    color = 'white',
    fontWeight = 700,
    className,
    style,
    animationKey,
}: AnimatedSentenceProps) {
    const words = useMemo(() => children.split(' '), [children]);
    const [completedWords, setCompletedWords] = useState(0);

    // Reset on text change
    useEffect(() => {
        setCompletedWords(0);
    }, [children]);

    // Call onEnterFinish when all words are done
    useEffect(() => {
        if (completedWords === words.length && onEnterFinish) {
            onEnterFinish(words.length);
        }
    }, [completedWords, words.length, onEnterFinish]);

    const handleWordAnimationComplete = useCallback((index: number) => {
        if (index === words.length - 1) {
            setCompletedWords(words.length);
        }
    }, [words.length]);

    const wordVariants: Variants = {
        hidden: {
            y: fontSize + 20,
            opacity: 0,
        },
        visible: (i: number) => ({
            y: 0,
            opacity: 1,
            transition: {
                type: 'spring',
                damping: 80,
                stiffness: 200,
                delay: i * (stagger / 1000),
            },
        }),
        exit: {
            opacity: 0,
            transition: {
                type: 'spring',
                damping: 80,
                stiffness: 200,
            },
        },
    };

    return (
        <Box
            key={animationKey ?? children}
            className={className}
            style={{
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'wrap',
                gap: '0.3em',
                ...style,
            }}
        >
            {words.map((word, index) => (
                <Box
                    key={`word-${index}`}
                    style={{
                        overflow: 'hidden',
                    }}
                >
                    <motion.span
                        custom={index}
                        variants={wordVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        onAnimationComplete={() => handleWordAnimationComplete(index)}
                        style={{
                            display: 'inline-block',
                            fontSize,
                            color,
                            fontWeight,
                        }}
                    >
                        {word}
                    </motion.span>
                </Box>
            ))}
        </Box>
    );
}

// ═══════════════════════════════════════════════════════════════
// Animated Sentence with AnimatePresence (for text switching)
// ═══════════════════════════════════════════════════════════════
interface AnimatedSentenceSwitchProps {
    text: string;
    fontSize?: number;
    color?: string;
    fontWeight?: number;
    stagger?: number;
    onComplete?: () => void;
}

export function AnimatedSentenceSwitch({
    text,
    fontSize = 32,
    color = 'white',
    fontWeight = 700,
    stagger = 80,
    onComplete,
}: AnimatedSentenceSwitchProps) {
    const words = useMemo(() => text.split(' '), [text]);

    const containerVariants: Variants = {
        hidden: {},
        visible: {
            transition: {
                staggerChildren: stagger / 1000,
            },
        },
        exit: {
            transition: {
                staggerChildren: stagger / 2000,
                staggerDirection: -1,
            },
        },
    };

    const wordVariants: Variants = {
        hidden: {
            y: fontSize + 20,
            opacity: 0,
        },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: 'spring',
                damping: 80,
                stiffness: 200,
            },
        },
        exit: {
            y: -(fontSize + 20),
            opacity: 0,
            transition: {
                type: 'spring',
                damping: 80,
                stiffness: 200,
            },
        },
    };

    return (
        <AnimatePresence mode="wait" onExitComplete={onComplete}>
            <motion.div
                key={text}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    gap: '0.3em',
                }}
            >
                {words.map((word, index) => (
                    <Box
                        key={`word-${index}`}
                        style={{ overflow: 'hidden' }}
                    >
                        <motion.span
                            variants={wordVariants}
                            style={{
                                display: 'inline-block',
                                fontSize,
                                color,
                                fontWeight,
                            }}
                        >
                            {word}
                        </motion.span>
                    </Box>
                ))}
            </motion.div>
        </AnimatePresence>
    );
}

// ═══════════════════════════════════════════════════════════════
// Character by Character Animation
// ═══════════════════════════════════════════════════════════════
interface AnimatedCharactersProps {
    children: string;
    stagger?: number;
    fontSize?: number;
    color?: string;
    fontWeight?: number;
    onComplete?: () => void;
}

export function AnimatedCharacters({
    children,
    stagger = 30,
    fontSize = 32,
    color = 'white',
    fontWeight = 700,
    onComplete,
}: AnimatedCharactersProps) {
    const characters = useMemo(() => children.split(''), [children]);

    const containerVariants: Variants = {
        hidden: {},
        visible: {
            transition: {
                staggerChildren: stagger / 1000,
            },
        },
    };

    const charVariants: Variants = {
        hidden: {
            y: fontSize,
            opacity: 0,
        },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: 'spring',
                damping: 50,
                stiffness: 300,
            },
        },
    };

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            onAnimationComplete={onComplete}
            style={{
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'wrap',
            }}
        >
            {characters.map((char, index) => (
                <Box
                    key={`char-${index}`}
                    style={{ overflow: 'hidden' }}
                >
                    <motion.span
                        variants={charVariants}
                        style={{
                            display: 'inline-block',
                            fontSize,
                            color,
                            fontWeight,
                            whiteSpace: 'pre',
                        }}
                    >
                        {char}
                    </motion.span>
                </Box>
            ))}
        </motion.div>
    );
}

// ═══════════════════════════════════════════════════════════════
// Typewriter Effect
// ═══════════════════════════════════════════════════════════════
interface TypewriterProps {
    text: string;
    speed?: number;
    fontSize?: number;
    color?: string;
    fontWeight?: number;
    cursor?: boolean;
    onComplete?: () => void;
}

export function Typewriter({
    text,
    speed = 50,
    fontSize = 24,
    color = 'white',
    fontWeight = 400,
    cursor = true,
    onComplete,
}: TypewriterProps) {
    const [displayedText, setDisplayedText] = useState('');
    const [isComplete, setIsComplete] = useState(false);

    useEffect(() => {
        setDisplayedText('');
        setIsComplete(false);
        
        let currentIndex = 0;
        const interval = setInterval(() => {
            if (currentIndex < text.length) {
                setDisplayedText(text.slice(0, currentIndex + 1));
                currentIndex++;
            } else {
                clearInterval(interval);
                setIsComplete(true);
                onComplete?.();
            }
        }, speed);

        return () => clearInterval(interval);
    }, [text, speed, onComplete]);

    return (
        <Box
            style={{
                fontSize,
                color,
                fontWeight,
                fontFamily: 'inherit',
            }}
        >
            {displayedText}
            {cursor && (
                <motion.span
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                    style={{
                        borderRight: `2px solid ${color}`,
                        marginLeft: 2,
                    }}
                />
            )}
        </Box>
    );
}

// ═══════════════════════════════════════════════════════════════
// Rotating Text (cycle through multiple texts)
// ═══════════════════════════════════════════════════════════════
interface RotatingTextProps {
    texts: string[];
    interval?: number;
    fontSize?: number;
    color?: string;
    fontWeight?: number;
    stagger?: number;
}

export function RotatingText({
    texts,
    interval = 3000,
    fontSize = 32,
    color = 'white',
    fontWeight = 700,
    stagger = 80,
}: RotatingTextProps) {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % texts.length);
        }, interval);

        return () => clearInterval(timer);
    }, [texts.length, interval]);

    return (
        <AnimatedSentenceSwitch
            text={texts[currentIndex]}
            fontSize={fontSize}
            color={color}
            fontWeight={fontWeight}
            stagger={stagger}
        />
    );
}

// ═══════════════════════════════════════════════════════════════
// Highlight Words Animation
// ═══════════════════════════════════════════════════════════════
interface HighlightSentenceProps {
    children: string;
    highlightWords: string[];
    highlightColor?: string;
    fontSize?: number;
    color?: string;
    fontWeight?: number;
    stagger?: number;
}

export function HighlightSentence({
    children,
    highlightWords,
    highlightColor = 'linear-gradient(135deg, #667eea, #764ba2)',
    fontSize = 32,
    color = 'white',
    fontWeight = 700,
    stagger = 100,
}: HighlightSentenceProps) {
    const words = useMemo(() => children.split(' '), [children]);

    const wordVariants: Variants = {
        hidden: {
            y: fontSize + 20,
            opacity: 0,
        },
        visible: (i: number) => ({
            y: 0,
            opacity: 1,
            transition: {
                type: 'spring',
                damping: 80,
                stiffness: 200,
                delay: i * (stagger / 1000),
            },
        }),
    };

    return (
        <Box
            style={{
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'wrap',
                gap: '0.3em',
            }}
        >
            {words.map((word, index) => {
                const isHighlighted = highlightWords.some(
                    hw => word.toLowerCase().includes(hw.toLowerCase())
                );

                return (
                    <Box
                        key={`word-${index}`}
                        style={{ overflow: 'hidden' }}
                    >
                        <motion.span
                            custom={index}
                            variants={wordVariants}
                            initial="hidden"
                            animate="visible"
                            style={{
                                display: 'inline-block',
                                fontSize,
                                color: isHighlighted ? 'transparent' : color,
                                fontWeight,
                                background: isHighlighted ? highlightColor : 'none',
                                WebkitBackgroundClip: isHighlighted ? 'text' : 'unset',
                                padding: isHighlighted ? '0 0.1em' : 0,
                            }}
                        >
                            {word}
                        </motion.span>
                    </Box>
                );
            })}
        </Box>
    );
}

export default AnimatedSentence;
