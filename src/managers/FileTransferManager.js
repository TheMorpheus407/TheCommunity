/**
 * @fileoverview File Transfer Manager - Handles chunked file transfer over WebRTC
 * @module managers/FileTransferManager
 *
 * This manager handles:
 * - File selection and validation (images, videos, documents)
 * - Metadata stripping before sending
 * - Chunked file sending (32KB chunks)
 * - Chunked file receiving and reconstruction
 * - Rate limiting on file transfers
 * - Concurrent transfer limiting
 *
 * Security features:
 * - File type validation (whitelist)
 * - File size validation (max 50MB)
 * - Send rate limiting (5 files per minute)
 * - Receive rate limiting (5 files per minute)
 * - Concurrent transfer limiting (max 2)
 * - MIME type whitelist
 * - Metadata stripping for privacy
 */

import {
  FILE_CHANNEL_LABEL,
  FILE_MAX_SIZE_BYTES,
  FILE_CHUNK_SIZE,
  FILE_MAX_PER_INTERVAL,
  FILE_INTERVAL_MS,
  FILE_MAX_CONCURRENT,
  ALLOWED_FILE_TYPES,
  ALLOWED_IMAGE_TYPES,
  ALLOWED_VIDEO_TYPES,
  ALLOWED_DOCUMENT_TYPES
} from '../core/constants.js';
import { createMetadataStripperManager } from './MetadataStripperManager.js';

/**
 * Creates a factory for File Transfer operations
 * @param {Object} deps - Dependencies object
 * @param {React.MutableRefObject} deps.fileChannelRef - File channel reference
 * @param {React.MutableRefObject} deps.fileTransfersRef - Active transfers map
 * @param {React.MutableRefObject} deps.fileSendTimestampsRef - Send rate limiting
 * @param {React.MutableRefObject} deps.fileReceiveTimestampsRef - Receive rate limiting
 * @param {React.MutableRefObject} deps.fileInputRef - File input element ref
 * @param {Function} deps.appendMessage - Message appender function
 * @param {Function} deps.appendSystemMessage - System message appender
 * @param {Object} deps.t - Translation object
 * @returns {Object} File transfer operations
 * @export
 */
