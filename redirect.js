/**
 * Easter egg: 10% redirect logic with cookie persistence
 *
 * On first visit, there's a 10% chance the user gets redirected.
 * Once redirected, a cookie is set to ensure they always get redirected on future visits.
 * This prevents users from bypassing the easter egg by refreshing.
 *
 * NOTE: This easter egg respects cookie consent. It only sets cookies if the user
 * has consented to the "easterEgg" category.
 */
(function() {
  'use strict';

  const REDIRECT_URL = 'higgs_analysis.html';
  const COOKIE_NAME = 'higgs_redirect';
  const COOKIE_VALUE = '1';
  const COOKIE_EXPIRY_DAYS = 365; // Cookie persists for 1 year
  const REDIRECT_PROBABILITY = 0.1; // 10% chance
  const COOKIE_CONSENT_STORAGE_KEY = 'thecommunity.cookie-consent';

  /**
   * Checks if user has consented to Easter egg cookies
   * @returns {boolean} True if consent given or no consent system active
   */
  function hasEasterEggConsent() {
    try {
      const consentData = window.localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY);
      if (!consentData) {
        // No consent data yet - assume no consent (banner will show)
        return false;
      }
      const consent = JSON.parse(consentData);
      return consent.easterEgg === true;
    } catch (error) {
      console.warn('Could not read cookie consent', error);
      // If we can't read consent, don't use cookies
      return false;
    }
  }

  /**
   * Gets a cookie value by name
   * @param {string} name - Cookie name
   * @returns {string|null} Cookie value or null if not found
   */
  function getCookie(name) {
    const nameEQ = name + '=';
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      let cookie = cookies[i].trim();
      if (cookie.indexOf(nameEQ) === 0) {
        return cookie.substring(nameEQ.length);
      }
    }
    return null;
  }

  /**
   * Sets a cookie with expiration (only if consent given)
   * @param {string} name - Cookie name
   * @param {string} value - Cookie value
   * @param {number} days - Days until expiration
   */
  function setCookie(name, value, days) {
    if (!hasEasterEggConsent()) {
      console.log('[Easter Egg] Cookie consent not given, skipping cookie');
      return;
    }
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = 'expires=' + date.toUTCString();
    document.cookie = name + '=' + value + ';' + expires + ';path=/;SameSite=Strict';
  }

  /**
   * Checks if redirect should happen and performs it
   */
  function checkAndRedirect() {
    // Skip redirect if noredirect parameter is present (for testing)
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('noredirect')) {
      return;
    }

    // Only proceed with Easter egg if consent given
    if (!hasEasterEggConsent()) {
      return;
    }

    // Check if user has been redirected before
    const hasBeenRedirected = getCookie(COOKIE_NAME) === COOKIE_VALUE;

    if (hasBeenRedirected) {
      // User has been redirected before, redirect them again
      window.location.href = REDIRECT_URL;
      return;
    }

    // First time visitor - roll the dice
    const shouldRedirect = Math.random() < REDIRECT_PROBABILITY;

    if (shouldRedirect) {
      // Set the cookie to remember this choice
      setCookie(COOKIE_NAME, COOKIE_VALUE, COOKIE_EXPIRY_DAYS);
      // Redirect the user
      window.location.href = REDIRECT_URL;
    }
  }

  // Execute the redirect check immediately
  checkAndRedirect();
})();
