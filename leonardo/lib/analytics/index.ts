/**
 * Analytics Module
 * 
 * Unified analytics interface that combines:
 * - Heap Analytics (user tracking)
 * - Google Tag Manager (dataLayer events)
 * - LaunchDarkly (feature flags & experiments)
 * 
 * @example
 * import { track, identify, addUserProperties } from '@/lib/analytics';
 * 
 * // Track an event
 * track('button_clicked', { buttonName: 'submit' });
 * 
 * // Identify a user
 * await identify('user-123', 'user@example.com');
 */

import * as heap from './heap';
import * as gtm from './gtm';
import * as launchDarkly from './launchDarkly';
import { sha1Hash } from './utils';

// ============================================================================
// Re-exports
// ============================================================================

export { Platform, CURRENT_PLATFORM, type PlatformType } from './platform';
export { ErrorEventName, captureError, type CaptureErrorOptions } from './errors';
export { sha1Hash } from './utils';
export * from './events';
export * from './trackingIds';

// Re-export individual modules for direct access
export { heap, gtm, launchDarkly };

// ============================================================================
// Unified Analytics API
// ============================================================================

/**
 * Track an event across all analytics providers
 */
export const track = (eventName: string, properties?: Record<string, unknown>): void => {
    // Track in Heap
    heap.track(eventName, properties);
    
    // Push to GTM dataLayer
    gtm.pushCustomEvent(eventName, properties);
    
    // Track in LaunchDarkly
    launchDarkly.trackLaunchDarkly(eventName, properties);
};

/**
 * Identify a user across all analytics providers
 * @param userId - The user's unique identifier
 * @param email - Optional email for GTM (will be SHA-1 hashed)
 */
export const identify = async (userId: string, email?: string): Promise<void> => {
    // Identify in Heap
    heap.identify(userId);
    
    // Identify in GTM with hashed email
    const hashedEmail = email ? await sha1Hash(email) : null;
    gtm.identify(userId, hashedEmail);
};

/**
 * Add user properties across analytics providers
 */
export const addUserProperties = (properties: Record<string, unknown>): void => {
    heap.addUserProperties(properties);
};

/**
 * Add LaunchDarkly-specific properties
 */
export const addLaunchDarklyProperties = async (
    properties: Record<string, unknown>,
    callback?: () => void
): Promise<void> => {
    await launchDarkly.addLaunchDarklyProperties(properties, callback);
};

/**
 * Add event properties (super properties) to all future events
 */
export const addEventProperties = (properties: Record<string, unknown>): void => {
    heap.addEventProperties(properties);
};

/**
 * Remove an event property
 */
export const removeEventProperty = (propertyName: string): void => {
    heap.removeEventProperty(propertyName);
};

/**
 * Clear all event properties
 */
export const clearEventProperties = (): void => {
    heap.clearEventProperties();
};

/**
 * Reset user identity (for logout)
 */
export const resetIdentity = (): void => {
    heap.resetIdentity();
};

/**
 * Clear ecommerce data in GTM before pushing new data
 */
export const clearEcommerceObject = (): void => {
    gtm.clearEcommerceObject();
};
