/**
 * useTeamPlanDetails Hook
 *
 * Fetches team plan details including pricing information.
 * Matches production bundle module.
 */

import { useCallback } from 'react';

export interface TeamPlanDetails {
    priceId: string;
    unitAmount: number;
    currency: string;
    interval: string;
}

interface UseTeamPlanDetailsResult {
    error?: string;
    teamPlanDetails: TeamPlanDetails;
}

/**
 * Hook that returns a function to fetch team plan details.
 * Used in the checkout flow to get Stripe price IDs.
 */
export function useTeamPlanDetails() {
    const getTeamPlanDetails = useCallback(
        async (plan: string): Promise<UseTeamPlanDetailsResult> => {
            try {
                const response = await fetch(
                    `/api/teams/plan-details?plan=${encodeURIComponent(plan)}`
                );

                if (!response.ok) {
                    return {
                        error: 'Failed to fetch plan details',
                        teamPlanDetails: {
                            priceId: '',
                            unitAmount: 0,
                            currency: 'USD',
                            interval: 'month',
                        },
                    };
                }

                const data = await response.json();
                return {
                    teamPlanDetails: data,
                };
            } catch (error) {
                console.error('useTeamPlanDetails error:', error);
                return {
                    error: 'An unexpected error occurred',
                    teamPlanDetails: {
                        priceId: '',
                        unitAmount: 0,
                        currency: 'USD',
                        interval: 'month',
                    },
                };
            }
        },
        []
    );

    return getTeamPlanDetails;
}
