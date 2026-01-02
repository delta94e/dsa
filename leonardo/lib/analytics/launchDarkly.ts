/**
 * LaunchDarkly Module
 * 
 * Provides access to the LaunchDarkly feature flag client and
 * utilities for managing user context.
 */

import { captureError, ErrorEventName } from './errors';

// ============================================================================
// Types
// ============================================================================

interface LDContext {
    user?: {
        anonymous?: boolean;
        [key: string]: unknown;
    };
    [key: string]: unknown;
}

interface LDClient {
    getContext: () => LDContext;
    identify: (context: LDContext) => Promise<void>;
    track: (eventName: string, data?: Record<string, unknown>) => void;
}

// ============================================================================
// Client Access
// ============================================================================

/**
 * Get the LaunchDarkly client instance
 */
export const getLaunchDarkly = (): LDClient | null => {
    if (typeof window === 'undefined') return null;
    
    const ldClient = window.ldClient;
    
    if (ldClient && typeof ldClient === 'object' && !Array.isArray(ldClient)) {
        return ldClient as LDClient;
    }
    
    return null;
};

/**
 * Set the LaunchDarkly client instance
 * Only sets if not already initialized
 */
export const setLaunchDarkly = (client: LDClient): void => {
    if (typeof window === 'undefined') return;
    
    if (!window.ldClient && client) {
        window.ldClient = client;
    }
};

/**
 * Delete/cleanup the LaunchDarkly client instance
 */
export const deleteLaunchDarkly = (): void => {
    if (typeof window === 'undefined') return;
    
    if (window.ldClient) {
        delete window.ldClient;
    }
};

// ============================================================================
// User Context Management
// ============================================================================

/**
 * Add or update properties in the LaunchDarkly user context
 * @param properties - Properties to add to the user context
 * @param callback - Optional callback to execute after identification
 */
export const addLaunchDarklyProperties = async (
    properties: Record<string, unknown>,
    callback?: () => void
): Promise<void> => {
    try {
        const ldClient = getLaunchDarkly();
        if (!ldClient) return;
        
        const context = ldClient.getContext() ?? {};
        const user = context.user ?? {};
        
        // Don't update anonymous users
        if (!user || user.anonymous) return;
        
        await ldClient.identify({
            ...context,
            user: { ...user, ...properties },
        });
    } catch (error) {
        captureError({
            name: ErrorEventName.LAUNCH_DARKLY_IDENTIFY_ERROR,
            fallbackMessage: 'Failed to identify user with LaunchDarkly',
            error,
        });
    } finally {
        callback?.();
    }
};

/**
 * Track an event in LaunchDarkly
 */
export const trackLaunchDarkly = (
    eventName: string,
    data?: Record<string, unknown>
): void => {
    try {
        const ldClient = getLaunchDarkly();
        if (ldClient) {
            ldClient.track(eventName, data);
        }
    } catch (error) {
        console.error('Error tracking event with LaunchDarkly', error);
    }
};

// ============================================================================
// Type Declarations
// ============================================================================

declare global {
    interface Window {
        ldClient?: LDClient;
    }
}
