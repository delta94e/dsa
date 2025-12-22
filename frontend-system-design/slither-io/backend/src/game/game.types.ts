// ═══════════════════════════════════════════════════════════════
// VECTOR & POSITION
// ═══════════════════════════════════════════════════════════════

export interface Vector2 {
    x: number;
    y: number;
}

export interface Segment extends Vector2 {
    radius: number;
}

// ═══════════════════════════════════════════════════════════════
// PLAYER & SNAKE
// ═══════════════════════════════════════════════════════════════

export interface Player {
    id: string;
    socketId: string;
    name: string;
    snake: Snake;
    lastInput: number; // timestamp
}

export interface Snake {
    segments: Segment[];
    angle: number;
    targetAngle: number;
    speed: number;
    isBoosting: boolean;
    color: string;
    score: number;
    isAlive: boolean;
}

// ═══════════════════════════════════════════════════════════════
// ORB
// ═══════════════════════════════════════════════════════════════

export interface Orb {
    id: string;
    x: number;
    y: number;
    value: number;
    color: string;
    radius: number;
}

// ═══════════════════════════════════════════════════════════════
// GAME CONFIG
// ═══════════════════════════════════════════════════════════════

export interface GameConfig {
    worldWidth: number;
    worldHeight: number;
    tickRate: number;           // Server updates per second
    initialSegments: number;
    segmentSpacing: number;
    baseSpeed: number;
    boostSpeed: number;
    maxTurnSpeed: number;
    orbCount: number;
}

export const DEFAULT_CONFIG: GameConfig = {
    worldWidth: 3000,
    worldHeight: 3000,
    tickRate: 20,               // 20 TPS (50ms per tick)
    initialSegments: 10,
    segmentSpacing: 5,
    baseSpeed: 3,
    boostSpeed: 6,
    maxTurnSpeed: 0.15,
    orbCount: 500,
};

// ═══════════════════════════════════════════════════════════════
// COLORS
// ═══════════════════════════════════════════════════════════════

export const SNAKE_COLORS = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4',
    '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F',
    '#BB8FCE', '#85C1E9', '#F8B500', '#00CED1',
];

export const ORB_COLORS = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4',
    '#FFEAA7', '#DDA0DD', '#F7DC6F', '#85C1E9',
];
