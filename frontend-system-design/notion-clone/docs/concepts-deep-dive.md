# Notion Clone - Concepts Deep Dive

> A detailed exploration of all the advanced concepts used in building a Notion-like editor application.

---

## Table of Contents

1. [Lexer & Parser Design Pattern](#1-lexer--parser-design-pattern)
2. [contenteditable and MutationObserver](#2-contenteditable-and-mutationobserver)
3. [Component Type System](#3-component-type-system)
4. [Plugin Architecture for Views](#4-plugin-architecture-for-views)
5. [Normalized State Management](#5-normalized-state-management)
6. [Event-Based Architecture (Flux/Redux)](#6-event-based-architecture-fluxredux)
7. [GraphQL for Flexible Data Fetching](#7-graphql-for-flexible-data-fetching)
8. [Delta Synchronization](#8-delta-synchronization)
9. [Offline-First with Service Workers](#9-offline-first-with-service-workers)
10. [Rendering Optimization Patterns](#10-rendering-optimization-patterns)

---

## 1. Lexer & Parser Design Pattern

### The Problem

How do you convert this:

```markdown
# Hello World
[ ] Todo item
[x] Done item
>>> Accordion Title
> Callout text
```

Into interactive UI components?

### Solution: Three-Stage Pipeline

```
┌───────────────────────────────────────────────────────────────────┐
│                   LEXER → PARSER → RENDERER                        │
├───────────────────────────────────────────────────────────────────┤
│                                                                   │
│  INPUT: "# Hello World"                                           │
│                                                                   │
│           ╔═══════════════╗                                       │
│           ║    LEXER      ║                                       │
│           ║  (Tokenize)   ║                                       │
│           ╚═══════╤═══════╝                                       │
│                   │                                               │
│                   ▼                                               │
│           { type: 'H1', attributes: { text: 'Hello World' } }     │
│                   │                                               │
│           ╔═══════╧═══════╗                                       │
│           ║    PARSER     ║                                       │
│           ║ (Connect Data)║                                       │
│           ╚═══════╤═══════╝                                       │
│                   │                                               │
│                   ▼                                               │
│           Token + Props from Global State                         │
│                   │                                               │
│           ╔═══════╧═══════╗                                       │
│           ║   RENDERER    ║                                       │
│           ║  (Generate)   ║                                       │
│           ╚═══════╤═══════╝                                       │
│                   │                                               │
│                   ▼                                               │
│  OUTPUT: <h1 class="notion-h1">Hello World</h1>                   │
│                                                                   │
└───────────────────────────────────────────────────────────────────┘
```

### Stage 1: Lexer (Tokenization)

The lexer converts raw text into structured tokens:

```typescript
interface Rule {
  // Check if this rule matches the line
  isValid(line: string): boolean;
  
  // Extract token from matching line
  getToken(line: string): ComponentToken;
}

class Lexer {
  constructor(private rules: Rule[]) {}

  process(content: string): ComponentToken[] {
    const lines = content.split('\n');
    const tokens: ComponentToken[] = [];

    for (const line of lines) {
      // Find matching rule
      for (const rule of this.rules) {
        if (rule.isValid(line)) {
          tokens.push(rule.getToken(line));
          break;
        }
      }
    }

    return tokens;
  }
}

// Example rules
const h1Rule: Rule = {
  isValid: (line) => /^#\s+/.test(line),
  getToken: (line) => ({
    type: 'H1',
    attributes: { text: line.replace(/^#\s+/, '') }
  }),
};

const checkboxRule: Rule = {
  isValid: (line) => /^\[[ x]\]\s+/.test(line),
  getToken: (line) => {
    const match = line.match(/^\[([ x])\]\s+(.+)$/);
    return {
      type: 'CHECKBOX',
      attributes: {
        checked: match![1] === 'x',
        text: match![2],
      }
    };
  },
};
```

### Stage 2: Parser (Data Connection)

The parser connects tokens with global state:

```typescript
class Parser {
  constructor(
    private state: GlobalState,
    private renderSet: Map<string, RenderFunction>
  ) {}

  process(token: ComponentToken): HTMLElement {
    // Get render function for this type
    const render = this.renderSet.get(token.type);
    if (!render) {
      throw new Error(`Unknown type: ${token.type}`);
    }

    // Connect with state if needed
    const enrichedToken = this.enrichToken(token);

    // Render
    const element = render(enrichedToken.attributes);

    // Handle children recursively
    if ('children' in enrichedToken) {
      for (const child of enrichedToken.children) {
        element.appendChild(this.process(child));
      }
    }

    return element;
  }

  private enrichToken(token: ComponentToken): ComponentToken {
    // Example: Database view needs page data from state
    if (token.type === 'TABLE_VIEW') {
      const pages = token.attributes.pageIds.map(
        id => this.state.pages[id]
      );
      return {
        ...token,
        attributes: { ...token.attributes, pages }
      };
    }
    return token;
  }
}
```

### Stage 3: Renderer (HTML Generation)

```typescript
type RenderFunction = (props: any) => HTMLElement;

const renderSet: Map<string, RenderFunction> = new Map([
  ['H1', (props) => {
    const el = document.createElement('h1');
    el.className = 'notion-h1';
    el.textContent = props.text;
    return el;
  }],
  
  ['CHECKBOX', (props) => {
    const el = document.createElement('div');
    el.className = 'notion-checkbox';
    el.innerHTML = `
      <label>
        <input type="checkbox" ${props.checked ? 'checked' : ''}>
        <span>${props.text}</span>
      </label>
    `;
    return el;
  }],
]);
```

### Why This Pattern?

1. **Separation of concerns** - Each stage has one job
2. **Extensible** - Add new component by adding rule + render function
3. **Testable** - Each stage can be tested independently
4. **Cacheable** - Tokens can be cached and reused

---

## 2. contenteditable and MutationObserver

### The Problem

How do you make a div editable and track changes?

### contenteditable Attribute

```html
<!-- Any HTML element can become editable -->
<div contenteditable="true">
  Type here...
</div>
```

**Why not `<textarea>`?**
- Textarea only supports plain text
- contenteditable supports rich content (HTML)
- Notion blocks can contain images, embeds, etc.

### Tracking Changes with MutationObserver

Standard input events (`onChange`, `onInput`) don't work with contenteditable. Use MutationObserver instead:

```typescript
function trackContentChanges(
  element: HTMLElement,
  onContentChange: (content: string) => void
) {
  const observer = new MutationObserver((mutations) => {
    // Content changed, get new content
    const content = element.innerText;
    onContentChange(content);
  });

  observer.observe(element, {
    // Watch for text changes
    characterData: true,
    // Watch for added/removed nodes
    childList: true,
    // Watch nested elements too
    subtree: true,
  });

  return observer;
}

// Usage
const editable = document.querySelector('[contenteditable]');
const observer = trackContentChanges(editable, (content) => {
  dispatcher.dispatch({
    type: 'UPDATE_CONTENT',
    pageId: currentPageId,
    content,
  });
});

// Cleanup
observer.disconnect();
```

### Debouncing Updates

Don't dispatch on every keystroke:

```typescript
function trackContentChanges(
  element: HTMLElement,
  onContentChange: (content: string) => void,
  debounceMs: number = 300
) {
  let timeoutId: number;

  const observer = new MutationObserver(() => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      const content = element.innerText;
      onContentChange(content);
    }, debounceMs);
  });

  observer.observe(element, {
    characterData: true,
    childList: true,
    subtree: true,
  });

  return observer;
}
```

### Static vs Selected Area

Only track mutations on the active block:

```typescript
function PageContent({ blocks }) {
  const [selectedIndex, setSelectedIndex] = useState(null);

  return (
    <div className="page-content">
      {blocks.map((block, index) => (
        index === selectedIndex ? (
          // SELECTED: Track mutations
          <EditableBlock
            key={block.id}
            block={block}
            contentEditable={true}
            onFocus={() => {}}
            onBlur={() => setSelectedIndex(null)}
          />
        ) : (
          // STATIC: No mutation tracking, can be cached
          <StaticBlock
            key={block.id}
            block={block}
            onClick={() => setSelectedIndex(index)}
          />
        )
      ))}
    </div>
  );
}
```

**Benefits:**
- Only 1 MutationObserver active at a time
- Static blocks can use cached rendering
- Better performance on large pages

---

## 3. Component Type System

### Three Types of Components

```
┌─────────────────────────────────────────────────────────────────┐
│                    COMPONENT TYPES                               │
├───────────────────┬───────────────────┬───────────────────────┬─┤
│     VISUAL        │    STRUCTURAL     │      DATABASE         │ │
├───────────────────┼───────────────────┼───────────────────────┤ │
│ • No children     │ • Has children    │ • Contains pages      │ │
│ • Simple render   │ • Recursive render│ • Custom view render  │ │
│ • Leaf nodes      │ • Container nodes │ • Collection view     │ │
│                   │                   │                       │ │
│ Examples:         │ Examples:         │ Examples:             │ │
│ • H1, H2, H3      │ • Accordion       │ • Table View          │ │
│ • Paragraph       │ • Callout         │ • Calendar View       │ │
│ • Checkbox        │ • Quote           │ • Timeline View       │ │
│ • Image           │ • Column Layout   │ • Board View          │ │
│ • Divider         │ • Toggle List     │ • Gallery View        │ │
└───────────────────┴───────────────────┴───────────────────────┴─┘
```

### Type Definitions

```typescript
// Base component token
interface ComponentToken<TProps = any> {
  type: string;
  attributes: TProps;
}

// Visual component (no children)
interface VisualToken<TProps> extends ComponentToken<TProps> {
  componentType: 'visual';
}

// Structural component (has children)
interface StructuralToken<TProps> extends ComponentToken<TProps> {
  componentType: 'structural';
  children: ComponentToken[];
}

// Database component (contains pages)
interface DatabaseToken<TProps> extends ComponentToken<TProps> {
  componentType: 'database';
  pageIds: string[];
  viewType: 'table' | 'calendar' | 'timeline' | 'board' | 'gallery';
}
```

### Rendering Each Type

```typescript
function renderComponent(token: ComponentToken, state: GlobalState): HTMLElement {
  switch (token.componentType) {
    case 'visual':
      return renderVisual(token);
      
    case 'structural':
      return renderStructural(token, state);
      
    case 'database':
      return renderDatabase(token, state);
      
    default:
      return renderVisual(token);
  }
}

function renderVisual(token: VisualToken): HTMLElement {
  const render = renderSet.get(token.type);
  return render(token.attributes);
}

function renderStructural(token: StructuralToken, state: GlobalState): HTMLElement {
  const element = renderVisual(token);
  
  // Find container for children
  const container = element.querySelector('[data-children]') || element;
  
  // Render children recursively
  for (const child of token.children) {
    container.appendChild(renderComponent(child, state));
  }
  
  return element;
}

function renderDatabase(token: DatabaseToken, state: GlobalState): HTMLElement {
  // Get pages from state
  const pages = token.pageIds.map(id => state.pages[id]);
  
  // Get view implementation
  const view = getView(token.viewType);
  
  return view.render(pages);
}
```

### Adding New Components

To add a new component (e.g., Video Embed):

```typescript
// 1. Define the rule
const videoRule: Rule = {
  isValid: (line) => /^\/video\s+/.test(line),
  getToken: (line) => ({
    type: 'VIDEO',
    componentType: 'visual',
    attributes: {
      url: line.replace(/^\/video\s+/, ''),
    },
  }),
};

// 2. Add to rules
rules.push(videoRule);

// 3. Define render function
renderSet.set('VIDEO', (props) => {
  const el = document.createElement('div');
  el.className = 'notion-video';
  el.innerHTML = `
    <iframe
      src="${props.url}"
      frameborder="0"
      allowfullscreen
    ></iframe>
  `;
  return el;
});

// Done! "/video https://youtube.com/..." now works
```

---

## 4. Plugin Architecture for Views

### The Problem

Different users want to see the same pages in different ways:
- Table view for task management
- Calendar view for scheduling
- Timeline view for roadmaps

### Plugin Data Pattern

Each view requires different metadata for pages:

```typescript
interface Page {
  id: string;
  title: string;
  content: string;
  
  // Plugin data for each view type
  plugins?: {
    table?: TablePluginData;
    calendar?: CalendarPluginData;
    timeline?: TimelinePluginData;
  };
}

interface TablePluginData {
  columns: Array<{
    name: string;
    type: 'text' | 'number' | 'date' | 'select';
    value: any;
  }>;
}

interface CalendarPluginData {
  date: number; // Unix timestamp
}

interface TimelinePluginData {
  start: number;
  end: number;
}
```

### View Interface

All views implement the same interface:

```typescript
interface PageView {
  type: string;
  
  // What plugin fields does this view need?
  getRequiredFields(): string[];
  
  // Render pages in this view
  render(pages: Page[]): HTMLElement;
}

// Table View
class TableView implements PageView {
  type = 'table';
  
  getRequiredFields() {
    return ['columns'];
  }
  
  render(pages: Page[]): HTMLElement {
    const container = document.createElement('div');
    container.className = 'notion-table';
    
    // Extract all unique column names
    const columns = this.getColumns(pages);
    
    // Render table
    container.innerHTML = `
      <table>
        <thead>
          <tr>
            <th>Title</th>
            ${columns.map(col => `<th>${col}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          ${pages.map(page => `
            <tr>
              <td>${page.title}</td>
              ${columns.map(col => `
                <td>${this.getCellValue(page, col)}</td>
              `).join('')}
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
    
    return container;
  }
  
  private getColumns(pages: Page[]): string[] {
    const columnSet = new Set<string>();
    for (const page of pages) {
      for (const col of page.plugins?.table?.columns || []) {
        columnSet.add(col.name);
      }
    }
    return Array.from(columnSet);
  }
  
  private getCellValue(page: Page, colName: string): any {
    const col = page.plugins?.table?.columns?.find(c => c.name === colName);
    return col?.value ?? '';
  }
}

// Calendar View
class CalendarView implements PageView {
  type = 'calendar';
  
  getRequiredFields() {
    return ['date'];
  }
  
  render(pages: Page[]): HTMLElement {
    const container = document.createElement('div');
    container.className = 'notion-calendar';
    
    // Group pages by date
    const pagesByDate = this.groupByDate(pages);
    
    // Render calendar grid with pages
    // ...
    
    return container;
  }
  
  private groupByDate(pages: Page[]): Map<string, Page[]> {
    const groups = new Map<string, Page[]>();
    
    for (const page of pages) {
      const date = page.plugins?.calendar?.date;
      if (date) {
        const key = new Date(date).toISOString().split('T')[0];
        if (!groups.has(key)) {
          groups.set(key, []);
        }
        groups.get(key)!.push(page);
      }
    }
    
    return groups;
  }
}
```

### Automatic Plugin Data Initialization

When a page is added to a database view, initialize its plugin data:

```typescript
function addPageToView(page: Page, viewType: string): Page {
  const view = getView(viewType);
  const requiredFields = view.getRequiredFields();
  
  // Initialize plugin data with defaults
  const pluginData = initializePlugin(viewType, requiredFields);
  
  return {
    ...page,
    plugins: {
      ...page.plugins,
      [viewType]: pluginData,
    },
  };
}

function initializePlugin(viewType: string, fields: string[]): any {
  switch (viewType) {
    case 'table':
      return { columns: [] };
    case 'calendar':
      return { date: Date.now() };
    case 'timeline':
      return { start: Date.now(), end: Date.now() + 86400000 };
    default:
      return {};
  }
}
```

---

## 5. Normalized State Management

### The Problem

Pages can be nested:
- Workspace → Projects → Project Alpha → Task 1
- Same page can appear in multiple views

How do you update a deeply nested page efficiently?

### Nested State (Bad)

```typescript
// ❌ Nested structure
const state = {
  workspace: {
    id: 'ws1',
    children: [
      {
        id: 'page1',
        title: 'Projects',
        children: [
          {
            id: 'page2',
            title: 'Alpha',
            children: [
              { id: 'page3', title: 'Task 1' } // Deep!
            ]
          }
        ]
      }
    ]
  }
};

// To update page3, you need to:
state.workspace.children[0].children[0].children[0].title = 'Updated';
// 😱 Complex and error-prone!
```

### Normalized State (Good)

```typescript
// ✅ Normalized structure
const state = {
  rootPageId: 'ws1',
  pages: {
    'ws1': { id: 'ws1', title: 'Workspace', children: ['page1'] },
    'page1': { id: 'page1', title: 'Projects', children: ['page2'] },
    'page2': { id: 'page2', title: 'Alpha', children: ['page3'] },
    'page3': { id: 'page3', title: 'Task 1', children: [] },
  }
};

// To update page3:
state.pages['page3'] = { ...state.pages['page3'], title: 'Updated' };
// ✅ O(1) access, simple update!
```

### Benefits of Normalization

1. **O(1) access** - Get any page by ID instantly
2. **Simple updates** - Update in place, no deep traversal
3. **Easy server sync** - Server sends page, just merge it
4. **Avoid duplication** - Same page referenced by ID, not copied

### Building Page Tree from Normalized State

```typescript
function buildPageTree(
  pageId: string,
  pages: Record<string, Page>,
  depth: number = 0,
  maxDepth: number = 10
): PageTreeNode {
  if (depth > maxDepth) return null;
  
  const page = pages[pageId];
  if (!page) return null;
  
  return {
    ...page,
    children: (page.children || []).map(childId =>
      buildPageTree(childId, pages, depth + 1, maxDepth)
    ).filter(Boolean),
  };
}

// Usage
const tree = buildPageTree(state.rootPageId, state.pages);
```

### React Integration

```typescript
function usePages(pageIds: string[]) {
  const pages = useStore(state => state.pages);
  
  return useMemo(() => 
    pageIds.map(id => pages[id]).filter(Boolean),
    [pageIds, pages]
  );
}

function usePage(pageId: string) {
  return useStore(state => state.pages[pageId]);
}

// Component
function PageTreeItem({ pageId }) {
  const page = usePage(pageId);
  const children = usePages(page?.children || []);
  
  return (
    <div className="tree-item">
      <span>{page?.title}</span>
      <ul>
        {children.map(child => (
          <PageTreeItem key={child.id} pageId={child.id} />
        ))}
      </ul>
    </div>
  );
}
```

---

## 6. Event-Based Architecture (Flux/Redux)

### The Pattern

```
┌─────────────────────────────────────────────────────────────────┐
│                     EVENT-BASED FLOW                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────┐     ┌─────────────┐     ┌─────────────┐           │
│  │  VIEW   │────▶│ DISPATCHER  │────▶│   REDUCER   │           │
│  │         │     │             │     │   (Action   │           │
│  │  User   │     │  dispatch() │     │   Handler)  │           │
│  │  Action │     │             │     │             │           │
│  └─────────┘     └─────────────┘     └──────┬──────┘           │
│                                             │                   │
│                                             ▼                   │
│  ┌─────────┐     ┌─────────────┐     ┌─────────────┐           │
│  │  VIEW   │◀────│ SUBSCRIBERS │◀────│    STATE    │           │
│  │         │     │             │     │  (Updated)  │           │
│  │ Re-render│    │  notify()   │     │             │           │
│  └─────────┘     └─────────────┘     └─────────────┘           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Implementation

```typescript
// Action types
type Action =
  | { type: 'UPDATE_CONTENT'; pageId: string; content: string }
  | { type: 'CREATE_PAGE'; parentId: string; page: Page }
  | { type: 'DELETE_PAGE'; pageId: string }
  | { type: 'SET_CURRENT_PAGE'; pageId: string };

// Global state
interface GlobalState {
  rootPageId: string;
  pages: Record<string, Page>;
  currentPageId: string | null;
}

// Dispatcher
class Dispatcher {
  private state: GlobalState;
  private listeners = new Set<(state: GlobalState) => void>();

  constructor(initialState: GlobalState) {
    this.state = initialState;
  }

  dispatch(action: Action) {
    // Reduce action to new state
    const newState = this.reduce(this.state, action);
    
    // Only notify if state changed
    if (newState !== this.state) {
      this.state = newState;
      this.notify();
    }
  }

  getState() {
    return this.state;
  }

  subscribe(listener: (state: GlobalState) => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    for (const listener of this.listeners) {
      listener(this.state);
    }
  }

  private reduce(state: GlobalState, action: Action): GlobalState {
    switch (action.type) {
      case 'UPDATE_CONTENT':
        return {
          ...state,
          pages: {
            ...state.pages,
            [action.pageId]: {
              ...state.pages[action.pageId],
              content: action.content,
            },
          },
        };

      case 'CREATE_PAGE':
        return {
          ...state,
          pages: {
            ...state.pages,
            [action.page.id]: action.page,
            [action.parentId]: {
              ...state.pages[action.parentId],
              children: [
                ...(state.pages[action.parentId].children || []),
                action.page.id,
              ],
            },
          },
        };

      case 'DELETE_PAGE':
        const { [action.pageId]: deleted, ...remaining } = state.pages;
        return {
          ...state,
          pages: remaining,
        };

      case 'SET_CURRENT_PAGE':
        return {
          ...state,
          currentPageId: action.pageId,
        };

      default:
        return state;
    }
  }
}

// Usage
const dispatcher = new Dispatcher(initialState);

// In component
function updateContent(pageId: string, content: string) {
  dispatcher.dispatch({
    type: 'UPDATE_CONTENT',
    pageId,
    content,
  });
}
```

### React Integration (useStore pattern)

```typescript
function useStore<T>(selector: (state: GlobalState) => T): T {
  const [value, setValue] = useState(() => selector(dispatcher.getState()));

  useEffect(() => {
    return dispatcher.subscribe((state) => {
      const newValue = selector(state);
      setValue(newValue);
    });
  }, [selector]);

  return value;
}

// Usage
function PageTitle({ pageId }) {
  const title = useStore(state => state.pages[pageId]?.title);
  return <h1>{title}</h1>;
}
```

---

## 7. GraphQL for Flexible Data Fetching

### Why GraphQL for Notion?

1. **Flexible queries** - Get exactly the fields you need
2. **Single endpoint** - No REST endpoint explosion
3. **Nested fetching** - Get page with children in one request
4. **Subscriptions** - Real-time updates built-in

### Schema Design

```graphql
type Query {
  page(id: ID!): Page
  workspace(id: ID!): Workspace
  search(query: String!): [Page!]!
}

type Mutation {
  updatePage(id: ID!, input: PageInput!): Page
  createPage(parentId: ID!, input: PageInput!): Page
  deletePage(id: ID!): Boolean
}

type Subscription {
  pageUpdated(id: ID!): Page
}

type Page {
  id: ID!
  title: String!
  content: String
  icon: String
  children: [Page!]!
  plugins: PagePlugins
}

type PagePlugins {
  table: TablePluginData
  calendar: CalendarPluginData
  timeline: TimelinePluginData
}
```

### Fetching Exactly What You Need

```typescript
// Only get titles for sidebar
const SIDEBAR_QUERY = gql`
  query GetSidebar($rootId: ID!) {
    page(id: $rootId) {
      id
      title
      icon
      children {
        id
        title
        icon
      }
    }
  }
`;

// Get full page for editing
const PAGE_QUERY = gql`
  query GetPage($id: ID!) {
    page(id: $id) {
      id
      title
      content
      icon
      plugins {
        table { columns { name type value } }
        calendar { date }
        timeline { start end }
      }
    }
  }
`;
```

### Real-Time Updates with Subscriptions

```typescript
// Subscribe to page changes
const subscription = client.subscribe({
  query: gql`
    subscription OnPageUpdated($id: ID!) {
      pageUpdated(id: $id) {
        id
        title
        content
      }
    }
  `,
  variables: { id: currentPageId },
});

subscription.subscribe({
  next: ({ data }) => {
    // Update local state with new data
    dispatcher.dispatch({
      type: 'MERGE_PAGE',
      page: data.pageUpdated,
    });
  },
});
```

### Server-Sent Events (SSE) Implementation

```typescript
function subscribeToPage(pageId: string): EventSource {
  const eventSource = new EventSource(`/api/subscribe/${pageId}`);

  eventSource.onmessage = (event) => {
    const data = JSON.parse(event.data);
    dispatcher.dispatch({
      type: 'MERGE_PAGE',
      page: data,
    });
  };

  eventSource.onerror = () => {
    // Auto-reconnect is built into SSE
    console.log('Connection lost, reconnecting...');
  };

  return eventSource;
}

// Usage
const subscription = subscribeToPage(currentPageId);

// Cleanup
subscription.close();
```

---

## 8. Delta Synchronization

### The Problem

Page content can be large. Sending the entire page on every keystroke:
- Wastes bandwidth
- Creates conflicts in collaborative editing
- Slow for large pages

### Solution: Send Only Changes (Delta)

```typescript
// Instead of:
{ type: 'UPDATE', content: '...entire 10KB content...' }

// Send:
{ type: 'DELTA', operations: [
  { type: 'insert', position: 45, text: 'new text' }
]}
```

### Delta Operation Types

```typescript
type DeltaOperation =
  | { type: 'insert'; position: number; text: string }
  | { type: 'delete'; position: number; length: number }
  | { type: 'replace'; position: number; length: number; text: string };

interface ContentDelta {
  baseHash: string;  // Hash of original content
  operations: DeltaOperation[];
}
```

### Calculating Delta

Use a diff algorithm (e.g., diff-match-patch):

```typescript
import DiffMatchPatch from 'diff-match-patch';

const dmp = new DiffMatchPatch();

function calculateDelta(oldContent: string, newContent: string): ContentDelta {
  const diffs = dmp.diff_main(oldContent, newContent);
  dmp.diff_cleanupSemantic(diffs);
  
  const operations: DeltaOperation[] = [];
  let position = 0;
  
  for (const [op, text] of diffs) {
    switch (op) {
      case 0: // Equal
        position += text.length;
        break;
      case 1: // Insert
        operations.push({ type: 'insert', position, text });
        position += text.length;
        break;
      case -1: // Delete
        operations.push({ type: 'delete', position, length: text.length });
        break;
    }
  }
  
  return {
    baseHash: hash(oldContent),
    operations,
  };
}

// Usage
const oldContent = 'Hello World';
const newContent = 'Hello Beautiful World';

const delta = calculateDelta(oldContent, newContent);
// { baseHash: '...', operations: [
//   { type: 'insert', position: 6, text: 'Beautiful ' }
// ]}
```

### Applying Delta on Server

```typescript
function applyDelta(content: string, delta: ContentDelta): string {
  // Verify base hash matches
  if (hash(content) !== delta.baseHash) {
    throw new ConflictError('Content changed, need to rebase');
  }
  
  let result = content;
  let offset = 0;
  
  for (const op of delta.operations) {
    const position = op.position + offset;
    
    switch (op.type) {
      case 'insert':
        result = result.slice(0, position) + op.text + result.slice(position);
        offset += op.text.length;
        break;
        
      case 'delete':
        result = result.slice(0, position) + result.slice(position + op.length);
        offset -= op.length;
        break;
        
      case 'replace':
        result = result.slice(0, position) + op.text + result.slice(position + op.length);
        offset += op.text.length - op.length;
        break;
    }
  }
  
  return result;
}
```

---

## 9. Offline-First with Service Workers

### Service Worker Lifecycle

```
Install → Activate → Fetch
```

### Caching Static Assets

```typescript
// service-worker.js

const CACHE_NAME = 'notion-v1';
const STATIC_ASSETS = [
  '/',
  '/app.js',
  '/styles.css',
  '/manifest.json',
];

// Install: Cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
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
});

// Fetch: Serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response;
      }
      return fetch(event.request);
    })
  );
});
```

### Offline Data Strategy

```typescript
// Store pages in IndexedDB when offline
class OfflineStore {
  private db: IDBDatabase;

  async init() {
    return new Promise((resolve) => {
      const request = indexedDB.open('NotionOffline', 1);
      
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        db.createObjectStore('pages', { keyPath: 'id' });
        db.createObjectStore('pendingSync', { autoIncrement: true });
      };
      
      request.onsuccess = (event) => {
        this.db = event.target.result;
        resolve(this.db);
      };
    });
  }

  async savePage(page: Page) {
    const tx = this.db.transaction('pages', 'readwrite');
    tx.objectStore('pages').put(page);
  }

  async getPage(id: string): Promise<Page | undefined> {
    const tx = this.db.transaction('pages', 'readonly');
    const request = tx.objectStore('pages').get(id);
    
    return new Promise((resolve) => {
      request.onsuccess = () => resolve(request.result);
    });
  }

  async queueSync(action: Action) {
    const tx = this.db.transaction('pendingSync', 'readwrite');
    tx.objectStore('pendingSync').add(action);
  }

  async processSyncQueue() {
    const tx = this.db.transaction('pendingSync', 'readwrite');
    const store = tx.objectStore('pendingSync');
    const request = store.getAll();
    
    return new Promise((resolve) => {
      request.onsuccess = async () => {
        for (const action of request.result) {
          await this.syncAction(action);
        }
        store.clear();
        resolve();
      };
    });
  }
}
```

### Sync When Online

```typescript
// Detect online/offline
window.addEventListener('online', async () => {
  console.log('Back online, syncing...');
  await offlineStore.processSyncQueue();
});

window.addEventListener('offline', () => {
  console.log('Went offline, queuing changes...');
});

// Modified dispatcher
class OfflineAwareDispatcher extends Dispatcher {
  dispatch(action: Action) {
    super.dispatch(action);
    
    if (navigator.onLine) {
      this.syncToServer(action);
    } else {
      offlineStore.queueSync(action);
    }
  }
}
```

---

## 10. Rendering Optimization Patterns

### 1. Static vs Selected Area

Only track mutations on the active block:

```typescript
function PageContent({ content }) {
  // Parse into blocks
  const blocks = useMemo(() => parseBlocks(content), [content]);
  const [selectedIndex, setSelectedIndex] = useState(null);

  return (
    <div>
      {blocks.map((block, index) => (
        index === selectedIndex ? (
          <EditableBlock key={block.id} block={block} />
        ) : (
          <StaticBlock key={block.id} block={block} />
        )
      ))}
    </div>
  );
}
```

### 2. Hash-Based Caching

Don't re-render if content hasn't changed:

```typescript
const renderCache = new Map<string, HTMLElement>();

function renderWithCache(content: string): HTMLElement {
  const contentHash = hash(content);
  
  if (renderCache.has(contentHash)) {
    return renderCache.get(contentHash)!.cloneNode(true) as HTMLElement;
  }
  
  const element = render(content);
  renderCache.set(contentHash, element);
  return element;
}
```

### 3. Virtual Scrolling for Long Pages

```typescript
function VirtualizedPage({ blocks }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 20 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollTop = container.scrollTop;
      const viewportHeight = container.clientHeight;
      const blockHeight = 50; // Average block height

      const start = Math.floor(scrollTop / blockHeight);
      const end = Math.ceil((scrollTop + viewportHeight) / blockHeight);

      setVisibleRange({ start: Math.max(0, start - 5), end: end + 5 });
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  const visibleBlocks = blocks.slice(visibleRange.start, visibleRange.end);
  const offsetTop = visibleRange.start * 50;
  const totalHeight = blocks.length * 50;

  return (
    <div ref={containerRef} style={{ height: '100vh', overflow: 'auto' }}>
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div style={{ position: 'absolute', top: offsetTop }}>
          {visibleBlocks.map((block, i) => (
            <Block key={visibleRange.start + i} block={block} />
          ))}
        </div>
      </div>
    </div>
  );
}
```

### 4. Lazy Loading Components

```typescript
// Only load heavy components when needed
const TableView = React.lazy(() => import('./views/TableView'));
const CalendarView = React.lazy(() => import('./views/CalendarView'));
const TimelineView = React.lazy(() => import('./views/TimelineView'));

function DatabaseView({ viewType, pages }) {
  return (
    <Suspense fallback={<Skeleton />}>
      {viewType === 'table' && <TableView pages={pages} />}
      {viewType === 'calendar' && <CalendarView pages={pages} />}
      {viewType === 'timeline' && <TimelineView pages={pages} />}
    </Suspense>
  );
}
```

---

## Summary

| Concept | Key Takeaway |
|---------|--------------|
| **Lexer/Parser** | 3-stage pipeline: tokenize → connect → render |
| **contenteditable** | Rich text editing in any HTML element |
| **MutationObserver** | Track DOM changes without input events |
| **Component Types** | Visual, Structural, Database |
| **Plugin System** | Different metadata per view type |
| **Normalized State** | O(1) access, simple updates |
| **Event Architecture** | dispatch → reduce → notify |
| **GraphQL** | Flexible queries, subscriptions |
| **Delta Sync** | Send changes, not full content |
| **Offline-First** | Service worker + IndexedDB |

---

## References

- [MutationObserver MDN](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver)
- [contenteditable MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/contenteditable)
- [Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [IndexedDB API](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)
- [GraphQL Subscriptions](https://graphql.org/blog/subscriptions-in-graphql-and-relay/)
- [diff-match-patch](https://github.com/google/diff-match-patch)
