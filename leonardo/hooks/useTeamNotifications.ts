'use client';

import { useMemo } from 'react';
import { skipToken, useQuery, useSuspenseQuery } from '@apollo/client/react';
import { useSession } from 'next-auth/react';
import { useCurrentUser } from './useCurrentUser';
import {
    Order_By,
    GetTeamsInvitesDocument,
    GetTeamPlanOffersDocument,
    type GetTeamsInvitesData,
    type GetTeamsInvitesVariables,
    type GetTeamPlanOffersData,
    type GetTeamPlanOffersVariables,
    type TeamInvite,
    type TeamDeal,
} from '@/lib/graphql';
import { hasTeamPermission, type TeamRole } from '@/lib/teamUtils';

// ============================================================================
// Constants
// ============================================================================

export const TEAM_DEAL_TARGET = {
    NEW_TEAM: 'NEW_TEAM',
    EXISTING_STRIPE_TEAM: 'EXISTING_STRIPE_TEAM',
} as const;

export type TeamDealTarget = (typeof TEAM_DEAL_TARGET)[keyof typeof TEAM_DEAL_TARGET];

// ============================================================================
// Types
// ============================================================================

export interface TeamInviteNotification {
    type: 'invite';
    id: string;
    teamId: string;
    teamName: string | null;
    inviterUsername: string | null;
    dateInvited: string;
}

export interface TeamDealNotification {
    type: 'deal';
    id: string;
    akUUID: string;
    teamName: string | null;
    newTeamName: string | null;
    newTeamSeats: number | null;
    tokensPerSeat: number | null;
    teamDealTarget: string;
    teamId: string | null;
    teamAkUUID: string | null;
    createdAt: string;
}

export type TeamNotification = TeamInviteNotification | TeamDealNotification;

export interface TeamNotificationsResult {
    notifications: TeamNotification[];
    invites: TeamInviteNotification[];
    deals: TeamDealNotification[];
    totalCount: number;
    invitesCount: number;
    dealsCount: number;
}

export interface UseTeamNotificationsResult extends TeamNotificationsResult {
    loading: boolean;
}

