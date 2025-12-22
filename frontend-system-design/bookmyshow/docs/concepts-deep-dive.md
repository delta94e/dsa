# BookMyShow - Concepts Deep Dive

> A comprehensive guide to all the concepts, techniques, and best practices for building a production-ready ticket booking application.

---

## Table of Contents

1. [Seat Selection System](#1-seat-selection-system)
2. [Distributed Locking](#2-distributed-locking)
3. [Real-Time Updates](#3-real-time-updates)
4. [Timer Management](#4-timer-management)
5. [Payment Integration](#5-payment-integration)
6. [Concurrency Handling](#6-concurrency-handling)
7. [Search & Filtering](#7-search--filtering)
8. [Location-Based Services](#8-location-based-services)
9. [Performance Patterns](#9-performance-patterns)
10. [Mobile Responsive Seat Map](#10-mobile-responsive-seat-map)

---

## 1. Seat Selection System

### The Challenge

The seat selection UI is the most complex part of a booking app:
- Hundreds of seats to render
- Real-time availability updates
- Multiple price tiers
- Accessible navigation

### Layout Representation

```typescript
// Theater seat layout as data
interface SeatLayout {
  rows: {
    id: string;
    label: string; // "A", "B"
    category: 'silver' | 'gold' | 'platinum';
    y: number; // Distance from screen
    seats: {
      id: string;
      number: number;
      x: number; // Position in row
      status: 'available' | 'locked' | 'booked';
    }[];
  }[];
  gaps: {
    type: 'aisle' | 'walkway';
    afterRow?: string;
    afterSeat?: number;
  }[];
}
```

### CSS Grid for Layout

```css
.seat-map {
  --seat-size: 32px;
  --seat-gap: 4px;
  --aisle-gap: 16px;
}

.seat-row {
  display: grid;
  grid-template-columns: 
    30px /* row label */
    repeat(5, var(--seat-size)) /* left section */
    var(--aisle-gap) /* aisle */
    repeat(5, var(--seat-size)) /* right section */;
  gap: var(--seat-gap);
  justify-content: center;
}

.seat {
  width: var(--seat-size);
  height: var(--seat-size);
  border-radius: 4px 4px 8px 8px; /* Seat shape */
  font-size: 10px;
  cursor: pointer;
  transition: transform 0.1s, background-color 0.2s;
}

.seat:hover:not(:disabled) {
  transform: scale(1.1);
}

.seat--available { background: #4CAF50; }
.seat--selected { background: #2196F3; }
.seat--locked { background: #9E9E9E; cursor: not-allowed; }
.seat--booked { background: #424242; cursor: not-allowed; }
```

### Performance: Memoization

```typescript
// Memoize individual seats to prevent re-renders
const Seat = memo(({ seat, status, onSelect }: SeatProps) => (
  <button
    className={`seat seat--${status}`}
    onClick={() => onSelect(seat)}
    disabled={status !== 'available' && status !== 'selected'}
  >
    {seat.number}
  </button>
));

// Memoize status calculation
const useSeatStatus = (selectedSeats: Set<string>, lockedSeats: Set<string>) => {
  return useMemo(() => {
    return (seatId: string, originalStatus: string) => {
      if (selectedSeats.has(seatId)) return 'selected';
      if (lockedSeats.has(seatId)) return 'locked';
      return originalStatus;
    };
  }, [selectedSeats, lockedSeats]);
};
```

---

## 2. Distributed Locking

### The Problem

```
User A selects seat D5 at 10:00:00.001
User B selects seat D5 at 10:00:00.002
Both show "selected" ❌ Race condition!
```

### Solution: Server-Side Lock with TTL

```
┌─────────────────────────────────────────────────────────────────┐
│                      SEAT LOCKING FLOW                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  User A clicks seat D5                                          │
│         │                                                       │
│         ▼                                                       │
│  ┌─────────────────────┐                                        │
│  │ POST /api/lock      │                                        │
│  │ { seats: ["D5"] }   │                                        │
│  └─────────────────────┘                                        │
│         │                                                       │
│         ▼                                                       │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ Server checks Redis:                                    │    │
│  │ SETNX seat:D5:showtime:123 user_A EX 600                │    │
│  │                                                         │    │
│  │ If key doesn't exist → Lock acquired ✅                  │    │
│  │ If key exists → Lock failed ❌                           │    │
│  └─────────────────────────────────────────────────────────┘    │
│         │                                                       │
│         ▼                                                       │
│  Response: { lockId: "xyz", expiresAt: "..." }                  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Redis Commands

```bash
# Lock a seat (atomic operation)
SETNX seat:{seatId}:showtime:{showtimeId} {userId}
EXPIRE seat:{seatId}:showtime:{showtimeId} 600  # 10 minutes

# Or use single command
SET seat:{seatId}:showtime:{showtimeId} {userId} NX EX 600

# Check if seat is locked
GET seat:{seatId}:showtime:{showtimeId}

# Release lock (only by owner)
# Use Lua script for atomicity
EVAL "if redis.call('get', KEYS[1]) == ARGV[1] then 
        return redis.call('del', KEYS[1]) 
      else 
        return 0 
      end" 
      1 seat:{seatId}:showtime:{showtimeId} {userId}
```

### Client-Side Implementation

```typescript
async function lockSeats(seatIds: string[]): Promise<LockResult> {
  // Optimistic update
  dispatch({ type: 'SEATS_SELECTING', seatIds });

  try {
    const response = await api.post('/bookings/lock', {
      showtimeId,
      seatIds,
    });

    dispatch({
      type: 'SEATS_LOCKED',
      lockId: response.lockId,
      expiresAt: response.expiresAt,
    });

    return { success: true, lockId: response.lockId };
  } catch (error) {
    // Rollback optimistic update
    dispatch({ type: 'SEATS_LOCK_FAILED', seatIds });

    if (error.code === 'SEATS_UNAVAILABLE') {
      // Refresh seat map
      await refetchSeats();
      toast.error('Some seats are no longer available');
    }

    return { success: false, error };
  }
}
```

---

## 3. Real-Time Updates

### WebSocket Architecture

```
┌────────────────────────────────────────────────────────────────┐
│                    REAL-TIME SEAT UPDATES                       │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  ┌──────────┐    Subscribe     ┌──────────────┐                │
│  │ Client 1 │◀────to room────▶ │              │                │
│  └──────────┘                  │   WebSocket  │                │
│                                │    Server    │                │
│  ┌──────────┐    Subscribe     │              │                │
│  │ Client 2 │◀────to room────▶ │              │                │
│  └──────────┘                  └──────────────┘                │
│                                       │                        │
│                                       │ Redis Pub/Sub          │
│                                       ▼                        │
│                                ┌──────────────┐                │
│                                │    Redis     │                │
│                                │   Pub/Sub    │                │
│                                └──────────────┘                │
│                                       │                        │
│                                       │                        │
│                                       ▼                        │
│  When Client 1 locks seat D5:                                  │
│  1. Server stores lock in Redis                                │
│  2. Server publishes to channel "showtime:123"                 │
│  3. All clients in room receive { type: "SEAT_LOCKED", ... }   │
│  4. Client 2 sees D5 become unavailable                        │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

### Client WebSocket Hook

```typescript
function useSeatUpdates(showtimeId: string) {
  const queryClient = useQueryClient();

  useEffect(() => {
    const ws = new WebSocket(`wss://api.example.com/ws/showtimes/${showtimeId}`);

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);

      switch (message.type) {
        case 'SEAT_LOCKED':
          // Update cache to show seats as locked
          queryClient.setQueryData(['seats', showtimeId], (old) => ({
            ...old,
            lockedSeats: [...old.lockedSeats, ...message.seatIds],
          }));
          break;

        case 'SEAT_UNLOCKED':
          // Update cache to show seats as available
          queryClient.setQueryData(['seats', showtimeId], (old) => ({
            ...old,
            lockedSeats: old.lockedSeats.filter(
              id => !message.seatIds.includes(id)
            ),
          }));
          break;

        case 'SEAT_BOOKED':
          // Permanently mark as sold
          queryClient.setQueryData(['seats', showtimeId], (old) => ({
            ...old,
            bookedSeats: [...old.bookedSeats, ...message.seatIds],
            lockedSeats: old.lockedSeats.filter(
              id => !message.seatIds.includes(id)
            ),
          }));
          break;
      }
    };

    return () => ws.close();
  }, [showtimeId, queryClient]);
}
```

### Handling Reconnection

```typescript
function useReconnectingWebSocket(url: string) {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const reconnectAttempts = useRef(0);
  const maxAttempts = 5;

  const connect = useCallback(() => {
    const socket = new WebSocket(url);

    socket.onopen = () => {
      reconnectAttempts.current = 0;
    };

    socket.onclose = (event) => {
      if (!event.wasClean && reconnectAttempts.current < maxAttempts) {
        // Exponential backoff: 1s, 2s, 4s, 8s, 16s
        const delay = 1000 * Math.pow(2, reconnectAttempts.current);
        reconnectAttempts.current++;
        setTimeout(connect, delay);
      }
    };

    setWs(socket);
  }, [url]);

  useEffect(() => {
    connect();
    return () => ws?.close(1000);
  }, [connect]);

  return ws;
}
```

---

## 4. Timer Management

### Timer States

```
┌─────────────────────────────────────────────────────────────┐
│                     TIMER STATE MACHINE                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────┐                                               │
│  │   IDLE   │───── User selects first seat ───────┐        │
│  └──────────┘                                      │        │
│                                                    ▼        │
│                                            ┌──────────────┐ │
│                                            │   RUNNING    │ │
│                                            │  (10:00)     │ │
│                                            └──────────────┘ │
│                                                    │        │
│                              ┌─────────────────────┼────────┤
│                              │                     │        │
│                 remaining < 2min              User pays     │
│                              │                     │        │
│                              ▼                     ▼        │
│                      ┌──────────────┐      ┌──────────────┐ │
│                      │   WARNING    │      │   STOPPED    │ │
│                      │  (pulsing)   │      │  (success)   │ │
│                      └──────────────┘      └──────────────┘ │
│                              │                              │
│                      remaining = 0                          │
│                              │                              │
│                              ▼                              │
│                      ┌──────────────┐                       │
│                      │   EXPIRED    │                       │
│                      │ (seats lost) │                       │
│                      └──────────────┘                       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Implementation

```typescript
function useBookingTimer(expiresAt: number | null) {
  const [state, setState] = useState<TimerState>({
    status: 'idle',
    remaining: 0,
    progress: 1,
  });

  useEffect(() => {
    if (!expiresAt) {
      setState({ status: 'idle', remaining: 0, progress: 1 });
      return;
    }

    const totalDuration = 600; // 10 minutes in seconds

    const tick = () => {
      const now = Date.now();
      const remaining = Math.max(0, Math.floor((expiresAt - now) / 1000));
      const progress = remaining / totalDuration;

      if (remaining === 0) {
        setState({ status: 'expired', remaining: 0, progress: 0 });
        return;
      }

      setState({
        status: remaining <= 120 ? 'warning' : 'running',
        remaining,
        progress,
      });
    };

    tick();
    const interval = setInterval(tick, 1000);

    return () => clearInterval(interval);
  }, [expiresAt]);

  return state;
}

interface TimerState {
  status: 'idle' | 'running' | 'warning' | 'expired';
  remaining: number; // seconds
  progress: number; // 0-1
}
```

### Timer UI

```typescript
function BookingTimer({ expiresAt, onExpire }: TimerProps) {
  const { status, remaining, progress } = useBookingTimer(expiresAt);

  useEffect(() => {
    if (status === 'expired') {
      onExpire();
    }
  }, [status, onExpire]);

  if (status === 'idle') return null;

  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;
  const formattedTime = `${minutes}:${seconds.toString().padStart(2, '0')}`;

  return (
    <div
      className={`timer timer--${status}`}
      role="timer"
      aria-live={status === 'warning' ? 'assertive' : 'polite'}
    >
      <div className="timer-icon">
        {status === 'warning' ? '⚠️' : '⏱️'}
      </div>

      <div className="timer-content">
        <span className="timer-label">
          {status === 'warning' ? 'Hurry!' : 'Complete booking in'}
        </span>
        <span className="timer-value">{formattedTime}</span>
      </div>

      <div className="timer-progress">
        <div
          className="timer-progress-bar"
          style={{ width: `${progress * 100}%` }}
        />
      </div>
    </div>
  );
}
```

### Extending Timer

```typescript
async function extendTimer(lockId: string): Promise<boolean> {
  try {
    const response = await api.post(`/bookings/lock/${lockId}/extend`);
    dispatch({
      type: 'TIMER_EXTENDED',
      expiresAt: response.expiresAt,
    });
    return true;
  } catch (error) {
    toast.error('Could not extend time');
    return false;
  }
}

// Auto-extend when user is active
function useAutoExtend(lockId: string | null) {
  useEffect(() => {
    if (!lockId) return;

    const handleActivity = debounce(() => {
      extendTimer(lockId);
    }, 30000); // Extend every 30 seconds of activity

    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keypress', handleActivity);

    return () => {
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keypress', handleActivity);
    };
  }, [lockId]);
}
```

---

## 5. Payment Integration

### Payment Flow

```
┌────────────────────────────────────────────────────────────────┐
│                     PAYMENT FLOW                                │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  User clicks "Pay Now"                                         │
│         │                                                      │
│         ▼                                                      │
│  ┌─────────────────────┐                                       │
│  │ POST /api/payments  │                                       │
│  │ { lockId, amount,   │                                       │
│  │   method }          │                                       │
│  └─────────────────────┘                                       │
│         │                                                      │
│         ├──────────────────┬───────────────────┐               │
│         │                  │                   │               │
│    Card Payment        UPI Payment       Redirect Flow         │
│         │                  │              (Net Banking)        │
│         ▼                  ▼                   │               │
│    Tokenize         Show UPI apps              ▼               │
│    with Stripe/      or VPA form          Redirect to          │
│    Razorpay              │                 bank page           │
│         │                  │                   │               │
│         ▼                  ▼                   │               │
│    Process          Pending state              │               │
│    immediately           │                     │               │
│         │                  │                   │               │
│         └──────────────────┴───────────────────┘               │
│                            │                                   │
│                            ▼                                   │
│                     ┌─────────────┐                            │
│                     │ Poll status │◀─────┐                     │
│                     │ every 5s    │      │                     │
│                     └─────────────┘      │                     │
│                            │             │                     │
│                     ┌──────┴──────┐      │                     │
│                     │             │      │                     │
│                 Success       Pending    │                     │
│                     │             └──────┘                     │
│                     ▼                                          │
│              ┌─────────────┐                                   │
│              │ Show ticket │                                   │
│              │ confirmation│                                   │
│              └─────────────┘                                   │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

### Payment Status Polling

```typescript
function usePaymentPolling(paymentId: string | null) {
  const [status, setStatus] = useState<PaymentStatus>('idle');
  const [booking, setBooking] = useState<Booking | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!paymentId) return;

    let attempts = 0;
    const maxAttempts = 60; // 5 minutes
    const interval = 5000; // 5 seconds

    const poll = async () => {
      try {
        const response = await api.get(`/payments/${paymentId}/status`);

        switch (response.status) {
          case 'success':
            setStatus('success');
            setBooking(response.booking);
            router.push(`/booking/${response.booking.id}`);
            return; // Stop polling

          case 'failed':
            setStatus('failed');
            toast.error(response.errorMessage || 'Payment failed');
            return; // Stop polling

          case 'pending':
            attempts++;
            if (attempts < maxAttempts) {
              setTimeout(poll, interval);
            } else {
              setStatus('timeout');
              toast.error('Payment verification timed out');
            }
            break;
        }
      } catch (error) {
        setStatus('error');
      }
    };

    setStatus('processing');
    poll();
  }, [paymentId, router]);

  return { status, booking };
}
```

### Handling Redirect Flows

```typescript
// For UPI/Net Banking that redirects to external page
function initiateRedirectPayment(method: PaymentMethod) {
  // Store booking context in sessionStorage before redirect
  sessionStorage.setItem('booking_context', JSON.stringify({
    lockId,
    showtimeId,
    seats: selectedSeats,
    timestamp: Date.now(),
  }));

  // Redirect to payment gateway
  window.location.href = paymentUrl;
}

// On return from payment gateway
function PaymentCallbackPage() {
  const { paymentId, status } = useSearchParams();

  useEffect(() => {
    const context = sessionStorage.getItem('booking_context');
    
    if (!context) {
      router.push('/');
      return;
    }

    if (status === 'success') {
      // Verify with backend
      verifyPayment(paymentId);
    } else {
      // Show failure UI with retry option
      setPaymentFailed(true);
    }

    sessionStorage.removeItem('booking_context');
  }, [paymentId, status]);
}
```

---

## 6. Concurrency Handling

### Race Condition Prevention

```typescript
// Problem: Multiple rapid clicks
function badSelectSeat(seat: Seat) {
  setSelectedSeats([...selectedSeats, seat]);
  api.lockSeats([...selectedSeats, seat].map(s => s.id));
  // Multiple clicks = multiple API calls with inconsistent state
}

// Solution: Queue with debouncing
function useQueuedSeatSelection() {
  const pendingSeats = useRef<Set<string>>(new Set());
  const timeoutRef = useRef<NodeJS.Timeout>();

  const queueSeat = (seatId: string) => {
    pendingSeats.current.add(seatId);

    // Debounce: wait for more selections
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      const seats = Array.from(pendingSeats.current);
      pendingSeats.current.clear();

      // Single API call with all selected seats
      api.lockSeats(seats);
    }, 300);
  };

  return queueSeat;
}
```

### Idempotency

```typescript
// Server should handle duplicate requests gracefully
// Use idempotency keys

