import { gql } from '@apollo/client';

/**
 * Collection Queries
 *
 * GraphQL queries for collections, hierarchy, and descendants.
 */

// ============================================================================
// Collection Fragments
// ============================================================================

export const GetCollectionDescendantsFlatCollectionFieldsFragment = gql`
    fragment GetCollectionDescendantsFlatCollectionFields on collection {
        id
        collectionName
        parentCollectionId
        akUUID
        maxDescendantDepth
        depth
        permission
        user {
            id
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
`;

export const GetCollectionDescendantsCollectionFieldsFragment = gql`
    fragment GetCollectionDescendantsCollectionFields on collection {
        id
        teamId
        user {
            id
        }
        permission
        collectionName
        parentCollectionId
        akUUID
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
`;

// ============================================================================
// Collection Hierarchy Queries
// ============================================================================

export const GetCollectionAncestorsDocument = gql`
    query GetCollectionAncestors($id: String!) {
        ancestors: getCollectionAncestors(id: $id) {
            id
            akUUID
            collectionName
            depth
        }
    }
`;

export const GetCollectionDescendantsFlatDocument = gql`
    query GetCollectionDescendantsFlat(
        $where: collection_bool_exp!
        $limit: Int
        $offset: Int
    ) {
        collection(
            where: $where
            limit: $limit
            offset: $offset
            order_by: [{ collectionName: asc }, { createdAt: asc }]
        ) {
            ...GetCollectionDescendantsFlatCollectionFields
            descendants(
                order_by: { depth: asc, collectionName: asc, createdAt: asc }
            ) {
                ...GetCollectionDescendantsFlatCollectionFields
            }
        }
    }
    ${GetCollectionDescendantsFlatCollectionFieldsFragment}
`;

export const GetCollectionDescendantsSharedWithMeDocument = gql`
    query GetCollectionDescendantsSharedWithMe(
        $input: GetSharedCollectionsInput!
        $limit: Int
        $offset: Int
    ) {
        getSharedCollections(input: $input, limit: $limit, offset: $offset) {
            id
            collectionName
            akUUID
            maxDescendantDepth
            depth
            permission
            collection_images {
                id
                collectionId
                generatedImageId
                generated_image {
                    url
                    id
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
    }
`;

export const GetCollectionDescendantsDocument = gql`
    query GetCollectionDescendants(
        $where: collection_bool_exp!
        $limit: Int
        $offset: Int
    ) {
        collection(
            where: $where
            limit: $limit
            offset: $offset
            order_by: [{ collectionName: asc }, { createdAt: asc }]
        ) {
            ...GetCollectionDescendantsCollectionFields
            child_collections {
                ...GetCollectionDescendantsCollectionFields
                child_collections {
                    ...GetCollectionDescendantsCollectionFields
                }
            }
        }
    }
    ${GetCollectionDescendantsCollectionFieldsFragment}
`;

// ============================================================================
// Collection Image Queries
// ============================================================================

export const GetImageCollectionsDocument = gql`
    query GetImageCollections($imageIds: [uuid!]!) {
        collection_image(where: { generatedImageId: { _in: $imageIds } }) {
            collectionId
            generatedImageId
            id
        }
    }
`;

export const GetCollectionImagesDocument = gql`
    query GetCollectionImages(
        $collectionId: bigint
        $generatedImageId: uuid_comparison_exp = {}
    ) {
        collection_image(
            where: {
                collectionId: { _eq: $collectionId }
                generatedImageId: $generatedImageId
            }
        ) {
            id
            collectionId
            generatedImageId
            generated_image {
                id
                generation {
                    id
                }
            }
        }
    }
`;

// ============================================================================
// Bulk Download Fragments & Queries
// ============================================================================

export const BulkDownloadableVariantFragment = gql`
    fragment BulkDownloadableVariant on generated_image_variation_generic {
        id
        url
        transformType
        upscale_details {
            id
            oneClicktype
        }
    }
`;

export const BulkDownloadableGeneratedImageFragment = gql`
    fragment BulkDownloadableGeneratedImage on generated_images {
        url
        id
        motionGifUrl: motionGIFURL
        motionMp4Url: motionMP4URL
        generated_image_variation_generics {
            ...BulkDownloadableVariant
        }
    }
    ${BulkDownloadableVariantFragment}
`;

export const GetCollectionItemsForBulkDownloadDocument = gql`
    query GetCollectionItemsForBulkDownload(
        $where: collection_bool_exp!
        $limit: Int
        $offset: Int
    ) {
        collection(
            where: $where
            limit: $limit
            offset: $offset
            order_by: [{ collectionName: asc }, { createdAt: asc }]
        ) {
            id
            collectionName
            parentCollectionId
            akUUID
            collection_images {
                id
                collectionId
                generatedImageId
                generated_image {
                    ...BulkDownloadableGeneratedImage
                }
            }
            child_collections {
                id
                collectionName
                parentCollectionId
                akUUID
                collection_images {
                    id
                    collectionId
                    generatedImageId
                    generated_image {
                        ...BulkDownloadableGeneratedImage
                    }
                }
                child_collections {
                    id
                    collectionName
                    parentCollectionId
                    akUUID
                    collection_images {
                        id
                        collectionId
                        generatedImageId
                        generated_image {
                            ...BulkDownloadableGeneratedImage
                        }
                    }
                }
            }
        }
    }
    ${BulkDownloadableGeneratedImageFragment}
`;

