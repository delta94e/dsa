/**
 * Leonardo.ai Enums
 *
 * Type definitions and constants from module 698107.
 * These match the production Leonardo.ai API types.
 */

// ============================================================================
// API Types
// ============================================================================

export const API_KEY_TYPE = {
  USER: "USER",
  PRODUCTION: "PRODUCTION",
} as const;

export type ApiKeyType = (typeof API_KEY_TYPE)[keyof typeof API_KEY_TYPE];

export const API_PLAN = {
  FREE: "FREE",
  BASIC: "BASIC",
  STANDARD: "STANDARD",
  PRO: "PRO",
  FREEPLUS: "FREEPLUS",
  CUSTOM: "CUSTOM",
  PAYG: "PAYG",
} as const;

export type ApiPlan = (typeof API_PLAN)[keyof typeof API_PLAN];

// ============================================================================
// Model Types
// ============================================================================

export const CORE_MODELS = {
  SD: "SD",
  DALLE: "DALLE",
  PHOENIX: "PHOENIX",
  FLUX: "FLUX",
  OPENAI: "OPENAI",
  IDEOGRAM: "IDEOGRAM",
  MOTION: "MOTION",
} as const;

export type CoreModel = (typeof CORE_MODELS)[keyof typeof CORE_MODELS];

export const MODEL_ARCHITECTURE = {
  v1_5: "v1_5",
  v2: "v2",
  v3: "v3",
  PHOENIX: "PHOENIX",
  FLUX: "FLUX",
  FLUX_DEV: "FLUX_DEV",
  SDXL_0_8: "SDXL_0_8",
  SDXL_0_9: "SDXL_0_9",
  SDXL_1_0: "SDXL_1_0",
  SDXL_LIGHTNING: "SDXL_LIGHTNING",
  WAN21: "WAN21",
  KINO_2_0: "KINO_2_0",
  KINO_2_1: "KINO_2_1",
  GPT_IMAGE_1: "GPT_IMAGE_1",
  FLUX_OMNI: "FLUX_OMNI",
  FLUX_MAX: "FLUX_MAX",
  FLUX_DEV_2_0: "FLUX_DEV_2_0",
  FLUX_PRO_2_0: "FLUX_PRO_2_0",
  MOTION: "MOTION",
  IDEOGRAM_3: "IDEOGRAM_3",
  GEMINI_2_5_FLASH: "GEMINI_2_5_FLASH",
  SEEDREAM_4_0: "SEEDREAM_4_0",
  SEEDREAM_4_5: "SEEDREAM_4_5",
  GEMINI_IMAGE_2: "GEMINI_IMAGE_2",
  AUTO_PRESET: "AUTO_PRESET",
} as const;

export type ModelArchitecture = (typeof MODEL_ARCHITECTURE)[keyof typeof MODEL_ARCHITECTURE];

export const MOTION_MODEL_ARCHITECTURE = {
  VEO3: "VEO3",
  VEO3FAST: "VEO3FAST",
  SVD: "SVD",
  WAN21: "WAN21",
  MOTION2FAST: "MOTION2FAST",
  KLING2_5: "KLING2_5",
  KLING2_5_STANDARD_TURBO: "KLING2_5_STANDARD_TURBO",
  KLING2_1: "KLING2_1",
  VEO3_1: "VEO3_1",
  VEO3_1FAST: "VEO3_1FAST",
  SORA2: "SORA2",
  SORA2PRO: "SORA2PRO",
  HAILUO2_3: "HAILUO2_3",
  HAILUO2_3FAST: "HAILUO2_3FAST",
  LTX2PRO: "LTX2PRO",
  LTX2FAST: "LTX2FAST",
  LTX2ULTRA: "LTX2ULTRA",
  SEEDANCE1LITE: "SEEDANCE1LITE",
  SEEDANCE1PRO: "SEEDANCE1PRO",
  SEEDANCE1PROFAST: "SEEDANCE1PROFAST",
  KLING_VIDEO_O_1: "KLING_VIDEO_O_1",
  KLING2_6: "KLING2_6",
} as const;

export type MotionModelArchitecture = (typeof MOTION_MODEL_ARCHITECTURE)[keyof typeof MOTION_MODEL_ARCHITECTURE];

// ============================================================================
// Generation Types
// ============================================================================

