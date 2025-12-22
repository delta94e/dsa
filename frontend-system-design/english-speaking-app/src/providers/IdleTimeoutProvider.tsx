'use client';

import { ReactNode } from 'react';
import { useIdleTimeout } from '@/features/auth/hooks/useIdleTimeout';
import { IdleTimeoutModal } from '@/shared';
import { useAuthStore } from '@/stores/authStore';

interface IdleTimeoutProviderProps {
    children: ReactNode;
    idleTime?: number;
    warningTime?: number;
}

const WARNING_TIME = 60 * 1000; // 1 minute

export function IdleTimeoutProvider({
    children,
    idleTime = 5 * 60 * 1000, // 5 minutes default
    warningTime = WARNING_TIME,
}: IdleTimeoutProviderProps) {
    const { isAuthenticated, logout } = useAuthStore();

    const { showWarning, remainingTime, resetTimer } = useIdleTimeout({
        idleTime,
        warningTime,
        onLogout: () => {
            console.log('Auto-logout due to inactivity');
        },
    });

    const handleContinue = () => {
        resetTimer();
    };

    const handleLogout = () => {
        logout();
    };

    return (
        <>
            {children}
            {isAuthenticated && (
                <IdleTimeoutModal
                    opened={showWarning}
                    remainingTime={remainingTime}
                    warningTime={warningTime}
                    onContinue={handleContinue}
                    onLogout={handleLogout}
                />
            )}
        </>
    );
}
