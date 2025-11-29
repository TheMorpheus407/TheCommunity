/**
 * @fileoverview Video Codec Manager - Handles intelligent codec selection and quality optimization
 * @module managers/VideoCodecManager
 *
 * This manager handles:
 * - Browser codec capability detection (VP8, VP9, AV1, H.264)
 * - Automatic codec selection based on capabilities and connection
 * - Dynamic quality optimization (resolution, framerate, bitrate)
 * - Bandwidth estimation and adaptive bitrate control
 * - SDP metadata minimization for privacy
 *
 * Security/Privacy features:
 * - Removes unnecessary browser/device metadata from SDP
 * - Minimizes fingerprinting vectors
 */

/**
 * Quality presets for screen sharing
 * @enum {Object}
 */
export const QUALITY_PRESETS = {
  AUTO: {
    name: 'auto',
    maxBitrate: null, // Dynamically determined
    maxFramerate: null, // Dynamically determined
    maxWidth: null, // Dynamically determined
    maxHeight: null, // Dynamically determined
    scaleDownBy: null
  },
  LOW: {
    name: 'low',
    maxBitrate: 500000, // 500 kbps
    maxFramerate: 15,
    maxWidth: 1280,
    maxHeight: 720,
    scaleDownBy: 2
  },
  MEDIUM: {
    name: 'medium',
    maxBitrate: 1500000, // 1.5 Mbps
    maxFramerate: 30,
    maxWidth: 1920,
    maxHeight: 1080,
    scaleDownBy: 1
  },
  HIGH: {
    name: 'high',
    maxBitrate: 4000000, // 4 Mbps
    maxFramerate: 60,
    maxWidth: 3840,
    maxHeight: 2160,
    scaleDownBy: 1
  }
};

/**
 * Codec priority order (preferred to least preferred)
 * @constant {string[]}
 */
const CODEC_PRIORITY = ['AV1', 'VP9', 'VP8', 'H264'];

/**
 * Creates a factory for Video Codec operations
 * @param {Object} deps - Dependencies object
 * @param {Function} deps.appendSystemMessage - System message appender
 * @param {Object} deps.t - Translation object
 * @returns {Object} Video codec operations
 * @export
 */
