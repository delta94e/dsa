/**
 * User Queries
 *
 * GraphQL queries for user-related data.
 */

import { gql } from '@apollo/client';

// ============================================================================
// AWS Marketplace Subscriptions
// ============================================================================

/** AWS Marketplace subscription type */
export interface AwsMarketplaceSubscription {
    id: string;
    awsMpSubscriptionStatus: string | null;
    awsMpSubscriptionType: 'TEAM' | 'API' | string | null;
}

/** Response data type for GetUserAWSMarketplaceSubscriptions query */
export interface GetUserAWSMarketplaceSubscriptionsData {
    users: Array<{
        aws_marketplace_subscriptions: AwsMarketplaceSubscription[];
    }>;
}

/** Variables type for GetUserAWSMarketplaceSubscriptions query */
export interface GetUserAWSMarketplaceSubscriptionsVariables {
    userSub?: string | null;
}

export const GetUserAWSMarketplaceSubscriptionsDocument = gql`
    query GetUserAWSMarketplaceSubscriptions($userSub: String) {
        users(where: { user_details: { cognitoId: { _eq: $userSub } } }) {
            aws_marketplace_subscriptions {
                id
                awsMpSubscriptionStatus
                awsMpSubscriptionType
            }
        }
    }
`;

// ============================================================================
// User Lookup
// ============================================================================

export const GetUserByUserEmailDocument = gql`
    query GetUserByUserEmail($arg1: GetUserByUserEmailInput!) {
        getUserByUserEmail(arg1: $arg1) {
            cognitoProvider
            confirmationStatus
            userId
        }
    }
`;

// ============================================================================
// User Details
// ============================================================================

export const ImageTokensFragment = gql`
    fragment ImageTokens on user_details {
        paidTokens
        subscriptionTokens
        rolloverTokens
    }
`;

export const GetUserDetailsDocument = gql`
    query GetUserDetails($userSub: String) {
        users(where: { user_details: { cognitoId: { _eq: $userSub } } }) {
            id
            username
            blocked
            suspensionStatus
            createdAt
            user_details {
                id
                apiConcurrencySlots
                apiCredit
                apiPaidTokens
                apiPlan
                apiPlanAutoTopUpTriggerBalance
                apiPlanSubscribeDate
                apiPlanSubscribeFrequency
                apiPlanSubscriptionSource
                apiPlanTokenRenewalDate
                apiPlanTopUpAmount
                apiSubscriptionTokens
                auth0Email
                interests
                interestsRoles
                interestsRolesOther
                isChangelogVisible
                lastSeenChangelogId
                paddleId
                plan
                planSubscribeFrequency
                showNsfw
                streamTokens
                subscriptionGptTokens
                subscriptionModelTokens
                subscriptionSource
                tokenRenewalDate
                customApiTokenRenewalAmount
                ...ImageTokens
            }
            team_memberships {
                userId
                teamId
                team {
                    akUUID
                    id
                    modifiedAt
                    paidTokens
                    paymentPlatformId
                    plan
                    planCustomTokenRenewalAmount
                    planSeats
                    planSubscribeDate
                    planSubscribeFrequency
                    planSubscriptionSource
                    planTokenRenewalDate
                    subscriptionTokens
                    teamLogoUrl
                    teamName
                    createdAt
                    creatorUserId
                    rolloverTokens
                    members: team_memberships {
                        teamId
                        userId
                        role
                        createdAt
                    }
                }
                role
            }
            tos_acceptances {
                tosHash
                acceptedAt
            }
        }
    }
    ${ImageTokensFragment}
`;

// ============================================================================
// User Loras / Elements
// ============================================================================

export const GetUserElementMetaByIdDocument = gql`
    query GetUserElementMetaById($where: user_loras_bool_exp) {
        user_loras(where: $where) {
            id
            name
            description
            baseModel
            urlImage
            weightDefault
            weightMin
            weightMax
            modelLRN
            dataset {
                id
                name
                dataset_images(limit: 1) {
                    url
                }
            }
        }
    }
`;

export const GetUserElementsDocument = gql`
    query GetUserElements(
        $offset: Int
        $limit: Int
        $where: user_loras_bool_exp
    ) {
        user_loras(
            where: $where
            limit: $limit
            offset: $offset
            order_by: [{ createdAt: desc }]
        ) {
            id
            name
            description
            status
            focus
            instancePrompt
            teamId
            weightDefault
            modelLRN
            dataset {
                id
                name
                dataset_images(limit: 1) {
                    url
                }
            }
            user {
                id
                username
            }
            training_images(limit: 1) {
                url
            }
            createdAt
            resolution
            trainingEpoch
            learningRate
            nsfw
            baseModel
            trainTextEncoder
        }
    }
`;

