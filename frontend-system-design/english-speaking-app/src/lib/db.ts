// ═══════════════════════════════════════════════════════════════
// IndexedDB Database Wrapper
// For offline lesson storage
// ═══════════════════════════════════════════════════════════════

import { openDB, DBSchema, IDBPDatabase } from 'idb';
import type { AITopic, Level, AIMessage } from '@/types';

// ═══════════════════════════════════════════════════════════════
// Types
// ═══════════════════════════════════════════════════════════════

export interface VocabularyItem {
    word: string;
    definition: string;
    example: string;
    pronunciation?: string;
}

export interface PhraseItem {
    phrase: string;
    meaning: string;
    context: string;
}

export interface Exercise {
    id: string;
    type: 'fill-blank' | 'multiple-choice' | 'speaking' | 'matching';
    question: string;
    options?: string[];
    correctAnswer: string;
    hint?: string;
}

export interface LessonContent {
    vocabulary: VocabularyItem[];
    phrases: PhraseItem[];
    exercises: Exercise[];
    tips?: string[];
}

export interface OfflineLesson {
    id: string;
    topic: AITopic;
    level: Level;
    content: LessonContent;
    downloadedAt: Date;
    lastAccessedAt: Date;
    sizeBytes: number;
}

export interface OfflineSession {
    id: string;
    lessonId: string;
    messages: AIMessage[];
    startedAt: Date;
    endedAt?: Date;
    synced: boolean;
}

export interface SyncQueueItem {
    id: string;
    type: 'session' | 'progress';
    data: unknown;
    createdAt: Date;
    retries: number;
}

// ═══════════════════════════════════════════════════════════════
// Database Schema
// ═══════════════════════════════════════════════════════════════

interface EnglishAppDB extends DBSchema {
    lessons: {
        key: string;
        value: OfflineLesson;
        indexes: {
            'by-topic': string;
            'by-level': Level;
            'by-downloaded': Date;
        };
    };
    sessions: {
        key: string;
        value: OfflineSession;
        indexes: {
            'by-lesson': string;
            'by-synced': number; // 0 or 1 (boolean as number for indexing)
        };
    };
    syncQueue: {
        key: string;
        value: SyncQueueItem;
        indexes: {
            'by-type': string;
            'by-created': Date;
        };
    };
}

// ═══════════════════════════════════════════════════════════════
// Constants
// ═══════════════════════════════════════════════════════════════

export const DB_NAME = 'english-speaking-app';
export const DB_VERSION = 1;

export const STORES = {
    LESSONS: 'lessons',
    SESSIONS: 'sessions',
    SYNC_QUEUE: 'syncQueue',
} as const;

// ═══════════════════════════════════════════════════════════════
// Database Instance
// ═══════════════════════════════════════════════════════════════

let dbInstance: IDBPDatabase<EnglishAppDB> | null = null;

export async function openDatabase(): Promise<IDBPDatabase<EnglishAppDB>> {
    if (dbInstance) {
        return dbInstance;
    }

    dbInstance = await openDB<EnglishAppDB>(DB_NAME, DB_VERSION, {
        upgrade(db, oldVersion, newVersion, transaction) {
            console.log(`[DB] Upgrading from version ${oldVersion} to ${newVersion}`);

            // Create lessons store
            if (!db.objectStoreNames.contains('lessons')) {
                const lessonsStore = db.createObjectStore('lessons', { keyPath: 'id' });
                lessonsStore.createIndex('by-topic', 'topic.id');
                lessonsStore.createIndex('by-level', 'level');
                lessonsStore.createIndex('by-downloaded', 'downloadedAt');
            }

            // Create sessions store
            if (!db.objectStoreNames.contains('sessions')) {
                const sessionsStore = db.createObjectStore('sessions', { keyPath: 'id' });
                sessionsStore.createIndex('by-lesson', 'lessonId');
                sessionsStore.createIndex('by-synced', 'synced');
            }

            // Create sync queue store
            if (!db.objectStoreNames.contains('syncQueue')) {
                const syncStore = db.createObjectStore('syncQueue', { keyPath: 'id' });
                syncStore.createIndex('by-type', 'type');
                syncStore.createIndex('by-created', 'createdAt');
            }
        },
        blocked() {
            console.warn('[DB] Database upgrade blocked. Please close other tabs.');
        },
        blocking() {
            console.warn('[DB] This connection is blocking a database upgrade.');
            dbInstance?.close();
            dbInstance = null;
        },
        terminated() {
            console.error('[DB] Database connection terminated unexpectedly.');
            dbInstance = null;
        },
    });

    console.log('[DB] Database opened successfully');
    return dbInstance;
}

export async function closeDatabase(): Promise<void> {
    if (dbInstance) {
        dbInstance.close();
        dbInstance = null;
        console.log('[DB] Database closed');
    }
}

// ═══════════════════════════════════════════════════════════════
// Utility Functions
// ═══════════════════════════════════════════════════════════════

export function generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export function calculateSize(obj: unknown): number {
    return new Blob([JSON.stringify(obj)]).size;
}
