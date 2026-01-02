'use client';

import { useState } from 'react';
import { Box, Text, Group, Stack, Badge } from '@mantine/core';
import { motion, AnimatePresence } from 'framer-motion';
import { IconMapPin, IconClock, IconUsers } from '@tabler/icons-react';

// ═══════════════════════════════════════════════════════════════
// Configuration
// ═══════════════════════════════════════════════════════════════
const _spacing = 12;

// Demo data
const defaultData = [
    {
        key: '1',
        title: 'Krabi, Thailand',
        subtitle: '9 ngày',
        image: 'https://images.unsplash.com/photo-1483683804023-6ccdb62f86ef?w=800',
        color: '#0C212D',
    },
    {
        key: '2',
        title: 'Bucharest, Romania',
        subtitle: '6 ngày',
        image: 'https://images.unsplash.com/photo-1584646098378-0874589d76b1?w=800',
        color: '#8B4513',
    },
    {
        key: '3',
        title: 'Iceland',
        subtitle: '5 ngày',
        image: 'https://images.unsplash.com/photo-1504893524553-b855bce32c67?w=800',
        color: '#2F4F4F',
    },
    {
        key: '4',
        title: 'Dresden, Germany',
        subtitle: '6 ngày',
        image: 'https://images.unsplash.com/photo-1502631868851-1717aca1be29?w=800',
        color: '#0C1C28',
    },
];

// ═══════════════════════════════════════════════════════════════
// Expanding Carousel Component
// ═══════════════════════════════════════════════════════════════
interface CarouselItem {
    key: string;
    title: string;
    subtitle: string;
    image: string;
    color: string;
}

interface ExpandingCarouselProps {
    items?: CarouselItem[];
    height?: number | string;
    onSelect?: (item: CarouselItem, index: number) => void;
}

