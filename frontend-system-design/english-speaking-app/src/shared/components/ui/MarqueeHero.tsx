'use client';

import { useRef, useEffect, useState } from 'react';
import { Box, Text, Button, Group, Stack, Avatar, Badge } from '@mantine/core';
import { IconSparkles, IconArrowRight } from '@tabler/icons-react';
import { motion, useAnimationFrame, useMotionValue, useTransform } from 'framer-motion';
import Link from 'next/link';

// ═══════════════════════════════════════════════════════════════
// Configuration
// ═══════════════════════════════════════════════════════════════
const _bgColor = '#0C0820';
const _buttonColor = '#8F38FE';
const _itemSize = 180;
const _spacing = 12;
const _initialDelay = 0.2;
const _duration = 0.5;

// Mock data - room thumbnails/user avatars
const mockImages = [
    'https://api.dicebear.com/7.x/avataaars/svg?seed=1',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=2',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=3',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=4',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=5',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=6',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=7',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=8',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=9',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=10',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=11',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=12',
];

// Chunk array for rows
function chunkArray<T>(array: T[], size: number): T[][] {
    const chunked: T[][] = [];
    let index = 0;
    while (index < array.length) {
        chunked.push(array.slice(index, size + index));
        index += size;
    }
    return chunked;
}

// ═══════════════════════════════════════════════════════════════
// Marquee Row Component
// ═══════════════════════════════════════════════════════════════
interface MarqueeRowProps {
    images: string[];
    reverse?: boolean;
    speed?: number;
    rowIndex: number;
}

function MarqueeRow({ images, reverse = false, speed = 30, rowIndex }: MarqueeRowProps) {
    const baseX = useMotionValue(0);
    const [contentWidth, setContentWidth] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);

    // Calculate content width
    useEffect(() => {
        const width = images.length * (_itemSize + _spacing);
        setContentWidth(width);
    }, [images.length]);

    // Animation loop
    useAnimationFrame((time, delta) => {
        if (contentWidth === 0) return;
        
        const moveBy = (delta / 1000) * speed;
        let newX = baseX.get() + (reverse ? moveBy : -moveBy);
        
        // Reset when one full content width has scrolled
        if (!reverse && newX <= -contentWidth) {
            newX = 0;
        } else if (reverse && newX >= 0) {
            newX = -contentWidth;
        }
        
        baseX.set(newX);
    });

    // Duplicate images for seamless loop
    const duplicatedImages = [...images, ...images];

    return (
        <Box
            ref={containerRef}
            style={{
                overflow: 'hidden',
                width: '100%',
            }}
        >
            <motion.div
                style={{
                    x: baseX,
                    display: 'flex',
                    gap: _spacing,
                }}
            >
                {duplicatedImages.map((image, index) => (
                    <motion.div
                        key={`${rowIndex}-${index}`}
                        initial={{ 
                            opacity: 0, 
                            x: reverse ? -50 : 50,
                        }}
                        animate={{ 
                            opacity: 1, 
                            x: 0,
                        }}
                        transition={{
                            duration: _duration,
                            delay: _initialDelay * (rowIndex + 1) + Math.random() * 0.1,
                        }}
                        style={{
                            width: _itemSize,
                            height: _itemSize,
                            borderRadius: _spacing,
                            overflow: 'hidden',
                            flexShrink: 0,
                            background: 'linear-gradient(135deg, rgba(143, 56, 254, 0.3), rgba(102, 126, 234, 0.3))',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            position: 'relative',
                        }}
                    >
                        {/* Avatar */}
                        <Avatar 
                            src={image} 
                            size={_itemSize - 20}
                            radius="md"
                        />
                        
                        {/* Live indicator (random) */}
                        {index % 3 === 0 && (
                            <Box
                                style={{
                                    position: 'absolute',
                                    top: 8,
                                    right: 8,
                                }}
                            >
                                <Badge
                                    size="xs"
                                    color="red"
                                    leftSection={
                                        <motion.div
                                            animate={{ opacity: [1, 0.5, 1] }}
                                            transition={{ duration: 1, repeat: Infinity }}
                                            style={{
                                                width: 6,
                                                height: 6,
                                                borderRadius: '50%',
                                                background: 'white',
                                            }}
                                        />
                                    }
                                >
                                    LIVE
                                </Badge>
                            </Box>
                        )}
                    </motion.div>
                ))}
            </motion.div>
        </Box>
    );
}

// ═══════════════════════════════════════════════════════════════
// Marquee Hero Component
// ═══════════════════════════════════════════════════════════════
interface MarqueeHeroProps {
    title?: React.ReactNode;
    subtitle?: string;
    buttonText?: string;
    buttonHref?: string;
    images?: string[];
}

