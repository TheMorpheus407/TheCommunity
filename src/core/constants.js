/**
 * @fileoverview Core application constants and configuration values.
 * @module core/constants
 */

/**
 * Expected label for the main chat data channel.
 * @constant {string}
 */
export const EXPECTED_CHANNEL_LABEL = 'chat';

/**
 * Label for the control data channel used for remote control features.
 * @constant {string}
 */
export const CONTROL_CHANNEL_LABEL = 'control';

/**
 * Label for the image transfer data channel.
 * @constant {string}
 */
export const IMAGE_CHANNEL_LABEL = 'image';

/**
 * Label for the Pong game data channel.
 * @constant {string}
 */
export const PONG_CHANNEL_LABEL = 'pong';

/**
 * Label for the Trivia quiz game data channel.
 * @constant {string}
 */
export const TRIVIA_CHANNEL_LABEL = 'trivia';

/**
 * Maximum allowed length for a chat message in characters.
 * @constant {number}
 */
export const MAX_MESSAGE_LENGTH = 2000;

/**
 * Maximum number of messages allowed per interval for rate limiting.
 * @constant {number}
 */
export const MAX_MESSAGES_PER_INTERVAL = 30;

/**
 * Time window in milliseconds for rate limiting messages.
 * @constant {number}
 */
export const MESSAGE_INTERVAL_MS = 5000;

/**
 * Maximum number of control messages allowed per interval.
 * @constant {number}
 */
export const CONTROL_MAX_MESSAGES_PER_INTERVAL = 60;

/**
 * Time window in milliseconds for rate limiting control messages.
 * @constant {number}
 */
export const CONTROL_MESSAGE_INTERVAL_MS = 5000;

/**
 * Maximum payload length for control messages in bytes.
 * @constant {number}
 */
export const CONTROL_MAX_PAYLOAD_LENGTH = 2048;

/**
 * Maximum number of text characters that can be inserted via remote control.
 * @constant {number}
 */
export const CONTROL_TEXT_INSERT_LIMIT = 32;

/**
 * Total budget for text insertion via remote control per session.
 * @constant {number}
 */
export const CONTROL_TOTAL_TEXT_BUDGET = 2048;

/**
 * Maximum allowed image size in bytes (5 MB).
 * @constant {number}
 */
export const IMAGE_MAX_SIZE_BYTES = 5 * 1024 * 1024;

/**
 * Size of each chunk when transferring images in bytes (16 KB).
 * @constant {number}
 */
export const IMAGE_CHUNK_SIZE = 16 * 1024;

/**
 * Maximum number of images that can be sent per interval.
 * @constant {number}
 */
export const IMAGE_MAX_PER_INTERVAL = 10;

/**
 * Time window in milliseconds for image rate limiting (1 minute).
 * @constant {number}
 */
export const IMAGE_INTERVAL_MS = 60000;

/**
 * Maximum number of concurrent image transfers allowed.
 * @constant {number}
 */
export const IMAGE_MAX_CONCURRENT = 3;

/**
 * List of allowed MIME types for image transfers.
 * @constant {string[]}
 */
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

/**
 * OpenAI model to use for AI message rewriting.
 * @constant {string}
 */
export const OPENAI_MODEL = 'gpt-4o-mini';

/**
 * Local storage key for theme preference.
 * @constant {string}
 */
export const THEME_STORAGE_KEY = 'thecommunity.theme-preference';

/**
 * Local storage key for AI preference.
 * @constant {string}
 */
export const AI_PREFERENCE_STORAGE_KEY = 'thecommunity.ai-preference';

/**
 * Available theme options.
 * @enum {string}
 */
export const THEME_OPTIONS = {
  LIGHT: 'light',
  DARK: 'dark',
  RGB: 'rgb'
};

/**
 * Sequence of themes when cycling through theme toggle.
 * @constant {string[]}
 */
export const THEME_SEQUENCE = [THEME_OPTIONS.DARK, THEME_OPTIONS.LIGHT, THEME_OPTIONS.RGB];

/**
 * Types of control messages for remote control functionality.
 * @enum {string}
 */
export const CONTROL_MESSAGE_TYPES = {
  POINTER: 'pointer',
  POINTER_VISIBILITY: 'pointer-visibility',
  KEYBOARD: 'keyboard',
  PERMISSION: 'permission',
  ACTION: 'action'
};

/**
 * Gets the next theme value in the rotation sequence.
 * @param {string} currentTheme - The current theme value
 * @returns {string} The next theme in the sequence
 */
export function getNextThemeValue(currentTheme) {
  const index = THEME_SEQUENCE.indexOf(currentTheme);
  return THEME_SEQUENCE[(index + 1) % THEME_SEQUENCE.length];
}
