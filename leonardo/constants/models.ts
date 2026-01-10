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
  PHOENIX: "phoenix",
  PHOENIX_0_9: "6b645e3a-d64f-4341-a6d8-7a3690fbf042",
  PHOENIX_0_9_4: "de7d3faf-762f-48e0-b3b7-9d0ac3a3fcf3",
  DIFFUSION_XL: "1e60896f-3c26-4296-8ecc-53e2afecc132",
  LEONARDO_DIFFUSION_XL: "1e60896f-3c26-4296-8ecc-53e2afecc132",
  KINO_XL: "aa77f04e-3eec-4034-9c07-d0f619684628",
  VISION_XL: "5c232a9e-9061-4777-980a-ddc8e65647c6",
  KINO_LIGHTNING: "b24e16ff-06e3-43eb-8d33-4416c2d75876",
  LEONARDO_LIGHTNING_XL: "b24e16ff-06e3-43eb-8d33-4416c2d75876",
  ANIMIX_LIGHTNING: "e71a1c2f-4f80-4800-934f-2c68979d8cc8",
  KINO_2_0: "05ce0082-2d80-4a2d-8653-4d1c85e2418e",
  KINO_2_1: "7b592283-e8a7-4c5a-9ba6-d18c31f258b9",

  // SDXL Models
  SDXL_0_9: "b63f7119-31dc-4540-969b-2a9df997e173",
  SDXL_1_0: "16e7060a-803e-4df3-97ee-edcfa5dc9cc8",

  // SD3
  SD3: "6a8efd94-2600-4c3f-85b5-f944eb7e1abd",
  SD3_TURBO: "09bccb18-7b7e-4fce-9ae1-bda4834df45c",

  // Flux Models
  FLUX_SCHNELL: "1dd50843-d653-4516-a8e3-f0238ee453ff",
  FLUX_DEV: "b2614463-296c-462a-9586-aafdb8f00e36",
  FLUX_OMNI: "28aeddf8-bd19-4803-80fc-79602d1a9989",
  FLUX_MAX: "02dff998-e678-416c-a8a7-ce93188f2e68",
  FLUX_DEV_2_0: "c19631a4-21b4-4dbd-b015-b446b7a4e0e0",
  FLUX_PRO_2_0: "5478273a-68e1-4efe-a0c4-3fe84e4c16a8",

  // Third Party Models
  IDEOGRAM_3: "f9672904-3313-4867-b883-407ef6a0edec",
  GEMINI_2_5_FLASH: "4a008a65-8d97-44f5-97a0-66c431612614",
  GEMINI_IMAGE_2: "7c02ef35-3a6b-4df6-b78d-873e5032c3b4",
  GPT_IMAGE_1: "f75b1998-e5cb-4fdf-9eef-98e8186c2c2f",
  GPT_IMAGE_1_5: "99ecc726-3404-412c-9dc1-24d4cdef2299",
  SEEDREAM_4_0: "94515e81-e589-4a5b-aeae-10ced50142c2",
  SEEDREAM_4_5: "f1c295ea-1575-445f-89ae-9b4013a6a37c",

  // Special
  AUTO_PRESET: "auto-preset",
  PHOTOREAL: "b75a5b32-ca22-4b1d-bb0a-883c26783c71",
  MOTION: "d39db7fd-3896-4c69-91a4-2ef78163b0ce",

  // Community Models
  DREAMSHAPER_V7: "ac614f96-1082-45bf-be9d-757f2d31c174",
  ABSOLUTE_REALITY: "e316348f-7773-490e-adcd-46757c738eb7",
  ANIME_PASTEL_DREAM: "1aa0f478-51be-4efd-94e8-76bfc8f533af",
  ANIMATION: "d69c8273-6b17-4a30-a13e-d6637ae1c644",

  // Albedo
  ALBEDO_BASE_XL: "2067ae52-33fd-4a82-bb92-c2c55e7d2786",
  ALBEDO_XL: "2067ae52-33fd-4a82-bb92-c2c55e7d2786",

  // Alternative Albedo
  ALTERNATIVE_ALBEDO: "89252435-82df-4c1d-883a-2f5a770d7109",
} as const;

export type ModelId = (typeof MODEL_IDS)[keyof typeof MODEL_IDS];

// ============================================================================
// Albedo Base XL (Special ID)
// ============================================================================

