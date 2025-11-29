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
 * Label for the Flappy Bird game data channel.
 * @constant {string}
 */
export const FLAPPYBIRD_CHANNEL_LABEL = 'flappybird';

/**
 * Label for the Chess game data channel.
 * @constant {string}
 */
export const CHESS_CHANNEL_LABEL = 'chess';

/**
 * Label for the Doom game data channel.
 * @constant {string}
 */
export const DOOM_CHANNEL_LABEL = 'doom';

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
 * Label for the general file transfer data channel.
 * @constant {string}
 */
export const FILE_CHANNEL_LABEL = 'file';

/**
 * Maximum allowed file size in bytes (50 MB for videos, 10 MB for documents).
 * @constant {number}
 */
export const FILE_MAX_SIZE_BYTES = 50 * 1024 * 1024;

/**
 * Size of each chunk when transferring files in bytes (32 KB for larger files).
 * @constant {number}
 */
export const FILE_CHUNK_SIZE = 32 * 1024;

/**
 * Maximum number of files that can be sent per interval.
 * @constant {number}
 */
export const FILE_MAX_PER_INTERVAL = 5;

/**
 * Time window in milliseconds for file rate limiting (1 minute).
 * @constant {number}
 */
export const FILE_INTERVAL_MS = 60000;

/**
 * Maximum number of concurrent file transfers allowed.
 * @constant {number}
 */
export const FILE_MAX_CONCURRENT = 2;

/**
 * List of allowed MIME types for video transfers.
 * @constant {string[]}
 */
export const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/ogg'];

/**
 * List of allowed MIME types for document transfers.
 * @constant {string[]}
 */
export const ALLOWED_DOCUMENT_TYPES = ['application/pdf', 'text/plain', 'text/markdown'];

/**
 * Combined list of all allowed file types for file transfers.
 * @constant {string[]}
 */
export const ALLOWED_FILE_TYPES = [
  ...ALLOWED_IMAGE_TYPES,
  ...ALLOWED_VIDEO_TYPES,
  ...ALLOWED_DOCUMENT_TYPES
];

/**
 * OpenAI model to use for AI message rewriting.
 * @constant {string}
 */
export const OPENAI_MODEL = 'gpt-4o-mini';

/**
 * Default Ollama model to use for AI message rewriting.
 * @constant {string}
 */
export const OLLAMA_MODEL = 'llama3.2';

/**
 * Mistral AI model to use for AI message rewriting.
 * @constant {string}
 */
export const MISTRAL_MODEL = 'mistral-small-latest';

/**
 * Anthropic Claude model to use for AI message rewriting.
 * @constant {string}
 */
export const ANTHROPIC_MODEL = 'claude-3-5-haiku-20241022';

/**
 * Default Ollama endpoint URL.
 * @constant {string}
 */
export const OLLAMA_DEFAULT_ENDPOINT = 'http://localhost:11434';

/**
 * Available AI provider options.
 * @enum {string}
 */
export const AI_PROVIDERS = {
  OPENAI: 'openai',
  OLLAMA: 'ollama',
  MISTRAL: 'mistral',
  ANTHROPIC: 'anthropic'
};

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
 * Local storage key for AI provider selection.
 * @constant {string}
 */
export const AI_PROVIDER_STORAGE_KEY = 'thecommunity.ai-provider';

/**
 * Local storage key for cookie consent preferences.
 * @constant {string}
 */
export const COOKIE_CONSENT_STORAGE_KEY = 'thecommunity.cookie-consent';

/**
 * Local storage key for Whisper model selection.
 * @constant {string}
 */
export const WHISPER_MODEL_STORAGE_KEY = 'thecommunity.whisper-model';

/**
 * Local storage key for Franconia intro seen status.
 * @constant {string}
 */
export const FRANCONIA_INTRO_SEEN_KEY = 'thecommunity.franconia-intro-seen';

/**
 * Available theme options.
 * @enum {string}
 */
export const THEME_OPTIONS = {
  LIGHT: 'light',
  DARK: 'dark',
  RGB: 'rgb',
  CAT: 'cat'
};

/**
 * Sequence of themes when cycling through theme toggle.
 * @constant {string[]}
 */
export const THEME_SEQUENCE = [THEME_OPTIONS.DARK, THEME_OPTIONS.LIGHT, THEME_OPTIONS.RGB, THEME_OPTIONS.CAT];

/**
 * Local storage key for cat mode audio settings.
 * @constant {string}
 */
export const CAT_AUDIO_STORAGE_KEY = 'thecommunity.cat-audio-settings';

/**
 * Default cat mode audio settings.
 * @constant {Object}
 */
export const DEFAULT_CAT_AUDIO_SETTINGS = {
  enabled: false,
  musicEnabled: false,
  sfxEnabled: false,
  volume: 50
};

/**
 * Available Whisper models for speech recognition.
 * @enum {string}
 */
export const WHISPER_MODELS = {
  TINY_EN: 'Xenova/whisper-tiny.en',
  BASE: 'Xenova/whisper-base'
};

/**
 * Default Whisper model to use.
 * @constant {string}
 */
export const DEFAULT_WHISPER_MODEL = WHISPER_MODELS.TINY_EN;

/**
 * Cookie consent categories.
 * @enum {string}
 */
export const CONSENT_CATEGORIES = {
  ESSENTIAL: 'essential',
  PREFERENCES: 'preferences',
  STATISTICS: 'statistics',
  EASTER_EGG: 'easterEgg',
  AI_PREFERENCE: 'aiPreference'
};

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
