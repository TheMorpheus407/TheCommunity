/**
 * @fileoverview Centralized localStorage management with error handling.
 * @module managers/StorageManager
 */

/**
 * Safely gets an item from localStorage
 * @param {string} key - The storage key
 * @param {*} defaultValue - Default value if key doesn't exist or error occurs
 * @returns {*} The stored value or default value
 */
export function getItem(key, defaultValue = null) {
  try {
    const value = window.localStorage.getItem(key);
    return value !== null ? value : defaultValue;
  } catch (error) {
    console.warn(`Could not read from localStorage (key: ${key})`, error);
    return defaultValue;
  }
}

/**
 * Safely gets and parses a JSON item from localStorage
 * @param {string} key - The storage key
 * @param {*} defaultValue - Default value if key doesn't exist or error occurs
 * @returns {*} The parsed value or default value
 */
export function getJsonItem(key, defaultValue = null) {
  try {
    const value = window.localStorage.getItem(key);
    if (value !== null) {
      return JSON.parse(value);
    }
    return defaultValue;
  } catch (error) {
    console.warn(`Could not read/parse JSON from localStorage (key: ${key})`, error);
    return defaultValue;
  }
}

/**
 * Safely sets an item in localStorage
 * @param {string} key - The storage key
 * @param {string} value - The value to store
 * @returns {boolean} True if successful, false otherwise
 */
export function setItem(key, value) {
  try {
    window.localStorage.setItem(key, value);
    return true;
  } catch (error) {
    console.warn(`Could not write to localStorage (key: ${key})`, error);
    return false;
  }
}

/**
 * Safely sets a JSON item in localStorage
 * @param {string} key - The storage key
 * @param {*} value - The value to stringify and store
 * @returns {boolean} True if successful, false otherwise
 */
export function setJsonItem(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.warn(`Could not write JSON to localStorage (key: ${key})`, error);
    return false;
  }
}

/**
 * Safely removes an item from localStorage
 * @param {string} key - The storage key
 * @returns {boolean} True if successful, false otherwise
 */
export function removeItem(key) {
  try {
    window.localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.warn(`Could not remove from localStorage (key: ${key})`, error);
    return false;
  }
}

/**
 * Safely clears all items from localStorage
 * @returns {boolean} True if successful, false otherwise
 */
export function clear() {
  try {
    window.localStorage.clear();
    return true;
  } catch (error) {
    console.warn('Could not clear localStorage', error);
    return false;
  }
}

/**
 * Gets an item from localStorage with a time-to-live (TTL) check
 * @param {string} key - The storage key
 * @param {number} ttlMs - Time to live in milliseconds
 * @param {*} defaultValue - Default value if expired or doesn't exist
 * @returns {*} The stored value or default value if expired
 */
export function getItemWithTTL(key, ttlMs, defaultValue = null) {
  try {
    const stored = window.localStorage.getItem(key);
    if (!stored) {
      return defaultValue;
    }

    const { value, timestamp } = JSON.parse(stored);
    const now = Date.now();

    if (now - timestamp > ttlMs) {
      // Expired, remove it
      window.localStorage.removeItem(key);
      return defaultValue;
    }

    return value;
  } catch (error) {
    console.warn(`Could not read TTL item from localStorage (key: ${key})`, error);
    return defaultValue;
  }
}

/**
 * Sets an item in localStorage with a timestamp for TTL checking
 * @param {string} key - The storage key
 * @param {*} value - The value to store
 * @returns {boolean} True if successful, false otherwise
 */
export function setItemWithTTL(key, value) {
  try {
    const data = {
      value,
      timestamp: Date.now()
    };
    window.localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.warn(`Could not write TTL item to localStorage (key: ${key})`, error);
    return false;
  }
}