export const ALBEDO_BASE_XL_ID = "2067ae52-33fd-4a82-bb92-c2c55e7d2786";

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
  MODEL_IDS.ALTERNATIVE_ALBEDO,
  LEO_MODEL_IDS_MAP.ANIMIX_LIGHTNING,
  LEO_MODEL_IDS_MAP.KINO_LIGHTNING,
] as const;

// ============================================================================
// Flux Dev LORA Model
// ============================================================================

export const FLUX_DEV_LORA_MODEL = {
  key: "FLUX_DEV",
  name: "Flux Dev",
} as const;

// ============================================================================
// LORA Models
// ============================================================================

export const LORA_MODELS = [
  { key: "SDXL_0_9", name: "SDXL 0.9" },
  { key: "SDXL_1_0", name: "SDXL 1.0" },
  { key: "LEONARDO_DIFFUSION_XL", name: "Leonardo Diffusion XL" },
  { key: "LEONARDO_LIGHTNING_XL", name: "Leonardo Lightning XL" },
  { key: "VISION_XL", name: "Vision XL" },
  { key: "KINO_XL", name: "Kino XL" },
  { key: "ALBEDO_XL", name: "Albedo XL" },
  FLUX_DEV_LORA_MODEL,
] as const;

// ============================================================================
// LORA Categories
// ============================================================================

export const LORA_CATEGORY = {
  Style: "Style",
  Object: "Object",
  Character: "Character",
} as const;

// ============================================================================
// PhotoReal Model Data
// ============================================================================

export const PHOTO_REAL_MODEL_DATA = {
  id: MODEL_IDS.PHOTOREAL,
  name: "PhotoReal",
  description:
    "Leonardo PhotoReal is our latest innovation, a powerful pipeline designed to generate hyper-realistic photos and lifelike portraits.",
  user: {
    username: "Leonardo",
  },
  imageUrl: "/img/photoreal-model.webp",
  sdVersion: "v1_5",
} as const;

// ============================================================================
// Base Model Info
// ============================================================================

export const BASE_MODEL_INFO = {
  v1_5: {
    id: "v1_5",
    instancePrompt: "",
    name: "Stable Diffusion 1.5",
    modelWidth: 512,
    modelHeight: 512,
    style: "NONE",
    motion: false,
    sdVersion: "v1_5",
  },
  v2: {
    id: "v2",
    instancePrompt: "",
    name: "Stable Diffusion 2.1",
    modelWidth: 768,
    modelHeight: 768,
    style: "NONE",
    motion: false,
    sdVersion: "v2",
  },
} as const;

export const BASE_MODEL_IDS = Object.keys(BASE_MODEL_INFO);

// ============================================================================
// Model Tabs
// ============================================================================

export const MODEL_TABS = {
  PLATFORM: "platform-models",
  COMMUNITY: "community-models",
  USER_MODELS: "your-models",
  FAVOURITE: "favorite-models",
  TEAM_MODELS: "team-models",
  USER_ELEMENTS: "your-elements",
  TEAM_ELEMENTS: "team-elements",
} as const;

// ============================================================================
// Custom Model Categories
// ============================================================================

export const CATEGORY = {
  GENERAL: "General",
  BUILDINGS: "Buildings",
  CHARACTERS: "Characters",
  ENVIRONMENTS: "Environments",
  FASHION: "Fashion",
  ILLUSTRATIONS: "Illustrations",
  GAME_ITEMS: "Game Items",
  GRAPHICAL_ELEMENTS: "Graphical Elements",
  PHOTOGRAPHY: "Photography",
  PIXEL_ART: "Pixel Art",
  PRODUCT_DESIGN: "Product Design",
  TEXTURES: "Textures",
  UI_ELEMENTS: "UI Elements",
  VECTOR: "Vector",
} as const;

export const MOTION_MAX_OUTPUTS_PER_GENERATION = 1;

// ============================================================================
// PhotoReal V2 Models
// ============================================================================

export const PhotoRealV2Models = {
  DIFFUSION_XL: {
    id: MODEL_IDS.DIFFUSION_XL,
    name: "Leonardo Diffusion XL",
  },
  VISION_XL: { id: MODEL_IDS.VISION_XL, name: "Leonardo Vision XL" },
  KINO_XL: { id: MODEL_IDS.KINO_XL, name: "Leonardo Kino XL" },
} as const;
