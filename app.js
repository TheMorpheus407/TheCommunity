/**
 * Peer-to-peer WebRTC chat application bootstrap.
 * Allows two browsers to exchange messages without a signaling server.
 */
(function () {
  const { useState, useRef, useCallback, useEffect } = React;

  const EXPECTED_CHANNEL_LABEL = 'chat';
  const MAX_MESSAGE_LENGTH = 2000;
  const MAX_MESSAGES_PER_INTERVAL = 30;
  const MESSAGE_INTERVAL_MS = 5000;

  const ROLE_LABELS = {
    local: 'You',
    remote: 'Peer',
    system: 'Notice'
  };

  /**
   * Root React component that coordinates WebRTC setup and the user interface.
   * @returns {React.ReactElement}
   */
  function App() {
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

    const pcRef = useRef(null);
    const channelRef = useRef(null);
    const iceDoneRef = useRef(false);
    const incomingTimestampsRef = useRef([]);
    const messageIdRef = useRef(0);
    const messagesContainerRef = useRef(null);
    const aboutButtonRef = useRef(null);
    const closeAboutButtonRef = useRef(null);
    const contributorsLoadedRef = useRef(false);

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

    /**
     * Configures event handlers on the reliable data channel.
     * Applies defensive checks and rate limiting to inbound traffic.
     * @param {RTCDataChannel} channel - Active data channel
     */
    const setupChannelHandlers = useCallback((channel) => {
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
     * Lazily creates (or returns) the RTCPeerConnection instance.
     * @returns {RTCPeerConnection}
     */
    const ensurePeerConnection = useCallback(() => {
      if (pcRef.current) {
        return pcRef.current;
      }
      const pc = new RTCPeerConnection({ iceServers: [] });
      pcRef.current = pc;

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

      pc.ondatachannel = (event) => {
        const incomingChannel = event.channel;
        if (incomingChannel.label !== EXPECTED_CHANNEL_LABEL) {
          appendSystemMessage(`Security notice: blocked unexpected data channel "${incomingChannel.label || 'unnamed'}".`);
          incomingChannel.close();
          return;
        }
        channelRef.current = incomingChannel;
        setupChannelHandlers(incomingChannel);
      };

      return pc;
    }, [appendSystemMessage, setupChannelHandlers]);

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
      const channel = pc.createDataChannel(EXPECTED_CHANNEL_LABEL);
      channelRef.current = channel;
      setupChannelHandlers(channel);

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
    }, [appendSystemMessage, ensurePeerConnection, setupChannelHandlers, waitForIce]);

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
    }, [appendMessage, appendSystemMessage, inputText]);

    const toggleSignalingCollapse = useCallback(() => {
      setIsSignalingCollapsed((prev) => !prev);
    }, []);

    const toggleAbout = useCallback(() => {
      setIsAboutOpen((prev) => !prev);
    }, []);

    useEffect(() => {
      if (isAboutOpen) {
        if (closeAboutButtonRef.current) {
          closeAboutButtonRef.current.focus();
        }
      } else if (aboutButtonRef.current) {
        aboutButtonRef.current.focus();
      }
    }, [isAboutOpen]);

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

    return (
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
            ref: aboutButtonRef
          }, 'About')
        ),
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
              }, 'Apply Remote')
            ),
            React.createElement('label', null,
              React.createElement('strong', null, 'Local Signal (share this)'),
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
                placeholder: 'Paste the JSON you received and click Apply Remote.'
              })
            )
          )
        ),
        React.createElement('section', { id: 'chat' },
          React.createElement('header', null,
            React.createElement('h2', null, 'Chat'),
            React.createElement('p', { className: 'status', id: 'channel-status' }, channelStatus)
          ),
          React.createElement('div', {
            id: 'messages',
            'aria-live': 'polite',
            ref: messagesContainerRef
          }, messages.map((message) => (
            React.createElement('div', {
              key: message.id,
              className: 'chat-line',
              'data-role': message.role
            },
            React.createElement('strong', null, ROLE_LABELS[message.role] || 'Notice'),
            React.createElement('span', null, message.text))
          ))),
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
              id: 'send',
              onClick: handleSend,
              disabled: !channelReady || !inputText.trim(),
              'aria-label': 'Send message',
              title: 'Send message'
            }, 'Send')
          )
        )
      )
    );
  }

  const rootElement = document.getElementById('root');
  const root = ReactDOM.createRoot(rootElement);
  root.render(React.createElement(App));
})();
