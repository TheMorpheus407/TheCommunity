# Modular Architecture

This directory contains the modularized components and utilities extracted from the monolithic `app.js`.

## Architecture Overview

The application is being incrementally refactored from a single 2810-line file into well-organized ES6 modules with clear responsibilities.

### Current Structure

```
src/
├── core/
│   └── constants.js          # Application-wide constants and enums
├── components/
│   └── TuxMascot.js          # Mascot React component
├── managers/                  # Business logic managers (Phase 2)
│   ├── WebRTCManager.js      # Peer connection and signaling
│   ├── ChatManager.js        # Chat messaging with rate limiting
│   ├── ScreenShareManager.js # Screen capture and streaming
│   ├── VoiceVideoManager.js  # Voice/video calling (NEW)
│   ├── RoomManager.js        # Password-protected rooms (NEW)
│   ├── RemoteControlManager.js # Remote screen control
│   ├── ImageTransferManager.js # Chunked image transfer
│   └── AIManager.js          # OpenAI API integration
├── utils/
│   ├── helpers.js            # Theme resolution and utilities
│   ├── soundEffects.js       # Background audio and Konami code
│   └── contributors.js       # GitHub API integration
└── app.js                    # Main application (in progress)
```

## Modules

### Core

#### `core/constants.js`
Exports all application constants including:
- Channel labels (`EXPECTED_CHANNEL_LABEL`, `CONTROL_CHANNEL_LABEL`, etc.)
- Rate limiting configuration
- Image transfer settings
- Theme options
- Control message types
- Helper function: `getNextThemeValue(currentTheme)`

**API Documentation:**
```javascript
import {
  MAX_MESSAGE_LENGTH,
  THEME_OPTIONS,
  getNextThemeValue
} from './core/constants.js';

// Use constants
console.log(MAX_MESSAGE_LENGTH); // 2000

// Cycle through themes
const nextTheme = getNextThemeValue(THEME_OPTIONS.DARK);
// Returns: 'light'
```

### Components

#### `components/TuxMascot.js`
React component rendering the angry penguin mascot.

**API Documentation:**
```javascript
import { TuxMascot } from './components/TuxMascot.js';

// Usage in React
React.createElement(TuxMascot, { t: translationObject });
```

**Props:**
- `t` (Object): Translation object containing `mascot.ariaLabel`

### Utilities

#### `utils/helpers.js`
Theme resolution and helper functions.

**API Documentation:**
```javascript
import { resolveInitialTheme } from './utils/helpers.js';

const { theme, isStored } = resolveInitialTheme();
// Returns: { theme: 'dark'|'light'|'rgb', isStored: boolean }
```

**Functions:**
- `resolveInitialTheme()`: Determines initial theme from storage or system preferences

#### `utils/soundEffects.js`
Audio easter eggs and background sound management.

**API Documentation:**
```javascript
import { initBackgroundSound, initKonamiCode } from './utils/soundEffects.js';

// Initialize background audio (plays on first user interaction)
initBackgroundSound();

// Enable Konami code easter egg (↑↑↓↓←→←→BA)
initKonamiCode();
```

**Functions:**
- `initBackgroundSound()`: Sets up background audio with browser autoplay handling
- `initKonamiCode()`: Enables Nyan Cat easter egg via Konami code

#### `utils/contributors.js`
GitHub API integration for fetching contributors and statistics.

**API Documentation:**
```javascript
import { fetchContributors, fetchStatistics } from './utils/contributors.js';

// Fetch contributors from GitHub issues
const contributors = await fetchContributors('owner/repo');
// Returns: Array<{ login: string, avatar_url: string, issue_count: number }>

// Fetch Claude AI statistics
const stats = await fetchStatistics('owner/repo');
// Returns: Array<{ number, title, state, url, created_at, closed_at, labels }>
```

**Functions:**
- `fetchContributors(repo)`: Fetches and aggregates contributors from repository issues
- `fetchStatistics(repo)`: Fetches issues labeled with 'claude' for AI statistics

### Managers

#### `managers/WebRTCManager.js`
Handles peer-to-peer WebRTC connection setup and signaling.

**API Documentation:**
```javascript
import { createWebRTCManager } from './managers/WebRTCManager.js';

const webrtcManager = createWebRTCManager({
  pcRef, iceDoneRef, screenSenderRef, screenAudioSenderRef,
  remoteScreenStreamRef, remoteScreenVideoRef, channelRef,
  controlChannelRef, imageChannelRef, incomingTimestampsRef,
  canControlPeerRef, setStatus, setLocalSignal, setChannelStatus,
  setChannelReady, setIsRemoteScreenActive, setControlChannelReady,
  setCanControlPeer, setRemoteControlStatus, appendSystemMessage,
  setupChatChannel, setupControlChannel, setupImageChannel, t
});

// Create offer
await webrtcManager.createOffer(remoteSignal);

// Apply remote description
await webrtcManager.applyRemote(remoteSignal);

// Create answer
await webrtcManager.createAnswer(remoteSignal);

// Disconnect
webrtcManager.disconnect(screenState);
```

