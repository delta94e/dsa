import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    OnGatewayConnection,
    OnGatewayDisconnect,
    ConnectedSocket,
    MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { RoomsService } from '../rooms/rooms.service';
import {
    JoinRoomPayload,
    LeaveRoomPayload,
    SignalingPayload,
    MuteTogglePayload,
    SpeakingPayload,
    VideoTogglePayload,
    RaiseHandPayload,
    ReactionPayload,
    ScreenSharePayload,
    WhiteboardJoinPayload,
    WhiteboardDrawPayload,
    WhiteboardClearPayload,
    DrawingElement,
} from '../types';

@WebSocketGateway({
    cors: {
        origin: ['http://localhost:3000', 'http://localhost:3001'],
        credentials: true,
    },
})
export class RoomGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server!: Server;

    // Track which room each socket is in
    private socketRooms = new Map<string, string>();

    // Track whiteboard open state per room
    private whiteboardOpen = new Map<string, boolean>();

    constructor(private readonly roomsService: RoomsService) { }

    handleConnection(client: Socket) {
        console.log(`Client connected: ${client.id}`);
    }

    handleDisconnect(client: Socket) {
        console.log(`Client disconnected: ${client.id}`);

        // Remove from room if in one
        const roomId = this.socketRooms.get(client.id);
        if (roomId) {
            this.handleLeaveRoom(client, roomId);
        }
    }

    @SubscribeMessage('join_room')
    handleJoinRoom(
        @ConnectedSocket() client: Socket,
        @MessageBody() payload: JoinRoomPayload,
    ) {
        const { roomId, user, password } = payload;
        console.log(`User ${user.name} joining room ${roomId}`);

        // Verify password if room requires one (host can bypass)
        const passwordCheck = this.roomsService.verifyRoomPassword(roomId, password, user.id);
        if (!passwordCheck.valid) {
            console.log(`Password check failed for room ${roomId}: ${passwordCheck.error}`);
            client.emit('error', {
                type: passwordCheck.error,
                message: passwordCheck.error === 'password_required'
                    ? 'This room requires a password'
                    : 'Incorrect password',
            });
            return;
        }

        // Add participant to room
        const success = this.roomsService.addParticipant(roomId, user, client.id);
        if (!success) {
            client.emit('error', { type: 'join_failed', message: 'Failed to join room' });
            return;
        }

        // Join socket room
        client.join(roomId);
        this.socketRooms.set(client.id, roomId);

        // Get current room state
        const room = this.roomsService.getRoom(roomId);
        if (!room) return;

        // Notify joined user
        client.emit('joined', {
            roomId,
            participants: room.participants,
            isWhiteboardOpen: this.whiteboardOpen.get(roomId) || false,
        });

        // Notify others in room
        client.to(roomId).emit('user_joined', {
            user: room.participants.find((p) => p.id === user.id),
        });

        console.log(`Room ${roomId} now has ${room.participantCount} participants`);
    }

    @SubscribeMessage('leave_room')
    handleLeaveRoom(
        @ConnectedSocket() client: Socket,
        @MessageBody() roomId: string,
    ) {
        const participant = this.roomsService.getParticipantBySocketId(
            roomId,
            client.id,
        );
        if (!participant) return;

        console.log(`User ${participant.name} leaving room ${roomId}`);

        // Remove participant
        this.roomsService.removeParticipant(roomId, participant.id);

        // Leave socket room
        client.leave(roomId);
        this.socketRooms.delete(client.id);

        // Notify others
        this.server.to(roomId).emit('user_left', {
            userId: participant.id,
        });
    }

    @SubscribeMessage('signal')
    handleSignaling(
        @ConnectedSocket() client: Socket,
        @MessageBody() payload: SignalingPayload,
    ) {
        const { roomId, targetUserId, type, data } = payload;
        const sender = this.roomsService.getParticipantBySocketId(
            roomId,
            client.id,
        );
        if (!sender) return;

        // Get target socket
        const room = this.roomsService.getRoomInternal(roomId);
        if (!room) return;

        const target = room.participants.get(targetUserId);
        if (!target?.socketId) return;

        // Forward signal to target
        this.server.to(target.socketId).emit('signal', {
            from: sender.id,
            type,
            data,
        });
    }

    @SubscribeMessage('mute_toggle')
    handleMuteToggle(
        @ConnectedSocket() client: Socket,
        @MessageBody() payload: MuteTogglePayload,
    ) {
        const { roomId, isMuted } = payload;
        const participant = this.roomsService.getParticipantBySocketId(
            roomId,
            client.id,
        );
        if (!participant) return;

        this.roomsService.updateParticipantMute(roomId, participant.id, isMuted);

        // Notify all in room
        this.server.to(roomId).emit('participant_mute', {
            userId: participant.id,
            isMuted,
        });
    }

    @SubscribeMessage('speaking')
    handleSpeaking(
        @ConnectedSocket() client: Socket,
        @MessageBody() payload: SpeakingPayload,
    ) {
        const { roomId, isSpeaking } = payload;
        const participant = this.roomsService.getParticipantBySocketId(
            roomId,
            client.id,
        );
        if (!participant) return;

        this.roomsService.updateParticipantSpeaking(
            roomId,
            participant.id,
            isSpeaking,
        );

        // Notify all in room
        this.server.to(roomId).emit('participant_speaking', {
            userId: participant.id,
            isSpeaking,
        });
    }

    @SubscribeMessage('raise_hand')
    handleRaiseHand(
        @ConnectedSocket() client: Socket,
        @MessageBody() payload: RaiseHandPayload,
    ) {
        const { roomId, isRaised } = payload;
        const participant = this.roomsService.getParticipantBySocketId(
            roomId,
            client.id,
        );
        if (!participant) return;

        this.roomsService.updateParticipantHandRaised(
            roomId,
            participant.id,
            isRaised,
        );

        // Notify all in room
        this.server.to(roomId).emit('participant_hand_raised', {
            userId: participant.id,
            userName: participant.name,
            isRaised,
        });

        console.log(`User ${participant.name} ${isRaised ? 'raised' : 'lowered'} hand`);
    }

    @SubscribeMessage('reaction')
    handleReaction(
        @ConnectedSocket() client: Socket,
        @MessageBody() payload: ReactionPayload,
    ) {
        const { roomId, type } = payload;
        const participant = this.roomsService.getParticipantBySocketId(
            roomId,
            client.id,
        );
        if (!participant) return;

        // Broadcast reaction to all in room
        this.server.to(roomId).emit('reaction', {
            userId: participant.id,
            userName: participant.name,
            type,
        });
    }

    @SubscribeMessage('video_toggle')
    handleVideoToggle(
        @ConnectedSocket() client: Socket,
        @MessageBody() payload: VideoTogglePayload,
    ) {
        const { roomId, isVideoEnabled } = payload;
        const participant = this.roomsService.getParticipantBySocketId(
            roomId,
            client.id,
        );
        if (!participant) return;

        // Notify all in room
        this.server.to(roomId).emit('participant_video', {
            userId: participant.id,
            isVideoEnabled,
        });

        console.log(`User ${participant.name} ${isVideoEnabled ? 'enabled' : 'disabled'} video`);
    }

    // ═══════════════════════════════════════════════════════════════
    // SCREEN SHARE
    // ═══════════════════════════════════════════════════════════════

    @SubscribeMessage('screen_share_toggle')
    handleScreenShareToggle(
        @ConnectedSocket() client: Socket,
        @MessageBody() payload: ScreenSharePayload,
    ) {
        const { roomId, isSharing } = payload;
        const participant = this.roomsService.getParticipantBySocketId(
            roomId,
            client.id,
        );
        if (!participant) return;

        // Notify all in room
        this.server.to(roomId).emit('participant_screen_share', {
            userId: participant.id,
            userName: participant.name,
            isSharing,
        });

        console.log(`User ${participant.name} ${isSharing ? 'started' : 'stopped'} screen sharing`);
    }

    // ═══════════════════════════════════════════════════════════════
    // WHITEBOARD
    // ═══════════════════════════════════════════════════════════════

    // Store whiteboard elements per room
    private whiteboardData = new Map<string, DrawingElement[]>();

    @SubscribeMessage('whiteboard:join')
    handleWhiteboardJoin(
        @ConnectedSocket() client: Socket,
        @MessageBody() payload: WhiteboardJoinPayload,
    ) {
        const { roomId, userId } = payload;
        console.log(`User ${userId} joined whiteboard in room ${roomId}`);

        // Join whiteboard-specific room
        client.join(`whiteboard:${roomId}`);

        // Send current whiteboard state to joining user
        const elements = this.whiteboardData.get(roomId) || [];
        client.emit('whiteboard:sync', elements);
    }

    @SubscribeMessage('whiteboard:leave')
    handleWhiteboardLeave(
        @ConnectedSocket() client: Socket,
        @MessageBody() payload: WhiteboardJoinPayload,
    ) {
        const { roomId, userId } = payload;
        console.log(`User ${userId} left whiteboard in room ${roomId}`);

        // Leave whiteboard-specific room
        client.leave(`whiteboard:${roomId}`);
    }

    @SubscribeMessage('whiteboard:draw')
    handleWhiteboardDraw(
        @ConnectedSocket() client: Socket,
        @MessageBody() payload: WhiteboardDrawPayload,
    ) {
        const { roomId, element } = payload;

        // Store element
        if (!this.whiteboardData.has(roomId)) {
            this.whiteboardData.set(roomId, []);
        }
        this.whiteboardData.get(roomId)!.push(element);

        // Broadcast to all in whiteboard room except sender
        client.to(`whiteboard:${roomId}`).emit('whiteboard:draw', element);
    }

    @SubscribeMessage('whiteboard:clear')
    handleWhiteboardClear(
        @ConnectedSocket() client: Socket,
        @MessageBody() payload: WhiteboardClearPayload,
    ) {
        const { roomId, userId } = payload;
        console.log(`User ${userId} cleared whiteboard in room ${roomId}`);

        // Clear stored elements
        this.whiteboardData.set(roomId, []);

        // Broadcast clear to all in whiteboard room
        this.server.to(`whiteboard:${roomId}`).emit('whiteboard:clear');
    }

    @SubscribeMessage('whiteboard:toggle')
    handleWhiteboardToggle(
        @ConnectedSocket() client: Socket,
        @MessageBody() payload: { roomId: string; isOpen: boolean; userId: string },
    ) {
        const { roomId, isOpen, userId } = payload;
        console.log(`User ${userId} ${isOpen ? 'opened' : 'closed'} whiteboard in room ${roomId}`);

        // Store whiteboard open state
        this.whiteboardOpen.set(roomId, isOpen);

        // Broadcast to all in room (including sender for confirmation)
        this.server.to(roomId).emit('whiteboard:toggled', {
            isOpen,
            userId,
        });
    }
}
