/**
 * @fileoverview WebRTC Manager - Handles peer-to-peer connection setup and signaling
 * @module managers/WebRTCManager
 *
 * This manager handles:
 * - RTCPeerConnection lifecycle
 * - Offer/Answer creation and exchange
 * - ICE gathering and connection state management
 * - Data channel negotiation (delegates to specific managers)
 * - Media track handling (for screen sharing)
 *
 * Security features:
 * - No STUN/TURN servers (direct peer-to-peer only)
 * - SDP validation
 * - Channel label whitelisting
 * - Connection state monitoring
 */

import {
  EXPECTED_CHANNEL_LABEL,
  CONTROL_CHANNEL_LABEL,
  IMAGE_CHANNEL_LABEL
} from '../core/constants.js';

/**
 * Creates a factory for WebRTC operations that integrates with React state
 * @param {Object} deps - Dependencies object
 * @param {React.MutableRefObject} deps.pcRef - RTCPeerConnection reference
 * @param {React.MutableRefObject} deps.iceDoneRef - ICE gathering completion flag
 * @param {React.MutableRefObject} deps.screenSenderRef - Video transceiver sender ref
 * @param {React.MutableRefObject} deps.screenAudioSenderRef - Audio transceiver sender ref
 * @param {React.MutableRefObject} deps.remoteScreenStreamRef - Remote screen stream ref
 * @param {React.MutableRefObject} deps.remoteScreenVideoRef - Remote video element ref
 * @param {React.MutableRefObject} deps.channelRef - Chat channel reference
 * @param {React.MutableRefObject} deps.controlChannelRef - Control channel reference
 * @param {React.MutableRefObject} deps.imageChannelRef - Image channel reference
 * @param {React.MutableRefObject} deps.incomingTimestampsRef - Rate limiting timestamps
 * @param {React.MutableRefObject} deps.canControlPeerRef - Remote control permission ref
 * @param {Function} deps.setStatus - Status setter
 * @param {Function} deps.setLocalSignal - Local SDP setter
 * @param {Function} deps.setChannelStatus - Channel status setter
 * @param {Function} deps.setChannelReady - Channel ready setter
 * @param {Function} deps.setIsRemoteScreenActive - Remote screen active setter
 * @param {Function} deps.setControlChannelReady - Control channel ready setter
 * @param {Function} deps.setCanControlPeer - Can control peer setter
 * @param {Function} deps.setRemoteControlStatus - Remote control status setter
 * @param {Function} deps.appendSystemMessage - System message appender
 * @param {Function} deps.setupChatChannel - Chat channel setup function
 * @param {Function} deps.setupControlChannel - Control channel setup function
 * @param {Function} deps.setupImageChannel - Image channel setup function
 * @param {Object} deps.t - Translation object
 * @returns {Object} WebRTC operations
 * @export
 */