export const GENERATION_STYLE = {
  LEONARDO: "LEONARDO",
  NONE: "NONE",
  GENERAL: "GENERAL",
  ANIME: "ANIME",
  DIGITAL_ART: "DIGITAL_ART",
  ENVIRONMENT: "ENVIRONMENT",
  PHOTOREALISTIC: "PHOTOREALISTIC",
  PHOTOGRAPHY: "PHOTOGRAPHY",
  RENDER_3D: "RENDER_3D",
  CREATIVE: "CREATIVE",
  ILLUSTRATION: "ILLUSTRATION",
  RAYTRACED: "RAYTRACED",
  SKETCH_BW: "SKETCH_BW",
  SKETCH_COLOR: "SKETCH_COLOR",
  DYNAMIC: "DYNAMIC",
  ANALOG_FILM: "ANALOG_FILM",
  CINEMATIC: "CINEMATIC",
  COMIC_BOOK: "COMIC_BOOK",
  FANTASY_ART: "FANTASY_ART",
  ISOMETRIC: "ISOMETRIC",
  LINE_ART: "LINE_ART",
  LOW_POLY: "LOW_POLY",
  MODELING_COMPOUND: "MODELING_COMPOUND",
  NEON_PUNK: "NEON_PUNK",
  ORIGAMI: "ORIGAMI",
  PIXEL_ART: "PIXEL_ART",
  TILE_TEXTURE: "TILE_TEXTURE",
  VIBRANT: "VIBRANT",
  CINEMATIC_CLOSEUP: "CINEMATIC_CLOSEUP",
  VIBRANT_CLOSEUP: "VIBRANT_CLOSEUP",
  CREATIVE_CLOSEUP: "CREATIVE_CLOSEUP",
  BOKEH: "BOKEH",
  FASHION: "FASHION",
  FILM: "FILM",
  FOOD: "FOOD",
  HDR: "HDR",
  LONG_EXPOSURE: "LONG_EXPOSURE",
  MACRO: "MACRO",
  MINIMALIST: "MINIMALIST",
  MONOCHROME: "MONOCHROME",
  MOODY: "MOODY",
  NEUTRAL: "NEUTRAL",
  PORTRAIT: "PORTRAIT",
  RETRO: "RETRO",
  STOCK_PHOTO: "STOCK_PHOTO",
  UNPROCESSED: "UNPROCESSED",
} as const;

export type GenerationStyle = (typeof GENERATION_STYLE)[keyof typeof GENERATION_STYLE];

export const GENERATION_SCHEDULERS = {
  KLMS: "KLMS",
  EULER_ANCESTRAL_DISCRETE: "EULER_ANCESTRAL_DISCRETE",
  EULER_DISCRETE: "EULER_DISCRETE",
  DDIM: "DDIM",
  DPM_SOLVER: "DPM_SOLVER",
  PNDM: "PNDM",
  UNIPC: "UNIPC",
  LEONARDO: "LEONARDO",
  DPM_SDE_SOLVER: "DPM_SDE_SOLVER",
  DPM_SDE_KARRAS: "DPM_SDE_KARRAS",
} as const;

export type GenerationScheduler = (typeof GENERATION_SCHEDULERS)[keyof typeof GENERATION_SCHEDULERS];

export const GENERATION_SOURCE_TYPE = {
  BLUEPRINTS: "BLUEPRINTS",
  LEONARDO: "LEONARDO",
  LIGHTNING_STREAM: "LIGHTNING_STREAM",
} as const;

export type GenerationSourceType = (typeof GENERATION_SOURCE_TYPE)[keyof typeof GENERATION_SOURCE_TYPE];

export const GENERATION_NOTE_TYPE = {
  CC_NSFW_PARTIAL_FAILURE: "CC_NSFW_PARTIAL_FAILURE",
  CC_NSFW_TOTAL_FAILURE: "CC_NSFW_TOTAL_FAILURE",
  PARALLEL_PARTIAL_FAILURE: "PARALLEL_PARTIAL_FAILURE",
  IMAGE_MODERATION_BLOCKED: "IMAGE_MODERATION_BLOCKED",
  PROMPT_MODERATION_BLOCKED: "PROMPT_MODERATION_BLOCKED",
} as const;

export type GenerationNoteType = (typeof GENERATION_NOTE_TYPE)[keyof typeof GENERATION_NOTE_TYPE];

// ============================================================================
// ControlNet Types
// ============================================================================

export const CONTROLNET_TYPE = {
  All: "All",
  Canny: "Canny",
  Depth: "Depth",
  NormalMap: "NormalMap",
  OpenPose: "OpenPose",
  MLSD: "MLSD",
  LineArt: "LineArt",
  SoftEdge: "SoftEdge",
  Scribble_Sketch: "Scribble_Sketch",
  Segmentation: "Segmentation",
  Shuffle: "Shuffle",
  Tile_Blur: "Tile_Blur",
  Inpaint: "Inpaint",
  InstructP2P: "InstructP2P",
  Reference: "Reference",
  Recolor: "Recolor",
  Revision: "Revision",
  T2I_Adapter: "T2I_Adapter",
  IP_adapter: "IP_adapter",
  QR: "QR",
  QR_V2: "QR_V2",
  Hed: "Hed",
  Text: "Text",
  StyleTransfer: "StyleTransfer",
  ContentTransfer: "ContentTransfer",
  FaceTransfer: "FaceTransfer",
  ImageToImage: "ImageToImage",
  ImageReference: "ImageReference",
  StartFrame: "StartFrame",
  EndFrame: "EndFrame",
} as const;

