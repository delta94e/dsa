import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { RoomsService } from './rooms.service';
import { RoomType, RoomConnection, LevelEnum, RoomTypeEnum, ParticipantType } from './room.type';
import { ConnectionArgs, arrayToConnection } from '../graphql/connection.types';

/**
 * GraphQL Resolver for Rooms
 */
@Resolver(() => RoomType)
export class RoomsResolver {
    constructor(private readonly roomsService: RoomsService) { }

    /**
     * Get all rooms with optional filters and pagination
     */
    @Query(() => RoomConnection, { name: 'rooms', description: 'Get paginated list of rooms' })
    async getRooms(
        @Args() args: ConnectionArgs,
        @Args('level', { type: () => LevelEnum, nullable: true }) level?: LevelEnum,
        @Args('search', { nullable: true }) search?: string,
    ): Promise<RoomConnection> {
        // Get all rooms with filters
        const allRooms = this.roomsService.getAllRooms(level as any, search);

        // Apply pagination
        const first = args.first || 10;
        const startIndex = args.after ? this.decodeCursor(args.after) + 1 : 0;
        const paginatedRooms = allRooms.slice(startIndex, startIndex + first);

        // Convert to Relay connection
        const connection = arrayToConnection(
            paginatedRooms.map(r => this.toGraphQLRoom(r)),
            allRooms.length,
            args,
        );
        return connection as unknown as RoomConnection;
    }

    /**
     * Get a single room by ID
     */
    @Query(() => RoomType, { name: 'room', nullable: true, description: 'Get a single room by ID' })
    async getRoom(@Args('id', { type: () => ID }) id: string): Promise<RoomType | null> {
        const room = this.roomsService.getRoom(id);
        if (!room) return null;
        return this.toGraphQLRoom(room);
    }

    /**
     * Get participants of a room
     */
    @Query(() => [ParticipantType], { name: 'roomParticipants', description: 'Get participants of a room' })
    async getRoomParticipants(@Args('roomId', { type: () => ID }) roomId: string): Promise<ParticipantType[]> {
        const room = this.roomsService.getRoom(roomId);
        if (!room) return [];

        return room.participants.map(p => ({
            id: p.id,
            name: p.name,
            avatarUrl: p.avatarUrl,
            isMuted: p.isMuted,
            isSpeaking: p.isSpeaking,
            isHandRaised: p.isHandRaised,
            joinedAt: p.joinedAt,
        }));
    }

    /**
     * Helper to convert REST room to GraphQL type
     */
    private toGraphQLRoom(room: any): RoomType {
        return {
            id: room.id,
            name: room.name,
            topic: room.topic,
            level: room.level as LevelEnum,
            type: room.type as RoomTypeEnum,
            hostId: room.hostId,
            maxParticipants: room.maxParticipants,
            participantCount: room.participantCount,
            tags: room.tags,
            hasPassword: room.hasPassword,
            createdAt: room.createdAt,
        };
    }

    /**
     * Decode cursor to offset
     */
    private decodeCursor(cursor: string): number {
        const decoded = Buffer.from(cursor, 'base64').toString('utf8');
        const match = decoded.match(/^cursor:(\d+)$/);
        return match ? parseInt(match[1], 10) : 0;
    }
}
