# BookMyShow - Low-Level Design (LLD)

> Detailed implementation specifications for the BookMyShow frontend.

---

## Table of Contents

1. [Type Definitions](#1-type-definitions)
2. [API Specifications](#2-api-specifications)
3. [Component Specifications](#3-component-specifications)
4. [State Management](#4-state-management)
5. [Custom Hooks](#5-custom-hooks)
6. [WebSocket Implementation](#6-websocket-implementation)
7. [Performance Optimizations](#7-performance-optimizations)
8. [Accessibility](#8-accessibility)

---

## 1. Type Definitions

### 1.1 Movie Types

```typescript
interface Movie {
  id: string;
  title: string;
  slug: string;
  description: string;
  duration: number; // minutes
  releaseDate: string;
  genres: Genre[];
  languages: Language[];
  formats: Format[];
  certification: Certification;
  rating: number;
  ratingCount: number;
  posterUrl: string;
  bannerUrl: string;
  trailerUrl: string;
  cast: CastMember[];
  crew: CrewMember[];
  status: MovieStatus;
}

type Certification = 'U' | 'UA' | 'A' | 'S';
type MovieStatus = 'coming_soon' | 'now_showing' | 'ended';
type Format = '2D' | '3D' | 'IMAX' | '4DX' | 'SCREENX';

interface Genre {
  id: string;
  name: string;
  slug: string;
}

interface Language {
  code: string;
  name: string;
}

interface CastMember {
  id: string;
  name: string;
  role: string;
  character: string;
  imageUrl: string;
}

interface CrewMember {
  id: string;
  name: string;
  role: 'Director' | 'Producer' | 'Writer' | 'Composer';
  imageUrl: string;
}
```

### 1.2 Theater & Showtime Types

```typescript
interface Theater {
  id: string;
  name: string;
  address: string;
  city: string;
  region: string;
  location: GeoLocation;
  amenities: Amenity[];
  screens: Screen[];
  distance?: number; // km from user
}

interface GeoLocation {
  lat: number;
  lng: number;
}

type Amenity = 
  | 'parking' 
  | 'food_court' 
  | 'wheelchair_access' 
  | 'dolby_atmos' 
  | 'recliner';

interface Screen {
  id: string;
  name: string;
  format: Format;
  capacity: number;
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
  subtitles?: string;
  pricing: PricingTier[];
  availability: ShowtimeAvailability;
}

interface PricingTier {
  category: SeatCategory;
  price: number;
  convenienceFee: number;
}

type SeatCategory = 'silver' | 'gold' | 'platinum' | 'recliner';

interface ShowtimeAvailability {
  total: number;
  available: number;
  status: 'available' | 'filling_fast' | 'almost_full' | 'sold_out';
}
```

### 1.3 Seat Types

```typescript
interface SeatLayout {
  screenId: string;
  rows: SeatRow[];
  gaps: LayoutGap[];
}

interface SeatRow {
  id: string;
  label: string; // "A", "B", etc.
  category: SeatCategory;
  y: number; // Position from screen
  seats: Seat[];
}

interface Seat {
  id: string;
  rowId: string;
  number: number;
  label: string; // "A1", "A2"
  x: number; // Position in row
  status: SeatStatus;
  price: number;
  type: SeatType;
  lockedBy?: string;
  lockedUntil?: string;
}

type SeatStatus = 'available' | 'locked' | 'booked' | 'blocked';
type SeatType = 'regular' | 'wheelchair' | 'companion' | 'blocked';

interface LayoutGap {
  type: 'aisle' | 'walkway';
  afterRow?: string;
  afterSeat?: number;
  width: number;
}
```

### 1.4 Booking Types

```typescript
interface Booking {
  id: string;
  bookingNumber: string;
  userId: string;
  movie: BookingMovie;
  showtime: BookingShowtime;
  theater: BookingTheater;
  seats: BookedSeat[];
  pricing: BookingPricing;
  payment: PaymentInfo;
  status: BookingStatus;
  qrCode: string;
  createdAt: string;
}

interface BookingMovie {
  id: string;
  title: string;
  posterUrl: string;
  certification: Certification;
  format: Format;
  language: string;
}

interface BookingShowtime {
  id: string;
  date: string;
  time: string;
  screenName: string;
}

interface BookingTheater {
  id: string;
  name: string;
  address: string;
}

interface BookedSeat {
  id: string;
  label: string;
  category: SeatCategory;
  price: number;
}

interface BookingPricing {
  ticketTotal: number;
  convenienceFee: number;
  discount: number;
  taxes: number;
  finalAmount: number;
}

type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'refunded';

interface PaymentInfo {
  id: string;
  method: PaymentMethod;
  status: 'pending' | 'success' | 'failed';
  transactionId?: string;
}

type PaymentMethod = 
  | { type: 'card'; last4: string; brand: string }
  | { type: 'upi'; vpa: string }
  | { type: 'wallet'; name: string }
  | { type: 'netbanking'; bank: string };
```

### 1.5 Cart & Lock Types

```typescript
interface Cart {
  showtimeId: string;
  seats: SelectedSeat[];
  lockId: string | null;
  lockExpiresAt: string | null;
  appliedOffer: Offer | null;
  pricing: CartPricing;
}

interface SelectedSeat {
  id: string;
  label: string;
  category: SeatCategory;
  price: number;
}

interface CartPricing {
  subtotal: number;
  convenienceFee: number;
  discount: number;
  taxes: number;
  total: number;
}

interface Offer {
  id: string;
  code: string;
  description: string;
  discountType: 'percentage' | 'flat';
  discountValue: number;
  maxDiscount?: number;
  minPurchase?: number;
}

interface SeatLockResponse {
  lockId: string;
  expiresAt: string;
  seats: Seat[];
}
```

---

## 2. API Specifications

### 2.1 Movies API

```typescript
// GET /api/movies
interface GetMoviesParams {
  city: string;
  status?: MovieStatus;
  genre?: string;
  language?: string;
  format?: Format;
  cursor?: string;
  limit?: number;
}

interface GetMoviesResponse {
  movies: Movie[];
  pagination: {
    nextCursor: string | null;
    hasMore: boolean;
  };
}

// GET /api/movies/:slug
interface GetMovieResponse {
  movie: Movie;
  relatedMovies: Movie[];
}

// GET /api/movies/search
interface SearchMoviesParams {
  q: string;
  city: string;
  limit?: number;
}

interface SearchMoviesResponse {
  movies: Movie[];
  total: number;
}
```

### 2.2 Showtimes API

```typescript
// GET /api/movies/:movieId/showtimes
interface GetShowtimesParams {
  city: string;
  date: string; // YYYY-MM-DD
}

interface GetShowtimesResponse {
  theaters: TheaterWithShowtimes[];
}

interface TheaterWithShowtimes {
  theater: Theater;
  showtimes: Showtime[];
}

// GET /api/showtimes/:showtimeId/seats
interface GetSeatsResponse {
  layout: SeatLayout;
  lockedSeats: string[];
  bookedSeats: string[];
}
```

### 2.3 Booking API

```typescript
// POST /api/bookings/lock
interface LockSeatsRequest {
  showtimeId: string;
  seatIds: string[];
}

interface LockSeatsResponse {
  lockId: string;
  expiresAt: string;
  seats: Seat[];
}

// POST /api/bookings/lock/:lockId/extend
interface ExtendLockResponse {
  expiresAt: string;
}

// DELETE /api/bookings/lock/:lockId
// Response: 204 No Content

// POST /api/bookings
interface CreateBookingRequest {
  lockId: string;
  paymentId: string;
}

interface CreateBookingResponse {
  booking: Booking;
}

// GET /api/bookings/:bookingId
interface GetBookingResponse {
  booking: Booking;
}

// GET /api/users/:userId/bookings
interface GetUserBookingsResponse {
  bookings: Booking[];
  pagination: {
    nextCursor: string | null;
    hasMore: boolean;
  };
}
```

### 2.4 Payment API

```typescript
// POST /api/payments/initiate
interface InitiatePaymentRequest {
  lockId: string;
  amount: number;
  method: PaymentMethodType;
  returnUrl: string;
}

type PaymentMethodType = 'card' | 'upi' | 'wallet' | 'netbanking';

interface InitiatePaymentResponse {
  paymentId: string;
  status: 'pending' | 'requires_action';
  actionUrl?: string; // Redirect URL for bank auth
}

// GET /api/payments/:paymentId/status
interface PaymentStatusResponse {
  status: 'pending' | 'success' | 'failed' | 'expired';
  booking?: Booking;
  errorMessage?: string;
}
```

---

## 3. Component Specifications

### 3.1 SeatMap Component

```typescript
interface SeatMapProps {
  layout: SeatLayout;
  selectedSeats: string[];
  lockedSeats: string[];
  bookedSeats: string[];
  maxSeats: number;
  onSeatSelect: (seatId: string) => void;
  onSeatDeselect: (seatId: string) => void;
  disabled?: boolean;
}

// Implementation
const SeatMap: React.FC<SeatMapProps> = ({
  layout,
  selectedSeats,
  lockedSeats,
  bookedSeats,
  maxSeats,
  onSeatSelect,
  onSeatDeselect,
  disabled,
}) => {
  const seatStatusMap = useMemo(() => {
    const map = new Map<string, SeatStatus>();
    
    selectedSeats.forEach(id => map.set(id, 'selected'));
    lockedSeats.forEach(id => map.set(id, 'locked'));
    bookedSeats.forEach(id => map.set(id, 'booked'));
    
    return map;
  }, [selectedSeats, lockedSeats, bookedSeats]);

  const canSelectMore = selectedSeats.length < maxSeats;

  const handleSeatClick = (seat: Seat) => {
    if (disabled) return;
    
    const isSelected = selectedSeats.includes(seat.id);
    
    if (isSelected) {
      onSeatDeselect(seat.id);
    } else if (canSelectMore && seat.status === 'available') {
      onSeatSelect(seat.id);
    }
  };

  return (
    <div className="seat-map" role="grid" aria-label="Select your seats">
      <div className="seat-map__screen">
        <span>SCREEN</span>
      </div>

      <div className="seat-map__layout">
        {layout.rows.map(row => (
          <SeatRow
            key={row.id}
            row={row}
            seatStatusMap={seatStatusMap}
            onSeatClick={handleSeatClick}
            disabled={disabled}
          />
        ))}
      </div>

      <SeatLegend />
    </div>
  );
};

// Seat Row
const SeatRow: React.FC<{
  row: SeatRow;
  seatStatusMap: Map<string, SeatStatus>;
  onSeatClick: (seat: Seat) => void;
  disabled: boolean;
}> = memo(({ row, seatStatusMap, onSeatClick, disabled }) => (
  <div className="seat-row" role="row" aria-label={`Row ${row.label}`}>
    <span className="seat-row__label">{row.label}</span>
    
    <div className="seat-row__seats">
      {row.seats.map(seat => (
        <SeatButton
          key={seat.id}
          seat={seat}
          status={seatStatusMap.get(seat.id) || seat.status}
          onClick={() => onSeatClick(seat)}
          disabled={disabled}
        />
      ))}
    </div>
  </div>
));

// Individual Seat
const SeatButton: React.FC<{
  seat: Seat;
  status: SeatStatus | 'selected';
  onClick: () => void;
  disabled: boolean;
}> = memo(({ seat, status, onClick, disabled }) => {
  const isInteractive = status === 'available' || status === 'selected';
  
  return (
    <button
      className={`seat seat--${status} seat--${seat.type}`}
      onClick={onClick}
      disabled={disabled || !isInteractive}
      aria-label={`Seat ${seat.label}, ${seat.category}, ₹${seat.price}, ${status}`}
      aria-pressed={status === 'selected'}
      aria-disabled={!isInteractive}
    >
      {seat.number}
    </button>
  );
});
```

### 3.2 Timer Component

```typescript
interface TimerProps {
  expiresAt: number; // Unix timestamp
  onExpire: () => void;
  warningThreshold?: number; // seconds, default 120
}

const Timer: React.FC<TimerProps> = ({
  expiresAt,
  onExpire,
  warningThreshold = 120,
}) => {
  const [remaining, setRemaining] = useState<number>(0);

  useEffect(() => {
    const updateTimer = () => {
      const now = Date.now();
      const diff = Math.max(0, Math.floor((expiresAt - now) / 1000));
      setRemaining(diff);

      if (diff === 0) {
        onExpire();
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [expiresAt, onExpire]);

  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;
  const isWarning = remaining > 0 && remaining <= warningThreshold;
  const progress = Math.max(0, remaining / 600); // Assuming 10 min total

  return (
    <div
      className={`timer ${isWarning ? 'timer--warning' : ''}`}
      role="timer"
      aria-live={isWarning ? 'assertive' : 'polite'}
      aria-label={`Time remaining: ${minutes} minutes and ${seconds} seconds`}
    >
      <div className="timer__icon">
        {isWarning ? '⚠️' : '⏱️'}
      </div>
      
      <div className="timer__content">
        <span className="timer__text">
          {isWarning ? 'Hurry! Only' : 'Complete booking in'}
        </span>
        <span className="timer__value">
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </span>
        {isWarning && <span className="timer__text">remaining!</span>}
      </div>

      <div className="timer__progress">
        <div
          className="timer__progress-bar"
          style={{ width: `${progress * 100}%` }}
        />
      </div>
    </div>
  );
};
```

### 3.3 MovieCard Component

```typescript
interface MovieCardProps {
  movie: Movie;
  variant: 'poster' | 'horizontal' | 'featured';
  showRating?: boolean;
  onClick?: () => void;
}

const MovieCard: React.FC<MovieCardProps> = ({
  movie,
  variant,
  showRating = true,
  onClick,
}) => {
  const dimensions = {
    poster: { width: 200, height: 300 },
    horizontal: { width: 120, height: 180 },
    featured: { width: 400, height: 225 },
  }[variant];

  return (
    <article
      className={`movie-card movie-card--${variant}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick?.()}
    >
      <div className="movie-card__poster">
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
        
        {movie.status === 'coming_soon' && (
          <span className="movie-card__badge">Coming Soon</span>
        )}
      </div>

      <div className="movie-card__info">
        <h3 className="movie-card__title">{movie.title}</h3>
        
        {showRating && movie.rating > 0 && (
          <div className="movie-card__rating" aria-label={`Rating: ${movie.rating} out of 10`}>
            <span className="movie-card__rating-star">⭐</span>
            <span className="movie-card__rating-value">{movie.rating.toFixed(1)}/10</span>
            <span className="movie-card__rating-count">
              {formatCount(movie.ratingCount)} votes
            </span>
          </div>
        )}

        <div className="movie-card__meta">
          <span className="movie-card__certification">{movie.certification}</span>
          <span className="movie-card__genres">
            {movie.genres.slice(0, 2).map(g => g.name).join(', ')}
          </span>
        </div>
      </div>
    </article>
  );
};
```

### 3.4 PaymentMethodSelector Component

```typescript
interface PaymentMethodSelectorProps {
  savedCards: SavedCard[];
  selectedMethod: PaymentMethod | null;
  onSelect: (method: PaymentMethod) => void;
}

interface SavedCard {
  id: string;
  last4: string;
  brand: 'visa' | 'mastercard' | 'amex';
  expiryMonth: number;
  expiryYear: number;
}

const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  savedCards,
  selectedMethod,
  onSelect,
}) => {
  return (
    <div className="payment-methods" role="radiogroup" aria-label="Select payment method">
      {/* Saved Cards */}
      {savedCards.length > 0 && (
        <section className="payment-section">
          <h3>Saved Cards</h3>
          {savedCards.map(card => (
            <PaymentOption
              key={card.id}
              id={`card-${card.id}`}
              icon={getCardIcon(card.brand)}
              label={`${card.brand.toUpperCase()} •••• ${card.last4}`}
              sublabel={`Expires ${card.expiryMonth}/${card.expiryYear}`}
              selected={selectedMethod?.type === 'card' && selectedMethod.id === card.id}
              onSelect={() => onSelect({ type: 'card', id: card.id, ...card })}
            />
          ))}
        </section>
      )}

      {/* UPI */}
      <section className="payment-section">
        <h3>UPI</h3>
        <PaymentOption
          id="upi-gpay"
          icon="💳"
          label="Google Pay"
          selected={selectedMethod?.type === 'upi' && selectedMethod.app === 'gpay'}
          onSelect={() => onSelect({ type: 'upi', app: 'gpay' })}
        />
        <PaymentOption
          id="upi-phonepe"
          icon="💳"
          label="PhonePe"
          selected={selectedMethod?.type === 'upi' && selectedMethod.app === 'phonepe'}
          onSelect={() => onSelect({ type: 'upi', app: 'phonepe' })}
        />
        <PaymentOption
          id="upi-other"
          icon="💳"
          label="Enter UPI ID"
          selected={selectedMethod?.type === 'upi' && selectedMethod.app === 'custom'}
          onSelect={() => onSelect({ type: 'upi', app: 'custom' })}
        />
      </section>

      {/* Wallets */}
      <section className="payment-section">
        <h3>Wallets</h3>
        <PaymentOption
          id="wallet-paytm"
          icon="👛"
          label="Paytm Wallet"
          selected={selectedMethod?.type === 'wallet' && selectedMethod.name === 'paytm'}
          onSelect={() => onSelect({ type: 'wallet', name: 'paytm' })}
        />
      </section>

      {/* Net Banking */}
      <section className="payment-section">
        <h3>Net Banking</h3>
        <PaymentOption
          id="netbanking"
          icon="🏦"
          label="All Banks"
          selected={selectedMethod?.type === 'netbanking'}
          onSelect={() => onSelect({ type: 'netbanking' })}
        />
      </section>
    </div>
  );
};

const PaymentOption: React.FC<{
  id: string;
  icon: string;
  label: string;
  sublabel?: string;
  selected: boolean;
  onSelect: () => void;
}> = ({ id, icon, label, sublabel, selected, onSelect }) => (
  <button
    id={id}
    className={`payment-option ${selected ? 'payment-option--selected' : ''}`}
    onClick={onSelect}
    role="radio"
    aria-checked={selected}
  >
    <span className="payment-option__icon">{icon}</span>
    <div className="payment-option__content">
      <span className="payment-option__label">{label}</span>
      {sublabel && <span className="payment-option__sublabel">{sublabel}</span>}
    </div>
    <span className="payment-option__check">{selected ? '✓' : ''}</span>
  </button>
);
```

---

## 4. State Management

### 4.1 Booking Store (Zustand)

```typescript
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

interface BookingState {
  // State
  showtimeId: string | null;
  selectedSeats: SelectedSeat[];
  lockId: string | null;
  lockExpiresAt: number | null;
  step: BookingStep;
  isLoading: boolean;
  error: string | null;

  // Actions
  setShowtime: (id: string) => void;
  selectSeat: (seat: SelectedSeat) => void;
  deselectSeat: (seatId: string) => void;
  setLock: (lockId: string, expiresAt: string) => void;
  clearLock: () => void;
  setStep: (step: BookingStep) => void;
  reset: () => void;
}

type BookingStep = 'showtime' | 'seats' | 'checkout' | 'payment' | 'confirmation';

const initialState = {
  showtimeId: null,
  selectedSeats: [],
  lockId: null,
  lockExpiresAt: null,
  step: 'showtime' as BookingStep,
  isLoading: false,
  error: null,
};

export const useBookingStore = create<BookingState>()(
  immer((set) => ({
    ...initialState,

    setShowtime: (id) => set((state) => {
      state.showtimeId = id;
      state.step = 'seats';
    }),

    selectSeat: (seat) => set((state) => {
      state.selectedSeats.push(seat);
    }),

    deselectSeat: (seatId) => set((state) => {
      state.selectedSeats = state.selectedSeats.filter(s => s.id !== seatId);
    }),

    setLock: (lockId, expiresAt) => set((state) => {
      state.lockId = lockId;
      state.lockExpiresAt = new Date(expiresAt).getTime();
    }),

    clearLock: () => set((state) => {
      state.lockId = null;
      state.lockExpiresAt = null;
      state.selectedSeats = [];
      state.step = 'seats';
    }),

    setStep: (step) => set((state) => {
      state.step = step;
    }),

    reset: () => set(initialState),
  }))
);
```

### 4.2 TanStack Query Setup

```typescript
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 30 * 60 * 1000, // 30 minutes
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

// Query hooks
export function useMovies(params: GetMoviesParams) {
  return useQuery({
    queryKey: ['movies', params],
    queryFn: () => api.getMovies(params),
  });
}

export function useShowtimes(movieId: string, params: GetShowtimesParams) {
  return useQuery({
    queryKey: ['showtimes', movieId, params],
    queryFn: () => api.getShowtimes(movieId, params),
    enabled: !!movieId,
  });
}

export function useSeats(showtimeId: string) {
  return useQuery({
    queryKey: ['seats', showtimeId],
    queryFn: () => api.getSeats(showtimeId),
    enabled: !!showtimeId,
    refetchInterval: 30000, // Refresh every 30 seconds
  });
}
```

---

## 5. Custom Hooks

### 5.1 useSeatSelection

```typescript
function useSeatSelection(showtimeId: string) {
  const queryClient = useQueryClient();
  const bookingStore = useBookingStore();
  const ws = useWebSocket(`/ws/showtimes/${showtimeId}`);

  const lockMutation = useMutation({
    mutationFn: (seatIds: string[]) => api.lockSeats(showtimeId, seatIds),
    onSuccess: (data) => {
      bookingStore.setLock(data.lockId, data.expiresAt);
    },
    onError: (error) => {
      // Refresh seat availability
      queryClient.invalidateQueries(['seats', showtimeId]);
      toast.error('Failed to lock seats. Please try again.');
    },
  });

  const selectSeat = async (seat: Seat) => {
    const newSeats = [...bookingStore.selectedSeats, { id: seat.id, label: seat.label, price: seat.price }];
    
    // Optimistic update
    bookingStore.selectSeat({ id: seat.id, label: seat.label, category: seat.category, price: seat.price });

    // Lock seats on server
    try {
      await lockMutation.mutateAsync(newSeats.map(s => s.id));
    } catch {
      bookingStore.deselectSeat(seat.id);
    }
  };

  const deselectSeat = async (seatId: string) => {
    const newSeats = bookingStore.selectedSeats.filter(s => s.id !== seatId);
    
    bookingStore.deselectSeat(seatId);

    if (newSeats.length > 0 && bookingStore.lockId) {
      // Update lock with remaining seats
      await lockMutation.mutateAsync(newSeats.map(s => s.id));
    } else if (newSeats.length === 0 && bookingStore.lockId) {
      // Release lock if no seats selected
      await api.releaseLock(bookingStore.lockId);
      bookingStore.clearLock();
    }
  };

  // Handle WebSocket updates
  useEffect(() => {
    if (!ws) return;

    ws.onmessage = (event) => {
      const { type, data } = JSON.parse(event.data);

      switch (type) {
        case 'SEAT_LOCKED':
        case 'SEAT_BOOKED':
          queryClient.setQueryData(['seats', showtimeId], (old) => ({
            ...old,
            lockedSeats: [...(old?.lockedSeats || []), ...data.seatIds],
          }));
          break;

        case 'SEAT_UNLOCKED':
          queryClient.setQueryData(['seats', showtimeId], (old) => ({
            ...old,
            lockedSeats: (old?.lockedSeats || []).filter(id => !data.seatIds.includes(id)),
          }));
          break;
      }
    };
  }, [ws, showtimeId, queryClient]);

  return {
    selectedSeats: bookingStore.selectedSeats,
    lockId: bookingStore.lockId,
    lockExpiresAt: bookingStore.lockExpiresAt,
    isLocking: lockMutation.isPending,
    selectSeat,
    deselectSeat,
  };
}
```

### 5.2 usePayment

```typescript
function usePayment() {
  const [status, setStatus] = useState<PaymentStatus>('idle');
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const bookingStore = useBookingStore();
  const router = useRouter();

  const initiate = async (method: PaymentMethod) => {
    if (!bookingStore.lockId) {
      throw new Error('No lock ID');
    }

    setStatus('initiating');

    try {
      const response = await api.initiatePayment({
        lockId: bookingStore.lockId,
        amount: calculateTotal(bookingStore.selectedSeats),
        method: method.type,
        returnUrl: `${window.location.origin}/payment/callback`,
      });

      setPaymentId(response.paymentId);

      if (response.actionUrl) {
        // Redirect to bank/UPI app
        window.location.href = response.actionUrl;
      } else {
        // Start polling for payment status
        setStatus('processing');
        await pollPaymentStatus(response.paymentId);
      }
    } catch (error) {
      setStatus('failed');
      toast.error('Payment initiation failed');
    }
  };

  const pollPaymentStatus = async (id: string) => {
    const maxAttempts = 60; // 5 minutes with 5s interval
    let attempts = 0;

    while (attempts < maxAttempts) {
      const result = await api.getPaymentStatus(id);

      if (result.status === 'success') {
        setStatus('success');
        bookingStore.setStep('confirmation');
        router.push(`/booking/${result.booking.id}`);
        return;
      }

      if (result.status === 'failed') {
        setStatus('failed');
        toast.error(result.errorMessage || 'Payment failed');
        return;
      }

      attempts++;
      await new Promise(resolve => setTimeout(resolve, 5000));
    }

    setStatus('timeout');
    toast.error('Payment verification timed out');
  };

  return {
    status,
    paymentId,
    initiate,
    retry: () => setStatus('idle'),
  };
}

type PaymentStatus = 'idle' | 'initiating' | 'processing' | 'success' | 'failed' | 'timeout';
```

---

## 6. WebSocket Implementation

### 6.1 WebSocket Hook

```typescript
function useWebSocket(path: string) {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;

  useEffect(() => {
    const connect = () => {
      const socket = new WebSocket(`wss://api.bookmyshow.com${path}`);

      socket.onopen = () => {
        setIsConnected(true);
        reconnectAttempts.current = 0;
        console.log('WebSocket connected');
      };

      socket.onclose = (event) => {
        setIsConnected(false);
        
        if (!event.wasClean && reconnectAttempts.current < maxReconnectAttempts) {
          const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 30000);
          reconnectAttempts.current++;
          setTimeout(connect, delay);
        }
      };

      socket.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      setWs(socket);
    };

    connect();

    return () => {
      ws?.close(1000, 'Component unmounted');
    };
  }, [path]);

  const send = useCallback((data: object) => {
    if (ws?.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(data));
    }
  }, [ws]);

  return { ws, isConnected, send };
}
```

### 6.2 Real-Time Seat Updates

```typescript
// Server message types
type WSMessage =
  | { type: 'SEAT_LOCKED'; data: { seatIds: string[]; userId: string; expiresAt: string } }
  | { type: 'SEAT_UNLOCKED'; data: { seatIds: string[] } }
  | { type: 'SEAT_BOOKED'; data: { seatIds: string[] } }
  | { type: 'SHOWTIME_SOLD_OUT'; data: {} };

function useSeatUpdates(showtimeId: string, onUpdate: (msg: WSMessage) => void) {
  const { ws, isConnected } = useWebSocket(`/ws/showtimes/${showtimeId}`);

  useEffect(() => {
    if (!ws) return;

    ws.onmessage = (event) => {
      try {
        const message: WSMessage = JSON.parse(event.data);
        onUpdate(message);
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error);
      }
    };
  }, [ws, onUpdate]);

  return { isConnected };
}
```

---

## 7. Performance Optimizations

### 7.1 Route-Based Code Splitting

```typescript
import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

