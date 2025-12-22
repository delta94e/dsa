// ═══════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════

export type Player = 'RED' | 'YELLOW';
export type Cell = Player | null;
export type GameStatus = 'playing' | 'won' | 'draw';

export interface Position {
    row: number;
    col: number;
}

export interface GameState {
    board: Cell[][];
    currentPlayer: Player;
    winner: Player | null;
    winningCells: Position[];
    gameStatus: GameStatus;
    moveHistory: number[];
}

// ═══════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════

export const ROWS = 6;
export const COLS = 7;
export const WIN_LENGTH = 4;

export const DIRECTIONS = [
    { dr: 0, dc: 1 },   // Horizontal
    { dr: 1, dc: 0 },   // Vertical
    { dr: 1, dc: 1 },   // Diagonal down-right
    { dr: 1, dc: -1 },  // Diagonal down-left
];
