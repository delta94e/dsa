import { useRef, useCallback, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { Vector2, distance } from '../types';

// ═══════════════════════════════════════════════════════════════
// SERVER TYPES
// ═══════════════════════════════════════════════════════════════

interface SnakeDto {
    id: string;
    name: string;
    segments: Array<{ x: number; y: number; radius: number }>;
    angle: number;
    color: string;
    score: number;
    isBoosting: boolean;
}

interface OrbDto {
    id: string;
    x: number;
    y: number;
    value: number;
    color: string;
    radius: number;
}

interface WorldUpdateDto {
    snakes: SnakeDto[];
    orbs: OrbDto[];
    tick: number;
}

interface LeaderboardEntry {
    id: string;
    name: string;
    score: number;
}

interface JoinedData {
    id: string;
    name: string;
    color: string;
}

// ═══════════════════════════════════════════════════════════════
// CONFIG
// ═══════════════════════════════════════════════════════════════

const SERVER_URL = 'http://localhost:3001';
const WORLD_WIDTH = 3000;
const WORLD_HEIGHT = 3000;

// ═══════════════════════════════════════════════════════════════
// HOOK
// ═══════════════════════════════════════════════════════════════

export function useMultiplayerGame() {
    const [isConnected, setIsConnected] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [playerId, setPlayerId] = useState<string | null>(null);
    const [playerColor, setPlayerColor] = useState<string>('#4ECDC4');
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
    const [isDead, setIsDead] = useState(false);

    const socketRef = useRef<Socket | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const animationRef = useRef<number | null>(null);

    const worldRef = useRef<WorldUpdateDto>({ snakes: [], orbs: [], tick: 0 });
    const cameraRef = useRef({ x: WORLD_WIDTH / 2, y: WORLD_HEIGHT / 2, zoom: 1 });
    const mouseRef = useRef({ x: 0, y: 0 });
    const boostRef = useRef(false);
    const inputIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    // ═══════════════════════════════════════════════════════════
    // SOCKET CONNECTION
    // ═══════════════════════════════════════════════════════════

    const connect = useCallback(() => {
        if (socketRef.current?.connected) return;

        const socket = io(SERVER_URL, {
            transports: ['websocket', 'polling'],
        });

        socket.on('connect', () => {
            console.log('🟢 Connected to server');
            setIsConnected(true);
        });

        socket.on('disconnect', () => {
            console.log('🔴 Disconnected from server');
            setIsConnected(false);
            setIsPlaying(false);
        });

        socket.on('joined', (data: JoinedData) => {
            console.log('🐍 Joined game:', data);
            setPlayerId(data.id);
            setPlayerColor(data.color);
            setIsPlaying(true);
            setIsDead(false);
        });

        socket.on('world_update', (data: WorldUpdateDto) => {
            worldRef.current = data;
        });

        socket.on('leaderboard', (data: LeaderboardEntry[]) => {
            setLeaderboard(data);
        });

        socket.on('player_died', () => {
            console.log('💀 You died!');
            setIsDead(true);
            setIsPlaying(false);
        });

        socketRef.current = socket;
    }, []);

    const disconnect = useCallback(() => {
        if (socketRef.current) {
            socketRef.current.disconnect();
            socketRef.current = null;
        }
        setIsConnected(false);
        setIsPlaying(false);
    }, []);

    // ═══════════════════════════════════════════════════════════
    // GAME ACTIONS
    // ═══════════════════════════════════════════════════════════

    const joinGame = useCallback((name: string) => {
        if (!socketRef.current?.connected) {
            connect();
            // Wait for connection then join
            socketRef.current?.once('connect', () => {
                socketRef.current?.emit('join_game', { name });
            });
        } else {
            socketRef.current.emit('join_game', { name });
        }
    }, [connect]);

    const respawn = useCallback((name: string) => {
        socketRef.current?.emit('respawn', { name });
        setIsDead(false);
    }, []);

    // ═══════════════════════════════════════════════════════════
    // INPUT HANDLING
    // ═══════════════════════════════════════════════════════════

    const sendInput = useCallback(() => {
        if (!socketRef.current?.connected || !isPlaying || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;

        const angle = Math.atan2(
            mouseRef.current.y - centerY,
            mouseRef.current.x - centerX
        );

        socketRef.current.emit('input', {
            angle,
            boost: boostRef.current,
        });
    }, [isPlaying]);

    // Start sending input at 30Hz
    useEffect(() => {
        if (isPlaying) {
            inputIntervalRef.current = setInterval(sendInput, 33);
        } else {
            if (inputIntervalRef.current) {
                clearInterval(inputIntervalRef.current);
                inputIntervalRef.current = null;
            }
        }

        return () => {
            if (inputIntervalRef.current) {
                clearInterval(inputIntervalRef.current);
            }
        };
    }, [isPlaying, sendInput]);

    // ═══════════════════════════════════════════════════════════
    // RENDERING
    // ═══════════════════════════════════════════════════════════

    const render = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const world = worldRef.current;
        const camera = cameraRef.current;

        // Update camera to follow player
        const mySnake = world.snakes.find(s => s.id === playerId);
        if (mySnake && mySnake.segments.length > 0) {
            const head = mySnake.segments[0];
            camera.x += (head.x - camera.x) * 0.1;
            camera.y += (head.y - camera.y) * 0.1;
            camera.zoom = Math.max(0.5, 1 - mySnake.segments.length * 0.002);
        }

        // World to screen conversion
        const w2s = (p: Vector2) => ({
            x: (p.x - camera.x) * camera.zoom + canvas.width / 2,
            y: (p.y - camera.y) * camera.zoom + canvas.height / 2,
        });

        const inView = (p: Vector2) => {
            const s = w2s(p);
            return s.x > -100 && s.x < canvas.width + 100 && s.y > -100 && s.y < canvas.height + 100;
        };

        // Clear
        ctx.fillStyle = '#1a1a2e';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Grid
        ctx.strokeStyle = 'rgba(255,255,255,0.05)';
        const gs = 50;
        for (let x = ((-camera.x * camera.zoom + canvas.width / 2) % gs); x < canvas.width; x += gs) {
            ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
        }
        for (let y = ((-camera.y * camera.zoom + canvas.height / 2) % gs); y < canvas.height; y += gs) {
            ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
        }

        // Orbs
        for (const orb of world.orbs) {
            if (!inView(orb)) continue;
            const sp = w2s(orb);
            ctx.beginPath();
            ctx.arc(sp.x, sp.y, orb.radius * camera.zoom, 0, Math.PI * 2);
            ctx.fillStyle = orb.color;
            ctx.shadowColor = orb.color;
            ctx.shadowBlur = 10;
            ctx.fill();
            ctx.shadowBlur = 0;
        }

        // Snakes
        for (const snake of world.snakes) {
            for (let i = snake.segments.length - 1; i >= 0; i--) {
                const seg = snake.segments[i];
                if (!inView(seg)) continue;

                const sp = w2s(seg);
                const brightness = 0.5 + 0.5 * (snake.segments.length - i) / snake.segments.length;

                ctx.beginPath();
                ctx.arc(sp.x, sp.y, seg.radius * camera.zoom, 0, Math.PI * 2);

                // Parse color and apply brightness
                const r = parseInt(snake.color.slice(1, 3), 16);
                const g = parseInt(snake.color.slice(3, 5), 16);
                const b = parseInt(snake.color.slice(5, 7), 16);
                ctx.fillStyle = `rgb(${Math.round(r * brightness)},${Math.round(g * brightness)},${Math.round(b * brightness)})`;
                ctx.fill();

                // Head glow
                if (i === 0) {
                    ctx.shadowColor = snake.color;
                    ctx.shadowBlur = 15;
                    ctx.fill();
                    ctx.shadowBlur = 0;

                    // Eyes
                    const eyeOffset = seg.radius * camera.zoom * 0.4;
                    const eyeRadius = seg.radius * camera.zoom * 0.25;
                    for (const side of [-1, 1]) {
                        const eyeX = sp.x + Math.cos(snake.angle + side * 0.5) * eyeOffset;
                        const eyeY = sp.y + Math.sin(snake.angle + side * 0.5) * eyeOffset;
                        ctx.beginPath();
                        ctx.arc(eyeX, eyeY, eyeRadius, 0, Math.PI * 2);
                        ctx.fillStyle = '#fff';
                        ctx.fill();
                        ctx.beginPath();
                        ctx.arc(
                            eyeX + Math.cos(snake.angle) * eyeRadius * 0.3,
                            eyeY + Math.sin(snake.angle) * eyeRadius * 0.3,
                            eyeRadius * 0.5, 0, Math.PI * 2
                        );
                        ctx.fillStyle = '#000';
                        ctx.fill();
                    }
                }
            }

            // Name tag
            const headScreen = w2s(snake.segments[0]);
            ctx.fillStyle = snake.id === playerId ? '#4ade80' : '#fff';
            ctx.font = snake.id === playerId ? 'bold 14px Arial' : '12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(snake.name, headScreen.x, headScreen.y - 25);
        }

        // UI
        if (mySnake) {
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 24px Arial';
            ctx.textAlign = 'left';
            ctx.fillText(`Score: ${mySnake.score}`, 20, 40);
            ctx.fillText(`Length: ${mySnake.segments.length}`, 20, 70);
        }

        // Leaderboard
        ctx.fillStyle = '#fff';
        ctx.font = '16px Arial';
        ctx.textAlign = 'right';
        ctx.fillText('🏆 Leaderboard', canvas.width - 20, 30);
        leaderboard.slice(0, 5).forEach((entry, i) => {
            const isMe = entry.id === playerId;
            ctx.fillStyle = isMe ? '#4ade80' : '#94a3b8';
            ctx.font = isMe ? 'bold 14px Arial' : '14px Arial';
            ctx.fillText(`${i + 1}. ${entry.name}: ${entry.score}`, canvas.width - 20, 55 + i * 25);
        });

        // Minimap
        const mapSize = 150;
        const mapMargin = 20;
        const mapX = mapMargin;
        const mapY = canvas.height - mapSize - mapMargin;
        const scale = mapSize / Math.max(WORLD_WIDTH, WORLD_HEIGHT);

        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.fillRect(mapX, mapY, mapSize, mapSize);
        ctx.strokeStyle = 'rgba(255,255,255,0.3)';
        ctx.strokeRect(mapX, mapY, mapSize, mapSize);

        for (const snake of world.snakes) {
            const head = snake.segments[0];
            const dotX = mapX + head.x * scale;
            const dotY = mapY + head.y * scale;
            ctx.beginPath();
            ctx.arc(dotX, dotY, snake.id === playerId ? 4 : 2, 0, Math.PI * 2);
            ctx.fillStyle = snake.id === playerId ? '#fff' : snake.color;
            ctx.fill();
        }

        animationRef.current = requestAnimationFrame(render);
    }, [playerId, leaderboard]);

    // Start render loop
    useEffect(() => {
        if (isPlaying || isDead) {
            animationRef.current = requestAnimationFrame(render);
        }
        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [isPlaying, isDead, render]);

    // ═══════════════════════════════════════════════════════════
    // EVENT HANDLERS
    // ═══════════════════════════════════════════════════════════

    const setCanvas = useCallback((canvas: HTMLCanvasElement | null) => {
        canvasRef.current = canvas;
    }, []);

    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        mouseRef.current = { x: e.clientX, y: e.clientY };
    }, []);

    const handleMouseDown = useCallback(() => { boostRef.current = true; }, []);
    const handleMouseUp = useCallback(() => { boostRef.current = false; }, []);

    // Keyboard
    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.code === 'Space') boostRef.current = true;
        };
        const onKeyUp = (e: KeyboardEvent) => {
            if (e.code === 'Space') boostRef.current = false;
        };

        document.addEventListener('keydown', onKeyDown);
        document.addEventListener('keyup', onKeyUp);
        return () => {
            document.removeEventListener('keydown', onKeyDown);
            document.removeEventListener('keyup', onKeyUp);
        };
    }, []);

    // Cleanup
    useEffect(() => {
        return () => {
            disconnect();
        };
    }, [disconnect]);

    return {
        isConnected,
        isPlaying,
        isDead,
        playerId,
        playerColor,
        leaderboard,
        connect,
        disconnect,
        joinGame,
        respawn,
        setCanvas,
        handleMouseMove,
        handleMouseDown,
        handleMouseUp,
    };
}
