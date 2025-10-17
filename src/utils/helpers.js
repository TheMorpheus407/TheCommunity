/**
 * @fileoverview Utility helper functions.
 * @module utils/helpers
 */

import { THEME_STORAGE_KEY, THEME_OPTIONS } from '../core/constants.js';

/**
 * Determines the initial theme, preferring stored settings, then system preference.
 * @returns {{theme: ('light'|'dark'|'rgb'), isStored: boolean}} Theme info object
 */
export function resolveInitialTheme() {
  if (typeof window === 'undefined') {
    return { theme: THEME_OPTIONS.DARK, isStored: false };
  }
  try {
    const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (storedTheme === THEME_OPTIONS.LIGHT || storedTheme === THEME_OPTIONS.DARK || storedTheme === THEME_OPTIONS.RGB) {
      if (typeof document !== 'undefined') {
        document.documentElement.dataset.theme = storedTheme;
      }
      return { theme: storedTheme, isStored: true };
    }
  } catch (error) {
    console.warn('Theme preference could not be read from storage.', error);
  }
  const prefersDark = typeof window.matchMedia === 'function'
    && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const detectedTheme = prefersDark ? THEME_OPTIONS.DARK : THEME_OPTIONS.LIGHT;
  if (typeof document !== 'undefined') {
    document.documentElement.dataset.theme = detectedTheme;
  }
  return { theme: detectedTheme, isStored: false };
}
