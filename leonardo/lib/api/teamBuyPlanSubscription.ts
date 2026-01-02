/**
 * Team Buy Plan Subscription API
 *
 * Matches production bundle module.
 */

export interface TeamBuyPlanSubscriptionParams {
    plan: string;
    duration: string;
    seatQuantity?: number;
    initialTeamName: string;
    teamDealUUID?: string;
    teamUUID?: string;
    priceId: string;
    teamLogoUrl?: string;
}

export interface TeamBuyPlanSubscriptionResponse {
    errorMessage?: string;
    checkoutUrl?: string;
}

/**
 * Initiates team plan subscription purchase.
 * This will redirect the user to Stripe checkout.
 */
export async function teamBuyPlanSubscription(
    params: TeamBuyPlanSubscriptionParams
): Promise<TeamBuyPlanSubscriptionResponse> {
    try {
        const response = await fetch('/api/teams/buy-plan-subscription', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(params),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            return {
                errorMessage: errorData.message || 'Failed to initiate checkout',
            };
        }

        const data = await response.json();

        // If we have a checkout URL, redirect to it
        if (data.checkoutUrl) {
            window.location.href = data.checkoutUrl;
        }

        return data;
    } catch (error) {
        console.error('teamBuyPlanSubscription error:', error);
        return {
            errorMessage: 'An unexpected error occurred. Please try again.',
        };
    }
}
