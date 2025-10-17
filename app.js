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
  const CONTROL_MAX_MESSAGES_PER_INTERVAL = 60;
  const CONTROL_MESSAGE_INTERVAL_MS = 5000;
  const CONTROL_MAX_PAYLOAD_LENGTH = 2048;
  const CONTROL_TEXT_INSERT_LIMIT = 32;
  const CONTROL_TOTAL_TEXT_BUDGET = 2048;
  const OPENAI_MODEL = 'gpt-4o-mini';
  const THEME_STORAGE_KEY = 'thecommunity.theme-preference';
  const THEME_OPTIONS = {
    LIGHT: 'light',
    DARK: 'dark'
  };

  const CONTROL_MESSAGE_TYPES = {
    POINTER: 'pointer',
    POINTER_VISIBILITY: 'pointer-visibility',
    KEYBOARD: 'keyboard',
    PERMISSION: 'permission',
    ACTION: 'action'
  };
  /**
   * Renders the mascot that reacts angrily on hover.
   * Pure SVG so it can be reused without additional assets.
   * @param {Object} props
   * @param {Object} props.t - Translation object
   * @returns {React.ReactElement}
   */
  function TuxMascot({ t }) {
    const svgChildren = [
      React.createElement('ellipse', {
        key: 'shadow',
        className: 'tux-shadow',
        cx: '60',
        cy: '112',
        rx: '24',
        ry: '8'
      }),
      React.createElement('ellipse', {
        key: 'body',
        className: 'tux-body',
        cx: '60',
        cy: '60',
        rx: '32',
        ry: '46'
      }),
      React.createElement('ellipse', {
        key: 'belly',
        className: 'tux-belly',
        cx: '60',
        cy: '78',
        rx: '22',
        ry: '28'
      }),
      React.createElement('ellipse', {
        key: 'head',
        className: 'tux-head',
        cx: '60',
        cy: '38',
        rx: '26',
        ry: '24'
      }),
      React.createElement('ellipse', {
        key: 'face',
        className: 'tux-face',
        cx: '60',
        cy: '47',
        rx: '20',
        ry: '15'
      }),
      React.createElement('ellipse', {
        key: 'wing-left',
        className: 'tux-wing wing-left',
        cx: '33',
        cy: '70',
        rx: '11',
        ry: '24'
      }),
      React.createElement('ellipse', {
        key: 'wing-right',
        className: 'tux-wing wing-right',
        cx: '87',
        cy: '70',
        rx: '11',
        ry: '24'
      }),
      React.createElement('path', {
        key: 'foot-left',
        className: 'tux-foot foot-left',
        d: 'M44 96 C40 104 44 110 52 110 L58 110 C64 110 66 104 62 96 L56 88 Z'
      }),
      React.createElement('path', {
        key: 'foot-right',
        className: 'tux-foot foot-right',
        d: 'M76 96 C72 104 76 110 84 110 L90 110 C96 110 98 104 94 96 L88 88 Z'
      }),
      React.createElement('polygon', {
        key: 'beak-upper',
        className: 'tux-beak-upper',
        points: '60,50 48,56 72,56'
      }),
      React.createElement('ellipse', {
        key: 'beak-lower',
        className: 'tux-beak-lower',
        cx: '60',
        cy: '60',
        rx: '12',
        ry: '5'
      }),
      React.createElement('circle', {
        key: 'eye-left',
        className: 'tux-eye eye-left',
        cx: '50',
        cy: '44',
        r: '7'
      }),
      React.createElement('circle', {
        key: 'eye-right',
        className: 'tux-eye eye-right',
        cx: '70',
        cy: '44',
        r: '7'
      }),
      React.createElement('circle', {
        key: 'pupil-left',
        className: 'tux-pupil pupil-left',
        cx: '52',
        cy: '46',
        r: '3'
      }),
      React.createElement('circle', {
        key: 'pupil-right',
        className: 'tux-pupil pupil-right',
        cx: '68',
        cy: '46',
        r: '3'
      }),
      React.createElement('circle', {
        key: 'glow-left',
        className: 'tux-eye-glow glow-left',
        cx: '50',
        cy: '44',
        r: '7'
      }),
      React.createElement('circle', {
        key: 'glow-right',
        className: 'tux-eye-glow glow-right',
        cx: '70',
        cy: '44',
        r: '7'
      }),
      React.createElement('rect', {
        key: 'brow-left',
        className: 'tux-brow brow-left',
        x: '42',
        y: '32',
        width: '16',
        height: '3',
        rx: '1.5'
      }),
      React.createElement('rect', {
        key: 'brow-right',
        className: 'tux-brow brow-right',
        x: '62',
        y: '32',
        width: '16',
        height: '3',
        rx: '1.5'
      }),
      React.createElement('path', {
        key: 'steam-left',
        className: 'tux-steam steam-left',
        d: 'M32 20 C28 14 31 10 35 8 C39 6 40 4 38 2'
      }),
      React.createElement('path', {
        key: 'steam-right',
        className: 'tux-steam steam-right',
        d: 'M88 20 C92 14 89 10 85 8 C81 6 80 4 82 2'
      })
    ];

    return React.createElement(
      'div',
      {
        className: 'tux-mascot',
        role: 'img',
        'aria-label': t.mascot.ariaLabel
      },
      React.createElement(
        'svg',
        {
          className: 'tux-svg',
          viewBox: '0 0 120 120',
          xmlns: 'http://www.w3.org/2000/svg',
          'aria-hidden': 'true',
          focusable: 'false'
        },
        svgChildren
      )
    );
  }

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
    const [language, setLanguage] = useState(getCurrentLanguage());
    const t = translations[language] || translations.de;
    const [status, setStatus] = useState(t.status.waiting);
    const [channelStatus, setChannelStatus] = useState(t.status.channelClosed);
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
    const [copyButtonText, setCopyButtonText] = useState(t.signaling.copyButton);
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
    const [remoteControlStatus, setRemoteControlStatus] = useState(t.remoteControl.statusDisabled);
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
    const controlIncomingTimestampsRef = useRef([]);
    const controlWarningsRef = useRef({ rate: false, size: false });
    const remoteKeyBudgetRef = useRef(CONTROL_TOTAL_TEXT_BUDGET);
    const pointerFramePendingRef = useRef(false);
    const pointerFrameIdRef = useRef(null);
    const pointerQueuedPositionRef = useRef(null);

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

    const appendSystemMessageRef = useRef(appendSystemMessage);
    useEffect(() => {
      appendSystemMessageRef.current = appendSystemMessage;
    }, [appendSystemMessage]);

    const handleToggleTheme = useCallback(() => {
      setTheme((prevTheme) => {
        const nextTheme = prevTheme === THEME_OPTIONS.DARK ? THEME_OPTIONS.LIGHT : THEME_OPTIONS.DARK;
        const currentT = translations[language] || translations.de;
        const themeName = nextTheme === THEME_OPTIONS.DARK ? 'dark' : 'light';
        appendSystemMessage(currentT.systemMessages.themeSwitch(themeName));
        return nextTheme;
      });
      hasStoredThemeRef.current = true;
    }, [appendSystemMessage, language]);

    const handleLanguageChange = useCallback((event) => {
      const newLanguage = event.target.value;
      setLanguage(newLanguage);
      setCurrentLanguage(newLanguage);
      const newT = translations[newLanguage] || translations.de;
      appendSystemMessage(newT.systemMessages.languageChanged(newT.name));
      setStatus(newT.status.waiting);
      setChannelStatus(newT.status.channelClosed);
      setCopyButtonText(newT.signaling.copyButton);
      setRemoteControlStatus(newT.remoteControl.statusDisabled);
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
      appendSystemMessage(t.systemMessages.continueWithoutAi);
    }, [appendSystemMessage, handleCloseApiKeyModal, t]);

    const handleSaveApiKey = useCallback((event) => {
      if (event && typeof event.preventDefault === 'function') {
        event.preventDefault();
      }
      const trimmed = apiKeyInput.trim();
      if (!trimmed) {
        setApiKeyError(t.aiErrors.emptyKey);
        return;
      }
      setOpenAiKey(trimmed);
      setAiStatus(t.systemMessages.aiReady);
      setAiError('');
      appendSystemMessage(t.systemMessages.apiKeyStored);
      handleCloseApiKeyModal();
    }, [apiKeyInput, appendSystemMessage, handleCloseApiKeyModal, t]);

    const handleDisableAi = useCallback(() => {
      setOpenAiKey('');
      setAiStatus('');
      setAiError('');
      appendSystemMessage(t.systemMessages.aiDisabled);
      handleCloseApiKeyModal();
    }, [appendSystemMessage, handleCloseApiKeyModal, t]);

    /**
     * Configures event handlers on the reliable chat channel.
     * Applies defensive checks and rate limiting to inbound traffic.
     * @param {RTCDataChannel} channel - Active data channel
     */
    const setupChatChannel = useCallback((channel) => {
      channel.onopen = () => {
        setChannelStatus(t.status.channelOpen);
        setChannelReady(true);
        setIsSignalingCollapsed(true);
        incomingTimestampsRef.current = [];
      };
      channel.onclose = () => {
        setChannelStatus(t.status.channelClosed);
        setChannelReady(false);
        setIsSignalingCollapsed(false);
        incomingTimestampsRef.current = [];
        channelRef.current = null;
      };
      channel.onmessage = (event) => {
        if (typeof event.data !== 'string') {
          appendSystemMessage(t.systemMessages.securityBlocked);
          return;
        }
        const payload = event.data;
        if (payload.length > MAX_MESSAGE_LENGTH) {
          appendSystemMessage(t.systemMessages.messageTooLong(MAX_MESSAGE_LENGTH));
          return;
        }
        const now = Date.now();
        incomingTimestampsRef.current = incomingTimestampsRef.current.filter(
          (timestamp) => now - timestamp < MESSAGE_INTERVAL_MS
        );
        incomingTimestampsRef.current.push(now);
        if (incomingTimestampsRef.current.length > MAX_MESSAGES_PER_INTERVAL) {
          appendSystemMessage(t.systemMessages.rateLimit);
          return;
        }
        appendMessage(payload, 'remote');
      };
    }, [appendMessage, appendSystemMessage, t]);

    /**
     * Processes inbound control-channel payloads (populated in Step 4).
     * @param {string} payload - Raw channel message
     */
    const cancelPendingPointerFrame = useCallback(() => {
      if (pointerFramePendingRef.current && pointerFrameIdRef.current !== null) {
        cancelAnimationFrame(pointerFrameIdRef.current);
      }
      pointerFramePendingRef.current = false;
      pointerFrameIdRef.current = null;
      pointerQueuedPositionRef.current = null;
    }, []);

    const handleIncomingControlMessage = useCallback((payload) => {
      if (typeof payload !== 'string' || !payload) {
        return;
      }
      if (payload.length > CONTROL_MAX_PAYLOAD_LENGTH) {
        if (!controlWarningsRef.current.size) {
          appendSystemMessageRef.current(t.remoteControl.system.payloadTooLarge);
          controlWarningsRef.current.size = true;
        }
        return;
      }
      controlWarningsRef.current.size = false;
      const now = Date.now();
      controlIncomingTimestampsRef.current = controlIncomingTimestampsRef.current.filter((timestamp) => now - timestamp < CONTROL_MESSAGE_INTERVAL_MS);
      if (controlIncomingTimestampsRef.current.length >= CONTROL_MAX_MESSAGES_PER_INTERVAL) {
        if (!controlWarningsRef.current.rate) {
          appendSystemMessageRef.current(t.remoteControl.system.rateLimited);
          controlWarningsRef.current.rate = true;
        }
        return;
      }
      controlIncomingTimestampsRef.current.push(now);
      controlWarningsRef.current.rate = false;

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
            appendSystemMessageRef.current(allowed
              ? t.remoteControl.system.peerEnabled
              : t.remoteControl.system.peerDisabled);
          }
          canControlPeerRef.current = allowed;
          setCanControlPeer(allowed);
          setRemoteControlStatus(allowed ? t.remoteControl.statusGranted : t.remoteControl.statusDisabledByPeer);
          if (!allowed) {
            cancelPendingPointerFrame();
            hideRemotePointerRef.current();
          }
          return;
        }
        case CONTROL_MESSAGE_TYPES.POINTER: {
          if (!remoteControlAllowedRef.current) {
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
          showRemotePointerRef.current(x, y);
          if (message.kind === 'click') {
            const button = typeof message.button === 'string' ? message.button : 'left';
            performRemoteClickRef.current(x, y, button);
          }
          return;
        }
        case CONTROL_MESSAGE_TYPES.POINTER_VISIBILITY: {
          if (!remoteControlAllowedRef.current) {
            return;
          }
          if (message.visible === false) {
            hideRemotePointerRef.current();
          }
          return;
        }
        case CONTROL_MESSAGE_TYPES.KEYBOARD: {
          if (!remoteControlAllowedRef.current) {
            return;
          }
          handleRemoteKeyboardInputRef.current(message);
          return;
        }
        case CONTROL_MESSAGE_TYPES.ACTION: {
          if (!remoteControlAllowedRef.current) {
            return;
          }
          if (message.action === 'clear-input') {
            applyRemoteInputTransformRef.current(() => '');
          }
          return;
        }
        default:
      }
    }, [cancelPendingPointerFrame, t]);

    /**
     * Configures event handlers for the auxiliary control data channel.
     * @param {RTCDataChannel} channel - Control channel instance
     */
    const setupControlChannel = useCallback((channel) => {
      channel.onopen = () => {
        controlChannelRef.current = channel;
        setControlChannelReady(true);
        setRemoteControlStatus(t.remoteControl.statusDisabled);
        controlIncomingTimestampsRef.current = [];
        controlWarningsRef.current = { rate: false, size: false };
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
        hideRemotePointerRef.current();
        cancelPendingPointerFrame();
        remoteKeyBudgetRef.current = CONTROL_TOTAL_TEXT_BUDGET;
        setRemoteControlStatus(t.remoteControl.statusChannelClosed);
      };
      channel.onmessage = (event) => {
        if (typeof event.data !== 'string') {
          return;
        }
        handleIncomingControlMessage(event.data);
      };
    }, [cancelPendingPointerFrame, handleIncomingControlMessage, t]);

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
          setStatus(t.status.signalReady);
        }
      };

      pc.oniceconnectionstatechange = () => {
        if (!pcRef.current) return;
        setStatus(t.status.ice(pc.iceConnectionState));
      };

      pc.onconnectionstatechange = () => {
        if (!pcRef.current) return;
        setStatus(t.status.connection(pc.connectionState));
      };

      pc.ontrack = (event) => {
        if (!remoteScreenStreamRef.current) {
          remoteScreenStreamRef.current = new MediaStream();
        }
        const targetStream = remoteScreenStreamRef.current;
        const track = event.track;
        if (!targetStream.getTracks().some((existing) => existing.id === track.id)) {
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
          if (targetStream.getTracks().some((existing) => existing.id === track.id)) {
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
        appendSystemMessage(t.systemMessages.channelBlocked(incomingChannel.label || ''));
        incomingChannel.close();
      };

      return pc;
    }, [appendSystemMessage, setupChatChannel, setupControlChannel, t]);

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
        throw new Error(t.systemMessages.remoteEmpty);
      }
      let desc;
      try {
        desc = JSON.parse(raw);
      } catch (err) {
        throw new Error(t.systemMessages.remoteInvalidJson);
      }
      if (!desc.type || !desc.sdp || !['offer', 'answer'].includes(desc.type)) {
        throw new Error(t.systemMessages.remoteMissingData);
      }
      return desc;
    }, [remoteSignal, t]);

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
      setRemoteControlStatus(t.remoteControl.statusDisabled);

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
      setStatus(t.status.creatingOffer);
      setIsCreatingOffer(true);

      try {
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        await waitForIce();
      } catch (err) {
        console.error(err);
        setStatus(t.status.disconnected);
        appendSystemMessage(t.systemMessages.createOfferFailed);
      } finally {
        setIsCreatingOffer(false);
      }
    }, [appendSystemMessage, ensurePeerConnection, setupChatChannel, setupControlChannel, waitForIce, t]);

    /**
     * Applies the pasted remote offer or answer to the peer connection.
     * @returns {Promise<void>}
     */
    const handleApplyRemote = useCallback(async () => {
      const pc = ensurePeerConnection();
      try {
        const desc = parseRemoteDescription();
        await pc.setRemoteDescription(desc);
        setStatus(t.status.remoteApplied(desc.type));
        if (desc.type === 'answer') {
          setChannelStatus(t.status.answerApplied);
        }
      } catch (err) {
        console.error(err);
        setStatus(err.message);
      }
    }, [ensurePeerConnection, parseRemoteDescription, t]);

    /**
     * Produces an answer for an applied offer and shares it with the peer.
     * @returns {Promise<void>}
     */
    const handleCreateAnswer = useCallback(async () => {
      const pc = ensurePeerConnection();
      iceDoneRef.current = false;
      setLocalSignal('');
      setChannelReady(false);
      setStatus(t.status.creatingAnswer);
      setIsCreatingAnswer(true);

      try {
        if (!pc.currentRemoteDescription) {
          const desc = parseRemoteDescription();
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
      } finally {
        setIsCreatingAnswer(false);
      }
    }, [appendSystemMessage, ensurePeerConnection, parseRemoteDescription, waitForIce, t]);

    const sendControlMessage = useCallback((message) => {
      if (!message || typeof message !== 'object') {
        return false;
      }
      const channel = controlChannelRef.current;
      if (!channel || channel.readyState !== 'open') {
        return false;
      }
      try {
        channel.send(JSON.stringify(message));
        return true;
      } catch (error) {
        console.warn('Failed to send control message', error);
        appendSystemMessageRef.current(t.remoteControl.system.deliveryFailed);
        return false;
      }
    }, [t]);

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
        appendSystemMessage(t.screenShare.messages.stopped);
      }
      if (remoteControlAllowedRef.current) {
        const delivered = sendControlMessage({
          type: CONTROL_MESSAGE_TYPES.PERMISSION,
          allowed: false
        });
        cancelPendingPointerFrame();
        hideRemotePointerRef.current();
        appendSystemMessage(t.remoteControl.system.disabledOnScreenStop);
        if (!delivered) {
          appendSystemMessageRef.current(t.remoteControl.system.revokeFailed);
        }
      }
      remoteControlAllowedRef.current = false;
      setIsRemoteControlAllowed(false);
      setRemoteControlStatus(t.remoteControl.statusDisabled);
      remoteKeyBudgetRef.current = CONTROL_TOTAL_TEXT_BUDGET;
      setIsScreenSharing(false);
    }, [appendSystemMessage, cancelPendingPointerFrame, isScreenSharing, sendControlMessage, t]);

    const handleStartScreenShare = useCallback(async () => {
      if (isScreenSharing) {
        return;
      }
      let stream = null;
      try {
        if (!navigator.mediaDevices || typeof navigator.mediaDevices.getDisplayMedia !== 'function') {
          appendSystemMessage(t.screenShare.messages.notSupported);
          return;
        }
        const pc = ensurePeerConnection();
        if (!pc) {
          throw new Error(t.screenShare.errors.peerNotReady);
        }
        stream = await navigator.mediaDevices.getDisplayMedia({
          video: { cursor: 'always' },
          audio: shareSystemAudio ? { echoCancellation: false, noiseSuppression: false } : false
        });
        const [videoTrack] = stream.getVideoTracks();
        if (!videoTrack) {
          stream.getTracks().forEach((track) => track.stop());
          throw new Error(t.screenShare.errors.noVideoTrack);
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
        appendSystemMessage(t.screenShare.messages.started);
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
        const reason = error && error.message ? error.message : t.screenShare.errors.permissionDenied;
        appendSystemMessage(t.screenShare.errors.failed(reason));
        setIsScreenSharing(false);
      }
    }, [appendSystemMessage, ensurePeerConnection, handleStopScreenShare, isScreenSharing, shareSystemAudio, t]);

    const hideRemotePointer = useCallback(() => {
      if (remotePointerTimeoutRef.current) {
        clearTimeout(remotePointerTimeoutRef.current);
        remotePointerTimeoutRef.current = null;
      }
      setRemotePointerState((prev) => (prev.visible ? { ...prev, visible: false } : prev));
    }, []);
    const hideRemotePointerRef = useRef(hideRemotePointer);
    useEffect(() => {
      hideRemotePointerRef.current = hideRemotePointer;
    }, [hideRemotePointer]);

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
    const showRemotePointerRef = useRef(showRemotePointer);
    useEffect(() => {
      showRemotePointerRef.current = showRemotePointer;
    }, [showRemotePointer]);

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
        if (input.id !== 'outgoing') {
          return;
        }
        input.focus({ preventScroll: true });
        const valueLength = typeof input.value === 'string' ? input.value.length : 0;
        if (typeof input.setSelectionRange === 'function') {
          input.setSelectionRange(valueLength, valueLength);
        }
      }
      // Intentionally ignore button clicks and other controls for security.
    }, []);
    const performRemoteClickRef = useRef(performRemoteClick);
    useEffect(() => {
      performRemoteClickRef.current = performRemoteClick;
    }, [performRemoteClick]);

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
    const applyRemoteInputTransformRef = useRef(applyRemoteInputTransform);
    useEffect(() => {
      applyRemoteInputTransformRef.current = applyRemoteInputTransform;
    }, [applyRemoteInputTransform]);

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
        appendSystemMessage(t.systemMessages.messageInputTooLong(MAX_MESSAGE_LENGTH, trimmed.length));
        return;
      }
      channel.send(trimmed);
      appendMessage(trimmed, 'local');
      setInputText('');
      setAiStatus('');
      setAiError('');
    }, [appendMessage, appendSystemMessage, inputText, t]);

    const handleRemoteKeyboardInput = useCallback((message) => {
      if (!remoteControlAllowedRef.current) {
        return;
      }
      if (!message || typeof message.mode !== 'string') {
        return;
      }
      const inputEl = document.getElementById('outgoing');
      if (!inputEl) {
        return;
      }
      if (typeof inputEl.focus === 'function') {
        inputEl.focus({ preventScroll: true });
      }
      setAiStatus('');
      setAiError('');
      if (message.mode === 'text') {
        const raw = typeof message.value === 'string' ? message.value : '';
        const sanitized = raw.replace(/[\u0000-\u001F\u007F-\u009F]/g, '').slice(0, CONTROL_TEXT_INSERT_LIMIT);
        if (!sanitized) {
          return;
        }
        if (remoteKeyBudgetRef.current <= 0) {
          appendSystemMessageRef.current(t.remoteControl.system.typingDisabled);
          remoteControlAllowedRef.current = false;
          setIsRemoteControlAllowed(false);
          setRemoteControlStatus(t.remoteControl.statusDisabledInputLimit);
          hideRemotePointerRef.current();
          const delivered = sendControlMessage({
            type: CONTROL_MESSAGE_TYPES.PERMISSION,
            allowed: false
          });
          remoteKeyBudgetRef.current = CONTROL_TOTAL_TEXT_BUDGET;
          if (!delivered) {
            appendSystemMessageRef.current(t.remoteControl.system.revokeFailed);
          }
          return;
        }
        const allowedBudget = Math.min(remoteKeyBudgetRef.current, sanitized.length);
        remoteKeyBudgetRef.current -= allowedBudget;
        const textToInsert = sanitized.slice(0, allowedBudget);
        applyRemoteInputTransformRef.current((prev) => `${prev}${textToInsert}`);
        return;
      }
      if (message.mode === 'backspace') {
        applyRemoteInputTransformRef.current((prev) => prev.slice(0, Math.max(0, prev.length - 1)));
        return;
      }
      if (message.mode === 'enter') {
        handleSend();
      }
    }, [handleSend, sendControlMessage, setAiError, setAiStatus, setIsRemoteControlAllowed, setRemoteControlStatus, t]);
    const handleRemoteKeyboardInputRef = useRef(handleRemoteKeyboardInput);
    useEffect(() => {
      handleRemoteKeyboardInputRef.current = handleRemoteKeyboardInput;
    }, [handleRemoteKeyboardInput]);

    const handleToggleRemoteControl = useCallback(() => {
      if (!controlChannelReady) {
        appendSystemMessage(t.remoteControl.system.unavailable);
        return;
      }
      const channel = controlChannelRef.current;
      if (!channel || channel.readyState !== 'open') {
        appendSystemMessage(t.remoteControl.system.negotiating);
        return;
      }
      if (!isScreenSharing) {
        appendSystemMessage(t.remoteControl.system.requiresScreenShare);
        return;
      }
      const next = !remoteControlAllowedRef.current;
      const delivered = sendControlMessage({
        type: CONTROL_MESSAGE_TYPES.PERMISSION,
        allowed: next
      });
      if (!delivered) {
        appendSystemMessage(t.remoteControl.system.updateFailed);
        return;
      }
      remoteControlAllowedRef.current = next;
      setIsRemoteControlAllowed(next);
      if (next) {
        remoteKeyBudgetRef.current = CONTROL_TOTAL_TEXT_BUDGET;
        setRemoteControlStatus(t.remoteControl.statusEnabled);
        appendSystemMessage(t.remoteControl.system.peerCanControl);
      } else {
        setRemoteControlStatus(t.remoteControl.statusDisabled);
        cancelPendingPointerFrame();
        hideRemotePointerRef.current();
        remoteKeyBudgetRef.current = CONTROL_TOTAL_TEXT_BUDGET;
        appendSystemMessage(t.remoteControl.system.controlRevokedLocal);
      }
    }, [appendSystemMessage, cancelPendingPointerFrame, controlChannelReady, isScreenSharing, sendControlMessage, t]);

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
        setCopyButtonText(t.signaling.copied);
        setTimeout(() => setCopyButtonText(t.signaling.copyButton), 2000);
      } catch (err) {
        console.error('Failed to copy local signal', err);
        setCopyButtonText(t.signaling.copyFailed);
        setTimeout(() => setCopyButtonText(t.signaling.copyButton), 2000);
      }
    }, [localSignal, t]);

    /**
     * Clears all messages from the chat history.
     */
    const handleClearMessages = useCallback(() => {
      setMessages([]);
      appendSystemMessage(t.systemMessages.chatCleared);
    }, [appendSystemMessage, t]);

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
        screenSenderRef.current = null;
      }
      if (screenAudioSenderRef.current) {
        try {
          screenAudioSenderRef.current.replaceTrack(null);
        } catch (error) {
          console.warn('Failed to clear screen audio track', error);
        }
        screenAudioSenderRef.current = null;
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
      controlIncomingTimestampsRef.current = [];
      controlWarningsRef.current = { rate: false, size: false };
      remoteKeyBudgetRef.current = CONTROL_TOTAL_TEXT_BUDGET;
      setChannelReady(false);
      setChannelStatus(t.status.channelClosed);
      setStatus(t.status.disconnected);
      setLocalSignal('');
      setRemoteSignal('');
      setIsSignalingCollapsed(false);
      setIsScreenSharing(false);
      setIsRemoteScreenActive(false);
      setControlChannelReady(false);
      setIsRemoteControlAllowed(false);
      remoteControlAllowedRef.current = false;
      setCanControlPeer(false);
      canControlPeerRef.current = false;
      setRemoteControlStatus(t.remoteControl.statusDisabled);
      setRemotePointerState({ visible: false, x: 50, y: 50 });
      setShareSystemAudio(false);
      cancelPendingPointerFrame();
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
      appendSystemMessage(t.systemMessages.disconnectNotice);
      setAiStatus('');
      setAiError('');
    }, [appendSystemMessage, cancelPendingPointerFrame, t]);

    const handleAiRewrite = useCallback(async () => {
      const draft = inputText.trim();
      if (!draft) {
        return;
      }
      if (!openAiKey) {
        setApiKeyInput(openAiKey);
        setApiKeyError(t.aiErrors.emptyKey);
        setIsApiKeyModalOpen(true);
        setIsAboutOpen(false);
        return;
      }
      if (draft.length > MAX_MESSAGE_LENGTH) {
        appendSystemMessage(t.systemMessages.aiRewriteNotAttempted(MAX_MESSAGE_LENGTH));
        return;
      }
      setIsAiBusy(true);
      setAiStatus(t.systemMessages.aiReady);
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
            throw new Error(t.aiErrors.unauthorized);
          }
          throw new Error(t.aiErrors.requestFailed(response.status));
        }
        const data = await response.json();
        const aiText =
          data &&
          data.choices &&
          data.choices[0] &&
          data.choices[0].message &&
          data.choices[0].message.content;
        if (!aiText) {
          throw new Error(t.aiErrors.missingContent);
        }
        const cleaned = aiText.trim();
        if (!cleaned) {
          throw new Error(t.aiErrors.emptySuggestion);
        }
        if (cleaned.length > MAX_MESSAGE_LENGTH) {
          setInputText(cleaned.slice(0, MAX_MESSAGE_LENGTH));
          appendSystemMessage(t.systemMessages.aiTruncated);
        } else {
          setInputText(cleaned);
        }
        setAiStatus(t.systemMessages.aiSuggestionApplied);
        setAiError('');
      } catch (error) {
        console.error('AI rewrite failed', error);
        setAiStatus('');
        setAiError(error.message || t.aiErrors.requestFailed('unknown'));
        appendSystemMessage(t.systemMessages.aiRewriteFailed(error.message || ''));
      } finally {
        setIsAiBusy(false);
      }
    }, [appendSystemMessage, inputText, openAiKey, setIsAboutOpen, t]);

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
        setCopyButtonText(t.signaling.copyButton);
      }
    }, [localSignal, t]);

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
          setContributorsError(t.about.contributorsError);
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
    }, [isAboutOpen, t]);

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
      cancelPendingPointerFrame();
    }, [cancelPendingPointerFrame]);

    useEffect(() => {
      if (isRemoteScreenActive && !remoteScreenActiveRef.current) {
        appendSystemMessage(t.screenShare.remote.peerStarted);
      } else if (!isRemoteScreenActive && remoteScreenActiveRef.current) {
        appendSystemMessage(t.screenShare.remote.peerStopped);
      }
      remoteScreenActiveRef.current = isRemoteScreenActive;
    }, [appendSystemMessage, isRemoteScreenActive, t]);

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

      const schedulePointerFrame = () => {
        if (pointerFramePendingRef.current) {
          return;
        }
        pointerFramePendingRef.current = true;
        pointerFrameIdRef.current = requestAnimationFrame(() => {
          pointerFramePendingRef.current = false;
          pointerFrameIdRef.current = null;
          const queued = pointerQueuedPositionRef.current;
          pointerQueuedPositionRef.current = null;
          if (!queued) {
            return;
          }
          lastPointerSendRef.current = performance.now();
          sendControlMessage({
            type: CONTROL_MESSAGE_TYPES.POINTER,
            kind: 'move',
            x: queued.x,
            y: queued.y
          });
        });
      };

      const handlePointerDown = (event) => {
        event.preventDefault();
        surface.focus({ preventScroll: true });
        const position = computePosition(event);
        if (position) {
          pointerQueuedPositionRef.current = position;
          schedulePointerFrame();
        }
      };

      const handlePointerMove = (event) => {
        event.preventDefault();
        const position = computePosition(event);
        if (!position) {
          if (lastPointerSendRef.current !== 0) {
            lastPointerSendRef.current = 0;
            cancelPendingPointerFrame();
            pointerQueuedPositionRef.current = null;
            sendControlMessage({
              type: CONTROL_MESSAGE_TYPES.POINTER_VISIBILITY,
              visible: false
            });
          }
          return;
        }
        pointerQueuedPositionRef.current = position;
        schedulePointerFrame();
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
        cancelPendingPointerFrame();
        pointerQueuedPositionRef.current = null;
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
        cancelPendingPointerFrame();
        sendControlMessage({
          type: CONTROL_MESSAGE_TYPES.POINTER_VISIBILITY,
          visible: false
        });
      };
    }, [cancelPendingPointerFrame, canControlPeer, sendControlMessage]);

    useEffect(() => {
      if (canControlPeer && remoteControlSurfaceRef.current) {
        remoteControlSurfaceRef.current.focus({ preventScroll: true });
        lastPointerSendRef.current = 0;
      }
    }, [canControlPeer]);

    const isDarkTheme = theme === THEME_OPTIONS.DARK;
    const themeButtonLabel = t.chat.themeToggle(isDarkTheme);
    const themeToggleTitle = t.chat.themeToggleTitle(isDarkTheme);
    const screenShareHeaderStatus = isScreenSharing
      ? t.screenShare.status.sharing
      : channelReady
        ? t.screenShare.status.ready
        : t.screenShare.status.connect;
    const remoteScreenHeaderStatus = isRemoteScreenActive
      ? t.screenShare.remote.receiving
      : t.screenShare.remote.idle;
    const controlStatusLabel = controlChannelReady
      ? remoteControlStatus
      : t.remoteControl.statusUnavailable;
    const remotePreviewClass = `screen-preview remote-preview${canControlPeer ? ' remote-preview-interactive' : ''}`;
    const remotePointerStyle = remotePointerState.visible
      ? {
          left: `${remotePointerState.x}%`,
          top: `${remotePointerState.y}%`
        }
      : null;

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
              React.createElement('h2', { id: 'api-key-dialog-title' }, t.apiKeyModal.title),
              React.createElement('button', {
                className: 'modal-close',
                onClick: handleContinueWithoutAi,
                'aria-label': t.apiKeyModal.closeAriaLabel
              }, t.apiKeyModal.close)
            ),
            React.createElement('form', {
              className: 'modal-body api-key-form',
              onSubmit: handleSaveApiKey,
              noValidate: true
            },
              React.createElement('p', { className: 'modal-description' },
                t.apiKeyModal.description
              ),
              React.createElement('label', { className: 'modal-label', htmlFor: 'openai-api-key' }, t.apiKeyModal.label),
              React.createElement('input', {
                id: 'openai-api-key',
                type: 'password',
                value: apiKeyInput,
                onChange: (event) => setApiKeyInput(event.target.value),
                ref: apiKeyInputRef,
                placeholder: t.apiKeyModal.placeholder,
                autoComplete: 'off',
                'aria-describedby': apiKeyError ? 'api-key-error' : undefined
              }),
              apiKeyError && React.createElement('p', {
                id: 'api-key-error',
                className: 'modal-error',
                role: 'alert'
              }, apiKeyError),
              React.createElement('p', { className: 'modal-hint' }, t.apiKeyModal.hint),
              React.createElement('div', { className: 'modal-actions' },
                React.createElement('button', { type: 'submit' }, t.apiKeyModal.save),
                React.createElement('button', { type: 'button', onClick: handleDisableAi }, t.apiKeyModal.disable),
                React.createElement('button', { type: 'button', onClick: handleContinueWithoutAi }, t.apiKeyModal.continueWithout)
              )
            )
          )
        ),
        React.createElement('main', null,
          React.createElement('div', { className: 'header-with-about' },
            React.createElement(TuxMascot, { t: t }),
            React.createElement('h1', { className: 'app-title' },
              React.createElement('span', {
                className: 'app-title-icon',
                'aria-hidden': 'true'
              }, '🐬'),
              React.createElement('span', { className: 'app-title-text' }, t.app.title)
            ),
            React.createElement('button', {
              className: 'about-button',
              onClick: toggleAbout,
              'aria-label': t.about.buttonAriaLabel,
              'aria-expanded': isAboutOpen,
              'aria-controls': 'about-dialog',
              ref: aboutButtonRef,
              disabled: isApiKeyModalOpen
            }, t.about.button)
          ),
          isRemoteControlAllowed && remotePointerState.visible && React.createElement('div', {
            className: 'remote-pointer-indicator',
            style: remotePointerStyle || undefined,
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
                React.createElement('h2', { id: 'about-dialog-title' }, t.about.title),
                React.createElement('button', {
                  className: 'modal-close',
                  onClick: toggleAbout,
                  'aria-label': t.about.closeAriaLabel,
                  ref: closeAboutButtonRef
                }, t.about.close)
              ),
              React.createElement('div', { className: 'modal-body' },
                React.createElement('p', null, t.about.description),
                React.createElement('h3', null, t.about.contributorsTitle),
                React.createElement('p', { className: 'contributors-intro' }, t.about.contributorsIntro),
                isLoadingContributors && React.createElement('p', { className: 'contributors-status' }, t.about.loadingContributors),
                contributorsError && React.createElement('p', { className: 'contributors-status contributors-error' }, contributorsError),
                !isLoadingContributors && !contributorsError && contributors.length === 0 &&
                  React.createElement('p', { className: 'contributors-status' }, t.about.noIssues),
                contributors.length > 0 && React.createElement('ul', { className: 'contributors-list' },
                  contributors.map((contributor) => {
                    const issueLabel = t.about.issueCount(contributor.issueCount);
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
                React.createElement('h2', null, t.signaling.title),
                React.createElement('p', { className: 'status', id: 'status' }, status)
              ),
              React.createElement('button', {
                className: 'collapse-toggle',
                onClick: toggleSignalingCollapse,
                'aria-label': t.signaling.collapseAriaLabel(isSignalingCollapsed),
                'aria-expanded': !isSignalingCollapsed
              }, isSignalingCollapsed ? '▼' : '▲')
            ),
            !isSignalingCollapsed && React.createElement('div', { className: 'signaling-content' },
              React.createElement('p', { className: 'warning' },
                React.createElement('strong', null, t.signaling.securityNotice),
                t.signaling.securityWarning
              ),
              React.createElement('p', { className: 'hint' },
                t.signaling.step1, React.createElement('br'),
                t.signaling.step2, React.createElement('br'),
                t.signaling.step3
              ),
              React.createElement('div', { className: 'controls' },
                React.createElement('button', {
                  id: 'create-offer',
                  onClick: handleCreateOffer,
                  disabled: isCreatingOffer
                }, isCreatingOffer ? t.signaling.working : t.signaling.createOffer),
                React.createElement('button', {
                  id: 'create-answer',
                  onClick: handleCreateAnswer,
                  disabled: isCreatingAnswer
                }, isCreatingAnswer ? t.signaling.working : t.signaling.createAnswer),
                React.createElement('button', {
                  id: 'apply-remote',
                  onClick: handleApplyRemote
                }, t.signaling.applyRemote),
                React.createElement('button', {
                  id: 'disconnect',
                  onClick: handleDisconnect,
                  disabled: !channelReady,
                  'aria-label': t.signaling.disconnectAriaLabel
                }, t.signaling.disconnect)
              ),
              React.createElement('div', { className: 'signal-block' },
                React.createElement('div', { className: 'signal-heading' },
                  React.createElement('label', { htmlFor: 'local-signal' },
                    React.createElement('strong', null, t.signaling.localSignalLabel)
                  ),
                  React.createElement('button', {
                    onClick: handleCopySignal,
                    disabled: !localSignal,
                    className: 'copy-signal-button',
                    'aria-label': t.signaling.copyAriaLabel
                  }, copyButtonText)
                ),
                React.createElement('textarea', {
                  id: 'local-signal',
                  readOnly: true,
                  value: localSignal,
                  placeholder: t.signaling.localSignalPlaceholder
                })
              ),
              React.createElement('label', null,
                React.createElement('strong', null, t.signaling.remoteSignalLabel),
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
                  placeholder: t.signaling.remoteSignalPlaceholder
                })
            )
          )
        ),
        React.createElement('section', { id: 'screen-share' },
          React.createElement('header', null,
            React.createElement('div', { className: 'header-content' },
              React.createElement('h2', null, t.screenShare.header),
              React.createElement('p', { className: 'status', id: 'screen-share-status' }, screenShareHeaderStatus)
            ),
            React.createElement('div', { className: 'header-actions screen-share-actions' },
              React.createElement('button', {
                type: 'button',
                onClick: handleStartScreenShare,
                disabled: !channelReady || isScreenSharing,
                'aria-label': t.screenShare.actions.startAria
              }, isScreenSharing ? t.screenShare.actions.sharing : t.screenShare.actions.start),
              React.createElement('button', {
                type: 'button',
                onClick: handleStopScreenShare,
                disabled: !isScreenSharing,
                'aria-label': t.screenShare.actions.stopAria
              }, t.screenShare.actions.stop)
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
              React.createElement('span', null, t.screenShare.includeAudio)
            ),
            React.createElement('button', {
              type: 'button',
              className: 'remote-control-toggle',
              onClick: handleToggleRemoteControl,
              disabled: !isScreenSharing || !controlChannelReady
            }, isRemoteControlAllowed ? t.remoteControl.actions.disable : t.remoteControl.actions.allow),
            React.createElement('div', { className: 'control-status' },
              React.createElement('strong', null, t.remoteControl.label),
              React.createElement('span', null, controlStatusLabel)
            )
          ),
          React.createElement('div', { className: 'screen-share-grid' },
            React.createElement('div', { className: 'screen-tile local' },
              React.createElement('h3', null, t.screenShare.local.title),
              React.createElement('div', { className: 'screen-preview' },
                React.createElement('video', {
                  ref: localScreenVideoRef,
                  muted: true,
                  autoPlay: true,
                  playsInline: true,
                  'aria-label': t.screenShare.local.aria
                }),
                !isScreenSharing && React.createElement('div', { className: 'screen-placeholder' },
                  React.createElement('p', null, channelReady ? t.screenShare.local.placeholderReady : t.screenShare.local.placeholderDisconnected)
                )
              )
            ),
            React.createElement('div', { className: 'screen-tile remote' },
              React.createElement('h3', null, t.screenShare.remote.title),
              React.createElement('div', {
                className: remotePreviewClass,
                ref: remoteControlSurfaceRef,
                role: canControlPeer ? 'group' : 'presentation',
                tabIndex: canControlPeer ? 0 : -1,
                'aria-disabled': canControlPeer ? 'false' : 'true',
                'aria-label': canControlPeer
                  ? t.screenShare.remote.ariaInteractive
                  : t.screenShare.remote.aria
              },
                React.createElement('video', {
                  ref: remoteScreenVideoRef,
                  autoPlay: true,
                  playsInline: true,
                  'aria-label': t.screenShare.remote.streamAria
                })
              ),
              React.createElement('p', { className: 'hint remote-screen-hint' },
                canControlPeer
                  ? t.remoteControl.hints.active
                  : remoteScreenHeaderStatus
              )
            )
          ),
          React.createElement('p', { className: 'hint screen-share-footnote' },
            t.screenShare.footnote
          )
        ),
        React.createElement('section', { id: 'chat' },
            React.createElement('header', null,
              React.createElement('div', { className: 'header-content' },
                React.createElement('h2', null, t.chat.title),
                React.createElement('p', { className: 'status', id: 'channel-status' }, channelStatus)
              ),
            React.createElement('div', { className: 'header-actions' },
              React.createElement('label', {
                htmlFor: 'language-select',
                className: 'language-label'
              }, t.language.label + ':'),
              React.createElement('select', {
                id: 'language-select',
                value: language,
                onChange: handleLanguageChange,
                className: 'language-select',
                'aria-label': t.language.ariaLabel,
                disabled: isApiKeyModalOpen
              },
                getAvailableLanguages().map((lang) =>
                  React.createElement('option', {
                    key: lang.code,
                    value: lang.code
                  }, lang.name)
                )
              ),
              React.createElement('button', {
                type: 'button',
                className: 'api-key-button',
                onClick: handleOpenApiKeyModal,
                ref: apiKeyButtonRef,
                disabled: isApiKeyModalOpen
              }, openAiKey ? t.chat.updateApiKey : t.chat.addApiKey),
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
                'aria-label': t.chat.clearAriaLabel,
                disabled: isApiKeyModalOpen
              }, t.chat.clear)
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
                  }, t.chat.emptyState)
                : messages.map((message) => (
                    React.createElement('div', {
                      key: message.id,
                      className: 'chat-line',
                      'data-role': message.role
                    },
                    React.createElement('strong', null, t.chat.roleLabels[message.role] || t.chat.roleLabels.system),
                    React.createElement('span', null, message.text))
                  ))
            ),
            React.createElement('div', { className: 'chat-input' },
              React.createElement('input', {
                id: 'outgoing',
                type: 'text',
                placeholder: t.chat.inputPlaceholder,
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
                'aria-label': t.chat.inputAriaLabel,
                'aria-describedby': 'channel-status'
              }),
              React.createElement('button', {
                type: 'button',
                className: 'ai-button',
                onClick: handleAiRewrite,
                disabled: isAiBusy || !inputText.trim(),
                'aria-label': openAiKey ? t.chat.aiButton : t.chat.aiButtonNoKey,
                title: openAiKey ? t.chat.aiButtonTitle : t.chat.aiButtonTitleNoKey
              }, isAiBusy ? t.chat.aiButtonBusy : t.chat.aiButton),
              React.createElement('button', {
                id: 'send',
                onClick: handleSend,
                disabled: !channelReady || !inputText.trim(),
                'aria-label': t.chat.sendAriaLabel,
                title: t.chat.sendTitle
              }, t.chat.send)
            ),
            React.createElement('p', {
              className: 'hint chat-counter',
              role: 'note'
            }, t.chat.charCount(inputText.length, MAX_MESSAGE_LENGTH)),
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
