/**
 * Types for HomePromptBox Form
 *
 * Defines TypeScript types and Zod validation schema for the prompt form.
 */

import { z } from "zod";
import {
  ALL_ASPECT_RATIO_VALUES,
  IMAGE_ASPECT_RATIO_VALUES,
  VIDEO_ASPECT_RATIO_VALUES,
  STYLE_PRESET_IDS,
  AUTO_PRESET_DEFAULT_STYLE_ID,
  AUTO_MODEL_PRESET,
  IMAGE_GENERATION_PROMPT_MAX_LENGTH,
  isHailuoAspectRatioRestricted,
} from "../constants";

/**
 * Init image types for image guidance
 */
export const InitImageType = {
  Generated: "GENERATED",
  Uploaded: "UPLOADED",
} as const;

export type InitImageTypeValue = (typeof InitImageType)[keyof typeof InitImageType];

/**
 * Image guidance item schema
 */
export const imageGuidanceItemSchema = z.object({
  id: z.string(),
  disabled: z.boolean().optional(),
  url: z.string(),
  type: z.enum([InitImageType.Generated, InitImageType.Uploaded]),
  dimensions: z
    .object({
      width: z.number(),
      height: z.number(),
    })
    .optional(),
});

export type ImageGuidanceItem = z.infer<typeof imageGuidanceItemSchema>;

/**
 * Generation mode
 */
export type GenerationMode = "image" | "video";

/**
 * Get max image guidance count based on mode
 */
export function getMaxImageGuidanceCount(mode: GenerationMode): number {
  return mode === "image" ? 6 : 1;
}

/**
 * Base prompt form schema
 */
export const promptFormSchema = z.object({
  prompt: z
    .string()
    .trim()
    .min(1, { message: "Prompt is required" })
    .max(IMAGE_GENERATION_PROMPT_MAX_LENGTH, {
      message: `Prompt must be less than ${IMAGE_GENERATION_PROMPT_MAX_LENGTH} characters`,
    }),
  aspectRatio: z.enum(ALL_ASPECT_RATIO_VALUES as [string, ...string[]], {
    message: "Invalid aspect ratio selected",
  }),
  style: z.enum(STYLE_PRESET_IDS as [string, ...string[]], {
    message: "Invalid style selected",
  }),
  mode: z.enum(["image", "video"]),
  model: z.string().optional(),
  imageGuidance: z.array(imageGuidanceItemSchema).optional(),
  numberOfImages: z.number().min(1).max(4).optional(),
});

/**
 * Prompt form values type
 */
export type PromptFormValues = z.infer<typeof promptFormSchema>;

/**
 * Extended schema with refinements
 */
export const promptFormSchemaWithRefinements = promptFormSchema
  // Validate image guidance count for mode
  .refine(
    (data) => {
      if (!data.imageGuidance || data.imageGuidance.length === 0) return true;
      const maxCount = getMaxImageGuidanceCount(data.mode);
      return data.imageGuidance.length <= maxCount;
    },
    { message: "Invalid number of images for the selected mode" }
  )
  // Validate aspect ratio for mode
  .refine(
    (data) => {
      const validRatios = data.mode === "image" ? IMAGE_ASPECT_RATIO_VALUES : VIDEO_ASPECT_RATIO_VALUES;
      return validRatios.includes(data.aspectRatio);
    },
    { message: "Invalid aspect ratio for the selected mode" }
  )
  // Validate Hailuo aspect ratio requires start frame
  .refine(
    (data) => {
      if (data.mode !== "video") return true;
      const hasStartFrame = data.imageGuidance && data.imageGuidance.length > 0;
      if (hasStartFrame) return true;
      return !isHailuoAspectRatioRestricted(data.model, data.aspectRatio);
    },
    { message: "This aspect ratio requires a start frame for video generation" }
  );

/**
 * Default form values
 */
export const DEFAULT_FORM_VALUES: PromptFormValues = {
  prompt: "",
  aspectRatio: "1:1",
  style: AUTO_PRESET_DEFAULT_STYLE_ID,
  mode: "image",
  model: AUTO_MODEL_PRESET.id,
  imageGuidance: [],
  numberOfImages: 1,
};

/**
 * Internal image guidance item (before mapping)
 */
export interface InternalImageGuidanceItem {
  id: string;
  initImageId: string;
  initImageType?: InitImageTypeValue;
  url: string;
  dimensions?: {
    width?: number;
    height?: number;
  };
}
