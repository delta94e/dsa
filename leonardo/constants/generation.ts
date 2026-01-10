/**
 * Generation Styles
 *
 * All generation style constants for Leonardo.ai
 */

import { MODEL_IDS, PhotoRealV2Models } from "./models";

// ============================================================================
// Generation Style Types
// ============================================================================

export const GENERATION_STYLE = {
  NONE: "NONE",
  LEONARDO: "LEONARDO",
  GENERAL: "GENERAL",
  ANALOG_FILM: "ANALOG_FILM",
  ANIME: "ANIME",
  BOKEH: "BOKEH",
  CINEMATIC: "CINEMATIC",
  CINEMATIC_CLOSEUP: "CINEMATIC_CLOSEUP",
  COMIC_BOOK: "COMIC_BOOK",
  CREATIVE: "CREATIVE",
  CREATIVE_CLOSEUP: "CREATIVE_CLOSEUP",
  DIGITAL_ART: "DIGITAL_ART",
  DYNAMIC: "DYNAMIC",
  ENVIRONMENT: "ENVIRONMENT",
  FANTASY_ART: "FANTASY_ART",
  FASHION: "FASHION",
  FILM: "FILM",
  FOOD: "FOOD",
  HDR: "HDR",
  ILLUSTRATION: "ILLUSTRATION",
  ISOMETRIC: "ISOMETRIC",
  LINE_ART: "LINE_ART",
  LONG_EXPOSURE: "LONG_EXPOSURE",
  LOW_POLY: "LOW_POLY",
  MACRO: "MACRO",
  MINIMALIST: "MINIMALIST",
  MODELING_COMPOUND: "MODELING_COMPOUND",
  MONOCHROME: "MONOCHROME",
  MOODY: "MOODY",
  NEON_PUNK: "NEON_PUNK",
  NEUTRAL: "NEUTRAL",
  ORIGAMI: "ORIGAMI",
  PHOTOGRAPHY: "PHOTOGRAPHY",
  PHOTOREALISTIC: "PHOTOREALISTIC",
  PIXEL_ART: "PIXEL_ART",
  PORTRAIT: "PORTRAIT",
  RAYTRACED: "RAYTRACED",
  RETRO: "RETRO",
  RENDER_3D: "RENDER_3D",
  SKETCH_BW: "SKETCH_BW",
  SKETCH_COLOR: "SKETCH_COLOR",
  STOCK_PHOTO: "STOCK_PHOTO",
  TILE_TEXTURE: "TILE_TEXTURE",
  UNPROCESSED: "UNPROCESSED",
  VIBRANT: "VIBRANT",
  VIBRANT_CLOSEUP: "VIBRANT_CLOSEUP",
} as const;

export type GenerationStyleType =
  (typeof GENERATION_STYLE)[keyof typeof GENERATION_STYLE];

// ============================================================================
// Generation Style Names (Display)
// ============================================================================

