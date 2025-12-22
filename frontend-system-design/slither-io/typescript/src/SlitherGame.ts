import {
    Vector2,
    Segment,
    Snake,
    Orb,
    GameConfig,
    DEFAULT_CONFIG,
    SNAKE_COLORS,
    ORB_COLORS,
} from './types';
import {
    SpatialGrid,
    SegmentWithSnakeId,
    distance,
    randomInRange,
    randomColor,
    clamp,
    lerpAngle,
} from './utils';

// ═══════════════════════════════════════════════════════════════
// SLITHER GAME ENGINE
// ═══════════════════════════════════════════════════════════════

export class SlitherGame {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private config: GameConfig;

    private player: Snake | null = null;
    private aiSnakes: Map<string, Snake> = new Map();
    private orbs: Map<string, Orb> = new Map();

    private orbGrid: SpatialGrid<Orb>;
    private segmentGrid: SpatialGrid<SegmentWithSnakeId>;

    private camera = { x: 0, y: 0, zoom: 1 };
    private mouse = { x: 0, y: 0 };
    private isBoosting = false;

    private lastTime = 0;
    private animationId: number | null = null;

    constructor(canvas: HTMLCanvasElement, config: Partial<GameConfig> = {}) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d')!;
        this.config = { ...DEFAULT_CONFIG, ...config };

        this.orbGrid = new SpatialGrid(100);
        this.segmentGrid = new SpatialGrid(100);

