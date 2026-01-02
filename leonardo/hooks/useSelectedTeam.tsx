'use client';

import {
    createContext,
    useContext,
    useState,
    useCallback,
    useMemo,
    useEffect,
    type ReactNode
} from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { addUserProperties, addEventProperties, removeEventProperty } from '@/lib/analytics';
import { SELECTED_TEAM_COOKIE_NAME } from '@/constants';

// ============================================================================
// Constants
// ============================================================================

const COOKIE_OPTIONS: Cookies.CookieAttributes = {
    path: '/',
    secure: true,
    sameSite: 'lax',
    expires: 90,
};

// ============================================================================
// Types
// ============================================================================

export interface TeamMember {
    id: string;
    userId: string;
    role: 'owner' | 'admin' | 'member';
    name?: string;
    avatar?: string;
}

export interface Team {
    akUUID?: string;
    id?: string;
    teamName?: string;
    teamLogoUrl?: string;
    plan?: string;
    planSubscribeFrequency?: string;
    planTokenRenewalDate?: string;
    planCustomTokenRenewalAmount?: number;
    planSeats?: number;
    creatorUserId?: string;
    subscriptionTokens?: number;
    paidTokens?: number | null;
    userRole?: 'owner' | 'admin' | 'member';
    createdAt?: string;
    planSubscribeDate?: string;
    rolloverTokens?: number;
    members?: TeamMember[];
}

interface SelectedTeamContextValue {
    selectedTeamUUID?: string;
    setSelectedTeam: (teamUUID: string) => void;
    resetSelectedTeam: () => void;
    userSelectedTeam: () => Team;
}

// ============================================================================
// Default Values
// ============================================================================

const DEFAULT_TEAM: Team = {
    akUUID: undefined,
    id: undefined,
    teamName: undefined,
    teamLogoUrl: undefined,
    plan: undefined,
    planSubscribeFrequency: undefined,
    planTokenRenewalDate: undefined,
    planCustomTokenRenewalAmount: 0,
    planSeats: undefined,
    creatorUserId: undefined,
    subscriptionTokens: undefined,
    paidTokens: null,
    userRole: undefined,
    createdAt: undefined,
    planSubscribeDate: undefined,
    rolloverTokens: 0,
    members: [],
};

// ============================================================================
// Helper: Cache Clearing
// ============================================================================

/**
 * Clear Apollo cache for blueprint-related queries
 * In production, this would evict specific queries from Apollo cache
 */
function clearTeamRelatedCache(/* apolloClient: ApolloClient<any> */) {
    // const cache = apolloClient.cache;
    // const fieldNames = ['getBlueprintExecutions', 'getBlueprintById', 'getBlueprints'];
    // fieldNames.forEach(fieldName => {
    //     cache.evict({ id: 'ROOT_QUERY', fieldName });
    // });
    // cache.gc();
    console.log('[Cache] Team-related cache cleared');
}

// ============================================================================
// Hook: useSelectedTeamLaunchDarklyUpdate
// ============================================================================

export const useSelectedTeamLaunchDarklyUpdate = () => {
    // const ldClient = useLDClient();
    const [isLoading, setIsLoading] = useState(false);

    const updateSelectedTeamInLaunchDarkly = useCallback(async (teamUUID?: string) => {
        // if (ldClient) {
        //     setIsLoading(true);
        //     addLaunchDarklyProperties(
        //         { selectedTeamUUID: teamUUID ?? false },
        //         () => setIsLoading(false)
        //     );
        // }
        setIsLoading(true);
        console.log('[LaunchDarkly] Updated selectedTeamUUID:', teamUUID ?? false);
        setIsLoading(false);
    }, []);

    return {
        updateSelectedTeamInLaunchDarkly,
        isLoading,
    };
};

// ============================================================================
// Hook: useUserActivityActions
// ============================================================================

export const useUserActivityActions = () => {
    // In production, this would use GraphQL mutation
    // const { updateUserState } = useUserStateMutation(UserStateType.Activity);

    const setLastActiveTeam = useCallback((teamId: string) => {
        // return updateUserState({ state: { lastActiveTeamId: teamId } });
        console.log('[UserActivity] Set last active team:', teamId);
    }, []);

    const clearLastActiveTeam = useCallback(() => {
        // return updateUserState({ state: { lastActiveTeamId: null } });
        console.log('[UserActivity] Cleared last active team');
    }, []);

    return {
        setLastActiveTeam,
        clearLastActiveTeam,
    };
};

// ============================================================================
// Hook: useResetGenerationSettings
// ============================================================================

const useResetGenerationSettings = () => {
    const dispatch = useAppDispatch();

    return useCallback(() => {
        // dispatch(setInputImage(null));
        // dispatch(setModelId(DEFAULT_GENERATION_SETTINGS.modelId));
        // dispatch(setSettings({ newSettings: { imageInputs: [] } }));
        console.log('[Generation] Reset generation settings');
    }, [dispatch]);
};

// ============================================================================
// Context
// ============================================================================

