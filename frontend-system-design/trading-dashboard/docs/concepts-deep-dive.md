# Trading Dashboard - Concepts Deep Dive

> A detailed explanation of all the advanced concepts used in building a financial dashboard / trading view application.

---

## Table of Contents

1. [Sandwich Layout Design](#1-sandwich-layout-design)
2. [CSS Grid for Dashboard Layouts](#2-css-grid-for-dashboard-layouts)
3. [IndexedDB and Large Data Storage](#3-indexeddb-and-large-data-storage)
4. [Bucketing Strategy](#4-bucketing-strategy)
5. [Data Downsampling & Upsampling](#5-data-downsampling--upsampling)
6. [Real-Time Data Protocols](#6-real-time-data-protocols)
7. [Binary Data & Protocol Buffers](#7-binary-data--protocol-buffers)
8. [Multi-Window Synchronization](#8-multi-window-synchronization)
9. [Chart Synchronization Patterns](#9-chart-synchronization-patterns)
10. [Performance Optimization Techniques](#10-performance-optimization-techniques)

---

## 1. Sandwich Layout Design

### The Problem

How do you create a dashboard with:
- Drag-and-drop chart placement
- Resizable chart windows
- Dynamic grid layout
- Smooth performance

### The Solution: Three-Layer Sandwich

```
┌───────────────────────────────────────────────────────────────┐
│  Layer 3: Chart Components     ← What user sees              │
├───────────────────────────────────────────────────────────────┤
│  Layer 2: Invisible Cell Grid  ← Handles drag/drop events    │
├───────────────────────────────────────────────────────────────┤
│  Layer 1: CSS Grid Container   ← Structural layout           │
└───────────────────────────────────────────────────────────────┘
```

### Why Three Layers?

**Layer 1 (Grid Container):**
- Defines the grid structure (e.g., 8×8)
- Uses CSS Grid for layout
- All layers use the same grid

**Layer 2 (Cell Grid):**
- Invisible div for each cell
- Catches drag events
- Uses data attributes to identify position

**Layer 3 (Charts):**
- Actual chart components
- Positioned via `grid-column` and `grid-row`
- Can span multiple cells

### How It Works

```typescript
// Drop event handler (uses event bubbling)
function handleDrop(event: DragEvent) {
  const target = event.target as HTMLElement;
  
  // Read position from data attributes
  const column = parseInt(target.dataset.column!);
  const row = parseInt(target.dataset.row!);
  
  // Place chart at this position
  placeChart({
    columnStart: column,
    columnEnd: column + 2, // Default 2x2
    rowStart: row,
    rowEnd: row + 2,
  });
}
```

### CSS Grid Overflow Mode

CSS Grid allows multiple items in the same cell—this is what enables the sandwich:

```css
.container {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  grid-template-rows: repeat(8, 1fr);
}

/* Cell grid uses display: contents to participate in parent grid */
.cell-grid {
  display: contents;
}

/* Chart overlays cells but positioned via grid-column/grid-row */
.chart {
  grid-column: 1 / 3;
  grid-row: 1 / 3;
  z-index: 1; /* Above cells */
}
```

### Event Bubbling Optimization

Instead of 64 event handlers (8×8 grid), use ONE handler on the container:

```typescript
// ❌ Bad: Handler on each cell
cells.forEach(cell => {
  cell.addEventListener('drop', handleDrop);
});

// ✅ Good: Single handler, events bubble up
container.addEventListener('drop', (e) => {
  const target = e.target as HTMLElement;
  const col = target.dataset.column;
  const row = target.dataset.row;
  // Handle drop...
});
```

---

## 2. CSS Grid for Dashboard Layouts

### Why CSS Grid (Not Flexbox)?

| Feature | CSS Grid | Flexbox |
|---------|----------|---------|
| 2D layout | ✅ Native | ❌ 1D only |
| Item placement | ✅ grid-column/row | ❌ Order-based |
| Spanning cells | ✅ Built-in | ❌ Hacky |
| Responsiveness | ✅ fr units | ⚠️ Manual |
| Browser support | ✅ All modern | ✅ All modern |

### Grid Template with Variables

```css
.dashboard {
  display: grid;
  grid-template-columns: repeat(var(--columns, 8), 1fr);
  grid-template-rows: repeat(var(--rows, 8), 1fr);
  gap: 8px;
  height: 100vh;
  width: 100vw;
  padding: 16px;
}
```

### Placing Charts

```typescript
interface ChartPosition {
  columnStart: number;
  columnEnd: number;
  rowStart: number;
  rowEnd: number;
}

const chartStyle = {
  gridColumn: `${position.columnStart} / ${position.columnEnd}`,
  gridRow: `${position.rowStart} / ${position.rowEnd}`,
};
```

### Resize Handles

```tsx
function ResizableChart({ children }) {
  return (
    <div className="chart">
      {children}
      
      {/* Edge resize handles */}
      <div className="resize-handle resize-e" /> {/* East */}
      <div className="resize-handle resize-s" /> {/* South */}
      <div className="resize-handle resize-se" /> {/* Southeast corner */}
    </div>
  );
}
```

```css
.resize-handle {
  position: absolute;
  background: transparent;
}

.resize-e {
  right: 0;
  top: 0;
  bottom: 0;
  width: 8px;
  cursor: ew-resize;
}

.resize-s {
  bottom: 0;
  left: 0;
  right: 0;
  height: 8px;
  cursor: ns-resize;
}

.resize-se {
  right: 0;
  bottom: 0;
  width: 16px;
  height: 16px;
  cursor: nwse-resize;
}
```

---

## 3. IndexedDB and Large Data Storage

### The Problem

Financial data can be enormous:
- 1 second data = 86,400 points/day
- 1 year = 31.5 million points
- 10 assets = 315 million points

**localStorage limit:** 5-10 MB
**IndexedDB limit:** 2 GB per domain (up to 30% of disk)

### IndexedDB Basics

```typescript
// Open database
const request = indexedDB.open('TradingDashboard', 1);

request.onupgradeneeded = (event) => {
  const db = (event.target as IDBOpenDBRequest).result;
  
  // Create object store
  const store = db.createObjectStore('priceData', {
    keyPath: 'id', // Primary key
  });
  
  // Create indexes for efficient queries
  store.createIndex('assetId', 'assetId');
  store.createIndex('timestamp', 'timestamp');
  store.createIndex('compound', ['assetId', 'timestamp']);
};

// Write data
const tx = db.transaction('priceData', 'readwrite');
const store = tx.objectStore('priceData');
store.put({ id: 'AAPL:123456', assetId: 'AAPL', timestamp: 123456, price: 150.00 });

// Read data
const tx = db.transaction('priceData', 'readonly');
const store = tx.objectStore('priceData');
const request = store.get('AAPL:123456');
request.onsuccess = () => console.log(request.result);
```

### The Cursor Problem

Scanning all records is **O(n)**:

```typescript
// ❌ Slow: Full table scan
const cursor = store.openCursor();
cursor.onsuccess = (event) => {
  const cursor = event.target.result;
  if (cursor) {
    // Process each record
    cursor.continue();
  }
};
```

For 31.5M points, this takes seconds or even minutes.

### Solution: Compound Keys + Bucketing

See next section for the bucketing strategy.

---

## 4. Bucketing Strategy

### The Concept

Instead of storing individual points, group them into **time-based buckets**:

```
Without buckets (1 day of 1-second data):
├─ Point 1  (00:00:00)
├─ Point 2  (00:00:01)
├─ Point 3  (00:00:02)
│   ... 86,397 more ...
└─ Point 86400 (23:59:59)

With 5-minute buckets:
├─ Bucket 0  (00:00 - 00:05) → 300 points
├─ Bucket 1  (00:05 - 00:10) → 300 points
├─ Bucket 2  (00:10 - 00:15) → 300 points
│   ... 285 more buckets ...
└─ Bucket 287 (23:55 - 24:00) → 300 points

Query for 1 hour: Scan 12 buckets instead of 3600 points
```

### Compound Key Structure

```
Key = AssetId:BucketId:TimeFrame

Examples:
  AAPL:0:5m     → Apple, first 5-min bucket
  AAPL:1:5m     → Apple, second 5-min bucket
  GOOGL:24:1h   → Google, 24th hour bucket (midnight to 1am on day 2)
```

### Calculating Bucket ID

```typescript
const BUCKET_DURATIONS = {
  '5m': 5 * 60 * 1000,      // 300,000 ms
  '1h': 60 * 60 * 1000,     // 3,600,000 ms
  '1d': 24 * 60 * 60 * 1000 // 86,400,000 ms
};

function getBucketId(timestamp: number, timeFrame: '5m' | '1h' | '1d'): number {
  return Math.floor(timestamp / BUCKET_DURATIONS[timeFrame]);
}

// Example: timestamp = 300,001 (5 minutes and 1 millisecond after epoch)
// getBucketId(300001, '5m') = floor(300001 / 300000) = 1
```

### Multi-Timeframe Storage

Store the same data in multiple bucket sizes for different queries:

```typescript
// Store in all relevant bucket sizes
async function storeWithMultipleTimeframes(
  assetId: string,
  points: DataPoint[]
) {
  // 5-minute buckets for detailed views
  await storeBucketed(assetId, points, '5m');
  
  // 1-hour buckets for daily views
  await storeBucketed(assetId, points, '1h');
  
  // 1-day buckets for yearly views
  await storeBucketed(assetId, points, '1d');
}
```

**Tradeoff:** 3x storage overhead, but much faster queries.

### Query Optimization

```typescript
async function queryRange(
  assetId: string,
  start: number,
  end: number
): Promise<DataPoint[]> {
  // Choose optimal bucket size based on range
  const rangeDuration = end - start;
  
  let timeFrame: '5m' | '1h' | '1d';
  if (rangeDuration <= 24 * 60 * 60 * 1000) {
    timeFrame = '5m';  // Less than 1 day: use 5-min buckets
  } else if (rangeDuration <= 30 * 24 * 60 * 60 * 1000) {
    timeFrame = '1h';  // Less than 1 month: use 1-hour buckets
  } else {
    timeFrame = '1d';  // More than 1 month: use 1-day buckets
  }
  
  const startBucket = getBucketId(start, timeFrame);
  const endBucket = getBucketId(end, timeFrame);
  
  // Fetch only needed buckets
  const buckets = await Promise.all(
    range(startBucket, endBucket + 1).map(bucketId =>
      fetchBucket(assetId, bucketId, timeFrame)
    )
  );
  
  return buckets.flat().filter(p => p.timestamp >= start && p.timestamp <= end);
}
```

---

## 5. Data Downsampling & Upsampling

### The Need

User changes time frame:
- **1 minute → 1 hour**: We have MORE data than needed (downsample)
- **1 hour → 1 minute**: We have LESS data than needed (upsample)

### Downsampling (Lossless)

Convert many points into fewer, aggregated points:

```typescript
function downsample(
  points: DataPoint[],
  targetInterval: number // in milliseconds
): DataPoint[] {
  // Group points by target interval
  const groups = new Map<number, DataPoint[]>();
  
  for (const point of points) {
    const groupKey = Math.floor(point.timestamp / targetInterval) * targetInterval;
    if (!groups.has(groupKey)) {
      groups.set(groupKey, []);
    }
    groups.get(groupKey)!.push(point);
  }
  
  // Aggregate each group into single OHLC candle
  return Array.from(groups.entries()).map(([timestamp, groupPoints]) => ({
    timestamp,
    open: groupPoints[0].open,                                    // First open
    high: Math.max(...groupPoints.map(p => p.high ?? p.close)),   // Highest high
    low: Math.min(...groupPoints.map(p => p.low ?? p.close)),     // Lowest low
    close: groupPoints[groupPoints.length - 1].close,             // Last close
    volume: groupPoints.reduce((sum, p) => sum + (p.volume ?? 0), 0), // Sum volume
  }));
}

// Example: 60 one-minute points → 1 one-hour point
const hourlyData = downsample(minuteData, 60 * 60 * 1000);
```

### Upsampling (Lossy/Placeholder)

You can't create real data from less granular data. But you can show **placeholders** while fetching:

```typescript
function upsample(
  points: DataPoint[],
  targetInterval: number
): DataPoint[] {
  const result: DataPoint[] = [];
  
  for (let i = 0; i < points.length; i++) {
    const current = points[i];
    const next = points[i + 1];
    
    const endTime = next?.timestamp ?? current.timestamp + 60 * 60 * 1000; // Assume 1 hour if last point
    
    // Fill gap with placeholder points
    for (let ts = current.timestamp; ts < endTime; ts += targetInterval) {
      result.push({
        timestamp: ts,
        open: current.close,   // Use parent's close as placeholder
        high: current.close,
        low: current.close,
        close: current.close,
        _isPlaceholder: true,  // Mark as placeholder
      });
    }
  }
  
  return result;
}
```

### Visual Handling

```tsx
function CandlestickChart({ data }) {
  return (
    <svg>
      {data.map(point => (
        <Candle
          key={point.timestamp}
          point={point}
          opacity={point._isPlaceholder ? 0.3 : 1}
          style={point._isPlaceholder ? 'dashed' : 'solid'}
        />
      ))}
      
      {data.some(p => p._isPlaceholder) && (
        <text className="loading-indicator">Loading detailed data...</text>
      )}
    </svg>
  );
}
```

---

## 6. Real-Time Data Protocols

### Overview Comparison

```
┌─────────────────────────────────────────────────────────────────────┐
│                    PROTOCOL COMPARISON                               │
├────────────────┬───────────────┬───────────────┬───────────────────┤
│                │   WebSocket   │     SSE       │   WebTransport    │
├────────────────┼───────────────┼───────────────┼───────────────────┤
│ Direction      │ Bidirectional │ Server→Client │ Bidirectional     │
│ Protocol       │ TCP           │ HTTP/2        │ UDP/QUIC          │
│ Data Format    │ Binary        │ Text          │ Binary            │
│ Latency        │ Low           │ Medium        │ Very Low          │
│ Reconnection   │ Manual        │ Automatic     │ Built-in          │
│ Multiplexing   │ No            │ Yes (HTTP/2)  │ Yes               │
│ Browser Support│ 100%          │ 95%+          │ ~60%              │
│ Scaling        │ Complex       │ Easy          │ Easy              │
└────────────────┴───────────────┴───────────────┴───────────────────┘
```

### WebSocket

**Best for:** Real-time bidirectional communication

```typescript
class WebSocketClient {
  private ws: WebSocket;
  private reconnectAttempts = 0;

  connect(url: string) {
    this.ws = new WebSocket(url);
    this.ws.binaryType = 'arraybuffer'; // Enable binary data

    this.ws.onopen = () => {
      this.reconnectAttempts = 0;
      this.resubscribeAll();
    };

    this.ws.onmessage = (event) => {
      const data = this.decode(event.data); // Decode binary
      this.handleMessage(data);
    };

    this.ws.onclose = () => {
      // Exponential backoff reconnection
      const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
      this.reconnectAttempts++;
      setTimeout(() => this.connect(url), delay);
    };
  }

  subscribe(assetId: string) {
    this.ws.send(this.encode({ type: 'subscribe', assetId }));
  }
}
```

### Server-Sent Events (SSE)

**Best for:** Simple server push, auto-reconnection

```typescript
class SSEClient {
  private sources = new Map<string, EventSource>();

  subscribe(assetId: string, onData: (data: DataPoint) => void) {
    const url = `/api/stream/${assetId}`;
    const source = new EventSource(url);

    source.onmessage = (event) => {
      const data = JSON.parse(event.data);
      onData(data);
    };

    source.onerror = () => {
      // EventSource auto-reconnects!
      console.log('Connection lost, reconnecting...');
    };

    this.sources.set(assetId, source);
  }

  unsubscribe(assetId: string) {
    this.sources.get(assetId)?.close();
    this.sources.delete(assetId);
  }
}
```

### WebTransport (Future)

**Best for:** Ultra-low latency, modern apps

```typescript
class WebTransportClient {
  private transport: WebTransport;

  async connect(url: string) {
    this.transport = new WebTransport(url);
    await this.transport.ready;
    
    // No handshake needed! (0-RTT)
    console.log('Connected with zero round-trip time');
  }

  async subscribe(assetId: string) {
    const stream = await this.transport.createBidirectionalStream();
    const writer = stream.writable.getWriter();
    const reader = stream.readable.getReader();

    // Send subscribe command
    await writer.write(encode({ type: 'subscribe', assetId }));

    // Read stream
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      this.handleData(decode(value));
    }
  }
}
```

### When to Use What

| Use Case | Recommended |
|----------|-------------|
| General trading app | WebSocket |
| Simple price ticker | SSE |
| High-frequency trading | WebTransport (if supported) |
| Legacy browser support | SSE with polling fallback |

---

## 7. Binary Data & Protocol Buffers

### Why Binary?

Text (JSON):
```json
{"timestamp":1703072400000,"open":150.25,"close":150.30,"high":150.35,"low":150.20}
```
= **92 bytes**

Binary (Protocol Buffers):
```
<binary representation: 16 bytes>
```
= **16 bytes** (6x compression)

### Protocol Buffers Schema

```protobuf
// price_data.proto

message DataPoint {
  uint64 timestamp = 1;
  float open = 2;
  float close = 3;
  float high = 4;
  float low = 5;
  float volume = 6;
}

message PriceUpdate {
  string asset_id = 1;
  repeated DataPoint points = 2;
}

message SubscribeRequest {
  string asset_id = 1;
  string interval = 2;
}
```

### Using protobuf.js

```typescript
import protobuf from 'protobufjs';

// Load schema
const root = await protobuf.load('price_data.proto');
const PriceUpdate = root.lookupType('PriceUpdate');
const DataPoint = root.lookupType('DataPoint');

// Encode (send to server)
const message = PriceUpdate.create({
  assetId: 'AAPL',
  points: [
    { timestamp: Date.now(), open: 150.25, close: 150.30, high: 150.35, low: 150.20 }
  ]
});
const buffer = PriceUpdate.encode(message).finish();

// Decode (receive from server)
const decoded = PriceUpdate.decode(new Uint8Array(buffer));
console.log(decoded.assetId); // "AAPL"
```

### Compression Benefits

```
1 day of 1-second data:
  JSON:     86,400 × 92 bytes = 7.9 MB
  Protobuf: 86,400 × 16 bytes = 1.4 MB
  
  Savings: 82% reduction
```

---

## 8. Multi-Window Synchronization

### The Problem

User opens a second browser tab to put on a second monitor. How do you:
- Sync state between tabs?
- Avoid duplicate data fetching?
- Handle one tab closing?

### Solution: Broadcast Channel API

```typescript
// Create channel (same name = same channel)
const channel = new BroadcastChannel('trading-dashboard');

// Send message to all other tabs
channel.postMessage({
  type: 'ASSET_CHANGED',
  payload: { assetId: 'GOOGL' }
});

// Receive messages from other tabs
channel.onmessage = (event) => {
  const { type, payload } = event.data;
  
  switch (type) {
    case 'ASSET_CHANGED':
      setCurrentAsset(payload.assetId);
      break;
    case 'DATA_UPDATE':
      updateCache(payload);
      break;
  }
};
```

### Host/Extension Pattern

Designate one tab as **host** (controls state), others as **extensions** (read-only):

```typescript
class WindowManager {
  private windowId = crypto.randomUUID();
  private isHost = false;
  
  register() {
    const hostId = localStorage.getItem('hostId');
    
    if (!hostId) {
      // No host, become the host
      this.isHost = true;
      localStorage.setItem('hostId', this.windowId);
    } else {
      // Host exists, register as extension
      const extensions = JSON.parse(localStorage.getItem('extensions') || '[]');
      extensions.push(this.windowId);
      localStorage.setItem('extensions', JSON.stringify(extensions));
    }
  }
  
  // Host election when host closes
  cleanup() {
    if (this.isHost) {
      const extensions = JSON.parse(localStorage.getItem('extensions') || '[]');
      
      if (extensions.length > 0) {
        // Elect first extension as new host
        localStorage.setItem('hostId', extensions[0]);
        localStorage.setItem('extensions', JSON.stringify(extensions.slice(1)));
        
        this.channel.postMessage({
          type: 'HOST_CHANGED',
          payload: { newHostId: extensions[0] }
        });
      } else {
        localStorage.removeItem('hostId');
      }
    }
  }
}
```

### Data Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│   HOST (Tab 1)                        EXTENSION (Tab 2)         │
│   ───────────                         ─────────────────         │
│                                                                 │
│   1. Fetches data from server         1. Requests data via      │
│   2. Stores in IndexedDB                  BroadcastChannel      │
│   3. Updates local state              2. Host fetches if needed │
│   4. Broadcasts to extensions         3. Receives data update   │
│                                       4. Reads from IndexedDB   │
│                                                                 │
│   ┌─────────────────────┐             ┌─────────────────────┐   │
│   │    IndexedDB        │◀───────────▶│    IndexedDB        │   │
│   │   (shared)          │             │   (same DB)         │   │
│   └─────────────────────┘             └─────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 9. Chart Synchronization Patterns

### Sync Modes

```typescript
interface SyncConfig {
  syncAsset: boolean;    // All charts show same asset
  syncInterval: boolean; // All charts use same time frame
  syncRange: boolean;    // All charts show same time range
}
```

### Implementation

```typescript
function useSyncedCharts(initialCharts: Chart[], syncConfig: SyncConfig) {
  const [charts, setCharts] = useState(initialCharts);
  const [globalAsset, setGlobalAsset] = useState<string | null>(null);
  const [globalInterval, setGlobalInterval] = useState<string | null>(null);

  // When any chart changes asset (and sync is on)
  const handleAssetChange = (chartId: string, newAsset: string) => {
    if (syncConfig.syncAsset) {
      setGlobalAsset(newAsset);
      setCharts(prev => prev.map(c => ({ ...c, asset: newAsset })));
    } else {
      setCharts(prev => prev.map(c => 
        c.id === chartId ? { ...c, asset: newAsset } : c
      ));
    }
  };

  // When any chart changes interval (and sync is on)
  const handleIntervalChange = (chartId: string, newInterval: string) => {
    if (syncConfig.syncInterval) {
      setGlobalInterval(newInterval);
      setCharts(prev => prev.map(c => ({ ...c, interval: newInterval })));
    } else {
      setCharts(prev => prev.map(c => 
        c.id === chartId ? { ...c, interval: newInterval } : c
      ));
    }
  };

  return { charts, handleAssetChange, handleIntervalChange };
}
```

### Cross-Window Sync

Combine with BroadcastChannel:

```typescript
const channel = new BroadcastChannel('chart-sync');

// Broadcast when local chart changes
function handleAssetChange(chartId: string, newAsset: string) {
  updateLocalCharts(chartId, newAsset);
  
  channel.postMessage({
    type: 'SYNC_ASSET',
    payload: { assetId: newAsset }
  });
}

// Receive sync from other windows
channel.onmessage = (event) => {
  if (event.data.type === 'SYNC_ASSET') {
    updateLocalCharts(null, event.data.payload.assetId);
  }
};
```

---

## 10. Performance Optimization Techniques

### 1. Request Deduplication

```typescript
class DataFetcher {
  private pending = new Map<string, Promise<any>>();

  async fetch(key: string, fetcher: () => Promise<any>) {
    // Return existing promise if request in flight
    if (this.pending.has(key)) {
      return this.pending.get(key);
    }

    const promise = fetcher();
    this.pending.set(key, promise);

    try {
      return await promise;
    } finally {
      this.pending.delete(key);
    }
  }
}

// Usage
const fetcher = new DataFetcher();

// These all return the same promise!
fetcher.fetch('AAPL:1h', () => api.fetchData('AAPL', '1h'));
fetcher.fetch('AAPL:1h', () => api.fetchData('AAPL', '1h'));
fetcher.fetch('AAPL:1h', () => api.fetchData('AAPL', '1h'));
```

### 2. Canvas Rendering for Charts

For thousands of data points, use Canvas instead of SVG:

```typescript
function drawCandlestickChart(
  ctx: CanvasRenderingContext2D,
  data: DataPoint[],
  width: number,
  height: number
) {
  const candleWidth = width / data.length;
  
  for (let i = 0; i < data.length; i++) {
    const point = data[i];
    const x = i * candleWidth;
    
    const isGreen = point.close >= point.open;
    ctx.fillStyle = isGreen ? '#26a69a' : '#ef5350';
    
    // Draw candle body
    const bodyTop = priceToY(Math.max(point.open, point.close), height);
    const bodyBottom = priceToY(Math.min(point.open, point.close), height);
    ctx.fillRect(x + 2, bodyTop, candleWidth - 4, bodyBottom - bodyTop);
    
    // Draw wick
    ctx.strokeStyle = ctx.fillStyle;
    ctx.beginPath();
    ctx.moveTo(x + candleWidth / 2, priceToY(point.high, height));
    ctx.lineTo(x + candleWidth / 2, priceToY(point.low, height));
    ctx.stroke();
  }
}
```

### 3. Web Workers for Data Processing

Offload heavy calculations:

```typescript
// main.ts
const worker = new Worker('dataWorker.js');

worker.postMessage({
  type: 'DOWNSAMPLE',
  data: rawData,
  targetInterval: '1h'
});

worker.onmessage = (event) => {
  const downsampledData = event.data;
  setChartData(downsampledData);
};

// dataWorker.js
self.onmessage = (event) => {
  const { type, data, targetInterval } = event.data;
  
  if (type === 'DOWNSAMPLE') {
    const result = downsample(data, targetInterval);
    self.postMessage(result);
  }
};
```

### 4. Reduced IndexedDB Durability

For faster writes (at cost of some durability):

```typescript
const tx = db.transaction('priceData', 'readwrite', {
  durability: 'relaxed' // Faster but less durable
});
```

**Trade-off:** If browser crashes, last few writes may be lost. For financial data (which can be re-fetched), this is acceptable.

---

## Summary

| Concept | Key Takeaway |
|---------|--------------|
| **Sandwich Layout** | 3 layers: Grid → Cells → Charts |
| **CSS Grid** | Native 2D layout with spanning |
| **IndexedDB** | 2GB per domain, O(n) cursor |
| **Bucketing** | Group points by time, compound keys |
| **Downsampling** | Aggregate small → large intervals |
| **Upsampling** | Placeholder data while loading |
| **WebSocket** | Binary, bidirectional, manual reconnect |
| **SSE** | HTTP/2, auto-reconnect, text only |
| **WebTransport** | UDP/QUIC, fastest, limited support |
| **Protocol Buffers** | 6-8x compression vs JSON |
| **Multi-Window** | BroadcastChannel + LocalStorage |
| **Chart Sync** | Shared state with event broadcasting |

---

## References

- [CSS Grid Layout](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout)
- [IndexedDB API](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)
- [Broadcast Channel API](https://developer.mozilla.org/en-US/docs/Web/API/Broadcast_Channel_API)
- [WebTransport API](https://developer.mozilla.org/en-US/docs/Web/API/WebTransport_API)
- [Protocol Buffers](https://protobuf.dev/)
- [HTML Drag and Drop API](https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API)
