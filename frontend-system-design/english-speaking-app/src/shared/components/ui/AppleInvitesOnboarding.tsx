'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { Box, Text, Button, Stack } from '@mantine/core';
import { motion, useMotionValue, useTransform, AnimatePresence, useAnimationFrame } from 'framer-motion';
import { IconArrowRight, IconSparkles } from '@tabler/icons-react';
import Link from 'next/link';

// ═══════════════════════════════════════════════════════════════
// Configuration
// ═══════════════════════════════════════════════════════════════
const defaultImages = [
    'https://cdn.dribbble.com/users/3281732/screenshots/11192830/media/7690704fa8f0566d572a085637dd1eee.jpg?compress=1&resize=800x800',
    'https://cdn.dribbble.com/users/3281732/screenshots/13130602/media/592ccac0a949b39f058a297fd1faa38e.jpg?compress=1&resize=800x800',
    'https://cdn.dribbble.com/users/3281732/screenshots/9165292/media/ccbfbce040e1941972dbc6a378c35e98.jpg?compress=1&resize=800x800',
    'https://cdn.dribbble.com/users/3281732/screenshots/11205211/media/44c854b0a6e381340fbefe276e03e8e4.jpg?compress=1&resize=800x800',
    'https://cdn.dribbble.com/users/3281732/screenshots/7003560/media/48d5ac3503d204751a2890ba82cc42ad.jpg?compress=1&resize=800x800',
    'https://cdn.dribbble.com/users/3281732/screenshots/6727912/samji_illustrator.jpeg?compress=1&resize=800x800',
    'https://cdn.dribbble.com/users/3281732/screenshots/13661330/media/1d9d3cd01504fa3f5ae5016e5ec3a313.jpg?compress=1&resize=800x800',
];

// ═══════════════════════════════════════════════════════════════
// Carousel Item Component
// ═══════════════════════════════════════════════════════════════
interface CarouselItemProps {
    image: string;
    index: number;
    offset: number;
    itemWidth: number;
    itemHeight: number;
    itemSize: number;
    totalItems: number;
    screenWidth: number;
}