export type ControlnetType = (typeof CONTROLNET_TYPE)[keyof typeof CONTROLNET_TYPE];

export const IMAGE_GUIDANCE_STRENGTH = {
  Low: "Low",
  Mid: "Mid",
  High: "High",
  Ultra: "Ultra",
  Max: "Max",
} as const;

export type ImageGuidanceStrength = (typeof IMAGE_GUIDANCE_STRENGTH)[keyof typeof IMAGE_GUIDANCE_STRENGTH];

// ============================================================================
// User & Plan Types
// ============================================================================

export const USER_PLAN = {
  FREE: "FREE",
  BASIC: "BASIC",
  STANDARD: "STANDARD",
  PRO: "PRO",
  FREEPLUS: "FREEPLUS",
} as const;

export type UserPlan = (typeof USER_PLAN)[keyof typeof USER_PLAN];

export const TEAM_PLAN = {
  FREE: "FREE",
  BASIC: "BASIC",
  STANDARD: "STANDARD",
  PRO: "PRO",
  FREEPLUS: "FREEPLUS",
  CUSTOM: "CUSTOM",
  STARTER: "STARTER",
  GROWTH: "GROWTH",
} as const;

export type TeamPlan = (typeof TEAM_PLAN)[keyof typeof TEAM_PLAN];

export const PLAN_FREQUENCY = {
  MONTHLY: "MONTHLY",
  YEARLY: "YEARLY",
} as const;

export type PlanFrequency = (typeof PLAN_FREQUENCY)[keyof typeof PLAN_FREQUENCY];

export const TOKEN_TYPE = {
  SUBSCRIPTION: "SUBSCRIPTION",
  ROLLOVER: "ROLLOVER",
  TOP_UP: "TOP_UP",
  RELAXED: "RELAXED",
} as const;

export type TokenType = (typeof TOKEN_TYPE)[keyof typeof TOKEN_TYPE];

// ============================================================================
// Job & Status Types
// ============================================================================

export const JOB_STATUS = {
  PENDING: "PENDING",
  COMPLETE: "COMPLETE",
  FAILED: "FAILED",
} as const;

export type JobStatus = (typeof JOB_STATUS)[keyof typeof JOB_STATUS];

export const SUSPENSION_STATUS_TYPE = {
  TEMPORARILY_SUSPENDED: "TEMPORARILY_SUSPENDED",
  PERMANENTLY_SUSPENDED: "PERMANENTLY_SUSPENDED",
  MANUALLY_SUSPENDED: "MANUALLY_SUSPENDED",
  WARNING: "WARNING",
} as const;

export type SuspensionStatusType = (typeof SUSPENSION_STATUS_TYPE)[keyof typeof SUSPENSION_STATUS_TYPE];

// ============================================================================
// Team Types
// ============================================================================

export const TEAM_DEAL_TARGET = {
  NEW_TEAM: "NEW_TEAM",
  EXISTING_STRIPE_TEAM: "EXISTING_STRIPE_TEAM",
  EXISTING_CUSTOM_TEAM: "EXISTING_CUSTOM_TEAM",
} as const;

export type TeamDealTarget = (typeof TEAM_DEAL_TARGET)[keyof typeof TEAM_DEAL_TARGET];

export const DATA_MODES = {
  PERSONAL: "personal",
  TEAM: "team",
} as const;

export type DataMode = (typeof DATA_MODES)[keyof typeof DATA_MODES];

// ============================================================================
// Subscription Types
// ============================================================================

export const SUBSCRIPTION_SOURCE = {
  APPLE: "APPLE",
  STRIPE: "STRIPE",
  PADDLE: "PADDLE",
  GOOGLE: "GOOGLE",
  PAYPAL: "PAYPAL",
  CANVA: "CANVA",
} as const;

export type SubscriptionSource = (typeof SUBSCRIPTION_SOURCE)[keyof typeof SUBSCRIPTION_SOURCE];

// ============================================================================
// Training & Upscale Types
// ============================================================================

export const TRAINING_STRENGTH = {
  VERY_LOW: "VERY_LOW",
  LOW: "LOW",
  MEDIUM: "MEDIUM",
  HIGH: "HIGH",
} as const;

export type TrainingStrength = (typeof TRAINING_STRENGTH)[keyof typeof TRAINING_STRENGTH];

