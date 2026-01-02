/**
 * Plans & Pricing Constants
 */

// ============================================================================
// User Plan Types
// ============================================================================

export const UserPlanNames = {
    FREE: 'FREE',
    FREEPLUS: 'FREEPLUS',
    BASIC: 'BASIC',
    STANDARD: 'STANDARD',
    PRO: 'PRO',
} as const;

export type UserPlanName = (typeof UserPlanNames)[keyof typeof UserPlanNames];

// ============================================================================
// Plan Display Names
// ============================================================================

export const PLAN_TO_NAME: Record<UserPlanName, string> = {
    [UserPlanNames.FREE]: 'Free',
    [UserPlanNames.FREEPLUS]: 'Free+',
    [UserPlanNames.BASIC]: 'Apprentice',
    [UserPlanNames.STANDARD]: 'Artisan',
    [UserPlanNames.PRO]: 'Maestro',
};

// ============================================================================
// API Plan Types
// ============================================================================

export const API_PLAN = {
    FREE: 'FREE',
    FREEPLUS: 'FREEPLUS',
    BASIC: 'BASIC',
    STANDARD: 'STANDARD',
    PRO: 'PRO',
    CUSTOM: 'CUSTOM',
    PAYG: 'PAYG',
} as const;

export type ApiPlan = (typeof API_PLAN)[keyof typeof API_PLAN];

export const PLAN_TO_NAME_ENTERPRISE: Record<ApiPlan, string> = {
    [API_PLAN.FREE]: 'API Free',
    [API_PLAN.FREEPLUS]: 'API Free+',
    [API_PLAN.BASIC]: 'API Basic',
    [API_PLAN.STANDARD]: 'API Standard',
    [API_PLAN.PRO]: 'API Pro',
    [API_PLAN.CUSTOM]: 'API Custom',
    [API_PLAN.PAYG]: 'API Pay As You Go',
};

// ============================================================================
// Team Plan Types
// ============================================================================

export const TEAM_PLAN = {
    FREE: 'FREE',
    FREEPLUS: 'FREEPLUS',
    BASIC: 'BASIC',
    STANDARD: 'STANDARD',
    PRO: 'PRO',
    CUSTOM: 'CUSTOM',
    STARTER: 'STARTER',
    GROWTH: 'GROWTH',
} as const;

export type TeamPlan = (typeof TEAM_PLAN)[keyof typeof TEAM_PLAN];

export const PLAN_TO_NAME_TEAMS: Record<TeamPlan, string> = {
    [TEAM_PLAN.FREE]: 'Free',
    [TEAM_PLAN.FREEPLUS]: 'Free+',
    [TEAM_PLAN.BASIC]: 'Basic',
    [TEAM_PLAN.STANDARD]: 'Standard',
    [TEAM_PLAN.PRO]: 'Custom',
    [TEAM_PLAN.CUSTOM]: 'Custom',
    [TEAM_PLAN.STARTER]: 'Starter',
    [TEAM_PLAN.GROWTH]: 'Growth',
};

export const TEAM_PLANS_COST_PER_SEAT: Partial<Record<TeamPlan, number | undefined>> = {
    [TEAM_PLAN.STARTER]: 24,
    [TEAM_PLAN.GROWTH]: 48,
    [TEAM_PLAN.PRO]: undefined,
    [TEAM_PLAN.FREE]: undefined,
    [TEAM_PLAN.FREEPLUS]: undefined,
    [TEAM_PLAN.BASIC]: undefined,
    [TEAM_PLAN.STANDARD]: undefined,
    [TEAM_PLAN.CUSTOM]: undefined,
};

// ============================================================================
// Team Seats & Steps (Module 715835)
// ============================================================================

export const MINIMUM_NUMBER_OF_SEATS = 3;
export const MAXIMUM_NUMBER_OF_SEATS = 9999;
export const SELF_SERVE_NUMBER_OF_STEPS = 2;
export const TEAM_DEAL_NUMBER_OF_STEPS = 1;

// ============================================================================
// Team Deal Target Types
// ============================================================================

