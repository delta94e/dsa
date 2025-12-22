'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Center, Loader, Text, Stack } from '@mantine/core';
import { useAuthStore } from '@/stores/authStore';

interface PrivateRouteProps {
    children: React.ReactNode;
    fallbackUrl?: string;
}

export function PrivateRoute({ children, fallbackUrl = '/login' }: PrivateRouteProps) {
    const router = useRouter();
    const { isAuthenticated, isLoading, checkAuth } = useAuthStore();

    useEffect(() => {
        // Check auth on mount
        checkAuth();
    }, [checkAuth]);

    useEffect(() => {
        // Redirect to login if not authenticated (after loading completes)
        if (!isLoading && !isAuthenticated) {
            router.push(fallbackUrl);
        }
    }, [isAuthenticated, isLoading, router, fallbackUrl]);

    // Show loading while checking auth
    if (isLoading) {
        return (
            <Center style={{ minHeight: '100vh' }}>
                <Stack align="center" gap="md">
                    <Loader size="lg" color="violet" />
                    <Text c="dimmed">Checking authentication...</Text>
                </Stack>
            </Center>
        );
    }

    // Don't render children if not authenticated
    if (!isAuthenticated) {
        return (
            <Center style={{ minHeight: '100vh' }}>
                <Stack align="center" gap="md">
                    <Loader size="lg" color="violet" />
                    <Text c="dimmed">Redirecting to login...</Text>
                </Stack>
            </Center>
        );
    }

    // Render protected content
    return <>{children}</>;
}
