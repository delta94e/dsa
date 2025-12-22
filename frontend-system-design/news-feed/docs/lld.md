# News Feed System - Low-Level Design (LLD)

## 1. Overview

This document provides detailed specifications for implementing the News Feed system.

---

## 2. Data Models

### 2.1 User Model

```typescript
interface User {
  id: string;
  name: string;
  username: string;
  avatarUrl: string;
  isVerified?: boolean;
}
```

### 2.2 Post Model

```typescript
interface Post {
  id: string;
  author: User;
  content: string;
  imageUrl?: string;
  createdAt: number;
  reactions: ReactionCounts;
  commentCount: number;
  userReaction?: ReactionType;
}

interface ReactionCounts {
  like: number;
  love: number;
  haha: number;
  wow: number;
  sad: number;
  angry: number;
}

type ReactionType = 'like' | 'love' | 'haha' | 'wow' | 'sad' | 'angry';
```

### 2.3 Comment Model

```typescript
interface Comment {
  id: string;
  postId: string;
  author: User;
  content: string;
  createdAt: number;
  likeCount: number;
  isLiked: boolean;
}
```

### 2.4 Feed State Model

```typescript
interface FeedState {
  posts: Post[];
  pagination: {
    cursor: string | null;
    hasMore: boolean;
  };
  isLoading: boolean;
  isLoadingMore: boolean;
  error: string | null;
}
```

---

## 3. Component Specifications

### 3.1 Feed Component

```typescript
interface FeedProps {
  userId?: string;
}

interface FeedState {
  posts: Post[];
  isLoading: boolean;
  error: string | null;
}

// Lifecycle:
// 1. Mount -> fetchInitialPosts()
// 2. Scroll -> detectScrollPosition() -> fetchMorePosts()
// 3. New post -> prependPost()
```

### 3.2 PostCard Component

```typescript
interface PostCardProps {
  post: Post;
  onReact: (postId: string, type: ReactionType) => void;
  onComment: (postId: string) => void;
  onShare: (postId: string) => void;
}

// Sub-components:
// - PostHeader (author info, timestamp, menu)
// - PostContent (text, media)
// - PostStats (reaction counts, comment count)
// - PostActions (like, comment, share buttons)
```

### 3.3 PostComposer Component

```typescript
interface PostComposerProps {
  currentUser: User;
  onSubmit: (content: string, image?: File) => Promise<void>;
}

interface PostComposerState {
  content: string;
  image: File | null;
  imagePreview: string | null;
  isSubmitting: boolean;
  error: string | null;
}
```

### 3.4 ReactionButton Component

```typescript
interface ReactionButtonProps {
  currentReaction?: ReactionType;
  reactions: ReactionCounts;
  onReact: (type: ReactionType | null) => void;
}

// States:
// - Default (no reaction)
// - Reacted (show current reaction)
// - Picker open (hover/long press)
```

### 3.5 CommentSection Component

```typescript
interface CommentSectionProps {
  postId: string;
  commentCount: number;
  previewComments?: Comment[];
}

// States:
// - Collapsed (show count only)
// - Preview (show 2-3 comments)
// - Expanded (show all with pagination)
```

---

## 4. API Specifications

### 4.1 Fetch Feed

```typescript
// Request
GET /api/feed?cursor={cursor}&limit={limit}

// Response 200 OK
{
  "data": {
    "posts": Post[],
    "pagination": {
      "nextCursor": string | null,
      "hasMore": boolean
    }
  }
}
```

### 4.2 Create Post

```typescript
// Request
POST /api/posts
Content-Type: application/json

{
  "content": string,
  "imageUrl": string | null
}

// Response 201 Created
{
  "data": {
    "post": Post
  }
}
```

### 4.3 React to Post

```typescript
// Add reaction
POST /api/posts/{postId}/reactions
{ "type": ReactionType }

// Remove reaction
DELETE /api/posts/{postId}/reactions

// Response 200 OK
{
  "data": {
    "reactions": ReactionCounts,
    "userReaction": ReactionType | null
  }
}
```

### 4.4 Comments

```typescript
// Fetch comments
GET /api/posts/{postId}/comments?cursor={cursor}&limit={limit}

// Add comment
POST /api/posts/{postId}/comments
{ "content": string }
```

### 4.5 GraphQL Alternative