interface TeamRoleInfo {
    akUUID: string;
    userRole?: TeamRole;
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Get the sort date for a notification
 */
const getNotificationDate = (notification: TeamNotification): string =>
    notification.type === 'invite' ? notification.dateInvited : notification.createdAt;

/**
 * Transform raw invite data to normalized format
 */
const transformInvites = (data: GetTeamsInvitesData | undefined): TeamInviteNotification[] =>
    (data?.team_invites ?? []).map((invite) => ({
        type: 'invite' as const,
        id: invite.id,
        teamId: invite.teamId,
        teamName: invite.teamName ?? null,
        inviterUsername: invite.invitedBy?.username ?? null,
        dateInvited: invite.dateInvited,
    }));

/**
 * Transform and filter raw deal data
 */
const transformDeals = (
    data: GetTeamPlanOffersData | undefined,
    userTeams: TeamRoleInfo[]
): TeamDealNotification[] =>
    (data?.team_deals ?? [])
        .filter(
            (deal) =>
                // Exclude already paid deals
                !deal.checkoutPaidAt &&
                // Exclude accepted deals for existing Stripe teams
                (deal.teamDealTarget !== TEAM_DEAL_TARGET.EXISTING_STRIPE_TEAM ||
                    !deal.dealAcceptedAt) &&
                // Check permissions
                ((deal: TeamDeal, teams: TeamRoleInfo[]): boolean => {
                    // New team deals are always shown
                    if (deal.teamDealTarget === TEAM_DEAL_TARGET.NEW_TEAM) return true;

                    const teamAkUUID = deal.team?.akUUID;
                    if (!teamAkUUID) return false;

                    const userTeam = teams.find((t) => t.akUUID === teamAkUUID);
                    return !!userTeam && hasTeamPermission(userTeam.userRole, 'accept_team_deal');
                })(deal, userTeams)
        )
        .map((deal) => ({
            type: 'deal' as const,
            id: deal.akUUID,
            akUUID: deal.akUUID,
            teamName: deal.team?.teamName ?? null,
            newTeamName: deal.newTeamName ?? null,
            newTeamSeats: deal.newTeamSeats ?? null,
            tokensPerSeat: deal.tokensPerSeat ?? null,
            teamDealTarget: deal.teamDealTarget,
            teamId: deal.team?.id ?? null,
            teamAkUUID: deal.team?.akUUID ?? null,
            createdAt: deal.createdAt,
        }));

/**
 * Merge and sort notifications by date (newest first)
 */
const mergeNotifications = (
    invites: TeamInviteNotification[],
    deals: TeamDealNotification[]
): TeamNotificationsResult => {
    const notifications = [...invites, ...deals].sort(
        (a, b) => new Date(getNotificationDate(b)).getTime() - new Date(getNotificationDate(a)).getTime()
    );

    return {
        notifications,
        invites,
        deals,
        totalCount: notifications.length,
        invitesCount: invites.length,
        dealsCount: deals.length,
    };
};

// ============================================================================
// Hooks
// ============================================================================

/**
 * useTeamNotifications
 *
 * Hook for fetching and managing team notifications (invites and deals).
 * Returns combined, sorted notifications with counts.
 *
 * @example
 * const { notifications, totalCount, loading } = useTeamNotifications();
 */
export function useTeamNotifications(): UseTeamNotificationsResult {
    const { status } = useSession();
    const { user } = useCurrentUser();

    const { data: invitesData, loading: invitesLoading } = useQuery<
        GetTeamsInvitesData,
        GetTeamsInvitesVariables
    >(GetTeamsInvitesDocument, {
        variables: { inviteEmail: user?.email },
        fetchPolicy: 'cache-and-network',
        skip: !user?.email,
    });

    const { data: dealsData, loading: dealsLoading } = useQuery<
        GetTeamPlanOffersData,
        GetTeamPlanOffersVariables
    >(GetTeamPlanOffersDocument, {
        variables: { order_by: [{ createdAt: Order_By.Desc }] },
        skip: status !== 'authenticated',
    });

    const userTeams = useMemo(
        () =>
            (user?.teams ?? []).map((team) => ({
                akUUID: team.akUUID,
                userRole: team.userRole,
            })),
        [user?.teams]
    );

    const result = useMemo(
        () => mergeNotifications(
            transformInvites(invitesData),
            transformDeals(dealsData, userTeams)
        ),
        [invitesData, dealsData, userTeams]
    );

    return {
        ...result,
        loading: invitesLoading || dealsLoading,
    };
}

/**
 * useTeamNotificationsSuspense
 *
 * Suspense-compatible version of useTeamNotifications.
 * Use this in components wrapped with Suspense boundaries.
 *
 * @example
 * const { notifications, totalCount } = useTeamNotificationsSuspense();
 */
export function useTeamNotificationsSuspense(): TeamNotificationsResult {
    const { status } = useSession();
    const { user } = useCurrentUser();

    const { data: invitesData } = useSuspenseQuery<
        GetTeamsInvitesData,
        GetTeamsInvitesVariables
    >(
        GetTeamsInvitesDocument,
        user?.email
            ? { variables: { inviteEmail: user.email }, fetchPolicy: 'cache-and-network' }
            : skipToken
    );

    const { data: dealsData } = useSuspenseQuery<
        GetTeamPlanOffersData,
        GetTeamPlanOffersVariables
    >(
        GetTeamPlanOffersDocument,
        status === 'authenticated'
            ? { variables: { order_by: [{ createdAt: Order_By.Desc }] }, fetchPolicy: 'cache-and-network' }
            : skipToken
    );

    const userTeams = useMemo(
        () =>
            (user?.teams ?? []).map((team) => ({
                akUUID: team.akUUID,
                userRole: team.userRole,
            })),
        [user?.teams]
    );

    return useMemo(
        () => mergeNotifications(
            transformInvites(invitesData),
            transformDeals(dealsData, userTeams)
        ),
        [invitesData, dealsData, userTeams]
    );
}

export default useTeamNotifications;
