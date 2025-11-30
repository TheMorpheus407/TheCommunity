/**
 * @fileoverview WebRTC Connection Manager - Handles all WebRTC peer connection logic
 * @module managers/ConnectionManager
 */

/**
 * Creates and manages WebRTC peer connections, data channels, and media streams
 * @param {Object} config - Configuration object
 * @param {Object} config.t - Translation object for localized messages
 * @param {Function} config.setStatus - Callback to update connection status
 * @param {Function} config.setChannelStatus - Callback to update channel status
 * @param {Function} config.setLocalSignal - Callback to update local SDP signal
 * @param {Function} config.appendMessage - Callback to append chat messages
 * @param {Function} config.appendSystemMessage - Callback to append system messages
 * @param {Function} config.setChannelReady - Callback to set channel ready state
 * @param {Function} config.setControlChannelReady - Callback to set control channel ready state
 * @param {Function} config.setIsRemoteScreenActive - Callback to set remote screen active state
 * @param {Function} config.handleIncomingControlMessage - Handler for control messages
 * @param {Function} config.handleIncomingImageMessage - Handler for image messages
 * @param {Object} config.fileTransferManager - File transfer manager instance
 * @param {Object} config.chessManagerRef - Chess manager ref
 * @param {Object} config.pongManagerRef - Pong manager ref
 * @param {Object} config.triviaManagerRef - Trivia manager ref
 * @param {Object} config.flappyBirdManagerRef - Flappy Bird manager ref
 * @param {Object} config.doomManagerRef - Doom manager ref
 * @returns {Object} Connection manager instance
 */
