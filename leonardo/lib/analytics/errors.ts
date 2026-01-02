/**
 * Error Tracking Module
 * 
 * Centralized error capture and reporting.
 */

// ============================================================================
// Error Event Names
// ============================================================================

export const ErrorEventName = {
    LAUNCH_DARKLY_IDENTIFY_ERROR: 'launch_darkly_identify_error',
    ANALYTICS_TRACKING_ERROR: 'analytics_tracking_error',
    HEAP_INIT_ERROR: 'heap_init_error',
    GTM_PUSH_ERROR: 'gtm_push_error',
} as const;

export type ErrorEventNameType = (typeof ErrorEventName)[keyof typeof ErrorEventName];

// ============================================================================
// Types
// ============================================================================

export interface CaptureErrorOptions {
    name: ErrorEventNameType | string;
    error: unknown;
    fallbackMessage: string;
    extras?: Record<string, unknown>;
}

// ============================================================================
// Error Capture
// ============================================================================

/**
 * Capture and report an error
 * In production, this would send to Sentry, Bugsnag, etc.
 */
export const captureError = (options: CaptureErrorOptions): void => {
    const { name, error, fallbackMessage, extras } = options;
    
    // In development, log to console
    if (process.env.NODE_ENV === 'development') {
        console.error(`[Error] ${name}:`, fallbackMessage, error, extras);
        return;
    }
    
    // In production, send to error tracking service
    // Example: Sentry.captureException(error, { tags: { name }, extra: extras });
    console.error(`[Error] ${name}:`, fallbackMessage, error, extras);
};
