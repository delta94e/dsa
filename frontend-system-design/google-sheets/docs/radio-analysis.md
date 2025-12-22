# Google Sheets Frontend System Design

> A comprehensive frontend system design for building a production-ready Spreadsheet application with formula parsing, dependency resolution, and virtualized rendering.

---

## Table of Contents

1. [Requirements Exploration](#1-requirements-exploration)
2. [Design Consideration: Canvas vs DOM](#2-design-consideration-canvas-vs-dom)
3. [Component Architecture](#3-component-architecture)
4. [Virtualization Design](#4-virtualization-design)
5. [Dependency Resolution with Topological Sort](#5-dependency-resolution-with-topological-sort)
6. [Formula Parsing](#6-formula-parsing)
7. [State Management](#7-state-management)
8. [Performance Optimization](#8-performance-optimization)
9. [Accessibility](#9-accessibility)

---

## 1. Requirements Exploration

### 1.1 General Requirements

| Requirement | Description |
|-------------|-------------|
| **Data Entry** | Create, save, edit spreadsheet cells |
| **Basic Formatting** | Bold, italic, strikethrough, text color |
| **Large Spreadsheet** | Default: 1000 rows × 26 columns = 26,000 cells |
| **Formula Parsing** | Support cell references, mathematical operations |
| **Dependency Resolution** | Cells depending on other cells |
| **Cycle Detection** | Detect and show error for circular dependencies |
| **Resize Columns/Rows** | Adjustable dimensions |

### 1.2 Specific Requirements

| Requirement | Description |
|-------------|-------------|
| **Multi-device** | Works on tablets, phones, laptops |
| **Offline-first** | App feels like native, PWA mode |
| **DOM Performance** | Virtualization for 26,000+ cells |
| **State Management** | Efficient storage and calculations |
| **Accessibility** | Screen reader, keyboard navigation |

### 1.3 Action Plan

```
1. Design Consideration   → Canvas vs DOM rendering
2. Component Architecture → High-level component hierarchy
3. Virtualization         → Vertical scrolling optimization
4. Dependency Resolution  → Topological Sort algorithm
5. Formula Parsing        → Token-based parsing
6. State Management       → Flattened cell storage
7. Optimization           → Web Workers, lazy updates
8. Accessibility          → ARIA grid, keyboard shortcuts
```

---

## 2. Design Consideration: Canvas vs DOM

### 2.1 Canvas Approach

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         CANVAS RENDERING                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────┐                                    │
│  │         <canvas>                    │                                    │
│  │                                     │                                    │
│  │   Draw pixels directly              │                                    │
│  │   GPU accelerated                   │                                    │
│  │   No DOM elements                   │                                    │
│  │                                     │                                    │
│  └─────────────────────────────────────┘                                    │
│                                                                             │
│  PROS:                                                                      │
│  ✅ GPU accelerated rendering                                               │
│  ✅ Best FPS performance                                                    │
│  ✅ No memory overhead from DOM nodes                                       │
│  ✅ Great for millions of cells                                             │
│                                                                             │
│  CONS:                                                                      │
│  ❌ Completely different development methodology                            │
│  ❌ Requires abstraction library for UI primitives                          │
│  ❌ Much more expensive to develop                                          │
│  ❌ Accessibility is very challenging (pixels, not elements)                │
│  ❌ Requires specialized engineering skills                                 │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 2.2 DOM Approach

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          DOM RENDERING                                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────┐                                    │
│  │  <table>                            │                                    │
│  │    <tr>                             │                                    │
│  │      <td>A1</td><td>B1</td>         │                                    │
│  │    </tr>                            │                                    │
│  │    ...                              │                                    │
│  │  </table>                           │                                    │
│  └─────────────────────────────────────┘                                    │
│                                                                             │
│  PROS:                                                                      │
│  ✅ Standard web development                                                │
│  ✅ Any engineer can work on it                                             │
│  ✅ Accessibility is easier with proper tags                                │
│  ✅ Cheaper and faster to develop                                           │
│                                                                             │
│  CONS:                                                                      │
│  ❌ Performance affected by large DOM                                       │
│  ❌ Memory overhead from 26,000+ elements                                   │
│  ❌ Virtualization is complex to implement                                  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 2.3 Decision Matrix

| Factor | Canvas | DOM | Winner |
|--------|--------|-----|--------|
| Performance | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | Canvas |
| Development Cost | ⭐⭐ | ⭐⭐⭐⭐⭐ | DOM |
| Accessibility | ⭐⭐ | ⭐⭐⭐⭐⭐ | DOM |
| Time to Market | ⭐⭐ | ⭐⭐⭐⭐⭐ | DOM |
| Skill Requirement | ⭐⭐ | ⭐⭐⭐⭐⭐ | DOM |

**Decision:**
- **Industry solution (millions of users)** → Canvas
- **Internal tool / MVP** → DOM

**For this design: DOM approach** (more accessible, standard skills)

---

## 3. Component Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     COMPONENT HIERARCHY                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│                        ┌───────────────────┐                                │
│                        │  Sheet App Root   │                                │
│                        └─────────┬─────────┘                                │
│                                  │                                          │
│            ┌─────────────────────┼─────────────────────┐                    │
│            │                     │                     │                    │
│            ▼                     ▼                     ▼                    │
│  ┌─────────────────┐   ┌─────────────────┐   ┌─────────────────┐           │
│  │ Control Panel   │   │  Table Editor   │   │  Sheet Tabs     │           │
│  │ • Format tools  │   │                 │   │  • Sheet 1      │           │
│  │ • Functions     │   │                 │   │  • Sheet 2      │           │
│  │ • Undo/Redo     │   │                 │   │  • + Add        │           │
│  └─────────────────┘   └────────┬────────┘   └─────────────────┘           │
│                                 │                                           │
│           ┌─────────────────────┼─────────────────────┐                     │
│           │                     │                     │                     │
│           ▼                     ▼                     ▼                     │
│  ┌─────────────────┐   ┌─────────────────┐   ┌─────────────────┐           │
│  │ Column Header   │   │  Cell Cluster   │   │   Row Header    │           │
│  │ A  B  C  D ...  │   │  (Virtualized)  │   │   1  2  3 ...   │           │
│  └─────────────────┘   └────────┬────────┘   └─────────────────┘           │
│                                 │                                           │
│                                 ▼                                           │
│                        ┌─────────────────┐                                  │
│                        │      Cell       │                                  │
│                        │  • Formula      │                                  │
│                        │  • Value        │                                  │
│                        │  • Formatting   │                                  │
│                        └─────────────────┘                                  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Virtualization Design

### 4.1 Analysis

```
Default spreadsheet: 26 columns × 1000 rows = 26,000 cells

Rendering all 26,000 DOM elements:
❌ Memory: ~50MB+ for DOM nodes
❌ CPU: Slow initial render
❌ Scroll: Janky, low FPS

With Virtualization:
✅ Only render visible cells (~100-200)
✅ Recycle cells when scrolling
✅ Smooth 60 FPS scrolling
```

### 4.2 Trade-off Decision

| Direction | Virtualize? | Why |
|-----------|-------------|-----|
| **Vertical** | ✅ Yes | 1000+ rows, critical for performance |
| **Horizontal** | ❌ No | 26 columns is manageable, simplify design |

**Constraint: Max 72-78 columns** (enough for most use cases)

### 4.3 Page Size by Device

```typescript
const PAGE_SIZE = {
  phone: 50,    // Small viewport
  tablet: 100,
  laptop: 140,
  desktop: 200,
};

// Limit = 2 × PAGE_SIZE (current page + buffer)
const LIMIT = PAGE_SIZE * 2;
```

### 4.4 Virtualization Mechanics

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    VIRTUALIZATION SETUP                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────┐           │
│  │  Main Container (Content Height = Total Rows × Row Height)  │           │
│  │                                                             │           │
│  │  ┌─────────────────────────────────────────────────────┐   │           │
│  │  │ ↑ Upper Intersection Observer                       │   │           │
│  │  └─────────────────────────────────────────────────────┘   │           │
│  │                                                             │           │
│  │  ┌─────────────────────────────────────────────────────┐   │           │
│  │  │                                                     │   │           │
│  │  │              BUFFER ZONE (Hidden)                   │   │           │
│  │  │              Rows 1-50 (off-screen)                 │   │           │
│  │  │              position: absolute                     │   │           │
│  │  │                                                     │   │           │
│  │  └─────────────────────────────────────────────────────┘   │           │
│  │                                                             │           │
│  │  ┌─────────────────────────────────────────────────────┐   │           │
│  │  │ ┌─────┬─────┬─────┬─────┬─────┐                     │   │           │
│  │  │ │  A  │  B  │  C  │  D  │ ... │  ← VIEWPORT         │   │           │
│  │  │ ├─────┼─────┼─────┼─────┼─────┤    (Visible)        │   │           │
│  │  │ │ 51  │     │     │     │     │                     │   │           │
│  │  │ ├─────┼─────┼─────┼─────┼─────┤                     │   │           │
│  │  │ │ 52  │     │     │     │     │                     │   │           │
│  │  │ ├─────┼─────┼─────┼─────┼─────┤                     │   │           │
│  │  │ │ ... │     │     │     │     │                     │   │           │
│  │  │ └─────┴─────┴─────┴─────┴─────┘                     │   │           │
│  │  └─────────────────────────────────────────────────────┘   │           │
│  │                                                             │           │
│  │  ┌─────────────────────────────────────────────────────┐   │           │
│  │  │ ↓ Bottom Intersection Observer                      │   │           │
│  │  └─────────────────────────────────────────────────────┘   │           │
│  │                                                             │           │
│  │  ┌─────────────────────────────────────────────────────┐   │           │
│  │  │              Empty Space (Padding)                   │   │           │
│  │  │              Preserves scroll height                 │   │           │
│  │  └─────────────────────────────────────────────────────┘   │           │
│  │                                                             │           │
│  └─────────────────────────────────────────────────────────────┘           │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 4.5 Scroll Down Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    SCROLL DOWN: Load Next Page                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Step 1: Viewport touches Bottom Observer                                   │
│  ────────────────────────────────────────                                   │
│                                                                             │
│  Step 2: Check if LIMIT reached                                             │
│          LIMIT = 2 × PAGE_SIZE                                             │
│                                                                             │
│  IF NOT REACHED:                                                            │
│  ├─ Render new rows below                                                   │
│  └─ Increase content height                                                 │
│                                                                             │
│  IF REACHED:                                                                │
│  ├─ Recycle buffer rows (top)                                               │
│  ├─ Update their data with new content (SOFT WRITE)                         │
│  ├─ Move them to bottom with CSS transform                                  │
│  ├─ Add empty space at top to preserve scroll position                      │
│  └─ Move intersection observers                                             │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 4.6 Hard Write vs Soft Write

```typescript
// ═══════════════════════════════════════════════════════════════
// HARD WRITE - Expensive DOM operation
// ═══════════════════════════════════════════════════════════════

function hardWrite(row: HTMLElement, data: CellData[]) {
  // ❌ Removes and recreates entire DOM structure
  row.innerHTML = `
    <td>${data[0].value}</td>
    <td>${data[1].value}</td>
    <td>${data[2].value}</td>
  `;
  // Triggers: Parse HTML → Create nodes → Insert → Reflow → Repaint
}

// ═══════════════════════════════════════════════════════════════
// SOFT WRITE - Minimal DOM operation
// ═══════════════════════════════════════════════════════════════

function softWrite(row: HTMLElement, data: CellData[]) {
  // ✅ Only update text content, reuse existing nodes
  const cells = row.querySelectorAll('td');
  cells.forEach((cell, i) => {
    cell.textContent = data[i].value; // Minimal DOM operation
  });
  // Only triggers: Text update → Repaint (no reflow!)
}
```

### 4.7 CSS Transform for Moving Rows

```typescript
// Instead of removing/inserting DOM nodes, use CSS transform
function moveRowsToBottom(rows: HTMLElement[], offsetY: number) {
  rows.forEach(row => {
    // GPU accelerated, no reflow
    row.style.transform = `translateY(${offsetY}px)`;
  });
}

// Rows use absolute positioning
.row {
  position: absolute;
  left: 0;
  right: 0;
  will-change: transform; /* Hint for GPU acceleration */
}
```

---

## 5. Dependency Resolution with Topological Sort

### 5.1 The Problem

```
Cell C1 = A1 + B1 + D1
Cell A1 = 10
Cell B1 = D1 * 2
Cell D1 = 5

Question: In what ORDER should we calculate these cells?
```

### 5.2 Directed Acyclic Graph (DAG)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         DEPENDENCY GRAPH                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Formula: C1 = A1 + B1 + D1                                                 │
│           B1 = D1 * 2                                                       │
│                                                                             │
│  Graph:                                                                     │
│                                                                             │
│         D1 (5)                                                              │
│        ╱    ╲                                                               │
│       ▼      ▼                                                              │
│     B1 (10)  │                                                              │
│       │      │                                                              │
│       ▼      │                                                              │
│       └──────┼────▶ C1 (25)                                                 │
│              │      ▲                                                       │
│              │      │                                                       │
│     A1 (10) ─┴──────┘                                                       │
│                                                                             │
│  This is a DAG: Directed edges, no cycles                                   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 5.3 Topological Sort

**Definition:** Order nodes so that for each edge A → B, node A appears before B.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    TOPOLOGICAL SORT                                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Before sorting:                                                            │
│                                                                             │
│       D1                                                                    │
│      ╱  ╲                                                                   │
│     ▼    ▼                                                                  │
│    B1 ───▶ C1 ◀─── A1                                                       │
│                                                                             │
│  After topological sort:                                                    │
│                                                                             │
│    D1 ──▶ A1 ──▶ B1 ──▶ C1                                                 │
│    [1]    [2]    [3]    [4]                                                 │
│                                                                             │
│  Calculation order:                                                         │
│  1. D1 = 5           (no dependencies)                                      │
│  2. A1 = 10          (no dependencies)                                      │
│  3. B1 = D1 * 2 = 10 (D1 already calculated)                                │
│  4. C1 = A1 + B1 + D1 = 25 (all dependencies ready)                         │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 5.4 Cycle Detection

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    CYCLE DETECTION                                           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Invalid formula:                                                           │
│  C1 = A1 + B1 + D1                                                          │
│  D1 = B1 + C1        ← Cycle!                                               │
│                                                                             │
│  Graph:                                                                     │
│                                                                             │
│    A1 ──▶ C1 ──▶ D1                                                        │
│            ▲      │                                                         │
│            │      │                                                         │
│            └──────┘  ← CYCLE DETECTED!                                      │
│                                                                             │
│  In topological sort:                                                       │
│  - For edge A → B, A must appear before B                                   │
│  - If A → B and B → A both exist, impossible to order!                      │
│  - Algorithm detects this and throws error                                  │
│                                                                             │
│  Show to user: "#CIRCULAR_REF" error in affected cells                      │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 5.5 Implementation

```typescript
interface CellDependency {
  cellId: string;
  dependencies: string[]; // IDs of cells this cell depends on
}

function topologicalSort(cells: Map<string, CellDependency>): string[] {
  const result: string[] = [];
  const visited = new Set<string>();
  const visiting = new Set<string>(); // For cycle detection

  function dfs(cellId: string): void {
    // Cycle detection
    if (visiting.has(cellId)) {
      throw new Error(`Circular reference detected at ${cellId}`);
    }

    if (visited.has(cellId)) return;

    visiting.add(cellId);

    // Visit all dependencies first
    const cell = cells.get(cellId);
    if (cell) {
      for (const dep of cell.dependencies) {
        dfs(dep);
      }
    }

    visiting.delete(cellId);
    visited.add(cellId);
    result.push(cellId);
  }

  // Run DFS from each cell
  for (const cellId of cells.keys()) {
    dfs(cellId);
  }

  return result; // Cells in calculation order
}

// Usage
const dependencies = new Map([
  ['C1', { cellId: 'C1', dependencies: ['A1', 'B1', 'D1'] }],
  ['B1', { cellId: 'B1', dependencies: ['D1'] }],
  ['A1', { cellId: 'A1', dependencies: [] }],
  ['D1', { cellId: 'D1', dependencies: [] }],
]);

const order = topologicalSort(dependencies);
// ['D1', 'A1', 'B1', 'C1']
```

### 5.6 Complexity

| Operation | Time | Space |
|-----------|------|-------|
| Build graph | O(C × D) | O(V + E) |
| Topological sort | O(V + E) | O(V) |
| Cycle detection | O(V + E) | O(V) |

Where:
- C = number of cells with formulas
- D = average dependencies per cell
- V = vertices (cells)
- E = edges (dependencies)

---

## 6. Formula Parsing

### 6.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    FORMULA PARSING PIPELINE                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  User Input: "=SUM(A1:A10) + B2 * 2"                                        │
│                     │                                                       │
│                     ▼                                                       │
│  ┌─────────────────────────────────────────────────────────────┐           │
│  │  1. DEPENDENCY RESOLVER                                     │           │
│  │     - Parse cell references (A1:A10, B2)                    │           │
│  │     - Build dependency graph                                │           │
│  │     - Run topological sort                                  │           │
│  │     - Output: Calculation order                             │           │
│  └─────────────────────────────────────────────────────────────┘           │
│                     │                                                       │
│                     ▼                                                       │
│  ┌─────────────────────────────────────────────────────────────┐           │
│  │  2. TOKENIZER                                               │           │
│  │     - Split formula into tokens                             │           │
│  │     - Tokens: [SUM, (, A1:A10, ), +, B2, *, 2]              │           │
│  └─────────────────────────────────────────────────────────────┘           │
│                     │                                                       │
│                     ▼                                                       │
│  ┌─────────────────────────────────────────────────────────────┐           │
│  │  3. FUNCTION RESOLVER                                       │           │
│  │     - Lookup SUM in function registry                       │           │
│  │     - Dynamic import: import('./functions/SUM.js')          │           │
│  └─────────────────────────────────────────────────────────────┘           │
│                     │                                                       │
│                     ▼                                                       │
│  ┌─────────────────────────────────────────────────────────────┐           │
│  │  4. EVALUATOR (Shunting-Yard / AST)                         │           │
│  │     - Parse arithmetic expressions                          │           │
│  │     - Execute functions with resolved values                │           │
│  │     - Output: Calculated result                             │           │
│  └─────────────────────────────────────────────────────────────┘           │
│                     │                                                       │
│                     ▼                                                       │
│  Result: 157                                                                │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 6.2 Function Registry (Lazy Loading)

```typescript
// Function registry - functions are loaded on demand
const FUNCTION_REGISTRY: Record<string, () => Promise<FormulaFunction>> = {
  SUM: () => import('./functions/sum'),
  AVERAGE: () => import('./functions/average'),
  IF: () => import('./functions/if'),
  VLOOKUP: () => import('./functions/vlookup'),
  // ... hundreds of functions
};

// Load only when needed
async function getFunction(name: string): Promise<FormulaFunction> {
  const loader = FUNCTION_REGISTRY[name];
  if (!loader) {
    throw new Error(`Unknown function: ${name}`);
  }
  const module = await loader();
  return module.default;
}

// functions/sum.ts
export default function SUM(values: number[]): number {
  return values.reduce((a, b) => a + b, 0);
}
```

### 6.3 Simple Tokenizer

```typescript
interface Token {
  type: 'NUMBER' | 'CELL' | 'RANGE' | 'FUNCTION' | 'OPERATOR' | 'PAREN';
  value: string;
}

function tokenize(formula: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;

  // Remove leading =
  if (formula.startsWith('=')) {
    formula = formula.slice(1);
  }

  while (i < formula.length) {
    const char = formula[i];

    // Skip whitespace
    if (/\s/.test(char)) {
      i++;
      continue;
    }

    // Number
    if (/\d/.test(char)) {
      let num = '';
      while (i < formula.length && /[\d.]/.test(formula[i])) {
        num += formula[i++];
      }
      tokens.push({ type: 'NUMBER', value: num });
      continue;
    }

    // Cell reference or function
    if (/[A-Z]/i.test(char)) {
      let identifier = '';
      while (i < formula.length && /[A-Z0-9:]/i.test(formula[i])) {
        identifier += formula[i++];
      }

      if (identifier.includes(':')) {
        tokens.push({ type: 'RANGE', value: identifier });
      } else if (/^[A-Z]+\d+$/.test(identifier)) {
        tokens.push({ type: 'CELL', value: identifier });
      } else {
        tokens.push({ type: 'FUNCTION', value: identifier });
      }
      continue;
    }

    // Operators
    if (/[+\-*/^]/.test(char)) {
      tokens.push({ type: 'OPERATOR', value: char });
      i++;
      continue;
    }

    // Parentheses
    if (/[()]/.test(char)) {
      tokens.push({ type: 'PAREN', value: char });
      i++;
      continue;
    }

    i++;
  }

  return tokens;
}

// Usage
tokenize('=SUM(A1:A10) + B2 * 2');
// [
//   { type: 'FUNCTION', value: 'SUM' },
//   { type: 'PAREN', value: '(' },
//   { type: 'RANGE', value: 'A1:A10' },
//   { type: 'PAREN', value: ')' },
//   { type: 'OPERATOR', value: '+' },
//   { type: 'CELL', value: 'B2' },
//   { type: 'OPERATOR', value: '*' },
//   { type: 'NUMBER', value: '2' },
// ]
```

---

## 7. State Management

### 7.1 Data Model

```typescript
// ═══════════════════════════════════════════════════════════════
// FLATTENED STATE - O(1) cell access
// ═══════════════════════════════════════════════════════════════

interface TableState {
  cells: Map<string, TableCell>; // Key: "A1", "B2", etc.
}

interface TableCell {
  /** Raw formula entered by user */
  formula: string | null; // "=A1+B1"
  
  /** Calculated result */
  value: CellValue; // 42
  
  /** Cell data type */
  type: CellType;
  
  /** Formatting options */
  formatting: FormattingOption[];
}

type CellValue = string | number | boolean | null | Error;

enum CellType {
  TEXT = 'text',
  NUMBER = 'number',
  DATE = 'date',
  BOOLEAN = 'boolean',
  ERROR = 'error',
}

// ═══════════════════════════════════════════════════════════════
// FORMATTING - Use enum, not class names
// ═══════════════════════════════════════════════════════════════

enum FormattingOption {
  BOLD = 'bold',
  ITALIC = 'italic',
  STRIKETHROUGH = 'strikethrough',
  UNDERLINE = 'underline',
  // Colors stored separately
}

// Why enum instead of CSS classes?
// - Class names can change during refactoring
// - Enum is stable API for import/export
// - Mapping enum → CSS happens at render time

function formatToClassName(format: FormattingOption): string {
  const mapping: Record<FormattingOption, string> = {
    [FormattingOption.BOLD]: 'cell--bold',
    [FormattingOption.ITALIC]: 'cell--italic',
    [FormattingOption.STRIKETHROUGH]: 'cell--strike',
    [FormattingOption.UNDERLINE]: 'cell--underline',
  };
  return mapping[format];
}
```

### 7.2 Event Handling with Delegation

```typescript
// ═══════════════════════════════════════════════════════════════
// EVENT DELEGATION - Single listener on table
// ═══════════════════════════════════════════════════════════════

class TableEditor {
  private table: HTMLElement;
  private state: TableState;

  constructor(table: HTMLElement) {
    this.table = table;
    
    // Single event listener for ALL cells
    this.table.addEventListener('input', this.handleCellChange.bind(this));
    this.table.addEventListener('focus', this.handleCellFocus.bind(this), true);
  }

  private handleCellChange(event: Event) {
    const target = event.target as HTMLElement;
    
    // Get cell ID from data attributes
    const row = target.dataset.row;
    const col = target.dataset.col;
    if (!row || !col) return;

    const cellId = `${col}${row}`; // e.g., "A1"
    const formula = target.textContent || '';

    this.updateCell(cellId, formula);
  }

  private updateCell(cellId: string, formula: string) {
    // 1. Update state
    const cell = this.state.cells.get(cellId) || this.createEmptyCell();
    cell.formula = formula;

    // 2. Resolve dependencies and calculate
    const order = this.dependencyResolver.resolve(cellId);
    
    for (const id of order) {
      const c = this.state.cells.get(id);
      if (c?.formula) {
        c.value = this.formulaParser.evaluate(c.formula, this.state);
      }
    }

    // 3. Update DOM for affected cells
    for (const id of order) {
      this.renderCell(id);
    }
  }
}
```

---

## 8. Performance Optimization

### 8.1 Web Workers for Calculations

```typescript
// ═══════════════════════════════════════════════════════════════
// MAIN THREAD - Don't block UI
// ═══════════════════════════════════════════════════════════════

class CalculationManager {
  private worker: Worker;
  private pendingCallbacks: Map<string, (result: any) => void> = new Map();

  constructor() {
    this.worker = new Worker('calculation-worker.js');
    
    this.worker.onmessage = (event) => {
      const { requestId, results } = event.data;
      const callback = this.pendingCallbacks.get(requestId);
      if (callback) {
        callback(results);
        this.pendingCallbacks.delete(requestId);
      }
    };
  }

  async calculate(
    cells: Map<string, TableCell>,
    changedCellId: string
  ): Promise<Map<string, CellValue>> {
    return new Promise((resolve) => {
      const requestId = crypto.randomUUID();
      this.pendingCallbacks.set(requestId, resolve);

      // Send to worker (cells must be serializable)
      this.worker.postMessage({
        requestId,
        cells: Object.fromEntries(cells),
        changedCellId,
      });
    });
  }
}

// ═══════════════════════════════════════════════════════════════
// WORKER THREAD - Heavy calculations here
// ═══════════════════════════════════════════════════════════════

// calculation-worker.js
self.onmessage = (event) => {
  const { requestId, cells, changedCellId } = event.data;

  // 1. Build dependency graph
  const graph = buildDependencyGraph(cells);

  // 2. Topological sort
  const order = topologicalSort(graph, changedCellId);

  // 3. Calculate in order
  const results = new Map();
  for (const cellId of order) {
    const cell = cells[cellId];
    if (cell.formula) {
      const value = evaluateFormula(cell.formula, cells);
      results.set(cellId, value);
      cells[cellId].value = value; // Update for next calculations
    }
  }

  // 4. Return results
  self.postMessage({ requestId, results: Object.fromEntries(results) });
};
```

### 8.2 Lazy DOM Updates

```typescript
// Batch DOM updates with requestAnimationFrame
class CellRenderer {
  private pendingUpdates: Map<string, CellValue> = new Map();
  private rafId: number | null = null;

  queueUpdate(cellId: string, value: CellValue) {
    this.pendingUpdates.set(cellId, value);
    
    if (!this.rafId) {
      this.rafId = requestAnimationFrame(() => this.flush());
    }
  }

  private flush() {
    // Batch all updates in single animation frame
    for (const [cellId, value] of this.pendingUpdates) {
      const element = document.querySelector(`[data-cell="${cellId}"]`);
      if (element) {
        element.textContent = String(value); // Soft write
      }
    }

    this.pendingUpdates.clear();
    this.rafId = null;
  }
}
```

### 8.3 CSS Optimization

```css
/* Use flat selectors, not nested */
.cell { /* Good */ }
.table .row .cell { /* Avoid - slow selector */ }

/* Avoid reflows */
.cell {
  /* Fixed dimensions prevent layout recalculation */
  width: 100px;
  height: 24px;
  
  /* GPU acceleration for transforms */
  will-change: transform;
  contain: content; /* CSS containment */
}

/* Use CSS animations, not JS */
.cell--highlight {
  animation: highlight 0.3s ease-out;
}

@keyframes highlight {
  from { background-color: yellow; }
  to { background-color: transparent; }
}
```

---

## 9. Accessibility

### 9.1 Semantic HTML

```html
<!-- Use native table elements when possible -->
<table role="grid" aria-label="Spreadsheet">
  <thead>
    <tr role="row">
      <th scope="col" role="columnheader">A</th>
      <th scope="col" role="columnheader">B</th>
    </tr>
  </thead>
  <tbody>
    <tr role="row">
      <th scope="row" role="rowheader">1</th>
      <td role="gridcell" tabindex="0" data-row="1" data-col="A">
        <input type="text" aria-label="Cell A1" />
      </td>
    </tr>
  </tbody>
</table>

<!-- When using divs, add ARIA -->
<div role="grid" aria-label="Spreadsheet">
  <div role="row">
    <div role="columnheader">A</div>
    <div role="columnheader">B</div>
  </div>
  <div role="row">
    <div role="rowheader">1</div>
    <div role="gridcell" tabindex="0">
      <input aria-label="Cell A1" />
    </div>
  </div>
</div>
```

### 9.2 Keyboard Navigation

```typescript
const SHORTCUTS = {
  'ArrowUp': () => moveCell(0, -1),
  'ArrowDown': () => moveCell(0, 1),
  'ArrowLeft': () => moveCell(-1, 0),
  'ArrowRight': () => moveCell(1, 0),
  'Tab': () => moveCell(1, 0),
  'Shift+Tab': () => moveCell(-1, 0),
  'Enter': () => moveCell(0, 1),
  'Escape': () => cancelEdit(),
  'Ctrl+c': () => copyCell(),
  'Ctrl+v': () => pasteCell(),
  'Ctrl+z': () => undo(),
  'Ctrl+y': () => redo(),
  'Ctrl+b': () => toggleFormat('bold'),
  'Ctrl+i': () => toggleFormat('italic'),
  'F2': () => editCell(),
};
```

### 9.3 Use rem, not px

```css
/* ❌ Bad - doesn't scale with user preferences */
.cell {
  font-size: 14px;
  height: 24px;
}

/* ✅ Good - scales with browser zoom and user settings */
.cell {
  font-size: 0.875rem;
  height: 1.5rem;
}
```

---

## Summary

| Section | Key Decision |
|---------|--------------|
| **Rendering** | DOM (not Canvas) for accessibility and dev speed |
| **Virtualization** | Vertical only, soft write, CSS transform |
| **Dependencies** | Topological Sort on DAG |
| **Cycle Detection** | Built into topsort algorithm |
| **Formula Parsing** | Tokenizer + Function registry |
| **State** | Flattened Map for O(1) access |
| **Performance** | Web Workers for calculations |
| **Accessibility** | role="grid", keyboard shortcuts |

### Key Takeaways

1. **Topological Sort** - Essential for dependency resolution
2. **Soft Write** - Update text content, don't recreate DOM
3. **CSS Transform** - Move elements without reflow
4. **Web Workers** - Offload calculations from UI thread
5. **Event Delegation** - Single listener on table, not per cell

---

## References

- [Topological Sort - William Fiset](https://www.youtube.com/watch?v=eL-KzMXSXXI)
- [Shunting-Yard Algorithm](https://en.wikipedia.org/wiki/Shunting-yard_algorithm)
- [ARIA Grid Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/grid/)
- [CSS Containment](https://developer.mozilla.org/en-US/docs/Web/CSS/contain)