export function createConnectionManager(config) {
  const {
    t,
    setStatus,
    setChannelStatus,
    setLocalSignal,
    appendMessage,
    appendSystemMessage,
    setChannelReady,
    setControlChannelReady,
    setIsRemoteScreenActive,
    handleIncomingControlMessage,
    handleIncomingImageMessage,
    fileTransferManager,
    chessManagerRef,
    pongManagerRef,
    triviaManagerRef,
    flappyBirdManagerRef,
    doomManagerRef
  } = config;

  // Internal state
  let peerConnection = null;
  let dataChannel = null;
  let controlChannel = null;
  let imageChannel = null;
  let fileChannel = null;
  let pongChannel = null;
  let triviaChannel = null;
  let chessChannel = null;
  let flappyBirdChannel = null;
  let doomChannel = null;
  let iceDone = false;
  let remoteStream = null;

  /**
   * Ensures peer connection exists and is properly configured
   * @returns {RTCPeerConnection} The peer connection instance
   */
  function ensurePeerConnection() {
    if (peerConnection) {
      return peerConnection;
    }

    // Create new RTCPeerConnection with STUN servers
    peerConnection = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' }
      ]
    });

    // Initialize remote stream for screen sharing
    remoteStream = new MediaStream();

    // Add placeholder transceivers for audio and video
    peerConnection.addTransceiver('audio', { direction: 'recvonly' });
    peerConnection.addTransceiver('video', { direction: 'recvonly' });

    // Setup ICE candidate handler
    peerConnection.onicecandidate = (event) => {
      if (event.candidate === null) {
        iceDone = true;
      }
    };

    // Setup ICE connection state handler
    peerConnection.oniceconnectionstatechange = () => {
      const state = peerConnection.iceConnectionState;
      console.log('ICE connection state:', state);

      if (state === 'connected') {
        setStatus(t.status.peerConnected);
      } else if (state === 'disconnected') {
        setStatus(t.status.peerDisconnected);
      } else if (state === 'failed') {
        setStatus(t.status.peerFailed);
      }
    };

    // Setup connection state handler
    peerConnection.onconnectionstatechange = () => {
      const state = peerConnection.connectionState;
      console.log('Connection state:', state);

      if (state === 'connected') {
        setStatus(t.status.peerConnected);
      } else if (state === 'disconnected') {
        setStatus(t.status.peerDisconnected);
      } else if (state === 'failed') {
        setStatus(t.status.peerFailed);
      }
    };

    // Setup track handler for receiving remote streams
    peerConnection.ontrack = (event) => {
      console.log('Received remote track:', event.track.kind);
      remoteStream.addTrack(event.track);
      setIsRemoteScreenActive(true);
    };

    // Setup data channel receiver
    peerConnection.ondatachannel = (event) => {
      const channel = event.channel;
      console.log('Received data channel:', channel.label);

      // Route to appropriate channel handler based on label
      if (channel.label === 'chat') {
        dataChannel = channel;
        setupChatChannel(channel);
      } else if (channel.label === 'control') {
        controlChannel = channel;
        setupControlChannel(channel);
      } else if (channel.label === 'image') {
        imageChannel = channel;
        setupImageChannel(channel);
      } else if (channel.label === 'file') {
        fileChannel = channel;
        setupFileChannel(channel);
      } else if (channel.label === 'pong') {
        pongChannel = channel;
        setupPongChannel(channel);
      } else if (channel.label === 'trivia') {
        triviaChannel = channel;
        setupTriviaChannel(channel);
      } else if (channel.label === 'chess') {
        chessChannel = channel;
        setupChessChannel(channel);
      } else if (channel.label === 'flappybird') {
        flappyBirdChannel = channel;
        setupFlappyBirdChannel(channel);
      } else if (channel.label === 'doom') {
        doomChannel = channel;
        setupDoomChannel(channel);
      }
    };

    return peerConnection;
  }

  /**
   * Sets up the chat data channel
   * @param {RTCDataChannel} channel - The chat data channel
   */
  function setupChatChannel(channel) {
    channel.onopen = () => {
      console.log('Chat channel opened');
      setChannelStatus(t.status.channelOpen);
      setChannelReady(true);
      appendSystemMessage(t.messages.channelReady);
    };

    channel.onclose = () => {
      console.log('Chat channel closed');
      setChannelStatus(t.status.channelClosed);
      setChannelReady(false);
      appendSystemMessage(t.messages.channelClosed);
    };

    channel.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        if (message.type === 'chat') {
          appendMessage(message.text, 'remote');
        }
      } catch (error) {
        console.error('Error parsing chat message:', error);
      }
    };
  }

  /**
   * Sets up the control data channel
   * @param {RTCDataChannel} channel - The control data channel
   */
  function setupControlChannel(channel) {
    channel.onopen = () => {
      console.log('Control channel opened');
      setControlChannelReady(true);
    };

    channel.onclose = () => {
      console.log('Control channel closed');
      setControlChannelReady(false);
    };

    channel.onmessage = (event) => {
      handleIncomingControlMessage(event.data);
    };
  }

  /**
   * Sets up the image transfer data channel
   * @param {RTCDataChannel} channel - The image data channel
   */
  function setupImageChannel(channel) {
    channel.onopen = () => {
      console.log('Image channel opened');
    };

    channel.onclose = () => {
      console.log('Image channel closed');
    };

    channel.onmessage = (event) => {
      handleIncomingImageMessage(event.data);
    };
  }

  /**
   * Sets up the file transfer data channel
   * @param {RTCDataChannel} channel - The file data channel
   */
  function setupFileChannel(channel) {
    if (fileTransferManager) {
      fileTransferManager.setupFileChannel(channel);
    }
  }

  /**
   * Sets up the Pong game data channel
   * @param {RTCDataChannel} channel - The Pong data channel
   */
  function setupPongChannel(channel) {
    channel.onopen = () => {
      console.log('Pong channel opened');
    };

    channel.onclose = () => {
      console.log('Pong channel closed');
    };

    channel.onerror = (error) => {
      console.error('Pong channel error:', error);
    };

    channel.onmessage = (event) => {
      if (pongManagerRef?.current) {
        pongManagerRef.current.handleMessage(event.data);
      }
    };
  }

  /**
   * Sets up the Trivia game data channel
   * @param {RTCDataChannel} channel - The Trivia data channel
   */
  function setupTriviaChannel(channel) {
    channel.onopen = () => {
      console.log('Trivia channel opened');
    };

    channel.onclose = () => {
      console.log('Trivia channel closed');
    };

    channel.onerror = (error) => {
      console.error('Trivia channel error:', error);
    };

    channel.onmessage = (event) => {
      if (triviaManagerRef?.current) {
        triviaManagerRef.current.handleMessage(event.data);
      }
    };
  }

  /**
   * Sets up the Chess game data channel
   * @param {RTCDataChannel} channel - The Chess data channel
   */
  function setupChessChannel(channel) {
    if (chessManagerRef?.current) {
      chessManagerRef.current.setupChessChannel(channel);
    }
  }

  /**
   * Sets up the Flappy Bird game data channel
   * @param {RTCDataChannel} channel - The Flappy Bird data channel
   */
  function setupFlappyBirdChannel(channel) {
    channel.onopen = () => {
      console.log('Flappy Bird channel opened');
    };

    channel.onclose = () => {
      console.log('Flappy Bird channel closed');
    };

    channel.onerror = (error) => {
      console.error('Flappy Bird channel error:', error);
    };

    channel.onmessage = (event) => {
      if (flappyBirdManagerRef?.current) {
        flappyBirdManagerRef.current.handleMessage(event.data);
      }
    };
  }

  /**
   * Sets up the Doom game data channel
   * @param {RTCDataChannel} channel - The Doom data channel
   */
  function setupDoomChannel(channel) {
    channel.onopen = () => {
      console.log('Doom channel opened');
    };

    channel.onclose = () => {
      console.log('Doom channel closed');
    };

    channel.onerror = (error) => {
      console.error('Doom channel error:', error);
    };

    channel.onmessage = (event) => {
      if (doomManagerRef?.current) {
        doomManagerRef.current.handleMessage(event.data);
      }
    };
  }

  /**
   * Creates an offer with all necessary data channels
   * @returns {Promise<string>} JSON-encoded SDP offer
   */
  async function createOffer() {
    const pc = ensurePeerConnection();
    iceDone = false;

    // Create all data channels
    dataChannel = pc.createDataChannel('chat');
    setupChatChannel(dataChannel);

    controlChannel = pc.createDataChannel('control');
    setupControlChannel(controlChannel);

    imageChannel = pc.createDataChannel('image');
    setupImageChannel(imageChannel);

    fileChannel = pc.createDataChannel('file');
    setupFileChannel(fileChannel);

    pongChannel = pc.createDataChannel('pong');
    setupPongChannel(pongChannel);

    triviaChannel = pc.createDataChannel('trivia');
    setupTriviaChannel(triviaChannel);

    chessChannel = pc.createDataChannel('chess');
    setupChessChannel(chessChannel);

    flappyBirdChannel = pc.createDataChannel('flappybird');
    setupFlappyBirdChannel(flappyBirdChannel);

    doomChannel = pc.createDataChannel('doom');
    setupDoomChannel(doomChannel);

    // Create and set local description
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    // Wait for ICE gathering to complete
    await waitForIce();

    // Return complete offer with ICE candidates
    return JSON.stringify(pc.localDescription);
  }

  /**
   * Waits for ICE gathering to complete
   * @returns {Promise<void>}
   */
  function waitForIce() {
    return new Promise((resolve) => {
      const checkIce = () => {
        if (iceDone) {
          resolve();
        } else {
          setTimeout(checkIce, 100);
        }
      };
      checkIce();
    });
  }

  /**
   * Applies a remote SDP offer or answer
   * @param {string} sdpJson - JSON-encoded SDP
   * @returns {Promise<void>}
   */
  async function applyRemoteDescription(sdpJson) {
    const pc = ensurePeerConnection();
    const desc = JSON.parse(sdpJson);
    await pc.setRemoteDescription(new RTCSessionDescription(desc));
  }

  /**
   * Creates an answer to a remote offer
   * @returns {Promise<string>} JSON-encoded SDP answer
   */
  async function createAnswer() {
    const pc = ensurePeerConnection();
    iceDone = false;

    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);

    // Wait for ICE gathering to complete
    await waitForIce();

    return JSON.stringify(pc.localDescription);
  }

  /**
   * Restarts ICE negotiation
   * @returns {Promise<string>} New SDP offer with ICE restart
   */
  async function restartIce() {
    const pc = ensurePeerConnection();
    iceDone = false;

    const offer = await pc.createOffer({ iceRestart: true });
    await pc.setLocalDescription(offer);

    await waitForIce();

    return JSON.stringify(pc.localDescription);
  }

  /**
   * Disconnects and cleans up the peer connection
   */
  function disconnect() {
    if (dataChannel) {
      dataChannel.close();
      dataChannel = null;
    }
    if (controlChannel) {
      controlChannel.close();
      controlChannel = null;
    }
    if (imageChannel) {
      imageChannel.close();
      imageChannel = null;
    }
    if (fileChannel) {
      fileChannel.close();
      fileChannel = null;
    }
    if (pongChannel) {
      pongChannel.close();
      pongChannel = null;
    }
    if (triviaChannel) {
      triviaChannel.close();
      triviaChannel = null;
    }
    if (chessChannel) {
      chessChannel.close();
      chessChannel = null;
    }
    if (flappyBirdChannel) {
      flappyBirdChannel.close();
      flappyBirdChannel = null;
    }
    if (doomChannel) {
      doomChannel.close();
      doomChannel = null;
    }
    if (peerConnection) {
      peerConnection.close();
      peerConnection = null;
    }
    if (remoteStream) {
      remoteStream.getTracks().forEach(track => track.stop());
      remoteStream = null;
    }

    iceDone = false;
    setChannelReady(false);
    setControlChannelReady(false);
    setIsRemoteScreenActive(false);
    setStatus(t.status.waiting);
    setChannelStatus(t.status.channelClosed);
  }

  /**
   * Sends a message on the chat channel
   * @param {string} text - Message text to send
   * @returns {boolean} True if sent successfully
   */
  function sendChatMessage(text) {
    if (dataChannel && dataChannel.readyState === 'open') {
      const message = JSON.stringify({ type: 'chat', text });
      dataChannel.send(message);
      return true;
    }
    return false;
  }

  /**
   * Sends a message on the control channel
   * @param {Object} data - Control message data
   * @returns {boolean} True if sent successfully
   */
  function sendControlMessage(data) {
    if (controlChannel && controlChannel.readyState === 'open') {
      controlChannel.send(JSON.stringify(data));
      return true;
    }
    return false;
  }

  /**
   * Gets the remote media stream
   * @returns {MediaStream|null} The remote media stream
   */
  function getRemoteStream() {
    return remoteStream;
  }

  /**
   * Gets the peer connection instance
   * @returns {RTCPeerConnection|null} The peer connection
   */
  function getPeerConnection() {
    return peerConnection;
  }

  /**
   * Gets all data channels
   * @returns {Object} Object containing all data channels
   */
  function getChannels() {
    return {
      dataChannel,
      controlChannel,
      imageChannel,
      fileChannel,
      pongChannel,
      triviaChannel,
      chessChannel,
      flappyBirdChannel,
      doomChannel
    };
  }

  // Return public API
  return {
    ensurePeerConnection,
    createOffer,
    applyRemoteDescription,
    createAnswer,
    restartIce,
    disconnect,
    sendChatMessage,
    sendControlMessage,
    getRemoteStream,
    getPeerConnection,
    getChannels
  };
}
