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
// Initial State
// ============================================================================

const initialState: UserState = {
    id: '',
    sub: '',
    email: '',
    username: '',
    avatar: '',
    plan: 'FREE',
    loaded: false,
    tokens: 150,
    teams: [],
    tokenRenewalDate: undefined,
    apiPlanTokenRenewalDate: undefined,
    auth0Email: undefined,
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
