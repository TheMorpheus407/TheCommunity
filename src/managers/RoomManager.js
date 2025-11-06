/**
 * @fileoverview Room Manager - Handles password-protected rooms and invite link generation
 * @module managers/RoomManager
 *
 * This manager handles:
 * - Room creation with optional password protection
 * - Invite link generation with encrypted SDP
 * - Room metadata management
 * - Community visibility toggle
 * - Client-side password verification
 *
 * Security features:
 * - Password hashing (SHA-256)
 * - SDP encryption using password-derived key
 * - No password storage (only hashes)
 * - Client-side only verification
 */

/**
 * Hashes a password using SHA-256
 * @param {string} password - Plain text password
 * @returns {Promise<string>} Hex-encoded hash
 */
async function hashPassword(password) {
  if (!password) return '';

  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Derives an encryption key from a password
 * @param {string} password - Plain text password
 * @param {Uint8Array} salt - Salt for key derivation
 * @returns {Promise<CryptoKey>} Derived encryption key
 */
async function deriveKey(password, salt) {
  const encoder = new TextEncoder();
  const passwordBuffer = encoder.encode(password);

  const importedKey = await crypto.subtle.importKey(
    'raw',
    passwordBuffer,
    { name: 'PBKDF2' },
    false,
    ['deriveBits', 'deriveKey']
  );

  return await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: 100000,
      hash: 'SHA-256'
    },
    importedKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

/**
 * Encrypts data using a password
 * @param {string} data - Data to encrypt
 * @param {string} password - Password for encryption
 * @returns {Promise<string>} Base64-encoded encrypted data with salt and IV
 */
async function encryptData(data, password) {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);

  // Generate random salt and IV
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));

  // Derive key from password
  const key = await deriveKey(password, salt);

  // Encrypt data
  const encryptedBuffer = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv: iv },
    key,
    dataBuffer
  );

  // Combine salt + IV + encrypted data
  const combined = new Uint8Array(salt.length + iv.length + encryptedBuffer.byteLength);
  combined.set(salt, 0);
  combined.set(iv, salt.length);
  combined.set(new Uint8Array(encryptedBuffer), salt.length + iv.length);

  // Return as base64
  return btoa(String.fromCharCode(...combined));
}

/**
 * Decrypts data using a password
 * @param {string} encryptedData - Base64-encoded encrypted data
 * @param {string} password - Password for decryption
 * @returns {Promise<string>} Decrypted data
 */
async function decryptData(encryptedData, password) {
  // Decode from base64
  const combined = Uint8Array.from(atob(encryptedData), c => c.charCodeAt(0));

  // Extract salt, IV, and encrypted data
  const salt = combined.slice(0, 16);
  const iv = combined.slice(16, 28);
  const encrypted = combined.slice(28);

  // Derive key from password
  const key = await deriveKey(password, salt);

  // Decrypt data
  const decryptedBuffer = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: iv },
    key,
    encrypted
  );

  // Decode to string
  const decoder = new TextDecoder();
  return decoder.decode(decryptedBuffer);
}

/**
 * Room metadata storage key
 */
const ROOM_STORAGE_KEY = 'thecommunity.room-metadata';

/**
 * Gets room metadata from localStorage
 * @param {string} roomId - Room ID
 * @returns {Object|null} Room metadata or null
 */
function getRoomMetadata(roomId) {
  try {
    const stored = localStorage.getItem(`${ROOM_STORAGE_KEY}.${roomId}`);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.warn('Failed to read room metadata', error);
  }
  return null;
}

/**
 * Saves room metadata to localStorage
 * @param {string} roomId - Room ID
 * @param {Object} metadata - Room metadata
 */
function saveRoomMetadata(roomId, metadata) {
  try {
    localStorage.setItem(`${ROOM_STORAGE_KEY}.${roomId}`, JSON.stringify(metadata));
  } catch (error) {
    console.warn('Failed to save room metadata', error);
  }
}

/**
 * Generates a random room ID
 * @returns {string} Random room ID
 */
