'use client';

import { useBreakpoint } from './useBreakpoint';

/**
 * useIsMobile
 * 
 * Hook to detect if the current viewport is mobile-sized.
 * Returns true when sm breakpoint is active but md is not.
 * 
 * @returns boolean - true if viewport is mobile (sm but not md)
 */
export function useIsMobile(): boolean {
  const breakpoint = useBreakpoint();
  return breakpoint.sm && !breakpoint.md;
}

export default useIsMobile;
