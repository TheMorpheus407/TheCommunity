/**
 * @fileoverview Image Transfer Manager - Handles chunked image transfer over WebRTC
 * @module managers/ImageTransferManager
 *
 * This manager handles:
 * - Image file selection and validation
 * - Chunked image sending (16KB chunks)
 * - Chunked image receiving and reconstruction
 * - Rate limiting on image transfers
 * - Concurrent transfer limiting
 *
 * Security features:
 * - File type validation (whitelist)
 * - File size validation (max 5MB)
 * - Send rate limiting (10 images per minute)
 * - Receive rate limiting (10 images per minute)
 * - Concurrent transfer limiting (max 3)
 * - MIME type whitelist
 */

import {
  IMAGE_CHANNEL_LABEL,
  IMAGE_MAX_SIZE_BYTES,
  IMAGE_CHUNK_SIZE,
  IMAGE_MAX_PER_INTERVAL,
  IMAGE_INTERVAL_MS,
  IMAGE_MAX_CONCURRENT,
  ALLOWED_IMAGE_TYPES
} from '../core/constants.js';

/**
 * Creates a factory for Image Transfer operations
 * @param {Object} deps - Dependencies object
 * @param {React.MutableRefObject} deps.imageChannelRef - Image channel reference
 * @param {React.MutableRefObject} deps.imageTransfersRef - Active transfers map
 * @param {React.MutableRefObject} deps.imageSendTimestampsRef - Send rate limiting
 * @param {React.MutableRefObject} deps.imageReceiveTimestampsRef - Receive rate limiting
 * @param {React.MutableRefObject} deps.imageFileInputRef - File input element ref
 * @param {Function} deps.appendMessage - Message appender function
 * @param {Function} deps.appendSystemMessage - System message appender
 * @param {Object} deps.t - Translation object
 * @returns {Object} Image transfer operations
 * @export
 */
