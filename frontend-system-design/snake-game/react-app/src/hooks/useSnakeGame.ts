import { useCallback, useEffect, useRef, useState } from 'react';
import {
    Position,
    Direction,
    GameState,
    GameConfig,
    DIRECTION_VECTORS,
    OPPOSITE_DIRECTION,
    KEY_TO_DIRECTION,
    DEFAULT_CONFIG,
} from '../types';

// ═══════════════════════════════════════════════════════════════
// HIGH SCORE HELPERS
// ═══════════════════════════════════════════════════════════════

const HIGH_SCORE_KEY = 'snake-high-score';

function getStoredHighScore(): number {
    try {
        const stored = localStorage.getItem(HIGH_SCORE_KEY);
        return stored ? parseInt(stored, 10) : 0;
    } catch {
        return 0;
    }
}

function setStoredHighScore(score: number): void {
    try {
        localStorage.setItem(HIGH_SCORE_KEY, score.toString());
    } catch {
        // Ignore
    }
}

// ═══════════════════════════════════════════════════════════════
// USE SNAKE GAME HOOK
// ═══════════════════════════════════════════════════════════════

export function useSnakeGame(config: GameConfig = DEFAULT_CONFIG) {
    // Create initial state
    const createInitialState = useCallback((): GameState => {
        const centerX = Math.floor(config.gridWidth / 2);
        const centerY = Math.floor(config.gridHeight / 2);

        const snake: Position[] = [
            { x: centerX, y: centerY },
            { x: centerX - 1, y: centerY },
            { x: centerX - 2, y: centerY },
        ];

        return {
            snake,
            direction: 'RIGHT',
            nextDirection: 'RIGHT',
            food: spawnFood(snake, config),
            score: 0,
            highScore: getStoredHighScore(),
            status: 'IDLE',
            speed: config.initialSpeed,
        };
    }, [config]);

    const [state, setState] = useState<GameState>(createInitialState);
    const stateRef = useRef(state);
    const animationRef = useRef<number | null>(null);
    const lastUpdateRef = useRef<number>(0);

    // Keep ref in sync
    useEffect(() => {
        stateRef.current = state;
    }, [state]);

    // ═══════════════════════════════════════════════════════════
    // GAME ACTIONS
    // ═══════════════════════════════════════════════════════════

    const setDirection = useCallback((newDirection: Direction) => {
        setState(prev => {
            if (OPPOSITE_DIRECTION[newDirection] !== prev.direction) {
                return { ...prev, nextDirection: newDirection };
            }
            return prev;
        });
    }, []);

    const start = useCallback(() => {
        setState(prev => {
            if (prev.status !== 'IDLE') return prev;
            return { ...prev, status: 'PLAYING' };
        });
    }, []);

    const pause = useCallback(() => {
        setState(prev => {
            if (prev.status !== 'PLAYING') return prev;
            return { ...prev, status: 'PAUSED' };
        });
    }, []);

    const resume = useCallback(() => {
        setState(prev => {
            if (prev.status !== 'PAUSED') return prev;
            return { ...prev, status: 'PLAYING' };
        });
    }, []);

    const restart = useCallback(() => {
        setState({
            ...createInitialState(),
            status: 'PLAYING',
            highScore: getStoredHighScore(),
        });
    }, [createInitialState]);

    // ═══════════════════════════════════════════════════════════
    // GAME LOOP
    // ═══════════════════════════════════════════════════════════

    useEffect(() => {
        const loop = (currentTime: number) => {
            const current = stateRef.current;

            if (current.status !== 'PLAYING') return;

            const elapsed = currentTime - lastUpdateRef.current;

            if (elapsed >= current.speed) {
                setState(prev => updateGame(prev, config));
                lastUpdateRef.current = currentTime;
            }

            animationRef.current = requestAnimationFrame(loop);
        };

        if (state.status === 'PLAYING') {
            lastUpdateRef.current = performance.now();
            animationRef.current = requestAnimationFrame(loop);
        }

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [state.status, config]);

    // ═══════════════════════════════════════════════════════════
    // KEYBOARD INPUT
    // ═══════════════════════════════════════════════════════════

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const current = stateRef.current;

            // Direction change
            if (KEY_TO_DIRECTION[e.code]) {
                e.preventDefault();
                setDirection(KEY_TO_DIRECTION[e.code]);
                if (current.status === 'IDLE') {
                    start();
                }
                return;
            }

            // Pause/Resume
            if (e.code === 'Space') {
                e.preventDefault();
                if (current.status === 'PLAYING') {
                    pause();
                } else if (current.status === 'PAUSED') {
                    resume();
                } else if (current.status === 'IDLE') {
                    start();
                }
                return;
            }

            // Restart
            if (e.code === 'KeyR' && current.status === 'GAME_OVER') {
                restart();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [setDirection, start, pause, resume, restart]);

    return {
        state,
        start,
        pause,
        resume,
        restart,
        setDirection,
    };
}

// ═══════════════════════════════════════════════════════════════
// GAME UPDATE LOGIC
// ═══════════════════════════════════════════════════════════════

function updateGame(state: GameState, config: GameConfig): GameState {
    // Apply queued direction
    const direction = state.nextDirection;

    // Calculate new head position
    const head = state.snake[0];
    const vector = DIRECTION_VECTORS[direction];
    const newHead: Position = {
        x: head.x + vector.x,
        y: head.y + vector.y,
    };

    // Check wall collision
    if (checkWallCollision(newHead, config)) {
        return gameOver(state);
    }

    // Check self collision
    if (checkSelfCollision(newHead, state.snake)) {
        return gameOver(state);
    }

    // Move snake
    const newSnake = [newHead, ...state.snake];

    // Check food collision
    if (checkFoodCollision(newHead, state.food)) {
        // Don't remove tail (snake grows)
        return {
            ...state,
            snake: newSnake,
            direction,
            food: spawnFood(newSnake, config),
            score: state.score + 10,
            speed: Math.max(config.minSpeed, state.speed - config.speedIncrement),
        };
    }

    // Remove tail (normal move)
    newSnake.pop();
    return {
        ...state,
        snake: newSnake,
        direction,
    };
}

function gameOver(state: GameState): GameState {
    const newHighScore = state.score > state.highScore ? state.score : state.highScore;
    if (state.score > state.highScore) {
        setStoredHighScore(state.score);
    }
    return {
        ...state,
        status: 'GAME_OVER',
        highScore: newHighScore,
    };
}

// ═══════════════════════════════════════════════════════════════
// COLLISION DETECTION
// ═══════════════════════════════════════════════════════════════

function checkWallCollision(head: Position, config: GameConfig): boolean {
    return (
        head.x < 0 ||
        head.x >= config.gridWidth ||
        head.y < 0 ||
        head.y >= config.gridHeight
    );
}

function checkSelfCollision(head: Position, snake: Position[]): boolean {
    return snake.some(segment => segment.x === head.x && segment.y === head.y);
}

function checkFoodCollision(head: Position, food: Position): boolean {
    return head.x === food.x && head.y === food.y;
}

// ═══════════════════════════════════════════════════════════════
// FOOD SPAWNING
// ═══════════════════════════════════════════════════════════════

function spawnFood(snake: Position[], config: GameConfig): Position {
    const occupied = new Set(snake.map(s => `${s.x},${s.y}`));
    const emptyCells: Position[] = [];

    for (let x = 0; x < config.gridWidth; x++) {
        for (let y = 0; y < config.gridHeight; y++) {
            if (!occupied.has(`${x},${y}`)) {
                emptyCells.push({ x, y });
            }
        }
    }

    if (emptyCells.length === 0) {
        return { x: -1, y: -1 };
    }

    return emptyCells[Math.floor(Math.random() * emptyCells.length)];
}
