'use client';

import { useEffect, type RefObject } from 'react';

interface UseClickOutsideOptions {
    ref: RefObject<HTMLElement | null>;
    onClickOutside: (event: MouseEvent | TouchEvent) => void;
    enabled?: boolean;
}

/**
 * useClickOutside
 * 
 * Hook that triggers a callback when clicking outside the referenced element.
 * 
 * @param options.ref - Reference to the element to detect clicks outside of
 * @param options.onClickOutside - Callback function when click outside is detected
 * @param options.enabled - Whether the listener is active (default: true)
 */
export function useClickOutside({
    ref,
    onClickOutside,
    enabled = true,
}: UseClickOutsideOptions): void {
    useEffect(() => {
        if (!enabled) return;

        const handleClickOutside = (event: MouseEvent | TouchEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                onClickOutside(event);
            }
        };

        // Add event listeners
        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('touchstart', handleClickOutside);

        // Cleanup
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('touchstart', handleClickOutside);
        };
    }, [ref, onClickOutside, enabled]);
}

export default useClickOutside;

