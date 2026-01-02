'use client';

import { useState } from 'react';
import { Box, Container, Group, Text, Title, Button, SegmentedControl, Stack } from '@mantine/core';
import { IconGrid3x3, IconLayoutList, IconPlus, IconSearch } from '@tabler/icons-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

import { PrivateRoute } from '@/features/auth';
import { RoomCard, RoomFilters, RoomsGridExplorer } from '@/features/rooms';
import { RoomFilters as RoomFiltersType } from '@/types';
import { trpc } from '@/trpc';
import { LoadingState, ErrorState, EmptyState } from '@/shared/components/ui/DataStates';
import { UserMenu } from '@/shared/components/ui/UserMenu';

// ═══════════════════════════════════════════════════════════════
// Category Stories (Instagram-style)
// ═══════════════════════════════════════════════════════════════
const categories = [
    { id: 'all', name: 'Tất cả', emoji: '🌟', gradient: 'linear-gradient(135deg, #667eea, #764ba2)' },
    { id: 'business', name: 'Business', emoji: '💼', gradient: 'linear-gradient(135deg, #f093fb, #f5576c)' },
    { id: 'casual', name: 'Daily Life', emoji: '☕', gradient: 'linear-gradient(135deg, #4facfe, #00f2fe)' },
    { id: 'travel', name: 'Travel', emoji: '✈️', gradient: 'linear-gradient(135deg, #43e97b, #38f9d7)' },
    { id: 'movies', name: 'Movies', emoji: '🎬', gradient: 'linear-gradient(135deg, #fa709a, #fee140)' },
    { id: 'music', name: 'Music', emoji: '🎵', gradient: 'linear-gradient(135deg, #a18cd1, #fbc2eb)' },
];

function CategoryStories() {
    return (
        <Box mb="xl">
            <Group gap="md" style={{ overflowX: 'auto', paddingBottom: 8 }} wrap="nowrap">
                {categories.map((cat, index) => (
                    <motion.div
                        key={cat.id}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Stack align="center" gap={6} style={{ cursor: 'pointer' }}>
                            <Box
                                style={{
                                    width: 70,
                                    height: 70,
                                    borderRadius: '50%',
                                    background: cat.gradient,
                                    padding: 3,
                                    boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                                }}
                            >
                                <Box
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        borderRadius: '50%',
                                        background: '#1A1A2E',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '1.8rem',
                                    }}
                                >
                                    {cat.emoji}
                                </Box>
                            </Box>
                            <Text size="xs" style={{ color: 'rgba(255,255,255,0.7)' }}>
                                {cat.name}
                            </Text>
                        </Stack>
                    </motion.div>
                ))}
            </Group>
        </Box>
    );
}

// ═══════════════════════════════════════════════════════════════
// Rooms Content with Grid/List toggle
// ═══════════════════════════════════════════════════════════════
function RoomsContent({ viewMode }: { viewMode: 'grid' | 'list' }) {
    const [filters, setFilters] = useState<RoomFiltersType>({
        search: '',
        level: 'all',
    });

    const { data: rooms, isLoading, error } = trpc.rooms.list.useQuery({});

    if (isLoading) return <LoadingState message="Đang tải phòng..." variant="dark" />;
    if (error) return <ErrorState message={error.message} variant="dark" />;

    const filteredRooms = rooms?.filter((room) => {
        const matchesQuery = room.name.toLowerCase().includes((filters.search || '').toLowerCase()) ||
            room.topic.toLowerCase().includes((filters.search || '').toLowerCase());
        const matchesLevel = filters.level === 'all' || room.level === filters.level;
        return matchesQuery && matchesLevel;
    });

    if (!filteredRooms?.length) {
        return (
            <EmptyState
                title="Không có phòng nào"
                description="Hãy tạo phòng mới hoặc thay đổi bộ lọc"
                actionLabel="Tạo phòng mới"
                actionHref="/rooms/create"
                variant="dark"
            />
        );
    }

    // Show grid explorer for grid mode
    if (viewMode === 'grid') {
        const gridRooms = filteredRooms.map(room => ({
            id: room.id,
            name: room.name,
            topic: room.topic,
            level: room.level,
            participantCount: room.participantCount,
            maxParticipants: room.maxParticipants,
            avatars: room.participants?.slice(0, 3).map(p => p.avatarUrl) || [],
            isLive: room.participants?.some(p => p.isSpeaking),
        }));

        return <RoomsGridExplorer rooms={gridRooms} />;
    }

    // List view
    return (
        <>
            <RoomFilters filters={filters} onChange={setFilters} />
            <Box
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                    gap: 24,
                }}
            >
                {filteredRooms.map((room, index) => (
                    <RoomCard key={room.id} room={room} index={index} />
                ))}
            </Box>
        </>
    );
}

