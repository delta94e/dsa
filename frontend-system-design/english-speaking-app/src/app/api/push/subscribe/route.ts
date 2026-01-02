import { NextRequest, NextResponse } from 'next/server';

// In-memory storage for subscriptions (replace with database in production)
// Using global to persist across hot reloads in development
declare global {
    // eslint-disable-next-line no-var
    var pushSubscriptions: Map<string, PushSubscriptionJSON>;
}

if (!global.pushSubscriptions) {
    global.pushSubscriptions = new Map();
}

interface SubscribeRequest {
    subscription: PushSubscriptionJSON;
    userId?: string;
    preferences?: {
        dailyReminders?: boolean;
        achievements?: boolean;
        streaks?: boolean;
    };
}

// POST - Subscribe to push notifications
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Support both formats:
        // 1. { subscription: {...} } - from usePushNotifications hook
        // 2. { endpoint, keys } - direct subscription object
        let subscription: PushSubscriptionJSON;
        let userId: string | undefined;
        let preferences: SubscribeRequest['preferences'];

        if (body.subscription && body.subscription.endpoint) {
            // Wrapped format
            subscription = body.subscription;
            userId = body.userId;
            preferences = body.preferences;
        } else if (body.endpoint) {
            // Direct format
            subscription = body as PushSubscriptionJSON;
        } else {
            return NextResponse.json(
                { error: 'Invalid subscription data', received: Object.keys(body) },
                { status: 400 }
            );
        }

        // Store subscription (keyed by endpoint for uniqueness)
        const subscriptionData = {
            ...subscription,
            userId: userId || 'anonymous',
            preferences: preferences || {
                dailyReminders: true,
                achievements: true,
                streaks: true,
            },
            createdAt: new Date().toISOString(),
        };

        global.pushSubscriptions.set(subscription.endpoint!, subscriptionData);

        console.log('[Push Subscribe] New subscription:', {
            endpoint: (subscription.endpoint || '').substring(0, 50) + '...',
            userId: subscriptionData.userId,
            totalSubscriptions: global.pushSubscriptions.size,
        });

        return NextResponse.json({
            success: true,
            message: 'Subscription saved successfully',
        });
    } catch (error) {
        console.error('[Push Subscribe] Error:', error);
        return NextResponse.json(
            { error: 'Failed to save subscription' },
            { status: 500 }
        );
    }
}

// DELETE - Unsubscribe from push notifications
export async function DELETE(request: NextRequest) {
    try {
        const body = await request.json();
        const { endpoint } = body;

        if (!endpoint) {
            return NextResponse.json(
                { error: 'Endpoint is required' },
                { status: 400 }
            );
        }

        const deleted = global.pushSubscriptions.delete(endpoint);

        console.log('[Push Subscribe] Unsubscribed:', {
            endpoint: endpoint.substring(0, 50) + '...',
            deleted,
            totalSubscriptions: global.pushSubscriptions.size,
        });

        return NextResponse.json({
            success: true,
            message: deleted ? 'Subscription removed' : 'Subscription not found',
        });
    } catch (error) {
        console.error('[Push Subscribe] Error:', error);
        return NextResponse.json(
            { error: 'Failed to remove subscription' },
            { status: 500 }
        );
    }
}

// GET - Get subscription count (for debugging)
export async function GET() {
    return NextResponse.json({
        count: global.pushSubscriptions.size,
        // Don't expose actual subscriptions in production
        subscriptions: process.env.NODE_ENV === 'development'
            ? Array.from(global.pushSubscriptions.keys()).map(k => k.substring(0, 50) + '...')
            : undefined,
    });
}
