'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { Paper, Group, ActionIcon, Tooltip, Box, ColorSwatch, Slider, Text } from '@mantine/core';
import { io, Socket } from 'socket.io-client';
import {
    IconPencil,
    IconEraser,
    IconSquare,
    IconCircle,
    IconLine,
    IconArrowRight,
    IconTypography,
    IconTrash,
    IconDownload,
    IconPointer,
} from '@tabler/icons-react';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3002';

// ═══════════════════════════════════════════════════════════════
// Types
// ═══════════════════════════════════════════════════════════════
export type DrawingTool = 'select' | 'pen' | 'eraser' | 'rectangle' | 'circle' | 'line' | 'arrow' | 'text';

export interface DrawingElement {
    id: string;
    type: DrawingTool;
    points?: { x: number; y: number }[];
    startX?: number;
    startY?: number;
    endX?: number;
    endY?: number;
    color: string;
    strokeWidth: number;
    text?: string;
    userId: string;
    timestamp: number;
}

interface WhiteboardProps {
    roomId: string;
    userId: string;
}

// ═══════════════════════════════════════════════════════════════
// Constants
// ═══════════════════════════════════════════════════════════════
const COLORS = [
    '#000000', '#ffffff', '#ff0000', '#00ff00', '#0000ff',
    '#ffff00', '#ff00ff', '#00ffff', '#ff6600', '#9933ff',
];

const TOOLS: { tool: DrawingTool; icon: typeof IconPencil; label: string }[] = [
    { tool: 'select', icon: IconPointer, label: 'Select' },
    { tool: 'pen', icon: IconPencil, label: 'Pen' },
    { tool: 'eraser', icon: IconEraser, label: 'Eraser' },
    { tool: 'line', icon: IconLine, label: 'Line' },
    { tool: 'arrow', icon: IconArrowRight, label: 'Arrow' },
    { tool: 'rectangle', icon: IconSquare, label: 'Rectangle' },
    { tool: 'circle', icon: IconCircle, label: 'Circle' },
    { tool: 'text', icon: IconTypography, label: 'Text' },
];

