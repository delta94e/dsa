import { Vector2, Segment, Orb } from './types';

// ═══════════════════════════════════════════════════════════════
// SPATIAL GRID FOR COLLISION DETECTION
// ═══════════════════════════════════════════════════════════════

export interface GridItem {
    id: string;
    x: number;
    y: number;
}

export interface SegmentWithSnakeId extends GridItem {
    radius: number;
    snakeId: string;
}

export class SpatialGrid<T extends GridItem> {
    private cells: Map<string, Set<T>> = new Map();
    private cellSize: number;

    constructor(cellSize: number = 200) {
        this.cellSize = cellSize;
    }

    private getCellKey(x: number, y: number): string {
        const cx = Math.floor(x / this.cellSize);
        const cy = Math.floor(y / this.cellSize);
        return `${cx},${cy}`;
    }

    clear(): void {
        this.cells.clear();
    }

    insert(item: T): void {
        const key = this.getCellKey(item.x, item.y);
        if (!this.cells.has(key)) {
            this.cells.set(key, new Set());
        }
        this.cells.get(key)!.add(item);
    }

    queryRadius(x: number, y: number, radius: number): T[] {
        const results: T[] = [];
        const radiusSquared = radius * radius;

        const minCx = Math.floor((x - radius) / this.cellSize);
        const maxCx = Math.floor((x + radius) / this.cellSize);
        const minCy = Math.floor((y - radius) / this.cellSize);
        const maxCy = Math.floor((y + radius) / this.cellSize);

        for (let cx = minCx; cx <= maxCx; cx++) {
            for (let cy = minCy; cy <= maxCy; cy++) {
                const cell = this.cells.get(`${cx},${cy}`);
                if (!cell) continue;

                for (const item of cell) {
                    const dx = item.x - x;
                    const dy = item.y - y;
                    if (dx * dx + dy * dy <= radiusSquared) {
                        results.push(item);
                    }
                }
            }
        }

        return results;
    }
}

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
