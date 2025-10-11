(function () {
  const { useState, useRef, useCallback, useEffect } = React;

  const EXPECTED_CHANNEL_LABEL = 'chat';
  const MAX_MESSAGE_LENGTH = 2000;
  const MAX_MESSAGES_PER_INTERVAL = 30;
  const MESSAGE_INTERVAL_MS = 5000;

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
    const [isChatMinimized, setIsChatMinimized] = useState(false);

    const pcRef = useRef(null);
    const channelRef = useRef(null);
    const iceDoneRef = useRef(false);
    const incomingTimestampsRef = useRef([]);
    const messageIdRef = useRef(0);
    const messagesContainerRef = useRef(null);

    const appendMessage = useCallback((text, role) => {
      const id = messageIdRef.current++;
      setMessages((prev) => [...prev, { id, text, role }]);
    }, []);

    const appendSystemMessage = useCallback((text) => {
      appendMessage(text, 'system');
    }, [appendMessage]);

    const setupChannelHandlers = useCallback((channel) => {
      channel.onopen = () => {
        setChannelStatus('Channel open');
        setChannelReady(true);
        incomingTimestampsRef.current = [];
      };
      channel.onclose = () => {
        setChannelStatus('Channel closed');
        setChannelReady(false);
        incomingTimestampsRef.current = [];
        channelRef.current = null;
      };
      channel.onmessage = (event) => {
        if (typeof event.data !== 'string') {
          appendSystemMessage('Blocked non-text message from peer.');
          return;
        }
        const payload = event.data;
        if (payload.length > MAX_MESSAGE_LENGTH) {
          appendSystemMessage('Blocked oversized message from peer.');
          return;
        }
        const now = Date.now();
        incomingTimestampsRef.current = incomingTimestampsRef.current.filter(
          (timestamp) => now - timestamp < MESSAGE_INTERVAL_MS
        );
        incomingTimestampsRef.current.push(now);
        if (incomingTimestampsRef.current.length > MAX_MESSAGES_PER_INTERVAL) {
          appendSystemMessage('Peer is sending messages too quickly; message ignored.');
          return;
        }
        appendMessage(payload, 'remote');
      };
    }, [appendMessage, appendSystemMessage]);

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
          appendSystemMessage(`Blocked unexpected data channel "${incomingChannel.label || 'unnamed'}".`);
          incomingChannel.close();
          return;
        }
        channelRef.current = incomingChannel;
        setupChannelHandlers(incomingChannel);
      };

      return pc;
    }, [appendSystemMessage, setupChannelHandlers]);

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

    const parseRemoteDescription = useCallback(() => {
      const raw = remoteSignal.trim();
      if (!raw) {
        throw new Error('Remote signal is empty.');
      }
      let desc;
      try {
        desc = JSON.parse(raw);
      } catch (err) {
        throw new Error('Signal must be the exact JSON from the other peer.');
      }
      if (!desc.type || !desc.sdp || !['offer', 'answer'].includes(desc.type)) {
        throw new Error('Unsupported remote description.');
      }
      return desc;
    }, [remoteSignal]);

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
        appendSystemMessage('Unable to create offer. Check console for details.');
      } finally {
        setIsCreatingOffer(false);
      }
    }, [appendSystemMessage, ensurePeerConnection, setupChannelHandlers, waitForIce]);

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
        appendSystemMessage('Unable to create answer. Check console for details.');
      } finally {
        setIsCreatingAnswer(false);
      }
    }, [appendSystemMessage, ensurePeerConnection, parseRemoteDescription, waitForIce]);

    const handleSend = useCallback(() => {
      const channel = channelRef.current;
      const trimmed = inputText.trim();
      if (!channel || channel.readyState !== 'open' || !trimmed) {
        return;
      }
      if (trimmed.length > MAX_MESSAGE_LENGTH) {
        appendSystemMessage(`Message too long. Limit is ${MAX_MESSAGE_LENGTH} characters.`);
        return;
      }
      channel.send(trimmed);
      appendMessage(trimmed, 'local');
      setInputText('');
    }, [appendMessage, appendSystemMessage, inputText]);

    useEffect(() => {
      const container = messagesContainerRef.current;
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    }, [messages]);

    useEffect(() => {
      if (channelReady && !isSignalingCollapsed) {
        setIsSignalingCollapsed(true);
      }
    }, [channelReady, isSignalingCollapsed]);

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

    const roleLabels = {
      local: 'You',
      remote: 'Peer',
      system: 'Notice'
    };

    return (
      React.createElement(React.Fragment, null,
        React.createElement('main', null,
          React.createElement('section', { id: 'signaling', className: isSignalingCollapsed ? 'collapsed' : '' },
          React.createElement('header', null,
            React.createElement('h2', null, 'Manual Signaling'),
            React.createElement('div', { className: 'header-right' },
              React.createElement('p', { className: 'status', id: 'status' }, status),
              React.createElement('button', {
                className: 'toggle-collapse',
                onClick: () => setIsSignalingCollapsed(!isSignalingCollapsed),
                'aria-label': isSignalingCollapsed ? 'Expand signaling panel' : 'Collapse signaling panel',
                'aria-expanded': !isSignalingCollapsed
              }, React.createElement('span', { 'aria-hidden': 'true' }, isSignalingCollapsed ? '▼' : '▲'))
            )
          ),
          !isSignalingCollapsed && React.createElement('div', { className: 'collapsible-content' },
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
        React.createElement('div', {
          id: 'floating-chat',
          className: isChatMinimized ? 'minimized' : ''
        },
          React.createElement('section', { id: 'chat' },
            React.createElement('header', null,
              React.createElement('h2', null, 'Chat'),
              React.createElement('div', { className: 'header-right' },
                React.createElement('p', { className: 'status', id: 'channel-status' }, channelStatus),
                React.createElement('button', {
                  className: 'toggle-collapse',
                  onClick: () => setIsChatMinimized(!isChatMinimized),
                  'aria-label': isChatMinimized ? 'Expand chat' : 'Minimize chat',
                  'aria-expanded': !isChatMinimized
                }, React.createElement('span', { 'aria-hidden': 'true' }, isChatMinimized ? '▲' : '▼'))
              )
            ),
            !isChatMinimized && React.createElement('div', { className: 'chat-content' },
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
                React.createElement('strong', null, roleLabels[message.role] || 'Notice'),
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
                  maxLength: MAX_MESSAGE_LENGTH
                }),
                React.createElement('button', {
                  id: 'send',
                  onClick: handleSend,
                  disabled: !channelReady || !inputText.trim()
                }, 'Send')
              )
            )
          )
        )
      )
    );
  }

  const rootElement = document.getElementById('root');
  const root = ReactDOM.createRoot(rootElement);
  root.render(React.createElement(App));
})();