const SelectedTeamContext = createContext<SelectedTeamContextValue | null>(null);

// ============================================================================
// Provider
// ============================================================================

interface SelectedTeamProviderProps {
    children: ReactNode;
    initial?: string;
}

export function SelectedTeamProvider({ children, initial }: SelectedTeamProviderProps) {
    // Hooks
    const router = useRouter();
    // const apolloClient = useApolloClient();
    
    // Redux
    const teams = useAppSelector((state) => state.user.teams);
    
    // Custom hooks
    const { setLastActiveTeam, clearLastActiveTeam } = useUserActivityActions();
    const resetGenerationSettings = useResetGenerationSettings();
    const { updateSelectedTeamInLaunchDarkly } = useSelectedTeamLaunchDarklyUpdate();

    // State - Initialize from props, cookie, or undefined
    const [selectedTeamUUID, setSelectedTeamUUID] = useState<string | undefined>(() => {
        return initial ?? Cookies.get(SELECTED_TEAM_COOKIE_NAME) ?? undefined;
    });

    // ========================================================================
    // setSelectedTeam
    // ========================================================================
    const setSelectedTeam = useCallback((teamUUID: string) => {
        // Clear cache if switching to different team
        if (selectedTeamUUID !== teamUUID) {
            clearTeamRelatedCache(/* apolloClient */);
        }

        // Set cookie
        Cookies.set(SELECTED_TEAM_COOKIE_NAME, teamUUID, COOKIE_OPTIONS);
        
        // Update state
        setSelectedTeamUUID(teamUUID);
        
        // Set last active team
        setLastActiveTeam(teamUUID);
        
        // Reset generation settings
        resetGenerationSettings();
        
        // Update LaunchDarkly
        updateSelectedTeamInLaunchDarkly(teamUUID);

        // Find team details for analytics
        const team = teams?.find((t) => t.akUUID === teamUUID);

        // Add user properties
        addUserProperties({
            teamId: team?.id,
            teamName: team?.teamName,
            teamPlan: team?.plan,
            teamPlanSeats: team?.planSeats,
        });

        // Add event properties
        addEventProperties({
            teamId: team?.id,
            teamName: team?.teamName,
            teamPlan: team?.plan,
            teamPlanSeats: team?.planSeats,
        });

        // Refresh router
        router.refresh();
    }, [
        selectedTeamUUID,
        // apolloClient,
        setLastActiveTeam,
        resetGenerationSettings,
        updateSelectedTeamInLaunchDarkly,
        teams,
        router,
    ]);

    // ========================================================================
    // resetSelectedTeam
    // ========================================================================
    const resetSelectedTeam = useCallback(() => {
        // Clear cache
        clearTeamRelatedCache(/* apolloClient */);

        // Remove cookie
        Cookies.remove(SELECTED_TEAM_COOKIE_NAME);
        
        // Clear state
        setSelectedTeamUUID(undefined);
        
        // Clear last active team
        clearLastActiveTeam();
        
        // Reset generation settings
        resetGenerationSettings();
        
        // Update LaunchDarkly with undefined
        updateSelectedTeamInLaunchDarkly(undefined);

        // Clear user properties
        addUserProperties({
            teamId: undefined,
            teamName: undefined,
            teamPlan: undefined,
            teamPlanSeats: undefined,
        });

        // Remove event properties
        removeEventProperty('teamId');
        removeEventProperty('teamName');
        removeEventProperty('teamPlan');
        removeEventProperty('teamPlanSeats');

        // Refresh router
        router.refresh();
    }, [
        // apolloClient,
        clearLastActiveTeam,
        resetGenerationSettings,
        updateSelectedTeamInLaunchDarkly,
        router,
    ]);

    // ========================================================================
    // selectedTeam (memoized)
    // ========================================================================
    const selectedTeam = useMemo(() => {
        return teams?.find((t) => t.akUUID === selectedTeamUUID);
    }, [teams, selectedTeamUUID]);

    // ========================================================================
    // userSelectedTeam (callback that returns team)
    // ========================================================================
    const userSelectedTeam = useCallback((): Team => {
        return selectedTeam ?? DEFAULT_TEAM;
    }, [selectedTeam]);

    // ========================================================================
    // Context value
    // ========================================================================
    const value = useMemo(() => ({
        selectedTeamUUID,
        setSelectedTeam,
        resetSelectedTeam,
        userSelectedTeam,
    }), [selectedTeamUUID, setSelectedTeam, resetSelectedTeam, userSelectedTeam]);

    return (
        <SelectedTeamContext.Provider value={value}>
            {children}
        </SelectedTeamContext.Provider>
    );
}

// ============================================================================
// Hook: useSelectedTeam
// ============================================================================

export function useSelectedTeam(): SelectedTeamContextValue {
    const context = useContext(SelectedTeamContext);

    if (!context) {
        throw new Error('useSelectedTeam must be used within <SelectedTeamProvider>');
    }

    return context;
}

export default useSelectedTeam;
