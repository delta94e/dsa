'use client';

import { useMemo } from 'react';
import { useSession } from 'next-auth/react';
import Cookies from 'js-cookie';
import { useAppSelector } from '@/store/hooks';
import { useSelectedTeam } from './useSelectedTeam';
import { useFlags } from './useFlags';
import { usePlan } from './usePlan';
import { ANONYMOUS_ID_COOKIE_NAME } from '@/constants';
import { PlanType } from '@/store/slices/userSlice';

// Re-export PlanType for consumers of this hook
export type { PlanType };

/**
 * User state interface (return type)
 */
export interface UserInfo {
    /** User ID */
    id: string;
    /** User subscription ID */
    sub: string;
    /** Current plan type */
    plan: PlanType;
    /** Whether user is logged in */
    isLoggedIn: boolean;
    /** Whether user data is ready */
    isReady: boolean;
    /** Whether user is on restricted free plan */
    isFreeRestricted: boolean;
    /** Whether free plan is elevated (promotional) */
    isFreeElevated: boolean;
    /** Whether user is unauthenticated */
    isUnauthenticated: boolean;
    /** Whether user is on a team account */
    isTeamAccount: boolean;
}

/**
 * Hook to check if user is restricted (free plan with restrictions enabled)
 */
export const useIsUserRestricted = () => {
    const { isUserFreePlan } = usePlan();
    const { isFreeTierRestrictingEnabled } = useFlags();

    const isRestricted = isUserFreePlan && isFreeTierRestrictingEnabled;

    return useMemo(() => ({
        isUserFreePlan,
        isRestricted,
    }), [isUserFreePlan, isRestricted]);
};

/**
 * useUser Hook
 * 
 * Provides user state and authentication information.
 * Uses Redux store for user data and next-auth for session.
 * 
 * @returns User state object with authentication and plan details
 * 
 * @example
 * const { id, isLoggedIn, isReady, isTeamAccount } = useUser();
 */
export function useUser(): UserInfo {
    const session = useSession();

    // Get user data from Redux store
    const userId = useAppSelector((state) => state.user.id);
    const userSub = useAppSelector((state) => state.user.sub);
    const userPlan = useAppSelector((state) => state.user.plan);
    const userLoaded = useAppSelector((state) => state.user.loaded);

    const { isFreePlanElevated } = useFlags();
    const { isRestricted } = useIsUserRestricted();
    const { userSelectedTeam } = useSelectedTeam();

    // Call userSelectedTeam function to get selected team
    const selectedTeam = userSelectedTeam();

    const isLoggedIn = !!session.data;
    const isReady = userLoaded && session.status !== 'unauthenticated';
    const isUnauthenticated = session.status === 'unauthenticated';

    // Get anonymous ID from cookie for unauthenticated users
    const anonymousId = isUnauthenticated
        ? Cookies.get(ANONYMOUS_ID_COOKIE_NAME) ?? null
        : null;

    return useMemo(() => ({
        id: isUnauthenticated ? (anonymousId ?? '') : userId,
        sub: isUnauthenticated ? '' : userSub,
        plan: userPlan,
        isLoggedIn,
        isReady,
        isFreeRestricted: isRestricted,
        isFreeElevated: isFreePlanElevated,
        isUnauthenticated,
        isTeamAccount: isReady && selectedTeam.id !== undefined,
    }), [
        userId,
        userSub,
        userPlan,
        isLoggedIn,
        isReady,
        isRestricted,
        isFreePlanElevated,
        selectedTeam.id,
        anonymousId,
        isUnauthenticated,
    ]);
}

export default useUser;
