import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// ============================================================================
// Types
// ============================================================================

export type PlanType =
    | 'FREE'
    | 'FREEPLUS'
    | 'BASIC'
    | 'STANDARD'
    | 'PRO'
    | 'CUSTOM';

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

export interface UserState {
    id: string;
    sub: string;
    email: string;
    username: string;
    avatar: string;
    plan: PlanType;
    loaded: boolean;
    tokens: number;
    teams: Team[];
    /** Token renewal date for subscription */
    tokenRenewalDate?: string;
    /** API plan token renewal date */
    apiPlanTokenRenewalDate?: string;
    /** Auth0 email for privilege check */
    auth0Email?: string;
}

// ============================================================================
// Mock Data for Development
// ============================================================================

const MOCK_TEAM: Team = {
    akUUID: 'ak-uuid-mock-1',
    id: 'mock-team-1',
    teamName: 'My Team',
    teamLogoUrl: undefined,
    plan: 'FREE',
    planSubscribeFrequency: 'monthly',
    planTokenRenewalDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    planCustomTokenRenewalAmount: undefined,
    planSeats: 1,
    creatorUserId: 'mock-user-123',
    subscriptionTokens: 150,
    paidTokens: null,
    userRole: 'owner',
    createdAt: new Date().toISOString(),
    planSubscribeDate: new Date().toISOString(),
    rolloverTokens: 0,
    members: [
        {
            id: 'mock-member-1',
            userId: 'mock-user-123',
            role: 'owner',
            name: 'Demo User',
        },
    ],
};

// ============================================================================
// Initial State
// ============================================================================

const initialState: UserState = {
    id: 'mock-user-123',
    sub: 'mock-sub-123',
    email: 'demo@leonardo.ai',
    username: 'DemoUser',
    avatar: 'https://i.pravatar.cc/150?u=demo@leonardo.ai',
    plan: 'FREE',
    loaded: true,
    tokens: 150,
    teams: [MOCK_TEAM],
    tokenRenewalDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    apiPlanTokenRenewalDate: undefined,
    auth0Email: 'demo@leonardo.ai',
};

// ============================================================================
// Slice
// ============================================================================

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<Partial<UserState>>) => {
            return { ...state, ...action.payload, loaded: true };
        },
        setUserPlan: (state, action: PayloadAction<PlanType>) => {
            state.plan = action.payload;
        },
        setUserTokens: (state, action: PayloadAction<number>) => {
            state.tokens = action.payload;
        },
        setUserTeams: (state, action: PayloadAction<Team[]>) => {
            state.teams = action.payload;
        },
        setTokenRenewalDate: (state, action: PayloadAction<string | undefined>) => {
            state.tokenRenewalDate = action.payload;
        },
        setApiPlanTokenRenewalDate: (state, action: PayloadAction<string | undefined>) => {
            state.apiPlanTokenRenewalDate = action.payload;
        },
        addTeam: (state, action: PayloadAction<Team>) => {
            state.teams.push(action.payload);
        },
        updateTeam: (state, action: PayloadAction<Team>) => {
            const index = state.teams.findIndex(t => t.akUUID === action.payload.akUUID);
            if (index !== -1) {
                state.teams[index] = action.payload;
            }
        },
        removeTeam: (state, action: PayloadAction<string>) => {
            state.teams = state.teams.filter(t => t.akUUID !== action.payload);
        },
        clearUser: () => {
            return { ...initialState };
        },
        setUserLoaded: (state, action: PayloadAction<boolean>) => {
            state.loaded = action.payload;
        },
    },
});

// ============================================================================
// Actions
// ============================================================================

export const {
    setUser,
    setUserPlan,
    setUserTokens,
    setUserTeams,
    setTokenRenewalDate,
    setApiPlanTokenRenewalDate,
    addTeam,
    updateTeam,
    removeTeam,
    clearUser,
    setUserLoaded,
} = userSlice.actions;

export default userSlice.reducer;
