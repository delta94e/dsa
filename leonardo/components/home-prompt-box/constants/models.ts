/**
 * Model Presets for HomePromptBox
 *
 * Defines available AI models for image and video generation.
 */

export interface ModelPreset {
  id: string;
  label: string;
  description: string;
  thumbnailUrl?: string;
}

/**
 * Video generation model IDs
 */
export const VideoGenerationModel = {
  HAILUO2_3: "hailuo-2.3",
} as const;

export type VideoGenerationModelType = (typeof VideoGenerationModel)[keyof typeof VideoGenerationModel];

/**
 * Auto model preset (intelligent selection)
 */
export const AUTO_MODEL_PRESET: ModelPreset = {
  id: "auto",
  label: "Auto",
  description: "An intelligent Preset that automatically selects the best model for your prompt.",
  thumbnailUrl: "https://cdn.leonardo.ai/static/images/video/models/auto_preset.webm",
};

/**
 * Model presets for image generation
 */
export const IMAGE_MODEL_PRESETS: ModelPreset[] = [AUTO_MODEL_PRESET];

/**
 * Model presets for video generation
 */
export const VIDEO_MODEL_PRESETS: ModelPreset[] = [
  {
    id: VideoGenerationModel.HAILUO2_3,
    label: "Hailuo 2.3",
    description: "Affordable, high-quality video with advanced style execution.",
    thumbnailUrl: "https://cdn.leonardo.ai/static/images/video/models/hailuo-2.3.webm",
  },
];

/**
 * Get model presets for a given mode
 */
export function getModelsForMode(mode: "image" | "video"): ModelPreset[] {
  return mode === "video" ? VIDEO_MODEL_PRESETS : IMAGE_MODEL_PRESETS;
}

/**
 * Get label by ID from an array of items with id and label properties (eG)
 * Generic helper that works with any preset array
 */
export function getLabelById<T extends { id: string; label: string }>(
  items: T[],
  id: string
): string {
  return items.find((item) => item.id === id)?.label ?? id;
}

/**
 * Get model label by ID (deprecated - use getLabelById instead)
 */
export function getModelLabelById(modelId: string, mode: "image" | "video"): string {
  const models = getModelsForMode(mode);
  return getLabelById(models, modelId);
}

/**
 * Check if Hailuo model requires start frame for given aspect ratio
 */
export function isHailuoAspectRatioRestricted(modelId: string | undefined, aspectRatio: string): boolean {
  return !!modelId && modelId === VideoGenerationModel.HAILUO2_3 && aspectRatio !== "16:9";
}

/**
 * Default model for each mode
 */
export const DEFAULT_IMAGE_MODEL = AUTO_MODEL_PRESET.id;
export const DEFAULT_VIDEO_MODEL = VideoGenerationModel.HAILUO2_3;
