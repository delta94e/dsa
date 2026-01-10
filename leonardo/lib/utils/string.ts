/**
 * String Utilities
 *
 * Helper functions for string manipulation and formatting.
 * Matches production bundle module 977125.
 */

import { ROUTE } from "@/constants/routes";
import { ExternalUrls } from "@/constants/externalUrls";
import { formatNumberWithCommas } from "./number";

// ============================================================================
// User/Username Utilities
// ============================================================================

/**
 * Get the first initial of a username (uppercase)
 */
export const getUsernameInitials = (username: string): string =>
  username.trim().substring(0, 1).toUpperCase();

// ============================================================================
// URL Utilities
// ============================================================================

/**
 * Check if a URL is internal (belongs to the app)
 */
export const isInternalUrl = (url: string): boolean => {
  if (!url || url === "") return false;

  // Home route or starts with leonardo app URL
  if (
    url === ROUTE.HOME ||
    url.startsWith(ExternalUrls.leonardoApp.replace(/\/$/, ""))
  ) {
    return true;
  }

  // Check if URL matches any route (without leading slash)
  const cleanUrl = url.replace(/^\//, "");
  return Object.values(ROUTE).some(
    (route) =>
      route !== ROUTE.HOME && cleanUrl.startsWith(route.replace(/^\//, ""))
  );
};

/**
 * Check if a URL has a specific file extension
 */
export const isUrlWithExtension = (
  url: string,
  extension?: string
): boolean => {
  const isValidUrl =
    /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(url);
  const hasExtension = /\/[^\/].*\.\w+$/.test(url.replace("//", ""));
  return isValidUrl && hasExtension && (!extension || url.endsWith(extension));
};

// ============================================================================
// String Manipulation
// ============================================================================

/**
 * Remove all spaces from a string
 */
export const removeSpaces = (str: string): string => str.replace(/ /g, "");

/**
 * Capitalize the first letter of each sentence
 */
export function capitalizeSentences(text: string): string {
  return text
    .split(/([.!?;]\s*)/)
    .map((part, index) =>
      index % 2 === 0 ? part.charAt(0).toUpperCase() + part.slice(1) : part
    )
    .join("");
}

/**
 * Capitalize the first letter of a string
 */
export const capitalizeFirstLetter = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Sanitize a filename by removing invalid characters
 * and limiting length to 255 characters
 */
export const sanitizeFilename = (filename: string): string => {
  // Remove invalid characters and fix consecutive dots
  let sanitized = filename
    .trim()
    .replace(/[\/\?<>\\:\*\|"]/g, "")
    .replace(/(?<!\.)\.\.(?!\.)/g, ".");

  if (sanitized.length <= 255) return sanitized;

  // Handle extension preservation for long filenames
  const lastDot = sanitized.lastIndexOf(".");
  const extension =
    lastDot > 0 && lastDot < sanitized.length - 1
      ? sanitized.slice(lastDot)
      : "";

  return (
    (extension ? sanitized.slice(0, lastDot) : sanitized).slice(
      0,
      255 - extension.length
    ) + extension
  );
};

// ============================================================================
// Number Input Utilities
// ============================================================================

/**
 * Get a validated numerical value from an input element
 */
export const getNumericalInputValue = (
  input: { value: string },
  type: "integer" | "float",
  min: number,
  max: number,
  defaultValue?: number
): number => {
  const floatValue = Number.isNaN(Number(input.value))
    ? defaultValue || min
    : Number(input.value);
  const intValue = parseInt(input.value) || defaultValue || min;

  return Math.min(
    Math.max(type === "integer" ? intValue : floatValue, min),
    max
  );
};

/**
 * Snap a number to the nearest step value
 */
export const snapNumberToStep = (
  value: number,
  step: number,
  mode: "round" | "floor" | "ceil" = "round"
): number => Math[mode](value / step) * step;

// ============================================================================
// Number Formatting
// ============================================================================

/**
 * Format a number as a floating point string with specified decimal places
 */
export const formatNumberAsFloatingString = (
  value: number,
  decimalPlaces: number = 1
): string => {
  const str = value.toString();

  if (isNaN(Number(value)) || decimalPlaces <= 0) return str;

  if (str.includes(".")) {
    const [intPart, decPart] = str.split(".");
    return decPart.length >= decimalPlaces
      ? `${intPart}.${decPart.slice(0, decimalPlaces)}`
      : `${intPart}.${decPart.padEnd(decimalPlaces, "0")}`;
  }

  return `${str}.${"0".repeat(decimalPlaces)}`;
};

/**
 * Format a number with plural suffix
 */
export const formatPlural = (
  word: string,
  count?: number,
  fallback?: string | true
): string => {
  if (!count || count < 0) {
    return fallback === true ? word + "s" : fallback || "";
  }
  return `${count} ${word}${count === 1 ? "" : "s"}`;
};

/**
 * Format a token value, optionally showing max
 */
export const formatTokenValue = (
  current?: number,
  max?: number
): string | undefined => {
  if (current === undefined) return undefined;

  const showMax = max !== undefined && max !== 0;
  return `${formatNumberWithCommas(current)}${
    showMax ? ` / ${formatNumberWithCommas(max)}` : ""
  }`;
};

interface AbbreviationResult {
  number: number;
  suffix: string;
  wasRounded: boolean;
}

const SUFFIXES = [
  { suffix: "", value: 1 },
  { suffix: "K", value: 1e3 },
  { suffix: "M", value: 1e6 },
  { suffix: "B", value: 1e9 },
  { suffix: "T", value: 1e12 },
] as const;

/**
 * Abbreviate a large number with suffix (K, M, B, T)
 */
function abbreviateNumber(
  value: number,
  options: { decimalPlaces?: number; suffix?: string } = {}
): AbbreviationResult {
  const { decimalPlaces = 0, suffix: forcedSuffix } = options;

  let tier: (typeof SUFFIXES)[number];
  let wasRounded = false;

  if (forcedSuffix) {
    tier = SUFFIXES.find((s) => s.suffix === forcedSuffix) || SUFFIXES[0];
  } else {
    tier = [...SUFFIXES].reverse().find((s) => value >= s.value) || SUFFIXES[0];
  }

  let number = value / tier.value;

  if (decimalPlaces > 0) {
    const multiplier = Math.pow(10, decimalPlaces);
    const floored = Math.floor(number * multiplier) / multiplier;
    wasRounded = floored !== number;
    number = floored;
  } else {
    wasRounded = Math.floor(number) !== value / tier.value;
    number = Math.floor(number);
  }

  return { number, suffix: tier.suffix, wasRounded };
}

/**
 * Format tokens with abbreviated suffix (K, M, B, T)
 */
export const formatTokensWithSuffix = (
  value: number,
  prefix: string = "",
  maxDigits: number = 5,
  decimalPlaces: number = 1
): string => {
  if (value.toString().length <= maxDigits) {
    return `${formatNumberWithCommas(value)}`;
  }

  const { number, suffix, wasRounded } = abbreviateNumber(value, {
    decimalPlaces,
  });

  const formattedNumber = formatNumberWithCommas(number);
  const prefixStr = prefix && wasRounded ? `${prefix} ` : "";

  return `${prefixStr}${formattedNumber}${suffix}`;
};

/**
 * Format a number as a string difference with +/- sign
 */
export const formatNumberAsStringDifference = (
  value: number,
  withParentheses: boolean = true
): string => {
  if (value === 0) return "";

  const sign = value > 0 ? "+" : "";
  const formatted = `${sign}${formatNumberWithCommas(value)}`;

  return withParentheses ? `(${formatted})` : formatted;
};

/**
 * Pluralize a word based on count using Intl.PluralRules
 */
export const pluralize = (
  count: number,
  singular: string,
  plural: string
): string => {
  return new Intl.PluralRules("en-US").select(count) !== "one"
    ? plural
    : singular;
};

// ============================================================================
// Text Formatting/Segmentation
// ============================================================================

type TextFormatType = "normal" | "highlight" | "bold";

interface TextSegment {
  text: string;
  type: TextFormatType;
}

interface MarkerMatch {
  format: "highlight" | "bold";
  type: "start" | "end" | "both";
  index: number;
}

function findMarker(
  text: string,
  startIndex: number,
  format: "highlight" | "bold",
  markerType: "start" | "end" | "both"
): MarkerMatch {
  if (format === "highlight" && markerType === "start") {
    return {
      format: "highlight",
      type: "start",
      index: text.indexOf("[[", startIndex),
    };
  }
  if (format === "highlight" && markerType === "end") {
    return {
      format: "highlight",
      type: "end",
      index: text.indexOf("]]", startIndex),
    };
  }
  return {
    format: "bold",
    type: "both",
    index: text.indexOf("**", startIndex),
  };
}

function findFirstMarker(markers: MarkerMatch[]): MarkerMatch | undefined {
  const validMarkers = markers.filter(({ index }) => index !== -1);
  if (validMarkers.length === 0) return undefined;

  return validMarkers.reduce((first, current) =>
    current.index < first.index ? current : first
  );
}

/**
 * Segment text by format markers ([[highlight]] and **bold**)
 */
export function segmentTextByFormatMarkers(
  text: string,
  formats: Array<"highlight" | "bold"> = ["highlight", "bold"]
): TextSegment[] {
  const segments: TextSegment[] = [];
  let currentIndex = 0;
  let textStartIndex = 0;

  while (currentIndex < text.length) {
    const highlightStart = findMarker(text, currentIndex, "highlight", "start");
    const boldMarker = findMarker(text, currentIndex, "bold", "both");

    // Filter by enabled formats
    if (!formats.includes("highlight")) highlightStart.index = -1;
    if (!formats.includes("bold")) boldMarker.index = -1;

    // No more markers found
    if (highlightStart.index === -1 && boldMarker.index === -1) {
      segments.push({ text: text.slice(textStartIndex), type: "normal" });
      textStartIndex = text.length;
      break;
    }

    const firstMarker = findFirstMarker([highlightStart, boldMarker]);
    if (!firstMarker) {
      segments.push({ text: text.slice(textStartIndex), type: "normal" });
      textStartIndex = text.length;
      break;
    }

    // Find closing marker
    const nextIndex = firstMarker.index + 2;
    const endMarker = findFirstMarker([
      findMarker(text, nextIndex, "highlight", "start"),
      findMarker(text, nextIndex, "bold", "both"),
      findMarker(text, nextIndex, "highlight", "end"),
    ]);

    if (!endMarker) {
      segments.push({ text: text.slice(textStartIndex), type: "normal" });
      textStartIndex = text.length;
      break;
    }

    // Check if markers match and close properly
    if (
      firstMarker.format === endMarker.format &&
      ["end", "both"].includes(endMarker.type)
    ) {
      // Handle empty markers (e.g., "****" or "[[]]")
      if (firstMarker.index + 2 === endMarker.index) {
        text =
          text.slice(0, firstMarker.index) + text.slice(endMarker.index + 2);
        continue;
      }

      // Add normal text before marker
      if (firstMarker.index > currentIndex) {
        segments.push({
          text: text.slice(textStartIndex, firstMarker.index),
          type: "normal",
        });
      }

      // Add formatted text
      segments.push({
        text: text.slice(firstMarker.index + 2, endMarker.index),
        type: firstMarker.format,
      });

      currentIndex = endMarker.index + 2;
      textStartIndex = endMarker.index + 2;
      continue;
    }

    currentIndex = firstMarker.index + 2;
  }

  // Add remaining text
  if (textStartIndex < text.length) {
    segments.push({ text: text.slice(textStartIndex), type: "normal" });
  }

  return segments;
}

export const limitString = (
  str: string | undefined | null,
  limit: number = 50
): string => {
  if (!str) return "";
  return str.length <= limit - 3 ? str : str.substring(0, limit - 3) + "...";
};

export const isNumericString = (str: string): boolean => /^\d+$/.test(str);

export const filterLineBreaksStr = (str: string): string =>
  str.replace(/\r?\n|\r/g, "");