function generateRoomId() {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let id = '';
  for (let i = 0; i < 12; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
}

/**
 * Creates a factory for Room operations
 * @param {Object} deps - Dependencies object
 * @param {Function} deps.appendSystemMessage - System message appender
 * @param {Object} deps.t - Translation object
 * @returns {Object} Room operations
 * @export
 */
export function createRoomManager(deps) {
  const {
    appendSystemMessage,
    t
  } = deps;

  /**
   * Creates a new room with optional password
   * @param {string} password - Optional password for the room
   * @param {boolean} isCommunityRoom - Whether this is a public community room
   * @returns {Promise<Object>} Room metadata { roomId, passwordHash, isCommunityRoom }
   */
  async function createRoom(password = '', isCommunityRoom = false) {
    const roomId = generateRoomId();
    const passwordHash = password ? await hashPassword(password) : '';

    const metadata = {
      roomId,
      passwordHash,
      isCommunityRoom,
      createdAt: Date.now()
    };

    saveRoomMetadata(roomId, metadata);

    appendSystemMessage(
      t.rooms?.roomCreated?.(roomId) || `Room created: ${roomId}`
    );

    return metadata;
  }

  /**
   * Generates an invite link for a room
   * @param {string} roomId - Room ID
   * @param {string} sdpOffer - SDP offer to include
   * @param {string} password - Password to encrypt the offer (if room is password-protected)
   * @returns {Promise<string>} Invite link
   */
  async function generateInviteLink(roomId, sdpOffer, password = '') {
    const baseUrl = window.location.origin + window.location.pathname;

    if (password) {
      // Encrypt SDP with password
      const encryptedOffer = await encryptData(sdpOffer, password);
      return `${baseUrl}#room/${roomId}?invite=${encodeURIComponent(encryptedOffer)}`;
    } else {
      // No password, just base64 encode
      const encodedOffer = btoa(sdpOffer);
      return `${baseUrl}#room/${roomId}?invite=${encodeURIComponent(encodedOffer)}`;
    }
  }

  /**
   * Parses an invite link and extracts room info
   * @param {string} roomId - Room ID from URL
   * @param {string} inviteData - Encrypted or encoded invite data
   * @param {string} password - Password to decrypt (if encrypted)
   * @returns {Promise<Object>} { success: boolean, sdpOffer?: string, error?: string }
   */
  async function parseInviteLink(roomId, inviteData, password = '') {
    try {
      const metadata = getRoomMetadata(roomId);

      // Check if password is required
      if (metadata && metadata.passwordHash && !password) {
        return {
          success: false,
          error: t.rooms?.passwordRequired || 'This room requires a password.'
        };
      }

      // Verify password if provided
      if (metadata && metadata.passwordHash && password) {
        const providedHash = await hashPassword(password);
        if (providedHash !== metadata.passwordHash) {
          return {
            success: false,
            error: t.rooms?.passwordIncorrect || 'Incorrect password.'
          };
        }
      }

      let sdpOffer;

      if (password) {
        // Decrypt with password
        sdpOffer = await decryptData(inviteData, password);
      } else {
        // Just base64 decode
        sdpOffer = atob(inviteData);
      }

      return {
        success: true,
        sdpOffer
      };
    } catch (error) {
      console.error('Failed to parse invite link', error);
      return {
        success: false,
        error: t.rooms?.invalidInvite || 'Invalid invite link or incorrect password.'
      };
    }
  }

  /**
   * Toggles community visibility for a room
   * @param {string} roomId - Room ID
   * @param {boolean} isCommunity - New community visibility state
   */
  function toggleCommunityVisibility(roomId, isCommunity) {
    const metadata = getRoomMetadata(roomId) || { roomId };
    metadata.isCommunityRoom = isCommunity;
    saveRoomMetadata(roomId, metadata);

    appendSystemMessage(
      isCommunity
        ? (t.rooms?.communityEnabled || 'Room is now visible in community list.')
        : (t.rooms?.communityDisabled || 'Room removed from community list.')
    );
  }

  return {
    createRoom,
    generateInviteLink,
    parseInviteLink,
    getRoomMetadata,
    saveRoomMetadata,
    toggleCommunityVisibility
  };
}