export function createFileTransferManager(deps) {
  const {
    fileChannelRef,
    fileTransfersRef,
    fileSendTimestampsRef,
    fileReceiveTimestampsRef,
    fileInputRef,
    appendMessage,
    appendSystemMessage,
    t
  } = deps;

  // Create metadata stripper
  const metadataStripper = createMetadataStripperManager({ appendSystemMessage, t });

  /**
   * Determines the file category based on MIME type
   * @param {string} mimeType - MIME type of the file
   * @returns {string} File category: 'image', 'video', 'document', or 'unknown'
   */
  function getFileCategory(mimeType) {
    if (ALLOWED_IMAGE_TYPES.includes(mimeType)) return 'image';
    if (ALLOWED_VIDEO_TYPES.includes(mimeType)) return 'video';
    if (ALLOWED_DOCUMENT_TYPES.includes(mimeType)) return 'document';
    return 'unknown';
  }

  /**
   * Gets appropriate emoji icon for file type
   * @param {string} mimeType - MIME type of the file
   * @returns {string} Emoji representing the file type
   */
  function getFileIcon(mimeType) {
    const category = getFileCategory(mimeType);
    switch (category) {
      case 'image': return '🖼️';
      case 'video': return '🎥';
      case 'document': return '📄';
      default: return '📎';
    }
  }

  /**
   * Handles incoming file channel messages for file transfer
   * @param {string} payload - JSON-encoded file message
   * @returns {void}
   */
  function handleIncomingFileMessage(payload) {
    if (typeof payload !== 'string' || !payload) {
      return;
    }

    let message;
    try {
      message = JSON.parse(payload);
    } catch (error) {
      console.warn('Discarded malformed file message', error);
      return;
    }

    if (!message || typeof message !== 'object') {
      return;
    }

    const now = Date.now();

    // Security: Rate limiting on incoming files
    fileReceiveTimestampsRef.current = fileReceiveTimestampsRef.current.filter(
      (timestamp) => now - timestamp < FILE_INTERVAL_MS
    );

    if (message.type === 'file-start') {
      // Security: Check rate limit
      if (fileReceiveTimestampsRef.current.length >= FILE_MAX_PER_INTERVAL) {
        appendSystemMessage(t.fileShare?.rateLimitReceive || 'Rate limit: Too many files received');
        return;
      }

      // Security: Check concurrent transfer limit
      if (fileTransfersRef.current.size >= FILE_MAX_CONCURRENT) {
        appendSystemMessage(t.fileShare?.tooManyConcurrent || 'Too many concurrent transfers');
        return;
      }

      // Security: Validate MIME type
      if (!message.fileId || !message.mimeType || !ALLOWED_FILE_TYPES.includes(message.mimeType)) {
        appendSystemMessage(t.fileShare?.invalidType || 'Invalid file type');
        return;
      }

      // Security: Validate file size
      if (typeof message.totalSize !== 'number' || message.totalSize > FILE_MAX_SIZE_BYTES || message.totalSize <= 0) {
        appendSystemMessage(t.fileShare?.tooLarge || 'File too large');
        return;
      }

      // Track receive timestamp
      fileReceiveTimestampsRef.current.push(now);

      // Initialize transfer
      fileTransfersRef.current.set(message.fileId, {
        chunks: [],
        mimeType: message.mimeType,
        fileName: message.fileName || 'file',
        totalChunks: message.totalChunks || 0,
        totalSize: message.totalSize,
        receivedChunks: 0,
        category: getFileCategory(message.mimeType),
        direction: 'receive',
        aborted: false,
        progress: 0
      });
      return;
    }

    if (message.type === 'file-chunk') {
      const transfer = fileTransfersRef.current.get(message.fileId);
      if (!transfer) {
        return;
      }

      if (typeof message.chunkIndex !== 'number' || typeof message.data !== 'string') {
        return;
      }

      // Security Fix 0.1: Validate chunk index to prevent memory exhaustion via sparse arrays
      if (message.chunkIndex < 0 || message.chunkIndex >= transfer.totalChunks) {
        console.warn('Invalid chunk index received:', message.chunkIndex);
        return;
      }

      // Security Fix 0.1: Prevent duplicate chunks (memory exhaustion attack)
      if (transfer.chunks[message.chunkIndex] !== undefined) {
        console.warn('Duplicate chunk received:', message.chunkIndex);
        return;
      }

      // Check if transfer was aborted
      if (transfer.aborted) {
        fileTransfersRef.current.delete(message.fileId);
        return;
      }

      // Store chunk
      transfer.chunks[message.chunkIndex] = message.data;
      transfer.receivedChunks++;

      // Performance Fix 1.2: Update progress
      transfer.progress = Math.round((transfer.receivedChunks / transfer.totalChunks) * 100);

      // Check if transfer is complete
      if (transfer.receivedChunks === transfer.totalChunks) {
        try {
          // Reconstruct file from chunks
          const fullBase64 = transfer.chunks.join('');
          const binaryString = atob(fullBase64);
          const bytes = new Uint8Array(binaryString.length);
          for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }

          const blob = new Blob([bytes], { type: transfer.mimeType });
          const fileUrl = URL.createObjectURL(blob);

          // Add file to chat based on type
          const icon = getFileIcon(transfer.mimeType);
          const messageText = `${icon} ${t.fileShare?.receivedFile || 'Received file'}: ${transfer.fileName}`;

          appendMessage(messageText, 'remote', {
            fileUrl,
            fileName: transfer.fileName,
            mimeType: transfer.mimeType,
            fileCategory: transfer.category
          });

          // Clean up transfer
          fileTransfersRef.current.delete(message.fileId);
        } catch (error) {
          console.error('Failed to reconstruct file', error);
          appendSystemMessage(t.fileShare?.receiveFailed || 'Failed to receive file');
          fileTransfersRef.current.delete(message.fileId);
        }
      }
    }
  }

  /**
   * Configures event handlers for the file data channel
   * @param {RTCDataChannel} channel - File channel instance
   * @returns {void}
   */
  function setupFileChannel(channel) {
    channel.onopen = () => {
      fileChannelRef.current = channel;
      appendSystemMessage(t.fileShare?.channelReady || 'File sharing ready');
    };

    channel.onclose = () => {
      if (fileChannelRef.current === channel) {
        fileChannelRef.current = null;
      }
      fileTransfersRef.current.clear();
      fileSendTimestampsRef.current = [];
      fileReceiveTimestampsRef.current = [];
    };

    channel.onmessage = (event) => {
      if (typeof event.data !== 'string') {
        return;
      }
      handleIncomingFileMessage(event.data);
    };
  }

  /**
   * Handles file selection and sends it through the file channel
   * @param {Event} event - File input change event
   * @returns {Promise<void>}
   */
  async function handleFileSelect(event) {
    const file = event.target.files && event.target.files[0];

    // Clear input for reuse
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    if (!file) {
      return;
    }

    const channel = fileChannelRef.current;
    if (!channel || channel.readyState !== 'open') {
      appendSystemMessage(t.fileShare?.channelNotReady || 'File channel not ready');
      return;
    }

    // Security: Validate file type
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      appendSystemMessage(t.fileShare?.invalidType || 'Invalid file type');
      return;
    }

    // Security: Validate file size
    if (file.size > FILE_MAX_SIZE_BYTES) {
      appendSystemMessage(t.fileShare?.tooLarge || `File too large (max ${FILE_MAX_SIZE_BYTES / (1024 * 1024)}MB)`);
      return;
    }

    // Security: Rate limiting on outgoing files
    const now = Date.now();
    fileSendTimestampsRef.current = fileSendTimestampsRef.current.filter(
      (timestamp) => now - timestamp < FILE_INTERVAL_MS
    );

    if (fileSendTimestampsRef.current.length >= FILE_MAX_PER_INTERVAL) {
      appendSystemMessage(t.fileShare?.rateLimitSend || 'Rate limit: Sending too many files');
      return;
    }

    fileSendTimestampsRef.current.push(now);

    try {
      // Strip metadata from file before sending
      const strippedFile = await metadataStripper.stripMetadata(file);

      // Read file as ArrayBuffer
      const arrayBuffer = await strippedFile.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);

      // Performance Fix 1.3: Use efficient string concatenation (join instead of +=)
      const binaryChunks = [];
      for (let i = 0; i < bytes.length; i++) {
        binaryChunks.push(String.fromCharCode(bytes[i]));
      }
      const binaryString = binaryChunks.join('');
      const base64 = btoa(binaryString);

      // Security Fix 0.2: Validate Base64 size to prevent memory spikes
      const base64SizeBytes = base64.length;
      if (base64SizeBytes > FILE_MAX_SIZE_BYTES * 1.5) {
        appendSystemMessage(t.fileShare?.tooLarge || 'File too large after encoding');
        return;
      }

      // Generate unique ID for this transfer
      const fileId = `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const totalChunks = Math.ceil(base64.length / FILE_CHUNK_SIZE);

      // Track outgoing transfer for progress and abort capability
      fileTransfersRef.current.set(fileId, {
        direction: 'send',
        fileName: file.name,
        mimeType: file.type,
        totalChunks,
        sentChunks: 0,
        aborted: false,
        progress: 0
      });

      // Send start message
      channel.send(JSON.stringify({
        type: 'file-start',
        fileId,
        mimeType: file.type,
        fileName: file.name,
        totalSize: strippedFile.size,
        totalChunks
      }));

      // Performance Fix 1.1: Asynchronous chunk transfer to prevent UI blocking
      const sendChunksAsync = async () => {
        for (let i = 0; i < totalChunks; i++) {
          const transfer = fileTransfersRef.current.get(fileId);

          // Check if transfer was aborted
          if (!transfer || transfer.aborted) {
            fileTransfersRef.current.delete(fileId);
            appendSystemMessage(t.fileShare?.sendAborted || 'File transfer cancelled');
            return;
          }

          const start = i * FILE_CHUNK_SIZE;
          const end = Math.min(start + FILE_CHUNK_SIZE, base64.length);
          const chunk = base64.substring(start, end);

          channel.send(JSON.stringify({
            type: 'file-chunk',
            fileId,
            chunkIndex: i,
            totalChunks,
            data: chunk
          }));

          // Update progress
          transfer.sentChunks = i + 1;
          transfer.progress = Math.round((transfer.sentChunks / totalChunks) * 100);

          // Yield control to UI thread every few chunks
          if (i % 5 === 0) {
            await new Promise(resolve => setTimeout(resolve, 0));
          }
        }

        // Clean up transfer tracking after completion
        fileTransfersRef.current.delete(fileId);
      };

      // Start async sending
      sendChunksAsync().catch(error => {
        console.error('Error during async chunk send:', error);
        fileTransfersRef.current.delete(fileId);
      });

      // Add to local chat with preview
      const fileUrl = URL.createObjectURL(strippedFile);
      const category = getFileCategory(file.type);
      const icon = getFileIcon(file.type);
      const messageText = `${icon} ${t.fileShare?.sentFile || 'Sent file'}: ${file.name}`;

      appendMessage(messageText, 'local', {
        fileUrl,
        fileName: file.name,
        mimeType: file.type,
        fileCategory: category
      });
    } catch (error) {
      console.error('Failed to send file', error);
      appendSystemMessage(t.fileShare?.sendFailed || 'Failed to send file');
    }
  }

  /**
   * Triggers the file picker for file selection
   * @returns {void}
   */
  function openFilePicker() {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }

  /**
   * Performance Fix 1.4: Abort an ongoing file transfer
   * @param {string} fileId - ID of the transfer to abort
   * @returns {boolean} True if transfer was aborted, false if not found
   */
  function abortTransfer(fileId) {
    const transfer = fileTransfersRef.current.get(fileId);
    if (transfer) {
      transfer.aborted = true;
      return true;
    }
    return false;
  }

  /**
   * Performance Fix 1.2: Get progress of all active transfers
   * @returns {Array} Array of transfer progress objects
   */
  function getActiveTransfers() {
    const transfers = [];
    fileTransfersRef.current.forEach((transfer, fileId) => {
      transfers.push({
        fileId,
        fileName: transfer.fileName,
        direction: transfer.direction,
        progress: transfer.progress,
        totalChunks: transfer.totalChunks,
        category: transfer.category || getFileCategory(transfer.mimeType)
      });
    });
    return transfers;
  }

  return {
    setupFileChannel,
    handleIncomingFileMessage,
    handleFileSelect,
    openFilePicker,
    abortTransfer,
    getActiveTransfers
  };
}
