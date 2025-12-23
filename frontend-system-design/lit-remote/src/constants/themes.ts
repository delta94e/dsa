/**
 * Theme configuration constants
 * @module constants/themes
 */

import type { ThemeId, ThemeConfig, EventBanner } from '../types/index.js';

/** Theme configurations for all available themes */
export const THEMES: Record<ThemeId, ThemeConfig> = {
    default: {
        name: 'Default',
        icon: '⚡',
        primary: '#ffa116',
        secondary: '#ff8c00',
        accent: '#667eea',
        bgGradient: `
      radial-gradient(ellipse 80% 50% at 50% -20%, rgba(120, 119, 198, 0.15), transparent),
      radial-gradient(ellipse 60% 40% at 100% 0%, rgba(255, 161, 22, 0.08), transparent)
    `,
    },
    christmas: {
        name: '🎄 Christmas',
        icon: '🎄',
        primary: '#e74c3c',
        secondary: '#27ae60',
        accent: '#f39c12',
        bgGradient: `
      radial-gradient(ellipse 80% 50% at 50% -20%, rgba(231, 76, 60, 0.2), transparent),
      radial-gradient(ellipse 60% 40% at 100% 0%, rgba(39, 174, 96, 0.15), transparent),
      radial-gradient(ellipse 40% 30% at 20% 80%, rgba(243, 156, 18, 0.1), transparent)
    `,
        effects: { snowfall: true },
    },
    lunar: {
        name: '🧧 Lunar New Year',
        icon: '🧧',
        primary: '#e74c3c',
        secondary: '#f1c40f',
        accent: '#c0392b',
        bgGradient: `
      radial-gradient(ellipse 80% 50% at 50% -20%, rgba(231, 76, 60, 0.2), transparent),
      radial-gradient(ellipse 60% 40% at 0% 100%, rgba(241, 196, 15, 0.15), transparent)
    `,
    },
    halloween: {
        name: '🎃 Halloween',
        icon: '🎃',
        primary: '#f39c12',
        secondary: '#8e44ad',
        accent: '#e67e22',
        bgGradient: `
      radial-gradient(ellipse 80% 50% at 50% -20%, rgba(142, 68, 173, 0.2), transparent),
      radial-gradient(ellipse 60% 40% at 100% 100%, rgba(243, 156, 18, 0.15), transparent)
    `,
    },
    valentine: {
        name: '💕 Valentine',
        icon: '💕',
        primary: '#e91e63',
        secondary: '#ff4081',
        accent: '#f06292',
        bgGradient: `
      radial-gradient(ellipse 80% 50% at 50% -20%, rgba(233, 30, 99, 0.2), transparent),
      radial-gradient(ellipse 60% 40% at 0% 100%, rgba(240, 98, 146, 0.15), transparent)
    `,
        effects: { hearts: true },
    },
};

/** Event banner messages for each theme */
export const EVENT_BANNERS: Record<ThemeId, EventBanner | null> = {
    default: null,
    christmas: {
        title: '🎅 Merry Christmas!',
        description: 'Solve problems and earn holiday rewards!',
    },
    lunar: {
        title: '🧧 Happy Lunar New Year!',
        description: 'Chúc Mừng Năm Mới! Solve problems for lucky red envelopes!',
    },
    halloween: {
        title: '👻 Spooky Season!',
        description: 'Trick or Code! Complete challenges for candy rewards!',
    },
    valentine: {
        title: '💘 Happy Valentine\'s Day!',
        description: 'Code with love! Share solutions with friends!',
    },
};

/** Get current seasonal theme based on date */
export function getSeasonalTheme(): ThemeId {
    const month = new Date().getMonth() + 1;
    const day = new Date().getDate();

    if (month === 12 || (month === 1 && day <= 5)) return 'christmas';
    if (month === 1 || (month === 2 && day <= 15)) return 'lunar';
    if (month === 2 && day >= 10 && day <= 14) return 'valentine';
    if (month === 10 && day >= 20) return 'halloween';

    return 'default';
}
