import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import {
    Room,
    RoomResponse,
    CreateRoomDto,
    RoomParticipant,
    User,
    Level,
} from '../types';

@Injectable()
export class RoomsService {
    private rooms = new Map<string, Room>();

    constructor() {
        // Seed with some mock rooms
        this.seedRooms();
    }

    private seedRooms() {
        const mockRooms: CreateRoomDto[] = [
            {
                name: 'Travel Stories',
                topic: 'Share your favorite travel experiences and dream destinations',
                level: 'A2',
                type: 'public',
                maxParticipants: 8,
                tags: ['travel', 'culture', 'adventure'],
            },
            {
                name: 'Business English Practice',
                topic: 'Practice professional communication and business vocabulary',
                level: 'B2',
                type: 'public',
                maxParticipants: 6,
                tags: ['business', 'career', 'professional'],
            },
            {
                name: 'Daily Chit-Chat',
                topic: 'Casual conversations about everyday life',
                level: 'A1',
                type: 'public',
                maxParticipants: 10,
                tags: ['casual', 'daily', 'beginner-friendly'],
            },
            {
                name: 'Debate Club',
                topic: 'Discuss controversial topics and practice argumentation',
                level: 'C1',
                type: 'public',
                maxParticipants: 8,
                tags: ['debate', 'opinion', 'advanced'],
            },
            {
                name: 'Movie Discussion',
                topic: 'Talk about your favorite movies and TV shows',
                level: 'B1',
                type: 'public',
                maxParticipants: 12,
                tags: ['movies', 'entertainment', 'series'],
            },
        ];

        mockRooms.forEach((roomDto) => {
            this.createRoom(roomDto, 'system');
        });
    }

    createRoom(dto: CreateRoomDto, hostId: string): Room {
        const room: Room = {
            id: uuidv4(),
            name: dto.name,
            topic: dto.topic,
            level: dto.level,
            type: dto.type,
            hostId,
            maxParticipants: dto.maxParticipants || 8,
            participants: new Map(),
            tags: dto.tags || [],
            createdAt: new Date(),
            password: dto.password, // Store password if provided
        };

        this.rooms.set(room.id, room);
        return room;
    }

    verifyRoomPassword(roomId: string, password?: string, userId?: string): { valid: boolean; error?: string } {
        const room = this.rooms.get(roomId);
        if (!room) {
            return { valid: false, error: 'Room not found' };
        }

        // Host can always join their own room without password
        if (userId && room.hostId === userId) {
            return { valid: true };
        }

        // No password required
        if (!room.password) {
            return { valid: true };
        }

        // Password required but not provided
        if (!password) {
            return { valid: false, error: 'password_required' };
        }

        // Check password
        if (room.password !== password) {
            return { valid: false, error: 'invalid_password' };
        }

        return { valid: true };
    }

    getAllRooms(level?: Level, search?: string): RoomResponse[] {
        let rooms = Array.from(this.rooms.values());

        // Filter by level
        if (level) {
            rooms = rooms.filter((r) => r.level === level);
        }

        // Filter by search
        if (search) {
            const searchLower = search.toLowerCase();
            rooms = rooms.filter(
                (r) =>
                    r.name.toLowerCase().includes(searchLower) ||
                    r.topic.toLowerCase().includes(searchLower) ||
                    r.tags.some((t) => t.toLowerCase().includes(searchLower)),
            );
        }

        return rooms.map((r) => this.toResponse(r));
    }

    getRoom(id: string): RoomResponse | null {
        const room = this.rooms.get(id);
        if (!room) return null;
        return this.toResponse(room);
    }

    getRoomInternal(id: string): Room | null {
        return this.rooms.get(id) || null;
    }

    checkLevelRequirement(roomId: string, userLevel: number): {
        canJoin: boolean;
        requiredLevel: number;
        error?: string
    } {
        const room = this.rooms.get(roomId);
        if (!room) {
            return { canJoin: false, requiredLevel: 1, error: 'Room not found' };
        }

        // Import ROOM_LEVEL_REQUIREMENTS
        const ROOM_LEVEL_REQUIREMENTS: Record<string, number> = {
            A1: 1, A2: 3, B1: 8, B2: 15, C1: 20, C2: 25
        };

        const requiredLevel = ROOM_LEVEL_REQUIREMENTS[room.level] || 1;

        if (userLevel < requiredLevel) {
            return {
                canJoin: false,
                requiredLevel,
                error: `Cần đạt Level ${requiredLevel} để vào room ${room.level}`
            };
        }

        return { canJoin: true, requiredLevel };
    }


    addParticipant(roomId: string, user: User, socketId: string): boolean {
        const room = this.rooms.get(roomId);
        if (!room) return false;
        if (room.participants.size >= room.maxParticipants) return false;

        const participant: RoomParticipant = {
            ...user,
            socketId,
            isMuted: true,
            isSpeaking: false,
            isVideoEnabled: false,
            isHandRaised: false,
            joinedAt: new Date(),
        };

        room.participants.set(user.id, participant);
        return true;
    }

    removeParticipant(roomId: string, userId: string): boolean {
        const room = this.rooms.get(roomId);
        if (!room) return false;

        room.participants.delete(userId);

        // If room is empty and not seeded, delete it
        if (room.participants.size === 0 && room.hostId !== 'system') {
            this.rooms.delete(roomId);
        }

        return true;
    }

    updateParticipantMute(
        roomId: string,
        userId: string,
        isMuted: boolean,
    ): boolean {
        const room = this.rooms.get(roomId);
        if (!room) return false;

        const participant = room.participants.get(userId);
        if (!participant) return false;

        participant.isMuted = isMuted;
        return true;
    }

    updateParticipantSpeaking(
        roomId: string,
        userId: string,
        isSpeaking: boolean,
    ): boolean {
        const room = this.rooms.get(roomId);
        if (!room) return false;

        const participant = room.participants.get(userId);
        if (!participant) return false;

        participant.isSpeaking = isSpeaking;
        return true;
    }

    getParticipantBySocketId(
        roomId: string,
        socketId: string,
    ): RoomParticipant | null {
        const room = this.rooms.get(roomId);
        if (!room) return null;

        for (const participant of room.participants.values()) {
            if (participant.socketId === socketId) {
                return participant;
            }
        }
        return null;
    }

    updateParticipantHandRaised(
        roomId: string,
        odId: string,
        isHandRaised: boolean,
    ): boolean {
        const room = this.rooms.get(roomId);
        if (!room) return false;

        const participant = room.participants.get(odId);
        if (!participant) return false;

        participant.isHandRaised = isHandRaised;
        return true;
    }

    private toResponse(room: Room): RoomResponse {
        return {
            id: room.id,
            name: room.name,
            topic: room.topic,
            level: room.level,
            type: room.type,
            hostId: room.hostId,
            maxParticipants: room.maxParticipants,
            participantCount: room.participants.size,
            participants: Array.from(room.participants.values()),
            tags: room.tags,
            createdAt: room.createdAt,
            hasPassword: !!room.password, // Indicate if room has password
        };
    }
}
