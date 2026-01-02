'use client';

import { useState, useRef, useMemo, useEffect } from 'react';
import { Box, Text, Group, Stack, Avatar, Badge, ScrollArea, Paper } from '@mantine/core';
import { motion, useMotionValue, useTransform, AnimatePresence, useAnimationFrame } from 'framer-motion';
import { IconChevronUp, IconTrendingUp, IconTrendingDown, IconUsers, IconMicrophone } from '@tabler/icons-react';

// ═══════════════════════════════════════════════════════════════
// Configuration
// ═══════════════════════════════════════════════════════════════
const colors = {
    red: 'rgb(255, 99, 105)',
    green: 'rgb(76, 195, 138)',
    lightGray: 'rgba(255,255,255,0.3)',
};

// ═══════════════════════════════════════════════════════════════
// SparkLine Component (using SVG)
// ═══════════════════════════════════════════════════════════════
interface SparkLineProps {
    data: number[];
    width?: number;
    height?: number;
    color?: string;
    strokeWidth?: number;
    showGradient?: boolean;
}

export function SparkLine({
    data,
    width = 90,
    height = 40,
    color = colors.green,
    strokeWidth = 2,
    showGradient = true,
}: SparkLineProps) {
    const points = useMemo(() => {
        if (data.length === 0) return '';
        
        const min = Math.min(...data);
        const max = Math.max(...data);
        const range = max - min || 1;
        
        return data.map((value, index) => {
            const x = (index / (data.length - 1)) * width;
            const y = height - ((value - min) / range) * (height - 10) - 5;
            return `${x},${y}`;
        }).join(' ');
    }, [data, width, height]);

    const areaPoints = useMemo(() => {
        if (data.length === 0) return '';
        
        const min = Math.min(...data);
        const max = Math.max(...data);
        const range = max - min || 1;
        
        const linePoints = data.map((value, index) => {
            const x = (index / (data.length - 1)) * width;
            const y = height - ((value - min) / range) * (height - 10) - 5;
            return `${x},${y}`;
        });
        
        return `0,${height} ${linePoints.join(' ')} ${width},${height}`;
    }, [data, width, height]);

    const gradientId = useMemo(() => `sparkGradient-${Math.random().toString(36).slice(2)}`, []);

    return (
        <svg width={width} height={height} style={{ overflow: 'visible' }}>
            {showGradient && (
                <defs>
                    <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={color} stopOpacity={0.5} />
                        <stop offset="50%" stopColor={color} stopOpacity={0.2} />
                        <stop offset="100%" stopColor={color} stopOpacity={0} />
                    </linearGradient>
                </defs>
            )}
            {showGradient && (
                <polygon
                    points={areaPoints}
                    fill={`url(#${gradientId})`}
                />
            )}
            <polyline
                points={points}
                fill="none"
                stroke={color}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

// ═══════════════════════════════════════════════════════════════
// Marquee Ticker Component
// ═══════════════════════════════════════════════════════════════
interface TickerItem {
    id: string;
    symbol: string;
    name: string;
    image: string;
    currentValue: number;
    change: number;
    changePercent: number;
    sparklineData: number[];
}

interface MarqueeTickerProps {
    items: TickerItem[];
    speed?: number;
    gap?: number;
}

export function MarqueeTicker({ items, speed = 30, gap = 40 }: MarqueeTickerProps) {
    const baseX = useMotionValue(0);
    const [contentWidth, setContentWidth] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (containerRef.current) {
            const firstChild = containerRef.current.querySelector('[data-ticker-content]');
            if (firstChild) {
                setContentWidth(firstChild.scrollWidth / 2);
            }
        }
    }, [items]);

    useAnimationFrame((time, delta) => {
        if (contentWidth === 0) return;
        
        let newX = baseX.get() - (delta / 1000) * speed;
        if (newX <= -contentWidth) {
            newX = 0;
        }
        baseX.set(newX);
    });

    const duplicatedItems = [...items, ...items];

    return (
        <Box
            ref={containerRef}
            style={{
                overflow: 'hidden',
                height: 80,
                display: 'flex',
                alignItems: 'center',
            }}
        >
            <motion.div
                data-ticker-content
                style={{
                    x: baseX,
                    display: 'flex',
                    gap,
                }}
            >
                {duplicatedItems.map((item, index) => (
                    <Box
                        key={`${item.id}-${index}`}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 10,
                            flexShrink: 0,
                        }}
                    >
                        <Avatar src={item.image} size={40} radius="xl" />
                        <Stack gap={0}>
                            <Text fw={700} size="md" c="white">
                                {item.symbol.toUpperCase()}
                            </Text>
                            <Text size="sm" c="white">
                                {item.currentValue.toFixed(2)}
                            </Text>
                            <Text
                                size="xs"
                                c={item.change < 0 ? colors.red : colors.green}
                            >
                                {item.change >= 0 ? '+' : ''}{item.change.toFixed(2)}
                            </Text>
                        </Stack>
                        <SparkLine
                            data={item.sparklineData}
                            color={item.change < 0 ? colors.red : colors.green}
                            width={70}
                            height={35}
                        />
                    </Box>
                ))}
            </motion.div>
        </Box>
    );
}

