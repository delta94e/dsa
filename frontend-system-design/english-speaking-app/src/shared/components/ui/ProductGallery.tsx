'use client';

import { useState, useRef, useEffect } from 'react';
import { Box, Text, Stack, ScrollArea, Button, Group, Badge } from '@mantine/core';
import { motion, useScroll, useTransform, useMotionValue, AnimatePresence } from 'framer-motion';
import { IconChevronUp, IconChevronDown, IconHeart, IconShare, IconBookmark } from '@tabler/icons-react';

// ═══════════════════════════════════════════════════════════════
// Configuration
// ═══════════════════════════════════════════════════════════════
const DOT_SIZE = 8;
const DOT_SPACING = 8;

// ═══════════════════════════════════════════════════════════════
// Animated Dot Indicator
// ═══════════════════════════════════════════════════════════════
interface DotIndicatorProps {
    count: number;
    activeIndex: number;
    direction?: 'vertical' | 'horizontal';
    dotColor?: string;
    activeColor?: string;
}

export function DotIndicator({
    count,
    activeIndex,
    direction = 'vertical',
    dotColor = 'rgba(255,255,255,0.3)',
    activeColor = 'white',
}: DotIndicatorProps) {
    const isVertical = direction === 'vertical';
    const translateAmount = activeIndex * (DOT_SIZE + DOT_SPACING);

    return (
        <Box
            style={{
                position: 'relative',
                display: 'flex',
                flexDirection: isVertical ? 'column' : 'row',
                gap: DOT_SPACING,
            }}
        >
            {/* Static dots */}
            {Array.from({ length: count }).map((_, i) => (
                <Box
                    key={i}
                    style={{
                        width: DOT_SIZE,
                        height: DOT_SIZE,
                        borderRadius: DOT_SIZE / 2,
                        background: dotColor,
                    }}
                />
            ))}

            {/* Animated ring indicator */}
            <motion.div
                animate={{
                    [isVertical ? 'y' : 'x']: translateAmount,
                }}
                transition={{
                    type: 'spring',
                    damping: 20,
                    stiffness: 300,
                }}
                style={{
                    position: 'absolute',
                    top: -DOT_SIZE / 2,
                    left: -DOT_SIZE / 2,
                    width: DOT_SIZE * 2,
                    height: DOT_SIZE * 2,
                    borderRadius: DOT_SIZE,
                    border: `2px solid ${activeColor}`,
                }}
            />
        </Box>
    );
}

// ═══════════════════════════════════════════════════════════════
// Product Gallery Component
// ═══════════════════════════════════════════════════════════════
interface ProductGalleryProps {
    images: string[];
    height?: number | string;
    showIndicator?: boolean;
    onIndexChange?: (index: number) => void;
}