export const GENERATION_STYLE_NAME: Record<GenerationStyleType, string> = {
  [GENERATION_STYLE.NONE]: "None",
  [GENERATION_STYLE.LEONARDO]: "Leonardo Style",
  [GENERATION_STYLE.GENERAL]: "General",
  [GENERATION_STYLE.ANALOG_FILM]: "Analog Film",
  [GENERATION_STYLE.ANIME]: "Anime",
  [GENERATION_STYLE.BOKEH]: "Bokeh",
  [GENERATION_STYLE.CINEMATIC]: "Cinematic",
  [GENERATION_STYLE.CINEMATIC_CLOSEUP]: "Cinematic (Close-Up)",
  [GENERATION_STYLE.COMIC_BOOK]: "Comic Book",
  [GENERATION_STYLE.CREATIVE]: "Creative",
  [GENERATION_STYLE.CREATIVE_CLOSEUP]: "Creative (Close-Up)",
  [GENERATION_STYLE.DIGITAL_ART]: "Digital Art",
  [GENERATION_STYLE.DYNAMIC]: "Dynamic",
  [GENERATION_STYLE.ENVIRONMENT]: "Environment",
  [GENERATION_STYLE.FANTASY_ART]: "Fantasy Art",
  [GENERATION_STYLE.FASHION]: "Fashion",
  [GENERATION_STYLE.FILM]: "Film",
  [GENERATION_STYLE.FOOD]: "Food",
  [GENERATION_STYLE.HDR]: "HDR",
  [GENERATION_STYLE.ILLUSTRATION]: "Illustration",
  [GENERATION_STYLE.ISOMETRIC]: "Isometric",
  [GENERATION_STYLE.LINE_ART]: "Line Art",
  [GENERATION_STYLE.LONG_EXPOSURE]: "Long Exposure",
  [GENERATION_STYLE.LOW_POLY]: "Low Poly",
  [GENERATION_STYLE.MACRO]: "Macro",
  [GENERATION_STYLE.MINIMALIST]: "Minimalist",
  [GENERATION_STYLE.MODELING_COMPOUND]: "Modeling Compound",
  [GENERATION_STYLE.MONOCHROME]: "Monochrome",
  [GENERATION_STYLE.MOODY]: "Moody",
  [GENERATION_STYLE.NEON_PUNK]: "Neon Punk",
  [GENERATION_STYLE.NEUTRAL]: "Neutral",
  [GENERATION_STYLE.ORIGAMI]: "Origami",
  [GENERATION_STYLE.PHOTOGRAPHY]: "Photography",
  [GENERATION_STYLE.PHOTOREALISTIC]: "Photorealistic",
  [GENERATION_STYLE.PIXEL_ART]: "Pixel Art",
  [GENERATION_STYLE.PORTRAIT]: "Portrait",
  [GENERATION_STYLE.RAYTRACED]: "Raytraced",
  [GENERATION_STYLE.RETRO]: "Retro",
  [GENERATION_STYLE.RENDER_3D]: "3D Render",
  [GENERATION_STYLE.SKETCH_BW]: "Sketch B/W",
  [GENERATION_STYLE.SKETCH_COLOR]: "Sketch Color",
  [GENERATION_STYLE.STOCK_PHOTO]: "Stock Photo",
  [GENERATION_STYLE.TILE_TEXTURE]: "Tile Texture",
  [GENERATION_STYLE.UNPROCESSED]: "Unprocessed",
  [GENERATION_STYLE.VIBRANT]: "Vibrant",
  [GENERATION_STYLE.VIBRANT_CLOSEUP]: "Vibrant (Close-Up)",
};

// ============================================================================
// Default Styles
// ============================================================================

export const DEFAULT_ALCHEMY_STYLE = GENERATION_STYLE.DYNAMIC;
export const DEFAULT_PHOTOREAL_STYLE = GENERATION_STYLE.CINEMATIC;

// ============================================================================
// Prompt Magic Version
// ============================================================================

export const PROMPT_MAGIC_VERSION = {
  v1: "v1",
  v2: "v2",
  v3: "v3",
} as const;

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
// Generation Types
// ============================================================================

export const GENERATION_TYPE = {
  PROMPT: "prompt",
  IMAGE: "image",
  MODEL: "model",
  VARIATION: "variation",
  TEXTURE: "texture",
  VIDEO: "video",
  BLUEPRINT: "blueprint",
} as const;

// ============================================================================
// Selected Generation Type
// ============================================================================

export const SELECTED_GENERATION_TYPE = {
  ONLY_IMAGES: "onlyImages",
  ONLY_VIDEOS: "onlyVideos",
  MIXED: "mixed",
} as const;

// ============================================================================
// Image Select Values
// ============================================================================

export const IMAGE_SELECT_VALUES = {
  ORIGINAL: "original",
  NO_BG: "transparent",
  UNZOOMED: "unzoom",
  DEFAULT_UPSCALED: "upscaled",
  ALTERNATE_UPSCALED: "alternateUpscaled",
  HD_UPSCALED: "hdUpscaled",
  SMOOTH_UPSCALED: "smoothUpscaled",
  ALCHEMY_REFINER: "alchemyRefiner",
  UNIVERSAL_UPSCALE: "universalUpscale",
  ULTRA_UPSCALE: "ultraUpscale",
  INITIAL_NO_BG: "transparent-0",
  INITIAL_UNZOOM: "unzoom-0",
  INITIAL_DEFAULT_UPSCALED: "upscaled-0",
  INITIAL_ALTERNATE_UPSCALED: "alternateUpscaled-0",
  INITIAL_HD_UPSCALED: "hdUpscaled-0",
  INITIAL_SMOOTH_UPSCALED: "smoothUpscaled-0",
  INITIAL_ALCHEMY_REFINER: "alchemyRefiner-0",
  INITIAL_UNIVERSAL_UPSCALE: "universalUpscale-0",
  INITIAL_ULTRA_UPSCALE: "ultraUpscale-0",
  VIDEO_UPSCALED: "videoUpscaled",
} as const;