// ═══════════════════════════════════════════════════════════════
// Bottom Sheet Component
// ═══════════════════════════════════════════════════════════════
interface BottomSheetProps {
    children: React.ReactNode;
    snapPoints?: number[];
    initialSnap?: number;
    headerContent?: React.ReactNode;
    onSnapChange?: (snapIndex: number) => void;
}

export function BottomSheet({
    children,
    snapPoints = [160, 400, 600],
    initialSnap = 0,
    headerContent,
    onSnapChange,
}: BottomSheetProps) {
    const [currentSnap, setCurrentSnap] = useState(initialSnap);
    const sheetHeight = snapPoints[currentSnap];

    const handleSnapChange = (direction: 'up' | 'down') => {
        let newSnap = currentSnap;
        if (direction === 'up' && currentSnap < snapPoints.length - 1) {
            newSnap = currentSnap + 1;
        } else if (direction === 'down' && currentSnap > 0) {
            newSnap = currentSnap - 1;
        }
        setCurrentSnap(newSnap);
        onSnapChange?.(newSnap);
    };

    return (
        <motion.div
            animate={{ height: sheetHeight }}
            transition={{
                type: 'spring',
                damping: 30,
                stiffness: 300,
            }}
            style={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                background: '#333',
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                zIndex: 100,
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            {/* Handle */}
            <Box
                onClick={() => handleSnapChange('up')}
                style={{
                    padding: 12,
                    display: 'flex',
                    justifyContent: 'center',
                    cursor: 'pointer',
                }}
            >
                <motion.div
                    animate={{ rotate: currentSnap === snapPoints.length - 1 ? 180 : 0 }}
                    onClick={(e) => {
                        e.stopPropagation();
                        handleSnapChange(currentSnap === snapPoints.length - 1 ? 'down' : 'up');
                    }}
                >
                    <Box
                        style={{
                            width: 40,
                            height: 4,
                            background: '#999',
                            borderRadius: 2,
                        }}
                    />
                </motion.div>
            </Box>

            {/* Header */}
            {headerContent && (
                <Box px="md" pb="sm">
                    {headerContent}
                </Box>
            )}

            {/* Content */}
            <ScrollArea style={{ flex: 1 }} px="md">
                {children}
            </ScrollArea>
        </motion.div>
    );
}

// ═══════════════════════════════════════════════════════════════
// Stats Dashboard (Room Activity Variant)
// ═══════════════════════════════════════════════════════════════
interface RoomStats {
    id: string;
    name: string;
    topic: string;
    avatar: string;
    participantCount: number;
    maxParticipants: number;
    activeMinutes: number;
    trend: number; // percentage change
    activityData: number[];
    isLive: boolean;
}

interface RoomStatsDashboardProps {
    rooms: RoomStats[];
    showMarquee?: boolean;
}

export function RoomStatsDashboard({ rooms, showMarquee = true }: RoomStatsDashboardProps) {
    const [sheetExpanded, setSheetExpanded] = useState(false);

    // Convert rooms to ticker items
    const tickerItems: TickerItem[] = rooms.slice(0, 6).map(room => ({
        id: room.id,
        symbol: room.name.slice(0, 4),
        name: room.name,
        image: room.avatar,
        currentValue: room.participantCount,
        change: room.trend,
        changePercent: room.trend,
        sparklineData: room.activityData,
    }));

    return (
        <Box
            style={{
                minHeight: '100vh',
                background: '#000',
                paddingTop: 50,
            }}
        >
            {/* Header Section */}
            <Box style={{ height: 80, position: 'relative' }}>
                {/* Marquee (visible when collapsed) */}
                <AnimatePresence>
                    {showMarquee && sheetExpanded && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            style={{ height: 80 }}
                        >
                            <MarqueeTicker items={tickerItems} />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Title (visible when expanded) */}
                <AnimatePresence>
                    {!sheetExpanded && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                paddingLeft: 16,
                                paddingTop: 8,
                            }}
                        >
                            <Text fw={700} size="xl" c="white">
                                Phòng học đang hoạt động
                            </Text>
                            <Text fw={500} size="md" c="dimmed">
                                {new Date().toLocaleDateString('vi-VN', { 
                                    day: 'numeric', 
                                    month: 'long' 
                                })}
                            </Text>
                        </motion.div>
                    )}
                </AnimatePresence>
            </Box>

            {/* Room List */}
            <ScrollArea style={{ height: 'calc(100vh - 130px - 160px)' }} px="md">
                <Stack gap="md">
                    {rooms.map((room) => (
                        <RoomStatsItem key={room.id} room={room} />
                    ))}
                </Stack>
            </ScrollArea>

            {/* Bottom Sheet */}
            <BottomSheet
                snapPoints={[160, 400]}
                onSnapChange={(snap) => setSheetExpanded(snap > 0)}
                headerContent={
                    <Text fw={800} size="xl" c="white">
                        Tin tức mới
                    </Text>
                }
            >
                <Stack gap="md" pb="xl">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <Box
                            key={i}
                            p="md"
                            style={{
                                background: 'rgba(255,255,255,0.1)',
                                borderRadius: 16,
                            }}
                        >
                            <Text size="sm" c="white" fw={500}>
                                Cập nhật mới #{i + 1}
                            </Text>
                            <Text size="xs" c="dimmed">
                                Thông báo từ hệ thống về các tính năng mới...
                            </Text>
                        </Box>
                    ))}
                </Stack>
            </BottomSheet>
        </Box>
    );
}

