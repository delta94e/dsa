'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useAuthStore } from '@/stores/authStore';

interface UseIdleTimeoutOptions {
    idleTime?: number;      // Time before showing warning (ms)
    warningTime?: number;   // Time to respond before auto-logout (ms)
    onIdle?: () => void;    // Called when idle warning appears
    onLogout?: () => void;  // Called when auto-logout happens
}

interface UseIdleTimeoutReturn {
    isIdle: boolean;
    showWarning: boolean;
    remainingTime: number;
    resetTimer: () => void;
}

export function useIdleTimeout({
    idleTime = 5 * 60 * 1000,     // 5 minutes
    warningTime = 60 * 1000,      // 1 minute
    onIdle,
    onLogout,
}: UseIdleTimeoutOptions = {}): UseIdleTimeoutReturn {
    const [isIdle, setIsIdle] = useState(false);
    const [showWarning, setShowWarning] = useState(false);
    const [remainingTime, setRemainingTime] = useState(warningTime);

    const idleTimerRef = useRef<NodeJS.Timeout | null>(null);
    const warningTimerRef = useRef<NodeJS.Timeout | null>(null);
    const countdownRef = useRef<NodeJS.Timeout | null>(null);

    const { isAuthenticated, logout } = useAuthStore();

    // Clear all timers
    const clearAllTimers = useCallback(() => {
        if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
        if (warningTimerRef.current) clearTimeout(warningTimerRef.current);
        if (countdownRef.current) clearInterval(countdownRef.current);
    }, []);

    // Handle auto-logout
    const handleLogout = useCallback(() => {
        clearAllTimers();
        setIsIdle(false);
        setShowWarning(false);
        onLogout?.();
        logout();
    }, [clearAllTimers, logout, onLogout]);

    // Start warning countdown
    const startWarningCountdown = useCallback(() => {
        setShowWarning(true);
        setRemainingTime(warningTime);
        onIdle?.();

        // Start countdown
        countdownRef.current = setInterval(() => {
            setRemainingTime((prev) => {
                const newTime = prev - 1000;
                if (newTime <= 0) {
                    handleLogout();
                    return 0;
                }
                return newTime;
            });
        }, 1000);

        // Set warning timeout
        warningTimerRef.current = setTimeout(() => {
            handleLogout();
        }, warningTime);
    }, [warningTime, onIdle, handleLogout]);

    // Reset timer on activity
    const resetTimer = useCallback(() => {
        clearAllTimers();
        setIsIdle(false);
        setShowWarning(false);
        setRemainingTime(warningTime);

        // Only start timer if authenticated
        if (isAuthenticated) {
            idleTimerRef.current = setTimeout(() => {
                setIsIdle(true);
                startWarningCountdown();
            }, idleTime);
        }
    }, [clearAllTimers, idleTime, warningTime, isAuthenticated, startWarningCountdown]);

    // Set up activity listeners
    useEffect(() => {
        if (!isAuthenticated) {
            clearAllTimers();
            return;
        }

        const events = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart', 'click'];

        const handleActivity = () => {
            if (!showWarning) {
                resetTimer();
            }
        };

        // Add event listeners
        events.forEach((event) => {
            document.addEventListener(event, handleActivity, { passive: true });
        });

        // Start initial timer
        resetTimer();

        return () => {
            events.forEach((event) => {
                document.removeEventListener(event, handleActivity);
            });
            clearAllTimers();
        };
    }, [isAuthenticated, clearAllTimers, resetTimer, showWarning]);

    return {
        isIdle,
        showWarning,
        remainingTime,
        resetTimer,
    };
}
