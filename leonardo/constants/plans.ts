/**
 * Plans & Pricing Constants
 */

// ============================================================================
// User Plan Types
// ============================================================================

export const PlanType = {
  FREE: "FREE",
  FREEPLUS: "FREEPLUS",
  BASIC: "BASIC",
  STANDARD: "STANDARD",
  PRO: "PRO",
} as const;

// Alias for backwards compatibility
export const UserPlanNames = PlanType;

export type UserPlanName = (typeof PlanType)[keyof typeof PlanType];

// ============================================================================
// Plan Display Names
// ============================================================================

export const PLAN_NAME: Record<UserPlanName, string> = {
  [PlanType.FREE]: "Free",
  [PlanType.FREEPLUS]: "Free+",
  [PlanType.BASIC]: "Apprentice",
  [PlanType.STANDARD]: "Artisan",
  [PlanType.PRO]: "Maestro",
};

export const PLAN_NAME_V2: Record<UserPlanName, string> = {
  [PlanType.FREE]: "Free",
  [PlanType.FREEPLUS]: "Free Plus",
  [PlanType.BASIC]: "Essential",
  [PlanType.STANDARD]: "Premium",
  [PlanType.PRO]: "Ultimate",
};

// ============================================================================
// API Plan Types
// ============================================================================

export const API_PLAN = {
  FREE: "FREE",
  FREEPLUS: "FREEPLUS",
  BASIC: "BASIC",
  STANDARD: "STANDARD",
  PRO: "PRO",
  CUSTOM: "CUSTOM",
  PAYG: "PAYG",
} as const;

export type ApiPlan = (typeof API_PLAN)[keyof typeof API_PLAN];

export const PLAN_TO_NAME_ENTERPRISE: Record<ApiPlan, string> = {
  [API_PLAN.FREE]: "API Free",
  [API_PLAN.FREEPLUS]: "API Free+",
  [API_PLAN.BASIC]: "API Basic",
  [API_PLAN.STANDARD]: "API Standard",
  [API_PLAN.PRO]: "API Pro",
  [API_PLAN.CUSTOM]: "API Custom",
  [API_PLAN.PAYG]: "API Pay As You Go",
};

export const API_PLANS_LIST = [
  { apiPlanType: API_PLAN.FREE, apiSubscriptionTokens: 0, active: true },
  { apiPlanType: API_PLAN.FREEPLUS, apiSubscriptionTokens: 0, active: true },
  { apiPlanType: API_PLAN.BASIC, apiSubscriptionTokens: 3500, active: true },
  {
    apiPlanType: API_PLAN.STANDARD,
    apiSubscriptionTokens: 25_000,
    active: true,
  },
  { apiPlanType: API_PLAN.PRO, apiSubscriptionTokens: 200_000, active: true },
  { apiPlanType: API_PLAN.CUSTOM, apiSubscriptionTokens: 0, active: true },
  { apiPlanType: API_PLAN.PAYG, apiSubscriptionTokens: 0, active: true },
] as const;

// ============================================================================
// Team Plan Types
// ============================================================================

export const TEAM_PLAN = {
  FREE: "FREE",
  FREEPLUS: "FREEPLUS",
  BASIC: "BASIC",
  STANDARD: "STANDARD",
  PRO: "PRO",
  CUSTOM: "CUSTOM",
  STARTER: "STARTER",
  GROWTH: "GROWTH",
} as const;

export type TeamPlan = (typeof TEAM_PLAN)[keyof typeof TEAM_PLAN];

export const PLAN_TO_NAME_TEAMS: Record<TeamPlan, string> = {
  [TEAM_PLAN.FREE]: "Free",
  [TEAM_PLAN.FREEPLUS]: "Free+",
  [TEAM_PLAN.BASIC]: "Basic",
  [TEAM_PLAN.STANDARD]: "Standard",
  [TEAM_PLAN.PRO]: "Custom",
  [TEAM_PLAN.CUSTOM]: "Custom",
  [TEAM_PLAN.STARTER]: "Starter",
  [TEAM_PLAN.GROWTH]: "Growth",
};

