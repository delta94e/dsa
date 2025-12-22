import { useRef, useCallback, useEffect, useState } from 'react';
import {
    Vector2,
    Segment,
    Snake,
    Orb,
    GameConfig,
    DEFAULT_CONFIG,
    SNAKE_COLORS,
    ORB_COLORS,
    distance,
    randomInRange,
    randomColor,
    clamp,
    lerpAngle,
} from '../types';

// ═══════════════════════════════════════════════════════════════
// SPATIAL GRID
// ═══════════════════════════════════════════════════════════════

interface GridItem {
    id: string;
    x: number;
    y: number;
}

interface SegmentWithSnakeId extends GridItem {
    radius: number;
    snakeId: string;
}

class SpatialGrid<T extends GridItem> {
    private cells = new Map<string, Set<T>>();
    private cellSize: number;

    constructor(cellSize = 100) {
        this.cellSize = cellSize;
    }

    clear() {
        this.cells.clear();
    }

    insert(item: T) {
        const key = this.getKey(item.x, item.y);
        if (!this.cells.has(key)) this.cells.set(key, new Set());
        this.cells.get(key)!.add(item);
    }

    query(x: number, y: number, radius: number): T[] {
        const results: T[] = [];
        const minCx = Math.floor((x - radius) / this.cellSize);
        const maxCx = Math.floor((x + radius) / this.cellSize);
        const minCy = Math.floor((y - radius) / this.cellSize);
        const maxCy = Math.floor((y + radius) / this.cellSize);

        for (let cx = minCx; cx <= maxCx; cx++) {
            for (let cy = minCy; cy <= maxCy; cy++) {
                const cell = this.cells.get(`${cx},${cy}`);
                if (cell) {
                    for (const item of cell) {
                        if (distance(item, { x, y }) <= radius) results.push(item);
                    }
                }
            }
        }
        return results;
    }

    private getKey(x: number, y: number) {
        return `${Math.floor(x / this.cellSize)},${Math.floor(y / this.cellSize)}`;
    }
}

// ═══════════════════════════════════════════════════════════════
// HOOK
// ═══════════════════════════════════════════════════════════════

