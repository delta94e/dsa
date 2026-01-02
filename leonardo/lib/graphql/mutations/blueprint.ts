/**
 * Blueprint Mutations
 *
 * GraphQL mutations for blueprint operations.
 */

import { gql } from '@apollo/client';

/**
 * Execute a blueprint
 */
export const ExecuteBlueprintDocument = gql`
    mutation ExecuteBlueprint($blueprintVersionId: ID!, $input: ExecuteBlueprintInput!) {
        executeBlueprint(blueprintVersionId: $blueprintVersionId, input: $input) {
            akUUID
        }
    }
`;

/**
 * Export analytics to CSV
 */
export const ExportAnalyticsCsvDocument = gql`
    mutation ExportAnalyticsCsv($input: CsvExportInput!) {
        exportAnalyticsCsv(input: $input) {
            downloadUrl
            expiresAt
            fileName
            generatedAt
        }
    }
`;

/**
 * Generate (main generation mutation)
 */
export const GenerateDocument = gql`
    mutation Generate($request: CreateGenerationRequest!) {
        generate(request: $request) {
            apiCreditCost
            generationId
        }
    }
`;

/**
 * Import images to dataset
 */
export const ImportDatasetImagesDocument = gql`
    mutation ImportDatasetImages(
        $datasetId: String!
        $generatedImageIds: [String!]!
        $initImageIds: [String!]!
    ) {
        importDatasetImages(
            datasetId: $datasetId
            generatedImageIds: $generatedImageIds
            initImageIds: $initImageIds
        ) {
            numOfImagesImported
        }
    }
`;

/**
 * Leave a collection
 */
export const LeaveCollectionDocument = gql`
    mutation LeaveCollection($id: String!) {
        leaveCollection(id: $id) {
            id
            akUUID
        }
    }
`;

/**
 * Move collections
 */
export const MoveCollectionsDocument = gql`
    mutation MoveCollections($input: MoveCollectionsInput!) {
        moveCollections(input: $input) {
            movedCollections {
                id
                collectionName
                parentCollectionId
                akUUID
                maxDescendantDepth
                depth
                teamId
                permission
                createdAt
                thumbnailUrl
                isShared
                user {
                    id
                    username
                }
                collection_images(limit: 4) {
                    id
                    collectionId
                    generatedImageId
                    generated_image {
                        id
                        url
                    }
                }
                descendants {
                    id
                    collectionName
                    parentCollectionId
                    akUUID
                    maxDescendantDepth
                    depth
                    permission
                    isShared
                    user {
                        id
                        username
                    }
                    collection_images {
                        id
                        collectionId
                        generatedImageId
                        generated_image {
                            url
                            id
                        }
                    }
                }
            }
            formerAncestors {
                id
                akUUID
                maxDescendantDepth
            }
            newAncestors {
                id
                akUUID
                maxDescendantDepth
            }
        }
    }
`;

// ============================================================================
// Blueprint Updates
// ============================================================================

export const UpdateBlueprintExecutionPrivacyDocument = gql`
    mutation updateBlueprintExecutionPrivacy($akUUID: ID!, $public: Boolean!) {
        updateBlueprintExecutionPublic(akUUID: $akUUID, input: { public: $public }) {
            success
        }
    }
`;

// ============================================================================
// Team Model Overrides
// ============================================================================

export const UpsertTeamModelOverridesDocument = gql`
    mutation UpsertTeamModelOverrides($object: team_model_overrides_insert_input!) {
        insert_team_model_overrides_one(
            object: $object
            on_conflict: {
                constraint: team_model_overrides_teamId_modelIdentifier_unique_idx
                update_columns: [isEnabled]
            }
        ) {
            teamId
            modelIdentifier
            isEnabled
            createdAt
            updatedByUser {
                id
                username
            }
        }
    }
`;
