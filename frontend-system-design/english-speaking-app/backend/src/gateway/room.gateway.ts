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
}
