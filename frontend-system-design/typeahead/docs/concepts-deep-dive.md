# Typeahead - Concepts Deep Dive

> A detailed exploration of all the advanced concepts used in building a production-ready Typeahead/Autocomplete component.

---

## Table of Contents

1. [Architecture Types Comparison](#1-architecture-types-comparison)
2. [Trie Data Structure](#2-trie-data-structure)
3. [LRU Cache Pattern](#3-lru-cache-pattern)
4. [Debouncing & Throttling](#4-debouncing--throttling)
5. [AbortController for Race Conditions](#5-abortcontroller-for-race-conditions)
6. [Shadow DOM for Encapsulation](#6-shadow-dom-for-encapsulation)
7. [Virtualized Lists](#7-virtualized-lists)
8. [Web Workers for Heavy Processing](#8-web-workers-for-heavy-processing)
9. [ARIA & Accessibility Patterns](#9-aria--accessibility-patterns)
10. [Caching Strategies](#10-caching-strategies)

---

## 1. Architecture Types Comparison

### The Three Architectures

| Aspect | Stateless | Stateful | Hybrid |
|--------|-----------|----------|--------|
| State location | External (app) | Internal (component) | Both |
| Data source | Server API | Local array | Server + cache |
| Complexity | Low | Medium | High |
| Use case | 90% of cases | Small static data | Legacy slow APIs |
| Network calls | Every query | None | On cache miss |
| Bundle size | Smallest | Larger (Trie) | Largest |

### When to Use Each

```typescript
// ═══════════════════════════════════════════════════════════════
// STATELESS - Server-driven, most common
// ═══════════════════════════════════════════════════════════════

// The APPLICATION controls state
const App = () => {
  const [results, setResults] = useState([]);
  
  const handleQuery = async (query) => {
    const data = await fetch(`/api/search?q=${query}`);
    setResults(data);
  };
  
  return (
    <Typeahead
      results={results}
      onQuery={handleQuery}
    />
  );
};

// Typeahead is just UI
const Typeahead = ({ results, onQuery }) => {
  return (
    <>
      <input onChange={(e) => onQuery(e.target.value)} />
      <ul>{results.map(r => <li>{r.name}</li>)}</ul>
    </>
  );
};


// ═══════════════════════════════════════════════════════════════
// STATEFUL - Local data, self-contained
// ═══════════════════════════════════════════════════════════════

// Typeahead controls its own state
class StatefulTypeahead {
  private trie = new Trie();
  
  constructor(vocabulary: string[]) {
    vocabulary.forEach(word => this.trie.insert(word));
  }
  
  search(query: string): string[] {
    return this.trie.search(query); // No network!
  }
}


// ═══════════════════════════════════════════════════════════════
// HYBRID - Cached server results
// ═══════════════════════════════════════════════════════════════

class HybridTypeahead {
  private cache = new LRUCache(100, 60000); // 100 entries, 1 min TTL
  
  async search(query: string): Promise<any[]> {
    // Try cache first
    const cached = this.cache.get(query);
    if (cached) return cached;
    
    // Cache miss: fetch from server
    const results = await fetch(`/api/search?q=${query}`);
    this.cache.set(query, results);
    return results;
  }
}
```

---

## 2. Trie Data Structure

### Why Trie for Typeahead?

```
Problem: Find all words starting with "ca" from:
["car", "carry", "card", "case", "jane", "james", "java"]

Array approach:
- Check each word: O(n * m) where n=words, m=prefix length
- 7 comparisons for 7 words

Trie approach:
- Navigate to "c" → "a": O(m) = O(2) operations
- Get all descendants: O(k) where k=matching words
- Much faster for large vocabularies!
```

### Visual Representation

```
Vocabulary: ["car", "carry", "card", "case", "jane"]

                    (root)
                   /      \
                  c        j
                  |        |
                  a        a
                 /|\       |
                r s e      n
               /|          |
              r d          e
              |
              y

Query "ca":
1. Go to 'c' ✓
2. Go to 'a' ✓
3. Return all descendants: [car, carry, card, case]

Time: O(prefix_length) to find, O(results) to collect
```

### Complete Implementation

```typescript
interface TrieNode {
  children: Map<string, TrieNode>;
  isEndOfWord: boolean;
  data?: any;
}

class Trie {
  private root: TrieNode = {
    children: new Map(),
    isEndOfWord: false,
  };

  /**
   * Insert a word into the trie
   * Time: O(word.length)
   */
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

  /**
   * Search for all words with given prefix
   * Time: O(prefix.length + results)
   */
  search(prefix: string, maxResults: number = 10): any[] {
    // Navigate to prefix node
    let node = this.root;
    for (const char of prefix.toLowerCase()) {
      if (!node.children.has(char)) {
        return []; // Prefix not in trie
      }
      node = node.children.get(char)!;
    }
    
    // Collect all words from this node
    const results: any[] = [];
    this.dfs(node, results, maxResults);
    return results;
  }

  /**
   * DFS to collect all words under a node
   */
  private dfs(node: TrieNode, results: any[], max: number): void {
    if (results.length >= max) return;
    
    if (node.isEndOfWord && node.data) {
      results.push(node.data);
    }
    
    for (const child of node.children.values()) {
      this.dfs(child, results, max);
    }
  }

  /**
   * Check if exact word exists
   */
  has(word: string): boolean {
    let node = this.root;
    for (const char of word.toLowerCase()) {
      if (!node.children.has(char)) return false;
      node = node.children.get(char)!;
    }
    return node.isEndOfWord;
  }

  /**
   * Delete a word from trie
   */
  delete(word: string): boolean {
    return this.deleteHelper(this.root, word.toLowerCase(), 0);
  }

  private deleteHelper(node: TrieNode, word: string, index: number): boolean {
    if (index === word.length) {
      if (!node.isEndOfWord) return false;
      node.isEndOfWord = false;
      return node.children.size === 0;
    }
    
    const char = word[index];
    const child = node.children.get(char);
    if (!child) return false;
    
    const shouldDelete = this.deleteHelper(child, word, index + 1);
    
    if (shouldDelete) {
      node.children.delete(char);
      return node.children.size === 0 && !node.isEndOfWord;
    }
    
    return false;
  }
}

// Usage
const trie = new Trie();

// Insert with associated data
const products = [
  { id: 1, name: 'Apple iPhone', price: 999 },
  { id: 2, name: 'Apple Watch', price: 399 },
  { id: 3, name: 'Samsung Galaxy', price: 899 },
];

products.forEach(p => trie.insert(p.name, p));

// Search
console.log(trie.search('apple'));
// [{ id: 1, name: 'Apple iPhone'}, { id: 2, name: 'Apple Watch' }]
```

### Complexity Analysis

| Operation | Time | Space |
|-----------|------|-------|
| Insert | O(w) | O(w) |
| Search | O(w + k) | O(k) |
| Delete | O(w) | O(1) |

Where:
- w = word length
- k = number of results

---

## 3. LRU Cache Pattern

### The Problem

Cache has limited size. When full, which entry to remove?

**LRU (Least Recently Used)**: Remove the entry that hasn't been accessed the longest.

### Visual Example

```
Cache size: 3

Operations:
1. get("a")  → miss, fetch, cache: [a]
2. get("b")  → miss, fetch, cache: [a, b]
3. get("c")  → miss, fetch, cache: [a, b, c]
4. get("a")  → hit, move to end:   [b, c, a]
5. get("d")  → miss, evict oldest: [c, a, d] (b evicted)
6. get("b")  → miss, evict oldest: [a, d, b] (c evicted)
```

### Implementation

```typescript
interface CacheEntry<T> {
  value: T;
  timestamp: number;
}

class LRUCache<T> {
  private cache: Map<string, CacheEntry<T>>;
  private maxSize: number;
  private ttl: number;

  constructor(maxSize: number = 100, ttl: number = 60000) {
    this.cache = new Map();
    this.maxSize = maxSize;
    this.ttl = ttl;
  }

  get(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null; // Cache miss
    }
    
    // Check if expired
    if (Date.now() - entry.timestamp > this.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    // Move to end (most recently used)
    this.cache.delete(key);
    this.cache.set(key, entry);
    
    return entry.value;
  }

  set(key: string, value: T): void {
    // If key exists, delete to update position
    if (this.cache.has(key)) {
      this.cache.delete(key);
    }
    
    // Evict oldest if at capacity
    if (this.cache.size >= this.maxSize) {
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }
    
    // Add new entry
    this.cache.set(key, {
      value,
      timestamp: Date.now(),
    });
  }

  has(key: string): boolean {
    return this.get(key) !== null;
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }
}

// Usage in Hybrid Typeahead
class HybridTypeahead {
  private cache = new LRUCache<any[]>(50, 300000); // 50 entries, 5 min TTL
  private abortController: AbortController | null = null;

  async search(query: string): Promise<any[]> {
    // Try cache first
    const cached = this.cache.get(query);
    if (cached) {
      console.log('Cache hit:', query);
      return cached;
    }
    
    console.log('Cache miss, fetching:', query);
    
    // Cancel previous request
    this.abortController?.abort();
    this.abortController = new AbortController();
    
    try {
      const response = await fetch(`/api/search?q=${query}`, {
        signal: this.abortController.signal,
      });
      const results = await response.json();
      
      // Store in cache
      this.cache.set(query, results);
      
      return results;
    } catch (error) {
      if (error.name === 'AbortError') {
        return [];
      }
      throw error;
    }
  }
}
```

---

## 4. Debouncing & Throttling

### The Difference

```
User types: H → E → L → L → O (100ms between each)

WITHOUT debounce:
fetch("H")  fetch("HE")  fetch("HEL")  fetch("HELL")  fetch("HELLO")
     ↑           ↑            ↑             ↑              ↑
   0ms       100ms        200ms         300ms          400ms
= 5 requests!

WITH debounce (300ms):
H → E → L → L → O → [wait 300ms] → fetch("HELLO")
                                        ↑
                                     700ms
= 1 request!
```

### Debounce Implementation

```typescript
/**
 * Debounce: Wait until user stops typing
 */
function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;
  
  return (...args: Parameters<T>) => {
    // Clear previous timer
    clearTimeout(timeoutId);
    
    // Set new timer
    timeoutId = setTimeout(() => {
      fn(...args);
    }, delay);
  };
}

// Usage
const searchAPI = debounce((query: string) => {
  fetch(`/api/search?q=${query}`);
}, 300);

input.addEventListener('input', (e) => {
  searchAPI(e.target.value);
});
```

### Throttle Implementation

```typescript
/**
 * Throttle: Execute at most once per interval
 */
function throttle<T extends (...args: any[]) => any>(
  fn: T,
  interval: number
): (...args: Parameters<T>) => void {
  let lastCallTime = 0;
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  
  return (...args: Parameters<T>) => {
    const now = Date.now();
    const timeSinceLastCall = now - lastCallTime;
    
    if (timeSinceLastCall >= interval) {
      // Execute immediately
      lastCallTime = now;
      fn(...args);
    } else if (!timeoutId) {
      // Schedule for later
      timeoutId = setTimeout(() => {
        lastCallTime = Date.now();
        timeoutId = null;
        fn(...args);
      }, interval - timeSinceLastCall);
    }
  };
}

// Usage: Update suggestions max once per 100ms
const throttledUpdate = throttle((results) => {
  renderResults(results);
}, 100);
```

### When to Use Which

| Scenario | Pattern | Why |
|----------|---------|-----|
| Search input | Debounce | Wait for user to finish typing |
| Scroll handler | Throttle | Limit frequency of updates |
| Window resize | Debounce | Wait for resize to finish |
| Button clicks | Throttle | Prevent double-clicks |
| Autocomplete | Debounce | Reduce API calls |

---

## 5. AbortController for Race Conditions

### The Problem

```
Request 1 (slow)    ──────────────────────────────────────▶ arrives LAST
Request 2 (medium)  ───────────────────────▶ arrives SECOND
Request 3 (fast)    ──────────▶ arrives FIRST

User sees: Request 3 → Request 2 → Request 1 (wrong!)
Should see: Only Request 3 (latest)
```

### The Solution

```typescript
class SearchController {
  private controller: AbortController | null = null;
  
  async search(query: string): Promise<any[]> {
    // Cancel any in-flight request
    if (this.controller) {
      this.controller.abort();
      console.log('Cancelled previous request');
    }
    
    // Create new controller
    this.controller = new AbortController();
    
    try {
      const response = await fetch(`/api/search?q=${query}`, {
        signal: this.controller.signal, // Pass signal to fetch
      });
      
      return await response.json();
      
    } catch (error) {
      if (error.name === 'AbortError') {
        // Request was cancelled - this is expected
        console.log('Request aborted');
        return [];
      }
      // Real error
      throw error;
    }
  }
  
  cancel(): void {
    this.controller?.abort();
    this.controller = null;
  }
}
```

### Combined with Debouncing

```typescript
class TypeaheadSearch {
  private controller: AbortController | null = null;
  private debounceTimer: number | null = null;
  
  search(query: string, onResults: (results: any[]) => void): void {
    // Clear debounce timer
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }
    
    // Debounce: wait 300ms
    this.debounceTimer = window.setTimeout(async () => {
      // Cancel previous request
      this.controller?.abort();
      this.controller = new AbortController();
      
      try {
        const response = await fetch(`/api/search?q=${query}`, {
          signal: this.controller.signal,
        });
        const results = await response.json();
        onResults(results);
        
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Search error:', error);
        }
      }
    }, 300);
  }
  
  cleanup(): void {
    clearTimeout(this.debounceTimer!);
    this.controller?.abort();
  }
}

// Usage
const search = new TypeaheadSearch();

input.addEventListener('input', (e) => {
  search.search(e.target.value, (results) => {
    renderResults(results);
  });
});

// Cleanup on unmount
window.addEventListener('beforeunload', () => {
  search.cleanup();
});
```

---

## 6. Shadow DOM for Encapsulation

### The Problem

External scripts can:
1. Read sensitive input values
2. Modify DOM to inject malicious content
3. Style clashes with page CSS

### The Solution: Shadow DOM

```typescript
class SecureTypeahead extends HTMLElement {
  private shadow: ShadowRoot;
  private input: HTMLInputElement;
  private dropdown: HTMLDivElement;

  constructor() {
    super();
    
    // Create CLOSED shadow (inaccessible from outside)
    this.shadow = this.attachShadow({ mode: 'closed' });
    
    // Encapsulated styles
    const styles = document.createElement('style');
    styles.textContent = `
      :host {
        display: block;
        position: relative;
        font-family: system-ui, sans-serif;
      }
      
      .input {
        width: 100%;
        padding: 12px 16px;
        font-size: 16px;
        border: 2px solid #e0e0e0;
        border-radius: 8px;
        outline: none;
        transition: border-color 0.2s;
      }
      
      .input:focus {
        border-color: #0066cc;
      }
      
      .dropdown {
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        margin-top: 4px;
        background: white;
        border: 1px solid #e0e0e0;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        max-height: 300px;
        overflow-y: auto;
        display: none;
        z-index: 1000;
      }
      
      .dropdown.open {
        display: block;
      }
      
      .item {
        padding: 12px 16px;
        cursor: pointer;
        transition: background 0.1s;
      }
      
      .item:hover,
      .item.selected {
        background: #f0f7ff;
      }
    `;
    
    this.shadow.appendChild(styles);
    
    // Create elements
    this.input = document.createElement('input');
    this.input.className = 'input';
    this.input.type = 'text';
    this.input.placeholder = this.getAttribute('placeholder') || 'Search...';
    
    this.dropdown = document.createElement('div');
    this.dropdown.className = 'dropdown';
    
    this.shadow.appendChild(this.input);
    this.shadow.appendChild(this.dropdown);
    
    this.setupEvents();
  }

  private setupEvents(): void {
    this.input.addEventListener('input', (e) => {
      this.dispatchEvent(new CustomEvent('search', {
        detail: { query: this.input.value },
      }));
    });
    
    this.input.addEventListener('focus', () => {
      if (this.dropdown.children.length > 0) {
        this.dropdown.classList.add('open');
      }
    });
    
    this.input.addEventListener('blur', () => {
      // Delay to allow click on items
      setTimeout(() => {
        this.dropdown.classList.remove('open');
      }, 200);
    });
  }

  // Public API
  setResults(results: Array<{ id: string; label: string }>): void {
    this.dropdown.innerHTML = '';
    
    results.forEach(result => {
      const item = document.createElement('div');
      item.className = 'item';
      item.textContent = result.label;
      item.addEventListener('click', () => {
        this.input.value = result.label;
        this.dropdown.classList.remove('open');
        this.dispatchEvent(new CustomEvent('select', {
          detail: result,
        }));
      });
      this.dropdown.appendChild(item);
    });
    
    if (results.length > 0) {
      this.dropdown.classList.add('open');
    }
  }

  static get observedAttributes(): string[] {
    return ['placeholder', 'disabled'];
  }

  attributeChangedCallback(name: string, oldVal: string, newVal: string): void {
    if (name === 'placeholder') {
      this.input.placeholder = newVal;
    }
    if (name === 'disabled') {
      this.input.disabled = newVal !== null;
    }
  }
}

// Register
customElements.define('secure-typeahead', SecureTypeahead);

// Usage
// <secure-typeahead placeholder="Search products"></secure-typeahead>

document.querySelector('secure-typeahead').addEventListener('search', (e) => {
  const query = e.detail.query;
  // fetch and update results
});
```

### Security Benefits

```javascript
// External malicious script cannot:

// ❌ Access shadow DOM (closed mode)
document.querySelector('secure-typeahead').shadowRoot; // null

// ❌ Read input value directly
document.querySelector('secure-typeahead input'); // null

// ❌ Inject content into component
document.querySelector('secure-typeahead').innerHTML = '<script>...</script>'; // Won't execute

// ✅ Can only use public API
document.querySelector('secure-typeahead').setResults([...]);
```

---

## 7. Virtualized Lists

### The Problem

Rendering 10,000 items = 10,000 DOM nodes = slow!

### The Solution: Virtual Scrolling

Only render visible items + buffer:

```
┌─────────────────────────────────────┐
│         Before viewport             │  ← Not rendered
│         (items 0-49)                │
├─────────────────────────────────────┤
│ ┌─────────────────────────────────┐ │
│ │      Buffer (items 50-55)       │ │  ← Rendered (hidden)
│ └─────────────────────────────────┘ │
│ ┌─────────────────────────────────┐ │
│ │     Visible (items 56-65)       │ │  ← Rendered (visible)
│ └─────────────────────────────────┘ │
│ ┌─────────────────────────────────┐ │
│ │      Buffer (items 66-70)       │ │  ← Rendered (hidden)
│ └─────────────────────────────────┘ │
├─────────────────────────────────────┤
│         After viewport              │  ← Not rendered
│         (items 71-9999)             │
└─────────────────────────────────────┘

Total DOM nodes: 20 instead of 10,000!
```

### Implementation

```typescript
class VirtualList {
  private container: HTMLElement;
  private content: HTMLElement;
  private items: any[] = [];
  private itemHeight = 40;
  private buffer = 5;

  constructor(container: HTMLElement) {
    this.container = container;
    this.container.style.overflow = 'auto';
    this.container.style.position = 'relative';
    
    this.content = document.createElement('div');
    this.content.style.position = 'relative';
    this.container.appendChild(this.content);
    
    this.container.addEventListener('scroll', () => this.render());
  }

  setItems(items: any[]): void {
    this.items = items;
    this.content.style.height = `${items.length * this.itemHeight}px`;
    this.render();
  }

  private render(): void {
    const scrollTop = this.container.scrollTop;
    const viewportHeight = this.container.clientHeight;
    
    // Calculate visible range
    const startIndex = Math.max(0, Math.floor(scrollTop / this.itemHeight) - this.buffer);
    const endIndex = Math.min(
      this.items.length,
      Math.ceil((scrollTop + viewportHeight) / this.itemHeight) + this.buffer
    );
    
    // Clear old items
    this.content.innerHTML = '';
    
    // Render visible items only
    for (let i = startIndex; i < endIndex; i++) {
      const item = this.items[i];
      const element = this.createItemElement(item, i);
      this.content.appendChild(element);
    }
  }

  private createItemElement(item: any, index: number): HTMLElement {
    const element = document.createElement('div');
    element.style.position = 'absolute';
    element.style.top = `${index * this.itemHeight}px`;
    element.style.left = '0';
    element.style.right = '0';
    element.style.height = `${this.itemHeight}px`;
    element.style.display = 'flex';
    element.style.alignItems = 'center';
    element.style.padding = '0 16px';
    element.textContent = item.label;
    return element;
  }
}

// Usage
const container = document.getElementById('typeahead-dropdown');
const virtualList = new VirtualList(container);

// Set 10,000 items - only ~20 DOM nodes created!
virtualList.setItems(Array.from({ length: 10000 }, (_, i) => ({
  id: i,
  label: `Item ${i}`,
})));
```

---

## 8. Web Workers for Heavy Processing

### The Problem

JavaScript is single-threaded. Heavy computation blocks UI:

```javascript
// blocks UI for seconds!
const results = searchLargeDataset(query); // 1 million items
```

### The Solution: Web Workers

```typescript
// main.js
class WorkerSearch {
  private worker: Worker;
  private callbacks: Map<number, (results: any[]) => void> = new Map();
  private requestId = 0;

  constructor() {
    this.worker = new Worker('search-worker.js');
    
    this.worker.onmessage = (event) => {
      const { id, results } = event.data;
      const callback = this.callbacks.get(id);
      if (callback) {
        callback(results);
        this.callbacks.delete(id);
      }
    };
  }

  // Initialize with data
  init(vocabulary: any[]): void {
    this.worker.postMessage({
      type: 'INIT',
      vocabulary,
    });
  }

  // Search
  search(query: string): Promise<any[]> {
    return new Promise((resolve) => {
      const id = ++this.requestId;
      this.callbacks.set(id, resolve);
      
      this.worker.postMessage({
        type: 'SEARCH',
        id,
        query,
      });
    });
  }

  // Cleanup
  terminate(): void {
    this.worker.terminate();
  }
}

// Usage
const search = new WorkerSearch();

// Initialize with large dataset (runs in worker)
search.init(millionItems);

// Search (doesn't block UI)
const results = await search.search('app');


// ═══════════════════════════════════════════════════════════════
// search-worker.js - Runs in separate thread
// ═══════════════════════════════════════════════════════════════

let trie = null;

self.onmessage = (event) => {
  const { type, id, query, vocabulary } = event.data;
  
  switch (type) {
    case 'INIT':
      // Build trie (heavy operation - doesn't block UI!)
      trie = new Trie();
      vocabulary.forEach(item => {
        trie.insert(item.name, item);
      });
      console.log('Trie built with', vocabulary.length, 'items');
      break;
      
    case 'SEARCH':
      if (!trie) {
        self.postMessage({ id, results: [] });
        return;
      }
      
      const results = trie.search(query, 10);
      self.postMessage({ id, results });
      break;
  }
};

// Trie implementation (copy of main thread version)
class Trie {
  // ... same as before
}
```

### When to Use Workers

| Scenario | Use Worker? | Why |
|----------|-------------|-----|
| <1000 items | No | Overhead not worth it |
| 1000-10000 items | Maybe | Test performance |
| >10000 items | Yes | Prevent UI blocking |
| Complex scoring | Yes | Heavy computation |
| Real-time filtering | Yes | Smooth UI required |

---

## 9. ARIA & Accessibility Patterns

### Complete ARIA Implementation

```typescript
class AccessibleTypeahead {
  private input: HTMLInputElement;
  private listbox: HTMLUListElement;
  private items: HTMLLIElement[] = [];
  private selectedIndex = -1;
  private announcerElement: HTMLDivElement;

  constructor(container: HTMLElement) {
    this.render(container);
    this.setupA11y();
    this.setupKeyboard();
  }

  private render(container: HTMLElement): void {
    // Generate unique IDs
    const inputId = `typeahead-input-${Math.random().toString(36).slice(2)}`;
    const listboxId = `typeahead-listbox-${Math.random().toString(36).slice(2)}`;

    container.innerHTML = `
      <div class="typeahead" role="combobox" aria-expanded="false" aria-haspopup="listbox">
        <input
          id="${inputId}"
          type="text"
          role="combobox"
          aria-autocomplete="list"
          aria-expanded="false"
          aria-controls="${listboxId}"
          aria-activedescendant=""
          placeholder="Search..."
        />
        <ul
          id="${listboxId}"
          role="listbox"
          aria-label="Search results"
          hidden
        ></ul>
        <div
          class="sr-only"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        ></div>
      </div>
    `;

    this.input = container.querySelector('input')!;
    this.listbox = container.querySelector('ul')!;
    this.announcerElement = container.querySelector('[role="status"]')!;
  }

  private setupA11y(): void {
    // Announce results count to screen readers
    this.input.addEventListener('input', () => {
      // Results updated elsewhere, announcement happens in setResults
    });
  }

  private setupKeyboard(): void {
    this.input.addEventListener('keydown', (e) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          this.navigate(1);
          break;
          
        case 'ArrowUp':
          e.preventDefault();
          this.navigate(-1);
          break;
          
        case 'Enter':
          e.preventDefault();
          this.selectCurrent();
          break;
          
        case 'Escape':
          this.close();
          break;
          
        case 'Home':
          if (this.isOpen()) {
            e.preventDefault();
            this.navigateTo(0);
          }
          break;
          
        case 'End':
          if (this.isOpen()) {
            e.preventDefault();
            this.navigateTo(this.items.length - 1);
          }
          break;
      }
    });
  }

  setResults(results: Array<{ id: string; label: string }>): void {
    this.items = [];
    this.listbox.innerHTML = '';
    this.selectedIndex = -1;

    results.forEach((result, index) => {
      const li = document.createElement('li');
      li.id = `option-${result.id}`;
      li.role = 'option';
      li.setAttribute('aria-selected', 'false');
      li.textContent = result.label;
      li.addEventListener('click', () => this.selectItem(index));
      
      this.listbox.appendChild(li);
      this.items.push(li);
    });

    // Update ARIA
    if (results.length > 0) {
      this.open();
      this.announce(`${results.length} results available. Use arrow keys to navigate.`);
    } else {
      this.close();
      this.announce('No results found.');
    }
  }

  private navigate(delta: number): void {
    const newIndex = Math.max(0, Math.min(this.items.length - 1, this.selectedIndex + delta));
    this.navigateTo(newIndex);
  }

  private navigateTo(index: number): void {
    // Deselect previous
    if (this.selectedIndex >= 0) {
      this.items[this.selectedIndex].setAttribute('aria-selected', 'false');
      this.items[this.selectedIndex].classList.remove('selected');
    }

    // Select new
    this.selectedIndex = index;
    this.items[index].setAttribute('aria-selected', 'true');
    this.items[index].classList.add('selected');
    this.items[index].scrollIntoView({ block: 'nearest' });

    // Update activedescendant
    this.input.setAttribute('aria-activedescendant', this.items[index].id);
  }

  private selectItem(index: number): void {
    const item = this.items[index];
    this.input.value = item.textContent!;
    this.close();
    this.dispatchEvent('select', { label: item.textContent });
  }

  private selectCurrent(): void {
    if (this.selectedIndex >= 0) {
      this.selectItem(this.selectedIndex);
    }
  }

  private open(): void {
    this.listbox.hidden = false;
    this.input.setAttribute('aria-expanded', 'true');
  }

  private close(): void {
    this.listbox.hidden = true;
    this.input.setAttribute('aria-expanded', 'false');
    this.input.removeAttribute('aria-activedescendant');
    this.selectedIndex = -1;
  }

  private isOpen(): boolean {
    return !this.listbox.hidden;
  }

  private announce(message: string): void {
    this.announcerElement.textContent = message;
  }

  private dispatchEvent(name: string, detail: any): void {
    this.input.dispatchEvent(new CustomEvent(name, { detail, bubbles: true }));
  }
}
```

### Screen Reader Friendly CSS

```css
/* Visually hidden but accessible */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* Focus visible for keyboard users */
.typeahead input:focus-visible {
  outline: 2px solid #0066cc;
  outline-offset: 2px;
}

/* High contrast mode */
@media (prefers-contrast: high) {
  .typeahead [role="option"] {
    border: 1px solid transparent;
  }
  
  .typeahead [role="option"][aria-selected="true"] {
    border-color: currentColor;
    background: Highlight;
    color: HighlightText;
  }
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .typeahead * {
    transition: none !important;
    animation: none !important;
  }
}
```

---

## 10. Caching Strategies

### Multi-Layer Caching

```
┌─────────────────────────────────────────────────────────────────┐
│                    CACHING LAYERS                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Request: search("apple")                                       │
│                                                                 │
│  1. Client Cache (Memory)                                       │
│     ├─ Check: cache.get("apple")                                │
│     └─ If hit: return instantly                                 │
│                    │                                            │
│                    ▼ miss                                       │
│  2. Browser Cache (HTTP)                                        │
│     ├─ Check: If-None-Match / If-Modified-Since                 │
│     └─ If 304: return cached response                           │
│                    │                                            │
│                    ▼ miss                                       │
│  3. CDN Cache                                                   │
│     ├─ Check: edge server cache                                 │
│     └─ If hit: return from nearest edge                         │
│                    │                                            │
│                    ▼ miss                                       │
│  4. Server Cache (Redis/Memcached)                              │
│     ├─ Check: redis.get("search:apple")                         │
│     └─ If hit: return cached results                            │
│                    │                                            │
│                    ▼ miss                                       │
│  5. Database Query                                              │
│     └─ Execute search, cache result, return                     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Implementation

```typescript
// ═══════════════════════════════════════════════════════════════
// 1. CLIENT CACHE (Memory)
// ═══════════════════════════════════════════════════════════════

class ClientCache {
  private cache = new Map<string, { data: any; expires: number }>();
  private ttl: number;

  constructor(ttlMs: number = 60000) {
    this.ttl = ttlMs;
  }

  get(key: string): any | null {
    const entry = this.cache.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expires) {
      this.cache.delete(key);
      return null;
    }
    return entry.data;
  }

  set(key: string, data: any): void {
    this.cache.set(key, {
      data,
      expires: Date.now() + this.ttl,
    });
  }
}


// ═══════════════════════════════════════════════════════════════
// 2. BROWSER CACHE (HTTP Headers)
// ═══════════════════════════════════════════════════════════════

// Server response headers:
// Cache-Control: public, max-age=300
// ETag: "abc123"

// Client request with cache validation:
async function fetchWithCache(url: string): Promise<any> {
  const response = await fetch(url, {
    headers: {
      'If-None-Match': localStorage.getItem(`etag:${url}`) || '',
    },
  });

  if (response.status === 304) {
    // Not modified, use cached
    return JSON.parse(localStorage.getItem(`cache:${url}`)!);
  }

  const etag = response.headers.get('ETag');
  const data = await response.json();

  if (etag) {
    localStorage.setItem(`etag:${url}`, etag);
    localStorage.setItem(`cache:${url}`, JSON.stringify(data));
  }

  return data;
}


// ═══════════════════════════════════════════════════════════════
// 3. COMBINED CACHING STRATEGY
// ═══════════════════════════════════════════════════════════════

class CachedSearch {
  private memoryCache = new ClientCache(30000); // 30 seconds
  
  async search(query: string): Promise<any[]> {
    // 1. Check memory cache
    const memoryCached = this.memoryCache.get(query);
    if (memoryCached) {
      console.log('Memory cache hit');
      return memoryCached;
    }
    
    // 2. Fetch (browser cache may intercept)
    const url = `/api/search?q=${encodeURIComponent(query)}`;
    const results = await fetchWithCache(url);
    
    // 3. Store in memory cache
    this.memoryCache.set(query, results);
    
    return results;
  }
}
```

---

## Summary

| Concept | Key Takeaway |
|---------|--------------|
| **Architectures** | Stateless (90%), Stateful (static), Hybrid (legacy) |
| **Trie** | O(prefix) search, ideal for autocomplete |
| **LRU Cache** | Evict least recently used when full |
| **Debounce** | Wait for user to stop typing |
| **AbortController** | Cancel outdated requests |
| **Shadow DOM** | Encapsulate and protect from external scripts |
| **Virtualization** | Only render visible items |
| **Web Workers** | Heavy processing off main thread |
| **ARIA** | Keyboard nav, screen reader support |
| **Caching** | Multiple layers: memory → browser → CDN → server |

---

## References

- [AbortController MDN](https://developer.mozilla.org/en-US/docs/Web/API/AbortController)
- [Shadow DOM MDN](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_shadow_DOM)
- [Web Workers MDN](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API)
- [ARIA Combobox Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/)
- [Trie Data Structure](https://en.wikipedia.org/wiki/Trie)