export function ExpandingCarousel({
    items = defaultData,
    height = 400,
    onSelect,
}: ExpandingCarouselProps) {
    const [selectedIndex, setSelectedIndex] = useState(0);

    const handleSelect = (item: CarouselItem, index: number) => {
        setSelectedIndex(index);
        onSelect?.(item, index);
    };

    return (
        <Box
            style={{
                display: 'flex',
                flexDirection: 'row',
                gap: _spacing,
                height,
                padding: _spacing,
                background: '#ecf0f1',
                borderRadius: _spacing * 2,
            }}
        >
            {items.map((item, index) => {
                const isSelected = selectedIndex === index;
                
                return (
                    <motion.div
                        key={item.key}
                        animate={{
                            flex: isSelected ? items.length - 1 : 1,
                        }}
                        transition={{
                            type: 'tween',
                            duration: 0.5,
                            ease: [0.4, 0, 0.2, 1],
                        }}
                        onClick={() => handleSelect(item, index)}
                        style={{
                            borderRadius: _spacing * 2,
                            overflow: 'hidden',
                            cursor: 'pointer',
                            position: 'relative',
                            minWidth: 60,
                        }}
                    >
                        {/* Background Image */}
                        <Box
                            style={{
                                position: 'absolute',
                                inset: 0,
                                backgroundImage: `url(${item.image})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                            }}
                        />
                        
                        {/* Gradient Overlay */}
                        <Box
                            style={{
                                position: 'absolute',
                                inset: 0,
                                background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%)',
                            }}
                        />

                        {/* Content */}
                        <Box
                            style={{
                                position: 'relative',
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'flex-end',
                                padding: _spacing,
                            }}
                        >
                            <Group gap="sm" align="center" wrap="nowrap">
                                {/* Color Circle Indicator */}
                                <motion.div
                                    animate={{
                                        backgroundColor: isSelected ? item.color : '#fff',
                                        scale: isSelected ? 1 : 0.8,
                                    }}
                                    transition={{
                                        type: 'tween',
                                        duration: 0.3,
                                    }}
                                    style={{
                                        width: 40,
                                        height: 40,
                                        borderRadius: '50%',
                                        flexShrink: 0,
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                                    }}
                                />

                                {/* Text Content */}
                                <AnimatePresence>
                                    {isSelected && (
                                        <motion.div
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            transition={{ duration: 0.3, delay: 0.1 }}
                                            style={{ overflow: 'hidden' }}
                                        >
                                            <Text
                                                fw={700}
                                                size="lg"
                                                style={{
                                                    color: 'white',
                                                    whiteSpace: 'nowrap',
                                                    textShadow: '0 2px 4px rgba(0,0,0,0.5)',
                                                }}
                                            >
                                                {item.title}
                                            </Text>
                                            <motion.div
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ duration: 0.3, delay: 0.15 }}
                                            >
                                                <Text
                                                    size="sm"
                                                    style={{
                                                        color: 'rgba(255,255,255,0.8)',
                                                        whiteSpace: 'nowrap',
                                                    }}
                                                >
                                                    {item.subtitle}
                                                </Text>
                                            </motion.div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </Group>
                        </Box>
                    </motion.div>
                );
            })}
        </Box>
    );
}

// ═══════════════════════════════════════════════════════════════
// Room Carousel Variant (for speaking rooms)
// ═══════════════════════════════════════════════════════════════
interface RoomCarouselItem {
    id: string;
    name: string;
    topic: string;
    level: string;
    participantCount: number;
    maxParticipants: number;
    image: string;
    isLive?: boolean;
}

interface RoomExpandingCarouselProps {
    rooms: RoomCarouselItem[];
    height?: number | string;
    onSelectRoom?: (room: RoomCarouselItem) => void;
}

const levelColors: Record<string, string> = {
    A1: '#22c55e',
    A2: '#84cc16',
    B1: '#eab308',
    B2: '#f97316',
    C1: '#ef4444',
    C2: '#a855f7',
};

export function RoomExpandingCarousel({
    rooms,
    height = 450,
    onSelectRoom,
}: RoomExpandingCarouselProps) {
    const [selectedIndex, setSelectedIndex] = useState(0);

    return (
        <Box
            style={{
                display: 'flex',
                flexDirection: 'row',
                gap: _spacing,
                height,
                padding: _spacing,
                background: 'rgba(255,255,255,0.05)',
                backdropFilter: 'blur(20px)',
                borderRadius: _spacing * 2,
                border: '1px solid rgba(255,255,255,0.1)',
            }}
        >
            {rooms.map((room, index) => {
                const isSelected = selectedIndex === index;
                const levelColor = levelColors[room.level] || '#667eea';
                
                return (
                    <motion.div
                        key={room.id}
                        animate={{
                            flex: isSelected ? rooms.length : 1,
                        }}
                        transition={{
                            type: 'tween',
                            duration: 0.5,
                            ease: [0.4, 0, 0.2, 1],
                        }}
                        onClick={() => {
                            setSelectedIndex(index);
                            onSelectRoom?.(room);
                        }}
                        style={{
                            borderRadius: _spacing * 2,
                            overflow: 'hidden',
                            cursor: 'pointer',
                            position: 'relative',
                            minWidth: 60,
                        }}
                    >
                        {/* Background Image */}
                        <Box
                            style={{
                                position: 'absolute',
                                inset: 0,
                                backgroundImage: `url(${room.image})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                            }}
                        />
                        
                        {/* Gradient Overlay */}
                        <Box
                            style={{
                                position: 'absolute',
                                inset: 0,
                                background: `linear-gradient(to top, ${levelColor}CC 0%, ${levelColor}66 30%, transparent 70%)`,
                            }}
                        />

                        {/* Live Badge */}
                        {room.isLive && (
                            <Box
                                style={{
                                    position: 'absolute',
                                    top: _spacing,
                                    right: _spacing,
                                }}
                            >
                                <Badge
                                    color="red"
                                    size="sm"
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

                        {/* Content */}
                        <Box
                            style={{
                                position: 'relative',
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'flex-end',
                                padding: _spacing,
                            }}
                        >
                            <Group gap="sm" align="flex-end" wrap="nowrap">
                                {/* Level Circle */}
                                <motion.div
                                    animate={{
                                        backgroundColor: isSelected ? 'white' : levelColor,
                                        scale: isSelected ? 1.1 : 1,
                                    }}
                                    transition={{ duration: 0.3 }}
                                    style={{
                                        width: 44,
                                        height: 44,
                                        borderRadius: '50%',
                                        flexShrink: 0,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                                    }}
                                >
                                    <Text
                                        fw={700}
                                        size="sm"
                                        style={{
                                            color: isSelected ? levelColor : 'white',
                                        }}
                                    >
                                        {room.level}
                                    </Text>
                                </motion.div>

                                {/* Room Info */}
                                <AnimatePresence>
                                    {isSelected && (
                                        <motion.div
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            transition={{ duration: 0.3, delay: 0.1 }}
                                            style={{ flex: 1, minWidth: 0 }}
                                        >
                                            <Text
                                                fw={700}
                                                size="lg"
                                                lineClamp={1}
                                                style={{
                                                    color: 'white',
                                                    textShadow: '0 2px 4px rgba(0,0,0,0.5)',
                                                }}
                                            >
                                                {room.name}
                                            </Text>
                                            
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.15 }}
                                            >
                                                <Text
                                                    size="sm"
                                                    lineClamp={1}
                                                    style={{
                                                        color: 'rgba(255,255,255,0.8)',
                                                        marginBottom: 8,
                                                    }}
                                                >
                                                    {room.topic}
                                                </Text>
                                            </motion.div>

                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.2 }}
                                            >
                                                <Group gap="xs">
                                                    <Badge
                                                        variant="light"
                                                        color="gray"
                                                        size="sm"
                                                        leftSection={<IconUsers size={12} />}
                                                    >
                                                        {room.participantCount}/{room.maxParticipants}
                                                    </Badge>
                                                </Group>
                                            </motion.div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </Group>
                        </Box>
                    </motion.div>
                );
            })}
        </Box>
    );
}

