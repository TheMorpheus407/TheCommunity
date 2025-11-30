/**
 * @fileoverview E2EE Integration - Integrates E2EE with WebRTC signaling
 * @module managers/E2EEIntegration
 *
 * This module handles:
 * - Embedding E2EE public keys in SDP
 * - Extracting E2EE public keys from remote SDP
 * - Managing E2EE lifecycle with WebRTC connection
 */

import { E2EE_SDP_ATTRIBUTE } from '../core/constants.js';
import { createSecurityManager } from './SecurityManager.js';

/**
 * Creates an E2EE integration instance
 * @param {Function} appendSystemMessage - System message callback
 * @param {Object} t - Translation object
 * @returns {Object} E2EE integration instance
 */
export function createE2EEIntegration(appendSystemMessage, t) {
  const securityManager = createSecurityManager();
  let isInitialized = false;

  /**
   * Initializes E2EE by generating a key pair
   * @returns {Promise<void>}
   */
  async function initialize() {
    if (isInitialized) {
      return;
    }

    try {
      await securityManager.generateKeyPair();
      isInitialized = true;
      console.log('E2EE initialized');
    } catch (error) {
      console.error('E2EE initialization failed:', error);
      appendSystemMessage(t?.systemMessages?.e2eeInitFailed || 'E2EE initialization failed');
      throw error;
    }
  }

  /**
   * Embeds the local E2EE public key into SDP
   * @param {string} sdp - Original SDP string
   * @returns {Promise<string>} Modified SDP with embedded public key
   */
  async function embedPublicKeyInSDP(sdp) {
    if (!isInitialized) {
      await initialize();
    }

    try {
      const publicKey = await securityManager.exportPublicKey();

      // Add custom attribute to SDP
      // Format: a=x-e2ee-pubkey:<base64-encoded-public-key>
      const lines = sdp.split('\r\n');
      const modifiedLines = [];

      // Find the first m= line and insert before it
      let inserted = false;
      for (const line of lines) {
        if (!inserted && line.startsWith('m=')) {
          modifiedLines.push(`a=${E2EE_SDP_ATTRIBUTE}:${publicKey}`);
          inserted = true;
        }
        modifiedLines.push(line);
      }

      // If no m= line found (shouldn't happen), append at end
      if (!inserted) {
        modifiedLines.push(`a=${E2EE_SDP_ATTRIBUTE}:${publicKey}`);
      }

      return modifiedLines.join('\r\n');
    } catch (error) {
      console.error('Failed to embed public key in SDP:', error);
      // Return original SDP if embedding fails
      return sdp;
    }
  }

  /**
   * Extracts the remote E2EE public key from SDP
   * @param {string} sdp - Remote SDP string
   * @returns {Promise<string|null>} Extracted public key or null
   */
  async function extractPublicKeyFromSDP(sdp) {
    try {
      const lines = sdp.split('\r\n');
      const attributePrefix = `a=${E2EE_SDP_ATTRIBUTE}:`;

      for (const line of lines) {
        if (line.startsWith(attributePrefix)) {
          const publicKey = line.substring(attributePrefix.length);
          return publicKey;
        }
      }

      // No E2EE key found
      console.warn('No E2EE public key found in remote SDP');
      return null;
    } catch (error) {
      console.error('Failed to extract public key from SDP:', error);
      return null;
    }
  }

  /**
   * Completes the key exchange by importing remote public key and deriving shared secret
   * @param {string} remoteSdp - Remote SDP containing public key
   * @returns {Promise<boolean>} True if successful
   */
  async function completeKeyExchange(remoteSdp) {
    try {
      if (!isInitialized) {
        console.error('E2EE not initialized before key exchange');
        return false;
      }

      const remotePublicKey = await extractPublicKeyFromSDP(remoteSdp);

      if (!remotePublicKey) {
        console.warn('Remote peer does not support E2EE');
        appendSystemMessage(t?.systemMessages?.e2eeNotSupported || 'Remote peer does not support E2EE - connection will not be encrypted');
        return false;
      }

      // Import remote public key
      await securityManager.importPublicKey(remotePublicKey);

      // Derive shared encryption key
      await securityManager.deriveSharedKey();

      console.log('E2EE key exchange completed successfully');
      appendSystemMessage(t?.systemMessages?.e2eeEnabled || 'End-to-end encryption enabled 🔒');

      // Log fingerprints for verification
      try {
        const localFp = await securityManager.getLocalFingerprint();
        const remoteFp = await securityManager.getRemoteFingerprint();
        console.log('E2EE Local fingerprint:', localFp);
        console.log('E2EE Remote fingerprint:', remoteFp);
      } catch (fpError) {
        console.warn('Could not generate fingerprints:', fpError);
      }

      return true;
    } catch (error) {
      console.error('Key exchange failed:', error);
      appendSystemMessage(t?.systemMessages?.e2eeKeyExchangeFailed || 'E2EE key exchange failed');
      return false;
    }
  }

  /**
   * Resets E2EE state (on disconnect)
   */
  function reset() {
    securityManager.reset();
    isInitialized = false;
    console.log('E2EE reset');
  }

  /**
   * Gets the security manager instance
   * @returns {Object} SecurityManager instance
   */
  function getSecurityManager() {
    return securityManager;
  }

  /**
   * Checks if E2EE is ready
   * @returns {boolean} True if E2EE is ready
   */
  function isReady() {
    return securityManager.isReady();
  }

  return {
    initialize,
    embedPublicKeyInSDP,
    extractPublicKeyFromSDP,
    completeKeyExchange,
    reset,
    getSecurityManager,
    isReady
  };
}
