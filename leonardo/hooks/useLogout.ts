'use client';

import { useCallback } from 'react';
import { signOut } from 'next-auth/react';
import { clearUtmParamsFromSession } from '@/lib/utils/session';

/**
 * useLogout
 * 
 * Hook for handling user logout.
 * Matches production bundle module 344248.
 * 
 * @example
 * const logout = useLogout();
 * logout(); // Signs out the user
 */
export function useLogout() {
  return useCallback(() => {
    // Clear UTM params from session storage
    clearUtmParamsFromSession();
    
    // Sign out via NextAuth with custom callback URL
    signOut({ callbackUrl: '/api/auth/logout' });
  }, []);
}

export default useLogout;
