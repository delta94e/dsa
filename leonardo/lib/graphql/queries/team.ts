/**
 * Team GraphQL Queries
 *
 * Queries for team invites, deals, and team-related data.
 */

import { gql, TypedDocumentNode } from '@apollo/client';
import type { OrderBy } from '../enums';

// ============================================================================
// Types
// ============================================================================

export interface TeamInvite {
    id: string;
    teamId: string;
    teamName?: string | null;
    dateInvited: string;
    invitedBy?: {
        username?: string | null;
    } | null;
}

export interface TeamDeal {
    akUUID: string;
    checkoutPaidAt?: string | null;
    dealAcceptedAt?: string | null;
    teamDealTarget: string;
    createdAt: string;
    newTeamName?: string | null;
    newTeamSeats?: number | null;
    tokensPerSeat?: number | null;
    team?: {
        id?: string | null;
        akUUID?: string | null;
        teamName?: string | null;
    } | null;
}

export interface GetTeamsInvitesData {
    team_invites: TeamInvite[];
}

export interface GetTeamsInvitesVariables {
    inviteEmail?: string;
}

export interface GetTeamPlanOffersData {
    team_deals: TeamDeal[];
}

export interface GetTeamPlanOffersVariables {
    order_by?: Array<{ createdAt?: OrderBy }>;
}

// ============================================================================
// Queries
// ============================================================================

/**
 * Query to get team invites for a user by email
 */
export const GetTeamsInvitesDocument: TypedDocumentNode<
    GetTeamsInvitesData,
    GetTeamsInvitesVariables
> = gql`
    query GetTeamsInvites($inviteEmail: String) {
        team_invites(where: { email: { _eq: $inviteEmail } }) {
            id
            teamId
            teamName
            dateInvited
            invitedBy {
                username
            }
        }
    }
`;

/**
 * Query to get team plan offers/deals
 */
export const GetTeamPlanOffersDocument: TypedDocumentNode<
    GetTeamPlanOffersData,
    GetTeamPlanOffersVariables
> = gql`
    query GetTeamPlanOffers($order_by: [team_deals_order_by!]) {
        team_deals(order_by: $order_by) {
            akUUID
            checkoutPaidAt
            dealAcceptedAt
            teamDealTarget
            createdAt
            newTeamName
            newTeamSeats
            tokensPerSeat
            team {
                id
                akUUID
                teamName
            }
        }
    }
`;

/**
 * Query to get a specific team by ID
 */
export const GetTeamDocument = gql`
    query GetTeam($id: Int!) {
        teams_by_pk(id: $id) {
            id
            akUUID
            teamName
            teamLogoUrl
            plan
            planSubscribeFrequency
            planTokenRenewalDate
            planCustomTokenRenewalAmount
            planSeats
            creatorUserId
            subscriptionTokens
            paidTokens
            createdAt
            planSubscribeDate
            rolloverTokens
        }
    }
`;

/**
 * Query to get team members
 */
export const GetTeamMembersDocument = gql`
    query GetTeamMembers($teamId: Int!) {
        team_memberships(where: { teamId: { _eq: $teamId } }) {
            userId
            role
            createdAt
            user {
                id
                username
            }
        }
    }
`;

// ============================================================================
// Team Model Overrides
// ============================================================================

export const TeamModelOverridePartsFragment = gql`
    fragment TeamModelOverrideParts on team_model_overrides {
        teamId
        modelIdentifier
        isEnabled
        createdAt
        updatedByUser {
            id
            username
        }
    }
`;

export const GetTeamModelOverridesDocument = gql`
    query GetTeamModelOverrides($teamId: uuid!) {
        team_model_overrides(where: { team: { akUUID: { _eq: $teamId } } }) {
            ...TeamModelOverrideParts
        }
    }
    ${TeamModelOverridePartsFragment}
`;

// ============================================================================
// Team Plan Queries
// ============================================================================

export const GetTeamPlanHistoryDocument = gql`
    query GetTeamPlanHistory($teamId: bigint!) {
        team_plan_history(where: { teamId: { _eq: $teamId } }) {
            id
            teamId
            planPastDueStartDate
            paymentPlatformSubscriptionId
            paymentPlatformSubscriptionDetails
            plan
            transactionId
            planSubscriptionSource
            datePurchased
            purchasingUser
        }
    }
`;

export const GetTeamPlanOffersFullDocument = gql`
    query GetTeamPlanOffers(
        $where: team_deals_bool_exp
        $limit: Int
        $offset: Int
        $order_by: [team_deals_order_by!]
    ) {
        team_deals(
            where: $where
            limit: $limit
            offset: $offset
            order_by: $order_by
        ) {
            akUUID
            newTeamName
            newTeamSeats
            tokensPerSeat
            teamDealTarget
            dealAcceptedAt
            checkoutPaidAt
            createdAt
            team {
                id
                akUUID
                teamName
            }
        }
    }
`;

export const GetTeamPlansDocument = gql`
    query GetTeamPlans {
        team_plans {
            name
            planDescription
        }
    }
`;

// ============================================================================
// Team Profile
// ============================================================================

export const GetTeamProfileDocument = gql`
    query GetTeamProfile($akUUID: uuid!) {
        teams(where: { akUUID: { _eq: $akUUID } }, limit: 1) {
            id
            akUUID
            teamName
            teamLogoUrl
            plan
            planSeats
            members: team_memberships {
                teamId
                userId
                role
                createdAt
                user {
                    username
                }
            }
        }
    }
`;

// ============================================================================
// Team Invites (Extended)
// ============================================================================

export const GetTeamsInvitesPendingDocument = gql`
    query GetTeamsInvites($inviteEmail: String) {
        team_invites(
            where: {
                _and: {
                    inviteEmail: { _ilike: $inviteEmail }
                    dateAccepted: { _is_null: true }
                    dateDeclined: { _is_null: true }
                    expiryDate: { _gte: "now()" }
                }
            }
            order_by: { dateInvited: desc }
        ) {
            id
            invitedBy {
                id
                username
            }
            teamId
            teamName
            inviteEmail
            dateInvited
        }
    }
`;

// ============================================================================
// Team Membership & Invites Combined
// ============================================================================

export const GetTeamsMembersDocument = gql`
    query GetTeamsMembers($teamId: bigint) {
        team_membership(where: { teamId: { _eq: $teamId } }) {
            createdAt
            role
            userId
            userEmail
            user {
                id
                username
            }
            teamId
        }
        team_invites(where: { teamId: { _eq: $teamId } }) {
            dateAccepted
            dateDeclined
            dateInvited
            expiryDate
            inviteEmail
            inviteRole
            teamId
        }
    }
`;

// ============================================================================
// Team Invite Validation
// ============================================================================

export const ValidateTeamInviteDocument = gql`
    query ValidateTeamInvite($input: ValidateTeamInviteInput!) {
        validateTeamInvite(input: $input) {
            valid
        }
    }
`;

