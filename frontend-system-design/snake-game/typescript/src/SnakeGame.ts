import {
    Position,
    Direction,
    GameStatus,
    GameState,
    GameConfig,
    DIRECTION_VECTORS,
    OPPOSITE_DIRECTION,
    KEY_TO_DIRECTION,
    DEFAULT_CONFIG,
} from './types';

// ═══════════════════════════════════════════════════════════════
// SNAKE GAME ENGINE
// ═══════════════════════════════════════════════════════════════

export class SnakeGame {
    private state: GameState;
    private config: GameConfig;
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private lastUpdateTime = 0;
    private animationId: number | null = null;

    constructor(canvas: HTMLCanvasElement, config: Partial<GameConfig> = {}) {
        this.config = { ...DEFAULT_CONFIG, ...config };
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d')!;

        // Set canvas size
        this.canvas.width = this.config.gridWidth * this.config.cellSize;
        this.canvas.height = this.config.gridHeight * this.config.cellSize;

        // Initialize state
        this.state = this.createInitialState();

        // Setup input handlers
        this.setupInputHandlers();

        // Initial render
        this.render();
    }

    // ═══════════════════════════════════════════════════════════
    // STATE INITIALIZATION
    // ═══════════════════════════════════════════════════════════

    private createInitialState(): GameState {
        const centerX = Math.floor(this.config.gridWidth / 2);
        const centerY = Math.floor(this.config.gridHeight / 2);

        const snake: Position[] = [
            { x: centerX, y: centerY },
            { x: centerX - 1, y: centerY },
            { x: centerX - 2, y: centerY },
        ];

        return {
            snake,
            direction: 'RIGHT',
            nextDirection: 'RIGHT',
            food: this.spawnFood(snake),
            score: 0,
            highScore: this.getHighScore(),
            status: 'IDLE',
            speed: this.config.initialSpeed,
        };
    }

    private spawnFood(snake: Position[]): Position {
        const occupied = new Set(snake.map(s => `${s.x},${s.y}`));
        const emptyCells: Position[] = [];

        for (let x = 0; x < this.config.gridWidth; x++) {
            for (let y = 0; y < this.config.gridHeight; y++) {
                if (!occupied.has(`${x},${y}`)) {
                    emptyCells.push({ x, y });
                }
            }
        }

        if (emptyCells.length === 0) {
            // Snake fills entire grid - player wins!
            return { x: -1, y: -1 };
        }

        return emptyCells[Math.floor(Math.random() * emptyCells.length)];
    }

    // ═══════════════════════════════════════════════════════════
    // INPUT HANDLING
    // ═══════════════════════════════════════════════════════════

    private setupInputHandlers(): void {
        document.addEventListener('keydown', this.handleKeyDown);
        this.setupTouchHandlers();
    }

    private handleKeyDown = (e: KeyboardEvent): void => {
        // Direction change
        if (KEY_TO_DIRECTION[e.code]) {
            e.preventDefault();
            this.setDirection(KEY_TO_DIRECTION[e.code]);

            // Start game if idle
            if (this.state.status === 'IDLE') {
                this.start();
            }
            return;
        }

        // Pause/Resume
        if (e.code === 'Space') {
            e.preventDefault();
            if (this.state.status === 'PLAYING') {
                this.pause();
            } else if (this.state.status === 'PAUSED') {
                this.resume();
            } else if (this.state.status === 'IDLE') {
                this.start();
            }
            return;
        }

        // Restart
        if (e.code === 'KeyR' && this.state.status === 'GAME_OVER') {
            this.restart();
        }
    };

