/**
 * Theme-related type definitions
 * @module types/theme
 */

/** Available theme identifiers */
export type ThemeId = 'default' | 'christmas' | 'lunar' | 'halloween' | 'valentine';

/** Theme configuration */
export interface ThemeConfig {
    /** Display name */
    name: string;
    /** Icon/emoji for theme */
    icon: string;
    /** Primary brand color (hex) */
    primary: string;
    /** Secondary accent color (hex) */
    secondary: string;
    /** Tertiary accent color (hex) */
    accent: string;
    /** CSS gradient for background */
    bgGradient: string;
    /** Special effects */
    effects?: {
        snowfall?: boolean;
        confetti?: boolean;
        hearts?: boolean;
    };
}

/** Event banner message */
export interface EventBanner {
    title: string;
    description: string;
}

/** Application view state */
export type ViewState = 'list' | 'detail';
