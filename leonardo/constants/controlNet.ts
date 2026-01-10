import { MODEL_IDS } from "./models";

export const CONTROLNET_TYPE = {
  All: "All",
  Canny: "Canny",
  Depth: "Depth",
  NormalMap: "NormalMap",
  OpenPose: "OpenPose",
  MLSD: "MLSD",
  LineArt: "LineArt",
  SoftEdge: "SoftEdge",
  Scribble_Sketch: "Scribble_Sketch",
  Segmentation: "Segmentation",
  Shuffle: "Shuffle",
  Tile_Blur: "Tile_Blur",
  Inpaint: "Inpaint",
  InstructP2P: "InstructP2P",
  Reference: "Reference",
  Recolor: "Recolor",
  Revision: "Revision",
  T2I_Adapter: "T2I_Adapter",
  IP_adapter: "IP_adapter",
  QR: "QR",
  QR_V2: "QR_V2",
  Hed: "Hed",
  Text: "Text",
  StyleTransfer: "StyleTransfer",
  ContentTransfer: "ContentTransfer",
  FaceTransfer: "FaceTransfer",
  ImageToImage: "ImageToImage",
  ImageReference: "ImageReference",
  StartFrame: "StartFrame",
  EndFrame: "EndFrame",
} as const;

export type ControlNetType =
  (typeof CONTROLNET_TYPE)[keyof typeof CONTROLNET_TYPE];

export const PLATFORM_MODEL_ORDER_PREFERENCE = [
  MODEL_IDS.KINO_2_1,
  MODEL_IDS.FLUX_OMNI,
  MODEL_IDS.GPT_IMAGE_1,
  MODEL_IDS.GPT_IMAGE_1_5,
  MODEL_IDS.PHOENIX_0_9_4,
  MODEL_IDS.FLUX_DEV,
  MODEL_IDS.KINO_2_0,
  MODEL_IDS.PHOENIX,
  MODEL_IDS.FLUX_SCHNELL,
] as const;

export const INCOMPATIBLE_WITH_IMG_2_IMG_CONTROLNETS = [
  CONTROLNET_TYPE.ContentTransfer,
  CONTROLNET_TYPE.OpenPose,
  CONTROLNET_TYPE.Canny,
  CONTROLNET_TYPE.Depth,
  CONTROLNET_TYPE.Text,
] as const;

export const GUIDANCE_LIMIT = {
  [MODEL_IDS.FLUX_OMNI]: 4,
  [MODEL_IDS.FLUX_MAX]: 4,
  [MODEL_IDS.FLUX_DEV_2_0]: 4,
  [MODEL_IDS.FLUX_PRO_2_0]: 4,
  [MODEL_IDS.GEMINI_2_5_FLASH]: 6,
  [MODEL_IDS.GEMINI_IMAGE_2]: 6,
  [MODEL_IDS.GPT_IMAGE_1]: 6,
  [MODEL_IDS.GPT_IMAGE_1_5]: 6,
  [MODEL_IDS.SEEDREAM_4_0]: 6,
  [MODEL_IDS.SEEDREAM_4_5]: 6,
} as const;

export const MODELS_SUPPORTING_NEAREST_MATCH = [
  MODEL_IDS.GEMINI_2_5_FLASH,
  MODEL_IDS.GEMINI_IMAGE_2,
] as const;

export const REASON_INCOMPATIBILITY_COMING_SOON = "Coming soon!";
export const REASON_INCOMPATIBILITY_IMG_2_IMG =
  "Image to Image cannot be combined with other image guidance for XL models, PhotoReal, and PMv3.";
export const REASON_INCOMPATIBILITY_WITH_MODEL =
  "Incompatible with the selected model.";
