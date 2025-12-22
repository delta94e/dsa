'use client';

import { useState, useCallback } from 'react';
import { Level, AIMessage } from '@/types';
import { trpc } from '@/trpc/client';

export function useAIChat(topic: string, level: Level) {
    const [messages, setMessages] = useState<AIMessage[]>([]);

    const mutation = trpc.ai.chat.useMutation({
        onSuccess: (response) => {
            const aiMessage: AIMessage = {
                id: Date.now().toString(),
                role: 'assistant',
                content: response.content,
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, aiMessage]);
        },
    });

    const sendMessage = useCallback(
        (content: string) => {
            // Add user message immediately
            const userMessage: AIMessage = {
                id: (Date.now() - 1).toString(),
                role: 'user',
                content,
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, userMessage]);

            // Send to backend via tRPC
            mutation.mutate({
                topic,
                level,
                messages: [
                    ...messages,
                    { role: 'user' as const, content },
                ],
            });
        },
        [mutation, topic, level, messages]
    );

    const reset = useCallback(() => {
        setMessages([]);
    }, []);

    return {
        messages,
        sendMessage,
        isLoading: mutation.isPending,
        error: mutation.error,
        reset,
    };
}