```graphql
# Feed query with cursor pagination
query FeedQuery($cursor: String, $limit: Int = 10) {
  feed(after: $cursor, first: $limit) {
    edges {
      node {
        id
        content
        createdAt
        author {
          id
          name
          avatarUrl
        }
        reactions {
          like
          love
          haha
        }
        viewerReaction
        commentCount
      }
      cursor
    }
    pageInfo {
      hasNextPage
      endCursor
    }
  }
}

# Mutation with optimistic response
mutation AddReaction($postId: ID!, $type: ReactionType!) {
  addReaction(postId: $postId, type: $type) {
    id
    reactions {
      like
      love
      haha
      wow
      sad
      angry
    }
    viewerReaction
  }
}
```

### 4.6 TanStack Query (React Query v5) Implementation

#### Query Client Setup

```typescript
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,  // 5 minutes
      gcTime: 1000 * 60 * 30,    // 30 minutes
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Feed />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
```

#### Custom Hooks

```typescript
// useFeed.ts
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export function useFeed() {
  return useInfiniteQuery({
    queryKey: ['feed'],
    queryFn: ({ pageParam }) => api.fetchFeed(pageParam),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.pagination.nextCursor,
  });
}

export function useCreatePost() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: api.createPost,
    onSuccess: (newPost) => {
      // Prepend new post to feed
      queryClient.setQueryData(['feed'], (old) => ({
        ...old,
        pages: old.pages.map((page, i) => 
          i === 0 ? { ...page, posts: [newPost, ...page.posts] } : page
        ),
      }));
    },
  });
}

export function useReaction(postId: string) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (type: ReactionType) => api.addReaction(postId, type),
    onMutate: async (type) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['feed'] });
      
      // Snapshot previous value
      const previous = queryClient.getQueryData(['feed']);
      
      // Optimistically update
      queryClient.setQueryData(['feed'], updatePostReaction(postId, type));
      
      return { previous };
    },
    onError: (err, type, context) => {
      // Rollback on error
      queryClient.setQueryData(['feed'], context?.previous);
    },
  });
}
```

---

## 5. State Management

### 5.1 Actions

```typescript
type FeedAction =
  | { type: 'FETCH_FEED_START' }
  | { type: 'FETCH_FEED_SUCCESS'; payload: { posts: Post[]; pagination: Pagination } }
  | { type: 'FETCH_FEED_ERROR'; payload: string }
  | { type: 'FETCH_MORE_START' }
  | { type: 'FETCH_MORE_SUCCESS'; payload: { posts: Post[]; pagination: Pagination } }
  | { type: 'CREATE_POST'; payload: Post }
  | { type: 'UPDATE_POST_REACTION'; payload: { postId: string; reactions: ReactionCounts; userReaction: ReactionType | null } }
  | { type: 'UPDATE_COMMENT_COUNT'; payload: { postId: string; count: number } };
```

### 5.2 Reducer

```typescript
function feedReducer(state: FeedState, action: FeedAction): FeedState {
  switch (action.type) {
    case 'FETCH_FEED_START':
      return { ...state, isLoading: true, error: null };
    case 'FETCH_FEED_SUCCESS':
      return {
        ...state,
        isLoading: false,
        posts: action.payload.posts,
        pagination: action.payload.pagination
      };
    // ... other cases
  }
}
```

---

## 6. Utility Functions

### 6.1 Time Formatting

```typescript
function formatRelativeTime(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d`;
  
  return new Date(timestamp).toLocaleDateString();
}
```

### 6.2 Number Formatting

```typescript
function formatCount(count: number): string {
  if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
  if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
  return count.toString();
}
```

### 6.3 Debounce

```typescript
function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}
```

---

## 7. Error Handling

### 7.1 Error Types

```typescript
enum ErrorType {
  NETWORK = 'NETWORK',
  UNAUTHORIZED = 'UNAUTHORIZED',
  NOT_FOUND = 'NOT_FOUND',
  SERVER = 'SERVER',
  VALIDATION = 'VALIDATION'
}

interface AppError {
  type: ErrorType;
  message: string;
  retryable: boolean;
}
```

### 7.2 Error Recovery

| Error | Action |
|-------|--------|
| Network | Show retry button |
| 401 | Redirect to login |
| 404 | Remove item from list |
| 500 | Show generic error + retry |

---

## 8. Performance Optimizations

### 8.1 Virtualization Strategy

```typescript
interface VirtualListConfig {
  containerHeight: number;
  estimatedItemHeight: number;
  overscan: number; // render extra items above/below
}

