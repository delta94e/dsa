import { useState, useCallback, useEffect } from 'react';
import {
    Player,
    Cell,
    GameState,
    Position,
    ROWS,
    COLS,
    WIN_LENGTH,
    DIRECTIONS,
} from '../types';

// ═══════════════════════════════════════════════════════════════
// HOOK
// ═══════════════════════════════════════════════════════════════

export function useConnectFour() {
    const [state, setState] = useState<GameState>(createInitialState);
    const [droppingCell, setDroppingCell] = useState<Position | null>(null);

    // ═══════════════════════════════════════════════════════════
    // STATE INITIALIZATION
    // ═══════════════════════════════════════════════════════════

    function createInitialState(): GameState {
        return {
            board: Array.from({ length: ROWS }, () => Array(COLS).fill(null)),
            currentPlayer: 'RED',
            winner: null,
            winningCells: [],
            gameStatus: 'playing',
            moveHistory: [],
        };
    }

    // ═══════════════════════════════════════════════════════════
    // HELPERS
    // ═══════════════════════════════════════════════════════════

    const getDropRow = useCallback((board: Cell[][], col: number): number => {
        for (let row = ROWS - 1; row >= 0; row--) {
            if (board[row][col] === null) {
                return row;
            }
        }
        return -1;
    }, []);

    const getOpponent = (player: Player): Player => {
        return player === 'RED' ? 'YELLOW' : 'RED';
    };

    const isBoardFull = (board: Cell[][]): boolean => {
        return board[0].every(cell => cell !== null);
    };

    // ═══════════════════════════════════════════════════════════
    // WIN DETECTION
    // ═══════════════════════════════════════════════════════════

    const checkWin = useCallback((
        board: Cell[][],
        row: number,
        col: number
    ): Position[] | null => {
        const player = board[row][col];
        if (!player) return null;

        for (const { dr, dc } of DIRECTIONS) {
            const cells: Position[] = [];

            for (let i = -(WIN_LENGTH - 1); i < WIN_LENGTH; i++) {
                const r = row + dr * i;
                const c = col + dc * i;

                if (
                    r >= 0 && r < ROWS &&
                    c >= 0 && c < COLS &&
                    board[r][c] === player
                ) {
                    cells.push({ row: r, col: c });
                } else {
                    if (cells.length >= WIN_LENGTH) break;
                    cells.length = 0;
                }
            }

            if (cells.length >= WIN_LENGTH) {
                return cells.slice(0, WIN_LENGTH);
            }
        }

        return null;
    }, []);

    // ═══════════════════════════════════════════════════════════
    // GAME ACTIONS
    // ═══════════════════════════════════════════════════════════

    const makeMove = useCallback(async (col: number): Promise<boolean> => {
        if (droppingCell) return false;

        const row = getDropRow(state.board, col);
        if (row === -1 || state.gameStatus !== 'playing') return false;

        // Start drop animation
        setDroppingCell({ row, col });

        // Wait for animation
        await new Promise(resolve => setTimeout(resolve, 100 + row * 80));

        setState(prev => {
            const newBoard = prev.board.map(r => [...r]);
            newBoard[row][col] = prev.currentPlayer;

            const winningCells = checkWin(newBoard, row, col);

            return {
                ...prev,
                board: newBoard,
                currentPlayer: winningCells ? prev.currentPlayer : getOpponent(prev.currentPlayer),
                winner: winningCells ? prev.currentPlayer : null,
                winningCells: winningCells || [],
                gameStatus: winningCells ? 'won' : isBoardFull(newBoard) ? 'draw' : 'playing',
                moveHistory: [...prev.moveHistory, col],
            };
        });

        setDroppingCell(null);
        return true;
    }, [state.board, state.gameStatus, droppingCell, getDropRow, checkWin]);

    const undo = useCallback(() => {
        if (state.moveHistory.length === 0 || droppingCell) return;

        const moves = state.moveHistory.slice(0, -1);
        let newState = createInitialState();

        for (const col of moves) {
            const row = getDropRow(newState.board, col);
            newState.board[row][col] = newState.currentPlayer;
            newState.currentPlayer = getOpponent(newState.currentPlayer);
            newState.moveHistory.push(col);
        }

        setState(newState);
    }, [state.moveHistory, droppingCell, getDropRow]);

    const restart = useCallback(() => {
        setState(createInitialState());
        setDroppingCell(null);
    }, []);

    // ═══════════════════════════════════════════════════════════
    // KEYBOARD INPUT
    // ═══════════════════════════════════════════════════════════

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key >= '1' && e.key <= '7') {
                makeMove(parseInt(e.key, 10) - 1);
            } else if (e.key.toLowerCase() === 'r') {
                restart();
            } else if (e.key.toLowerCase() === 'u') {
                undo();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [makeMove, restart, undo]);

    // ═══════════════════════════════════════════════════════════
    // RETURN
    // ═══════════════════════════════════════════════════════════

    return {
        state,
        droppingCell,
        makeMove,
        undo,
        restart,
        getDropRow: (col: number) => getDropRow(state.board, col),
    };
}
