import {
  GENERATION_SCHEDULERS,
  MODEL_ARCHITECTURE,
  PROMPT_MAGIC_VERSIONS,
} from "@/lib/constants/enums";
import {
  RESTRICT_AT_PIXELS,
  RESTRICTION_TO_IMAGE_MAX,
  RESTRICTION_TO_IMAGE_MAX_PM_V3,
} from "@/constants/app";
import { MOTION_MAX_OUTPUTS_PER_GENERATION } from "@/constants/generation";

// In common.ts imports: import { ... } from "@/lib/graphql/enums";
// TransparencyType was NOT in common.ts imports shown. But minified code uses c.TransparencyType.
// c is e.i(858913).
// I will assume it's in @/lib/graphql/enums or define it if missing.

interface GenerationParams {
  width: number;
  height: number;
  promptMagicVersion?: string;
  usingTransparency?: boolean; // Or enum type
  usingAlchemy?: boolean;
  usingAlchemyV2?: boolean;
  usingHighRes?: boolean;
  usingMotion?: boolean;
  usingPhotoRealV1?: boolean;
  usingPhotoRealV2?: boolean;
  usingPromptMagic?: boolean;
  usingSvd?: boolean;
}

export const getMaximumOutputsPerGeneration = ({
  width,
  height,
  promptMagicVersion,
  usingTransparency,
  usingAlchemy,
  usingAlchemyV2,
  usingHighRes,
  usingMotion,
  usingPhotoRealV1,
  usingPhotoRealV2,
  usingPromptMagic,
  usingSvd,
}: GenerationParams): number => {
  const totalPixels = width * height;

  // Foreground transparency Logic
  // Assuming usingTransparency is boolean or we check specifically for 'FOREGROUND_ONLY' if passed as enum
  // Minified: if (i === c.TransparencyType.ForegroundOnly && (a || s || E || u))
  // If typed as boolean in our interface, we might be simplifying.
  // Ideally we should use the enum. I'll stick to common.ts implementation which used boolean `usingTransparency` generally, but here the logic is specific.
  // common.ts line 63 says `usingTransparency?: boolean`.
  // But common.ts line 362 check `usingTransparency /* Check Enum ... */`.
  // I will check if I can import TransparencyType.

  if (
    usingTransparency &&
    (usingAlchemy || usingAlchemyV2 || usingPhotoRealV1 || usingPhotoRealV2)
  ) {
    if (totalPixels > 1048576) return 1;
    if (totalPixels > 589824) return 2;
    return 4;
  }

  // Motion/SVD Logic
  if (usingMotion || usingSvd) {
    return MOTION_MAX_OUTPUTS_PER_GENERATION;
  }

  // Alchemy V2 / PhotoReal V2 Logic
  if (usingAlchemyV2 || usingPhotoRealV2) {
    if (totalPixels > 1055360) return 1;
    if (totalPixels > 589824) return 4;
    return 8;
  }

  // High Resolution Logic
  if (usingHighRes) {
    if (width > RESTRICT_AT_PIXELS[3] || height > RESTRICT_AT_PIXELS[3])
      return 1;
    if (width > RESTRICT_AT_PIXELS[2] || height > RESTRICT_AT_PIXELS[2])
      return 2;
  }

  const isPromptMagicV3OrPhotoRealV1 =
    (usingPromptMagic && promptMagicVersion === PROMPT_MAGIC_VERSIONS.v3) ||
    usingPhotoRealV1;

  let i = 0;
  for (; i < RESTRICT_AT_PIXELS.length; i++) {
    const maxDim = Math.max(width, height);
    if (
      maxDim <= (RESTRICT_AT_PIXELS[i + 1] || Infinity) &&
      maxDim > RESTRICT_AT_PIXELS[i]
    ) {
      break;
    }
  }

  return isPromptMagicV3OrPhotoRealV1
    ? RESTRICTION_TO_IMAGE_MAX_PM_V3[i]
    : RESTRICTION_TO_IMAGE_MAX[i];
};

export const generateRandomSeedForGeneration = (
  max: number = Number.MAX_SAFE_INTEGER
): number => {
  return Math.floor(Math.random() * max);
};

export const getFormattedSDVersion = (version: string): string => {
  switch (version) {
    case MODEL_ARCHITECTURE.v1_5:
      return "v1.5";
    case MODEL_ARCHITECTURE.v2:
      return "v2.1";
    default:
      return "";
  }
};

export const getFormattedScheduler = (scheduler: string): string => {
  switch (scheduler) {
    case GENERATION_SCHEDULERS.KLMS:
      return "KLMS";
    case GENERATION_SCHEDULERS.EULER_ANCESTRAL_DISCRETE:
      return "Euler Ancestral ";
    case GENERATION_SCHEDULERS.EULER_DISCRETE:
      return "Euler Discrete";
    case GENERATION_SCHEDULERS.DDIM:
      return "DDIM";
    case GENERATION_SCHEDULERS.DPM_SOLVER:
      return "DPM Solver";
    case GENERATION_SCHEDULERS.DPM_SDE_SOLVER:
      return "DPM SDE Solver";
    case GENERATION_SCHEDULERS.PNDM:
      return "PNDM";
    case GENERATION_SCHEDULERS.UNIPC:
      return "UniPC";
    case GENERATION_SCHEDULERS.LEONARDO:
      return "Leonardo";
    case GENERATION_SCHEDULERS.DPM_SDE_KARRAS:
      return "DPM 2M SDE Karras ++";
    default:
      throw new Error(
        `Error in helpers/getFormattedScheduler: Unknown scheduler: ${scheduler}`
      );
  }
};

export const getTextureGenerationByGenId = ({
  data,
  selectedTextureGenId,
}: {
  data: any;
  selectedTextureGenId: string;
}) => {
  if (!data) return null;
  const { model_asset_texture_generations, ...rest } = data;
  const found = model_asset_texture_generations?.find(
    (g: any) => g.id === selectedTextureGenId
  );
  return found ? { ...found, ...rest } : null;
};

export const getTexturesFromTextureGeneration = (
  generation: any
): Record<string, string> => {
  const textures: Record<string, string> = {};
  for (const img of generation?.model_asset_texture_images || []) {
    const type = img.type;
    if (textures[type]) {
      console.error("duplicate texture type detected in generation", img);
    } else {
      textures[type] = img.url;
    }
  }
  return textures;
};
