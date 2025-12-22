# Connect Four - Concepts Deep Dive

> Detailed exploration of key algorithms and patterns for building Connect Four.

---

## Table of Contents

1. [Win Detection Algorithm](#1-win-detection-algorithm)
2. [Gravity Drop Logic](#2-gravity-drop-logic)
3. [Minimax with Alpha-Beta Pruning](#3-minimax-with-alpha-beta-pruning)
4. [Board Evaluation Heuristics](#4-board-evaluation-heuristics)
5. [Undo/Redo with History](#5-undoredo-with-history)

---

## 1. Win Detection Algorithm

### The Four Directions

```typescript
// Direction vectors: [row delta, col delta]
const DIRECTIONS = [
  { dr: 0, dc: 1 },   // Horizontal →
  { dr: 1, dc: 0 },   // Vertical ↓
  { dr: 1, dc: 1 },   // Diagonal ↘
  { dr: 1, dc: -1 },  // Diagonal ↙
];
```

### Efficient Check from Last Move

```typescript
function checkWinFromMove(
  board: Cell[][],
  row: number,
  col: number
): Position[] | null {
  const player = board[row][col];
  if (!player) return null;

  for (const { dr, dc } of DIRECTIONS) {
    const line = getLineInDirection(board, row, col, dr, dc, player);
    if (line.length >= 4) {
      return line.slice(0, 4); // Return winning 4
    }
  }

  return null;
}

function getLineInDirection(
  board: Cell[][],
  startRow: number,
  startCol: number,
  dr: number,
  dc: number,
  player: Player
): Position[] {
  const line: Position[] = [];

  // Count backwards
  let r = startRow - dr * 3;
  let c = startCol - dc * 3;

  // Scan forward looking for consecutive matches
  for (let i = 0; i < 7; i++) {
    if (
      r >= 0 && r < 6 &&
      c >= 0 && c < 7 &&
      board[r][c] === player
    ) {
      line.push({ row: r, col: c });
    } else {
      // Chain broken - reset if we haven't won yet
      if (line.length >= 4) break;
      line.length = 0;
    }
    r += dr;
    c += dc;
  }

  return line;
}
```

### Visual Example

```
Check win after placing at (3, 4):

Board:
  0   1   2   3   4   5   6
┌───┬───┬───┬───┬───┬───┬───┐
│   │   │   │   │   │   │   │  0
├───┼───┼───┼───┼───┼───┼───┤
│   │   │   │   │   │   │   │  1
├───┼───┼───┼───┼───┼───┼───┤
│   │   │   │   │   │   │   │  2
├───┼───┼───┼───┼───┼───┼───┤
│   │★R │ R │ R │[R]│   │   │  3  ← Win! Horizontal
├───┼───┼───┼───┼───┼───┼───┤
│   │ Y │ Y │ R │ Y │   │   │  4
├───┼───┼───┼───┼───┼───┼───┤
│ Y │ R │ R │ Y │ R │ Y │   │  5
└───┴───┴───┴───┴───┴───┴───┘

Check from (3, 4):
  Horizontal → : Found R at (3,1), (3,2), (3,3), (3,4) = 4 in a row!
  Vertical ↓  : Only (3,4)
  Diagonal ↘  : (3,4), (4,5) = 2
  Diagonal ↙  : (3,4), (4,3) = 2

Winner: RED, winning cells: [(3,1), (3,2), (3,3), (3,4)]
```

---

## 2. Gravity Drop Logic

### Find Landing Row

```typescript
function getDropRow(board: Cell[][], col: number): number {
  // Start from bottom (row 5) and go up
  for (let row = 5; row >= 0; row--) {
    if (board[row][col] === null) {
      return row; // Found empty cell
    }
  }
  return -1; // Column is full
}

// Check if column is playable
function isColumnPlayable(board: Cell[][], col: number): boolean {
  return board[0][col] === null; // Top row empty
}

// Get all valid moves
function getValidMoves(board: Cell[][]): number[] {
  const moves: number[] = [];
  for (let col = 0; col < 7; col++) {
    if (isColumnPlayable(board, col)) {
      moves.push(col);
    }
  }
  return moves;
}
```

### Drop Animation with CSS

```typescript
// React component with animation
function Cell({ 
  row, 
  col, 
  value, 
  isDropping,
  isWinning 
}: CellProps) {
  const classes = [
    'cell',
    value ? `cell-${value.toLowerCase()}` : 'cell-empty',
    isDropping ? 'dropping' : '',
    isWinning ? 'winning' : '',
  ].filter(Boolean).join(' ');

  // Animation duration based on row (gravity effect)
  const animationDuration = isDropping 
    ? `${0.1 + row * 0.1}s` 
    : undefined;

  return (
    <div 
      className={classes}
      style={{ animationDuration }}
      data-row={row}
      data-col={col}
    >
      {value && <div className="piece" />}
    </div>
  );
}
```

---

## 3. Minimax with Alpha-Beta Pruning

### Basic Concept

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    MINIMAX GAME TREE                                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│                           Current Position                                  │
│                           (AI to move - MAX)                                │
│                                  │                                          │
│                 ┌────────────────┼────────────────┐                         │
│                 │                │                │                         │
│             Col 0            Col 3            Col 6                         │
│            ┌─────┐          ┌─────┐          ┌─────┐                        │
│            │  3  │          │  5  │          │  2  │  ← Opponent responds   │
│            └─────┘          └─────┘          └─────┘    (MIN level)         │
│                │                │                │                          │
│           ┌────┴────┐      ┌────┴────┐      ┌────┴────┐                     │
│           2    4    3      5    7    5      1    2    3  ← AI responds      │
│                                                           (MAX level)       │
│                                                                             │
│  AI chooses Col 3 (leads to score 5, highest guaranteed outcome)            │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Complete Implementation

```typescript
type Player = 'RED' | 'YELLOW';
type Cell = Player | null;

const ROWS = 6;
const COLS = 7;
const MAX_DEPTH = 6;

interface MoveEvaluation {
  col: number;
  score: number;
}

function getOpponent(player: Player): Player {
  return player === 'RED' ? 'YELLOW' : 'RED';
}

function getBestMove(board: Cell[][], aiPlayer: Player): number {
  const validMoves = getValidMoves(board);
  if (validMoves.length === 0) return -1;

  let bestMove: MoveEvaluation = { col: validMoves[0], score: -Infinity };

  // Prefer center columns (heuristic)
  const orderedMoves = [...validMoves].sort((a, b) => 
    Math.abs(3 - a) - Math.abs(3 - b)
  );

  for (const col of orderedMoves) {
    const row = getDropRow(board, col);
    
    // Make move
    board[row][col] = aiPlayer;
    
    // Check for immediate win
    if (checkWinFromMove(board, row, col)) {
      board[row][col] = null;
      return col; // Take winning move immediately
    }
    
    // Evaluate with minimax
    const score = minimax(
      board,
      MAX_DEPTH - 1,
      false,
      aiPlayer,
      -Infinity,
      Infinity
    );
    
    // Undo move
    board[row][col] = null;

    if (score > bestMove.score) {
      bestMove = { col, score };
    }
  }

  return bestMove.col;
}

function minimax(
  board: Cell[][],
  depth: number,
  isMaximizing: boolean,
  aiPlayer: Player,
  alpha: number,
  beta: number
): number {
  // Terminal conditions
  const winner = getWinner(board);
  if (winner === aiPlayer) return 10000 + depth;
  if (winner === getOpponent(aiPlayer)) return -10000 - depth;
  if (isBoardFull(board)) return 0;
  if (depth === 0) return evaluateBoard(board, aiPlayer);

  const currentPlayer = isMaximizing ? aiPlayer : getOpponent(aiPlayer);
  const validMoves = getValidMoves(board);

  if (isMaximizing) {
    let maxScore = -Infinity;

    for (const col of validMoves) {
      const row = getDropRow(board, col);
      board[row][col] = currentPlayer;
      
      const score = minimax(board, depth - 1, false, aiPlayer, alpha, beta);
      
      board[row][col] = null;
      maxScore = Math.max(maxScore, score);
      alpha = Math.max(alpha, score);
      
      if (beta <= alpha) break; // Prune
    }

    return maxScore;
  } else {
    let minScore = Infinity;

    for (const col of validMoves) {
      const row = getDropRow(board, col);
      board[row][col] = currentPlayer;
      
      const score = minimax(board, depth - 1, true, aiPlayer, alpha, beta);
      
      board[row][col] = null;
      minScore = Math.min(minScore, score);
      beta = Math.min(beta, score);
      
      if (beta <= alpha) break; // Prune
    }

    return minScore;
  }
}
```

### Alpha-Beta Pruning Visualization

```
                        MAX (root)
                           │
              ┌────────────┼────────────┐
              │            │            │
           β=3          β=5          (pruned!)
           MIN           MIN             
              │            │
         ┌────┴────┐  ┌────┴────┐
         │         │  │         │
        α=3       α=3 α=5       α=7
        MAX       MAX MAX       MAX
         
After evaluating left subtree, α=3.
After center subtree returns 5, α=5.
Right subtree: first child returns 2.
Since 2 < α (5), we know this subtree can't improve our result.
PRUNE the remaining branches of right subtree!
```

---

## 4. Board Evaluation Heuristics

### Scoring System

```typescript
function evaluateBoard(board: Cell[][], player: Player): number {
  let score = 0;

  // Center column control (most valuable)
  for (let row = 0; row < ROWS; row++) {
    if (board[row][3] === player) score += 3;
    if (board[row][3] === getOpponent(player)) score -= 3;
  }

  // Evaluate all possible 4-in-a-row windows
  score += evaluateWindows(board, player);

  return score;
}

function evaluateWindows(board: Cell[][], player: Player): number {
  let score = 0;

  // Horizontal windows
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS - 3; col++) {
      const window = [
        board[row][col],
        board[row][col + 1],
        board[row][col + 2],
        board[row][col + 3],
      ];
      score += evaluateWindow(window, player);
    }
  }

  // Vertical windows
  for (let row = 0; row < ROWS - 3; row++) {
    for (let col = 0; col < COLS; col++) {
      const window = [
        board[row][col],
        board[row + 1][col],
        board[row + 2][col],
        board[row + 3][col],
      ];
      score += evaluateWindow(window, player);
    }
  }

  // Diagonal ↘ windows
  for (let row = 0; row < ROWS - 3; row++) {
    for (let col = 0; col < COLS - 3; col++) {
      const window = [
        board[row][col],
        board[row + 1][col + 1],
        board[row + 2][col + 2],
        board[row + 3][col + 3],
      ];
      score += evaluateWindow(window, player);
    }
  }

  // Diagonal ↙ windows
  for (let row = 0; row < ROWS - 3; row++) {
    for (let col = 3; col < COLS; col++) {
      const window = [
        board[row][col],
        board[row + 1][col - 1],
        board[row + 2][col - 2],
        board[row + 3][col - 3],
      ];
      score += evaluateWindow(window, player);
    }
  }

  return score;
}

function evaluateWindow(window: Cell[], player: Player): number {
  const opponent = getOpponent(player);
  const playerCount = window.filter(c => c === player).length;
  const emptyCount = window.filter(c => c === null).length;
  const opponentCount = window.filter(c => c === opponent).length;

  // Scoring based on potential
  if (playerCount === 4) return 100;
  if (playerCount === 3 && emptyCount === 1) return 5;
  if (playerCount === 2 && emptyCount === 2) return 2;
  
  // Penalize opponent threats
  if (opponentCount === 3 && emptyCount === 1) return -4;

  return 0;
}
```

---

## 5. Undo/Redo with History

### Implementation

```typescript
interface GameHistory {
  moves: number[];        // Column indices
  undoneStack: number[];  // For redo
}

function createGame(): { state: GameState; history: GameHistory } {
  return {
    state: createInitialState(),
    history: { moves: [], undoneStack: [] },
  };
}

function makeMove(
  state: GameState,
  history: GameHistory,
  col: number
): { state: GameState; history: GameHistory } {
  const row = getDropRow(state.board, col);
  if (row === -1) return { state, history };

  // Clone board
  const newBoard = state.board.map(r => [...r]);
  newBoard[row][col] = state.currentPlayer;

  // Check win
  const winningCells = checkWinFromMove(newBoard, row, col);

  return {
    state: {
      ...state,
      board: newBoard,
      currentPlayer: getOpponent(state.currentPlayer),
      winner: winningCells ? state.currentPlayer : null,
      winningCells: winningCells || [],
      gameStatus: winningCells ? 'won' : isBoardFull(newBoard) ? 'draw' : 'playing',
    },
    history: {
      moves: [...history.moves, col],
      undoneStack: [], // Clear redo stack on new move
    },
  };
}

function undoMove(
  state: GameState,
  history: GameHistory
): { state: GameState; history: GameHistory } | null {
  if (history.moves.length === 0) return null;

  const moves = [...history.moves];
  const lastMove = moves.pop()!;

  // Replay all moves except last
  let newState = createInitialState();
  for (const col of moves) {
    const row = getDropRow(newState.board, col);
    newState.board[row][col] = newState.currentPlayer;
    newState.currentPlayer = getOpponent(newState.currentPlayer);
  }

  return {
    state: {
      ...newState,
      winner: null,
      winningCells: [],
      gameStatus: 'playing',
    },
    history: {
      moves,
      undoneStack: [...history.undoneStack, lastMove],
    },
  };
}

function redoMove(
  state: GameState,
  history: GameHistory
): { state: GameState; history: GameHistory } | null {
  if (history.undoneStack.length === 0) return null;

  const undoneStack = [...history.undoneStack];
  const moveToRedo = undoneStack.pop()!;

  return makeMove(state, { ...history, undoneStack }, moveToRedo);
}
```

---

## Summary

| Concept | Key Point |
|---------|-----------|
| **Win Detection** | Check 4 directions from last placed piece |
| **Gravity** | Iterate from bottom row up to find landing |
| **Minimax** | Evaluate game tree with depth limit |
| **Alpha-Beta** | Prune branches that can't improve result |
| **Heuristics** | Center control + window evaluation |
| **Undo/Redo** | Replay moves from history |

---

## References

- [Minimax Algorithm](https://en.wikipedia.org/wiki/Minimax)
- [Game Theory](https://en.wikipedia.org/wiki/Game_theory)
