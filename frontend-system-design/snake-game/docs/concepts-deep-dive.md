# Snake Game - Concepts Deep Dive

> Detailed exploration of game development concepts for building the Snake game.

---

## Table of Contents

1. [Game Loop Pattern](#1-game-loop-pattern)
2. [Fixed Time Step vs Variable](#2-fixed-time-step-vs-variable)
3. [Efficient Snake Movement](#3-efficient-snake-movement)
4. [Random Food Placement](#4-random-food-placement)
5. [State Machine for Game Status](#5-state-machine-for-game-status)
6. [Local Storage for High Score](#6-local-storage-for-high-score)

---

## 1. Game Loop Pattern

### The Basic Loop

```typescript
class GameLoop {
  private running = false;
  private lastTime = 0;
  private accumulator = 0;
  private readonly tickRate: number; // ms per game tick

  constructor(tickRate: number = 150) {
    this.tickRate = tickRate;
  }

  start() {
    this.running = true;
    this.lastTime = performance.now();
    requestAnimationFrame(this.loop);
  }

  stop() {
    this.running = false;
  }

  private loop = (currentTime: number) => {
    if (!this.running) return;

    const deltaTime = currentTime - this.lastTime;
    this.lastTime = currentTime;
    this.accumulator += deltaTime;

    // Update at fixed intervals
    while (this.accumulator >= this.tickRate) {
      this.update();
      this.accumulator -= this.tickRate;
    }

    // Render every frame
    this.render();

    requestAnimationFrame(this.loop);
  };

  protected update() {
    // Override in subclass
  }

  protected render() {
    // Override in subclass
  }
}
```

### Why Separate Update and Render?

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    UPDATE vs RENDER RATES                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Game Logic (Update):                                                       │
│  • Runs at GAME SPEED (e.g., 150ms intervals)                               │
│  • Consistent gameplay regardless of hardware                               │
│  • Snake moves one cell per tick                                            │
│                                                                             │
│  Time: ─────●─────────●─────────●─────────●──────▶                          │
│            150ms      300ms     450ms     600ms                             │
│                                                                             │
│  Rendering:                                                                 │
│  • Runs at DISPLAY REFRESH (60 FPS = every 16.67ms)                         │
│  • Smooth visuals                                                           │
│  • Can interpolate for extra smoothness                                     │
│                                                                             │
│  Time: ──●──●──●──●──●──●──●──●──●──●──●──●──●──●──▶                         │
│          16  32  48  64  80  96 112 128 144 160                             │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Fixed Time Step vs Variable

### Fixed Time Step (Recommended for Snake)

```typescript
// Snake moves exactly one cell per tick
// Tick happens every 150ms (or current speed)
// Predictable, consistent gameplay

const TICK_RATE = 150; // ms

let lastTick = performance.now();

function gameLoop(currentTime: number) {
  if (currentTime - lastTick >= TICK_RATE) {
    // Move snake exactly one cell
    moveSnake();
    lastTick = currentTime;
  }
  
  render();
  requestAnimationFrame(gameLoop);
}
```

### Variable Time Step (Not for Snake)

```typescript
// Used for physics-based games
// Movement depends on deltaTime
// NOT suitable for grid-based games

let lastTime = performance.now();

function gameLoop(currentTime: number) {
  const deltaTime = currentTime - lastTime;
  lastTime = currentTime;
  
  // Move based on elapsed time
  position.x += velocity.x * deltaTime;
  
  render();
  requestAnimationFrame(gameLoop);
}
```

---

## 3. Efficient Snake Movement

### Naive Approach (O(n) memory allocation)

```typescript
// ❌ Creates new array and objects every move
function moveSnake(snake: Position[], direction: Direction): Position[] {
  const head = snake[0];
  const newHead = {
    x: head.x + DIRECTION_VECTORS[direction].x,
    y: head.y + DIRECTION_VECTORS[direction].y,
  };
  
  // Creates new array
  return [newHead, ...snake.slice(0, -1)];
}
```

### Optimized Approach (O(1) memory)

```typescript
// ✅ Reuse tail as new head - no new objects created
function moveSnake(snake: Position[], direction: Direction): void {
  // Remove tail
  const tail = snake.pop()!;
  
  // Reuse tail object as new head
  tail.x = snake[0].x + DIRECTION_VECTORS[direction].x;
  tail.y = snake[0].y + DIRECTION_VECTORS[direction].y;
  
  // Insert at front
  snake.unshift(tail);
}

// When eating food, DON'T pop the tail
function moveSnakeAndGrow(snake: Position[], direction: Direction): void {
  const newHead = {
    x: snake[0].x + DIRECTION_VECTORS[direction].x,
    y: snake[0].y + DIRECTION_VECTORS[direction].y,
  };
  snake.unshift(newHead);
  // Don't pop tail - snake grows!
}
```

### Visual Explanation

```
Before move (direction: RIGHT):
  ┌───┬───┬───┬───┐
  │ 4 │ 3 │ 2 │ 1 │  ← Head
  └───┴───┴───┴───┘
  Tail ↑

Step 1: Pop tail (segment 4)
  ┌───┬───┬───┐
  │ 3 │ 2 │ 1 │
  └───┴───┴───┘
  
Step 2: Reuse as new head position
  ┌───┬───┬───┬───┐
  │ 3 │ 2 │ 1 │ 4 │  ← New head (reused tail)
  └───┴───┴───┴───┘
```

---

## 4. Random Food Placement

### Naive Approach (Can be slow)

```typescript
// ❌ May take many attempts if snake is long
function spawnFood(snake: Position[], gridSize: number): Position {
  let food: Position;
  
  do {
    food = {
      x: Math.floor(Math.random() * gridSize),
      y: Math.floor(Math.random() * gridSize),
    };
  } while (isOnSnake(food, snake));
  
  return food;
}

function isOnSnake(pos: Position, snake: Position[]): boolean {
  return snake.some(s => s.x === pos.x && s.y === pos.y);
}
```

### Optimized Approach (O(n) guaranteed)

```typescript
// ✅ Build list of empty cells, pick random from that
function spawnFood(snake: Position[], gridWidth: number, gridHeight: number): Position {
  // Create set of occupied positions
  const occupied = new Set(
    snake.map(s => `${s.x},${s.y}`)
  );
  
  // Collect all empty cells
  const emptyCells: Position[] = [];
  for (let x = 0; x < gridWidth; x++) {
    for (let y = 0; y < gridHeight; y++) {
      if (!occupied.has(`${x},${y}`)) {
        emptyCells.push({ x, y });
      }
    }
  }
  
  // Pick random empty cell
  if (emptyCells.length === 0) {
    throw new Error('No empty cells - you win!');
  }
  
  const randomIndex = Math.floor(Math.random() * emptyCells.length);
  return emptyCells[randomIndex];
}
```

---

## 5. State Machine for Game Status

### State Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       GAME STATE MACHINE                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│                         ┌──────────┐                                        │
│                         │   IDLE   │                                        │
│                         └────┬─────┘                                        │
│                              │ Press any key                                │
│                              ▼                                              │
│                         ┌──────────┐                                        │
│             ┌──────────▶│ PLAYING  │◀──────────┐                            │
│             │           └────┬─────┘           │                            │
│             │                │                 │                            │
│             │ Resume         │ Pause           │ Restart                    │
│             │ (Space)        │ (Space)         │ (R key)                    │
│             │                ▼                 │                            │
│             │           ┌──────────┐           │                            │
│             └───────────│  PAUSED  │           │                            │
│                         └──────────┘           │                            │
│                                                │                            │
│                              │ Collision       │                            │
│                              ▼                 │                            │
│                         ┌──────────┐           │                            │
│                         │GAME_OVER │───────────┘                            │
│                         └──────────┘                                        │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Implementation

```typescript
type GameStatus = 'IDLE' | 'PLAYING' | 'PAUSED' | 'GAME_OVER';

interface StateTransition {
  from: GameStatus;
  action: string;
  to: GameStatus;
}

const TRANSITIONS: StateTransition[] = [
  { from: 'IDLE', action: 'START', to: 'PLAYING' },
  { from: 'PLAYING', action: 'PAUSE', to: 'PAUSED' },
  { from: 'PLAYING', action: 'COLLISION', to: 'GAME_OVER' },
  { from: 'PAUSED', action: 'RESUME', to: 'PLAYING' },
  { from: 'GAME_OVER', action: 'RESTART', to: 'PLAYING' },
];

class GameStateMachine {
  private status: GameStatus = 'IDLE';

  transition(action: string): boolean {
    const transition = TRANSITIONS.find(
      t => t.from === this.status && t.action === action
    );

    if (transition) {
      this.status = transition.to;
      return true;
    }

    return false; // Invalid transition
  }

  getStatus(): GameStatus {
    return this.status;
  }
}
```

---

## 6. Local Storage for High Score

### Implementation

```typescript
const HIGH_SCORE_KEY = 'snake-high-score';

function getHighScore(): number {
  const stored = localStorage.getItem(HIGH_SCORE_KEY);
  return stored ? parseInt(stored, 10) : 0;
}

function setHighScore(score: number): void {
  const current = getHighScore();
  if (score > current) {
    localStorage.setItem(HIGH_SCORE_KEY, score.toString());
  }
}

// In game over handler
function handleGameOver(score: number): void {
  setHighScore(score);
  const highScore = getHighScore();
  console.log(`Score: ${score}, High Score: ${highScore}`);
}
```

### With Error Handling

```typescript
class HighScoreManager {
  private readonly key = 'snake-high-score';

  get(): number {
    try {
      const stored = localStorage.getItem(this.key);
      const value = stored ? parseInt(stored, 10) : 0;
      return isNaN(value) ? 0 : value;
    } catch {
      // localStorage may be blocked in private mode
      return 0;
    }
  }

  set(score: number): boolean {
    try {
      if (score > this.get()) {
        localStorage.setItem(this.key, score.toString());
        return true; // New high score!
      }
      return false;
    } catch {
      return false;
    }
  }

  reset(): void {
    try {
      localStorage.removeItem(this.key);
    } catch {
      // Ignore
    }
  }
}
```

---

## Summary

| Concept | Key Takeaway |
|---------|--------------|
| **Game Loop** | Separate update (game speed) from render (60 FPS) |
| **Fixed Time Step** | Snake moves one cell per tick |
| **Snake Movement** | Reuse tail as head (O(1) memory) |
| **Food Spawn** | Build empty cell list, pick random |
| **State Machine** | Clear transitions between states |
| **High Score** | localStorage with error handling |

---

## References

- [Game Programming Patterns - Game Loop](https://gameprogrammingpatterns.com/game-loop.html)
- [Fix Your Timestep!](https://gafferongames.com/post/fix_your_timestep/)
- [MDN localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
