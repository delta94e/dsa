export const TeamPlanType = {
  PRO: "PRO",
} as const;

export const TEAM_PLAN_SEAT_TOKENS = {
  [TeamPlanType.PRO]: 100_000,
};

export const TEAM_PLAN_SEAT_PRICES = {
  [TeamPlanType.PRO]: {
    MONTHLY: 10_000,
    YEARLY: 96_000,
  },
};

export const TEAM_PLAN_SEAT_QTY = {
  [TeamPlanType.PRO]: {
    min: 1,
    max: 2000,
  },
};

export const TEAM_PLAN_PROMPT_TOKENS_PER_SEAT = {
  [TeamPlanType.PRO]: 50_000,
};

export const TEAM_PLAN_STREAM_TOKENS_PER_SEAT = {
  [TeamPlanType.PRO]: 60_000,
};
