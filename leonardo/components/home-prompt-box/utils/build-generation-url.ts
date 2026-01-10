/**
 * URL Builder for Generation
 *
 * Builds URLs for navigating to the generation page with compressed state.
 * Matches module 64470 transformer pipeline pattern.
 */

import { compressPrompt, decompressPrompt } from "./compression";
import type { PromptFormValues, ImageGuidanceItem } from "../types";

/**
 * State transformer type - modifies URLSearchParams based on state
 */
type StateTransformer<T> = (state: T, params: URLSearchParams) => void;

/**
 * Serialize array to query params (matches Leonardo's serializeQueryParams)
 */
function serializeArrayParam(
  key: string,
  value: unknown[],
  params: URLSearchParams
): void {
  params.set(key, JSON.stringify(value));
}

/**
 * Default state transformers for generation URLs (matches module 64470)
 */
const defaultTransformers: StateTransformer<Record<string, unknown>>[] = [
  // 1. Handle prompt compression
  (state, params) => {
    if (state.useCompression !== false) {
      params.set("compressedPrompt", compressPrompt(state.prompt as string));
    } else {
      params.set("prompt", state.prompt as string);
    }
  },
  // 2. Handle standard string params
  (state, params) => {
    const keys = ["aspectRatio", "style", "model", "numberOfImages", "source"];
    keys.forEach((key) => {
      const value = state[key];
      if (value != null) {
        params.set(key, String(value));
      }
    });
  },
  // 3. Handle boolean autoGenerate (only set if true)
  (state, params) => {
    if (state.autoGenerate === true) {
      params.set("autoGenerate", "true");
    }
  },
  // 4. Handle array params (imageGuidance, startFrame)
  (state, params) => {
    const arrayKeys = ["imageGuidance", "startFrame"];
    arrayKeys.forEach((key) => {
      const value = state[key];
      if (Array.isArray(value) && value.length > 0) {
        serializeArrayParam(key, value, params);
      }
    });
  },
];

/**
 * Build state URL with transformer pipeline (matches ec.buildStateUrl)
 */
export function buildStateUrl<T extends Record<string, unknown>>(
  baseUrl: string,
  state: T,
  transformers: StateTransformer<T>[] = defaultTransformers as StateTransformer<T>[]
): string {
  const [basePath, existingQuery] = baseUrl.split("?");
  const params = new URLSearchParams(existingQuery);

  transformers.forEach((transformer) => transformer(state, params));

  const queryString = params.toString();
  return queryString ? `${basePath}?${queryString}` : basePath;
}

/**
 * Build generation URL for navigation
 * Matches the original em() function pattern from Leonardo.ai
 */
export function buildGenerationUrl(
  formValues: PromptFormValues,
  autoGenerate: boolean,
  imageGuidance?: ImageGuidanceItem[]
): string {
  // Determine base path based on mode
  const basePath =
    formValues.mode === "image" ? "/image-generation" : "/image-generation/video";

  // Map image guidance items
  const mappedGuidance = imageGuidance?.map((item) => ({
    id: item.id,
    url: item.url,
    type: item.type,
    ...(item.dimensions && { dimensions: item.dimensions }),
  }));

  // Build state object
  return buildStateUrl(basePath, {
    prompt: formValues.prompt,
    aspectRatio: formValues.aspectRatio,
    ...(formValues.mode === "image" && { style: formValues.style }),
    ...(formValues.model && { model: formValues.model }),
    useCompression: true,
    autoGenerate,
    numberOfImages: formValues.numberOfImages ?? 1,
    source: "homepage",
    ...(formValues.mode === "image" && mappedGuidance && { imageGuidance: mappedGuidance }),
    ...(formValues.mode === "video" && mappedGuidance && { startFrame: mappedGuidance }),
  });
}

/**
 * Build callback URL for auth redirect with form state preserved
 */
export function buildAuthCallbackUrl(
  formValues: PromptFormValues,
  options: { openImageGuidance?: boolean } = {}
): string {
  return buildStateUrl("/authenticated-home", {
    prompt: formValues.prompt,
    aspectRatio: formValues.aspectRatio,
    style: formValues.style,
    mode: formValues.mode,
    model: formValues.model,
    numberOfImages: formValues.numberOfImages,
    source: "homepage-image-guidance",
    useCompression: true,
    ...(options.openImageGuidance && { openImageGuidance: true }),
  });
}

export { compressPrompt, decompressPrompt };