**Functions:**
- `ensurePeerConnection()`: Creates or returns RTCPeerConnection
- `waitForIce()`: Waits for ICE gathering completion
- `parseRemoteDescription(signal, t)`: Validates and parses SDP
- `createOffer(signal)`: Generates WebRTC offer
- `applyRemote(signal)`: Applies remote SDP
- `createAnswer(signal)`: Creates WebRTC answer
- `disconnect(screenState)`: Terminates connection

**Security:**
- No STUN/TURN servers (direct P2P only)
- SDP validation
- Channel label whitelisting
- Connection state monitoring

#### `managers/ChatManager.js`
Handles chat messaging with rate limiting and validation.

**API Documentation:**
```javascript
import { createChatManager } from './managers/ChatManager.js';

const chatManager = createChatManager({
  channelRef, incomingTimestampsRef, messageIdRef,
  setChannelStatus, setChannelReady, setIsSignalingCollapsed,
  appendMessage, appendSystemMessage, t
});

// Setup chat channel
chatManager.setupChatChannel(channel);

// Send message
chatManager.sendMessage(text, setInputText);

// Add message to chat
chatManager.addMessage(text, 'local', setMessages, { imageUrl, fileName });

// Clear messages
chatManager.clearMessages(setMessages);
```

**Functions:**
- `setupChatChannel(channel)`: Configures chat channel with rate limiting
- `sendMessage(text, setInputText)`: Sends chat message
- `addMessage(text, role, setMessages, options)`: Adds message to history
- `clearMessages(setMessages)`: Clears chat history

**Security:**
- Message length validation (max 2000 chars)
- Rate limiting (30 messages per 5 seconds)
- Type checking for string payloads
- Sliding window rate limiting algorithm

#### `managers/ScreenShareManager.js`
Handles screen capture and streaming via WebRTC.

**API Documentation:**
```javascript
import { createScreenShareManager } from './managers/ScreenShareManager.js';

const screenShareManager = createScreenShareManager({
  screenStreamRef, screenSenderRef, screenAudioSenderRef,
  localScreenVideoRef, remoteControlAllowedRef, remoteKeyBudgetRef,
  setIsScreenSharing, setShareSystemAudio, setIsRemoteControlAllowed,
  setRemoteControlStatus, appendSystemMessage, ensurePeerConnection,
  sendControlMessage, cancelPendingPointerFrame, hideRemotePointer, t
});

// Start screen sharing
await screenShareManager.startScreenShare(isCurrentlySharing, includeSystemAudio);

// Stop screen sharing
screenShareManager.stopScreenShare(isCurrentlySharing);

// Toggle system audio
screenShareManager.toggleSystemAudio(setShareSystemAudio);
```

**Functions:**
- `startScreenShare(isSharing, includeAudio)`: Starts screen capture
- `stopScreenShare(isSharing)`: Stops screen capture
- `toggleSystemAudio(setter)`: Toggles audio capture preference

**Security:**
- Browser permission checks
- Track ending event handling
- Proper resource cleanup
- Disables remote control on stop

#### `managers/RemoteControlManager.js`
Handles remote screen control via WebRTC data channel.

**API Documentation:**
```javascript
import { createRemoteControlManager } from './managers/RemoteControlManager.js';

const remoteControlManager = createRemoteControlManager({
  controlChannelRef, controlIncomingTimestampsRef, controlWarningsRef,
  remoteControlAllowedRef, canControlPeerRef, remoteKeyBudgetRef,
  remotePointerTimeoutRef, pointerFramePendingRef, pointerFrameIdRef,
  pointerQueuedPositionRef, setControlChannelReady, setCanControlPeer,
  setIsRemoteControlAllowed, setRemoteControlStatus, setRemotePointerState,
  setInputText, setAiStatus, setAiError, appendSystemMessage, handleSend, t
});

// Setup control channel
remoteControlManager.setupControlChannel(channel, sendControlMessage);

// Toggle remote control
remoteControlManager.toggleRemoteControl(channelReady, isScreenSharing);

// Send control message
remoteControlManager.sendControlMessage({ type: 'permission', allowed: true });
```

