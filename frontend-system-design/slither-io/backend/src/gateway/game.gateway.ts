import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit,
    MessageBody,
    ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GameService } from '../game/game.service';
import {
    JoinGameDto,
    PlayerInputDto,
    WorldUpdateDto,
} from '../dto/game.dto';

@WebSocketGateway({
    cors: {
        origin: '*', // Configure for production
    },
    transports: ['websocket', 'polling'],
})
export class GameGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    private leaderboardInterval: NodeJS.Timeout | null = null;

    constructor(private readonly gameService: GameService) { }

    // ═══════════════════════════════════════════════════════════
    // LIFECYCLE
    // ═══════════════════════════════════════════════════════════

    afterInit() {
        console.log('🎮 WebSocket Gateway initialized');

        // Set up world update broadcast
        this.gameService.setWorldUpdateCallback((update: WorldUpdateDto) => {
            this.server.emit('world_update', update);
        });

        // Set up player died callback
        this.gameService.setPlayerDiedCallback((socketId: string, killerId?: string) => {
            const killer = killerId ? this.getPlayerName(killerId) : undefined;
            this.server.to(socketId).emit('player_died', {
                killerId,
                killerName: killer,
            });
        });

        // Broadcast leaderboard every 2 seconds
        this.leaderboardInterval = setInterval(() => {
            const leaderboard = this.gameService.getLeaderboard();
            this.server.emit('leaderboard', leaderboard);
        }, 2000);
    }

    handleConnection(client: Socket) {
        console.log(`🟢 Client connected: ${client.id}`);
    }

    handleDisconnect(client: Socket) {
        console.log(`🔴 Client disconnected: ${client.id}`);
        this.gameService.removePlayer(client.id);
    }

    // ═══════════════════════════════════════════════════════════
    // MESSAGE HANDLERS
    // ═══════════════════════════════════════════════════════════

    @SubscribeMessage('join_game')
    handleJoinGame(
        @MessageBody() data: JoinGameDto,
        @ConnectedSocket() client: Socket,
    ) {
        const player = this.gameService.addPlayer(client.id, data.name);

        console.log(`🐍 Player joined: ${player.name} (${player.id})`);

        // Send player their ID
        client.emit('joined', {
            id: player.id,
            name: player.name,
            color: player.snake.color,
        });

        // Broadcast to others
        client.broadcast.emit('player_joined', {
            id: player.id,
            name: player.name,
        });

        return { success: true, playerId: player.id };
    }

    @SubscribeMessage('input')
    handleInput(
        @MessageBody() data: PlayerInputDto,
        @ConnectedSocket() client: Socket,
    ) {
        this.gameService.handleInput(client.id, data.angle, data.boost);
    }

    @SubscribeMessage('respawn')
    handleRespawn(
        @MessageBody() data: JoinGameDto,
        @ConnectedSocket() client: Socket,
    ) {
        // Remove old player entry
        this.gameService.removePlayer(client.id);

        // Add new player
        const player = this.gameService.addPlayer(client.id, data.name);

        client.emit('joined', {
            id: player.id,
            name: player.name,
            color: player.snake.color,
        });

        return { success: true, playerId: player.id };
    }

    @SubscribeMessage('ping')
    handlePing(@ConnectedSocket() client: Socket) {
        client.emit('pong', { timestamp: Date.now() });
    }

    // ═══════════════════════════════════════════════════════════
    // HELPERS
    // ═══════════════════════════════════════════════════════════

    private getPlayerName(playerId: string): string | undefined {
        const player = this.gameService.getPlayerById(playerId);
        return player?.name;
    }
}
