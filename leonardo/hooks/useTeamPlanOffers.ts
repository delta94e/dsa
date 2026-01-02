/**
 * Team Plan Offers Hooks
 *
 * Hooks for fetching and filtering team plan offers/deals.
 * Matches production bundle module 543421.
 */
'use client';

import { useQuery } from '@apollo/client/react';
import { useSession } from 'next-auth/react';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { hasTeamPermission } from '@/lib/utils/permissions';
import { TEAM_DEAL_TARGET } from '@/constants/plans';
// TODO: Import from GraphQL when available
// import { GetTeamPlanOffersDocument, Order_By } from '@/graphql/generated';

// ============================================================================
// Types
// ============================================================================

interface TeamDeal {
  akUUID: string;
  checkoutPaidAt?: string | null;
  dealAcceptedAt?: string | null;
  teamDealTarget: string;
  createdAt: string;
  team?: {
    akUUID: string;
  } | null;
}

interface Team {
  akUUID: string;
  userRole: string;
}

interface UseAvailableTeamPlanOfferOptions {
  skipTeamFilter?: boolean;
  teamUUID?: string;
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Check if user has permission to accept deal for a team
 */
const canAcceptDeal = (deal: TeamDeal, teams: Team[]): boolean => {
  if (deal.teamDealTarget === TEAM_DEAL_TARGET.NEW_TEAM) {
    return true;
  }

  const teamUUID = deal.team?.akUUID;
  if (!teamUUID) {
    return false;
  }

  const team = teams.find((t) => t.akUUID === teamUUID);
  return !!team && hasTeamPermission(team.userRole, 'accept_team_deal');
};

/**
 * Check if deal is available (not yet paid/accepted)
 */
const isDealAvailable = (
  deal: TeamDeal,
  options: UseAvailableTeamPlanOfferOptions = {}
): boolean => {
  const { skipTeamFilter = false, teamUUID } = options;

  const isNotCompleted =
    !deal.checkoutPaidAt &&
    (deal.teamDealTarget !== TEAM_DEAL_TARGET.EXISTING_STRIPE_TEAM ||
      !deal.dealAcceptedAt);

  if (skipTeamFilter) {
    return isNotCompleted;
  }

  if (teamUUID) {
    return (
      isNotCompleted &&
      [
        TEAM_DEAL_TARGET.EXISTING_CUSTOM_TEAM,
        TEAM_DEAL_TARGET.EXISTING_STRIPE_TEAM,
      ].includes(deal.teamDealTarget) &&
      deal.team?.akUUID === teamUUID
    );
  }

  return isNotCompleted && deal.teamDealTarget === TEAM_DEAL_TARGET.NEW_TEAM;
};

// ============================================================================
// Hooks
// ============================================================================

/**
 * Hook to get a single available team plan offer for a specific team
 */
export const useAvailableTeamPlanOffer = (teamUUID?: string) => {
  const { status } = useSession();
  const { user } = useCurrentUser();

  // TODO: Use actual GraphQL query when available
  const { data, refetch } = useQuery(
    {} as any, // GetTeamPlanOffersDocument
    {
      pollInterval: 300000, // 5 minutes
      variables: { order_by: [{ createdAt: 'desc' }] },
      skip: status !== 'authenticated',
    }
  );

  const teamDeals = (data?.team_deals || []) as TeamDeal[];
  const teams = (user?.teams || []) as Team[];

  const offer = teamDeals.filter(
    (deal) =>
      isDealAvailable(deal, { teamUUID }) && canAcceptDeal(deal, teams)
  )?.[0];

  return {
    offer,
    refetch,
  };
};

/**
 * Hook to get all available team plan offers
 */
export const useAvailableTeamPlanOffers = () => {
  const { status } = useSession();
  const { user } = useCurrentUser();

  // TODO: Use actual GraphQL query when available
  const { data, loading, refetch } = useQuery(
    {} as any, // GetTeamPlanOffersDocument
    {
      fetchPolicy: 'cache-and-network',
      variables: { order_by: [{ createdAt: 'desc' }] },
      skip: status !== 'authenticated',
    }
  );

  const teamDeals = (data?.team_deals || []) as TeamDeal[];
  const teams = (user?.teams || []) as Team[];

  const offers = teamDeals.filter(
    (deal) =>
      isDealAvailable(deal, { skipTeamFilter: true }) &&
      canAcceptDeal(deal, teams)
  );

  return {
    offers,
    offersHaveLoaded: !loading,
    refetch,
  };
};
