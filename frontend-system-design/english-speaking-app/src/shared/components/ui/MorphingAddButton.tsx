'use client';

import { useState } from 'react';
import { Box, Text } from '@mantine/core';
import { motion, AnimatePresence } from 'framer-motion';

interface MorphingAddButtonProps {
    size?: number;
    topLabel?: string;
    bottomLabel?: string;
    doneLabel?: string;
    onToggle?: (isAdded: boolean) => void;
    initialState?: boolean;
}

// Custom bezier easing (equivalent to Easing.bezier(0.85, 0, 0.15, 1))
const customEasing = [0.85, 0, 0.15, 1] as const;

const _ratio = 0.7;

export function MorphingAddButton({
    size = 200,
    topLabel = 'Add to',
    bottomLabel = 'Library',
    doneLabel = 'Done',
    onToggle,
    initialState = false,
}: MorphingAddButtonProps) {
    const [isAdded, setIsAdded] = useState(initialState);

    const _duration = 0.8; // seconds
    const _bigDuration = _duration * 0.6;
    const _restDuration = _duration - _bigDuration;
    const _restHeight = (size * (1 - _ratio)) / 2;
    const _lineLength = size * _ratio;

    const handleClick = () => {
        const newState = !isAdded;
        setIsAdded(newState);
        onToggle?.(newState);
    };

    return (
        <motion.div
            onClick={handleClick}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{
                cursor: 'pointer',
                width: size,
                height: size,
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: '#fff',
                borderRadius: 16,
                boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                position: 'relative',
            }}
        >
            {/* Top Label */}
            <motion.div
                animate={{
                    opacity: isAdded ? 0 : 1,
                    y: isAdded ? -_restHeight : 0,
                }}
                transition={{
                    opacity: {
                        delay: isAdded ? 0 : _bigDuration,
                        duration: _restDuration,
                        ease: customEasing,
                    },
                    y: {
                        delay: isAdded ? 0 : _bigDuration,
                        duration: _restDuration,
                        ease: customEasing,
                    },
                }}
                style={{
                    height: _restHeight,
                    width: size,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Text
                    tt="uppercase"
                    fw={300}
                    style={{
                        color: '#3C3B3C',
                        fontSize: Math.max(14, _restHeight * 0.5),
                        fontFamily: 'monospace',
                        letterSpacing: 2,
                    }}
                >
                    {topLabel}
                </Text>
            </motion.div>

            {/* Center - Plus/Check Animation */}
            <Box
                style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                {/* Vertical Line */}
                <motion.div
                    animate={{
                        width: isAdded ? size : 2,
                        height: isAdded ? size : _lineLength,
                        borderRadius: isAdded ? 0 : 1,
                    }}
                    transition={{
                        height: {
                            delay: isAdded ? 0 : _bigDuration,
                            duration: _restDuration,
                            ease: customEasing,
                        },
                        width: {
                            delay: isAdded ? _restDuration : 0,
                            duration: _bigDuration,
                            ease: customEasing,
                        },
                    }}
                    style={{
                        position: 'absolute',
                        background: '#3C3B3C',
                    }}
                />

                {/* Horizontal Line */}
                <motion.div
                    animate={{
                        width: isAdded ? 0 : _lineLength,
                        opacity: isAdded ? 0 : 1,
                    }}
                    transition={{
                        width: {
                            delay: isAdded ? 0 : _bigDuration,
                            duration: _restDuration,
                            ease: customEasing,
                        },
                        opacity: {
                            duration: 0.1,
                        },
                    }}
                    style={{
                        position: 'absolute',
                        height: 2,
                        background: '#3C3B3C',
                        borderRadius: 1,
                    }}
                />

                {/* Done Text */}
                <AnimatePresence>
                    {isAdded && (
                        <motion.div
                            key="doneText"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{
                                duration: 0.3,
                                delay: isAdded ? _duration : 0,
                                ease: customEasing,
                            }}
                            style={{
                                position: 'absolute',
                                zIndex: 10,
                            }}
                        >
                            <Text
                                tt="uppercase"
                                fw={300}
                                style={{
                                    color: '#fff',
                                    fontSize: Math.max(16, size * 0.12),
                                    fontFamily: 'monospace',
                                    letterSpacing: 3,
                                }}
                            >
                                {doneLabel}
                            </Text>
                        </motion.div>
                    )}
                </AnimatePresence>
            </Box>

            {/* Bottom Label */}
            <motion.div
                animate={{
                    opacity: isAdded ? 0 : 1,
                    y: isAdded ? _restHeight : 0,
                }}
                transition={{
                    delay: isAdded ? 0 : _bigDuration,
                    duration: _restDuration,
                    ease: customEasing,
                }}
                style={{
                    height: _restHeight,
                    width: size,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Text
                    tt="uppercase"
                    fw={300}
                    style={{
                        color: '#3C3B3C',
                        fontSize: Math.max(14, _restHeight * 0.5),
                        fontFamily: 'monospace',
                        letterSpacing: 2,
                    }}
                >
                    {bottomLabel}
                </Text>
            </motion.div>
        </motion.div>
    );
}

// ═══════════════════════════════════════════════════════════════
// Dark Theme Variant
// ═══════════════════════════════════════════════════════════════
export function MorphingAddButtonDark({
    size = 200,
    topLabel = 'Tham gia',
    bottomLabel = 'Phòng',
    doneLabel = 'Đã vào',
    onToggle,
    initialState = false,
}: MorphingAddButtonProps) {
    const [isAdded, setIsAdded] = useState(initialState);

    const _duration = 0.8;
    const _bigDuration = _duration * 0.6;
    const _restDuration = _duration - _bigDuration;
    const _restHeight = (size * (1 - _ratio)) / 2;
    const _lineLength = size * _ratio;

    const handleClick = () => {
        const newState = !isAdded;
        setIsAdded(newState);
        onToggle?.(newState);
    };

    return (
        <motion.div
            onClick={handleClick}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{
                cursor: 'pointer',
                width: size,
                height: size,
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 24,
                boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
                position: 'relative',
            }}
        >
            {/* Top Label */}
            <motion.div
                animate={{
                    opacity: isAdded ? 0 : 1,
                    y: isAdded ? -_restHeight : 0,
                }}
                transition={{
                    opacity: {
                        delay: isAdded ? 0 : _bigDuration,
                        duration: _restDuration,
                        ease: customEasing,
                    },
                    y: {
                        delay: isAdded ? 0 : _bigDuration,
                        duration: _restDuration,
                        ease: customEasing,
                    },
                }}
                style={{
                    height: _restHeight,
                    width: size,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Text
                    tt="uppercase"
                    fw={400}
                    style={{
                        color: 'rgba(255,255,255,0.7)',
                        fontSize: Math.max(14, _restHeight * 0.45),
                        letterSpacing: 2,
                    }}
                >
                    {topLabel}
                </Text>
            </motion.div>

            {/* Center */}
            <Box
                style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                {/* Vertical Line - becomes gradient background */}
                <motion.div
                    animate={{
                        width: isAdded ? size : 3,
                        height: isAdded ? size : _lineLength,
                        borderRadius: isAdded ? 24 : 2,
                    }}
                    transition={{
                        height: {
                            delay: isAdded ? 0 : _bigDuration,
                            duration: _restDuration,
                            ease: customEasing,
                        },
                        width: {
                            delay: isAdded ? _restDuration : 0,
                            duration: _bigDuration,
                            ease: customEasing,
                        },
                        borderRadius: {
                            delay: isAdded ? _restDuration : 0,
                            duration: _bigDuration,
                        },
                    }}
                    style={{
                        position: 'absolute',
                        background: isAdded 
                            ? 'linear-gradient(135deg, #667eea, #764ba2)' 
                            : 'linear-gradient(180deg, #667eea, #764ba2)',
                        boxShadow: isAdded 
                            ? '0 8px 32px rgba(102, 126, 234, 0.4)' 
                            : 'none',
                    }}
                />

                {/* Horizontal Line */}
                <motion.div
                    animate={{
                        width: isAdded ? 0 : _lineLength,
                        opacity: isAdded ? 0 : 1,
                    }}
                    transition={{
                        width: {
                            delay: isAdded ? 0 : _bigDuration,
                            duration: _restDuration,
                            ease: customEasing,
                        },
                    }}
                    style={{
                        position: 'absolute',
                        height: 3,
                        background: 'linear-gradient(90deg, #667eea, #764ba2)',
                        borderRadius: 2,
                    }}
                />

                {/* Done Text with Checkmark */}
                <AnimatePresence>
                    {isAdded && (
                        <motion.div
                            key="doneText"
                            initial={{ opacity: 0, scale: 0.5, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.5, y: -10 }}
                            transition={{
                                duration: 0.4,
                                delay: isAdded ? _duration * 0.8 : 0,
                                ease: customEasing,
                            }}
                            style={{
                                position: 'absolute',
                                zIndex: 10,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: 8,
                            }}
                        >
                            <motion.div
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{
                                    type: 'spring',
                                    stiffness: 300,
                                    damping: 15,
                                    delay: _duration * 0.9,
                                }}
                                style={{
                                    width: 48,
                                    height: 48,
                                    borderRadius: '50%',
                                    background: 'rgba(255,255,255,0.2)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: 24,
                                }}
                            >
                                ✓
                            </motion.div>
                            <Text
                                tt="uppercase"
                                fw={600}
                                style={{
                                    color: '#fff',
                                    fontSize: Math.max(14, size * 0.08),
                                    letterSpacing: 2,
                                }}
                            >
                                {doneLabel}
                            </Text>
                        </motion.div>
                    )}
                </AnimatePresence>
            </Box>

            {/* Bottom Label */}
            <motion.div
                animate={{
                    opacity: isAdded ? 0 : 1,
                    y: isAdded ? _restHeight : 0,
                }}
                transition={{
                    delay: isAdded ? 0 : _bigDuration,
                    duration: _restDuration,
                    ease: customEasing,
                }}
                style={{
                    height: _restHeight,
                    width: size,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Text
                    tt="uppercase"
                    fw={400}
                    style={{
                        color: 'rgba(255,255,255,0.7)',
                        fontSize: Math.max(14, _restHeight * 0.45),
                        letterSpacing: 2,
                    }}
                >
                    {bottomLabel}
                </Text>
            </motion.div>
        </motion.div>
    );
}

// ═══════════════════════════════════════════════════════════════
// Compact Button Variant (horizontal layout)
// ═══════════════════════════════════════════════════════════════
interface CompactMorphingButtonProps {
    label?: string;
    doneLabel?: string;
    onToggle?: (isAdded: boolean) => void;
    initialState?: boolean;
    width?: number;
}

export function CompactMorphingButton({
    label = 'Thêm vào',
    doneLabel = 'Đã thêm',
    onToggle,
    initialState = false,
    width = 160,
}: CompactMorphingButtonProps) {
    const [isAdded, setIsAdded] = useState(initialState);

    const handleClick = () => {
        const newState = !isAdded;
        setIsAdded(newState);
        onToggle?.(newState);
    };

    return (
        <motion.button
            onClick={handleClick}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{
                width,
                height: 48,
                border: 'none',
                borderRadius: 24,
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden',
                background: 'transparent',
            }}
        >
            {/* Background */}
            <motion.div
                animate={{
                    width: isAdded ? '100%' : 48,
                    background: isAdded 
                        ? 'linear-gradient(135deg, #34C759, #30D158)'
                        : 'rgba(255, 255, 255, 0.1)',
                }}
                transition={{
                    width: { duration: 0.4, ease: customEasing },
                    background: { duration: 0.3 },
                }}
                style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    height: '100%',
                    borderRadius: 24,
                    border: '1px solid rgba(255,255,255,0.1)',
                }}
            />

            {/* Plus Icon */}
            <motion.div
                animate={{
                    rotate: isAdded ? 45 : 0,
                    scale: isAdded ? 0 : 1,
                    x: isAdded ? 20 : 0,
                }}
                transition={{ duration: 0.3, ease: customEasing }}
                style={{
                    position: 'absolute',
                    left: 12,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: 24,
                    height: 24,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 20,
                    color: '#667eea',
                }}
            >
                +
            </motion.div>

            {/* Check Icon */}
            <motion.div
                animate={{
                    scale: isAdded ? 1 : 0,
                    x: isAdded ? 0 : -20,
                }}
                transition={{ duration: 0.3, ease: customEasing, delay: isAdded ? 0.2 : 0 }}
                style={{
                    position: 'absolute',
                    left: 12,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: 24,
                    height: 24,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 16,
                    color: 'white',
                }}
            >
                ✓
            </motion.div>

            {/* Label */}
            <AnimatePresence mode="wait">
                <motion.span
                    key={isAdded ? 'done' : 'add'}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    style={{
                        position: 'absolute',
                        left: 44,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: isAdded ? 'white' : 'rgba(255,255,255,0.8)',
                        fontSize: 14,
                        fontWeight: 600,
                        whiteSpace: 'nowrap',
                    }}
                >
                    {isAdded ? doneLabel : label}
                </motion.span>
            </AnimatePresence>
        </motion.button>
    );
}

export default MorphingAddButton;