// ═══════════════════════════════════════════════════════════════
// Component
// ═══════════════════════════════════════════════════════════════
export function Whiteboard({ roomId, userId }: WhiteboardProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const socketRef = useRef<Socket | null>(null);
    
    const [tool, setTool] = useState<DrawingTool>('pen');
    const [color, setColor] = useState('#000000');
    const [strokeWidth, setStrokeWidth] = useState(3);
    const [isDrawing, setIsDrawing] = useState(false);
    const [elements, setElements] = useState<DrawingElement[]>([]);
    const [currentElement, setCurrentElement] = useState<DrawingElement | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    // Get canvas context
    const getContext = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return null;
        return canvas.getContext('2d');
    }, []);

    // Draw a single element
    const drawElement = useCallback((ctx: CanvasRenderingContext2D, el: DrawingElement) => {
        ctx.strokeStyle = el.type === 'eraser' ? '#ffffff' : el.color;
        ctx.lineWidth = el.strokeWidth;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        switch (el.type) {
            case 'pen':
            case 'eraser':
                if (el.points && el.points.length > 0) {
                    ctx.beginPath();
                    ctx.moveTo(el.points[0].x, el.points[0].y);
                    el.points.forEach(p => ctx.lineTo(p.x, p.y));
                    ctx.stroke();
                }
                break;

            case 'line':
                if (el.startX !== undefined && el.endX !== undefined) {
                    ctx.beginPath();
                    ctx.moveTo(el.startX, el.startY!);
                    ctx.lineTo(el.endX, el.endY!);
                    ctx.stroke();
                }
                break;

            case 'arrow':
                if (el.startX !== undefined && el.endX !== undefined) {
                    const headLength = 15;
                    const dx = el.endX - el.startX;
                    const dy = el.endY! - el.startY!;
                    const angle = Math.atan2(dy, dx);

                    ctx.beginPath();
                    ctx.moveTo(el.startX, el.startY!);
                    ctx.lineTo(el.endX, el.endY!);
                    ctx.stroke();

                    // Arrow head
                    ctx.beginPath();
                    ctx.moveTo(el.endX, el.endY!);
                    ctx.lineTo(
                        el.endX - headLength * Math.cos(angle - Math.PI / 6),
                        el.endY! - headLength * Math.sin(angle - Math.PI / 6)
                    );
                    ctx.moveTo(el.endX, el.endY!);
                    ctx.lineTo(
                        el.endX - headLength * Math.cos(angle + Math.PI / 6),
                        el.endY! - headLength * Math.sin(angle + Math.PI / 6)
                    );
                    ctx.stroke();
                }
                break;

            case 'rectangle':
                if (el.startX !== undefined && el.endX !== undefined) {
                    ctx.beginPath();
                    ctx.rect(el.startX, el.startY!, el.endX - el.startX, el.endY! - el.startY!);
                    ctx.stroke();
                }
                break;

            case 'circle':
                if (el.startX !== undefined && el.endX !== undefined) {
                    const radiusX = Math.abs(el.endX - el.startX) / 2;
                    const radiusY = Math.abs(el.endY! - el.startY!) / 2;
                    const centerX = el.startX + (el.endX - el.startX) / 2;
                    const centerY = el.startY! + (el.endY! - el.startY!) / 2;

                    ctx.beginPath();
                    ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, 2 * Math.PI);
                    ctx.stroke();
                }
                break;

            case 'text':
                if (el.text && el.startX !== undefined) {
                    ctx.font = `${el.strokeWidth * 6}px Arial`;
                    ctx.fillStyle = el.color;
                    ctx.fillText(el.text, el.startX, el.startY!);
                }
                break;
        }
    }, []);

    // Redraw all elements
    const redraw = useCallback((elementsToRedraw: DrawingElement[], current: DrawingElement | null = null) => {
        const ctx = getContext();
        const canvas = canvasRef.current;
        if (!ctx || !canvas) return;

        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        elementsToRedraw.forEach(el => drawElement(ctx, el));
        if (current) drawElement(ctx, current);
    }, [getContext, drawElement]);

    // Connect to socket for whiteboard
    useEffect(() => {
        const socket = io(SOCKET_URL, {
            transports: ['websocket'],
            autoConnect: true,
        });

        socketRef.current = socket;

        socket.on('connect', () => {
            console.log('[Whiteboard] Socket connected');
            setIsConnected(true);
            // Join whiteboard room
            socket.emit('whiteboard:join', { roomId, userId });
        });

        socket.on('disconnect', () => {
            console.log('[Whiteboard] Socket disconnected');
            setIsConnected(false);
        });

        // Receive initial sync
        socket.on('whiteboard:sync', (serverElements: DrawingElement[]) => {
            console.log('[Whiteboard] Synced elements:', serverElements.length);
            setElements(serverElements);
        });

        // Receive new drawing from other users
        socket.on('whiteboard:draw', (element: DrawingElement) => {
            console.log('[Whiteboard] Received drawing from:', element.userId);
            setElements(prev => [...prev, element]);
        });

        // Handle clear
        socket.on('whiteboard:clear', () => {
            console.log('[Whiteboard] Board cleared');
            setElements([]);
        });

        return () => {
            socket.emit('whiteboard:leave', { roomId, userId });
            socket.disconnect();
            socketRef.current = null;
        };
    }, [roomId, userId]);

    // Resize canvas
    useEffect(() => {
        const container = containerRef.current;
        const canvas = canvasRef.current;
        if (!container || !canvas) return;

        const resize = () => {
            const rect = container.getBoundingClientRect();
            canvas.width = rect.width;
            canvas.height = rect.height;
            redraw(elements, currentElement);
        };

        resize();
        window.addEventListener('resize', resize);
        return () => window.removeEventListener('resize', resize);
    }, [elements, currentElement, redraw]);

    // Redraw when elements change
    useEffect(() => {
        redraw(elements, currentElement);
    }, [elements, currentElement, redraw]);

    // Mouse handlers
    const getMousePos = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return { x: 0, y: 0 };
        const rect = canvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        };
    };

    const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (tool === 'select') return;

        const pos = getMousePos(e);
        setIsDrawing(true);

        if (tool === 'text') {
            const text = prompt('Enter text:');
            if (text) {
                const newElement: DrawingElement = {
                    id: `${userId}-${Date.now()}`,
                    type: 'text',
                    startX: pos.x,
                    startY: pos.y,
                    color,
                    strokeWidth,
                    text,
                    userId,
                    timestamp: Date.now(),
                };
                setElements(prev => [...prev, newElement]);
                // Send to server
                socketRef.current?.emit('whiteboard:draw', { roomId, element: newElement });
            }
            return;
        }

        const newElement: DrawingElement = {
            id: `${userId}-${Date.now()}`,
            type: tool,
            color,
            strokeWidth,
            userId,
            timestamp: Date.now(),
        };

        if (tool === 'pen' || tool === 'eraser') {
            newElement.points = [pos];
        } else {
            newElement.startX = pos.x;
            newElement.startY = pos.y;
            newElement.endX = pos.x;
            newElement.endY = pos.y;
        }

        setCurrentElement(newElement);
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isDrawing || !currentElement) return;

        const pos = getMousePos(e);

        if (currentElement.type === 'pen' || currentElement.type === 'eraser') {
            setCurrentElement({
                ...currentElement,
                points: [...(currentElement.points || []), pos],
            });
        } else {
            setCurrentElement({
                ...currentElement,
                endX: pos.x,
                endY: pos.y,
            });
        }
    };

    const handleMouseUp = () => {
        if (!isDrawing || !currentElement) return;

        setIsDrawing(false);
        setElements(prev => [...prev, currentElement]);
        // Send to server
        socketRef.current?.emit('whiteboard:draw', { roomId, element: currentElement });
        setCurrentElement(null);
    };

    // Clear canvas
    const handleClear = () => {
        setElements([]);
        socketRef.current?.emit('whiteboard:clear', { roomId, userId });
    };

    // Download as image
    const handleDownload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const link = document.createElement('a');
        link.download = `whiteboard-${roomId}.png`;
        link.href = canvas.toDataURL();
        link.click();
    };

    return (
        <Paper shadow="sm" radius="lg" style={{ overflow: 'hidden', height: '100%' }}>
            {/* Toolbar */}
            <Group p="xs" style={{ borderBottom: '1px solid #eee', background: '#f8f9fa' }}>
                {/* Connection Status */}
                <Tooltip label={isConnected ? 'Connected' : 'Disconnected'}>
                    <Box
                        style={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            background: isConnected ? '#40c057' : '#fa5252',
                        }}
                    />
                </Tooltip>

                {/* Tools */}
                <Group gap={4}>
                    {TOOLS.map(({ tool: t, icon: Icon, label }) => (
                        <Tooltip key={t} label={label}>
                            <ActionIcon
                                size="lg"
                                variant={tool === t ? 'filled' : 'light'}
                                color={tool === t ? 'blue' : 'gray'}
                                onClick={() => setTool(t)}
                            >
                                <Icon size={18} />
                            </ActionIcon>
                        </Tooltip>
                    ))}
                </Group>

                <Box style={{ width: 1, height: 30, background: '#ddd' }} />

                {/* Colors */}
                <Group gap={4}>
                    {COLORS.map(c => (
                        <ColorSwatch
                            key={c}
                            color={c}
                            size={24}
                            style={{
                                cursor: 'pointer',
                                border: color === c ? '2px solid #228be6' : '1px solid #ccc',
                            }}
                            onClick={() => setColor(c)}
                        />
                    ))}
                </Group>

                <Box style={{ width: 1, height: 30, background: '#ddd' }} />

                {/* Stroke Width */}
                <Group gap="xs" style={{ width: 120 }}>
                    <Text size="xs" c="dimmed">Size</Text>
                    <Slider
                        value={strokeWidth}
                        onChange={setStrokeWidth}
                        min={1}
                        max={20}
                        size="sm"
                        style={{ flex: 1 }}
                    />
                </Group>

                <Box style={{ flex: 1 }} />

                {/* Actions */}
                <Group gap={4}>
                    <Tooltip label="Clear All">
                        <ActionIcon size="lg" variant="light" color="red" onClick={handleClear}>
                            <IconTrash size={18} />
                        </ActionIcon>
                    </Tooltip>
                    <Tooltip label="Download">
                        <ActionIcon size="lg" variant="light" color="green" onClick={handleDownload}>
                            <IconDownload size={18} />
                        </ActionIcon>
                    </Tooltip>
                </Group>
            </Group>

            {/* Canvas */}
            <Box
                ref={containerRef}
                style={{
                    flex: 1,
                    height: 'calc(100% - 50px)',
                    cursor: tool === 'select' ? 'default' : 'crosshair',
                }}
            >
                <canvas
                    ref={canvasRef}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    style={{ display: 'block' }}
                />
            </Box>
        </Paper>
    );
}
