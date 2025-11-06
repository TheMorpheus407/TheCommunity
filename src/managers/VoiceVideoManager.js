/**
 * @fileoverview Voice/Video Manager - Handles camera and microphone capture and streaming
 * @module managers/VoiceVideoManager
 *
 * This manager handles:
 * - Camera capture via getUserMedia
 * - Microphone capture
 * - Track management and lifecycle
 * - Integration with WebRTC transceivers
 * - Remote voice/video stream handling
 *
 * Security features:
 * - Browser permission checks
 * - Track ending event handling
 * - Proper resource cleanup
 */

/**
 * Creates a factory for Voice/Video operations
 * @param {Object} deps - Dependencies object
 * @param {React.MutableRefObject} deps.voiceVideoStreamRef - Local voice/video stream reference
 * @param {React.MutableRefObject} deps.voiceVideoSenderRef - Video transceiver sender for camera
 * @param {React.MutableRefObject} deps.voiceAudioSenderRef - Audio transceiver sender for mic
 * @param {React.MutableRefObject} deps.localVoiceVideoRef - Local video element ref
 * @param {React.MutableRefObject} deps.remoteVoiceVideoStreamRef - Remote voice/video stream ref
 * @param {React.MutableRefObject} deps.remoteVoiceVideoRef - Remote video element ref
 * @param {Function} deps.setIsVoiceVideoActive - Voice/video active state setter
 * @param {Function} deps.setIsCameraEnabled - Camera enabled state setter
 * @param {Function} deps.setIsMicrophoneEnabled - Microphone enabled state setter
 * @param {Function} deps.setIsRemoteVoiceVideoActive - Remote voice/video active setter
 * @param {Function} deps.appendSystemMessage - System message appender
 * @param {Function} deps.ensurePeerConnection - WebRTC connection factory
 * @param {Object} deps.t - Translation object
 * @returns {Object} Voice/video operations
 * @export
 */
