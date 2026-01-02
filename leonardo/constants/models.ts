/**
 * Model IDs
 * 
 * All AI model identifiers for Leonardo.ai
 */

// ============================================================================
// Base Model IDs
// ============================================================================

export const MODEL_IDS = {
    // Leonardo Models
    PHOENIX: 'phoenix',
    PHOENIX_0_9_4: 'phoenix-0-9-4',
    DIFFUSION_XL: 'leonardo-diffusion-xl',
    KINO_XL: 'kino-xl',
    VISION_XL: 'vision-xl',
    KINO_LIGHTNING: 'kino-lightning',
    ANIMIX_LIGHTNING: 'animix-lightning',
    KINO_2_0: 'kino-2-0',
    KINO_2_1: 'kino-2-1',

    // SDXL Models
    SDXL_0_9: 'sdxl-0-9',
    SDXL_1_0: 'sdxl-1-0',

    // SD3
    SD3: 'sd3',

    // Flux Models
    FLUX_SCHNELL: 'flux-schnell',
    FLUX_DEV: 'flux-dev',
    FLUX_OMNI: 'flux-omni',
    FLUX_MAX: 'flux-max',
    FLUX_DEV_2_0: 'flux-dev-2-0',
    FLUX_PRO_2_0: 'flux-pro-2-0',

    // Third Party Models
    IDEOGRAM_3: 'ideogram-3',
    GEMINI_2_5_FLASH: 'gemini-2-5-flash',
    GEMINI_IMAGE_2: 'gemini-image-2',
    GPT_IMAGE_1: 'gpt-image-1',
    GPT_IMAGE_1_5: 'gpt-image-1-5',
    SEEDREAM_4_0: 'seedream-4-0',
    SEEDREAM_4_5: 'seedream-4-5',

    // Special
    AUTO_PRESET: 'auto-preset',
    PHOTOREAL: 'photoreal',

    // Community Models
    DREAMSHAPER_V7: 'dreamshaper-v7',
    ABSOLUTE_REALITY: 'absolute-reality',
    ANIME_PASTEL_DREAM: 'anime-pastel-dream',
    ANIMATION: 'animation',
} as const;

export type ModelId = (typeof MODEL_IDS)[keyof typeof MODEL_IDS];

// ============================================================================
// Albedo Base XL (Special ID)
// ============================================================================

export const ALBEDO_BASE_XL_ID = '2067ae52-33fd-4a82-bb92-c2c55e7d2786';

// ============================================================================
// Model Matrix (Third Party Premium Models)
// ============================================================================

export const MODEL_MATRIX_MODEL_IDS_MAP = {
    IDEOGRAM_3: MODEL_IDS.IDEOGRAM_3,
    GEMINI_2_5_FLASH: MODEL_IDS.GEMINI_2_5_FLASH,
    AUTO_PRESET: MODEL_IDS.AUTO_PRESET,
    FLUX_MAX: MODEL_IDS.FLUX_MAX,
    FLUX_DEV_2_0: MODEL_IDS.FLUX_DEV_2_0,
    FLUX_PRO_2_0: MODEL_IDS.FLUX_PRO_2_0,
    SEEDREAM_4_0: MODEL_IDS.SEEDREAM_4_0,
    SEEDREAM_4_5: MODEL_IDS.SEEDREAM_4_5,
    GEMINI_IMAGE_2: MODEL_IDS.GEMINI_IMAGE_2,
    GPT_IMAGE_1_5: MODEL_IDS.GPT_IMAGE_1_5,
} as const;

// ============================================================================
// Leonardo Model IDs Map (All Leonardo Models)
// ============================================================================

export const LEO_MODEL_IDS_MAP = {
    // Lightning Models
    KINO_LIGHTNING: MODEL_IDS.KINO_LIGHTNING,
    ANIMIX_LIGHTNING: MODEL_IDS.ANIMIX_LIGHTNING,

    // XL Models
    LEONARDO_DIFFUSION_XL: MODEL_IDS.DIFFUSION_XL,
    LEONARDO_KINO_XL: MODEL_IDS.KINO_XL,
    LEONARDO_VISION_XL: MODEL_IDS.VISION_XL,

    // Phoenix
    LEONARDO_PHOENIX: MODEL_IDS.PHOENIX,
    LEONARDO_PHOENIX_V1: MODEL_IDS.PHOENIX_0_9_4,

    // Flux
    FLUX_SCHNELL: MODEL_IDS.FLUX_SCHNELL,
    FLUX_DEV: MODEL_IDS.FLUX_DEV,
    FLUX_OMNI: MODEL_IDS.FLUX_OMNI,

    // Albedo
    ALBEDO_BASE_XL: ALBEDO_BASE_XL_ID,

    // Community
    DREAMSHAPER: MODEL_IDS.DREAMSHAPER_V7,
    ABSOLUTE_REALITY: MODEL_IDS.ABSOLUTE_REALITY,
    ANIME_PASTEL_DREAM: MODEL_IDS.ANIME_PASTEL_DREAM,
    ANIMATION: MODEL_IDS.ANIMATION,

    // SDXL
    SDXL_V0_9: MODEL_IDS.SDXL_0_9,
    SDXL_V1_0: MODEL_IDS.SDXL_1_0,
    SD3: MODEL_IDS.SD3,

    // Kino 2.x
    KINO_2_0: MODEL_IDS.KINO_2_0,
    KINO_2_1: MODEL_IDS.KINO_2_1,

    // GPT
    GPT_IMAGE_1: MODEL_IDS.GPT_IMAGE_1,

    // Include Model Matrix
    ...MODEL_MATRIX_MODEL_IDS_MAP,
} as const;

