// ═══════════════════════════════════════════════════════════════
// Offline Storage Service
// Manages offline lesson storage and sync
// ═══════════════════════════════════════════════════════════════

import {
    openDatabase,
    generateId,
    calculateSize,
    type OfflineLesson,
    type OfflineSession,
    type SyncQueueItem,
    type LessonContent,
} from './db';
import type { AITopic, Level, AIMessage, AI_TOPICS } from '@/types';

// ═══════════════════════════════════════════════════════════════
// Lesson Operations
// ═══════════════════════════════════════════════════════════════

export async function saveLesson(
    topic: AITopic,
    level: Level,
    content: LessonContent
): Promise<OfflineLesson> {
    const db = await openDatabase();

    const lesson: OfflineLesson = {
        id: `${topic.id}-${level}`,
        topic,
        level,
        content,
        downloadedAt: new Date(),
        lastAccessedAt: new Date(),
        sizeBytes: calculateSize(content),
    };

    await db.put('lessons', lesson);
    console.log('[Offline] Lesson saved:', lesson.id);

    return lesson;
}

export async function getLesson(id: string): Promise<OfflineLesson | undefined> {
    const db = await openDatabase();
    const lesson = await db.get('lessons', id);

    if (lesson) {
        // Update last accessed time
        lesson.lastAccessedAt = new Date();
        await db.put('lessons', lesson);
    }

    return lesson;
}

export async function getAllLessons(): Promise<OfflineLesson[]> {
    const db = await openDatabase();
    return db.getAll('lessons');
}

export async function getLessonsByLevel(level: Level): Promise<OfflineLesson[]> {
    const db = await openDatabase();
    return db.getAllFromIndex('lessons', 'by-level', level);
}

export async function getLessonsByTopic(topicId: string): Promise<OfflineLesson[]> {
    const db = await openDatabase();
    return db.getAllFromIndex('lessons', 'by-topic', topicId);
}

export async function deleteLesson(id: string): Promise<void> {
    const db = await openDatabase();
    await db.delete('lessons', id);
    console.log('[Offline] Lesson deleted:', id);
}

export async function clearAllLessons(): Promise<void> {
    const db = await openDatabase();
    await db.clear('lessons');
    console.log('[Offline] All lessons cleared');
}

export async function isLessonCached(topicId: string, level: Level): Promise<boolean> {
    const id = `${topicId}-${level}`;
    const db = await openDatabase();
    const lesson = await db.get('lessons', id);
    return !!lesson;
}

// ═══════════════════════════════════════════════════════════════
// Session Operations
// ═══════════════════════════════════════════════════════════════

export async function saveSession(
    lessonId: string,
    messages: AIMessage[]
): Promise<OfflineSession> {
    const db = await openDatabase();

    const session: OfflineSession = {
        id: generateId(),
        lessonId,
        messages,
        startedAt: new Date(),
        synced: false,
    };

    await db.put('sessions', session);
    console.log('[Offline] Session saved:', session.id);

    return session;
}

export async function updateSession(
    sessionId: string,
    messages: AIMessage[],
    ended: boolean = false
): Promise<void> {
    const db = await openDatabase();
    const session = await db.get('sessions', sessionId);

    if (session) {
        session.messages = messages;
        if (ended) {
            session.endedAt = new Date();
        }
        await db.put('sessions', session);
    }
}

export async function getSession(id: string): Promise<OfflineSession | undefined> {
    const db = await openDatabase();
    return db.get('sessions', id);
}

export async function getSessionsByLesson(lessonId: string): Promise<OfflineSession[]> {
    const db = await openDatabase();
    return db.getAllFromIndex('sessions', 'by-lesson', lessonId);
}

export async function getUnsyncedSessions(): Promise<OfflineSession[]> {
    const db = await openDatabase();
    // Get sessions where synced = false (0)
    return db.getAllFromIndex('sessions', 'by-synced', 0);
}

