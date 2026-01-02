'use client';

import { useState, useRef, useEffect } from 'react';
import { Box, Text, Badge, Avatar, Group } from '@mantine/core';
import { IconVideo, IconUsers } from '@tabler/icons-react';
import { motion, useAnimation, PanInfo } from 'framer-motion';
import chroma from 'chroma-js';
import Link from 'next/link';

interface RoomGridItem {
    id: string;
    name: string;
    topic: string;
    level: string;
    participantCount: number;
    maxParticipants: number;
    avatars: string[];
    isLive?: boolean;
}

interface RoomsGridExplorerProps {
    rooms: RoomGridItem[];
    onRoomSelect?: (room: RoomGridItem) => void;
}

// Generate color palette
const generateColors = (count: number) => {
    return chroma
        .scale(['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#43e97b'])
        .mode('lch')
        .colors(count);
};

// Clamp utility
const clamp = (value: number, min: number, max: number) => {
    return Math.min(Math.max(value, min), max);
};

// Grid Item Component
function GridItem({
    room,
    color,
    isActive,
    index,
    onClick,
}: {
    room: RoomGridItem;
    color: string;
    isActive: boolean;
    index: number;
    onClick: () => void;
}) {
    const textColor = chroma.contrast(color, '#eee') > 3.5 ? '#eee' : '#111';

    return (
        <motion.div
            onClick={onClick}
            animate={{
                opacity: isActive ? 1 : 0.4,
                scale: isActive ? 1 : 0.95,
            }}
            whileHover={{ scale: isActive ? 1.02 : 0.98 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.3 }}
            style={{
                width: 280,
                height: 380,
                padding: 8,
                cursor: 'pointer',
                flexShrink: 0,
            }}
        >
            <Box
                style={{
                    background: `linear-gradient(135deg, ${color} 0%, ${chroma(color).darken(0.5).hex()} 100%)`,
                    borderRadius: 24,
                    height: '100%',
                    padding: 20,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: isActive 
                        ? `0 20px 60px ${chroma(color).alpha(0.5).css()}`
                        : '0 8px 32px rgba(0,0,0,0.2)',
                    transition: 'box-shadow 0.3s',
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                {/* Animated gradient overlay */}
                <motion.div
                    animate={{
                        opacity: isActive ? [0.1, 0.2, 0.1] : 0,
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                    style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(45deg, transparent, rgba(255,255,255,0.3), transparent)',
                        pointerEvents: 'none',
                    }}
                />

                {/* Top Section */}
                <Box>
                    {/* Live Badge */}
                    {room.isLive && (
                        <motion.div
                            animate={{ scale: [1, 1.05, 1] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                        >
                            <Badge
                                color="red"
                                variant="filled"
                                mb="sm"
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
                                style={{
                                    background: 'rgba(255,59,48,0.9)',
                                    boxShadow: '0 4px 12px rgba(255,59,48,0.5)',
                                }}
                            >
                                LIVE
                            </Badge>
                        </motion.div>
                    )}

                    {/* Level Badge */}
                    <Badge
                        size="lg"
                        style={{
                            background: 'rgba(255,255,255,0.2)',
                            backdropFilter: 'blur(10px)',
                            color: textColor,
                        }}
                    >
                        {room.level}
                    </Badge>
                </Box>

                {/* Bottom Section */}
                <Box>
                    {/* Room Name */}
                    <Text
                        fw={800}
                        size="xl"
                        mb="xs"
                        style={{
                            color: textColor,
                            textTransform: 'uppercase',
                            letterSpacing: 1,
                        }}
                        lineClamp={2}
                    >
                        {room.name}
                    </Text>

                    {/* Topic */}
                    <Text
                        size="sm"
                        mb="md"
                        style={{ color: chroma(textColor).alpha(0.8).css() }}
                        lineClamp={2}
                    >
                        {room.topic}
                    </Text>

                    {/* Participants */}
                    <Group justify="space-between">
                        <Avatar.Group spacing="sm">
                            {room.avatars.slice(0, 3).map((avatar, i) => (
                                <Avatar
                                    key={i}
                                    src={avatar}
                                    size={32}
                                    radius="xl"
                                    style={{ border: '2px solid white' }}
                                />
                            ))}
                        </Avatar.Group>
                        <Group gap={4}>
                            <IconUsers size={14} color={textColor} />
                            <Text size="sm" fw={600} style={{ color: textColor }}>
                                {room.participantCount}/{room.maxParticipants}
                            </Text>
                        </Group>
                    </Group>
                </Box>
            </Box>
        </motion.div>
    );
}

export function RoomsGridExplorer({ rooms, onRoomSelect }: RoomsGridExplorerProps) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [gridPosition, setGridPosition] = useState({ x: 0, y: 0 });
    const containerRef = useRef<HTMLDivElement>(null);
    const controls = useAnimation();

    // Generate grid
    const gridLength = Math.ceil(Math.sqrt(rooms.length));
    const colors = generateColors(rooms.length);

    // Create matrix
    const matrix = Array.from({ length: gridLength }, (_, rowIndex) =>
        Array.from({ length: gridLength }, (_, colIndex) => {
            const index = rowIndex * gridLength + colIndex;
            return rooms[index] || null;
        })
    );

    // Item dimensions
    const itemWidth = 296; // 280 + 8*2 padding
    const itemHeight = 396; // 380 + 8*2 padding

    // Handle swipe gesture
    const handleDragEnd = (_: any, info: PanInfo) => {
        const threshold = 50;
        const velocityThreshold = 200;

        let newX = gridPosition.x;
        let newY = gridPosition.y;

        // Horizontal swipe
        if (Math.abs(info.offset.x) > threshold || Math.abs(info.velocity.x) > velocityThreshold) {
            if (info.velocity.x < -velocityThreshold || info.offset.x < -threshold) {
                newX = clamp(gridPosition.x + 1, 0, gridLength - 1);
            } else if (info.velocity.x > velocityThreshold || info.offset.x > threshold) {
                newX = clamp(gridPosition.x - 1, 0, gridLength - 1);
            }
        }

        // Vertical swipe
        if (Math.abs(info.offset.y) > threshold || Math.abs(info.velocity.y) > velocityThreshold) {
            if (info.velocity.y < -velocityThreshold || info.offset.y < -threshold) {
                newY = clamp(gridPosition.y + 1, 0, gridLength - 1);
            } else if (info.velocity.y > velocityThreshold || info.offset.y > threshold) {
                newY = clamp(gridPosition.y - 1, 0, gridLength - 1);
            }
        }

        setGridPosition({ x: newX, y: newY });
        setActiveIndex(newY * gridLength + newX);
    };

    // Handle keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            let newX = gridPosition.x;
            let newY = gridPosition.y;

            switch (e.key) {
                case 'ArrowRight':
                    newX = clamp(gridPosition.x + 1, 0, gridLength - 1);
                    break;
                case 'ArrowLeft':
                    newX = clamp(gridPosition.x - 1, 0, gridLength - 1);
                    break;
                case 'ArrowDown':
                    newY = clamp(gridPosition.y + 1, 0, gridLength - 1);
                    break;
                case 'ArrowUp':
                    newY = clamp(gridPosition.y - 1, 0, gridLength - 1);
                    break;
                case 'Enter':
                    const room = rooms[activeIndex];
                    if (room && onRoomSelect) {
                        onRoomSelect(room);
                    }
                    break;
            }

            setGridPosition({ x: newX, y: newY });
            setActiveIndex(newY * gridLength + newX);
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [gridPosition, gridLength, activeIndex, rooms, onRoomSelect]);

    // Calculate scroll offset
    const scrollX = gridPosition.x * itemWidth;
    const scrollY = gridPosition.y * itemHeight;

    return (
        <Box
            ref={containerRef}
            style={{
                width: '100%',
                height: '100vh',
                overflow: 'hidden',
                background: 'linear-gradient(180deg, #0F0F1A 0%, #1A1A2E 50%, #16213E 100%)',
                position: 'relative',
            }}
        >
            {/* Navigation hint */}
            <Box
                style={{
                    position: 'absolute',
                    top: 20,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: 100,
                    background: 'rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(10px)',
                    padding: '8px 16px',
                    borderRadius: 20,
                }}
            >
                <Text size="sm" style={{ color: 'rgba(255,255,255,0.7)' }}>
                    Vuốt hoặc dùng phím mũi tên để khám phá • Enter để tham gia
                </Text>
            </Box>

            {/* Grid indicator */}
            <Box
                style={{
                    position: 'absolute',
                    bottom: 20,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: 100,
                    display: 'flex',
                    gap: 4,
                }}
            >
                {rooms.slice(0, Math.min(rooms.length, 10)).map((_, i) => (
                    <motion.div
                        key={i}
                        animate={{
                            width: i === activeIndex ? 24 : 8,
                            background: i === activeIndex ? colors[i] : 'rgba(255,255,255,0.3)',
                        }}
                        transition={{ duration: 0.3 }}
                        style={{
                            height: 8,
                            borderRadius: 4,
                        }}
                    />
                ))}
            </Box>

            {/* Draggable Grid Container */}
            <motion.div
                drag
                dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                dragElastic={0.1}
                onDragEnd={handleDragEnd}
                animate={{
                    x: -scrollX + (typeof window !== 'undefined' ? (window.innerWidth - itemWidth) / 2 : 0),
                    y: -scrollY + (typeof window !== 'undefined' ? (window.innerHeight - itemHeight) / 2 : 0),
                }}
                transition={{
                    type: 'spring',
                    stiffness: 300,
                    damping: 30,
                }}
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: gridLength * itemWidth,
                    cursor: 'grab',
                }}
            >
                {matrix.map((row, rowIndex) => (
                    <Box key={`row-${rowIndex}`} style={{ display: 'flex' }}>
                        {row.map((room, colIndex) => {
                            if (!room) return null;
                            const index = rowIndex * gridLength + colIndex;
                            return (
                                <GridItem
                                    key={room.id}
                                    room={room}
                                    color={colors[index % colors.length]}
                                    isActive={index === activeIndex}
                                    index={index}
                                    onClick={() => {
                                        setGridPosition({ x: colIndex, y: rowIndex });
                                        setActiveIndex(index);
                                        if (onRoomSelect) {
                                            onRoomSelect(room);
                                        }
                                    }}
                                />
                            );
                        })}
                    </Box>
                ))}
            </motion.div>

            {/* Active Room CTA */}
            {rooms[activeIndex] && (
                <motion.div
                    key={activeIndex}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    style={{
                        position: 'absolute',
                        bottom: 80,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        zIndex: 100,
                    }}
                >
                    <Link href={`/rooms/${rooms[activeIndex].id}`} style={{ textDecoration: 'none' }}>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 8,
                                background: colors[activeIndex % colors.length],
                                border: 'none',
                                padding: '16px 32px',
                                borderRadius: 50,
                                cursor: 'pointer',
                                boxShadow: `0 8px 32px ${chroma(colors[activeIndex % colors.length]).alpha(0.5).css()}`,
                            }}
                        >
                            <IconVideo size={20} color="white" />
                            <Text fw={700} style={{ color: 'white' }}>
                                Tham gia ngay
                            </Text>
                        </motion.button>
                    </Link>
                </motion.div>
            )}
        </Box>
    );
}

export default RoomsGridExplorer;
