'use client';

import { useEffect, useCallback, useRef, useState } from 'react';
import { DrawingElement } from '../components/Whiteboard';

interface UseWhiteboardOptions {
    roomId: string;
    userId: string;
    socket: any; // Socket.IO instance
}

interface UseWhiteboardReturn {
    elements: DrawingElement[];
    addElement: (element: DrawingElement) => void;
    setElements: (elements: DrawingElement[]) => void;
    clearBoard: () => void;
    isConnected: boolean;
}

export function useWhiteboard({ roomId, userId, socket }: UseWhiteboardOptions): UseWhiteboardReturn {
    const [elements, setElementsState] = useState<DrawingElement[]>([]);
    const [isConnected, setIsConnected] = useState(false);
    const elementsRef = useRef<DrawingElement[]>([]);

    // Sync ref with state
    useEffect(() => {
        elementsRef.current = elements;
    }, [elements]);

    // Socket connection for whiteboard
    useEffect(() => {
        if (!socket) return;

        // Join whiteboard room
        socket.emit('whiteboard:join', { roomId, userId });
        setIsConnected(true);

        // Handle incoming drawings from other users
        socket.on('whiteboard:draw', (element: DrawingElement) => {
            if (element.userId !== userId) {
                setElementsState(prev => [...prev, element]);
            }
        });

        // Handle full board sync (when joining)
        socket.on('whiteboard:sync', (serverElements: DrawingElement[]) => {
            setElementsState(serverElements);
        });

        // Handle clear board
        socket.on('whiteboard:clear', () => {
            setElementsState([]);
        });

        return () => {
            socket.emit('whiteboard:leave', { roomId, userId });
            socket.off('whiteboard:draw');
            socket.off('whiteboard:sync');
            socket.off('whiteboard:clear');
            setIsConnected(false);
        };
    }, [socket, roomId, userId]);

    // Add a new element and broadcast
    const addElement = useCallback((element: DrawingElement) => {
        setElementsState(prev => [...prev, element]);
        socket?.emit('whiteboard:draw', { roomId, element });
    }, [socket, roomId]);

    // Set all elements (for external control)
    const setElements = useCallback((newElements: DrawingElement[]) => {
        setElementsState(newElements);
    }, []);

    // Clear the board
    const clearBoard = useCallback(() => {
        setElementsState([]);
        socket?.emit('whiteboard:clear', { roomId, userId });
    }, [socket, roomId, userId]);

    return {
        elements,
        addElement,
        setElements,
        clearBoard,
        isConnected,
    };
}
