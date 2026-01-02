import { NextRequest } from 'next/server';

// Store connected clients for broadcasting
const clients = new Set<ReadableStreamDefaultController>();

// Feature flag change event broadcaster
export function broadcastFlagChange(flagId: string, enabled: boolean) {
    const event = JSON.stringify({ type: 'FLAG_CHANGED', flagId, enabled, timestamp: Date.now() });
    clients.forEach(controller => {
        try {
            controller.enqueue(`data: ${event}\n\n`);
        } catch (e) {
            // Client disconnected
            clients.delete(controller);
        }
    });
}

// GET - SSE stream for real-time feature flag updates
export async function GET(request: NextRequest) {
    const encoder = new TextEncoder();

    const stream = new ReadableStream({
        start(controller) {
            clients.add(controller);

            // Send initial connection message
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'CONNECTED', timestamp: Date.now() })}\n\n`));

            // Heartbeat every 30 seconds to keep connection alive
            const heartbeat = setInterval(() => {
                try {
                    controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'HEARTBEAT', timestamp: Date.now() })}\n\n`));
                } catch (e) {
                    clearInterval(heartbeat);
                    clients.delete(controller);
                }
            }, 30000);

            // Cleanup on close
            request.signal.addEventListener('abort', () => {
                clearInterval(heartbeat);
                clients.delete(controller);
                console.log('[SSE] Client disconnected');
            });

            console.log(`[SSE] Client connected. Total: ${clients.size}`);
        },
        cancel() {
            // Client disconnected
        },
    });

    return new Response(stream, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache, no-transform',
            'Connection': 'keep-alive',
            'X-Accel-Buffering': 'no', // Disable nginx buffering
        },
    });
}