// ============================================================================
// User Follow
// ============================================================================

export const GetUserFollowDocument = gql`
    query GetUserFollow($userId: uuid!, $followThisUserId: uuid!) {
        follows(
            where: {
                followerId: { _eq: $userId }
                followingId: { _eq: $followThisUserId }
            }
        ) {
            followingId
            followerId
        }
    }
`;

// ============================================================================
// User Lookup by Username
// ============================================================================

export const GetUserIDByUsernameDocument = gql`
    query GetUserIDByUsername($username: String!) {
        getUserIDByUsername(arg1: { username: $username }) {
            id
            username
        }
    }
`;

// ============================================================================
// User Changelog Likes
// ============================================================================

export const GetUserLikedChangelogDocument = gql`
    query GetUserLikedChangelog($changelogId: bigint!, $userId: uuid!) {
        user_liked_changelog(
            where: {
                changelogId: { _eq: $changelogId }
                userId: { _eq: $userId }
            }
        ) {
            changelogId
        }
    }
`;

// ============================================================================
// User Loras Polling
// ============================================================================

export const GetUserLorasPollDocument = gql`
    query GetUserLorasPoll(
        $where: user_loras_bool_exp
        $limit: Int
        $offset: Int
    ) {
        user_loras(
            where: $where
            limit: $limit
            offset: $offset
            order_by: [{ createdAt: desc }]
        ) {
            __typename
            id
            createdAt
            name
            baseModel
            status
            focus
            instancePrompt
            teamId
            focus
            weightDefault
            nsfw
            description
            dataset {
                id
                name
                user {
                    id
                    username
                }
                dataset_images(limit: 1) {
                    id
                    url
                }
            }
            resolution
            trainingEpoch
            learningRate
            trainTextEncoder
        }
    }
`;

// ============================================================================
// User Models
// ============================================================================

import { ModelPartsFragment } from './model';

export const GetUserModelsDocument = gql`
    query GetUserModels(
        $order_by: [custom_models_order_by!]
        $where: custom_models_bool_exp
        $limit: Int
    ) {
        custom_models(order_by: $order_by, where: $where, limit: $limit) {
            ...ModelParts
        }
    }
    ${ModelPartsFragment}
`;

// ============================================================================
// User Retentions
// ============================================================================

export const GetUserRetentionsDocument = gql`
    query GetUserRetentions {
        queryUserRetentions {
            lastShowingDate
            offers
            offersEnabled
            showingsCurrentCount
            showingsMaxCount
            showingsMinInterval
            offerAccepted
            offerActivated
            activationGracePeriod
        }
    }
`;

// ============================================================================
// User State
// ============================================================================

export const GetUserStateDocument = gql`
    query GetUserState($type: UserStateType!) {
        getUserState(type: $type) {
            state
        }
    }
`;

// ============================================================================
// User Teams
// ============================================================================

export const GetUserTeamsDocument = gql`
    query GetUserTeams($userId: uuid!) {
        team_membership(where: { userId: { _eq: $userId } }) {
            userId
            teamId
            team {
                akUUID
                id
                modifiedAt
                paidTokens
                paymentPlatformId
                plan
                planCustomTokenRenewalAmount
                planSeats
                planSubscribeDate
                planSubscribeFrequency
                planSubscriptionSource
                planTokenRenewalDate
                subscriptionTokens
                teamLogoUrl
                teamName
                createdAt
                creatorUserId
                rolloverTokens
                members: team_memberships {
                    teamId
                    userId
                    role
                    createdAt
                }
            }
            role
            id
        }
    }
`;

// ============================================================================
// User Tokens
// ============================================================================

export const GetUserTokensFromSubDocument = gql`
    query GetUserTokensFromSub($sub: String) {
        user_details(where: { cognitoId: { _eq: $sub } }) {
            plan
            subscriptionGptTokens
            subscriptionModelTokens
            tokenRenewalDate
            ...ImageTokens
        }
        teams {
            akUUID
            paidTokens
            subscriptionTokens
            rolloverTokens
        }
    }
    ${ImageTokensFragment}
`;

