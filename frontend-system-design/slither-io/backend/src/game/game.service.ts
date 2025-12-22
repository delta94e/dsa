import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import {
    Player,
    Snake,
    Orb,
    Segment,
    Vector2,
    GameConfig,
    DEFAULT_CONFIG,
    SNAKE_COLORS,
    ORB_COLORS,
} from './game.types';
import { WorldUpdateDto, SnakeDto, OrbDto, LeaderboardEntryDto } from '../dto/game.dto';

// ═══════════════════════════════════════════════════════════════
// SPATIAL GRID FOR COLLISION
// ═══════════════════════════════════════════════════════════════

interface GridItem {
    id: string;
    x: number;
    y: number;
}

interface SegmentWithPlayer extends Segment, GridItem {
    playerId: string;
}

class SpatialGrid<T extends GridItem> {
    private cells = new Map<string, Set<T>>();
    private cellSize: number;

    constructor(cellSize = 100) {
        this.cellSize = cellSize;
    }

    clear() {
        this.cells.clear();
    }

    insert(item: T) {
        const key = this.getKey(item.x, item.y);
        if (!this.cells.has(key)) this.cells.set(key, new Set());
        this.cells.get(key)!.add(item);
    }

    query(x: number, y: number, radius: number): T[] {
        const results: T[] = [];
        const minCx = Math.floor((x - radius) / this.cellSize);
        const maxCx = Math.floor((x + radius) / this.cellSize);
        const minCy = Math.floor((y - radius) / this.cellSize);
        const maxCy = Math.floor((y + radius) / this.cellSize);

        for (let cx = minCx; cx <= maxCx; cx++) {
            for (let cy = minCy; cy <= maxCy; cy++) {
                const cell = this.cells.get(`${cx},${cy}`);
                if (cell) {
                    for (const item of cell) {
                        if (this.distance(item, { x, y }) <= radius) results.push(item);
                    }
                }
            }
        }
        return results;
    }

    private getKey(x: number, y: number) {
        return `${Math.floor(x / this.cellSize)},${Math.floor(y / this.cellSize)}`;
    }

    private distance(a: Vector2, b: Vector2): number {
        return Math.hypot(a.x - b.x, a.y - b.y);
    }
}

// ═══════════════════════════════════════════════════════════════
// GAME SERVICE
// ═══════════════════════════════════════════════════════════════

@Injectable()
export class GameService implements OnModuleInit, OnModuleDestroy {
    private config: GameConfig = DEFAULT_CONFIG;
    private players = new Map<string, Player>();
    private orbs = new Map<string, Orb>();
    private tick = 0;

    private orbGrid = new SpatialGrid<Orb>(100);
    private segmentGrid = new SpatialGrid<SegmentWithPlayer>(100);

    private gameLoopInterval: NodeJS.Timeout | null = null;
    private worldUpdateCallback: ((update: WorldUpdateDto) => void) | null = null;
    private playerDiedCallback: ((playerId: string, killerId?: string) => void) | null = null;

    // ═══════════════════════════════════════════════════════════
    // LIFECYCLE
    // ═══════════════════════════════════════════════════════════

    onModuleInit() {
        this.spawnOrbs();
        this.startGameLoop();
    }

    onModuleDestroy() {
        this.stopGameLoop();
    }

    // ═══════════════════════════════════════════════════════════
    // CALLBACKS
    // ═══════════════════════════════════════════════════════════

    setWorldUpdateCallback(callback: (update: WorldUpdateDto) => void) {
        this.worldUpdateCallback = callback;
    }

    setPlayerDiedCallback(callback: (playerId: string, killerId?: string) => void) {
        this.playerDiedCallback = callback;
    }

    // ═══════════════════════════════════════════════════════════
    // PLAYER MANAGEMENT
    // ═══════════════════════════════════════════════════════════