export function createWebRTCManager(deps) {
  const {
    pcRef,
    iceDoneRef,
    screenSenderRef,
    screenAudioSenderRef,
    remoteScreenStreamRef,
    remoteScreenVideoRef,
    channelRef,
    controlChannelRef,
    imageChannelRef,
    incomingTimestampsRef,
    canControlPeerRef,
    setStatus,
    setLocalSignal,
    setChannelStatus,
    setChannelReady,
    setIsRemoteScreenActive,
    setControlChannelReady,
    setCanControlPeer,
    setRemoteControlStatus,
    appendSystemMessage,
    setupChatChannel,
    setupControlChannel,
    setupImageChannel,
    t
  } = deps;

  /**
   * Creates or returns existing RTCPeerConnection with event handlers
   * @returns {RTCPeerConnection}
   */
  function ensurePeerConnection() {
    if (pcRef.current) {
      return pcRef.current;
    }

    const pc = new RTCPeerConnection({ iceServers: [] });
    pcRef.current = pc;

    // Initialize remote stream for screen sharing
    const remoteStream = new MediaStream();
    remoteScreenStreamRef.current = remoteStream;

    // Setup transceivers for bidirectional media
    if (!screenSenderRef.current) {
      const videoTransceiver = pc.addTransceiver('video', { direction: 'sendrecv' });
      screenSenderRef.current = videoTransceiver.sender;
    }
    if (!screenAudioSenderRef.current) {
      const audioTransceiver = pc.addTransceiver('audio', { direction: 'sendrecv' });
      screenAudioSenderRef.current = audioTransceiver.sender;
    }

    // ICE candidate gathering completion handler
    pc.onicecandidate = (event) => {
      if (!event.candidate && pc.localDescription) {
        iceDoneRef.current = true;
        setLocalSignal(JSON.stringify(pc.localDescription));
        setStatus(t.status.signalReady);
      }
    };

    // ICE connection state monitoring
    pc.oniceconnectionstatechange = () => {
      if (!pcRef.current) return;
      setStatus(t.status.ice(pc.iceConnectionState));
    };

    // Overall connection state monitoring
    pc.onconnectionstatechange = () => {
      if (!pcRef.current) return;
      setStatus(t.status.connection(pc.connectionState));
    };

    // Remote media track handler (screen sharing)
    pc.ontrack = (event) => {
      if (!remoteScreenStreamRef.current) {
        remoteScreenStreamRef.current = new MediaStream();
      }
      const targetStream = remoteScreenStreamRef.current;
      const track = event.track;

      // Add track if not already present
      if (!targetStream.getTracks().some((existing) => existing.id === track.id)) {
        targetStream.addTrack(track);
      }

      // Attach stream to video element
      if (remoteScreenVideoRef.current && remoteScreenVideoRef.current.srcObject !== targetStream) {
        remoteScreenVideoRef.current.srcObject = targetStream;
      }

      // Update video track state
      if (track.kind === 'video') {
        setIsRemoteScreenActive(true);
      }

      // Handle track ending
      track.onended = () => {
        if (track.kind === 'video') {
          setIsRemoteScreenActive(false);
        }
        if (targetStream.getTracks().some((existing) => existing.id === track.id)) {
          targetStream.removeTrack(track);
        }
      };
    };

    // Data channel negotiation with whitelisting
    pc.ondatachannel = (event) => {
      const incomingChannel = event.channel;

      // Route to appropriate channel handler based on label
      if (incomingChannel.label === EXPECTED_CHANNEL_LABEL) {
        channelRef.current = incomingChannel;
        setupChatChannel(incomingChannel);
        return;
      }
      if (incomingChannel.label === CONTROL_CHANNEL_LABEL) {
        setupControlChannel(incomingChannel);
        return;
      }
      if (incomingChannel.label === IMAGE_CHANNEL_LABEL) {
        setupImageChannel(incomingChannel);
        return;
      }

      // Security: Close unexpected channels
      appendSystemMessage(t.systemMessages.channelBlocked(incomingChannel.label || ''));
      incomingChannel.close();
    };

    return pc;
  }

  /**
   * Resolves once ICE gathering finishes for the current connection
   * @returns {Promise<void>}
   */
  async function waitForIce() {
    if (iceDoneRef.current) {
      return;
    }
    await new Promise((resolve) => {
      const check = () => {
        if (iceDoneRef.current) {
          resolve();
        } else {
          setTimeout(check, 150);
        }
      };
      check();
    });
  }

  /**
   * Validates and parses the remote offer/answer JSON
   * @param {string} remoteSignal - Raw SDP JSON string
   * @param {Object} t - Translation object
   * @returns {RTCSessionDescriptionInit}
   * @throws {Error} When the payload is empty or malformed
   */
  function parseRemoteDescription(remoteSignal, t) {
    const raw = remoteSignal.trim();
    if (!raw) {
      throw new Error(t.systemMessages.remoteEmpty);
    }

    let desc;
    try {
      desc = JSON.parse(raw);
    } catch (err) {
      throw new Error(t.systemMessages.remoteInvalidJson);
    }

    // Validate SDP structure
    if (!desc.type || !desc.sdp || !['offer', 'answer'].includes(desc.type)) {
      throw new Error(t.systemMessages.remoteMissingData);
    }

    return desc;
  }

  /**
   * Generates a WebRTC offer and prepares it for manual sharing
   * @param {string} remoteSignal - Current remote signal state
   * @returns {Promise<void>}
   */
  async function createOffer(remoteSignal) {
    const pc = ensurePeerConnection();

    // Close existing channels
    if (channelRef.current) {
      channelRef.current.close();
      channelRef.current = null;
    }
    if (controlChannelRef.current) {
      controlChannelRef.current.close();
      controlChannelRef.current = null;
    }

    // Reset control channel state
    setControlChannelReady(false);
    setCanControlPeer(false);
    canControlPeerRef.current = false;
    setRemoteControlStatus(t.remoteControl.statusDisabled);

    // Create data channels
    const channel = pc.createDataChannel(EXPECTED_CHANNEL_LABEL);
    channelRef.current = channel;
    setupChatChannel(channel);

    const controlChannel = pc.createDataChannel(CONTROL_CHANNEL_LABEL);
    controlChannelRef.current = controlChannel;
    setupControlChannel(controlChannel);

    const imageChannel = pc.createDataChannel(IMAGE_CHANNEL_LABEL);
    imageChannelRef.current = imageChannel;
    setupImageChannel(imageChannel);

    // Reset state
    incomingTimestampsRef.current = [];
    iceDoneRef.current = false;
    setLocalSignal('');
    setChannelReady(false);
    setStatus(t.status.creatingOffer);

    try {
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      await waitForIce();
    } catch (err) {
      console.error(err);
      setStatus(t.status.disconnected);
      appendSystemMessage(t.systemMessages.createOfferFailed);
      throw err;
    }
  }

  /**
   * Applies the pasted remote offer or answer to the peer connection
   * @param {string} remoteSignal - Remote SDP signal
   * @returns {Promise<void>}
   */
  async function applyRemote(remoteSignal) {
    const pc = ensurePeerConnection();
    try {
      const desc = parseRemoteDescription(remoteSignal, t);
      await pc.setRemoteDescription(desc);
      setStatus(t.status.remoteApplied(desc.type));
      if (desc.type === 'answer') {
        setChannelStatus(t.status.answerApplied);
      }
    } catch (err) {
      console.error(err);
      setStatus(err.message);
      throw err;
    }
  }

  /**
   * Produces an answer for an applied offer
   * @param {string} remoteSignal - Remote signal containing offer
   * @returns {Promise<void>}
   */
  async function createAnswer(remoteSignal) {
    const pc = ensurePeerConnection();
    iceDoneRef.current = false;
    setLocalSignal('');
    setChannelReady(false);
    setStatus(t.status.creatingAnswer);

    try {
      if (!pc.currentRemoteDescription) {
        const desc = parseRemoteDescription(remoteSignal, t);
        if (desc.type !== 'offer') {
          throw new Error(t.systemMessages.needOfferForAnswer);
        }
        await pc.setRemoteDescription(desc);
      }
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      await waitForIce();
    } catch (err) {
      console.error(err);
      setStatus(err.message || t.status.disconnected);
      appendSystemMessage(t.systemMessages.createAnswerFailed);
      throw err;
    }
  }

  /**
   * Terminates the peer connection and cleans up all resources
   * @param {Object} screenState - Screen sharing state
   * @param {React.MutableRefObject} screenState.screenStreamRef - Screen stream reference
   * @param {Function} screenState.setIsScreenSharing - Screen sharing state setter
   * @param {Function} screenState.setShareSystemAudio - System audio state setter
   * @returns {void}
   */
  function disconnect(screenState) {
    const { screenStreamRef, setIsScreenSharing, setShareSystemAudio } = screenState;

    // Stop local screen sharing
    const stream = screenStreamRef.current;
    if (stream) {
      stream.getTracks().forEach((track) => {
        track.stop();
      });
      screenStreamRef.current = null;
    }
    setIsScreenSharing(false);
    setShareSystemAudio(false);

    // Stop remote screen
    const remoteStream = remoteScreenStreamRef.current;
    if (remoteStream) {
      remoteStream.getTracks().forEach((track) => {
        track.stop();
      });
      remoteScreenStreamRef.current = null;
    }
    setIsRemoteScreenActive(false);

    // Close data channels
    if (channelRef.current) {
      channelRef.current.close();
      channelRef.current = null;
    }
    if (controlChannelRef.current) {
      controlChannelRef.current.close();
      controlChannelRef.current = null;
    }
    if (imageChannelRef.current) {
      imageChannelRef.current.close();
      imageChannelRef.current = null;
    }

    // Close peer connection
    if (pcRef.current) {
      pcRef.current.close();
      pcRef.current = null;
    }

    // Reset transceivers
    screenSenderRef.current = null;
    screenAudioSenderRef.current = null;

    // Reset state
    iceDoneRef.current = false;
    setLocalSignal('');
    setChannelReady(false);
    setControlChannelReady(false);
    setCanControlPeer(false);
    canControlPeerRef.current = false;
    setRemoteControlStatus(t.remoteControl.statusDisabled);
    setStatus(t.status.disconnected);
    setChannelStatus(t.status.channelClosed);
    appendSystemMessage(t.systemMessages.connectionClosed);
  }

  return {
    ensurePeerConnection,
    waitForIce,
    parseRemoteDescription,
    createOffer,
    applyRemote,
    createAnswer,
    disconnect
  };
}
