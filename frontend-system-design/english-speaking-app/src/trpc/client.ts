import { createTRPCReact } from '@trpc/react-query';
import { httpBatchLink, TRPCClientError } from '@trpc/client';

// Import AppRouter type from backend
import type { AppRouter } from '../../backend/src/trpc';

/**
 * Create tRPC React hooks
 * This provides type-safe hooks like trpc.rooms.list.useQuery()
 */
export const trpc = createTRPCReact<AppRouter>();

/**
 * Get base URL for tRPC API
 */
function getBaseUrl() {
    if (typeof window !== 'undefined') {
        return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';
    }
    return process.env.API_URL || 'http://localhost:3002';
}

/**
 * Get auth token from localStorage (persisted by zustand)
 */
function getAuthToken(): string | null {
    if (typeof window === 'undefined') return null;

    try {
        const authData = localStorage.getItem('auth-storage');
        if (!authData) return null;

        const parsed = JSON.parse(authData);
        return parsed?.state?.token || null;
    } catch {
        return null;
    }
}

/**
 * Attempt to refresh the access token
 */
async function refreshAccessToken(): Promise<boolean> {
    try {
        const response = await fetch(`${getBaseUrl()}/auth/refresh`, {
            method: 'POST',
            credentials: 'include',
        });

        if (response.ok) {
            const data = await response.json();
            if (data.success && data.accessToken) {
                // Update token in localStorage
                const authData = localStorage.getItem('auth-storage');
                if (authData) {
                    const parsed = JSON.parse(authData);
                    parsed.state.token = data.accessToken;
                    parsed.state.tokenExpiresAt = Date.now() + 15 * 60 * 1000;
                    localStorage.setItem('auth-storage', JSON.stringify(parsed));
                }
                console.log('tRPC: Token refreshed successfully');
                return true;
            }
        }
        return false;
    } catch (error) {
        console.error('tRPC: Token refresh failed:', error);
        return false;
    }
}

/**
 * Create tRPC client with configuration
 */
export function createTRPCClient() {
    return trpc.createClient({
        links: [
            httpBatchLink({
                url: `${getBaseUrl()}/trpc`,
                // Add Authorization header and credentials
                headers() {
                    const token = getAuthToken();
                    return token ? { Authorization: `Bearer ${token}` } : {};
                },
                async fetch(url, options) {
                    // First attempt
                    let response = await fetch(url, {
                        ...options,
                        credentials: 'include',
                    });

                    // If 401 Unauthorized, try to refresh token and retry
                    if (response.status === 401) {
                        console.log('tRPC: Got 401, attempting token refresh...');
                        const refreshed = await refreshAccessToken();

                        if (refreshed) {
                            // Retry with new token
                            const newToken = getAuthToken();
                            const newHeaders = new Headers(options?.headers);
                            if (newToken) {
                                newHeaders.set('Authorization', `Bearer ${newToken}`);
                            }

                            response = await fetch(url, {
                                ...options,
                                headers: newHeaders,
                                credentials: 'include',
                            });
                        }
                    }

                    return response;
                },
            }),
        ],
    });
}