    addPlayer(socketId: string, name: string): Player {
        const playerId = `player-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const x = this.randomInRange(200, this.config.worldWidth - 200);
        const y = this.randomInRange(200, this.config.worldHeight - 200);

        const player: Player = {
            id: playerId,
            socketId,
            name: name || 'Anonymous',
            snake: this.createSnake(x, y),
            lastInput: Date.now(),
        };

        this.players.set(playerId, player);
        return player;
    }

    removePlayer(socketId: string): void {
        for (const [id, player] of this.players) {
            if (player.socketId === socketId) {
                // Drop orbs from dead snake
                if (player.snake.isAlive) {
                    this.dropSnakeOrbs(player.snake);
                }
                this.players.delete(id);
                break;
            }
        }
    }

    getPlayerBySocketId(socketId: string): Player | undefined {
        for (const player of this.players.values()) {
            if (player.socketId === socketId) return player;
        }
        return undefined;
    }

    getPlayerById(playerId: string): Player | undefined {
        return this.players.get(playerId);
    }

    // ═══════════════════════════════════════════════════════════
    // INPUT HANDLING
    // ═══════════════════════════════════════════════════════════

    handleInput(socketId: string, angle: number, boost: boolean): void {
        const player = this.getPlayerBySocketId(socketId);
        if (!player || !player.snake.isAlive) return;

        player.snake.targetAngle = angle;
        player.snake.isBoosting = boost;
        player.lastInput = Date.now();
    }

    // ═══════════════════════════════════════════════════════════
    // GAME LOOP
    // ═══════════════════════════════════════════════════════════

    private startGameLoop() {
        const tickInterval = 1000 / this.config.tickRate;

        this.gameLoopInterval = setInterval(() => {
            this.tick++;
            this.update();
            this.broadcastWorld();
        }, tickInterval);
    }

    private stopGameLoop() {
        if (this.gameLoopInterval) {
            clearInterval(this.gameLoopInterval);
            this.gameLoopInterval = null;
        }
    }

    private update() {
        // Update all snakes
        for (const player of this.players.values()) {
            if (player.snake.isAlive) {
                this.updateSnake(player.snake);
            }
        }

        // Rebuild spatial grids
        this.rebuildGrids();

        // Check collisions
        this.checkCollisions();
    }

    // ═══════════════════════════════════════════════════════════
    // SNAKE LOGIC
    // ═══════════════════════════════════════════════════════════

    private createSnake(x: number, y: number): Snake {
        const segments: Segment[] = [];
        const baseRadius = 8;

        for (let i = 0; i < this.config.initialSegments; i++) {
            segments.push({
                x: x - i * this.config.segmentSpacing,
                y,
                radius: baseRadius,
            });
        }

        return {
            segments,
            angle: 0,
            targetAngle: 0,
            speed: this.config.baseSpeed,
            isBoosting: false,
            color: this.randomColor(SNAKE_COLORS),
            score: 0,
            isAlive: true,
        };
    }

    private updateSnake(snake: Snake) {
        // Smooth turning
        snake.angle = this.lerpAngle(snake.angle, snake.targetAngle, this.config.maxTurnSpeed);

        // Speed
        snake.speed = snake.isBoosting ? this.config.boostSpeed : this.config.baseSpeed;

        // Move head
        const head = snake.segments[0];
        head.x += Math.cos(snake.angle) * snake.speed;
        head.y += Math.sin(snake.angle) * snake.speed;

        // Clamp to world bounds
        head.x = this.clamp(head.x, 0, this.config.worldWidth);
        head.y = this.clamp(head.y, 0, this.config.worldHeight);

        // Update following segments
        for (let i = 1; i < snake.segments.length; i++) {
            const current = snake.segments[i];
            const target = snake.segments[i - 1];

            const dx = target.x - current.x;
            const dy = target.y - current.y;
            const dist = Math.hypot(dx, dy);

            if (dist > this.config.segmentSpacing) {
                const ratio = this.config.segmentSpacing / dist;
                current.x = target.x - dx * ratio;
                current.y = target.y - dy * ratio;
            }
        }

        // Boost drain
        if (snake.isBoosting && snake.segments.length > 10) {
            if (Math.random() < 0.1) {
                const removed = snake.segments.pop();
                if (removed) {
                    this.spawnOrbAt(removed.x, removed.y, 1, snake.color);
                }
            }
        }
    }

    // ═══════════════════════════════════════════════════════════
    // COLLISION DETECTION
    // ═══════════════════════════════════════════════════════════

    private rebuildGrids() {
        this.orbGrid.clear();
        this.segmentGrid.clear();

        for (const orb of this.orbs.values()) {
            this.orbGrid.insert(orb);
        }

        for (const player of this.players.values()) {
            if (!player.snake.isAlive) continue;

            // Skip first 3 segments (head area)
            for (let i = 3; i < player.snake.segments.length; i++) {
                const seg = player.snake.segments[i];
                this.segmentGrid.insert({
                    ...seg,
                    id: `${player.id}-${i}`,
                    playerId: player.id,
                });
            }
        }
    }

    private checkCollisions() {
        for (const player of this.players.values()) {
            if (!player.snake.isAlive) continue;

            const head = player.snake.segments[0];

            // Check orb collision
            const nearbyOrbs = this.orbGrid.query(head.x, head.y, head.radius + 20);
            for (const orb of nearbyOrbs) {
                if (this.distance(head, orb) < head.radius + orb.radius) {
                    this.orbs.delete(orb.id);
                    this.growSnake(player.snake, orb.value);
                    this.spawnOrb(); // Replace
                }
            }

            // Check snake collision
            const nearbySegments = this.segmentGrid.query(head.x, head.y, head.radius + 20);
            for (const seg of nearbySegments) {
                if (seg.playerId !== player.id) {
                    if (this.distance(head, seg) < head.radius + seg.radius - 2) {
                        this.killPlayer(player.id, seg.playerId);
                        break;
                    }
                }
            }
        }
    }

    private growSnake(snake: Snake, amount: number) {
        snake.score += amount;

        for (let i = 0; i < amount; i++) {
            const tail = snake.segments[snake.segments.length - 1];
            snake.segments.push({ ...tail });
        }

        // Update radii
        const baseRadius = 8 + Math.floor(snake.segments.length / 20);
        for (let i = 0; i < snake.segments.length; i++) {
            const factor = 1 - (i / snake.segments.length) * 0.3;
            snake.segments[i].radius = baseRadius * factor;
        }
    }

    private killPlayer(playerId: string, killerId?: string) {
        const player = this.players.get(playerId);
        if (!player || !player.snake.isAlive) return;

        player.snake.isAlive = false;
        this.dropSnakeOrbs(player.snake);

        if (this.playerDiedCallback) {
            this.playerDiedCallback(player.socketId, killerId);
        }

        // Remove player after delay
        setTimeout(() => {
            this.players.delete(playerId);
        }, 1000);
    }

    private dropSnakeOrbs(snake: Snake) {
        for (let i = 0; i < snake.segments.length; i += 3) {
            const seg = snake.segments[i];
            this.spawnOrbAt(
                seg.x + (Math.random() - 0.5) * 20,
                seg.y + (Math.random() - 0.5) * 20,
                2,
                snake.color,
            );
        }
    }

    // ═══════════════════════════════════════════════════════════
    // ORB MANAGEMENT
    // ═══════════════════════════════════════════════════════════

    private spawnOrbs() {
        for (let i = 0; i < this.config.orbCount; i++) {
            this.spawnOrb();
        }
    }

    private spawnOrb(): Orb {
        return this.spawnOrbAt(
            this.randomInRange(50, this.config.worldWidth - 50),
            this.randomInRange(50, this.config.worldHeight - 50),
            1,
            this.randomColor(ORB_COLORS),
        );
    }

    private spawnOrbAt(x: number, y: number, value: number, color: string): Orb {
        const orb: Orb = {
            id: `orb-${this.tick}-${Math.random().toString(36).substr(2, 9)}`,
            x,
            y,
            value,
            color,
            radius: 5,
        };
        this.orbs.set(orb.id, orb);
        return orb;
    }

    // ═══════════════════════════════════════════════════════════
    // BROADCAST
    // ═══════════════════════════════════════════════════════════

    private broadcastWorld() {
        if (!this.worldUpdateCallback) return;

        const snakes: SnakeDto[] = [];
        for (const player of this.players.values()) {
            if (player.snake.isAlive) {
                snakes.push({
                    id: player.id,
                    name: player.name,
                    segments: player.snake.segments.map((s) => ({
                        x: Math.round(s.x * 10) / 10, // Round for bandwidth
                        y: Math.round(s.y * 10) / 10,
                        radius: Math.round(s.radius * 10) / 10,
                    })),
                    angle: Math.round(player.snake.angle * 100) / 100,
                    color: player.snake.color,
                    score: player.snake.score,
                    isBoosting: player.snake.isBoosting,
                });
            }
        }

        const orbs: OrbDto[] = [];
        for (const orb of this.orbs.values()) {
            orbs.push({
                id: orb.id,
                x: Math.round(orb.x),
                y: Math.round(orb.y),
                value: orb.value,
                color: orb.color,
                radius: orb.radius,
            });
        }

        this.worldUpdateCallback({
            snakes,
            orbs,
            tick: this.tick,
        });
    }

    // ═══════════════════════════════════════════════════════════
    // LEADERBOARD
    // ═══════════════════════════════════════════════════════════

    getLeaderboard(): LeaderboardEntryDto[] {
        const entries: LeaderboardEntryDto[] = [];

        for (const player of this.players.values()) {
            if (player.snake.isAlive) {
                entries.push({
                    id: player.id,
                    name: player.name,
                    score: player.snake.score,
                });
            }
        }

        return entries
            .sort((a, b) => b.score - a.score)
            .slice(0, 10);
    }

    // ═══════════════════════════════════════════════════════════
    // UTILITIES
    // ═══════════════════════════════════════════════════════════

    private distance(a: Vector2, b: Vector2): number {
        return Math.hypot(a.x - b.x, a.y - b.y);
    }

    private randomInRange(min: number, max: number): number {
        return Math.random() * (max - min) + min;
    }

    private randomColor(colors: string[]): string {
        return colors[Math.floor(Math.random() * colors.length)];
    }

    private clamp(value: number, min: number, max: number): number {
        return Math.max(min, Math.min(max, value));
    }

    private lerpAngle(current: number, target: number, maxDelta: number): number {
        let diff = target - current;
        while (diff > Math.PI) diff -= Math.PI * 2;
        while (diff < -Math.PI) diff += Math.PI * 2;
        if (Math.abs(diff) > maxDelta) {
            diff = Math.sign(diff) * maxDelta;
        }
        return current + diff;
    }
}
