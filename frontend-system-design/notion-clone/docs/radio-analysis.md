# Notion Clone Frontend System Design

> A comprehensive frontend system design for building a Notion-like editor application with custom markdown parsing, extendable component library, database views, and collaborative editing support.

---

## Table of Contents

1. [Requirements Exploration](#1-requirements-exploration)
2. [Architecture / High-Level Design](#2-architecture--high-level-design)
3. [Lexer, Parser & Renderer Architecture](#3-lexer-parser--renderer-architecture)
4. [Component System Design](#4-component-system-design)
5. [Database & Views Design](#5-database--views-design)
6. [State Management](#6-state-management)
7. [API Design](#7-api-design)
8. [Optimizations](#8-optimizations)
9. [Accessibility](#9-accessibility)

---

## 1. Requirements Exploration

### 1.1 General Requirements

| Requirement | Description |
|-------------|-------------|
| **Custom editor with live transformation** | Typing markdown syntax auto-converts to components |
| **Extendable component library** | Easy to add new components with consistent interface |
| **Page hierarchy** | Pages can contain pages (nested structure) |
| **Accessible content** | Screen reader support, keyboard navigation |
| **Performance focused** | Optimized for desktop-first usage |

### 1.2 Advanced Requirements

| Requirement | Description |
|-------------|-------------|
| **Database concept** | Group pages into custom views (table, calendar, timeline) |
| **Offline-first** | Work without internet, sync when connected |
| **Efficient network** | Send deltas instead of full page content |
| **Cross-platform** | Works on all modern browsers |
| **Multi-viewport support** | Responsive design for different screens |

### 1.3 Technical Constraints

- Desktop-first application (less mobile optimization needed)
- Modern browser support only (ES6+, no IE)
- Offline-first with service worker caching
- Real-time collaborative editing support (optional)

---

## 2. Architecture / High-Level Design

### 2.1 Application Structure

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           NOTION CLONE                                   │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─────────────────────┐          ┌─────────────────────────────────┐  │
│  │   WORKSPACE MENU    │          │         PAGE CONTENT            │  │
│  │   (Left Sidebar)    │          │         (Main Area)             │  │
│  │                     │          │                                 │  │
│  │  ┌───────────────┐  │          │  ┌─────────────────────────┐   │  │
│  │  │ Root Page     │  │          │  │   Static Area           │   │  │
│  │  │ ├─ Child 1    │  │          │  │   (Cached, not editing) │   │  │
│  │  │ │  └─ Sub 1   │  │          │  └─────────────────────────┘   │  │
│  │  │ ├─ Child 2    │  │          │                                 │  │
│  │  │ └─ Child 3    │  │          │  ┌─────────────────────────┐   │  │
│  │  └───────────────┘  │          │  │   Selected Area         │   │  │
│  │                     │          │  │   (contenteditable)     │   │  │
│  │  [+ New Page]       │          │  │   ← MutationObserver    │   │  │
│  └─────────────────────┘          │  └─────────────────────────┘   │  │
│                                   │                                 │  │
│                                   └─────────────────────────────────┘  │
│                                                                         │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │                         GLOBAL STATE                              │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐   │  │
│  │  │ Root Page   │  │ Pages Map   │  │   Dispatcher            │   │  │
│  │  │ ID          │  │ (Normalized)│  │   (Action Handler)      │   │  │
│  │  └─────────────┘  └─────────────┘  └─────────────────────────┘   │  │
│  └───────────────────────────────────────────────────────────────────┘  │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 2.2 Data Flow

```
┌─────────────┐     ┌─────────────────────────────────────────────────────┐
│   User      │     │                  PAGE CONTENT                        │
│   Types     │────▶│                                                     │
└─────────────┘     │  ┌─────────────────────────────────────────────┐   │
                    │  │ contenteditable div                          │   │
                    │  │                                              │   │
                    │  │  "# Hello World"                             │   │
                    │  │        │                                     │   │
                    │  │        ▼                                     │   │
                    │  │  MutationObserver                            │   │
                    │  └──────────│────────────────────────────────────┘   │
                    │             │                                        │
                    └─────────────┼────────────────────────────────────────┘
                                  │
                                  ▼
                    ┌─────────────────────────┐
                    │      DISPATCHER         │
                    │  dispatch({             │
                    │    type: 'UPDATE',      │
                    │    content: '# Hello'   │
                    │  })                     │
                    └───────────│─────────────┘
                                │
                                ▼
                    ┌─────────────────────────┐
                    │    ACTION HANDLER       │
                    │    (Reducer)            │
                    └───────────│─────────────┘
                                │
                                ▼
                    ┌─────────────────────────┐
                    │     GLOBAL STATE        │
                    │     (Updated)           │
                    └───────────│─────────────┘
                                │
                                ▼
                    ┌─────────────────────────────────────────────────────┐
                    │               LEXER → PARSER → RENDERER             │
                    │                                                     │
                    │  "# Hello"  →  { type: 'H1', text: 'Hello' }       │
                    │                        │                            │
                    │                        ▼                            │
                    │                 <h1>Hello</h1>                      │
                    └─────────────────────────────────────────────────────┘
```

### 2.3 Component Hierarchy

```typescript
// Application Route receives root page ID
<AppRoute rootPageId={rootPageId}>
  
  // Sidebar with page hierarchy
  <WorkspaceMenu pages={pages} />
  
  // Main content area
  <PageRouter>
    <PageRoute pageId={currentPageId}>
      
      // Raw content goes through processing
      <PageContent content={rawContent}>
        
        // Static area (cached, not editing)
        <StaticArea tokens={cachedTokens} />
        
        // Active editing area
        <SelectedArea
          contentEditable={true}
          onMutation={handleMutation}
        />
        
      </PageContent>
      
    </PageRoute>
  </PageRouter>
  
</AppRoute>
```

---

## 3. Lexer, Parser & Renderer Architecture

### 3.1 Overview

The content processing pipeline:

```
Raw String Content
        │
        ▼
┌───────────────────┐
│      LEXER        │ ← Rules (regex patterns)
│  (Tokenization)   │
└─────────│─────────┘
          │
          ▼
   Component Tokens
   (JSON objects)
          │
          ▼
┌───────────────────┐
│     PARSER        │ ← Global State access
│ (Data connection) │
└─────────│─────────┘
          │
          ▼
   Connected Tokens
   (with data props)
          │
          ▼
┌───────────────────┐
│    RENDERER       │ ← Render Set (component map)
│ (HTML generation) │
└─────────│─────────┘
          │
          ▼
    HTML Elements
```

### 3.2 Lexer Interface

```typescript
interface Lexer {
  process(rules: Rule[], content: string): ComponentToken[];
}

interface Rule {
  // Check if this rule applies to the line
  isValid(line: string): boolean;
  
  // Extract token from the line
  getToken(line: string): ComponentToken;
}

// Example rules
const rules: Rule[] = [
  {
    // H1: # Heading
    pattern: /^#\s+(.+)$/,
    isValid: (line) => /^#\s+/.test(line),
    getToken: (line) => ({
      type: 'H1',
      attributes: { text: line.replace(/^#\s+/, '') }
    }),
  },
  {
    // Checkbox: [ ] or [x]
    pattern: /^\[([ x])\]\s*(.+)$/,
    isValid: (line) => /^\[[ x]\]/.test(line),
    getToken: (line) => {
      const match = line.match(/^\[([ x])\]\s*(.+)$/);
      return {
        type: 'CHECKBOX',
        attributes: {
          checked: match[1] === 'x',
          text: match[2]
        }
      };
    },
  },
  {
    // Accordion: >>> Title
    pattern: /^>>>\s*(.+)$/,
    isValid: (line) => /^>>>/.test(line),
    getToken: (line) => ({
      type: 'ACCORDION',
      attributes: { title: line.replace(/^>>>\s*/, '') },
      children: []
    }),
  },
];
```

### 3.3 Component Token Types

```typescript
// Base component token
interface ComponentToken<TProps = any> {
  type: string;
  attributes: TProps;
}

// Container component (can have children)
interface ContainerComponentToken<TProps = any> extends ComponentToken<TProps> {
  children: ComponentToken[];
}

// Database component (contains pages)
interface DatabaseComponentToken<TProps = any> extends ComponentToken<TProps> {
  databaseData: DatabaseData;
}

// Union of all possible tokens
type AnyComponentToken = 
  | ComponentToken<HeadingProps>
  | ComponentToken<ParagraphProps>
  | ComponentToken<CheckboxProps>
  | ContainerComponentToken<AccordionProps>
  | ContainerComponentToken<CalloutProps>
  | DatabaseComponentToken<TableViewProps>
  | DatabaseComponentToken<CalendarViewProps>;
```

### 3.4 Parser Interface

```typescript
interface Parser {
  // Access to global state for data connection
  state: GlobalState;
  
  // Process token and generate HTML element
  process(token: ComponentToken): HTMLElement;
}

class NotionParser implements Parser {
  constructor(private state: GlobalState, private renderSet: RenderSet) {}

  process(token: ComponentToken): HTMLElement {
    // Get render function for this token type
    const renderFn = this.renderSet.get(token.type);
    
    if (!renderFn) {
      throw new Error(`Unknown component type: ${token.type}`);
    }

    // Connect with global state if needed
    const connectedProps = this.connectWithState(token);

    // Render the component
    const element = renderFn(connectedProps);

    // Process children recursively
    if ('children' in token) {
      const childContainer = element.querySelector('[data-children]') || element;
      for (const child of token.children) {
        childContainer.appendChild(this.process(child));
      }
    }

    return element;
  }

  private connectWithState(token: ComponentToken): ComponentToken {
    // Example: Connect database token with pages from state
    if (token.type === 'TABLE_VIEW') {
      const pageIds = token.attributes.pageIds;
      const pages = pageIds.map(id => this.state.pages[id]);
      return {
        ...token,
        attributes: { ...token.attributes, pages }
      };
    }
    return token;
  }
}
```

### 3.5 Render Set

```typescript
type RenderFunction = (props: any) => HTMLElement;

interface RenderSet {
  get(type: string): RenderFunction | undefined;
  register(type: string, fn: RenderFunction): void;
}

// Example render functions
const renderSet: Map<string, RenderFunction> = new Map([
  ['H1', (props) => {
    const el = document.createElement('h1');
    el.textContent = props.text;
    el.className = 'notion-heading-1';
    return el;
  }],
  
  ['H2', (props) => {
    const el = document.createElement('h2');
    el.textContent = props.text;
    el.className = 'notion-heading-2';
    return el;
  }],
  
  ['PARAGRAPH', (props) => {
    const el = document.createElement('p');
    el.textContent = props.text;
    el.className = 'notion-paragraph';
    return el;
  }],
  
  ['CHECKBOX', (props) => {
    const el = document.createElement('div');
    el.className = 'notion-checkbox';
    el.innerHTML = `
      <input type="checkbox" ${props.checked ? 'checked' : ''} />
      <span>${props.text}</span>
    `;
    return el;
  }],
  
  ['ACCORDION', (props) => {
    const el = document.createElement('details');
    el.className = 'notion-accordion';
    el.innerHTML = `
      <summary>${props.title}</summary>
      <div data-children class="accordion-content"></div>
    `;
    return el;
  }],
  
  ['TABLE_VIEW', (props) => {
    const el = document.createElement('div');
    el.className = 'notion-table';
    // Complex table rendering with props.pages
    return el;
  }],
]);
```

### 3.6 Markdown Syntax Specification

| Syntax | Component | Example |
|--------|-----------|---------|
| `# Text` | H1 | `# Welcome` |
| `## Text` | H2 | `## Section` |
| `### Text` | H3 | `### Subsection` |
| `[ ] Text` | Checkbox (unchecked) | `[ ] Todo item` |
| `[x] Text` | Checkbox (checked) | `[x] Done item` |
| `>>> Title` | Accordion | `>>> Click to expand` |
| `> Text` | Callout | `> Important note` |
| `--- ` | Divider | `---` |
| `/table` | Table database | `/table My Database` |
| `/calendar` | Calendar view | `/calendar Events` |
| `/timeline` | Timeline view | `/timeline Roadmap` |

---

## 4. Component System Design

### 4.1 Component Types

```
┌─────────────────────────────────────────────────────────────────────┐
│                    COMPONENT TYPES                                   │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────────┐  │
│  │     VISUAL      │  │   STRUCTURAL    │  │     DATABASE        │  │
│  │                 │  │   (Container)   │  │   (Page Container)  │  │
│  ├─────────────────┤  ├─────────────────┤  ├─────────────────────┤  │
│  │ • H1, H2, H3    │  │ • Accordion     │  │ • Table View        │  │
│  │ • Paragraph     │  │ • Column        │  │ • Calendar View     │  │
│  │ • Checkbox      │  │ • Callout       │  │ • Timeline View     │  │
│  │ • Image         │  │ • Quote         │  │ • Board View        │  │
│  │ • Divider       │  │ • Toggle List   │  │ • Gallery View      │  │
│  │ • Code Block    │  │ • Tab Container │  │                     │  │
│  └─────────────────┘  └─────────────────┘  └─────────────────────┘  │
│                                                                     │
│  Interface:          Interface:            Interface:               │
│  - No children       - Has children[]      - Has pages[]            │
│  - Simple render     - Recursive render    - Custom view render    │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### 4.2 Component Interface

```typescript
// Base component interface
interface NotionComponent<TProps> {
  type: ComponentType;
  render(props: TProps): HTMLElement;
}

// Visual component (no children)
interface VisualComponent<TProps> extends NotionComponent<TProps> {
  type: 'VISUAL';
}

// Structural component (has children)
interface StructuralComponent<TProps> extends NotionComponent<TProps> {
  type: 'STRUCTURAL';
  renderChildren(children: ComponentToken[]): HTMLElement[];
}

// Database component (has pages)
interface DatabaseComponent<TProps> extends NotionComponent<TProps> {
  type: 'DATABASE';
  renderPages(pages: Page[]): HTMLElement;
}

// Component registry
class ComponentRegistry {
  private components = new Map<string, NotionComponent<any>>();

  register<TProps>(name: string, component: NotionComponent<TProps>) {
    this.components.set(name, component);
  }

  get(name: string): NotionComponent<any> | undefined {
    return this.components.get(name);
  }

  // Easy extension: just register new component
  extend<TProps>(name: string, component: NotionComponent<TProps>) {
    this.register(name, component);
  }
}
```

### 4.3 Adding New Components

```typescript
// Step 1: Define the rule
const codeBlockRule: Rule = {
  pattern: /^```(\w+)?$/,
  isValid: (line) => line.startsWith('```'),
  getToken: (line) => ({
    type: 'CODE_BLOCK',
    attributes: {
      language: line.replace('```', '').trim() || 'text',
      code: ''
    }
  }),
};

// Step 2: Define the render function
const codeBlockRender: RenderFunction = (props) => {
  const el = document.createElement('pre');
  el.className = `notion-code-block language-${props.language}`;
  el.innerHTML = `<code>${escapeHtml(props.code)}</code>`;
  return el;
};

// Step 3: Register
rules.push(codeBlockRule);
renderSet.set('CODE_BLOCK', codeBlockRender);
```

---

## 5. Database & Views Design

### 5.1 Database Concept

In Notion, a "database" is a page that contains pages and can display them in different views:

```
┌─────────────────────────────────────────────────────────────────────┐
│                    DATABASE = PAGE + PAGES + VIEW                    │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────────────────────────────┐                                │
│  │      DATABASE PAGE              │                                │
│  │      (Parent Container)         │                                │
│  │                                 │                                │
│  │  ┌───────────────────────────┐  │                                │
│  │  │   Child Page 1            │──┼──▶ Has Plugin Data            │
│  │  │   Child Page 2            │──┼──▶ Has Plugin Data            │
│  │  │   Child Page 3            │──┼──▶ Has Plugin Data            │
│  │  │   ...                     │  │                                │
│  │  └───────────────────────────┘  │                                │
│  │                                 │                                │
│  │  Current View: [Table ▼]        │                                │
│  │                                 │                                │
│  └─────────────────────────────────┘                                │
│                                                                     │
│  Views: Table | Calendar | Timeline | Board | Gallery               │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### 5.2 Page Entity with Plugin Data

```typescript
interface Page {
  id: string;
  title: string;
  content?: string;
  icon?: string;
  children?: Page[];
  
  // Hash for caching/rendering optimization
  hash?: string;
  
  // Plugin data for different views
  plugins?: {
    table?: TablePluginData;
    calendar?: CalendarPluginData;
    timeline?: TimelinePluginData;
  };
}

// Table view plugin data
interface TablePluginData {
  columns: {
    name: string;
    type: 'text' | 'number' | 'date' | 'select' | 'multiselect';
    value: any;
  }[];
}

// Calendar view plugin data
interface CalendarPluginData {
  date: number; // Unix timestamp
}

// Timeline view plugin data
interface TimelinePluginData {
  start: number; // Unix timestamp
  end: number;   // Unix timestamp
}
```

### 5.3 View Components

Each view implements the same interface but renders pages differently:

```typescript
interface PageView {
  type: string;
  render(pages: Page[]): HTMLElement;
  getRequiredPluginFields(): string[];
}

// Table View
class TableView implements PageView {
  type = 'table';
  
  getRequiredPluginFields() {
    return ['columns'];
  }
  
  render(pages: Page[]): HTMLElement {
    const table = document.createElement('table');
    table.className = 'notion-table-view';
    
    // Get all unique columns from pages
    const columns = this.extractColumns(pages);
    
    // Render header
    const thead = document.createElement('thead');
    thead.innerHTML = `
      <tr>
        <th>Title</th>
        ${columns.map(col => `<th>${col.name}</th>`).join('')}
      </tr>
    `;
    table.appendChild(thead);
    
    // Render rows
    const tbody = document.createElement('tbody');
    for (const page of pages) {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${page.title}</td>
        ${columns.map(col => `<td>${this.getCellValue(page, col)}</td>`).join('')}
      `;
      tbody.appendChild(row);
    }
    table.appendChild(tbody);
    
    return table;
  }
}

// Calendar View
class CalendarView implements PageView {
  type = 'calendar';
  
  getRequiredPluginFields() {
    return ['date'];
  }
  
  render(pages: Page[]): HTMLElement {
    const calendar = document.createElement('div');
    calendar.className = 'notion-calendar-view';
    
    // Group pages by date
    const pagesByDate = this.groupByDate(pages);
    
    // Render calendar grid
    const grid = this.renderCalendarGrid(pagesByDate);
    calendar.appendChild(grid);
    
    return calendar;
  }
}

// Timeline View
class TimelineView implements PageView {
  type = 'timeline';
  
  getRequiredPluginFields() {
    return ['start', 'end'];
  }
  
  render(pages: Page[]): HTMLElement {
    const timeline = document.createElement('div');
    timeline.className = 'notion-timeline-view';
    
    // Sort pages by start date
    const sortedPages = pages.sort((a, b) => 
      (a.plugins?.timeline?.start || 0) - (b.plugins?.timeline?.start || 0)
    );
    
    // Render timeline items
    for (const page of sortedPages) {
      const item = this.renderTimelineItem(page);
      timeline.appendChild(item);
    }
    
    return timeline;
  }
}
```

### 5.4 Plugin System

When a page is added to a database with a specific view, the plugin data is automatically added:

```typescript
function addPageToDatabase(
  page: Page,
  databaseId: string,
  viewType: 'table' | 'calendar' | 'timeline'
) {
  // Get view instance
  const view = getView(viewType);
  
  // Get required fields for this view
  const requiredFields = view.getRequiredPluginFields();
  
  // Initialize plugin data with defaults
  const pluginData = initializePluginData(viewType, requiredFields);
  
  // Update page with plugin data
  return {
    ...page,
    plugins: {
      ...page.plugins,
      [viewType]: pluginData,
    },
  };
}

function initializePluginData(viewType: string, fields: string[]) {
  switch (viewType) {
    case 'table':
      return { columns: [] };
    case 'calendar':
      return { date: Date.now() };
    case 'timeline':
      return { start: Date.now(), end: Date.now() + 86400000 }; // +1 day
    default:
      return {};
  }
}
```

---

## 6. State Management

### 6.1 Global State Structure

```typescript
interface GlobalState {
  // ID of the root page (workspace root)
  rootPageId: string;
  
  // Normalized pages map for O(1) access
  pages: Record<string, Page>;
  
  // Currently selected page
  currentPageId: string | null;
  
  // UI state
  ui: {
    sidebarOpen: boolean;
    searchOpen: boolean;
  };
}

// Example state
const state: GlobalState = {
  rootPageId: 'page_001',
  pages: {
    'page_001': {
      id: 'page_001',
      title: 'My Workspace',
      children: ['page_002', 'page_003'],
    },
    'page_002': {
      id: 'page_002',
      title: 'Projects',
      content: '# Projects\n\nMy project list',
      children: ['page_004'],
    },
    'page_003': {
      id: 'page_003',
      title: 'Notes',
      content: '# Notes\n\n[ ] Todo 1\n[x] Todo 2',
    },
    'page_004': {
      id: 'page_004',
      title: 'Project Alpha',
      content: '## Project Alpha\n\nDetails...',
      plugins: {
        timeline: { start: 1703030400000, end: 1703116800000 }
      }
    },
  },
  currentPageId: 'page_002',
  ui: {
    sidebarOpen: true,
    searchOpen: false,
  },
};
```

### 6.2 Why Normalized State?

```typescript
// ❌ Nested structure (bad for updates)
const nestedState = {
  rootPage: {
    id: 'page_001',
    children: [
      {
        id: 'page_002',
        children: [
          { id: 'page_004' } // Deep nesting = hard to update
        ]
      }
    ]
  }
};

// ✅ Normalized structure (O(1) access and updates)
const normalizedState = {
  pages: {
    'page_001': { id: 'page_001', children: ['page_002'] },
    'page_002': { id: 'page_002', children: ['page_004'] },
    'page_004': { id: 'page_004', children: [] },
  }
};

// Easy update:
state.pages['page_004'] = { ...state.pages['page_004'], title: 'New Title' };
```

### 6.3 Dispatcher and Actions

```typescript
// Action types
type Action =
  | { type: 'UPDATE_CONTENT'; pageId: string; content: string }
  | { type: 'CREATE_PAGE'; parentId: string; page: Page }
  | { type: 'DELETE_PAGE'; pageId: string }
  | { type: 'MOVE_PAGE'; pageId: string; newParentId: string }
  | { type: 'SET_CURRENT_PAGE'; pageId: string }
  | { type: 'UPDATE_PLUGIN_DATA'; pageId: string; pluginType: string; data: any };

// Dispatcher
class Dispatcher {
  private state: GlobalState;
  private listeners: Set<(state: GlobalState) => void> = new Set();

  dispatch(action: Action) {
    // Reduce action to new state
    this.state = this.reduce(this.state, action);
    
    // Notify listeners
    this.listeners.forEach(listener => listener(this.state));
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
              hash: this.generateHash(action.content),
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

      case 'SET_CURRENT_PAGE':
        return {
          ...state,
          currentPageId: action.pageId,
        };

      default:
        return state;
    }
  }

  subscribe(listener: (state: GlobalState) => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }
}
```

### 6.4 MutationObserver for Content Changes

```typescript
function setupContentTracking(element: HTMLElement, pageId: string) {
  const observer = new MutationObserver((mutations) => {
    // Get the current content
    const content = element.innerText;
    
    // Dispatch update action
    dispatcher.dispatch({
      type: 'UPDATE_CONTENT',
      pageId,
      content,
    });
  });

  // Observe changes to the editable content
  observer.observe(element, {
    characterData: true,
    childList: true,
    subtree: true,
  });

  return observer;
}

// Usage
const editableArea = document.querySelector('[contenteditable]');
const observer = setupContentTracking(editableArea, currentPageId);

// Cleanup
// observer.disconnect();
```

---

## 7. API Design

### 7.1 REST vs GraphQL

| Aspect | REST | GraphQL |
|--------|------|---------|
| Endpoints | Multiple | Single |
| Data fetching | Over/under-fetching | Exact fields |
| Caching | HTTP caching | Custom |
| Flexibility | Limited | High |
| Maintenance | Harder at scale | Easier |

**Choice: GraphQL** - Better for Notion's flexible data needs.

### 7.2 GraphQL Schema

```graphql
type Query {
  page(id: ID!): Page
  workspace(id: ID!): Workspace
  search(query: String!, workspaceId: ID!): [Page!]!
}

type Mutation {
  updatePage(id: ID!, input: PageInput!): Page
  createPage(parentId: ID!, input: PageInput!): Page
  deletePage(id: ID!): Boolean
  movePage(id: ID!, newParentId: ID!): Page
}

type Subscription {
  pageUpdated(id: ID!): Page
  workspaceUpdated(id: ID!): Workspace
}

type Page {
  id: ID!
  title: String!
  content: String
  icon: String
  children: [Page!]!
  plugins: PagePlugins
  createdAt: DateTime!
  updatedAt: DateTime!
}

type PagePlugins {
  table: TablePluginData
  calendar: CalendarPluginData
  timeline: TimelinePluginData
}

input PageInput {
  title: String
  content: String
  icon: String
}
```

### 7.3 API Methods

```typescript
interface NotionAPI {
  // Get page with nested children
  getPage(id: string, depth?: number): Promise<Page>;
  
  // Update page with delta (not full content)
  updatePage(id: string, delta: ContentDelta): Promise<Page>;
  
  // Subscribe to live updates (SSE)
  subscribe(pageId: string): EventSource;
}

// Implementation
class NotionAPIClient implements NotionAPI {
  constructor(private endpoint: string, private token: string) {}

  async getPage(id: string, depth = 1): Promise<Page> {
    const query = `
      query GetPage($id: ID!, $depth: Int!) {
        page(id: $id) {
          id
          title
          content
          icon
          children @include(if: $depth > 0) {
            id
            title
            icon
          }
        }
      }
    `;
    
    return this.request(query, { id, depth });
  }

  async updatePage(id: string, delta: ContentDelta): Promise<Page> {
    const mutation = `
      mutation UpdatePage($id: ID!, $delta: DeltaInput!) {
        updatePage(id: $id, delta: $delta) {
          id
          content
          updatedAt
        }
      }
    `;
    
    return this.request(mutation, { id, delta });
  }

  subscribe(pageId: string): EventSource {
    // Server-Sent Events for real-time updates
    const url = `${this.endpoint}/subscribe/${pageId}`;
    const eventSource = new EventSource(url, {
      headers: { Authorization: `Bearer ${this.token}` }
    });
    
    return eventSource;
  }
}
```

### 7.4 Delta Updates

Instead of sending full content, send only what changed:

```typescript
interface ContentDelta {
  operations: DeltaOperation[];
}

type DeltaOperation =
  | { type: 'insert'; position: number; text: string }
  | { type: 'delete'; position: number; length: number }
  | { type: 'replace'; position: number; length: number; text: string };

// Calculate delta between old and new content
function calculateDelta(oldContent: string, newContent: string): ContentDelta {
  // Use diff-match-patch or similar library
  const diffs = diffMatchPatch.diff(oldContent, newContent);
  
  const operations: DeltaOperation[] = [];
  let position = 0;
  
  for (const [op, text] of diffs) {
    if (op === 0) {
      // Equal, just move position
      position += text.length;
    } else if (op === 1) {
      // Insert
      operations.push({ type: 'insert', position, text });
      position += text.length;
    } else if (op === -1) {
      // Delete
      operations.push({ type: 'delete', position, length: text.length });
    }
  }
  
  return { operations };
}
```

---

## 8. Optimizations

### 8.1 Network Optimizations

```typescript
// 1. HTTP/2 for parallel loading
// Enable on server, get multiplexing for free

// 2. Service Worker for offline support
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('notion-v1').then((cache) => {
      return cache.addAll([
        '/',
        '/app.js',
        '/styles.css',
        '/icons.svg',
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

// 3. Preconnect for faster initial connection
// <link rel="preconnect" href="https://api.notion.so">

// 4. Dynamic imports for non-critical code
const TableView = () => import('./views/TableView');
const CalendarView = () => import('./views/CalendarView');
```

### 8.2 Bundle Optimizations

```javascript
// vite.config.js or webpack.config.js

export default {
  build: {
    // No polyfills needed (modern browsers only)
    target: 'es2020',
    
    // Minification
    minify: 'terser',
    
    // Code splitting
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunk
          vendor: ['react', 'react-dom'],
          
          // Components loaded on demand
          tableView: ['./views/TableView'],
          calendarView: ['./views/CalendarView'],
          timelineView: ['./views/TimelineView'],
        },
      },
    },
  },
};
```

### 8.3 Rendering Optimizations

```typescript
// 1. Split content into static and selected areas
function PageContent({ content }: { content: string }) {
  const [selectedBlockIndex, setSelectedBlockIndex] = useState<number | null>(null);
  const blocks = useMemo(() => parseBlocks(content), [content]);
  
  return (
    <div className="page-content">
      {blocks.map((block, index) => (
        index === selectedBlockIndex ? (
          // Editable block (tracked by MutationObserver)
          <EditableBlock key={index} block={block} />
        ) : (
          // Static block (cached, no tracking)
          <StaticBlock key={index} block={block} />
        )
      ))}
    </div>
  );
}

// 2. Content hash for caching
function useBlockCache(content: string) {
  const cache = useRef(new Map<string, HTMLElement>());
  
  return useMemo(() => {
    const hash = generateHash(content);
    
    if (cache.current.has(hash)) {
      return cache.current.get(hash)!;
    }
    
    const element = renderContent(content);
    cache.current.set(hash, element);
    return element;
  }, [content]);
}

// 3. Virtual scrolling for long pages
function VirtualizedPage({ blocks }: { blocks: Block[] }) {
  const { virtualItems, totalHeight } = useVirtualizer({
    count: blocks.length,
    estimateSize: () => 40, // Average block height
    overscan: 5,
  });
  
  return (
    <div style={{ height: totalHeight, position: 'relative' }}>
      {virtualItems.map((virtualRow) => (
        <div
          key={virtualRow.index}
          style={{
            position: 'absolute',
            top: virtualRow.start,
            height: virtualRow.size,
          }}
        >
          <Block block={blocks[virtualRow.index]} />
        </div>
      ))}
    </div>
  );
}
```

### 8.4 CSS Optimizations

```css
/* 1. Use CSS animations for GPU acceleration */
.block-enter {
  animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-4px); }
  to { opacity: 1; transform: translateY(0); }
}

/* 2. Flat class names (BEM or utility) for fast style calculation */
.notion-block { }
.notion-block--heading { }
.notion-block--paragraph { }
.notion-block__content { }

/* 3. Avoid expensive selectors */
/* ❌ Bad */
.page .content .blocks .block:nth-child(odd) { }

/* ✅ Good */
.notion-block--odd { }
```

---

## 9. Accessibility

### 9.1 Semantic HTML

```html
<!-- ✅ Use semantic elements -->
<article class="notion-page">
  <header>
    <h1>Page Title</h1>
  </header>
  
  <main class="page-content">
    <section class="block block-heading">
      <h2>Section Title</h2>
    </section>
    
    <section class="block block-paragraph">
      <p>Paragraph content...</p>
    </section>
    
    <section class="block block-list">
      <ul>
        <li>Item 1</li>
        <li>Item 2</li>
      </ul>
    </section>
  </main>
</article>
```

### 9.2 Keyboard Navigation

```typescript
function useKeyboardNavigation() {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Navigate between blocks
      if (e.key === 'ArrowUp' && e.metaKey) {
        focusPreviousBlock();
      }
      if (e.key === 'ArrowDown' && e.metaKey) {
        focusNextBlock();
      }
      
      // Create new block
      if (e.key === 'Enter' && !e.shiftKey) {
        createNewBlock();
      }
      
      // Delete block
      if (e.key === 'Backspace' && isBlockEmpty()) {
        deleteCurrentBlock();
      }
      
      // Quick commands
      if (e.key === '/' && isAtBlockStart()) {
        openCommandPalette();
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);
}
```

### 9.3 Screen Reader Support

```typescript
// Announce changes to screen readers
function announceChange(message: string) {
  const announcer = document.getElementById('sr-announcer');
  if (announcer) {
    announcer.textContent = message;
  }
}

// Usage
function handleBlockCreate() {
  createBlock();
  announceChange('New block created');
}

// HTML
// <div id="sr-announcer" role="status" aria-live="polite" class="sr-only"></div>
```

### 9.4 Visual Accessibility

```css
/* 1. Use rem units for scalability */
.notion-block {
  font-size: 1rem; /* 16px default, scales with browser settings */
  line-height: 1.5;
  padding: 0.5rem;
}

/* 2. High contrast mode support */
@media (prefers-contrast: high) {
  .notion-block {
    border: 2px solid currentColor;
  }
}

/* 3. Reduced motion */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}

/* 4. Focus indicators */
.notion-block:focus {
  outline: 2px solid #0066cc;
  outline-offset: 2px;
}

/* 5. Color schemes for color blindness */
.status-success { border-left: 4px solid; } /* Use patterns, not just colors */
.status-error { border-left: 4px dashed; }
```

---

## Summary

| Section | Key Points |
|---------|------------|
| **Architecture** | MVC-like with Lexer → Parser → Renderer pipeline |
| **Lexer** | Rules-based tokenization of custom markdown |
| **Parser** | Connects tokens with global state |
| **Components** | Visual, Structural, Database types |
| **Database** | Page + Pages + Plugin Data + Views |
| **State** | Normalized, O(1) access, event-based updates |
| **API** | GraphQL with subscriptions for live updates |
| **Offline** | Service worker caching, delta sync |

### Key Challenges

1. **Custom markdown** - Extendable lexer/parser system
2. **Live transformation** - MutationObserver + re-render
3. **Page hierarchy** - Normalized state for nested pages
4. **Database views** - Plugin data per view type
5. **Collaborative editing** - SSE subscriptions, conflict resolution
6. **Performance** - Static/selected area split, caching

---

## Interview Tips

1. **Start with mockup** - Draw the sidebar + content area
2. **Explain the pipeline** - Lexer → Parser → Renderer
3. **Component types** - Visual vs Structural vs Database
4. **Normalized state** - Why it's important for nested pages
5. **Offline first** - Service worker, delta sync
6. **Extensibility** - How to add new components easily

---

## References

- [Notion Engineering Blog](https://www.notion.so/blog/topic/engineering)
- [MutationObserver API](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver)
- [contenteditable](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/contenteditable)
- [GraphQL Subscriptions](https://graphql.org/blog/subscriptions-in-graphql-and-relay/)
- [Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
