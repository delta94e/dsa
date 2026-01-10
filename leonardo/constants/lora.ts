export const GENERATION_LORAS_LIMIT = 4;

export const SDXL_FAMILY_VERSION_1 = [
  "SDXL_0_8",
  "SDXL_0_9",
  "SDXL_1_0",
  "SDXL_LIGHTNING",
] as const;

export const PHOENIX_FAMILY_VERSION_1 = ["PHOENIX"] as const;
export const FLUX_FAMILY_VERSION_1 = ["FLUX"] as const;
export const FLUX_DEV_FAMILY_VERSION_1 = ["FLUX_DEV"] as const;
export const FLUX_OMNI_FAMILY_VERSION_1 = ["FLUX_OMNI"] as const;
export const VIDEO_FAMILY_VERSION_1 = ["WAN21"] as const;
export const KINO_2_0_FAMILY_VERSION_1 = ["KINO_2_0"] as const;
export const GPT_FAMILY_VERSION_1 = ["GPT_IMAGE_1"] as const;

export const LORA_MODEL_COMPATIBILITY_MAP = {
  v1_5: ["v1_5"],
  v2: ["v2"],
  v3: ["v3"],
  SDXL_0_8: SDXL_FAMILY_VERSION_1,
  SDXL_0_9: SDXL_FAMILY_VERSION_1,
  SDXL_1_0: SDXL_FAMILY_VERSION_1,
  SDXL_LIGHTNING: SDXL_FAMILY_VERSION_1,
  PHOENIX: PHOENIX_FAMILY_VERSION_1,
  FLUX: FLUX_FAMILY_VERSION_1,
  FLUX_DEV: FLUX_DEV_FAMILY_VERSION_1,
  FLUX_OMNI: FLUX_OMNI_FAMILY_VERSION_1,
  FLUX_MAX: FLUX_OMNI_FAMILY_VERSION_1,
  WAN21: VIDEO_FAMILY_VERSION_1,
  MOTION2FAST: VIDEO_FAMILY_VERSION_1,
  KINO_2_0: KINO_2_0_FAMILY_VERSION_1,
  KINO_2_1: KINO_2_0_FAMILY_VERSION_1,
  GPT_IMAGE_1: GPT_FAMILY_VERSION_1,
} as const;

export const LORA_FOCUS_VALIDATIONS = {
  DEFAULT: {
    General: {
      LEARNING_RATE: { min: 1e-8, max: 1e-5, default: 1e-6 },
      EPOCHS: { min: 1, max: 250, default: 100 },
    },
    Style: {
      LEARNING_RATE: { min: 1e-8, max: 1e-5, default: 1e-6 },
      EPOCHS: { min: 1, max: 250, default: 100 },
    },
    Object: {
      LEARNING_RATE: { min: 1e-8, max: 1e-5, default: 1e-6 },
      EPOCHS: { min: 1, max: 250, default: 100 },
    },
    Character: {
      LEARNING_RATE: { min: 1e-8, max: 1e-5, default: 1e-6 },
      EPOCHS: { min: 1, max: 250, default: 100 },
    },
  },
  FLUX_DEV: {
    Style: {
      LEARNING_RATE: { min: 1e-6, max: 3e-5, default: 0.00001 },
      EPOCHS: { min: 30, max: 120, default: 60 },
    },
    Object: {
      LEARNING_RATE: { min: 1e-5, max: 0.001, default: 0.0004 },
      EPOCHS: { min: 120, max: 220, default: 140 },
    },
    Character: {
      LEARNING_RATE: { min: 5e-6, max: 3e-5, default: 0.00001 },
      EPOCHS: { min: 60, max: 140, default: 100 },
    },
  },
} as const;
