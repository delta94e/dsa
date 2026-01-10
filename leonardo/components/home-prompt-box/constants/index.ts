/**
 * Constants exports for HomePromptBox
 */

export * from "./aspect-ratios";
export * from "./styles";
export * from "./models";

/**
 * Image generation prompt max length
 */
export const IMAGE_GENERATION_PROMPT_MAX_LENGTH = 1000;

/**
 * Image reference max count
 */
export const IMAGE_REFERENCE_MAX_COUNT = 6;

/**
 * Token limits
 */
export const FREE_USER_TOKEN_LIMIT = 40;
export const PAID_USER_TOKEN_LIMIT = 160;

/**
 * Image guidance type definitions
 */
export const IMAGE_REFERENCE_GUIDANCE_TYPE = {
  name: "Image Reference",
  displayDescription: "Use your image as a reference to guide the generation.",
  thumbnailURL: "https://cdn.leonardo.ai/static/images/image-reference-thumbnail.webp",
};

export const START_FRAME_GUIDANCE_TYPE = {
  name: "Start Frame",
  displayDescription: "Use this image as the starting frame for video generation.",
  thumbnailURL: "https://cdn.leonardo.ai/static/images/start-frame-thumbnail.webp",
};
