/**
 * Team Image Model Overrides
 * 
 * Model override configurations for team features
 */

export const TEAM_IMAGE_MODEL_OVERRIDES = {
    GPT_IMAGE_1: {
        name: 'GPT-Image-1 and GPT-Image-1.5',
        description: 'GPT-Image-1 is a new state of the art image generation model by Open AI.',
        imageUrl: '/img/teams/gpt-image-1-model-override-image.webp',
        type: 'image',
    },
    IDEOGRAM_3: {
        name: 'Ideogram 3',
        description: 'Designed for accurate text rendering and polished, consistent image generation. Great for design and professional creative work.',
        imageUrl: '/img/teams/ideogram-3-model-override-image.webp',
        type: 'image',
    },
    GEMINI_2_5_FLASH: {
        name: 'Nano Banana',
        description: 'Fast model for fun visuals with precise, context-aware edits.',
        imageUrl: '/img/teams/gemini-2-5-flash-model-override-image.webp',
        type: 'image',
    },
    GEMINI_IMAGE_2: {
        name: 'Nano Banana Pro',
        description: 'Nano Banana Pro is a new state of the art image generation model.',
        imageUrl: 'https://cdn.leonardo.ai/static/images/video/models/gemini_image_2.webp',
        type: 'image',
    },
    SEEDREAM_4_0: {
        name: 'Seedream 4.0',
        description: 'Ultra-high 4K generation with artistic style and multi-output exploration.',
        imageUrl: 'https://cdn.leonardo.ai/static/images/video/models/seedream_4_0.webp',
        type: 'image',
    },
    SEEDREAM_4_5: {
        name: 'Seedream 4.5',
        description: 'Best for posters, logos, and text-heavy designs.',
        imageUrl: 'https://cdn.leonardo.ai/preset_assets/thumbnails/9006ed45-40fa-4210-9aaf-99481fc95488/thumbnail-711b.webp',
        type: 'image',
    },
    FLUX_MAX: {
        name: 'Flux Kontext Max',
        description: 'An enhanced Flux.1 Kontext, built for maximum quality output.',
        imageUrl: 'https://cdn.leonardo.ai/static/images/teams/flux-kontext-max.webp',
        type: 'image',
        flagName: 'modelMatrixImageModelsList',
    },
    FLUX_DEV_2_0: {
        name: 'FLUX.2 Dev',
        description: 'Exceptional image reference, structured & JSON prompting capabilities.',
        imageUrl: 'https://cdn.leonardo.ai/static/images/teams/flux-dev-2-0.webp',
        type: 'image',
    },
    FLUX_PRO_2_0: {
        name: 'FLUX.2 Pro',
        description: 'High-fidelity generation and editing capabilities with advanced prompt adherence.',
        imageUrl: 'https://cdn.leonardo.ai/static/images/teams/flux-pro-2-0.webp',
        type: 'image',
    },
} as const;

export type TeamImageModelOverrideKey = keyof typeof TEAM_IMAGE_MODEL_OVERRIDES;
