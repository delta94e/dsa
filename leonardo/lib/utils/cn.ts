/**
 * CN Utility
 *
 * Combines clsx and tailwind-merge for conditional class name merging.
 * Matches production bundle module 975157.
 */
import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

/**
 * Custom tailwind-merge configuration to handle custom utility classes
 * like border-gradient-* that aren't part of the default Tailwind classes.
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      // Custom border gradient classes (e.g., border-gradient-primary)
      'border-color': [{ 'border-gradient': ['primary', 'secondary'] }],
    },
  },
});

/**
 * Merge class names with Tailwind CSS conflict resolution
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