**Functions:**
- `setupControlChannel(channel, sender)`: Configures control channel
- `sendControlMessage(message)`: Sends control message
- `toggleRemoteControl(ready, sharing)`: Toggles remote control
- `handleIncomingControlMessage(payload, sender)`: Processes control messages
- `handleRemoteKeyboardInput(message, sender)`: Handles keyboard input
- `performRemoteClick(x, y, button)`: Performs remote click
- `showRemotePointer(x, y)`: Shows pointer indicator
- `hideRemotePointer()`: Hides pointer indicator

**Security:**
- Rate limiting (60 messages per 5 seconds)
- Payload size validation (max 2048 bytes)
- Text input budget limiting (2048 total chars)
- Input sanitization (control characters filtered)
- Click target validation (only #outgoing input)
- Requires active screen sharing

#### `managers/ImageTransferManager.js`
Handles chunked image transfer over WebRTC.

**API Documentation:**
```javascript
import { createImageTransferManager } from './managers/ImageTransferManager.js';

const imageTransferManager = createImageTransferManager({
  imageChannelRef, imageTransfersRef, imageSendTimestampsRef,
  imageReceiveTimestampsRef, imageFileInputRef,
  appendMessage, appendSystemMessage, t
});

// Setup image channel
imageTransferManager.setupImageChannel(channel);

// Handle image selection
await imageTransferManager.handleImageSelect(event);

// Open image picker
imageTransferManager.openImagePicker();
```

**Functions:**
- `setupImageChannel(channel)`: Configures image channel
- `handleIncomingImageMessage(payload)`: Processes image messages
- `handleImageSelect(event)`: Handles file selection and sending
- `openImagePicker()`: Triggers file picker

**Security:**
- File type validation (JPEG, PNG, GIF, WebP only)
- File size validation (max 5MB)
- Send rate limiting (10 images per minute)
- Receive rate limiting (10 images per minute)
- Concurrent transfer limiting (max 3)
- Chunked transfer (16KB chunks)

#### `managers/AIManager.js`
Handles OpenAI API integration for chat rewriting.

**API Documentation:**
```javascript
import { createAIManager } from './managers/AIManager.js';

const aiManager = createAIManager({
  setIsAiBusy, setAiStatus, setAiError, setInputText,
  setApiKeyInput, setApiKeyError, setIsApiKeyModalOpen,
  setIsAboutOpen, appendSystemMessage, t
});

// Open API key modal
aiManager.openApiKeyModal(currentKey);

// Save API key
aiManager.saveApiKey(apiKeyInput, setOpenAiKey);

// Rewrite message
await aiManager.rewriteMessage(inputText, openAiKey);

// Generate summaries
const issuesWithSummaries = await aiManager.generateSummaries(issues, openAiKey);

// Disable AI
aiManager.disableAi(setOpenAiKey);
```

**Functions:**
- `openApiKeyModal(currentKey)`: Opens API key modal
- `closeApiKeyModal()`: Closes API key modal
- `saveApiKey(input, setter)`: Saves API key
- `disableAi(setter)`: Disables AI
- `continueWithoutAi()`: Continues without AI
- `rewriteMessage(text, key)`: Rewrites message via OpenAI
- `generateSummaries(issues, key)`: Generates AI summaries

**Security:**
- API key stored in memory only (not localStorage)
- Message length validation
- Error handling for unauthorized responses
- Token limits on API requests (256 for rewrite, 128 for summaries)

#### `managers/VoiceVideoManager.js`
Handles camera and microphone capture for voice/video calling via WebRTC.

**API Documentation:**
```javascript
import { createVoiceVideoManager } from './managers/VoiceVideoManager.js';

const voiceVideoManager = createVoiceVideoManager({
  voiceVideoStreamRef, voiceVideoSenderRef, voiceAudioSenderRef,
  localVoiceVideoRef, remoteVoiceVideoStreamRef, remoteVoiceVideoRef,
  setIsVoiceVideoActive, setIsCameraEnabled, setIsMicrophoneEnabled,
  setIsRemoteVoiceVideoActive, appendSystemMessage, ensurePeerConnection, t
});

// Start voice/video with camera and microphone
await voiceVideoManager.startVoiceVideo(isCurrentlyActive, enableCamera, enableMicrophone);

// Stop voice/video
voiceVideoManager.stopVoiceVideo(isCurrentlyActive);

// Toggle camera
await voiceVideoManager.toggleCamera(isCameraEnabled);

// Toggle microphone
await voiceVideoManager.toggleMicrophone(isMicrophoneEnabled);
```

**Functions:**
- `startVoiceVideo(isActive, enableCamera, enableMic)`: Starts camera/microphone capture
- `stopVoiceVideo(isActive)`: Stops voice/video streaming
- `toggleCamera(isEnabled)`: Toggles camera on/off
- `toggleMicrophone(isEnabled)`: Toggles microphone on/off

**Security:**
- Browser permission checks
- Track ending event handling
- Proper resource cleanup
- Media constraints for quality (720p, echo cancellation, noise suppression)

#### `managers/RoomManager.js`
Handles password-protected room creation and invite link generation with encryption.

**API Documentation:**
```javascript
import { createRoomManager } from './managers/RoomManager.js';

const roomManager = createRoomManager({
  appendSystemMessage, t
});

// Create a password-protected room
const roomMetadata = await roomManager.createRoom(password, isCommunityRoom);
// Returns: { roomId, passwordHash, isCommunityRoom, createdAt }

// Generate invite link with encrypted SDP
const inviteLink = await roomManager.generateInviteLink(roomId, sdpOffer, password);
// Returns: URL with encrypted offer

// Parse invite link
const result = await roomManager.parseInviteLink(roomId, inviteData, password);
// Returns: { success: boolean, sdpOffer?: string, error?: string }

// Toggle community visibility
roomManager.toggleCommunityVisibility(roomId, isCommunity);

// Get/save room metadata
const metadata = roomManager.getRoomMetadata(roomId);
roomManager.saveRoomMetadata(roomId, metadata);
```

**Functions:**
- `createRoom(password, isCommunity)`: Creates password-protected room
- `generateInviteLink(roomId, sdp, password)`: Generates encrypted invite link
- `parseInviteLink(roomId, data, password)`: Parses and decrypts invite
- `toggleCommunityVisibility(roomId, visible)`: Toggles public visibility
- `getRoomMetadata(roomId)`: Retrieves room metadata from localStorage
- `saveRoomMetadata(roomId, metadata)`: Saves room metadata

**Security:**
- SHA-256 password hashing (never stores plain passwords)
- AES-256-GCM encryption for SDP offers
- PBKDF2 key derivation (100,000 iterations)
- Random salt and IV generation per encryption
- Client-side only password verification
- No backend required - fully P2P

## Benefits of Modular Architecture

### ✅ Separation of Concerns
Pure logic and utilities are separated from React components and state management.

### ✅ Reusability
Modules can be imported anywhere in the application or in future features.

### ✅ Testability
Each module can be unit tested independently without complex mocking.

### ✅ Documentation
Full JSDoc API documentation for all exports.

### ✅ Maintainability
Clear module boundaries make it easier to locate and update code.

### ✅ Performance Potential
ES6 modules enable dynamic imports for code splitting and lazy loading in the future.

### ✅ No Build Step Required
Uses native ES6 module system supported by modern browsers.

## Migration Roadmap

The refactoring is being done incrementally to avoid breaking changes:

### Phase 1: Foundation (Current)
- [x] Extract constants
- [x] Extract utilities
- [x] Extract pure components
- [x] Document architecture

### Phase 2: Manager Classes (Complete)
- [x] Extract WebRTC Manager
- [x] Extract Chat Manager
- [x] Extract Screen Share Manager
- [x] Extract Remote Control Manager
- [x] Extract Image Transfer Manager
- [x] Extract AI Manager
- [x] Full JSDoc documentation for all managers
- [x] Comprehensive API documentation in README
- [x] All security measures preserved

### Phase 3: React Components (Future PR)
- [ ] Extract About Dialog
- [ ] Extract Signaling Panel
- [ ] Extract Chat Panel
- [ ] Extract Screen Share Panel
- [ ] Extract API Key Modal

### Phase 4: Complete Migration (Future PR)
- [ ] Full modular app.js
- [ ] Remove legacy monolithic file
- [ ] Add dynamic imports for performance
- [ ] Update deployment

## Usage

### In Original App (Current)
The original `app.js` remains unchanged and fully functional.

### With Modules (Future)
```html
<script type="module" src="src/app.js"></script>
```

## Testing

E2E tests verify that:
1. The modular version maintains feature parity
2. Loading time performance meets requirements
3. All WebRTC functionality works correctly
4. Security constraints are maintained

See `tests/` directory for test suites.

## Security Considerations

All modules maintain the security principles:
- No external API calls except to OpenAI (user-provided key) and GitHub (public API)
- WebRTC-only communication (no backend)
- Input validation and rate limiting preserved
- No credential storage

## Development

### Adding a New Module

1. Create the module file in the appropriate directory
2. Add full JSDoc documentation
3. Export functions/classes with clear API
4. Update this README with API documentation
5. Add unit tests
6. Import and use in app.js

### Example Module Template

```javascript
/**
 * @fileoverview Module description
 * @module path/to/module
 */

/**
 * Function description
 * @param {Type} paramName - Parameter description
 * @returns {Type} Return description
 * @export
 */
export function functionName(paramName) {
  // Implementation
}
```

## License

Same as parent project (see LICENSE file in root).
