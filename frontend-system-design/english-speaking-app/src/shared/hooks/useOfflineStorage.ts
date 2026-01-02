'use client';

// ═══════════════════════════════════════════════════════════════
// Offline Storage Hook
// Manages offline lesson storage
// ═══════════════════════════════════════════════════════════════

import { useState, useEffect, useCallback } from 'react';
import {
    getAllLessons,
    saveLesson as saveLessonToDb,
    deleteLesson as deleteLessonFromDb,
    getLesson,
    isLessonCached,
    getStorageInfo,
    formatBytes,
} from '@/lib/offlineService';
import type { OfflineLesson, LessonContent } from '@/lib/db';
import type { AITopic, Level, AI_TOPICS } from '@/types';

// ═══════════════════════════════════════════════════════════════
// Types
// ═══════════════════════════════════════════════════════════════

interface UseOfflineStorageReturn {
    cachedLessons: OfflineLesson[];
    isLoading: boolean;
    isDownloading: boolean;
    downloadProgress: number;
    error: string | null;
    downloadLesson: (topic: AITopic, level: Level) => Promise<void>;
    removeLesson: (lessonId: string) => Promise<void>;
    isLessonCached: (topicId: string, level: Level) => boolean;
    getCachedLesson: (lessonId: string) => Promise<OfflineLesson | undefined>;
    refreshLessons: () => Promise<void>;
    storageUsed: string;
    lessonCount: number;
}

// ═══════════════════════════════════════════════════════════════
// Mock Lesson Content Generator
// In production, this would fetch from API
// ═══════════════════════════════════════════════════════════════

function generateLessonContent(topic: AITopic, level: Level): LessonContent {
    const levelDifficulty: Record<Level, number> = {
        A1: 1, A2: 2, B1: 3, B2: 4, C1: 5, C2: 6,
    };

    const difficulty = levelDifficulty[level];

    // Generate vocabulary based on topic
    const vocabulary = [
        { word: 'vocabulary', definition: 'words known or used', example: 'Building vocabulary is essential.', pronunciation: '/vəˈkabyəˌlerē/' },
        { word: 'practice', definition: 'repeated exercise', example: 'Practice makes perfect.', pronunciation: '/ˈpraktəs/' },
        { word: 'fluency', definition: 'speaking smoothly', example: 'Aim for fluency over perfection.', pronunciation: '/ˈflo͞oənsē/' },
    ].slice(0, difficulty + 2);

    // Generate phrases
    const phrases = [
        { phrase: 'How are you?', meaning: 'Greeting', context: 'Casual conversation' },
        { phrase: 'Nice to meet you', meaning: 'Introduction', context: 'Meeting someone new' },
        { phrase: 'What do you think?', meaning: 'Asking opinion', context: 'Discussion' },
    ].slice(0, difficulty + 1);

    // Generate exercises
    const exercises = [
        {
            id: '1',
            type: 'fill-blank' as const,
            question: 'Hello, ___ are you today?',
            options: ['how', 'what', 'who', 'where'],
            correctAnswer: 'how',
            hint: 'Common greeting',
        },
        {
            id: '2',
            type: 'multiple-choice' as const,
            question: 'What is the correct response to "Nice to meet you"?',
            options: ['Goodbye', 'Nice to meet you too', 'See you later', 'Thank you'],
            correctAnswer: 'Nice to meet you too',
        },
    ].slice(0, Math.min(difficulty + 1, 2));

    return {
        vocabulary,
        phrases,
        exercises,
        tips: [
            `Focus on ${topic.name.toLowerCase()} vocabulary`,
            `Practice speaking at ${level} level`,
            'Listen and repeat for better pronunciation',
        ],
    };
}

// ═══════════════════════════════════════════════════════════════
// Hook Implementation
// ═══════════════════════════════════════════════════════════════

export function useOfflineStorage(): UseOfflineStorageReturn {
    const [cachedLessons, setCachedLessons] = useState<OfflineLesson[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDownloading, setIsDownloading] = useState(false);
    const [downloadProgress, setDownloadProgress] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const [storageInfo, setStorageInfo] = useState({ size: 0, count: 0 });

    // Cache lookup set for quick access
    const [cachedIds, setCachedIds] = useState<Set<string>>(new Set());

    // Load cached lessons on mount
    const loadLessons = useCallback(async () => {
        try {
            setIsLoading(true);
            const lessons = await getAllLessons();
            setCachedLessons(lessons);
            setCachedIds(new Set(lessons.map(l => l.id)));

            const info = await getStorageInfo();
            setStorageInfo({ size: info.totalSizeBytes, count: info.lessonCount });
        } catch (err) {
            console.error('[Offline] Failed to load lessons:', err);
            setError('Failed to load offline lessons');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadLessons();
    }, [loadLessons]);

    // Download a lesson for offline access
    const downloadLesson = useCallback(async (topic: AITopic, level: Level) => {
        try {
            setIsDownloading(true);
            setDownloadProgress(0);
            setError(null);

            // Simulate download progress
            const progressInterval = setInterval(() => {
                setDownloadProgress(prev => Math.min(prev + 20, 80));
            }, 200);

            // Generate/fetch lesson content
            // In production, this would be an API call
            const content = generateLessonContent(topic, level);

            clearInterval(progressInterval);
            setDownloadProgress(90);

            // Save to IndexedDB
            await saveLessonToDb(topic, level, content);

            setDownloadProgress(100);

            // Refresh lesson list
            await loadLessons();

            console.log('[Offline] Lesson downloaded:', `${topic.id}-${level}`);
        } catch (err) {
            console.error('[Offline] Download failed:', err);
            setError('Failed to download lesson');
        } finally {
            setIsDownloading(false);
            setDownloadProgress(0);
        }
    }, [loadLessons]);

    // Remove a cached lesson
    const removeLesson = useCallback(async (lessonId: string) => {
        try {
            await deleteLessonFromDb(lessonId);
            await loadLessons();
            console.log('[Offline] Lesson removed:', lessonId);
        } catch (err) {
            console.error('[Offline] Remove failed:', err);
            setError('Failed to remove lesson');
        }
    }, [loadLessons]);

    // Check if a lesson is cached
    const checkLessonCached = useCallback((topicId: string, level: Level): boolean => {
        return cachedIds.has(`${topicId}-${level}`);
    }, [cachedIds]);

    // Get a cached lesson
    const getCachedLesson = useCallback(async (lessonId: string): Promise<OfflineLesson | undefined> => {
        return getLesson(lessonId);
    }, []);

    return {
        cachedLessons,
        isLoading,
        isDownloading,
        downloadProgress,
        error,
        downloadLesson,
        removeLesson,
        isLessonCached: checkLessonCached,
        getCachedLesson,
        refreshLessons: loadLessons,
        storageUsed: formatBytes(storageInfo.size),
        lessonCount: storageInfo.count,
    };
}