// Only render items in viewport + overscan
function getVisibleRange(
  scrollTop: number,
  config: VirtualListConfig,
  itemCount: number
): { start: number; end: number } {
  const start = Math.max(
    0,
    Math.floor(scrollTop / config.estimatedItemHeight) - config.overscan
  );
  const visibleCount = Math.ceil(config.containerHeight / config.estimatedItemHeight);
  const end = Math.min(itemCount - 1, start + visibleCount + config.overscan * 2);
  return { start, end };
}
```

### 8.2 Image Optimization

```typescript
// Lazy load images with Intersection Observer
function useLazyImage(src: string): { loaded: boolean; error: boolean } {
  const [state, setState] = useState({ loaded: false, error: false });
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && imgRef.current) {
        imgRef.current.src = src;
        observer.disconnect();
      }
    });
    
    if (imgRef.current) observer.observe(imgRef.current);
    return () => observer.disconnect();
  }, [src]);

  return state;
}
```

### 8.3 Code Splitting (Facebook's 3-Tier Approach)

Facebook loads JavaScript in 3 tiers for optimal performance:

| Tier | When Loaded | Contents |
|------|-------------|----------|
| **Tier 1** | First paint | Basic layout, skeleton UI, critical CSS |
| **Tier 2** | After first paint | Fully render above-the-fold content |
| **Tier 3** | On idle/demand | Logging, analytics, live updates, modals |

#### Implementation with React.lazy

```typescript
// Tier 3: Lazy load non-critical components
const ReactionPicker = React.lazy(() => import('./ReactionPicker'));
const ShareModal = React.lazy(() => import('./ShareModal'));
const EmojiPicker = React.lazy(() => import('./EmojiPicker'));

// Usage with Suspense
function PostActions({ post }) {
  const [showPicker, setShowPicker] = useState(false);
  
  return (
    <>
      <button onClick={() => setShowPicker(true)}>React</button>
      
      {showPicker && (
        <Suspense fallback={<div className="picker-skeleton" />}>
          <ReactionPicker post={post} />
        </Suspense>
      )}
    </>
  );
}
```

#### Route-based Code Splitting

```typescript
// Split by route
const FeedPage = React.lazy(() => import('./pages/Feed'));
const ProfilePage = React.lazy(() => import('./pages/Profile'));
const SettingsPage = React.lazy(() => import('./pages/Settings'));

function App() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <Routes>
        <Route path="/" element={<FeedPage />} />
        <Route path="/profile/:id" element={<ProfilePage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </Suspense>
  );
}
```

### 8.4 Caching Strategy

#### Cache Service Implementation

```typescript
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time-to-live in milliseconds
}

class CacheService {
  private cache = new Map<string, CacheEntry<unknown>>();
  private maxSize = 100;

  get<T>(key: string): T | null {
    const entry = this.cache.get(key) as CacheEntry<T> | undefined;
    if (!entry) return null;

    // Check if expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  set<T>(key: string, data: T, ttl = 300000): void {
    // LRU eviction when max size reached
    if (this.cache.size >= this.maxSize) {
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey) this.cache.delete(oldestKey);
    }

    this.cache.set(key, { data, timestamp: Date.now(), ttl });
  }

  invalidatePattern(pattern: string): void {
    for (const key of this.cache.keys()) {
      if (key.includes(pattern)) {
        this.cache.delete(key);
      }
    }
  }
}
```

#### Cache Keys Strategy

| Resource | Cache Key | TTL |
|----------|-----------|-----|
| Feed | `feed:${userId}:${cursor}` | 5 minutes |
| User profile | `user:${userId}` | 30 minutes |
| Post details | `post:${postId}` | 10 minutes |
| Comments | `comments:${postId}:${cursor}` | 2 minutes |

#### Stale-While-Revalidate Pattern

```typescript
async function fetchWithCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  options: { ttl?: number; staleWhileRevalidate?: boolean } = {}
): Promise<T> {
  const { ttl = 300000, staleWhileRevalidate = true } = options;
  
  const cached = cache.get<T>(key);
  
  if (cached) {
    if (staleWhileRevalidate) {
      // Return cached data immediately, refresh in background
      fetcher().then(data => cache.set(key, data, ttl));
    }
    return cached;
  }

  const data = await fetcher();
  cache.set(key, data, ttl);
  return data;
}
```

### 8.5 StyleX (Meta's Styling Solution)

> Meta uses **StyleX** across Facebook, Instagram, WhatsApp, Messenger, and Threads. It's an atomic CSS-in-JS solution that compiles to static CSS.

#### Why StyleX?

| Problem with Traditional CSS | StyleX Solution |
|------------------------------|-----------------|
| Namespace collisions | Atomic classes with unique hashes |
| Specificity wars | "Last style wins" predictable merge |
| Large CSS bundles | 80% reduction via atomic deduplication |
| Runtime performance | Static compilation, no runtime injection |

#### Basic Usage

```typescript
import * as stylex from '@stylexjs/stylex';

