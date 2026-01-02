import { useState, useEffect, useCallback } from 'react';

// VAPID public key from environment
const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

// Convert URL-safe base64 to Uint8Array for VAPID key
function urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
        .replace(/-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

export interface PushNotificationState {
    isSupported: boolean;
    isSubscribed: boolean;
    isLoading: boolean;
    permission: NotificationPermission | 'unsupported';
    subscription: PushSubscription | null;
    error: string | null;
}

export interface UsePushNotificationsReturn extends PushNotificationState {
    subscribe: () => Promise<boolean>;
    unsubscribe: () => Promise<boolean>;
    requestPermission: () => Promise<NotificationPermission>;
}

export function usePushNotifications(): UsePushNotificationsReturn {
    const [state, setState] = useState<PushNotificationState>({
        isSupported: false,
        isSubscribed: false,
        isLoading: true,
        permission: 'unsupported',
        subscription: null,
        error: null,
    });

    // Check if push notifications are supported
    const checkSupport = useCallback(() => {
        const supported =
            typeof window !== 'undefined' &&
            'serviceWorker' in navigator &&
            'PushManager' in window &&
            'Notification' in window;

        return supported;
    }, []);

    // Get current subscription
    const getSubscription = useCallback(async (): Promise<PushSubscription | null> => {
        try {
            const registration = await navigator.serviceWorker.ready;
            const subscription = await registration.pushManager.getSubscription();
            return subscription;
        } catch (error) {
            console.error('Error getting subscription:', error);
            return null;
        }
    }, []);

    // Initialize state
    useEffect(() => {
        const init = async () => {
            const supported = checkSupport();

            if (!supported) {
                setState(prev => ({
                    ...prev,
                    isSupported: false,
                    isLoading: false,
                    permission: 'unsupported',
                }));
                return;
            }

            try {
                // Register service worker if not already registered
                const registration = await navigator.serviceWorker.register('/sw.js');
                console.log('Service Worker registered:', registration);

                // Wait for service worker to be ready
                await navigator.serviceWorker.ready;

                // Get current permission and subscription
                const permission = Notification.permission;
                const subscription = await getSubscription();

                setState({
                    isSupported: true,
                    isSubscribed: !!subscription,
                    isLoading: false,
                    permission,
                    subscription,
                    error: null,
                });
            } catch (error) {
                console.error('Error initializing push notifications:', error);
                setState(prev => ({
                    ...prev,
                    isSupported: true,
                    isLoading: false,
                    error: error instanceof Error ? error.message : 'Failed to initialize',
                }));
            }
        };

        init();
    }, [checkSupport, getSubscription]);

    // Request notification permission
    const requestPermission = useCallback(async (): Promise<NotificationPermission> => {
        if (!state.isSupported) {
            return 'denied';
        }

        try {
            const permission = await Notification.requestPermission();
            setState(prev => ({ ...prev, permission }));
            return permission;
        } catch (error) {
            console.error('Error requesting permission:', error);
            return 'denied';
        }
    }, [state.isSupported]);

    // Subscribe to push notifications
    const subscribe = useCallback(async (): Promise<boolean> => {
        if (!state.isSupported) {
            setState(prev => ({ ...prev, error: 'Push notifications not supported' }));
            return false;
        }

        setState(prev => ({ ...prev, isLoading: true, error: null }));

        try {
            // Request permission if not granted
            let permission = Notification.permission;
            if (permission === 'default') {
                permission = await requestPermission();
            }

            if (permission !== 'granted') {
                setState(prev => ({
                    ...prev,
                    isLoading: false,
                    error: 'Notification permission denied',
                }));
                return false;
            }

            // Get service worker registration
            const registration = await navigator.serviceWorker.ready;

            // Check for existing subscription
            let subscription = await registration.pushManager.getSubscription();

            if (!subscription) {
                // Create new subscription
                if (!VAPID_PUBLIC_KEY) {
                    setState(prev => ({
                        ...prev,
                        isLoading: false,
                        error: 'VAPID public key not configured',
                    }));
                    return false;
                }

                subscription = await registration.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
                });
            }

            // Send subscription to server
            const response = await fetch('/api/push/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    subscription: subscription.toJSON(),
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to save subscription on server');
            }

            setState(prev => ({
                ...prev,
                isSubscribed: true,
                isLoading: false,
                subscription,
                error: null,
            }));

            return true;
        } catch (error) {
            console.error('Error subscribing to push notifications:', error);
            setState(prev => ({
                ...prev,
                isLoading: false,
                error: error instanceof Error ? error.message : 'Failed to subscribe',
            }));
            return false;
        }
    }, [state.isSupported, requestPermission]);

    // Unsubscribe from push notifications
    const unsubscribe = useCallback(async (): Promise<boolean> => {
        if (!state.subscription) {
            return true;
        }

        setState(prev => ({ ...prev, isLoading: true, error: null }));

        try {
            // Unsubscribe from push manager
            await state.subscription.unsubscribe();

            // Notify server
            await fetch('/api/push/subscribe', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    endpoint: state.subscription.endpoint,
                }),
            });

            setState(prev => ({
                ...prev,
                isSubscribed: false,
                isLoading: false,
                subscription: null,
                error: null,
            }));

            return true;
        } catch (error) {
            console.error('Error unsubscribing from push notifications:', error);
            setState(prev => ({
                ...prev,
                isLoading: false,
                error: error instanceof Error ? error.message : 'Failed to unsubscribe',
            }));
            return false;
        }
    }, [state.subscription]);

    return {
        ...state,
        subscribe,
        unsubscribe,
        requestPermission,
    };
}