export function createImageTransferManager(deps) {
  const {
    imageChannelRef,
    imageTransfersRef,
    imageSendTimestampsRef,
    imageReceiveTimestampsRef,
    imageFileInputRef,
    appendMessage,
    appendSystemMessage,
    t
  } = deps;

  /**
   * Handles incoming image channel messages for image transfer
   * @param {string} payload - JSON-encoded image message
   * @returns {void}
   */
  function handleIncomingImageMessage(payload) {
    if (typeof payload !== 'string' || !payload) {
      return;
    }

    let message;
    try {
      message = JSON.parse(payload);
    } catch (error) {
      console.warn('Discarded malformed image message', error);
      return;
    }

    if (!message || typeof message !== 'object') {
      return;
    }

    const now = Date.now();

    // Security: Rate limiting on incoming images
    imageReceiveTimestampsRef.current = imageReceiveTimestampsRef.current.filter(
      (timestamp) => now - timestamp < IMAGE_INTERVAL_MS
    );

    if (message.type === 'image-start') {
      // Security: Check rate limit
      if (imageReceiveTimestampsRef.current.length >= IMAGE_MAX_PER_INTERVAL) {
        appendSystemMessage(t.imageShare.rateLimitReceive);
        return;
      }

      // Security: Check concurrent transfer limit
      if (imageTransfersRef.current.size >= IMAGE_MAX_CONCURRENT) {
        appendSystemMessage(t.imageShare.tooManyConcurrent);
        return;
      }

      // Security: Validate MIME type
      if (!message.imageId || !message.mimeType || !ALLOWED_IMAGE_TYPES.includes(message.mimeType)) {
        appendSystemMessage(t.imageShare.invalidType);
        return;
      }

      // Security: Validate file size
      if (typeof message.totalSize !== 'number' || message.totalSize > IMAGE_MAX_SIZE_BYTES || message.totalSize <= 0) {
        appendSystemMessage(t.imageShare.tooLarge);
        return;
      }

      // Track receive timestamp
      imageReceiveTimestampsRef.current.push(now);

      // Initialize transfer
      imageTransfersRef.current.set(message.imageId, {
        chunks: [],
        mimeType: message.mimeType,
        fileName: message.fileName || 'image',
        totalChunks: message.totalChunks || 0,
        totalSize: message.totalSize,
        receivedChunks: 0
      });
      return;
    }

    if (message.type === 'image-chunk') {
      const transfer = imageTransfersRef.current.get(message.imageId);
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
          // Reconstruct image from chunks
          const fullBase64 = transfer.chunks.join('');
          const binaryString = atob(fullBase64);
          const bytes = new Uint8Array(binaryString.length);
          for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }

          const blob = new Blob([bytes], { type: transfer.mimeType });
          const imageUrl = URL.createObjectURL(blob);

          // Add image to chat
          appendMessage(t.imageShare.receivedImage(transfer.fileName), 'remote', {
            imageUrl,
            fileName: transfer.fileName
          });

          // Clean up transfer
          imageTransfersRef.current.delete(message.imageId);
        } catch (error) {
          console.error('Failed to reconstruct image', error);
          appendSystemMessage(t.imageShare.receiveFailed);
          imageTransfersRef.current.delete(message.imageId);
        }
      }
    }
  }

  /**
   * Configures event handlers for the image data channel
   * @param {RTCDataChannel} channel - Image channel instance
   * @returns {void}
   */
  function setupImageChannel(channel) {
    channel.onopen = () => {
      imageChannelRef.current = channel;
      appendSystemMessage(t.imageShare.channelReady);
    };

    channel.onclose = () => {
      if (imageChannelRef.current === channel) {
        imageChannelRef.current = null;
      }
      imageTransfersRef.current.clear();
      imageSendTimestampsRef.current = [];
      imageReceiveTimestampsRef.current = [];
    };

    channel.onmessage = (event) => {
      if (typeof event.data !== 'string') {
        return;
      }
      handleIncomingImageMessage(event.data);
    };
  }

  /**
   * Handles image file selection and sends it through the image channel
   * @param {Event} event - File input change event
   * @returns {Promise<void>}
   */
  async function handleImageSelect(event) {
    const file = event.target.files && event.target.files[0];

    // Clear input for reuse
    if (imageFileInputRef.current) {
      imageFileInputRef.current.value = '';
    }

    if (!file) {
      return;
    }

    const channel = imageChannelRef.current;
    if (!channel || channel.readyState !== 'open') {
      appendSystemMessage(t.imageShare.channelNotReady);
      return;
    }

    // Security: Validate file type
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      appendSystemMessage(t.imageShare.invalidType);
      return;
    }

    // Security: Validate file size
    if (file.size > IMAGE_MAX_SIZE_BYTES) {
      appendSystemMessage(t.imageShare.tooLarge);
      return;
    }

    // Security: Rate limiting on outgoing images
    const now = Date.now();
    imageSendTimestampsRef.current = imageSendTimestampsRef.current.filter(
      (timestamp) => now - timestamp < IMAGE_INTERVAL_MS
    );

    if (imageSendTimestampsRef.current.length >= IMAGE_MAX_PER_INTERVAL) {
      appendSystemMessage(t.imageShare.rateLimitSend);
      return;
    }

    imageSendTimestampsRef.current.push(now);

    try {
      // Read file as ArrayBuffer
      const arrayBuffer = await file.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);

      // Convert to base64
      let binaryString = '';
      for (let i = 0; i < bytes.length; i++) {
        binaryString += String.fromCharCode(bytes[i]);
      }
      const base64 = btoa(binaryString);

      // Generate unique ID for this transfer
      const imageId = `img-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const totalChunks = Math.ceil(base64.length / IMAGE_CHUNK_SIZE);

      // Send start message
      channel.send(JSON.stringify({
        type: 'image-start',
        imageId,
        mimeType: file.type,
        fileName: file.name,
        totalSize: file.size,
        totalChunks
      }));

      // Send chunks
      for (let i = 0; i < totalChunks; i++) {
        const start = i * IMAGE_CHUNK_SIZE;
        const end = Math.min(start + IMAGE_CHUNK_SIZE, base64.length);
        const chunk = base64.substring(start, end);

        channel.send(JSON.stringify({
          type: 'image-chunk',
          imageId,
          chunkIndex: i,
          totalChunks,
          data: chunk
        }));
      }

      // Add to local chat with preview
      const imageUrl = URL.createObjectURL(file);
      appendMessage(t.imageShare.sentImage(file.name), 'local', {
        imageUrl,
        fileName: file.name
      });
    } catch (error) {
      console.error('Failed to send image', error);
      appendSystemMessage(t.imageShare.sendFailed);
    }
  }

  /**
   * Triggers the file picker for image selection
   * @returns {void}
   */
  function openImagePicker() {
    if (imageFileInputRef.current) {
      imageFileInputRef.current.click();
    }
  }

  return {
    setupImageChannel,
    handleIncomingImageMessage,
    handleImageSelect,
    openImagePicker
  };
}
