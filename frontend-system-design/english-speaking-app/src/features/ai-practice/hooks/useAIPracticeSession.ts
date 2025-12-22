'use client';

import { useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Level, AIMessage, AI_TOPICS } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';

// ═══════════════════════════════════════════════════════════════
// Types
// ═══════════════════════════════════════════════════════════════
interface UseAIPracticeSessionOptions {
    topic: string | null;
    level: Level;
    topicName?: string;
}

interface UseAIPracticeSessionReturn {
    messages: AIMessage[];
    isLoading: boolean;
    inputBlocked: boolean;
    cooldownEndTime: number | null;
    startSession: () => Promise<void>;
    sendMessage: (content: string) => Promise<void>;
    resetSession: () => void;
}

// ═══════════════════════════════════════════════════════════════
// Hook Implementation
// ═══════════════════════════════════════════════════════════════
export function useAIPracticeSession({
    topic,
    level,
    topicName,
}: UseAIPracticeSessionOptions): UseAIPracticeSessionReturn {
    const router = useRouter();
    const [messages, setMessages] = useState<AIMessage[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [inputBlocked, setInputBlocked] = useState(false);
    const [cooldownEndTime, setCooldownEndTime] = useState<number | null>(null);

    const startSession = useCallback(async () => {
        if (!topic) return;

        setIsLoading(true);
        try {
            const response = await fetch(`${API_URL}/ai/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    topic: topicName || topic,
                    level,
                    messages: [],
                }),
            });

            if (!response.ok) throw new Error('Failed to start AI session');

            const aiResponse = await response.json();

            setMessages([{
                id: Date.now().toString(),
                role: 'assistant',
                content: aiResponse.content,
                timestamp: new Date(),
            }]);
        } catch (error) {
            console.error('Failed to start AI session:', error);
            setMessages([{
                id: Date.now().toString(),
                role: 'assistant',
                content: `Hello! Welcome to our ${topicName || 'English'} practice session. I'm your AI tutor. Let's practice together! How are you feeling today?`,
                timestamp: new Date(),
            }]);
        } finally {
            setIsLoading(false);
        }
    }, [topic, level, topicName]);

    const sendMessage = useCallback(async (content: string) => {
        const messageText = content.trim();
        if (!messageText || isLoading) return;

        const userMessage: AIMessage = {
            id: Date.now().toString(),
            role: 'user',
            content: messageText,
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setIsLoading(true);

        try {
            const response = await fetch(`${API_URL}/ai/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    topic: topicName || topic,
                    level,
                    messages: [...messages, userMessage].map(m => ({
                        role: m.role,
                        content: m.content,
                    })),
                }),
            });

            // Handle rate limiting
            if (response.status === 429) {
                const errorData = await response.json();
                setInputBlocked(true);
                setCooldownEndTime(errorData.cooldownUntil || Date.now() + 5 * 60 * 1000);

                setMessages((prev) => [...prev, {
                    id: (Date.now() + 1).toString(),
                    role: 'assistant',
                    content: `⚠️ **Rate Limit Exceeded - Violation #${errorData.violation || 1}**\n\n${errorData.message}\n\n🔒 **INPUT BLOCKED** - Please wait before sending more messages.`,
                    timestamp: new Date(),
                    isError: true,
                    errorType: 'rate_limited',
                }]);
                return;
            }

            // Handle account ban
            if (response.status === 403) {
                const errorData = await response.json();
                setInputBlocked(true);

                if (errorData.forceLogout) {
                    setMessages((prev) => [...prev, {
                        id: (Date.now() + 1).toString(),
                        role: 'assistant',
                        content: `🚫 **ACCOUNT BANNED FOR 1 DAY**\n\n${errorData.message}\n\n⏰ Logging out NOW...`,
                        timestamp: new Date(),
                        isError: true,
                        errorType: 'blocked',
                    }]);

                    const { useAuthStore } = require('@/stores/authStore');
                    useAuthStore.getState().logout();
                    router.push('/login?banned=true');
                    return;
                }

                setMessages((prev) => [...prev, {
                    id: (Date.now() + 1).toString(),
                    role: 'assistant',
                    content: `🚫 **ACCOUNT PERMANENTLY BLOCKED**\n\n${errorData.message}`,
                    timestamp: new Date(),
                    isError: true,
                    errorType: 'blocked',
                }]);
                return;
            }

            if (!response.ok) throw new Error('Failed to get AI response');

            const aiResponse = await response.json();
            setMessages((prev) => [...prev, {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: aiResponse.content,
                timestamp: new Date(),
            }]);
        } catch (error) {
            console.error('AI response error:', error);
            setMessages((prev) => [...prev, {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: "I apologize, but I'm having trouble responding right now. Please try again.",
                timestamp: new Date(),
            }]);
        } finally {
            setIsLoading(false);
        }
    }, [topic, level, topicName, messages, isLoading, router]);

    const resetSession = useCallback(() => {
        setMessages([]);
        setInputBlocked(false);
        setCooldownEndTime(null);
    }, []);

    return {
        messages,
        isLoading,
        inputBlocked,
        cooldownEndTime,
        startSession,
        sendMessage,
        resetSession,
    };
}
