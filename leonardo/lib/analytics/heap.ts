/**
 * Heap Analytics Module
 * 
 * Provides a robust interface to Heap Analytics with queuing support
 * for events fired before Heap is fully loaded.
 */

// ============================================================================
// Types
// ============================================================================

type HeapMethod =
    | 'track'
    | 'identify'
    | 'addUserProperties'
    | 'addEventProperties'
    | 'removeEventProperty'
    | 'clearEventProperties'
    | 'resetIdentity';

interface QueuedOperation {
    type: HeapMethod;
    args: unknown[];
}

interface HeapClient {
    loaded?: boolean;
    track: (eventName: string, properties?: Record<string, unknown>) => void;
    identify: (userId: string) => void;
    addUserProperties: (properties: Record<string, unknown>) => void;
    addEventProperties: (properties: Record<string, unknown>) => void;
    removeEventProperty: (propertyName: string) => void;
    clearEventProperties: () => void;
    resetIdentity: () => void;
}

// ============================================================================
// Queue Configuration
// ============================================================================

const HEAP_METHODS: HeapMethod[] = [
    'track',
    'identify',
    'addUserProperties',
    'addEventProperties',
    'removeEventProperty',
    'clearEventProperties',
    'resetIdentity',
];

const MAX_QUEUE_SIZE = 100;
const INIT_CHECK_INTERVAL_MS = 1000;
const MAX_INIT_ATTEMPTS = 10;

let eventQueue: QueuedOperation[] = [];
const watcherState = { isWatching: false };
let initAttempts = 0;

// ============================================================================
// Proxy Queue
// ============================================================================

/**
 * Proxy queue that captures operations before Heap is loaded
 */
let heapProxy: Record<HeapMethod, (...args: unknown[]) => void> | null = new Proxy(
    {} as Record<HeapMethod, (...args: unknown[]) => void>,
    {
        get: (target, prop: string) => {
            if (prop === 'loaded') return undefined;
            
            if (HEAP_METHODS.includes(prop as HeapMethod)) {
                return (...args: unknown[]) => {
                    if (eventQueue.length >= MAX_QUEUE_SIZE) {
                        console.warn(
                            'Heap queue has reached limit of 100 events. Disabling queue to prevent memory leak.'
                        );
                        heapProxy = null;
                        return;
                    }
                    eventQueue.push({ type: prop as HeapMethod, args });
                };
            }
            
            return (target as Record<string, unknown>)[prop];
        },
    }
);

// ============================================================================
// Heap Client Access
// ============================================================================

/**
 * Get the Heap client instance, with queue processing and initialization watching
 */
const getHeapClient = (): HeapClient | typeof heapProxy | null => {
    if (typeof window === 'undefined') return null;
    
    const heap = window.heap;
    
    // Check if heap is loaded and ready
    if (heap && typeof heap === 'object') {
        if (Array.isArray(heap)) return null;
        if ((heap as HeapClient).loaded) return heap as HeapClient;
    }
    
    // Start watching for Heap initialization
    if (!watcherState.isWatching) {
        const intervalId = setInterval(() => {
            initAttempts++;
            const heapInstance = window.heap as HeapClient | undefined;
            
            if (heapInstance?.loaded) {
                // Process queued events
                eventQueue.forEach((operation) => {
                    try {
                        const method = heapInstance[operation.type] as ((...args: unknown[]) => void) | undefined;
                        if (method) {
                            method.apply(heapInstance, operation.args);
                        }
                    } catch (error) {
                        console.error('Error executing queued Heap operation', error);
                    }
                });
                
                // Clear queue and stop watching
                eventQueue = [];
                watcherState.isWatching = false;
                clearInterval(intervalId);
            } else if (initAttempts >= MAX_INIT_ATTEMPTS) {
                clearInterval(intervalId);
                console.warn(
                    `Failed to initialize Heap after ${MAX_INIT_ATTEMPTS * INIT_CHECK_INTERVAL_MS}ms. Some tracking events might be missing.`,
                    (window.heap as HeapClient | undefined)?.loaded
                );
            }
        }, INIT_CHECK_INTERVAL_MS);
        
        watcherState.isWatching = true;
    }
    
    return heapProxy;
};

// ============================================================================
// Public API
// ============================================================================

/**
 * Track an event in Heap
 */
export const track = (eventName: string, properties?: Record<string, unknown>): void => {
    try {
        getHeapClient()?.track(eventName, properties);
    } catch (error) {
        console.error('Error tracking event with Heap', error);
    }
};

/**
 * Identify a user in Heap
 */
export const identify = (userId: string): void => {
    try {
        getHeapClient()?.identify(userId);
    } catch (error) {
        console.error('Error identifying user with Heap', error);
    }
};

/**
 * Add properties to the current user
 */
export const addUserProperties = (properties: Record<string, unknown>): void => {
    try {
        getHeapClient()?.addUserProperties(properties);
    } catch (error) {
        console.error('Error adding user properties with Heap', error);
    }
};

/**
 * Add properties to all future events (super properties)
 */
export const addEventProperties = (properties: Record<string, unknown>): void => {
    try {
        getHeapClient()?.addEventProperties(properties);
    } catch (error) {
        console.error('Error adding event properties with Heap', error);
    }
};

/**
 * Remove a specific event property
 */
export const removeEventProperty = (propertyName: string): void => {
    try {
        getHeapClient()?.removeEventProperty(propertyName);
    } catch (error) {
        console.error('Error removing event property with Heap', error);
    }
};

/**
 * Clear all event properties
 */
export const clearEventProperties = (): void => {
    try {
        getHeapClient()?.clearEventProperties();
    } catch (error) {
        console.error('Error clearing event properties with Heap', error);
    }
};

/**
 * Reset the user identity (for logout scenarios)
 */
export const resetIdentity = (): void => {
    try {
        getHeapClient()?.resetIdentity();
    } catch (error) {
        console.error('Error resetting identity with Heap', error);
    }
};

// ============================================================================
// Type Declarations
// ============================================================================

declare global {
    interface Window {
        heap?: HeapClient | unknown[];
    }
}
