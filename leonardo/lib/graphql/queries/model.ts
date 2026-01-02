import { gql } from '@apollo/client';

export const GetAllUserModelsDocument = gql`
  query GetAllUserModels {
    getAllUserModels {
      models {
        name
        thumbnailUrl
        type
      }
    }
  }
`;

// ============================================================================
// Custom Model Fragments
// ============================================================================

export const ModelPartsFragment = gql`
    fragment ModelParts on custom_models {
        id
        name
        description
        instancePrompt
        modelHeight
        modelWidth
        coreModel
        createdAt
        sdVersion
        type
        nsfw
        motion
        public
        trainingStrength
        user {
            id
            username
        }
        generated_image {
            url
            id
        }
        imageCount
        teamId
    }
`;

// ============================================================================
// Custom Model Queries
// ============================================================================

export const GetCustomModelImageDocument = gql`
    query GetCustomModelImage($id: uuid!) {
        custom_models_by_pk(id: $id) {
            id
            name
            generated_image {
                url
            }
        }
    }
`;

export const GetCustomModelDocument = gql`
    query GetCustomModel($id: uuid!, $generationsWhere: generations_bool_exp) {
        custom_models_by_pk(id: $id) {
            ...ModelParts
        }
    }
    ${ModelPartsFragment}
`;

export const GetCustomModelsPollDocument = gql`
    query GetCustomModelsPoll(
        $where: custom_models_bool_exp
        $limit: Int
        $offset: Int
    ) {
        custom_models(
            where: $where
            limit: $limit
            offset: $offset
            order_by: [{ createdAt: desc }]
        ) {
            __typename
            id
            createdAt
            name
            status
            instancePrompt
            teamId
            nsfw
            type
            public
            sdVersion
            trainingStrength
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
        }
    }
`;

export const GetCustomModelsDocument = gql`
    query GetCustomModels($where: custom_models_bool_exp) {
        custom_models(where: $where) {
            ...ModelParts
        }
    }
    ${ModelPartsFragment}
`;

// ============================================================================
// Related Model Images
// ============================================================================

export const GeneratedImageModerationFragment = gql`
    fragment GeneratedImageModeration on generated_images {
        generated_image_moderation {
            generatedImageId
            moderationClassification
        }
    }
`;

export const GetRelatedModelImagesDocument = gql`
    query GetRelatedModelImages(
        $where: generated_images_bool_exp
        $limit: Int
        $order_by: [generated_images_order_by!]
    ) @cached(ttl: 300) {
        generated_images(where: $where, limit: $limit, order_by: $order_by) {
            id
            url
            motionMP4URL
            motionGIFURL
            nsfw
            image_height
            image_width
            motionMP4URL
            public
            generationId
            slug @client
            generated_image_variation_generics(order_by: [{ createdAt: desc }]) {
                createdAt
                id
                image_height
                image_width
                status
                transformType
                upscale_details {
                    alchemyRefinerCreative
                    alchemyRefinerStrength
                    creativityStrength
                    height
                    id
                    isOneClick
                    oneClicktype
                    upscaleMultiplier
                    variationId
                    width
                }
                url
            }
            generation {
                id
                imageHeight
                imageWidth
                prompt
                modelId
                nsfw
                prompt_moderations {
                    moderationClassification
                }
                motion
                motionGenerationResolution
                __typename
            }
            ...GeneratedImageModeration
            __typename
        }
    }
    ${GeneratedImageModerationFragment}
`;

