/**
 * Session Utilities
 * 
 * Utility functions for managing session storage data.
 * Matches production bundle module 224490.
 */

// ============================================================================
// UTM Parameters
// ============================================================================

const UTM_PARAMS_KEY = 'utm_params';

/**
 * UTM parameter keys stored in session
 */
export const UTM_PARAM_KEYS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
] as const;

export type UtmParamKey = typeof UTM_PARAM_KEYS[number];

export interface UtmParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
}

/**
 * Clear UTM parameters from session storage
 */
export function clearUtmParamsFromSession(): void {
  if (typeof window === 'undefined') return;
  
  try {
    sessionStorage.removeItem(UTM_PARAMS_KEY);
  } catch (error) {
    console.warn('Failed to clear UTM params from session:', error);
  }
}

/**
 * Get UTM parameters from session storage
 */
export function getUtmParamsFromSession(): UtmParams | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const stored = sessionStorage.getItem(UTM_PARAMS_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.warn('Failed to get UTM params from session:', error);
    return null;
  }
}

/**
 * Save UTM parameters to session storage
 */
export function saveUtmParamsToSession(params: UtmParams): void {
  if (typeof window === 'undefined') return;
  
  try {
    sessionStorage.setItem(UTM_PARAMS_KEY, JSON.stringify(params));
  } catch (error) {
    console.warn('Failed to save UTM params to session:', error);
  }
}

/**
 * Extract UTM parameters from URL search params
 */
export function extractUtmParamsFromUrl(searchParams: URLSearchParams): UtmParams {
  const params: UtmParams = {};
  
  for (const key of UTM_PARAM_KEYS) {
    const value = searchParams.get(key);
    if (value) {
      params[key] = value;
    }
  }
  
  return params;
}