function CarouselItem({
    image,
    index,
    offset,
    itemWidth,
    itemHeight,
    itemSize,
    totalItems,
    screenWidth,
}: CarouselItemProps) {
    // Calculate rotation based on position
    const calculateRotation = () => {
        const itemPosition = itemSize * index - screenWidth - itemSize / 2;
        const totalSize = itemSize * totalItems;
        const range = ((itemPosition - (offset + totalSize * 1000)) % totalSize) + screenWidth + itemSize / 2;
        
        // Interpolate rotation: -3deg at left, 0 at center, +3deg at right
        const inputStart = -itemSize;
        const inputMid = (screenWidth - itemWidth) / 2;
        const inputEnd = screenWidth;
        
        if (range <= inputMid) {
            return -3 * (1 - (range - inputStart) / (inputMid - inputStart));
        } else {
            return 3 * ((range - inputMid) / (inputEnd - inputMid));
        }
    };

    const rotation = calculateRotation();

    return (
        <motion.div
            initial={{ opacity: 0, y: -itemHeight / 2 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                duration: 1.5,
                delay: 0.5 + index * 0.1,
                type: 'spring',
                stiffness: 100,
                damping: 15,
            }}
            style={{
                width: itemWidth,
                height: itemHeight,
                flexShrink: 0,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                transform: `rotate(${rotation}deg)`,
            }}
        >
            <Box
                style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: 16,
                    overflow: 'hidden',
                    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.4)',
                    backgroundImage: `url(${image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            />
        </motion.div>
    );
}

// ═══════════════════════════════════════════════════════════════
// Apple Invites Onboarding Component
// ═══════════════════════════════════════════════════════════════
interface AppleInvitesOnboardingProps {
    images?: string[];
    title?: string;
    subtitle?: string;
    description?: string;
    highlightText?: string;
    buttonText?: string;
    buttonHref?: string;
    speed?: number;
    onButtonClick?: () => void;
}

export function AppleInvitesOnboarding({
    images = defaultImages,
    title = 'English Speaking App',
    subtitle = 'Chào mừng bạn đến với',
    description = 'Nâng cao kỹ năng nói tiếng Anh với hơn',
    highlightText = '500+',
    buttonText = 'Bắt đầu ngay',
    buttonHref = '/rooms',
    speed = 30,
    onButtonClick,
}: AppleInvitesOnboardingProps) {
    const [screenWidth, setScreenWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
    const [activeIndex, setActiveIndex] = useState(0);
    const offsetRef = useRef(0);
    const [offset, setOffset] = useState(0);

    // Responsive sizing
    const itemWidth = Math.min(screenWidth * 0.62, 400);
    const itemHeight = itemWidth * 1.67;
    const itemSize = itemWidth + 16;

    // Handle resize
    useEffect(() => {
        const handleResize = () => setScreenWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Animation loop
    useAnimationFrame((time, delta) => {
        offsetRef.current += (delta / 1000) * speed;
        setOffset(offsetRef.current);
        
        // Calculate active index
        const newIndex = Math.floor(
            ((offsetRef.current + screenWidth / 2) / itemSize) % images.length
        );
        if (newIndex !== activeIndex && newIndex >= 0) {
            setActiveIndex(newIndex);
        }
    });

    // Duplicate images for seamless loop
    const duplicatedImages = [...images, ...images, ...images];

    return (
        <Box
            style={{
                position: 'relative',
                minHeight: '100vh',
                background: '#000',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 24,
            }}
        >
            {/* Blurred Background */}
            <AnimatePresence mode="sync">
                <motion.div
                    key={`bg-${activeIndex}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.5 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1 }}
                    style={{
                        position: 'absolute',
                        inset: 0,
                        backgroundImage: `url(${images[activeIndex]})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        filter: 'blur(50px)',
                    }}
                />
            </AnimatePresence>

            {/* Carousel Container */}
            <Box
                style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'flex-end',
                    paddingBottom: 40,
                    overflow: 'hidden',
                    width: '100%',
                }}
            >
                <Box
                    style={{
                        display: 'flex',
                        gap: 16,
                        transform: `translateX(${-offset}px)`,
                    }}
                >
                    {duplicatedImages.map((image, index) => (
                        <CarouselItem
                            key={`item-${index}`}
                            image={image}
                            index={index % images.length}
                            offset={offset}
                            itemWidth={itemWidth}
                            itemHeight={itemHeight}
                            itemSize={itemSize}
                            totalItems={images.length}
                            screenWidth={screenWidth}
                        />
                    ))}
                </Box>
            </Box>

            {/* Content Section with Stagger */}
            <Box
                style={{
                    flex: 0.5,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                    paddingBottom: 60,
                    position: 'relative',
                    zIndex: 10,
                }}
            >
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.0, duration: 0.5 }}
                >
                    <Text
                        fw={500}
                        style={{ color: 'rgba(255,255,255,0.6)' }}
                    >
                        {subtitle}
                    </Text>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.1, duration: 0.5 }}
                >
                    <Text
                        size="xl"
                        fw={700}
                        style={{
                            color: 'white',
                            fontSize: 'clamp(24px, 5vw, 32px)',
                            marginBottom: 16,
                        }}
                    >
                        {title}
                    </Text>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2, duration: 0.5 }}
                >
                    <Text
                        ta="center"
                        px="xl"
                        style={{ color: 'rgba(255,255,255,0.8)' }}
                        maw={400}
                    >
                        {description}{' '}
                        <Text span fw={700} style={{ color: 'white' }}>
                            {highlightText}
                        </Text>{' '}
                        phòng học trực tuyến.
                    </Text>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.3, duration: 0.5 }}
                    style={{ marginTop: 24 }}
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
                                onClick={onButtonClick}
                                style={{
                                    background: 'linear-gradient(135deg, #667eea, #764ba2)',
                                    paddingLeft: 24,
                                    paddingRight: 24,
                                    height: 52,
                                    boxShadow: '0 8px 32px rgba(102, 126, 234, 0.4)',
                                }}
                            >
                                {buttonText}
                            </Button>
                        </motion.div>
                    </Link>
                </motion.div>
            </Box>
        </Box>
    );
}

// ═══════════════════════════════════════════════════════════════
// Rotating Gallery (Standalone variant)
// ═══════════════════════════════════════════════════════════════
interface RotatingGalleryProps {
    images: string[];
    speed?: number;
    itemWidth?: number;
    gap?: number;
}

export function RotatingGallery({
    images,
    speed = 30,
    itemWidth = 280,
    gap = 16,
}: RotatingGalleryProps) {
    const [offset, setOffset] = useState(0);
    const offsetRef = useRef(0);
    const itemHeight = itemWidth * 1.5;
    const itemSize = itemWidth + gap;

    useAnimationFrame((time, delta) => {
        offsetRef.current += (delta / 1000) * speed;
        setOffset(offsetRef.current);
    });

    const duplicatedImages = [...images, ...images, ...images];

    return (
        <Box
            style={{
                overflow: 'hidden',
                height: itemHeight + 40,
                display: 'flex',
                alignItems: 'center',
            }}
        >
            <Box
                style={{
                    display: 'flex',
                    gap,
                    transform: `translateX(${-offset}px)`,
                }}
            >
                {duplicatedImages.map((image, index) => {
                    // Simple rotation based on position
                    const position = (index * itemSize - offset) % (images.length * itemSize);
                    const normalizedPos = position / (images.length * itemSize);
                    const rotation = Math.sin(normalizedPos * Math.PI * 2) * 3;

                    return (
                        <motion.div
                            key={`gallery-${index}`}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            style={{
                                width: itemWidth,
                                height: itemHeight,
                                flexShrink: 0,
                                transform: `rotate(${rotation}deg)`,
                            }}
                        >
                            <Box
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    borderRadius: 12,
                                    overflow: 'hidden',
                                    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.3)',
                                    backgroundImage: `url(${image})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                }}
                            />
                        </motion.div>
                    );
                })}
            </Box>
        </Box>
    );
}

// ═══════════════════════════════════════════════════════════════
// Stagger Text Component
// ═══════════════════════════════════════════════════════════════
interface StaggerTextProps {
    lines: string[];
    delay?: number;
    stagger?: number;
    fontSize?: number;
    color?: string;
    fontWeight?: number;
    centered?: boolean;
}

export function StaggerText({
    lines,
    delay = 0,
    stagger = 100,
    fontSize = 16,
    color = 'white',
    fontWeight = 400,
    centered = true,
}: StaggerTextProps) {
    return (
        <Box
            style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 6,
                alignItems: centered ? 'center' : 'flex-start',
            }}
        >
            {lines.map((line, index) => (
                <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                        delay: delay + index * (stagger / 1000),
                        duration: 0.5,
                    }}
                >
                    <Text
                        style={{
                            fontSize,
                            color,
                            fontWeight,
                            textAlign: centered ? 'center' : 'left',
                        }}
                    >
                        {line}
                    </Text>
                </motion.div>
            ))}
        </Box>
    );
}

export default AppleInvitesOnboarding;
