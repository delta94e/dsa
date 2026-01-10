/**
 * Image Guidance Mapper
 *
 * Maps internal image guidance items to the API format.
 */

import type { ImageGuidanceItem, InternalImageGuidanceItem, InitImageTypeValue } from "../types";
import { InitImageType } from "../types";

/**
 * Map internal image guidance items to API format
 */
export function mapImageGuidanceItems(
  items: InternalImageGuidanceItem[]
): ImageGuidanceItem[] | undefined {
  if (items.length === 0) return undefined;

  return items
    .filter((item) => !!item.url)
    .map((item) => ({
      id: item.initImageId,
      type: item.initImageType || InitImageType.Generated,
      url: item.url,
      ...(item.dimensions && {
        dimensions: {
          width: item.dimensions.width ?? 0,
          height: item.dimensions.height ?? 0,
        },
      }),
    }));
}
