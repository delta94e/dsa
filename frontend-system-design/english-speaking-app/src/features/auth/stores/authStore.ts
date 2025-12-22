'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface AuthUser {
    id: string;
    name: string;
    email: string;
    avatarUrl: string;
    nativeLanguage: string;
    learningLevel: string;
    country: string;
    countryFlag: string;
}

interface AuthStore {
    user: AuthUser | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    tokenExpiresAt: number | null;

    setUser: (user: AuthUser | null) => void;
    setToken: (token: string | null) => void;
    login: () => void;
    logout: () => void;
    checkAuth: () => Promise<void>;
    refreshToken: () => Promise<boolean>;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';
const TOKEN_REFRESH_MARGIN = 2 * 60 * 1000; // Refresh 2 minutes before expiry

export const useAuthStore = create<AuthStore>()(
    persist(
        (set, get) => ({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: true,
            tokenExpiresAt: null,

            setUser: (user) => {
                set({ user, isAuthenticated: !!user });
            },

            setToken: (token) => {
                const expiresAt = token ? Date.now() + 15 * 60 * 1000 : null; // 15 minutes
                set({ token, tokenExpiresAt: expiresAt });
            },

            login: () => {
                // Redirect to backend Google OAuth
                window.location.href = `${API_URL}/auth/google`;
            },

            logout: () => {
                // Clear local state and redirect to backend logout
                set({ user: null, token: null, isAuthenticated: false, tokenExpiresAt: null });
                window.location.href = `${API_URL}/auth/logout`;
            },

            refreshToken: async () => {
                try {
                    console.log('Attempting to refresh token...');
                    const response = await fetch(`${API_URL}/auth/refresh`, {
                        method: 'POST',
                        credentials: 'include',
                    });

                    if (response.ok) {
                        const data = await response.json();
                        if (data.success && data.accessToken) {
                            const expiresAt = Date.now() + 15 * 60 * 1000;
                            set({ token: data.accessToken, tokenExpiresAt: expiresAt });
                            console.log('Token refreshed successfully');
                            return true;
                        }
                    }

                    console.log('Token refresh failed');
                    return false;
                } catch (error) {
                    console.error('Token refresh error:', error);
                    return false;
                }
            },

            checkAuth: async () => {
                set({ isLoading: true });
                try {
                    const { tokenExpiresAt, refreshToken } = get();

                    // Check if token needs refresh
                    if (tokenExpiresAt && Date.now() > tokenExpiresAt - TOKEN_REFRESH_MARGIN) {
                        console.log('Token expiring soon, refreshing...');
                        await refreshToken();
                    }

                    const response = await fetch(`${API_URL}/auth/status`, {
                        credentials: 'include',
                    });

                    if (response.ok) {
                        const data = await response.json();

                        // Check if account is banned
                        if (data.banned) {
                            console.log('🚫 Account is banned, forcing logout...');
                            set({ user: null, token: null, isAuthenticated: false, isLoading: false, tokenExpiresAt: null });
                            if (typeof window !== 'undefined') {
                                window.location.href = '/login?banned=true';
                            }
                            return;
                        }

                        if (data.isAuthenticated && data.user) {
                            const expiresAt = Date.now() + 15 * 60 * 1000;
                            set({
                                user: data.user,
                                token: data.token || null,
                                isAuthenticated: true,
                                isLoading: false,
                                tokenExpiresAt: expiresAt,
                            });
                            return;
                        }
                    }

                    // Handle 403 from global guard
                    if (response.status === 403) {
                        console.log('🚫 Account/IP blocked, forcing logout...');
                        set({ user: null, token: null, isAuthenticated: false, isLoading: false, tokenExpiresAt: null });
                        if (typeof window !== 'undefined') {
                            window.location.href = '/login?banned=true';
                        }
                        return;
                    }

                    set({ user: null, token: null, isAuthenticated: false, isLoading: false, tokenExpiresAt: null });
                } catch (error) {
                    console.error('Auth check failed:', error);
                    set({ user: null, token: null, isAuthenticated: false, isLoading: false, tokenExpiresAt: null });
                }
            },
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({
                user: state.user,
                token: state.token,
                isAuthenticated: state.isAuthenticated,
                tokenExpiresAt: state.tokenExpiresAt,
            }),
        }
    )
);

// Auto-refresh token before expiry
if (typeof window !== 'undefined') {
    setInterval(() => {
        const state = useAuthStore.getState();
        if (state.isAuthenticated && state.tokenExpiresAt) {
            const timeUntilExpiry = state.tokenExpiresAt - Date.now();
            if (timeUntilExpiry < TOKEN_REFRESH_MARGIN && timeUntilExpiry > 0) {
                console.log('Auto-refreshing token...');
                state.refreshToken();
            }
        }
    }, 60 * 1000); // Check every minute
}
