/**
 * AWS Marketplace Utilities
 * 
 * Utility functions for handling AWS Marketplace subscription logic.
 * Matches production bundle module 186393.
 */

import { ROUTE } from '@/constants/routes';
import { TEAM_PLAN, API_PLAN, TEAM_PLAN_DOWNGRADE_TYPE } from '@/constants/plans';

// ============================================================================
// Types
// ============================================================================

export interface ScheduledSubscription {
  price: number;
  quantity: number;
}

export interface TeamWithPlan {
  akUUID?: string;
  teamName?: string;
  id?: string;
  teamLogoUrl?: string;
  plan?: string | null;
}

export interface SubscriptionWithScheduled {
  scheduledSub: ScheduledSubscription;
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Get downgrade type for team plan
 * Compares scheduled subscription with current plan/seats
 */
export function getDowngradeType(
  subscription: SubscriptionWithScheduled,
  currentPrice: number,
  currentQuantity: number
): string | undefined {
  const { price, quantity } = subscription.scheduledSub;
  
  if (price !== currentPrice && quantity !== currentQuantity) {
    return TEAM_PLAN_DOWNGRADE_TYPE.BOTH;
  }
  if (price !== currentPrice) {
    return TEAM_PLAN_DOWNGRADE_TYPE.PLAN;
  }
  if (quantity !== currentQuantity) {
    return TEAM_PLAN_DOWNGRADE_TYPE.SEATS;
  }
  return undefined;
}

/**
 * Filter teams for AWS restrictions
 * Only returns teams with CUSTOM plan
 */
export function filterTeamsForAwsRestrictions<T extends TeamWithPlan>(
  teams: T[] | undefined
): T[] {
  return teams?.filter((team) => team.plan === TEAM_PLAN.CUSTOM) ?? [];
}

/**
 * Check if personal account should be hidden
 * Hide when: AWS Team is ACTIVE, AWS API is NOT ACTIVE, and API plan is not CUSTOM
 */
export function shouldHidePersonalAccount(
  awsTeamSubscriptionStatus: string | null,
  awsAPISubscriptionStatus: string | null,
  apiPlanType: string | null
): boolean {
  return (
    awsAPISubscriptionStatus !== 'ACTIVE' &&
    apiPlanType !== API_PLAN.CUSTOM &&
    awsTeamSubscriptionStatus === 'ACTIVE'
  );
}

/**
 * Check if teams should be filtered to custom only
 * Filter when: AWS Team OR AWS API is ACTIVE
 */
export function shouldFilterTeamsToCustomOnly(
  awsTeamSubscriptionStatus: string | null,
  awsAPISubscriptionStatus: string | null
): boolean {
  return awsTeamSubscriptionStatus === 'ACTIVE' || awsAPISubscriptionStatus === 'ACTIVE';
}

/**
 * Check if user can create a new team
 * Can create when: AWS Team is NOT ACTIVE AND AWS API is NOT ACTIVE
 */
export function canUserCreateTeam(
  awsTeamSubscriptionStatus: string | null,
  awsAPISubscriptionStatus: string | null
): boolean {
  return awsTeamSubscriptionStatus !== 'ACTIVE' && awsAPISubscriptionStatus !== 'ACTIVE';
}

/**
 * Get route for personal account selection
 * Returns API_ACCESS route if has AWS API subscription
 */
export function getPersonalAccountRoute(hasAwsApiSubscription: boolean): string | null {
  return hasAwsApiSubscription ? ROUTE.API_ACCESS : null;
}

/**
 * Get route for team selection
 * Returns HOME if both isFromPersonal and hasAwsTeamSubscription are true
 */
export function getTeamSelectRoute(
  isFromPersonalAccount: boolean,
  hasAwsTeamSubscription: boolean
): string | null {
  return isFromPersonalAccount && hasAwsTeamSubscription ? ROUTE.HOME : null;
}

/**
 * Check if plan is a valid team plan
 */
export function isTeamPlan(plan: string | null | undefined): boolean {
  return !!(plan && Object.values(TEAM_PLAN).includes(plan as typeof TEAM_PLAN[keyof typeof TEAM_PLAN]));
}

/**
 * Get AWS user info from subscription statuses
 */
export function getAWSUserInfo(
  awsTeamSubscriptionStatus: string | null,
  awsAPISubscriptionStatus: string | null
) {
  return {
    hasAwsApiSubscription: awsAPISubscriptionStatus === 'ACTIVE',
    hasAwsTeamSubscription: awsTeamSubscriptionStatus === 'ACTIVE',
  };
}