async function lockSeats(seatIds: string[]) {
  const idempotencyKey = `${userId}_${showtimeId}_${seatIds.sort().join('_')}_${Date.now()}`;

  const response = await api.post('/bookings/lock', {
    showtimeId,
    seatIds,
  }, {
    headers: {
      'Idempotency-Key': idempotencyKey,
    },
  });

  return response;
}
```

### Optimistic Locking

```typescript
// Include version number to prevent stale updates
interface SeatWithVersion {
  seatId: string;
  version: number;
}

async function lockSeatsWithVersion(seats: SeatWithVersion[]) {
  try {
    return await api.post('/bookings/lock', { seats });
  } catch (error) {
    if (error.code === 'VERSION_CONFLICT') {
      // Seat status changed since we loaded
      await refetchSeats();
      toast.error('Seat availability changed. Please try again.');
    }
    throw error;
  }
}
```

---

## 7. Search & Filtering

### Debounced Search

```typescript
function useMovieSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (debouncedQuery.length < 2) {
      setResults([]);
      return;
    }

    const controller = new AbortController();
    setIsLoading(true);

    api.searchMovies(debouncedQuery, { signal: controller.signal })
      .then(setResults)
      .catch((error) => {
        if (error.name !== 'AbortError') {
          console.error(error);
        }
      })
      .finally(() => setIsLoading(false));

    return () => controller.abort();
  }, [debouncedQuery]);

  return { query, setQuery, results, isLoading };
}
```

### URL-Based Filters

```typescript
function useFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = useMemo(() => ({
    genre: searchParams.get('genre'),
    language: searchParams.get('language'),
    format: searchParams.get('format'),
    date: searchParams.get('date') || formatDate(new Date()),
  }), [searchParams]);

  const setFilter = useCallback((key: string, value: string | null) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (value) {
        next.set(key, value);
      } else {
        next.delete(key);
      }
      return next;
    });
  }, [setSearchParams]);

  const clearFilters = useCallback(() => {
    setSearchParams({});
  }, [setSearchParams]);

  return { filters, setFilter, clearFilters };
}

