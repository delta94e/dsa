/**
 * Avatar Utilities
 * 
 * Helper functions for avatar components.
 * Matches production bundle modules.
 */

// ============================================================================
// Avatar Color Calculation
// ============================================================================

/**
 * Color palette for avatar backgrounds
 * Matches production bundle (18 colors)
 */
const AVATAR_COLORS = [
  '#52BB5C', // Green
  '#9593FF', // Purple
  '#DC72A0', // Pink
  '#81AEFF', // Light Blue
  '#25B56E', // Emerald
  '#3DD185', // Mint
  '#56C5F8', // Sky Blue
  '#EB817A', // Coral
  '#E8D52E', // Yellow
  '#81E6AD', // Light Green (default)
  '#40D7C8', // Teal
  '#EB7133', // Orange
  '#71D778', // Lime
  '#EBA03F', // Amber
  '#4AE0C9', // Cyan
  '#4DBEE6', // Azure
  '#6599FF', // Blue
  '#E8A722', // Gold
] as const;

/** Default color index (light green) */
const DEFAULT_COLOR_INDEX = 9;

/**
 * Calculate a consistent avatar background color from an ID
 * Matches production bundle algorithm:
 * - For UUID-like IDs: removes dashes, sums char values in base36
 * - For numeric IDs: uses sum of first 2 digits
 */
export function calculateAvatarColorFromId(id?: string | null): string {
  if (!id) return AVATAR_COLORS[DEFAULT_COLOR_INDEX];

  let colorIndex: number;

  if (isNaN(parseInt(id))) {
    // Non-numeric ID (UUID-like): remove dashes and sum base36 char values
    let sum = 0;
    const cleaned = id.replace(/-/g, '');
    for (let i = 0; i < cleaned.length; i++) {
      const charValue = parseInt(cleaned.charAt(i), 36);
      if (!isNaN(charValue)) {
        sum += charValue;
      }
    }
    colorIndex = sum % AVATAR_COLORS.length;
  } else {
    // Numeric ID: use sum of first 2 digits
    const num = parseInt(id);
    const numStr = num.toString().length === 1
      ? '0' + num.toString()
      : num.toString().slice(0, 2);
    colorIndex = parseInt(numStr.charAt(0)) + parseInt(numStr.charAt(1));
  }

  // Validate index and return color
  if (!Number.isInteger(colorIndex) || colorIndex < 0 || colorIndex >= AVATAR_COLORS.length) {
    return AVATAR_COLORS[DEFAULT_COLOR_INDEX];
  }

  return AVATAR_COLORS[colorIndex];
}

// ============================================================================
// String Utilities
// ============================================================================

/**
 * Remove all spaces from a string
 */
// export function removeSpaces(str: string): string {
//   return str.replace(/\s+/g, '');
// }

/**
 * Get initials from a name (first letter of each word, max 2)
 */
export function getInitials(name: string): string {
  if (!name) return '';
  
  const words = name.trim().split(/\s+/);
  const initials = words
    .slice(0, 2)
    .map(word => word.charAt(0).toUpperCase())
    .join('');
  
  return initials;
}