export const TEAM_PLANS_COST_PER_SEAT: Partial<
  Record<TeamPlan, number | undefined>
> = {
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
  NEW_TEAM: "NEW_TEAM",
  EXISTING_STRIPE_TEAM: "EXISTING_STRIPE_TEAM",
  EXISTING_CUSTOM_TEAM: "EXISTING_CUSTOM_TEAM",
} as const;

export type TeamDealTarget =
  (typeof TEAM_DEAL_TARGET)[keyof typeof TEAM_DEAL_TARGET];

// ============================================================================
// Subscription Duration
// ============================================================================

export const SUBSCRIPTION_DURATION = {
  MONTHLY: "MONTHLY",
  YEARLY: "YEARLY",
} as const;

export type SubscriptionDuration =
  (typeof SUBSCRIPTION_DURATION)[keyof typeof SUBSCRIPTION_DURATION];

// ============================================================================
// Plan Frequency (Alias for Subscription Duration)
// ============================================================================

export const PLAN_FREQUENCY = {
  MONTHLY: "MONTHLY",
  YEARLY: "YEARLY",
} as const;

export type PlanFrequency =
  (typeof PLAN_FREQUENCY)[keyof typeof PLAN_FREQUENCY];

// ============================================================================
// Team Checkout Steps
// ============================================================================

export const TEAM_CHECKOUT_STEPS = {
  SELECT_PLAN: "clicks_select_a_plan",
  CHECKOUT: "clicks_checkout",
  CREATE_NEW_TEAM: "clicks_create_new_team",
  CLICKS_CONTACT_US: "clicks_contact_us",
  CLICKS_GET_STARTED: "clicks_get_started",
} as const;

export type TeamCheckoutStep =
  (typeof TEAM_CHECKOUT_STEPS)[keyof typeof TEAM_CHECKOUT_STEPS];

// ============================================================================
// Currency
// ============================================================================

export const CURRENCY = {
  USD: "USD",
} as const;

export type Currency = (typeof CURRENCY)[keyof typeof CURRENCY];

export const DEFAULT_CURRENCY = "USD";

// ============================================================================
// Ecommerce Purchase Category
// ============================================================================

export const ECOMMERCE_PURCHASE_CATEGORY = {
  CONSUMER_PLAN: "CONSUMER_PLAN",
  API_PLAN: "API_PLAN",
  TEAMS_PLAN: "TEAMS_PLAN",
  TOKENS: "TOKENS",
} as const;

export type EcommercePurchaseCategory =
  (typeof ECOMMERCE_PURCHASE_CATEGORY)[keyof typeof ECOMMERCE_PURCHASE_CATEGORY];

// ============================================================================
// Monthly Pricing
// ============================================================================

export const MONTHLY_PRICING_BY_INTERVAL: Record<
  SubscriptionDuration,
  Record<UserPlanName, number>
> = {
  MONTHLY: {
    [PlanType.FREE]: 0,
    [PlanType.FREEPLUS]: 0,
    [PlanType.BASIC]: 12,
    [PlanType.STANDARD]: 30,
    [PlanType.PRO]: 60,
  },
  YEARLY: {
    [PlanType.FREE]: 0,
    [PlanType.FREEPLUS]: 0,
    [PlanType.BASIC]: 10,
    [PlanType.STANDARD]: 24,
    [PlanType.PRO]: 48,
  },
};

// ============================================================================
// Unlimited Plans
// ============================================================================

export const UNLIMITED_PLANS = new Set<string>(["PRO", "STANDARD"]);

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
  PLAN: "plan",
  SEATS: "seats",
  BOTH: "both",
} as const;

// ============================================================================
// Upgrade Modal Subtitles
// ============================================================================

export const UpgradeModalSubtitleOptions = {
  AlmostOutOfTokens: "You're almost out of tokens!",
  ContinueAlchemy: "Continue using Leonardo Alchemy?",
  FlowStateOutOfTokens: "You've reached your Flow State limit!",
  NotEnoughTokens: "You don't have enough tokens!",
  OutOfAlchemy: "Out of Alchemy generations?",
  OutOfTokens: "You're out of tokens!",
  UnlockLongerGenerations: "Unlock longer motion generations!",
} as const;

