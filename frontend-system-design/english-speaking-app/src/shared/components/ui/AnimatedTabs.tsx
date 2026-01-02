'use client';

import { useState, ReactNode } from 'react';
import { Box, Text, UnstyledButton } from '@mantine/core';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { 
    IconHome, 
    IconUsers, 
    IconTrophy, 
    IconSettings, 
    IconUser,
    IconMessage,
    IconBell,
    IconSearch,
    IconHeart,
    IconBookmark,
    IconProps,
} from '@tabler/icons-react';

// ═══════════════════════════════════════════════════════════════
// Types
// ═══════════════════════════════════════════════════════════════
type TabItem = {
    icon: React.ComponentType<IconProps>;
    label: string;
};

interface AnimatedTabsProps {
    data: TabItem[];
    selectedIndex?: number;
    onChange?: (index: number) => void;
    activeColor?: string;
    inactiveColor?: string;
    activeBackgroundColor?: string;
    inactiveBackgroundColor?: string;
}

// ═══════════════════════════════════════════════════════════════
// Configuration
// ═══════════════════════════════════════════════════════════════
const _spacing = 4;

const springConfig = {
    type: 'spring' as const,
    damping: 80,
    stiffness: 200,
};

// ═══════════════════════════════════════════════════════════════
// Animated Tabs Component
// ═══════════════════════════════════════════════════════════════
export function AnimatedTabs({
    data,
    selectedIndex = 0,
    onChange,
    activeColor = '#fff',
    inactiveColor = '#999',
    activeBackgroundColor = '#111',
    inactiveBackgroundColor = '#ddd',
}: AnimatedTabsProps) {
    return (
        <Box
            style={{
                display: 'flex',
                flexDirection: 'row',
                gap: _spacing,
            }}
        >
            <LayoutGroup>
                {data.map((item, index) => {
                    const isSelected = index === selectedIndex;
                    const Icon = item.icon;

                    return (
                        <motion.div
                            key={`${item.label}-${index}`}
                            layout
                            transition={springConfig}
                            animate={{
                                backgroundColor: isSelected 
                                    ? activeBackgroundColor 
                                    : inactiveBackgroundColor,
                            }}
                            style={{
                                borderRadius: 8,
                                overflow: 'hidden',
                            }}
                        >
                            <UnstyledButton
                                onClick={() => onChange?.(index)}
                                style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    gap: _spacing,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    padding: _spacing * 3,
                                }}
                            >
                                <motion.div
                                    animate={{
                                        color: isSelected ? activeColor : inactiveColor,
                                    }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <Icon size={18} />
                                </motion.div>

                                <AnimatePresence mode="popLayout">
                                    {isSelected && (
                                        <motion.span
                                            initial={{ opacity: 0, width: 0 }}
                                            animate={{ opacity: 1, width: 'auto' }}
                                            exit={{ opacity: 0, width: 0 }}
                                            transition={springConfig}
                                            style={{
                                                color: activeColor,
                                                fontWeight: 600,
                                                fontSize: 14,
                                                whiteSpace: 'nowrap',
                                                overflow: 'hidden',
                                            }}
                                        >
                                            {item.label}
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </UnstyledButton>
                        </motion.div>
                    );
                })}
            </LayoutGroup>
        </Box>
    );
}

// ═══════════════════════════════════════════════════════════════
// Dark Theme Variant
// ═══════════════════════════════════════════════════════════════
interface AnimatedTabsDarkProps extends Omit<AnimatedTabsProps, 'activeColor' | 'inactiveColor' | 'activeBackgroundColor' | 'inactiveBackgroundColor'> {
    gradientColors?: [string, string];
}

export function AnimatedTabsDark({
    data,
    selectedIndex = 0,
    onChange,
    gradientColors = ['#667eea', '#764ba2'],
}: AnimatedTabsDarkProps) {
    return (
        <Box
            style={{
                display: 'flex',
                flexDirection: 'row',
                gap: _spacing,
                background: 'rgba(255, 255, 255, 0.05)',
                padding: _spacing,
                borderRadius: 12,
                backdropFilter: 'blur(10px)',
            }}
        >
            <LayoutGroup>
                {data.map((item, index) => {
                    const isSelected = index === selectedIndex;
                    const Icon = item.icon;

                    return (
                        <motion.div
                            key={`${item.label}-${index}`}
                            layout
                            transition={springConfig}
                            style={{
                                borderRadius: 8,
                                overflow: 'hidden',
                                position: 'relative',
                            }}
                        >
                            {/* Background for selected */}
                            {isSelected && (
                                <motion.div
                                    layoutId="tab-background"
                                    transition={springConfig}
                                    style={{
                                        position: 'absolute',
                                        inset: 0,
                                        background: `linear-gradient(135deg, ${gradientColors[0]}, ${gradientColors[1]})`,
                                        borderRadius: 8,
                                    }}
                                />
                            )}

                            <UnstyledButton
                                onClick={() => onChange?.(index)}
                                style={{
                                    position: 'relative',
                                    display: 'flex',
                                    flexDirection: 'row',
                                    gap: _spacing * 2,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    padding: `${_spacing * 2}px ${_spacing * 3}px`,
                                }}
                            >
                                <motion.div
                                    animate={{
                                        color: isSelected ? '#fff' : 'rgba(255,255,255,0.5)',
                                    }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <Icon size={18} />
                                </motion.div>

                                <AnimatePresence mode="popLayout">
                                    {isSelected && (
                                        <motion.span
                                            initial={{ opacity: 0, width: 0 }}
                                            animate={{ opacity: 1, width: 'auto' }}
                                            exit={{ opacity: 0, width: 0 }}
                                            transition={springConfig}
                                            style={{
                                                color: '#fff',
                                                fontWeight: 600,
                                                fontSize: 14,
                                                whiteSpace: 'nowrap',
                                                overflow: 'hidden',
                                            }}
                                        >
                                            {item.label}
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </UnstyledButton>
                        </motion.div>
                    );
                })}
            </LayoutGroup>
        </Box>
    );
}

// ═══════════════════════════════════════════════════════════════
// Pill Tabs Variant
// ═══════════════════════════════════════════════════════════════
export function AnimatedPillTabs({
    data,
    selectedIndex = 0,
    onChange,
}: AnimatedTabsProps) {
    return (
        <Box
            style={{
                display: 'flex',
                flexDirection: 'row',
                gap: _spacing,
                background: 'rgba(255, 255, 255, 0.1)',
                padding: _spacing,
                borderRadius: 100,
            }}
        >
            <LayoutGroup>
                {data.map((item, index) => {
                    const isSelected = index === selectedIndex;
                    const Icon = item.icon;

                    return (
                        <motion.div
                            key={`${item.label}-${index}`}
                            layout
                            transition={springConfig}
                            style={{
                                borderRadius: 100,
                                overflow: 'hidden',
                                position: 'relative',
                            }}
                        >
                            {isSelected && (
                                <motion.div
                                    layoutId="pill-background"
                                    transition={springConfig}
                                    style={{
                                        position: 'absolute',
                                        inset: 0,
                                        background: '#fff',
                                        borderRadius: 100,
                                    }}
                                />
                            )}

                            <UnstyledButton
                                onClick={() => onChange?.(index)}
                                style={{
                                    position: 'relative',
                                    display: 'flex',
                                    flexDirection: 'row',
                                    gap: _spacing * 2,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    padding: `${_spacing * 2}px ${_spacing * 4}px`,
                                }}
                            >
                                <motion.div
                                    animate={{
                                        color: isSelected ? '#000' : 'rgba(255,255,255,0.7)',
                                    }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <Icon size={16} />
                                </motion.div>

                                <AnimatePresence mode="popLayout">
                                    {isSelected && (
                                        <motion.span
                                            initial={{ opacity: 0, width: 0 }}
                                            animate={{ opacity: 1, width: 'auto' }}
                                            exit={{ opacity: 0, width: 0 }}
                                            transition={springConfig}
                                            style={{
                                                color: '#000',
                                                fontWeight: 600,
                                                fontSize: 13,
                                                whiteSpace: 'nowrap',
                                                overflow: 'hidden',
                                            }}
                                        >
                                            {item.label}
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </UnstyledButton>
                        </motion.div>
                    );
                })}
            </LayoutGroup>
        </Box>
    );
}

// ═══════════════════════════════════════════════════════════════
// Bottom Navigation Variant
// ═══════════════════════════════════════════════════════════════
export function AnimatedBottomNav({
    data,
    selectedIndex = 0,
    onChange,
}: AnimatedTabsProps) {
    return (
        <Box
            style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-around',
                alignItems: 'center',
                background: 'rgba(15, 15, 26, 0.95)',
                backdropFilter: 'blur(20px)',
                padding: `${_spacing * 2}px ${_spacing * 4}px`,
                borderRadius: 20,
                border: '1px solid rgba(255,255,255,0.1)',
            }}
        >
            {data.map((item, index) => {
                const isSelected = index === selectedIndex;
                const Icon = item.icon;

                return (
                    <UnstyledButton
                        key={`${item.label}-${index}`}
                        onClick={() => onChange?.(index)}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: 4,
                            padding: _spacing * 2,
                            minWidth: 60,
                        }}
                    >
                        <motion.div
                            animate={{
                                scale: isSelected ? 1.15 : 1,
                                y: isSelected ? -4 : 0,
                            }}
                            transition={springConfig}
                        >
                            <motion.div
                                animate={{
                                    color: isSelected ? '#667eea' : 'rgba(255,255,255,0.5)',
                                }}
                            >
                                <Icon size={22} />
                            </motion.div>
                        </motion.div>

                        <AnimatePresence>
                            {isSelected && (
                                <motion.span
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 5 }}
                                    transition={{ duration: 0.2 }}
                                    style={{
                                        fontSize: 10,
                                        fontWeight: 600,
                                        color: '#667eea',
                                    }}
                                >
                                    {item.label}
                                </motion.span>
                            )}
                        </AnimatePresence>

                        {/* Indicator dot */}
                        <motion.div
                            animate={{
                                scale: isSelected ? 1 : 0,
                                opacity: isSelected ? 1 : 0,
                            }}
                            transition={springConfig}
                            style={{
                                width: 4,
                                height: 4,
                                borderRadius: 2,
                                background: '#667eea',
                                marginTop: 2,
                            }}
                        />
                    </UnstyledButton>
                );
            })}
        </Box>
    );
}

// ═══════════════════════════════════════════════════════════════
// Default Export with preset tabs
// ═══════════════════════════════════════════════════════════════
const defaultTabs: TabItem[] = [
    { icon: IconHome, label: 'Home' },
    { icon: IconUsers, label: 'Rooms' },
    { icon: IconTrophy, label: 'Quests' },
    { icon: IconUser, label: 'Profile' },
];

export { defaultTabs };
export default AnimatedTabs;