// ═══════════════════════════════════════════════════════════════
// Room Stats Item
// ═══════════════════════════════════════════════════════════════
function RoomStatsItem({ room }: { room: RoomStats }) {
    const trendColor = room.trend >= 0 ? colors.green : colors.red;
    const TrendIcon = room.trend >= 0 ? IconTrendingUp : IconTrendingDown;

    return (
        <Box
            p="sm"
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                borderRadius: 12,
                background: 'rgba(255,255,255,0.05)',
            }}
        >
            {/* Avatar */}
            <Box style={{ position: 'relative' }}>
                <Avatar src={room.avatar} size={40} radius="xl" />
                {room.isLive && (
                    <Box
                        style={{
                            position: 'absolute',
                            bottom: -2,
                            right: -2,
                            width: 14,
                            height: 14,
                            borderRadius: '50%',
                            background: colors.green,
                            border: '2px solid #000',
                        }}
                    />
                )}
            </Box>

            {/* Info */}
            <Box style={{ flex: 1 }}>
                <Text fw={500} c="white" size="md" lineClamp={1}>
                    {room.name}
                </Text>
                <Text c={colors.lightGray} size="sm" lineClamp={1}>
                    {room.topic}
                </Text>
            </Box>

            {/* Sparkline */}
            <SparkLine
                data={room.activityData}
                color={trendColor}
                width={70}
                height={35}
            />

            {/* Stats */}
            <Stack gap={0} align="flex-end">
                <Group gap={4}>
                    <IconUsers size={14} color="white" />
                    <Text c="white" size="sm">
                        {room.participantCount}/{room.maxParticipants}
                    </Text>
                </Group>
                <Group gap={4}>
                    <TrendIcon size={12} color={trendColor} />
                    <Text c={trendColor} size="xs">
                        {room.trend >= 0 ? '+' : ''}{room.trend}%
                    </Text>
                </Group>
            </Stack>
        </Box>
    );
}

export default RoomStatsDashboard;
