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
        category: getFileCategory(message.mimeType)
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

      // Store chunk
      transfer.chunks[message.chunkIndex] = message.data;
      transfer.receivedChunks++;

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

      // Convert to base64
      let binaryString = '';
      for (let i = 0; i < bytes.length; i++) {
        binaryString += String.fromCharCode(bytes[i]);
      }
      const base64 = btoa(binaryString);

      // Generate unique ID for this transfer
      const fileId = `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const totalChunks = Math.ceil(base64.length / FILE_CHUNK_SIZE);

      // Send start message
      channel.send(JSON.stringify({
        type: 'file-start',
        fileId,
        mimeType: file.type,
        fileName: file.name,
        totalSize: strippedFile.size,
        totalChunks
      }));

      // Send chunks
      for (let i = 0; i < totalChunks; i++) {
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
      }

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

  return {
    setupFileChannel,
    handleIncomingFileMessage,
    handleFileSelect,
    openFilePicker
  };
}
