import { act, renderHook } from '@testing-library/react';
import { useAuthStore, AuthUser } from '../authStore';

// Mock fetch
const mockFetch = jest.fn();
global.fetch = mockFetch;

describe('useAuthStore', () => {
    const mockUser: AuthUser = {
        id: 'user-123',
        name: 'Test User',
        email: 'test@example.com',
        avatarUrl: 'https://example.com/avatar.jpg',
        nativeLanguage: 'Vietnamese',
        learningLevel: 'B1',
        country: 'Vietnam',
        countryFlag: '🇻🇳',
    };

    beforeEach(() => {
        // Reset store state
        useAuthStore.setState({
            user: null,
            isAuthenticated: false,
            isLoading: true,
        });
        mockFetch.mockClear();
    });

    describe('setUser', () => {
        it('should set user and isAuthenticated to true', () => {
            const { result } = renderHook(() => useAuthStore());

            act(() => {
                result.current.setUser(mockUser);
            });

            expect(result.current.user).toEqual(mockUser);
            expect(result.current.isAuthenticated).toBe(true);
        });

        it('should set user to null and isAuthenticated to false when null passed', () => {
            const { result } = renderHook(() => useAuthStore());

            // First set a user
            act(() => {
                result.current.setUser(mockUser);
            });

            // Then clear it
            act(() => {
                result.current.setUser(null);
            });

            expect(result.current.user).toBeNull();
            expect(result.current.isAuthenticated).toBe(false);
        });
    });

    describe('login', () => {
        it('should redirect to Google OAuth endpoint', () => {
            const { result } = renderHook(() => useAuthStore());

            act(() => {
                result.current.login();
            });

            expect(window.location.href).toBe('http://localhost:3002/auth/google');
        });
    });

    describe('logout', () => {
        it('should clear user and redirect to logout endpoint', () => {
            const { result } = renderHook(() => useAuthStore());

            // First set a user
            act(() => {
                result.current.setUser(mockUser);
            });

            // Then logout
            act(() => {
                result.current.logout();
            });

            expect(result.current.user).toBeNull();
            expect(result.current.isAuthenticated).toBe(false);
            expect(window.location.href).toBe('http://localhost:3002/auth/logout');
        });
    });

    describe('checkAuth', () => {
        it('should set user when authenticated', async () => {
            mockFetch.mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve({ isAuthenticated: true, user: mockUser }),
            });

            const { result } = renderHook(() => useAuthStore());

            await act(async () => {
                await result.current.checkAuth();
            });

            expect(result.current.user).toEqual(mockUser);
            expect(result.current.isAuthenticated).toBe(true);
            expect(result.current.isLoading).toBe(false);
        });

        it('should handle unauthenticated response', async () => {
            mockFetch.mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve({ isAuthenticated: false }),
            });

            const { result } = renderHook(() => useAuthStore());

            await act(async () => {
                await result.current.checkAuth();
            });

            expect(result.current.user).toBeNull();
            expect(result.current.isAuthenticated).toBe(false);
            expect(result.current.isLoading).toBe(false);
        });

        it('should handle banned user', async () => {
            mockFetch.mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve({ banned: true }),
            });

            const { result } = renderHook(() => useAuthStore());

            await act(async () => {
                await result.current.checkAuth();
            });

            expect(result.current.user).toBeNull();
            expect(result.current.isAuthenticated).toBe(false);
            expect(window.location.href).toBe('/login?banned=true');
        });

        it('should handle 403 forbidden response', async () => {
            mockFetch.mockResolvedValueOnce({
                ok: false,
                status: 403,
                json: () => Promise.resolve({ error: 'Forbidden' }),
            });

            const { result } = renderHook(() => useAuthStore());

            await act(async () => {
                await result.current.checkAuth();
            });

            expect(result.current.user).toBeNull();
            expect(result.current.isAuthenticated).toBe(false);
            expect(window.location.href).toBe('/login?banned=true');
        });

        it('should handle network error', async () => {
            mockFetch.mockRejectedValueOnce(new Error('Network error'));

            const { result } = renderHook(() => useAuthStore());

            await act(async () => {
                await result.current.checkAuth();
            });

            expect(result.current.user).toBeNull();
            expect(result.current.isAuthenticated).toBe(false);
            expect(result.current.isLoading).toBe(false);
        });

        it('should set isLoading to true while checking', async () => {
            let resolvePromise: (value: any) => void;
            mockFetch.mockReturnValueOnce(
                new Promise((resolve) => {
                    resolvePromise = resolve;
                })
            );

            const { result } = renderHook(() => useAuthStore());

            // Start checking
            act(() => {
                result.current.checkAuth();
            });

            expect(result.current.isLoading).toBe(true);

            // Resolve the promise
            await act(async () => {
                resolvePromise!({
                    ok: true,
                    json: () => Promise.resolve({ isAuthenticated: false }),
                });
            });

            expect(result.current.isLoading).toBe(false);
        });
    });
});