// Benefits:
// 1. Shareable URLs: /movies?genre=action&language=english
// 2. Browser back/forward works
// 3. Bookmarkable searches
```

---

## 8. Location-Based Services

### Geolocation Detection

```typescript
function useLocation() {
  const [location, setLocation] = useState<Location | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if we have a stored preference
    const stored = localStorage.getItem('user_city');
    if (stored) {
      setLocation(JSON.parse(stored));
      setIsLoading(false);
      return;
    }

    // Try to detect location
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const city = await reverseGeocode(latitude, longitude);
          setLocation({ city, detectedByGPS: true });
          setIsLoading(false);
        },
        () => {
          // Fallback to IP-based detection
          detectLocationByIP().then(setLocation);
          setIsLoading(false);
        }
      );
    } else {
      detectLocationByIP().then(setLocation);
      setIsLoading(false);
    }
  }, []);

  const setCity = (city: string) => {
    const newLocation = { city, detectedByGPS: false };
    setLocation(newLocation);
    localStorage.setItem('user_city', JSON.stringify(newLocation));
  };

  return { location, isLoading, setCity };
}
```

### City Picker Modal

```typescript
function CityPicker({ isOpen, onClose, onSelect }: CityPickerProps) {
  const [search, setSearch] = useState('');
  const { data: cities } = useCities();

  const filteredCities = useMemo(() => {
    if (!search) return popularCities;
    return cities?.filter(city =>
      city.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [cities, search]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Select your city">
      <input
        type="search"
        placeholder="Search for your city"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="city-grid">
        {filteredCities?.map(city => (
          <button
            key={city.id}
            onClick={() => {
              onSelect(city);
              onClose();
            }}
          >
            {city.name}
          </button>
        ))}
      </div>
    </Modal>
  );
}
```

---

## 9. Performance Patterns

### Skeleton Loading

```typescript
function MovieCardSkeleton() {
  return (
    <div className="movie-card movie-card--skeleton">
      <div className="skeleton skeleton--poster" />
      <div className="skeleton skeleton--title" />
      <div className="skeleton skeleton--rating" />
    </div>
  );
}

function MoviesGrid({ movies, isLoading }: Props) {
  if (isLoading) {
    return (
      <div className="movies-grid">
        {Array.from({ length: 8 }).map((_, i) => (
          <MovieCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="movies-grid">
      {movies.map(movie => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  );
}
```

### Prefetching

```typescript
// Prefetch movie details when hovering
function MovieCard({ movie }: Props) {
  const queryClient = useQueryClient();

  const handleMouseEnter = () => {
    queryClient.prefetchQuery({
      queryKey: ['movie', movie.id],
      queryFn: () => api.getMovie(movie.id),
      staleTime: 5 * 60 * 1000, // 5 minutes
    });
  };

  return (
    <Link
      to={`/movies/${movie.slug}`}
      onMouseEnter={handleMouseEnter}
    >
      <MovieCardContent movie={movie} />
    </Link>
  );
}

// Prefetch payment methods when entering checkout intent
function SeatSelection() {
  const queryClient = useQueryClient();

  useEffect(() => {
    // When first seat is selected, start prefetching
    if (selectedSeats.length === 1) {
      queryClient.prefetchQuery({
        queryKey: ['payment-methods'],
        queryFn: api.getPaymentMethods,
      });
    }
  }, [selectedSeats.length]);
}
```

---

## 10. Mobile Responsive Seat Map

### The Challenge

Desktop seat map: 400px wide, 10 seats per row
Mobile screen: 320px wide, same 10 seats

### Solution 1: Horizontal Scroll

```css
.seat-map-mobile {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.seat-map__layout {
  min-width: 400px; /* Force scroll on small screens */
}

/* Show scroll hint */
.seat-map-mobile::after {
  content: '← swipe →';
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 12px;
  color: #888;
  animation: fadeOut 3s forwards;
}
```

### Solution 2: Pinch to Zoom

```typescript
function ZoomableSeatMap({ children }: Props) {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handlePinch = (event: TouchEvent) => {
    // Calculate zoom from touch points
    const touches = event.touches;
    if (touches.length === 2) {
      const distance = Math.hypot(
        touches[0].pageX - touches[1].pageX,
        touches[0].pageY - touches[1].pageY
      );
      // ... calculate scale
    }
  };

  return (
    <div
      className="zoomable-container"
      onTouchMove={handlePinch}
      style={{
        transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
      }}
    >
      {children}
    </div>
  );
}
```

### Solution 3: Row-by-Row View

```typescript
function MobileSeatSelector({ layout }: Props) {
  const [activeRow, setActiveRow] = useState<string | null>(null);

  if (activeRow) {
    // Show only the active row, full width
    const row = layout.rows.find(r => r.id === activeRow);
    return (
      <div className="row-detail-view">
        <button onClick={() => setActiveRow(null)}>← Back</button>
        <h3>Row {row.label} - {row.category}</h3>
        <div className="seat-row--expanded">
          {row.seats.map(seat => (
            <SeatButton key={seat.id} seat={seat} />
          ))}
        </div>
      </div>
    );
  }

  // Show row overview
  return (
    <div className="row-overview">
      {layout.rows.map(row => (
        <button
          key={row.id}
          onClick={() => setActiveRow(row.id)}
          className="row-preview"
        >
          <span>Row {row.label}</span>
          <span>{row.seats.filter(s => s.status === 'available').length} available</span>
          <span>₹{row.seats[0].price}</span>
        </button>
      ))}
    </div>
  );
}
```

---

## Summary

Building a production ticket booking app requires:

1. **Seat Selection** - Efficient grid rendering, memoization
2. **Distributed Locking** - Redis SETNX with TTL
3. **Real-Time Updates** - WebSocket with reconnection
4. **Timer Management** - State machine with warnings
5. **Payment** - Multiple flows, status polling
6. **Concurrency** - Queue, debounce, idempotency
7. **Search/Filter** - Debounced, URL-based
8. **Location** - GPS, IP fallback, persistence
9. **Performance** - Skeletons, prefetching
10. **Mobile** - Scroll, zoom, row-by-row views

---

## References

- [Redis Distributed Locks](https://redis.io/topics/distlock)
- [WebSocket Best Practices](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API)
- [Razorpay Integration Guide](https://razorpay.com/docs/)
- [ARIA Grid Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/grid/)
