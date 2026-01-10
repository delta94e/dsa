"use client";

import { useMemo } from "react";
import { useAppSelector } from "@/store/hooks";
import { useSelectedTeam } from "./useSelectedTeam";
import { TEAM_PLAN, UserPlanNames } from "@/constants/plans";

// ============================================================================
// Types
// ============================================================================

export interface PlanInfo {
  /** User's current plan */
  userPlan: string;
  /** Whether user is on free plan */
  isUserFreePlan: boolean;
  /** Whether user is on free+ plan */
  isUserFreePlus: boolean;
  /** Whether user is on basic plan */
  isUserBasicPlan: boolean;
  /** Whether user is on standard plan */
  isUserStandardPlan: boolean;
  /** Whether user is on pro plan */
  isUserProPlan: boolean;
  /** Whether user has access to relaxed queue (standard or pro) */
  hasRelaxedQueueAccess: boolean;
  /** Token renewal date for paid plans */
  tokenRenewalDate?: string;
  /** API token renewal date */
  apiTokenRenewalDate?: string;
  /** Whether to show token renewal date */
  shouldUseTokenRenewalDate: boolean;
  /** Whether user is privileged (@leonardo.ai email) */
  isPrivileged: boolean;
  /** Team's plan token renewal date */
  planTokenRenewalDate?: string;
}

// ============================================================================
// Hook: usePlan (matches module 215665)
// ============================================================================

/**
 * usePlan Hook
 *
 * Provides comprehensive plan information for the current user/team.
 * Handles both individual and team plans.
 *
 * @returns Plan information including plan type and renewal dates
 *
 * @example
 * const { isUserFreePlan, hasRelaxedQueueAccess, tokenRenewalDate } = usePlan();
 */
export function usePlan(): PlanInfo {
  // Get selected team
  const { userSelectedTeam } = useSelectedTeam();
  const selectedTeam = userSelectedTeam();

  // Get user data from Redux
  const tokenRenewalDate = useAppSelector(
    (state) => state.user.tokenRenewalDate
  );
  const userPlan = useAppSelector((state) => state.user.plan);
  const auth0Email = useAppSelector((state) => state.user.email);
  const apiPlanTokenRenewalDate = useAppSelector(
    (state) => state.user.apiPlanTokenRenewalDate
  );

  // Check if user is privileged (Leonardo employee)
  const isPrivileged = auth0Email?.includes("@leonardo.ai") ?? false;

  // Determine plan based on team or individual
  const isTeamAccount = !!selectedTeam.akUUID;

  // Free plan check
  const isUserFreePlan = isTeamAccount
    ? selectedTeam.plan === TEAM_PLAN.FREE
    : userPlan === UserPlanNames.FREE;

  // Free+ plan check
  const isUserFreePlus = isTeamAccount
    ? selectedTeam.plan === TEAM_PLAN.FREEPLUS
    : userPlan === UserPlanNames.FREEPLUS;

  // Basic plan check
  const isUserBasicPlan = isTeamAccount
    ? selectedTeam.plan === TEAM_PLAN.BASIC
    : userPlan === UserPlanNames.BASIC;

  // Standard plan check
  const isUserStandardPlan = isTeamAccount
    ? selectedTeam.plan === TEAM_PLAN.STANDARD
    : userPlan === UserPlanNames.STANDARD;

  // Pro plan check
  const isUserProPlan = isTeamAccount
    ? selectedTeam.plan === TEAM_PLAN.PRO
    : userPlan === UserPlanNames.PRO;

  // Relaxed queue access (standard or pro)
  const hasRelaxedQueueAccess = isUserStandardPlan || isUserProPlan;

  // Should use token renewal date (paid plans only)
  const shouldUseTokenRenewalDate = !isUserFreePlan && !isUserFreePlus;

  // Token renewal date for current context
  const effectiveTokenRenewalDate = shouldUseTokenRenewalDate
    ? tokenRenewalDate
    : undefined;

  // Team's plan token renewal date
  const planTokenRenewalDate = selectedTeam.planTokenRenewalDate;

  return useMemo(
    () => ({
      userPlan,
      isUserFreePlan,
      isUserFreePlus,
      isUserBasicPlan,
      isUserStandardPlan,
      isUserProPlan,
      hasRelaxedQueueAccess,
      tokenRenewalDate: effectiveTokenRenewalDate,
      apiTokenRenewalDate: apiPlanTokenRenewalDate,
      shouldUseTokenRenewalDate,
      isPrivileged,
      planTokenRenewalDate,
    }),
    [
      userPlan,
      isUserFreePlan,
      isUserFreePlus,
      isUserBasicPlan,
      isUserStandardPlan,
      isUserProPlan,
      hasRelaxedQueueAccess,
      effectiveTokenRenewalDate,
      apiPlanTokenRenewalDate,
      shouldUseTokenRenewalDate,
      isPrivileged,
      planTokenRenewalDate,
    ]
  );
}

export default usePlan;
