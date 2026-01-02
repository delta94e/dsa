'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { useFeatureFlagStore } from '@/stores/featureFlagStore';
import { useFeatureFlagStream } from '@/shared/hooks/useFeatureFlagStream';

interface AuthProviderProps {
    children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const pathname = usePathname();
    const { checkAuth, isAuthenticated } = useAuthStore();
    const { fetchUserFlags } = useFeatureFlagStore();

    // Skip API calls on login page
    const isLoginPage = pathname === '/login' || pathname?.startsWith('/login');

    // Connect to SSE stream for real-time flag updates when authenticated
    useFeatureFlagStream({
        enabled: isAuthenticated && !isLoginPage,
        onFlagChange: (flagId, enabled) => {
            console.log(`[AuthProvider] Feature flag changed: ${flagId} = ${enabled}`);
        },
    });

    useEffect(() => {
        // Skip all API calls on login page
        if (isLoginPage) {
            return;
        }

        // Check auth status on app load
        checkAuth();
    }, [checkAuth, isLoginPage]);

    useEffect(() => {
        // Skip feature flag calls on login page or when not authenticated
        if (isLoginPage || !isAuthenticated) {
            return;
        }

        // Fetch feature flags once for authenticated user
        // Real-time updates come via SSE stream
        fetchUserFlags();
    }, [isLoginPage, isAuthenticated, fetchUserFlags]);

    return <>{children}</>;
}

