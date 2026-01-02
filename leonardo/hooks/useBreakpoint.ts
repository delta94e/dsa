'use client';

import { useState, useEffect } from 'react';

// ============================================================================
// Types
// ============================================================================

type BreakpointKey = 'sm' | 'md' | 'lg' | 'xl';
type BreakpointState = Record<BreakpointKey, boolean>;

const BREAKPOINT_KEYS: BreakpointKey[] = ['sm', 'md', 'lg', 'xl'];

// ============================================================================
// Helpers
// ============================================================================

/**
 * Creates MediaQueryList objects for each breakpoint.
 * Reads breakpoint values from CSS custom properties (--breakpoint-sm, etc.)
 */
function createMediaQueries(): Record<BreakpointKey, MediaQueryList> {
  return BREAKPOINT_KEYS.reduce((acc, key) => {
    const cssValue = getComputedStyle(document.documentElement)
      .getPropertyValue(`--breakpoint-${key}`)
      .trim();
    
    const breakpointPx = parseInt(cssValue) || 0;
    
    acc[key] = window.matchMedia(`(min-width: ${breakpointPx}px)`);
    return acc;
  }, {} as Record<BreakpointKey, MediaQueryList>);
}

// ============================================================================
// Hook: useBreakpoint
// ============================================================================

/**
 * useBreakpoint
 * 
 * Returns an object indicating which breakpoints are currently active.
 * Reads breakpoint values from CSS custom properties:
 * - --breakpoint-sm
 * - --breakpoint-md
 * - --breakpoint-lg
 * - --breakpoint-xl
 * 
 * @example
 * const { sm, md, lg, xl } = useBreakpoint();
 */
export function useBreakpoint(): BreakpointState {
  const [breakpoints, setBreakpoints] = useState<BreakpointState>(() => {
    // SSR safety
    if (typeof window === 'undefined') {
      return { sm: false, md: false, lg: false, xl: false };
    }
    
    const mediaQueries = createMediaQueries();
    return BREAKPOINT_KEYS.reduce((acc, key) => {
      acc[key] = mediaQueries[key].matches;
      return acc;
    }, {} as BreakpointState);
  });

  useEffect(() => {
    const mediaQueries = createMediaQueries();

    const handleChange = () => {
      setBreakpoints(
        BREAKPOINT_KEYS.reduce((acc, key) => {
          acc[key] = mediaQueries[key].matches;
          return acc;
        }, {} as BreakpointState)
      );
    };

    // Set initial state
    handleChange();

    // Add event listeners
    BREAKPOINT_KEYS.forEach((key) => {
      mediaQueries[key].addEventListener('change', handleChange);
    });

    // Cleanup
    return () => {
      BREAKPOINT_KEYS.forEach((key) => {
        mediaQueries[key].removeEventListener('change', handleChange);
      });
    };
  }, []);

  return breakpoints;
}

export default useBreakpoint;
