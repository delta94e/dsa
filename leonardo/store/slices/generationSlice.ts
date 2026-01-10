import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// ============================================================================
// Types
// ============================================================================

/**
 * Model architecture enum (matches backend sdVersion values)
 */
export type ModelArchitecture =
  | 'FLUX_DEV_2_0'
  | 'FLUX_PRO_2_0'
  | 'FLUX_OMNI'
  | 'FLUX_MAX'
  | 'GPT_IMAGE_1'
  | 'GEMINI_2_5_FLASH'
  | 'GEMINI_IMAGE_2'
  | 'SEEDREAM_4_0'
  | 'SEEDREAM_4_5'
  | 'SD_1_5'
  | 'SD_2_1'
  | 'SDXL'
  | 'PHOENIX'
  | 'KINO'
  | 'CUSTOM';

/**
 * Model info for a specific model
 */
export interface ModelInfo {
  id: string;
  name: string;
  sdVersion: ModelArchitecture;
  description?: string;
  image?: string;
  isDefault?: boolean;
  isCustom?: boolean;
  createdAt?: string;
}

/**
 * Image input for generation
 */
export interface ImageInput {
  id: string;
  url: string;
  type: 'image_guidance' | 'start_frame' | 'reference';
  strength?: number;
  dimensions?: {
    width: number;
    height: number;
  };
}

/**
 * Generation state interface
 */
export interface GenerationState {
  /** Model info map keyed by model ID */
  modelInfo: {
    modelInfoMap: Record<string, ModelInfo>;
    loading: boolean;
  };
  /** Currently selected model ID */
  selectedModelId: string | null;
  /** Number of images currently being uploaded */
  imagesUploadingCount: number;
  /** Current image inputs */
  imageInputs: ImageInput[];
}

// ============================================================================
// Mock Model Data
// ============================================================================

const MOCK_MODELS: Record<string, ModelInfo> = {
  'flux-dev-2-0': {
    id: 'flux-dev-2-0',
    name: 'FLUX.2 Dev',
    sdVersion: 'FLUX_DEV_2_0',
    image: 'https://cdn.leonardo.ai/static/images/omni-prompt/flux-dev-2-0.webp',
  },
  'flux-pro-2-0': {
    id: 'flux-pro-2-0',
    name: 'FLUX.2 Pro',
    sdVersion: 'FLUX_PRO_2_0',
    image: 'https://cdn.leonardo.ai/static/images/omni-prompt/flux-pro-2-0.webp',
  },
  'flux-omni': {
    id: 'flux-omni',
    name: 'FLUX.1 Kontext',
    sdVersion: 'FLUX_OMNI',
    image: 'https://cdn.leonardo.ai/static/images/omni-prompt/flux-kontext-pro.webp',
  },
  'flux-max': {
    id: 'flux-max',
    name: 'FLUX.1 Kontext Max',
    sdVersion: 'FLUX_MAX',
    image: 'https://cdn.leonardo.ai/static/images/omni-prompt/flux-kontext-max.webp',
  },
  'gpt-image-1': {
    id: 'gpt-image-1',
    name: 'GPT Image-1',
    sdVersion: 'GPT_IMAGE_1',
    image: 'https://cdn.leonardo.ai/static/images/omni-prompt/gpt-1.webp',
  },
  'gemini-2-5-flash': {
    id: 'gemini-2-5-flash',
    name: 'Nano Banana',
    sdVersion: 'GEMINI_2_5_FLASH',
    image: 'https://cdn.leonardo.ai/static/images/omni-prompt/gemini-2-5-flash.webp',
    isDefault: true,
  },
  'gemini-image-2': {
    id: 'gemini-image-2',
    name: 'Nano Banana Pro',
    sdVersion: 'GEMINI_IMAGE_2',
    image: 'https://cdn.leonardo.ai/static/images/omni-prompt/gemini_image_2.webp',
  },
  'seedream-4-0': {
    id: 'seedream-4-0',
    name: 'Seedream 4.0',
    sdVersion: 'SEEDREAM_4_0',
    image: 'https://cdn.leonardo.ai/static/images/video/models/seedream_4_0.webp',
  },
  'seedream-4-5': {
    id: 'seedream-4-5',
    name: 'Seedream 4.5',
    sdVersion: 'SEEDREAM_4_5',
    image: 'https://cdn.leonardo.ai/preset_assets/thumbnails/9006ed45-40fa-4210-9aaf-99481fc95488/thumbnail-711b.webp',
  },
};

// ============================================================================
// Initial State
// ============================================================================

const initialState: GenerationState = {
  modelInfo: {
    modelInfoMap: MOCK_MODELS,
    loading: false,
  },
  selectedModelId: 'gemini-2-5-flash',
  imagesUploadingCount: 0,
  imageInputs: [],
};

// ============================================================================
// Slice
// ============================================================================

export const generationSlice = createSlice({
  name: 'generation',
  initialState,
  reducers: {
    setModelInfoMap: (state, action: PayloadAction<Record<string, ModelInfo>>) => {
      state.modelInfo.modelInfoMap = action.payload;
    },
    setModelInfoLoading: (state, action: PayloadAction<boolean>) => {
      state.modelInfo.loading = action.payload;
    },
    setSelectedModelId: (state, action: PayloadAction<string | null>) => {
      state.selectedModelId = action.payload;
    },
    setImagesUploadingCount: (state, action: PayloadAction<number>) => {
      state.imagesUploadingCount = action.payload;
    },
    incrementImagesUploadingCount: (state) => {
      state.imagesUploadingCount += 1;
    },
    decrementImagesUploadingCount: (state) => {
      state.imagesUploadingCount = Math.max(0, state.imagesUploadingCount - 1);
    },
    addImageInput: (state, action: PayloadAction<ImageInput>) => {
      state.imageInputs.push(action.payload);
    },
    removeImageInput: (state, action: PayloadAction<string>) => {
      state.imageInputs = state.imageInputs.filter((i) => i.id !== action.payload);
    },
    clearImageInputs: (state) => {
      state.imageInputs = [];
    },
    setImageInputs: (state, action: PayloadAction<ImageInput[]>) => {
      state.imageInputs = action.payload;
    },
  },
});

// ============================================================================
// Actions
// ============================================================================

export const {
  setModelInfoMap,
  setModelInfoLoading,
  setSelectedModelId,
  setImagesUploadingCount,
  incrementImagesUploadingCount,
  decrementImagesUploadingCount,
  addImageInput,
  removeImageInput,
  clearImageInputs,
  setImageInputs,
} = generationSlice.actions;

export default generationSlice.reducer;
