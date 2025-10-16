/**
 * Peer-to-peer WebRTC chat application bootstrap.
 * Allows two browsers to exchange messages without a signaling server.
 */
(function () {
  const { useState, useRef, useCallback, useEffect } = React;

  const EXPECTED_CHANNEL_LABEL = 'chat';
  const CONTROL_CHANNEL_LABEL = 'control';
  const MAX_MESSAGE_LENGTH = 2000;
  const MAX_MESSAGES_PER_INTERVAL = 30;
  const MESSAGE_INTERVAL_MS = 5000;
  const OPENAI_MODEL = 'gpt-4o-mini';
  const THEME_STORAGE_KEY = 'thecommunity.theme-preference';
  const THEME_OPTIONS = {
    LIGHT: 'light',
    DARK: 'dark'
  };

  const ROLE_LABELS = {
    local: 'You',
    remote: 'Peer',
    system: 'Notice'
  };

  const CONTROL_MESSAGE_TYPES = {
    POINTER: 'pointer',
    POINTER_VISIBILITY: 'pointer-visibility',
    KEYBOARD: 'keyboard',
    PERMISSION: 'permission',
    ACTION: 'action'
  };

  /**
   * Determines the initial theme, preferring stored settings, then system preference.
   * @returns {{theme: 'light'|'dark', isStored: boolean}}
   */
  function resolveInitialTheme() {
    if (typeof window === 'undefined') {
      return { theme: THEME_OPTIONS.DARK, isStored: false };
    }
    try {
      const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
      if (storedTheme === THEME_OPTIONS.LIGHT || storedTheme === THEME_OPTIONS.DARK) {
        if (typeof document !== 'undefined') {
          document.documentElement.dataset.theme = storedTheme;
        }
        return { theme: storedTheme, isStored: true };
      }
    } catch (error) {
      console.warn('Theme preference could not be read from storage.', error);
    }
    const prefersDark = typeof window.matchMedia === 'function'
      && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const detectedTheme = prefersDark ? THEME_OPTIONS.DARK : THEME_OPTIONS.LIGHT;
    if (typeof document !== 'undefined') {
      document.documentElement.dataset.theme = detectedTheme;
    }
    return { theme: detectedTheme, isStored: false };
  }

  /**
   * Root React component that coordinates WebRTC setup and the user interface.
   * @returns {React.ReactElement}
   */
  function App() {
    const initialThemeRef = useRef(null);
    if (!initialThemeRef.current) {
      initialThemeRef.current = resolveInitialTheme();
    }
    const [theme, setTheme] = useState(initialThemeRef.current.theme);
    const hasStoredThemeRef = useRef(initialThemeRef.current.isStored);
    const [status, setStatus] = useState('Waiting to connect...');
    const [channelStatus, setChannelStatus] = useState('Channel closed');
    const [localSignal, setLocalSignal] = useState('');
    const [remoteSignal, setRemoteSignal] = useState('');
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    const [channelReady, setChannelReady] = useState(false);
    const [isCreatingOffer, setIsCreatingOffer] = useState(false);
    const [isCreatingAnswer, setIsCreatingAnswer] = useState(false);
    const [isSignalingCollapsed, setIsSignalingCollapsed] = useState(false);
    const [isAboutOpen, setIsAboutOpen] = useState(false);
    const [contributors, setContributors] = useState([]);
    const [contributorsError, setContributorsError] = useState('');
    const [isLoadingContributors, setIsLoadingContributors] = useState(false);
    const [copyButtonText, setCopyButtonText] = useState('Copy');
    const [openAiKey, setOpenAiKey] = useState('');
    const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(true);
    const [apiKeyInput, setApiKeyInput] = useState('');
    const [apiKeyError, setApiKeyError] = useState('');
    const [isAiBusy, setIsAiBusy] = useState(false);
    const [aiStatus, setAiStatus] = useState('');
    const [aiError, setAiError] = useState('');
    const [isScreenSharing, setIsScreenSharing] = useState(false);
    const [shareSystemAudio, setShareSystemAudio] = useState(false);
    const [isRemoteScreenActive, setIsRemoteScreenActive] = useState(false);
    const [controlChannelReady, setControlChannelReady] = useState(false);
    const [isRemoteControlAllowed, setIsRemoteControlAllowed] = useState(false);
    const [canControlPeer, setCanControlPeer] = useState(false);
    const [remoteControlStatus, setRemoteControlStatus] = useState('Control disabled');
    const [remotePointerState, setRemotePointerState] = useState({ visible: false, x: 50, y: 50 });

    const pcRef = useRef(null);
    const channelRef = useRef(null);
    const controlChannelRef = useRef(null);
    const iceDoneRef = useRef(false);
    const screenSenderRef = useRef(null);
    const screenAudioSenderRef = useRef(null);
    const screenStreamRef = useRef(null);
    const remoteScreenStreamRef = useRef(null);
    const incomingTimestampsRef = useRef([]);
    const messageIdRef = useRef(0);
    const messagesContainerRef = useRef(null);
    const aboutButtonRef = useRef(null);
    const closeAboutButtonRef = useRef(null);
    const contributorsLoadedRef = useRef(false);
    const apiKeyButtonRef = useRef(null);
    const apiKeyInputRef = useRef(null);
    const localScreenVideoRef = useRef(null);
    const remoteScreenVideoRef = useRef(null);
    const remotePointerTimeoutRef = useRef(null);
    const remoteControlSurfaceRef = useRef(null);
    const lastPointerSendRef = useRef(0);
    const remoteControlAllowedRef = useRef(false);
    const canControlPeerRef = useRef(false);
    const remoteScreenActiveRef = useRef(false);

    /**
     * Queues a chat message for rendering.
     * @param {string} text - Message body
     * @param {'local'|'remote'|'system'} role - Message origin
     */
    const appendMessage = useCallback((text, role) => {
      const id = messageIdRef.current++;
      setMessages((prev) => [...prev, { id, text, role }]);
    }, []);

    /**
     * Adds a system notification to the message list.
     * @param {string} text - Notification text
     */
    const appendSystemMessage = useCallback((text) => {
      appendMessage(text, 'system');
    }, [appendMessage]);

    const handleToggleTheme = useCallback(() => {
      setTheme((prevTheme) => {
        const nextTheme = prevTheme === THEME_OPTIONS.DARK ? THEME_OPTIONS.LIGHT : THEME_OPTIONS.DARK;
        appendSystemMessage(`Theme switched to ${nextTheme === THEME_OPTIONS.DARK ? 'dark' : 'light'} mode.`);
        return nextTheme;
      });
      hasStoredThemeRef.current = true;
    }, [appendSystemMessage]);

    const handleOpenApiKeyModal = useCallback(() => {
      setApiKeyInput(openAiKey);
      setApiKeyError('');
      setIsApiKeyModalOpen(true);
      setIsAboutOpen(false);
    }, [openAiKey, setIsAboutOpen]);

    const handleCloseApiKeyModal = useCallback(() => {
      setIsApiKeyModalOpen(false);
      setApiKeyError('');
      setApiKeyInput('');
    }, []);

    const handleContinueWithoutAi = useCallback(() => {
      handleCloseApiKeyModal();
      setAiStatus('');
      setAiError('');
      appendSystemMessage('Continuing without AI assistance. You can add a key later from the Chat section.');
    }, [appendSystemMessage, handleCloseApiKeyModal]);

    const handleSaveApiKey = useCallback((event) => {
      if (event && typeof event.preventDefault === 'function') {
        event.preventDefault();
      }
      const trimmed = apiKeyInput.trim();
      if (!trimmed) {
        setApiKeyError('Provide an OpenAI API key to enable AI assistance.');
        return;
      }
      setOpenAiKey(trimmed);
      setAiStatus('OpenAI assistance ready. Review suggestions before sending.');
      setAiError('');
      appendSystemMessage('OpenAI API key stored only in this browser session. Refresh the page to clear it.');
      handleCloseApiKeyModal();
    }, [apiKeyInput, appendSystemMessage, handleCloseApiKeyModal]);

    const handleDisableAi = useCallback(() => {
      setOpenAiKey('');
      setAiStatus('');
      setAiError('');
      appendSystemMessage('AI assistance disabled. Messages will be sent without AI help.');
      handleCloseApiKeyModal();
    }, [appendSystemMessage, handleCloseApiKeyModal]);

    /**
     * Configures event handlers on the reliable chat channel.
     * Applies defensive checks and rate limiting to inbound traffic.
     * @param {RTCDataChannel} channel - Active data channel
     */
    const setupChatChannel = useCallback((channel) => {
      channel.onopen = () => {
        setChannelStatus('Channel open');
        setChannelReady(true);
        setIsSignalingCollapsed(true);
        incomingTimestampsRef.current = [];
      };
      channel.onclose = () => {
        setChannelStatus('Channel closed');
        setChannelReady(false);
        setIsSignalingCollapsed(false);
        incomingTimestampsRef.current = [];
        channelRef.current = null;
      };
      channel.onmessage = (event) => {
        if (typeof event.data !== 'string') {
          appendSystemMessage('Security notice: blocked a message that was not plain text.');
          return;
        }
        const payload = event.data;
        if (payload.length > MAX_MESSAGE_LENGTH) {
          appendSystemMessage(`Message blocked: exceeded the ${MAX_MESSAGE_LENGTH} character limit.`);
          return;
        }
        const now = Date.now();
        incomingTimestampsRef.current = incomingTimestampsRef.current.filter(
          (timestamp) => now - timestamp < MESSAGE_INTERVAL_MS
        );
        incomingTimestampsRef.current.push(now);
        if (incomingTimestampsRef.current.length > MAX_MESSAGES_PER_INTERVAL) {
          appendSystemMessage('Rate limit applied: peer is sending messages too quickly.');
          return;
        }
        appendMessage(payload, 'remote');
      };
    }, [appendMessage, appendSystemMessage]);

    /**
     * Processes inbound control-channel payloads (populated in Step 4).
     * @param {string} payload - Raw channel message
     */
    const handleIncomingControlMessage = useCallback((payload) => {
      if (typeof payload !== 'string' || !payload) {
        return;
      }
      let message;
      try {
        message = JSON.parse(payload);
      } catch (error) {
        console.warn('Discarded malformed control message', error);
        return;
      }
      if (!message || typeof message !== 'object') {
        return;
      }
      switch (message.type) {
        case CONTROL_MESSAGE_TYPES.PERMISSION: {
          if (typeof message.allowed !== 'boolean') {
            return;
          }
          const allowed = Boolean(message.allowed);
          if (canControlPeerRef.current !== allowed) {
            appendSystemMessage(allowed
              ? 'Peer enabled remote control. Use the screen preview to interact.'
              : 'Peer disabled remote control.');
          }
          canControlPeerRef.current = allowed;
          setCanControlPeer(allowed);
          setRemoteControlStatus(allowed ? 'Control granted - interact with peer screen' : 'Control disabled by peer');
          if (!allowed) {
            lastPointerSendRef.current = 0;
          }
          return;
        }
        case CONTROL_MESSAGE_TYPES.POINTER: {
          if (!isRemoteControlAllowed || !isScreenSharing) {
            return;
          }
          if (message.kind !== 'move' && message.kind !== 'click') {
            return;
          }
          const x = Number(message.x);
          const y = Number(message.y);
          if (!Number.isFinite(x) || !Number.isFinite(y)) {
            return;
          }
          showRemotePointer(x, y);
          if (message.kind === 'click') {
            const button = typeof message.button === 'string' ? message.button : 'left';
            performRemoteClick(x, y, button);
          }
          return;
        }
        case CONTROL_MESSAGE_TYPES.POINTER_VISIBILITY: {
          if (!isRemoteControlAllowed) {
            return;
          }
          if (message.visible === false) {
            hideRemotePointer();
          }
          return;
        }
        case CONTROL_MESSAGE_TYPES.KEYBOARD: {
          if (!isRemoteControlAllowed) {
            return;
          }
          handleRemoteKeyboardInput(message);
          return;
        }
        case CONTROL_MESSAGE_TYPES.ACTION: {
          if (!isRemoteControlAllowed) {
            return;
          }
          if (message.action === 'clear-input') {
            applyRemoteInputTransform(() => '');
          }
          return;
        }
        default:
      }
    }, [appendSystemMessage, applyRemoteInputTransform, handleRemoteKeyboardInput, hideRemotePointer, isRemoteControlAllowed, isScreenSharing, performRemoteClick, setCanControlPeer, setRemoteControlStatus, showRemotePointer]);

    /**
     * Configures event handlers for the auxiliary control data channel.
     * @param {RTCDataChannel} channel - Control channel instance
     */
    const setupControlChannel = useCallback((channel) => {
      channel.onopen = () => {
        controlChannelRef.current = channel;
        setControlChannelReady(true);
        setRemoteControlStatus('Control disabled');
      };
      channel.onclose = () => {
        if (controlChannelRef.current === channel) {
          controlChannelRef.current = null;
        }
        setControlChannelReady(false);
        setCanControlPeer(false);
        canControlPeerRef.current = false;
        remoteControlAllowedRef.current = false;
        setIsRemoteControlAllowed(false);
        hideRemotePointer();
        setRemoteControlStatus('Control channel closed');
      };
      channel.onmessage = (event) => {
        if (typeof event.data !== 'string') {
          return;
        }
        handleIncomingControlMessage(event.data);
      };
    }, [handleIncomingControlMessage, hideRemotePointer]);

    /**
     * Lazily creates (or returns) the RTCPeerConnection instance.
     * @returns {RTCPeerConnection}
     */
    const ensurePeerConnection = useCallback(() => {
      if (pcRef.current) {
        return pcRef.current;
      }
      const pc = new RTCPeerConnection({ iceServers: [] });
      pcRef.current = pc;

      const remoteStream = new MediaStream();
      remoteScreenStreamRef.current = remoteStream;
      if (!screenSenderRef.current) {
        const videoTransceiver = pc.addTransceiver('video', { direction: 'sendrecv' });
        screenSenderRef.current = videoTransceiver.sender;
      }
      if (!screenAudioSenderRef.current) {
        const audioTransceiver = pc.addTransceiver('audio', { direction: 'sendrecv' });
        screenAudioSenderRef.current = audioTransceiver.sender;
      }

      pc.onicecandidate = (event) => {
        if (!event.candidate && pc.localDescription) {
          iceDoneRef.current = true;
          setLocalSignal(JSON.stringify(pc.localDescription));
          setStatus('Signal ready to share');
        }
      };

      pc.oniceconnectionstatechange = () => {
        if (!pcRef.current) return;
        setStatus(`ICE: ${pc.iceConnectionState}`);
      };

      pc.onconnectionstatechange = () => {
        if (!pcRef.current) return;
        setStatus(`Connection: ${pc.connectionState}`);
      };

      pc.ontrack = (event) => {
        if (!remoteScreenStreamRef.current) {
          remoteScreenStreamRef.current = new MediaStream();
        }
        const targetStream = remoteScreenStreamRef.current;
        const track = event.track;
        if (!targetStream.getTracks().includes(track)) {
          targetStream.addTrack(track);
        }
        if (remoteScreenVideoRef.current && remoteScreenVideoRef.current.srcObject !== targetStream) {
          remoteScreenVideoRef.current.srcObject = targetStream;
        }
        if (track.kind === 'video') {
          setIsRemoteScreenActive(true);
        }
        track.onended = () => {
          if (track.kind === 'video') {
            setIsRemoteScreenActive(false);
          }
          if (targetStream.getTracks().includes(track)) {
            targetStream.removeTrack(track);
          }
        };
      };

      pc.ondatachannel = (event) => {
        const incomingChannel = event.channel;
        if (incomingChannel.label === EXPECTED_CHANNEL_LABEL) {
          channelRef.current = incomingChannel;
          setupChatChannel(incomingChannel);
          return;
        }
        if (incomingChannel.label === CONTROL_CHANNEL_LABEL) {
          setupControlChannel(incomingChannel);
          return;
        }
        appendSystemMessage(`Security notice: blocked unexpected data channel "${incomingChannel.label || 'unnamed'}".`);
        incomingChannel.close();
      };

      return pc;
    }, [appendSystemMessage, setupChatChannel, setupControlChannel]);

    /**
     * Resolves once ICE gathering finishes for the current connection.
     * @returns {Promise<void>}
     */
    const waitForIce = useCallback(async () => {
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
    }, []);

    /**
     * Validates and parses the remote offer/answer JSON pasted by the user.
     * @returns {RTCSessionDescriptionInit}
     * @throws {Error} When the payload is empty or malformed
     */
    const parseRemoteDescription = useCallback(() => {
      const raw = remoteSignal.trim();
      if (!raw) {
        throw new Error('Remote signal is empty. Paste the JSON you received from your peer.');
      }
      let desc;
      try {
        desc = JSON.parse(raw);
      } catch (err) {
        throw new Error('Remote signal is not valid JSON. Copy the complete signal again and retry.');
      }
      if (!desc.type || !desc.sdp || !['offer', 'answer'].includes(desc.type)) {
        throw new Error('Remote signal is missing required data. Ensure you pasted the offer or answer exactly as provided.');
      }
      return desc;
    }, [remoteSignal]);

    /**
     * Generates a WebRTC offer and prepares it for manual sharing.
     * @returns {Promise<void>}
     */
    const handleCreateOffer = useCallback(async () => {
      const pc = ensurePeerConnection();
      if (channelRef.current) {
        channelRef.current.close();
        channelRef.current = null;
      }
      if (controlChannelRef.current) {
        controlChannelRef.current.close();
        controlChannelRef.current = null;
      }
      setControlChannelReady(false);
      setCanControlPeer(false);
      canControlPeerRef.current = false;
      setRemoteControlStatus('Control disabled');

      const channel = pc.createDataChannel(EXPECTED_CHANNEL_LABEL);
      channelRef.current = channel;
      setupChatChannel(channel);

      const controlChannel = pc.createDataChannel(CONTROL_CHANNEL_LABEL);
      controlChannelRef.current = controlChannel;
      setupControlChannel(controlChannel);

      incomingTimestampsRef.current = [];
      iceDoneRef.current = false;
      setLocalSignal('');
      setRemoteSignal('');
      setChannelReady(false);
      setStatus('Creating offer...');
      setIsCreatingOffer(true);

      try {
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        await waitForIce();
      } catch (err) {
        console.error(err);
        setStatus('Failed to create offer');
        appendSystemMessage('Unable to create offer. WebRTC may be unsupported or browser permissions were denied.');
      } finally {
        setIsCreatingOffer(false);
      }
    }, [appendSystemMessage, ensurePeerConnection, setupChatChannel, setupControlChannel, waitForIce]);

    /**
     * Applies the pasted remote offer or answer to the peer connection.
     * @returns {Promise<void>}
     */
    const handleApplyRemote = useCallback(async () => {
      const pc = ensurePeerConnection();
      try {
        const desc = parseRemoteDescription();
        await pc.setRemoteDescription(desc);
        setStatus(`Remote ${desc.type} applied`);
        if (desc.type === 'answer') {
          setChannelStatus('Answer applied, waiting for channel...');
        }
      } catch (err) {
        console.error(err);
        setStatus(err.message);
      }
    }, [ensurePeerConnection, parseRemoteDescription]);

    /**
     * Produces an answer for an applied offer and shares it with the peer.
     * @returns {Promise<void>}
     */
    const handleCreateAnswer = useCallback(async () => {
      const pc = ensurePeerConnection();
      iceDoneRef.current = false;
      setLocalSignal('');
      setChannelReady(false);
      setStatus('Creating answer...');
      setIsCreatingAnswer(true);

      try {
        if (!pc.currentRemoteDescription) {
          const desc = parseRemoteDescription();
          if (desc.type !== 'offer') {
            throw new Error('Need a remote offer before creating an answer.');
          }
          await pc.setRemoteDescription(desc);
        }
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        await waitForIce();
      } catch (err) {
        console.error(err);
        setStatus(err.message || 'Failed to create answer');
        appendSystemMessage('Unable to create answer. Apply a valid remote offer first and ensure WebRTC is available.');
      } finally {
        setIsCreatingAnswer(false);
      }
    }, [appendSystemMessage, ensurePeerConnection, parseRemoteDescription, waitForIce]);

    const handleStopScreenShare = useCallback(() => {
      const stream = screenStreamRef.current;
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
      if (screenSenderRef.current) {
        try {
          screenSenderRef.current.replaceTrack(null);
        } catch (error) {
          console.warn('Failed to clear screen video sender', error);
        }
      }
      if (screenAudioSenderRef.current) {
        try {
          screenAudioSenderRef.current.replaceTrack(null);
        } catch (error) {
          console.warn('Failed to clear screen audio sender', error);
        }
      }
      if (localScreenVideoRef.current) {
        localScreenVideoRef.current.srcObject = null;
      }
      if (isScreenSharing) {
        appendSystemMessage('Screen sharing stopped.');
      }
      if (remoteControlAllowedRef.current) {
        sendControlMessage({
          type: CONTROL_MESSAGE_TYPES.PERMISSION,
          allowed: false
        });
        hideRemotePointer();
        appendSystemMessage('Remote control disabled because screen sharing stopped.');
      }
      remoteControlAllowedRef.current = false;
      setIsRemoteControlAllowed(false);
      setRemoteControlStatus('Control disabled');
      setIsScreenSharing(false);
    }, [appendSystemMessage, hideRemotePointer, isScreenSharing, sendControlMessage]);

    const handleStartScreenShare = useCallback(async () => {
      if (isScreenSharing) {
        return;
      }
      let stream = null;
      try {
        if (!navigator.mediaDevices || typeof navigator.mediaDevices.getDisplayMedia !== 'function') {
          appendSystemMessage('Screen sharing is not supported in this browser.');
          return;
        }
        const pc = ensurePeerConnection();
        if (!pc) {
          throw new Error('Peer connection is not ready.');
        }
        stream = await navigator.mediaDevices.getDisplayMedia({
          video: { cursor: 'always' },
          audio: shareSystemAudio ? { echoCancellation: false, noiseSuppression: false } : false
        });
        const [videoTrack] = stream.getVideoTracks();
        if (!videoTrack) {
          stream.getTracks().forEach((track) => track.stop());
          throw new Error('No video track returned by screen capture.');
        }
        if (screenSenderRef.current) {
          await screenSenderRef.current.replaceTrack(videoTrack);
        }
        const [audioTrack] = stream.getAudioTracks();
        if (screenAudioSenderRef.current) {
          await screenAudioSenderRef.current.replaceTrack(audioTrack || null);
        }
        screenStreamRef.current = stream;
        if (localScreenVideoRef.current) {
          localScreenVideoRef.current.srcObject = stream;
        }
        setIsScreenSharing(true);
        appendSystemMessage('Screen sharing started. Be mindful of sensitive information.');
        videoTrack.onended = () => {
          handleStopScreenShare();
        };
      } catch (error) {
        console.error('Screen share failed', error);
        if (stream) {
          stream.getTracks().forEach((track) => {
            try {
              track.stop();
            } catch (stopError) {
              console.warn('Failed to stop captured track after error', stopError);
            }
          });
        }
        appendSystemMessage(`Screen share failed: ${error && error.message ? error.message : 'permission was denied.'}`);
        setIsScreenSharing(false);
      }
    }, [appendSystemMessage, ensurePeerConnection, handleStopScreenShare, isScreenSharing, shareSystemAudio]);

    const sendControlMessage = useCallback((message) => {
      if (!message || typeof message !== 'object') {
        return;
      }
      const channel = controlChannelRef.current;
      if (!channel || channel.readyState !== 'open') {
        return;
      }
      try {
        channel.send(JSON.stringify(message));
      } catch (error) {
        console.warn('Failed to send control message', error);
      }
    }, []);

    const hideRemotePointer = useCallback(() => {
      if (remotePointerTimeoutRef.current) {
        clearTimeout(remotePointerTimeoutRef.current);
        remotePointerTimeoutRef.current = null;
      }
      setRemotePointerState((prev) => (prev.visible ? { ...prev, visible: false } : prev));
    }, []);

    const showRemotePointer = useCallback((xPercent, yPercent) => {
      const clampedX = Math.min(100, Math.max(0, Number(xPercent)));
      const clampedY = Math.min(100, Math.max(0, Number(yPercent)));
      setRemotePointerState({ visible: true, x: clampedX, y: clampedY });
      if (remotePointerTimeoutRef.current) {
        clearTimeout(remotePointerTimeoutRef.current);
      }
      remotePointerTimeoutRef.current = setTimeout(() => {
        setRemotePointerState((prev) => (prev.visible ? { ...prev, visible: false } : prev));
      }, 1200);
    }, []);

    const performRemoteClick = useCallback((xPercent, yPercent, button = 'left') => {
      if (button !== 'left') {
        return;
      }
      const viewportWidth = window.innerWidth || document.documentElement.clientWidth || 0;
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight || 0;
      const clientX = (Number(xPercent) / 100) * viewportWidth;
      const clientY = (Number(yPercent) / 100) * viewportHeight;
      if (!Number.isFinite(clientX) || !Number.isFinite(clientY)) {
        return;
      }
      const target = document.elementFromPoint(clientX, clientY);
      if (!target) {
        return;
      }
      const mainElement = document.querySelector('main');
      if (mainElement && !mainElement.contains(target)) {
        return;
      }
      const input = target.closest('input, textarea');
      if (input instanceof HTMLInputElement || input instanceof HTMLTextAreaElement) {
        input.focus({ preventScroll: true });
        const valueLength = typeof input.value === 'string' ? input.value.length : 0;
        if (typeof input.setSelectionRange === 'function') {
          input.setSelectionRange(valueLength, valueLength);
        }
      }
      // Intentionally ignore button clicks and other controls for security.
    }, []);

    const applyRemoteInputTransform = useCallback((transform) => {
      setInputText((prev) => {
        const base = typeof prev === 'string' ? prev : '';
        const nextValue = transform(base);
        if (typeof nextValue !== 'string') {
          return base;
        }
        return nextValue.length > MAX_MESSAGE_LENGTH
          ? nextValue.slice(0, MAX_MESSAGE_LENGTH)
          : nextValue;
      });
    }, []);

    const handleRemoteKeyboardInput = useCallback((message) => {
      if (!message || typeof message.mode !== 'string') {
        return;
      }
      const inputEl = document.getElementById('outgoing');
      if (inputEl && typeof inputEl.focus === 'function') {
        inputEl.focus({ preventScroll: true });
      }
      setAiStatus('');
      setAiError('');
      if (message.mode === 'text') {
        const raw = typeof message.value === 'string' ? message.value : '';
        const sanitized = raw.replace(/[\r\n\t]/g, '').slice(0, 32);
        if (!sanitized) {
          return;
        }
        applyRemoteInputTransform((prev) => `${prev}${sanitized}`);
        return;
      }
      if (message.mode === 'backspace') {
        applyRemoteInputTransform((prev) => prev.slice(0, Math.max(0, prev.length - 1)));
        return;
      }
      if (message.mode === 'enter') {
        handleSend();
      }
    }, [applyRemoteInputTransform, handleSend]);

    const handleToggleRemoteControl = useCallback(() => {
      if (!controlChannelReady) {
        appendSystemMessage('Remote control is unavailable until the control channel is ready.');
        return;
      }
      const channel = controlChannelRef.current;
      if (!channel || channel.readyState !== 'open') {
        appendSystemMessage('Remote control channel is still negotiating. Try again in a moment.');
        return;
      }
      if (!isScreenSharing) {
        appendSystemMessage('Start sharing your screen before enabling remote control.');
        return;
      }
      const next = !isRemoteControlAllowed;
      remoteControlAllowedRef.current = next;
      setIsRemoteControlAllowed(next);
      if (next) {
        setRemoteControlStatus('Remote control enabled - peer may interact');
        appendSystemMessage('Peer can now control your shared screen. Keep an eye on activity.');
      } else {
        setRemoteControlStatus('Control disabled');
        hideRemotePointer();
        appendSystemMessage('Remote control disabled for your shared screen.');
      }
      sendControlMessage({
        type: CONTROL_MESSAGE_TYPES.PERMISSION,
        allowed: next
      });
    }, [appendSystemMessage, controlChannelReady, hideRemotePointer, isRemoteControlAllowed, isScreenSharing, sendControlMessage]);

    /**
     * Sends the typed message across the data channel after validation.
     */
    const handleSend = useCallback(() => {
      const channel = channelRef.current;
      const trimmed = inputText.trim();
      if (!channel || channel.readyState !== 'open' || !trimmed) {
        return;
      }
      if (trimmed.length > MAX_MESSAGE_LENGTH) {
        appendSystemMessage(`Message too long: limit is ${MAX_MESSAGE_LENGTH} characters (you typed ${trimmed.length}).`);
        return;
      }
      channel.send(trimmed);
      appendMessage(trimmed, 'local');
      setInputText('');
      setAiStatus('');
      setAiError('');
    }, [appendMessage, appendSystemMessage, inputText]);

    const toggleSignalingCollapse = useCallback(() => {
      setIsSignalingCollapsed((prev) => !prev);
    }, []);

    const toggleAbout = useCallback(() => {
      setIsAboutOpen((prev) => !prev);
    }, []);

    /**
     * Copies the current local signal to the clipboard for easy sharing.
     */
    const handleCopySignal = useCallback(async () => {
      if (!localSignal) {
        return;
      }
      try {
        await navigator.clipboard.writeText(localSignal);
        setCopyButtonText('Copied!');
        setTimeout(() => setCopyButtonText('Copy'), 2000);
      } catch (err) {
        console.error('Failed to copy local signal', err);
        setCopyButtonText('Failed');
        setTimeout(() => setCopyButtonText('Copy'), 2000);
      }
    }, [localSignal]);

    /**
     * Clears all messages from the chat history.
     */
    const handleClearMessages = useCallback(() => {
      setMessages([]);
      appendSystemMessage('Chat history cleared.');
    }, [appendSystemMessage]);

    /**
     * Terminates the current peer connection and resets signaling state.
     */
    const handleDisconnect = useCallback(() => {
      if (channelRef.current) {
        channelRef.current.close();
        channelRef.current = null;
      }
      if (controlChannelRef.current) {
        controlChannelRef.current.close();
        controlChannelRef.current = null;
      }
      if (pcRef.current) {
        pcRef.current.close();
        pcRef.current = null;
      }
      if (screenSenderRef.current) {
        try {
          screenSenderRef.current.replaceTrack(null);
        } catch (error) {
          console.warn('Failed to clear screen video track', error);
        }
      }
      if (screenAudioSenderRef.current) {
        try {
          screenAudioSenderRef.current.replaceTrack(null);
        } catch (error) {
          console.warn('Failed to clear screen audio track', error);
        }
      }
      if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach((track) => {
          try {
            track.stop();
          } catch (error) {
            console.warn('Failed to stop screen share track', error);
          }
        });
        screenStreamRef.current = null;
      }
      iceDoneRef.current = false;
      incomingTimestampsRef.current = [];
      setChannelReady(false);
      setChannelStatus('Channel closed');
      setStatus('Disconnected');
      setLocalSignal('');
      setRemoteSignal('');
      setIsSignalingCollapsed(false);
      appendSystemMessage('Connection closed. Create a new offer to reconnect.');
      setAiStatus('');
      setAiError('');
      setIsScreenSharing(false);
      setIsRemoteScreenActive(false);
      setControlChannelReady(false);
      setIsRemoteControlAllowed(false);
      remoteControlAllowedRef.current = false;
      setCanControlPeer(false);
      canControlPeerRef.current = false;
      setRemoteControlStatus('Control disabled');
      setRemotePointerState({ visible: false, x: 50, y: 50 });
      setShareSystemAudio(false);
      if (remotePointerTimeoutRef.current) {
        clearTimeout(remotePointerTimeoutRef.current);
        remotePointerTimeoutRef.current = null;
      }
      if (remoteScreenStreamRef.current) {
        remoteScreenStreamRef.current.getTracks().forEach((track) => {
          if (typeof track.stop === 'function') {
            track.stop();
          }
        });
        remoteScreenStreamRef.current = null;
      }
      if (localScreenVideoRef.current) {
        localScreenVideoRef.current.srcObject = null;
      }
      if (remoteScreenVideoRef.current) {
        remoteScreenVideoRef.current.srcObject = null;
      }
    }, [appendSystemMessage]);

    const handleAiRewrite = useCallback(async () => {
      const draft = inputText.trim();
      if (!draft) {
        return;
      }
      if (!openAiKey) {
        setApiKeyInput(openAiKey);
        setApiKeyError('Add your OpenAI API key to enable AI rewriting.');
        setIsApiKeyModalOpen(true);
        setIsAboutOpen(false);
        return;
      }
      if (draft.length > MAX_MESSAGE_LENGTH) {
        appendSystemMessage(`AI rewrite not attempted: drafts must be under ${MAX_MESSAGE_LENGTH} characters.`);
        return;
      }
      setIsAiBusy(true);
      setAiStatus('Requesting AI rewrite...');
      setAiError('');
      try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${openAiKey}`
          },
          body: JSON.stringify({
            model: OPENAI_MODEL,
            messages: [
              {
                role: 'system',
                content:
                  'You rewrite chat drafts to stay concise, friendly, and clear. Preserve intent, remove sensitive data, and return only the revised message.'
              },
              {
                role: 'user',
                content: draft
              }
            ],
            temperature: 0.7,
            max_tokens: 256
          })
        });
        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            throw new Error('OpenAI rejected the request. Check that your API key is correct and has required access.');
          }
          throw new Error(`OpenAI request failed with status ${response.status}`);
        }
        const data = await response.json();
        const aiText =
          data &&
          data.choices &&
          data.choices[0] &&
          data.choices[0].message &&
          data.choices[0].message.content;
        if (!aiText) {
          throw new Error('OpenAI response missing content.');
        }
        const cleaned = aiText.trim();
        if (!cleaned) {
          throw new Error('OpenAI returned an empty suggestion.');
        }
        if (cleaned.length > MAX_MESSAGE_LENGTH) {
          setInputText(cleaned.slice(0, MAX_MESSAGE_LENGTH));
          appendSystemMessage('AI suggestion truncated to fit the message length limit.');
        } else {
          setInputText(cleaned);
        }
        setAiStatus('AI suggestion applied. Review and edit before sending.');
        setAiError('');
      } catch (error) {
        console.error('AI rewrite failed', error);
        setAiStatus('');
        setAiError(error.message || 'OpenAI request failed.');
        appendSystemMessage(`AI rewrite failed: ${error.message || 'request was rejected.'}`);
      } finally {
        setIsAiBusy(false);
      }
    }, [appendSystemMessage, inputText, openAiKey, setIsAboutOpen]);

    useEffect(() => {
      if (typeof document !== 'undefined') {
        document.documentElement.dataset.theme = theme;
      }
      if (typeof window === 'undefined') {
        return;
      }
      try {
        if (hasStoredThemeRef.current) {
          window.localStorage.setItem(THEME_STORAGE_KEY, theme);
        } else {
          window.localStorage.removeItem(THEME_STORAGE_KEY);
        }
      } catch (error) {
        console.warn('Theme preference could not be saved.', error);
      }
    }, [theme]);

    useEffect(() => {
      if (typeof window === 'undefined' || hasStoredThemeRef.current) {
        return undefined;
      }
      const media = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (event) => {
        if (hasStoredThemeRef.current) {
          return;
        }
        const nextTheme = event.matches ? THEME_OPTIONS.DARK : THEME_OPTIONS.LIGHT;
        setTheme((currentTheme) => (currentTheme === nextTheme ? currentTheme : nextTheme));
      };
      if (typeof media.addEventListener === 'function') {
        media.addEventListener('change', handleChange);
        return () => {
          media.removeEventListener('change', handleChange);
        };
      }
      media.addListener(handleChange);
      return () => {
        media.removeListener(handleChange);
      };
    }, [setTheme]);

    useEffect(() => {
      if (!localSignal) {
        setCopyButtonText('Copy');
      }
    }, [localSignal]);

    useEffect(() => {
      if (!isApiKeyModalOpen) {
        if (apiKeyButtonRef.current) {
          apiKeyButtonRef.current.focus();
        }
        return;
      }
      const focusTimer = setTimeout(() => {
        if (apiKeyInputRef.current) {
          apiKeyInputRef.current.focus();
          apiKeyInputRef.current.select();
        }
      }, 50);
      return () => {
        clearTimeout(focusTimer);
      };
    }, [isApiKeyModalOpen]);

    useEffect(() => {
      if (!isApiKeyModalOpen) {
        return;
      }
      const handleKeyDown = (event) => {
        if (event.key === 'Escape') {
          event.preventDefault();
          handleCloseApiKeyModal();
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
      };
    }, [handleCloseApiKeyModal, isApiKeyModalOpen]);

    useEffect(() => {
      if (isAboutOpen) {
        if (closeAboutButtonRef.current) {
          closeAboutButtonRef.current.focus();
        }
      } else if (!isApiKeyModalOpen && aboutButtonRef.current) {
        aboutButtonRef.current.focus();
      }
    }, [isAboutOpen, isApiKeyModalOpen]);

    useEffect(() => {
      if (!isAboutOpen) {
        return;
      }
      const handleKeyDown = (event) => {
        if (event.key === 'Escape') {
          event.preventDefault();
          setIsAboutOpen(false);
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
      };
    }, [isAboutOpen]);

    useEffect(() => {
      if (!isAboutOpen || contributorsLoadedRef.current) {
        return;
      }

      const controller = new AbortController();
      let didSucceed = false;

      const loadContributors = async () => {
        setIsLoadingContributors(true);
        setContributorsError('');
        try {
          const response = await fetch(
            'https://api.github.com/repos/TheMorpheus407/TheCommunity/issues?state=all&per_page=100',
            {
              signal: controller.signal,
              headers: {
                Accept: 'application/vnd.github+json'
              }
            }
          );

          if (!response.ok) {
            throw new Error(`Request failed with status ${response.status}`);
          }

          const payload = await response.json();
          if (controller.signal.aborted) {
            return;
          }

          const map = new Map();
          if (Array.isArray(payload)) {
            payload.forEach((item) => {
              if (!item || item.pull_request) {
                return;
              }
              const user = item.user;
              const login = user && user.login;
              if (!login) {
                return;
              }
              const sanitizedLogin = String(login).trim();
              if (!sanitizedLogin) {
                return;
              }
              const existing = map.get(sanitizedLogin);
              if (existing) {
                existing.issueCount += 1;
              } else {
                map.set(sanitizedLogin, {
                  login: sanitizedLogin,
                  htmlUrl: user && user.html_url
                    ? user.html_url
                    : `https://github.com/${encodeURIComponent(sanitizedLogin)}`,
                  issueCount: 1
                });
              }
            });
          }

          const sortedContributors = Array.from(map.values()).sort((a, b) =>
            a.login.localeCompare(b.login)
          );

          setContributors(sortedContributors);
          didSucceed = true;
        } catch (error) {
          if (controller.signal.aborted) {
            return;
          }
          console.error('Failed to load contributors', error);
          setContributorsError('Unable to load contributor list. Please try again later.');
        } finally {
          if (!controller.signal.aborted) {
            setIsLoadingContributors(false);
            if (didSucceed) {
              contributorsLoadedRef.current = true;
            }
          }
        }
      };

      loadContributors();

      return () => {
        controller.abort();
      };
    }, [isAboutOpen]);

    useEffect(() => {
      const container = messagesContainerRef.current;
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    }, [messages]);

    useEffect(() => {
      return () => {
        if (channelRef.current) {
          channelRef.current.close();
        }
        if (pcRef.current) {
          pcRef.current.close();
        }
      };
    }, []);

    useEffect(() => {
      const localVideo = localScreenVideoRef.current;
      if (localVideo) {
        localVideo.srcObject = screenStreamRef.current || null;
      }
    }, [isScreenSharing]);

    useEffect(() => {
      const remoteVideo = remoteScreenVideoRef.current;
      if (remoteVideo) {
        remoteVideo.srcObject = remoteScreenStreamRef.current || null;
      }
    }, [isRemoteScreenActive]);

    useEffect(() => () => {
      if (remotePointerTimeoutRef.current) {
        clearTimeout(remotePointerTimeoutRef.current);
        remotePointerTimeoutRef.current = null;
      }
    }, []);

    useEffect(() => {
      if (isRemoteScreenActive && !remoteScreenActiveRef.current) {
        appendSystemMessage('Peer started sharing their screen.');
      } else if (!isRemoteScreenActive && remoteScreenActiveRef.current) {
        appendSystemMessage('Peer stopped sharing their screen.');
      }
      remoteScreenActiveRef.current = isRemoteScreenActive;
    }, [appendSystemMessage, isRemoteScreenActive]);

    useEffect(() => {
      const surface = remoteControlSurfaceRef.current;
      if (!surface || !canControlPeer) {
        return;
      }
      lastPointerSendRef.current = 0;

      const computePosition = (event) => {
        const videoElement = remoteScreenVideoRef.current;
        if (!videoElement) {
          return null;
        }
        const rect = videoElement.getBoundingClientRect();
        if (!rect.width || !rect.height) {
          return null;
        }
        const deltaX = event.clientX - rect.left;
        const deltaY = event.clientY - rect.top;
        if (deltaX < 0 || deltaY < 0 || deltaX > rect.width || deltaY > rect.height) {
          return null;
        }
        const percentX = (deltaX / rect.width) * 100;
        const percentY = (deltaY / rect.height) * 100;
        return {
          x: Number(percentX.toFixed(2)),
          y: Number(percentY.toFixed(2))
        };
      };

      const handlePointerDown = (event) => {
        event.preventDefault();
        surface.focus({ preventScroll: true });
        const position = computePosition(event);
        if (position) {
          sendControlMessage({
            type: CONTROL_MESSAGE_TYPES.POINTER,
            kind: 'move',
            x: position.x,
            y: position.y
          });
          lastPointerSendRef.current = performance.now();
        }
      };

      const handlePointerMove = (event) => {
        event.preventDefault();
        const position = computePosition(event);
        if (!position) {
          if (lastPointerSendRef.current !== 0) {
            lastPointerSendRef.current = 0;
            sendControlMessage({
              type: CONTROL_MESSAGE_TYPES.POINTER_VISIBILITY,
              visible: false
            });
          }
          return;
        }
        const now = performance.now();
        if (now - lastPointerSendRef.current < 40) {
          return;
        }
        lastPointerSendRef.current = now;
        sendControlMessage({
          type: CONTROL_MESSAGE_TYPES.POINTER,
          kind: 'move',
          x: position.x,
          y: position.y
        });
      };

      const handlePointerUp = (event) => {
        event.preventDefault();
        const position = computePosition(event);
        if (!position) {
          return;
        }
        sendControlMessage({
          type: CONTROL_MESSAGE_TYPES.POINTER,
          kind: 'click',
          button: event.button === 2 ? 'right' : 'left',
          x: position.x,
          y: position.y
        });
      };

      const handlePointerLeave = () => {
        lastPointerSendRef.current = 0;
        sendControlMessage({
          type: CONTROL_MESSAGE_TYPES.POINTER_VISIBILITY,
          visible: false
        });
      };

      const handleWheel = (event) => {
        event.preventDefault();
      };

      const handleKeyDown = (event) => {
        if (event.metaKey || event.ctrlKey || event.altKey) {
          return;
        }
        if (event.key === 'Backspace') {
          event.preventDefault();
          sendControlMessage({
            type: CONTROL_MESSAGE_TYPES.KEYBOARD,
            mode: 'backspace'
          });
          return;
        }
        if (event.key === 'Enter') {
          event.preventDefault();
          sendControlMessage({
            type: CONTROL_MESSAGE_TYPES.KEYBOARD,
            mode: 'enter'
          });
          return;
        }
        if (event.key.length === 1) {
          const value = event.key;
          if (/^[\u0000-\u001F]$/.test(value)) {
            return;
          }
          event.preventDefault();
          sendControlMessage({
            type: CONTROL_MESSAGE_TYPES.KEYBOARD,
            mode: 'text',
            value
          });
        }
      };

      surface.addEventListener('pointerdown', handlePointerDown);
      surface.addEventListener('pointermove', handlePointerMove);
      surface.addEventListener('pointerup', handlePointerUp);
      surface.addEventListener('pointerleave', handlePointerLeave);
      surface.addEventListener('pointercancel', handlePointerLeave);
      surface.addEventListener('wheel', handleWheel, { passive: false });
      surface.addEventListener('keydown', handleKeyDown);

      return () => {
        surface.removeEventListener('pointerdown', handlePointerDown);
        surface.removeEventListener('pointermove', handlePointerMove);
        surface.removeEventListener('pointerup', handlePointerUp);
        surface.removeEventListener('pointerleave', handlePointerLeave);
        surface.removeEventListener('pointercancel', handlePointerLeave);
        surface.removeEventListener('wheel', handleWheel, { passive: false });
        surface.removeEventListener('keydown', handleKeyDown);
        sendControlMessage({
          type: CONTROL_MESSAGE_TYPES.POINTER_VISIBILITY,
          visible: false
        });
      };
    }, [canControlPeer, sendControlMessage]);

    useEffect(() => {
      if (canControlPeer && remoteControlSurfaceRef.current) {
        remoteControlSurfaceRef.current.focus({ preventScroll: true });
        lastPointerSendRef.current = 0;
      }
    }, [canControlPeer]);

    const isDarkTheme = theme === THEME_OPTIONS.DARK;
    const themeButtonLabel = isDarkTheme ? '🌙 Dark Mode' : '🌞 Light Mode';
    const themeToggleTitle = isDarkTheme ? 'Switch to light theme' : 'Switch to dark theme';
    const screenShareHeaderStatus = isScreenSharing
      ? 'Sharing your screen'
      : channelReady
        ? 'Ready to share'
        : 'Connect to enable screen sharing';
    const remoteScreenHeaderStatus = isRemoteScreenActive
      ? 'Receiving peer screen'
      : 'Peer not sharing a screen';
    const controlStatusLabel = controlChannelReady
      ? remoteControlStatus
      : 'Control channel unavailable';
    const remotePreviewClass = `screen-preview remote-preview${canControlPeer ? ' remote-preview-interactive' : ''}`;

    return (
      React.createElement(React.Fragment, null,
        isApiKeyModalOpen && React.createElement('div', { className: 'modal-overlay', role: 'presentation' },
          React.createElement('div', {
            className: 'modal-content',
            role: 'dialog',
            id: 'api-key-dialog',
            'aria-modal': 'true',
            'aria-labelledby': 'api-key-dialog-title',
            onClick: (event) => event.stopPropagation()
          },
            React.createElement('div', { className: 'modal-header' },
              React.createElement('h2', { id: 'api-key-dialog-title' }, 'OpenAI Integration'),
              React.createElement('button', {
                className: 'modal-close',
                onClick: handleContinueWithoutAi,
                'aria-label': 'Close API key dialog'
              }, 'Close')
            ),
            React.createElement('form', {
              className: 'modal-body api-key-form',
              onSubmit: handleSaveApiKey,
              noValidate: true
            },
              React.createElement('p', { className: 'modal-description' },
                'Provide your personal OpenAI API key to enable optional AI assistance. The key is stored only in memory and sent exclusively to api.openai.com during rewrite requests.'
              ),
              React.createElement('label', { className: 'modal-label', htmlFor: 'openai-api-key' }, 'OpenAI API key'),
              React.createElement('input', {
                id: 'openai-api-key',
                type: 'password',
                value: apiKeyInput,
                onChange: (event) => setApiKeyInput(event.target.value),
                ref: apiKeyInputRef,
                placeholder: 'sk-...',
                autoComplete: 'off',
                'aria-describedby': apiKeyError ? 'api-key-error' : undefined
              }),
              apiKeyError && React.createElement('p', {
                id: 'api-key-error',
                className: 'modal-error',
                role: 'alert'
              }, apiKeyError),
              React.createElement('p', { className: 'modal-hint' }, 'Never share API keys on untrusted devices. Refresh this page or disable AI to clear the key.'),
              React.createElement('div', { className: 'modal-actions' },
                React.createElement('button', { type: 'submit' }, 'Save key'),
                React.createElement('button', { type: 'button', onClick: handleDisableAi }, 'Disable AI'),
                React.createElement('button', { type: 'button', onClick: handleContinueWithoutAi }, 'Continue without AI')
              )
            )
          )
        ),
        React.createElement('main', null,
          React.createElement('div', { className: 'header-with-about' },
            React.createElement('h1', { className: 'app-title' },
              React.createElement('span', {
                className: 'app-title-icon',
                'aria-hidden': 'true'
              }, '🐬'),
              React.createElement('span', { className: 'app-title-text' }, 'PodTalk')
            ),
            React.createElement('button', {
              className: 'about-button',
              onClick: toggleAbout,
              'aria-label': 'About this project',
              'aria-expanded': isAboutOpen,
              'aria-controls': 'about-dialog',
              ref: aboutButtonRef,
              disabled: isApiKeyModalOpen
            }, 'About')
          ),
          isRemoteControlAllowed && remotePointerState.visible && React.createElement('div', {
            className: 'remote-pointer-indicator',
            style: {
              left: `${remotePointerState.x}vw`,
              top: `${remotePointerState.y}vh`
            },
            'aria-hidden': 'true'
          }),
          isAboutOpen && React.createElement('div', { className: 'modal-overlay', role: 'presentation', onClick: toggleAbout },
            React.createElement('div', {
              className: 'modal-content',
              role: 'dialog',
              id: 'about-dialog',
              'aria-modal': 'true',
              'aria-labelledby': 'about-dialog-title',
              onClick: (e) => e.stopPropagation()
            },
              React.createElement('div', { className: 'modal-header' },
                React.createElement('h2', { id: 'about-dialog-title' }, 'About TheCommunity'),
                React.createElement('button', {
                  className: 'modal-close',
                  onClick: toggleAbout,
                  'aria-label': 'Close about dialog',
                  ref: closeAboutButtonRef
                }, 'Close')
              ),
              React.createElement('div', { className: 'modal-body' },
                React.createElement('p', null, 'This is a peer-to-peer WebRTC chat application with no backend. The community steers where this project goes through GitHub Issues.'),
                React.createElement('h3', null, 'Contributors'),
                React.createElement('p', { className: 'contributors-intro' }, 'Thank you to everyone who contributed by creating issues:'),
                isLoadingContributors && React.createElement('p', { className: 'contributors-status' }, 'Loading contributors...'),
                contributorsError && React.createElement('p', { className: 'contributors-status contributors-error' }, contributorsError),
                !isLoadingContributors && !contributorsError && contributors.length === 0 &&
                  React.createElement('p', { className: 'contributors-status' }, 'No issues yet. Open one to join the credits.'),
                contributors.length > 0 && React.createElement('ul', { className: 'contributors-list' },
                  contributors.map((contributor) => {
                    const issueLabel = contributor.issueCount === 1 ? '1 issue' : `${contributor.issueCount} issues`;
                    return React.createElement('li', { key: contributor.login },
                      React.createElement('a', {
                        href: contributor.htmlUrl,
                        target: '_blank',
                        rel: 'noopener noreferrer'
                      }, `@${contributor.login}`),
                      React.createElement('span', { className: 'contribution-note' }, ` - ${issueLabel}`)
                    );
                  })
                )
              )
            )
          ),
          React.createElement('section', { id: 'signaling', className: isSignalingCollapsed ? 'collapsed' : '' },
            React.createElement('header', null,
              React.createElement('div', { className: 'header-content' },
                React.createElement('h2', null, 'Manual Signaling'),
                React.createElement('p', { className: 'status', id: 'status' }, status)
              ),
              React.createElement('button', {
                className: 'collapse-toggle',
                onClick: toggleSignalingCollapse,
                'aria-label': isSignalingCollapsed ? 'Expand signaling' : 'Collapse signaling',
                'aria-expanded': !isSignalingCollapsed
              }, isSignalingCollapsed ? '▼' : '▲')
            ),
            !isSignalingCollapsed && React.createElement('div', { className: 'signaling-content' },
              React.createElement('p', { className: 'warning' },
                React.createElement('strong', null, 'Security notice:'),
                'Sharing WebRTC signals reveals your network addresses. Only exchange offers with peers you trust.'
              ),
              React.createElement('p', { className: 'hint' },
                'Step 1: One user clicks "Create Offer" and shares the generated signal below.', React.createElement('br'),
                'Step 2: The other user pastes it in "Remote Signal", clicks "Apply Remote", then "Create Answer" and shares their response.', React.createElement('br'),
                'Step 3: The first user pastes the answer into "Remote Signal" and applies it. Chat starts when the status says connected.'
              ),
              React.createElement('div', { className: 'controls' },
                React.createElement('button', {
                  id: 'create-offer',
                  onClick: handleCreateOffer,
                  disabled: isCreatingOffer
                }, isCreatingOffer ? 'Working...' : 'Create Offer'),
                React.createElement('button', {
                  id: 'create-answer',
                  onClick: handleCreateAnswer,
                  disabled: isCreatingAnswer
                }, isCreatingAnswer ? 'Working...' : 'Create Answer'),
                React.createElement('button', {
                  id: 'apply-remote',
                  onClick: handleApplyRemote
                }, 'Apply Remote'),
                React.createElement('button', {
                  id: 'disconnect',
                  onClick: handleDisconnect,
                  disabled: !channelReady,
                  'aria-label': 'Disconnect from peer'
                }, 'Disconnect')
              ),
              React.createElement('div', { className: 'signal-block' },
                React.createElement('div', { className: 'signal-heading' },
                  React.createElement('label', { htmlFor: 'local-signal' },
                    React.createElement('strong', null, 'Local Signal (share this)')
                  ),
                  React.createElement('button', {
                    onClick: handleCopySignal,
                    disabled: !localSignal,
                    className: 'copy-signal-button',
                    'aria-label': 'Copy local signal to clipboard'
                  }, copyButtonText)
                ),
                React.createElement('textarea', {
                  id: 'local-signal',
                  readOnly: true,
                  value: localSignal,
                  placeholder: 'Local SDP will appear here once ready.'
                })
              ),
              React.createElement('label', null,
                React.createElement('strong', null, 'Remote Signal (paste received JSON here)'),
                React.createElement('textarea', {
                  id: 'remote-signal',
                  value: remoteSignal,
                  onChange: (event) => setRemoteSignal(event.target.value),
                  onKeyDown: (event) => {
                    if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
                      event.preventDefault();
                      handleApplyRemote();
                    }
                  },
                  placeholder: 'Paste the JSON from your peer. Press Ctrl+Enter (Cmd+Enter on Mac) or click Apply Remote.'
                })
            )
          )
        ),
        React.createElement('section', { id: 'screen-share' },
          React.createElement('header', null,
            React.createElement('div', { className: 'header-content' },
              React.createElement('h2', null, 'Screen Sharing'),
              React.createElement('p', { className: 'status', id: 'screen-share-status' }, screenShareHeaderStatus)
            ),
            React.createElement('div', { className: 'header-actions screen-share-actions' },
              React.createElement('button', {
                type: 'button',
                onClick: handleStartScreenShare,
                disabled: !channelReady || isScreenSharing,
                'aria-label': 'Start sharing your screen'
              }, isScreenSharing ? 'Sharing…' : 'Start Sharing'),
              React.createElement('button', {
                type: 'button',
                onClick: handleStopScreenShare,
                disabled: !isScreenSharing,
                'aria-label': 'Stop sharing your screen'
              }, 'Stop Sharing')
            )
          ),
          React.createElement('div', { className: 'screen-share-controls' },
            React.createElement('label', { className: 'screen-audio-toggle' },
              React.createElement('input', {
                type: 'checkbox',
                checked: shareSystemAudio,
                disabled: isScreenSharing,
                onChange: (event) => setShareSystemAudio(event.target.checked)
              }),
              React.createElement('span', null, 'Include system audio')
            ),
            React.createElement('button', {
              type: 'button',
              className: 'remote-control-toggle',
              onClick: handleToggleRemoteControl,
              disabled: !isScreenSharing || !controlChannelReady
            }, isRemoteControlAllowed ? 'Disable Remote Control' : 'Allow Remote Control'),
            React.createElement('div', { className: 'control-status' },
              React.createElement('strong', null, 'Remote control:'),
              React.createElement('span', null, controlStatusLabel)
            )
          ),
          React.createElement('div', { className: 'screen-share-grid' },
            React.createElement('div', { className: 'screen-tile local' },
              React.createElement('h3', null, 'Your Screen'),
              React.createElement('div', { className: 'screen-preview' },
                React.createElement('video', {
                  ref: localScreenVideoRef,
                  muted: true,
                  autoPlay: true,
                  playsInline: true,
                  'aria-label': 'Local screen preview'
                }),
                !isScreenSharing && React.createElement('div', { className: 'screen-placeholder' },
                  React.createElement('p', null, channelReady ? 'Start sharing to broadcast your screen.' : 'Connect with a peer to enable screen sharing.')
                )
              )
            ),
            React.createElement('div', { className: 'screen-tile remote' },
              React.createElement('h3', null, "Peer's Screen"),
            React.createElement('div', {
                className: remotePreviewClass,
                ref: remoteControlSurfaceRef,
                role: canControlPeer ? 'group' : 'presentation',
                tabIndex: canControlPeer ? 0 : -1,
                'aria-disabled': canControlPeer ? 'false' : 'true',
                'aria-label': canControlPeer
                  ? 'Peer screen preview. Focus here to control their screen.'
                  : 'Peer screen preview'
              },
                React.createElement('video', {
                  ref: remoteScreenVideoRef,
                  autoPlay: true,
                  playsInline: true,
                  'aria-label': 'Peer screen stream'
                })
              ),
              React.createElement('p', { className: 'hint remote-screen-hint' },
                canControlPeer
                  ? 'Remote control active — move your cursor here to interact with their screen.'
                  : remoteScreenHeaderStatus
              )
            )
          ),
          React.createElement('p', { className: 'hint screen-share-footnote' },
            'Screen sharing is peer-to-peer only. Share and grant control access exclusively with people you trust.'
          )
        ),
        React.createElement('section', { id: 'chat' },
            React.createElement('header', null,
              React.createElement('div', { className: 'header-content' },
                React.createElement('h2', null, 'Chat'),
                React.createElement('p', { className: 'status', id: 'channel-status' }, channelStatus)
              ),
            React.createElement('div', { className: 'header-actions' },
              React.createElement('button', {
                type: 'button',
                className: 'api-key-button',
                onClick: handleOpenApiKeyModal,
                ref: apiKeyButtonRef,
                disabled: isApiKeyModalOpen
              }, openAiKey ? 'Update OpenAI Key' : 'Add OpenAI Key'),
              React.createElement('button', {
                type: 'button',
                className: 'theme-toggle-button',
                onClick: handleToggleTheme,
                'aria-pressed': isDarkTheme,
                title: themeToggleTitle,
                'aria-label': themeToggleTitle,
                disabled: isApiKeyModalOpen
              }, themeButtonLabel),
              messages.length > 0 && React.createElement('button', {
                onClick: handleClearMessages,
                className: 'clear-chat-button',
                'aria-label': 'Clear all chat messages',
                disabled: isApiKeyModalOpen
              }, 'Clear')
              )
            ),
            React.createElement('div', {
              id: 'messages',
              'aria-live': 'polite',
              ref: messagesContainerRef
            },
              messages.length === 0
                ? React.createElement('div', {
                    className: 'empty-state',
                    role: 'note'
                  }, 'No messages yet. Connect with a peer to start chatting.')
                : messages.map((message) => (
                    React.createElement('div', {
                      key: message.id,
                      className: 'chat-line',
                      'data-role': message.role
                    },
                    React.createElement('strong', null, ROLE_LABELS[message.role] || 'Notice'),
                    React.createElement('span', null, message.text))
                  ))
            ),
            React.createElement('div', { className: 'chat-input' },
              React.createElement('input', {
                id: 'outgoing',
                type: 'text',
                placeholder: 'Type a message...',
                autoComplete: 'off',
                disabled: !channelReady,
                value: inputText,
                onChange: (event) => setInputText(event.target.value),
                onKeyDown: (event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault();
                    handleSend();
                  }
                },
                maxLength: MAX_MESSAGE_LENGTH,
                'aria-label': 'Message input',
                'aria-describedby': 'channel-status'
              }),
              React.createElement('button', {
                type: 'button',
                className: 'ai-button',
                onClick: handleAiRewrite,
                disabled: isAiBusy || !inputText.trim(),
                'aria-label': openAiKey ? 'Rewrite message with OpenAI' : 'Add OpenAI key to enable AI',
                title: openAiKey ? 'Let OpenAI suggest a clearer version of your message.' : 'Add your OpenAI key to enable AI assistance.'
              }, isAiBusy ? 'Rewriting…' : 'Rewrite with AI'),
              React.createElement('button', {
                id: 'send',
                onClick: handleSend,
                disabled: !channelReady || !inputText.trim(),
                'aria-label': 'Send message',
                title: 'Send message'
              }, 'Send')
            ),
            React.createElement('p', {
              className: 'hint chat-counter',
              role: 'note'
            }, `${inputText.length} / ${MAX_MESSAGE_LENGTH}`),
            (aiStatus || aiError) && React.createElement('p', {
              className: `hint ai-feedback${aiError ? ' ai-feedback-error' : ''}`,
              role: 'note'
            }, aiError || aiStatus)
          )
        )
      )
    );
  }

  const rootElement = document.getElementById('root');
  const root = ReactDOM.createRoot(rootElement);
  root.render(React.createElement(App));
})();
