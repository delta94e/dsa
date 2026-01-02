/**
 * Delete Mutations
 *
 * GraphQL mutations for deleting various resources.
 */

import { gql } from '@apollo/client';

// ============================================================================
// Blueprint Delete
// ============================================================================

export const DeleteBlueprintExecutionDocument = gql`
    mutation DeleteBlueprintExecution($akUUID: ID!) {
        deleteBlueprintExecution(akUUID: $akUUID) {
            success
            blueprintExecution {
                akUUID
            }
        }
    }
`;

// ============================================================================
// Collection Delete
// ============================================================================

export const DeleteCollectionDocument = gql`
    mutation DeleteCollection($arg1: DeleteCollectionsInput!) {
        deleteCollections(arg1: $arg1) {
            collectionsCount
            imagesCount
        }
    }
`;

export const DeleteCollectionImageDocument = gql`
    mutation DeleteCollectionImage($where: collection_image_bool_exp!) {
        delete_collection_image(where: $where) {
            affected_rows
            returning {
                id
                collectionId
                generatedImageId
            }
        }
    }
`;

// ============================================================================
// Model Delete
// ============================================================================

export const DeleteCustomModelDocument = gql`
    mutation DeleteCustomModel($id: uuid!) {
        delete_custom_models_by_pk(id: $id) {
            id
        }
    }
`;

export const DeleteFavouriteModelDocument = gql`
    mutation DeleteFavouriteModel($customModelId: uuid!, $userId: uuid!) {
        delete_user_favourite_custom_models_by_pk(
            customModelId: $customModelId
            userId: $userId
        ) {
            userId
        }
    }
`;

// ============================================================================
// Dataset Delete
// ============================================================================

export const DeleteDatasetDocument = gql`
    mutation DeleteDataset($id: uuid!) {
        delete_datasets_by_pk(id: $id) {
            id
        }
    }
`;

export const DeleteDatasetImagesDocument = gql`
    mutation DeleteDatasetImages($where: dataset_images_bool_exp!) {
        delete_dataset_images(where: $where) {
            affected_rows
        }
    }
`;

// ============================================================================
// Follow Delete
// ============================================================================

export const DeleteFollowDocument = gql`
    mutation DeleteFollow($followerId: uuid!, $followingId: uuid!) {
        delete_follows_by_pk(followerId: $followerId, followingId: $followingId) {
            followerId
        }
    }
`;

// ============================================================================
// Generation Delete
// ============================================================================

export const DeleteGenerationDocument = gql`
    mutation DeleteGeneration($id: uuid!) {
        delete_generations_by_pk(id: $id) {
            id
        }
    }
`;

export const DeleteGenerationsDocument = gql`
    mutation DeleteGenerations($ids: [uuid!]) {
        delete_generations(where: { id: { _in: $ids } }) {
            affected_rows
            returning {
                id
            }
        }
    }
`;

// ============================================================================
// Image Delete
// ============================================================================

export const DeleteImageDocument = gql`
    mutation DeleteImage($id: uuid!) {
        delete_generated_images_by_pk(id: $id) {
            id
        }
    }
`;

export const DeleteImagesDocument = gql`
    mutation DeleteImages($ids: [uuid!]!) {
        delete_generated_images(where: { id: { _in: $ids } }) {
            affected_rows
            returning {
                id
            }
        }
    }
`;

// ============================================================================
// Init Image Delete
// ============================================================================

export const DeleteInitImageDocument = gql`
    mutation DeleteInitImage($id: uuid!) {
        delete_init_images_by_pk(id: $id) {
            id
        }
    }
`;

export const DeleteInitImagesDocument = gql`
    mutation DeleteInitImages($ids: [uuid!]!) {
        delete_init_images(where: { id: { _in: $ids } }) {
            affected_rows
            returning {
                id
            }
        }
    }
`;

// ============================================================================
// Like Delete
// ============================================================================

export const DeleteLikeChangelogDocument = gql`
    mutation DeleteLikeChangelog($changelogId: bigint!, $userId: uuid!) {
        delete_user_liked_changelog(
            where: {
                changelogId: { _eq: $changelogId }
                userId: { _eq: $userId }
            }
        ) {
            returning {
                changelogId
            }
        }
    }
`;

export const DeleteLikeImageDocument = gql`
    mutation DeleteLikeImage($generatedImageId: uuid!, $userId: uuid!) {
        delete_user_liked_generated_images_by_pk(
            generatedImageId: $generatedImageId
            userId: $userId
        ) {
            generatedImageId
            userId
        }
    }
`;

// ============================================================================
// User Delete
// ============================================================================

export const DeleteUserDocument = gql`
    mutation DeleteUser($userId: String!) {
        deleteUser(deleteUserInput: { deletedUserId: $userId }) {
            success
        }
    }
`;

export const DeleteUserElementDocument = gql`
    mutation DeleteUserElement($id: Int!) {
        delete_user_loras_by_pk(id: $id) {
            id
        }
    }
`;

// ============================================================================
// Variation Delete
// ============================================================================

export const DeleteImageVariationDocument = gql`
    mutation DeleteImageVariation($id: uuid!) {
        delete_generated_image_variation_generic_by_pk(id: $id) {
            id
        }
    }
`;

export const DeleteImageVariationsDocument = gql`
    mutation DeleteImageVariations($ids: [uuid!]) {
        delete_generated_image_variation_generic(where: { id: { _in: $ids } }) {
            affected_rows
        }
    }
`;

export const DeleteMotionVariationDocument = gql`
    mutation DeleteMotionVariation($id: bigint!) {
        delete_generated_image_variation_motion_by_pk(id: $id) {
            id
            akUUID
        }
    }
`;