// ═══════════════════════════════════════════════════════════════
// Vertical Expanding List
// ═══════════════════════════════════════════════════════════════
interface VerticalExpandingListProps {
    items: CarouselItem[];
    width?: number | string;
    onSelect?: (item: CarouselItem, index: number) => void;
}

export function VerticalExpandingList({
    items = defaultData,
    width = '100%',
    onSelect,
}: VerticalExpandingListProps) {
    const [selectedIndex, setSelectedIndex] = useState(0);

    return (
        <Box
            style={{
                display: 'flex',
                flexDirection: 'column',
                gap: _spacing,
                width,
                padding: _spacing,
                background: 'rgba(255,255,255,0.05)',
                backdropFilter: 'blur(20px)',
                borderRadius: _spacing * 2,
                border: '1px solid rgba(255,255,255,0.1)',
            }}
        >
            {items.map((item, index) => {
                const isSelected = selectedIndex === index;
                
                return (
                    <motion.div
                        key={item.key}
                        animate={{
                            flex: isSelected ? items.length - 1 : 1,
                        }}
                        transition={{
                            type: 'tween',
                            duration: 0.5,
                            ease: [0.4, 0, 0.2, 1],
                        }}
                        onClick={() => {
                            setSelectedIndex(index);
                            onSelect?.(item, index);
                        }}
                        style={{
                            borderRadius: _spacing * 2,
                            overflow: 'hidden',
                            cursor: 'pointer',
                            position: 'relative',
                            minHeight: 60,
                        }}
                    >
                        {/* Background */}
                        <Box
                            style={{
                                position: 'absolute',
                                inset: 0,
                                backgroundImage: `url(${item.image})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                            }}
                        />
                        
                        <Box
                            style={{
                                position: 'absolute',
                                inset: 0,
                                background: 'linear-gradient(to right, rgba(0,0,0,0.7) 0%, transparent 70%)',
                            }}
                        />

                        {/* Content */}
                        <Box
                            style={{
                                position: 'relative',
                                height: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                padding: _spacing * 1.5,
                            }}
                        >
                            <Group gap="md" wrap="nowrap">
                                <motion.div
                                    animate={{
                                        backgroundColor: isSelected ? item.color : '#fff',
                                        scale: isSelected ? 1.1 : 1,
                                    }}
                                    transition={{ duration: 0.3 }}
                                    style={{
                                        width: 48,
                                        height: 48,
                                        borderRadius: '50%',
                                        flexShrink: 0,
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                                    }}
                                />

                                <AnimatePresence>
                                    {isSelected && (
                                        <motion.div
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <Text fw={700} size="xl" c="white">
                                                {item.title}
                                            </Text>
                                            <Text size="md" c="dimmed">
                                                {item.subtitle}
                                            </Text>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </Group>
                        </Box>
                    </motion.div>
                );
            })}
        </Box>
    );
}

export default ExpandingCarousel;
