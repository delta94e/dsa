import { MODEL_IDS } from "./models";

export const StabilityGenerationProviderApiVersions = {
  v1: "v1",
  v2: "v2",
  internalSD3: "internalSD3",
} as const;

export const StabilityGenerationProviderV1Engines = {
  stableDiffusionXL1024V1: "stable-diffusion-xl-1024-v1-0",
} as const;

export const StabilityGenerationProviderEngines = {
  stableDiffusionXL1024V1: "stable-diffusion-xl-1024-v1-0",
} as const;

export const StabilityGenerationProviderV2AspectRatios = {
  "1:1": "1:1",
  "9:21": "9:21",
  "21:9": "21:9",
  "9:16": "9:16",
  "16:9": "16:9",
  "2:3": "2:3",
  "3:2": "3:2",
  "4:5": "4:5",
  "5:4": "5:4",
} as const;

export const StabilityGenerationProviderV2OutputFormat = {
  PNG: "png",
  JPEG: "jpeg",
  WEBP: "webp",
} as const;

export const StabilityGenerationProviderInternalSD3AspectRatios = {
  "1:1": "1:1",
  "9:21": "9:21",
  "21:9": "21:9",
  "9:16": "9:16",
  "16:9": "16:9",
  "2:3": "2:3",
  "3:2": "3:2",
  "4:5": "4:5",
  "5:4": "5:4",
} as const;

export const StabilityGenerationInternalSD3AcceptHeader = {
  PNG: "image/png",
  JPEG: "image/jpeg",
} as const;

export const StabilityGenerationProviderInternalSD3Engines = {
  sd3: "stable-diffusion-v3-0",
  sd3Turbo: "stable-diffusion-v3-0-turbo",
} as const;

export const ExternalGenerationProvider = {
  Stability: "Stability",
} as const;

export const EXTERNAL_GENERATION_PROVIDER_LOOKUP = {
  [MODEL_IDS.SD3]: {
    provider: ExternalGenerationProvider.Stability,
    apiVersion: StabilityGenerationProviderApiVersions.internalSD3,
    engineId: StabilityGenerationProviderInternalSD3Engines.sd3,
    multipleRequestsForPayloadQuantity: true,
    deprecated: true,
  },
  [MODEL_IDS.SD3_TURBO]: {
    provider: ExternalGenerationProvider.Stability,
    apiVersion: StabilityGenerationProviderApiVersions.internalSD3,
    engineId: StabilityGenerationProviderInternalSD3Engines.sd3Turbo,
    multipleRequestsForPayloadQuantity: true,
  },
} as const;