// --- Plan Limits (Concurrency & Jobs) ---

export const PLAN_CONCURRENCY: Record<UserPlanName, number> = {
  [PlanType.FREE]: 1,
  [PlanType.FREEPLUS]: 1,
  [PlanType.BASIC]: 1,
  [PlanType.STANDARD]: 1,
  [PlanType.PRO]: 3,
};

export const PLAN_PENDING_JOBS: Record<UserPlanName, number> = {
  [PlanType.FREE]: 1,
  [PlanType.FREEPLUS]: 1,
  [PlanType.BASIC]: 5,
  [PlanType.STANDARD]: 10,
  [PlanType.PRO]: 20,
};

export const USER_PLAN_CONCURRENCY: Record<UserPlanName, number> = {
  [PlanType.FREE]: 1,
  [PlanType.BASIC]: 2,
  [PlanType.STANDARD]: 3,
  [PlanType.FREEPLUS]: 6,
  [PlanType.PRO]: 6,
};

export const USER_PLAN_RELAXED_VIDEO_CONCURRENCY: Partial<
  Record<UserPlanName, number>
> = {
  [PlanType.PRO]: 2,
};

// --- Collection Limits ---

export const COLLECTION_PLAN_LIMITS: Record<UserPlanName, number> = {
  [PlanType.FREE]: 1,
  [PlanType.FREEPLUS]: 50,
  [PlanType.BASIC]: 5,
  [PlanType.STANDARD]: 15,
  [PlanType.PRO]: 50,
};

export const COLLECTION_PLAN_LIMITS_V2: Record<UserPlanName, number> = {
  [PlanType.FREE]: 1,
  [PlanType.FREEPLUS]: 1000,
  [PlanType.BASIC]: 1000,
  [PlanType.STANDARD]: 1000,
  [PlanType.PRO]: 1000,
};

export const COLLECTION_TOTAL_DEPTH_LIMIT = 3;
export const TEAM_PLAN_COLLECTIONS_LIMIT = 50;
export const TEAM_PLAN_COLLECTIONS_LIMIT_V2 = 1000;

export const PLAN_TOKENS: Record<UserPlanName, number> = {
  [PlanType.FREE]: 150,
  [PlanType.FREEPLUS]: 8000,
  [PlanType.BASIC]: 8500,
  [PlanType.STANDARD]: 25_000,
  [PlanType.PRO]: 60_000,
};

export const PLAN_MODELS: Record<UserPlanName, number> = {
  [PlanType.FREE]: 0,
  [PlanType.FREEPLUS]: 5,
  [PlanType.BASIC]: 10,
  [PlanType.STANDARD]: 20,
  [PlanType.PRO]: 50,
};

export const PLAN_GPT_TOKENS: Record<UserPlanName, number> = {
  [PlanType.FREE]: 100,
  [PlanType.FREEPLUS]: 1000,
  [PlanType.BASIC]: 1000,
  [PlanType.STANDARD]: 1000,
  [PlanType.PRO]: 1000,
};

export const PLAN_MAX_ROLLOVER_TOKENS: Record<UserPlanName, number> = {
  [PlanType.FREE]: 0,
  [PlanType.FREEPLUS]: 0,
  [PlanType.BASIC]: 25_500,
  [PlanType.STANDARD]: 75_000,
  [PlanType.PRO]: 180_000,
};

export const PROMPT_TOKENS: Record<UserPlanName, number> = {
  [PlanType.FREE]: 2000,
  [PlanType.FREEPLUS]: 50_000,
  [PlanType.BASIC]: 50_000,
  [PlanType.STANDARD]: 50_000,
  [PlanType.PRO]: 50_000,
};

export const STREAM_TOKENS: Record<UserPlanName, number> = {
  [PlanType.FREE]: 3000,
  [PlanType.FREEPLUS]: 100_000,
  [PlanType.BASIC]: 100_000,
  [PlanType.STANDARD]: 100_000,
  [PlanType.PRO]: 100_000,
};