export function useSlitherGame(config: GameConfig = DEFAULT_CONFIG) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [playerName, setPlayerName] = useState('');

    const playerRef = useRef<Snake | null>(null);
    const aiSnakesRef = useRef<Map<string, Snake>>(new Map());
    const orbsRef = useRef<Map<string, Orb>>(new Map());
    const cameraRef = useRef({ x: 0, y: 0, zoom: 1 });
    const mouseRef = useRef({ x: 0, y: 0 });
    const boostRef = useRef(false);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const animationRef = useRef<number | null>(null);

    const orbGridRef = useRef(new SpatialGrid<Orb>(100));
    const segmentGridRef = useRef(new SpatialGrid<SegmentWithSnakeId>(100));

    // ═══════════════════════════════════════════════════════════
    // HELPERS
    // ═══════════════════════════════════════════════════════════

    const createSnake = useCallback((id: string, name: string, x: number, y: number): Snake => {
        const segments: Segment[] = [];
        for (let i = 0; i < config.initialSegments; i++) {
            segments.push({ x: x - i * config.segmentSpacing, y, radius: 8 });
        }
        return {
            id, name, segments,
            angle: 0, targetAngle: 0,
            speed: config.baseSpeed,
            baseSpeed: config.baseSpeed,
            boostSpeed: config.boostSpeed,
            isBoosting: false,
            color: randomColor(SNAKE_COLORS),
            score: 0,
            isAlive: true,
        };
    }, [config]);

    const spawnOrb = useCallback((): Orb => {
        const orb: Orb = {
            id: `orb-${Date.now()}-${Math.random()}`,
            x: randomInRange(50, config.worldWidth - 50),
            y: randomInRange(50, config.worldHeight - 50),
            value: 1, color: randomColor(ORB_COLORS), radius: 5,
        };
        orbsRef.current.set(orb.id, orb);
        return orb;
    }, [config]);

    // ═══════════════════════════════════════════════════════════
    // GAME LOGIC
    // ═══════════════════════════════════════════════════════════

    const updateSnake = useCallback((snake: Snake) => {
        snake.angle = lerpAngle(snake.angle, snake.targetAngle, config.maxTurnSpeed);
        snake.speed = snake.isBoosting ? snake.boostSpeed : snake.baseSpeed;

        const head = snake.segments[0];
        head.x = clamp(head.x + Math.cos(snake.angle) * snake.speed, 0, config.worldWidth);
        head.y = clamp(head.y + Math.sin(snake.angle) * snake.speed, 0, config.worldHeight);

        for (let i = 1; i < snake.segments.length; i++) {
            const cur = snake.segments[i], tgt = snake.segments[i - 1];
            const d = distance(cur, tgt);
            if (d > config.segmentSpacing) {
                const r = config.segmentSpacing / d;
                cur.x = tgt.x - (tgt.x - cur.x) * r;
                cur.y = tgt.y - (tgt.y - cur.y) * r;
            }
        }

        if (snake.isBoosting && snake.segments.length > 10 && Math.random() < 0.1) {
            const rem = snake.segments.pop();
            if (rem) {
                orbsRef.current.set(`b-${Date.now()}`, {
                    id: `b-${Date.now()}`, x: rem.x, y: rem.y,
                    value: 1, color: snake.color, radius: 4,
                });
            }
        }
    }, [config]);

    const updateAI = useCallback((snake: Snake) => {
        if (Math.random() < 0.02) snake.targetAngle += (Math.random() - 0.5);
        const h = snake.segments[0], m = 200;
        if (h.x < m) snake.targetAngle = 0;
        if (h.x > config.worldWidth - m) snake.targetAngle = Math.PI;
        if (h.y < m) snake.targetAngle = Math.PI / 2;
        if (h.y > config.worldHeight - m) snake.targetAngle = -Math.PI / 2;
        snake.isBoosting = Math.random() < 0.1 && snake.segments.length > 20;
    }, [config]);

    const growSnake = useCallback((snake: Snake, amt: number) => {
        snake.score += amt;
        for (let i = 0; i < amt; i++) {
            const t = snake.segments[snake.segments.length - 1];
            snake.segments.push({ ...t });
        }
        const br = 8 + Math.floor(snake.segments.length / 20);
        snake.segments.forEach((s, i) => {
            s.radius = br * (1 - i / snake.segments.length * 0.3);
        });
    }, []);

    const killSnake = useCallback((snake: Snake) => {
        snake.isAlive = false;
        for (let i = 0; i < snake.segments.length; i += 3) {
            const s = snake.segments[i];
            orbsRef.current.set(`d-${snake.id}-${i}`, {
                id: `d-${snake.id}-${i}`, x: s.x + (Math.random() - 0.5) * 20,
                y: s.y + (Math.random() - 0.5) * 20, value: 2, color: snake.color, radius: 6,
            });
        }
        if (snake.id === 'player') {
            setTimeout(() => {
                const x = randomInRange(200, config.worldWidth - 200);
                const y = randomInRange(200, config.worldHeight - 200);
                playerRef.current = createSnake('player', snake.name, x, y);
                cameraRef.current = { x, y, zoom: 1 };
            }, 2000);
        } else {
            setTimeout(() => {
                const x = randomInRange(200, config.worldWidth - 200);
                const y = randomInRange(200, config.worldHeight - 200);
                const ns = createSnake(snake.id, snake.name, x, y);
                ns.targetAngle = Math.random() * Math.PI * 2;
                aiSnakesRef.current.set(snake.id, ns);
            }, 3000);
        }
    }, [config, createSnake]);

    // ═══════════════════════════════════════════════════════════
    // GAME LOOP
    // ═══════════════════════════════════════════════════════════

    const gameLoop = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const player = playerRef.current;
        const camera = cameraRef.current;

        // Update player
        if (player?.isAlive) {
            const scx = canvas.width / 2, scy = canvas.height / 2;
            player.targetAngle = Math.atan2(mouseRef.current.y - scy, mouseRef.current.x - scx);
            player.isBoosting = boostRef.current;
            updateSnake(player);
            camera.x += (player.segments[0].x - camera.x) * 0.1;
            camera.y += (player.segments[0].y - camera.y) * 0.1;
            camera.zoom += (Math.max(0.5, 1 - player.segments.length * 0.002) - camera.zoom) * 0.02;
        }

        // Update AI
        for (const snake of aiSnakesRef.current.values()) {
            if (snake.isAlive) { updateAI(snake); updateSnake(snake); }
        }

        // Rebuild grids
        orbGridRef.current.clear();
        segmentGridRef.current.clear();
        for (const o of orbsRef.current.values()) orbGridRef.current.insert(o);
        const allSnakes = [player, ...aiSnakesRef.current.values()].filter((s): s is Snake => s !== null && s.isAlive);
        for (const s of allSnakes) {
            for (let i = 3; i < s.segments.length; i++) {
                segmentGridRef.current.insert({ ...s.segments[i], id: `${s.id}-${i}`, snakeId: s.id });
            }
        }

        // Collisions
        for (const snake of allSnakes) {
            const head = snake.segments[0];
            for (const orb of orbGridRef.current.query(head.x, head.y, head.radius + 20)) {
                if (distance(head, orb) < head.radius + orb.radius) {
                    orbsRef.current.delete(orb.id);
                    growSnake(snake, orb.value);
                    spawnOrb();
                }
            }
            for (const seg of segmentGridRef.current.query(head.x, head.y, head.radius + 20)) {
                if ((seg as any).snakeId !== snake.id && distance(head, seg) < head.radius + seg.radius - 2) {
                    killSnake(snake); break;
                }
            }
        }

        // Render
        const w2s = (p: Vector2) => ({
            x: (p.x - camera.x) * camera.zoom + canvas.width / 2,
            y: (p.y - camera.y) * camera.zoom + canvas.height / 2,
        });
        const inView = (p: Vector2) => {
            const s = w2s(p);
            return s.x > -100 && s.x < canvas.width + 100 && s.y > -100 && s.y < canvas.height + 100;
        };

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
        for (const orb of orbsRef.current.values()) {
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
        for (const snake of allSnakes) {
            for (let i = snake.segments.length - 1; i >= 0; i--) {
                const seg = snake.segments[i];
                if (!inView(seg)) continue;
                const sp = w2s(seg);
                const br = 0.5 + 0.5 * (snake.segments.length - i) / snake.segments.length;
                ctx.beginPath();
                ctx.arc(sp.x, sp.y, seg.radius * camera.zoom, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${parseInt(snake.color.slice(1, 3), 16) * br},${parseInt(snake.color.slice(3, 5), 16) * br},${parseInt(snake.color.slice(5, 7), 16) * br},1)`;
                ctx.fill();
                if (i === 0) {
                    ctx.shadowColor = snake.color;
                    ctx.shadowBlur = 15;
                    ctx.fill();
                    ctx.shadowBlur = 0;
                }
            }
            const hs = w2s(snake.segments[0]);
            ctx.fillStyle = '#fff';
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(snake.name, hs.x, hs.y - 20);
        }

        // UI
        if (player) {
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 24px Arial';
            ctx.textAlign = 'left';
            ctx.fillText(`Score: ${player.score}`, 20, 40);
            ctx.fillText(`Length: ${player.segments.length}`, 20, 70);
        }

        animationRef.current = requestAnimationFrame(gameLoop);
    }, [updateSnake, updateAI, growSnake, killSnake, spawnOrb]);

    // ═══════════════════════════════════════════════════════════
    // PUBLIC API
    // ═══════════════════════════════════════════════════════════

    const startGame = useCallback((name: string) => {
        setPlayerName(name);
        const x = randomInRange(200, config.worldWidth - 200);
        const y = randomInRange(200, config.worldHeight - 200);
        playerRef.current = createSnake('player', name, x, y);
        cameraRef.current = { x, y, zoom: 1 };

        // Spawn orbs
        orbsRef.current.clear();
        for (let i = 0; i < config.orbCount; i++) spawnOrb();

        // Spawn AI
        aiSnakesRef.current.clear();
        for (let i = 0; i < 5; i++) {
            const ax = randomInRange(200, config.worldWidth - 200);
            const ay = randomInRange(200, config.worldHeight - 200);
            const ai = createSnake(`ai-${i}`, `Bot ${i + 1}`, ax, ay);
            ai.targetAngle = Math.random() * Math.PI * 2;
            aiSnakesRef.current.set(ai.id, ai);
        }

        setIsPlaying(true);
        animationRef.current = requestAnimationFrame(gameLoop);
    }, [config, createSnake, spawnOrb, gameLoop]);

    const stopGame = useCallback(() => {
        if (animationRef.current) cancelAnimationFrame(animationRef.current);
        setIsPlaying(false);
    }, []);

    const setCanvas = useCallback((canvas: HTMLCanvasElement | null) => {
        canvasRef.current = canvas;
    }, []);

    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        mouseRef.current = { x: e.clientX, y: e.clientY };
    }, []);

    const handleMouseDown = useCallback(() => { boostRef.current = true; }, []);
    const handleMouseUp = useCallback(() => { boostRef.current = false; }, []);

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.code === 'Space') boostRef.current = e.type === 'keydown';
        };
        document.addEventListener('keydown', onKey);
        document.addEventListener('keyup', onKey);
        return () => {
            document.removeEventListener('keydown', onKey);
            document.removeEventListener('keyup', onKey);
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
        };
    }, []);

    return {
        isPlaying, playerName,
        startGame, stopGame,
        setCanvas, handleMouseMove, handleMouseDown, handleMouseUp,
    };
}
