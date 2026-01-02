/**
 * Team Accept Deal API
 *
 * API function for accepting team plan deals.
 * Matches production bundle module 659282.
 */

import { STRIPE_TEAM_ACCEPT_DEAL } from '@/constants/app';

// ============================================================================
// Types
// ============================================================================

interface TeamAcceptDealParams {
  teamUUID?: string;
  teamDealUUID: string;
}

interface TeamAcceptDealResponse {
  errorMessage?: string;
  [key: string]: unknown;
}

// ============================================================================
// API Function
// ============================================================================

/**
 * Accept a team plan deal
 *
 * @param params - Team UUID and deal UUID
 * @returns Response with potential error message
 */
export const teamAcceptDeal = async ({
  teamUUID,
  teamDealUUID,
}: TeamAcceptDealParams): Promise<TeamAcceptDealResponse> => {
  const response = await fetch(STRIPE_TEAM_ACCEPT_DEAL, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ teamUUID, teamDealUUID }),
  });

  const data = await response.json();

  if ([400, 403, 500].includes(response.status)) {
    return { errorMessage: `[team accept deal]: ${data.message}` };
  }

  return data;
};
