/**
 * Payment Mutations
 *
 * GraphQL mutations for PayPal and subscription operations.
 */

import { gql } from '@apollo/client';

// ============================================================================
// Mutations
// ============================================================================

/**
 * Cancel PayPal pending downgrade subscription
 */
export const CancelPayPalPendingDowngradeSubscriptionDocument = gql`
    mutation CancelPayPalPendingDowngradeSubscription {
        cancelPayPalPendingDowngradeSubscription {
            success
        }
    }
`;

/**
 * Cancel PayPal pending subscription cancellation
 */
export const CancelPayPalPendingSubscriptionCancellationDocument = gql`
    mutation CancelPayPalPendingSubscriptionCancellation {
        cancelPayPalPendingSubscriptionCancellation {
            success
        }
    }
`;

/**
 * Cancel PayPal subscription
 */
export const CancelPayPalSubscriptionDocument = gql`
    mutation CancelPayPalSubscription {
        cancelPayPalSubscription {
            success
        }
    }
`;

/**
 * Create CRM contact (HubSpot)
 */
export const CreateCrmContactDocument = gql`
    mutation CreateCrmContact($input: CreateContactInput!) {
        createCrmContact(input: $input) {
            contactId
        }
    }
`;

/**
 * Create PayPal subscription
 */
export const CreatePayPalSubscriptionDocument = gql`
    mutation CreatePayPalSubscription($createPayPalSubscriptionInput: CreatePayPalSubscriptionDto!) {
        createPayPalSubscription(createPayPalSubscriptionInput: $createPayPalSubscriptionInput) {
            success
        }
    }
`;

/**
 * Downgrade PayPal subscription
 */
export const DowngradePayPalSubscriptionDocument = gql`
    mutation DowngradePayPalSubscription($downgradePayPalSubscriptionInput: DowngradePayPalSubscriptionInputDto!) {
        downgradePayPalSubscription(downgradePayPalSubscriptionInput: $downgradePayPalSubscriptionInput) {
            success
        }
    }
`;

/**
 * Upgrade PayPal subscription
 */
export const UpgradePayPalSubscriptionDocument = gql`
    mutation UpgradePayPalSubscription($upgradePayPalSubscriptionInput: UpgradePayPalSubscriptionInputDto!) {
        upgradePayPalSubscription(upgradePayPalSubscriptionInput: $upgradePayPalSubscriptionInput) {
            success
        }
    }
`;
