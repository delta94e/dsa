// ═══════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════

export interface Vector2 {
    x: number;
    y: number;
}

export interface Segment extends Vector2 {
    radius: number;
}

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

export interface Orb {
    id: string;
    x: number;
    y: number;
    value: number;
    color: string;
    radius: number;
}

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

export const SNAKE_COLORS = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4',
    '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F',
];

export const ORB_COLORS = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4',
    '#FFEAA7', '#DDA0DD', '#F7DC6F', '#85C1E9',
];

// ═══════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════

export function distance(a: Vector2, b: Vector2): number {
    return Math.hypot(a.x - b.x, a.y - b.y);
}

export function randomInRange(min: number, max: number): number {
    return Math.random() * (max - min) + min;
}

export function randomColor(colors: string[]): string {
    return colors[Math.floor(Math.random() * colors.length)];
}

export function clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value));
}

export function normalizeAngle(angle: number): number {
    while (angle > Math.PI) angle -= Math.PI * 2;
    while (angle < -Math.PI) angle += Math.PI * 2;
    return angle;
}

export function lerpAngle(current: number, target: number, maxDelta: number): number {
    let diff = normalizeAngle(target - current);
    if (Math.abs(diff) > maxDelta) {
        diff = Math.sign(diff) * maxDelta;
    }
    return current + diff;
}
