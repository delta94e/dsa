'use client';

import { useCallback } from 'react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { useTeamsInvites } from './useTeamsInvites';
import {
  setViewedInvites,
  setShowInviteNotificationPopover,
  setDismissedInvites,
  setSuccessPopover,
} from '@/store/slices/teamsInvitesSlice';
import { dismiss as dismissToast } from '@/lib/toast';

// ============================================================================
// Types
// ============================================================================

export interface UseTeamInviteNotificationsResult {
  /** Whether each invite has been viewed */
  hasViewedThisNotification: boolean[];
  /** Invites that haven't been dismissed */
  invitesHaveNotBeenDismissed: Array<{ id: string }>;
  /** Invites that haven't been viewed */
  invitesHaveNotBeenViewed: Array<{ id: string }>;
  /** Whether invites have finished loading */
  invitesHaveLoaded: boolean;
  /** Whether to show success popover after accepting invite */
  showSuccessPopover: boolean;
  /** Whether to show invite notification popover */
  showInviteNotificationPopover: boolean;
  /** Close the notification */
  handleCloseNotification: () => void;
  /** Dismiss all non-dismissed invites */
  handleDismissInvites: () => void;
  /** Show success popup after accepting invite */
  handleAcceptInvitePopup: () => void;
  /** Close the congrats popup */
  handleCloseCongratsPopup: () => void;
  /** Dismiss toast notifications by ID */
  dismissNotifications: (ids: string[]) => void;
}

// ============================================================================
// Hook
// ============================================================================

/**
 * useTeamInviteNotifications
 * 
 * Hook for managing team invite notifications state and actions.
 * Tracks viewed/dismissed invites and controls success popover visibility.
 * 
 * @example
 * const { 
 *   showSuccessPopover, 
 *   handleCloseCongratsPopup,
 *   handleAcceptInvitePopup 
 * } = useTeamInviteNotifications();
 */
export function useTeamInviteNotifications(): UseTeamInviteNotificationsResult {
  const { teamsInvites, loading } = useTeamsInvites();
  const dispatch = useAppDispatch();

  // Redux state selectors
  const teamInvitesState = useAppSelector((state) => state.teamInvites);
  const showSuccessPopover = teamInvitesState?.showSuccessPopover ?? false;
  const showInviteNotificationPopover = teamInvitesState?.showInviteNotificationPopover ?? false;
  const viewedInvites: string[] = teamInvitesState?.viewedInvites ?? [];
  const dismissedInvites: string[] = teamInvitesState?.dismissedInvites ?? [];

  // Get invite IDs
  const inviteIds = teamsInvites.map((invite) => invite.id);

  // Check which invites have been viewed
  const hasViewedThisNotification = teamsInvites.map((invite) => viewedInvites.includes(invite.id));

  // Filter invites that haven't been dismissed
  const invitesHaveNotBeenDismissed = teamsInvites.filter((invite) => !dismissedInvites.includes(invite.id));

  // Filter invites that haven't been viewed
  const invitesHaveNotBeenViewed = teamsInvites.filter((invite) => !viewedInvites.includes(invite.id));

  // Get IDs of non-dismissed invites
  const nonDismissedIds = invitesHaveNotBeenDismissed.map((invite) => invite.id);

  // ========================================================================
  // Handlers
  // ========================================================================

  const handleCloseNotification = useCallback(() => {
    dispatch(setViewedInvites(inviteIds));
    dispatch(setShowInviteNotificationPopover(false));
  }, [dispatch, inviteIds]);

  const handleDismissInvites = useCallback(() => {
    dispatch(setDismissedInvites(nonDismissedIds));
  }, [dispatch, nonDismissedIds]);

  const handleAcceptInvitePopup = useCallback(() => {
    dispatch(setSuccessPopover(true));
  }, [dispatch]);

  const handleCloseCongratsPopup = useCallback(() => {
    dispatch(setSuccessPopover(false));
  }, [dispatch]);

  const dismissNotifications = useCallback((ids: string[]) => {
    ids.forEach((id) => dismissToast(id));
  }, []);

  return {
    hasViewedThisNotification,
    invitesHaveNotBeenDismissed,
    invitesHaveNotBeenViewed,
    invitesHaveLoaded: !loading,
    showSuccessPopover,
    showInviteNotificationPopover,
    handleCloseNotification,
    handleDismissInvites,
    handleAcceptInvitePopup,
    handleCloseCongratsPopup,
    dismissNotifications,
  };
}

export default useTeamInviteNotifications;