export function createVideoCodecManager(deps) {
  const { appendSystemMessage, t } = deps;

  /**
   * Detects available video codecs supported by the browser
   * @returns {Promise<Object>} Object with codec support flags
   */
  async function detectCodecSupport() {
    const codecs = {
      vp8: false,
      vp9: false,
      av1: false,
      h264: false
    };

    // Test codec support using RTCRtpSender.getCapabilities
    if (typeof RTCRtpSender !== 'undefined' && RTCRtpSender.getCapabilities) {
      const capabilities = RTCRtpSender.getCapabilities('video');
      if (capabilities && capabilities.codecs) {
        capabilities.codecs.forEach((codec) => {
          const mimeType = codec.mimeType.toLowerCase();
          if (mimeType.includes('vp8')) codecs.vp8 = true;
          if (mimeType.includes('vp9')) codecs.vp9 = true;
          if (mimeType.includes('av1')) codecs.av1 = true;
          if (mimeType.includes('h264')) codecs.h264 = true;
        });
      }
    }

    return codecs;
  }

  /**
   * Gets the best available codec based on browser support
   * @param {Object} codecSupport - Codec support object from detectCodecSupport
   * @returns {string|null} Best codec name or null if none supported
   */
  function getBestCodec(codecSupport) {
    for (const codec of CODEC_PRIORITY) {
      const key = codec.toLowerCase();
      if (codecSupport[key]) {
        return codec;
      }
    }
    return null;
  }

  /**
   * Estimates bandwidth based on connection quality
   * @param {RTCPeerConnection} pc - Peer connection instance
   * @returns {Promise<number>} Estimated bandwidth in bps (returns default if stats unavailable)
   */
  async function estimateBandwidth(pc) {
    if (!pc || !pc.getStats) {
      return 1500000; // Default: 1.5 Mbps
    }

    try {
      const stats = await pc.getStats();
      let totalBytesSent = 0;
      let totalBytesReceived = 0;
      let candidatePairFound = false;

      stats.forEach((report) => {
        if (report.type === 'candidate-pair' && report.state === 'succeeded') {
          candidatePairFound = true;
          if (report.availableOutgoingBitrate) {
            return report.availableOutgoingBitrate;
          }
        }
        if (report.type === 'outbound-rtp' && report.mediaType === 'video') {
          totalBytesSent += report.bytesSent || 0;
        }
        if (report.type === 'inbound-rtp' && report.mediaType === 'video') {
          totalBytesReceived += report.bytesReceived || 0;
        }
      });

      // Rough estimate: if we have data transfer, estimate based on that
      if (totalBytesSent > 0 || totalBytesReceived > 0) {
        // This is a rough estimate - in production you'd track this over time
        return Math.max(totalBytesSent, totalBytesReceived) * 8; // Convert to bits
      }

      return 1500000; // Default: 1.5 Mbps
    } catch (error) {
      console.warn('Bandwidth estimation failed', error);
      return 1500000; // Default: 1.5 Mbps
    }
  }

  /**
   * Calculates optimal quality settings based on bandwidth
   * @param {number} estimatedBandwidth - Estimated bandwidth in bps
   * @returns {Object} Quality settings
   */
  function calculateOptimalQuality(estimatedBandwidth) {
    // Conservative bitrate allocation (use 80% of estimated bandwidth)
    const targetBitrate = Math.floor(estimatedBandwidth * 0.8);

    let quality;
    if (targetBitrate < 750000) {
      // < 750 kbps: Low quality
      quality = { ...QUALITY_PRESETS.LOW };
    } else if (targetBitrate < 2500000) {
      // < 2.5 Mbps: Medium quality
      quality = { ...QUALITY_PRESETS.MEDIUM };
    } else {
      // >= 2.5 Mbps: High quality
      quality = { ...QUALITY_PRESETS.HIGH };
    }

    // Override bitrate with calculated value
    quality.maxBitrate = targetBitrate;

    return quality;
  }

  /**
   * Applies encoding parameters to sender
   * @param {RTCRtpSender} sender - RTP sender for video track
   * @param {Object} qualitySettings - Quality settings to apply
   * @returns {Promise<boolean>} Success status
   */
  async function applyEncodingParameters(sender, qualitySettings) {
    if (!sender) {
      return false;
    }

    try {
      const params = sender.getParameters();
      if (!params.encodings || params.encodings.length === 0) {
        params.encodings = [{}];
      }

      const encoding = params.encodings[0];

      // Apply bitrate constraints
      if (qualitySettings.maxBitrate) {
        encoding.maxBitrate = qualitySettings.maxBitrate;
      }

      // Apply framerate constraints
      if (qualitySettings.maxFramerate) {
        encoding.maxFramerate = qualitySettings.maxFramerate;
      }

      // Apply resolution scaling
      if (qualitySettings.scaleDownBy && qualitySettings.scaleDownBy > 1) {
        encoding.scaleResolutionDownBy = qualitySettings.scaleDownBy;
      }

      await sender.setParameters(params);
      return true;
    } catch (error) {
      console.warn('Failed to apply encoding parameters', error);
      return false;
    }
  }

  /**
   * Removes unnecessary metadata from SDP to enhance privacy
   * @param {string} sdp - Original SDP string
   * @returns {string} Sanitized SDP string
   */
  function minimizeSdpMetadata(sdp) {
    if (!sdp || typeof sdp !== 'string') {
      return sdp;
    }

    let lines = sdp.split('\r\n');
    const filteredLines = [];

    for (let line of lines) {
      // Remove fingerprinting vectors while keeping essential information

      // Keep essential lines
      if (
        line.startsWith('v=') ||  // Version
        line.startsWith('o=') ||  // Origin
        line.startsWith('s=') ||  // Session name
        line.startsWith('t=') ||  // Timing
        line.startsWith('m=') ||  // Media description
        line.startsWith('c=') ||  // Connection
        line.startsWith('a=rtpmap:') ||  // RTP mapping
        line.startsWith('a=fmtp:') ||  // Format parameters
        line.startsWith('a=rtcp-fb:') ||  // RTCP feedback
        line.startsWith('a=ssrc-group:') ||  // SSRC grouping
        line.startsWith('a=mid:') ||  // Media ID
        line.startsWith('a=ice-') ||  // ICE parameters
        line.startsWith('a=fingerprint:') ||  // DTLS fingerprint
        line.startsWith('a=setup:') ||  // DTLS setup
        line.startsWith('a=sendrecv') ||  // Direction
        line.startsWith('a=sendonly') ||
        line.startsWith('a=recvonly') ||
        line.startsWith('a=inactive') ||
        line.startsWith('a=candidate:') ||  // ICE candidates
        line.startsWith('a=end-of-candidates') ||
        line.startsWith('a=extmap:') ||  // RTP extensions
        line.startsWith('a=group:') ||  // Bundle group
        line.startsWith('a=msid-semantic:') ||  // Media stream semantics
        line.startsWith('a=sctp-port:') ||  // SCTP port for data channels
        line.startsWith('a=max-message-size:')  // Max message size
      ) {
        filteredLines.push(line);
        continue;
      }

      // Remove or sanitize potentially identifying lines
      if (line.startsWith('a=ssrc:')) {
        // Keep SSRC but remove identifying labels like cname, msid, mslabel, label
        // Only keep SSRC definitions needed for the stream to work
        if (line.includes('cname:') || line.includes('msid:') || line.includes('mslabel:') || line.includes('label:')) {
          // Skip these identifying attributes
          continue;
        }
        filteredLines.push(line);
      } else if (line.startsWith('a=msid:')) {
        // Sanitize media stream IDs to remove identifying information
        filteredLines.push('a=msid:- screen');
      } else if (line.startsWith('o=')) {
        // Sanitize origin line to remove username and session ID patterns
        // Format: o=<username> <sess-id> <sess-version> <nettype> <addrtype> <unicast-address>
        const parts = line.split(' ');
        if (parts.length >= 6) {
          parts[0] = 'o=-';  // Remove username
          filteredLines.push(parts.join(' '));
        } else {
          filteredLines.push(line);
        }
      } else if (line.trim() === '') {
        // Keep empty lines for SDP structure
        filteredLines.push(line);
      }
      // All other lines are filtered out
    }

    return filteredLines.join('\r\n');
  }

  /**
   * Optimizes video track for screen sharing with intelligent settings
   * @param {RTCRtpSender} sender - Video sender
   * @param {RTCPeerConnection} pc - Peer connection
   * @param {Object|null} manualQuality - Manual quality override (null for auto)
   * @returns {Promise<Object>} Applied quality settings
   */
  async function optimizeVideoQuality(sender, pc, manualQuality = null) {
    let qualitySettings;

    if (manualQuality && manualQuality.name !== 'auto') {
      // Use manual override
      qualitySettings = manualQuality;
    } else {
      // Auto mode: estimate bandwidth and calculate optimal settings
      const bandwidth = await estimateBandwidth(pc);
      qualitySettings = calculateOptimalQuality(bandwidth);
    }

    const success = await applyEncodingParameters(sender, qualitySettings);

    if (success && appendSystemMessage && t) {
      const message = manualQuality && manualQuality.name !== 'auto'
        ? t.videoQuality?.manualApplied?.(qualitySettings.name) || `Video quality set to ${qualitySettings.name}`
        : t.videoQuality?.autoApplied?.(Math.round(qualitySettings.maxBitrate / 1000)) ||
          `Video quality auto-optimized (${Math.round(qualitySettings.maxBitrate / 1000)} kbps)`;

      appendSystemMessage(message);
    }

    return qualitySettings;
  }

  /**
   * Gets a description of the best available codec
   * @returns {Promise<string>} Codec description
   */
  async function getCodecDescription() {
    const support = await detectCodecSupport();
    const best = getBestCodec(support);

    if (!best) {
      return 'Unknown codec';
    }

    const descriptions = {
      AV1: 'AV1 (highest efficiency)',
      VP9: 'VP9 (high efficiency)',
      VP8: 'VP8 (good compatibility)',
      H264: 'H.264 (universal compatibility)'
    };

    return descriptions[best] || best;
  }

  return {
    detectCodecSupport,
    getBestCodec,
    estimateBandwidth,
    calculateOptimalQuality,
    applyEncodingParameters,
    minimizeSdpMetadata,
    optimizeVideoQuality,
    getCodecDescription,
    QUALITY_PRESETS
  };
}