const styles = stylex.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    padding: 16,
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'var(--text-primary)',
  },
  // Dynamic styles
  card: (isHovered: boolean) => ({
    backgroundColor: isHovered ? 'var(--bg-hover)' : 'var(--bg-secondary)',
    transform: isHovered ? 'translateY(-2px)' : 'none',
  }),
});

function PostCard({ post, isHovered }) {
  return (
    <article {...stylex.props(styles.container, styles.card(isHovered))}>
      <h3 {...stylex.props(styles.header)}>{post.author.name}</h3>
    </article>
  );
}
```

#### Theming with CSS Variables

```typescript
// tokens.stylex.ts
import * as stylex from '@stylexjs/stylex';

export const colors = stylex.defineVars({
  primary: '#2d88ff',
  bgPrimary: '#18191a',
  bgSecondary: '#242526',
  textPrimary: '#e4e6eb',
  textSecondary: '#b0b3b8',
});

export const spacing = stylex.defineVars({
  sm: '8px',
  md: '16px',
  lg: '24px',
});

// Dark theme override
export const lightTheme = stylex.createTheme(colors, {
  bgPrimary: '#ffffff',
  bgSecondary: '#f0f2f5',
  textPrimary: '#1c1e21',
  textSecondary: '#65676b',
});
```

#### Comparison: StyleX vs Other Solutions

| Feature | CSS Modules | Tailwind | Styled-Components | StyleX |
|---------|-------------|----------|-------------------|--------|
| Bundle size | Medium | Small | Large | Smallest |
| Runtime cost | None | None | High | None |
| Type safety | Limited | Limited | Good | Excellent |
| Theming | Manual | Config | Runtime | Static vars |
| Used by | Many | Many | Many | Meta |

### 8.6 Lexical (Meta's Rich Text Editor)

> Meta uses **Lexical** for post composers and comments. It's a successor to Draft.js with better performance and extensibility.

#### Why Lexical?

- **Extensible**: Plugin-based architecture for mentions, hashtags, emojis
- **Performance**: Virtual DOM-like diffing for editor state
- **Accessibility**: Built-in screen reader support
- **Framework-agnostic**: Works with React, Vue, vanilla JS

#### Post Composer with Lexical

```typescript
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { PlainTextPlugin } from '@lexical/react/LexicalPlainTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { MentionNode } from './nodes/MentionNode';
import { HashtagNode } from './nodes/HashtagNode';
import { MentionsPlugin } from './plugins/MentionsPlugin';
import { HashtagsPlugin } from './plugins/HashtagsPlugin';

const editorConfig = {
  namespace: 'PostComposer',
  theme: {
    paragraph: 'editor-paragraph',
    hashtag: 'editor-hashtag',
    mention: 'editor-mention',
  },
  nodes: [MentionNode, HashtagNode],
  onError: (error: Error) => console.error(error),
};

