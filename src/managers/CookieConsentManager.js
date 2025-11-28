/**
 * @fileoverview Manager for cookie consent preferences and GDPR compliance.
 * @module managers/CookieConsentManager
 */

import { COOKIE_CONSENT_STORAGE_KEY, CONSENT_CATEGORIES } from '../core/constants.js';

/**
 * Gets the current cookie consent state from localStorage
 * @returns {Object|null} Consent state object with categories, or null if no consent given
 */
export function getCookieConsent() {
  try {
    const stored = window.localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.warn('Could not read cookie consent from localStorage', error);
  }
  // Return null if no consent has been given yet
  return null;
}

/**
 * Saves cookie consent preferences to localStorage
 * @param {Object} consent - Consent state object
 */
export function saveCookieConsent(consent) {
  try {
    window.localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, JSON.stringify(consent));
  } catch (error) {
    console.warn('Could not save cookie consent to localStorage', error);
  }
}

/**
 * Checks if a specific consent category is allowed
 * @param {string} category - Category to check
 * @returns {boolean} True if category is consented or essential
 */
export function hasConsentFor(category) {
  // Essential is always allowed
  if (category === CONSENT_CATEGORIES.ESSENTIAL) {
    return true;
  }

  const consent = getCookieConsent();
  // If no consent given yet, return false (show banner)
  if (!consent) {
    return false;
  }

  return consent[category] === true;
}

/**
 * Creates a default consent object with all categories set to a value
 * @param {boolean} value - Default value for all categories
 * @returns {Object} Consent object with timestamp
 */
export function createConsentObject(value) {
  return {
    [CONSENT_CATEGORIES.ESSENTIAL]: true, // Always true
    [CONSENT_CATEGORIES.PREFERENCES]: value,
    [CONSENT_CATEGORIES.STATISTICS]: value,
    [CONSENT_CATEGORIES.EASTER_EGG]: value,
    [CONSENT_CATEGORIES.AI_PREFERENCE]: value,
    timestamp: Date.now()
  };
}
