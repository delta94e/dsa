/**
 * Image Modal Utilities
 *
 * Utility functions for image selection modals.
 * Based on Leonardo.ai module 420707.
 */

// ============================================================================
// Types
// ============================================================================

export enum InitImageType {
  Uploaded = "UPLOADED",
  Generated = "GENERATED",
}

export interface ModalImage {
  id: string;
  initImageId?: string;
  initVariationId?: string;
  initImageType?: InitImageType;
  url: string;
  urlVariation?: string;
  alt?: string;
  base64ImageUri?: string;
  aspectRatio?: number;
  motionGifUrl?: string;
  motionMp4Url?: string;
  dimensions?: {
    width: number;
    height: number;
  };
  generation?: {
    transparency?: boolean;
    imageWidth?: number;
    imageHeight?: number;
  };
}

// Legacy format without id (used by transformToLegacyImageModalImage)
export type LegacyModalImage = Omit<ModalImage, "id">;

export interface UploadItem {
  id: string;
  url: string;
  alt?: string;
}

export interface GenerationItem {
  id: string;
  url: string;
  variationId?: string;
  variationUrl?: string;
  alt?: string;
  motionGifUrl?: string;
  motionMp4Url?: string;
  aspectRatio?: number;
  dimensions?: {
    width: number;
    height: number;
  };
  generation?: {
    transparency?: boolean;
  };
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Creates an image element with CORS enabled
 */
export function createImageWithCors(src: string): HTMLImageElement {
  const img = new Image();
  img.crossOrigin = "anonymous";
  img.src = src;
  return img;
}

/**
 * Loads image dimensions from URL (n)
 */
export async function loadImageDimensions(
  url: string
): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = createImageWithCors(url);
    img.onload = () =>
      resolve({
        width: img.naturalWidth,
        height: img.naturalHeight,
      });
    img.onerror = () => reject(new Error(`Failed to load image at ${url}`));
  });
}

/**
 * Transforms to legacy image modal image format (s)
 */
export function transformToLegacyImageModalImage(
  image: ModalImage
): LegacyModalImage {
  let generation: ModalImage["generation"];

  if (image.generation) {
    generation = {
      transparency: image.generation.transparency,
      imageWidth: image.dimensions?.width ?? 0,
      imageHeight: image.dimensions?.height ?? 0,
    };
  }

  return {
    initImageId: image.initImageId,
    initImageType: image.initImageType,
    url: image.url,
    alt: image.alt ?? "",
    urlVariation: image.urlVariation ?? undefined,
    ...(image.dimensions?.width && image.dimensions.height
      ? {
          dimensions: {
            width: image.dimensions.width,
            height: image.dimensions.height,
          },
        }
      : {}),
    base64ImageUri: image.base64ImageUri,
    aspectRatio: image.aspectRatio,
    generation,
  };
}

/**
 * Maps upload to modal image format (l)
 */
export function mapUploadToModalImage(upload: UploadItem): ModalImage {
  return {
    id: upload.id,
    initImageId: upload.id,
    initImageType: InitImageType.Uploaded,
    url: upload.url,
    alt: upload.alt || "",
    aspectRatio: 1,
  };
}

/**
 * Maps generation to modal image format (r)
 */
export function mapGenerationToModalImage(
  generation: GenerationItem
): ModalImage {
  const width = generation.dimensions?.width ?? 1;
  const height = generation.dimensions?.height ?? 1;

  return {
    id: generation.id,
    initImageId: generation.id,
    initVariationId: generation.variationId,
    initImageType: InitImageType.Generated,
    url: generation.url,
    urlVariation: generation.variationUrl ?? undefined,
    alt: generation.alt,
    motionGifUrl: generation.motionGifUrl ?? undefined,
    motionMp4Url: generation.motionMp4Url ?? undefined,
    dimensions: { width, height },
    aspectRatio:
      generation.aspectRatio ?? (width > 0 && height > 0 ? width / height : 1),
    generation: generation.generation?.transparency
      ? { transparency: generation.generation.transparency }
      : undefined,
  };
}

/**
 * No-op function (o)
 */
export function noop(): void {}

/**
 * Converts to modal image array (a)
 */
export function toModalImageArray(
  input: ModalImage | ModalImage[] | null | undefined,
  defaultValue: ModalImage[] = []
): ModalImage[] {
  if (Array.isArray(input)) {
    return input;
  }
  if (input && typeof input === "object") {
    return [input];
  }
  if (input == null) {
    return defaultValue;
  }
  console.warn(
    "AssetSelectionModal: handleConfirm received an unexpected argument:",
    input
  );
  return [];
}
