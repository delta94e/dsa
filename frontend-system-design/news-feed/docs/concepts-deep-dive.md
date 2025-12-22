# News Feed System Design - Concepts Deep Dive

> A comprehensive guide to all the concepts, techniques, and best practices for building a production-ready news feed application, based on how Facebook, Twitter, and Instagram implement theirs.

---

## Table of Contents

1. [Rendering Approaches](#1-rendering-approaches)
2. [Data Store Patterns](#2-data-store-patterns)
3. [Pagination Strategies](#3-pagination-strategies)
4. [Infinite Scrolling](#4-infinite-scrolling)
5. [Virtualized Lists](#5-virtualized-lists)
6. [Optimistic Updates](#6-optimistic-updates)
7. [Image Optimization](#7-image-optimization)
8. [Rich Text Editing](#8-rich-text-editing)
9. [Live Updates](#9-live-updates)
10. [Code Splitting](#10-code-splitting)
11. [Caching Strategies](#11-caching-strategies)
12. [Accessibility](#12-accessibility)
13. [CSS at Scale](#13-css-at-scale)
14. [Data Fetching Libraries](#14-data-fetching-libraries)

---

## 1. Rendering Approaches

### The Problem
How do we render content to users in the most performant way?

### Server-Side Rendering (SSR)

**How it works:** HTML is generated on the server and sent to the browser as a complete page.

```
User Request → Server generates HTML → Browser displays HTML
```

**Pros:**
- Fast First Contentful Paint (FCP)
- Better SEO (search engines can crawl content)
- Works without JavaScript

**Cons:**
- Slower Time to Interactive (TTI)
- Full page reloads for navigation
- Server load increases with traffic

**Best for:** Blogs, e-commerce, documentation sites

### Client-Side Rendering (CSR)

**How it works:** Browser downloads minimal HTML + JavaScript, then JavaScript renders the content.

```
User Request → Server sends skeleton HTML + JS → JS fetches data → JS renders content
```

**Pros:**
- Rich interactivity after initial load
- Smooth navigation (no full reloads)
- Reduced server load

**Cons:**
- Slower FCP (blank screen while JS loads)
- Poor SEO without additional work
- Requires JavaScript to function

**Best for:** Dashboards, chat apps, admin panels

### Hybrid Approach (SSR + CSR)

**How Facebook does it:**

1. **Initial load:** SSR renders the first screen with skeleton UI
2. **Hydration:** JavaScript attaches event listeners
3. **Subsequent actions:** CSR handles interactions and navigation

```typescript
// Next.js example of hybrid approach
export async function getServerSideProps() {
  const feed = await fetchInitialFeed();
  return { props: { initialFeed: feed } };
}

function FeedPage({ initialFeed }) {
  const [feed, setFeed] = useState(initialFeed);
  
  // After initial render, use CSR for more posts
  const loadMore = async () => {
    const morePosts = await fetchMorePosts(feed.cursor);
    setFeed(prev => ({ ...prev, posts: [...prev.posts, ...morePosts] }));
  };
  
  return <Feed posts={feed.posts} onLoadMore={loadMore} />;
}
```

---

## 2. Data Store Patterns

### Denormalized Store (Simple)

Store data exactly as received from the server:

```typescript
interface FeedStore {
  posts: Array<{
    id: string;
    content: string;
    author: { id: string; name: string; avatar: string }; // Nested
  }>;
}
```

**Problem:** If user "John" has 50 posts, his author data is duplicated 50 times.

### Normalized Store (Advanced)

Store data like a database with foreign keys:

```typescript
interface NormalizedStore {
  users: {
    'user_1': { id: 'user_1', name: 'John', avatar: '...' },
    'user_2': { id: 'user_2', name: 'Jane', avatar: '...' },
  };
  posts: {
    'post_1': { id: 'post_1', content: '...', authorId: 'user_1' },
    'post_2': { id: 'post_2', content: '...', authorId: 'user_1' },
    'post_3': { id: 'post_3', content: '...', authorId: 'user_2' },
  };
  feed: ['post_1', 'post_2', 'post_3']; // Order preserved
}
```

**Benefits:**
- Single source of truth for each entity
- Easy updates (change user name once, reflects everywhere)
- Smaller memory footprint

**Who uses it:**
- **Facebook:** Relay (with GraphQL)
- **Twitter:** Redux with normalizr

**When to use:** Complex apps with lots of related, duplicated data.

---

## 3. Pagination Strategies

### Offset-Based Pagination

```
GET /feed?page=2&size=10
```

**SQL:**
```sql
SELECT * FROM posts LIMIT 10 OFFSET 10;
```

**The Duplicate Problem:**

```
Time 0: Posts A, B, C, D, E exist
        User fetches page 1 → Gets A, B, C, D, E

Time 1: New posts K, L, M, N, O added
        Posts: K, L, M, N, O, A, B, C, D, E
        User fetches page 2 → Gets A, B, C, D, E again! ❌
```

### Cursor-Based Pagination

```
GET /feed?cursor=post_E_id&size=10
```

**SQL:**
```sql
SELECT * FROM posts WHERE id < 'post_E_id' LIMIT 10;
```

**No duplicates:**
```
Time 0: Posts A, B, C, D, E exist
        User fetches → Gets A, B, C, D, E, cursor points to E

Time 1: New posts K, L, M, N, O added
        Posts: K, L, M, N, O, A, B, C, D, E
        User fetches with cursor=E → Gets F, G, H, I, J ✅
```

### Comparison

| Aspect | Offset | Cursor |
|--------|--------|--------|
| Jump to page | ✅ Yes | ❌ No |
| Real-time data | ❌ Issues | ✅ Works |
| Performance | ❌ Degrades | ✅ Constant |
| Dynamic page size | ❌ Problems | ✅ Works |

**Conclusion:** Use cursor-based for feeds.

---

## 4. Infinite Scrolling

### Implementation Options

#### Option 1: Scroll Event Listener

```typescript
useEffect(() => {
  const handleScroll = throttle(() => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    const threshold = 200; // pixels from bottom
    
    if (scrollHeight - scrollTop - clientHeight < threshold) {
      loadMore();
    }
  }, 100);
  
  window.addEventListener('scroll', handleScroll);
  return () => window.removeEventListener('scroll', handleScroll);
}, [loadMore]);
```

**Cons:** Runs on main thread, can cause jank

#### Option 2: Intersection Observer (Recommended)

```typescript
function useInfiniteScroll(callback: () => void) {
  const ref = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          callback();
        }
      },
      { rootMargin: '200px' } // Trigger 200px before
    );
    
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [callback]);
  
  return ref;
}

// Usage
function Feed() {
  const sentinelRef = useInfiniteScroll(loadMore);
  
  return (
    <>
      {posts.map(post => <PostCard key={post.id} post={post} />)}
      <div ref={sentinelRef} /> {/* Invisible sentinel */}
    </>
  );
}
```

**Pros:** Browser optimized, off main thread

### Prefetching

Load next page BEFORE user reaches bottom:

```typescript
const PREFETCH_THRESHOLD = 0.7; // 70% scrolled

useEffect(() => {
  const scrollPercent = scrollY / (scrollHeight - viewportHeight);
  
  if (scrollPercent > PREFETCH_THRESHOLD && !prefetched) {
    prefetchNextPage(); // Background fetch
  }
}, [scrollY]);
```

---

## 5. Virtualized Lists

### The Problem

User scrolls through 1000 posts → 1000 DOM nodes → Performance issues:
- High memory usage
- Slow React reconciliation
- Janky scrolling

### The Solution

Only render posts visible in viewport + small buffer.

### Facebook's Technique

Facebook doesn't remove off-screen posts entirely. They:

1. **Measure** post height when visible
2. **Replace** content with empty `<div>` when off-screen
3. **Set** inline height to preserve scroll position
4. **Add** `hidden` attribute

```typescript
function VirtualizedPost({ post, isVisible }) {
  const [height, setHeight] = useState(0);
  const ref = useRef();

  // Measure when visible
  useLayoutEffect(() => {
    if (isVisible && ref.current) {
      setHeight(ref.current.offsetHeight);
    }
  }, [isVisible]);

  if (!isVisible && height > 0) {
    // Off-screen: placeholder
    return <div style={{ height }} hidden aria-hidden="true" />;
  }

  return (
    <article ref={ref}>
      <PostCard post={post} />
    </article>
  );
}
```

### Visibility Detection

```typescript
function useVisibility(ref: RefObject<HTMLElement>) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { rootMargin: '100px' } // Buffer
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return isVisible;
}
```

### Libraries

- **react-window** - Lightweight, for fixed-height items
- **react-virtuoso** - Variable height, feature-rich
- **@tanstack/react-virtual** - Headless, framework agnostic

---

## 6. Optimistic Updates

### The Problem

```
User clicks Like → Wait for API → Show result
```

Feels slow! User waits 200-500ms for feedback.

### The Solution

```
User clicks Like → Show result immediately → Call API → Revert if fails
```

### Implementation

```typescript
function useLikePost() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (postId: string) => api.likePost(postId),
    
    // Optimistic update
    onMutate: async (postId) => {
      // Cancel in-flight queries
      await queryClient.cancelQueries(['feed']);
      
      // Snapshot current state
      const previous = queryClient.getQueryData(['feed']);
      
      // Optimistically update
      queryClient.setQueryData(['feed'], (old) => ({
        ...old,
        posts: old.posts.map(post => 
          post.id === postId 
            ? { ...post, isLiked: true, likeCount: post.likeCount + 1 }
            : post
        )
      }));
      
      return { previous };
    },
    
    // Rollback on error
    onError: (err, postId, context) => {
      queryClient.setQueryData(['feed'], context.previous);
      toast.error('Failed to like post');
    },
    
    // Refresh after mutation
    onSettled: () => {
      queryClient.invalidateQueries(['feed']);
    },
  });
}
```

---

## 7. Image Optimization

### CDN (Content Delivery Network)

Serve images from servers geographically close to users:

```typescript
const getImageUrl = (originalUrl: string, width: number) => {
  return `https://cdn.example.com/resize?url=${encodeURIComponent(originalUrl)}&w=${width}`;
};
```

### Modern Formats (WebP)

WebP provides 25-35% better compression than JPEG/PNG:

```html
<picture>
  <source srcset="image.webp" type="image/webp" />
  <source srcset="image.jpg" type="image/jpeg" />
  <img src="image.jpg" alt="Post image" />
</picture>
```

### Responsive Images (srcset)

Load appropriate size based on screen:

```html
<img
  src="image-400.jpg"
  srcset="
    image-400.jpg 400w,
    image-800.jpg 800w,
    image-1200.jpg 1200w
  "
  sizes="(max-width: 600px) 400px, 800px"
  alt="Post image"
  loading="lazy"
/>
```

### Network-Adaptive Loading

Check network speed and adjust quality:

```typescript
function useAdaptiveImage(src: string) {
  const [quality, setQuality] = useState<'high' | 'low'>('high');

  useEffect(() => {
    const connection = (navigator as any).connection;
    if (connection?.effectiveType === '2g' || connection?.saveData) {
      setQuality('low');
    }
  }, []);

  return quality === 'low' ? `${src}?quality=low` : src;
}
```

### Lazy Loading

Only load images when they're about to enter viewport:

```typescript
function LazyImage({ src, alt }: { src: string; alt: string }) {
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        imgRef.current!.src = src;
        observer.disconnect();
      }
    });

    observer.observe(imgRef.current!);
    return () => observer.disconnect();
  }, [src]);

  return (
    <img
      ref={imgRef}
      alt={alt}
      onLoad={() => setLoaded(true)}
      className={loaded ? 'loaded' : 'loading'}
    />
  );
}
```

---

## 8. Rich Text Editing

### The Problem

`<input>` and `<textarea>` only support plain text. How do we render mentions, hashtags, and formatting?

### Option 1: contenteditable

```html
<div contenteditable="true">
  Hello <a href="/user/123">@John</a>! Check out #ReactJS
</div>
```

**Cons:** Browser inconsistencies, hard to control, XSS risks

### Option 2: Lexical (Recommended)

Meta's modern rich text editor framework:

```typescript
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { MentionNode } from './MentionNode';
import { HashtagNode } from './HashtagNode';
import { MentionsPlugin } from './MentionsPlugin';

const config = {
  namespace: 'PostComposer',
  nodes: [MentionNode, HashtagNode],
  theme: {
    mention: 'text-blue-500 font-medium',
    hashtag: 'text-blue-600',
  },
};

function PostComposer() {
  return (
    <LexicalComposer initialConfig={config}>
      <RichTextPlugin
        contentEditable={<ContentEditable className="editor" />}
        placeholder={<div className="placeholder">What's on your mind?</div>}
      />
      <MentionsPlugin />
      <HashtagsPlugin />
    </LexicalComposer>
  );
}
```

### Storing Rich Content

Two approaches:

**1. Custom Syntax (Lightweight):**
```
Hello [[user:123:John]]! Check out #ReactJS
```

**2. JSON AST (Extensible):**
```json
{
  "type": "root",
  "children": [
    { "type": "text", "text": "Hello " },
    { "type": "mention", "userId": "123", "name": "John" },
    { "type": "text", "text": "! Check out " },
    { "type": "hashtag", "tag": "ReactJS" }
  ]
}
```

---

## 9. Live Updates

### The Options

| Method | Latency | Complexity | Use Case |
|--------|---------|------------|----------|
| Short Polling | High | Low | Simple apps |
| Long Polling | Medium | Medium | Moderate traffic |
| SSE | Low | Medium | Server-initiated updates |
| WebSocket | Very Low | High | Real-time apps |

### WebSocket Implementation

```typescript
function usePostUpdates(postId: string, isVisible: boolean) {
  const [updates, setUpdates] = useState<Update[]>([]);

  useEffect(() => {
    if (!isVisible) return; // Don't subscribe if off-screen

    const ws = new WebSocket(`wss://api.example.com/posts/${postId}/updates`);

    ws.onmessage = (event) => {
      const update = JSON.parse(event.data);
      setUpdates(prev => [...prev, update]);
    };

    return () => ws.close(); // Unsubscribe when off-screen
  }, [postId, isVisible]);

  return updates;
}
```

### Throttling for Popular Posts

Celebrity posts get thousands of comments/reactions per minute. Don't update UI for each one:

```typescript
const POPULAR_THRESHOLD = 10000; // followers

function useThrottledUpdates(postId: string, followerCount: number) {
  const isPopular = followerCount > POPULAR_THRESHOLD;

  if (isPopular) {
    // Batch updates every 10 seconds
    return useThrottledSubscription(postId, 10000);
  }
  
  // Real-time for regular posts
  return useRealtimeSubscription(postId);
}
```

---

## 10. Code Splitting

### Facebook's 3-Tier Loading

| Tier | When | What |
|------|------|------|
| 1 | First paint | Layout skeleton, critical CSS |
| 2 | After first paint | Above-fold content |
| 3 | On idle/demand | Analytics, modals, pickers |

### React.lazy for On-Demand Loading

```typescript
// Tier 3: Load only when needed
const ReactionPicker = React.lazy(() => import('./ReactionPicker'));
const ShareModal = React.lazy(() => import('./ShareModal'));
const EmojiPicker = React.lazy(() => import('./EmojiPicker'));

function PostActions({ post }) {
  const [showPicker, setShowPicker] = useState(false);

  return (
    <>
      <button onMouseEnter={() => setShowPicker(true)}>React</button>
      
      {showPicker && (
        <Suspense fallback={<PickerSkeleton />}>
          <ReactionPicker post={post} />
        </Suspense>
      )}
    </>
  );
}
```

### Data-Driven Dependencies (Relay)

Load component code WITH the data:

```graphql
fragment PostContent on Post {
  ... on ImagePost {
    @module('ImagePostComponent')
    imageUrl
    dimensions
  }
  ... on VideoPost {
    @module('VideoPostComponent')
    videoUrl
    thumbnail
  }
  ... on PollPost {
    @module('PollPostComponent')
    question
    options
  }
}
```

No need to load code for 50+ post types upfront!

---

## 11. Caching Strategies

### In-Memory Cache with TTL

```typescript
class CacheService {
  private cache = new Map<string, { data: any; expires: number }>();

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry || Date.now() > entry.expires) {
      this.cache.delete(key);
      return null;
    }
    return entry.data;
  }

  set<T>(key: string, data: T, ttlMs = 300000): void {
    this.cache.set(key, { data, expires: Date.now() + ttlMs });
  }
}
```

### Stale-While-Revalidate

Return cached data immediately, refresh in background:

```typescript
async function fetchWithSWR<T>(
  key: string,
  fetcher: () => Promise<T>
): Promise<T> {
  const cached = cache.get<T>(key);
  
  if (cached) {
    // Return immediately, refresh in background
    fetcher().then(data => cache.set(key, data));
    return cached;
  }
  
  const data = await fetcher();
  cache.set(key, data);
  return data;
}
```

### Cache Keys Strategy

| Resource | Key | TTL |
|----------|-----|-----|
| Feed | `feed:${userId}:${cursor}` | 5 min |
| Post | `post:${postId}` | 10 min |
| User | `user:${userId}` | 30 min |
| Comments | `comments:${postId}:${cursor}` | 2 min |

---

## 12. Accessibility

### Feed Container

```html
<div role="feed" aria-busy="false" aria-label="News feed">
  <!-- Posts -->
</div>
```

### Post Article

```html
<article role="article" aria-labelledby="post-123-author">
  <header>
    <h3 id="post-123-author">John Doe</h3>
    <time datetime="2024-01-15T10:30:00Z">2 hours ago</time>
  </header>
  <p>Post content...</p>
</article>
```

### Reaction Button

```html
<button
  aria-label="Like this post by John Doe"
  aria-pressed="false"
  aria-haspopup="listbox"
  aria-expanded="false"
>
  👍 Like
</button>
```

### Keyboard Navigation

```typescript
const SHORTCUTS = {
  'j': 'Next post',
  'k': 'Previous post',
  'l': 'Like post',
  'c': 'Comment',
  'enter': 'Open post',
  'escape': 'Close modal',
  'shift+?': 'Show shortcuts',
};

function useKeyboardNavigation() {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      
      switch (e.key) {
        case 'j': focusNextPost(); break;
        case 'k': focusPrevPost(); break;
        case 'l': likeCurrentPost(); break;
      }
    };
    
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);
}
```

---

## 13. CSS at Scale

### The Problem

Large apps face:
- Namespace collisions
- Specificity wars
- Giant CSS bundles
- Unpredictable overrides

### StyleX (Meta's Solution)

Atomic CSS-in-JS that compiles to static CSS:

```typescript
import * as stylex from '@stylexjs/stylex';

const styles = stylex.create({
  container: {
    display: 'flex',
    padding: 16,
    backgroundColor: 'var(--bg-primary)',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

function Component() {
  return (
    <div {...stylex.props(styles.container)}>
      <h1 {...stylex.props(styles.title)}>Hello</h1>
    </div>
  );
}

// Compiles to:
// .x1 { display: flex }
// .x2 { padding: 16px }
// .x3 { background-color: var(--bg-primary) }
// .x4 { font-size: 18px }
// .x5 { font-weight: bold }
```

**Benefits:**
- 80% CSS size reduction
- No runtime cost
- "Last style wins" - predictable merging
- Full TypeScript support

---

## 14. Data Fetching Libraries

### TanStack Query (React Query)

```typescript
// Setup
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 30 * 60 * 1000,
    },
  },
});

// Infinite Query for Feed
function useFeed() {
  return useInfiniteQuery({
    queryKey: ['feed'],
    queryFn: ({ pageParam }) => api.fetchFeed(pageParam),
    initialPageParam: null,
    getNextPageParam: (lastPage) => lastPage.cursor,
  });
}

// Mutation with Optimistic Update
function useLikePost() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: api.likePost,
    onMutate: optimisticUpdate,
    onError: rollback,
    onSettled: invalidate,
  });
}
```

### Comparison

| Feature | Manual State | TanStack Query | Relay |
|---------|--------------|----------------|-------|
| Caching | DIY | ✅ Built-in | ✅ Built-in |
| Deduplication | DIY | ✅ Built-in | ✅ Built-in |
| Optimistic Updates | DIY | ✅ Built-in | ✅ Built-in |
| Normalized Cache | DIY | ❌ No | ✅ Yes |
| GraphQL Support | ❌ | ❌ | ✅ Native |
| Bundle Size | 0 | ~13KB | ~30KB |

---

## Summary

Building a production news feed requires mastery of:

1. **Rendering:** Hybrid SSR + CSR for best performance
2. **Data:** Normalized stores for complex apps
3. **Pagination:** Cursor-based for real-time data
4. **Performance:** Virtualization, lazy loading, prefetching
5. **UX:** Optimistic updates, skeleton loading
6. **Images:** CDN, WebP, srcset, lazy loading
7. **Rich Text:** Lexical for mentions/hashtags
8. **Real-time:** WebSocket with smart subscribe/unsubscribe
9. **Code:** 3-tier loading, React.lazy
10. **Caching:** SWR pattern, TTL-based expiration
11. **A11y:** ARIA roles, keyboard navigation
12. **CSS:** Atomic CSS (StyleX) for scale
13. **Data Fetching:** TanStack Query or Relay

---

## References

- [Rebuilding our tech stack for the new Facebook.com](https://engineering.fb.com/2020/05/08/web/facebook-redesign/)
- [Making Facebook.com accessible to as many people as possible](https://engineering.fb.com/2020/07/30/web/facebook-com-accessibility/)
- [StyleX Documentation](https://stylexjs.com)
- [Lexical Documentation](https://lexical.dev)
- [TanStack Query Documentation](https://tanstack.com/query/latest)
- [Relay Documentation](https://relay.dev)
- [Evolving API Pagination at Slack](https://slack.engineering/evolving-api-pagination-at-slack/)
- [Making Instagram.com faster](https://instagram-engineering.com/making-instagram-com-faster-part-1-62cc0c327538)
