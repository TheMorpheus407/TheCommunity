/**
 * @fileoverview Remote Control Manager - Handles remote screen control via WebRTC
 * @module managers/RemoteControlManager
 *
 * This manager handles:
 * - Remote control permission management
 * - Pointer movement and click events
 * - Remote keyboard input with budget limiting
 * - Control message parsing and validation
 * - Rate limiting on control messages
 *
 * Security features:
 * - Rate limiting (60 messages per 5 seconds)
 * - Payload size validation (max 2048 bytes)
 * - Text input budget limiting (2048 total characters)
 * - Input sanitization (control characters filtered)
 * - Click target validation (only #outgoing input)
 * - Requires active screen sharing
 */

import {
  CONTROL_CHANNEL_LABEL,
  CONTROL_MAX_MESSAGES_PER_INTERVAL,
  CONTROL_MESSAGE_INTERVAL_MS,
  CONTROL_MAX_PAYLOAD_LENGTH,
  CONTROL_TEXT_INSERT_LIMIT,
  CONTROL_TOTAL_TEXT_BUDGET,
  CONTROL_MESSAGE_TYPES,
  MAX_MESSAGE_LENGTH
} from '../core/constants.js';

/**
 * Creates a factory for Remote Control operations
 * @param {Object} deps - Dependencies object
 * @param {React.MutableRefObject} deps.controlChannelRef - Control channel reference
 * @param {React.MutableRefObject} deps.controlIncomingTimestampsRef - Rate limiting timestamps
 * @param {React.MutableRefObject} deps.controlWarningsRef - Warning state tracker
 * @param {React.MutableRefObject} deps.remoteControlAllowedRef - Remote control allowed ref
 * @param {React.MutableRefObject} deps.canControlPeerRef - Can control peer ref
 * @param {React.MutableRefObject} deps.remoteKeyBudgetRef - Text input budget ref
 * @param {React.MutableRefObject} deps.remotePointerTimeoutRef - Pointer hide timeout
 * @param {React.MutableRefObject} deps.pointerFramePendingRef - RAF pending flag
 * @param {React.MutableRefObject} deps.pointerFrameIdRef - RAF ID
 * @param {React.MutableRefObject} deps.pointerQueuedPositionRef - Queued pointer position
 * @param {Function} deps.setControlChannelReady - Control channel ready setter
 * @param {Function} deps.setCanControlPeer - Can control peer setter
 * @param {Function} deps.setIsRemoteControlAllowed - Remote control allowed setter
 * @param {Function} deps.setRemoteControlStatus - Remote control status setter
 * @param {Function} deps.setRemotePointerState - Remote pointer state setter
 * @param {Function} deps.setInputText - Input text setter
 * @param {Function} deps.setAiStatus - AI status setter
 * @param {Function} deps.setAiError - AI error setter
 * @param {Function} deps.appendSystemMessage - System message appender
 * @param {Function} deps.handleSend - Send message function
 * @param {Object} deps.t - Translation object
 * @returns {Object} Remote control operations
 * @export
 */
