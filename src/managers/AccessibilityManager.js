/**
 * @fileoverview Accessibility Manager - Handles Text-to-Speech and accessibility features
 * @module managers/AccessibilityManager
 */

/**
 * Creates and manages accessibility features including Text-to-Speech (TTS)
 * @param {Object} config - Configuration object
 * @param {string} [config.defaultLang='en-US'] - Default language for TTS
 * @param {number} [config.defaultRate=1.0] - Default speech rate (0.1 to 10)
 * @param {number} [config.defaultPitch=1.0] - Default speech pitch (0 to 2)
 * @param {number} [config.defaultVolume=1.0] - Default speech volume (0 to 1)
 * @returns {Object} Accessibility manager instance
 */
export function createAccessibilityManager(config = {}) {
  const {
    defaultLang = 'en-US',
    defaultRate = 1.0,
    defaultPitch = 1.0,
    defaultVolume = 1.0
  } = config;

  // Internal state
  const state = {
    enabled: false,
    autoAnnounce: false,
    lang: defaultLang,
    rate: defaultRate,
    pitch: defaultPitch,
    volume: defaultVolume,
    voices: [],
    selectedVoice: null,
    isSpeaking: false,
    isPaused: false,
    currentUtterance: null
  };

  // Check if browser supports Web Speech API
  const speechSynthesis = window.speechSynthesis;
  const SpeechSynthesisUtterance = window.SpeechSynthesisUtterance;
  const isSupported = !!(speechSynthesis && SpeechSynthesisUtterance);

  /**
   * Loads available voices
   */
  function loadVoices() {
    if (!isSupported) return;

    const voices = speechSynthesis.getVoices();
    state.voices = voices;

    // Try to find a default voice for the selected language
    if (!state.selectedVoice && voices.length > 0) {
      const preferredVoice = voices.find(voice => voice.lang.startsWith(state.lang.split('-')[0]));
      state.selectedVoice = preferredVoice || voices[0];
    }

    return voices;
  }

  // Load voices on initialization and when they change
  if (isSupported) {
    loadVoices();
    speechSynthesis.onvoiceschanged = loadVoices;
  }

  /**
   * Speaks the given text using TTS
   * @param {string} text - Text to speak
   * @param {Object} [options] - Speech options
   * @param {boolean} [options.interrupt=true] - Whether to interrupt current speech
   * @param {Function} [options.onEnd] - Callback when speech ends
   * @param {Function} [options.onError] - Callback when speech error occurs
   * @returns {boolean} True if speech was initiated, false otherwise
   */
  function speak(text, options = {}) {
    if (!isSupported || !state.enabled || !text) {
      return false;
    }

    const {
      interrupt = true,
      onEnd = null,
      onError = null
    } = options;

    // Stop current speech if interrupting
    if (interrupt && state.isSpeaking) {
      stop();
    }

    // Create utterance
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = state.lang;
    utterance.rate = state.rate;
    utterance.pitch = state.pitch;
    utterance.volume = state.volume;

    if (state.selectedVoice) {
      utterance.voice = state.selectedVoice;
    }

    // Event handlers
    utterance.onstart = () => {
      state.isSpeaking = true;
      state.isPaused = false;
      state.currentUtterance = utterance;
    };

    utterance.onend = () => {
      state.isSpeaking = false;
      state.isPaused = false;
      state.currentUtterance = null;
      if (onEnd) onEnd();
    };

    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      state.isSpeaking = false;
      state.isPaused = false;
      state.currentUtterance = null;
      if (onError) onError(event);
    };

    utterance.onpause = () => {
      state.isPaused = true;
    };

    utterance.onresume = () => {
      state.isPaused = false;
    };

    // Speak
    speechSynthesis.speak(utterance);
    return true;
  }

  /**
   * Pauses current speech
   * @returns {boolean} True if paused successfully
   */
  function pause() {
    if (!isSupported || !state.isSpeaking || state.isPaused) {
      return false;
    }

    speechSynthesis.pause();
    return true;
  }

  /**
   * Resumes paused speech
   * @returns {boolean} True if resumed successfully
   */
  function resume() {
    if (!isSupported || !state.isSpeaking || !state.isPaused) {
      return false;
    }

    speechSynthesis.resume();
    return true;
  }

  /**
   * Stops current speech
   * @returns {boolean} True if stopped successfully
   */
  function stop() {
    if (!isSupported) {
      return false;
    }

    speechSynthesis.cancel();
    state.isSpeaking = false;
    state.isPaused = false;
    state.currentUtterance = null;
    return true;
  }

  /**
   * Announces text to screen readers using ARIA live regions
   * @param {string} text - Text to announce
   * @param {string} [priority='polite'] - Announcement priority ('polite' or 'assertive')
   */
  function announce(text, priority = 'polite') {
    if (!text) return;

    // Create or use existing live region
    let liveRegion = document.getElementById('a11y-live-region');
    if (!liveRegion) {
      liveRegion = document.createElement('div');
      liveRegion.id = 'a11y-live-region';
      liveRegion.setAttribute('aria-live', priority);
      liveRegion.setAttribute('aria-atomic', 'true');
      liveRegion.className = 'sr-only'; // Visually hidden but readable by screen readers
      document.body.appendChild(liveRegion);
    } else {
      liveRegion.setAttribute('aria-live', priority);
    }

    // Clear and set new text
    liveRegion.textContent = '';
    setTimeout(() => {
      liveRegion.textContent = text;
    }, 100);

    // Also speak if TTS is enabled and auto-announce is on
    if (state.enabled && state.autoAnnounce) {
      speak(text, { interrupt: false });
    }
  }

  /**
   * Announces element content (for buttons, labels, etc.)
   * @param {HTMLElement} element - Element to announce
   */
  function announceElement(element) {
    if (!element) return;

    // Get accessible name/label
    const ariaLabel = element.getAttribute('aria-label');
    const ariaLabelledBy = element.getAttribute('aria-labelledby');
    const title = element.getAttribute('title');
    const text = element.textContent;

    let announcement = '';

    if (ariaLabel) {
      announcement = ariaLabel;
    } else if (ariaLabelledBy) {
      const labelElement = document.getElementById(ariaLabelledBy);
      announcement = labelElement ? labelElement.textContent : text;
    } else if (title) {
      announcement = title;
    } else {
      announcement = text;
    }

    if (announcement) {
      speak(announcement.trim());
    }
  }

  /**
   * Enables TTS
   */
  function enable() {
    state.enabled = true;
    announce('Text to speech enabled', 'polite');
  }

  /**
   * Disables TTS
   */
  function disable() {
    stop();
    state.enabled = false;
  }

  /**
   * Toggles TTS enabled state
   * @returns {boolean} New enabled state
   */
  function toggle() {
    if (state.enabled) {
      disable();
    } else {
      enable();
    }
    return state.enabled;
  }

  /**
   * Sets the speech rate
   * @param {number} rate - Speech rate (0.1 to 10)
   */
  function setRate(rate) {
    state.rate = Math.max(0.1, Math.min(10, rate));
  }

  /**
   * Sets the speech pitch
   * @param {number} pitch - Speech pitch (0 to 2)
   */
  function setPitch(pitch) {
    state.pitch = Math.max(0, Math.min(2, pitch));
  }

  /**
   * Sets the speech volume
   * @param {number} volume - Speech volume (0 to 1)
   */
  function setVolume(volume) {
    state.volume = Math.max(0, Math.min(1, volume));
  }

  /**
   * Sets the voice
   * @param {SpeechSynthesisVoice|number} voice - Voice object or index
   */
  function setVoice(voice) {
    if (typeof voice === 'number') {
      state.selectedVoice = state.voices[voice] || null;
    } else {
      state.selectedVoice = voice;
    }
  }

  /**
   * Sets auto-announce for dynamic content
   * @param {boolean} enabled - Whether to enable auto-announce
   */
  function setAutoAnnounce(enabled) {
    state.autoAnnounce = enabled;
  }

  /**
   * Gets current state
   * @returns {Object} Current state
   */
  function getState() {
    return {
      ...state,
      isSupported
    };
  }

  /**
   * Gets available voices
   * @returns {SpeechSynthesisVoice[]} Available voices
   */
  function getVoices() {
    return state.voices;
  }

  // Public API
  return {
    // State queries
    isSupported,
    getState,
    getVoices,

    // TTS controls
    speak,
    pause,
    resume,
    stop,

    // Enable/disable
    enable,
    disable,
    toggle,

    // Settings
    setRate,
    setPitch,
    setVolume,
    setVoice,
    setAutoAnnounce,

    // Announcements
    announce,
    announceElement
  };
}