        this.setupCanvas();
        this.setupInputHandlers();
        this.spawnOrbs();
        this.spawnAISnakes(5);
    }

    // ═══════════════════════════════════════════════════════════
    // INITIALIZATION
    // ═══════════════════════════════════════════════════════════

    private setupCanvas(): void {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;

        window.addEventListener('resize', () => {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        });
    }

    private setupInputHandlers(): void {
        this.canvas.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });

        this.canvas.addEventListener('mousedown', () => {
            this.isBoosting = true;
        });

        this.canvas.addEventListener('mouseup', () => {
            this.isBoosting = false;
        });

        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space') {
                this.isBoosting = true;
            }
        });

        document.addEventListener('keyup', (e) => {
            if (e.code === 'Space') {
                this.isBoosting = false;
            }
        });
    }

    // ═══════════════════════════════════════════════════════════
    // SPAWNING
    // ═══════════════════════════════════════════════════════════

    spawnPlayer(name: string): void {
        const x = randomInRange(200, this.config.worldWidth - 200);
        const y = randomInRange(200, this.config.worldHeight - 200);

        this.player = this.createSnake('player', name, x, y);
        this.camera.x = x;
        this.camera.y = y;
    }

    private spawnAISnakes(count: number): void {
        for (let i = 0; i < count; i++) {
            const x = randomInRange(200, this.config.worldWidth - 200);
            const y = randomInRange(200, this.config.worldHeight - 200);
            const snake = this.createSnake(`ai-${i}`, `Bot ${i + 1}`, x, y);
            snake.targetAngle = Math.random() * Math.PI * 2;
            this.aiSnakes.set(snake.id, snake);
        }
    }

    private createSnake(id: string, name: string, x: number, y: number): Snake {
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
            id,
            name,
            segments,
            angle: 0,
            targetAngle: 0,
            speed: this.config.baseSpeed,
            baseSpeed: this.config.baseSpeed,
            boostSpeed: this.config.boostSpeed,
            isBoosting: false,
            color: randomColor(SNAKE_COLORS),
            score: 0,
            isAlive: true,
        };
    }

    private spawnOrbs(): void {
        for (let i = 0; i < this.config.orbCount; i++) {
            this.spawnOrb();
        }
    }

    private spawnOrb(): Orb {
        const orb: Orb = {
            id: `orb-${Date.now()}-${Math.random()}`,
            x: randomInRange(50, this.config.worldWidth - 50),
            y: randomInRange(50, this.config.worldHeight - 50),
            value: 1,
            color: randomColor(ORB_COLORS),
            radius: 5,
        };
        this.orbs.set(orb.id, orb);
        return orb;
    }

    // ═══════════════════════════════════════════════════════════
    // GAME LOOP
    // ═══════════════════════════════════════════════════════════

    start(): void {
        this.lastTime = performance.now();
        this.loop();
    }

    stop(): void {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }

    private loop = (): void => {
        const now = performance.now();
        const deltaTime = (now - this.lastTime) / 1000;
        this.lastTime = now;

        this.update(deltaTime);
        this.render();

        this.animationId = requestAnimationFrame(this.loop);
    };

    // ═══════════════════════════════════════════════════════════
    // UPDATE
    // ═══════════════════════════════════════════════════════════

    private update(deltaTime: number): void {
        // Update player
        if (this.player?.isAlive) {
            this.updatePlayerInput();
            this.updateSnake(this.player, deltaTime);
            this.updateCamera();
        }

        // Update AI snakes
        for (const snake of this.aiSnakes.values()) {
            if (snake.isAlive) {
                this.updateAI(snake);
                this.updateSnake(snake, deltaTime);
            }
        }

        // Rebuild spatial grids
        this.rebuildGrids();

        // Check collisions
        this.checkCollisions();
    }

    private updatePlayerInput(): void {
        if (!this.player) return;

        // Calculate angle to mouse
        const screenCenter = { x: this.canvas.width / 2, y: this.canvas.height / 2 };
        const dx = this.mouse.x - screenCenter.x;
        const dy = this.mouse.y - screenCenter.y;
        this.player.targetAngle = Math.atan2(dy, dx);
        this.player.isBoosting = this.isBoosting;
    }

    private updateAI(snake: Snake): void {
        // Simple AI: occasionally change direction, avoid walls
        if (Math.random() < 0.02) {
            snake.targetAngle += (Math.random() - 0.5) * 1;
        }

        // Avoid walls
        const head = snake.segments[0];
        const margin = 200;
        if (head.x < margin) snake.targetAngle = 0;
        if (head.x > this.config.worldWidth - margin) snake.targetAngle = Math.PI;
        if (head.y < margin) snake.targetAngle = Math.PI / 2;
        if (head.y > this.config.worldHeight - margin) snake.targetAngle = -Math.PI / 2;

        // Occasionally boost
        snake.isBoosting = Math.random() < 0.1 && snake.segments.length > 20;
    }

    private updateSnake(snake: Snake, deltaTime: number): void {
        // Update angle (smooth turning)
        snake.angle = lerpAngle(snake.angle, snake.targetAngle, this.config.maxTurnSpeed);

        // Calculate speed
        snake.speed = snake.isBoosting ? snake.boostSpeed : snake.baseSpeed;

        // Move head
        const head = snake.segments[0];
        head.x += Math.cos(snake.angle) * snake.speed;
        head.y += Math.sin(snake.angle) * snake.speed;

        // Clamp to world bounds
        head.x = clamp(head.x, 0, this.config.worldWidth);
        head.y = clamp(head.y, 0, this.config.worldHeight);

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
                    // Drop orb
                    const orb: Orb = {
                        id: `boost-orb-${Date.now()}`,
                        x: removed.x,
                        y: removed.y,
                        value: 1,
                        color: snake.color,
                        radius: 4,
                    };
                    this.orbs.set(orb.id, orb);
                }
            }
        }
    }

    private updateCamera(): void {
        if (!this.player) return;

        const head = this.player.segments[0];
        const smoothing = 0.1;

        this.camera.x += (head.x - this.camera.x) * smoothing;
        this.camera.y += (head.y - this.camera.y) * smoothing;

        // Zoom based on length
        const targetZoom = Math.max(0.5, 1 - this.player.segments.length * 0.002);
        this.camera.zoom += (targetZoom - this.camera.zoom) * 0.02;
    }

    // ═══════════════════════════════════════════════════════════
    // COLLISION
    // ═══════════════════════════════════════════════════════════

    private rebuildGrids(): void {
        this.orbGrid.clear();
        this.segmentGrid.clear();

        for (const orb of this.orbs.values()) {
            this.orbGrid.insert(orb);
        }

        const allSnakes = [this.player, ...this.aiSnakes.values()].filter(
            (s): s is Snake => s !== null && s.isAlive
        );

        for (const snake of allSnakes) {
            for (let i = 3; i < snake.segments.length; i++) {
                const seg = snake.segments[i];
                this.segmentGrid.insert({ ...seg, id: `${snake.id}-${i}`, snakeId: snake.id });
            }
        }
    }

    private checkCollisions(): void {
        const allSnakes = [this.player, ...this.aiSnakes.values()].filter(
            (s): s is Snake => s !== null && s.isAlive
        );

        for (const snake of allSnakes) {
            const head = snake.segments[0];

            // Check orb collision
            const nearbyOrbs = this.orbGrid.queryRadius(head.x, head.y, head.radius + 20);
            for (const orb of nearbyOrbs) {
                if (distance(head, orb) < head.radius + orb.radius) {
                    this.orbs.delete(orb.id);
                    this.growSnake(snake, orb.value);
                    this.spawnOrb(); // Replace eaten orb
                }
            }

            // Check snake collision
            const nearbySegments = this.segmentGrid.queryRadius(head.x, head.y, head.radius + 20);
            for (const seg of nearbySegments) {
                if (seg.snakeId !== snake.id) {
                    if (distance(head, seg) < head.radius + seg.radius - 2) {
                        this.killSnake(snake);
                        break;
                    }
                }
            }
        }
    }

    private growSnake(snake: Snake, amount: number): void {
        snake.score += amount;

        // Add segments
        for (let i = 0; i < amount; i++) {
            const tail = snake.segments[snake.segments.length - 1];
            snake.segments.push({ ...tail });
        }

        // Slightly increase radius for longer snakes
        const baseRadius = 8 + Math.floor(snake.segments.length / 20);
        for (let i = 0; i < snake.segments.length; i++) {
            const factor = 1 - i / snake.segments.length * 0.3;
            snake.segments[i].radius = baseRadius * factor;
        }
    }

    private killSnake(snake: Snake): void {
        snake.isAlive = false;

        // Drop orbs
        for (let i = 0; i < snake.segments.length; i += 3) {
            const seg = snake.segments[i];
            const orb: Orb = {
                id: `death-${snake.id}-${i}`,
                x: seg.x + (Math.random() - 0.5) * 20,
                y: seg.y + (Math.random() - 0.5) * 20,
                value: 2,
                color: snake.color,
                radius: 6,
            };
            this.orbs.set(orb.id, orb);
        }

        // Respawn if player
        if (snake.id === 'player') {
            setTimeout(() => {
                this.spawnPlayer(snake.name);
            }, 2000);
        } else {
            // Respawn AI
            setTimeout(() => {
                const x = randomInRange(200, this.config.worldWidth - 200);
                const y = randomInRange(200, this.config.worldHeight - 200);
                const newSnake = this.createSnake(snake.id, snake.name, x, y);
                newSnake.targetAngle = Math.random() * Math.PI * 2;
                this.aiSnakes.set(snake.id, newSnake);
            }, 3000);
        }
    }

    // ═══════════════════════════════════════════════════════════
    // RENDERING
    // ═══════════════════════════════════════════════════════════

    private render(): void {
        this.clear();
        this.drawBackground();
        this.drawOrbs();
        this.drawSnakes();
        this.drawUI();
        this.drawMinimap();
    }

    private clear(): void {
        this.ctx.fillStyle = '#1a1a2e';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    private drawBackground(): void {
        const gridSize = 50;
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        this.ctx.lineWidth = 1;

        const startX = -this.camera.x * this.camera.zoom + this.canvas.width / 2;
        const startY = -this.camera.y * this.camera.zoom + this.canvas.height / 2;

        for (let x = startX % gridSize; x < this.canvas.width; x += gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.canvas.height);
            this.ctx.stroke();
        }

        for (let y = startY % gridSize; y < this.canvas.height; y += gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.canvas.width, y);
            this.ctx.stroke();
        }
    }

    private worldToScreen(pos: Vector2): Vector2 {
        return {
            x: (pos.x - this.camera.x) * this.camera.zoom + this.canvas.width / 2,
            y: (pos.y - this.camera.y) * this.camera.zoom + this.canvas.height / 2,
        };
    }

    private isInViewport(pos: Vector2, margin = 100): boolean {
        const screen = this.worldToScreen(pos);
        return (
            screen.x > -margin &&
            screen.x < this.canvas.width + margin &&
            screen.y > -margin &&
            screen.y < this.canvas.height + margin
        );
    }

    private drawOrbs(): void {
        for (const orb of this.orbs.values()) {
            if (!this.isInViewport(orb)) continue;

            const screen = this.worldToScreen(orb);
            const radius = orb.radius * this.camera.zoom;

            this.ctx.beginPath();
            this.ctx.arc(screen.x, screen.y, radius, 0, Math.PI * 2);
            this.ctx.fillStyle = orb.color;
            this.ctx.fill();

            // Glow
            this.ctx.shadowColor = orb.color;
            this.ctx.shadowBlur = 10;
            this.ctx.fill();
            this.ctx.shadowBlur = 0;
        }
    }

    private drawSnakes(): void {
        const allSnakes = [this.player, ...this.aiSnakes.values()].filter(
            (s): s is Snake => s !== null && s.isAlive
        );

        for (const snake of allSnakes) {
            this.drawSnake(snake);
        }
    }

    private drawSnake(snake: Snake): void {
        const { segments, color } = snake;

        // Draw from tail to head
        for (let i = segments.length - 1; i >= 0; i--) {
            const seg = segments[i];
            if (!this.isInViewport(seg)) continue;

            const screen = this.worldToScreen(seg);
            const radius = seg.radius * this.camera.zoom;

            // Gradient brightness
            const brightness = 0.5 + 0.5 * (segments.length - i) / segments.length;

            this.ctx.beginPath();
            this.ctx.arc(screen.x, screen.y, radius, 0, Math.PI * 2);
            this.ctx.fillStyle = this.adjustBrightness(color, brightness);
            this.ctx.fill();

            // Head glow
            if (i === 0) {
                this.ctx.shadowColor = color;
                this.ctx.shadowBlur = 15;
                this.ctx.fill();
                this.ctx.shadowBlur = 0;

                // Eyes
                this.drawEyes(screen, snake.angle, radius);
            }
        }

        // Name tag
        if (snake.segments[0]) {
            const headScreen = this.worldToScreen(snake.segments[0]);
            this.ctx.fillStyle = '#fff';
            this.ctx.font = '12px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(snake.name, headScreen.x, headScreen.y - 20);
        }
    }

    private drawEyes(pos: Vector2, angle: number, radius: number): void {
        const eyeOffset = radius * 0.4;
        const eyeRadius = radius * 0.25;

        for (const side of [-1, 1]) {
            const eyeX = pos.x + Math.cos(angle + side * 0.5) * eyeOffset;
            const eyeY = pos.y + Math.sin(angle + side * 0.5) * eyeOffset;

            // White
            this.ctx.beginPath();
            this.ctx.arc(eyeX, eyeY, eyeRadius, 0, Math.PI * 2);
            this.ctx.fillStyle = '#fff';
            this.ctx.fill();

            // Pupil
            const pupilX = eyeX + Math.cos(angle) * eyeRadius * 0.3;
            const pupilY = eyeY + Math.sin(angle) * eyeRadius * 0.3;
            this.ctx.beginPath();
            this.ctx.arc(pupilX, pupilY, eyeRadius * 0.5, 0, Math.PI * 2);
            this.ctx.fillStyle = '#000';
            this.ctx.fill();
        }
    }

    private adjustBrightness(color: string, factor: number): string {
        const r = parseInt(color.slice(1, 3), 16);
        const g = parseInt(color.slice(3, 5), 16);
        const b = parseInt(color.slice(5, 7), 16);

        const newR = Math.round(r * factor);
        const newG = Math.round(g * factor);
        const newB = Math.round(b * factor);

        return `rgb(${newR}, ${newG}, ${newB})`;
    }

    private drawUI(): void {
        if (!this.player) return;

        // Score
        this.ctx.fillStyle = '#fff';
        this.ctx.font = 'bold 24px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.fillText(`Score: ${this.player.score}`, 20, 40);
        this.ctx.fillText(`Length: ${this.player.segments.length}`, 20, 70);

        // Leaderboard
        const allSnakes = [this.player, ...this.aiSnakes.values()]
            .filter(s => s?.isAlive)
            .sort((a, b) => (b?.score || 0) - (a?.score || 0))
            .slice(0, 5);

        this.ctx.font = '16px Arial';
        this.ctx.textAlign = 'right';
        this.ctx.fillText('Leaderboard', this.canvas.width - 20, 30);

        allSnakes.forEach((snake, i) => {
            if (snake) {
                const text = `${i + 1}. ${snake.name}: ${snake.score}`;
                this.ctx.fillText(text, this.canvas.width - 20, 55 + i * 25);
            }
        });
    }

    private drawMinimap(): void {
        const size = 150;
        const margin = 20;
        const x = margin;
        const y = this.canvas.height - size - margin;

        // Background
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        this.ctx.fillRect(x, y, size, size);
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        this.ctx.strokeRect(x, y, size, size);

        // Scale factor
        const scale = size / Math.max(this.config.worldWidth, this.config.worldHeight);

        // Draw all snakes as dots
        const allSnakes = [this.player, ...this.aiSnakes.values()].filter(
            (s): s is Snake => s !== null && s.isAlive
        );

        for (const snake of allSnakes) {
            const head = snake.segments[0];
            const dotX = x + head.x * scale;
            const dotY = y + head.y * scale;
            const dotRadius = snake.id === 'player' ? 3 : 2;

            this.ctx.beginPath();
            this.ctx.arc(dotX, dotY, dotRadius, 0, Math.PI * 2);
            this.ctx.fillStyle = snake.id === 'player' ? '#fff' : snake.color;
            this.ctx.fill();
        }
    }

    // ═══════════════════════════════════════════════════════════
    // CLEANUP
    // ═══════════════════════════════════════════════════════════

    destroy(): void {
        this.stop();
    }
}
