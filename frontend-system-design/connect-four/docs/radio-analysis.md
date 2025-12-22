# Connect Four Frontend System Design

> A comprehensive frontend system design for building the classic two-player Connect Four game with win detection, drop animations, and AI opponent option.

---

## Table of Contents

1. [Requirements Exploration](#1-requirements-exploration)
2. [Game Mechanics](#2-game-mechanics)
3. [Component Architecture](#3-component-architecture)
4. [Data Model](#4-data-model)
5. [Win Detection Algorithm](#5-win-detection-algorithm)
6. [Drop Animation](#6-drop-animation)
7. [AI Opponent (Minimax)](#7-ai-opponent-minimax)
8. [Optimization & Accessibility](#8-optimization--accessibility)

---

## 1. Requirements Exploration

### 1.1 General Requirements

| Feature | Description |
|---------|-------------|
| **7×6 Grid** | 7 columns, 6 rows |
| **Two Players** | Red vs Yellow (or vs AI) |
| **Gravity Drop** | Pieces fall to lowest available row |
| **Win Detection** | 4 in a row (horizontal, vertical, diagonal) |
| **Draw Detection** | Board full with no winner |
| **Turn Indicator** | Show whose turn it is |

### 1.2 Functional Requirements

| Requirement | Description |
|-------------|-------------|
| **Column Hover** | Preview where piece will drop |
| **Drop Animation** | Smooth falling animation |
| **Win Highlight** | Highlight winning 4 pieces |
| **Restart Game** | Reset board and score |
| **Undo Move** | Optional: take back last move |
| **AI Opponent** | Optional: play against computer |

---

## 2. Game Mechanics

### 2.1 Game Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      CONNECT FOUR GAME FLOW                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  START                                                                      │
│    │                                                                        │
│    ▼                                                                        │
│  ┌─────────────────┐                                                        │
│  │ Initialize Grid │ ────▶ 7 columns × 6 rows = 42 cells                    │
│  │ (all empty)     │                                                        │
│  └────────┬────────┘                                                        │
│           │                                                                 │
│           ▼                                                                 │
│  ┌─────────────────┐     FULL      ┌─────────────────┐                      │
│  │ Player Clicks   │ ────────────▶│  Column Full    │                      │
│  │ Column          │              │  (Ignore)       │                      │
│  └────────┬────────┘              └─────────────────┘                      │
│           │ NOT FULL                                                        │
│           ▼                                                                 │
│  ┌─────────────────┐                                                        │
│  │ Drop Piece to   │                                                        │
│  │ Lowest Empty    │                                                        │
│  │ Row in Column   │                                                        │
│  └────────┬────────┘                                                        │
│           │                                                                 │
│           ▼                                                                 │
│  ┌─────────────────┐     YES      ┌─────────────────┐                       │
│  │ Check Win?      │ ───────────▶│  WINNER! 🎉     │                       │
│  └────────┬────────┘              │  Highlight 4    │                       │
│           │ NO                    └─────────────────┘                       │
│           ▼                                                                 │
│  ┌─────────────────┐     YES      ┌─────────────────┐                       │
│  │ Board Full?     │ ───────────▶│  DRAW 🤝       │                       │
│  └────────┬────────┘              └─────────────────┘                       │
│           │ NO                                                              │
│           ▼                                                                 │
│  ┌─────────────────┐                                                        │
│  │ Switch Player   │ ────▶ Continue game                                   │
│  └─────────────────┘                                                        │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 2.2 Board Coordinates

```
     Column:  0   1   2   3   4   5   6
            ┌───┬───┬───┬───┬───┬───┬───┐
   Row 0:   │   │   │   │   │   │   │   │  ← Top (pieces drop from here)
            ├───┼───┼───┼───┼───┼───┼───┤
   Row 1:   │   │   │   │   │   │   │   │
            ├───┼───┼───┼───┼───┼───┼───┤
   Row 2:   │   │   │   │   │   │   │   │
            ├───┼───┼───┼───┼───┼───┼───┤
   Row 3:   │   │   │   │   │   │   │   │
            ├───┼───┼───┼───┼───┼───┼───┤
   Row 4:   │   │   │   │   │   │   │   │
            ├───┼───┼───┼───┼───┼───┼───┤
   Row 5:   │ 🔴│   │   │ 🟡│   │   │   │  ← Bottom (gravity)
            └───┴───┴───┴───┴───┴───┴───┘
```

---

## 3. Component Architecture

### 3.1 Component Hierarchy

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      COMPONENT HIERARCHY                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│                       ┌──────────────────┐                                  │
│                       │       App        │                                  │
│                       └────────┬─────────┘                                  │
│                                │                                            │
│         ┌──────────────────────┼──────────────────────┐                     │
│         │                      │                      │                     │
│         ▼                      ▼                      ▼                     │
│  ┌─────────────┐       ┌─────────────┐       ┌─────────────┐               │
│  │   Header    │       │    Board    │       │  Controls   │               │
│  │ Turn/Status │       │             │       │ Restart/Undo│               │
│  └─────────────┘       └──────┬──────┘       └─────────────┘               │
│                               │                                             │
│                               ▼                                             │
│                        ┌─────────────┐                                      │
│                        │   Column    │ × 7                                  │
│                        └──────┬──────┘                                      │
│                               │                                             │
│                               ▼                                             │
│                        ┌─────────────┐                                      │
│                        │    Cell     │ × 6                                  │
│                        └─────────────┘                                      │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 3.2 UI Layout

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        CONNECT FOUR UI                                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                      CONNECT FOUR                                    │   │
│  │                   🔴 Red's Turn                                      │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────┐         │
│  │  Preview Row (shows where piece will land on hover)           │         │
│  │  ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐                   │         │
│  │  │🔴│ │   │ │   │ │   │ │   │ │   │ │   │  ← Hover preview  │         │
│  │  └───┘ └───┘ └───┘ └───┘ └───┘ └───┘ └───┘                   │         │
│  └───────────────────────────────────────────────────────────────┘         │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────┐         │
│  │  ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐                   │         │
│  │  │   │ │   │ │   │ │   │ │   │ │   │ │   │                   │         │
│  │  ├───┤ ├───┤ ├───┤ ├───┤ ├───┤ ├───┤ ├───┤                   │         │
│  │  │   │ │   │ │   │ │   │ │   │ │   │ │   │                   │         │
│  │  ├───┤ ├───┤ ├───┤ ├───┤ ├───┤ ├───┤ ├───┤                   │         │
│  │  │   │ │   │ │🟡│ │   │ │   │ │   │ │   │                   │         │
│  │  ├───┤ ├───┤ ├───┤ ├───┤ ├───┤ ├───┤ ├───┤                   │         │
│  │  │   │ │🔴│ │🔴│ │🟡│ │   │ │   │ │   │                   │         │
│  │  ├───┤ ├───┤ ├───┤ ├───┤ ├───┤ ├───┤ ├───┤                   │         │
│  │  │🟡│ │🟡│ │🔴│ │🔴│ │🟡│ │   │ │   │                   │         │
│  │  ├───┤ ├───┤ ├───┤ ├───┤ ├───┤ ├───┤ ├───┤                   │         │
│  │  │🔴│ │🔴│ │🟡│ │🟡│ │🔴│ │🟡│ │   │                   │         │
│  │  └───┘ └───┘ └───┘ └───┘ └───┘ └───┘ └───┘                   │         │
│  └───────────────────────────────────────────────────────────────┘         │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │              [Restart]              [Undo]                          │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Data Model

### 4.1 TypeScript Types

```typescript
// ═══════════════════════════════════════════════════════════════
// CELL & PLAYER
// ═══════════════════════════════════════════════════════════════

type Player = 'RED' | 'YELLOW';
type Cell = Player | null;

// ═══════════════════════════════════════════════════════════════
// POSITION
// ═══════════════════════════════════════════════════════════════

interface Position {
  row: number;
  col: number;
}

// ═══════════════════════════════════════════════════════════════
// GAME STATE
// ═══════════════════════════════════════════════════════════════

interface GameState {
  board: Cell[][];              // 6 rows × 7 columns
  currentPlayer: Player;
  winner: Player | null;
  winningCells: Position[];     // Highlight these 4 cells
  isDraw: boolean;
  moveHistory: number[];        // Column indices for undo
  gameStatus: 'playing' | 'won' | 'draw';
}

// ═══════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════

const ROWS = 6;
const COLS = 7;
const WIN_LENGTH = 4;
```

### 4.2 Board Representation

```typescript
// Board is a 2D array: board[row][col]
// row 0 = top, row 5 = bottom

const emptyBoard: Cell[][] = [
  [null, null, null, null, null, null, null], // Row 0 (top)
  [null, null, null, null, null, null, null], // Row 1
  [null, null, null, null, null, null, null], // Row 2
  [null, null, null, null, null, null, null], // Row 3
  [null, null, null, null, null, null, null], // Row 4
  [null, null, null, null, null, null, null], // Row 5 (bottom)
];

// Drop piece in column: find lowest empty row
function getLowestEmptyRow(board: Cell[][], col: number): number {
  for (let row = ROWS - 1; row >= 0; row--) {
    if (board[row][col] === null) {
      return row;
    }
  }
  return -1; // Column is full
}
```

---

## 5. Win Detection Algorithm

### 5.1 Four Directions to Check

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    WIN DIRECTIONS                                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  1. HORIZONTAL (→)           2. VERTICAL (↓)                                │
│     🔴🔴🔴🔴                    🔴                                           │
│                                🔴                                           │
│                                🔴                                           │
│                                🔴                                           │
│                                                                             │
│  3. DIAGONAL DOWN-RIGHT (↘)   4. DIAGONAL DOWN-LEFT (↙)                     │
│     🔴                            🔴                                        │
│       🔴                        🔴                                          │
│         🔴                    🔴                                            │
│           🔴                🔴                                              │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 5.2 Algorithm

```typescript
const DIRECTIONS: Position[] = [
  { row: 0, col: 1 },   // Horizontal →
  { row: 1, col: 0 },   // Vertical ↓
  { row: 1, col: 1 },   // Diagonal ↘
  { row: 1, col: -1 },  // Diagonal ↙
];

function checkWin(board: Cell[][], lastRow: number, lastCol: number): Position[] | null {
  const player = board[lastRow][lastCol];
  if (!player) return null;

  for (const dir of DIRECTIONS) {
    const cells = getConnectedCells(board, lastRow, lastCol, dir, player);
    if (cells.length >= WIN_LENGTH) {
      return cells.slice(0, WIN_LENGTH);
    }
  }

  return null;
}

function getConnectedCells(
  board: Cell[][],
  row: number,
  col: number,
  dir: Position,
  player: Player
): Position[] {
  const cells: Position[] = [];

  // Check in both directions from the placed piece
  // First: negative direction
  for (let i = -(WIN_LENGTH - 1); i < WIN_LENGTH; i++) {
    const r = row + dir.row * i;
    const c = col + dir.col * i;

    if (r >= 0 && r < ROWS && c >= 0 && c < COLS && board[r][c] === player) {
      cells.push({ row: r, col: c });
    } else {
      // Reset if chain broken
      if (cells.length >= WIN_LENGTH) break;
      cells.length = 0;
    }
  }

  return cells;
}
```

### 5.3 Optimized Check (From Last Move)

```typescript
// Only check from the last placed piece (more efficient than checking whole board)
function checkWinFromPosition(
  board: Cell[][],
  row: number,
  col: number
): Position[] | null {
  const player = board[row][col];
  if (!player) return null;

  for (const dir of DIRECTIONS) {
    let count = 1;
    const winCells: Position[] = [{ row, col }];

    // Check positive direction
    for (let i = 1; i < WIN_LENGTH; i++) {
      const r = row + dir.row * i;
      const c = col + dir.col * i;
      if (r >= 0 && r < ROWS && c >= 0 && c < COLS && board[r][c] === player) {
        count++;
        winCells.push({ row: r, col: c });
      } else break;
    }

    // Check negative direction
    for (let i = 1; i < WIN_LENGTH; i++) {
      const r = row - dir.row * i;
      const c = col - dir.col * i;
      if (r >= 0 && r < ROWS && c >= 0 && c < COLS && board[r][c] === player) {
        count++;
        winCells.push({ row: r, col: c });
      } else break;
    }

    if (count >= WIN_LENGTH) {
      return winCells.slice(0, WIN_LENGTH);
    }
  }

  return null;
}
```

---

## 6. Drop Animation

### 6.1 CSS Keyframe Animation

```css
@keyframes drop {
  from {
    transform: translateY(-600px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.cell.dropping {
  animation: drop 0.5s ease-in;
}

/* Different duration based on row (higher = faster fall) */
.cell.dropping[data-row="0"] { animation-duration: 0.15s; }
.cell.dropping[data-row="1"] { animation-duration: 0.25s; }
.cell.dropping[data-row="2"] { animation-duration: 0.35s; }
.cell.dropping[data-row="3"] { animation-duration: 0.45s; }
.cell.dropping[data-row="4"] { animation-duration: 0.55s; }
.cell.dropping[data-row="5"] { animation-duration: 0.65s; }
```

### 6.2 JavaScript Approach

```typescript
async function animateDrop(col: number, targetRow: number): Promise<void> {
  const cell = document.querySelector(`[data-row="${targetRow}"][data-col="${col}"]`);
  if (!cell) return;

  cell.classList.add('dropping');
  
  return new Promise((resolve) => {
    cell.addEventListener('animationend', () => {
      cell.classList.remove('dropping');
      resolve();
    }, { once: true });
  });
}

// Usage: await animateDrop(col, row) before checking win
```

---

## 7. AI Opponent (Minimax)

### 7.1 Basic Strategy

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    AI STRATEGY (Simple → Advanced)                           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Level 1: Random                                                            │
│  - Pick any valid column randomly                                           │
│                                                                             │
│  Level 2: Win/Block                                                         │
│  - If AI can win in one move → take it                                      │
│  - If opponent can win in one move → block it                               │
│  - Else → random                                                            │
│                                                                             │
│  Level 3: Minimax                                                           │
│  - Simulate all possible future moves                                       │
│  - Score each position                                                      │
│  - Choose optimal move                                                      │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 7.2 Minimax Implementation

```typescript
const MAX_DEPTH = 5;

function getBestMove(board: Cell[][], player: Player): number {
  let bestScore = -Infinity;
  let bestCol = 0;

  for (let col = 0; col < COLS; col++) {
    const row = getLowestEmptyRow(board, col);
    if (row === -1) continue;

    // Make move
    board[row][col] = player;
    
    // Evaluate with minimax
    const score = minimax(board, MAX_DEPTH, false, player, -Infinity, Infinity);
    
    // Undo move
    board[row][col] = null;

    if (score > bestScore) {
      bestScore = score;
      bestCol = col;
    }
  }

  return bestCol;
}

function minimax(
  board: Cell[][],
  depth: number,
  isMaximizing: boolean,
  aiPlayer: Player,
  alpha: number,
  beta: number
): number {
  // Check terminal states
  const winner = findWinner(board);
  if (winner === aiPlayer) return 1000 + depth;
  if (winner === getOpponent(aiPlayer)) return -1000 - depth;
  if (isBoardFull(board) || depth === 0) return evaluateBoard(board, aiPlayer);

  const currentPlayer = isMaximizing ? aiPlayer : getOpponent(aiPlayer);

  if (isMaximizing) {
    let maxScore = -Infinity;
    for (let col = 0; col < COLS; col++) {
      const row = getLowestEmptyRow(board, col);
      if (row === -1) continue;

      board[row][col] = currentPlayer;
      maxScore = Math.max(maxScore, minimax(board, depth - 1, false, aiPlayer, alpha, beta));
      board[row][col] = null;

      alpha = Math.max(alpha, maxScore);
      if (beta <= alpha) break; // Alpha-beta pruning
    }
    return maxScore;
  } else {
    let minScore = Infinity;
    for (let col = 0; col < COLS; col++) {
      const row = getLowestEmptyRow(board, col);
      if (row === -1) continue;

      board[row][col] = currentPlayer;
      minScore = Math.min(minScore, minimax(board, depth - 1, true, aiPlayer, alpha, beta));
      board[row][col] = null;

      beta = Math.min(beta, minScore);
      if (beta <= alpha) break; // Alpha-beta pruning
    }
    return minScore;
  }
}

// Simple heuristic: count potential winning positions
function evaluateBoard(board: Cell[][], player: Player): number {
  let score = 0;
  // Count center column (strategically valuable)
  for (let row = 0; row < ROWS; row++) {
    if (board[row][3] === player) score += 3;
  }
  // Add more heuristics as needed
  return score;
}
```

---

## 8. Optimization & Accessibility

### 8.1 Performance

| Optimization | Description |
|--------------|-------------|
| **Check from last move** | Only check win from placed piece |
| **Alpha-beta pruning** | Cut AI search tree |
| **Memoization** | Cache evaluated positions |
| **Web Worker** | Run AI in background thread |

### 8.2 Accessibility

```html
<div 
  role="grid" 
  aria-label="Connect Four game board"
>
  <div role="row" aria-label="Row 1">
    <button
      role="gridcell"
      aria-label="Row 1, Column 1, empty. Click to drop red piece"
      aria-pressed="false"
    ></button>
  </div>
</div>

<!-- Turn announcement -->
<div aria-live="polite" aria-atomic="true" class="sr-only">
  Red's turn
</div>

<!-- Win announcement -->
<div aria-live="assertive" class="sr-only">
  Red wins! Four in a row from row 5 column 0 to row 5 column 3.
</div>
```

### 8.3 Keyboard Navigation

```typescript
const KEYBOARD_CONTROLS = {
  '1-7': 'Drop piece in column 1-7',
  'ArrowLeft': 'Move hover preview left',
  'ArrowRight': 'Move hover preview right',
  'Enter/Space': 'Drop piece in selected column',
  'R': 'Restart game',
  'U': 'Undo last move',
};
```

---

## Summary

| Section | Key Decision |
|---------|--------------|
| **Board** | 2D array `board[row][col]`, 6×7 |
| **Win Check** | 4 directions from last move |
| **Animation** | CSS keyframes with row-based duration |
| **AI** | Minimax with alpha-beta pruning |
| **Accessibility** | ARIA grid + live regions |

### Key Takeaways

1. **Gravity Drop** - Find lowest empty row in column
2. **Win Detection** - Check 4 directions from last placed piece
3. **Animation** - Longer duration for lower rows
4. **Minimax** - Depth-limited search with pruning
5. **Undo** - Store move history (column indices)

---

## References

- [Connect Four Rules](https://www.gamesver.com/the-rules-of-connect-4/)
- [Minimax Algorithm](https://en.wikipedia.org/wiki/Minimax)
- [Alpha-Beta Pruning](https://en.wikipedia.org/wiki/Alpha%E2%80%93beta_pruning)
