'use client';

import { useCallback } from 'react';
import { useAppSelector } from '@/store/hooks';
import { usePlan } from './usePlan';
import { useLogout } from './useLogout';

/**
 * useHandleCsamError
 * 
 * Hook for handling CSAM (Child Safety) moderation errors.
 * Logs out free users without teams when CSAM error occurs.
 * Matches production bundle module 970681.
 * 
 * @example
 * const { handleCsamError } = useHandleCsamError();
 * handleCsamError(() => showErrorToast());
 */
export function useHandleCsamError() {
  const { isUserFreePlan } = usePlan();
  const logout = useLogout();
  const userTeams = useAppSelector((state) => state.user.teams);
  
  // Should force logout: free user with no teams
  const shouldForceLogout = isUserFreePlan && !userTeams?.length;
  
  const handleCsamError = useCallback(
    (errorCallback: () => void) => {
      // Execute the error callback first
      errorCallback();
      
      // If free user with no teams, force logout
      if (shouldForceLogout) {
        logout();
      }
    },
    [shouldForceLogout, logout]
  );
  
  return { handleCsamError };
}

export default useHandleCsamError;
