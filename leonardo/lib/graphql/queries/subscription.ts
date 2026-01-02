import { gql } from '@apollo/client';

export const GetAllSubscriptionDetailsDocument = gql`
  query getAllSubscriptionDetails {
    getSubscriptionDetails {
      anchorTimestamp
      billingCycleEnd
      currentUserPlan {
        plan
        planSubscribeFrequency
      }
      pauseSubscription {
        endAt
      }
      provider
      scheduledPlanChangeDetails {
        plan
        startAt
      }
      subStatus
      scheduledCancellationDetails {
        processedAt
        requestedAt
      }
    }
  }
`;

export const GetBillingCycleAndPlanDocument = gql`
    query getBillingCycleAndPlan {
        getSubscriptionDetails {
            billingCycleEnd
            currentUserPlan {
                plan
            }
        }
    }
`;

// ============================================================================
// PayPal Queries
// ============================================================================

export const GetPaypalClientDocument = gql`
    query GetPaypalClient {
        generatePaypalClientToken
    }
`;

export const GetPayPalUpgradeDocument = gql`
    query getPayPalUpgrade(
        $getPayPalUpgradeQuoteInputDto: GetPayPalUpgradeQuoteInputDto!
    ) {
        getSubscriptionDetails {
            billingCycleEnd
            currentUserPlan {
                plan
                planSubscribeFrequency
            }
        }
        getPayPalUpgradeQuote(
            getPayPalUpgradeQuoteInputDto: $getPayPalUpgradeQuoteInputDto
        ) {
            currentPlanUnusedBaseAmount
            newPlanProratedBaseAmount
            subTotal
            tax
            total
            expiresAt
        }
    }
`;

// ============================================================================
// Usage Analytics
// ============================================================================

export const GetModelBreakdownDocument = gql`
    query GetModelBreakdown($input: ModelBreakdownInput!) {
        getModelBreakdown(input: $input) {
            modelUsage {
                credits
                creditsPercentage
                generations
                generationsPercentage
                model {
                    name
                    thumbnailUrl
                    type
                }
            }
            totalCredits
            totalGenerations
        }
    }
`;

// ============================================================================
// Subscription Status Queries
// ============================================================================

export const GetSubscriptionAnchorDocument = gql`
    query getSubscriptionAnchor {
        getSubscriptionDetails {
            anchorTimestamp
        }
    }
`;

export const GetSubscriptionDetailsDocument = gql`
    query getSubscriptionDetails {
        getSubscriptionDetails {
            anchorTimestamp
            billingCycleEnd
            subStatus
            provider
            currentUserPlan {
                plan
                planSubscribeFrequency
            }
            pauseSubscription {
                endAt
            }
            scheduledCancellationDetails {
                requestedAt
                processedAt
            }
            scheduledPlanChangeDetails {
                startAt
                plan
            }
        }
    }
`;

export const GetSubscriptionStatusAndFrequencyDocument = gql`
    query getSubscriptionStatusAndFrequency {
        getSubscriptionDetails {
            subStatus
            currentUserPlan {
                planSubscribeFrequency
            }
        }
    }
`;

// ============================================================================
// Stripe API Queries
// ============================================================================

export const InitiateStripeProdApiPaymentMethodUpdateDocument = gql`
    query InitiateStripeProdApiPaymentMethodUpdate(
        $input: InitiateStripeProdApiPaymentMethodUpdateInputDto
    ) {
        initiateStripeProdApiPaymentMethodUpdate(
            initiateStripeProdApiPaymentMethodUpdateInputDto: $input
        ) {
            url
        }
    }
`;

export const InitiateStripeProdApiManualTopUpDocument = gql`
    query InitiateStripeProdApiManualTopUp(
        $topUpCreditsAmount: Int!
        $autoTopUpTrigger: Int
        $autoTopUpCreditsAmount: Int
    ) {
        initiateStripeProdApiManualTopUp(
            initiateStripeProdApiManualTopUpInputDto: {
                topUpCreditsAmount: $topUpCreditsAmount
                autoTopUpTrigger: $autoTopUpTrigger
                autoTopUpCreditsAmount: $autoTopUpCreditsAmount
            }
        ) {
            url
        }
    }
`;

