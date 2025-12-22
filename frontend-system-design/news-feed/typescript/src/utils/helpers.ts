/**
 * News Feed System - Utility Functions
 */

// ============================================
// Time Formatting
// ============================================

/**
 * Format a timestamp to relative time (e.g., "2h ago", "3d ago")
 */
export function formatRelativeTime(timestamp: number): string {
    const now = Date.now();
    const seconds = Math.floor((now - timestamp) / 1000);

    if (seconds < 0) {
        return 'just now';
    }

    if (seconds < 60) {
        return 'just now';
    }

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) {
        return `${minutes}m ago`;
    }

    const hours = Math.floor(minutes / 60);
    if (hours < 24) {
        return `${hours}h ago`;
    }

    const days = Math.floor(hours / 24);
    if (days < 7) {
        return `${days}d ago`;
    }

    const weeks = Math.floor(days / 7);
    if (weeks < 4) {
        return `${weeks}w ago`;
    }

    // For older posts, show the date
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
    });
}

// ============================================
// Number Formatting
// ============================================

/**
 * Format large numbers to compact form (e.g., 1500 -> "1.5K")
 */
export function formatCount(count: number): string {
    if (count < 0) {
        return '0';
    }

    if (count >= 1_000_000_000) {
        return `${(count / 1_000_000_000).toFixed(1).replace(/\.0$/, '')}B`;
    }

    if (count >= 1_000_000) {
        return `${(count / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`;
    }

    if (count >= 1_000) {
        return `${(count / 1_000).toFixed(1).replace(/\.0$/, '')}K`;
    }

    return count.toString();
}

/**
 * Format reaction counts for display
 */
export function formatReactionSummary(
    reactions: Record<string, number>
): string {
    const total = Object.values(reactions).reduce((sum, count) => sum + count, 0);

    if (total === 0) {
        return '';
    }

    return formatCount(total);
}

// ============================================
// Debounce & Throttle
// ============================================

/**
 * Debounce function - delays execution until after wait ms have elapsed
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
    fn: T,
    wait: number
): (...args: Parameters<T>) => void {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    return function (this: unknown, ...args: Parameters<T>): void {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }

        timeoutId = setTimeout(() => {
            fn.apply(this, args);
            timeoutId = null;
        }, wait);
    };
}

/**
 * Throttle function - limits execution to once per wait ms
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
    fn: T,
    wait: number
): (...args: Parameters<T>) => void {
    let lastTime = 0;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    return function (this: unknown, ...args: Parameters<T>): void {
        const now = Date.now();
        const remaining = wait - (now - lastTime);

        if (remaining <= 0) {
            if (timeoutId) {
                clearTimeout(timeoutId);
                timeoutId = null;
            }
            lastTime = now;
            fn.apply(this, args);
        } else if (!timeoutId) {
            timeoutId = setTimeout(() => {
                lastTime = Date.now();
                timeoutId = null;
                fn.apply(this, args);
            }, remaining);
        }
    };
}

// ============================================
// ID Generation
// ============================================

/**
 * Generate a unique ID
 */
export function generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
}

// ============================================
// Validation
// ============================================

/**
 * Validate post content
 */
export function validatePostContent(content: string): {
    valid: boolean;
    error?: string
} {
    const trimmed = content.trim();

    if (!trimmed) {
        return { valid: false, error: 'Post content cannot be empty' };
    }

    if (trimmed.length > 5000) {
        return { valid: false, error: 'Post content must be under 5000 characters' };
    }

    return { valid: true };
}

/**
 * Validate image URL
 */
export function isValidImageUrl(url: string): boolean {
    try {
        const parsed = new URL(url);
        return ['http:', 'https:'].includes(parsed.protocol);
    } catch {
        return false;
    }
}

// ============================================
// Text Utilities
// ============================================

/**
 * Truncate text to a maximum length
 */
export function truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) {
        return text;
    }

    return text.slice(0, maxLength - 3).trim() + '...';
}

/**
 * Escape HTML to prevent XSS
 */
export function escapeHtml(text: string): string {
    const htmlEntities: Record<string, string> = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    };

    return text.replace(/[&<>"']/g, char => htmlEntities[char] || char);
}

// ============================================
// Array Utilities
// ============================================

/**
 * Remove duplicates from an array by key
 */
export function uniqueBy<T>(array: T[], key: keyof T): T[] {
    const seen = new Set<unknown>();
    return array.filter(item => {
        const value = item[key];
        if (seen.has(value)) {
            return false;
        }
        seen.add(value);
        return true;
    });
}

/**
 * Update an item in an array by ID
 */
export function updateById<T extends { id: string }>(
    array: T[],
    id: string,
    updates: Partial<T>
): T[] {
    return array.map(item =>
        item.id === id ? { ...item, ...updates } : item
    );
}

/**
 * Remove an item from an array by ID
 */
export function removeById<T extends { id: string }>(
    array: T[],
    id: string
): T[] {
    return array.filter(item => item.id !== id);
}
