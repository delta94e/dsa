/**
 * Style Presets for HomePromptBox
 *
 * Defines style presets for image generation.
 */

export interface StylePreset {
  id: string;
  label: string;
  order: number;
}

/**
 * Default style ID (Dynamic)
 */
export const AUTO_PRESET_DEFAULT_STYLE_ID = "111dc692-d470-4eec-b791-3475abac4c46";

/**
 * Available style presets
 */
export const STYLE_PRESETS: StylePreset[] = [
  {
    id: "a5632c7c-ddbb-4e2f-ba34-8456ab3ac436",
    label: "Cinematic",
    order: 1,
  },
  {
    id: "6fedbf1f-4a17-45ec-84fb-92fe524a29ef",
    label: "Creative",
    order: 2,
  },
  {
    id: AUTO_PRESET_DEFAULT_STYLE_ID,
    label: "Dynamic",
    order: 3,
  },
  {
    id: "06247526-0f79-4235-919c-3ca934509f46",
    label: "Fashion",
    order: 4,
  },
  {
    id: "ab5a4220-7c42-41e5-a578-eddb9fed3d75",
    label: "Portrait",
    order: 5,
  },
  {
    id: "5bdc3f2a-1be6-4d1c-8e77-992a30824a2c",
    label: "Stock Photo",
    order: 6,
  },
  {
    id: "dee282d3-891f-4f73-ba02-7f8131e5541b",
    label: "Vibrant",
    order: 7,
  },
  {
    id: "1f2fdbba-4259-4dec-acee-6cad506d7b30",
    label: "None",
    order: 8,
  },
];

/**
 * All style IDs for validation
 */
export const STYLE_PRESET_IDS = STYLE_PRESETS.map((s) => s.id);

/**
 * Get style label by ID
 */
export function getStyleLabelById(styleId: string): string {
  return STYLE_PRESETS.find((s) => s.id === styleId)?.label ?? styleId;
}