// ============================================================================
// Token Costs
// ============================================================================

export const TOKEN_COSTS = {
  NOBG: 2,
  MOTION: 25,
  TEXTURE_FULL: 30,
  TEXTURE_PREVIEW: 5,
  UNZOOM: 5,
  UPSCALE: 5,
  UPSCALE_ALCHEMY: 10,
  UPSCALE_ALTERNATIVE: 5,
  UPSCALE_CREATIVE: 10,
  UPSCALE_CRISP: 5,
  UPSCALE_REFINER: 10,
  UPSCALE_SMOOTH: 5,
} as const;

// ============================================================================
// Panel Thumbnail Status
// ============================================================================

export const PANEL_THUMBNAIL_CARD_STATUS = {
  AVAILABLE: "available",
  PREVIEW: "preview",
  COMING_SOON: "comingSoon",
} as const;

// ============================================================================
// Image Variation Types
// ============================================================================

export const IMAGE_VARIATION = {
  REMOVE_BACKGROUND: "REMOVE_BACKGROUND",
  UNZOOM: "UNZOOM",
  UPSCALE: "UPSCALE",
  UPSCALE_ALCHEMY: "UPSCALE_ALCHEMY",
  UPSCALE_ALTERNATIVE: "UPSCALE_ALTERNATIVE",
  UPSCALE_CREATIVE: "UPSCALE_CREATIVE",
  UPSCALE_CRISP: "UPSCALE_CRISP",
  UPSCALE_REFINER: "UPSCALE_REFINER",
  UPSCALE_SMOOTH: "UPSCALE_SMOOTH",
} as const;

export const IMAGE_VARIATION_TOKEN_COST = {
  [IMAGE_VARIATION.REMOVE_BACKGROUND]: 2,
  [IMAGE_VARIATION.UNZOOM]: 5,
  [IMAGE_VARIATION.UPSCALE]: 5,
  [IMAGE_VARIATION.UPSCALE_ALCHEMY]: 8,
  [IMAGE_VARIATION.UPSCALE_ALTERNATIVE]: 5,
  [IMAGE_VARIATION.UPSCALE_CREATIVE]: 5,
  [IMAGE_VARIATION.UPSCALE_CRISP]: 5,
  [IMAGE_VARIATION.UPSCALE_REFINER]: 8,
  [IMAGE_VARIATION.UPSCALE_SMOOTH]: 5,
} as const;

// ============================================================================
// Additional Token Costs
// ============================================================================

