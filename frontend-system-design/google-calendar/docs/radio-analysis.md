# Google Calendar Frontend System Design

> A comprehensive frontend system design for building a production-ready Calendar application with event scheduling, conflict detection, and multi-view support.

---

## Table of Contents

1. [Requirements Exploration](#1-requirements-exploration)
2. [Layout Overview](#2-layout-overview)
3. [Component Architecture](#3-component-architecture)
4. [Data Model](#4-data-model)
5. [Interval Tree for Conflict Detection](#5-interval-tree-for-conflict-detection)
6. [API Design & Data Transfer](#6-api-design--data-transfer)
7. [Data Flow Architecture](#7-data-flow-architecture)
8. [Rendering Optimization](#8-rendering-optimization)
9. [Notification System](#9-notification-system)
10. [Performance Optimization](#10-performance-optimization)
11. [Accessibility](#11-accessibility)

---

## 1. Requirements Exploration

### 1.1 General Requirements

| Requirement | Description |
|-------------|-------------|
| **Multiple Views** | Year, Month, Week, Day views |
| **Multi-user** | Invite users to events, shared calendars |
| **Live Updates** | Real-time event notifications |
| **Event Details** | View and edit event information |
| **Conflict Detection** | Show overlapping events visually |
| **Export/Import** | Support calendar file formats (ICS) |
| **PWA Support** | Offline-first, works without internet |
| **Reminders** | Push notifications for upcoming events |

### 1.2 Functional Requirements

| Requirement | Mobile-First Consideration |
|-------------|----------------------------|
| **Offline Support** | Calendar works without internet |
| **Battery Efficient** | Minimize background processing |
| **Efficient Data Model** | Small payload from server |
| **Native Bridging** | Trigger native alarms/notifications |
| **Smooth Rendering** | Fast view switching, animations |
| **Accessibility** | Screen reader, keyboard navigation |

### 1.3 Action Plan

```
1. Layout Overview        → Understand UI structure
2. Component Architecture → Define component hierarchy
3. Data Model            → Design event storage
4. Interval Tree         → Conflict detection algorithm
5. API Design            → GraphQL + SSE for real-time
6. Data Flow             → Event-driven architecture
7. Rendering             → Pre-rendering optimization
8. Notifications         → Push & deep links
9. Optimization          → PWA, caching, bundling
10. Accessibility        → ARIA, keyboard, color schemes
```

---

## 2. Layout Overview

### 2.1 Three Main Views

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         YEAR VIEW                                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐                        │
│  │ January │  │February │  │  March  │  │  April  │                        │
│  │  1 2 3  │  │  1 2 3  │  │  1 2 3  │  │  1 2 3  │                        │
│  │  4 5 6  │  │  4 5 6  │  │  4 5 6  │  │  4 5 6  │                        │
│  │  ...    │  │  ...    │  │  ...    │  │  ...    │                        │
│  └─────────┘  └─────────┘  └─────────┘  └─────────┘                        │
│                                                                             │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐                        │
│  │   May   │  │  June   │  │  July   │  │ August  │                        │
│  │  ...    │  │  ...    │  │  ...    │  │  ...    │                        │
│  └─────────┘  └─────────┘  └─────────┘  └─────────┘                        │
│                                                                             │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐                        │
│  │September│  │ October │  │November │  │December │                        │
│  │  ...    │  │  ...    │  │  ...    │  │  ...    │                        │
│  └─────────┘  └─────────┘  └─────────┘  └─────────┘                        │
│                                                                             │
│  Click any day → Opens Day View                                             │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         MONTH VIEW                                           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  < June 2024 >                                                              │
│                                                                             │
│  ┌─────┬─────┬─────┬─────┬─────┬─────┬─────┐                               │
│  │ Sun │ Mon │ Tue │ Wed │ Thu │ Fri │ Sat │                               │
│  ├─────┼─────┼─────┼─────┼─────┼─────┼─────┤                               │
│  │     │     │     │     │     │     │  1  │                               │
│  ├─────┼─────┼─────┼─────┼─────┼─────┼─────┤                               │
│  │  2  │  3  │  4  │  5  │  6  │  7  │  8  │                               │
│  │     │ 📅  │     │     │ 🔵  │     │     │  ← Events shown as dots       │
│  ├─────┼─────┼─────┼─────┼─────┼─────┼─────┤                               │
│  │  9  │ 10  │ 11  │ 12  │ 13  │ 14  │ 15  │                               │
│  │ 🔴  │     │ 🔵  │     │     │ 📅  │     │                               │
│  └─────┴─────┴─────┴─────┴─────┴─────┴─────┘                               │
│                                                                             │
│  Click any day → Opens event list for that day                              │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          DAY VIEW                                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Friday, July 1, 2024                                                       │
│                                                                             │
│  ┌──────┬───────────────────────────────────────────────────┐              │
│  │ 8:00 │                                                   │              │
│  ├──────┼───────────────────────────────────────────────────┤              │
│  │ 9:00 │ ┌─────────────────────────────────────────────┐   │              │
│  │      │ │ 📅 Team Meeting                             │   │              │
│  │      │ │ 9:00 - 10:30                                │   │              │
│  │      │ └─────────────────────────────────────────────┘   │              │
│  ├──────┼───────────────────────────────────────────────────┤              │
│  │10:00 │ ┌───────────────┐ ┌───────────────┐               │ ← Conflict!  │
│  │      │ │ 📅 Call       │ │ 📅 Review     │               │              │
│  │      │ └───────────────┘ └───────────────┘               │              │
│  ├──────┼───────────────────────────────────────────────────┤              │
│  │11:00 │                                                   │              │
│  └──────┴───────────────────────────────────────────────────┘              │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Component Architecture

### 3.1 Component Hierarchy

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       COMPONENT HIERARCHY                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│                        ┌───────────────┐                                    │
│                        │   App Root    │                                    │
│                        └───────┬───────┘                                    │
│                                │                                            │
│            ┌───────────────────┼───────────────────┐                        │
│            │                   │                   │                        │
│            ▼                   ▼                   ▼                        │
│  ┌──────────────────┐  ┌─────────────┐  ┌──────────────────┐               │
│  │ Calendar Controls│  │ Client Store│  │  Calendar View   │               │
│  │ • Create Event   │  │   (Global)  │  │                  │               │
│  │ • Search         │  │             │  │                  │               │
│  │ • Settings       │  │             │  │                  │               │
│  └──────────────────┘  └─────────────┘  └────────┬─────────┘               │
│                                                  │                          │
│                    ┌─────────────────────────────┼─────────────────┐        │
│                    │                             │                 │        │
│                    ▼                             ▼                 ▼        │
│           ┌──────────────┐              ┌──────────────┐  ┌──────────────┐  │
│           │   Year View  │              │  Month View  │  │   Day View   │  │
│           └──────┬───────┘              └──────┬───────┘  └──────┬───────┘  │
│                  │                             │                 │          │
│                  ▼                             ▼                 ▼          │
│           ┌──────────────┐              ┌──────────────┐  ┌──────────────┐  │
│           │  Month Cell  │              │   Day Cell   │  │  Event Cell  │  │
│           └──────┬───────┘              └──────┬───────┘  └──────┬───────┘  │
│                  │                             │                 │          │
│                  └─────────────────────────────┴─────────────────┘          │
│                                        │                                    │
│                                        ▼                                    │
│                               ┌──────────────┐                              │
│                               │  Event View  │                              │
│                               │  (Reusable)  │                              │
│                               └──────────────┘                              │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Data Model

### 4.1 Design Principles

| Principle | Description |
|-----------|-------------|
| **Universal Entity** | Same event structure for all views |
| **JSON Serializable** | Easy export/import (ICS compatibility) |
| **Minimal Mutations** | Update only changed fields |
| **O(1) Access** | Find any event by ID instantly |
| **Minimal Server Transform** | Client model ≈ Server model |
| **Conflict Detection** | Support overlapping event queries |

### 4.2 TypeScript Types

```typescript
// ═══════════════════════════════════════════════════════════════
// CALENDAR STORE (Global State)
// ═══════════════════════════════════════════════════════════════

interface CalendarStore {
  /** Events map for O(1) access by ID */
  events: Map<string, CalendarEvent>;
  
  /** Interval Tree for efficient date range queries */
  eventsTree: IntervalTree<string>; // Contains event IDs
  
  /** Client UI state */
  clientState: ClientState;
}

interface ClientState {
  /** Current view: year, month, week, day */
  viewType: 'year' | 'month' | 'week' | 'day';
  
  /** Currently selected date */
  selectedDate: number; // timestamp
  
  /** User preferences */
  language: string;
  timezone: string;
  theme: 'light' | 'dark';
  firstDayOfWeek: 0 | 1; // Sunday or Monday
}

// ═══════════════════════════════════════════════════════════════
// EVENT ENTITY
// ═══════════════════════════════════════════════════════════════

interface CalendarEvent {
  id: string;
  
  /** Event timing */
  startTimestamp: number;
  endTimestamp: number;
  
  /** All-day event flag */
  allDay: boolean;
  
  /** Event details */
  title: string;
  description?: string; // Rich text (HTML)
  location?: string;
  
  /** Participants */
  organizer: UserInfo;
  participants: UserInfo[];
  
  /** Visual */
  color: string;
  
  /** Recurrence (optional) */
  recurrence?: RecurrenceRule;
  
  /** Linked conflicting events (computed) */
  conflictingEventIds?: string[];
  
  /** Reminder settings */
  reminders: Reminder[];
}

interface UserInfo {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  status: 'pending' | 'accepted' | 'declined' | 'maybe';
}

interface Reminder {
  type: 'email' | 'push' | 'popup';
  minutesBefore: number; // e.g., 15, 30, 60, 1440 (1 day)
}

interface RecurrenceRule {
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  interval: number; // Every N days/weeks/etc.
  until?: number; // End timestamp
  count?: number; // Number of occurrences
  byDay?: number[]; // 0=Sun, 1=Mon, etc.
}
```

---

## 5. Interval Tree for Conflict Detection

### 5.1 The Problem

**How to efficiently find all events on a specific date?**

```
Event 1: June 11 ─────────────────────────────────────── July 11
Event 2:              June 25 ────────────────────────── July 11
                               │
                         Today: June 30
                               │
Question: Which events are happening on June 30?
```

**Naive Approach (Array):**
- Scan all N events: O(N)
- For 365 days: O(365 × N)

**Better Approach (Interval Tree):**
- Query by date: O(log N)
- For 365 days: O(365 × log N)

### 5.2 How Interval Tree Works

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    INTERVAL TREE CONSTRUCTION                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Events to insert:                                                          │
│  ┌────────────────────────────────────────────────────────────────┐         │
│  │ A: Jun 10 - Jun 16                                             │         │
│  │ B: Jun 7  - Jun 14                                             │         │
│  │ C: Jun 17 - Jul 2                                              │         │
│  │ D: Jun 1  - Jun 2                                              │         │
│  │ E: Jun 30 - Jul 12                                             │         │
│  │ F: Jun 11 - Jun 3                                              │         │
│  └────────────────────────────────────────────────────────────────┘         │
│                                                                             │
│  Interval Tree (sorted by START date):                                      │
│                                                                             │
│                         ┌─────────────────┐                                 │
│                         │ A: Jun 10-16    │                                 │
│                         │ max: Jul 2      │ ← Max end date in subtree       │
│                         └────────┬────────┘                                 │
│                                  │                                          │
│               ┌──────────────────┴──────────────────┐                       │
│               │                                     │                       │
│       ┌───────▼───────┐                     ┌───────▼───────┐               │
│       │ B: Jun 7-14   │                     │ C: Jun 17-Jul2│               │
│       │ max: Jun 14   │                     │ max: Jul 12   │               │
│       └───────┬───────┘                     └───────┬───────┘               │
│               │                                     │                       │
│       ┌───────▼───────┐               ┌─────────────┴─────────────┐         │
│       │ D: Jun 1-2    │               │                           │         │
│       │ max: Jun 2    │       ┌───────▼───────┐           ┌───────▼───────┐ │
│       └───────────────┘       │ F: Jun 11-13  │           │ E: Jun 30-Jul12│ │
│                               │ max: Jun 13   │           │ max: Jul 12   │ │
│                               └───────────────┘           └───────────────┘ │
│                                                                             │
│  Key insight: "max" field = latest end date in entire subtree               │
│  If target date > max, we can skip the entire subtree!                      │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 5.3 Search Algorithm

```typescript
function searchEventsOnDate(
  node: IntervalTreeNode | null,
  targetDate: number,
  results: string[] = []
): string[] {
  if (!node) return results;
  
  // PRUNE: If target date > max end date, skip this subtree
  if (targetDate > node.maxEndDate) {
    return results;
  }
  
  // CHECK: Does this node's interval contain target date?
  if (targetDate >= node.startDate && targetDate <= node.endDate) {
    results.push(node.eventId);
  }
  
  // RECURSE: Check both children
  searchEventsOnDate(node.left, targetDate, results);
  searchEventsOnDate(node.right, targetDate, results);
  
  return results;
}
```

### 5.4 Search Example

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    SEARCH: Events on June 13                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Step 1: Start at root (A: Jun 10-16, max: Jul 2)                           │
│          13 <= Jul 2 ✓ (continue)                                           │
│          13 >= Jun 10 AND 13 <= Jun 16 ✓ → ADD A                            │
│                                                                             │
│  Step 2: Go left (B: Jun 7-14, max: Jun 14)                                 │
│          13 <= Jun 14 ✓ (continue)                                          │
│          13 >= Jun 7 AND 13 <= Jun 14 ✓ → ADD B                             │
│                                                                             │
│  Step 3: Go left (D: Jun 1-2, max: Jun 2)                                   │
│          13 > Jun 2 ✗ → SKIP entire subtree                                 │
│                                                                             │
│  Step 4: Go right from root (C: Jun 17-Jul2, max: Jul 12)                   │
│          13 <= Jul 12 ✓ (continue)                                          │
│          13 >= Jun 17 ✗ → Not in this interval                              │
│                                                                             │
│  Step 5: Go left (F: Jun 11-13, max: Jun 13)                                │
│          13 <= Jun 13 ✓ (continue)                                          │
│          13 >= Jun 11 AND 13 <= Jun 13 ✓ → ADD F                            │
│                                                                             │
│  Step 6: Go right (E: Jun 30-Jul12)                                         │
│          13 <= Jul 12 ✓ (continue)                                          │
│          13 >= Jun 30 ✗ → Not in this interval                              │
│                                                                             │
│  RESULT: [A, B, F] - 3 events on June 13                                    │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 5.5 Implementation

```typescript
interface IntervalTreeNode {
  eventId: string;
  startDate: number;
  endDate: number;
  maxEndDate: number; // Max end date in this subtree
  left: IntervalTreeNode | null;
  right: IntervalTreeNode | null;
}

class IntervalTree {
  private root: IntervalTreeNode | null = null;

  insert(eventId: string, start: number, end: number): void {
    this.root = this.insertNode(this.root, eventId, start, end);
  }

  private insertNode(
    node: IntervalTreeNode | null,
    eventId: string,
    start: number,
    end: number
  ): IntervalTreeNode {
    if (!node) {
      return {
        eventId,
        startDate: start,
        endDate: end,
        maxEndDate: end,
        left: null,
        right: null,
      };
    }

    // Insert based on start date (like BST)
    if (start < node.startDate) {
      node.left = this.insertNode(node.left, eventId, start, end);
    } else {
      node.right = this.insertNode(node.right, eventId, start, end);
    }

    // Update max end date
    node.maxEndDate = Math.max(
      node.maxEndDate,
      end,
      node.left?.maxEndDate ?? 0,
      node.right?.maxEndDate ?? 0
    );

    return node;
  }

  searchByDate(targetDate: number): string[] {
    const results: string[] = [];
    this.searchNode(this.root, targetDate, results);
    return results;
  }

  private searchNode(
    node: IntervalTreeNode | null,
    targetDate: number,
    results: string[]
  ): void {
    if (!node) return;

    // Prune: skip if target > max end date
    if (targetDate > node.maxEndDate) return;

    // Check if target is in this interval
    if (targetDate >= node.startDate && targetDate <= node.endDate) {
      results.push(node.eventId);
    }

    // Search children
    this.searchNode(node.left, targetDate, results);
    this.searchNode(node.right, targetDate, results);
  }
}

// Usage
const tree = new IntervalTree();
tree.insert('event-1', Date.parse('2024-06-10'), Date.parse('2024-06-16'));
tree.insert('event-2', Date.parse('2024-06-07'), Date.parse('2024-06-14'));
tree.insert('event-3', Date.parse('2024-06-17'), Date.parse('2024-07-02'));

const eventsOnJune13 = tree.searchByDate(Date.parse('2024-06-13'));
// ['event-1', 'event-2']
```

### 5.6 Complexity Analysis

| Operation | Time Complexity | Space |
|-----------|----------------|-------|
| Insert | O(log N) | O(1) |
| Delete | O(log N) | O(1) |
| Search by Date | O(log N + K) | O(K) |
| Render Year (365 days) | O(365 × log N) | O(K) |

Where N = total events, K = matching events

**Much better than O(365 × N) naive approach!**

---

## 6. API Design & Data Transfer

### 6.1 Protocol Selection

| Protocol | Pros | Cons | Calendar? |
|----------|------|------|-----------|
| **Long Polling** | Simple | Latency, traffic overhead | ⚠️ OK |
| **WebSocket** | Fast, bidirectional | Expensive, no HTTP/2 | ❌ Overkill |
| **SSE (Server-Sent Events)** | HTTP/2, low battery, efficient | Unidirectional | ✅ Best |

**Winner: SSE (Server-Sent Events)**
- Uses HTTP/2 (efficient)
- Mono-antenna (saves battery on mobile)
- Easy to load balance
- Perfect for receiving calendar updates

### 6.2 GraphQL over SSE

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                  GraphQL SUBSCRIPTION over SSE                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  HTTP/2 provides: SSE (Server-Sent Events)                                  │
│  GraphQL provides: Subscriptions, Mutations, Queries                        │
│                                                                             │
│  Client                                    Server                           │
│    │                                          │                             │
│    │──── GraphQL Subscription (SSE) ─────────▶│                             │
│    │     subscription { events(year: 2024) }  │                             │
│    │                                          │                             │
│    │◀──── Initial events batch ──────────────│                             │
│    │◀──── Event update (live) ───────────────│                             │
│    │◀──── New event created ─────────────────│                             │
│    │                                          │                             │
│    │                                          │                             │
│    │──── GraphQL Mutation ───────────────────▶│                             │
│    │     mutation { createEvent(...) }        │                             │
│    │◀──── Created event response ────────────│                             │
│    │                                          │                             │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 6.3 API Methods

```graphql
# ═══════════════════════════════════════════════════════════════
# QUERIES
# ═══════════════════════════════════════════════════════════════

type Query {
  # Get detailed event info
  getEventInfo(eventId: ID!): Event
  
  # Search events
  searchEvents(query: String!, limit: Int): [Event!]!
}

# ═══════════════════════════════════════════════════════════════
# MUTATIONS
# ═══════════════════════════════════════════════════════════════

type Mutation {
  createEvent(input: CreateEventInput!): Event!
  updateEvent(eventId: ID!, input: UpdateEventInput!): Event!
  deleteEvent(eventId: ID!): Boolean!
  
  # RSVP to an event
  respondToEvent(eventId: ID!, response: RSVPStatus!): Event!
}

# ═══════════════════════════════════════════════════════════════
# SUBSCRIPTIONS (over SSE)
# ═══════════════════════════════════════════════════════════════

type Subscription {
  # Subscribe to events in a time period
  subscribeEvents(
    userId: ID!
    startTimestamp: Int!  # Period start
    endTimestamp: Int!    # Period end
  ): EventUpdate!
}

type EventUpdate {
  type: EventUpdateType!  # CREATED, UPDATED, DELETED
  event: Event
}

enum EventUpdateType {
  CREATED
  UPDATED
  DELETED
}
```

### 6.4 GraphQL vs REST Comparison

| Aspect | REST | GraphQL |
|--------|------|---------|
| **Endpoints** | Multiple (/events, /events/:id, etc.) | Single (/graphql) |
| **Over-fetching** | Often returns extra fields | Request exact fields |
| **Real-time** | Need separate WebSocket | Built-in Subscriptions |
| **Caching** | HTTP caching (GET) | Client library caching |
| **Type Safety** | Manual | Built-in schema |

---

## 7. Data Flow Architecture

### 7.1 Event-Driven Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      EVENT-DRIVEN DATA FLOW                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────────┐        ┌──────────────┐        ┌──────────────┐           │
│  │   App Root   │───────▶│  Event Bus   │───────▶│Event Handler │           │
│  │  (dispatch)  │        │              │        │   (async)    │           │
│  └──────────────┘        └──────────────┘        └──────┬───────┘           │
│         ▲                                               │                   │
│         │                                               │                   │
│         │                                               ▼                   │
│         │                ┌──────────────┐        ┌──────────────┐           │
│         │◀───────────────│   Render     │◀───────│ Client Store │           │
│         │                │              │        │   (Global)   │           │
│         │                └──────────────┘        └──────────────┘           │
│         │                                               ▲                   │
│         │                                               │                   │
│         ▼                                               │                   │
│  ┌──────────────┐        ┌──────────────┐        ┌──────────────┐           │
│  │Calendar View │        │  Month Cell  │        │  Event View  │           │
│  │   (props)    │───────▶│   (props)    │───────▶│  (dispatch)  │───────────┘
│  └──────────────┘        └──────────────┘        └──────────────┘           │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 7.2 Implementation (Redux-like)

```typescript
// Actions
type CalendarAction =
  | { type: 'INIT'; year: number }
  | { type: 'EVENT_RECEIVED'; event: CalendarEvent }
  | { type: 'EVENT_UPDATED'; event: CalendarEvent }
  | { type: 'EVENT_DELETED'; eventId: string }
  | { type: 'VIEW_CHANGED'; viewType: ViewType }
  | { type: 'DATE_SELECTED'; timestamp: number };

// Reducer
function calendarReducer(
  state: CalendarStore,
  action: CalendarAction
): CalendarStore {
  switch (action.type) {
    case 'EVENT_RECEIVED':
      // Add to events map
      state.events.set(action.event.id, action.event);
      // Add to interval tree
      state.eventsTree.insert(
        action.event.id,
        action.event.startTimestamp,
        action.event.endTimestamp
      );
      return { ...state };
      
    case 'EVENT_UPDATED':
      // Update only the event in the map
      state.events.set(action.event.id, action.event);
      return { ...state };
      
    case 'VIEW_CHANGED':
      return {
        ...state,
        clientState: {
          ...state.clientState,
          viewType: action.viewType,
        },
      };
      
    default:
      return state;
  }
}
```

---

## 8. Rendering Optimization

### 8.1 Pre-Rendering Strategy

**Problem:** Switching years/months should be instant

**Solution:** Pre-render adjacent views and use CSS transforms

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    PRE-RENDERING STRATEGY                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Hidden (off-screen)      Visible (viewport)      Hidden (off-screen)       │
│  ◀────────────────────▶   ◀──────────────────▶   ◀────────────────────▶     │
│                                                                             │
│  ┌─────────────────┐      ┌─────────────────┐     ┌─────────────────┐       │
│  │                 │      │                 │     │                 │       │
│  │      2021       │      │      2022       │     │      2023       │       │
│  │  (pre-rendered) │      │   (current)     │     │  (pre-rendered) │       │
│  │                 │      │                 │     │                 │       │
│  └─────────────────┘      └─────────────────┘     └─────────────────┘       │
│                                                                             │
│  translate(-200%)         translate(0)            translate(100%)           │
│                                                                             │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                             │
│  When user switches to 2023:                                                │
│                                                                             │
│  ┌─────────────────┐      ┌─────────────────┐     ┌─────────────────┐       │
│  │      2022       │      │      2023       │     │      2024       │       │
│  │  (slides out)   │      │  (slides in)    │     │  (pre-render)   │       │
│  └─────────────────┘      └─────────────────┘     └─────────────────┘       │
│                                                                             │
│  transition: transform 0.3s ease-out; ← Smooth animation!                   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 8.2 Implementation

```typescript
const BUFFER_SIZE = 4; // 4 screens each direction

function YearViewContainer({ currentYear }: { currentYear: number }) {
  const years = useMemo(() => {
    const result = [];
    for (let i = -BUFFER_SIZE; i <= BUFFER_SIZE; i++) {
      result.push(currentYear + i);
    }
    return result;
  }, [currentYear]);

  return (
    <div className="year-container">
      {years.map((year, index) => (
        <div
          key={year}
          className="year-view"
          style={{
            transform: `translateX(${(index - BUFFER_SIZE) * 100}%)`,
            transition: 'transform 0.3s ease-out',
          }}
        >
          <YearView year={year} />
        </div>
      ))}
    </div>
  );
}
```

```css
.year-container {
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 100%;
}

.year-view {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  will-change: transform; /* GPU acceleration */
}
```

---

## 9. Notification System

### 9.1 Push Notifications (Web Push)

```typescript
// Register service worker for push
async function registerPush() {
  const registration = await navigator.serviceWorker.register('/sw.js');
  
  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: VAPID_PUBLIC_KEY,
  });
  
  // Send subscription to server
  await fetch('/api/push/subscribe', {
    method: 'POST',
    body: JSON.stringify(subscription),
  });
}

// Service Worker (sw.js)
self.addEventListener('push', (event) => {
  const data = event.data.json();
  
  self.registration.showNotification(data.title, {
    body: data.body,
    icon: '/calendar-icon.png',
    badge: '/badge.png',
    data: { eventId: data.eventId },
  });
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  // Open event details
  event.waitUntil(
    clients.openWindow(`/event/${event.notification.data.eventId}`)
  );
});
```

### 9.2 Deep Links (Native Bridge)

```typescript
// Create native alarm via deep link
function createNativeAlarm(event: CalendarEvent) {
  const alarmTime = event.startTimestamp - 15 * 60 * 1000; // 15 min before
  const date = new Date(alarmTime);
  
  // iOS/Android alarm deep link (if supported)
  const deepLink = `alarm://create?` +
    `hour=${date.getHours()}&` +
    `minute=${date.getMinutes()}&` +
    `message=${encodeURIComponent(event.title)}`;
  
  // Try to open deep link
  window.location.href = deepLink;
}
```

---

## 10. Performance Optimization

### 10.1 Network

| Optimization | Description |
|--------------|-------------|
| **HTTP/2** | Multiplexing, header compression |
| **Bundle Splitting** | Separate vendor, views |
| **Brotli Compression** | 33% better than gzip |
| **Link Preconnect** | Early DNS/TCP for CDN |

### 10.2 Rendering

```css
/* Use CSS animations (GPU accelerated) */
.calendar-cell {
  transform: translateZ(0); /* Force GPU layer */
  will-change: transform;
}

/* Avoid reflows */
.event-badge {
  /* Use transform instead of top/left */
  transform: translate(10px, 10px);
}
```

### 10.3 JavaScript

```typescript
// Efficient store mutations
function updateEvent(eventId: string, updates: Partial<CalendarEvent>) {
  // ✅ Good: Update only what changed
  const event = store.events.get(eventId);
  store.events.set(eventId, { ...event, ...updates });
  
  // ❌ Bad: Rebuild entire tree
  // rebuildIntervalTree();
}
```

### 10.4 PWA Setup

```typescript
// Service Worker for offline
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('calendar-v1').then((cache) => {
      return cache.addAll([
        '/',
        '/app.js',
        '/style.css',
        '/manifest.json',
      ]);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
```

---

## 11. Accessibility

### 11.1 Requirements

| Feature | Implementation |
|---------|----------------|
| **Scalable Units** | Use `rem`, not `px` |
| **Keyboard Shortcuts** | Arrow keys to navigate, Enter to select |
| **ARIA Grid Role** | `role="grid"` for calendar table |
| **Focus Management** | Visible focus indicators |
| **Color Schemes** | Support for color blindness |
| **Screen Reader** | Announce date and event count |

### 11.2 ARIA Implementation

```html
<div role="grid" aria-label="June 2024 Calendar">
  <div role="row">
    <div role="columnheader">Sunday</div>
    <div role="columnheader">Monday</div>
    <!-- ... -->
  </div>
  <div role="row">
    <div 
      role="gridcell"
      tabindex="0"
      aria-label="June 1, 2024, 2 events"
      aria-selected="false"
    >
      1
      <span class="event-count" aria-hidden="true">2</span>
    </div>
    <!-- ... -->
  </div>
</div>
```

### 11.3 Keyboard Navigation

```typescript
function handleKeyDown(event: KeyboardEvent, currentDate: Date) {
  switch (event.key) {
    case 'ArrowRight':
      selectDate(addDays(currentDate, 1));
      break;
    case 'ArrowLeft':
      selectDate(addDays(currentDate, -1));
      break;
    case 'ArrowDown':
      selectDate(addDays(currentDate, 7)); // Next week
      break;
    case 'ArrowUp':
      selectDate(addDays(currentDate, -7)); // Previous week
      break;
    case 'Enter':
    case ' ':
      openDayView(currentDate);
      break;
  }
}
```

---

## Summary

| Section | Key Decision |
|---------|--------------|
| **Views** | Year, Month, Week, Day |
| **Data Structure** | Interval Tree for O(log N) conflict search |
| **Protocol** | GraphQL Subscriptions over SSE |
| **State** | Event-driven (Redux-like) |
| **Rendering** | Pre-render adjacent views + CSS transforms |
| **Offline** | PWA with Service Worker |
| **Notifications** | Web Push + Deep Links |

### Key Takeaways

1. **Interval Tree** - Efficient conflict detection, O(log N) search
2. **GraphQL + SSE** - Flexible queries with real-time updates
3. **Pre-rendering** - Smooth year/month switching
4. **PWA** - Offline-first for mobile users
5. **Accessibility** - ARIA grid, keyboard navigation

---

## References

- [Interval Tree Wikipedia](https://en.wikipedia.org/wiki/Interval_tree)
- [GraphQL Subscriptions over SSE](https://graphql.org/learn/subscriptions/)
- [Web Push API](https://developer.mozilla.org/en-US/docs/Web/API/Push_API)
- [ARIA Grid Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/grid/)
