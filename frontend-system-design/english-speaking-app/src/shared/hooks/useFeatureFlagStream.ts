'use client';

// ═══════════════════════════════════════════════════════════════
// Feature Flag Stream Hook
// Real-time feature flag updates via Server-Sent Events
// ═══════════════════════════════════════════════════════════════

import { useEffect, useRef, useCallback } from 'react';
import { useFeatureFlagStore } from '@/stores/featureFlagStore';

interface FeatureFlagEvent {
    type: 'CONNECTED' | 'FLAG_CHANGED' | 'HEARTBEAT';
    flagId?: string;
    enabled?: boolean;
    timestamp: number;
}

interface UseFeatureFlagStreamOptions {
    enabled?: boolean;
    onFlagChange?: (flagId: string, enabled: boolean) => void;
}

export function useFeatureFlagStream(options: UseFeatureFlagStreamOptions = {}) {
    const { enabled = true, onFlagChange } = options;
    const { fetchUserFlags } = useFeatureFlagStore();
    const eventSourceRef = useRef<EventSource | null>(null);
    const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const connect = useCallback(() => {
        if (eventSourceRef.current) {
            return; // Already connected
        }

        console.log('[SSE] Connecting to feature flag stream...');

        const eventSource = new EventSource('/api/feature-flags/stream');
        eventSourceRef.current = eventSource;

        eventSource.onopen = () => {
            console.log('[SSE] Connected to feature flag stream');
        };

        eventSource.onmessage = (event) => {
            try {
                const data: FeatureFlagEvent = JSON.parse(event.data);

                switch (data.type) {
                    case 'CONNECTED':
                        console.log('[SSE] Stream connected');
                        break;

                    case 'FLAG_CHANGED':
                        console.log('[SSE] Flag changed:', data.flagId, data.enabled);
                        // Refresh flags immediately when a change is detected
                        fetchUserFlags();
                        // Call optional callback
                        if (onFlagChange && data.flagId !== undefined && data.enabled !== undefined) {
                            onFlagChange(data.flagId, data.enabled);
                        }
                        break;

                    case 'HEARTBEAT':
                        // Keep-alive, no action needed
                        break;
                }
            } catch (e) {
                console.error('[SSE] Failed to parse event:', e);
            }
        };

        eventSource.onerror = (error) => {
            console.error('[SSE] Connection error:', error);
            eventSource.close();
            eventSourceRef.current = null;

            // Reconnect after 5 seconds
            reconnectTimeoutRef.current = setTimeout(() => {
                if (enabled) {
                    console.log('[SSE] Reconnecting...');
                    connect();
                }
            }, 5000);
        };
    }, [enabled, fetchUserFlags, onFlagChange]);

    const disconnect = useCallback(() => {
        if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
            reconnectTimeoutRef.current = null;
        }

        if (eventSourceRef.current) {
            eventSourceRef.current.close();
            eventSourceRef.current = null;
            console.log('[SSE] Disconnected from feature flag stream');
        }
    }, []);

    useEffect(() => {
        if (enabled) {
            connect();
        } else {
            disconnect();
        }

        return () => {
            disconnect();
        };
    }, [enabled, connect, disconnect]);

    return {
        connect,
        disconnect,
        isConnected: !!eventSourceRef.current,
    };
}
