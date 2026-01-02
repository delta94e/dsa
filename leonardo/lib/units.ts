/**
 * Unit conversion utilities
 */

/**
 * Convert rem to pixels
 * 
 * @param rem - Value in rem units (string or number)
 * @returns Value in pixels (defaults to 16 if invalid)
 */
export function remToPx(rem: number | string): number {
    const value = typeof rem === 'string' ? parseFloat(rem) : rem;
    return !isNaN(value) && value > 0 ? 16 * value : 16;
}

/**
 * Convert pixels to rem
 * 
 * @param px - Value in pixels
 * @returns Value in rem units
 */
export function pxToRem(px: number): number {
    if (typeof window === 'undefined') {
        return px / 16;
    }

    const rootFontSize = parseFloat(
        getComputedStyle(document.documentElement).fontSize
    );

    return px / rootFontSize;
}