export const TEXTURE_FULL_TOKEN_COST = 30;
export const TEXTURE_PREVIEW_TOKEN_COST = 5;
export const PROMPT_TOKEN_COST = 1;
export const LIGHTNING_STREAM_DAILY_LIMIT_FOR_FREE_PLAN = 300;
export const LIGHTNING_STREAM_DAILY_LIMIT_FOR_PAID_PLAN = 20000;
export const LIGHTNING_STREAM_GENERATION_COST = 1;
export const LIGHTNING_STREAM_PROMPT_COST = 1;
export const FLUX_OMNI_COST = 50;
export const FLUX_MAX_COST = 100;
export const GEMINI_2_5_FLASH_COST = 40;
export const MOTION_PER_SECOND_TOKEN_COST = 10;
export const MOTION_SVD_GENERATION_TOKEN_COST = 25;
export const MOTION_VIDEO_GENERATION_TOKEN_COST = 200;
export const MOTION_VIDEO_GENERATION_TOKEN_COST_480 = 200;
export const MOTION_VIDEO_GENERATION_TOKEN_COST_720 = 300;
export const FAST_MOTION_VIDEO_GENERATION_TOKEN_COST_480 = 70;
export const FAST_MOTION_VIDEO_GENERATION_TOKEN_COST_720 = 150;
export const MOTION_VIDEO_GENERATION_VEO3_TOKEN_COST = 2500;
export const MOTION_VIDEO_GENERATION_VEO3FAST_TOKEN_COST = 1250;
export const VEO3_MOTION_VIDEO_GENERATION_PER_SECOND = 312.5;
export const VEO3_FAST_MOTION_VIDEO_GENERATION_PER_SECOND = 156.25;
export const VEO3_1_MOTION_VIDEO_GENERATION_PER_SECOND = 312.5;
export const VEO3_1_FAST_MOTION_VIDEO_GENERATION_PER_SECOND = 156.25;
export const MOTION_VIDEO_GENERATION_KLING_2_5_BASE_COST = 300;
export const MOTION_VIDEO_GENERATION_KLING_2_5_BASE_COST_PER_SECOND = 70;
export const MOTION_VIDEO_GENERATION_KLING_2_1_BASE_COST_PER_SECOND = 90;
export const VIDEO_GENERATION_UPSCALE_480P_TO_720P_TOKEN_COST = 100;
export const TOKEN_COST_FLUX_2_0_I2I = 105;
export const TOKEN_COST_FLUX_2_0_T2I_BELOW_OR_EQUAL_TO_1_MEGAPIXEL = 30;
export const TOKEN_COST_FLUX_2_0_T2I_1_TO_2_MEGAPIXEL = 60;
export const TOKEN_COST_FLUX_2_0_T2I_2_TO_3_MEGAPIXEL = 90;
export const TOKEN_COST_FLUX_2_0_T2I_3_TO_4_MEGAPIXEL = 120;

// ============================================================================
// Alchemy Constants
// ============================================================================

export const ALCHEMY_REFINER_STRENGTH = {
  High: 0.6,
  Medium: 0.65,
  Low: 0.7,
} as const;

export const ALCHEMY_REFINER_STRENGTH_DEFAULT = ALCHEMY_REFINER_STRENGTH.Medium;
export const ALCHEMY_REFINER_STRENGTH_ALCHEMY_SDXL_DEFAULT =
  ALCHEMY_REFINER_STRENGTH.Low;

export const ALCHEMY_RESOLUTION_MULTIPLIER = 1.5;
export const ALCHEMY_RESOLUTION_MULTIPLIER_HIGH_RESOLUTION = 2;
export const ALCHEMY_RESOLUTION_MULTIPLIER_V2 = 1.75;

// ============================================================================
// ControlNet & Image Strength Constants
// ============================================================================

export const CONTROLNETS_LIMIT_FREE_USER = 1;
export const CONTROLNETS_LIMIT_PREMIUM_USER = 6;

export const IMAGE_PROMPT_STRENGTH_DEFAULT_VALUE = 0.45;
export const IMAGE_PROMPT_STRENGTH_MIN_VALUE = 0.35;
export const IMAGE_PROMPT_STRENGTH_MAX_VALUE = 1;
export const IMAGE_PROMPT_STRENGTH_STEP_VALUE = 0.01;

export const INIT_IMAGE_STRENGTH_DEFAULT_VALUE = 0.3;
export const INIT_IMAGE_STRENGTH_MIN_VALUE = 0.1;
export const INIT_IMAGE_STRENGTH_MAX_VALUE = 0.9;
export const INIT_IMAGE_STRENGTH_STEP_VALUE = 0.01;

export const CONTROLNET_STRENGTH_DEFAULT_VALUE = 1;
export const CONTROLNET_STRENGTH_MIN_VALUE = 0;
export const CONTROLNET_STRENGTH_MAX_VALUE = 1.5;
export const CONTROLNET_STRENGTH_STEP_VALUE = 0.01;

// ============================================================================
// Motion & SVD Constants
// ============================================================================

export const LEONARDO_MOTION_MODEL_ID = "87dfc7bf-f250-442c-877f-dd4a07e0d1a3";

export const MOTION_MODEL_IDS = [
  LEONARDO_MOTION_MODEL_ID,
  MODEL_IDS.DREAMSHAPER_V7,
  MODEL_IDS.ABSOLUTE_REALITY,
  MODEL_IDS.ANIMATION,
] as const;

