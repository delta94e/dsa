# Google Sheets - Concepts Deep Dive

> A detailed exploration of the advanced concepts used in building a production-ready Spreadsheet application.

---

## Table of Contents

1. [Canvas vs DOM Rendering](#1-canvas-vs-dom-rendering)
2. [Virtualization with Element Recycling](#2-virtualization-with-element-recycling)
3. [Topological Sort Deep Dive](#3-topological-sort-deep-dive)
4. [Formula Parsing Algorithms](#4-formula-parsing-algorithms)
5. [Web Workers for Heavy Computation](#5-web-workers-for-heavy-computation)
6. [Reflow vs Repaint Optimization](#6-reflow-vs-repaint-optimization)

---

## 1. Canvas vs DOM Rendering

### When to Use Canvas

```typescript
// Canvas: Drawing pixels directly to GPU
const canvas = document.getElementById('spreadsheet') as HTMLCanvasElement;
const ctx = canvas.getContext('2d');

function renderCell(x: number, y: number, value: string) {
  // Just drawing pixels - no DOM nodes created
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(x, y, CELL_WIDTH, CELL_HEIGHT);
  ctx.strokeRect(x, y, CELL_WIDTH, CELL_HEIGHT);
  ctx.fillStyle = '#000000';
  ctx.fillText(value, x + 5, y + 16);
}

// Render 1 million cells in one requestAnimationFrame
function renderGrid() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let row = 0; row < 1000; row++) {
    for (let col = 0; col < 26; col++) {
      renderCell(col * CELL_WIDTH, row * CELL_HEIGHT, `${col},${row}`);
    }
  }
}
```

### Canvas Accessibility Challenge

```typescript
// Canvas has NO built-in accessibility
// Solution: Hidden DOM layer for screen readers

class AccessibleCanvas {
  private canvas: HTMLCanvasElement;
  private accessibilityLayer: HTMLDivElement;

  constructor() {
    // Visual canvas
    this.canvas = document.createElement('canvas');
    
    // Hidden accessibility layer
    this.accessibilityLayer = document.createElement('div');
    this.accessibilityLayer.setAttribute('role', 'grid');
    this.accessibilityLayer.setAttribute('aria-label', 'Spreadsheet');
    this.accessibilityLayer.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      opacity: 0;
      pointer-events: none;
    `;
  }

  updateAccessibilityLayer() {
    // Sync hidden DOM with canvas state
    // This is complex and expensive to maintain
    this.accessibilityLayer.innerHTML = this.cells
      .map((cell, i) => `
        <div role="gridcell" tabindex="${i === this.focusedCell ? 0 : -1}">
          ${cell.value}
        </div>
      `)
      .join('');
  }
}
```

### Decision Framework

```
┌─────────────────────────────────────────────────────────────────┐
│                    RENDERING DECISION TREE                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  [Start]                                                        │
│     │                                                           │
│     ▼                                                           │
│  Millions of cells?                                             │
│     │                                                           │
│     ├─ YES ──▶ Budget for specialized team?                    │
│     │              │                                            │
│     │              ├─ YES ──▶ Use CANVAS                       │
│     │              │          (Best performance)                │
│     │              │                                            │
│     │              └─ NO ───▶ Use DOM + Virtualization         │
│     │                         (Acceptable performance)          │
│     │                                                           │
│     └─ NO ───▶ Accessibility critical?                         │
│                    │                                            │
│                    ├─ YES ──▶ Use DOM                          │
│                    │          (Native a11y)                     │
│                    │                                            │
│                    └─ NO ───▶ Either works                     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. Virtualization with Element Recycling

### The Problem

```
26,000 cells = 26,000 DOM nodes
Each node ≈ 2KB memory
Total ≈ 52MB just for DOM

With virtualization:
150 visible rows × 26 cols = 3,900 nodes
≈ 8MB (84% reduction!)
```

### Complete Implementation

```typescript
interface VirtualizedRow {
  element: HTMLElement;
  rowIndex: number;
  cells: HTMLElement[];
}

class VirtualizedGrid {
  private container: HTMLElement;
  private content: HTMLElement;
  private rows: VirtualizedRow[] = [];
  
  private data: string[][] = [];
  private rowHeight = 24;
  private visibleRows = 50;
  private bufferRows = 25;
  
  private firstVisibleRow = 0;
  private lastVisibleRow = 0;

  constructor(container: HTMLElement) {
    this.container = container;
    this.setupContainer();
    this.createRows();
    this.setupIntersectionObservers();
  }

  private setupContainer() {
    this.container.style.overflow = 'auto';
    this.container.style.position = 'relative';
    
    this.content = document.createElement('div');
    this.content.style.position = 'relative';
    this.container.appendChild(this.content);
  }

  private createRows() {
    // Create pool of reusable rows
    const totalPoolSize = this.visibleRows + this.bufferRows * 2;
    
    for (let i = 0; i < totalPoolSize; i++) {
      const row = this.createRow(i);
      this.rows.push(row);
      this.content.appendChild(row.element);
    }
  }

  private createRow(index: number): VirtualizedRow {
    const element = document.createElement('div');
    element.className = 'virtual-row';
    element.style.cssText = `
      position: absolute;
      left: 0;
      right: 0;
      height: ${this.rowHeight}px;
      transform: translateY(${index * this.rowHeight}px);
    `;
    element.setAttribute('role', 'row');
    element.setAttribute('data-row', String(index));
    
    const cells: HTMLElement[] = [];
    for (let col = 0; col < 26; col++) {
      const cell = document.createElement('div');
      cell.className = 'virtual-cell';
      cell.setAttribute('role', 'gridcell');
      cell.setAttribute('data-col', String(col));
      cell.contentEditable = 'true';
      cells.push(cell);
      element.appendChild(cell);
    }
    
    return { element, rowIndex: index, cells };
  }

  setData(data: string[][]) {
    this.data = data;
    this.content.style.height = `${data.length * this.rowHeight}px`;
    this.updateVisibleRows();
  }

  private setupIntersectionObservers() {
    const topSentinel = document.createElement('div');
    topSentinel.className = 'sentinel-top';
    topSentinel.style.cssText = 'height: 1px; width: 100%;';
    
    const bottomSentinel = document.createElement('div');
    bottomSentinel.className = 'sentinel-bottom';
    bottomSentinel.style.cssText = 'height: 1px; width: 100%;';
    
    this.content.insertBefore(topSentinel, this.content.firstChild);
    this.content.appendChild(bottomSentinel);
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.onScroll();
        }
      });
    }, { root: this.container });
    
    observer.observe(topSentinel);
    observer.observe(bottomSentinel);
    
    // Also listen to scroll for smoother updates
    this.container.addEventListener('scroll', () => this.onScroll());
  }

  private onScroll() {
    const scrollTop = this.container.scrollTop;
    const newFirstVisible = Math.max(0, Math.floor(scrollTop / this.rowHeight) - this.bufferRows);
    
    if (newFirstVisible !== this.firstVisibleRow) {
      this.firstVisibleRow = newFirstVisible;
      this.updateVisibleRows();
    }
  }

  private updateVisibleRows() {
    const totalVisible = this.visibleRows + this.bufferRows * 2;
    
    this.rows.forEach((row, poolIndex) => {
      const dataIndex = this.firstVisibleRow + poolIndex;
      
      if (dataIndex >= 0 && dataIndex < this.data.length) {
        // Update row position (CSS transform - no reflow!)
        row.element.style.transform = `translateY(${dataIndex * this.rowHeight}px)`;
        row.element.setAttribute('data-row', String(dataIndex));
        row.rowIndex = dataIndex;
        
        // SOFT WRITE: Update cell contents only
        const rowData = this.data[dataIndex] || [];
        row.cells.forEach((cell, colIndex) => {
          const newValue = rowData[colIndex] || '';
          if (cell.textContent !== newValue) {
            cell.textContent = newValue; // Minimal DOM operation
          }
        });
        
        row.element.style.display = '';
      } else {
        row.element.style.display = 'none';
      }
    });
  }
}
```

---

## 3. Topological Sort Deep Dive

### Why Topological Sort?

```
Spreadsheet formula: C1 = A1 + B1
                    B1 = D1 * 2
                    A1 = D1 + 1
                    D1 = 5

Wrong order: C1 → B1 → A1 → D1
             C1 = undefined + undefined = NaN ❌

Correct order (topological): D1 → A1 → B1 → C1
             D1 = 5
             A1 = 5 + 1 = 6
             B1 = 5 * 2 = 10
             C1 = 6 + 10 = 16 ✅
```

### Algorithm: Kahn's Algorithm (BFS)

```typescript
function topologicalSortKahn(graph: Map<string, string[]>): string[] {
  // Calculate in-degree for each node
  const inDegree = new Map<string, number>();
  
  for (const node of graph.keys()) {
    if (!inDegree.has(node)) inDegree.set(node, 0);
    
    for (const neighbor of graph.get(node) || []) {
      inDegree.set(neighbor, (inDegree.get(neighbor) || 0) + 1);
    }
  }
  
  // Start with nodes that have no dependencies
  const queue: string[] = [];
  for (const [node, degree] of inDegree) {
    if (degree === 0) queue.push(node);
  }
  
  const result: string[] = [];
  
  while (queue.length > 0) {
    const node = queue.shift()!;
    result.push(node);
    
    for (const neighbor of graph.get(node) || []) {
      inDegree.set(neighbor, inDegree.get(neighbor)! - 1);
      if (inDegree.get(neighbor) === 0) {
        queue.push(neighbor);
      }
    }
  }
  
  // If not all nodes processed, there's a cycle
  if (result.length !== graph.size) {
    throw new Error('Circular dependency detected');
  }
  
  return result;
}
```

### Algorithm: DFS with Cycle Detection

```typescript
function topologicalSortDFS(
  dependencies: Map<string, string[]>
): string[] {
  const result: string[] = [];
  const visited = new Set<string>();
  const visiting = new Set<string>(); // Gray nodes for cycle detection

  function dfs(node: string): void {
    if (visiting.has(node)) {
      throw new Error(`Circular reference: ${node}`);
    }
    
    if (visited.has(node)) {
      return; // Already processed
    }

    visiting.add(node); // Mark as "in progress"

    // Process all dependencies first
    const deps = dependencies.get(node) || [];
    for (const dep of deps) {
      dfs(dep);
    }

    visiting.delete(node);
    visited.add(node);
    result.push(node);
  }

  // Process all nodes
  for (const node of dependencies.keys()) {
    if (!visited.has(node)) {
      dfs(node);
    }
  }

  return result;
}

// Usage
const deps = new Map([
  ['C1', ['A1', 'B1']],    // C1 depends on A1 and B1
  ['B1', ['D1']],          // B1 depends on D1
  ['A1', ['D1']],          // A1 depends on D1
  ['D1', []],              // D1 has no dependencies
]);

const order = topologicalSortDFS(deps);
console.log(order);
// ['D1', 'A1', 'B1', 'C1'] or ['D1', 'B1', 'A1', 'C1']
// Both are valid topological orders
```

### Incremental Recalculation

```typescript
class DependencyGraph {
  // cell -> cells that depend on it
  private dependents: Map<string, Set<string>> = new Map();
  // cell -> cells it depends on
  private dependencies: Map<string, Set<string>> = new Map();

  addDependency(cell: string, dependsOn: string): void {
    if (!this.dependencies.has(cell)) {
      this.dependencies.set(cell, new Set());
    }
    this.dependencies.get(cell)!.add(dependsOn);
    
    if (!this.dependents.has(dependsOn)) {
      this.dependents.set(dependsOn, new Set());
    }
    this.dependents.get(dependsOn)!.add(cell);
  }

  // When a cell changes, find all cells that need recalculation
  getCellsToRecalculate(changedCell: string): string[] {
    const affected = new Set<string>();
    const queue = [changedCell];
    
    while (queue.length > 0) {
      const cell = queue.shift()!;
      affected.add(cell);
      
      // Add all dependents
      const deps = this.dependents.get(cell) || new Set();
      for (const dep of deps) {
        if (!affected.has(dep)) {
          queue.push(dep);
        }
      }
    }
    
    // Now topologically sort just the affected cells
    return this.topologicalSort([...affected]);
  }

  private topologicalSort(cells: string[]): string[] {
    // Only sort the subset of cells
    const filtered = new Map<string, string[]>();
    const cellSet = new Set(cells);
    
    for (const cell of cells) {
      const deps = [...(this.dependencies.get(cell) || [])]
        .filter(d => cellSet.has(d));
      filtered.set(cell, deps);
    }
    
    return topologicalSortDFS(filtered);
  }
}
```

---

## 4. Formula Parsing Algorithms

### Shunting-Yard Algorithm

```typescript
// Converts infix to postfix (Reverse Polish Notation)
// "A1 + B1 * 2" → ["A1", "B1", "2", "*", "+"]

interface Token {
  type: 'NUMBER' | 'CELL' | 'OPERATOR' | 'LPAREN' | 'RPAREN';
  value: string;
}

const PRECEDENCE: Record<string, number> = {
  '+': 1,
  '-': 1,
  '*': 2,
  '/': 2,
  '^': 3,
};

const RIGHT_ASSOCIATIVE = new Set(['^']);

function shuntingYard(tokens: Token[]): Token[] {
  const output: Token[] = [];
  const operators: Token[] = [];

  for (const token of tokens) {
    if (token.type === 'NUMBER' || token.type === 'CELL') {
      output.push(token);
    } else if (token.type === 'OPERATOR') {
      while (
        operators.length > 0 &&
        operators[operators.length - 1].type === 'OPERATOR' &&
        (
          PRECEDENCE[operators[operators.length - 1].value] > PRECEDENCE[token.value] ||
          (
            PRECEDENCE[operators[operators.length - 1].value] === PRECEDENCE[token.value] &&
            !RIGHT_ASSOCIATIVE.has(token.value)
          )
        )
      ) {
        output.push(operators.pop()!);
      }
      operators.push(token);
    } else if (token.type === 'LPAREN') {
      operators.push(token);
    } else if (token.type === 'RPAREN') {
      while (
        operators.length > 0 &&
        operators[operators.length - 1].type !== 'LPAREN'
      ) {
        output.push(operators.pop()!);
      }
      operators.pop(); // Remove LPAREN
    }
  }

  while (operators.length > 0) {
    output.push(operators.pop()!);
  }

  return output;
}

// Evaluate postfix expression
function evaluatePostfix(
  tokens: Token[],
  cellValues: Map<string, number>
): number {
  const stack: number[] = [];

  for (const token of tokens) {
    if (token.type === 'NUMBER') {
      stack.push(parseFloat(token.value));
    } else if (token.type === 'CELL') {
      stack.push(cellValues.get(token.value) || 0);
    } else if (token.type === 'OPERATOR') {
      const b = stack.pop()!;
      const a = stack.pop()!;
      switch (token.value) {
        case '+': stack.push(a + b); break;
        case '-': stack.push(a - b); break;
        case '*': stack.push(a * b); break;
        case '/': stack.push(a / b); break;
        case '^': stack.push(Math.pow(a, b)); break;
      }
    }
  }

  return stack[0];
}
```

### Building an AST

```typescript
interface ASTNode {
  type: 'number' | 'cell' | 'operation' | 'function';
  value?: number | string;
  operator?: string;
  left?: ASTNode;
  right?: ASTNode;
  arguments?: ASTNode[];
}

function buildAST(formula: string): ASTNode {
  const tokens = tokenize(formula);
  return parseExpression(tokens, 0).node;
}

function parseExpression(tokens: Token[], pos: number): { node: ASTNode; pos: number } {
  let { node: left, pos: nextPos } = parseTerm(tokens, pos);
  
  while (
    nextPos < tokens.length &&
    (tokens[nextPos].value === '+' || tokens[nextPos].value === '-')
  ) {
    const operator = tokens[nextPos].value;
    const right = parseTerm(tokens, nextPos + 1);
    left = {
      type: 'operation',
      operator,
      left,
      right: right.node,
    };
    nextPos = right.pos;
  }
  
  return { node: left, pos: nextPos };
}

function evaluateAST(
  node: ASTNode,
  cellValues: Map<string, number>
): number {
  switch (node.type) {
    case 'number':
      return node.value as number;
      
    case 'cell':
      return cellValues.get(node.value as string) || 0;
      
    case 'operation':
      const a = evaluateAST(node.left!, cellValues);
      const b = evaluateAST(node.right!, cellValues);
      switch (node.operator) {
        case '+': return a + b;
        case '-': return a - b;
        case '*': return a * b;
        case '/': return a / b;
        default: return 0;
      }
      
    case 'function':
      const args = node.arguments!.map(arg => evaluateAST(arg, cellValues));
      return executeFunction(node.value as string, args);
      
    default:
      return 0;
  }
}
```

---

## 5. Web Workers for Heavy Computation

### Main Thread ↔ Worker Communication

```typescript
// ═══════════════════════════════════════════════════════════════
// MAIN THREAD
// ═══════════════════════════════════════════════════════════════

class SpreadsheetCalculator {
  private worker: Worker;
  private callbacks = new Map<string, (result: any) => void>();

  constructor() {
    this.worker = new Worker(
      new URL('./calc-worker.ts', import.meta.url),
      { type: 'module' }
    );

    this.worker.onmessage = (event) => {
      const { requestId, type, data } = event.data;
      
      if (type === 'CALCULATION_COMPLETE') {
        const callback = this.callbacks.get(requestId);
        if (callback) {
          callback(data);
          this.callbacks.delete(requestId);
        }
      }
    };
  }

  async recalculate(
    cells: Record<string, { formula: string; value: any }>,
    changedCell: string
  ): Promise<Record<string, any>> {
    return new Promise((resolve) => {
      const requestId = crypto.randomUUID();
      this.callbacks.set(requestId, resolve);

      this.worker.postMessage({
        type: 'RECALCULATE',
        requestId,
        data: { cells, changedCell },
      });
    });
  }
}

// ═══════════════════════════════════════════════════════════════
// WORKER THREAD (calc-worker.ts)
// ═══════════════════════════════════════════════════════════════

// This runs in a separate thread - won't block UI!

self.onmessage = (event) => {
  const { type, requestId, data } = event.data;

  if (type === 'RECALCULATE') {
    const { cells, changedCell } = data;
    
    try {
      // 1. Build dependency graph
      const graph = buildDependencyGraph(cells);
      
      // 2. Find affected cells
      const affected = findAffectedCells(graph, changedCell);
      
      // 3. Topological sort
      const order = topologicalSort(affected);
      
      // 4. Calculate in order
      const results: Record<string, any> = {};
      
      for (const cellId of order) {
        const cell = cells[cellId];
        if (cell.formula) {
          const value = evaluateFormula(cell.formula, cells);
          cells[cellId].value = value; // Update for next calculations
          results[cellId] = value;
        }
      }
      
      // 5. Send results back
      self.postMessage({
        type: 'CALCULATION_COMPLETE',
        requestId,
        data: results,
      });
      
    } catch (error) {
      self.postMessage({
        type: 'CALCULATION_ERROR',
        requestId,
        data: { error: (error as Error).message },
      });
    }
  }
};

// Helper functions (run in worker)
function buildDependencyGraph(cells: Record<string, any>) {
  // ... implementation
}

function topologicalSort(cells: string[]) {
  // ... implementation
}

function evaluateFormula(formula: string, cells: Record<string, any>) {
  // ... implementation
}
```

### Chunked Processing for Large Sheets

```typescript
// For very large sheets, process in chunks
// to prevent worker from blocking for too long

self.onmessage = async (event) => {
  const { cells, changedCell, requestId } = event.data;
  
  const affectedCells = findAffectedCells(cells, changedCell);
  const CHUNK_SIZE = 1000;
  
  for (let i = 0; i < affectedCells.length; i += CHUNK_SIZE) {
    const chunk = affectedCells.slice(i, i + CHUNK_SIZE);
    const results: Record<string, any> = {};
    
    for (const cellId of chunk) {
      results[cellId] = evaluateFormula(cells[cellId].formula, cells);
      cells[cellId].value = results[cellId];
    }
    
    // Send partial results
    self.postMessage({
      type: 'CALCULATION_PROGRESS',
      requestId,
      data: {
        results,
        progress: Math.min(100, ((i + CHUNK_SIZE) / affectedCells.length) * 100),
      },
    });
    
    // Yield to allow other messages
    await new Promise(r => setTimeout(r, 0));
  }
  
  self.postMessage({
    type: 'CALCULATION_COMPLETE',
    requestId,
  });
};
```

---

## 6. Reflow vs Repaint Optimization

### Understanding the Rendering Pipeline

```
┌─────────────────────────────────────────────────────────────────┐
│                  BROWSER RENDERING PIPELINE                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  JavaScript                                                     │
│      │                                                          │
│      ▼                                                          │
│  ┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────────┐     │
│  │  Style  │──▶│ Layout  │──▶│  Paint  │──▶│  Composite  │     │
│  │  Calc   │   │(Reflow) │   │(Repaint)│   │   (GPU)     │     │
│  └─────────┘   └─────────┘   └─────────┘   └─────────────┘     │
│                                                                 │
│  ───────────────────────────────────────────────────────────── │
│                                                                 │
│  Changing width/height  → Triggers: Style + Layout + Paint      │
│  Changing color/shadow  → Triggers: Style + Paint (skip Layout) │
│  Changing transform     → Triggers: Composite only (fastest!)   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### What Triggers Reflow?

```typescript
// ❌ These trigger REFLOW (expensive!)

element.offsetWidth;        // Reading layout property
element.clientHeight;       // Reading layout property
element.getBoundingClientRect();

element.style.width = '100px';
element.style.height = '50px';
element.style.top = '10px';
element.style.left = '20px';
element.style.padding = '5px';
element.style.margin = '5px';
element.innerHTML = 'new content';

document.body.appendChild(element);
document.body.removeChild(element);

// ✅ These DON'T trigger reflow

element.style.transform = 'translateY(100px)'; // Composite only
element.style.opacity = '0.5';                  // Composite only
element.textContent = 'new text';               // Minimal impact
```

### Optimization Techniques

```typescript
// ═══════════════════════════════════════════════════════════════
// BATCH DOM READS AND WRITES
// ═══════════════════════════════════════════════════════════════

// ❌ Bad: Interleaved reads/writes cause multiple reflows
cells.forEach(cell => {
  const height = cell.offsetHeight; // READ → reflow
  cell.style.width = `${height}px`; // WRITE → reflow
});

// ✅ Good: Batch reads, then batch writes (1 reflow)
const heights = cells.map(cell => cell.offsetHeight); // All READs
cells.forEach((cell, i) => {
  cell.style.width = `${heights[i]}px`; // All WRITEs
});


// ═══════════════════════════════════════════════════════════════
// USE CSS TRANSFORM FOR POSITIONING
// ═══════════════════════════════════════════════════════════════

// ❌ Bad: Using top/left triggers reflow
function scrollTo(row: number) {
  rows.forEach((el, i) => {
    el.style.top = `${(row + i) * 24}px`;
  });
}

// ✅ Good: Using transform skips layout
function scrollTo(row: number) {
  rows.forEach((el, i) => {
    el.style.transform = `translateY(${(row + i) * 24}px)`;
  });
}


// ═══════════════════════════════════════════════════════════════
// USE DOCUMENT FRAGMENT FOR BATCH INSERTS
// ═══════════════════════════════════════════════════════════════

// ❌ Bad: Multiple reflows
for (const data of rows) {
  const element = createRow(data);
  container.appendChild(element); // Reflow each time!
}

// ✅ Good: Single reflow
const fragment = document.createDocumentFragment();
for (const data of rows) {
  const element = createRow(data);
  fragment.appendChild(element); // No reflow
}
container.appendChild(fragment); // Single reflow


// ═══════════════════════════════════════════════════════════════
// USE requestAnimationFrame FOR VISUAL UPDATES
// ═══════════════════════════════════════════════════════════════

class BatchUpdater {
  private pending = new Map<HTMLElement, Record<string, string>>();
  private rafId: number | null = null;

  update(element: HTMLElement, styles: Record<string, string>) {
    if (!this.pending.has(element)) {
      this.pending.set(element, {});
    }
    Object.assign(this.pending.get(element)!, styles);

    if (!this.rafId) {
      this.rafId = requestAnimationFrame(() => this.flush());
    }
  }

  private flush() {
    for (const [element, styles] of this.pending) {
      Object.assign(element.style, styles);
    }
    this.pending.clear();
    this.rafId = null;
  }
}
```

---

## Summary

| Concept | Key Takeaway |
|---------|--------------|
| **Canvas vs DOM** | Canvas for million cells, DOM for accessibility |
| **Virtualization** | Recycle elements, soft write, CSS transform |
| **Topological Sort** | DFS with visiting set for cycle detection |
| **Formula Parsing** | Shunting-yard → postfix → evaluate |
| **Web Workers** | Offload calculation, send results back |
| **Reflow** | Avoid layout reads/writes, use transform |

---

## References

- [Topological Sort - William Fiset](https://www.youtube.com/watch?v=eL-KzMXSXXI)
- [Shunting-Yard Algorithm](https://en.wikipedia.org/wiki/Shunting-yard_algorithm)
- [What forces layout/reflow](https://gist.github.com/paulirish/5d52fb081b3570c81e3a)
- [Web Workers API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API)