export function MarqueeHero({
    title,
    subtitle = 'Kết nối với người học tiếng Anh từ khắp nơi trên thế giới.',
    buttonText = 'Bắt đầu ngay',
    buttonHref = '/rooms',
    images = mockImages,
}: MarqueeHeroProps) {
    const rows = chunkArray(images, Math.ceil(images.length / 3));

    return (
        <Box
            style={{
                position: 'relative',
                minHeight: '100vh',
                background: _bgColor,
                overflow: 'hidden',
            }}
        >
            {/* Marquee Background */}
            <Box
                style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: _spacing,
                    transform: 'rotate(-4deg) scale(1.1)',
                    transformOrigin: 'center center',
                    paddingTop: 100,
                }}
            >
                {rows.map((row, index) => (
                    <MarqueeRow
                        key={index}
                        images={row}
                        reverse={index % 2 !== 0}
                        speed={20 + index * 5}
                        rowIndex={index}
                    />
                ))}
            </Box>

            {/* Top Gradient Overlay */}
            <Box
                style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    top: 0,
                    height: '25%',
                    background: `linear-gradient(to bottom, ${_bgColor} 0%, ${_bgColor} 30%, transparent 100%)`,
                    pointerEvents: 'none',
                    zIndex: 10,
                }}
            />

            {/* Bottom Gradient Overlay */}
            <Box
                style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    bottom: 0,
                    height: '50%',
                    background: `linear-gradient(to top, ${_bgColor} 0%, ${_bgColor} 60%, transparent 100%)`,
                    pointerEvents: 'none',
                    zIndex: 10,
                }}
            />

            {/* Content */}
            <Box
                style={{
                    position: 'relative',
                    zIndex: 20,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    minHeight: '100vh',
                    paddingBottom: 80,
                }}
            >
                <Stack align="center" gap="md" px="md">
                    {/* Title */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                            type: 'spring',
                            damping: 12,
                            delay: _initialDelay + 0.1,
                        }}
                    >
                        {title || (
                            <Text
                                ta="center"
                                style={{
                                    fontSize: 'clamp(28px, 5vw, 42px)',
                                    color: 'white',
                                    lineHeight: 1.2,
                                }}
                            >
                                Nâng cao{' '}
                                <Text
                                    span
                                    fw={700}
                                    style={{
                                        background: 'linear-gradient(135deg, #8F38FE, #667eea)',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                    }}
                                >
                                    Kỹ năng{'\n'}Nói tiếng Anh
                                </Text>
                                {' '}của bạn
                            </Text>
                        )}
                    </motion.div>

                    {/* Subtitle */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                            type: 'spring',
                            damping: 12,
                            delay: _initialDelay + 0.2,
                        }}
                    >
                        <Text
                            ta="center"
                            maw={400}
                            style={{
                                color: 'rgba(255,255,255,0.5)',
                            }}
                        >
                            {subtitle}
                        </Text>
                    </motion.div>

                    {/* CTA Button */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                            type: 'spring',
                            damping: 12,
                            delay: _initialDelay + 0.3,
                        }}
                        style={{ marginTop: 16 }}
                    >
                        <Link href={buttonHref} style={{ textDecoration: 'none' }}>
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Button
                                    size="lg"
                                    radius="xl"
                                    leftSection={<IconSparkles size={20} />}
                                    rightSection={<IconArrowRight size={18} />}
                                    style={{
                                        background: _buttonColor,
                                        paddingLeft: 24,
                                        paddingRight: 24,
                                        height: 52,
                                        boxShadow: `0 8px 32px ${_buttonColor}66`,
                                    }}
                                >
                                    {buttonText}
                                </Button>
                            </motion.div>
                        </Link>
                    </motion.div>

                    {/* Social Proof */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                            type: 'spring',
                            damping: 12,
                            delay: _initialDelay + 0.4,
                        }}
                        style={{ marginTop: 24 }}
                    >
                        <Group gap="xs" justify="center">
                            <Avatar.Group spacing="sm">
                                {mockImages.slice(0, 5).map((img, i) => (
                                    <Avatar
                                        key={i}
                                        src={img}
                                        size={36}
                                        radius="xl"
                                        style={{ border: '2px solid ' + _bgColor }}
                                    />
                                ))}
                            </Avatar.Group>
                            <Text size="sm" c="dimmed">
                                <Text span fw={600} c="white">500+</Text> người đang online
                            </Text>
                        </Group>
                    </motion.div>
                </Stack>
            </Box>
        </Box>
    );
}

// ═══════════════════════════════════════════════════════════════
// Compact Marquee (for section backgrounds)
// ═══════════════════════════════════════════════════════════════
interface CompactMarqueeProps {
    items: React.ReactNode[];
    speed?: number;
    reverse?: boolean;
    gap?: number;
}

export function CompactMarquee({ 
    items, 
    speed = 30, 
    reverse = false,
    gap = 16 
}: CompactMarqueeProps) {
    const baseX = useMotionValue(0);
    const [contentWidth, setContentWidth] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (containerRef.current) {
            const firstChild = containerRef.current.firstElementChild;
            if (firstChild) {
                setContentWidth(firstChild.scrollWidth / 2);
            }
        }
    }, [items]);

    useAnimationFrame((time, delta) => {
        if (contentWidth === 0) return;
        
        const moveBy = (delta / 1000) * speed;
        let newX = baseX.get() + (reverse ? moveBy : -moveBy);
        
        if (!reverse && newX <= -contentWidth) {
            newX = 0;
        } else if (reverse && newX >= 0) {
            newX = -contentWidth;
        }
        
        baseX.set(newX);
    });

    const duplicatedItems = [...items, ...items];

    return (
        <Box
            ref={containerRef}
            style={{ overflow: 'hidden', width: '100%' }}
        >
            <motion.div
                style={{
                    x: baseX,
                    display: 'flex',
                    gap,
                }}
            >
                {duplicatedItems.map((item, index) => (
                    <Box key={index} style={{ flexShrink: 0 }}>
                        {item}
                    </Box>
                ))}
            </motion.div>
        </Box>
    );
}

export default MarqueeHero;
