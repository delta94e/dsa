# Snake Game Frontend System Design

> A comprehensive frontend system design for building a classic Snake game with Canvas rendering, game loop, and state management.

---

## Table of Contents

1. [Requirements Exploration](#1-requirements-exploration)
2. [Design Consideration: Canvas vs DOM](#2-design-consideration-canvas-vs-dom)
3. [Game Architecture](#3-game-architecture)
4. [Data Model](#4-data-model)
5. [Game Loop](#5-game-loop)
6. [Collision Detection](#6-collision-detection)
7. [Input Handling](#7-input-handling)
8. [Rendering](#8-rendering)
9. [Optimization](#9-optimization)

---

## 1. Requirements Exploration

### 1.1 General Requirements

| Feature | Description |
|---------|-------------|
| **Grid-based Movement** | Snake moves on a discrete grid |
| **Direction Control** | Arrow keys / WASD for movement |
| **Food Spawning** | Random food placement |
| **Snake Growth** | Snake grows when eating food |
| **Score Tracking** | Points increase with each food |
| **Game Over** | Collision with wall or self |
| **Restart** | Ability to restart game |

### 1.2 Functional Requirements

| Requirement | Description |
|-------------|-------------|
| **Smooth Animation** | 60 FPS rendering |
| **Responsive Controls** | Immediate direction change |
| **Touch Support** | Swipe gestures for mobile |
| **Pause/Resume** | Spacebar to pause |
| **Speed Increase** | Game speeds up as score increases |
| **High Score** | Persist best score in localStorage |

---

## 2. Design Consideration: Canvas vs DOM

### Canvas Approach ✅ (Recommended)

```
PROS:
  ✅ Best performance for animation
  ✅ Single element to manage
  ✅ Easy pixel-level control
  ✅ GPU accelerated
  ✅ No DOM manipulation overhead

CONS:
  ❌ No native accessibility
  ❌ Manual hit detection
```

### DOM Approach

```
PROS:
  ✅ Built-in accessibility
  ✅ CSS animations available
  ✅ Event bubbling

CONS:
  ❌ Many elements to manage
  ❌ Performance issues with frequent updates
  ❌ More memory usage
```

**Decision: Canvas** - Best for game rendering with frequent updates

---

## 3. Game Architecture

### 3.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         SNAKE GAME ARCHITECTURE                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│                        ┌───────────────────┐                                │
│                        │    Game Engine    │                                │
│                        │  (Orchestrator)   │                                │
│                        └─────────┬─────────┘                                │
│                                  │                                          │
│         ┌────────────────────────┼────────────────────────┐                 │
│         │                        │                        │                 │
│         ▼                        ▼                        ▼                 │
│  ┌─────────────┐         ┌─────────────┐         ┌─────────────┐           │
│  │   Input     │         │    State    │         │  Renderer   │           │
│  │  Handler    │         │   Manager   │         │  (Canvas)   │           │
│  └──────┬──────┘         └──────┬──────┘         └──────┬──────┘           │
│         │                       │                       │                   │
│         │    ┌──────────────────┴──────────────────┐    │                   │
│         │    │                                     │    │                   │
│         ▼    ▼                                     ▼    ▼                   │
│  ┌─────────────────┐                     ┌─────────────────┐               │
│  │  Input Queue    │                     │    Game State   │               │
│  │  (Direction)    │                     │ • Snake body    │               │
│  └─────────────────┘                     │ • Food position │               │
│                                          │ • Score         │               │
│                                          │ • Game status   │               │
│                                          └─────────────────┘               │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 3.2 Component Responsibilities

| Component | Responsibility |
|-----------|----------------|
| **Game Engine** | Orchestrates game loop, updates, and rendering |
| **Input Handler** | Captures keyboard/touch events |
| **State Manager** | Manages game state (snake, food, score) |
| **Renderer** | Draws game state to Canvas |
| **Collision Detector** | Checks for wall/self collisions |

---

## 4. Data Model

### 4.1 TypeScript Types

```typescript
// ═══════════════════════════════════════════════════════════════
// POSITION - A point on the grid
// ═══════════════════════════════════════════════════════════════

interface Position {
  x: number;
  y: number;
}

// ═══════════════════════════════════════════════════════════════
// DIRECTION - Movement direction
// ═══════════════════════════════════════════════════════════════

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

const DIRECTION_VECTORS: Record<Direction, Position> = {
  UP:    { x: 0,  y: -1 },
  DOWN:  { x: 0,  y: 1 },
  LEFT:  { x: -1, y: 0 },
  RIGHT: { x: 1,  y: 0 },
};

// Opposite directions (can't reverse 180°)
const OPPOSITE: Record<Direction, Direction> = {
  UP: 'DOWN',
  DOWN: 'UP',
  LEFT: 'RIGHT',
  RIGHT: 'LEFT',
};

// ═══════════════════════════════════════════════════════════════
// GAME STATE - Complete game state
// ═══════════════════════════════════════════════════════════════

interface GameState {
  snake: Position[];          // Head is at index 0
  direction: Direction;       // Current movement direction
  nextDirection: Direction;   // Queued direction change
  food: Position;             // Current food position
  score: number;              // Current score
  highScore: number;          // Best score (persisted)
  status: GameStatus;         // Current game status
  speed: number;              // Milliseconds per tick
}

type GameStatus = 'IDLE' | 'PLAYING' | 'PAUSED' | 'GAME_OVER';

// ═══════════════════════════════════════════════════════════════
// GAME CONFIG - Configuration constants
// ═══════════════════════════════════════════════════════════════

interface GameConfig {
  gridWidth: number;      // Grid cells horizontally
  gridHeight: number;     // Grid cells vertically
  cellSize: number;       // Pixel size of each cell
  initialSpeed: number;   // Starting speed (ms per tick)
  speedIncrement: number; // Speed increase per food
  minSpeed: number;       // Maximum speed cap
}

const DEFAULT_CONFIG: GameConfig = {
  gridWidth: 20,
  gridHeight: 20,
  cellSize: 20,
  initialSpeed: 150,
  speedIncrement: 5,
  minSpeed: 50,
};
```

---

## 5. Game Loop

### 5.1 Loop Structure

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           GAME LOOP                                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  requestAnimationFrame (60 FPS)                                             │
│                │                                                            │
│                ▼                                                            │
│  ┌─────────────────────────────────────────────────────────────┐           │
│  │  1. CHECK ELAPSED TIME                                      │           │
│  │     if (elapsed < speed) return; // Not time for update     │           │
│  └─────────────────────────────────────────────────────────────┘           │
│                │                                                            │
│                ▼                                                            │
│  ┌─────────────────────────────────────────────────────────────┐           │
│  │  2. PROCESS INPUT                                           │           │
│  │     Apply queued direction change                           │           │
│  └─────────────────────────────────────────────────────────────┘           │
│                │                                                            │
│                ▼                                                            │
│  ┌─────────────────────────────────────────────────────────────┐           │
│  │  3. UPDATE STATE                                            │           │
│  │     • Move snake head in direction                          │           │
│  │     • Check collisions (wall, self)                         │           │
│  │     • Check food collision                                  │           │
│  │     • Grow or move tail                                     │           │
│  └─────────────────────────────────────────────────────────────┘           │
│                │                                                            │
│                ▼                                                            │
│  ┌─────────────────────────────────────────────────────────────┐           │
│  │  4. RENDER                                                  │           │
│  │     • Clear canvas                                          │           │
│  │     • Draw grid (optional)                                  │           │
│  │     • Draw food                                             │           │
│  │     • Draw snake                                            │           │
│  │     • Draw score                                            │           │
│  └─────────────────────────────────────────────────────────────┘           │
│                │                                                            │
│                ▼                                                            │
│           Loop back to requestAnimationFrame                                │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 5.2 Implementation Pattern

```typescript
class GameLoop {
  private lastUpdateTime = 0;
  private animationId: number | null = null;

  start() {
    this.lastUpdateTime = performance.now();
    this.loop();
  }

  stop() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  private loop = () => {
    const now = performance.now();
    const elapsed = now - this.lastUpdateTime;

    if (elapsed >= this.state.speed) {
      this.processInput();
      this.updateState();
      this.lastUpdateTime = now;
    }

    // Always render for smooth visuals
    this.render();

    this.animationId = requestAnimationFrame(this.loop);
  };
}
```

---

## 6. Collision Detection

### 6.1 Types of Collision

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     COLLISION DETECTION                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  1. WALL COLLISION                                                          │
│  ┌─────────────────────────────────┐                                        │
│  │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │  Check if head position:               │
│  │ ░                            ░  │    x < 0                               │
│  │ ░   🐍➡️                       ░  │    x >= gridWidth                      │
│  │ ░                            ░  │    y < 0                               │
│  │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │    y >= gridHeight                     │
│  └─────────────────────────────────┘                                        │
│                                                                             │
│  2. SELF COLLISION                                                          │
│  ┌─────────────────────────────────┐                                        │
│  │                                 │  Check if new head position            │
│  │       ⬛⬛⬛                     │  matches any body segment               │
│  │       ⬛ ⬛                     │                                        │
│  │       ⬛⬛⬛  ← Head hits body   │  Skip head (index 0)                   │
│  │                                 │  Check indices 1 to length-1           │
│  └─────────────────────────────────┘                                        │
│                                                                             │
│  3. FOOD COLLISION                                                          │
│  ┌─────────────────────────────────┐                                        │
│  │                                 │  Check if head position                │
│  │      🐍➡️🍎                      │  equals food position                  │
│  │                                 │                                        │
│  │      If true:                   │                                        │
│  │        • Increase score         │                                        │
│  │        • Don't remove tail      │                                        │
│  │        • Spawn new food         │                                        │
│  │        • Increase speed         │                                        │
│  └─────────────────────────────────┘                                        │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 6.2 Implementation

```typescript
function checkWallCollision(head: Position, config: GameConfig): boolean {
  return (
    head.x < 0 ||
    head.x >= config.gridWidth ||
    head.y < 0 ||
    head.y >= config.gridHeight
  );
}

function checkSelfCollision(head: Position, body: Position[]): boolean {
  // Start from index 1 (skip head)
  return body.slice(1).some(segment =>
    segment.x === head.x && segment.y === head.y
  );
}

function checkFoodCollision(head: Position, food: Position): boolean {
  return head.x === food.x && head.y === food.y;
}
```

---

## 7. Input Handling

### 7.1 Keyboard Mapping

```typescript
const KEY_MAP: Record<string, Direction> = {
  ArrowUp: 'UP',
  ArrowDown: 'DOWN',
  ArrowLeft: 'LEFT',
  ArrowRight: 'RIGHT',
  KeyW: 'UP',
  KeyS: 'DOWN',
  KeyA: 'LEFT',
  KeyD: 'RIGHT',
};
```

### 7.2 Input Queue Strategy

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     INPUT QUEUE (Prevent 180° Turn)                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Problem: Player presses RIGHT then DOWN very quickly                       │
│           Before snake moves, direction changes to DOWN                     │
│           If current direction is UP, this is valid                         │
│           But if processed after moving RIGHT, DOWN is invalid              │
│                                                                             │
│  Solution: Use nextDirection as queue                                       │
│                                                                             │
│  ┌─────────────┐     ┌─────────────┐     ┌─────────────┐                   │
│  │  Keystroke  │────▶│ Validate    │────▶│  Queue      │                   │
│  │  Event      │     │ vs Current  │     │  nextDir    │                   │
│  └─────────────┘     └─────────────┘     └─────────────┘                   │
│                                                                             │
│  On update:                                                                 │
│  1. direction = nextDirection                                               │
│  2. Move snake                                                              │
│                                                                             │
│  This ensures we always validate against the ACTUAL direction               │
│  when the move is applied, not when the key was pressed.                    │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 7.3 Touch/Swipe Support

```typescript
class TouchHandler {
  private startX = 0;
  private startY = 0;
  private readonly threshold = 30; // Minimum swipe distance

  setup(element: HTMLElement, onDirection: (dir: Direction) => void) {
    element.addEventListener('touchstart', (e) => {
      this.startX = e.touches[0].clientX;
      this.startY = e.touches[0].clientY;
    });

    element.addEventListener('touchend', (e) => {
      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;

      const deltaX = endX - this.startX;
      const deltaY = endY - this.startY;

      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Horizontal swipe
        if (Math.abs(deltaX) > this.threshold) {
          onDirection(deltaX > 0 ? 'RIGHT' : 'LEFT');
        }
      } else {
        // Vertical swipe
        if (Math.abs(deltaY) > this.threshold) {
          onDirection(deltaY > 0 ? 'DOWN' : 'UP');
        }
      }
    });
  }
}
```

---

## 8. Rendering

### 8.1 Canvas Drawing

```typescript
class Renderer {
  private ctx: CanvasRenderingContext2D;
  
  constructor(private canvas: HTMLCanvasElement, private config: GameConfig) {
    this.ctx = canvas.getContext('2d')!;
    canvas.width = config.gridWidth * config.cellSize;
    canvas.height = config.gridHeight * config.cellSize;
  }

  render(state: GameState) {
    this.clear();
    this.drawGrid();
    this.drawFood(state.food);
    this.drawSnake(state.snake);
    this.drawScore(state.score);
    
    if (state.status === 'GAME_OVER') {
      this.drawGameOver();
    }
  }

  private clear() {
    this.ctx.fillStyle = '#1a1a2e';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  private drawGrid() {
    this.ctx.strokeStyle = '#252542';
    for (let x = 0; x <= this.config.gridWidth; x++) {
      this.ctx.beginPath();
      this.ctx.moveTo(x * this.config.cellSize, 0);
      this.ctx.lineTo(x * this.config.cellSize, this.canvas.height);
      this.ctx.stroke();
    }
    for (let y = 0; y <= this.config.gridHeight; y++) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y * this.config.cellSize);
      this.ctx.lineTo(this.canvas.width, y * this.config.cellSize);
      this.ctx.stroke();
    }
  }

  private drawFood(food: Position) {
    this.ctx.fillStyle = '#e94560';
    this.ctx.beginPath();
    this.ctx.arc(
      food.x * this.config.cellSize + this.config.cellSize / 2,
      food.y * this.config.cellSize + this.config.cellSize / 2,
      this.config.cellSize / 2 - 2,
      0,
      Math.PI * 2
    );
    this.ctx.fill();
  }

  private drawSnake(snake: Position[]) {
    snake.forEach((segment, index) => {
      // Gradient from head to tail
      const brightness = 1 - (index / snake.length) * 0.5;
      this.ctx.fillStyle = `hsl(145, 63%, ${45 * brightness}%)`;
      
      this.ctx.fillRect(
        segment.x * this.config.cellSize + 1,
        segment.y * this.config.cellSize + 1,
        this.config.cellSize - 2,
        this.config.cellSize - 2
      );
    });
  }
}
```

---

## 9. Optimization

### 9.1 Performance Tips

| Optimization | Description |
|--------------|-------------|
| **Separate Update/Render** | Update at game speed, render at 60 FPS |
| **Use Integer Math** | Grid positions are integers |
| **Minimize Object Creation** | Reuse position objects |
| **Batch Drawing** | Draw similar elements together |
| **RequestAnimationFrame** | Sync with browser refresh |

### 9.2 Memory Optimization

```typescript
// ❌ Bad: Creating new objects every frame
function moveSnake(snake: Position[], dir: Direction): Position[] {
  const newHead = { ...snake[0] };
  newHead.x += DIRECTION_VECTORS[dir].x;
  newHead.y += DIRECTION_VECTORS[dir].y;
  return [newHead, ...snake.slice(0, -1)];
}

// ✅ Good: Reuse tail segment as new head
function moveSnake(snake: Position[], dir: Direction): void {
  const tail = snake.pop()!;
  tail.x = snake[0].x + DIRECTION_VECTORS[dir].x;
  tail.y = snake[0].y + DIRECTION_VECTORS[dir].y;
  snake.unshift(tail);
}
```

---

## Summary

| Section | Key Decision |
|---------|--------------|
| **Rendering** | Canvas for performance |
| **Game Loop** | requestAnimationFrame with time-based updates |
| **State** | Single GameState object |
| **Input** | Queue nextDirection, apply on update |
| **Collision** | Simple grid-based comparison |
| **Mobile** | Touch swipe detection |

### Key Takeaways

1. **Canvas** - Best for game rendering
2. **Game Loop** - decouple update rate from render rate
3. **Input Queue** - Prevent 180° turns
4. **Grid Collision** - O(1) wall, O(n) self
5. **Object Reuse** - Move tail to front instead of creating new

---

## References

- [MDN Canvas Tutorial](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial)
- [Game Loop Pattern](https://gameprogrammingpatterns.com/game-loop.html)
- [requestAnimationFrame](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame)
