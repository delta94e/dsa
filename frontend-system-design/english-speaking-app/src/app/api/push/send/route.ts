import { NextRequest, NextResponse } from 'next/server';
import webpush from 'web-push';

// Configure web-push with VAPID keys
const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY;
const VAPID_SUBJECT = process.env.VAPID_SUBJECT || 'mailto:admin@english-speaking-app.com';

// Initialize web-push if keys are available
if (VAPID_PUBLIC_KEY && VAPID_PRIVATE_KEY) {
    webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);
}

// Access the shared subscriptions map
declare global {
    // eslint-disable-next-line no-var
    var pushSubscriptions: Map<string, PushSubscriptionJSON>;
}

interface SendNotificationRequest {
    title: string;
    body: string;
    icon?: string;
    badge?: string;
    tag?: string;
    data?: Record<string, unknown>;
    url?: string;
    actions?: Array<{ action: string; title: string }>;
    // Target specific users or send to all
    targetEndpoint?: string;
    targetUserId?: string;
}

// Notification presets for the English Speaking App
const NOTIFICATION_PRESETS = {
    dailyReminder: {
        title: '📚 Time to Practice!',
        body: "Your daily English lesson is waiting. Let's improve your speaking skills!",
        icon: '/notification-icon.png',
        tag: 'daily-reminder',
        data: { url: '/ai-practice' },
    },
    streakReminder: {
        title: '🔥 Keep Your Streak Alive!',
        body: "Don't break your learning streak! Practice for just 5 minutes today.",
        icon: '/notification-icon.png',
        tag: 'streak-reminder',
        data: { url: '/ai-practice' },
    },
    achievement: {
        title: '🏆 Achievement Unlocked!',
        body: "Congratulations! You've completed a milestone!",
        icon: '/notification-icon.png',
        tag: 'achievement',
        data: { url: '/profile' },
    },
    roomInvite: {
        title: '👥 You\'re Invited!',
        body: 'A speaking room is waiting for you to join.',
        icon: '/notification-icon.png',
        tag: 'room-invite',
        data: { url: '/rooms' },
    },
};

// POST - Send push notification
export async function POST(request: NextRequest) {
    try {
        // Check if VAPID keys are configured
        if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) {
            return NextResponse.json(
                {
                    error: 'VAPID keys not configured',
                    hint: 'Run: npx web-push generate-vapid-keys and add to .env.local',
                },
                { status: 500 }
            );
        }

        const body: SendNotificationRequest = await request.json();
        const {
            title,
            body: notificationBody,
            icon,
            badge,
            tag,
            data,
            url,
            actions,
            targetEndpoint,
            targetUserId,
        } = body;

        if (!title || !notificationBody) {
            return NextResponse.json(
                { error: 'Title and body are required' },
                { status: 400 }
            );
        }

        // Build notification payload
        const payload = JSON.stringify({
            title,
            body: notificationBody,
            icon: icon || '/notification-icon.png',
            badge: badge || '/notification-icon.png',
            tag: tag || 'default',
            data: {
                ...data,
                url: url || data?.url || '/',
            },
            actions: actions || [
                { action: 'open', title: 'Open App' },
                { action: 'dismiss', title: 'Dismiss' },
            ],
        });

        // Get target subscriptions
        let subscriptionsToNotify: PushSubscriptionJSON[] = [];

        if (targetEndpoint) {
            // Send to specific endpoint
            const sub = global.pushSubscriptions?.get(targetEndpoint);
            if (sub) subscriptionsToNotify = [sub];
        } else if (targetUserId) {
            // Send to specific user (all their devices)
            subscriptionsToNotify = Array.from(global.pushSubscriptions?.values() || [])
                .filter((sub: any) => sub.userId === targetUserId);
        } else {
            // Broadcast to all subscriptions
            subscriptionsToNotify = Array.from(global.pushSubscriptions?.values() || []);
        }

        if (subscriptionsToNotify.length === 0) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'No subscriptions found',
                    hint: 'Make sure users have subscribed to notifications',
                },
                { status: 404 }
            );
        }

        // Send notifications
        const results = await Promise.allSettled(
            subscriptionsToNotify.map(async (subscription) => {
                try {
                    await webpush.sendNotification(
                        subscription as webpush.PushSubscription,
                        payload
                    );
                    return { success: true, endpoint: subscription.endpoint };
                } catch (error: any) {
                    // Handle expired subscriptions
                    if (error.statusCode === 404 || error.statusCode === 410) {
                        // Remove expired subscription
                        if (subscription.endpoint) {
                            global.pushSubscriptions?.delete(subscription.endpoint);
                        }
                    }
                    return {
                        success: false,
                        endpoint: subscription.endpoint,
                        error: error.message,
                    };
                }
            })
        );

        const successful = results.filter((r) => r.status === 'fulfilled' && (r.value as any).success).length;
        const failed = results.length - successful;

        console.log('[Push Send] Notification sent:', {
            title,
            successful,
            failed,
            total: results.length,
        });

        return NextResponse.json({
            success: true,
            message: `Notification sent to ${successful} devices`,
            stats: { successful, failed, total: results.length },
        });
    } catch (error) {
        console.error('[Push Send] Error:', error);
        return NextResponse.json(
            { error: 'Failed to send notification' },
            { status: 500 }
        );
    }
}

// GET - Get available notification presets and test endpoint
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const preset = searchParams.get('preset');

    if (preset && preset in NOTIFICATION_PRESETS) {
        return NextResponse.json(NOTIFICATION_PRESETS[preset as keyof typeof NOTIFICATION_PRESETS]);
    }

    return NextResponse.json({
        message: 'Push Notification API',
        availablePresets: Object.keys(NOTIFICATION_PRESETS),
        usage: {
            sendCustom: 'POST /api/push/send with { title, body, ... }',
            sendPreset: 'GET /api/push/send?preset=dailyReminder',
        },
        configured: !!(VAPID_PUBLIC_KEY && VAPID_PRIVATE_KEY),
    });
}
