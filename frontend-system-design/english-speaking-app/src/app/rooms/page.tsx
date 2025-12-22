'use client';

import { useState } from 'react';
import { SimpleGrid, Button } from '@mantine/core';
import { IconPlus, IconRobot } from '@tabler/icons-react';
import Link from 'next/link';

import { RoomCard, RoomFilters } from '@/features/rooms';
import { PrivateRoute } from '@/features/auth';
import { PageLayout, PageHeader } from '@/shared/components/layout/PageLayout';
import { LoadingState, ErrorState, EmptyState } from '@/shared/components/ui/DataStates';
import { trpc } from '@/trpc';
import type { RoomFilters as RoomFiltersType, Level } from '@/types';

// ═══════════════════════════════════════════════════════════════
// Header Actions
// ═══════════════════════════════════════════════════════════════
function RoomsHeaderActions() {
    return (
        <>
            <Link href="/ai-practice" style={{ textDecoration: 'none' }}>
                <Button variant="light" leftSection={<IconRobot size={18} />}>
                    Practice with AI
                </Button>
            </Link>
            <Link href="/create-room" style={{ textDecoration: 'none' }}>
                <Button leftSection={<IconPlus size={18} />}>
                    Create Room
                </Button>
            </Link>
        </>
    );
}

// ═══════════════════════════════════════════════════════════════
// Rooms Content (Uses tRPC)
// ═══════════════════════════════════════════════════════════════
function RoomsContent() {
    const [filters, setFilters] = useState<RoomFiltersType>({
        level: 'all',
        search: '',
    });

    // Convert filter level (or undefined for 'all')
    const levelFilter = filters.level === 'all' ? undefined : filters.level as Level;

    // Fetch data with tRPC - type-safe!
    const { data: rooms, isLoading, error, refetch } = trpc.rooms.list.useQuery({
        level: levelFilter,
        search: filters.search || undefined,
    });

    return (
        <>
            {/* Filters */}
            <RoomFilters filters={filters} onChange={setFilters} />

            {/* Loading State */}
            {isLoading && <LoadingState message="Finding rooms..." />}

            {/* Error State */}
            {error && (
                <ErrorState
                    title="Failed to load rooms"
                    message={error.message}
                    onRetry={() => refetch()}
                />
            )}

            {/* Rooms Grid */}
            {rooms && rooms.length > 0 && (
                <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="lg">
                    {rooms.map((room: typeof rooms[number]) => (
                        <RoomCard key={room.id} room={room} />
                    ))}
                </SimpleGrid>
            )}

            {/* Empty State */}
            {rooms && rooms.length === 0 && (
                <EmptyState
                    title="No rooms found"
                    description="Try adjusting your filters or create a new room"
                    actionLabel="Create Room"
                    actionHref="/create-room"
                />
            )}
        </>
    );
}

// ═══════════════════════════════════════════════════════════════
// Main Page Component
// ═══════════════════════════════════════════════════════════════
export default function RoomsPage() {
    return (
        <PrivateRoute>
            <PageLayout>
                <PageHeader
                    title="Voice Rooms"
                    description="Join a room and start practicing English"
                    actions={<RoomsHeaderActions />}
                />
                <RoomsContent />
            </PageLayout>
        </PrivateRoute>
    );
}
