/**
 * Aspect Ratio Constants for HomePromptBox
 *
 * Defines available aspect ratios for image and video generation modes.
 */

export interface AspectRatioOption {
  value: string;
  label: string;
  displayLabel: string;
  disabled?: boolean;
  disabledReason?: string;
}

/**
 * Aspect ratios available for image generation
 */
export const IMAGE_ASPECT_RATIOS: AspectRatioOption[] = [
  { value: "2:3", label: "2:3 (Portrait)", displayLabel: "2:3" },
  { value: "1:1", label: "1:1 (Square)", displayLabel: "1:1" },
  { value: "16:9", label: "16:9 (Landscape)", displayLabel: "16:9" },
  { value: "4:3", label: "4:3 (Twitter/X)", displayLabel: "4:3" },
  { value: "4:5", label: "4:5 (Instagram)", displayLabel: "4:5" },
  { value: "9:16", label: "9:16 (TikTok)", displayLabel: "9:16" },
];

/**
 * Aspect ratios available for video generation
 */
export const VIDEO_ASPECT_RATIOS: AspectRatioOption[] = [
  { value: "1:1", label: "1:1 (Square)", displayLabel: "1:1" },
  { value: "16:9", label: "16:9 (Landscape)", displayLabel: "16:9" },
  { value: "9:16", label: "9:16 (Portrait)", displayLabel: "9:16" },
];

/**
 * All unique aspect ratio values
 */
export const IMAGE_ASPECT_RATIO_VALUES = IMAGE_ASPECT_RATIOS.map((r) => r.value);
export const VIDEO_ASPECT_RATIO_VALUES = VIDEO_ASPECT_RATIOS.map((r) => r.value);
export const ALL_ASPECT_RATIO_VALUES = [...new Set([...IMAGE_ASPECT_RATIO_VALUES, ...VIDEO_ASPECT_RATIO_VALUES])];

/**
 * Default aspect ratios
 */
export const DEFAULT_IMAGE_ASPECT_RATIO = "1:1";
export const DEFAULT_VIDEO_ASPECT_RATIO = "16:9";

/**
 * Get aspect ratio options for a given mode
 */
export function getAspectRatiosForMode(mode: "image" | "video"): AspectRatioOption[] {
  return mode === "image" ? IMAGE_ASPECT_RATIOS : VIDEO_ASPECT_RATIOS;
}

/**
 * Check if aspect ratio is valid for given mode
 */
export function isValidAspectRatioForMode(aspectRatio: string, mode: "image" | "video"): boolean {
  const validValues = mode === "image" ? IMAGE_ASPECT_RATIO_VALUES : VIDEO_ASPECT_RATIO_VALUES;
  return validValues.includes(aspectRatio);
}
