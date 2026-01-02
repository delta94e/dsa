'use client';

import { useQuery } from '@apollo/client/react';
import { useSession } from 'next-auth/react';
import { GetTeamsInvitesDocument, type GetTeamsInvitesData } from '@/lib/graphql';
import { useCurrentUser } from './useCurrentUser';

// ============================================================================
// Types
// ============================================================================

export interface TeamInvite {
  id: string;
  teamId: string;
  teamName: string | null;
  inviteEmail: string;
  dateInvited: string;
  dateAccepted: string | null;
  dateDeclined: string | null;
}

export interface UseTeamsInvitesResult {
  teamsInvites: TeamInvite[];
  loading: boolean;
  error?: Error;
}

// ============================================================================
// Hook
// ============================================================================

/**
 * useTeamsInvites
 * 
 * Hook for fetching pending team invites for the current user.
 * 
 * @example
 * const { teamsInvites, loading } = useTeamsInvites();
 */
export function useTeamsInvites(): UseTeamsInvitesResult {
  const { status } = useSession();
  const { user } = useCurrentUser();

  const { data, loading, error } = useQuery<GetTeamsInvitesData>(
    GetTeamsInvitesDocument,
    {
      variables: { inviteEmail: user?.email },
      skip: status !== 'authenticated' || !user?.email,
      fetchPolicy: 'cache-and-network',
    }
  );

  // Filter to only pending invites (not accepted or declined)
  // Using explicit type to handle GraphQL response shape
  const rawInvites = (data?.team_invites ?? []) as Array<{
    id: string;
    teamId: string;
    teamName?: string | null;
    inviteEmail?: string;
    dateInvited: string;
    dateAccepted?: string | null;
    dateDeclined?: string | null;
  }>;
  
  const pendingInvites = rawInvites
    .filter((invite) => !invite.dateAccepted && !invite.dateDeclined)
    .map((invite) => ({
      id: invite.id,
      teamId: invite.teamId,
      teamName: invite.teamName ?? null,
      inviteEmail: invite.inviteEmail ?? '',
      dateInvited: invite.dateInvited,
      dateAccepted: invite.dateAccepted ?? null,
      dateDeclined: invite.dateDeclined ?? null,
    }));

  return {
    teamsInvites: pendingInvites,
    loading,
    error: error as Error | undefined,
  };
}

export default useTeamsInvites;
