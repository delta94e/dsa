/**
 * Theme Service - Manages application theming
 * @module services/theme
 */

import { THEMES, EVENT_BANNERS, getSeasonalTheme } from '../constants/themes.js';
import type { ThemeId, ThemeConfig, EventBanner } from '../types/index.js';

const THEME_STORAGE_KEY = 'leetcode-theme';

/**
 * Theme Service singleton
 */
export const ThemeService = {
    /**
     * Get all available themes
     */
    getAllThemes(): Record<ThemeId, ThemeConfig> {
        return THEMES;
    },

    /**
     * Get theme configuration by ID
     */
    getTheme(id: ThemeId): ThemeConfig {
        return THEMES[id];
    },

    /**
     * Get event banner for theme
     */
    getEventBanner(id: ThemeId): EventBanner | null {
        return EVENT_BANNERS[id];
    },

    /**
     * Get current theme from storage or seasonal default
     */
    getCurrentTheme(): ThemeId {
        if (typeof localStorage !== 'undefined') {
            const stored = localStorage.getItem(THEME_STORAGE_KEY);
            if (stored && stored in THEMES) {
                return stored as ThemeId;
            }
        }
        return getSeasonalTheme();
    },

    /**
     * Save theme preference
     */
    saveTheme(id: ThemeId): void {
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem(THEME_STORAGE_KEY, id);
        }
    },

    /**
     * Convert hex color to RGB string
     */
    hexToRgb(hex: string): string {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        if (!result) return '255, 161, 22';
        return `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`;
    },

    /**
     * Generate CSS variables for theme
     */
    getCssVariables(id: ThemeId): Record<string, string> {
        const theme = THEMES[id];
        return {
            '--primary': theme.primary,
            '--secondary': theme.secondary,
            '--accent': theme.accent,
            '--bg-gradient': theme.bgGradient,
            '--primary-rgb': this.hexToRgb(theme.primary),
            '--secondary-rgb': this.hexToRgb(theme.secondary),
        };
    },
};
