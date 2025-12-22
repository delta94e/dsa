import { useState, useCallback, useEffect, useRef } from 'react';
import {
    TileState,
    GameState,
    KeyState,
    WORD_LENGTH,
    MAX_ATTEMPTS,
    STATE_PRIORITY,
    ANSWER_WORDS,
    VALID_WORDS,
} from '../types';

// ═══════════════════════════════════════════════════════════════
// HOOK
// ═══════════════════════════════════════════════════════════════

export function useWordle() {
    const [state, setState] = useState<GameState>(() => createNewGame());
    const [keyboardState, setKeyboardState] = useState<Map<string, KeyState>>(
        () => new Map()
    );
    const [toast, setToast] = useState<string | null>(null);
    const [shakeRow, setShakeRow] = useState(false);
    const [bounceRow, setBounceRow] = useState(false);
    const [flipTiles, setFlipTiles] = useState<number[]>([]);

    const stateRef = useRef(state);
    stateRef.current = state;

    // ═══════════════════════════════════════════════════════════
    // INITIALIZATION
    // ═══════════════════════════════════════════════════════════

    function createNewGame(): GameState {
        return {
            targetWord: getDailyWord(),
            guesses: [],
            currentGuess: '',
            evaluations: [],
            gameStatus: 'playing',
            currentRow: 0,
        };
    }

    function getDailyWord(): string {
        const today = new Date();
        const startDate = new Date('2024-01-01');
        const daysDiff = Math.floor(
            (today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
        );
        return ANSWER_WORDS[daysDiff % ANSWER_WORDS.length];
    }

    // ═══════════════════════════════════════════════════════════
    // INPUT HANDLERS
    // ═══════════════════════════════════════════════════════════

    const addLetter = useCallback((letter: string) => {
        setState(prev => {
            if (prev.gameStatus !== 'playing') return prev;
            if (prev.currentGuess.length >= WORD_LENGTH) return prev;
            return { ...prev, currentGuess: prev.currentGuess + letter };
        });
    }, []);

    const deleteLetter = useCallback(() => {
        setState(prev => {
            if (prev.gameStatus !== 'playing') return prev;
            if (prev.currentGuess.length === 0) return prev;
            return { ...prev, currentGuess: prev.currentGuess.slice(0, -1) };
        });
    }, []);

    const submitGuess = useCallback(async () => {
        const currentState = stateRef.current;

        if (currentState.gameStatus !== 'playing') return;

        const guess = currentState.currentGuess;

        if (guess.length !== WORD_LENGTH) {
            showToast('Not enough letters');
            triggerShake();
            return;
        }

        if (!VALID_WORDS.has(guess)) {
            showToast('Not in word list');
            triggerShake();
            return;
        }

        const evaluation = evaluateGuess(guess, currentState.targetWord);

        // Trigger flip animation
        await animateFlip();

        // Update state
        setState(prev => {
            const newGuesses = [...prev.guesses, guess];
            const newEvaluations = [...prev.evaluations, evaluation];

            let newStatus = prev.gameStatus;
            if (evaluation.every(s => s === 'correct')) {
                newStatus = 'won';
            } else if (newGuesses.length >= MAX_ATTEMPTS) {
                newStatus = 'lost';
            }

            return {
                ...prev,
                guesses: newGuesses,
                evaluations: newEvaluations,
                currentGuess: '',
                currentRow: prev.currentRow + 1,
                gameStatus: newStatus,
            };
        });

        // Update keyboard
        updateKeyboard(guess, evaluation);

        // Win/lose feedback
        if (evaluation.every(s => s === 'correct')) {
            triggerBounce();
            showToast(getWinMessage(currentState.guesses.length + 1));
        } else if (currentState.guesses.length + 1 >= MAX_ATTEMPTS) {
            showToast(currentState.targetWord, 5000);
        }
    }, []);

    const handleKeyPress = useCallback((key: string) => {
        if (key === 'ENTER') {
            submitGuess();
        } else if (key === 'BACKSPACE') {
            deleteLetter();
        } else if (/^[A-Z]$/.test(key)) {
            addLetter(key);
        }
    }, [submitGuess, deleteLetter, addLetter]);

    // ═══════════════════════════════════════════════════════════
    // KEYBOARD INPUT
    // ═══════════════════════════════════════════════════════════

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const key = e.key.toUpperCase();
            if (key === 'ENTER' || key === 'BACKSPACE' || /^[A-Z]$/.test(key)) {
                handleKeyPress(key);
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyPress]);

    // ═══════════════════════════════════════════════════════════
    // EVALUATION (Two-Pass Algorithm)
    // ═══════════════════════════════════════════════════════════

    function evaluateGuess(guess: string, target: string): TileState[] {
        const result: TileState[] = Array(WORD_LENGTH).fill('absent');
        const targetCounts = new Map<string, number>();

        for (const letter of target) {
            targetCounts.set(letter, (targetCounts.get(letter) || 0) + 1);
        }

        // Pass 1: Exact matches
        for (let i = 0; i < WORD_LENGTH; i++) {
            if (guess[i] === target[i]) {
                result[i] = 'correct';
                targetCounts.set(guess[i], targetCounts.get(guess[i])! - 1);
            }
        }

        // Pass 2: Present letters
        for (let i = 0; i < WORD_LENGTH; i++) {
            if (result[i] === 'correct') continue;
            const count = targetCounts.get(guess[i]) || 0;
            if (count > 0) {
                result[i] = 'present';
                targetCounts.set(guess[i], count - 1);
            }
        }

        return result;
    }

    // ═══════════════════════════════════════════════════════════
    // KEYBOARD STATE
    // ═══════════════════════════════════════════════════════════

    function updateKeyboard(guess: string, evaluation: TileState[]) {
        setKeyboardState(prev => {
            const newState = new Map(prev);
            for (let i = 0; i < guess.length; i++) {
                const letter = guess[i];
                const newKeyState = tileToKeyState(evaluation[i]);
                const currentState = newState.get(letter) || 'unused';

                if (STATE_PRIORITY[newKeyState] > STATE_PRIORITY[currentState]) {
                    newState.set(letter, newKeyState);
                }
            }
            return newState;
        });
    }

    function tileToKeyState(tile: TileState): KeyState {
        if (tile === 'correct') return 'correct';
        if (tile === 'present') return 'present';
        return 'absent';
    }

    // ═══════════════════════════════════════════════════════════
    // ANIMATIONS
    // ═══════════════════════════════════════════════════════════

    async function animateFlip(): Promise<void> {
        for (let i = 0; i < WORD_LENGTH; i++) {
            setFlipTiles(prev => [...prev, i]);
            await new Promise(resolve => setTimeout(resolve, 300));
        }
        setFlipTiles([]);
    }

    function triggerShake() {
        setShakeRow(true);
        setTimeout(() => setShakeRow(false), 600);
    }

    function triggerBounce() {
        setBounceRow(true);
        setTimeout(() => setBounceRow(false), 1000);
    }

    // ═══════════════════════════════════════════════════════════
    // TOAST
    // ═══════════════════════════════════════════════════════════

    function showToast(message: string, duration = 2000) {
        setToast(message);
        setTimeout(() => setToast(null), duration);
    }

    function getWinMessage(guesses: number): string {
        const messages = ['Genius!', 'Magnificent!', 'Impressive!', 'Splendid!', 'Great!', 'Phew!'];
        return messages[Math.min(guesses - 1, messages.length - 1)];
    }

    // ═══════════════════════════════════════════════════════════
    // RETURN
    // ═══════════════════════════════════════════════════════════

    return {
        state,
        keyboardState,
        toast,
        shakeRow,
        bounceRow,
        flipTiles,
        handleKeyPress,
    };
}