export const TEAM_DEAL_TARGET = {
    NEW_TEAM: 'NEW_TEAM',
    EXISTING_STRIPE_TEAM: 'EXISTING_STRIPE_TEAM',
    EXISTING_CUSTOM_TEAM: 'EXISTING_CUSTOM_TEAM',
} as const;

export type TeamDealTarget = (typeof TEAM_DEAL_TARGET)[keyof typeof TEAM_DEAL_TARGET];

// ============================================================================
// Subscription Duration
// ============================================================================

export const SUBSCRIPTION_DURATION = {
    MONTHLY: 'MONTHLY',
    YEARLY: 'YEARLY',
} as const;

export type SubscriptionDuration = (typeof SUBSCRIPTION_DURATION)[keyof typeof SUBSCRIPTION_DURATION];

// ============================================================================
// Plan Frequency (Alias for Subscription Duration)
// ============================================================================

export const PLAN_FREQUENCY = {
    MONTHLY: 'MONTHLY',
    YEARLY: 'YEARLY',
} as const;

export type PlanFrequency = (typeof PLAN_FREQUENCY)[keyof typeof PLAN_FREQUENCY];

// ============================================================================
// Team Checkout Steps
// ============================================================================

export const TEAM_CHECKOUT_STEPS = {
    SELECT_PLAN: 'SELECT_PLAN',
    CHECKOUT: 'CHECKOUT',
} as const;

export type TeamCheckoutStep = (typeof TEAM_CHECKOUT_STEPS)[keyof typeof TEAM_CHECKOUT_STEPS];

// ============================================================================
// Currency
// ============================================================================

export const CURRENCY = {
    USD: 'USD',
} as const;

export type Currency = (typeof CURRENCY)[keyof typeof CURRENCY];

export const DEFAULT_CURRENCY = 'USD';

// ============================================================================
// Ecommerce Purchase Category
// ============================================================================

export const ECOMMERCE_PURCHASE_CATEGORY = {
    CONSUMER_PLAN: 'CONSUMER_PLAN',
    API_PLAN: 'API_PLAN',
    TEAMS_PLAN: 'TEAMS_PLAN',
    TOKENS: 'TOKENS',
} as const;

export type EcommercePurchaseCategory = (typeof ECOMMERCE_PURCHASE_CATEGORY)[keyof typeof ECOMMERCE_PURCHASE_CATEGORY];

// ============================================================================
// Monthly Pricing
// ============================================================================

export const MONTHLY_PRICING_BY_INTERVAL: Record<SubscriptionDuration, Record<UserPlanName, number>> = {
    MONTHLY: {
        [UserPlanNames.FREE]: 0,
        [UserPlanNames.FREEPLUS]: 0,
        [UserPlanNames.BASIC]: 12,
        [UserPlanNames.STANDARD]: 30,
        [UserPlanNames.PRO]: 60,
    },
    YEARLY: {
        [UserPlanNames.FREE]: 0,
        [UserPlanNames.FREEPLUS]: 0,
        [UserPlanNames.BASIC]: 10,
        [UserPlanNames.STANDARD]: 24,
        [UserPlanNames.PRO]: 48,
    },
};

// ============================================================================
// Unlimited Plans
// ============================================================================

export const UNLIMITED_PLANS = new Set<string>(['PRO', 'STANDARD']);

// ============================================================================
// Team Training Costs
// ============================================================================

export const TEAM_TRAINING_COSTS: Record<number, number> = {
    512: 800,
    768: 1600,
    1024: 1600,
};

// ============================================================================
// Team Plan Downgrade Types
// ============================================================================

export const TEAM_PLAN_DOWNGRADE_TYPE = {
    PLAN: 'plan',
    SEATS: 'seats',
    BOTH: 'both',
} as const;

// ============================================================================
// Upgrade Modal Subtitles
// ============================================================================

export const UpgradeModalSubtitleOptions = {
    AlmostOutOfTokens: "You're almost out of tokens!",
    ContinueAlchemy: 'Continue using Leonardo Alchemy?',
    FlowStateOutOfTokens: "You've reached your Flow State limit!",
    NotEnoughTokens: "You don't have enough tokens!",
    OutOfAlchemy: 'Out of Alchemy generations?',
    OutOfTokens: "You're out of tokens!",
    UnlockLongerGenerations: 'Unlock longer motion generations!',
} as const;