// ═══════════════════════════════════════════════════════════════
// Main Page
// ═══════════════════════════════════════════════════════════════
export default function RoomsPage() {
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');

    return (
        <PrivateRoute>
            <Box
                style={{
                    minHeight: '100vh',
                    background: viewMode === 'grid' 
                        ? 'transparent' 
                        : 'linear-gradient(180deg, #0F0F1A 0%, #1A1A2E 50%, #16213E 100%)',
                }}
            >
                {/* Header - only show in list mode or always show */}
                <AnimatePresence>
                    {viewMode === 'list' && (
                        <motion.header
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            style={{
                                position: 'sticky',
                                top: 0,
                                zIndex: 100,
                                background: 'rgba(15, 15, 26, 0.8)',
                                backdropFilter: 'blur(20px)',
                                borderBottom: '1px solid rgba(255,255,255,0.1)',
                            }}
                        >
                            <Container size="xl">
                                <Group justify="space-between" h={70}>
                                    <Group gap="md">
                                        <Box
                                            style={{
                                                width: 40,
                                                height: 40,
                                                borderRadius: 12,
                                                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}
                                        >
                                            <Text size="xl">🎙️</Text>
                                        </Box>
                                        <Title order={3} style={{ color: 'white' }}>
                                            Phòng nói chuyện
                                        </Title>
                                    </Group>

                                    <Group gap="md">
                                        {/* View Mode Toggle */}
                                        <SegmentedControl
                                            value={viewMode}
                                            onChange={(val) => setViewMode(val as 'grid' | 'list')}
                                            data={[
                                                { value: 'list', label: <IconLayoutList size={18} /> },
                                                { value: 'grid', label: <IconGrid3x3 size={18} /> },
                                            ]}
                                            size="sm"
                                            styles={{
                                                root: {
                                                    background: 'rgba(255,255,255,0.1)',
                                                    border: 'none',
                                                },
                                                indicator: {
                                                    background: 'linear-gradient(135deg, #667eea, #764ba2)',
                                                },
                                                label: {
                                                    color: 'rgba(255,255,255,0.7)',
                                                    padding: '6px 12px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    '&[data-active]': {
                                                        color: 'white',
                                                    },
                                                },
                                            }}
                                        />

                                        <Link href="/rooms/create" style={{ textDecoration: 'none' }}>
                                            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                                <Button
                                                    leftSection={<IconPlus size={18} />}
                                                    radius="xl"
                                                    style={{
                                                        background: 'linear-gradient(135deg, #667eea, #764ba2)',
                                                        boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                                                    }}
                                                >
                                                    Tạo phòng
                                                </Button>
                                            </motion.div>
                                        </Link>
                                        <UserMenu />
                                    </Group>
                                </Group>
                            </Container>
                        </motion.header>
                    )}
                </AnimatePresence>

                {/* Grid view mode toggle (floating in grid mode) */}
                {viewMode === 'grid' && (
                    <Box
                        style={{
                            position: 'fixed',
                            top: 20,
                            right: 20,
                            zIndex: 200,
                        }}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                        >
                            <Group gap="sm">
                                <SegmentedControl
                                    value={viewMode}
                                    onChange={(val) => setViewMode(val as 'grid' | 'list')}
                                    data={[
                                        { value: 'list', label: <IconLayoutList size={18} /> },
                                        { value: 'grid', label: <IconGrid3x3 size={18} /> },
                                    ]}
                                    size="sm"
                                    styles={{
                                        root: {
                                            background: 'rgba(15, 15, 26, 0.9)',
                                            backdropFilter: 'blur(20px)',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                        },
                                        indicator: {
                                            background: 'linear-gradient(135deg, #667eea, #764ba2)',
                                        },
                                        label: {
                                            color: 'rgba(255,255,255,0.7)',
                                            padding: '6px 12px',
                                            display: 'flex',
                                            alignItems: 'center',
                                        },
                                    }}
                                />
                                <UserMenu />
                            </Group>
                        </motion.div>
                    </Box>
                )}

                {/* Content */}
                {viewMode === 'list' ? (
                    <Container size="xl" py="xl">
                        <CategoryStories />
                        <RoomsContent viewMode={viewMode} />
                    </Container>
                ) : (
                    <RoomsContent viewMode={viewMode} />
                )}
            </Box>
        </PrivateRoute>
    );
}
