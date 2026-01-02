/**
 * Google Tag Manager (GTM) / DataLayer Module
 * 
 * Handles pushing events to the GTM dataLayer for analytics and marketing tracking.
 */

// ============================================================================
// Types
// ============================================================================

export interface DataLayerEvent {
    event: string;
    [key: string]: unknown;
}

export interface EcommerceProperties {
    ecommerce: Record<string, unknown> | null;
    [key: string]: unknown;
}

// ============================================================================
// DataLayer Access
// ============================================================================

/**
 * Get or initialize the GTM dataLayer
 */
const getDataLayer = (): DataLayerEvent[] => {
    if (typeof window === 'undefined') return [];
    window.dataLayer = window.dataLayer || [];
    return window.dataLayer as DataLayerEvent[];
};

// ============================================================================
// GTM Functions
// ============================================================================

/**
 * Identify a user in GTM dataLayer
 * @param userId - The user's unique identifier
 * @param userEmailSha1 - SHA1 hash of the user's email (for privacy)
 */
export const identify = (userId: string, userEmailSha1: string | null): void => {
    const dataLayer = getDataLayer();
    dataLayer?.push({
        event: 'user_initialized',
        user_id: userId,
        user_email_sha1: userEmailSha1,
    });
};

/**
 * Push a custom event to the GTM dataLayer
 * @param eventName - Name of the event
 * @param properties - Event properties
 */
export const pushCustomEvent = (
    eventName: string,
    properties?: Record<string, unknown>
): void => {
    const dataLayer = getDataLayer();
    dataLayer?.push({
        event: eventName,
        properties,
    });
};

/**
 * Clear the ecommerce object in dataLayer
 * Should be called before pushing new ecommerce data to prevent data leakage
 */
export const clearEcommerceObject = (): void => {
    const dataLayer = getDataLayer();
    dataLayer?.push({
        event: 'ecommerce_clear',
        ecommerce: null,
    });
};

// ============================================================================
// Type Declarations
// ============================================================================

declare global {
    interface Window {
        dataLayer?: DataLayerEvent[];
    }
}
