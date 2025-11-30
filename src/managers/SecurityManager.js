/**
 * @fileoverview Security Manager - Handles End-to-End Encryption (E2EE)
 * @module managers/SecurityManager
 *
 * This manager provides:
 * - ECDH (P-256) key pair generation for key exchange
 * - Shared secret derivation using HKDF
 * - AES-256-GCM encryption/decryption for data channels
 * - Public key import/export for SDP embedding
 * - Transparent encryption layer for all P2P communications
 *
 * Security features:
 * - Perfect forward secrecy via ECDH
 * - Authenticated encryption with AES-GCM
 * - Unique IV per message (96-bit random)
 * - Key derivation with HKDF-SHA-256
 * - WebCrypto API (browser-native, secure)
 */

/**
 * Creates a SecurityManager instance for E2EE operations
 * @returns {Object} Security manager instance
 * @export
 */
export function createSecurityManager() {
  // Internal state
  let localKeyPair = null;
  let remotePublicKey = null;
  let sharedKey = null;
  let isEncryptionReady = false;

  /**
   * Generates a new ECDH P-256 key pair for key exchange
   * @returns {Promise<CryptoKeyPair>} Generated key pair
   */
  async function generateKeyPair() {
    try {
      const keyPair = await crypto.subtle.generateKey(
        {
          name: 'ECDH',
          namedCurve: 'P-256'
        },
        true, // extractable
        ['deriveKey', 'deriveBits']
      );

      localKeyPair = keyPair;
      return keyPair;
    } catch (error) {
      console.error('Failed to generate ECDH key pair:', error);
      throw new Error('Key generation failed');
    }
  }

  /**
   * Exports the local public key to base64 for sharing
   * @returns {Promise<string>} Base64-encoded public key
   */
  async function exportPublicKey() {
    if (!localKeyPair) {
      throw new Error('No local key pair available. Call generateKeyPair() first.');
    }

    try {
      const exported = await crypto.subtle.exportKey('raw', localKeyPair.publicKey);
      return arrayBufferToBase64(exported);
    } catch (error) {
      console.error('Failed to export public key:', error);
      throw new Error('Public key export failed');
    }
  }

  /**
   * Imports a remote public key from base64
   * @param {string} base64Key - Base64-encoded remote public key
   * @returns {Promise<CryptoKey>} Imported public key
   */
  async function importPublicKey(base64Key) {
    try {
      const keyData = base64ToArrayBuffer(base64Key);
      const publicKey = await crypto.subtle.importKey(
        'raw',
        keyData,
        {
          name: 'ECDH',
          namedCurve: 'P-256'
        },
        true,
        []
      );

      remotePublicKey = publicKey;
      return publicKey;
    } catch (error) {
      console.error('Failed to import remote public key:', error);
      throw new Error('Public key import failed');
    }
  }

  /**
   * Derives the shared AES-256-GCM key from local private and remote public keys
   * Uses HKDF-SHA-256 for key derivation
   * @returns {Promise<CryptoKey>} Derived shared encryption key
   */
  async function deriveSharedKey() {
    if (!localKeyPair) {
      throw new Error('No local key pair available');
    }
    if (!remotePublicKey) {
      throw new Error('No remote public key available');
    }

    try {
      // Derive bits using ECDH
      const derivedBits = await crypto.subtle.deriveBits(
        {
          name: 'ECDH',
          public: remotePublicKey
        },
        localKeyPair.privateKey,
        256 // 256 bits for AES-256
      );

      // Import derived bits as raw key material
      const baseKey = await crypto.subtle.importKey(
        'raw',
        derivedBits,
        'HKDF',
        false,
        ['deriveKey']
      );

      // Use HKDF to derive the final AES-GCM key
      const aesKey = await crypto.subtle.deriveKey(
        {
          name: 'HKDF',
          hash: 'SHA-256',
          salt: new Uint8Array(0), // No salt for simplicity (both peers must agree)
          info: new TextEncoder().encode('TheCommunity E2EE v1')
        },
        baseKey,
        {
          name: 'AES-GCM',
          length: 256
        },
        false, // not extractable
        ['encrypt', 'decrypt']
      );

      sharedKey = aesKey;
      isEncryptionReady = true;
      return aesKey;
    } catch (error) {
      console.error('Failed to derive shared key:', error);
      throw new Error('Key derivation failed');
    }
  }

  /**
   * Encrypts plaintext data using AES-256-GCM
   * @param {string|ArrayBuffer} data - Data to encrypt
   * @returns {Promise<Object>} Encrypted payload with {iv, ciphertext, tag}
   */
  async function encrypt(data) {
    if (!isEncryptionReady || !sharedKey) {
      throw new Error('Encryption not ready. Derive shared key first.');
    }

    try {
      // Generate random IV (96 bits / 12 bytes is recommended for GCM)
      const iv = crypto.getRandomValues(new Uint8Array(12));

      // Convert string to ArrayBuffer if needed
      const plaintext = typeof data === 'string'
        ? new TextEncoder().encode(data)
        : data;

      // Encrypt with AES-GCM (includes authentication tag)
      const ciphertext = await crypto.subtle.encrypt(
        {
          name: 'AES-GCM',
          iv: iv,
          tagLength: 128 // 128-bit authentication tag
        },
        sharedKey,
        plaintext
      );

      // Return as object with base64-encoded components
      return {
        iv: arrayBufferToBase64(iv),
        ciphertext: arrayBufferToBase64(ciphertext)
      };
    } catch (error) {
      console.error('Encryption failed:', error);
      throw new Error('Encryption failed');
    }
  }

  /**
   * Decrypts ciphertext using AES-256-GCM
   * @param {Object} encryptedData - Object with {iv, ciphertext}
   * @returns {Promise<string>} Decrypted plaintext
   */
  async function decrypt(encryptedData) {
    if (!isEncryptionReady || !sharedKey) {
      throw new Error('Encryption not ready. Derive shared key first.');
    }

    try {
      const iv = base64ToArrayBuffer(encryptedData.iv);
      const ciphertext = base64ToArrayBuffer(encryptedData.ciphertext);

      // Decrypt with AES-GCM (verifies authentication tag)
      const plaintext = await crypto.subtle.decrypt(
        {
          name: 'AES-GCM',
          iv: iv,
          tagLength: 128
        },
        sharedKey,
        ciphertext
      );

      // Convert back to string
      return new TextDecoder().decode(plaintext);
    } catch (error) {
      console.error('Decryption failed:', error);
      throw new Error('Decryption failed - possible tampering or wrong key');
    }
  }

  /**
   * Resets the security manager state (on disconnect)
   */
  function reset() {
    localKeyPair = null;
    remotePublicKey = null;
    sharedKey = null;
    isEncryptionReady = false;
  }

  /**
   * Gets the current encryption status
   * @returns {boolean} True if E2EE is ready
   */
  function isReady() {
    return isEncryptionReady;
  }

  /**
   * Gets the fingerprint of the local public key for verification
   * @returns {Promise<string>} Hex-encoded SHA-256 fingerprint
   */
  async function getLocalFingerprint() {
    if (!localKeyPair) {
      throw new Error('No local key pair available');
    }

    try {
      const exported = await crypto.subtle.exportKey('raw', localKeyPair.publicKey);
      const hash = await crypto.subtle.digest('SHA-256', exported);
      return arrayBufferToHex(hash);
    } catch (error) {
      console.error('Failed to generate fingerprint:', error);
      throw new Error('Fingerprint generation failed');
    }
  }

  /**
   * Gets the fingerprint of the remote public key for verification
   * @returns {Promise<string>} Hex-encoded SHA-256 fingerprint
   */
  async function getRemoteFingerprint() {
    if (!remotePublicKey) {
      throw new Error('No remote public key available');
    }

    try {
      const exported = await crypto.subtle.exportKey('raw', remotePublicKey);
      const hash = await crypto.subtle.digest('SHA-256', exported);
      return arrayBufferToHex(hash);
    } catch (error) {
      console.error('Failed to generate fingerprint:', error);
      throw new Error('Fingerprint generation failed');
    }
  }

  // Utility functions

  /**
   * Converts ArrayBuffer to Base64 string
   * @param {ArrayBuffer} buffer - Buffer to convert
   * @returns {string} Base64-encoded string
   */
  function arrayBufferToBase64(buffer) {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  /**
   * Converts Base64 string to ArrayBuffer
   * @param {string} base64 - Base64 string to convert
   * @returns {ArrayBuffer} Converted buffer
   */
  function base64ToArrayBuffer(base64) {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
  }

  /**
   * Converts ArrayBuffer to hex string
   * @param {ArrayBuffer} buffer - Buffer to convert
   * @returns {string} Hex-encoded string
   */
  function arrayBufferToHex(buffer) {
    const bytes = new Uint8Array(buffer);
    return Array.from(bytes)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }

  // Return public API
  return {
    generateKeyPair,
    exportPublicKey,
    importPublicKey,
    deriveSharedKey,
    encrypt,
    decrypt,
    reset,
    isReady,
    getLocalFingerprint,
    getRemoteFingerprint
  };
}
