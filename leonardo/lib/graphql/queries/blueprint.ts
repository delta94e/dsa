import { gql } from '@apollo/client';

/**
 * Blueprint Queries
 *
 * GraphQL queries for blueprints and blueprint executions.
 */

import {
    BlueprintLikesFragment,
    BlueprintExecutionsGenerationFragment,
} from '../fragments/blueprint';

export const GetBlueprintByIdDocument = gql`
    query GetBlueprintById($akUUID: ID!) {
        blueprint(akUUID: $akUUID) {
            akUUID
            description
            name
            thumbnailURL
            thumbnails {
                name
                url
            }
            user {
                id
                username
            }
            categories {
                name
            }
            accessTier {
                name
            }
            versions(first: 1) {
                edges {
                    node {
                        akUUID
                        cost
                        uiMetadata
                        executability {
                            isExecutable
                            reasons {
                                ... on RestrictedModels {
                                    models
                                }
                            }
                        }
                    }
                }
            }
            isFeatured
            ...BlueprintLikes
        }
    }
    ${BlueprintLikesFragment}
`;

export const GetBlueprintExecutionStatusDocument = gql`
    query GetBlueprintExecutionStatus(
        $first: Int
        $orderBy: BlueprintExecutionOrderByInput
        $after: String
        $where: BlueprintExecutionFilterInput
        $mergeGenerations: Boolean
    ) {
        blueprintExecutions(
            first: $first
            orderBy: $orderBy
            after: $after
            where: $where
        ) {
            generations @client {
                blueprintExecution @client {
                    akUUID
                    inputs
                    status
                }
            }
            edges {
                node {
                    akUUID
                    createdAt
                    status
                    blueprintVersion {
                        uiMetadata
                    }
                    blueprintExecutionGenerations {
                        edges {
                            node {
                                generation {
                                    blueprintExecution @client {
                                        status
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
`;

export const GetBlueprintExecutionsDocument = gql`
    query GetBlueprintExecutions(
        $first: Int
        $orderBy: BlueprintExecutionOrderByInput
        $after: String
        $where: BlueprintExecutionFilterInput
        $mergeGenerations: Boolean
    ) {
        blueprintExecutions(
            first: $first
            orderBy: $orderBy
            after: $after
            where: $where
        ) {
            generations @client {
                ...BlueprintExecutionsGeneration
            }
            edges {
                node {
                    akUUID
                    createdAt
                    inputs
                    status
                    public
                    blueprintVersion {
                        akUUID
                        uiMetadata
                        blueprint {
                            akUUID
                            description
                            name
                        }
                    }
                    user {
                        id
                        username
                    }
                    blueprintExecutionGenerations {
                        edges {
                            node {
                                status
                                generation {
                                    ...BlueprintExecutionsGeneration
                                }
                                failedReason {
                                    message
                                    type
                                }
                            }
                        }
                    }
                }
            }
            pageInfo {
                hasNextPage
                endCursor
            }
        }
    }
    ${BlueprintExecutionsGenerationFragment}
`;

export const GetBlueprintForGenerationDocument = gql`
    query GetBlueprintForGeneration(
        $where: BlueprintExecutionGenerationFilterInput
    ) {
        blueprintExecutionGenerations(where: $where) {
            edges {
                node {
                    akUUID
                    status
                    generationId
                    blueprintVersion {
                        akUUID
                        blueprint {
                            akUUID
                            name
                            description
                        }
                    }
                }
            }
        }
    }
`;

export const GetBlueprintCategoriesDocument = gql`
    query GetBlueprintCategories {
        blueprintCategories {
            totalCount
            edges {
                node {
                    name
                    handle
                    description
                }
            }
        }
    }
`;

export const GetBlueprintsDocument = gql`
    query GetBlueprints(
        $last: Int
        $first: Int
        $orderBy: BlueprintOrderByInput
        $where: BlueprintFilterInput
        $after: String
    ) {
        blueprints(
            last: $last
            first: $first
            orderBy: $orderBy
            where: $where
            after: $after
        ) {
            edges {
                cursor
                node {
                    name
                    akUUID
                    createdAt
                    thumbnailURL
                    thumbnails {
                        name
                        url
                    }
                    description
                    categories {
                        name
                    }
                    user {
                        id
                        username
                    }
                    isFeatured
                    accessTier {
                        name
                    }
                    ...BlueprintLikes
                }
            }
            totalCount
            pageInfo {
                hasNextPage
            }
        }
    }
    ${BlueprintLikesFragment}
`;
