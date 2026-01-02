/**
 * Platform Constants
 * 
 * Identifies the platform/device type for analytics tracking.
 */

export const Platform = {
    ANDROID: 'Android',
    API: 'API',
    IOS: 'iOS',
    WEB: 'Web',
} as const;

export type PlatformType = (typeof Platform)[keyof typeof Platform];

/** Current platform - set to WEB for web application */
export const CURRENT_PLATFORM: PlatformType = Platform.WEB;
