/**
 * DoomManager.js
 * Manages ASCII Doom game state and P2P synchronization for TheCommunity chat app.
 *
 * @module DoomManager
 */

/**
 * Factory function to create a Doom manager instance.
 * Handles game lifecycle, P2P synchronization, and state management.
 *
 * @param {Object} reactState - React state management functions
 * @param {Function} reactState.setIsDoomActive - Set Doom active state
 * @param {Function} reactState.appendSystemMessage - Append system message to chat
 * @param {Object} refs - React refs
 * @param {React.RefObject} refs.doomChannelRef - Reference to Doom data channel
 * @param {React.RefObject} refs.doomGameRef - Reference to DoomGame instance
 * @param {React.RefObject} refs.doomDisplayRef - Reference to Doom display element
 * @param {Object} translations - Translation object
 * @returns {Object} Doom manager with public methods
 */
export function createDoomManager(reactState, refs, translations) {
  const { setIsDoomActive, appendSystemMessage } = reactState;
  const { doomChannelRef, doomGameRef, doomDisplayRef } = refs;
  const t = translations;

  /**
   * Starts a new Doom game session.
   * Initializes the game instance and begins gameplay.
   *
   * @returns {void}
   */
  function startGame() {
    if (!doomDisplayRef.current) {
      appendSystemMessage(t?.doom?.noDisplay || 'Doom display element not found');
      return;
    }

    if (doomGameRef.current) {
      doomGameRef.current.destroy();
    }

    const callbacks = {
      onStart: () => {
        setIsDoomActive(true);
        appendSystemMessage(t?.doom?.gameStarted || 'Doom game started! Use arrow keys or WASD to move.');
      },
      onStop: () => {
        setIsDoomActive(false);
        appendSystemMessage(t?.doom?.gameStopped || 'Doom game stopped.');
      }
    };

    doomGameRef.current = new window.DoomGame(
      doomDisplayRef.current,
      doomChannelRef.current,
      callbacks
    );

    // Game will start when user presses space
    appendSystemMessage(t?.doom?.ready || 'Doom is ready. Press SPACE to start!');
  }

  /**
   * Stops the current Doom game session.
   * Cleans up the game instance and resets state.
   *
   * @returns {void}
   */
  function stopGame() {
    if (doomGameRef.current) {
      doomGameRef.current.destroy();
      doomGameRef.current = null;
    }

    setIsDoomActive(false);
    appendSystemMessage(t?.doom?.gameClosed || 'Doom game closed.');
  }

  /**
   * Configures event handlers for the Doom data channel.
   * Sets up open, close, and error handlers.
   *
   * @param {RTCDataChannel} channel - The Doom data channel
   * @returns {void}
   */
  function setupChannel(channel) {
    channel.onopen = () => {
      doomChannelRef.current = channel;
      appendSystemMessage(t?.doom?.channelReady || 'Doom channel ready');
    };

    channel.onclose = () => {
      if (doomChannelRef.current === channel) {
        doomChannelRef.current = null;
      }
      appendSystemMessage(t?.doom?.channelClosed || 'Doom channel closed');

      // Clean up game if active
      if (doomGameRef.current) {
        doomGameRef.current.destroy();
        doomGameRef.current = null;
        setIsDoomActive(false);
      }
    };

    channel.onerror = (error) => {
      console.error('Doom channel error:', error);
      appendSystemMessage(t?.doom?.channelError || 'Doom channel error');
    };
  }

  /**
   * Handles incoming Doom game messages from the peer.
   * Processes game state synchronization data.
   *
   * @param {Object} data - Parsed message data
   * @returns {void}
   */
  function handleMessage(data) {
    // Messages are handled directly by the DoomGame instance
    // This function exists for consistency with other managers
    // and for potential future message handling needs
  }

  // Return public API
  return {
    startGame,
    stopGame,
    setupChannel,
    handleMessage
  };
}

/**
 * Creates Doom channel configuration for WebRTC setup.
 *
 * @param {string} channelLabel - The data channel label
 * @returns {Object} Channel configuration object
 */
export function createDoomChannelConfig(channelLabel) {
  return {
    label: channelLabel,
    ordered: true,
    maxRetransmits: null
  };
}
