# Slither.io Frontend System Design

> A comprehensive frontend system design for building a multiplayer snake game with real-time networking, smooth interpolation, and efficient collision detection.

---

## Table of Contents

1. [Requirements Exploration](#1-requirements-exploration)
2. [Game Mechanics](#2-game-mechanics)
3. [Architecture Overview](#3-architecture-overview)
4. [Data Model](#4-data-model)
5. [Real-Time Networking](#5-real-time-networking)
6. [Game Loop & Rendering](#6-game-loop--rendering)
7. [Collision Detection](#7-collision-detection)
8. [Client-Side Prediction](#8-client-side-prediction)
9. [Camera & Viewport](#9-camera--viewport)
10. [Optimization](#10-optimization)

---

## 1. Requirements Exploration

### 1.1 General Requirements

| Feature | Description |
|---------|-------------|
| **Continuous Movement** | Snake follows mouse cursor smoothly |
| **Growth Mechanic** | Eat orbs and dead snakes to grow |
| **Boost/Sprint** | Hold button to speed up (at cost of length) |
| **Leaderboard** | Real-time top 10 players |
| **Minimap** | Show position on world map |
| **Respawn** | Instant respawn on death |

### 1.2 Technical Requirements

| Requirement | Description |
|-------------|-------------|
| **Real-time Sync** | WebSocket for low-latency updates |
| **Interpolation** | Smooth movement between server ticks |
| **Client Prediction** | Responsive local movement |
| **Spatial Partitioning** | Efficient collision on large maps |
| **60 FPS Rendering** | Canvas-based with optimization |
| **Large World** | 10000×10000+ unit world map |

---

## 2. Game Mechanics

### 2.1 Movement

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    SLITHER MOVEMENT SYSTEM                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Mouse Position                                                             │
│       ●←────────────────┐                                                   │
│                         │ Calculate angle                                   │
│                         ▼                                                   │
│                   ┌───────────┐                                             │
│                   │   Head    │ → Moves toward angle at speed               │
│                   └─────┬─────┘                                             │
│                         │                                                   │
│                   ┌─────┴─────┐                                             │
│                   │ Segment 1 │ → Follows head position (delayed)           │
│                   └─────┬─────┘                                             │
│                         │                                                   │
│                   ┌─────┴─────┐                                             │
│                   │ Segment 2 │ → Follows segment 1 (delayed)               │
│                   └─────┬─────┘                                             │
│                         │                                                   │
│                   ┌─────┴─────┐                                             │
│                   │    ...    │ → Each segment follows previous             │
│                   └───────────┘                                             │
│                                                                             │
│  Key Formula:                                                               │
│  angle = Math.atan2(mouseY - headY, mouseX - headX)                         │
│  head.x += Math.cos(angle) * speed                                          │
│  head.y += Math.sin(angle) * speed                                          │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 2.2 Segment Following

```typescript
// Each segment follows the one in front
function updateSegments(snake: Snake) {
  const segments = snake.segments;
  const SEGMENT_DISTANCE = 5; // Distance between segments

  for (let i = 1; i < segments.length; i++) {
    const current = segments[i];
    const target = segments[i - 1];

    const dx = target.x - current.x;
    const dy = target.y - current.y;
    const distance = Math.hypot(dx, dy);

    if (distance > SEGMENT_DISTANCE) {
      const ratio = SEGMENT_DISTANCE / distance;
      current.x = target.x - dx * ratio;
      current.y = target.y - dy * ratio;
    }
  }
}
```

---

## 3. Architecture Overview

### 3.1 System Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    CLIENT-SERVER ARCHITECTURE                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                          CLIENT                                      │   │
│  │                                                                      │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌───────────┐  │   │
│  │  │   Input     │  │   Game      │  │   Render    │  │  Network  │  │   │
│  │  │  Handler    │──▶│   State     │──▶│   Engine    │  │  Manager  │  │   │
│  │  │  (Mouse)    │  │             │  │  (Canvas)   │  │ (WebSocket)│  │   │
│  │  └─────────────┘  └──────┬──────┘  └─────────────┘  └─────┬─────┘  │   │
│  │                          │                                │        │   │
│  │                          ▼                                ▼        │   │
│  │               ┌─────────────────────────────────────────────────┐  │   │
│  │               │            Interpolation Layer                   │  │   │
│  │               │  (Smooth between server states at 60 FPS)        │  │   │
│  │               └─────────────────────────────────────────────────┘  │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                       │                                     │
│                                       │ WebSocket                           │
│                                       ▼                                     │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                          SERVER                                      │   │
│  │                                                                      │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌───────────┐  │   │
│  │  │   Game      │  │   Physics   │  │  Collision  │  │   World   │  │   │
│  │  │   Loop      │──▶│   Engine    │──▶│  Detection  │──▶│   State   │  │   │
│  │  │  (20 TPS)   │  │             │  │ (Spatial)   │  │           │  │   │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  └───────────┘  │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 3.2 Client Components

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      CLIENT MODULES                                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────┐                                                           │
│  │ GameEngine  │ ← Main orchestrator                                       │
│  └──────┬──────┘                                                           │
│         │                                                                   │
│  ┌──────┴──────┬─────────────┬─────────────┬─────────────┐                 │
│  │             │             │             │             │                 │
│  ▼             ▼             ▼             ▼             ▼                 │
│  ┌───────┐ ┌───────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐            │
│  │Input  │ │Network│ │WorldState │ │  Camera   │ │ Renderer  │            │
│  │Handler│ │Manager│ │           │ │           │ │ (Canvas)  │            │
│  └───────┘ └───────┘ └───────────┘ └───────────┘ └───────────┘            │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Data Model

### 4.1 TypeScript Types

```typescript
// ═══════════════════════════════════════════════════════════════
// POSITION & VECTOR
// ═══════════════════════════════════════════════════════════════

interface Vector2 {
  x: number;
  y: number;
}

// ═══════════════════════════════════════════════════════════════
// SNAKE
// ═══════════════════════════════════════════════════════════════

interface Segment extends Vector2 {
  radius: number;  // Visual size (grows with length)
}

interface Snake {
  id: string;
  name: string;
  segments: Segment[];   // Head is segments[0]
  angle: number;         // Current heading
  targetAngle: number;   // Where mouse points
  speed: number;
  isBoosting: boolean;
  color: string;
  score: number;
  isAlive: boolean;
}

// ═══════════════════════════════════════════════════════════════
// ORB (Food)
// ═══════════════════════════════════════════════════════════════

interface Orb {
  id: string;
  x: number;
  y: number;
  value: number;    // Score value
  color: string;
}

// ═══════════════════════════════════════════════════════════════
// WORLD STATE
// ═══════════════════════════════════════════════════════════════

interface WorldState {
  snakes: Map<string, Snake>;
  orbs: Map<string, Orb>;
  worldSize: { width: number; height: number };
  leaderboard: LeaderboardEntry[];
}

interface LeaderboardEntry {
  id: string;
  name: string;
  score: number;
}

// ═══════════════════════════════════════════════════════════════
// NETWORK MESSAGES
// ═══════════════════════════════════════════════════════════════

type ClientMessage =
  | { type: 'input'; angle: number; boost: boolean }
  | { type: 'spawn'; name: string };

type ServerMessage =
  | { type: 'world_update'; snakes: SnakeDTO[]; orbs: OrbDTO[] }
  | { type: 'player_died'; killerId?: string }
  | { type: 'leaderboard'; entries: LeaderboardEntry[] };
```

---

## 5. Real-Time Networking

### 5.1 WebSocket Protocol

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    CLIENT → SERVER MESSAGES                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Input Update (sent 30-60 times/sec):                                       │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ { type: "input", angle: 1.57, boost: false }                        │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  Spawn Request:                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ { type: "spawn", name: "Player123" }                                │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                    SERVER → CLIENT MESSAGES                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  World Update (sent 20-30 times/sec):                                       │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ {                                                                   │   │
│  │   type: "world_update",                                             │   │
│  │   snakes: [                                                         │   │
│  │     { id: "abc", segments: [[100,200], [95,198], ...], angle: 1.5 } │   │
│  │   ],                                                                │   │
│  │   orbs: [                                                           │   │
│  │     { id: "orb1", x: 500, y: 300, value: 1 }                        │   │
│  │   ]                                                                 │   │
│  │ }                                                                   │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 5.2 Binary Protocol Optimization

```typescript
// Use ArrayBuffer for compact data transfer
// Instead of JSON: { angle: 1.5708 } = 18 bytes
// Binary: Float32 = 4 bytes (4.5x smaller)

class BinaryProtocol {
  static encodeInput(angle: number, boost: boolean): ArrayBuffer {
    const buffer = new ArrayBuffer(5);
    const view = new DataView(buffer);
    view.setFloat32(0, angle, true);      // 4 bytes
    view.setUint8(4, boost ? 1 : 0);      // 1 byte
    return buffer;
  }

  static decodeSnakes(buffer: ArrayBuffer): SnakeDTO[] {
    // Binary parsing for high-frequency world updates
    // ...
  }
}
```

---

## 6. Game Loop & Rendering

### 6.1 Game Loop

```typescript
class GameEngine {
  private lastTime = 0;
  private readonly TICK_RATE = 60;

  start() {
    this.lastTime = performance.now();
    requestAnimationFrame(this.loop);
  }

  private loop = (currentTime: number) => {
    const deltaTime = (currentTime - this.lastTime) / 1000;
    this.lastTime = currentTime;

    // 1. Process input
    this.inputHandler.update();

    // 2. Send input to server
    this.networkManager.sendInput(this.inputHandler.getState());

    // 3. Interpolate world state
    this.worldState.interpolate(deltaTime);

    // 4. Update camera
    this.camera.follow(this.player);

    // 5. Render
    this.renderer.render(this.worldState, this.camera);

    // 6. Continue loop
    requestAnimationFrame(this.loop);
  };
}
```

### 6.2 Canvas Rendering

```typescript
class Renderer {
  private ctx: CanvasRenderingContext2D;
  private camera: Camera;

  render(world: WorldState, camera: Camera) {
    this.camera = camera;
    this.clear();
    this.drawBackground();
    this.drawOrbs(world.orbs);
    this.drawSnakes(world.snakes);
    this.drawUI(world);
  }

  private drawSnake(snake: Snake) {
    const { segments } = snake;

    // Draw from tail to head (head on top)
    for (let i = segments.length - 1; i >= 0; i--) {
      const seg = segments[i];
      const screenPos = this.camera.worldToScreen(seg);

      // Gradient color from tail to head
      const brightness = 0.5 + (0.5 * (segments.length - i) / segments.length);

      this.ctx.beginPath();
      this.ctx.arc(screenPos.x, screenPos.y, seg.radius * this.camera.zoom, 0, Math.PI * 2);
      this.ctx.fillStyle = this.adjustBrightness(snake.color, brightness);
      this.ctx.fill();

      // Glow effect for head
      if (i === 0) {
        this.ctx.shadowColor = snake.color;
        this.ctx.shadowBlur = 15;
        this.ctx.fill();
        this.ctx.shadowBlur = 0;
      }
    }
  }
}
```

---

## 7. Collision Detection

### 7.1 Spatial Partitioning (Grid)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    SPATIAL GRID PARTITIONING                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  World: 10000 × 10000                                                       │
│  Cell Size: 200 × 200                                                       │
│  Grid: 50 × 50 = 2500 cells                                                 │
│                                                                             │
│  ┌─────┬─────┬─────┬─────┬─────┐                                           │
│  │     │     │ 🔵  │     │     │                                           │
│  │     │     │     │     │     │                                           │
│  ├─────┼─────┼─────┼─────┼─────┤                                           │
│  │     │ 🟢🟢│ 🟢  │     │     │  🟢 = Snake segments                       │
│  │     │ 🟢  │     │     │     │  🔵 = Orb                                  │
│  ├─────┼─────┼─────┼─────┼─────┤  🔴 = Player head                          │
│  │     │ 🟢  │ 🔴  │     │     │                                           │
│  │     │     │     │     │     │                                           │
│  ├─────┼─────┼─────┼─────┼─────┤                                           │
│  │     │     │     │     │ 🔵  │                                           │
│  │     │     │     │     │     │                                           │
│  └─────┴─────┴─────┴─────┴─────┘                                           │
│                                                                             │
│  To check collision for 🔴:                                                 │
│  1. Find which cell 🔴 is in → (2, 2)                                       │
│  2. Only check objects in cells (1,1) to (3,3) → 9 cells                    │
│  3. Much faster than checking all objects!                                  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 7.2 Implementation

```typescript
class SpatialGrid {
  private cells: Map<string, Set<string>> = new Map();
  private cellSize: number;

  constructor(cellSize: number) {
    this.cellSize = cellSize;
  }

  private getCellKey(x: number, y: number): string {
    const cx = Math.floor(x / this.cellSize);
    const cy = Math.floor(y / this.cellSize);
    return `${cx},${cy}`;
  }

  insert(id: string, x: number, y: number) {
    const key = this.getCellKey(x, y);
    if (!this.cells.has(key)) {
      this.cells.set(key, new Set());
    }
    this.cells.get(key)!.add(id);
  }

  query(x: number, y: number, radius: number): string[] {
    const results: string[] = [];
    const minCx = Math.floor((x - radius) / this.cellSize);
    const maxCx = Math.floor((x + radius) / this.cellSize);
    const minCy = Math.floor((y - radius) / this.cellSize);
    const maxCy = Math.floor((y + radius) / this.cellSize);

    for (let cx = minCx; cx <= maxCx; cx++) {
      for (let cy = minCy; cy <= maxCy; cy++) {
        const key = `${cx},${cy}`;
        const cell = this.cells.get(key);
        if (cell) {
          results.push(...cell);
        }
      }
    }

    return results;
  }
}
```

### 7.3 Collision Types

```typescript
// Head-to-Body collision (death)
function checkSnakeCollision(head: Segment, otherSnake: Snake): boolean {
  // Skip first few segments (head area)
  for (let i = 3; i < otherSnake.segments.length; i++) {
    const seg = otherSnake.segments[i];
    const dist = distance(head, seg);
    if (dist < head.radius + seg.radius) {
      return true; // Collision!
    }
  }
  return false;
}

// Head-to-Orb collision (eating)
function checkOrbCollision(head: Segment, orb: Orb): boolean {
  const dist = distance(head, orb);
  return dist < head.radius + 5; // Orb radius
}

function distance(a: Vector2, b: Vector2): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}
```

---

## 8. Client-Side Prediction

### 8.1 Problem

```
Without prediction:
  Client input (t=0) 
       → Send to server 
       → Server processes 
       → Server sends update (t=100ms)
       → Client sees movement
  
  Result: 100ms+ delay = sluggish controls!

With prediction:
  Client input (t=0)
       → Immediately move locally
       → Also send to server
       → Server sends authoritative update
       → Reconcile local state with server
  
  Result: Instant response!
```

### 8.2 Implementation

```typescript
class ClientPrediction {
  private pendingInputs: InputState[] = [];
  private serverState: Snake | null = null;

  // Called every frame
  applyInput(input: InputState, snake: Snake) {
    // Apply locally for instant feedback
    this.moveSnake(snake, input);

    // Store for later reconciliation
    this.pendingInputs.push(input);
  }

  // Called when server update arrives
  reconcile(serverSnake: Snake, lastProcessedInputId: number) {
    this.serverState = serverSnake;

    // Remove acknowledged inputs
    this.pendingInputs = this.pendingInputs.filter(
      input => input.id > lastProcessedInputId
    );

    // Re-apply pending inputs on top of server state
    let predicted = { ...serverSnake };
    for (const input of this.pendingInputs) {
      this.moveSnake(predicted, input);
    }

    return predicted;
  }

  private moveSnake(snake: Snake, input: InputState) {
    const speed = input.boost ? snake.speed * 2 : snake.speed;
    snake.segments[0].x += Math.cos(input.angle) * speed;
    snake.segments[0].y += Math.sin(input.angle) * speed;
    // Update following segments...
  }
}
```

---

## 9. Camera & Viewport

### 9.1 Camera System

```typescript
class Camera {
  x: number = 0;
  y: number = 0;
  zoom: number = 1;
  
  private targetZoom: number = 1;
  private readonly MIN_ZOOM = 0.5;
  private readonly MAX_ZOOM = 1.5;

  follow(snake: Snake, smoothing = 0.1) {
    const head = snake.segments[0];
    
    // Smooth camera follow
    this.x += (head.x - this.x) * smoothing;
    this.y += (head.y - this.y) * smoothing;

    // Zoom based on snake length (longer = zoomed out more)
    this.targetZoom = Math.max(
      this.MIN_ZOOM,
      this.MAX_ZOOM - snake.segments.length * 0.002
    );
    this.zoom += (this.targetZoom - this.zoom) * 0.05;
  }

  worldToScreen(pos: Vector2): Vector2 {
    const screenCenterX = this.screenWidth / 2;
    const screenCenterY = this.screenHeight / 2;

    return {
      x: (pos.x - this.x) * this.zoom + screenCenterX,
      y: (pos.y - this.y) * this.zoom + screenCenterY,
    };
  }

  screenToWorld(screenPos: Vector2): Vector2 {
    const screenCenterX = this.screenWidth / 2;
    const screenCenterY = this.screenHeight / 2;

    return {
      x: (screenPos.x - screenCenterX) / this.zoom + this.x,
      y: (screenPos.y - screenCenterY) / this.zoom + this.y,
    };
  }
}
```

---

## 10. Optimization

### 10.1 Rendering Optimizations

| Technique | Description |
|-----------|-------------|
| **Culling** | Only draw objects in viewport |
| **Level of Detail** | Simpler rendering for distant snakes |
| **Object Pooling** | Reuse orb/segment objects |
| **Dirty Rectangle** | Only redraw changed areas |

### 10.2 Network Optimizations

| Technique | Description |
|-----------|-------------|
| **Binary Protocol** | 4x smaller than JSON |
| **Delta Compression** | Only send changes |
| **Interest Management** | Only send nearby entities |
| **Input Batching** | Combine multiple inputs |

### 10.3 Code Example: Viewport Culling

```typescript
function isInViewport(pos: Vector2, camera: Camera, margin = 100): boolean {
  const screen = camera.worldToScreen(pos);
  return (
    screen.x > -margin &&
    screen.x < camera.screenWidth + margin &&
    screen.y > -margin &&
    screen.y < camera.screenHeight + margin
  );
}

function renderOrbs(orbs: Map<string, Orb>, camera: Camera) {
  for (const orb of orbs.values()) {
    if (isInViewport(orb, camera)) {
      drawOrb(orb);
    }
  }
}
```

---

## Summary

| Section | Key Point |
|---------|-----------|
| **Movement** | Segments follow head with fixed distance |
| **Networking** | WebSocket with binary protocol |
| **Collision** | Spatial grid partitioning |
| **Prediction** | Client-side prediction + server reconciliation |
| **Camera** | Smooth follow with length-based zoom |
| **Optimization** | Culling, pooling, delta compression |

### Key Takeaways

1. **Segment Chain** - Each segment follows the one in front
2. **Spatial Partitioning** - Essential for large maps
3. **Client Prediction** - Makes controls feel responsive
4. **Interpolation** - Smooths between server updates
5. **Binary Protocol** - Reduces bandwidth by 4x+

---

## References

- [Slither.io](http://slither.io)
- [Fast-Paced Multiplayer](https://www.gabrielgambetta.com/client-server-game-architecture.html)
- [Spatial Hashing](https://en.wikipedia.org/wiki/Spatial_hashing)