// Lazy load pages
const HomePage = lazy(() => import('./pages/Home'));
const MovieDetailsPage = lazy(() => import('./pages/MovieDetails'));
const SeatSelectionPage = lazy(() => import('./pages/SeatSelection'));
const CheckoutPage = lazy(() => import('./pages/Checkout'));
const ConfirmationPage = lazy(() => import('./pages/Confirmation'));

function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/movies/:slug" element={<MovieDetailsPage />} />
        <Route path="/book/:showtimeId" element={<SeatSelectionPage />} />
        <Route path="/checkout/:lockId" element={<CheckoutPage />} />
        <Route path="/booking/:bookingId" element={<ConfirmationPage />} />
      </Routes>
    </Suspense>
  );
}
```

### 7.2 Image Optimization

```typescript
function OptimizedImage({
  src,
  alt,
  width,
  height,
  priority = false,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  priority?: boolean;
}) {
  return (
    <img
      src={`${src}?w=${width}&h=${height}&format=webp&quality=80`}
      srcSet={`
        ${src}?w=${width}&format=webp 1x,
        ${src}?w=${width * 1.5}&format=webp 1.5x,
        ${src}?w=${width * 2}&format=webp 2x
      `}
      alt={alt}
      width={width}
      height={height}
      loading={priority ? 'eager' : 'lazy'}
      decoding={priority ? 'sync' : 'async'}
    />
  );
}
```

---

## 8. Accessibility

### 8.1 Seat Map Accessibility

```typescript
function SeatMap({ layout, onSeatSelect }: SeatMapProps) {
  const focusedRef = useRef<string | null>(null);

  const handleKeyDown = (e: React.KeyboardEvent, seat: Seat, row: SeatRow) => {
    const allSeats = layout.rows.flatMap(r => r.seats);
    const currentIndex = allSeats.findIndex(s => s.id === seat.id);

    switch (e.key) {
      case 'ArrowRight':
        e.preventDefault();
        focusNext(allSeats, currentIndex);
        break;
      case 'ArrowLeft':
        e.preventDefault();
        focusPrev(allSeats, currentIndex);
        break;
      case 'ArrowUp':
        e.preventDefault();
        focusAbove(layout.rows, row, seat);
        break;
      case 'ArrowDown':
        e.preventDefault();
        focusBelow(layout.rows, row, seat);
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        onSeatSelect(seat);
        break;
    }
  };

  return (
    <div
      role="application"
      aria-label="Theater seat map. Use arrow keys to navigate, Enter or Space to select."
    >
      <div className="sr-only">
        <p>Seat categories: Silver ₹150, Gold ₹250, Platinum ₹350</p>
        <p>Use arrow keys to move between seats. Press Enter or Space to select.</p>
      </div>

      <div className="seat-map__screen" aria-hidden="true">SCREEN</div>

      {layout.rows.map(row => (
        <div key={row.id} role="row">
          <span id={`row-${row.id}`} className="sr-only">Row {row.label}</span>
          {row.seats.map((seat, index) => (
            <button
              key={seat.id}
              role="gridcell"
              aria-describedby={`row-${row.id}`}
              aria-label={getAccessibleLabel(seat)}
              tabIndex={index === 0 && row === layout.rows[0] ? 0 : -1}
              onKeyDown={(e) => handleKeyDown(e, seat, row)}
              onClick={() => onSeatSelect(seat)}
            >
              {seat.number}
            </button>
          ))}
        </div>
      ))}

      <SeatLegend />
    </div>
  );
}

