'use client';

import { trpc } from '@/trpc/client';
import { RoomFilters, CreateRoomInput } from '@/types';

export function useRooms(filters: RoomFilters = {}) {
    return trpc.rooms.list.useQuery({
        level: filters.level === 'all' ? undefined : filters.level,
        search: filters.search,
    }, {
        staleTime: 10_000, // 10s
        refetchInterval: 30_000, // 30s for live participant count
    });
}

export function useRoom(roomId: string) {
    return trpc.rooms.get.useQuery(
        { id: roomId },
        { enabled: !!roomId }
    );
}

export function useCreateRoom() {
    const utils = trpc.useUtils();

    return trpc.rooms.create.useMutation({
        onSuccess: () => {
            utils.rooms.list.invalidate();
        },
    });
}
