# Wordle Frontend System Design

> A comprehensive frontend system design for building the popular word-guessing game with letter validation, keyboard state, and animations.

---

## Table of Contents

1. [Requirements Exploration](#1-requirements-exploration)
2. [Game Mechanics](#2-game-mechanics)
3. [Component Architecture](#3-component-architecture)
4. [Data Model](#4-data-model)
5. [Letter Validation Algorithm](#5-letter-validation-algorithm)
6. [Keyboard State Management](#6-keyboard-state-management)
7. [Animations](#7-animations)
8. [Optimization & Accessibility](#8-optimization--accessibility)

---

## 1. Requirements Exploration

### 1.1 General Requirements

| Feature | Description |
|---------|-------------|
| **5-Letter Words** | Player guesses 5-letter words |
| **6 Attempts** | Maximum 6 guesses allowed |
| **Color Feedback** | Green (correct), Yellow (wrong position), Gray (not in word) |
| **Virtual Keyboard** | On-screen keyboard with state colors |
| **Word Validation** | Only valid dictionary words accepted |
| **Daily Word** | Same word for all players each day |

### 1.2 Functional Requirements

| Requirement | Description |
|-------------|-------------|
| **Persistence** | Save game state to localStorage |
| **Statistics** | Track games played, win %, streak |
| **Share Results** | Copy emoji grid to clipboard |
| **Hard Mode** | Must use revealed hints in subsequent guesses |
| **Dark Mode** | Theme toggle |
| **Animations** | Flip tiles, shake on invalid, bounce on win |

---

## 2. Game Mechanics

### 2.1 Game Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          WORDLE GAME FLOW                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  START                                                                      │
│    │                                                                        │
│    ▼                                                                        │
│  ┌─────────────────┐                                                        │
│  │  Load Daily Word │ ────▶ Hash(date) → wordIndex                          │
│  └────────┬────────┘                                                        │
│           │                                                                 │
│           ▼                                                                 │
│  ┌─────────────────┐                                                        │
│  │  Player Types   │                                                        │
│  │  5 Letters      │                                                        │
│  └────────┬────────┘                                                        │
│           │                                                                 │
│           ▼                                                                 │
│  ┌─────────────────┐     NO      ┌─────────────────┐                        │
│  │ Valid Word?     │ ───────────▶│  Shake Row      │                        │
│  └────────┬────────┘             │  Show "Not in   │                        │
│           │ YES                  │  word list"     │                        │
│           ▼                      └─────────────────┘                        │
│  ┌─────────────────┐                                                        │
│  │  Validate       │                                                        │
│  │  Each Letter    │                                                        │
│  │  Green/Yellow/  │                                                        │
│  │  Gray           │                                                        │
│  └────────┬────────┘                                                        │
│           │                                                                 │
│           ▼                                                                 │
│  ┌─────────────────┐     YES     ┌─────────────────┐                        │
│  │ All Green?      │ ───────────▶│  WIN! 🎉        │                        │
│  └────────┬────────┘             │  Bounce anim    │                        │
│           │ NO                   │  Update stats   │                        │
│           ▼                      └─────────────────┘                        │
│  ┌─────────────────┐     YES     ┌─────────────────┐                        │
│  │ Attempt 6?      │ ───────────▶│  LOSE 😢        │                        │
│  └────────┬────────┘             │  Reveal word    │                        │
│           │ NO                   └─────────────────┘                        │
│           │                                                                 │
│           └──────────▶ Next Row                                             │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 2.2 Letter States

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        LETTER VALIDATION STATES                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Target Word: CRANE                                                         │
│  Guess:       BEARS                                                         │
│                                                                             │
│  ┌───┬───┬───┬───┬───┐                                                     │
│  │ B │ E │ A │ R │ S │                                                     │
│  └───┴───┴───┴───┴───┘                                                     │
│    ⬛   🟨   🟨   🟨   ⬛                                                     │
│                                                                             │
│  B → ABSENT (not in CRANE)                                                  │
│  E → PRESENT (in CRANE, wrong position)                                     │
│  A → PRESENT (in CRANE, wrong position)                                     │
│  R → PRESENT (in CRANE, wrong position)                                     │
│  S → ABSENT (not in CRANE)                                                  │
│                                                                             │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                             │
│  Target: ABBEY                                                              │
│  Guess:  BABES                                                              │
│                                                                             │
│  ┌───┬───┬───┬───┬───┐                                                     │
│  │ B │ A │ B │ E │ S │                                                     │
│  └───┴───┴───┴───┴───┘                                                     │
│    🟨   🟨   🟩   🟩   ⬛                                                     │
│                                                                             │
│  B(1) → PRESENT (B exists but not at position 0)                            │
│  A    → PRESENT (A exists but not at position 1)                            │
│  B(2) → CORRECT (B is at position 2)                                        │
│  E    → CORRECT (E is at position 3)                                        │
│  S    → ABSENT (S not in ABBEY)                                             │
│                                                                             │
│  ⚠️ Tricky: First B is yellow, not green!                                    │
│  The algorithm must track remaining letter counts.                          │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
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
│  │   Header    │       │    Board    │       │  Keyboard   │               │
│  │ Title/Menu  │       │             │       │             │               │
│  └─────────────┘       └──────┬──────┘       └──────┬──────┘               │
│                               │                     │                       │
│                               ▼                     ▼                       │
│                        ┌─────────────┐       ┌─────────────┐               │
│                        │     Row     │ × 6   │     Key     │ × 28          │
│                        └──────┬──────┘       └─────────────┘               │
│                               │                                             │
│                               ▼                                             │
│                        ┌─────────────┐                                      │
│                        │    Tile     │ × 5                                  │
│                        └─────────────┘                                      │
│                                                                             │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                             │
│  Modals:                                                                    │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                         │
│  │   Stats     │  │  Settings   │  │    Help     │                         │
│  │   Modal     │  │   Modal     │  │   Modal     │                         │
│  └─────────────┘  └─────────────┘  └─────────────┘                         │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 3.2 UI Layout

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           WORDLE UI                                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  ☰  │                    WORDLE                    │  📊  │  ⚙️  │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│                    ┌───┬───┬───┬───┬───┐                                   │
│                    │ W │ E │ A │ R │ Y │   Row 1 (submitted)               │
│                    └───┴───┴───┴───┴───┘                                   │
│                    ┌───┬───┬───┬───┬───┐                                   │
│                    │ P │ I │ L │ O │ T │   Row 2 (submitted)               │
│                    └───┴───┴───┴───┴───┘                                   │
│                    ┌───┬───┬───┬───┬───┐                                   │
│                    │ C │ R │ A │   │   │   Row 3 (current)                 │
│                    └───┴───┴───┴───┴───┘                                   │
│                    ┌───┬───┬───┬───┬───┐                                   │
│                    │   │   │   │   │   │   Row 4 (empty)                   │
│                    └───┴───┴───┴───┴───┘                                   │
│                    ┌───┬───┬───┬───┬───┐                                   │
│                    │   │   │   │   │   │   Row 5 (empty)                   │
│                    └───┴───┴───┴───┴───┘                                   │
│                    ┌───┬───┬───┬───┬───┐                                   │
│                    │   │   │   │   │   │   Row 6 (empty)                   │
│                    └───┴───┴───┴───┴───┘                                   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  Q   W   E   R   T   Y   U   I   O   P                              │   │
│  │    A   S   D   F   G   H   J   K   L                                │   │
│  │  ENTER   Z   X   C   V   B   N   M   ⌫                              │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Data Model

### 4.1 TypeScript Types

```typescript
// ═══════════════════════════════════════════════════════════════
// TILE STATE
// ═══════════════════════════════════════════════════════════════

type TileState = 'empty' | 'tbd' | 'correct' | 'present' | 'absent';

interface Tile {
  letter: string;
  state: TileState;
}

// ═══════════════════════════════════════════════════════════════
// GAME STATE
// ═══════════════════════════════════════════════════════════════

interface GameState {
  targetWord: string;
  guesses: string[];               // Submitted guesses
  currentGuess: string;            // Current input
  evaluations: TileState[][];      // Results per guess
  gameStatus: 'playing' | 'won' | 'lost';
  currentRow: number;
  keyboardState: Map<string, TileState>;
}

// ═══════════════════════════════════════════════════════════════
// STATISTICS
// ═══════════════════════════════════════════════════════════════

interface Statistics {
  gamesPlayed: number;
  gamesWon: number;
  currentStreak: number;
  maxStreak: number;
  guessDistribution: number[];    // [0] = win on guess 1, etc.
}

// ═══════════════════════════════════════════════════════════════
// CONFIG
// ═══════════════════════════════════════════════════════════════

const WORD_LENGTH = 5;
const MAX_ATTEMPTS = 6;
const FLIP_DURATION = 300;  // ms per tile flip
const SHAKE_DURATION = 600; // ms for invalid word shake
```

---

## 5. Letter Validation Algorithm

### 5.1 The Tricky Part: Duplicate Letters

```
Target: ABBEY
Guess:  BABES

Naive approach (wrong):
  B → exists in ABBEY → Yellow ❌
  A → exists in ABBEY → Yellow ✓
  B → exists in ABBEY → Yellow ❌
  E → exact match → Green ✓
  S → not in ABBEY → Gray ✓

Problem: "B" appears 2x in guess, 2x in target
  - Position 2 is exact match → Green
  - Position 0 should be Yellow (there's a second B at position 1)
  
We need to TRACK remaining letter counts!
```

### 5.2 Two-Pass Algorithm

```typescript
function evaluateGuess(guess: string, target: string): TileState[] {
  const result: TileState[] = Array(5).fill('absent');
  const targetLetterCounts = new Map<string, number>();

  // Count letters in target
  for (const letter of target) {
    targetLetterCounts.set(letter, (targetLetterCounts.get(letter) || 0) + 1);
  }

  // PASS 1: Mark exact matches (green)
  for (let i = 0; i < 5; i++) {
    if (guess[i] === target[i]) {
      result[i] = 'correct';
      targetLetterCounts.set(guess[i], targetLetterCounts.get(guess[i])! - 1);
    }
  }

  // PASS 2: Mark present (yellow) if letter exists and count > 0
  for (let i = 0; i < 5; i++) {
    if (result[i] !== 'correct') {
      const count = targetLetterCounts.get(guess[i]) || 0;
      if (count > 0) {
        result[i] = 'present';
        targetLetterCounts.set(guess[i], count - 1);
      }
    }
  }

  return result;
}

// Example:
// evaluateGuess('BABES', 'ABBEY')
// → ['present', 'present', 'correct', 'correct', 'absent']
//     B         A          B          E          S
```

### 5.3 Visual Explanation

```
Target: A B B E Y
        ↓ ↓ ↓ ↓ ↓
Counts: A:1, B:2, E:1, Y:1

Guess:  B A B E S
        ↓ ↓ ↓ ↓ ↓

PASS 1 (Exact matches):
Position 0: B ≠ A → skip
Position 1: A ≠ B → skip
Position 2: B = B → GREEN ✓, B count: 2 → 1
Position 3: E = E → GREEN ✓, E count: 1 → 0
Position 4: S ≠ Y → skip

After Pass 1: [-, -, GREEN, GREEN, -]
Remaining counts: A:1, B:1, Y:1

PASS 2 (Present/Absent):
Position 0: B, count=1 → YELLOW ✓, B count: 1 → 0
Position 1: A, count=1 → YELLOW ✓, A count: 1 → 0
Position 4: S, count=0 → GRAY ✓

Final: [YELLOW, YELLOW, GREEN, GREEN, GRAY]
```

---

## 6. Keyboard State Management

### 6.1 State Priority

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    KEYBOARD STATE PRIORITY                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Priority (highest wins):                                                   │
│                                                                             │
│    1. CORRECT (green)  - Key is in correct position                        │
│    2. PRESENT (yellow) - Key is in word but wrong position                  │
│    3. ABSENT (gray)    - Key is not in word                                 │
│    4. UNUSED (default) - Key not yet used                                   │
│                                                                             │
│  Why priority matters:                                                      │
│                                                                             │
│  Guess 1: CRANE → C is ABSENT                                               │
│  Guess 2: CATCH → C is CORRECT at position 0                                │
│                                                                             │
│  After Guess 2, keyboard C should be GREEN (not gray)                       │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 6.2 Implementation

```typescript
const STATE_PRIORITY: Record<TileState, number> = {
  'empty': 0,
  'tbd': 0,
  'absent': 1,
  'present': 2,
  'correct': 3,
};

function updateKeyboardState(
  keyboard: Map<string, TileState>,
  guess: string,
  evaluation: TileState[]
): Map<string, TileState> {
  const newKeyboard = new Map(keyboard);

  for (let i = 0; i < guess.length; i++) {
    const letter = guess[i].toUpperCase();
    const newState = evaluation[i];
    const currentState = newKeyboard.get(letter) || 'empty';

    // Only update if new state has higher priority
    if (STATE_PRIORITY[newState] > STATE_PRIORITY[currentState]) {
      newKeyboard.set(letter, newState);
    }
  }

  return newKeyboard;
}
```

---

## 7. Animations

### 7.1 Animation Types

| Animation | Trigger | Duration |
|-----------|---------|----------|
| **Pop** | Letter typed | 100ms scale up/down |
| **Flip** | Row submitted | 300ms per tile, staggered |
| **Shake** | Invalid word | 600ms horizontal shake |
| **Bounce** | Game won | 100ms per tile, staggered |

### 7.2 CSS Animations

```css
/* Tile flip animation */
.tile {
  transition: transform 0.3s ease;
  transform-style: preserve-3d;
}

.tile.flip {
  animation: flip 0.6s ease;
}

@keyframes flip {
  0% { transform: rotateX(0deg); }
  50% { transform: rotateX(-90deg); }
  100% { transform: rotateX(0deg); }
}

/* Row shake animation */
.row.invalid {
  animation: shake 0.6s ease;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20% { transform: translateX(-10px); }
  40% { transform: translateX(10px); }
  60% { transform: translateX(-10px); }
  80% { transform: translateX(10px); }
}

/* Win bounce animation */
.tile.bounce {
  animation: bounce 1s ease;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-20px); }
  60% { transform: translateY(-10px); }
}
```

### 7.3 Staggered Flip

```typescript
function flipRow(rowIndex: number) {
  const tiles = document.querySelectorAll(`.row-${rowIndex} .tile`);
  
  tiles.forEach((tile, index) => {
    setTimeout(() => {
      tile.classList.add('flip');
      
      // Change color at midpoint of flip
      setTimeout(() => {
        tile.classList.add(getTileStateClass(index));
      }, FLIP_DURATION / 2);
      
    }, index * FLIP_DURATION);
  });
}
```

---

## 8. Optimization & Accessibility

### 8.1 Daily Word Selection

```typescript
// Deterministic word selection based on date
function getDailyWord(wordList: string[]): string {
  const today = new Date();
  const startDate = new Date('2022-01-01'); // Game launch date
  const daysSinceStart = Math.floor(
    (today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  
  return wordList[daysSinceStart % wordList.length];
}
```

### 8.2 Word Dictionary

```typescript
// Two word lists:
// 1. ANSWERS - Words that can be the target (~2300 words)
// 2. VALID_GUESSES - All valid 5-letter words (~10000 words)

const isValidWord = (word: string): boolean => {
  return VALID_GUESSES.includes(word.toLowerCase());
};
```

### 8.3 LocalStorage Persistence

```typescript
interface SavedState {
  gameState: GameState;
  statistics: Statistics;
  lastPlayed: string; // ISO date
}

function saveGame(state: SavedState): void {
  localStorage.setItem('wordle-state', JSON.stringify(state));
}

function loadGame(): SavedState | null {
  const saved = localStorage.getItem('wordle-state');
  if (!saved) return null;
  
  const state = JSON.parse(saved) as SavedState;
  
  // Check if it's a new day
  const today = new Date().toISOString().split('T')[0];
  if (state.lastPlayed !== today) {
    // Reset game state but keep statistics
    return {
      gameState: createNewGame(),
      statistics: state.statistics,
      lastPlayed: today,
    };
  }
  
  return state;
}
```

### 8.4 Accessibility

```html
<!-- Screen reader announcements -->
<div 
  role="status" 
  aria-live="polite" 
  aria-atomic="true"
  class="sr-only"
>
  <!-- Announce results after each guess -->
  Row 1: W absent, E present, A correct, R absent, Y absent
</div>

<!-- Keyboard with ARIA -->
<div role="group" aria-label="Keyboard">
  <button 
    aria-label="Q, unused"
    data-key="Q"
  >Q</button>
</div>

<!-- Game board -->
<div role="grid" aria-label="Game board">
  <div role="row">
    <div role="cell" aria-label="1st letter, W, absent">W</div>
  </div>
</div>
```

### 8.5 Share Results

```typescript
function generateShareText(state: GameState): string {
  const emojiMap: Record<TileState, string> = {
    'correct': '🟩',
    'present': '🟨',
    'absent': '⬛',
    'empty': '⬜',
    'tbd': '⬜',
  };

  const dayNumber = getDayNumber();
  const attempts = state.gameStatus === 'won' 
    ? state.guesses.length 
    : 'X';

  const grid = state.evaluations
    .map(row => row.map(state => emojiMap[state]).join(''))
    .join('\n');

  return `Wordle ${dayNumber} ${attempts}/6\n\n${grid}`;
}

function copyToClipboard(text: string): Promise<void> {
  return navigator.clipboard.writeText(text);
}
```

---

## Summary

| Section | Key Decision |
|---------|--------------|
| **Word Length** | Fixed 5 letters, 6 attempts |
| **Validation** | Two-pass algorithm for duplicate letters |
| **Keyboard** | State priority (green > yellow > gray) |
| **Animation** | CSS animations with staggered timing |
| **Persistence** | localStorage for state and statistics |
| **Daily Word** | Deterministic hash from date |

### Key Takeaways

1. **Two-Pass Validation** - Handle duplicate letters correctly
2. **State Priority** - Keyboard state only upgrades, never downgrades
3. **Staggered Animations** - setTimeout for sequential tile flips
4. **Daily Consistency** - Same word for all players per day
5. **Accessibility** - ARIA live regions for screen readers

---

## References

- [Original Wordle](https://www.nytimes.com/games/wordle)
- [CSS Flip Animation](https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function/rotateX)
- [ARIA Live Regions](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Live_Regions)
