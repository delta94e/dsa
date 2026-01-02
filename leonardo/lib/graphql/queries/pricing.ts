/**
 * Pricing Queries
 *
 * GraphQL queries for pricing and cost calculations.
 */

import { gql } from '@apollo/client';

/**
 * Calculate service cost for image generation
 */
export const CalculateServiceCostDocument = gql`
    query CalculateServiceCost(
        $alchemyMode: Boolean!
        $height: Int!
        $width: Int!
        $isFluxDev: Boolean
        $isFluxSchnell: Boolean
        $isModelCustom: Boolean!
        $isPhoenix: Boolean
        $isSDXL: Boolean!
        $isSDXLLightning: Boolean!
        $highResolution: Boolean!
        $numImages: Int!
        $inferenceSteps: Int!
        $loraCount: Int!
        $promptMagic: Boolean!
        $promptMagicStrength: Float
        $promptMagicVersion: PromptMagicVersionEnum
    ) {
        calculateProductionApiServiceCost(
            service: IMAGE_GENERATION
            serviceParams: {
                IMAGE_GENERATION: {
                    alchemyMode: $alchemyMode
                    imageHeight: $height
                    imageWidth: $width
                    isFluxDev: $isFluxDev
                    isFluxSchnell: $isFluxSchnell
                    isModelCustom: $isModelCustom
                    isPhoenix: $isPhoenix
                    isSDXL: $isSDXL
                    isSDXLLightning: $isSDXLLightning
                    highResolution: $highResolution
                    numImages: $numImages
                    inferenceSteps: $inferenceSteps
                    loraCount: $loraCount
                    promptMagic: $promptMagic
                    promptMagicStrength: $promptMagicStrength
                    promptMagicVersion: $promptMagicVersion
                }
            }
        ) {
            cost
        }
    }
`;

/**
 * Calculate tax for payment
 */
export const CalculateTaxDocument = gql`
    query calculateTax($calculateTaxInput: PaymentsTaxCalculationInput!) {
        calculateTax(calculateTaxInput: $calculateTaxInput) {
            basePrice
            taxAmount
            taxType
            taxPercentage
            totalAmount
        }
    }
`;
