/**
 * @fileoverview Audio manager for cat mode background music and sound effects.
 * @module utils/audioManager
 */

import { CAT_AUDIO_STORAGE_KEY, DEFAULT_CAT_AUDIO_SETTINGS } from '../core/constants.js';

/**
 * Audio manager class for handling cat mode audio.
 */
export class AudioManager {
  constructor() {
    this.backgroundMusic = null;
    this.sfxAudio = null;
    this.settings = this.loadSettings();
    this.isTabVisible = true;
    this.lastSfxTime = 0;
    this.sfxDebounceMs = 300; // Prevent SFX spam

    // Bind methods
    this.handleVisibilityChange = this.handleVisibilityChange.bind(this);

    // Listen for tab visibility changes
    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', this.handleVisibilityChange);
    }
  }

  /**
   * Load audio settings from localStorage.
   * @returns {Object} Audio settings
   */
  loadSettings() {
    if (typeof window === 'undefined') {
      return { ...DEFAULT_CAT_AUDIO_SETTINGS };
    }
    try {
      const stored = window.localStorage.getItem(CAT_AUDIO_STORAGE_KEY);
      if (stored) {
        return { ...DEFAULT_CAT_AUDIO_SETTINGS, ...JSON.parse(stored) };
      }
    } catch (error) {
      console.warn('Failed to load cat audio settings', error);
    }
    return { ...DEFAULT_CAT_AUDIO_SETTINGS };
  }

  /**
   * Save audio settings to localStorage.
   * @param {Object} settings - Audio settings to save
   */
  saveSettings(settings) {
    this.settings = { ...this.settings, ...settings };
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(CAT_AUDIO_STORAGE_KEY, JSON.stringify(this.settings));
      } catch (error) {
        console.warn('Failed to save cat audio settings', error);
      }
    }
  }

  /**
   * Check if user prefers reduced motion (also applies to sound).
   * @returns {boolean} True if reduced motion is preferred
   */
  prefersReducedMotion() {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return false;
    }
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  /**
   * Handle tab visibility changes (auto-mute when tab hidden).
   */
  handleVisibilityChange() {
    this.isTabVisible = !document.hidden;
    if (this.backgroundMusic) {
      if (this.isTabVisible && this.settings.enabled && this.settings.musicEnabled) {
        this.backgroundMusic.play().catch(err => console.warn('Failed to resume music', err));
      } else {
        this.backgroundMusic.pause();
      }
    }
  }

  /**
   * Initialize background music (lazy-loaded).
   * @returns {Promise<void>}
   */
  async initBackgroundMusic() {
    if (this.backgroundMusic || typeof Audio === 'undefined') {
      return;
    }

    // Check for reduced motion preference
    if (this.prefersReducedMotion()) {
      console.log('Reduced motion preferred, skipping audio initialization');
      return;
    }

    try {
      // Try OGG first (better compression), fallback to MP3
      this.backgroundMusic = new Audio();

      // Check if browser supports OGG
      const canPlayOgg = this.backgroundMusic.canPlayType('audio/ogg; codecs="vorbis"');
      const audioSrc = canPlayOgg ? './assets/audio/cat-background.ogg' : './assets/audio/cat-background.mp3';

      this.backgroundMusic.src = audioSrc;
      this.backgroundMusic.loop = true;
      this.backgroundMusic.volume = this.settings.volume / 100;

      // Preload but don't play yet
      this.backgroundMusic.load();
    } catch (error) {
      console.warn('Failed to initialize background music', error);
    }
  }

  /**
   * Initialize SFX audio (lazy-loaded).
   * @returns {Promise<void>}
   */
  async initSfx() {
    if (this.sfxAudio || typeof Audio === 'undefined') {
      return;
    }

    // Check for reduced motion preference
    if (this.prefersReducedMotion()) {
      return;
    }

    try {
      this.sfxAudio = new Audio();

      // Check if browser supports OGG
      const canPlayOgg = this.sfxAudio.canPlayType('audio/ogg; codecs="vorbis"');
      const audioSrc = canPlayOgg ? './assets/audio/meow.ogg' : './assets/audio/meow.mp3';

      this.sfxAudio.src = audioSrc;
      this.sfxAudio.volume = this.settings.volume / 100;

      // Preload but don't play yet
      this.sfxAudio.load();
    } catch (error) {
      console.warn('Failed to initialize SFX', error);
    }
  }

  /**
   * Start background music.
   */
  async startMusic() {
    if (!this.settings.enabled || !this.settings.musicEnabled || !this.isTabVisible) {
      return;
    }

    await this.initBackgroundMusic();

    if (this.backgroundMusic) {
      try {
        await this.backgroundMusic.play();
      } catch (error) {
        // Browser might block auto-play, this is expected
        console.log('Music auto-play blocked (user interaction required)', error.message);
      }
    }
  }

  /**
   * Stop background music.
   */
  stopMusic() {
    if (this.backgroundMusic) {
      this.backgroundMusic.pause();
      this.backgroundMusic.currentTime = 0;
    }
  }

  /**
   * Play a meow sound effect.
   */
  async playSfx() {
    if (!this.settings.enabled || !this.settings.sfxEnabled) {
      return;
    }

    // Debounce to prevent spam
    const now = Date.now();
    if (now - this.lastSfxTime < this.sfxDebounceMs) {
      return;
    }
    this.lastSfxTime = now;

    await this.initSfx();

    if (this.sfxAudio) {
      try {
        // Reset to beginning if already playing
        this.sfxAudio.currentTime = 0;
        await this.sfxAudio.play();
      } catch (error) {
        console.log('SFX play blocked or failed', error.message);
      }
    }
  }

  /**
   * Update volume for all audio.
   * @param {number} volume - Volume level (0-100)
   */
  setVolume(volume) {
    const normalizedVolume = Math.max(0, Math.min(100, volume)) / 100;
    this.settings.volume = volume;

    if (this.backgroundMusic) {
      this.backgroundMusic.volume = normalizedVolume;
    }
    if (this.sfxAudio) {
      this.sfxAudio.volume = normalizedVolume;
    }
  }

  /**
   * Update audio settings and persist them.
   * @param {Object} newSettings - New settings to apply
   */
  updateSettings(newSettings) {
    const oldSettings = { ...this.settings };
    this.saveSettings(newSettings);

    // Handle music enable/disable
    if (newSettings.musicEnabled !== undefined) {
      if (newSettings.musicEnabled && this.settings.enabled) {
        this.startMusic();
      } else {
        this.stopMusic();
      }
    }

    // Handle volume changes
    if (newSettings.volume !== undefined) {
      this.setVolume(newSettings.volume);
    }

    // Handle global enable/disable
    if (newSettings.enabled === false) {
      this.stopMusic();
    } else if (newSettings.enabled === true && oldSettings.enabled === false) {
      if (this.settings.musicEnabled) {
        this.startMusic();
      }
    }
  }

  /**
   * Cleanup and remove event listeners.
   */
  destroy() {
    this.stopMusic();

    if (typeof document !== 'undefined') {
      document.removeEventListener('visibilitychange', this.handleVisibilityChange);
    }

    if (this.backgroundMusic) {
      this.backgroundMusic = null;
    }
    if (this.sfxAudio) {
      this.sfxAudio = null;
    }
  }
}

// Singleton instance
let audioManagerInstance = null;

/**
 * Get or create the audio manager singleton.
 * @returns {AudioManager} Audio manager instance
 */
export function getAudioManager() {
  if (!audioManagerInstance) {
    audioManagerInstance = new AudioManager();
  }
  return audioManagerInstance;
}