export function createVoiceVideoManager(deps) {
  const {
    voiceVideoStreamRef,
    voiceVideoSenderRef,
    voiceAudioSenderRef,
    localVoiceVideoRef,
    remoteVoiceVideoStreamRef,
    remoteVoiceVideoRef,
    setIsVoiceVideoActive,
    setIsCameraEnabled,
    setIsMicrophoneEnabled,
    setIsRemoteVoiceVideoActive,
    appendSystemMessage,
    ensurePeerConnection,
    t
  } = deps;

  /**
   * Stops voice/video streaming and cleans up resources
   * @param {boolean} isCurrentlyActive - Current voice/video active state
   * @returns {void}
   */
  function stopVoiceVideo(isCurrentlyActive) {
    const stream = voiceVideoStreamRef.current;

    // Stop all media tracks
    if (stream) {
      stream.getTracks().forEach((track) => {
        try {
          track.stop();
        } catch (error) {
          console.warn('Failed to stop voice/video track', error);
        }
      });
      voiceVideoStreamRef.current = null;
    }

    // Clear video sender track
    if (voiceVideoSenderRef.current) {
      try {
        voiceVideoSenderRef.current.replaceTrack(null);
      } catch (error) {
        console.warn('Failed to clear camera video sender', error);
      }
    }

    // Clear audio sender track
    if (voiceAudioSenderRef.current) {
      try {
        voiceAudioSenderRef.current.replaceTrack(null);
      } catch (error) {
        console.warn('Failed to clear microphone audio sender', error);
      }
    }

    // Clear video element
    if (localVoiceVideoRef.current) {
      localVoiceVideoRef.current.srcObject = null;
    }

    // Notify user if streaming was active
    if (isCurrentlyActive) {
      appendSystemMessage(t.voiceVideo?.messages?.stopped || 'Voice/Video stopped.');
    }

    // Reset state
    setIsVoiceVideoActive(false);
    setIsCameraEnabled(false);
    setIsMicrophoneEnabled(false);
  }

  /**
   * Starts voice/video capture and streams it to peer
   * @param {boolean} isCurrentlyActive - Current voice/video active state
   * @param {boolean} enableCamera - Whether to enable camera
   * @param {boolean} enableMicrophone - Whether to enable microphone
   * @returns {Promise<void>}
   */
  async function startVoiceVideo(isCurrentlyActive, enableCamera, enableMicrophone) {
    if (isCurrentlyActive) {
      return;
    }

    if (!enableCamera && !enableMicrophone) {
      appendSystemMessage(t.voiceVideo?.messages?.nothingEnabled || 'Please enable camera or microphone.');
      return;
    }

    let stream = null;

    try {
      // Check browser support
      if (!navigator.mediaDevices || typeof navigator.mediaDevices.getUserMedia !== 'function') {
        appendSystemMessage(t.voiceVideo?.messages?.notSupported || 'Voice/Video not supported in this browser.');
        return;
      }

      // Ensure peer connection is ready
      const pc = ensurePeerConnection();
      if (!pc) {
        throw new Error(t.voiceVideo?.errors?.peerNotReady || 'Peer connection not ready.');
      }

      // Request media with specified constraints
      const constraints = {
        video: enableCamera ? {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        } : false,
        audio: enableMicrophone ? {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } : false
      };

      stream = await navigator.mediaDevices.getUserMedia(constraints);

      // Get tracks
      const videoTrack = stream.getVideoTracks()[0] || null;
      const audioTrack = stream.getAudioTracks()[0] || null;

      // Replace video transceiver track
      if (voiceVideoSenderRef.current && videoTrack) {
        await voiceVideoSenderRef.current.replaceTrack(videoTrack);
      }

      // Replace audio transceiver track
      if (voiceAudioSenderRef.current && audioTrack) {
        await voiceAudioSenderRef.current.replaceTrack(audioTrack);
      }

      // Store stream and attach to video element
      voiceVideoStreamRef.current = stream;
      if (localVoiceVideoRef.current) {
        localVoiceVideoRef.current.srcObject = stream;
      }

      // Update state
      setIsVoiceVideoActive(true);
      setIsCameraEnabled(!!videoTrack);
      setIsMicrophoneEnabled(!!audioTrack);
      appendSystemMessage(t.voiceVideo?.messages?.started || 'Voice/Video started.');

      // Handle tracks ending
      if (videoTrack) {
        videoTrack.onended = () => {
          setIsCameraEnabled(false);
          if (!audioTrack || audioTrack.readyState === 'ended') {
            stopVoiceVideo(true);
          }
        };
      }
      if (audioTrack) {
        audioTrack.onended = () => {
          setIsMicrophoneEnabled(false);
          if (!videoTrack || videoTrack.readyState === 'ended') {
            stopVoiceVideo(true);
          }
        };
      }
    } catch (error) {
      console.error('Voice/Video failed', error);

      // Cleanup on failure
      if (stream) {
        stream.getTracks().forEach((track) => {
          try {
            track.stop();
          } catch (stopError) {
            console.warn('Failed to stop captured track after error', stopError);
          }
        });
      }

      // Notify user of failure
      const reason = error && error.message ? error.message : (t.voiceVideo?.errors?.permissionDenied || 'Permission denied.');
      appendSystemMessage(t.voiceVideo?.errors?.failed?.(reason) || `Voice/Video failed: ${reason}`);
      setIsVoiceVideoActive(false);
      setIsCameraEnabled(false);
      setIsMicrophoneEnabled(false);
    }
  }

  /**
   * Toggles camera on/off
   * @param {boolean} isCameraEnabled - Current camera state
   * @returns {Promise<void>}
   */
  async function toggleCamera(isCameraEnabled) {
    const stream = voiceVideoStreamRef.current;

    if (!stream) {
      // Start fresh with camera only
      await startVoiceVideo(false, true, false);
      return;
    }

    const videoTrack = stream.getVideoTracks()[0];

    if (videoTrack) {
      // Stop existing video track
      videoTrack.stop();
      stream.removeTrack(videoTrack);

      if (voiceVideoSenderRef.current) {
        await voiceVideoSenderRef.current.replaceTrack(null);
      }

      setIsCameraEnabled(false);
      appendSystemMessage(t.voiceVideo?.messages?.cameraOff || 'Camera turned off.');

      // If no audio track, stop entirely
      if (stream.getAudioTracks().length === 0) {
        stopVoiceVideo(true);
      }
    } else {
      // Add camera
      try {
        const newStream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 1280 },
            height: { ideal: 720 },
            facingMode: 'user'
          }
        });

        const newVideoTrack = newStream.getVideoTracks()[0];
        if (newVideoTrack) {
          stream.addTrack(newVideoTrack);

          if (voiceVideoSenderRef.current) {
            await voiceVideoSenderRef.current.replaceTrack(newVideoTrack);
          }

          setIsCameraEnabled(true);
          appendSystemMessage(t.voiceVideo?.messages?.cameraOn || 'Camera turned on.');

          newVideoTrack.onended = () => {
            setIsCameraEnabled(false);
            const audioTrack = stream.getAudioTracks()[0];
            if (!audioTrack || audioTrack.readyState === 'ended') {
              stopVoiceVideo(true);
            }
          };
        }
      } catch (error) {
        console.error('Failed to add camera', error);
        appendSystemMessage(t.voiceVideo?.errors?.cameraFailed || 'Failed to enable camera.');
      }
    }
  }

  /**
   * Toggles microphone on/off
   * @param {boolean} isMicrophoneEnabled - Current microphone state
   * @returns {Promise<void>}
   */
  async function toggleMicrophone(isMicrophoneEnabled) {
    const stream = voiceVideoStreamRef.current;

    if (!stream) {
      // Start fresh with microphone only
      await startVoiceVideo(false, false, true);
      return;
    }

    const audioTrack = stream.getAudioTracks()[0];

    if (audioTrack) {
      // Stop existing audio track
      audioTrack.stop();
      stream.removeTrack(audioTrack);

      if (voiceAudioSenderRef.current) {
        await voiceAudioSenderRef.current.replaceTrack(null);
      }

      setIsMicrophoneEnabled(false);
      appendSystemMessage(t.voiceVideo?.messages?.microphoneOff || 'Microphone turned off.');

      // If no video track, stop entirely
      if (stream.getVideoTracks().length === 0) {
        stopVoiceVideo(true);
      }
    } else {
      // Add microphone
      try {
        const newStream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true
          }
        });

        const newAudioTrack = newStream.getAudioTracks()[0];
        if (newAudioTrack) {
          stream.addTrack(newAudioTrack);

          if (voiceAudioSenderRef.current) {
            await voiceAudioSenderRef.current.replaceTrack(newAudioTrack);
          }

          setIsMicrophoneEnabled(true);
          appendSystemMessage(t.voiceVideo?.messages?.microphoneOn || 'Microphone turned on.');

          newAudioTrack.onended = () => {
            setIsMicrophoneEnabled(false);
            const videoTrack = stream.getVideoTracks()[0];
            if (!videoTrack || videoTrack.readyState === 'ended') {
              stopVoiceVideo(true);
            }
          };
        }
      } catch (error) {
        console.error('Failed to add microphone', error);
        appendSystemMessage(t.voiceVideo?.errors?.microphoneFailed || 'Failed to enable microphone.');
      }
    }
  }

  return {
    startVoiceVideo,
    stopVoiceVideo,
    toggleCamera,
    toggleMicrophone
  };
}
