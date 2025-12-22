# Wordle - Concepts Deep Dive

> Detailed exploration of the key algorithms and patterns used in building Wordle.

---

## Table of Contents

1. [Two-Pass Letter Validation](#1-two-pass-letter-validation)
2. [Keyboard State Management](#2-keyboard-state-management)
3. [Daily Word Generation](#3-daily-word-generation)
4. [Statistics Tracking](#4-statistics-tracking)
5. [Animation Orchestration](#5-animation-orchestration)

---

## 1. Two-Pass Letter Validation

### Why Two Passes?

```
Target: ABBEY (B appears twice)
Guess:  BIBLE

Single-pass approach (WRONG):
  B at 0: not at position 0 in ABBEY → Yellow
  I at 1: not in ABBEY → Gray  
  B at 2: exact match → Green
  L at 3: not in ABBEY → Gray
  E at 4: not at position 4 in ABBEY → Yellow

Problem: B at position 0 is marked Yellow, but both B's in ABBEY
are accounted for (one at position 2 is exact match, one at
position 1 is "used" for position 2). 

Should be: [YELLOW, GRAY, GREEN, GRAY, YELLOW] ❌
Actually:  [GRAY, GRAY, GREEN, GRAY, PRESENT] ✓
```

### Complete Implementation

```typescript
type TileState = 'correct' | 'present' | 'absent';

function evaluateGuess(guess: string, target: string): TileState[] {
  const result: TileState[] = Array(5).fill('absent');
  const targetCounts = new Map<string, number>();
  
  // Build letter frequency map
  for (const letter of target) {
    targetCounts.set(letter, (targetCounts.get(letter) || 0) + 1);
  }
  
  // PASS 1: Find exact matches (GREEN)
  // These get priority and "consume" the letter
  for (let i = 0; i < 5; i++) {
    if (guess[i] === target[i]) {
      result[i] = 'correct';
      targetCounts.set(guess[i], targetCounts.get(guess[i])! - 1);
    }
  }
  
  // PASS 2: Find present letters (YELLOW)
  // Only if letter exists AND count > 0
  for (let i = 0; i < 5; i++) {
    if (result[i] === 'correct') continue; // Already green
    
    const letter = guess[i];
    const remaining = targetCounts.get(letter) || 0;
    
    if (remaining > 0) {
      result[i] = 'present';
      targetCounts.set(letter, remaining - 1);
    }
    // else: stays 'absent'
  }
  
  return result;
}
```

### Test Cases

```typescript
// Test: Basic case
evaluateGuess('CRANE', 'PIANO');
// C: absent, R: absent, A: present, N: present, E: absent
// → ['absent', 'absent', 'present', 'present', 'absent']

// Test: Duplicate letters in guess
evaluateGuess('ABBEY', 'KEBAB');
// A: present (A is at index 3 in KEBAB)
// B: present (first B is at index 2 in KEBAB) 
// B: correct (exact match at index 2)
// E: present (E is at index 1 in KEBAB)
// Y: absent
// → ['present', 'present', 'correct', 'present', 'absent']

// Test: More duplicates in guess than target
evaluateGuess('SPEED', 'CREEP')
// S: absent, P: present, E: correct, E: correct, D: absent
// → ['absent', 'present', 'correct', 'correct', 'absent']
// Note: Only 2 E's in target, both are exact matches
```

---

## 2. Keyboard State Management

### State Hierarchy

```typescript
type KeyState = 'unused' | 'absent' | 'present' | 'correct';

// Higher number = higher priority
const STATE_PRIORITY: Record<KeyState, number> = {
  unused: 0,
  absent: 1,
  present: 2,
  correct: 3,
};

// A key can only be UPGRADED, never downgraded
// If a letter was marked "correct" once, it stays green forever
```

### Implementation

```typescript
class KeyboardState {
  private state: Map<string, KeyState> = new Map();
  
  constructor() {
    // Initialize all keys as unused
    'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').forEach(key => {
      this.state.set(key, 'unused');
    });
  }
  
  update(guess: string, evaluation: TileState[]): void {
    for (let i = 0; i < guess.length; i++) {
      const letter = guess[i].toUpperCase();
      const newState = this.tileToKey(evaluation[i]);
      const currentState = this.state.get(letter) || 'unused';
      
      // Only upgrade, never downgrade
      if (STATE_PRIORITY[newState] > STATE_PRIORITY[currentState]) {
        this.state.set(letter, newState);
      }
    }
  }
  
  private tileToKey(tile: TileState): KeyState {
    return tile as KeyState; // Same names in this case
  }
  
  getState(letter: string): KeyState {
    return this.state.get(letter.toUpperCase()) || 'unused';
  }
  
  getAll(): Map<string, KeyState> {
    return new Map(this.state);
  }
}
```

### Visual Example

```
Game Progress:
  Guess 1: CRANE → C:absent, R:absent, A:correct, N:present, E:absent
  Guess 2: STARK → S:absent, T:absent, A:correct, R:absent, K:absent

Keyboard after Guess 1:
  C:gray, R:gray, A:green, N:yellow, E:gray

Keyboard after Guess 2:
  C:gray, R:gray (stays gray, not downgraded)
  A:green (stays green)
  N:yellow (unchanged)
  E:gray
  S:gray, T:gray, K:gray (newly marked)
```

---

## 3. Daily Word Generation

### Deterministic Selection

```typescript
// All players get the same word on the same day
// Word cycles through the answer list based on days since launch

const ANSWERS: string[] = [
  'CIGAR', 'REBUT', 'SISSY', 'HUMPH', 'AWAKE',
  'BLUSH', 'FOCAL', 'EVADE', 'NAVAL', 'SERVE',
  // ... ~2300 words
];

const LAUNCH_DATE = new Date('2021-06-19'); // Wordle launch date

function getDayNumber(): number {
  const now = new Date();
  const diff = now.getTime() - LAUNCH_DATE.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

function getTodaysWord(): string {
  const dayNumber = getDayNumber();
  return ANSWERS[dayNumber % ANSWERS.length];
}

// Example:
// Day 0 (June 19, 2021): CIGAR
// Day 1 (June 20, 2021): REBUT
// Day 2309 (wraps): CIGAR again
```

### Word Validation

```typescript
// Two separate lists:
// 1. ANSWERS - Words that can be the daily word (~2300)
// 2. VALID_GUESSES - All valid 5-letter words (~10000)
//    Includes ANSWERS + obscure words that are valid guesses

const VALID_GUESSES: Set<string> = new Set([
  'AAHED', 'AALII', 'AARGH', 'ABACA', 'ABACI',
  // ... ~10000 words
]);

function isValidGuess(word: string): boolean {
  return VALID_GUESSES.has(word.toUpperCase());
}

// "XYZZY" is not valid (not in dictionary)
// "FJORD" is valid (in dictionary) but may/may not be in answers
```

---

## 4. Statistics Tracking

### Data Model

```typescript
interface Statistics {
  gamesPlayed: number;
  gamesWon: number;
  currentStreak: number;
  maxStreak: number;
  guessDistribution: number[]; // Index 0 = won on guess 1
  lastPlayed: string | null;   // ISO date string
}

const DEFAULT_STATS: Statistics = {
  gamesPlayed: 0,
  gamesWon: 0,
  currentStreak: 0,
  maxStreak: 0,
  guessDistribution: [0, 0, 0, 0, 0, 0],
  lastPlayed: null,
};
```

### Statistics Manager

```typescript
class StatisticsManager {
  private stats: Statistics;
  private readonly STORAGE_KEY = 'wordle-stats';
  
  constructor() {
    this.stats = this.load();
  }
  
  private load(): Statistics {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    return saved ? JSON.parse(saved) : { ...DEFAULT_STATS };
  }
  
  private save(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.stats));
  }
  
  recordWin(guessNumber: number): void {
    const today = new Date().toISOString().split('T')[0];
    
    this.stats.gamesPlayed++;
    this.stats.gamesWon++;
    this.stats.guessDistribution[guessNumber - 1]++;
    
    // Update streak
    if (this.isConsecutiveDay()) {
      this.stats.currentStreak++;
    } else {
      this.stats.currentStreak = 1;
    }
    this.stats.maxStreak = Math.max(this.stats.maxStreak, this.stats.currentStreak);
    
    this.stats.lastPlayed = today;
    this.save();
  }
  
  recordLoss(): void {
    const today = new Date().toISOString().split('T')[0];
    
    this.stats.gamesPlayed++;
    this.stats.currentStreak = 0;
    this.stats.lastPlayed = today;
    
    this.save();
  }
  
  private isConsecutiveDay(): boolean {
    if (!this.stats.lastPlayed) return false;
    
    const last = new Date(this.stats.lastPlayed);
    const today = new Date();
    const diff = today.getTime() - last.getTime();
    const daysDiff = diff / (1000 * 60 * 60 * 24);
    
    return daysDiff >= 1 && daysDiff < 2;
  }
  
  getWinPercentage(): number {
    if (this.stats.gamesPlayed === 0) return 0;
    return Math.round((this.stats.gamesWon / this.stats.gamesPlayed) * 100);
  }
  
  getStats(): Statistics {
    return { ...this.stats };
  }
}
```

---

## 5. Animation Orchestration

### Sequential Tile Flip

```typescript
class AnimationController {
  private readonly FLIP_DURATION = 300; // ms per tile
  private readonly FLIP_DELAY = 300;    // ms between tiles
  
  async flipRow(
    rowIndex: number, 
    evaluation: TileState[],
    onTileFlip: (tileIndex: number, state: TileState) => void
  ): Promise<void> {
    // Return promise that resolves when all animations complete
    return new Promise((resolve) => {
      const totalDuration = 5 * this.FLIP_DELAY + this.FLIP_DURATION;
      
      for (let i = 0; i < 5; i++) {
        setTimeout(() => {
          // Callback to update UI state
          onTileFlip(i, evaluation[i]);
        }, i * this.FLIP_DELAY);
      }
      
      setTimeout(resolve, totalDuration);
    });
  }
  
  async shakeRow(rowElement: HTMLElement): Promise<void> {
    rowElement.classList.add('shake');
    
    return new Promise((resolve) => {
      setTimeout(() => {
        rowElement.classList.remove('shake');
        resolve();
      }, 600);
    });
  }
  
  async bounceRow(rowIndex: number): Promise<void> {
    const tiles = document.querySelectorAll(`.row-${rowIndex} .tile`);
    
    return new Promise((resolve) => {
      tiles.forEach((tile, i) => {
        setTimeout(() => {
          tile.classList.add('bounce');
        }, i * 100);
      });
      
      setTimeout(resolve, 500 + 100 * 5);
    });
  }
}
```

### Usage in Game Flow

```typescript
async function submitGuess(): Promise<void> {
  const guess = currentGuess.toUpperCase();
  
  // Validate
  if (!isValidGuess(guess)) {
    await animationController.shakeRow(getCurrentRow());
    showToast('Not in word list');
    return;
  }
  
  // Evaluate
  const evaluation = evaluateGuess(guess, targetWord);
  
  // Animate flip and reveal colors
  await animationController.flipRow(currentRowIndex, evaluation, (i, state) => {
    updateTileState(currentRowIndex, i, state);
    keyboardState.update(guess[i], state);
  });
  
  // Check win
  if (evaluation.every(s => s === 'correct')) {
    await animationController.bounceRow(currentRowIndex);
    showToast('Genius!');
    endGame('won');
    return;
  }
  
  // Check loss
  if (currentRowIndex >= 5) {
    showToast(targetWord);
    endGame('lost');
    return;
  }
  
  // Continue
  currentRowIndex++;
  currentGuess = '';
}
```

---

## Summary

| Concept | Key Point |
|---------|-----------|
| **Two-Pass** | Greens first, then yellows with remaining count |
| **Keyboard** | Only upgrade state, never downgrade |
| **Daily Word** | Days since launch mod word count |
| **Statistics** | Track streaks, distribution, persist to localStorage |
| **Animation** | Promise-based sequential with delays |

---

## References

- [Wordle Clone Tutorial](https://www.youtube.com/watch?v=mpby4HiElek)
- [CSS Animation](https://developer.mozilla.org/en-US/docs/Web/CSS/animation)
- [LocalStorage API](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
