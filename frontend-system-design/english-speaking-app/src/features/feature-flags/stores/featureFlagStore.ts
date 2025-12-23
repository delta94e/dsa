import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface FeatureFlag {
    id: string;
    name: string;
    description: string;
    enabled: boolean;
    percentage: number;
    variants?: { id: string; name: string; weight: number }[];
    createdAt: string;
    updatedAt: string;
}

interface UserFeatureStatus {
    enabled: boolean;
    variant?: string;
}

interface FeatureFlagState {
    flags: FeatureFlag[];
    userFlags: Record<string, UserFeatureStatus>;
    isLoading: boolean;
    error: string | null;
    pollingInterval: NodeJS.Timeout | null;

    // Actions
    fetchFlags: () => Promise<void>;
    fetchUserFlags: () => Promise<void>;
    toggleFlag: (flagId: string) => Promise<boolean>;
    updateFlag: (flagId: string, updates: Partial<FeatureFlag>) => Promise<boolean>;
    isFeatureEnabled: (flagId: string) => boolean;
    getVariant: (flagId: string) => string | undefined;

    // Real-time sync
    startPolling: (intervalMs?: number) => void;
    stopPolling: () => void;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';

// Polling interval in ms (default 30 seconds - reduced frequency for performance)
const DEFAULT_POLLING_INTERVAL = 30000;

export const useFeatureFlagStore = create<FeatureFlagState>()(
    persist(
        (set, get) => ({
            flags: [],
            userFlags: {},
            isLoading: false,
            error: null,
            pollingInterval: null,

            fetchFlags: async () => {
                set({ isLoading: true, error: null });
                try {
                    const response = await fetch(`${API_URL}/feature-flags`, {
                        credentials: 'include',
                    });
                    if (!response.ok) throw new Error('Failed to fetch flags');
                    const flags = await response.json();
                    set({ flags, isLoading: false });
                } catch (error) {
                    set({ error: (error as Error).message, isLoading: false });
                }
            },

            fetchUserFlags: async () => {
                try {
                    const response = await fetch(`${API_URL}/feature-flags/user`, {
                        credentials: 'include',
                    });
                    if (!response.ok) throw new Error('Failed to fetch user flags');
                    const userFlags = await response.json();
                    set({ userFlags });
                } catch (error) {
                    console.error('Failed to fetch user flags:', error);
                }
            },

            toggleFlag: async (flagId: string) => {
                try {
                    const response = await fetch(`${API_URL}/feature-flags/${flagId}/toggle`, {
                        method: 'POST',
                        credentials: 'include',
                    });
                    if (!response.ok) throw new Error('Failed to toggle flag');

                    const updatedFlag = await response.json();
                    set((state) => ({
                        flags: state.flags.map((f) =>
                            f.id === flagId ? updatedFlag : f
                        ),
                    }));

                    // Refresh user flags
                    get().fetchUserFlags();
                    return true;
                } catch (error) {
                    console.error('Failed to toggle flag:', error);
                    return false;
                }
            },

            updateFlag: async (flagId: string, updates: Partial<FeatureFlag>) => {
                try {
                    const response = await fetch(`${API_URL}/feature-flags/${flagId}`, {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        credentials: 'include',
                        body: JSON.stringify(updates),
                    });
                    if (!response.ok) throw new Error('Failed to update flag');

                    const updatedFlag = await response.json();
                    set((state) => ({
                        flags: state.flags.map((f) =>
                            f.id === flagId ? updatedFlag : f
                        ),
                    }));

                    get().fetchUserFlags();
                    return true;
                } catch (error) {
                    console.error('Failed to update flag:', error);
                    return false;
                }
            },

            isFeatureEnabled: (flagId: string) => {
                const { userFlags } = get();
                return userFlags[flagId]?.enabled ?? false;
            },

            getVariant: (flagId: string) => {
                const { userFlags } = get();
                return userFlags[flagId]?.variant;
            },

            // Start polling for real-time updates
            startPolling: (intervalMs = DEFAULT_POLLING_INTERVAL) => {
                const { pollingInterval, fetchUserFlags, fetchFlags } = get();

                // Don't start if already polling
                if (pollingInterval) return;

                console.log(`🔄 Feature flags polling started (every ${intervalMs}ms)`);

                // Only fetch user-specific flags during polling (less frequent)
                // fetchFlags() is only called on initial load or manual refresh
                const interval = setInterval(() => {
                    fetchUserFlags();
                    // fetchFlags(); // Commented out - only fetch on initial load
                }, intervalMs);

                set({ pollingInterval: interval });
            },

            // Stop polling
            stopPolling: () => {
                const { pollingInterval } = get();
                if (pollingInterval) {
                    clearInterval(pollingInterval);
                    set({ pollingInterval: null });
                    console.log('🛑 Feature flags polling stopped');
                }
            },
        }),
        {
            name: 'feature-flags-storage',
            partialize: (state) => ({ userFlags: state.userFlags }),
        }
    )
);