export const MOTION_BASE_TOKEN_COST_PER_SECOND = 10;
export const MOTION_MAX_OUTPUTS_PER_GENERATION = 1;

export const MOTION_MAX_TOTAL_DURATION_SECONDS_FREE_USER = 2;
export const MOTION_MAX_TOTAL_DURATION_SECONDS_PREMIUM_USER = 10;

export const MOTION_MAX_SEGMENTS_FREE_USER = 1;
export const MOTION_MAX_SEGMENTS_PREMIUM_USER = 5;

export const MOTION_DURATIONS = [2, 4, 6, 8, 10] as const;

export const SVD_MOTION_STRENGTH_MIN = 1;
export const SVD_MOTION_STRENGTH_MAX = 10;
export const SVD_MOTION_STRENGTH_DEFAULT = 5;

export const MOTION_DURATION_FREE_TIER_THRESHOLD = 2;
export const DEFAULT_MOTION_DIMENSIONS = { width: 512, height: 512 };
export const DEFAULT_MOTION_MODEL_ID = MODEL_IDS.ABSOLUTE_REALITY;

// ============================================================================
// Generation Defaults
// ============================================================================

export const PhotoRealVersion = {
  V1: "v1",
  V2: "v2",
} as const;

export const GENERATION_DEFAULTS = {
  alchemy: {
    contrast: { default: 0.5, max: 1, min: 0, stride: 0.25 },
    default: true,
    defaultExpandedDomain: true,
    defaultHighResolution: false,
    defaultPreset: "DYNAMIC",
    photoReal: {
      default: false,
      defaultPreset: "CINEMATIC",
      depth: 0.55,
      raw: false,
      photoRealModelId: PhotoRealV2Models.KINO_XL.id,
      version: PhotoRealVersion.V2,
    },
    promptMagic: {
      strengthRangeOverride: {
        v2: { min: 0.3, max: 0.45 },
        v3: { min: 0.3, max: 0.65 },
      },
      strengthDefaultOverride: { v3: 0.55 },
    },
    resonance: { default: 15, max: 30, min: 2, stride: 1 },
  },
  controlNet: {
    default: false,
    defaultType: "POSE",
    weight: { default: 1, max: 1, min: 0, stride: 0.01 },
  },
  guidance: { default: 7, max: 20, min: 1, stride: 1 },
  imageCount: { default: 4, max: 8, min: 1, stride: 1 },
  imageSize: { max: 1536, min: 512, stride: 8 },
  initStrength: { default: 0.3, max: 0.9, min: 0, stride: 0.01 },
  modelId: { default: MODEL_IDS.KINO_LIGHTNING },
  motion: { default: false, durationSeconds: 2, prompt: "" },
  promptMagic: {
    default: false,
    highContrast: true,
    imagePromptWeight: { default: 0.82, max: 1, min: 0.35, stride: 0.01 },
    raw: false,
    strength: { default: 0.4, max: 0.8, min: 0.1, stride: 0.05 },
  },
  scheduler: { default: "LEONARDO" },
  steps: { default: 30, max: 60, min: 20, stride: 1 },
  svd: { default: false, durationSeconds: 4, motionStrength: 5 },
  tiling: { default: false },
  prompt: { max: 1500 },
  negativePrompt: { max: 1000 },
} as const;

// ============================================================================
// UI Scheduler Mapping
// ============================================================================

export const UI_SCHEDULER_MAPPING = {
  normal: {
    KLMS: "KLMS",
    EULER_ANCESTRAL_DISCRETE: "EULER_ANCESTRAL_DISCRETE",
    EULER_DISCRETE: "EULER_DISCRETE",
    DDIM: "DDIM",
    DPM_SOLVER: "DPM_SOLVER",
    PNDM: "PNDM",
    UNIPC: "UNIPC",
    LEONARDO: "LEONARDO",
  },
  alchemy: {
    KLMS: "KLMS",
    EULER_ANCESTRAL_DISCRETE: "EULER_ANCESTRAL_DISCRETE",
    EULER_DISCRETE: "EULER_DISCRETE",
    DDIM: "DDIM",
    DPM_SOLVER: "DPM_SOLVER",
    PNDM: "PNDM",
    UNIPC: "UNIPC",
    LEONARDO: "LEONARDO",
  },
} as const;
