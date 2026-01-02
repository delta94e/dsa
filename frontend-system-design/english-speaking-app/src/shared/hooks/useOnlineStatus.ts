'use client';

// ═══════════════════════════════════════════════════════════════
// Online Status Hook
// Detects online/offline network status
// ═══════════════════════════════════════════════════════════════

import { useState, useEffect, useCallback } from 'react';
import { processSyncQueue } from '@/lib/offlineService';

interface UseOnlineStatusReturn {
    isOnline: boolean;
    wasOffline: boolean;
    lastOnlineAt: Date | null;
}

export function useOnlineStatus(): UseOnlineStatusReturn {
    const [isOnline, setIsOnline] = useState(true);
    const [wasOffline, setWasOffline] = useState(false);
    const [lastOnlineAt, setLastOnlineAt] = useState<Date | null>(null);

    // Handle coming back online
    const handleOnline = useCallback(() => {
        console.log('[Network] Back online');
        setIsOnline(true);
        setWasOffline(true);
        setLastOnlineAt(new Date());

        // Process sync queue when back online
        processSyncQueue().catch(console.error);

        // Reset wasOffline after a short delay
        setTimeout(() => setWasOffline(false), 5000);
    }, []);

    // Handle going offline
    const handleOffline = useCallback(() => {
        console.log('[Network] Went offline');
        setIsOnline(false);
    }, []);

    useEffect(() => {
        // Check initial state
        if (typeof navigator !== 'undefined') {
            setIsOnline(navigator.onLine);
        }

        // Add event listeners
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, [handleOnline, handleOffline]);

    return {
        isOnline,
        wasOffline,
        lastOnlineAt,
    };
}