function PostComposer({ onSubmit }) {
  const [editorState, setEditorState] = useState(null);

  return (
    <LexicalComposer initialConfig={editorConfig}>
      <div className="post-composer">
        <PlainTextPlugin
          contentEditable={<ContentEditable className="editor-input" />}
          placeholder={<div className="editor-placeholder">What's on your mind?</div>}
        />
        <HistoryPlugin />
        <MentionsPlugin />
        <HashtagsPlugin />
        <OnChangePlugin onChange={setEditorState} />
      </div>
    </LexicalComposer>
  );
}
```

#### Custom Mention Node

```typescript
import { DecoratorNode } from 'lexical';

export class MentionNode extends DecoratorNode<JSX.Element> {
  __mention: string;
  __userId: string;

  static getType(): string {
    return 'mention';
  }

  static clone(node: MentionNode): MentionNode {
    return new MentionNode(node.__mention, node.__userId, node.__key);
  }

  constructor(mention: string, userId: string, key?: NodeKey) {
    super(key);
    this.__mention = mention;
    this.__userId = userId;
  }

  createDOM(): HTMLElement {
    const span = document.createElement('span');
    span.className = 'editor-mention';
    return span;
  }

  decorate(): JSX.Element {
    return (
      <a href={`/profile/${this.__userId}`} className="mention-link">
        @{this.__mention}
      </a>
    );
  }

  exportJSON() {
    return {
      type: 'mention',
      mention: this.__mention,
      userId: this.__userId,
      version: 1,
    };
  }
}
```

#### Editor State for Rich Content

```typescript
// Storing post content with mentions/hashtags
interface RichPostContent {
  // Lexical editor state (JSON serializable)
  editorState: SerializedEditorState;
  // Extracted entities for backend processing
  mentions: Array<{ userId: string; offset: number }>;
  hashtags: Array<{ tag: string; offset: number }>;
  // Plain text for search indexing
  plainText: string;
}

// Serialize editor state for API
function serializePost(editorState: EditorState): RichPostContent {
  const json = editorState.toJSON();
  const mentions = extractMentions(json);
  const hashtags = extractHashtags(json);
  const plainText = editorState.read(() => $getRoot().getTextContent());

  return { editorState: json, mentions, hashtags, plainText };
}
```

---

## 9. Accessibility

### 9.1 ARIA Roles

| Element | Role | Purpose |
|---------|------|---------|
| Feed container | `role="feed"` | Indicates scrollable article list |
| Post | `role="article"` | Semantic article element |
| Actions group | `role="group"` | Groups related buttons |
| Reaction picker | `role="listbox"` | Selection interface |
| Reaction options | `role="option"` | Selectable items |

### 9.2 ARIA Attributes

```html
<!-- Feed container -->
<div role="feed" aria-busy="false" aria-label="News feed">

<!-- Post article -->
<article role="article" aria-labelledby="post-{id}-author">
  <header>
    <h3 id="post-{id}-author">{author.name}</h3>
  </header>
</article>

<!-- Reaction button (Facebook pattern) -->
<button
  aria-label="Like this post"
  aria-pressed="{hasReacted}"
  aria-haspopup="listbox"
  aria-expanded="{isPickerOpen}"
>
  Like
</button>

<!-- Reaction picker -->
<div role="listbox" aria-label="Choose a reaction">
  <button role="option" aria-selected="true" aria-label="Like">👍</button>
  <button role="option" aria-selected="false" aria-label="Love">❤️</button>
</div>
```

### 9.3 Keyboard Navigation

| Key | Action |
|-----|--------|
| Tab | Navigate between interactive elements |
| Enter/Space | Activate buttons |
| Escape | Close reaction picker/modals |
| Arrow keys | Navigate reaction options |
| J/K | Navigate between posts (Facebook shortcut) |
| L | Like current post (Facebook shortcut) |

### 9.4 Focus Management

```typescript
// Return focus after closing picker
const handleCloseReactionPicker = () => {
  setShowPicker(false);
  likeButtonRef.current?.focus(); // Return focus to trigger
};

// Focus first option when picker opens
useEffect(() => {
  if (showPicker) {
    firstOptionRef.current?.focus();
  }
}, [showPicker]);
```

### 9.5 Screen Reader Announcements

```typescript
// Announce reaction changes
<div role="status" aria-live="polite" className="sr-only">
  {announcement}
</div>

// Usage
setAnnouncement(`You reacted with ${reactionLabel}`);
```

---

## 10. File Structure

```
src/
├── components/
│   ├── Feed/
│   │   ├── Feed.tsx
│   │   ├── Feed.module.css
│   │   └── index.ts
│   ├── Post/
│   │   ├── PostCard.tsx
│   │   ├── PostHeader.tsx
│   │   ├── PostContent.tsx
│   │   ├── PostActions.tsx
│   │   └── index.ts
│   ├── PostComposer/
│   ├── Comment/
│   └── shared/
├── hooks/
│   ├── useFeed.ts
│   ├── useInfiniteScroll.ts
│   └── useLazyImage.ts
├── services/
│   └── api.ts
├── store/
│   ├── feedContext.tsx
│   └── feedReducer.ts
├── types/
│   └── index.ts
└── utils/
    ├── formatters.ts
    └── helpers.ts
```
