/**
 * Generation Styles
 * 
 * All generation style constants for Leonardo.ai
 */

// ============================================================================
// Generation Style Types
// ============================================================================

export const GENERATION_STYLE = {
    NONE: 'NONE',
    LEONARDO: 'LEONARDO',
    GENERAL: 'GENERAL',
    ANALOG_FILM: 'ANALOG_FILM',
    ANIME: 'ANIME',
    BOKEH: 'BOKEH',
    CINEMATIC: 'CINEMATIC',
    CINEMATIC_CLOSEUP: 'CINEMATIC_CLOSEUP',
    COMIC_BOOK: 'COMIC_BOOK',
    CREATIVE: 'CREATIVE',
    CREATIVE_CLOSEUP: 'CREATIVE_CLOSEUP',
    DIGITAL_ART: 'DIGITAL_ART',
    DYNAMIC: 'DYNAMIC',
    ENVIRONMENT: 'ENVIRONMENT',
    FANTASY_ART: 'FANTASY_ART',
    FASHION: 'FASHION',
    FILM: 'FILM',
    FOOD: 'FOOD',
    HDR: 'HDR',
    ILLUSTRATION: 'ILLUSTRATION',
    ISOMETRIC: 'ISOMETRIC',
    LINE_ART: 'LINE_ART',
    LONG_EXPOSURE: 'LONG_EXPOSURE',
    LOW_POLY: 'LOW_POLY',
    MACRO: 'MACRO',
    MINIMALIST: 'MINIMALIST',
    MODELING_COMPOUND: 'MODELING_COMPOUND',
    MONOCHROME: 'MONOCHROME',
    MOODY: 'MOODY',
    NEON_PUNK: 'NEON_PUNK',
    NEUTRAL: 'NEUTRAL',
    ORIGAMI: 'ORIGAMI',
    PHOTOGRAPHY: 'PHOTOGRAPHY',
    PHOTOREALISTIC: 'PHOTOREALISTIC',
    PIXEL_ART: 'PIXEL_ART',
    PORTRAIT: 'PORTRAIT',
    RAYTRACED: 'RAYTRACED',
    RETRO: 'RETRO',
    RENDER_3D: 'RENDER_3D',
    SKETCH_BW: 'SKETCH_BW',
    SKETCH_COLOR: 'SKETCH_COLOR',
    STOCK_PHOTO: 'STOCK_PHOTO',
    TILE_TEXTURE: 'TILE_TEXTURE',
    UNPROCESSED: 'UNPROCESSED',
    VIBRANT: 'VIBRANT',
    VIBRANT_CLOSEUP: 'VIBRANT_CLOSEUP',
} as const;

export type GenerationStyleType = (typeof GENERATION_STYLE)[keyof typeof GENERATION_STYLE];

// ============================================================================
// Generation Style Names (Display)
// ============================================================================

export const GENERATION_STYLE_NAME: Record<GenerationStyleType, string> = {
    [GENERATION_STYLE.NONE]: 'None',
    [GENERATION_STYLE.LEONARDO]: 'Leonardo Style',
    [GENERATION_STYLE.GENERAL]: 'General',
    [GENERATION_STYLE.ANALOG_FILM]: 'Analog Film',
    [GENERATION_STYLE.ANIME]: 'Anime',
    [GENERATION_STYLE.BOKEH]: 'Bokeh',
    [GENERATION_STYLE.CINEMATIC]: 'Cinematic',
    [GENERATION_STYLE.CINEMATIC_CLOSEUP]: 'Cinematic (Close-Up)',
    [GENERATION_STYLE.COMIC_BOOK]: 'Comic Book',
    [GENERATION_STYLE.CREATIVE]: 'Creative',
    [GENERATION_STYLE.CREATIVE_CLOSEUP]: 'Creative (Close-Up)',
    [GENERATION_STYLE.DIGITAL_ART]: 'Digital Art',
    [GENERATION_STYLE.DYNAMIC]: 'Dynamic',
    [GENERATION_STYLE.ENVIRONMENT]: 'Environment',
    [GENERATION_STYLE.FANTASY_ART]: 'Fantasy Art',
    [GENERATION_STYLE.FASHION]: 'Fashion',
    [GENERATION_STYLE.FILM]: 'Film',
    [GENERATION_STYLE.FOOD]: 'Food',
    [GENERATION_STYLE.HDR]: 'HDR',
    [GENERATION_STYLE.ILLUSTRATION]: 'Illustration',
    [GENERATION_STYLE.ISOMETRIC]: 'Isometric',
    [GENERATION_STYLE.LINE_ART]: 'Line Art',
    [GENERATION_STYLE.LONG_EXPOSURE]: 'Long Exposure',
    [GENERATION_STYLE.LOW_POLY]: 'Low Poly',
    [GENERATION_STYLE.MACRO]: 'Macro',
    [GENERATION_STYLE.MINIMALIST]: 'Minimalist',
    [GENERATION_STYLE.MODELING_COMPOUND]: 'Modeling Compound',
    [GENERATION_STYLE.MONOCHROME]: 'Monochrome',
    [GENERATION_STYLE.MOODY]: 'Moody',
    [GENERATION_STYLE.NEON_PUNK]: 'Neon Punk',
    [GENERATION_STYLE.NEUTRAL]: 'Neutral',
    [GENERATION_STYLE.ORIGAMI]: 'Origami',
    [GENERATION_STYLE.PHOTOGRAPHY]: 'Photography',
    [GENERATION_STYLE.PHOTOREALISTIC]: 'Photorealistic',
    [GENERATION_STYLE.PIXEL_ART]: 'Pixel Art',
    [GENERATION_STYLE.PORTRAIT]: 'Portrait',
    [GENERATION_STYLE.RAYTRACED]: 'Raytraced',
    [GENERATION_STYLE.RETRO]: 'Retro',
    [GENERATION_STYLE.RENDER_3D]: '3D Render',
    [GENERATION_STYLE.SKETCH_BW]: 'Sketch B/W',
    [GENERATION_STYLE.SKETCH_COLOR]: 'Sketch Color',
    [GENERATION_STYLE.STOCK_PHOTO]: 'Stock Photo',
    [GENERATION_STYLE.TILE_TEXTURE]: 'Tile Texture',
    [GENERATION_STYLE.UNPROCESSED]: 'Unprocessed',
    [GENERATION_STYLE.VIBRANT]: 'Vibrant',
    [GENERATION_STYLE.VIBRANT_CLOSEUP]: 'Vibrant (Close-Up)',
};

