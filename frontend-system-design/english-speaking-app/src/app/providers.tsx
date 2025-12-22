'use client';

import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { theme } from '@/shared/utils/theme';
import { AuthProvider } from '@/features/auth';
import { TRPCProvider } from '@/trpc';
import { IdleTimeoutProvider } from '@/providers/IdleTimeoutProvider';

import '@mantine/notifications/styles.css';

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <TRPCProvider>
            <MantineProvider theme={theme}>
                <Notifications position="top-right" />
                <AuthProvider>
                    <IdleTimeoutProvider>
                        {children}
                    </IdleTimeoutProvider>
                </AuthProvider>
            </MantineProvider>
        </TRPCProvider>
    );
}
