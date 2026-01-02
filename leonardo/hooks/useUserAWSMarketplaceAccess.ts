'use client';

import { useQuery } from '@apollo/client/react';
import { useUser } from './useUser';
import {
  GetUserAWSMarketplaceSubscriptionsDocument,
  type GetUserAWSMarketplaceSubscriptionsData,
  type GetUserAWSMarketplaceSubscriptionsVariables,
} from '@/lib/graphql';

// ============================================================================
// Types
// ============================================================================

export interface UseUserAWSMarketplaceAccessResult {
  /** AWS Team subscription status ('ACTIVE', 'SUSPENDED', etc.) */
  awsTeamSubscriptionStatus: string | null;
  /** AWS API subscription status ('ACTIVE', 'SUSPENDED', etc.) */
  awsAPISubscriptionStatus: string | null;
  /** Whether the query is loading */
  isLoading: boolean;
  /** Whether the user is ready (logged in with sub) */
  isReady: boolean;
  /** Any error from the query */
  error?: Error;
}

// ============================================================================
// Hook
// ============================================================================

/**
 * useUserAWSMarketplaceAccess
 * 
 * Hook for fetching user's AWS Marketplace subscription status.
 * Returns both team and API subscription statuses.
 * 
 * @example
 * const { awsAPISubscriptionStatus, awsTeamSubscriptionStatus, isLoading } = useUserAWSMarketplaceAccess();
 */
export function useUserAWSMarketplaceAccess(): UseUserAWSMarketplaceAccessResult {
  const user = useUser();
  
  // Query with proper TypeScript generics - no type casting needed
  const { data, loading, error } = useQuery<
    GetUserAWSMarketplaceSubscriptionsData,
    GetUserAWSMarketplaceSubscriptionsVariables
  >(GetUserAWSMarketplaceSubscriptionsDocument, {
    variables: { userSub: user.sub },
    skip: !user.isLoggedIn || !user.sub,
    fetchPolicy: 'cache-first',
  });

  // Get first user from result - data is now properly typed!
  const userData = data?.users?.[0];
  
  // Get AWS marketplace subscriptions
  const subscriptions = userData?.aws_marketplace_subscriptions ?? [];
  
  // Find TEAM and API subscriptions
  const teamSubscription = subscriptions.find(
    (sub) => sub.awsMpSubscriptionType === 'TEAM'
  );
  const apiSubscription = subscriptions.find(
    (sub) => sub.awsMpSubscriptionType === 'API'
  );

  return {
    awsTeamSubscriptionStatus: teamSubscription?.awsMpSubscriptionStatus ?? null,
    awsAPISubscriptionStatus: apiSubscription?.awsMpSubscriptionStatus ?? null,
    isLoading: loading,
    isReady: user.isLoggedIn && !!user.sub,
    error: error as Error | undefined,
  };
}

export default useUserAWSMarketplaceAccess;
