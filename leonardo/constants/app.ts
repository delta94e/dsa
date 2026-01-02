/**
 * Application Constants
 * 
 * Centralized constants for Leonardo.ai application.
 */

// ============================================================================
// Cookie Names
// ============================================================================

export const ANONYMOUS_ID_COOKIE_NAME = 'anonymous-id';
export const SELECTED_TEAM_COOKIE_NAME = 'selected-team';

// ============================================================================
// CDN & Static Assets
// ============================================================================

export const LEONARDO_AI_CDN_STATIC_IMAGES_URL = 'https://cdn.leonardo.ai/static/images';
export const LEONARDO_AI_CDN_STATIC_VIDEOS_URL = 'https://cdn.leonardo.ai/static/videos';
export const CLOUDFLARE_CDN_ORIGINS = [
    'https://cdn.leonardo.ai',
    'https://cdn.dev.leonardo.ai',
];

// ============================================================================
// Logo Assets
// ============================================================================

export const LEONARDO_LOGO = '/img/leonardo-logo.svg';
export const LEONARDO_LOGO_FLAT = '/img/leonardo-logo-flat.svg';
export const LEONARDO_LOGO_GREYSCALE = '/img/leonardo-logo-greyscale.svg';
export const LEONARDO_LOGO_GREYSCALE_CARD = '/img/leonardo-logo-greyscale-card.svg';
export const LEONARDO_LOGO_PNG = '/img/leonardo-logo.png';
export const LEONARDO_LOGO_TEXT = '/img/leonardo-logo-text.svg';
export const LEONARDO_LOGO_TEXT_PNG = '/img/leonardo-logo-text.png';
export const LEONARDO_LOGO_WHITE_AND_GRADIENT_PNG = '/img/leonardo-logo-white-and-gradient.png';

// ============================================================================
// Image Size Suffixes
// ============================================================================

export const IMG_AS_SM = '?w=256';
export const IMG_AS_MD = '?w=512';
export const IMG_AS_LG = '?w=1250';
export const IMG_AS_XL = '?w=1875';
export const VIDEO_AS_MD = 512;

// ============================================================================
// Pagination & Limits
// ============================================================================

export const AI_FEED_QUERY_LIMIT = 20;
export const FEED_ITEMS_PAGE_SIZE = 50;
export const ORGANIZER_COLLECTIONS_PAGE_SIZE = 100;
export const DATASET_MAX_IMAGES = 50;
export const DATASET_DESCRIPTION_MAX_LENGTH = 500;
export const MAX_IMAGE_PROMPTS = 5;
export const SEED_DIGITS_LIMIT = 10;
export const FLUX_SEED_MAX_VALUE = 0x7FFFFFF5;

// ============================================================================
// UI Defaults
// ============================================================================

export const DEFAULT_TOAST_DURATION = 7000;
export const DEFAULT_TEAM_SEATS = 3;
export const LAUNCH_DARKLY_INIT_TIMEOUT = 5;
export const TOKENS_RUNNING_LOW_VALUE = 45;
export const VIRTUALIZED_FEED_SKELETON_DEFAULT_HEIGHT = 300;

// ============================================================================
// Dimensions
// ============================================================================

export const DEFAULT_MODEL_WIDTH = 1024;
export const DEFAULT_MODEL_HEIGHT = 1024;
export const DEFAULT_TRAINING_RESOLUTION = 1024;
export const DIMENSION_MIN_PIXELS = 512;
export const DIMENSION_MAX_PIXELS = 1536;
export const DIMENSION_MAX_PIXELS_ALCHEMY = 1024;
export const FREE_USER_DIMENSION_MAX_PIXELS = 1024;
export const DIMENSION_PIXELS_ALCHEMY_DEFAULT_WIDTH = 768;
export const DIMENSION_PIXELS_ALCHEMY_DEFAULT_HEIGHT = 512;
export const DIMENSION_PIXELS_PHOTOREAL_DEFAULT_WIDTH = 1024;
export const DIMENSION_PIXELS_PHOTOREAL_DEFAULT_HEIGHT = 576;
export const ASPECT_RATIO_PIXEL_INCREMENT_VALUE = 8;
export const DIMENSIONS_AUTO_OPTION_VALUE = 'AUTO';