export const LEO_MODEL_IDS_ARRAY = Object.values(LEO_MODEL_IDS_MAP);

// ============================================================================
// SDXL Model IDs
// ============================================================================

export const SDXL_MODEL_IDS = [
    MODEL_IDS.SDXL_0_9,
    MODEL_IDS.SDXL_1_0,
    LEO_MODEL_IDS_MAP.LEONARDO_DIFFUSION_XL,
    MODEL_IDS.KINO_XL,
    LEO_MODEL_IDS_MAP.LEONARDO_VISION_XL,
    ALBEDO_BASE_XL_ID,
    '89252435-82df-4c1d-883a-2f5a770d7109', // Alternative Albedo
    LEO_MODEL_IDS_MAP.ANIMIX_LIGHTNING,
    LEO_MODEL_IDS_MAP.KINO_LIGHTNING,
] as const;

// ============================================================================
// Flux Dev LORA Model
// ============================================================================

export const FLUX_DEV_LORA_MODEL = {
    key: 'FLUX_DEV',
    name: 'Flux Dev',
} as const;

// ============================================================================
// LORA Models
// ============================================================================

export const LORA_MODELS = [
    { key: 'SDXL_0_9', name: 'SDXL 0.9' },
    { key: 'SDXL_1_0', name: 'SDXL 1.0' },
    { key: 'LEONARDO_DIFFUSION_XL', name: 'Leonardo Diffusion XL' },
    { key: 'LEONARDO_LIGHTNING_XL', name: 'Leonardo Lightning XL' },
    { key: 'VISION_XL', name: 'Vision XL' },
    { key: 'KINO_XL', name: 'Kino XL' },
    { key: 'ALBEDO_XL', name: 'Albedo XL' },
    FLUX_DEV_LORA_MODEL,
] as const;

// ============================================================================
// LORA Categories
// ============================================================================

export const LORA_CATEGORY = {
    Style: 'Style',
    Object: 'Object',
    Character: 'Character',
} as const;

// ============================================================================
// PhotoReal Model Data
// ============================================================================

export const PHOTO_REAL_MODEL_DATA = {
    id: MODEL_IDS.PHOTOREAL,
    name: 'PhotoReal',
    description: 'Leonardo PhotoReal is our latest innovation, a powerful pipeline designed to generate hyper-realistic photos and lifelike portraits.',
    user: {
        username: 'Leonardo',
    },
    imageUrl: '/img/photoreal-model.webp',
    sdVersion: 'v1_5',
} as const;

// ============================================================================
// Base Model Info
// ============================================================================

export const BASE_MODEL_INFO = {
    v1_5: {
        id: 'v1_5',
        instancePrompt: '',
        name: 'Stable Diffusion 1.5',
        modelWidth: 512,
        modelHeight: 512,
        style: 'NONE',
        motion: false,
        sdVersion: 'v1_5',
    },
    v2: {
        id: 'v2',
        instancePrompt: '',
        name: 'Stable Diffusion 2.1',
        modelWidth: 768,
        modelHeight: 768,
        style: 'NONE',
        motion: false,
        sdVersion: 'v2',
    },
} as const;

export const BASE_MODEL_IDS = Object.keys(BASE_MODEL_INFO);

// ============================================================================
// Model Tabs
// ============================================================================

export const MODEL_TABS = {
    PLATFORM: 'platform-models',
    COMMUNITY: 'community-models',
    USER_MODELS: 'your-models',
    FAVOURITE: 'favorite-models',
    TEAM_MODELS: 'team-models',
    USER_ELEMENTS: 'your-elements',
    TEAM_ELEMENTS: 'team-elements',
} as const;

// ============================================================================
// Custom Model Categories
// ============================================================================

export const CATEGORY = {
    GENERAL: 'General',
    BUILDINGS: 'Buildings',
    CHARACTERS: 'Characters',
    ENVIRONMENTS: 'Environments',
    FASHION: 'Fashion',
    ILLUSTRATIONS: 'Illustrations',
    GAME_ITEMS: 'Game Items',
    GRAPHICAL_ELEMENTS: 'Graphical Elements',
    PHOTOGRAPHY: 'Photography',
    PIXEL_ART: 'Pixel Art',
    PRODUCT_DESIGN: 'Product Design',
    TEXTURES: 'Textures',
    UI_ELEMENTS: 'UI Elements',
    VECTOR: 'Vector',
} as const;
