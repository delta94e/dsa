// ═══════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════

export interface Position {
    x: number;
    y: number;
}

export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export type GameStatus = 'IDLE' | 'PLAYING' | 'PAUSED' | 'GAME_OVER';

export interface GameState {
    snake: Position[];
    direction: Direction;
    nextDirection: Direction;
    food: Position;
    score: number;
    highScore: number;
    status: GameStatus;
    speed: number;
}

export interface GameConfig {
    gridWidth: number;
    gridHeight: number;
    cellSize: number;
    initialSpeed: number;
    speedIncrement: number;
    minSpeed: number;
}

// ═══════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════

export const DIRECTION_VECTORS: Record<Direction, Position> = {
    UP: { x: 0, y: -1 },
    DOWN: { x: 0, y: 1 },
    LEFT: { x: -1, y: 0 },
    RIGHT: { x: 1, y: 0 },
};

export const OPPOSITE_DIRECTION: Record<Direction, Direction> = {
    UP: 'DOWN',
    DOWN: 'UP',
    LEFT: 'RIGHT',
    RIGHT: 'LEFT',
};

export const KEY_TO_DIRECTION: Record<string, Direction> = {
    ArrowUp: 'UP',
    ArrowDown: 'DOWN',
    ArrowLeft: 'LEFT',
    ArrowRight: 'RIGHT',
    KeyW: 'UP',
    KeyS: 'DOWN',
    KeyA: 'LEFT',
    KeyD: 'RIGHT',
};

export const DEFAULT_CONFIG: GameConfig = {
    gridWidth: 20,
    gridHeight: 20,
    cellSize: 20,
    initialSpeed: 150,
    speedIncrement: 5,
    minSpeed: 50,
};

const HIGH_SCORE_KEY = 'snake-game-high-score';
