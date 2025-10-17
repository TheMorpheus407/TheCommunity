/**
 * @fileoverview Screen Share Manager - Handles screen capture and streaming
 * @module managers/ScreenShareManager
 *
 * This manager handles:
 * - Screen capture via getDisplayMedia
 * - System audio capture (optional)
 * - Track management and lifecycle
 * - Integration with WebRTC transceivers
 * - Remote screen stream handling
 *
 * Security features:
 * - Browser permission checks
 * - Track ending event handling
 * - Proper resource cleanup
 */

import { CONTROL_MESSAGE_TYPES, CONTROL_TOTAL_TEXT_BUDGET } from '../core/constants.js';

/**
 * Creates a factory for Screen Share operations
 * @param {Object} deps - Dependencies object
 * @param {React.MutableRefObject} deps.screenStreamRef - Local screen stream reference
 * @param {React.MutableRefObject} deps.screenSenderRef - Video transceiver sender
 * @param {React.MutableRefObject} deps.screenAudioSenderRef - Audio transceiver sender
 * @param {React.MutableRefObject} deps.localScreenVideoRef - Local video element ref
 * @param {React.MutableRefObject} deps.remoteControlAllowedRef - Remote control permission ref
 * @param {React.MutableRefObject} deps.remoteKeyBudgetRef - Text input budget ref
 * @param {Function} deps.setIsScreenSharing - Screen sharing state setter
 * @param {Function} deps.setShareSystemAudio - System audio state setter
 * @param {Function} deps.setIsRemoteControlAllowed - Remote control allowed setter
 * @param {Function} deps.setRemoteControlStatus - Remote control status setter
 * @param {Function} deps.appendSystemMessage - System message appender
 * @param {Function} deps.ensurePeerConnection - WebRTC connection factory
 * @param {Function} deps.sendControlMessage - Control message sender
 * @param {Function} deps.cancelPendingPointerFrame - Cancel RAF function
 * @param {Function} deps.hideRemotePointer - Hide pointer function
 * @param {Object} deps.t - Translation object
 * @returns {Object} Screen share operations
 * @export
 */
export function createScreenShareManager(deps) {
  const {
    screenStreamRef,
    screenSenderRef,
    screenAudioSenderRef,
    localScreenVideoRef,
    remoteControlAllowedRef,
    remoteKeyBudgetRef,
    setIsScreenSharing,
    setShareSystemAudio,
    setIsRemoteControlAllowed,
    setRemoteControlStatus,
    appendSystemMessage,
    ensurePeerConnection,
    sendControlMessage,
    cancelPendingPointerFrame,
    hideRemotePointer,
    t
  } = deps;

  /**
   * Stops screen sharing and cleans up resources
   * Also disables remote control if it was enabled
   * @param {boolean} isCurrentlySharing - Current screen sharing state
   * @returns {void}
   */
  function stopScreenShare(isCurrentlySharing) {
    const stream = screenStreamRef.current;

    // Stop all media tracks
    if (stream) {
      stream.getTracks().forEach((track) => {
        try {
          track.stop();
        } catch (error) {
          console.warn('Failed to stop screen share track', error);
        }
      });
      screenStreamRef.current = null;
    }

    // Clear video sender track
    if (screenSenderRef.current) {
      try {
        screenSenderRef.current.replaceTrack(null);
      } catch (error) {
        console.warn('Failed to clear screen video sender', error);
      }
    }

    // Clear audio sender track
    if (screenAudioSenderRef.current) {
      try {
        screenAudioSenderRef.current.replaceTrack(null);
      } catch (error) {
        console.warn('Failed to clear screen audio sender', error);
      }
    }

    // Clear video element
    if (localScreenVideoRef.current) {
      localScreenVideoRef.current.srcObject = null;
    }

    // Notify user if sharing was active
    if (isCurrentlySharing) {
      appendSystemMessage(t.screenShare.messages.stopped);
    }

    // Disable remote control if it was enabled
    if (remoteControlAllowedRef.current) {
      const delivered = sendControlMessage({
        type: CONTROL_MESSAGE_TYPES.PERMISSION,
        allowed: false
      });

      cancelPendingPointerFrame();
      hideRemotePointer();
      appendSystemMessage(t.remoteControl.system.disabledOnScreenStop);

      if (!delivered) {
        appendSystemMessage(t.remoteControl.system.revokeFailed);
      }
    }

    // Reset remote control state
    remoteControlAllowedRef.current = false;
    setIsRemoteControlAllowed(false);
    setRemoteControlStatus(t.remoteControl.statusDisabled);
    remoteKeyBudgetRef.current = CONTROL_TOTAL_TEXT_BUDGET;

    // Reset sharing state
    setIsScreenSharing(false);
  }

  /**
   * Starts screen capture and streams it to peer
   * @param {boolean} isCurrentlySharing - Current screen sharing state
   * @param {boolean} includeSystemAudio - Whether to capture system audio
   * @returns {Promise<void>}
   */
  async function startScreenShare(isCurrentlySharing, includeSystemAudio) {
    if (isCurrentlySharing) {
      return;
    }

    let stream = null;

    try {
      // Check browser support
      if (!navigator.mediaDevices || typeof navigator.mediaDevices.getDisplayMedia !== 'function') {
        appendSystemMessage(t.screenShare.messages.notSupported);
        return;
      }

      // Ensure peer connection is ready
      const pc = ensurePeerConnection();
      if (!pc) {
        throw new Error(t.screenShare.errors.peerNotReady);
      }

      // Request screen capture with optional audio
      stream = await navigator.mediaDevices.getDisplayMedia({
        video: { cursor: 'always' },
        audio: includeSystemAudio ? { echoCancellation: false, noiseSuppression: false } : false
      });

      // Validate video track
      const [videoTrack] = stream.getVideoTracks();
      if (!videoTrack) {
        stream.getTracks().forEach((track) => track.stop());
        throw new Error(t.screenShare.errors.noVideoTrack);
      }

      // Replace video transceiver track
      if (screenSenderRef.current) {
        await screenSenderRef.current.replaceTrack(videoTrack);
      }

      // Replace audio transceiver track (if available)
      const [audioTrack] = stream.getAudioTracks();
      if (screenAudioSenderRef.current) {
        await screenAudioSenderRef.current.replaceTrack(audioTrack || null);
      }

      // Store stream and attach to video element
      screenStreamRef.current = stream;
      if (localScreenVideoRef.current) {
        localScreenVideoRef.current.srcObject = stream;
      }

      // Update state
      setIsScreenSharing(true);
      appendSystemMessage(t.screenShare.messages.started);

      // Handle user stopping share from browser UI
      videoTrack.onended = () => {
        stopScreenShare(true);
      };
    } catch (error) {
      console.error('Screen share failed', error);

      // Cleanup on failure
      if (stream) {
        stream.getTracks().forEach((track) => {
          try {
            track.stop();
          } catch (stopError) {
            console.warn('Failed to stop captured track after error', stopError);
          }
        });
      }

      // Notify user of failure
      const reason = error && error.message ? error.message : t.screenShare.errors.permissionDenied;
      appendSystemMessage(t.screenShare.errors.failed(reason));
      setIsScreenSharing(false);
    }
  }

  /**
   * Toggles system audio capture preference
   * @param {Function} setShareSystemAudio - State setter for audio preference
   * @returns {void}
   */
  function toggleSystemAudio(setShareSystemAudio) {
    setShareSystemAudio((prev) => !prev);
  }

  return {
    startScreenShare,
    stopScreenShare,
    toggleSystemAudio
  };
}
