/**
 * @fileoverview UI Manager - Handles all UI state management and modal operations
 * @module managers/UIManager
 */

/**
 * Creates and manages UI state including modals, themes, and user interactions
 * @param {Object} config - Configuration object
 * @param {Object} config.initialState - Initial UI state values
 * @param {Object} config.callbacks - Callback functions for state updates
 * @returns {Object} UI manager instance
 */
export function createUIManager(config) {
  const { initialState = {}, callbacks = {} } = config;

  // Internal state
  const state = {
    // Modal states
    isApiKeyModalOpen: initialState.isApiKeyModalOpen || false,
    isDangerZoneModalOpen: initialState.isDangerZoneModalOpen || false,
    isCookieSettingsOpen: initialState.isCookieSettingsOpen || false,
    isAboutOpen: initialState.isAboutOpen || false,
    isOffTopicOpen: initialState.isOffTopicOpen || false,
    isHelpOpen: initialState.isHelpOpen || false,
    isImpressumOpen: initialState.isImpressumOpen || false,
    isVersionHistoryOpen: initialState.isVersionHistoryOpen || false,
    isBrainsPlanOpen: initialState.isBrainsPlanOpen || false,
    isFranconiaIntroOpen: initialState.isFranconiaIntroOpen || false,
    isSoundboardOpen: initialState.isSoundboardOpen || false,

    // Collapse states
    isSignalingCollapsed: initialState.isSignalingCollapsed || false,

    // UI feedback
    copyButtonText: initialState.copyButtonText || 'Copy',
    remoteControlStatus: initialState.remoteControlStatus || '',

    // Danger zone
    dangerZoneAction: null,
    dangerZoneConfirmInput: ''
  };

  /**
   * Updates internal state and triggers callback
   * @param {string} key - State key
   * @param {*} value - New value
   */
  function setState(key, value) {
    state[key] = value;
    if (callbacks[key]) {
      callbacks[key](value);
    }
  }

  /**
   * Gets current state value
   * @param {string} key - State key
   * @returns {*} Current state value
   */
  function getState(key) {
    return state[key];
  }

  // Modal management functions

  /**
   * Opens the API key configuration modal
   */
  function openApiKeyModal() {
    setState('isApiKeyModalOpen', true);
  }

  /**
   * Closes the API key configuration modal
   */
  function closeApiKeyModal() {
    setState('isApiKeyModalOpen', false);
  }

  /**
   * Opens the danger zone confirmation modal
   * @param {string} action - The danger zone action type
   */
  function openDangerZoneModal(action) {
    setState('dangerZoneAction', action);
    setState('dangerZoneConfirmInput', '');
    setState('isDangerZoneModalOpen', true);
  }

  /**
   * Closes the danger zone confirmation modal
   */
  function closeDangerZoneModal() {
    setState('isDangerZoneModalOpen', false);
    setState('dangerZoneAction', null);
    setState('dangerZoneConfirmInput', '');
  }

  /**
   * Opens the cookie consent settings modal
   */
  function openCookieSettings() {
    setState('isCookieSettingsOpen', true);
  }

  /**
   * Closes the cookie consent settings modal
   */
  function closeCookieSettings() {
    setState('isCookieSettingsOpen', false);
  }

  /**
   * Toggles the About modal
   */
  function toggleAbout() {
    setState('isAboutOpen', !state.isAboutOpen);
  }

  /**
   * Toggles the Off-Topic modal
   */
  function toggleOffTopic() {
    setState('isOffTopicOpen', !state.isOffTopicOpen);
  }

  /**
   * Toggles the Help modal
   */
  function toggleHelp() {
    setState('isHelpOpen', !state.isHelpOpen);
  }

  /**
   * Toggles the Impressum modal
   */
  function toggleImpressum() {
    setState('isImpressumOpen', !state.isImpressumOpen);
  }

  /**
   * Toggles the Version History modal
   */
  function toggleVersionHistory() {
    setState('isVersionHistoryOpen', !state.isVersionHistoryOpen);
  }

  /**
   * Toggles the BrainsPlan visibility
   */
  function toggleBrainsPlan() {
    setState('isBrainsPlanOpen', !state.isBrainsPlanOpen);
  }

  /**
   * Closes the Franconia intro modal
   */
  function closeFranconiaIntro() {
    setState('isFranconiaIntroOpen', false);
  }

  /**
   * Toggles the soundboard visibility
   */
  function toggleSoundboard() {
    setState('isSoundboardOpen', !state.isSoundboardOpen);
  }

  /**
   * Toggles the signaling panel collapse state
   */
  function toggleSignalingCollapse() {
    setState('isSignalingCollapsed', !state.isSignalingCollapsed);
  }

  /**
   * Sets the copy button text (for user feedback)
   * @param {string} text - The button text
   */
  function setCopyButtonText(text) {
    setState('copyButtonText', text);
  }

  /**
   * Sets the remote control status message
   * @param {string} status - The status message
   */
  function setRemoteControlStatus(status) {
    setState('remoteControlStatus', status);
  }

  /**
   * Sets the danger zone confirm input value
   * @param {string} value - The input value
   */
  function setDangerZoneConfirmInput(value) {
    setState('dangerZoneConfirmInput', value);
  }

  /**
   * Closes all modals
   */
  function closeAllModals() {
    setState('isApiKeyModalOpen', false);
    setState('isDangerZoneModalOpen', false);
    setState('isCookieSettingsOpen', false);
    setState('isAboutOpen', false);
    setState('isOffTopicOpen', false);
    setState('isHelpOpen', false);
    setState('isImpressumOpen', false);
    setState('isVersionHistoryOpen', false);
    setState('isBrainsPlanOpen', false);
    setState('isFranconiaIntroOpen', false);
    setState('isSoundboardOpen', false);
  }

  /**
   * Checks if any modal is currently open
   * @returns {boolean} True if any modal is open
   */
  function isAnyModalOpen() {
    return (
      state.isApiKeyModalOpen ||
      state.isDangerZoneModalOpen ||
      state.isCookieSettingsOpen ||
      state.isAboutOpen ||
      state.isOffTopicOpen ||
      state.isHelpOpen ||
      state.isImpressumOpen ||
      state.isVersionHistoryOpen ||
      state.isBrainsPlanOpen ||
      state.isFranconiaIntroOpen ||
      state.isSoundboardOpen
    );
  }

  /**
   * Gets all current modal states
   * @returns {Object} Object containing all modal states
   */
  function getModalStates() {
    return {
      isApiKeyModalOpen: state.isApiKeyModalOpen,
      isDangerZoneModalOpen: state.isDangerZoneModalOpen,
      isCookieSettingsOpen: state.isCookieSettingsOpen,
      isAboutOpen: state.isAboutOpen,
      isOffTopicOpen: state.isOffTopicOpen,
      isHelpOpen: state.isHelpOpen,
      isImpressumOpen: state.isImpressumOpen,
      isVersionHistoryOpen: state.isVersionHistoryOpen,
      isBrainsPlanOpen: state.isBrainsPlanOpen,
      isFranconiaIntroOpen: state.isFranconiaIntroOpen,
      isSoundboardOpen: state.isSoundboardOpen
    };
  }

  /**
   * Handles keyboard shortcuts for modals
   * @param {KeyboardEvent} event - The keyboard event
   */
  function handleKeyboardShortcut(event) {
    // ESC key closes modals
    if (event.key === 'Escape' && isAnyModalOpen()) {
      closeAllModals();
      event.preventDefault();
    }
  }

  // Return public API
  return {
    // State getters
    getState,
    getModalStates,
    isAnyModalOpen,

    // Modal controls
    openApiKeyModal,
    closeApiKeyModal,
    openDangerZoneModal,
    closeDangerZoneModal,
    openCookieSettings,
    closeCookieSettings,
    toggleAbout,
    toggleOffTopic,
    toggleHelp,
    toggleImpressum,
    toggleVersionHistory,
    toggleBrainsPlan,
    closeFranconiaIntro,
    toggleSoundboard,
    closeAllModals,

    // UI controls
    toggleSignalingCollapse,
    setCopyButtonText,
    setRemoteControlStatus,
    setDangerZoneConfirmInput,

    // Event handlers
    handleKeyboardShortcut
  };
}
