# Netflix - Concepts Deep Dive

> A detailed exploration of the advanced concepts used in building a streaming platform.

---

## Table of Contents

1. [Normalized State Management](#1-normalized-state-management)
2. [Adaptive Bitrate Streaming](#2-adaptive-bitrate-streaming)
3. [Image/Video CDN Optimizer](#3-imagevideo-cdn-optimizer)
4. [SSR for Critical Pages](#4-ssr-for-critical-pages)
5. [Hover Preview with Lazy Loading](#5-hover-preview-with-lazy-loading)
6. [Service Worker for Offline](#6-service-worker-for-offline)

---

## 1. Normalized State Management

### The Problem

```typescript
// ❌ Nested/denormalized structure
const state = {
  sections: [
    {
      name: 'My List',
      movies: [
        { id: '1', title: 'Stranger Things', ... },
        { id: '2', title: 'Dark', ... },
      ]
    },
    {
      name: 'Action',
      movies: [
        { id: '1', title: 'Stranger Things', ... }, // DUPLICATE!
        { id: '3', title: 'John Wick', ... },
      ]
    }
  ]
};

// Problems:
// 1. Same movie duplicated across sections
// 2. Updating movie requires updating all copies
// 3. More memory usage
// 4. Complex update logic
```

### Normalized Solution

```typescript
// ✅ Normalized structure
interface NormalizedState {
  // Entities by ID
  movies: Record<string, Movie>;
  episodes: Record<string, Episode>;
  
  // References only
  sections: Record<string, string[]>; // section → movieIds
  search: string[];                    // movieIds
  promo: string;                       // movieId
}

const state: NormalizedState = {
  movies: {
    '1': { id: '1', title: 'Stranger Things', ... },
    '2': { id: '2', title: 'Dark', ... },
    '3': { id: '3', title: 'John Wick', ... },
  },
  episodes: {},
  sections: {
    'My List': ['1', '2'],
    'Action': ['1', '3'],    // Same movie ID, no duplication!
  },
  search: [],
  promo: '1',
};
```

### Implementation

```typescript
// Normalize API response
function normalizeDashboard(response: DashboardResponse): NormalizedState {
  const movies: Record<string, Movie> = {};
  const sections: Record<string, string[]> = {};
  
  // Normalize promo
  movies[response.promo.id] = response.promo;
  
  // Normalize sections
  for (const [sectionName, movieList] of Object.entries(response.sections)) {
    sections[sectionName] = [];
    
    for (const movie of movieList) {
      movies[movie.id] = movie; // Stored once
      sections[sectionName].push(movie.id); // Reference only
    }
  }
  
  return {
    movies,
    episodes: {},
    sections,
    search: [],
    promo: response.promo.id,
  };
}

// Selectors to denormalize for components
function getSectionMovies(state: NormalizedState, section: string): Movie[] {
  const movieIds = state.sections[section] || [];
  return movieIds.map(id => state.movies[id]).filter(Boolean);
}

function getMovieById(state: NormalizedState, id: string): Movie | undefined {
  return state.movies[id];
}

// Update a movie - affects ALL sections automatically
function updateMovie(state: NormalizedState, id: string, updates: Partial<Movie>) {
  return {
    ...state,
    movies: {
      ...state.movies,
      [id]: { ...state.movies[id], ...updates },
    },
  };
}
```

### Benefits

| Aspect | Denormalized | Normalized |
|--------|--------------|------------|
| Update movie | O(N × M) sections | O(1) single update |
| Memory | Movie duplicated | Single copy |
| Consistency | Can have stale copies | Always consistent |
| Lookup by ID | O(N) search | O(1) direct access |

---

## 2. Adaptive Bitrate Streaming

### How It Works

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                   ADAPTIVE BITRATE STREAMING (ABR)                           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Video stored in multiple qualities:                                        │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  Original Video                                                      │   │
│  │       │                                                              │   │
│  │       ├──▶ 4K (25 Mbps)                                              │   │
│  │       ├──▶ 1080p (8 Mbps)                                            │   │
│  │       ├──▶ 720p (4 Mbps)                                             │   │
│  │       ├──▶ 480p (2 Mbps)                                             │   │
│  │       └──▶ 360p (1 Mbps)                                             │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  Player monitors network and switches quality:                              │
│                                                                             │
│  Time:     0s ──────────────────────────────────────────────▶ 60s          │
│  Network:  Fast │ Slow     │ Fast       │ Very Slow │ Fast                  │
│  Quality:  1080p│ 720p     │ 1080p      │ 480p      │ 1080p                 │
│                 ▼          ▼            ▼           ▼                       │
│            Seamless quality transitions                                     │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### HLS Implementation

```typescript
// Using hls.js for HLS streaming
import Hls from 'hls.js';

class AdaptivePlayer {
  private hls: Hls | null = null;
  private video: HTMLVideoElement;

  constructor(video: HTMLVideoElement) {
    this.video = video;
  }

  play(manifestUrl: string) {
    if (Hls.isSupported()) {
      this.hls = new Hls({
        // ABR configuration
        abrEwmaDefaultEstimate: 500000, // Initial bandwidth estimate
        abrMaxWithRealBitrate: true,
        maxLoadingDelay: 4,
      });

      this.hls.loadSource(manifestUrl); // .m3u8 file
      this.hls.attachMedia(this.video);

      // Quality level switching events
      this.hls.on(Hls.Events.LEVEL_SWITCHED, (event, data) => {
        console.log(`Switched to quality level ${data.level}`);
      });

      // Manual quality selection
      this.hls.on(Hls.Events.MANIFEST_PARSED, () => {
        // Auto quality by default
        this.hls!.currentLevel = -1;
      });

      this.video.play();
    } else if (this.video.canPlayType('application/vnd.apple.mpegurl')) {
      // Native HLS support (Safari)
      this.video.src = manifestUrl;
      this.video.play();
    }
  }

  setQuality(level: number | 'auto') {
    if (this.hls) {
      this.hls.currentLevel = level === 'auto' ? -1 : level;
    }
  }

  destroy() {
    if (this.hls) {
      this.hls.destroy();
      this.hls = null;
    }
  }
}

// Usage
const video = document.getElementById('player') as HTMLVideoElement;
const player = new AdaptivePlayer(video);
player.play('https://cdn.netflix.com/movie123/master.m3u8');
```

### Manifest File (m3u8)

```
#EXTM3U
#EXT-X-STREAM-INF:BANDWIDTH=800000,RESOLUTION=640x360
360p/playlist.m3u8
#EXT-X-STREAM-INF:BANDWIDTH=1400000,RESOLUTION=842x480
480p/playlist.m3u8
#EXT-X-STREAM-INF:BANDWIDTH=2800000,RESOLUTION=1280x720
720p/playlist.m3u8
#EXT-X-STREAM-INF:BANDWIDTH=5000000,RESOLUTION=1920x1080
1080p/playlist.m3u8
#EXT-X-STREAM-INF:BANDWIDTH=14000000,RESOLUTION=3840x2160
4k/playlist.m3u8
```

---

## 3. Image/Video CDN Optimizer

### Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    CDN OPTIMIZER ARCHITECTURE                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Client Request:                                                            │
│  GET /cdn/image?url=movie.jpg&w=300&h=400&format=webp&q=80                  │
│         │                                                                   │
│         ▼                                                                   │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                         CDN EDGE                                     │   │
│  │                                                                      │   │
│  │  1. Parse request parameters                                         │   │
│  │  2. Generate cache key: hash(url + w + h + format + q)               │   │
│  │  3. Check cache                                                      │   │
│  │     ├─ HIT: Return cached image                                      │   │
│  │     └─ MISS: Request from origin                                     │   │
│  │                                                                      │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│         │ (MISS)                                                            │
│         ▼                                                                   │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                     IMAGE OPTIMIZER SERVICE                          │   │
│  │                                                                      │   │
│  │  1. Fetch original image from storage                                │   │
│  │  2. Resize to requested dimensions                                   │   │
│  │  3. Convert to requested format (WebP/AVIF)                          │   │
│  │  4. Compress with requested quality                                  │   │
│  │  5. Cache result                                                     │   │
│  │  6. Return to CDN edge                                               │   │
│  │                                                                      │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│         │                                                                   │
│         ▼                                                                   │
│  Client receives optimized image                                            │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### React Component

```typescript
interface OptimizedImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  quality?: number;
}

function OptimizedImage({ src, alt, width, height, quality = 80 }: OptimizedImageProps) {
  // Detect WebP/AVIF support
  const [format, setFormat] = useState<'webp' | 'avif' | 'jpg'>('jpg');

  useEffect(() => {
    // Feature detection
    const canvas = document.createElement('canvas');
    if (canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0) {
      setFormat('webp');
    }
    // Could also check AVIF support
  }, []);

  // Build CDN URL
  const cdnUrl = useMemo(() => {
    const params = new URLSearchParams({
      url: src,
      w: String(width),
      h: String(height),
      format,
      q: String(quality),
    });
    return `https://cdn.netflix.com/image?${params}`;
  }, [src, width, height, format, quality]);

  // Responsive srcset
  const srcSet = useMemo(() => {
    const sizes = [1, 2]; // 1x and 2x for retina
    return sizes
      .map(scale => {
        const params = new URLSearchParams({
          url: src,
          w: String(width * scale),
          h: String(height * scale),
          format,
          q: String(quality),
        });
        return `https://cdn.netflix.com/image?${params} ${scale}x`;
      })
      .join(', ');
  }, [src, width, height, format, quality]);

  return (
    <img
      src={cdnUrl}
      srcSet={srcSet}
      alt={alt}
      width={width}
      height={height}
      loading="lazy"
      decoding="async"
    />
  );
}
```

### GIF Previews Instead of Video

```typescript
// For hover previews, use GIF instead of video
// GIF is lighter than video for short loops

function MovieCard({ movie }: { movie: Movie }) {
  const [isHovering, setIsHovering] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {isHovering ? (
        // Short preview as GIF (lighter than video)
        <img
          src={`https://cdn.netflix.com/gif?url=${movie.previewUrl}&w=300`}
          alt={`${movie.title} preview`}
        />
      ) : (
        // Static poster image
        <OptimizedImage
          src={movie.posterUrl}
          alt={movie.title}
          width={300}
          height={400}
        />
      )}
    </div>
  );
}
```

---

## 4. SSR for Critical Pages

### Sign Up Page Strategy

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    SSR FOR SIGN UP PAGE                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Why SSR for Sign Up?                                                       │
│  • First impression matters for conversion                                   │
│  • Fast Time to First Contentful Paint (FCP)                                │
│  • Fast Time to Interactive (TTI)                                           │
│  • SEO friendly (if needed)                                                 │
│                                                                             │
│  Strategy:                                                                  │
│  1. Server renders complete HTML                                            │
│  2. Critical CSS inlined in <head>                                          │
│  3. Minimal/No JavaScript needed for initial view                           │
│  4. Form works without JS (progressive enhancement)                         │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Implementation

```tsx
// pages/signup.tsx (Next.js example)

export default function SignUpPage() {
  return (
    <>
      <Head>
        {/* Critical CSS inlined */}
        <style dangerouslySetInnerHTML={{ __html: CRITICAL_CSS }} />
        
        {/* Non-critical CSS loaded async */}
        <link
          rel="stylesheet"
          href="/styles/full.css"
          media="print"
          onLoad="this.media='all'"
        />
      </Head>

      <main className="signup-page">
        <h1>Sign Up for Netflix</h1>
        
        {/* Form works without JS (action = server endpoint) */}
        <form action="/api/signup" method="POST">
          <input
            type="email"
            name="email"
            placeholder="Email"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            minLength={8}
          />
          <button type="submit">Sign Up</button>
        </form>
      </main>
    </>
  );
}

// Inline critical CSS
const CRITICAL_CSS = `
  .signup-page {
    max-width: 400px;
    margin: 0 auto;
    padding: 2rem;
  }
  .signup-page h1 {
    font-size: 2rem;
    margin-bottom: 1.5rem;
  }
  .signup-page input {
    width: 100%;
    padding: 1rem;
    margin-bottom: 1rem;
    font-size: 1rem;
  }
  .signup-page button {
    width: 100%;
    padding: 1rem;
    background: #e50914;
    color: white;
    font-size: 1.125rem;
  }
`;

// Server-side rendering
export const getServerSideProps: GetServerSideProps = async (context) => {
  // No data fetching needed for sign up
  // Page renders immediately
  return { props: {} };
};
```

### Performance Comparison

| Metric | CSR (Client) | SSR (Server) |
|--------|--------------|--------------|
| FCP | 2-3s | 0.5-1s |
| TTI | 3-4s | 1-2s |
| Initial HTML | Empty shell | Complete form |
| JS Required | Yes | No (basic form) |

---

## 5. Hover Preview with Lazy Loading

### Implementation

```typescript
import { useState, useRef, useCallback } from 'react';

interface MovieCardProps {
  movie: Movie;
  onOpen: () => void;
}

function MovieCard({ movie, onOpen }: MovieCardProps) {
  const [isHovering, setIsHovering] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const hoverTimeoutRef = useRef<number | null>(null);

  const handleMouseEnter = useCallback(() => {
    // Delay before showing preview (prevents flash on quick hover)
    hoverTimeoutRef.current = window.setTimeout(() => {
      setShowPreview(true);
    }, 500);
    setIsHovering(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    setIsHovering(false);
    setShowPreview(false);
  }, []);

  return (
    <div
      className={`movie-card ${isHovering ? 'movie-card--hover' : ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Static poster (always visible) */}
      <img
        src={movie.posterUrl}
        alt={movie.title}
        className={`movie-card__poster ${showPreview ? 'hidden' : ''}`}
      />

      {/* Preview (lazy loaded on hover) */}
      {showPreview && (
        <div className="movie-card__preview">
          <video
            src={movie.previewUrl}
            autoPlay
            muted
            loop
            playsInline
          />
          
          <div className="movie-card__controls">
            <button onClick={onOpen} aria-label="Play">▶</button>
            <button aria-label="Add to My List">+</button>
            <button aria-label="Like">👍</button>
            <button onClick={onOpen} aria-label="More Info">ℹ</button>
          </div>

          <div className="movie-card__info">
            <span className="match">98% Match</span>
            <span className="tags">{movie.tags.join(' • ')}</span>
          </div>
        </div>
      )}
    </div>
  );
}
```

### CSS Animation

```css
.movie-card {
  position: relative;
  width: 200px;
  transition: transform 0.3s ease, z-index 0s 0.3s;
}

.movie-card--hover {
  transform: scale(1.3);
  z-index: 10;
  transition: transform 0.3s ease, z-index 0s 0s;
}

.movie-card__poster {
  width: 100%;
  height: auto;
  border-radius: 4px;
}

.movie-card__poster.hidden {
  opacity: 0;
}

.movie-card__preview {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  background: #181818;
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.7);
}

.movie-card__preview video {
  width: 100%;
  display: block;
}

.movie-card__controls {
  display: flex;
  gap: 0.5rem;
  padding: 0.5rem;
}

.movie-card__controls button {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid white;
  background: transparent;
  color: white;
  cursor: pointer;
}

.movie-card__info {
  padding: 0.5rem;
}

.match {
  color: #46d369;
  font-weight: bold;
}

.tags {
  color: #aaa;
  font-size: 0.875rem;
}
```

---

## 6. Service Worker for Offline

### Registration

```typescript
// main.ts
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('SW registered:', registration.scope);
    } catch (error) {
      console.log('SW registration failed:', error);
    }
  });
}
```

### Service Worker

```typescript
// sw.js
const CACHE_NAME = 'netflix-v1';

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/app.js',
  '/style.css',
  '/manifest.json',
  '/icons/logo.png',
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

// Fetch: Different strategies for different content
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Static assets: Cache first
  if (STATIC_ASSETS.includes(url.pathname)) {
    event.respondWith(cacheFirst(request));
    return;
  }

  // API calls: Network first, fallback to cache
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(networkFirst(request));
    return;
  }

  // Images: Cache first with network update
  if (url.pathname.startsWith('/cdn/image')) {
    event.respondWith(staleWhileRevalidate(request));
    return;
  }

  // Default: Network with cache fallback
  event.respondWith(networkFirst(request));
});

// Strategies
async function cacheFirst(request: Request): Promise<Response> {
  const cached = await caches.match(request);
  if (cached) return cached;
  
  const response = await fetch(request);
  const cache = await caches.open(CACHE_NAME);
  cache.put(request, response.clone());
  return response;
}

async function networkFirst(request: Request): Promise<Response> {
  try {
    const response = await fetch(request);
    const cache = await caches.open(CACHE_NAME);
    cache.put(request, response.clone());
    return response;
  } catch (error) {
    const cached = await caches.match(request);
    if (cached) return cached;
    throw error;
  }
}

async function staleWhileRevalidate(request: Request): Promise<Response> {
  const cached = await caches.match(request);
  
  const fetchPromise = fetch(request).then((response) => {
    caches.open(CACHE_NAME).then((cache) => {
      cache.put(request, response.clone());
    });
    return response;
  });

  return cached || fetchPromise;
}
```

### Caching Strategy Summary

| Content | Strategy | Reason |
|---------|----------|--------|
| Static assets | Cache First | Rarely changes |
| API data | Network First | Need fresh data |
| Images | Stale While Revalidate | Show cached, update in background |
| Videos | No cache | Too large, streaming handles it |

---

## Summary

| Concept | Key Takeaway |
|---------|--------------|
| **Normalized State** | Store by ID, reference elsewhere |
| **ABR Streaming** | HLS with quality switching |
| **CDN Optimizer** | Resize, compress, cache on edge |
| **SSR Sign Up** | Critical CSS, fast FCP |
| **Hover Preview** | Delay + lazy load video |
| **Service Worker** | Different strategies per content |

---

## References

- [Normalizing State Shape](https://redux.js.org/recipes/structuring-reducers/normalizing-state-shape)
- [HLS.js Documentation](https://github.com/video-dev/hls.js)
- [Web.dev Image Optimization](https://web.dev/fast/#optimize-your-images)
- [Service Worker Strategies](https://developer.chrome.com/docs/workbox/caching-strategies-overview/)
