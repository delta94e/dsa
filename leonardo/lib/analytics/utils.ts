/**
 * Analytics Utilities
 * 
 * Helper functions for analytics operations.
 */

import { SUBSCRIPTION_DURATION, type SubscriptionDuration } from '@/constants/plans';

/**
 * Generate SHA-1 hash of a string (for email hashing)
 * Uses Web Crypto API for secure hashing
 */
export const sha1Hash = async (input: string): Promise<string> => {
    const encoder = new TextEncoder();
    const data = encoder.encode(input);
    const hashBuffer = await crypto.subtle.digest('SHA-1', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((byte) => byte.toString(16).padStart(2, '0')).join('');
};

/**
 * Format subscription billing cost for analytics (converts cents to dollars).
 */
export function formatSubscriptionBillingCost(cost: number): string {
    return (cost / 100).toFixed(2);
}

/**
 * Create an ecommerce tracking item for analytics.
 */
export function createEcommerceTrackingItem(
    itemName: string,
    category: string,
    price: number,
    duration: SubscriptionDuration,
    quantity: number = 1
) {
    return {
        item_name: itemName,
        item_category: category,
        price: price / 100,
        quantity,
        item_variant: duration === SUBSCRIPTION_DURATION.MONTHLY ? 'monthly' : 'yearly',
    };
}

/**
 * Clear the ecommerce object from dataLayer for GA4.
 */
export function clearEcommerceObject(): void {
    if (typeof window !== 'undefined' && 'dataLayer' in window) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).dataLayer?.push({ ecommerce: null });
    }
}

/**
 * Get UTM parameters from session storage.
 */
export function getUtmParamsFromSession(): Record<string, string> {
    if (typeof window === 'undefined') return {};

    try {
        const utmParams: Record<string, string> = {};
        const keys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];

        keys.forEach((key) => {
            const value = sessionStorage.getItem(key);
            if (value) {
                utmParams[key] = value;
            }
        });

        return utmParams;
    } catch {
        return {};
    }
}