export const UPSCALE_TYPE = {
  DEFAULT: "DEFAULT",
  ALTERNATE: "ALTERNATE",
  HD: "HD",
  SMOOTH: "SMOOTH",
  ALCHEMY_REFINER: "ALCHEMY_REFINER",
  ULTRA: "ULTRA",
  UNIVERSAL_UPSCALE: "UNIVERSAL_UPSCALE",
  INSTANT_REFINE: "INSTANT_REFINE",
} as const;

export type UpscaleType = (typeof UPSCALE_TYPE)[keyof typeof UPSCALE_TYPE];

export const VARIATION_TYPE = {
  OUTPAINT: "OUTPAINT",
  INPAINT: "INPAINT",
  UPSCALE: "UPSCALE",
  UNZOOM: "UNZOOM",
  NOBG: "NOBG",
} as const;

export type VariationType = (typeof VARIATION_TYPE)[keyof typeof VARIATION_TYPE];

// ============================================================================
// Other Types
// ============================================================================

export const PHOTO_REAL_VERSIONS = {
  v1: "v1",
  v2: "v2",
} as const;

export type PhotoRealVersion = (typeof PHOTO_REAL_VERSIONS)[keyof typeof PHOTO_REAL_VERSIONS];

export const PROMPT_MAGIC_VERSIONS = {
  v1: "v1",
  v2: "v2",
  v3: "v3",
} as const;

export type PromptMagicVersion = (typeof PROMPT_MAGIC_VERSIONS)[keyof typeof PROMPT_MAGIC_VERSIONS];

export const USER_INTERESTS = {
  ADVERTISING: "ADVERTISING",
  ARCHITECTURE: "ARCHITECTURE",
  ART: "ART",
  BOARD_GAMES: "BOARD_GAMES",
  EDUCATION: "EDUCATION",
  FASHION: "FASHION",
  FILM_TV: "FILM_TV",
  INTERIOR_DESIGN: "INTERIOR_DESIGN",
  MARKETING: "MARKETING",
  PRODUCT_DESIGN: "PRODUCT_DESIGN",
  STOCK_IMAGES: "STOCK_IMAGES",
  VIDEO_GAMES: "VIDEO_GAMES",
  OTHER: "OTHER",
} as const;

export type UserInterest = (typeof USER_INTERESTS)[keyof typeof USER_INTERESTS];

export const USER_INTERESTS_ROLES = {
  DEVELOPER: "DEVELOPER",
  PROFESSIONAL: "PROFESSIONAL",
  CONSUMER: "CONSUMER",
  OTHER: "OTHER",
} as const;

export type UserInterestRole = (typeof USER_INTERESTS_ROLES)[keyof typeof USER_INTERESTS_ROLES];

export const CUSTOM_MODEL_CATEGORY = {
  GENERAL: "GENERAL",
  BUILDINGS: "BUILDINGS",
  CHARACTERS: "CHARACTERS",
  ENVIRONMENTS: "ENVIRONMENTS",
  FASHION: "FASHION",
  ILLUSTRATIONS: "ILLUSTRATIONS",
  GAME_ITEMS: "GAME_ITEMS",
  GRAPHICAL_ELEMENTS: "GRAPHICAL_ELEMENTS",
  PHOTOGRAPHY: "PHOTOGRAPHY",
  PIXEL_ART: "PIXEL_ART",
  PRODUCT_DESIGN: "PRODUCT_DESIGN",
  TEXTURES: "TEXTURES",
  UI_ELEMENTS: "UI_ELEMENTS",
  VECTOR: "VECTOR",
} as const;

export type CustomModelCategory = (typeof CUSTOM_MODEL_CATEGORY)[keyof typeof CUSTOM_MODEL_CATEGORY];

export const MOTION_ELEMENT_TYPE = {
  MOTION_ELEMENTS: "MOTION_ELEMENTS",
  MOTION_CONTROL_ELEMENTS: "MOTION_CONTROL_ELEMENTS",
} as const;

export type MotionElementType = (typeof MOTION_ELEMENT_TYPE)[keyof typeof MOTION_ELEMENT_TYPE];

export const POSE_TO_IMAGE_TYPE = {
  POSE: "POSE",
  CANNY: "CANNY",
  DEPTH: "DEPTH",
  QR: "QR",
} as const;

export type PoseToImageType = (typeof POSE_TO_IMAGE_TYPE)[keyof typeof POSE_TO_IMAGE_TYPE];

export const CHANGELOG_CONTENT_TYPE = {
  majorFeatures: "majorFeatures",
  minorFeatures: "minorFeatures",
  improvements: "improvements",
  bugFixes: "bugFixes",
  introducingFeatures: "introducingFeatures",
  apiUpdates: "apiUpdates",
} as const;

export type ChangelogContentType = (typeof CHANGELOG_CONTENT_TYPE)[keyof typeof CHANGELOG_CONTENT_TYPE];

// ============================================================================
// Special Constants
// ============================================================================

export const AUTO_PRESET = "AUTO_PRESET" as const;