// ============================================================================
// Collection Members & Teams
// ============================================================================

export const GetCollectionMembersDocument = gql`
    query GetCollectionMembers($id: String!) {
        getCollectionMembers(id: $id) {
            collectionId
            email
            inTeam
            userId
            isInherited
            permission
            username
            sharedAt
        }
    }
`;

export const GetCollectionTeamsDocument = gql`
    query GetCollectionTeams($id: String!) {
        getCollectionTeams(id: $id) {
            collectionId
            teamId
            permission
            teamName
            isInherited
            numMembers
            teamLogoUrl
        }
    }
`;

// ============================================================================
// Collection Parents
// ============================================================================

export const GetCollectionParentsCollectionFieldsFragment = gql`
    fragment GetCollectionParentsCollectionFields on collection {
        akUUID
        id
        teamId
        user {
            id
        }
        collectionName
        parentCollectionId
        parent_collection {
            akUUID
            id
        }
    }
`;

export const GetCollectionParentsDocument = gql`
    query GetCollectionParents(
        $where: collection_bool_exp!
        $limit: Int
        $offset: Int
    ) {
        collection(where: $where, limit: $limit, offset: $offset) {
            ...GetCollectionParentsCollectionFields
            parent_collection {
                ...GetCollectionParentsCollectionFields
                parent_collection {
                    ...GetCollectionParentsCollectionFields
                    parent_collection {
                        ...GetCollectionParentsCollectionFields
                    }
                }
            }
        }
    }
    ${GetCollectionParentsCollectionFieldsFragment}
`;

// ============================================================================
// Feed Collection Fragment & Queries
// ============================================================================

export const FeedCollectionFragment = gql`
    fragment FeedCollection on collection {
        id
        akUUID
        teamId
        collectionName
        thumbnailUrl
        createdAt
        parentCollectionId
        isShared
        user {
            id
            username
        }
        permission
        collection_images(limit: 4) {
            id
            collectionId
            generatedImageId
            generated_image {
                id
                url
            }
        }
        __typename
    }
`;

export const GetCollectionDocument = gql`
    query GetCollection($id: uuid!) {
        collection(where: { akUUID: { _eq: $id } }) {
            ...FeedCollection
            child_collections {
                ...FeedCollection
            }
        }
    }
    ${FeedCollectionFragment}
`;

export const GetCollectionsDocument = gql`
    query GetCollections(
        $where: collection_bool_exp!
        $limit: Int
        $offset: Int
    ) {
        collection(
            where: $where
            limit: $limit
            offset: $offset
            order_by: [{ collectionName: asc }, { createdAt: asc }]
        ) {
            ...FeedCollection
        }
    }
    ${FeedCollectionFragment}
`;

export const GetCollectionsSharedWithMeDocument = gql`
    query GetCollectionsSharedWithMe(
        $input: GetSharedCollectionsInput!
        $limit: Int
        $offset: Int
    ) {
        collection: getSharedCollections(
            input: $input
            limit: $limit
            offset: $offset
        ) {
            id
            akUUID
            collectionName
            isShared
            isSharedWithCurrentTeam
            user {
                id
                username
            }
            permission
            collection_images(limit: 4) {
                id
                collectionId
                generatedImageId
                generated_image {
                    id
                    url
                }
            }
        }
    }
`;

// ============================================================================
// Team Collection Images
// ============================================================================

export const CollectionGeneratedImageModerationFragment = gql`
    fragment CollectionGeneratedImageModeration on generated_images {
        generated_image_moderation {
            generatedImageId
            moderationClassification
        }
    }
`;

export const GetTeamCollectionImagesDocument = gql`
    query GetTeamCollectionImages(
        $limit: Int = 10
        $offset: Int
        $teamId: bigint_comparison_exp
        $userId: uuid_comparison_exp
        $collectionId: bigint_comparison_exp
        $akUUID: uuid_comparison_exp
    ) {
        collection(
            where: {
                teamId: $teamId
                userId: $userId
                id: $collectionId
                akUUID: $akUUID
            }
        ) {
            collectionName
            id
            akUUID
            createdAt
            parentCollectionId
            collection_images(limit: $limit, offset: $offset) {
                createdAt
                id
                collectionId
                generatedImageId
                generated_image {
                    generationId
                    url
                    userId
                    nsfw
                    id
                    createdAt
                    public
                    collection_images {
                        id
                        collectionId
                        generatedImageId
                    }
                    ...CollectionGeneratedImageModeration
                    team {
                        akUUID
                        creatorUser {
                            user_details {
                                user {
                                    username
                                }
                                userId
                            }
                        }
                    }
                    generation {
                        imageHeight
                        prompt
                        imageWidth
                    }
                }
            }
        }
    }
    ${CollectionGeneratedImageModerationFragment}
`;