export async function markSessionSynced(sessionId: string): Promise<void> {
    const db = await openDatabase();
    const session = await db.get('sessions', sessionId);

    if (session) {
        session.synced = true;
        await db.put('sessions', session);
        console.log('[Offline] Session marked as synced:', sessionId);
    }
}

export async function deleteSession(id: string): Promise<void> {
    const db = await openDatabase();
    await db.delete('sessions', id);
}

// ═══════════════════════════════════════════════════════════════
// Sync Queue Operations
// ═══════════════════════════════════════════════════════════════

export async function queueSync(
    type: 'session' | 'progress',
    data: unknown
): Promise<SyncQueueItem> {
    const db = await openDatabase();

    const item: SyncQueueItem = {
        id: generateId(),
        type,
        data,
        createdAt: new Date(),
        retries: 0,
    };

    await db.put('syncQueue', item);
    console.log('[Offline] Added to sync queue:', item.id);

    return item;
}

export async function getSyncQueue(): Promise<SyncQueueItem[]> {
    const db = await openDatabase();
    return db.getAll('syncQueue');
}

export async function removeSyncItem(id: string): Promise<void> {
    const db = await openDatabase();
    await db.delete('syncQueue', id);
}

export async function incrementSyncRetry(id: string): Promise<void> {
    const db = await openDatabase();
    const item = await db.get('syncQueue', id);

    if (item) {
        item.retries += 1;
        await db.put('syncQueue', item);
    }
}

export async function clearSyncQueue(): Promise<void> {
    const db = await openDatabase();
    await db.clear('syncQueue');
    console.log('[Offline] Sync queue cleared');
}

// ═══════════════════════════════════════════════════════════════
// Sync Processing
// ═══════════════════════════════════════════════════════════════

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';
const MAX_RETRIES = 3;

export async function processSyncQueue(): Promise<{
    synced: number;
    failed: number;
}> {
    const queue = await getSyncQueue();
    let synced = 0;
    let failed = 0;

    console.log(`[Offline] Processing sync queue: ${queue.length} items`);

    for (const item of queue) {
        if (item.retries >= MAX_RETRIES) {
            console.warn('[Offline] Max retries reached for:', item.id);
            await removeSyncItem(item.id);
            failed++;
            continue;
        }

        try {
            if (item.type === 'session') {
                await syncSession(item.data as OfflineSession);
            } else if (item.type === 'progress') {
                await syncProgress(item.data as { lessonId: string; progress: number });
            }

            await removeSyncItem(item.id);
            synced++;
            console.log('[Offline] Synced item:', item.id);
        } catch (error) {
            console.error('[Offline] Sync failed for:', item.id, error);
            await incrementSyncRetry(item.id);
            failed++;
        }
    }

    console.log(`[Offline] Sync complete: ${synced} synced, ${failed} failed`);
    return { synced, failed };
}

async function syncSession(session: OfflineSession): Promise<void> {
    const response = await fetch(`${API_URL}/sessions/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(session),
    });

    if (!response.ok) {
        throw new Error(`Sync failed: ${response.status}`);
    }
}

async function syncProgress(data: { lessonId: string; progress: number }): Promise<void> {
    const response = await fetch(`${API_URL}/progress/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error(`Sync failed: ${response.status}`);
    }
}

// ═══════════════════════════════════════════════════════════════
// Storage Info
// ═══════════════════════════════════════════════════════════════

export async function getStorageInfo(): Promise<{
    lessonCount: number;
    sessionCount: number;
    syncQueueCount: number;
    totalSizeBytes: number;
}> {
    const db = await openDatabase();

    const lessons = await db.getAll('lessons');
    const sessions = await db.getAll('sessions');
    const syncQueue = await db.getAll('syncQueue');

    const totalSizeBytes = lessons.reduce((acc, l) => acc + l.sizeBytes, 0);

    return {
        lessonCount: lessons.length,
        sessionCount: sessions.length,
        syncQueueCount: syncQueue.length,
        totalSizeBytes,
    };
}

export function formatBytes(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