export function ProductGallery({
    images,
    height = '75vh',
    showIndicator = true,
    onIndexChange,
}: ProductGalleryProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [itemHeight, setItemHeight] = useState(0);

    // Calculate item height
    useEffect(() => {
        if (containerRef.current) {
            setItemHeight(containerRef.current.offsetHeight);
        }
    }, []);

    // Handle scroll
    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        if (itemHeight === 0) return;
        const scrollTop = e.currentTarget.scrollTop;
        const newIndex = Math.round(scrollTop / itemHeight);
        if (newIndex !== activeIndex && newIndex >= 0 && newIndex < images.length) {
            setActiveIndex(newIndex);
            onIndexChange?.(newIndex);
        }
    };

    return (
        <Box
            ref={containerRef}
            style={{
                position: 'relative',
                height,
                overflow: 'hidden',
            }}
        >
            {/* Images Container */}
            <Box
                onScroll={handleScroll}
                style={{
                    height: '100%',
                    overflowY: 'auto',
                    scrollSnapType: 'y mandatory',
                    scrollBehavior: 'smooth',
                }}
                // Hide scrollbar
                className="hide-scrollbar"
            >
                {images.map((image, index) => (
                    <Box
                        key={index}
                        style={{
                            height: '100%',
                            width: '100%',
                            scrollSnapAlign: 'start',
                            scrollSnapStop: 'always',
                        }}
                    >
                        <Box
                            style={{
                                height: '100%',
                                width: '100%',
                                backgroundImage: `url(${image})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                            }}
                        />
                    </Box>
                ))}
            </Box>

            {/* Dot Indicator */}
            {showIndicator && (
                <Box
                    style={{
                        position: 'absolute',
                        left: 20,
                        top: '50%',
                        transform: 'translateY(-50%)',
                    }}
                >
                    <DotIndicator
                        count={images.length}
                        activeIndex={activeIndex}
                        direction="vertical"
                    />
                </Box>
            )}

            {/* CSS for hiding scrollbar */}
            <style jsx global>{`
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .hide-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </Box>
    );
}

// ═══════════════════════════════════════════════════════════════
// Product Detail Page (Full Layout)
// ═══════════════════════════════════════════════════════════════
interface ProductDetailsProps {
    title: string;
    price: string;
    description: string;
    specs?: string;
    badges?: string[];
}

interface ProductPageProps {
    images: string[];
    details: ProductDetailsProps;
    onAddToCart?: () => void;
    onFavorite?: () => void;
}

export function ProductPage({
    images,
    details,
    onAddToCart,
    onFavorite,
}: ProductPageProps) {
    const [sheetOpen, setSheetOpen] = useState(false);
    const [sheetHeight, setSheetHeight] = useState(180);
    const [activeImageIndex, setActiveImageIndex] = useState(0);

    const snapPoints = [180, 350, 600];
    const currentSnapIndex = snapPoints.indexOf(sheetHeight);

    const handleSheetToggle = () => {
        const nextIndex = (currentSnapIndex + 1) % snapPoints.length;
        setSheetHeight(snapPoints[nextIndex]);
    };

    return (
        <Box style={{ position: 'relative', height: '100vh', background: '#000' }}>
            {/* Gallery */}
            <ProductGallery
                images={images}
                height={`calc(100vh - ${sheetHeight}px)`}
                onIndexChange={setActiveImageIndex}
            />

            {/* Bottom Sheet */}
            <motion.div
                animate={{ height: sheetHeight }}
                transition={{
                    type: 'spring',
                    damping: 30,
                    stiffness: 300,
                }}
                style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background: 'white',
                    borderTopLeftRadius: 20,
                    borderTopRightRadius: 20,
                    overflow: 'hidden',
                }}
            >
                {/* Handle */}
                <Box
                    onClick={handleSheetToggle}
                    style={{
                        padding: 12,
                        display: 'flex',
                        justifyContent: 'center',
                        cursor: 'pointer',
                    }}
                >
                    <Box
                        style={{
                            width: 40,
                            height: 4,
                            background: '#ddd',
                            borderRadius: 2,
                        }}
                    />
                </Box>

                {/* Content */}
                <ScrollArea style={{ height: sheetHeight - 20 }} px="lg">
                    <Stack gap="sm" pb="xl">
                        {/* Title & Price */}
                        <Box>
                            <Text fw={800} size="lg" c="dark">
                                {details.title}
                            </Text>
                            <Text fw={600} size="md" c="dark">
                                {details.price}
                            </Text>
                        </Box>

                        {/* Badges */}
                        {details.badges && details.badges.length > 0 && (
                            <Group gap="xs">
                                {details.badges.map((badge, i) => (
                                    <Badge key={i} variant="light" color="dark" size="sm">
                                        {badge}
                                    </Badge>
                                ))}
                            </Group>
                        )}

                        {/* Description */}
                        <Text size="sm" c="dimmed">
                            {details.description}
                        </Text>

                        {/* Specs */}
                        {details.specs && (
                            <Text size="sm" c="dimmed">
                                {details.specs}
                            </Text>
                        )}

                        {/* Actions */}
                        <Group gap="sm" mt="md">
                            <Button
                                flex={1}
                                color="dark"
                                onClick={onAddToCart}
                            >
                                Thêm vào giỏ
                            </Button>
                            <Button
                                variant="light"
                                color="dark"
                                onClick={onFavorite}
                            >
                                <IconHeart size={18} />
                            </Button>
                            <Button variant="light" color="dark">
                                <IconShare size={18} />
                            </Button>
                        </Group>
                    </Stack>
                </ScrollArea>
            </motion.div>
        </Box>
    );
}

// ═══════════════════════════════════════════════════════════════
// Room Preview Gallery (Speaking App variant)
// ═══════════════════════════════════════════════════════════════
interface RoomPreviewImage {
    url: string;
    caption?: string;
}

interface RoomPreviewGalleryProps {
    images: RoomPreviewImage[];
    roomName: string;
    roomTopic: string;
    participantCount: number;
    maxParticipants: number;
    level: string;
    onJoin?: () => void;
}

const levelColors: Record<string, string> = {
    A1: '#22c55e',
    A2: '#84cc16',
    B1: '#eab308',
    B2: '#f97316',
    C1: '#ef4444',
    C2: '#a855f7',
};

export function RoomPreviewGallery({
    images,
    roomName,
    roomTopic,
    participantCount,
    maxParticipants,
    level,
    onJoin,
}: RoomPreviewGalleryProps) {
    const [activeIndex, setActiveIndex] = useState(0);
    const levelColor = levelColors[level] || '#667eea';

    return (
        <Box style={{ position: 'relative', height: '100vh', background: '#0F0F1A' }}>
            {/* Gallery */}
            <ProductGallery
                images={images.map(img => img.url)}
                height="65vh"
                onIndexChange={setActiveIndex}
            />

            {/* Caption overlay */}
            <AnimatePresence mode="wait">
                {images[activeIndex]?.caption && (
                    <motion.div
                        key={activeIndex}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        style={{
                            position: 'absolute',
                            top: 'calc(65vh - 60px)',
                            left: 0,
                            right: 0,
                            padding: '0 20px',
                        }}
                    >
                        <Text
                            size="sm"
                            c="white"
                            ta="center"
                            style={{
                                background: 'rgba(0,0,0,0.5)',
                                backdropFilter: 'blur(10px)',
                                padding: '8px 16px',
                                borderRadius: 8,
                                display: 'inline-block',
                            }}
                        >
                            {images[activeIndex].caption}
                        </Text>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Room Details */}
            <Box
                style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '35vh',
                    background: 'linear-gradient(to top, #0F0F1A, rgba(15,15,26,0.95))',
                    padding: 24,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                }}
            >
                <Stack gap="md">
                    <Group justify="space-between" align="flex-start">
                        <Box>
                            <Badge
                                size="lg"
                                style={{ background: levelColor }}
                                mb="xs"
                            >
                                {level}
                            </Badge>
                            <Text fw={700} size="xl" c="white">
                                {roomName}
                            </Text>
                            <Text c="dimmed" size="md">
                                {roomTopic}
                            </Text>
                        </Box>
                        <Button variant="subtle" color="gray">
                            <IconBookmark size={20} />
                        </Button>
                    </Group>

                    <Group gap="md">
                        <Box
                            style={{
                                background: 'rgba(255,255,255,0.1)',
                                padding: '8px 16px',
                                borderRadius: 8,
                            }}
                        >
                            <Text size="xs" c="dimmed">Người tham gia</Text>
                            <Text fw={600} c="white">
                                {participantCount}/{maxParticipants}
                            </Text>
                        </Box>
                        <Box
                            style={{
                                background: 'rgba(255,255,255,0.1)',
                                padding: '8px 16px',
                                borderRadius: 8,
                            }}
                        >
                            <Text size="xs" c="dimmed">Trạng thái</Text>
                            <Text fw={600} c="#4ade80">
                                🟢 Đang mở
                            </Text>
                        </Box>
                    </Group>
                </Stack>

                <Button
                    size="lg"
                    fullWidth
                    onClick={onJoin}
                    style={{
                        background: `linear-gradient(135deg, ${levelColor}, ${levelColor}dd)`,
                    }}
                >
                    Tham gia phòng
                </Button>
            </Box>
        </Box>
    );
}

export default ProductGallery;