function getAccessibleLabel(seat: Seat): string {
  const status = {
    available: `Available, ₹${seat.price}`,
    locked: 'Currently being held by another user',
    booked: 'Already sold',
    selected: `Selected, ₹${seat.price}`,
  }[seat.status];

  return `Seat ${seat.label}, ${seat.category} category, ${status}`;
}
```

### 8.2 Timer Accessibility

```typescript
function Timer({ expiresAt, onExpire }: TimerProps) {
  const [remaining, setRemaining] = useState(0);
  const announcerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Announce at key intervals
    if (remaining === 300) announce('5 minutes remaining to complete booking');
    if (remaining === 120) announce('Warning: Only 2 minutes remaining');
    if (remaining === 60) announce('Urgent: Only 1 minute remaining');
    if (remaining === 30) announce('30 seconds remaining');
  }, [remaining]);

  const announce = (message: string) => {
    if (announcerRef.current) {
      announcerRef.current.textContent = message;
    }
  };

  return (
    <>
      <div
        role="timer"
        aria-live="polite"
        aria-atomic="true"
        className="timer"
      >
        <span>Time remaining: {formatTime(remaining)}</span>
      </div>

      {/* Screen reader announcer */}
      <div
        ref={announcerRef}
        role="status"
        aria-live="assertive"
        className="sr-only"
      />
    </>
  );
}
```

---

## Summary

This LLD provides detailed specifications for:

1. **Type Definitions** - All data structures for movies, theaters, seats, bookings
2. **API Contracts** - REST endpoints with request/response types
3. **Components** - SeatMap, Timer, MovieCard, PaymentSelector with full implementations
4. **State Management** - Zustand store for booking flow, TanStack Query for server state
5. **Custom Hooks** - useSeatSelection, usePayment with optimistic updates
6. **WebSocket** - Real-time seat availability handling
7. **Performance** - Code splitting, image optimization
8. **Accessibility** - Full ARIA support for seat map and timer