// ============================================================================
// Default Styles
// ============================================================================

export const DEFAULT_ALCHEMY_STYLE = GENERATION_STYLE.DYNAMIC;
export const DEFAULT_PHOTOREAL_STYLE = GENERATION_STYLE.CINEMATIC;

// ============================================================================
// Prompt Magic Version
// ============================================================================

export const PROMPT_MAGIC_VERSION = {
    v1: 'v1',
    v2: 'v2',
    v3: 'v3',
} as const;

// ============================================================================
// Generation Types
// ============================================================================

export const GENERATION_TYPE = {
    PROMPT: 'prompt',
    IMAGE: 'image',
    MODEL: 'model',
    VARIATION: 'variation',
    TEXTURE: 'texture',
    VIDEO: 'video',
    BLUEPRINT: 'blueprint',
} as const;

// ============================================================================
// Selected Generation Type
// ============================================================================

export const SELECTED_GENERATION_TYPE = {
    ONLY_IMAGES: 'onlyImages',
    ONLY_VIDEOS: 'onlyVideos',
    MIXED: 'mixed',
} as const;

// ============================================================================
// Image Select Values
// ============================================================================

export const IMAGE_SELECT_VALUES = {
    ORIGINAL: 'original',
    NO_BG: 'transparent',
    UNZOOMED: 'unzoom',
    DEFAULT_UPSCALED: 'upscaled',
    ALTERNATE_UPSCALED: 'alternateUpscaled',
    HD_UPSCALED: 'hdUpscaled',
    SMOOTH_UPSCALED: 'smoothUpscaled',
    ALCHEMY_REFINER: 'alchemyRefiner',
    UNIVERSAL_UPSCALE: 'universalUpscale',
    ULTRA_UPSCALE: 'ultraUpscale',
    INITIAL_NO_BG: 'transparent-0',
    INITIAL_UNZOOM: 'unzoom-0',
    INITIAL_DEFAULT_UPSCALED: 'upscaled-0',
    INITIAL_ALTERNATE_UPSCALED: 'alternateUpscaled-0',
    INITIAL_HD_UPSCALED: 'hdUpscaled-0',
    INITIAL_SMOOTH_UPSCALED: 'smoothUpscaled-0',
    INITIAL_ALCHEMY_REFINER: 'alchemyRefiner-0',
    INITIAL_UNIVERSAL_UPSCALE: 'universalUpscale-0',
    INITIAL_ULTRA_UPSCALE: 'ultraUpscale-0',
    VIDEO_UPSCALED: 'videoUpscaled',
} as const;

// ============================================================================
// Token Costs
// ============================================================================

export const TOKEN_COSTS = {
    NOBG: 2,
    MOTION: 25,
    TEXTURE_FULL: 50,
    TEXTURE_PREVIEW: 5,
    UNZOOM: 5,
    UPSCALE: 5,
    UPSCALE_ALCHEMY: 10,
    UPSCALE_ALTERNATIVE: 5,
    UPSCALE_CREATIVE: 10,
    UPSCALE_CRISP: 5,
    UPSCALE_REFINER: 10,
    UPSCALE_SMOOTH: 5,
} as const;

// ============================================================================
// Panel Thumbnail Status
// ============================================================================

export const PANEL_THUMBNAIL_CARD_STATUS = {
    AVAILABLE: 'available',
    PREVIEW: 'preview',
    COMING_SOON: 'comingSoon',
} as const;
