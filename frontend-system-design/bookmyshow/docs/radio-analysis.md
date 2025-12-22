# BookMyShow Frontend System Design - RADIO Analysis

> A comprehensive frontend system design for a movie/event ticket booking platform like BookMyShow, using the RADIO framework for front end system design interviews.

---

## Table of Contents

1. [Requirements Exploration](#1-requirements-exploration)
2. [Architecture / High-Level Design](#2-architecture--high-level-design)
3. [Data Model](#3-data-model)
4. [Interface Definition (API)](#4-interface-definition-api)
5. [Optimizations and Deep Dive](#5-optimizations-and-deep-dive)

---

## 1. Requirements Exploration

> **Objective**: Understand the problem thoroughly and determine the scope.
> 
> **Recommended Duration**: ~15% of interview time

### 1.1 Clarifying Questions

| Question | Answer |
|----------|--------|
| What are the core features? | Browse movies, view showtimes, select seats, book tickets, payment |
| What entities can be booked? | Movies, live events, sports, concerts |
| Should we support multiple cities? | Yes, location-based content |
| What's the primary platform? | Web, but should be mobile-responsive |
| Real-time seat availability? | Yes, seats lock during selection |
| Payment integration? | Yes, with multiple payment methods |
| Do users need accounts? | Yes, for booking history and saved preferences |

### 1.2 Functional Requirements

#### Core Features (Must Have)
- **Browse movies/events** - Homepage with featured, now showing, coming soon
- **Search & filter** - By name, genre, language, date, location
- **Movie details** - Synopsis, cast, crew, trailers, reviews, ratings
- **Theater & showtime selection** - List of theaters with available times
- **Seat selection** - Interactive seat map with real-time availability
- **Booking flow** - Add to cart, apply offers, proceed to payment
- **Payment** - Multiple options (cards, UPI, wallets, net banking)
- **Booking confirmation** - Tickets with QR code, email/SMS confirmation
- **User profile** - Booking history, saved cards, preferences

#### Nice to Have
- Reviews and ratings system
- Watchlist / "Remind me"
- Recommendations based on history
- Rewards/loyalty program
- Social sharing of bookings

### 1.3 Non-Functional Requirements

| Requirement | Target |
|-------------|--------|
| **Performance** | Page load < 2s, seat map interactive < 500ms |
| **Availability** | Handle high traffic during popular movie releases |
| **Concurrency** | Prevent double-booking, handle seat conflicts |
| **Responsiveness** | Work on desktop, tablet, mobile |
| **Accessibility** | WCAG 2.1 AA compliance |
| **SEO** | Movie pages should be discoverable |

### 1.4 Out of Scope
- Theater admin panel
- Content management system
- Refund/cancellation processing (backend)
- Real payment gateway integration (mock for demo)

---

## 2. Architecture / High-Level Design

> **Objective**: Identify the key components and their relationships.
> 
> **Recommended Duration**: ~20% of interview time

### 2.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              CLIENT                                      │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                         VIEWS (UI)                               │   │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────┐ │   │
│  │  │  Home    │ │  Movie   │ │  Seat    │ │ Checkout │ │ Profile│ │   │
│  │  │  Page    │ │  Details │ │ Selector │ │   Page   │ │  Page  │ │   │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘ └────────┘ │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                   │                                     │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                       CONTROLLER                                 │   │
│  │  ┌──────────────┐ ┌──────────────┐ ┌──────────────────────────┐ │   │
│  │  │    Movie     │ │   Booking    │ │      Payment             │ │   │
│  │  │  Controller  │ │  Controller  │ │     Controller           │ │   │
│  │  └──────────────┘ └──────────────┘ └──────────────────────────┘ │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                   │                                     │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                      CLIENT STORE                                │   │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌───────────┐  │   │
│  │  │ Movies  │ │ Theaters│ │  Cart   │ │  User   │ │  Booking  │  │   │
│  │  │  Store  │ │  Store  │ │  Store  │ │  Store  │ │   Store   │  │   │
│  │  └─────────┘ └─────────┘ └─────────┘ └─────────┘ └───────────┘  │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                   │                                     │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                       SERVICES                                   │   │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────────────┐│   │
│  │  │   API    │ │  Cache   │ │ WebSocket│ │   Location           ││   │
│  │  │ Service  │ │ Service  │ │ Service  │ │   Service            ││   │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────────────────┘│   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                              SERVER                                      │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────────────┐│
│  │ Movie API   │ │ Booking API │ │ Payment API │ │ WebSocket Server    ││
│  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────────────┘│
└─────────────────────────────────────────────────────────────────────────┘
```

### 2.2 Component Responsibilities

| Component | Responsibility |
|-----------|----------------|
| **Home Page** | Featured movies, carousels, search, location picker |
| **Movie Details** | Info, trailers, reviews, theater/showtime selection |
| **Seat Selector** | Interactive seat map, real-time availability, timer |
| **Checkout Page** | Cart summary, offers, payment method selection |
| **Profile Page** | User info, booking history, saved payments |
| **Movie Controller** | Fetch movies, theaters, showtimes |
| **Booking Controller** | Seat locking, cart management, booking creation |
| **Payment Controller** | Payment initiation, status polling, confirmation |
| **WebSocket Service** | Real-time seat availability updates |
| **Location Service** | Detect/manage user's city |

### 2.3 User Flow

```
┌─────────┐    ┌─────────────┐    ┌────────────┐    ┌──────────┐    ┌──────────┐
│  Home   │───▶│   Movie     │───▶│   Select   │───▶│  Select  │───▶│ Checkout │
│  Page   │    │   Details   │    │ Theater/   │    │  Seats   │    │ & Pay    │
│         │    │             │    │ Showtime   │    │          │    │          │
└─────────┘    └─────────────┘    └────────────┘    └──────────┘    └──────────┘
     │                                                                    │
     │                                                                    ▼
     │                                                            ┌──────────────┐
     └────────────────────────────────────────────────────────────│ Confirmation │
                                                                  │   & Tickets  │
                                                                  └──────────────┘
```

### 2.4 Rendering Approach

BookMyShow benefits from a **hybrid SSR + CSR** approach:

| Page | Rendering | Reason |
|------|-----------|--------|
| Home | SSR | SEO, fast initial load |
| Movie Details | SSR with hydration | SEO for movie info |
| Seat Selection | CSR | Highly interactive, real-time |
| Checkout | CSR | User-specific, secure |
| Confirmation | SSR | Static ticket display |

### 2.5 Real-Time Updates Architecture

```
┌──────────┐         ┌──────────────┐         ┌──────────────┐
│  Client  │◀───────▶│  WebSocket   │◀───────▶│    Redis     │
│ (Seat UI)│         │   Server     │         │   Pub/Sub    │
└──────────┘         └──────────────┘         └──────────────┘
                                                     │
                                              ┌──────────────┐
                                              │   Database   │
                                              │  (Bookings)  │
                                              └──────────────┘
```

---

## 3. Data Model

> **Objective**: Define the data entities and their relationships.
> 
> **Recommended Duration**: ~15% of interview time

### 3.1 Server Data Entities

#### Movie Entity

```typescript
interface Movie {
  id: string;
  title: string;
  slug: string; // URL-friendly: "avengers-endgame"
  description: string;
  duration: number; // minutes
  releaseDate: string; // ISO date
  genres: Genre[];
  languages: Language[];
  formats: Format[]; // 2D, 3D, IMAX, 4DX
  certification: 'U' | 'UA' | 'A' | 'S';
  rating: number; // 1-10
  ratingCount: number;
  posterUrl: string;
  bannerUrl: string;
  trailerUrl: string;
  cast: CastMember[];
  crew: CrewMember[];
  status: 'coming_soon' | 'now_showing' | 'ended';
}

interface Genre {
  id: string;
  name: string; // Action, Comedy, Drama
}

interface CastMember {
  id: string;
  name: string;
  role: string; // "Tony Stark"
  imageUrl: string;
}
```

#### Theater & Showtime Entity

```typescript
interface Theater {
  id: string;
  name: string;
  address: string;
  city: string;
  location: {
    lat: number;
    lng: number;
  };
  amenities: Amenity[]; // Parking, F&B, Wheelchair access
  screens: Screen[];
}

interface Screen {
  id: string;
  name: string; // "Screen 1", "IMAX"
  format: Format;
  seatLayout: SeatLayout;
}

interface Showtime {
  id: string;
  movieId: string;
  theaterId: string;
  screenId: string;
  startTime: string; // ISO datetime
  endTime: string;
  format: Format;
  language: string;
  pricing: PricingTier[];
  availableSeats: number;
  totalSeats: number;
  status: 'available' | 'filling_fast' | 'almost_full' | 'sold_out';
}

interface PricingTier {
  category: 'silver' | 'gold' | 'platinum' | 'recliner';
  price: number;
  convenienceFee: number;
}
```

#### Seat Entity

```typescript
interface SeatLayout {
  rows: SeatRow[];
  gaps: Gap[]; // Aisles, walkways
}

interface SeatRow {
  id: string;
  label: string; // "A", "B", "C"
  category: 'silver' | 'gold' | 'platinum' | 'recliner';
  seats: Seat[];
}

interface Seat {
  id: string;
  number: number;
  label: string; // "A1", "A2"
  status: 'available' | 'booked' | 'locked' | 'blocked';
  lockedBy?: string; // userId if locked
  lockedUntil?: string; // ISO datetime
  price: number;
  isWheelchairAccessible: boolean;
  isAisle: boolean;
}

interface Gap {
  afterRow?: string;
  afterSeat?: number;
  width: number; // In seat units
}
```

#### Booking Entity

```typescript
interface Booking {
  id: string;
  bookingNumber: string; // "BMS-123456"
  userId: string;
  movieId: string;
  showtimeId: string;
  theaterId: string;
  seats: SelectedSeat[];
  totalAmount: number;
  convenienceFee: number;
  discount: number;
  taxes: number;
  finalAmount: number;
  paymentId: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'refunded';
  qrCode: string;
  createdAt: string;
}

interface SelectedSeat {
  seatId: string;
  label: string;
  category: string;
  price: number;
}
```

#### User Entity

```typescript
interface User {
  id: string;
  email: string;
  phone: string;
  name: string;
  avatarUrl?: string;
  city: string;
  preferences: {
    languages: string[];
    genres: string[];
  };
  savedCards: SavedCard[];
  walletBalance: number;
}
```

### 3.2 Client State

```typescript
interface AppState {
  // Server data (cached)
  movies: {
    featured: Movie[];
    nowShowing: Movie[];
    comingSoon: Movie[];
    byId: Record<string, Movie>;
  };
  theaters: {
    byCity: Record<string, Theater[]>;
    byId: Record<string, Theater>;
  };
  showtimes: {
    byMovieAndCity: Record<string, Showtime[]>;
  };
  
  // Client state
  location: {
    city: string;
    detectedCity: string | null;
  };
  search: {
    query: string;
    filters: SearchFilters;
    results: Movie[];
  };
  seatSelection: {
    showtimeId: string | null;
    selectedSeats: Seat[];
    lockedSeats: string[];
    lockExpiry: string | null;
    seatLayout: SeatLayout | null;
  };
  cart: {
    items: CartItem[];
    appliedOffer: Offer | null;
    totalAmount: number;
  };
  checkout: {
    step: 'seats' | 'payment' | 'confirmation';
    paymentMethod: PaymentMethod | null;
    isProcessing: boolean;
  };
  user: {
    isAuthenticated: boolean;
    profile: User | null;
    bookings: Booking[];
  };
}
```

### 3.3 Seat Timer State

Critical for seat locking:

```typescript
interface SeatTimerState {
  expiresAt: number; // Unix timestamp
  remainingSeconds: number;
  isExpired: boolean;
  showWarning: boolean; // Show when < 2 minutes
}
```

---

## 4. Interface Definition (API)

> **Objective**: Define the API contracts between client and server.
> 
> **Recommended Duration**: ~15% of interview time

### 4.1 REST API Endpoints

#### Movies API

```typescript
// Get featured/now showing/coming soon
GET /api/movies?city={city}&status={status}
Response: {
  movies: Movie[];
  pagination: { cursor: string; hasMore: boolean };
}

// Get movie details
GET /api/movies/{movieId}
Response: Movie

// Search movies
GET /api/movies/search?q={query}&city={city}&genre={genre}&language={lang}
Response: {
  movies: Movie[];
  total: number;
}
```

#### Theaters & Showtimes API

```typescript
// Get theaters showing a movie
GET /api/movies/{movieId}/theaters?city={city}&date={date}
Response: {
  theaters: Array<{
    theater: Theater;
    showtimes: Showtime[];
  }>;
}

// Get seat layout for a showtime
GET /api/showtimes/{showtimeId}/seats
Response: {
  layout: SeatLayout;
  pricing: PricingTier[];
  lockedSeats: string[];
}
```

#### Booking API

```typescript
// Lock seats (temporary hold)
POST /api/bookings/lock
Body: {
  showtimeId: string;
  seatIds: string[];
}
Response: {
  lockId: string;
  expiresAt: string; // ISO datetime
  seats: Seat[];
}

// Create booking
POST /api/bookings
Body: {
  lockId: string;
  paymentId: string;
}
Response: {
  booking: Booking;
}

// Get user bookings
GET /api/users/{userId}/bookings
Response: {
  bookings: Booking[];
}
```

#### Payment API

```typescript
// Initiate payment
POST /api/payments/initiate
Body: {
  lockId: string;
  amount: number;
  method: 'card' | 'upi' | 'wallet' | 'netbanking';
  returnUrl: string;
}
Response: {
  paymentId: string;
  redirectUrl?: string; // For bank redirect flows
  status: 'pending' | 'requires_action';
}

// Check payment status
GET /api/payments/{paymentId}/status
Response: {
  status: 'pending' | 'success' | 'failed' | 'expired';
  booking?: Booking;
}
```

### 4.2 WebSocket API

For real-time seat updates:

```typescript
// Connect to showtime room
ws://api.bookmyshow.com/ws/showtimes/{showtimeId}

// Server messages
{
  type: 'SEAT_LOCKED';
  data: { seatIds: string[]; lockedBy: string; expiresAt: string };
}

{
  type: 'SEAT_UNLOCKED';
  data: { seatIds: string[] };
}

{
  type: 'SEAT_BOOKED';
  data: { seatIds: string[] };
}

{
  type: 'TIMER_UPDATE';
  data: { expiresAt: string };
}
```

### 4.3 Component APIs (Props)

```typescript
// MovieCard
interface MovieCardProps {
  movie: Movie;
  variant: 'poster' | 'horizontal' | 'featured';
  onClick?: (movie: Movie) => void;
}

// SeatMap
interface SeatMapProps {
  layout: SeatLayout;
  selectedSeats: Seat[];
  lockedSeats: string[];
  onSeatClick: (seat: Seat) => void;
  maxSelectable: number;
  disabled: boolean;
}

// Timer
interface TimerProps {
  expiresAt: number;
  onExpire: () => void;
  warningThreshold: number; // seconds
}

// PaymentMethodSelector
interface PaymentMethodSelectorProps {
  savedCards: SavedCard[];
  selectedMethod: PaymentMethod | null;
  onSelect: (method: PaymentMethod) => void;
}
```

### 4.4 URL Structure

```
/                           # Home page
/movies                     # All movies
/movies/{slug}              # Movie details (e.g., /movies/avengers-endgame)
/movies/{slug}/book         # Theater & showtime selection
/book/{showtimeId}          # Seat selection
/checkout/{lockId}          # Payment page
/booking/{bookingId}        # Confirmation page
/profile                    # User profile
/profile/bookings           # Booking history
```

---

## 5. Optimizations and Deep Dive

> **Objective**: Discuss performance, UX, and technical optimizations.
> 
> **Recommended Duration**: ~35% of interview time

### 5.1 Seat Selection Optimizations

#### Real-Time Seat Locking

The biggest challenge is preventing double-bookings:

```typescript
// Optimistic lock with WebSocket confirmation
function useSeatSelection(showtimeId: string) {
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [lockedSeats, setLockedSeats] = useState<Set<string>>(new Set());
  const ws = useWebSocket(`/ws/showtimes/${showtimeId}`);

  const selectSeat = async (seat: Seat) => {
    // Optimistic update
    setSelectedSeats(prev => [...prev, seat]);

    try {
      // Server-side lock
      const { lockId, expiresAt } = await api.lockSeats({
        showtimeId,
        seatIds: [...selectedSeats, seat].map(s => s.id),
      });
      
      // Start countdown timer
      startTimer(expiresAt);
    } catch (error) {
      // Rollback if lock fails
      setSelectedSeats(prev => prev.filter(s => s.id !== seat.id));
      toast.error('Seat no longer available');
    }
  };

  // Handle real-time updates from other users
  useEffect(() => {
    ws.onmessage = (event) => {
      const { type, data } = JSON.parse(event.data);
      
      if (type === 'SEAT_LOCKED' || type === 'SEAT_BOOKED') {
        setLockedSeats(prev => new Set([...prev, ...data.seatIds]));
        
        // Remove from selection if we had it selected optimistically
        setSelectedSeats(prev => 
          prev.filter(s => !data.seatIds.includes(s.id))
        );
      }
      
      if (type === 'SEAT_UNLOCKED') {
        setLockedSeats(prev => {
          const next = new Set(prev);
          data.seatIds.forEach(id => next.delete(id));
          return next;
        });
      }
    };
  }, [ws]);

  return { selectedSeats, lockedSeats, selectSeat };
}
```

#### Seat Lock Timer

```typescript
function useSeatTimer(expiresAt: string | null) {
  const [remaining, setRemaining] = useState<number>(0);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    if (!expiresAt) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const expiry = new Date(expiresAt).getTime();
      const diff = Math.max(0, Math.floor((expiry - now) / 1000));
      
      setRemaining(diff);
      
      if (diff === 0) {
        setIsExpired(true);
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [expiresAt]);

  return {
    remaining,
    isExpired,
    formatted: formatTime(remaining),
    showWarning: remaining > 0 && remaining < 120, // < 2 minutes
  };
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
```

#### Seat Map Rendering

For large theaters (500+ seats), render efficiently:

```typescript
const SeatMap = memo(function SeatMap({
  layout,
  selectedSeats,
  lockedSeats,
  onSeatClick,
}: SeatMapProps) {
  // Memoize seat status lookup
  const seatStatusMap = useMemo(() => {
    const map = new Map<string, 'selected' | 'locked' | 'available'>();
    
    selectedSeats.forEach(s => map.set(s.id, 'selected'));
    lockedSeats.forEach(id => map.set(id, 'locked'));
    
    return map;
  }, [selectedSeats, lockedSeats]);

  return (
    <div className="seat-map" role="grid" aria-label="Seat selection">
      {/* Screen indicator */}
      <div className="screen">SCREEN</div>
      
      {layout.rows.map(row => (
        <div key={row.id} className="seat-row" role="row">
          <span className="row-label">{row.label}</span>
          {row.seats.map(seat => (
            <SeatButton
              key={seat.id}
              seat={seat}
              status={seatStatusMap.get(seat.id) || seat.status}
              onClick={() => onSeatClick(seat)}
            />
          ))}
        </div>
      ))}
      
      {/* Legend */}
      <SeatLegend />
    </div>
  );
});

const SeatButton = memo(function SeatButton({
  seat,
  status,
  onClick,
}: {
  seat: Seat;
  status: string;
  onClick: () => void;
}) {
  const isDisabled = status === 'booked' || status === 'locked';
  
  return (
    <button
      className={`seat seat--${status} seat--${seat.category}`}
      onClick={onClick}
      disabled={isDisabled}
      aria-label={`Seat ${seat.label}, ${seat.category}, ${status}`}
      aria-pressed={status === 'selected'}
    >
      {seat.number}
    </button>
  );
});
```

### 5.2 Search & Filter Optimizations

#### Debounced Search

```typescript
function useMovieSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Debounce search input
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (debouncedQuery.length < 2) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    api.searchMovies(debouncedQuery)
      .then(setResults)
      .finally(() => setIsLoading(false));
  }, [debouncedQuery]);

  return { query, setQuery, results, isLoading };
}
```

#### URL-Based Filters

Persist filters in URL for shareability and back button:

```typescript
function useFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = useMemo(() => ({
    genre: searchParams.get('genre'),
    language: searchParams.get('language'),
    format: searchParams.get('format'),
    date: searchParams.get('date'),
  }), [searchParams]);

  const setFilter = (key: string, value: string | null) => {
    setSearchParams(prev => {
      if (value) {
        prev.set(key, value);
      } else {
        prev.delete(key);
      }
      return prev;
    });
  };

  return { filters, setFilter };
}
```

### 5.3 Payment Flow Optimizations

#### Payment Status Polling

```typescript
function usePaymentStatus(paymentId: string | null) {
  const [status, setStatus] = useState<PaymentStatus | null>(null);
  const [booking, setBooking] = useState<Booking | null>(null);

  useEffect(() => {
    if (!paymentId) return;

    let attempts = 0;
    const maxAttempts = 30; // 5 minutes max
    const interval = 10000; // 10 seconds

    const poll = async () => {
      try {
        const response = await api.getPaymentStatus(paymentId);
        setStatus(response.status);

        if (response.status === 'success') {
          setBooking(response.booking);
          return; // Stop polling
        }

        if (response.status === 'failed') {
          return; // Stop polling
        }

        // Continue polling if pending
        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(poll, interval);
        }
      } catch (error) {
        // Handle error, maybe retry
      }
    };

    poll();
  }, [paymentId]);

  return { status, booking };
}
```

#### Payment Method Preloading

```typescript
// Preload saved cards when user reaches checkout intent
function usePreloadPaymentMethods() {
  const queryClient = useQueryClient();

  const preload = () => {
    queryClient.prefetchQuery({
      queryKey: ['payment-methods'],
      queryFn: api.getPaymentMethods,
    });
  };

  return preload;
}

// Trigger on seat selection
function SeatSelection() {
  const preloadPaymentMethods = usePreloadPaymentMethods();

  useEffect(() => {
    // Preload when user selects first seat
    if (selectedSeats.length === 1) {
      preloadPaymentMethods();
    }
  }, [selectedSeats]);
}
```

### 5.4 Performance Optimizations

#### Image Optimization

```typescript
// Movie poster with responsive loading
function MoviePoster({ movie, size }: { movie: Movie; size: 'sm' | 'md' | 'lg' }) {
  const dimensions = {
    sm: { width: 120, height: 180 },
    md: { width: 200, height: 300 },
    lg: { width: 300, height: 450 },
  }[size];

  return (
    <img
      src={`${movie.posterUrl}?w=${dimensions.width}&h=${dimensions.height}&format=webp`}
      srcSet={`
        ${movie.posterUrl}?w=${dimensions.width}&format=webp 1x,
        ${movie.posterUrl}?w=${dimensions.width * 2}&format=webp 2x
      `}
      alt={movie.title}
      loading="lazy"
      width={dimensions.width}
      height={dimensions.height}
    />
  );
}
```

#### Code Splitting

```typescript
// Lazy load heavy components
const SeatMap = lazy(() => import('./components/SeatMap'));
const PaymentForm = lazy(() => import('./components/PaymentForm'));
const QRCode = lazy(() => import('./components/QRCode'));

// Route-based splitting
const routes = [
  { path: '/', element: <HomePage /> },
  { path: '/movies/:slug', element: lazy(() => import('./pages/MovieDetails')) },
  { path: '/book/:showtimeId', element: lazy(() => import('./pages/SeatSelection')) },
  { path: '/checkout/:lockId', element: lazy(() => import('./pages/Checkout')) },
];
```

#### Skeleton Loading

```typescript
function MovieDetailsSkeleton() {
  return (
    <div className="movie-details-skeleton">
      <div className="skeleton skeleton--banner" />
      <div className="skeleton skeleton--title" />
      <div className="skeleton skeleton--text" />
      <div className="skeleton skeleton--text" />
      <div className="showtimes-skeleton">
        {[1, 2, 3].map(i => (
          <div key={i} className="skeleton skeleton--showtime" />
        ))}
      </div>
    </div>
  );
}
```

### 5.5 Accessibility

#### Seat Map Accessibility

```typescript
function SeatMap({ layout, onSeatClick }: SeatMapProps) {
  return (
    <div
      role="grid"
      aria-label="Theater seat selection. Use arrow keys to navigate."
      onKeyDown={handleKeyNavigation}
    >
      <div role="rowgroup">
        {layout.rows.map(row => (
          <div key={row.id} role="row" aria-label={`Row ${row.label}`}>
            {row.seats.map(seat => (
              <button
                key={seat.id}
                role="gridcell"
                aria-label={getSeatLabel(seat)}
                aria-selected={isSelected(seat)}
                aria-disabled={!isAvailable(seat)}
                tabIndex={isFocused(seat) ? 0 : -1}
                onClick={() => onSeatClick(seat)}
              >
                {seat.number}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function getSeatLabel(seat: Seat): string {
  const status = seat.status === 'available' 
    ? `₹${seat.price}` 
    : seat.status;
  return `Seat ${seat.label}, ${seat.category} category, ${status}`;
}
```

#### Timer Accessibility

```typescript
function Timer({ remaining, showWarning }: TimerProps) {
  return (
    <div
      role="timer"
      aria-live={showWarning ? 'assertive' : 'polite'}
      aria-label={`Time remaining: ${formatTime(remaining)}`}
      className={showWarning ? 'timer--warning' : ''}
    >
      <span aria-hidden="true">⏱️</span>
      <span>{formatTime(remaining)}</span>
      {showWarning && (
        <span className="sr-only">
          Warning: Less than 2 minutes remaining to complete booking
        </span>
      )}
    </div>
  );
}
```

### 5.6 Error Handling

```typescript
// Seat lock expiry
function handleLockExpiry() {
  toast.error('Your seat selection has expired');
  clearSelectedSeats();
  router.push(`/movies/${movieSlug}/book`);
}

// Payment failure
function handlePaymentFailure(error: PaymentError) {
  if (error.code === 'SEATS_UNAVAILABLE') {
    toast.error('Selected seats are no longer available');
    router.push(`/book/${showtimeId}`);
  } else if (error.code === 'PAYMENT_DECLINED') {
    toast.error('Payment was declined. Please try another method.');
  } else {
    toast.error('Something went wrong. Please try again.');
  }
}

// Network error with retry
async function fetchWithRetry<T>(
  fn: () => Promise<T>,
  retries = 3
): Promise<T> {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === retries - 1) throw error;
      await delay(1000 * Math.pow(2, i)); // Exponential backoff
    }
  }
  throw new Error('Max retries exceeded');
}
```

---

## Summary

| Section | Key Points |
|---------|------------|
| **Requirements** | Browse, search, select seats, book, pay |
| **Architecture** | SSR for SEO pages, CSR for interactive booking |
| **Data Model** | Movies, Theaters, Showtimes, Seats, Bookings |
| **Interface** | REST + WebSocket for real-time seat updates |
| **Optimizations** | Seat locking, timer, debounced search, code splitting |

### Key Challenges for BookMyShow

1. **Concurrency** - Prevent double-booking with distributed locks
2. **Real-time** - Live seat availability across users
3. **Timer management** - Seat lock expiry handling
4. **Payment integration** - Multiple payment methods, status polling
5. **Performance** - Large seat maps, image-heavy content
6. **Mobile** - Responsive seat selection UI

---

## Interview Tips

1. **Start with user flow** - Sketch the booking journey
2. **Emphasize concurrency** - Seat locking is the hardest problem
3. **Discuss real-time** - WebSocket vs polling for seat updates
4. **Consider edge cases** - Timer expiry, payment failures, network issues
5. **Mention scaling** - Popular movie releases, flash sales
6. **Don't forget mobile** - Seat map on small screens is tricky

---

## References

- [BookMyShow Engineering Blog](https://medium.com/bookmyshow-engineering)
- [Designing Ticketmaster](https://www.hellointerview.com/learn/system-design/answer-keys/ticketmaster)
- [Redis for Real-time Seat Locking](https://redis.io/topics/distlock)
- [WebSocket Best Practices](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API)
