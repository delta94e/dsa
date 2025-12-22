// ═══════════════════════════════════════════════════════════════
// VECTOR
// ═══════════════════════════════════════════════════════════════

export interface Vector2 {
    x: number;
    y: number;
}

// ═══════════════════════════════════════════════════════════════
// SEGMENT
// ═══════════════════════════════════════════════════════════════

export interface Segment extends Vector2 {
    radius: number;
}

// ═══════════════════════════════════════════════════════════════
// SNAKE
// ═══════════════════════════════════════════════════════════════

export interface Snake {
    id: string;
    name: string;
    segments: Segment[];
    angle: number;
    targetAngle: number;
    speed: number;
    baseSpeed: number;
    boostSpeed: number;
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