    private setupTouchHandlers(): void {
        let startX = 0;
        let startY = 0;
        const threshold = 30;

        this.canvas.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        });

        this.canvas.addEventListener('touchend', (e) => {
            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;
            const deltaX = endX - startX;
            const deltaY = endY - startY;

            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                if (Math.abs(deltaX) > threshold) {
                    this.setDirection(deltaX > 0 ? 'RIGHT' : 'LEFT');
                }
            } else {
                if (Math.abs(deltaY) > threshold) {
                    this.setDirection(deltaY > 0 ? 'DOWN' : 'UP');
                }
            }

            if (this.state.status === 'IDLE') {
                this.start();
            }
        });
    }

    private setDirection(newDirection: Direction): void {
        // Prevent 180° turn
        if (OPPOSITE_DIRECTION[newDirection] !== this.state.direction) {
            this.state.nextDirection = newDirection;
        }
    }

    // ═══════════════════════════════════════════════════════════
    // GAME LOOP
    // ═══════════════════════════════════════════════════════════

    start(): void {
        if (this.state.status !== 'IDLE') return;
        this.state.status = 'PLAYING';
        this.lastUpdateTime = performance.now();
        this.loop();
    }

    pause(): void {
        if (this.state.status !== 'PLAYING') return;
        this.state.status = 'PAUSED';
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        this.render();
    }

    resume(): void {
        if (this.state.status !== 'PAUSED') return;
        this.state.status = 'PLAYING';
        this.lastUpdateTime = performance.now();
        this.loop();
    }

    restart(): void {
        this.state = this.createInitialState();
        this.state.status = 'PLAYING';
        this.lastUpdateTime = performance.now();
        this.loop();
    }

    private loop = (): void => {
        if (this.state.status !== 'PLAYING') return;

        const now = performance.now();
        const elapsed = now - this.lastUpdateTime;

        if (elapsed >= this.state.speed) {
            this.update();
            this.lastUpdateTime = now;
        }

        this.render();
        this.animationId = requestAnimationFrame(this.loop);
    };

    // ═══════════════════════════════════════════════════════════
    // GAME UPDATE
    // ═══════════════════════════════════════════════════════════

    private update(): void {
        // Apply queued direction
        this.state.direction = this.state.nextDirection;

        // Calculate new head position
        const head = this.state.snake[0];
        const vector = DIRECTION_VECTORS[this.state.direction];
        const newHead: Position = {
            x: head.x + vector.x,
            y: head.y + vector.y,
        };

        // Check wall collision
        if (this.checkWallCollision(newHead)) {
            this.gameOver();
            return;
        }

        // Check self collision
        if (this.checkSelfCollision(newHead)) {
            this.gameOver();
            return;
        }

        // Move snake
        this.state.snake.unshift(newHead);

        // Check food collision
        if (this.checkFoodCollision(newHead)) {
            this.eatFood();
        } else {
            this.state.snake.pop();
        }
    }

    // ═══════════════════════════════════════════════════════════
    // COLLISION DETECTION
    // ═══════════════════════════════════════════════════════════

    private checkWallCollision(head: Position): boolean {
        return (
            head.x < 0 ||
            head.x >= this.config.gridWidth ||
            head.y < 0 ||
            head.y >= this.config.gridHeight
        );
    }

    private checkSelfCollision(head: Position): boolean {
        return this.state.snake.some(
            segment => segment.x === head.x && segment.y === head.y
        );
    }

    private checkFoodCollision(head: Position): boolean {
        return head.x === this.state.food.x && head.y === this.state.food.y;
    }

    // ═══════════════════════════════════════════════════════════
    // GAME ACTIONS
    // ═══════════════════════════════════════════════════════════

    private eatFood(): void {
        this.state.score += 10;
        this.state.food = this.spawnFood(this.state.snake);

        // Increase speed
        this.state.speed = Math.max(
            this.config.minSpeed,
            this.state.speed - this.config.speedIncrement
        );
    }

    private gameOver(): void {
        this.state.status = 'GAME_OVER';

        // Update high score
        if (this.state.score > this.state.highScore) {
            this.state.highScore = this.state.score;
            this.setHighScore(this.state.score);
        }

        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }

        this.render();
    }

    // ═══════════════════════════════════════════════════════════
    // HIGH SCORE
    // ═══════════════════════════════════════════════════════════

    private getHighScore(): number {
        try {
            const stored = localStorage.getItem('snake-high-score');
            return stored ? parseInt(stored, 10) : 0;
        } catch {
            return 0;
        }
    }

    private setHighScore(score: number): void {
        try {
            localStorage.setItem('snake-high-score', score.toString());
        } catch {
            // Ignore
        }
    }

    // ═══════════════════════════════════════════════════════════
    // RENDERING
    // ═══════════════════════════════════════════════════════════

    private render(): void {
        this.clear();
        this.drawGrid();
        this.drawFood();
        this.drawSnake();
        this.drawUI();

        if (this.state.status === 'IDLE') {
            this.drawStartScreen();
        } else if (this.state.status === 'PAUSED') {
            this.drawPauseScreen();
        } else if (this.state.status === 'GAME_OVER') {
            this.drawGameOverScreen();
        }
    }

    private clear(): void {
        this.ctx.fillStyle = '#1a1a2e';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    private drawGrid(): void {
        this.ctx.strokeStyle = '#252542';
        this.ctx.lineWidth = 0.5;

        for (let x = 0; x <= this.config.gridWidth; x++) {
            this.ctx.beginPath();
            this.ctx.moveTo(x * this.config.cellSize, 0);
            this.ctx.lineTo(x * this.config.cellSize, this.canvas.height);
            this.ctx.stroke();
        }

        for (let y = 0; y <= this.config.gridHeight; y++) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y * this.config.cellSize);
            this.ctx.lineTo(this.canvas.width, y * this.config.cellSize);
            this.ctx.stroke();
        }
    }

    private drawFood(): void {
        const { food } = this.state;
        const { cellSize } = this.config;

        this.ctx.fillStyle = '#e94560';
        this.ctx.beginPath();
        this.ctx.arc(
            food.x * cellSize + cellSize / 2,
            food.y * cellSize + cellSize / 2,
            cellSize / 2 - 2,
            0,
            Math.PI * 2
        );
        this.ctx.fill();
    }

    private drawSnake(): void {
        const { snake } = this.state;
        const { cellSize } = this.config;

        snake.forEach((segment, index) => {
            // Gradient from head to tail
            const brightness = 1 - (index / snake.length) * 0.5;
            this.ctx.fillStyle = `hsl(145, 63%, ${Math.floor(45 * brightness)}%)`;

            const x = segment.x * cellSize + 1;
            const y = segment.y * cellSize + 1;
            const size = cellSize - 2;

            // Draw rounded rectangle for head
            if (index === 0) {
                this.ctx.beginPath();
                this.ctx.roundRect(x, y, size, size, 4);
                this.ctx.fill();
            } else {
                this.ctx.fillRect(x, y, size, size);
            }
        });
    }

    private drawUI(): void {
        // Score
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = 'bold 16px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.fillText(`Score: ${this.state.score}`, 10, 25);

        // High Score
        this.ctx.textAlign = 'right';
        this.ctx.fillText(`High: ${this.state.highScore}`, this.canvas.width - 10, 25);
    }

    private drawStartScreen(): void {
        this.drawOverlay();
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = 'bold 24px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('🐍 SNAKE GAME', this.canvas.width / 2, this.canvas.height / 2 - 30);
        this.ctx.font = '16px Arial';
        this.ctx.fillText('Press any arrow key to start', this.canvas.width / 2, this.canvas.height / 2 + 10);
        this.ctx.fillText('WASD or Arrow keys to move', this.canvas.width / 2, this.canvas.height / 2 + 35);
    }

    private drawPauseScreen(): void {
        this.drawOverlay();
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = 'bold 24px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('⏸️ PAUSED', this.canvas.width / 2, this.canvas.height / 2 - 10);
        this.ctx.font = '16px Arial';
        this.ctx.fillText('Press SPACE to resume', this.canvas.width / 2, this.canvas.height / 2 + 20);
    }

    private drawGameOverScreen(): void {
        this.drawOverlay();
        this.ctx.fillStyle = '#e94560';
        this.ctx.font = 'bold 28px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('GAME OVER', this.canvas.width / 2, this.canvas.height / 2 - 30);

        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = '18px Arial';
        this.ctx.fillText(`Score: ${this.state.score}`, this.canvas.width / 2, this.canvas.height / 2 + 5);

        if (this.state.score === this.state.highScore && this.state.score > 0) {
            this.ctx.fillStyle = '#ffd700';
            this.ctx.fillText('🏆 New High Score!', this.canvas.width / 2, this.canvas.height / 2 + 35);
        }

        this.ctx.fillStyle = '#888888';
        this.ctx.font = '14px Arial';
        this.ctx.fillText('Press R to restart', this.canvas.width / 2, this.canvas.height / 2 + 65);
    }

    private drawOverlay(): void {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    // ═══════════════════════════════════════════════════════════
    // CLEANUP
    // ═══════════════════════════════════════════════════════════

    destroy(): void {
        document.removeEventListener('keydown', this.handleKeyDown);
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }
}
