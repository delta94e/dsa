# Slither.io - Concepts Deep Dive

> Detailed exploration of key algorithms and patterns for building a multiplayer snake game.

---

## Table of Contents

1. [Segment Following Algorithm](#1-segment-following-algorithm)
2. [Smooth Angle Interpolation](#2-smooth-angle-interpolation)
3. [Spatial Grid Collision](#3-spatial-grid-collision)
4. [Interpolation Between States](#4-interpolation-between-states)
5. [Boost Mechanic](#5-boost-mechanic)

---

## 1. Segment Following Algorithm

### The Problem

In Slither.io, each snake is a chain of segments. The head moves freely toward the cursor, and each subsequent segment must follow the one in front while maintaining a fixed distance.

### Solution: Fixed Distance Following

```typescript
const SEGMENT_SPACING = 5; // Distance between segment centers

function updateSegments(segments: Segment[], headAngle: number, speed: number) {
  // 1. Move head toward angle
  const head = segments[0];
  head.x += Math.cos(headAngle) * speed;
  head.y += Math.sin(headAngle) * speed;

  // 2. Each segment follows the one in front
  for (let i = 1; i < segments.length; i++) {
    const current = segments[i];
    const target = segments[i - 1];

    const dx = target.x - current.x;
    const dy = target.y - current.y;
    const distance = Math.hypot(dx, dy);

    // Only move if too far
    if (distance > SEGMENT_SPACING) {
      // Move toward target, maintaining fixed distance
      const ratio = (distance - SEGMENT_SPACING) / distance;
      current.x += dx * ratio;
      current.y += dy * ratio;
    }
  }
}
```

### Visual Explanation

```
Before movement:
  ●───●───●───●───●
  0   1   2   3   4  (segment indices)
  ↑
  Head moves forward

After head moves:
       ●───●───●───●───●
       0   1   2   3   4
       ↑
       Head at new position

Segment 1 is now too far from head (> SEGMENT_SPACING)
→ It moves toward segment 0

This cascades through all segments!
```

### Alternative: History-Based Following

```typescript
// Store position history
const positionHistory: Vector2[] = [];
const MAX_HISTORY = 10000;

function updateWithHistory(segments: Segment[], newHeadPos: Vector2) {
  // Add new head position to history
  positionHistory.unshift({ ...newHeadPos });
  if (positionHistory.length > MAX_HISTORY) {
    positionHistory.pop();
  }

  // Each segment follows a point in history
  for (let i = 0; i < segments.length; i++) {
    const historyIndex = i * Math.ceil(SEGMENT_SPACING);
    if (historyIndex < positionHistory.length) {
      segments[i].x = positionHistory[historyIndex].x;
      segments[i].y = positionHistory[historyIndex].y;
    }
  }
}

// Pros: Segments follow actual path (curves nicely)
// Cons: More memory, complex for network sync
```

---

## 2. Smooth Angle Interpolation

### The Problem

Snake head should turn smoothly toward the cursor, not snap instantly.

### Turn Speed Limiting

```typescript
const MAX_TURN_SPEED = 0.15; // Radians per frame

function updateAngle(currentAngle: number, targetAngle: number): number {
  // Calculate shortest rotation direction
  let diff = targetAngle - currentAngle;
  
  // Normalize to [-PI, PI]
  while (diff > Math.PI) diff -= Math.PI * 2;
  while (diff < -Math.PI) diff += Math.PI * 2;

  // Clamp turn speed
  if (Math.abs(diff) > MAX_TURN_SPEED) {
    diff = Math.sign(diff) * MAX_TURN_SPEED;
  }

  return currentAngle + diff;
}

// Usage in game loop:
snake.angle = updateAngle(snake.angle, snake.targetAngle);
```

### Visual Explanation

```
Current angle: 0° (pointing right →)
Target angle: 90° (pointing up ↑)

Without limiting:
  Frame 1: 0° → 90° (instant snap)

With MAX_TURN_SPEED = 15°:
  Frame 1: 0° → 15°
  Frame 2: 15° → 30°
  Frame 3: 30° → 45°
  Frame 4: 45° → 60°
  Frame 5: 60° → 75°
  Frame 6: 75° → 90°

Result: Smooth, natural-feeling turn over 6 frames
```

---

## 3. Spatial Grid Collision

### Complete Implementation

```typescript
class SpatialGrid<T extends { id: string; x: number; y: number }> {
  private cells: Map<string, Set<T>> = new Map();
  private objectCells: Map<string, string> = new Map(); // Track which cell each object is in
  private cellSize: number;

  constructor(cellSize: number) {
    this.cellSize = cellSize;
  }

  private getCellKey(x: number, y: number): string {
    const cx = Math.floor(x / this.cellSize);
    const cy = Math.floor(y / this.cellSize);
    return `${cx},${cy}`;
  }

  insert(obj: T): void {
    const key = this.getCellKey(obj.x, obj.y);

    // Remove from old cell if exists
    const oldKey = this.objectCells.get(obj.id);
    if (oldKey && oldKey !== key) {
      this.cells.get(oldKey)?.delete(obj);
    }

    // Add to new cell
    if (!this.cells.has(key)) {
      this.cells.set(key, new Set());
    }
    this.cells.get(key)!.add(obj);
    this.objectCells.set(obj.id, key);
  }

  remove(obj: T): void {
    const key = this.objectCells.get(obj.id);
    if (key) {
      this.cells.get(key)?.delete(obj);
      this.objectCells.delete(obj.id);
    }
  }

  // Get all objects within radius of point
  queryRadius(x: number, y: number, radius: number): T[] {
    const results: T[] = [];
    const radiusSquared = radius * radius;

    // Calculate cell range to check
    const minCx = Math.floor((x - radius) / this.cellSize);
    const maxCx = Math.floor((x + radius) / this.cellSize);
    const minCy = Math.floor((y - radius) / this.cellSize);
    const maxCy = Math.floor((y + radius) / this.cellSize);

    for (let cx = minCx; cx <= maxCx; cx++) {
      for (let cy = minCy; cy <= maxCy; cy++) {
        const cell = this.cells.get(`${cx},${cy}`);
        if (!cell) continue;

        for (const obj of cell) {
          const dx = obj.x - x;
          const dy = obj.y - y;
          if (dx * dx + dy * dy <= radiusSquared) {
            results.push(obj);
          }
        }
      }
    }

    return results;
  }

  clear(): void {
    this.cells.clear();
    this.objectCells.clear();
  }
}
```

### Usage for Collision Detection

```typescript
class CollisionSystem {
  private segmentGrid = new SpatialGrid<Segment>(200);
  private orbGrid = new SpatialGrid<Orb>(200);

  update(snakes: Snake[], orbs: Orb[]) {
    // Rebuild grids each frame
    this.segmentGrid.clear();
    this.orbGrid.clear();

    // Insert all segments
    for (const snake of snakes) {
      for (const seg of snake.segments) {
        this.segmentGrid.insert({ ...seg, id: `${snake.id}-${seg.x}-${seg.y}` });
      }
    }

    // Insert all orbs
    for (const orb of orbs) {
      this.orbGrid.insert(orb);
    }
  }

  checkHeadCollisions(snake: Snake): {
    eatenOrbs: Orb[];
    hitSegment: Segment | null;
  } {
    const head = snake.segments[0];
    const checkRadius = head.radius + 50; // Extra margin

    // Check orbs
    const nearbyOrbs = this.orbGrid.queryRadius(head.x, head.y, checkRadius);
    const eatenOrbs = nearbyOrbs.filter(orb => 
      Math.hypot(orb.x - head.x, orb.y - head.y) < head.radius + 5
    );

    // Check other snake segments
    const nearbySegments = this.segmentGrid.queryRadius(head.x, head.y, checkRadius);
    const hitSegment = nearbySegments.find(seg => {
      // Skip own head and nearby segments
      if (seg.id.startsWith(snake.id)) return false;
      return Math.hypot(seg.x - head.x, seg.y - head.y) < head.radius + seg.radius;
    });

    return { eatenOrbs, hitSegment };
  }
}
```

---

## 4. Interpolation Between States

### The Problem

Server sends updates at 20 TPS, but client renders at 60 FPS. Without interpolation, movement appears choppy.

### Linear Interpolation

```typescript
interface InterpolatedSnake {
  previous: Snake;
  current: Snake;
  timestamp: number;
}

class Interpolator {
  private snakes = new Map<string, InterpolatedSnake>();
  private readonly TICK_RATE = 20; // Server updates per second
  private readonly TICK_INTERVAL = 1000 / this.TICK_RATE;

  // Called when server update arrives
  onServerUpdate(snakeData: Snake) {
    const existing = this.snakes.get(snakeData.id);
    
    if (existing) {
      // Store previous state for interpolation
      this.snakes.set(snakeData.id, {
        previous: existing.current,
        current: snakeData,
        timestamp: performance.now(),
      });
    } else {
      this.snakes.set(snakeData.id, {
        previous: snakeData,
        current: snakeData,
        timestamp: performance.now(),
      });
    }
  }

  // Called every render frame
  getInterpolatedPosition(snakeId: string): Snake | null {
    const data = this.snakes.get(snakeId);
    if (!data) return null;

    const now = performance.now();
    const elapsed = now - data.timestamp;
    const t = Math.min(1, elapsed / this.TICK_INTERVAL);

    return this.lerp(data.previous, data.current, t);
  }

  private lerp(a: Snake, b: Snake, t: number): Snake {
    return {
      ...b,
      segments: a.segments.map((segA, i) => {
        const segB = b.segments[i] || segA;
        return {
          x: segA.x + (segB.x - segA.x) * t,
          y: segA.y + (segB.y - segA.y) * t,
          radius: segA.radius + (segB.radius - segA.radius) * t,
        };
      }),
      angle: this.lerpAngle(a.angle, b.angle, t),
    };
  }

  private lerpAngle(a: number, b: number, t: number): number {
    let diff = b - a;
    while (diff > Math.PI) diff -= Math.PI * 2;
    while (diff < -Math.PI) diff += Math.PI * 2;
    return a + diff * t;
  }
}
```

### Visual Timeline

```
Server Tick Timeline:
  ├──────────────────┼──────────────────┼──────────────────┤
  0ms               50ms              100ms             150ms
  State A           State B           State C

Client Render at 60fps:
  ├───┼───┼───┼───┼───┼───┼───┼───┼───┼───┼───┼───┼───┤
  0  8  16 24 32 40 48 56 64 72 80 88 96 104...

At t=24ms: lerp(A, B, 24/50) = 48% between A and B
At t=48ms: lerp(A, B, 48/50) = 96% between A and B  
At t=56ms: lerp(B, C, 6/50) = 12% between B and C

Result: Smooth 60fps despite 20 TPS server!
```

---

## 5. Boost Mechanic

### Implementation

```typescript
class Snake {
  segments: Segment[] = [];
  score: number = 0;
  isBoosting: boolean = false;

  private readonly BASE_SPEED = 3;
  private readonly BOOST_SPEED = 6;
  private readonly BOOST_DRAIN_RATE = 0.5; // Segments lost per second

  private segmentDebt = 0; // Accumulated fractional segment loss

  get speed(): number {
    return this.isBoosting ? this.BOOST_SPEED : this.BASE_SPEED;
  }

  update(deltaTime: number) {
    if (this.isBoosting && this.segments.length > 10) {
      // Accumulate segment debt
      this.segmentDebt += this.BOOST_DRAIN_RATE * deltaTime;

      // Remove segments when debt reaches 1
      while (this.segmentDebt >= 1 && this.segments.length > 10) {
        const removedSeg = this.segments.pop()!;
        this.dropOrb(removedSeg); // Leave orb where segment was
        this.segmentDebt -= 1;
      }
    }
  }

  private dropOrb(position: Vector2): Orb {
    return {
      id: `orb-${Date.now()}-${Math.random()}`,
      x: position.x,
      y: position.y,
      value: 1,
      color: this.color,
    };
  }
}
```

### Orb Drops on Death

```typescript
function onSnakeDeath(snake: Snake): Orb[] {
  const orbs: Orb[] = [];
  const ORB_VALUE = 2;

  // Convert segments to orbs (every 3rd segment)
  for (let i = 0; i < snake.segments.length; i += 3) {
    const seg = snake.segments[i];
    orbs.push({
      id: `death-orb-${i}`,
      x: seg.x + (Math.random() - 0.5) * 20,
      y: seg.y + (Math.random() - 0.5) * 20,
      value: ORB_VALUE,
      color: snake.color,
    });
  }

  return orbs;
}
```

---

## Summary

| Concept | Key Point |
|---------|-----------|
| **Segment Following** | Fixed distance, each follows predecessor |
| **Angle Interpolation** | Clamp turn speed for smooth curves |
| **Spatial Grid** | O(1) collision queries with grid cells |
| **State Interpolation** | lerp between server states at render rate |
| **Boost** | Trade length for speed, drop orbs |

---

## References

- [Slither.io Technical Breakdown](https://www.youtube.com/watch?v=SB_VGjMLbWQ)
- [Spatial Partitioning](https://gameprogrammingpatterns.com/spatial-partition.html)
- [Client-Side Prediction](https://www.gabrielgambetta.com/client-side-prediction-server-reconciliation.html)
