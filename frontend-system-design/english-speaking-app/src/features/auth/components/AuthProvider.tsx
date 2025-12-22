'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { useFeatureFlagStore } from '@/stores/featureFlagStore';

interface AuthProviderProps {
    children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const pathname = usePathname();
    const { checkAuth, isAuthenticated } = useAuthStore();
    const { fetchUserFlags, startPolling, stopPolling } = useFeatureFlagStore();

    // Skip API calls on login page
    const isLoginPage = pathname === '/login' || pathname?.startsWith('/login');

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
            stopPolling();
            return;
        }

        // Fetch feature flags for authenticated user
        fetchUserFlags();
        // Start real-time flag sync (uses default 30 second interval)
        startPolling();

        // Cleanup on unmount
        return () => {
            stopPolling();
        };
    }, [isLoginPage, isAuthenticated, fetchUserFlags, startPolling, stopPolling]);

    return <>{children}</>;
}

