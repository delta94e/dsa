import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

// ============================================================================
// Types
// ============================================================================

interface TeamInvitesState {
  /** IDs of invites that have been viewed */
  viewedInvites: string[];
  /** IDs of invites that have been dismissed */
  dismissedInvites: string[];
  /** Whether to show success popover after accepting invite */
  showSuccessPopover: boolean;
  /** Whether to show invite notification popover */
  showInviteNotificationPopover: boolean;
}

// ============================================================================
// Initial State
// ============================================================================

const initialState: TeamInvitesState = {
  viewedInvites: [],
  dismissedInvites: [],
  showSuccessPopover: false,
  showInviteNotificationPopover: false,
};

// ============================================================================
// Slice
// ============================================================================

const teamInvitesSlice = createSlice({
  name: 'teamInvites',
  initialState,
  reducers: {
    setViewedInvites: (state, action: PayloadAction<string[]>) => {
      const combined = [...state.viewedInvites, ...action.payload];
      state.viewedInvites = [...Array.from(new Set(combined))];
    },
    removeViewedInvite: (state, action: PayloadAction<string[]>) => {
      state.viewedInvites = state.viewedInvites.filter(
        (id) => id !== action.payload[0]
      );
    },
    setDismissedInvites: (state, action: PayloadAction<string[]>) => {
      const combined = [...state.dismissedInvites, ...action.payload];
      state.dismissedInvites = [...Array.from(new Set(combined))];
    },
    removeDismissedInvite: (state, action: PayloadAction<string[]>) => {
      state.dismissedInvites = state.dismissedInvites.filter(
        (id) => id !== action.payload[0]
      );
    },
    setShowInviteNotificationPopover: (state, action: PayloadAction<boolean>) => {
      state.showInviteNotificationPopover = action.payload;
    },
    setSuccessPopover: (state, action: PayloadAction<boolean>) => {
      state.showSuccessPopover = action.payload;
    },
    resetTeamInvitesState: () => initialState,
  },
});

// ============================================================================
// Persistence Config
// ============================================================================

const persistConfig = {
  version: 0.1,
  key: 'teamInvites',
  whitelist: [
    'viewedInvites',
    'dismissedInvites',
    'showSuccessPopover',
    'showInviteNotificationPopover',
  ],
  storage,
};

// ============================================================================
// Exports
// ============================================================================

export const {
  setViewedInvites,
  removeViewedInvite,
  setDismissedInvites,
  removeDismissedInvite,
  setShowInviteNotificationPopover,
  setSuccessPopover,
  resetTeamInvitesState,
} = teamInvitesSlice.actions;

export default persistReducer(persistConfig, teamInvitesSlice.reducer);