export const GENERATION_PLACEHOLDER_IMAGE_DEFAULT_DIMENSIONS = {
    WIDTH: 768,
    HEIGHT: 768,
};

export const GENERATION_PLACEHOLDER_VIDEO_DEFAULT_DIMENSIONS = {
    WIDTH: 832,
    HEIGHT: 480,
};

export const RESTRICT_AT_PIXELS = [-1, 768, 1024, 1360];
export const RESTRICTION_TO_IMAGE_MAX = [8, 4, 2, 2];
export const RESTRICTION_TO_IMAGE_MAX_PM_V3 = [8, 4, 4, 1];

// ============================================================================
// Creativity Scale
// ============================================================================

export const CREATIVITY_SCALE_DEFAULT = 0.4;
export const CREATIVITY_SCALE_DEFAULT_ALCHEMY_V3 = 0.55;
export const CREATIVITY_SCALE_INCREMENT_VALUE = 0.05;
export const CREATIVITY_SCALE_INCREMENT_ALCHEMY_V3 = 0.05;
export const CREATIVITY_SCALE_MIN_VALUE = 0.1;
export const CREATIVITY_SCALE_MIN_VALUE_ALCHEMY = 0.3;
export const CREATIVITY_SCALE_MIN_VALUE_ALCHEMY_V3 = 0.3;
export const CREATIVITY_SCALE_MAX_VALUE = 0.8;
export const CREATIVITY_SCALE_MAX_VALUE_ALCHEMY = 0.45;
export const CREATIVITY_SCALE_MAX_VALUE_ALCHEMY_V3 = 0.65;

// ============================================================================
// Scheduler
// ============================================================================

export const SCHEDULER_STEP_COUNT_DEFAULT = 30;
export const SCHEDULER_STEP_COUNT_DEFAULT_LEONARDO = 10;
export const SCHEDULER_DISABLED_TOOLTIP = 'Selecting a scheduler is disabled while using Alchemy or SDXL Lightning.';

// ============================================================================
// Depth of Field
// ============================================================================

export const DEPTH_OF_FIELD_VALUES = {
    High: 0.45,
    Medium: 0.5,
    Low: 0.55,
} as const;

export const DEFAULT_DEPTH_OF_FIELD = DEPTH_OF_FIELD_VALUES.Low;

// ============================================================================
// Stripe API URLs
// ============================================================================

export const STRIPE_TEAM_ACCEPT_DEAL = '/api/stripe/team-accept-deal';
export const STRIPE_TEAM_BUY_PLAN = '/api/stripe/team-buy-plan';
export const STRIPE_CHECK_PLAN_SUBSCRIPTION_STATUS = '/api/stripe/check-plan-subscription-status';

// ============================================================================
// Payments
// ============================================================================

export const CREDIT_TO_DOLLAR_RATE = 0.001495;
export const BUY_OFFER_ACCEPTED_ROUTE = '/buy?offer-accepted=true';
export const IS_RETENTION_OFFERS_MONTHLY_ONLY = true;

// ============================================================================
// Tooltips & Messages
// ============================================================================

export const BANDAID_TOKEN_TOOLTIP = 'It may take up to an hour to update your tokens.';
export const UPGRADE_TOOLTIP = 'Upgrade to modify this setting';
export const THIRD_PARTY_MODEL_RELAXED_GENERATION_DISCLAIMER =
    "These models aren't available in Relaxed mode because they rely on paid third-party APIs which bill per use.";

// ============================================================================
// Special IDs
// ============================================================================

export const OPTIMISTIC_ID = 'optimistic-id';
export const STATUS_SENDING = 'UNKNOWN';

// ============================================================================
// All Models Filter
// ============================================================================

export const ALL_MODELS_FILTER_OPTION = {
    id: 'all_models',
    label: 'All Models',
    value: '',
} as const;

// ============================================================================
// Suspension Status Types
// ============================================================================

export const SUSPENSION_STATUS_TYPE = {
    TEMPORARILY_SUSPENDED: 'TEMPORARILY_SUSPENDED',
    WARNING: 'WARNING',
    SUSPENDED: 'SUSPENDED',
    ACTIVE: 'ACTIVE',
} as const;

export type SuspensionStatusType = typeof SUSPENSION_STATUS_TYPE[keyof typeof SUSPENSION_STATUS_TYPE];

