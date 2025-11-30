/**
 * @fileoverview E2EE Channel Wrapper - Wraps RTCDataChannel with transparent encryption
 * @module managers/E2EEChannelWrapper
 *
 * This module provides a transparent encryption layer for RTCDataChannel:
 * - Wraps send() to automatically encrypt outgoing messages
 * - Wraps onmessage to automatically decrypt incoming messages
 * - Maintains backward compatibility with existing channel handlers
 * - Provides security status indicators
 */

import { E2EE_MESSAGE_TYPE } from '../core/constants.js';

/**
 * Wraps an RTCDataChannel with E2EE encryption/decryption
 * @param {RTCDataChannel} channel - The data channel to wrap
 * @param {Object} securityManager - SecurityManager instance
 * @param {Function} onSecurityError - Callback for security errors
 * @returns {RTCDataChannel} The wrapped channel (same object, modified)
 */
export function wrapChannelWithE2EE(channel, securityManager, onSecurityError) {
  if (!channel || !securityManager) {
    console.warn('Cannot wrap channel: missing channel or securityManager');
    return channel;
  }

  // Store original send function
  const originalSend = channel.send.bind(channel);

  // Store original onmessage handler
  let originalOnMessage = null;

  // Override send function to encrypt
  channel.send = function(data) {
    // Only encrypt if security manager is ready
    if (!securityManager.isReady()) {
      console.warn('E2EE not ready, sending unencrypted');
      return originalSend(data);
    }

    // Handle different data types
    if (typeof data === 'string') {
      // Encrypt string data
      securityManager.encrypt(data)
        .then((encrypted) => {
          const envelope = {
            type: E2EE_MESSAGE_TYPE,
            payload: encrypted
          };
          originalSend(JSON.stringify(envelope));
        })
        .catch((error) => {
          console.error('E2EE encryption failed:', error);
          if (onSecurityError) {
            onSecurityError('encryption_failed', error);
          }
          // Fallback: send unencrypted (or throw error in strict mode)
          originalSend(data);
        });
    } else if (data instanceof ArrayBuffer || data instanceof Blob) {
      // For binary data (images, files), we'll handle separately
      // For now, pass through without encryption
      originalSend(data);
    } else {
      // Unknown type, pass through
      originalSend(data);
    }
  };

  // Create a proxy for onmessage to decrypt
  Object.defineProperty(channel, 'onmessage', {
    get() {
      return originalOnMessage;
    },
    set(handler) {
      originalOnMessage = handler;

      // Install our decryption wrapper
      channel.addEventListener('message', async (event) => {
        try {
          // Check if this is an encrypted message
          if (typeof event.data === 'string' && event.data.trim().startsWith('{')) {
            try {
              const parsed = JSON.parse(event.data);

              if (parsed.type === E2EE_MESSAGE_TYPE && parsed.payload) {
                // This is an encrypted message
                if (!securityManager.isReady()) {
                  console.error('Received encrypted message but E2EE not ready');
                  if (onSecurityError) {
                    onSecurityError('decryption_not_ready');
                  }
                  return;
                }

                // Decrypt the payload
                const decrypted = await securityManager.decrypt(parsed.payload);

                // Create a new event with decrypted data
                const decryptedEvent = {
                  ...event,
                  data: decrypted
                };

                // Call original handler with decrypted data
                if (originalOnMessage) {
                  originalOnMessage.call(channel, decryptedEvent);
                }
                return;
              }
            } catch (parseError) {
              // Not JSON or not encrypted envelope, treat as plain message
            }
          }

          // Not encrypted, pass through to original handler
          if (originalOnMessage) {
            originalOnMessage.call(channel, event);
          }
        } catch (error) {
          console.error('E2EE message processing error:', error);
          if (onSecurityError) {
            onSecurityError('message_processing_failed', error);
          }
        }
      });
    },
    configurable: true
  });

  return channel;
}

/**
 * Creates an E2EE-aware channel setup function
 * @param {Function} originalSetup - Original channel setup function
 * @param {Object} securityManager - SecurityManager instance
 * @param {Function} onSecurityError - Callback for security errors
 * @returns {Function} Wrapped setup function
 */
export function createE2EEChannelSetup(originalSetup, securityManager, onSecurityError) {
  return function(channel) {
    // Wrap channel with E2EE
    wrapChannelWithE2EE(channel, securityManager, onSecurityError);

    // Call original setup
    return originalSetup(channel);
  };
}
