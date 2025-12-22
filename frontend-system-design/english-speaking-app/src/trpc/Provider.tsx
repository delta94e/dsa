'use client';

import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { trpc, createTRPCClient } from './client';

interface TRPCProviderProps {
    children: React.ReactNode;
}

/**
 * tRPC Provider - wraps app with tRPC + React Query context
 */
export function TRPCProvider({ children }: TRPCProviderProps) {
    // Create QueryClient and tRPC client as state to persist across re-renders
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        staleTime: 10 * 1000, // 10 seconds
                        refetchOnWindowFocus: false,
                    },
                },
            })
    );

    const [trpcClient] = useState(() => createTRPCClient());

    return (
        <trpc.Provider client={trpcClient} queryClient={queryClient}>
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        </trpc.Provider>
    );
}

export default TRPCProvider;
