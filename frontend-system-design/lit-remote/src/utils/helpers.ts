/**
 * Utility helper functions
 * @module utils/helpers
 */

/**
 * Generate random number in range
 */
export function randomInRange(min: number, max: number): number {
    return Math.random() * (max - min) + min;
}

/**
 * Debounce function execution
 */
export function debounce<T extends (...args: unknown[]) => void>(
    fn: T,
    delay: number
): (...args: Parameters<T>) => void {
    let timeout: ReturnType<typeof setTimeout>;
    return (...args: Parameters<T>) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => fn(...args), delay);
    };
}

/**
 * Format percentage with random variation for mock data
 */
export function mockAcceptanceRate(): string {
    return `${Math.floor(40 + Math.random() * 30)}%`;
}

/**
 * Generate snowflake particles for Christmas theme
 */
export interface Snowflake {
    id: number;
    left: number;
    delay: number;
    duration: number;
    size: number;
}

export function generateSnowflakes(count: number = 30): Snowflake[] {
    return Array.from({ length: count }, (_, id) => ({
        id,
        left: randomInRange(0, 100),
        delay: randomInRange(0, 5),
        duration: randomInRange(5, 10),
        size: randomInRange(10, 25),
    }));
}
