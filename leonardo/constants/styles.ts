/**
 * Style Constants
 *
 * Reusable style constants for the application.
 * Matches production bundle module 884197.
 */

// ============================================================================
// Box Shadows
// ============================================================================

export const ACTIVE_BOX_SHADOW =
  '0px 0px 0.938rem 0px rgba(131, 128, 255, 0.30)';
export const FOCUS_BOX_SHADOW = '0 0 0 0.0625rem #9A5CF7';
export const GLOW_BOX_SHADOW = '0px 0px 15px 0px rgba(161, 128, 255, 0.60)';
export const CARD_BOX_SHADOW = '0px 0px 15px 0px rgba(0, 0, 0, 0.4)';

// ============================================================================
// Breakpoints
// ============================================================================

export const BREAKPOINT = {
  sm_next: '36rem',
  md_next: '80rem',
  lg_next: '160rem',
} as const;

// ============================================================================
// Checkered Background
// ============================================================================

export const CHECKERED_BACKGROUND = {
  background:
    'conic-gradient(#2D3445 90deg, transparent 90deg 180deg, #2D3445 180deg 270deg, transparent 270deg), repeating-linear-gradient(to right,#06080D, #0D121C)',
  backgroundSize: '20px 20px, 10px 10px',
} as const;

// ============================================================================
// Colors
// ============================================================================

export const COLORS = {
  DARK_BLUE_950: '#101622',
  ORANGE: '#CE4333',
  PURPLE: '#6B66FF',
} as const;

// ============================================================================
// Gradients
// ============================================================================

export const GRADIENTS = {
  PRIMARY:
    'linear-gradient(81deg, #DB519E 13.83%, #C14DD4 49.5%, #6A6AFB 85.32%)',
  BG_PANEL: 'linear-gradient(90deg, #06080D 0%, #0D121C 100%)',
  BLACK_TRANSPARENT_UP: 'linear-gradient(180deg, black 15%, transparent 100%)',
  BLACK_TRANSPARENT_RIGHT:
    'linear-gradient(90deg, black 15%, transparent 100%)',
  BLACK_TRANSPARENT_DOWN:
    'linear-gradient(0deg, black 15%, transparent 100%)',
  BLACK_TRANSPARENT_LEFT:
    'linear-gradient(270deg, black 15%, transparent 100%)',
  LIGHT_RED_TRANSPARENT_DOWN_RIGHT:
    'linear-gradient(147deg, rgba(248, 98, 105, 0.6), rgba(182, 77, 236, 0) 16%)',
  RED_TRANSPARENT_DOWN_RIGHT:
    'linear-gradient(147deg, rgba(213,80,173, 1), rgba(107, 102, 255, 0) 20%)',
  PURPLE_TRANSPARENT_DOWN_RIGHT:
    'linear-gradient(147deg, rgba(155, 91, 247, 0.8), rgba(155, 91, 247, 0) 20%)',
  BLUE_TRANSPARENT_DOWN_RIGHT:
    'linear-gradient(147deg, rgba(87, 139, 254, 0.6), rgba(87, 139, 254, 0) 20%)',
  GRAY_BLUE_ONE: 'linear-gradient(90deg, #06080D, #0D121C)',
  GRAY_BLUE_TWO: 'linear-gradient(110deg, #020305 2%, #070A0F)',
  GRAY_DISABLED_BUTTON_BG:
    'linear-gradient(0deg, rgba(0, 0, 0, 0.50) 0%, rgba(0, 0, 0, 0.50) 100%), linear-gradient(81deg, #4E4E4E -23.47%, #757575 45.52%, #9A9A9A 114.8%)',
  PURPLE_ONE:
    'linear-gradient(81.02deg, #FA5560 -23.47%, #B14BF4 45.52%, #4D91FF 114.8%)',
  PURPLE_ONE_08:
    'linear-gradient(81.02deg, #FA556014 -23.47%, #B14BF414 45.52%, #4D91FF14 114.8%)',
  PURPLE_TWO: 'linear-gradient(90.04deg, #B14BF4 -7.94%, #4D91FF 110%)',
  PURPLE_THREE:
    'linear-gradient(81deg, rgba(219, 81, 158, 0.25) 13.83%, rgba(177, 75, 244, 0.25) 49.5%, rgba(102, 107, 209, 0.25) 85.32%)',
  DARK_BLUE_ONE: 'linear-gradient(90deg, #06080D 0%, #0D121C 100%)',
  DARK_BLUE_TWO: 'linear-gradient(112deg, #020305 0%, #070A0F 100%)',
  BG_DARK: 'linear-gradient(110.8deg, #020305 0%, #070A0F 100%)',
  DARK_BLUE_SUBTLE_ANGLE:
    'linear-gradient(110deg, #020305 1.82%, #070A0F 100%)',
  PINK_PURPLE_50_50:
    'linear-gradient(81deg, rgba(219, 81, 158, 0.75) 13.83%, rgba(177, 75, 244, 0.75) 49.5%, rgba(102, 107, 209, 0.75) 85.32%)',
  PINK_PURPLE_BRIGHT:
    'linear-gradient(81.24deg, #D951A5 13.83%, #B14BF4 49.5%, #6E7BFC 85.32%)',
  NEW_CARD_BG: 'linear-gradient(90deg, #06080D 0%, #0E141F 100%)',
  DARK_BLUE_BG: 'linear-gradient(110deg, #020305 1.82%, #070A0F 100%)',
  PINK_GRAY_BLUE:
    'linear-gradient(196deg, rgba(17, 23, 34, 0.20) 67.99%, rgba(213, 81, 172, 0.20) 112.93%), linear-gradient(159deg, rgba(17, 23, 35, 0.20) 59.29%, rgba(144, 99, 248, 0.20) 113.57%), #101622',
  USER_SUMMARY_CARD_GRADIENT_STYLE:
    'linear-gradient(109deg, rgba(87, 139, 254, 0.20) -1.93%, rgba(87, 139, 254, 0.00) 29.52%), darkbluealt',
  RED_PURPLE: 'linear-gradient(81deg, #F86269 17.19%, #B14BF4 88.68%)',
} as const;

// ============================================================================
// Path Leonardo Gradient
// ============================================================================

export const PATH_LEONARDO_GRADIENT = {
  '& path': { fill: 'url(#leonardo-gradient-def)' },
} as const;

// ============================================================================
// Border Radius
// ============================================================================

export const BORDER_RADIUS = {
  sm: '0.25rem',
  md: '0.5rem',
  lg: '0.75rem',
  xl: '1rem',
  full: '9999px',
} as const;

// ============================================================================
// Transitions
// ============================================================================

export const TRANSITIONS = {
  fast: '0.15s ease',
  normal: '0.2s ease',
  slow: '0.3s ease',
} as const;

// ============================================================================
// Z-Index
// ============================================================================

export const Z_INDEX = {
  dropdown: 50,
  modal: 100,
  tooltip: 150,
  toast: 200,
} as const;