export function createRemoteControlManager(deps) {
  const {
    controlChannelRef,
    controlIncomingTimestampsRef,
    controlWarningsRef,
    remoteControlAllowedRef,
    canControlPeerRef,
    remoteKeyBudgetRef,
    remotePointerTimeoutRef,
    pointerFramePendingRef,
    pointerFrameIdRef,
    pointerQueuedPositionRef,
    setControlChannelReady,
    setCanControlPeer,
    setIsRemoteControlAllowed,
    setRemoteControlStatus,
    setRemotePointerState,
    setInputText,
    setAiStatus,
    setAiError,
    appendSystemMessage,
    handleSend,
    t
  } = deps;

  /**
   * Cancels pending pointer animation frame
   * @returns {void}
   */
  function cancelPendingPointerFrame() {
    if (pointerFramePendingRef.current && pointerFrameIdRef.current !== null) {
      cancelAnimationFrame(pointerFrameIdRef.current);
    }
    pointerFramePendingRef.current = false;
    pointerFrameIdRef.current = null;
    pointerQueuedPositionRef.current = null;
  }

  /**
   * Hides the remote pointer indicator
   * @returns {void}
   */
  function hideRemotePointer() {
    if (remotePointerTimeoutRef.current) {
      clearTimeout(remotePointerTimeoutRef.current);
      remotePointerTimeoutRef.current = null;
    }
    setRemotePointerState((prev) => (prev.visible ? { ...prev, visible: false } : prev));
  }

  /**
   * Shows the remote pointer indicator at specified position
   * @param {number} xPercent - X position as percentage (0-100)
   * @param {number} yPercent - Y position as percentage (0-100)
   * @returns {void}
   */
  function showRemotePointer(xPercent, yPercent) {
    const clampedX = Math.min(100, Math.max(0, Number(xPercent)));
    const clampedY = Math.min(100, Math.max(0, Number(yPercent)));
    setRemotePointerState({ visible: true, x: clampedX, y: clampedY });

    if (remotePointerTimeoutRef.current) {
      clearTimeout(remotePointerTimeoutRef.current);
    }

    remotePointerTimeoutRef.current = setTimeout(() => {
      setRemotePointerState((prev) => (prev.visible ? { ...prev, visible: false } : prev));
    }, 1200);
  }

  /**
   * Performs a remote click at specified position
   * Security: Only allows interaction with #outgoing input element
   * @param {number} xPercent - X position as percentage
   * @param {number} yPercent - Y position as percentage
   * @param {string} button - Button type (only 'left' is allowed)
   * @returns {void}
   */
  function performRemoteClick(xPercent, yPercent, button = 'left') {
    // Security: Only allow left clicks
    if (button !== 'left') {
      return;
    }

    // Convert percentage to viewport coordinates
    const viewportWidth = window.innerWidth || document.documentElement.clientWidth || 0;
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight || 0;
    const clientX = (Number(xPercent) / 100) * viewportWidth;
    const clientY = (Number(yPercent) / 100) * viewportHeight;

    if (!Number.isFinite(clientX) || !Number.isFinite(clientY)) {
      return;
    }

    // Get element at click position
    const target = document.elementFromPoint(clientX, clientY);
    if (!target) {
      return;
    }

    // Security: Only allow clicks within main element
    const mainElement = document.querySelector('main');
    if (mainElement && !mainElement.contains(target)) {
      return;
    }

    // Find input element
    const input = target.closest('input, textarea');
    if (input instanceof HTMLInputElement || input instanceof HTMLTextAreaElement) {
      // Security: Only allow interaction with #outgoing input
      if (input.id !== 'outgoing') {
        return;
      }

      input.focus({ preventScroll: true });
      const valueLength = typeof input.value === 'string' ? input.value.length : 0;
      if (typeof input.setSelectionRange === 'function') {
        input.setSelectionRange(valueLength, valueLength);
      }
    }

    // Security: Intentionally ignore button clicks and other controls
  }

  /**
   * Applies a transformation to the input text
   * @param {Function} transform - Transform function (prev => next)
   * @returns {void}
   */
  function applyRemoteInputTransform(transform) {
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
  }

  /**
   * Handles remote keyboard input with budget limiting
   * @param {Object} message - Keyboard message
   * @param {Function} sendControlMessage - Control message sender
   * @returns {void}
   */
  function handleRemoteKeyboardInput(message, sendControlMessage) {
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
      // Security: Sanitize input - remove control characters and limit length
      const sanitized = raw.replace(/[\u0000-\u001F\u007F-\u009F]/g, '').slice(0, CONTROL_TEXT_INSERT_LIMIT);

      if (!sanitized) {
        return;
      }

      // Security: Check text input budget
      if (remoteKeyBudgetRef.current <= 0) {
        appendSystemMessage(t.remoteControl.system.typingDisabled);
        remoteControlAllowedRef.current = false;
        setIsRemoteControlAllowed(false);
        setRemoteControlStatus(t.remoteControl.statusDisabledInputLimit);
        hideRemotePointer();

        const delivered = sendControlMessage({
          type: CONTROL_MESSAGE_TYPES.PERMISSION,
          allowed: false
        });

        remoteKeyBudgetRef.current = CONTROL_TOTAL_TEXT_BUDGET;

        if (!delivered) {
          appendSystemMessage(t.remoteControl.system.revokeFailed);
        }
        return;
      }

      // Deduct from budget and insert text
      const allowedBudget = Math.min(remoteKeyBudgetRef.current, sanitized.length);
      remoteKeyBudgetRef.current -= allowedBudget;
      const textToInsert = sanitized.slice(0, allowedBudget);
      applyRemoteInputTransform((prev) => `${prev}${textToInsert}`);
      return;
    }

    if (message.mode === 'backspace') {
      applyRemoteInputTransform((prev) => prev.slice(0, Math.max(0, prev.length - 1)));
      return;
    }

    if (message.mode === 'enter') {
      handleSend();
    }
  }

  /**
   * Processes incoming control channel messages with rate limiting
   * @param {string} payload - Raw channel message
   * @param {Function} sendControlMessage - Control message sender
   * @returns {void}
   */
  function handleIncomingControlMessage(payload, sendControlMessage) {
    if (typeof payload !== 'string' || !payload) {
      return;
    }

    // Security: Validate payload size
    if (payload.length > CONTROL_MAX_PAYLOAD_LENGTH) {
      if (!controlWarningsRef.current.size) {
        appendSystemMessage(t.remoteControl.system.payloadTooLarge);
        controlWarningsRef.current.size = true;
      }
      return;
    }
    controlWarningsRef.current.size = false;

    // Security: Rate limiting using sliding window
    const now = Date.now();
    controlIncomingTimestampsRef.current = controlIncomingTimestampsRef.current.filter(
      (timestamp) => now - timestamp < CONTROL_MESSAGE_INTERVAL_MS
    );

    if (controlIncomingTimestampsRef.current.length >= CONTROL_MAX_MESSAGES_PER_INTERVAL) {
      if (!controlWarningsRef.current.rate) {
        appendSystemMessage(t.remoteControl.system.rateLimited);
        controlWarningsRef.current.rate = true;
      }
      return;
    }

    controlIncomingTimestampsRef.current.push(now);
    controlWarningsRef.current.rate = false;

    // Parse message
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

    // Route message by type
    switch (message.type) {
      case CONTROL_MESSAGE_TYPES.PERMISSION: {
        if (typeof message.allowed !== 'boolean') {
          return;
        }
        const allowed = Boolean(message.allowed);
        if (canControlPeerRef.current !== allowed) {
          appendSystemMessage(allowed
            ? t.remoteControl.system.peerEnabled
            : t.remoteControl.system.peerDisabled);
        }
        canControlPeerRef.current = allowed;
        setCanControlPeer(allowed);
        setRemoteControlStatus(allowed ? t.remoteControl.statusGranted : t.remoteControl.statusDisabledByPeer);
        if (!allowed) {
          cancelPendingPointerFrame();
          hideRemotePointer();
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
        showRemotePointer(x, y);
        if (message.kind === 'click') {
          const button = typeof message.button === 'string' ? message.button : 'left';
          performRemoteClick(x, y, button);
        }
        return;
      }

      case CONTROL_MESSAGE_TYPES.POINTER_VISIBILITY: {
        if (!remoteControlAllowedRef.current) {
          return;
        }
        if (message.visible === false) {
          hideRemotePointer();
        }
        return;
      }

      case CONTROL_MESSAGE_TYPES.KEYBOARD: {
        if (!remoteControlAllowedRef.current) {
          return;
        }
        handleRemoteKeyboardInput(message, sendControlMessage);
        return;
      }

      case CONTROL_MESSAGE_TYPES.ACTION: {
        if (!remoteControlAllowedRef.current) {
          return;
        }
        if (message.action === 'clear-input') {
          applyRemoteInputTransform(() => '');
        }
        return;
      }

      default:
        // Unknown message type - ignore
    }
  }

  /**
   * Configures event handlers for the control data channel
   * @param {RTCDataChannel} channel - Control channel instance
   * @param {Function} sendControlMessage - Control message sender
   * @returns {void}
   */
  function setupControlChannel(channel, sendControlMessage) {
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
      hideRemotePointer();
      cancelPendingPointerFrame();
      remoteKeyBudgetRef.current = CONTROL_TOTAL_TEXT_BUDGET;
      setRemoteControlStatus(t.remoteControl.statusChannelClosed);
    };

    channel.onmessage = (event) => {
      if (typeof event.data !== 'string') {
        return;
      }
      handleIncomingControlMessage(event.data, sendControlMessage);
    };
  }

  /**
   * Sends a control message through the data channel
   * @param {Object} message - Message object to send
   * @returns {boolean} Success status
   */
  function sendControlMessage(message) {
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
      appendSystemMessage(t.remoteControl.system.deliveryFailed);
      return false;
    }
  }

  /**
   * Toggles remote control permission
   * @param {boolean} controlChannelReady - Control channel ready state
   * @param {boolean} isScreenSharing - Screen sharing active state
   * @returns {void}
   */
  function toggleRemoteControl(controlChannelReady, isScreenSharing) {
    if (!controlChannelReady) {
      appendSystemMessage(t.remoteControl.system.unavailable);
      return;
    }

    const channel = controlChannelRef.current;
    if (!channel || channel.readyState !== 'open') {
      appendSystemMessage(t.remoteControl.system.negotiating);
      return;
    }

    // Security: Require active screen sharing
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
    setRemoteControlStatus(next ? t.remoteControl.statusEnabled : t.remoteControl.statusDisabled);
    appendSystemMessage(next ? t.remoteControl.system.enabled : t.remoteControl.system.disabled);

    if (!next) {
      hideRemotePointer();
      remoteKeyBudgetRef.current = CONTROL_TOTAL_TEXT_BUDGET;
    }
  }

  return {
    setupControlChannel,
    sendControlMessage,
    toggleRemoteControl,
    handleIncomingControlMessage,
    handleRemoteKeyboardInput,
    cancelPendingPointerFrame,
    hideRemotePointer,
    showRemotePointer,
    performRemoteClick,
    applyRemoteInputTransform
  };
}
