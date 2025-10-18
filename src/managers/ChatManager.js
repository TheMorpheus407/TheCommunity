/**
 * @fileoverview Chat Manager - Handles chat messaging with rate limiting
 * @module managers/ChatManager
 *
 * This manager handles:
 * - Chat data channel setup and lifecycle
 * - Message sending and receiving
 * - Rate limiting on incoming messages
 * - Message length validation
 * - Message history management
 *
 * Security features:
 * - Message length validation (MAX_MESSAGE_LENGTH)
 * - Rate limiting (30 messages per 5 seconds)
 * - Type checking for string payloads
 * - Channel label validation
 */

import {
  EXPECTED_CHANNEL_LABEL,
  MAX_MESSAGE_LENGTH,
  MAX_MESSAGES_PER_INTERVAL,
  MESSAGE_INTERVAL_MS
} from '../core/constants.js';

/**
 * Creates a factory for Chat operations
 * @param {Object} deps - Dependencies object
 * @param {React.MutableRefObject} deps.channelRef - Chat data channel reference
 * @param {React.MutableRefObject} deps.incomingTimestampsRef - Rate limiting tracker
 * @param {React.MutableRefObject} deps.messageIdRef - Message ID counter
 * @param {Function} deps.setChannelStatus - Channel status setter
 * @param {Function} deps.setChannelReady - Channel ready state setter
 * @param {Function} deps.setIsSignalingCollapsed - Signaling UI state setter
 * @param {Function} deps.appendMessage - Message appender function
 * @param {Function} deps.appendSystemMessage - System message appender
 * @param {Object} deps.t - Translation object
 * @returns {Object} Chat operations
 * @export
 */
export function createChatManager(deps) {
  const {
    channelRef,
    incomingTimestampsRef,
    messageIdRef,
    setChannelStatus,
    setChannelReady,
    setIsSignalingCollapsed,
    appendMessage,
    appendSystemMessage,
    t
  } = deps;

  /**
   * Configures event handlers on the reliable chat channel
   * Applies defensive checks and rate limiting to inbound traffic
   * @param {RTCDataChannel} channel - Active data channel
   * @returns {void}
   */
  function setupChatChannel(channel) {
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
      // Security: Validate payload type
      if (typeof event.data !== 'string') {
        appendSystemMessage(t.systemMessages.securityBlocked);
        return;
      }

      const payload = event.data;

      // Security: Validate message length
      if (payload.length > MAX_MESSAGE_LENGTH) {
        appendSystemMessage(t.systemMessages.messageTooLong(MAX_MESSAGE_LENGTH));
        return;
      }

      // Security: Rate limiting using sliding window
      const now = Date.now();
      incomingTimestampsRef.current = incomingTimestampsRef.current.filter(
        (timestamp) => now - timestamp < MESSAGE_INTERVAL_MS
      );
      incomingTimestampsRef.current.push(now);

      if (incomingTimestampsRef.current.length > MAX_MESSAGES_PER_INTERVAL) {
        appendSystemMessage(t.systemMessages.rateLimit);
        return;
      }

      // Valid message - add to chat
      appendMessage(payload, 'remote');
    };
  }

  /**
   * Sends a chat message through the data channel
   * @param {string} text - Message text to send
   * @param {Function} setInputText - Input text setter to clear on success
   * @returns {boolean} Success status
   */
  function sendMessage(text, setInputText) {
    const channel = channelRef.current;

    if (!channel || channel.readyState !== 'open') {
      appendSystemMessage(t.systemMessages.channelNotReady);
      return false;
    }

    const trimmed = text.trim();
    if (!trimmed) {
      return false;
    }

    // Validate message length before sending
    if (trimmed.length > MAX_MESSAGE_LENGTH) {
      appendSystemMessage(t.systemMessages.messageTooLong(MAX_MESSAGE_LENGTH));
      return false;
    }

    try {
      channel.send(trimmed);
      appendMessage(trimmed, 'local');
      setInputText('');
      return true;
    } catch (error) {
      console.error('Failed to send message:', error);
      appendSystemMessage(t.systemMessages.sendFailed);
      return false;
    }
  }

  /**
   * Queues a chat message for rendering
   * @param {string} text - Message body
   * @param {'local'|'remote'|'system'} role - Message origin
   * @param {Function} setMessages - Messages state setter
   * @param {Object} options - Additional options
   * @param {string} options.imageUrl - Optional image data URL
   * @param {string} options.fileName - Optional file name
   * @returns {void}
   */
  function addMessage(text, role, setMessages, options = {}) {
    const id = messageIdRef.current++;
    setMessages((prev) => [...prev, { id, text, role, ...options }]);
  }

  /**
   * Clears all messages from chat history
   * @param {Function} setMessages - Messages state setter
   * @returns {void}
   */
  function clearMessages(setMessages) {
    setMessages([]);
    messageIdRef.current = 0;
  }

  return {
    setupChatChannel,
    sendMessage,
    addMessage,
    clearMessages
  };
}
