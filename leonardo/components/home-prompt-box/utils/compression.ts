/**
 * Prompt Compression Utilities
 *
 * Uses lz-string for URI-safe compression (matches module 64470).
 */

import LZString from "lz-string";

/**
 * Compress prompt for URL storage using LZ-string
 */
export function compressPrompt(prompt: string): string {
  return LZString.compressToEncodedURIComponent(prompt);
}

/**
 * Decompress prompt from URL using LZ-string
 */
export function decompressPrompt(compressed: string): string | null {
  try {
    return LZString.decompressFromEncodedURIComponent(compressed);
  } catch {
    return null;
  }
}

/**
 * Clear search params from URL except specified keys
 */
export function clearSearchParamsExcept(keepKeys: string[]): void {
  if (typeof window === "undefined") return;

  const url = new URL(window.location.href);
  const keysToKeep = new Set(keepKeys);

  for (const key of [...url.searchParams.keys()]) {
    if (!keysToKeep.has(key)) {
      url.searchParams.delete(key);
    }
  }

  window.history.replaceState({}, "", url.toString());
}

/**
 * Consume (get and remove) a search param from the URL
 */
export function consumeSearchParam(key: string): string | null {
  if (typeof window === "undefined") return null;

  const url = new URL(window.location.href);
  const value = url.searchParams.get(key);

  if (value !== null) {
    url.searchParams.delete(key);
    window.history.replaceState({}, "", url.toString());
  }

  return value;
}
