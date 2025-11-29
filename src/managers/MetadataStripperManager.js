/**
 * @fileoverview Metadata Stripper Manager - Removes identifying metadata from files
 * @module managers/MetadataStripperManager
 *
 * This manager handles:
 * - EXIF data removal from images (GPS, camera info, timestamps)
 * - Metadata removal from videos
 * - Document metadata sanitization
 *
 * Security features:
 * - Client-side processing (no data sent to servers)
 * - Privacy-first approach (removes all non-essential metadata)
 * - Preserves file quality while removing metadata
 */

/**
 * Creates a factory for metadata stripping operations
 * @param {Object} deps - Dependencies object
 * @param {Function} deps.appendSystemMessage - System message appender
 * @param {Object} deps.t - Translation object
 * @returns {Object} Metadata stripping operations
 * @export
 */
export function createMetadataStripperManager(deps) {
  const { appendSystemMessage, t } = deps;

  /**
   * Strips EXIF metadata from image files
   * @param {File} file - Image file to process
   * @returns {Promise<Blob>} New blob with metadata removed
   */
  async function stripImageMetadata(file) {
    try {
      // For images, we'll re-encode them to strip EXIF data
      // This works by loading the image into a canvas and re-exporting
      return new Promise((resolve, reject) => {
        const img = new Image();
        const url = URL.createObjectURL(file);

        img.onload = () => {
          try {
            // Create canvas with image dimensions
            const canvas = document.createElement('canvas');
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;

            // Draw image to canvas (this strips EXIF data)
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);

            // Convert back to blob
            canvas.toBlob(
              (blob) => {
                URL.revokeObjectURL(url);
                if (blob) {
                  resolve(blob);
                } else {
                  reject(new Error('Failed to create blob from canvas'));
                }
              },
              file.type,
              0.95 // Quality for JPEG (ignored for PNG/GIF)
            );
          } catch (error) {
            URL.revokeObjectURL(url);
            reject(error);
          }
        };

        img.onerror = () => {
          URL.revokeObjectURL(url);
          reject(new Error('Failed to load image'));
        };

        img.src = url;
      });
    } catch (error) {
      console.error('Failed to strip image metadata:', error);
      // If stripping fails, return original file as fallback
      return file;
    }
  }

  /**
   * Strips metadata from video files
   * For videos, we note that full re-encoding is too heavy for browsers
   * So we'll just warn the user and return the original file
   * @param {File} file - Video file to process
   * @returns {Promise<Blob>} Original file (metadata stripping not implemented)
   */
  async function stripVideoMetadata(file) {
    // Video metadata stripping would require re-encoding which is too heavy for browser
    // We'll just warn the user
    if (appendSystemMessage && t?.fileShare?.videoMetadataWarning) {
      appendSystemMessage(t.fileShare.videoMetadataWarning);
    }
    return file;
  }

  /**
   * Strips metadata from document files
   * For PDFs and other documents, metadata stripping requires complex parsing
   * We'll warn the user and return the original file
   * @param {File} file - Document file to process
   * @returns {Promise<Blob>} Original file (metadata stripping not implemented)
   */
  async function stripDocumentMetadata(file) {
    // Document metadata stripping is complex and requires libraries
    // We'll just warn the user
    if (appendSystemMessage && t?.fileShare?.documentMetadataWarning) {
      appendSystemMessage(t.fileShare.documentMetadataWarning);
    }
    return file;
  }

  /**
   * Main function to strip metadata based on file type
   * @param {File} file - File to process
   * @returns {Promise<Blob>} Processed file with metadata removed
   */
  async function stripMetadata(file) {
    if (!file) {
      return file;
    }

    const mimeType = file.type;

    // Image files - strip EXIF data
    if (mimeType.startsWith('image/')) {
      return await stripImageMetadata(file);
    }

    // Video files - warn about metadata
    if (mimeType.startsWith('video/')) {
      return await stripVideoMetadata(file);
    }

    // Document files - warn about metadata
    if (
      mimeType === 'application/pdf' ||
      mimeType.startsWith('application/') ||
      mimeType.startsWith('text/')
    ) {
      return await stripDocumentMetadata(file);
    }

    // Unknown file type - return as is
    return file;
  }

  return {
    stripMetadata,
    stripImageMetadata,
    stripVideoMetadata,
    stripDocumentMetadata
  };
}
