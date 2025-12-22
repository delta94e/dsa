# Trading Dashboard Frontend System Design

> A comprehensive frontend system design for a Financial Dashboard / Trading View application, covering layout design, data handling, real-time updates, and multi-window support.

---

## Table of Contents

1. [Requirements Exploration](#1-requirements-exploration)
2. [Architecture / High-Level Design](#2-architecture--high-level-design)
3. [Layout Design (Sandwich Pattern)](#3-layout-design-sandwich-pattern)
4. [Data Model](#4-data-model)
5. [Data Storage (IndexedDB + Bucketing)](#5-data-storage-indexdb--bucketing)
6. [API Design](#6-api-design)
7. [Multi-Window Support](#7-multi-window-support)
8. [Optimizations](#8-optimizations)

---

## 1. Requirements Exploration

### 1.1 Product Requirements

| Requirement | Description |
|-------------|-------------|
| **Multiple resizable charts** | User can place as many charts as needed on the dashboard |
| **Configurable grid layout** | User can adjust layout (e.g., 8×8, 6×12) |
| **Unified data interface** | Different data sources return the same data format |
| **Extensible chart types** | Each chart can have different data model (candlestick, line, table, pie) |
| **Chart synchronization** | Sync by asset ID, time frame across all charts |
| **Multi-monitor support** | Extend dashboard to second monitor via popup window |

### 1.2 Non-Product Requirements

| Requirement | Description |
|-------------|-------------|
| **Network performance** | Optimize data loading, utilize browser cache |
| **Rendering stability** | Display partial data while loading (down/upsampling) |
| **Legacy API support** | Unified interface working across different legacy APIs |
| **Real-time updates** | Low-latency data streaming for live market data |
| **Large data handling** | Handle millions of data points efficiently |

### 1.3 Technical Constraints

- Modern browsers only (no IE support needed for trading desks)
- Support for CSS Grid, IndexedDB, WebSocket/WebTransport
- Binary data transfer for optimal performance

---

## 2. Architecture / High-Level Design

### 2.1 Component Hierarchy

```
┌─────────────────────────────────────────────────────────────────────┐
│                        TRADING DASHBOARD                             │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │                    GRID CONTAINER (Layer 1)                    │  │
│  │  ┌─────────────────────────────────────────────────────────┐  │  │
│  │  │               CELL GRID (Layer 2)                        │  │  │
│  │  │   ┌───┐┌───┐┌───┐┌───┐┌───┐┌───┐                         │  │  │
│  │  │   │ 0 ││ 1 ││ 2 ││ 3 ││ 4 ││ 5 │  ← Drag target cells   │  │  │
│  │  │   └───┘└───┘└───┘└───┘└───┘└───┘                         │  │  │
│  │  │   ┌───┐┌───┐┌───┐┌───┐┌───┐┌───┐                         │  │  │
│  │  │   │ 6 ││ 7 ││ 8 ││ 9 ││10 ││11 │                         │  │  │
│  │  │   └───┘└───┘└───┘└───┘└───┘└───┘                         │  │  │
│  │  └─────────────────────────────────────────────────────────┘  │  │
│  │  ┌─────────────────────────────────────────────────────────┐  │  │
│  │  │              CHART LAYER (Layer 3)                       │  │  │
│  │  │  ┌──────────────────┐  ┌────────────────────────────┐   │  │  │
│  │  │  │   AAPL Chart     │  │      GOOGL Chart           │   │  │  │
│  │  │  │   (col 1-3,      │  │      (col 4-6,             │   │  │  │
│  │  │  │    row 1-2)      │  │       row 1-2)             │   │  │  │
│  │  │  └──────────────────┘  └────────────────────────────┘   │  │  │
│  │  └─────────────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │                      SERVICES                                  │  │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────────────────┐ │  │
│  │  │  Data API   │ │  IndexedDB  │ │  Broadcast Channel      │ │  │
│  │  │  (WS/SSE)   │ │  Storage    │ │  (Multi-window)         │ │  │
│  │  └─────────────┘ └─────────────┘ └─────────────────────────┘ │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### 2.2 Component Responsibilities

| Component | Responsibility |
|-----------|----------------|
| **Grid Container** | CSS Grid layout, configurable rows/columns |
| **Cell Grid** | Invisible drag targets, event bubbling |
| **Chart Layer** | Actual chart components, positioned via CSS Grid |
| **Draggable** | Generic drag-and-drop container |
| **Dashboard Component** | Fetches data, passes to charts |
| **Chart Element** | Transforms generic data to chart-specific format |
| **Data API Service** | WebSocket/SSE connection, data streaming |
| **IndexedDB Service** | Large dataset storage with bucketing |
| **Broadcast Channel** | Multi-window synchronization |

### 2.3 Data Flow

```
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│   Server    │─────▶│  Data API   │─────▶│  IndexedDB  │
│  (WS/SSE)   │      │  Service    │      │   Cache     │
└─────────────┘      └─────────────┘      └─────────────┘
                            │                    │
                            ▼                    ▼
                     ┌─────────────┐      ┌─────────────┐
                     │  Dashboard  │◀─────│   Query     │
                     │  Component  │      │   Layer     │
                     └─────────────┘      └─────────────┘
                            │
              ┌─────────────┼─────────────┐
              ▼             ▼             ▼
        ┌──────────┐ ┌──────────┐ ┌──────────┐
        │  Chart 1 │ │  Chart 2 │ │  Chart 3 │
        │ (AAPL)   │ │ (GOOGL)  │ │ (MSFT)   │
        └──────────┘ └──────────┘ └──────────┘
```

---

## 3. Layout Design (Sandwich Pattern)

### 3.1 The Sandwich Design

The layout uses a **three-layer sandwich design**:

```
Layer 3: Chart Components    ← User sees this
Layer 2: Cell Grid           ← Handles drag events  
Layer 1: Grid Container      ← CSS Grid structure
```

### 3.2 CSS Grid Setup

```css
/* Layer 1: Grid Container */
.grid-container {
  display: grid;
  grid-template-columns: repeat(var(--columns), 1fr);
  grid-template-rows: repeat(var(--rows), 1fr);
  width: 100%;
  height: 100vh;
  position: relative;
}

/* Layer 2: Cell Grid (invisible, for drag targets) */
.cell-grid {
  display: contents; /* Cells participate in parent grid */
}

.cell {
  border: 1px dashed transparent;
  transition: border-color 0.2s;
}

.cell:hover,
.cell.drag-over {
  border-color: rgba(66, 133, 244, 0.5);
  background: rgba(66, 133, 244, 0.1);
}

/* Layer 3: Chart positioned via grid-column/grid-row */
.chart-container {
  background: #1e1e1e;
  border-radius: 8px;
  overflow: hidden;
  /* Positioned by JS */
  grid-column: var(--col-start) / var(--col-end);
  grid-row: var(--row-start) / var(--row-end);
}
```

### 3.3 Drag and Drop Implementation

```typescript
interface GridPosition {
  column: number;
  row: number;
}

interface ChartPlacement {
  id: string;
  columnStart: number;
  columnEnd: number;
  rowStart: number;
  rowEnd: number;
}

function DashboardGrid({ columns, rows, charts }: DashboardGridProps) {
  const [placements, setPlacements] = useState<ChartPlacement[]>(charts);
  const [draggedChart, setDraggedChart] = useState<string | null>(null);

  // Generate cell grid
  const cells = useMemo(() => {
    const result: GridPosition[] = [];
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < columns; col++) {
        result.push({ column: col, row });
      }
    }
    return result;
  }, [columns, rows]);

  // Single handler on container (event bubbling)
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const target = e.target as HTMLElement;
    const col = parseInt(target.dataset.column || '0');
    const row = parseInt(target.dataset.row || '0');

    if (draggedChart) {
      // Default: chart takes 2x2 cells
      setPlacements(prev =>
        prev.map(p =>
          p.id === draggedChart
            ? {
                ...p,
                columnStart: col,
                columnEnd: col + 2,
                rowStart: row,
                rowEnd: row + 2,
              }
            : p
        )
      );
      setDraggedChart(null);
    }
  };

  return (
    <div
      className="grid-container"
      style={{
        '--columns': columns,
        '--rows': rows,
      } as React.CSSProperties}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      {/* Layer 2: Cell Grid */}
      <div className="cell-grid">
        {cells.map(({ column, row }) => (
          <div
            key={`${column}-${row}`}
            className="cell"
            data-column={column}
            data-row={row}
          />
        ))}
      </div>

      {/* Layer 3: Charts */}
      {placements.map(placement => (
        <ChartContainer
          key={placement.id}
          placement={placement}
          onDragStart={() => setDraggedChart(placement.id)}
        />
      ))}
    </div>
  );
}
```

### 3.4 Chart Resizing

```typescript
function ResizableChart({ placement, onResize }: ResizableChartProps) {
  const [isResizing, setIsResizing] = useState(false);
  const [resizeDirection, setResizeDirection] = useState<'e' | 's' | 'se' | null>(null);

  const handleResizeStart = (direction: 'e' | 's' | 'se') => {
    setIsResizing(true);
    setResizeDirection(direction);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizing) return;

    // Calculate new grid position based on mouse position
    const gridRect = gridRef.current.getBoundingClientRect();
    const cellWidth = gridRect.width / columns;
    const cellHeight = gridRect.height / rows;

    const newColEnd = Math.round((e.clientX - gridRect.left) / cellWidth);
    const newRowEnd = Math.round((e.clientY - gridRect.top) / cellHeight);

    onResize({
      ...placement,
      columnEnd: resizeDirection?.includes('e') ? newColEnd : placement.columnEnd,
      rowEnd: resizeDirection?.includes('s') ? newRowEnd : placement.rowEnd,
    });
  };

  return (
    <div
      className="chart-container"
      style={{
        '--col-start': placement.columnStart,
        '--col-end': placement.columnEnd,
        '--row-start': placement.rowStart,
        '--row-end': placement.rowEnd,
      } as React.CSSProperties}
    >
      <ChartContent />
      
      {/* Resize handles */}
      <div className="resize-handle resize-e" onMouseDown={() => handleResizeStart('e')} />
      <div className="resize-handle resize-s" onMouseDown={() => handleResizeStart('s')} />
      <div className="resize-handle resize-se" onMouseDown={() => handleResizeStart('se')} />
    </div>
  );
}
```

---

## 4. Data Model

### 4.1 Financial Data Types

```typescript
// Generic data format from API (unified interface)
interface TData {
  asset: string;        // "AAPL", "GOOGL"
  start: number;        // Unix timestamp (start of range)
  end: number;          // Unix timestamp (end of range)
  interval: Interval;   // Time frame
  points: DataPoint[];  // Price data
}

interface DataPoint {
  timestamp: number;    // Unix timestamp
  open: number;         // Opening price
  close: number;        // Closing price
  high?: number;        // Highest price (optional)
  low?: number;         // Lowest price (optional)
  volume?: number;      // Trading volume (optional)
}

type Interval = 
  | '1s'    // 1 second
  | '1m'    // 1 minute
  | '5m'    // 5 minutes
  | '15m'   // 15 minutes
  | '1h'    // 1 hour
  | '4h'    // 4 hours
  | '1d'    // 1 day
  | '1w'    // 1 week
  | '1M';   // 1 month
```

### 4.2 Chart Element Interface

Each chart implements a transformer to convert generic data to chart-specific format:

```typescript
interface ChartElement<TChartData> {
  transformer: (source: TData) => TChartData;
  render: (data: TChartData) => React.ReactNode;
}

// Candlestick chart data
interface CandlestickData {
  candles: Array<{
    x: number;      // Timestamp
    o: number;      // Open
    h: number;      // High
    l: number;      // Low
    c: number;      // Close
  }>;
}

// Line chart data
interface LineChartData {
  points: Array<{
    x: number;
    y: number;
  }>;
}

// Example: Candlestick chart implementation
const CandlestickChart: ChartElement<CandlestickData> = {
  transformer: (source: TData): CandlestickData => ({
    candles: source.points.map(p => ({
      x: p.timestamp,
      o: p.open,
      h: p.high || Math.max(p.open, p.close),
      l: p.low || Math.min(p.open, p.close),
      c: p.close,
    })),
  }),
  
  render: (data: CandlestickData) => (
    <CandlestickCanvas candles={data.candles} />
  ),
};

// Example: Line chart implementation
const LineChart: ChartElement<LineChartData> = {
  transformer: (source: TData): LineChartData => ({
    points: source.points.map(p => ({
      x: p.timestamp,
      y: p.close,
    })),
  }),
  
  render: (data: LineChartData) => (
    <LineChartCanvas points={data.points} />
  ),
};
```

### 4.3 Dashboard Component Interface

```typescript
interface DashboardComponent {
  id: string;
  asset: string;
  range: {
    start: number;
    end: number;
  };
  interval: Interval;
  chartType: 'candlestick' | 'line' | 'bar' | 'table';
  syncGroup?: string;  // Charts in same group sync together
}

interface DashboardState {
  components: DashboardComponent[];
  syncMode: {
    asset: boolean;
    interval: boolean;
  };
  globalAsset?: string;
  globalInterval?: Interval;
}
```

---

## 5. Data Storage (IndexedDB + Bucketing)

### 5.1 The Problem

Financial data can be massive:
- 1 second interval = 86,400 points/day
- Multiply by 365 days = 31.5M points/year
- Multiple assets = 100M+ points

**Standard IndexedDB cursor is O(n)** - too slow for large datasets.

### 5.2 The Solution: Bucketing

Instead of storing individual points, group them into **time-based buckets**:

```
┌────────────────────────────────────────────────────────────────────┐
│                    BUCKETING STRATEGY                               │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  Without bucketing (60 min, 1 sec interval):                       │
│  → 3,600 individual points to scan                                 │
│                                                                    │
│  With 5-minute buckets:                                            │
│  → 12 buckets to scan                                              │
│  → Each bucket contains max 300 points                             │
│                                                                    │
│  Timeline:                                                         │
│  ├─────┤─────┤─────┤─────┤─────┤─────┤─────┤─────┤─────┤─────┤     │
│    0-5   5-10  10-15 15-20 20-25 25-30 30-35 35-40 40-45 45-50     │
│    min   min   min   min   min   min   min   min   min   min      │
│                                                                    │
│  Bucket ID = floor(timestamp / bucketDuration)                     │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

### 5.3 Compound Key Structure

```typescript
// Compound key for efficient querying
type StorageKey = `${AssetId}:${BucketId}:${TimeFrame}`;

// Examples:
// "AAPL:0:5m"      → First 5-minute bucket for Apple
// "AAPL:1:5m"      → Second 5-minute bucket for Apple
// "AAPL:0:1h"      → First 1-hour bucket for Apple
// "GOOGL:288:1d"   → 288th day bucket for Google

interface BucketEntry {
  key: StorageKey;
  assetId: string;
  bucketId: number;
  timeFrame: TimeFrame;
  points: DataPoint[];
}

type TimeFrame = '5m' | '1h' | '1d';

// Calculate bucket ID from timestamp
function getBucketId(timestamp: number, timeFrame: TimeFrame): number {
  const durations: Record<TimeFrame, number> = {
    '5m': 5 * 60 * 1000,      // 300,000ms
    '1h': 60 * 60 * 1000,     // 3,600,000ms
    '1d': 24 * 60 * 60 * 1000 // 86,400,000ms
  };
  
  return Math.floor(timestamp / durations[timeFrame]);
}
```

### 5.4 IndexedDB Implementation

```typescript
class FinancialDataStore {
  private db: IDBDatabase | null = null;
  private readonly DB_NAME = 'TradingDashboard';
  private readonly STORE_NAME = 'priceData';

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.DB_NAME, 1);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        // Create object store with compound key index
        const store = db.createObjectStore(this.STORE_NAME, { keyPath: 'key' });
        
        // Index for querying by asset + timeframe
        store.createIndex('assetTimeFrame', ['assetId', 'timeFrame']);
        
        // Index for querying by asset + bucket range
        store.createIndex('assetBucket', ['assetId', 'bucketId']);
      };

      request.onsuccess = (event) => {
        this.db = (event.target as IDBOpenDBRequest).result;
        resolve();
      };

      request.onerror = () => reject(request.error);
    });
  }

  // Store data points in buckets
  async storePoints(
    assetId: string,
    points: DataPoint[],
    timeFrame: TimeFrame
  ): Promise<void> {
    // Group points into buckets
    const buckets = new Map<number, DataPoint[]>();
    
    for (const point of points) {
      const bucketId = getBucketId(point.timestamp, timeFrame);
      if (!buckets.has(bucketId)) {
        buckets.set(bucketId, []);
      }
      buckets.get(bucketId)!.push(point);
    }

    // Store each bucket
    const tx = this.db!.transaction(this.STORE_NAME, 'readwrite');
    const store = tx.objectStore(this.STORE_NAME);

    for (const [bucketId, bucketPoints] of buckets) {
      const key: StorageKey = `${assetId}:${bucketId}:${timeFrame}`;
      
      // Merge with existing bucket data
      const existing = await this.getByKey(key);
      const merged = existing 
        ? [...existing.points, ...bucketPoints].sort((a, b) => a.timestamp - b.timestamp)
        : bucketPoints;

      store.put({
        key,
        assetId,
        bucketId,
        timeFrame,
        points: merged,
      });
    }

    return new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  // Query data for a time range
  async queryRange(
    assetId: string,
    start: number,
    end: number,
    timeFrame: TimeFrame
  ): Promise<DataPoint[]> {
    const startBucket = getBucketId(start, timeFrame);
    const endBucket = getBucketId(end, timeFrame);

    const tx = this.db!.transaction(this.STORE_NAME, 'readonly');
    const store = tx.objectStore(this.STORE_NAME);
    const results: DataPoint[] = [];

    // Query only the buckets we need
    for (let bucketId = startBucket; bucketId <= endBucket; bucketId++) {
      const key: StorageKey = `${assetId}:${bucketId}:${timeFrame}`;
      const request = store.get(key);
      
      const entry = await new Promise<BucketEntry | undefined>((resolve) => {
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => resolve(undefined);
      });

      if (entry) {
        // Filter points within the requested range
        const filtered = entry.points.filter(
          p => p.timestamp >= start && p.timestamp <= end
        );
        results.push(...filtered);
      }
    }

    return results.sort((a, b) => a.timestamp - b.timestamp);
  }
}
```

### 5.5 Storage Requirements Calculation

```
Single point:
  - open: 4 bytes (float32)
  - close: 4 bytes (float32)
  - timestamp: 8 bytes (int64)
  = 16 bytes/point (minimum, without OHLC)

Per day (1 second interval):
  - 86,400 points × 16 bytes = 1.38 MB

Per year:
  - 365 days × 1.38 MB = ~500 MB per asset

With multiple time frames (5m, 1h, 1d buckets):
  - Overhead: ~20% extra storage
  - But: Much faster query performance

5-minute bucket stats:
  - Max 300 points per bucket
  - 288 buckets per day
  - Scan 288 buckets vs 86,400 points = 300x faster
```

### 5.6 Downsampling & Upsampling

```typescript
// Downsampling: Convert granular data to less granular
// Example: 5-minute data → 1-hour data
function downsample(points: DataPoint[], targetInterval: Interval): DataPoint[] {
  const intervalMs = getIntervalMs(targetInterval);
  const buckets = new Map<number, DataPoint[]>();

  // Group by target interval
  for (const point of points) {
    const bucketKey = Math.floor(point.timestamp / intervalMs);
    if (!buckets.has(bucketKey)) {
      buckets.set(bucketKey, []);
    }
    buckets.get(bucketKey)!.push(point);
  }

  // Aggregate each bucket
  return Array.from(buckets.entries()).map(([key, bucketPoints]) => ({
    timestamp: key * intervalMs,
    open: bucketPoints[0].open,                              // First open
    close: bucketPoints[bucketPoints.length - 1].close,      // Last close
    high: Math.max(...bucketPoints.map(p => p.high || p.close)),
    low: Math.min(...bucketPoints.map(p => p.low || p.close)),
    volume: bucketPoints.reduce((sum, p) => sum + (p.volume || 0), 0),
  }));
}

// Upsampling: Placeholder data while fetching more granular data
// Example: 1-hour data → 5-minute placeholders
function upsample(points: DataPoint[], targetInterval: Interval): DataPoint[] {
  const intervalMs = getIntervalMs(targetInterval);
  const result: DataPoint[] = [];

  for (let i = 0; i < points.length; i++) {
    const point = points[i];
    const nextTimestamp = points[i + 1]?.timestamp || point.timestamp + getIntervalMs('1h');
    
    // Fill gap with placeholder points
    for (let ts = point.timestamp; ts < nextTimestamp; ts += intervalMs) {
      result.push({
        timestamp: ts,
        open: point.open,
        close: point.close,
        high: point.high,
        low: point.low,
        // Mark as placeholder
        _placeholder: true,
      } as DataPoint);
    }
  }

  return result;
}
```

---

## 6. API Design

### 6.1 Unified Data Interface

```typescript
// All APIs implement this interface, regardless of underlying protocol
interface DataAPI {
  subscribe(params: SubscribeParams): Subscription;
  unsubscribe(subscriptionId: string): void;
  fetchHistorical(params: FetchParams): Promise<TData>;
}

interface SubscribeParams {
  assetId: string;
  interval: Interval;
}

interface FetchParams {
  assetId: string;
  start: number;
  end: number;
  interval: Interval;
}

interface Subscription {
  id: string;
  onData: (data: DataPoint) => void;
  onError: (error: Error) => void;
  unsubscribe: () => void;
}
```

### 6.2 Protocol Comparison

| Protocol | Pros | Cons |
|----------|------|------|
| **WebSocket** | Real-time, binary data, bidirectional | Complex state handling, hard to scale |
| **Server-Sent Events** | HTTP/2 multiplexing, auto-reconnect, stateless | Text only, unidirectional |
| **HTTP Streaming** | Binary data, HTTP/2 benefits | Slow, no frame marking |
| **WebTransport** | UDP/QUIC based, 0-RTT, fastest | Limited browser/server support (60%) |

### 6.3 WebSocket Implementation

```typescript
class WebSocketDataAPI implements DataAPI {
  private ws: WebSocket | null = null;
  private subscriptions = new Map<string, (data: DataPoint) => void>();
  private reconnectAttempts = 0;

  constructor(private url: string) {
    this.connect();
  }

  private connect() {
    this.ws = new WebSocket(this.url);

    this.ws.binaryType = 'arraybuffer'; // Binary data for efficiency

    this.ws.onopen = () => {
      this.reconnectAttempts = 0;
      // Re-subscribe to all active subscriptions
      for (const [id, _] of this.subscriptions) {
        this.sendSubscribe(id);
      }
    };

    this.ws.onmessage = (event) => {
      // Decode binary data (e.g., Protocol Buffers)
      const data = this.decode(event.data);
      
      if (data.type === 'price_update') {
        const callback = this.subscriptions.get(data.assetId);
        callback?.(data.point);
      }
    };

    this.ws.onclose = () => {
      // Exponential backoff reconnection
      const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
      this.reconnectAttempts++;
      setTimeout(() => this.connect(), delay);
    };
  }

  subscribe(params: SubscribeParams): Subscription {
    const id = `${params.assetId}:${params.interval}`;
    
    const subscription: Subscription = {
      id,
      onData: () => {},
      onError: () => {},
      unsubscribe: () => {
        this.subscriptions.delete(id);
        this.sendUnsubscribe(id);
      },
    };

    this.subscriptions.set(id, (data) => subscription.onData(data));
    this.sendSubscribe(id);

    return subscription;
  }

  private sendSubscribe(id: string) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(this.encode({ type: 'subscribe', id }));
    }
  }

  private sendUnsubscribe(id: string) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(this.encode({ type: 'unsubscribe', id }));
    }
  }

  // Protocol Buffers encoding (6-8x compression)
  private encode(data: object): ArrayBuffer {
    // Use protobuf.js or similar
    return ProtoBuf.encode(data);
  }

  private decode(buffer: ArrayBuffer): any {
    return ProtoBuf.decode(buffer);
  }
}
```

### 6.4 Server-Sent Events Implementation

```typescript
class SSEDataAPI implements DataAPI {
  private eventSources = new Map<string, EventSource>();

  subscribe(params: SubscribeParams): Subscription {
    const id = `${params.assetId}:${params.interval}`;
    const url = `/api/stream/${params.assetId}?interval=${params.interval}`;
    
    const eventSource = new EventSource(url);
    this.eventSources.set(id, eventSource);

    const subscription: Subscription = {
      id,
      onData: () => {},
      onError: () => {},
      unsubscribe: () => {
        eventSource.close();
        this.eventSources.delete(id);
      },
    };

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      subscription.onData(data);
    };

    eventSource.onerror = (error) => {
      subscription.onError(error as Error);
      // SSE auto-reconnects via HTTP/2
    };

    return subscription;
  }

  async fetchHistorical(params: FetchParams): Promise<TData> {
    const response = await fetch(
      `/api/history/${params.assetId}?start=${params.start}&end=${params.end}&interval=${params.interval}`
    );
    return response.json();
  }
}
```

### 6.5 WebTransport (Future Standard)

```typescript
class WebTransportDataAPI implements DataAPI {
  private transport: WebTransport | null = null;
  private streams = new Map<string, ReadableStream>();

  async connect(url: string) {
    this.transport = new WebTransport(url);
    await this.transport.ready;
  }

  async subscribe(params: SubscribeParams): Promise<Subscription> {
    const id = `${params.assetId}:${params.interval}`;
    
    // Open bidirectional stream
    const stream = await this.transport!.createBidirectionalStream();
    const writer = stream.writable.getWriter();
    const reader = stream.readable.getReader();

    // Send subscribe command
    await writer.write(new TextEncoder().encode(JSON.stringify({
      type: 'subscribe',
      assetId: params.assetId,
      interval: params.interval,
    })));

    const subscription: Subscription = {
      id,
      onData: () => {},
      onError: () => {},
      unsubscribe: async () => {
        await writer.close();
        this.streams.delete(id);
      },
    };

    // Read stream
    (async () => {
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        
        const data = this.decode(value);
        subscription.onData(data);
      }
    })();

    this.streams.set(id, stream.readable);
    return subscription;
  }
}
```

---

## 7. Multi-Window Support

### 7.1 Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                     MULTI-WINDOW ARCHITECTURE                        │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────────────────┐                 ┌─────────────────────┐   │
│  │   WINDOW 1 (HOST)   │                 │  WINDOW 2 (EXTENSION)│   │
│  │                     │                 │                      │   │
│  │  - Controls layout  │ ◀───────────▶  │  - Reads state       │   │
│  │  - Writes state     │  Broadcast      │  - Displays charts   │   │
│  │  - Fetches data     │  Channel        │  - Sends requests    │   │
│  │  - Manages sync     │                 │    to host           │   │
│  │                     │                 │                      │   │
│  └─────────────────────┘                 └─────────────────────┘   │
│            │                                        │               │
│            │           ┌─────────────┐              │               │
│            └──────────▶│ LocalStorage│◀─────────────┘               │
│                        │ (Host ID,   │                              │
│                        │  Extensions)│                              │
│                        └─────────────┘                              │
│                               │                                     │
│                               ▼                                     │
│                        ┌─────────────┐                              │
│                        │  IndexedDB  │  ← Shared data store         │
│                        └─────────────┘                              │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### 7.2 Window Registration

```typescript
interface WindowRegistration {
  hostId: string | null;
  extensions: string[];
}

class MultiWindowManager {
  private windowId: string;
  private isHost: boolean = false;
  private channel: BroadcastChannel;

  constructor() {
    this.windowId = crypto.randomUUID();
    this.channel = new BroadcastChannel('trading-dashboard');
    this.register();
    this.setupMessageHandler();
  }

  private register() {
    const registration = this.getRegistration();

    if (!registration.hostId) {
      // No host exists, become the host
      this.isHost = true;
      this.setRegistration({
        hostId: this.windowId,
        extensions: [],
      });
    } else {
      // Host exists, register as extension
      this.isHost = false;
      this.setRegistration({
        ...registration,
        extensions: [...registration.extensions, this.windowId],
      });
    }
  }

  private getRegistration(): WindowRegistration {
    const data = localStorage.getItem('window-registration');
    return data ? JSON.parse(data) : { hostId: null, extensions: [] };
  }

  private setRegistration(reg: WindowRegistration) {
    localStorage.setItem('window-registration', JSON.stringify(reg));
  }

  private setupMessageHandler() {
    this.channel.onmessage = (event) => {
      const { type, payload, source } = event.data;

      if (this.isHost) {
        // Host handles requests from extensions
        this.handleHostMessage(type, payload, source);
      } else {
        // Extensions receive updates from host
        this.handleExtensionMessage(type, payload);
      }
    };
  }

  // Host message handlers
  private handleHostMessage(type: string, payload: any, source: string) {
    switch (type) {
      case 'REQUEST_DATA':
        // Extension requests data, host fetches and broadcasts
        this.fetchAndBroadcast(payload);
        break;
      case 'CHANGE_ASSET':
        // Extension changed asset, sync to all
        this.syncAsset(payload.assetId);
        break;
      case 'EXTENSION_CLOSED':
        // Remove from extensions list
        this.removeExtension(source);
        break;
    }
  }

  // Extension message handlers
  private handleExtensionMessage(type: string, payload: any) {
    switch (type) {
      case 'STATE_UPDATE':
        // Host sent new state
        this.applyState(payload);
        break;
      case 'DATA_UPDATE':
        // Host sent new data
        this.applyData(payload);
        break;
      case 'SYNC_ASSET':
        // Asset changed globally
        this.updateAsset(payload.assetId);
        break;
    }
  }

  // Send message via Broadcast Channel
  send(type: string, payload: any) {
    this.channel.postMessage({
      type,
      payload,
      source: this.windowId,
    });
  }

  // Cleanup on window close
  dispose() {
    if (this.isHost) {
      // Elect new host from extensions
      const reg = this.getRegistration();
      if (reg.extensions.length > 0) {
        this.setRegistration({
          hostId: reg.extensions[0],
          extensions: reg.extensions.slice(1),
        });
        this.send('HOST_CHANGED', { newHostId: reg.extensions[0] });
      } else {
        localStorage.removeItem('window-registration');
      }
    } else {
      this.send('EXTENSION_CLOSED', { windowId: this.windowId });
    }
  }
}
```

### 7.3 Broadcast Channel Events

```typescript
// Event types
type BroadcastEvent =
  | { type: 'STATE_UPDATE'; payload: DashboardState }
  | { type: 'DATA_UPDATE'; payload: { assetId: string; data: TData } }
  | { type: 'SYNC_ASSET'; payload: { assetId: string } }
  | { type: 'SYNC_INTERVAL'; payload: { interval: Interval } }
  | { type: 'CHART_ADDED'; payload: { chart: DashboardComponent } }
  | { type: 'CHART_REMOVED'; payload: { chartId: string } }
  | { type: 'REQUEST_DATA'; payload: FetchParams }
  | { type: 'HOST_CHANGED'; payload: { newHostId: string } }
  | { type: 'EXTENSION_CLOSED'; payload: { windowId: string } };

// Usage in React component
function useBroadcastSync() {
  const manager = useMemo(() => new MultiWindowManager(), []);
  const [state, setState] = useState<DashboardState>(initialState);

  useEffect(() => {
    // Listen for state updates from host
    const unsubscribe = manager.onUpdate((newState) => {
      setState(newState);
    });

    return () => {
      unsubscribe();
      manager.dispose();
    };
  }, [manager]);

  const updateAsset = (assetId: string) => {
    if (manager.isHost) {
      // Host updates directly
      setState(prev => ({ ...prev, globalAsset: assetId }));
      manager.send('SYNC_ASSET', { assetId });
    } else {
      // Extension requests update from host
      manager.send('REQUEST_SYNC_ASSET', { assetId });
    }
  };

  return { state, updateAsset, isHost: manager.isHost };
}
```

---

## 8. Optimizations

### 8.1 Chart Synchronization

```typescript
interface SyncConfig {
  syncAsset: boolean;
  syncInterval: boolean;
}

function useSyncedCharts(charts: DashboardComponent[], syncConfig: SyncConfig) {
  const [globalAsset, setGlobalAsset] = useState<string | null>(null);
  const [globalInterval, setGlobalInterval] = useState<Interval | null>(null);

  // When any chart changes asset, sync all
  const handleAssetChange = (chartId: string, assetId: string) => {
    if (syncConfig.syncAsset) {
      setGlobalAsset(assetId);
    }
  };

  // Apply global asset to all charts
  const syncedCharts = useMemo(() => {
    return charts.map(chart => ({
      ...chart,
      asset: syncConfig.syncAsset && globalAsset ? globalAsset : chart.asset,
      interval: syncConfig.syncInterval && globalInterval ? globalInterval : chart.interval,
    }));
  }, [charts, globalAsset, globalInterval, syncConfig]);

  return { syncedCharts, handleAssetChange, setGlobalInterval };
}
```

### 8.2 Request Deduplication

```typescript
class DataFetcher {
  private pendingRequests = new Map<string, Promise<TData>>();
  private cache = new Map<string, { data: TData; timestamp: number }>();
  private CACHE_TTL = 60000; // 1 minute

  async fetch(params: FetchParams): Promise<TData> {
    const key = this.getKey(params);

    // Check cache
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return cached.data;
    }

    // Check pending request (deduplication)
    if (this.pendingRequests.has(key)) {
      return this.pendingRequests.get(key)!;
    }

    // Make request
    const promise = this.doFetch(params);
    this.pendingRequests.set(key, promise);

    try {
      const data = await promise;
      this.cache.set(key, { data, timestamp: Date.now() });
      return data;
    } finally {
      this.pendingRequests.delete(key);
    }
  }

  private getKey(params: FetchParams): string {
    return `${params.assetId}:${params.start}:${params.end}:${params.interval}`;
  }
}
```

### 8.3 Virtualized Chart Rendering

For charts with thousands of data points, only render visible points:

```typescript
function useVirtualizedPoints(
  points: DataPoint[],
  visibleRange: { start: number; end: number },
  maxPoints: number = 500
) {
  return useMemo(() => {
    // Filter to visible range
    const visible = points.filter(
      p => p.timestamp >= visibleRange.start && p.timestamp <= visibleRange.end
    );

    // Downsample if too many points
    if (visible.length <= maxPoints) {
      return visible;
    }

    // Sample every Nth point
    const step = Math.ceil(visible.length / maxPoints);
    return visible.filter((_, i) => i % step === 0);
  }, [points, visibleRange, maxPoints]);
}
```

---

## Summary

| Section | Key Points |
|---------|------------|
| **Layout** | 3-layer sandwich design, CSS Grid, drag-and-drop |
| **Data Model** | Unified TData interface, chart transformers |
| **Storage** | IndexedDB with time-based bucketing, compound keys |
| **API** | WebSocket/SSE/WebTransport, binary data, ProtoBuf |
| **Multi-Window** | Broadcast Channel, host/extension pattern, LocalStorage |
| **Sync** | Asset/interval synchronization across charts |

### Key Challenges

1. **Layout** - Resizable grid with drag-and-drop
2. **Data Volume** - Millions of points efficiently stored
3. **Real-time** - Low-latency streaming with reconnection
4. **Multi-window** - State sync across browser tabs
5. **Performance** - Downsampling, virtualization, caching

---

## Interview Tips

1. **Start with layout** - Explain the sandwich pattern
2. **Emphasize bucketing** - Show understanding of O(n) IndexedDB issue
3. **Compare protocols** - WebSocket vs SSE vs WebTransport tradeoffs
4. **Mention compression** - Protocol Buffers for binary data
5. **Multi-window sync** - Broadcast Channel is often overlooked
6. **Calculate storage** - Show you can estimate requirements

---

## References

- [CSS Grid Layout](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout)
- [IndexedDB API](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)
- [Broadcast Channel API](https://developer.mozilla.org/en-US/docs/Web/API/Broadcast_Channel_API)
- [WebTransport API](https://developer.mozilla.org/en-US/docs/Web/API/WebTransport_API)
- [Protocol Buffers](https://protobuf.dev/)
