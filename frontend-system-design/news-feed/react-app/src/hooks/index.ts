/**
 * Custom Hooks
 */

import { useEffect, useRef, useCallback } from 'react';

/**
 * Hook for infinite scroll detection
 */
export function useInfiniteScroll(
    callback: () => void,
    options: { threshold?: number; enabled?: boolean } = {}
) {
    const { threshold = 100, enabled = true } = options;
    const observerRef = useRef<IntersectionObserver | null>(null);

    const sentinelRef = useCallback(
        (node: HTMLDivElement | null) => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }

            if (!node || !enabled) return;

            observerRef.current = new IntersectionObserver(
                (entries) => {
                    if (entries[0].isIntersecting) {
                        callback();
                    }
                },
                { rootMargin: `${threshold}px` }
            );

            observerRef.current.observe(node);
        },
        [callback, threshold, enabled]
    );

    useEffect(() => {
        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, []);

    return sentinelRef;
}

/**
 * Hook for lazy loading images
 */
export function useLazyImage(src: string | undefined) {
    const imgRef = useRef<HTMLImageElement>(null);
    const observerRef = useRef<IntersectionObserver | null>(null);

    useEffect(() => {
        if (!src || !imgRef.current) return;

        const img = imgRef.current;

        observerRef.current = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    img.src = src;
                    observerRef.current?.disconnect();
                }
            },
            { rootMargin: '50px' }
        );

        observerRef.current.observe(img);

        return () => {
            observerRef.current?.disconnect();
        };
    }, [src]);

    return imgRef;
}

/**
 * Hook to detect outside clicks
 */
export function useClickOutside(callback: () => void) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClick(event: MouseEvent) {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                callback();
            }
        }

        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, [callback]);

    return ref;
}
