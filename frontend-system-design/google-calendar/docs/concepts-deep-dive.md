# Google Calendar - Concepts Deep Dive

> A detailed exploration of the advanced concepts used in building a production-ready Calendar application.

---

## Table of Contents

1. [Interval Tree Deep Dive](#1-interval-tree-deep-dive)
2. [GraphQL Subscriptions over SSE](#2-graphql-subscriptions-over-sse)
3. [Event-Driven State Management](#3-event-driven-state-management)
4. [Pre-Rendering with CSS Transforms](#4-pre-rendering-with-css-transforms)
5. [PWA & Offline Support](#5-pwa--offline-support)
6. [Web Push Notifications](#6-web-push-notifications)
7. [Recurring Events](#7-recurring-events)
8. [Timezone Handling](#8-timezone-handling)

---

## 1. Interval Tree Deep Dive

### The Problem

```
Given 1000 events, find all events that overlap with June 15, 2024.

Naive: Check each event → O(N) = 1000 checks
Interval Tree: Binary search → O(log N + K) = ~10 + matching events
```

### How It Works

An **Interval Tree** is a specialized Binary Search Tree where:
1. Nodes are sorted by **start date**
2. Each node stores **max end date** in its subtree
3. We can prune entire subtrees if target > max end date

### Complete Implementation

```typescript
interface Interval {
  id: string;
  start: number;
  end: number;
}

interface IntervalNode {
  interval: Interval;
  maxEnd: number;
  left: IntervalNode | null;
  right: IntervalNode | null;
  height: number; // For AVL balancing
}

class IntervalTree {
  private root: IntervalNode | null = null;

  // ═══════════════════════════════════════════════════════════════
  // INSERT
  // ═══════════════════════════════════════════════════════════════

  insert(interval: Interval): void {
    this.root = this.insertNode(this.root, interval);
  }

  private insertNode(node: IntervalNode | null, interval: Interval): IntervalNode {
    // Base case: create new node
    if (!node) {
      return {
        interval,
        maxEnd: interval.end,
        left: null,
        right: null,
        height: 1,
      };
    }

    // BST insert based on start time
    if (interval.start < node.interval.start) {
      node.left = this.insertNode(node.left, interval);
    } else {
      node.right = this.insertNode(node.right, interval);
    }

    // Update height and maxEnd
    node.height = 1 + Math.max(
      this.getHeight(node.left),
      this.getHeight(node.right)
    );
    node.maxEnd = this.calculateMaxEnd(node);

    // Balance the tree (AVL)
    return this.balance(node);
  }

  // ═══════════════════════════════════════════════════════════════
  // SEARCH - Find all intervals containing a point
  // ═══════════════════════════════════════════════════════════════

  searchPoint(timestamp: number): Interval[] {
    const results: Interval[] = [];
    this.searchPointNode(this.root, timestamp, results);
    return results;
  }

  private searchPointNode(
    node: IntervalNode | null,
    timestamp: number,
    results: Interval[]
  ): void {
    if (!node) return;

    // Prune: if timestamp > maxEnd, no overlap possible in this subtree
    if (timestamp > node.maxEnd) return;

    // Check if this node's interval contains the timestamp
    if (timestamp >= node.interval.start && timestamp <= node.interval.end) {
      results.push(node.interval);
    }

    // Search left subtree
    this.searchPointNode(node.left, timestamp, results);

    // Search right subtree only if timestamp >= this node's start
    // (optimization: intervals to the right start later)
    if (timestamp >= node.interval.start) {
      this.searchPointNode(node.right, timestamp, results);
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // SEARCH - Find all intervals overlapping with a range
  // ═══════════════════════════════════════════════════════════════

  searchRange(start: number, end: number): Interval[] {
    const results: Interval[] = [];
    this.searchRangeNode(this.root, start, end, results);
    return results;
  }

  private searchRangeNode(
    node: IntervalNode | null,
    start: number,
    end: number,
    results: Interval[]
  ): void {
    if (!node) return;

    // Prune: if start > maxEnd, no overlap possible
    if (start > node.maxEnd) return;

    // Check if intervals overlap
    // Two intervals [a,b] and [c,d] overlap if: a <= d AND c <= b
    if (node.interval.start <= end && start <= node.interval.end) {
      results.push(node.interval);
    }

    // Search children
    this.searchRangeNode(node.left, start, end, results);
    this.searchRangeNode(node.right, start, end, results);
  }

  // ═══════════════════════════════════════════════════════════════
  // DELETE
  // ═══════════════════════════════════════════════════════════════

  delete(id: string): void {
    this.root = this.deleteNode(this.root, id);
  }

  private deleteNode(node: IntervalNode | null, id: string): IntervalNode | null {
    if (!node) return null;

    if (node.interval.id === id) {
      // Node found - delete it
      if (!node.left) return node.right;
      if (!node.right) return node.left;

      // Node has two children - replace with successor
      const successor = this.findMin(node.right);
      node.interval = successor.interval;
      node.right = this.deleteNode(node.right, successor.interval.id);
    } else {
      // Search in children
      node.left = this.deleteNode(node.left, id);
      node.right = this.deleteNode(node.right, id);
    }

    // Update height and maxEnd
    node.height = 1 + Math.max(
      this.getHeight(node.left),
      this.getHeight(node.right)
    );
    node.maxEnd = this.calculateMaxEnd(node);

    return this.balance(node);
  }

  // ═══════════════════════════════════════════════════════════════
  // HELPER METHODS
  // ═══════════════════════════════════════════════════════════════

  private calculateMaxEnd(node: IntervalNode): number {
    return Math.max(
      node.interval.end,
      node.left?.maxEnd ?? 0,
      node.right?.maxEnd ?? 0
    );
  }

  private getHeight(node: IntervalNode | null): number {
    return node?.height ?? 0;
  }

  private getBalance(node: IntervalNode): number {
    return this.getHeight(node.left) - this.getHeight(node.right);
  }

  private findMin(node: IntervalNode): IntervalNode {
    while (node.left) node = node.left;
    return node;
  }

  // AVL Rotations
  private rotateRight(y: IntervalNode): IntervalNode {
    const x = y.left!;
    const T2 = x.right;

    x.right = y;
    y.left = T2;

    y.height = 1 + Math.max(this.getHeight(y.left), this.getHeight(y.right));
    x.height = 1 + Math.max(this.getHeight(x.left), this.getHeight(x.right));

    y.maxEnd = this.calculateMaxEnd(y);
    x.maxEnd = this.calculateMaxEnd(x);

    return x;
  }

  private rotateLeft(x: IntervalNode): IntervalNode {
    const y = x.right!;
    const T2 = y.left;

    y.left = x;
    x.right = T2;

    x.height = 1 + Math.max(this.getHeight(x.left), this.getHeight(x.right));
    y.height = 1 + Math.max(this.getHeight(y.left), this.getHeight(y.right));

    x.maxEnd = this.calculateMaxEnd(x);
    y.maxEnd = this.calculateMaxEnd(y);

    return y;
  }

  private balance(node: IntervalNode): IntervalNode {
    const balance = this.getBalance(node);

    // Left heavy
    if (balance > 1) {
      if (this.getBalance(node.left!) < 0) {
        node.left = this.rotateLeft(node.left!);
      }
      return this.rotateRight(node);
    }

    // Right heavy
    if (balance < -1) {
      if (this.getBalance(node.right!) > 0) {
        node.right = this.rotateRight(node.right!);
      }
      return this.rotateLeft(node);
    }

    return node;
  }
}

// Usage
const tree = new IntervalTree();

tree.insert({ id: 'meeting', start: 1718438400000, end: 1718442000000 });
tree.insert({ id: 'lunch', start: 1718445600000, end: 1718449200000 });
tree.insert({ id: 'call', start: 1718440200000, end: 1718443800000 });

// Find events at a specific time
const eventsNow = tree.searchPoint(1718441000000);

// Find events in a date range (today)
const todayStart = 1718409600000;
const todayEnd = 1718495999000;
const todaysEvents = tree.searchRange(todayStart, todayEnd);
```

---

## 2. GraphQL Subscriptions over SSE

### Why This Combination?

| Feature | SSE | GraphQL |
|---------|-----|---------|
| Protocol | HTTP/2 based | Flexible queries |
| Direction | Server → Client | Request exact data |
| Connection | Lightweight, auto-reconnect | Subscriptions spec |
| Battery | Mono-antenna (efficient) | N/A |

### Implementation

```typescript
// ═══════════════════════════════════════════════════════════════
// CLIENT: Subscribe to calendar events
// ═══════════════════════════════════════════════════════════════

class CalendarSubscription {
  private eventSource: EventSource | null = null;

  subscribe(userId: string, year: number, onEvent: (event: any) => void) {
    const query = `
      subscription {
        calendarEvents(userId: "${userId}", year: ${year}) {
          type
          event {
            id
            title
            startTimestamp
            endTimestamp
          }
        }
      }
    `;

    // GraphQL subscription over SSE
    const url = `/graphql/stream?query=${encodeURIComponent(query)}`;
    this.eventSource = new EventSource(url);

    this.eventSource.onmessage = (message) => {
      const data = JSON.parse(message.data);
      onEvent(data);
    };

    this.eventSource.onerror = (error) => {
      console.error('SSE error:', error);
      // Auto-reconnect is built into EventSource
    };
  }

  unsubscribe() {
    this.eventSource?.close();
    this.eventSource = null;
  }
}

// ═══════════════════════════════════════════════════════════════
// SERVER (Node.js/Express): SSE endpoint
// ═══════════════════════════════════════════════════════════════

app.get('/graphql/stream', (req, res) => {
  const { query } = req.query;

  // Set SSE headers
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  // Parse GraphQL query and extract subscription
  const subscriptionName = extractSubscription(query);

  // Subscribe to events
  const unsubscribe = pubsub.subscribe(subscriptionName, (data) => {
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  });

  // Initial data
  const initialEvents = getEventsForYear(req.user.id, year);
  res.write(`data: ${JSON.stringify({ type: 'INITIAL', events: initialEvents })}\n\n`);

  // Cleanup on disconnect
  req.on('close', () => {
    unsubscribe();
  });
});
```

### Usage in React

```typescript
function useCalendarSubscription(year: number) {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const dispatch = useDispatch();

  useEffect(() => {
    const subscription = new CalendarSubscription();

    subscription.subscribe(userId, year, (data) => {
      switch (data.type) {
        case 'INITIAL':
          dispatch({ type: 'EVENTS_LOADED', events: data.events });
          break;
        case 'CREATED':
          dispatch({ type: 'EVENT_CREATED', event: data.event });
          break;
        case 'UPDATED':
          dispatch({ type: 'EVENT_UPDATED', event: data.event });
          break;
        case 'DELETED':
          dispatch({ type: 'EVENT_DELETED', eventId: data.event.id });
          break;
      }
    });

    return () => subscription.unsubscribe();
  }, [year]);

  return events;
}
```

---

## 3. Event-Driven State Management

### Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    EVENT-DRIVEN FLOW                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Component          Event Bus          Handler          Store   │
│     │                  │                  │               │     │
│     │─── dispatch ────▶│                  │               │     │
│     │  { type: ... }   │                  │               │     │
│     │                  │─── emit ────────▶│               │     │
│     │                  │                  │               │     │
│     │                  │                  │─── async ────▶│     │
│     │                  │                  │   operation   │     │
│     │                  │                  │               │     │
│     │                  │                  │◀── update ────│     │
│     │                  │                  │               │     │
│     │◀────────────── notify ──────────────│               │     │
│     │                  │                  │               │     │
│     │─── re-render ───▶                                        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Implementation

```typescript
// ═══════════════════════════════════════════════════════════════
// EVENT BUS
// ═══════════════════════════════════════════════════════════════

type EventHandler<T = any> = (payload: T) => void;

class EventBus {
  private handlers: Map<string, Set<EventHandler>> = new Map();

  on<T>(event: string, handler: EventHandler<T>): () => void {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, new Set());
    }
    this.handlers.get(event)!.add(handler);
    
    // Return unsubscribe function
    return () => this.handlers.get(event)?.delete(handler);
  }

  emit<T>(event: string, payload: T): void {
    this.handlers.get(event)?.forEach(handler => handler(payload));
  }
}

const eventBus = new EventBus();

// ═══════════════════════════════════════════════════════════════
// STORE
// ═══════════════════════════════════════════════════════════════

class CalendarStore {
  private events: Map<string, CalendarEvent> = new Map();
  private intervalTree = new IntervalTree();
  private listeners: Set<() => void> = new Set();

  // Getters
  getEvent(id: string): CalendarEvent | undefined {
    return this.events.get(id);
  }

  getEventsForDate(date: number): CalendarEvent[] {
    const ids = this.intervalTree.searchPoint(date);
    return ids.map(i => this.events.get(i.id)!);
  }

  // Mutations
  addEvent(event: CalendarEvent): void {
    this.events.set(event.id, event);
    this.intervalTree.insert({
      id: event.id,
      start: event.startTimestamp,
      end: event.endTimestamp,
    });
    this.notify();
  }

  updateEvent(id: string, updates: Partial<CalendarEvent>): void {
    const event = this.events.get(id);
    if (event) {
      this.events.set(id, { ...event, ...updates });
      this.notify();
    }
  }

  deleteEvent(id: string): void {
    this.events.delete(id);
    this.intervalTree.delete(id);
    this.notify();
  }

  // Subscription
  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    this.listeners.forEach(listener => listener());
  }
}

// ═══════════════════════════════════════════════════════════════
// EVENT HANDLERS
// ═══════════════════════════════════════════════════════════════

const store = new CalendarStore();
const api = new CalendarAPI();

eventBus.on('CREATE_EVENT', async (event: CalendarEvent) => {
  // Optimistic update
  store.addEvent(event);
  
  try {
    // Sync with server
    const savedEvent = await api.createEvent(event);
    store.updateEvent(event.id, savedEvent);
  } catch (error) {
    // Rollback on error
    store.deleteEvent(event.id);
    eventBus.emit('ERROR', { message: 'Failed to create event' });
  }
});

eventBus.on('UPDATE_EVENT', async ({ id, updates }) => {
  const original = store.getEvent(id);
  
  // Optimistic update
  store.updateEvent(id, updates);
  
  try {
    await api.updateEvent(id, updates);
  } catch (error) {
    // Rollback
    store.updateEvent(id, original!);
    eventBus.emit('ERROR', { message: 'Failed to update event' });
  }
});
```

---

## 4. Pre-Rendering with CSS Transforms

### The Concept

Instead of destroying and creating DOM nodes when switching views,
**pre-render adjacent views** and use CSS transforms to slide them.

### Implementation

```typescript
// ═══════════════════════════════════════════════════════════════
// PRE-RENDERED YEAR CAROUSEL
// ═══════════════════════════════════════════════════════════════

const BUFFER_SIZE = 2; // 2 years each direction

function YearCarousel({ currentYear }: { currentYear: number }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);

  // Pre-render years: [current-2, current-1, current, current+1, current+2]
  const years = useMemo(() => {
    const result = [];
    for (let i = -BUFFER_SIZE; i <= BUFFER_SIZE; i++) {
      result.push(currentYear + i);
    }
    return result;
  }, [currentYear]);

  const goToYear = (year: number) => {
    const index = years.indexOf(year);
    if (index !== -1) {
      setOffset((index - BUFFER_SIZE) * -100);
    }
  };

  return (
    <div className="carousel-container" ref={containerRef}>
      <div
        className="carousel-track"
        style={{
          transform: `translateX(${offset}%)`,
          transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        {years.map((year, index) => (
          <div
            key={year}
            className="carousel-slide"
            style={{
              transform: `translateX(${index * 100}%)`,
            }}
          >
            <YearView year={year} />
          </div>
        ))}
      </div>
    </div>
  );
}
```

```css
.carousel-container {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.carousel-track {
  position: relative;
  width: 100%;
  height: 100%;
  will-change: transform; /* Hint for GPU acceleration */
}

.carousel-slide {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  /* GPU acceleration */
  transform: translateZ(0);
  backface-visibility: hidden;
}
```

### Touch/Swipe Support

```typescript
function useSwipe(
  containerRef: RefObject<HTMLElement>,
  onSwipe: (direction: 'left' | 'right') => void
) {
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX.current = e.touches[0].clientX;
    };

    const handleTouchMove = (e: TouchEvent) => {
      touchEndX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = () => {
      const diff = touchStartX.current - touchEndX.current;
      const threshold = 50; // Minimum swipe distance

      if (Math.abs(diff) > threshold) {
        onSwipe(diff > 0 ? 'left' : 'right');
      }
    };

    container.addEventListener('touchstart', handleTouchStart);
    container.addEventListener('touchmove', handleTouchMove);
    container.addEventListener('touchend', handleTouchEnd);

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [onSwipe]);
}
```

---

## 5. PWA & Offline Support

### Service Worker

```typescript
// sw.js

const CACHE_NAME = 'calendar-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/app.js',
  '/style.css',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
];

// Install: Cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate: Clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// Fetch: Cache-first for static, network-first for API
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (url.pathname.startsWith('/api/')) {
    // API: Network first, fallback to cache
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Clone and cache successful responses
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, clone);
          });
          return response;
        })
        .catch(() => caches.match(request))
    );
  } else {
    // Static: Cache first
    event.respondWith(
      caches.match(request).then((cached) => {
        return cached || fetch(request);
      })
    );
  }
});
```

### IndexedDB for Events

```typescript
class CalendarDB {
  private db: IDBDatabase | null = null;
  private readonly DB_NAME = 'CalendarDB';
  private readonly STORE_NAME = 'events';

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.DB_NAME, 1);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        if (!db.objectStoreNames.contains(this.STORE_NAME)) {
          const store = db.createObjectStore(this.STORE_NAME, { keyPath: 'id' });
          store.createIndex('startTimestamp', 'startTimestamp');
          store.createIndex('endTimestamp', 'endTimestamp');
        }
      };

      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onerror = () => reject(request.error);
    });
  }

  async saveEvent(event: CalendarEvent): Promise<void> {
    const tx = this.db!.transaction(this.STORE_NAME, 'readwrite');
    const store = tx.objectStore(this.STORE_NAME);
    store.put(event);
    return new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  async getEventsByDateRange(start: number, end: number): Promise<CalendarEvent[]> {
    const tx = this.db!.transaction(this.STORE_NAME, 'readonly');
    const store = tx.objectStore(this.STORE_NAME);
    const index = store.index('startTimestamp');
    const range = IDBKeyRange.bound(start, end);

    return new Promise((resolve, reject) => {
      const request = index.getAll(range);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async deleteEvent(id: string): Promise<void> {
    const tx = this.db!.transaction(this.STORE_NAME, 'readwrite');
    tx.objectStore(this.STORE_NAME).delete(id);
    return new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }
}
```

---

## 6. Web Push Notifications

### Setup

```typescript
// ═══════════════════════════════════════════════════════════════
// CLIENT: Request permission and subscribe
// ═══════════════════════════════════════════════════════════════

async function setupPushNotifications() {
  // Check support
  if (!('PushManager' in window)) {
    console.log('Push not supported');
    return;
  }

  // Request permission
  const permission = await Notification.requestPermission();
  if (permission !== 'granted') {
    console.log('Permission denied');
    return;
  }

  // Get service worker registration
  const registration = await navigator.serviceWorker.ready;

  // Subscribe to push
  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
  });

  // Send subscription to server
  await fetch('/api/push/subscribe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(subscription),
  });
}

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  return Uint8Array.from(rawData, (char) => char.charCodeAt(0));
}

// ═══════════════════════════════════════════════════════════════
// SERVICE WORKER: Handle push
// ═══════════════════════════════════════════════════════════════

self.addEventListener('push', (event) => {
  const data = event.data?.json() ?? {};

  const options = {
    body: data.body,
    icon: '/icons/icon-192.png',
    badge: '/icons/badge.png',
    vibrate: [100, 50, 100],
    data: {
      eventId: data.eventId,
      url: `/event/${data.eventId}`,
    },
    actions: [
      { action: 'view', title: 'View Event' },
      { action: 'dismiss', title: 'Dismiss' },
    ],
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'view') {
    event.waitUntil(
      clients.openWindow(event.notification.data.url)
    );
  }
});
```

---

## 7. Recurring Events

### Implementation

```typescript
interface RecurrenceRule {
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  interval: number; // Every N units
  until?: number; // End timestamp
  count?: number; // Max occurrences
  byDay?: number[]; // Days of week (0=Sun)
  byMonthDay?: number[]; // Days of month (1-31)
}

function expandRecurrence(
  event: CalendarEvent,
  rangeStart: number,
  rangeEnd: number
): CalendarEvent[] {
  if (!event.recurrence) {
    // Non-recurring event
    if (event.startTimestamp <= rangeEnd && event.endTimestamp >= rangeStart) {
      return [event];
    }
    return [];
  }

  const { recurrence } = event;
  const instances: CalendarEvent[] = [];
  const duration = event.endTimestamp - event.startTimestamp;

  let current = event.startTimestamp;
  let count = 0;

  while (current <= rangeEnd) {
    // Check termination conditions
    if (recurrence.until && current > recurrence.until) break;
    if (recurrence.count && count >= recurrence.count) break;

    // Check if this instance is in range
    if (current >= rangeStart) {
      instances.push({
        ...event,
        id: `${event.id}_${current}`, // Unique ID for instance
        startTimestamp: current,
        endTimestamp: current + duration,
      });
    }

    // Move to next occurrence
    current = getNextOccurrence(current, recurrence);
    count++;
  }

  return instances;
}

function getNextOccurrence(current: number, rule: RecurrenceRule): number {
  const date = new Date(current);

  switch (rule.frequency) {
    case 'daily':
      date.setDate(date.getDate() + rule.interval);
      break;

    case 'weekly':
      if (rule.byDay && rule.byDay.length > 0) {
        // Find next day in byDay list
        let nextDay = date.getDay();
        let daysToAdd = 1;
        
        do {
          nextDay = (nextDay + 1) % 7;
          daysToAdd++;
        } while (!rule.byDay.includes(nextDay) && daysToAdd <= 7);
        
        if (daysToAdd > 7) {
          // Moved to next week
          date.setDate(date.getDate() + 7 * rule.interval);
        } else {
          date.setDate(date.getDate() + daysToAdd);
        }
      } else {
        date.setDate(date.getDate() + 7 * rule.interval);
      }
      break;

    case 'monthly':
      date.setMonth(date.getMonth() + rule.interval);
      break;

    case 'yearly':
      date.setFullYear(date.getFullYear() + rule.interval);
      break;
  }

  return date.getTime();
}
```

---

## 8. Timezone Handling

### Key Concepts

```typescript
// ═══════════════════════════════════════════════════════════════
// STORE TIMESTAMPS IN UTC, DISPLAY IN USER'S TIMEZONE
// ═══════════════════════════════════════════════════════════════

class TimezoneHelper {
  constructor(private userTimezone: string = 'UTC') {}

  // Convert local datetime to UTC timestamp
  localToUtc(localDate: Date): number {
    // Create date string in user's timezone
    const localString = localDate.toLocaleString('en-US', {
      timeZone: this.userTimezone,
    });
    
    // Parse back and get UTC timestamp
    return new Date(localString).getTime();
  }

  // Convert UTC timestamp to local datetime string
  utcToLocalString(timestamp: number, format: Intl.DateTimeFormatOptions = {}): string {
    return new Date(timestamp).toLocaleString('en-US', {
      timeZone: this.userTimezone,
      ...format,
    });
  }

  // Format for display
  formatEventTime(event: CalendarEvent): string {
    const startDate = new Date(event.startTimestamp);
    const endDate = new Date(event.endTimestamp);

    const options: Intl.DateTimeFormatOptions = {
      timeZone: this.userTimezone,
      hour: 'numeric',
      minute: '2-digit',
    };

    const start = startDate.toLocaleTimeString('en-US', options);
    const end = endDate.toLocaleTimeString('en-US', options);

    return `${start} - ${end}`;
  }

  // Get day boundaries in UTC
  getDayBoundaries(localDate: Date): { start: number; end: number } {
    const dayStart = new Date(localDate);
    dayStart.setHours(0, 0, 0, 0);

    const dayEnd = new Date(localDate);
    dayEnd.setHours(23, 59, 59, 999);

    return {
      start: this.localToUtc(dayStart),
      end: this.localToUtc(dayEnd),
    };
  }
}

// Usage
const tz = new TimezoneHelper('America/New_York');

// Creating an event at 3pm New York time
const event = {
  startTimestamp: tz.localToUtc(new Date('2024-06-15T15:00:00')),
  endTimestamp: tz.localToUtc(new Date('2024-06-15T16:00:00')),
};

// Displaying the event
console.log(tz.formatEventTime(event)); // "3:00 PM - 4:00 PM"
```

---

## Summary

| Concept | Key Takeaway |
|---------|--------------|
| **Interval Tree** | O(log N + K) conflict/overlap queries |
| **GraphQL + SSE** | Flexible queries with real-time updates |
| **Event-Driven** | Decoupled components, optimistic updates |
| **Pre-Rendering** | Smooth view transitions with CSS transforms |
| **PWA** | Offline with Service Worker + IndexedDB |
| **Push** | VAPID keys, service worker notification handler |
| **Recurrence** | Expand on-demand, virtual instances |
| **Timezone** | Store UTC, display local |

---

## References

- [Interval Tree - Wikipedia](https://en.wikipedia.org/wiki/Interval_tree)
- [Web Push API - MDN](https://developer.mozilla.org/en-US/docs/Web/API/Push_API)
- [Service Workers - MDN](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [IndexedDB - MDN](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)
- [Intl.DateTimeFormat - MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat)
