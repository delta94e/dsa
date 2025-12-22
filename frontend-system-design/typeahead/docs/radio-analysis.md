# Typeahead / Autocomplete Frontend System Design

> A comprehensive frontend system design for building a production-ready Typeahead/Autocomplete component, covering architecture types, data structures, race condition handling, and optimizations.

---

## Table of Contents

1. [Requirements Exploration](#1-requirements-exploration)
2. [Architecture Types](#2-architecture-types)
3. [API Design](#3-api-design)
4. [State Design & Data Structures](#4-state-design--data-structures)
5. [Data Flow](#5-data-flow)
6. [Race Condition Handling](#6-race-condition-handling)
7. [Performance Optimization](#7-performance-optimization)
8. [Security](#8-security)
9. [Accessibility](#9-accessibility)

---

## 1. Requirements Exploration

### 1.1 General Requirements

| Requirement | Description |
|-------------|-------------|
| **Autocomplete results** | Provide results based on user input |
| **Generic data model** | Work with any data type, not restricted |
| **Efficient requests** | Minimize network requests, cache results |
| **Dual data source** | Work with both async (server) and static data |

### 1.2 Advanced Requirements

| Category | Requirement |
|----------|-------------|
| **Configuration** | Cache TTL, cache size, max results, query min length |
| **Customization** | CSS API for styling, custom item templates |
| **Security** | DOM encapsulation, content filtering |
| **Accessibility** | Screen reader support, keyboard navigation |
| **Performance** | Network efficient, minimal bundle size |

### 1.3 Mockup

```
┌────────────────────────────────────────────────┐
│  ┌──────────────────────────────────────────┐  │
│  │ Search...                            🔍  │  │  ← Typeahead Input
│  └──────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────┐  │
│  │ ┌────────────────────────────────────┐   │  │
│  │ │ 🔍 Search Result 1                 │   │  │  ← Search Item
│  │ └────────────────────────────────────┘   │  │
│  │ ┌────────────────────────────────────┐   │  │
│  │ │ 🔍 Search Result 2                 │   │  │  ← Search Item
│  │ └────────────────────────────────────┘   │  │
│  │ ┌────────────────────────────────────┐   │  │
│  │ │ 🔍 Search Result 3                 │   │  │  ← Search Item
│  │ └────────────────────────────────────┘   │  │
│  └──────────────────────────────────────────┘  │  ← Search List
└────────────────────────────────────────────────┘

Components:
├── TypeaheadInput    (contenteditable or <input>)
├── SearchList        (dropdown container)
└── SearchItem        (individual result, customizable template)
```

---

## 2. Architecture Types

### 2.1 Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    THREE ARCHITECTURE TYPES                              │
├───────────────────────┬───────────────────────┬─────────────────────────┤
│      STATELESS        │      STATEFUL         │        HYBRID           │
│      (Most Common)    │      (Static Data)    │      (Complex)          │
├───────────────────────┼───────────────────────┼─────────────────────────┤
│ • No internal state   │ • Holds internal data │ • Combines both         │
│ • Controlled by app   │ • Self-contained      │ • Client-side cache     │
│ • Server API calls    │ • Local search        │ • Server + local search │
│                       │                       │                         │
│ Use when:             │ Use when:             │ Use when:               │
│ • Server-driven data  │ • Small static data   │ • Legacy slow API       │
│ • Design systems      │ • Offline support     │ • Reduce server load    │
│ • General purpose     │ • Contact lists       │ • Complex requirements  │
└───────────────────────┴───────────────────────┴─────────────────────────┘
```

### 2.2 Stateless Architecture

**The most common and recommended approach (90% of cases).**

```
┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│   Application   │─────▶│    Typeahead    │─────▶│   Server API    │
│   (Controller)  │◀─────│   (Pure UI)     │◀─────│                 │
└─────────────────┘      └─────────────────┘      └─────────────────┘
        │                        │
        │    State lives here    │    No state here
        ▼                        ▼
    [results]              [renders props]
```

**Pros:**
- Pure component, no internal state
- Simple to design and maintain
- Easy to integrate in multiple places
- Reusable across systems

**Cons:**
- Requires external controller
- Application handles all logic

**Best for:**
- Server-driven data
- Design system components
- General-purpose autocomplete

### 2.3 Stateful (Static) Architecture

**For small, static datasets that don't change often.**

```
┌─────────────────┐      ┌─────────────────────────────────────┐
│   Application   │─────▶│           Typeahead                 │
│                 │      │   ┌─────────────────────────────┐   │
└─────────────────┘      │   │    Internal State (Trie)    │   │
                         │   │    • Vocabulary             │   │
                         │   │    • Search logic           │   │
                         │   └─────────────────────────────┘   │
                         └─────────────────────────────────────┘
                                         │
                                         ▼
                                  [No server calls]
```

**Pros:**
- Best search speed (local)
- No network requests
- Works offline
- Simple configuration

**Cons:**
- Limited data size
- Not suitable for large datasets
- Can block UI thread

**Best for:**
- Contact lists
- Library catalogs
- Small vocabularies
- Offline-first apps

### 2.4 Hybrid Architecture

**Combines stateless and stateful. Use only when necessary.**

```
┌─────────────────┐      ┌─────────────────────────────────────────────┐
│   Application   │─────▶│                 Typeahead                   │
│                 │◀─────│   ┌───────────────────────────────────┐    │
└─────────────────┘      │   │    LRU Trie Cache                 │    │
        │                │   │    • Cached results               │    │
        │ If cache miss  │   │    • TTL management               │    │
        ▼                │   │    • Size limit                   │    │
┌─────────────────┐      │   └───────────────────────────────────┘    │
│   Server API    │      │                   │                        │
│   (Slow/Legacy) │      │         Cache hit │ Cache miss             │
└─────────────────┘      │                   ▼                        │
        │                │            [Return cached] ──▶ [Fetch]     │
        └────────────────┴────────────────────────────────────────────┘
```

**Pros:**
- Reduces network requests
- Works with slow Legacy APIs
- Best of both worlds

**Cons:**
- Complex to implement
- Cache invalidation challenges
- More code to maintain

**Best for:**
- Legacy systems with slow APIs
- Reducing server load
- Offline + online hybrid

### 2.5 Choosing the Right Architecture

```
Start
  │
  ▼
Is data server-driven?
  │
  ├─ Yes ─▶ Is the API slow/legacy? ─┬─ No ──▶ STATELESS ✅
  │                                  │
  │                                  └─ Yes ─▶ HYBRID
  │
  └─ No ──▶ Is dataset small (<1000 items)?
              │
              ├─ Yes ─▶ STATEFUL (Static) ✅
              │
              └─ No ──▶ STATELESS with pagination ✅
```

---

## 3. API Design

### 3.1 Property Model

```typescript
interface TypeaheadProps<T> {
  // ═══════════════════════════════════════════════════════
  // COMMON PROPERTIES (All architectures)
  // ═══════════════════════════════════════════════════════
  
  /** Maximum number of results to display */
  maxResults?: number;
  
  /** Minimum query length before searching */
  minQueryLength?: number;
  
  /** Custom template for rendering items */
  template?: (item: T) => HTMLElement;
  
  /** Placeholder text */
  placeholder?: string;
  
  /** Debounce delay in milliseconds */
  debounceMs?: number;
  
  // ═══════════════════════════════════════════════════════
  // EVENT HANDLERS
  // ═══════════════════════════════════════════════════════
  
  /** Called when search query changes (stateless) */
  onQuery?: (query: string, pageSize: number) => Promise<T[]> | T[];
  
  /** Called when an item is selected */
  onItemSelect?: (item: T) => void;
  
  /** Called to lazily update an item's DOM */
  onItemUpdate?: (data: T, element: HTMLElement) => HTMLElement;
  
  // ═══════════════════════════════════════════════════════
  // HYBRID-SPECIFIC PROPERTIES
  // ═══════════════════════════════════════════════════════
  
  /** Cache time-to-live in milliseconds */
  cacheTTL?: number;
  
  /** Maximum number of cached entries */
  cacheSize?: number;
  
  /** Page size for pagination */
  pageSize?: number;
}
```

### 3.2 TypeScript Interface

```typescript
// Full TypeScript definition
interface TypeaheadConfig<T = any> {
  // Display
  maxResults: number;
  minQueryLength: number;
  placeholder: string;
  
  // Timing
  debounceMs: number;
  
  // Template
  template: (item: T) => HTMLElement;
  
  // Callbacks
  onQuery: (query: string, pageSize: number) => Promise<T[]> | T[];
  onItemSelect: (item: T) => void;
  onItemUpdate: (data: T, template: HTMLElement) => HTMLElement;
  
  // Caching (Hybrid only)
  cacheTTL?: number;
  cacheSize?: number;
  pageSize?: number;
}

// Example usage
const typeahead = new Typeahead<Product>({
  maxResults: 10,
  minQueryLength: 2,
  debounceMs: 300,
  placeholder: 'Search products...',
  
  template: (product) => {
    const el = document.createElement('div');
    el.className = 'product-item';
    el.innerHTML = `
      <img src="${product.image}" alt="${product.name}" />
      <span>${product.name}</span>
      <span class="price">$${product.price}</span>
    `;
    return el;
  },
  
  onQuery: async (query) => {
    const response = await fetch(`/api/products?q=${query}`);
    return response.json();
  },
  
  onItemSelect: (product) => {
    window.location.href = `/products/${product.id}`;
  },
});
```

---

## 4. State Design & Data Structures

### 4.1 Stateless State

```typescript
// No internal state - everything comes from props
interface StatelessState {
  // Nothing stored internally
  // All state managed by parent application
}
```

### 4.2 Stateful State (Trie)

The **Trie** (prefix tree) is the optimal data structure for typeahead:

```
┌─────────────────────────────────────────────────────────────────────┐
│                         TRIE DATA STRUCTURE                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Vocabulary: ["car", "carry", "card", "case", "jane"]               │
│                                                                     │
│                        (root)                                       │
│                       /      \                                      │
│                      c        j                                     │
│                      |        |                                     │
│                      a        a                                     │
│                     /|\       |                                     │
│                    r s e      n                                     │
│                   /|          |                                     │
│                  r d          e                                     │
│                  |                                                  │
│                  y                                                  │
│                                                                     │
│  Query "ca" → Follow c → a → Return all descendants:                │
│               [car, carry, card, case]                              │
│                                                                     │
│  Time Complexity:  Search: O(w)  Insert: O(w)  where w = word length│
│  Space Complexity: O(n * alphabet_size)                             │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### 4.3 Trie Implementation

```typescript
interface TrieNode {
  children: Map<string, TrieNode>;
  isEndOfWord: boolean;
  data?: any; // Store associated data
}

class Trie {
  private root: TrieNode = {
    children: new Map(),
    isEndOfWord: false,
  };

  // Insert a word into the trie
  insert(word: string, data?: any): void {
    let node = this.root;
    
    for (const char of word.toLowerCase()) {
      if (!node.children.has(char)) {
        node.children.set(char, {
          children: new Map(),
          isEndOfWord: false,
        });
      }
      node = node.children.get(char)!;
    }
    
    node.isEndOfWord = true;
    node.data = data;
  }

  // Search for words with prefix
  search(prefix: string, maxResults: number = 10): any[] {
    let node = this.root;
    
    // Navigate to prefix node
    for (const char of prefix.toLowerCase()) {
      if (!node.children.has(char)) {
        return []; // Prefix not found
      }
      node = node.children.get(char)!;
    }
    
    // Collect all words from this node
    const results: any[] = [];
    this.collectWords(node, results, maxResults);
    return results;
  }

  private collectWords(
    node: TrieNode,
    results: any[],
    maxResults: number
  ): void {
    if (results.length >= maxResults) return;
    
    if (node.isEndOfWord && node.data) {
      results.push(node.data);
    }
    
    for (const child of node.children.values()) {
      this.collectWords(child, results, maxResults);
    }
  }
}

// Usage
const trie = new Trie();
trie.insert('apple', { id: 1, name: 'Apple', price: 1.5 });
trie.insert('application', { id: 2, name: 'Application', price: 99 });
trie.insert('banana', { id: 3, name: 'Banana', price: 0.5 });

const results = trie.search('app'); // Returns Apple, Application
```

### 4.4 Hybrid State (LRU Trie)

For hybrid architecture, use an **LRU (Least Recently Used) Trie**:

```typescript
class LRUTrie<T> {
  private trie: Trie;
  private cache: Map<string, { data: T[]; timestamp: number }>;
  private maxSize: number;
  private ttl: number;

  constructor(maxSize: number, ttl: number) {
    this.trie = new Trie();
    this.cache = new Map();
    this.maxSize = maxSize;
    this.ttl = ttl;
  }

  // Get from cache or return null
  get(query: string): T[] | null {
    const entry = this.cache.get(query);
    
    if (!entry) return null;
    
    // Check TTL
    if (Date.now() - entry.timestamp > this.ttl) {
      this.cache.delete(query);
      return null;
    }
    
    // Move to end (most recently used)
    this.cache.delete(query);
    this.cache.set(query, entry);
    
    return entry.data;
  }

  // Set in cache
  set(query: string, data: T[]): void {
    // Remove oldest if at capacity
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    
    this.cache.set(query, {
      data,
      timestamp: Date.now(),
    });
    
    // Also add to trie for prefix search
    for (const item of data) {
      this.trie.insert(query, item);
    }
  }

  // Search: try cache first, then trie
  search(query: string): T[] | null {
    // Try exact cache match
    const cached = this.get(query);
    if (cached) return cached;
    
    // Try trie prefix search
    const trieResults = this.trie.search(query);
    if (trieResults.length > 0) return trieResults;
    
    return null; // Cache miss, need to fetch
  }
}
```

---

## 5. Data Flow

### 5.1 Stateless Data Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    STATELESS DATA FLOW                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  User Types                                                     │
│      │                                                          │
│      ▼                                                          │
│  ┌─────────────┐                                                │
│  │  Typeahead  │ ─── onQuery(query) ──▶ Application             │
│  │   (UI)      │                             │                  │
│  └─────────────┘                             ▼                  │
│      ▲                                 ┌───────────┐            │
│      │                                 │ Server API│            │
│      │                                 └─────┬─────┘            │
│      │                                       │                  │
│      └───────────── results[] ◀──────────────┘                  │
│                                                                 │
│  Key: Component has NO state, just renders props                │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 5.2 Stateful Data Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    STATEFUL DATA FLOW                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Initial Load                                                   │
│      │                                                          │
│      ▼                                                          │
│  Application ─── vocabulary[] ──▶ Typeahead                     │
│                                       │                         │
│                                       ▼                         │
│                               ┌───────────────┐                 │
│                               │   Trie        │ (Build once)    │
│                               │   (Internal)  │                 │
│                               └───────────────┘                 │
│                                       │                         │
│  User Types                           │                         │
│      │                                │                         │
│      ▼                                ▼                         │
│  Typeahead ─── search(query) ──▶ Trie.search()                  │
│      │                                │                         │
│      └──────── results[] ◀────────────┘                         │
│                                                                 │
│  Key: No server calls, all local                                │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 5.3 Hybrid Data Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                     HYBRID DATA FLOW                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  User Types                                                     │
│      │                                                          │
│      ▼                                                          │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                    Typeahead                            │    │
│  │  ┌─────────────────┐                                    │    │
│  │  │   LRU Trie      │ ◀─── Check cache                   │    │
│  │  │   Cache         │                                    │    │
│  │  └────────┬────────┘                                    │    │
│  │           │                                             │    │
│  │     ┌─────┴─────┐                                       │    │
│  │     │           │                                       │    │
│  │  Hit ▼       Miss ▼                                     │    │
│  │  Return      │                                          │    │
│  │  cached      │                                          │    │
│  └──────────────┼──────────────────────────────────────────┘    │
│                 │                                               │
│                 ▼                                               │
│           Application ───▶ Server API                           │
│                 │                 │                             │
│                 │◀────────────────┘                             │
│                 ▼                                               │
│           Update cache + Render                                 │
│                                                                 │
│  Key: Cache first, server on miss                               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 6. Race Condition Handling

### 6.1 The Problem

```
┌─────────────────────────────────────────────────────────────────┐
│                    RACE CONDITION PROBLEM                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  User types: "car" → "carry" → "cat"                            │
│                                                                 │
│  Timeline:                                                      │
│  ─────────────────────────────────────────────────────────────  │
│  t=0ms   Request 1: "car"   ─────────────────────────▶ slow     │
│  t=100ms Request 2: "carry" ──────────────▶ medium              │
│  t=200ms Request 3: "cat"   ───────▶ fast                       │
│                                                                 │
│  Responses arrive OUT OF ORDER:                                 │
│  ─────────────────────────────────────────────────────────────  │
│  t=300ms Response 3: "cat" results    ← User sees this FIRST    │
│  t=500ms Response 2: "carry" results  ← User sees this SECOND   │
│  t=800ms Response 1: "car" results    ← User sees this LAST ❌   │
│                                                                 │
│  Problem: User typed "cat" but sees "car" results!              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 6.2 Solution: AbortController

```typescript
class TypeaheadController {
  private abortController: AbortController | null = null;

  async search(query: string): Promise<any[]> {
    // Cancel any pending request
    if (this.abortController) {
      this.abortController.abort();
    }

    // Create new controller for this request
    this.abortController = new AbortController();
    const signal = this.abortController.signal;

    try {
      const response = await fetch(`/api/search?q=${query}`, { signal });
      
      if (!response.ok) {
        throw new Error('Search failed');
      }
      
      return response.json();
    } catch (error) {
      if (error.name === 'AbortError') {
        // Request was cancelled, this is expected
        console.log('Previous request cancelled');
        return [];
      }
      throw error;
    }
  }
}
```

### 6.3 Combined with Debouncing

```typescript
class DebouncedTypeahead {
  private abortController: AbortController | null = null;
  private debounceTimer: number | null = null;
  private debounceMs: number;

  constructor(debounceMs: number = 300) {
    this.debounceMs = debounceMs;
  }

  search(query: string, onResults: (results: any[]) => void): void {
    // Clear previous debounce timer
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }

    // Debounce: wait before making request
    this.debounceTimer = setTimeout(async () => {
      // Cancel any pending request
      if (this.abortController) {
        this.abortController.abort();
      }

      this.abortController = new AbortController();

      try {
        const response = await fetch(`/api/search?q=${query}`, {
          signal: this.abortController.signal,
        });
        const results = await response.json();
        onResults(results);
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Search error:', error);
        }
      }
    }, this.debounceMs);
  }
}
```

### 6.4 Flow with AbortController

```
┌─────────────────────────────────────────────────────────────────┐
│               WITH ABORT CONTROLLER                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  User types: "car" → "carry" → "cat"                            │
│                                                                 │
│  Timeline:                                                      │
│  ─────────────────────────────────────────────────────────────  │
│  t=0ms   Request 1: "car"   ─── X ABORTED                       │
│  t=100ms Request 2: "carry" ─── X ABORTED                       │
│  t=200ms Request 3: "cat"   ───────▶ completes                  │
│                                                                 │
│  Only Response 3 arrives:                                       │
│  ─────────────────────────────────────────────────────────────  │
│  t=300ms Response 3: "cat" results ✅                            │
│                                                                 │
│  Result: User sees correct "cat" results!                       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 7. Performance Optimization

### 7.1 Network Optimization

```typescript
// ═══════════════════════════════════════════════════════════════
// 1. DEBOUNCING - Don't send request on every keystroke
// ═══════════════════════════════════════════════════════════════

function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: number;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

const debouncedSearch = debounce((query: string) => {
  fetch(`/api/search?q=${query}`);
}, 300);


// ═══════════════════════════════════════════════════════════════
// 2. CACHING - Multiple layers
// ═══════════════════════════════════════════════════════════════

// Client cache (in-memory)
const clientCache = new Map<string, { data: any[]; expires: number }>();

async function searchWithCache(query: string): Promise<any[]> {
  const cached = clientCache.get(query);
  if (cached && cached.expires > Date.now()) {
    return cached.data;
  }
  
  const results = await fetch(`/api/search?q=${query}`).then(r => r.json());
  
  clientCache.set(query, {
    data: results,
    expires: Date.now() + 60000, // 1 minute TTL
  });
  
  return results;
}

// Browser cache (HTTP headers)
// Set on server:
// Cache-Control: public, max-age=300
// ETag: "abc123"


// ═══════════════════════════════════════════════════════════════
// 3. MINIMAL DEPENDENCIES - Keep bundle small
// ═══════════════════════════════════════════════════════════════

// ❌ Bad: Import entire library for one function
import _ from 'lodash'; // 70KB
_.debounce(fn, 300);

// ✅ Good: Import only what you need
import debounce from 'lodash/debounce'; // 2KB
debounce(fn, 300);

// ✅ Better: Write your own (few lines)
function debounce(fn, delay) { /* ... */ }
```

### 7.2 Rendering Optimization

```typescript
// ═══════════════════════════════════════════════════════════════
// 1. LAZY DOM UPDATES - Update only what changed
// ═══════════════════════════════════════════════════════════════

function updateItem(newData: Item, existingElement: HTMLElement): void {
  // Only update changed parts
  const nameEl = existingElement.querySelector('.name');
  if (nameEl && nameEl.textContent !== newData.name) {
    nameEl.textContent = newData.name;
  }
  
  const priceEl = existingElement.querySelector('.price');
  if (priceEl && priceEl.textContent !== `$${newData.price}`) {
    priceEl.textContent = `$${newData.price}`;
  }
}


// ═══════════════════════════════════════════════════════════════
// 2. VIRTUALIZATION - For large lists
// ═══════════════════════════════════════════════════════════════

class VirtualizedList {
  private itemHeight = 40;
  private visibleCount = 10;
  private items: any[] = [];

  render(scrollTop: number): HTMLElement[] {
    const startIndex = Math.floor(scrollTop / this.itemHeight);
    const endIndex = startIndex + this.visibleCount;
    
    // Only render visible items
    return this.items
      .slice(startIndex, endIndex)
      .map((item, i) => this.renderItem(item, startIndex + i));
  }
}


// ═══════════════════════════════════════════════════════════════
// 3. CSS PERFORMANCE
// ═══════════════════════════════════════════════════════════════

/* Use flat class names */
.typeahead-item { } /* ✅ Good: O(1) lookup */
.container .list .item:nth-child(odd) { } /* ❌ Bad: Complex selector */

/* Use CSS animations (GPU accelerated) */
.typeahead-item {
  transition: transform 0.2s, opacity 0.2s; /* ✅ GPU */
}

/* Avoid layout thrashing */
.typeahead-item {
  transform: translateY(0); /* ✅ Uses compositor */
  /* Not: top: 0; left: 0; (triggers reflow) */
}
```

### 7.3 JavaScript Optimization

```typescript
// ═══════════════════════════════════════════════════════════════
// 1. USE SERVER FOR HEAVY PROCESSING
// ═══════════════════════════════════════════════════════════════

// ❌ Bad: Filter large dataset on client
const results = allItems.filter(item =>
  item.name.toLowerCase().includes(query.toLowerCase())
); // Blocks UI!

// ✅ Good: Let server handle it
const results = await fetch(`/api/search?q=${query}`);


// ═══════════════════════════════════════════════════════════════
// 2. WEB WORKERS FOR CLIENT-SIDE PROCESSING
// ═══════════════════════════════════════════════════════════════

// main.js
const worker = new Worker('search-worker.js');

worker.postMessage({ type: 'SEARCH', query: 'app' });

worker.onmessage = (event) => {
  const results = event.data;
  renderResults(results);
};

// search-worker.js
let trie;

self.onmessage = (event) => {
  if (event.data.type === 'INIT') {
    trie = buildTrie(event.data.vocabulary);
  }
  
  if (event.data.type === 'SEARCH') {
    const results = trie.search(event.data.query);
    self.postMessage(results);
  }
};


// ═══════════════════════════════════════════════════════════════
// 3. AVOID SYNC BLOCKING
// ═══════════════════════════════════════════════════════════════

// ❌ Bad: Sync operation blocks UI
const results = searchSync(query); // UI frozen!

// ✅ Good: Async with loading state
setLoading(true);
const results = await searchAsync(query);
setLoading(false);
```

---

## 8. Security

### 8.1 DOM Encapsulation with Shadow DOM

```typescript
// ═══════════════════════════════════════════════════════════════
// SHADOW DOM - Prevent external manipulation
// ═══════════════════════════════════════════════════════════════

class SecureTypeahead extends HTMLElement {
  private shadow: ShadowRoot;

  constructor() {
    super();
    
    // Create shadow DOM (closed = not accessible from outside)
    this.shadow = this.attachShadow({ mode: 'closed' });
    
    // Styles only apply inside shadow DOM
    this.shadow.innerHTML = `
      <style>
        :host {
          display: block;
          position: relative;
        }
        .input {
          width: 100%;
          padding: 8px 12px;
          border: 1px solid #ccc;
          border-radius: 4px;
        }
        .dropdown {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: white;
          border: 1px solid #ccc;
          border-radius: 4px;
          display: none;
        }
        .dropdown.open {
          display: block;
        }
      </style>
      <input class="input" type="text" />
      <div class="dropdown"></div>
    `;
  }
}

// Register custom element
customElements.define('secure-typeahead', SecureTypeahead);

// Usage:
// <secure-typeahead></secure-typeahead>

// External scripts CANNOT access shadow DOM:
// document.querySelector('secure-typeahead').shadowRoot // null (closed mode)
```

### 8.2 Content Filtering

```typescript
// ═══════════════════════════════════════════════════════════════
// CONTENT FILTERING - Sanitize untrusted data
// ═══════════════════════════════════════════════════════════════

interface FilterConfig {
  allowScripts?: boolean;
  allowHTML?: boolean;
  blockedWords?: string[];
}

function sanitize(content: string, config: FilterConfig = {}): string {
  let result = content;
  
  // Remove script tags
  if (!config.allowScripts) {
    result = result.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  }
  
  // Remove all HTML
  if (!config.allowHTML) {
    result = result.replace(/<[^>]+>/g, '');
  }
  
  // Filter blocked words
  if (config.blockedWords) {
    for (const word of config.blockedWords) {
      result = result.replace(new RegExp(word, 'gi'), '***');
    }
  }
  
  // Escape HTML entities
  result = result
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
  
  return result;
}

// Usage in typeahead
class TypeaheadWithFilter {
  private filterFn: (item: any) => any;

  setFilter(filterFn: (item: any) => any) {
    this.filterFn = filterFn;
  }

  render(items: any[]) {
    const filtered = this.filterFn 
      ? items.map(this.filterFn)
      : items;
    // Render filtered items
  }
}
```

---

## 9. Accessibility

### 9.1 Keyboard Navigation

```typescript
class AccessibleTypeahead {
  private input: HTMLInputElement;
  private dropdown: HTMLElement;
  private items: HTMLElement[] = [];
  private selectedIndex = -1;

  setupKeyboardNavigation() {
    this.input.addEventListener('keydown', (e) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          this.selectNext();
          break;
          
        case 'ArrowUp':
          e.preventDefault();
          this.selectPrevious();
          break;
          
        case 'Enter':
          e.preventDefault();
          this.confirmSelection();
          break;
          
        case 'Escape':
          this.closeDropdown();
          break;
          
        case 'Tab':
          this.closeDropdown();
          // Let tab continue naturally
          break;
      }
    });
  }

  private selectNext() {
    const newIndex = Math.min(this.selectedIndex + 1, this.items.length - 1);
    this.setSelectedIndex(newIndex);
  }

  private selectPrevious() {
    const newIndex = Math.max(this.selectedIndex - 1, 0);
    this.setSelectedIndex(newIndex);
  }

  private setSelectedIndex(index: number) {
    // Remove selection from previous
    if (this.selectedIndex >= 0) {
      this.items[this.selectedIndex].classList.remove('selected');
      this.items[this.selectedIndex].setAttribute('aria-selected', 'false');
    }
    
    // Add selection to new
    this.selectedIndex = index;
    this.items[index].classList.add('selected');
    this.items[index].setAttribute('aria-selected', 'true');
    
    // Scroll into view
    this.items[index].scrollIntoView({ block: 'nearest' });
    
    // Update ARIA
    this.input.setAttribute('aria-activedescendant', this.items[index].id);
  }
}
```

### 9.2 ARIA Attributes

```html
<!-- Accessible Typeahead HTML Structure -->
<div class="typeahead">
  
  <!-- Input with ARIA -->
  <input
    type="text"
    role="combobox"
    aria-autocomplete="list"
    aria-expanded="true"
    aria-controls="typeahead-listbox"
    aria-activedescendant="item-2"
    aria-label="Search products"
  />
  
  <!-- Dropdown with ARIA -->
  <ul
    id="typeahead-listbox"
    role="listbox"
    aria-label="Search results"
  >
    <li
      id="item-1"
      role="option"
      aria-selected="false"
    >
      Result 1
    </li>
    <li
      id="item-2"
      role="option"
      aria-selected="true"
    >
      Result 2 (selected)
    </li>
    <li
      id="item-3"
      role="option"
      aria-selected="false"
    >
      Result 3
    </li>
  </ul>
  
  <!-- Screen reader announcement -->
  <div
    aria-live="polite"
    aria-atomic="true"
    class="sr-only"
  >
    3 results available
  </div>
  
</div>
```

### 9.3 Focus Management

```typescript
class FocusManager {
  private typeahead: HTMLElement;
  private input: HTMLInputElement;
  private dropdown: HTMLElement;

  // Trap focus inside dropdown when open
  trapFocus() {
    const focusableItems = this.dropdown.querySelectorAll('[tabindex="0"]');
    const firstItem = focusableItems[0] as HTMLElement;
    const lastItem = focusableItems[focusableItems.length - 1] as HTMLElement;

    this.dropdown.addEventListener('keydown', (e) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey && document.activeElement === firstItem) {
        // Shift+Tab on first item: go to input
        e.preventDefault();
        this.input.focus();
      } else if (!e.shiftKey && document.activeElement === lastItem) {
        // Tab on last item: go to input
        e.preventDefault();
        this.input.focus();
      }
    });
  }

  // Restore focus when dropdown closes
  closeDropdown() {
    this.dropdown.classList.remove('open');
    this.input.focus();
    this.input.setAttribute('aria-expanded', 'false');
  }
}
```

### 9.4 Scalable Units

```css
/* Use rem for scalable sizing */
.typeahead {
  font-size: 1rem; /* Scales with browser zoom */
}

.typeahead-input {
  padding: 0.5rem 0.75rem;
  font-size: 1rem;
  border-radius: 0.25rem;
}

.typeahead-item {
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  line-height: 1.5;
}

/* High contrast mode */
@media (prefers-contrast: high) {
  .typeahead-item {
    border: 2px solid currentColor;
  }
  
  .typeahead-item.selected {
    background: Highlight;
    color: HighlightText;
  }
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .typeahead-dropdown {
    transition: none;
  }
}
```

---

## Summary

| Section | Key Points |
|---------|------------|
| **Architectures** | Stateless (90%), Stateful (static data), Hybrid (legacy APIs) |
| **Data Structure** | Trie for O(w) search, LRU Trie for hybrid caching |
| **Race Condition** | AbortController to cancel outdated requests |
| **Network** | Debouncing, caching (client/browser/server), minimal bundle |
| **Rendering** | Lazy DOM updates, virtualization, CSS animations |
| **Security** | Shadow DOM encapsulation, content filtering |
| **Accessibility** | Keyboard nav, ARIA roles, focus management, rem units |

### Decision Flow

```
┌─────────────────────────────────────────────────────────────┐
│                   TYPEAHEAD DECISION TREE                    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. What's your data source?                                │
│     ├─ Server API → STATELESS                               │
│     ├─ Static array (<1000 items) → STATEFUL                │
│     └─ Slow legacy API → HYBRID                             │
│                                                             │
│  2. How to handle race conditions?                          │
│     └─ AbortController + Debouncing                         │
│                                                             │
│  3. Need offline support?                                   │
│     ├─ Yes → STATEFUL or HYBRID                             │
│     └─ No → STATELESS                                       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## References

- [AbortController MDN](https://developer.mozilla.org/en-US/docs/Web/API/AbortController)
- [Shadow DOM MDN](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_shadow_DOM)
- [ARIA Combobox Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/)
- [Trie Data Structure](https://en.wikipedia.org/wiki/Trie)
