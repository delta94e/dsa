export const MOTION_PER_SECOND_API_TOKEN_COST = 10;
export const MOTION_SVD_GENERATION_API_TOKEN_COST = 45;

// Constants
const BASE_TOKEN_RATES = {
  BASIC: 3,
  STANDARD: 2.2,
  PRO: 1.6,
};

const YEARLY_DISCOUNT_RATIO = {
  BASIC: 120 / 144, // approx 0.833
  STANDARD: 0.8,
  PRO: 0.8,
};

export const PADDLE_TOP_UP_TOKEN_AMOUNTS = [
  5_000, 10_000, 25_000, 50_000, 100_000, 250_000, 500_000, 1_000_000,
];

// Helper to calculate top-up prices based on base rates
const calculateTopUpPrices = (
  planKey: keyof typeof BASE_TOKEN_RATES
): Record<number, number> => {
  const prices: Record<number, number> = {};
  for (const amount of PADDLE_TOP_UP_TOKEN_AMOUNTS) {
    // Price calculation: BaseRate * (Amount / 1000) * 100 (cents)
    prices[amount] = Math.round(
      BASE_TOKEN_RATES[planKey] * (amount / 1000) * 100
    );
  }
  return prices;
};

// --- Pricing Configurations ---

export const PADDLE_PRICES = {
  BASIC: {
    MONTHLY: 900,
    YEARLY: 10800 * YEARLY_DISCOUNT_RATIO.BASIC,
    TOPUPS: calculateTopUpPrices("BASIC"),
  },
  STANDARD: {
    MONTHLY: 4900,
    YEARLY: 58800 * YEARLY_DISCOUNT_RATIO.STANDARD,
    TOPUPS: calculateTopUpPrices("STANDARD"),
  },
  PRO: {
    MONTHLY: 29900,
    YEARLY: 358800 * YEARLY_DISCOUNT_RATIO.PRO,
    TOPUPS: calculateTopUpPrices("PRO"),
  },
  CUSTOM: {
    MONTHLY: 0,
    YEARLY: 0,
    TOPUPS: calculateTopUpPrices("PRO"), // Fallback to PRO rates for custom
  },
};

// --- Team Seat Configuration ---

export const PADDLE_TEAM_SEAT_TOKENS = {
  PRO: 60_000,
};

export const PADDLE_TEAM_SEAT_PRICES = {
  PRO: {
    MONTHLY: 10_000,
    YEARLY: 96_000,
  },
};

export const PADDLE_TEAM_SEAT_QTY = {
  PRO: {
    min: 2,
    max: 1000,
  },
};

export const COUPONS = {
  COUPON_ID_100_PERCENT_OFF_1_MONTH: "COUPON_ID_100_PERCENT_OFF_1_MONTH_PROD",
  COUPON_ID_2_DOLLARS_OFF_BASIC_MONTHLY_1_YEAR:
    "COUPON_ID_2_DOLLARS_OFF_BASIC_MONTHLY_1_YEAR",
  COUPON_ID_20_PERCENT_OFF_STANDARD_MONTHLY_1_YEAR:
    "COUPON_ID_20_PERCENT_OFF_STANDARD_MONTHLY_1_YEAR",
  COUPON_ID_20_PERCENT_OFF_PRO_MONTHLY_1_YEAR:
    "COUPON_ID_20_PERCENT_OFF_PRO_MONTHLY_1_YEAR",
  COUPON_ID_20_PERCENT_OFF_BASIC_YEARLY_1_YEAR:
    "COUPON_ID_20_PERCENT_OFF_BASIC_YEARLY_1_YEAR",
  COUPON_ID_25_PERCENT_OFF_STANDARD_YEARLY_1_YEAR:
    "COUPON_ID_25_PERCENT_OFF_STANDARD_YEARLY_1_YEAR",
  COUPON_ID_25_PERCENT_OFF_PRO_YEARLY_1_YEAR:
    "COUPON_ID_25_PERCENT_OFF_PRO_YEARLY_1_YEAR",
} as const;
