# 6. Runtime View

## 6.1 Connection Establishment (Manual Signaling)

### Scenario: Two users establish P2P connection

**Participants**: User A (Initiator), User B (Responder), External Channel (Email/Chat)

```
User A                  TheCommunity A          External        TheCommunity B          User B
  │                           │                  Channel               │                  │
  │ 1. Click "Create Offer"   │                    │                   │                  │
  ├──────────────────────────►│                    │                   │                  │
  │                           │                    │                   │                  │
  │                    2. Create RTCPeerConnection │                   │                  │
  │                           │────┐               │                   │                  │
  │                           │◄───┘               │                   │                  │
  │                           │                    │                   │                  │
  │                    3. Create Data Channels     │                   │                  │
  │                           │────┐               │                   │                  │
  │                           │◄───┘               │                   │                  │
  │                           │                    │                   │                  │
  │                    4. Generate SDP Offer       │                   │                  │
  │                           │────┐               │                   │                  │
  │                           │◄───┘               │                   │                  │
  │                           │                    │                   │                  │
  │                    5. Collect ICE Candidates   │                   │                  │
  │                           │────┐               │                   │                  │
  │                           │◄───┘               │                   │                  │
  │                           │                    │                   │                  │
  │ 6. Display Offer JSON     │                    │                   │                  │
  │◄──────────────────────────┤                    │                   │                  │
  │                           │                    │                   │                  │
  │ 7. Copy to clipboard      │                    │                   │                  │
  ├──────────────────────────►│                    │                   │                  │
  │                           │                    │                   │                  │
  │ 8. Send via external channel                   │                   │                  │
  ├────────────────────────────────────────────────►                   │                  │
  │                           │                    │                   │                  │
  │                           │                    │  9. Receive offer │                  │
  │                           │                    ├───────────────────────────────────────►
  │                           │                    │                   │                  │
  │                           │                    │ 10. Paste into UI │                  │
  │                           │                    │ ◄─────────────────┤                  │
  │                           │                    │                   │                  │
  │                           │                    │ 11. Apply Remote  │                  │
  │                           │                    │ ──────────────────►                  │
  │                           │                    │                   │                  │
  │                           │                    │     12. Set Remote Description       │
  │                           │                    │                   ├────┐             │
  │                           │                    │                   │◄───┘             │
  │                           │                    │                   │                  │
  │                           │                    │ 13. Create Answer │                  │
  │                           │                    │ ──────────────────►                  │
  │                           │                    │                   │                  │
  │                           │                    │     14. Generate SDP Answer          │
  │                           │                    │                   ├────┐             │
  │                           │                    │                   │◄───┘             │
  │                           │                    │                   │                  │
  │                           │                    │     15. Collect ICE Candidates       │
  │                           │                    │                   ├────┐             │
  │                           │                    │                   │◄───┘             │
  │                           │                    │                   │                  │
  │                           │                    │ 16. Display Answer│                  │
  │                           │                    │ ◄─────────────────┤                  │
  │                           │                    │                   │                  │
  │                           │                    │ 17. Copy answer   │                  │
  │                           │                    │ ──────────────────►                  │
  │                           │                    │                   │                  │
  │                           │                    │ 18. Send back via external channel   │
  │                           │                    │◄──────────────────────────────────────
  │                           │                    │                   │                  │
  │ 19. Receive answer        │                    │                   │                  │
  │◄────────────────────────────────────────────────                   │                  │
  │                           │                    │                   │                  │
  │ 20. Paste answer          │                    │                   │                  │
  ├──────────────────────────►│                    │                   │                  │
  │                           │                    │                   │                  │
  │                    21. Set Remote Description  │                   │                  │
  │                           ├────┐               │                   │                  │
  │                           │◄───┘               │                   │                  │
  │                           │                    │                   │                  │
  │                    22. ICE Connection Begins   │                   │                  │
  │                           │◄═══════════════════════════════════════►                  │
  │                           │         WebRTC P2P Connection          │                  │
  │                           │                    │                   │                  │
  │ 23. "Connected!" status   │                    │   23. "Connected!" status            │
  │◄──────────────────────────┤                    │ ◄─────────────────┤                  │
  │                           │                    │                   │                  │
  │                    24. Data Channels Open      │                   │                  │
  │                           │◄════════════════════════════════════════►                  │
  │                           │         'chat' channel ready           │                  │
```

### Key Steps

1. **User A initiates**: Clicks "Create Offer" button
2. **RTCPeerConnection created**: WebRTC object instantiated with empty iceServers config
3. **Data channels created**: 'chat', 'control', 'image' channels set up
4. **SDP offer generated**: `createOffer()` returns local description
5. **ICE candidates collected**: Network addresses discovered and added to offer
6. **Offer displayed**: JSON string shown in textarea
7. **Manual exchange**: User copies and sends via email/Discord/etc.
8. **User B receives**: Pastes offer into "Remote Signal" textarea
9. **Remote set**: `setRemoteDescription()` processes peer's offer
10. **Answer generated**: `createAnswer()` creates response
11. **ICE candidates collected**: User B's network addresses gathered
12. **Answer sent back**: Manual exchange in reverse direction
13. **User A applies answer**: `setRemoteDescription()` completes handshake
14. **ICE connection**: Browsers negotiate direct P2P connection
15. **Data channels open**: Ready for messaging

### Code Reference

**Offer Creation** (`app.js:~200-250`):
```javascript
const createOffer = async () => {
  pc.current = new RTCPeerConnection({ iceServers: [] });

  // Create data channels
  chatChannel.current = pc.current.createDataChannel('chat');
  controlChannel.current = pc.current.createDataChannel('control');
  imageChannel.current = pc.current.createDataChannel('image');

  // Generate offer
  const offer = await pc.current.createOffer();
  await pc.current.setLocalDescription(offer);

  // Wait for ICE gathering
  await waitForICEGathering(pc.current);

  // Display signal
  const signal = JSON.stringify(pc.current.localDescription);
  setLocalSignal(signal);
};
```

**Answer Creation** (`app.js:~300-350`):
```javascript
const createAnswer = async () => {
  const answer = await pc.current.createAnswer();
  await pc.current.setLocalDescription(answer);

  await waitForICEGathering(pc.current);

  const signal = JSON.stringify(pc.current.localDescription);
  setLocalSignal(signal);
};
```

## 6.2 Sending a Chat Message

### Scenario: User sends a message to peer

```
User A              TheCommunity A                    Network              TheCommunity B          User B
  │                       │                              │                       │                  │
  │ 1. Type message       │                              │                       │                  │
  │ "Hello!"              │                              │                       │                  │
  ├──────────────────────►│                              │                       │                  │
  │                       │                              │                       │                  │
  │ 2. Press Enter        │                              │                       │                  │
  ├──────────────────────►│                              │                       │                  │
  │                       │                              │                       │                  │
  │                3. Validate Message                   │                       │                  │
  │                       ├────┐                         │                       │                  │
  │                       │◄───┘                         │                       │                  │
  │                       │ • Length < 2000 chars        │                       │                  │
  │                       │ • Not empty                  │                       │                  │
  │                       │                              │                       │                  │
  │                4. Check Rate Limit                   │                       │                  │
  │                       ├────┐                         │                       │                  │
  │                       │◄───┘                         │                       │                  │
  │                       │ • < 30 msgs in 5 sec window  │                       │                  │
  │                       │                              │                       │                  │
  │                5. Create Message Object              │                       │                  │
  │                       ├────┐                         │                       │                  │
  │                       │◄───┘                         │                       │                  │
  │                       │ { type: 'chat',              │                       │                  │
  │                       │   content: 'Hello!' }        │                       │                  │
  │                       │                              │                       │                  │
  │                6. Stringify JSON                     │                       │                  │
  │                       ├────┐                         │                       │                  │
  │                       │◄───┘                         │                       │                  │
  │                       │                              │                       │                  │
  │                7. Send via DataChannel               │                       │                  │
  │                       ├──────────────────────────────►                       │                  │
  │                       │   chatChannel.send(json)     │                       │                  │
  │                       │                              │                       │                  │
  │                       │                              │  8. Receive on        │                  │
  │                       │                              │     datachannel       │                  │
  │                       │                              ├──────────────────────►│                  │
  │                       │                              │   'message' event     │                  │
  │                       │                              │                       │                  │
  │                       │                              │  9. Parse JSON        │                  │
  │                       │                              │                       ├────┐             │
  │                       │                              │                       │◄───┘             │
  │                       │                              │                       │                  │
  │                       │                              │ 10. Validate          │                  │
  │                       │                              │                       ├────┐             │
  │                       │                              │                       │◄───┘             │
  │                       │                              │  • Valid JSON         │                  │
  │                       │                              │  • Has 'type' field   │                  │
  │                       │                              │  • Length OK          │                  │
  │                       │                              │                       │                  │
  │                       │                              │ 11. Add to history    │                  │
  │                       │                              │                       ├────┐             │
  │                       │                              │                       │◄───┘             │
  │                       │                              │                       │                  │
  │                       │                              │ 12. Display message   │                  │
  │                       │                              │                       ├─────────────────►│
  │                       │                              │                       │  "Peer: Hello!"  │
  │                       │                              │                       │                  │
  │ 13. Echo locally      │                              │                       │                  │
  │ "You: Hello!"         │                              │                       │                  │
  │◄──────────────────────┤                              │                       │                  │
```

### Key Steps

1. **User input**: Types message in input field
2. **Form submission**: Presses Enter or clicks Send
3. **Validation**: Check message length (max 2000 chars), not empty
4. **Rate limit check**: Ensure < 30 messages in last 5 seconds
5. **Message formatting**: Create JSON object with type and content
6. **Serialization**: `JSON.stringify()` the message object
7. **DataChannel send**: `chatChannel.send(jsonString)`
8. **Network transmission**: WebRTC sends via SCTP over DTLS
9. **Peer receives**: `datachannel.onmessage` event fires
10. **Deserialization**: `JSON.parse()` on received data
11. **Validation**: Verify valid JSON, expected fields, length
12. **Display**: Add to message history and render in UI
13. **Local echo**: Show "You: Hello!" on sender's side

### Code Reference

**Send Message** (`app.js:~500-550`):
```javascript
const sendMessage = () => {
  const message = messageInput.trim();

  // Validation
  if (!message || message.length > MAX_MESSAGE_LENGTH) {
    return;
  }

  // Rate limiting
  if (!checkChatRateLimit()) {
    addSystemMessage('Rate limit exceeded. Please slow down.');
    return;
  }

  // Send via DataChannel
  const messageObj = { type: 'chat', content: message };
  chatChannel.current.send(JSON.stringify(messageObj));

  // Local echo
  addMessage({ sender: 'you', text: message });
  setMessageInput('');
};
```

**Receive Message** (`app.js:~600-650`):
```javascript
chatChannel.current.onmessage = (event) => {
  try {
    const data = JSON.parse(event.data);

    // Validate
    if (!data.type || !data.content) {
      console.warn('Invalid message format');
      return;
    }

    if (data.content.length > MAX_MESSAGE_LENGTH) {
      console.warn('Message too long, ignoring');
      return;
    }

    // Display
    if (data.type === 'chat') {
      addMessage({ sender: 'peer', text: data.content });
    }
  } catch (err) {
    console.error('Failed to parse message:', err);
  }
};
```

## 6.3 Screen Sharing

### Scenario: User A shares screen with User B

```
User A              TheCommunity A                    WebRTC              TheCommunity B          User B
  │                       │                              │                       │                  │
  │ 1. Click "Share Screen"                              │                       │                  │
  ├──────────────────────►│                              │                       │                  │
  │                       │                              │                       │                  │
  │                2. Request Display Media               │                       │                  │
  │                       │────┐                         │                       │                  │
  │                       │◄───┘                         │                       │                  │
  │                       │                              │                       │                  │
  │ 3. Browser prompts    │                              │                       │                  │
  │    "Share screen?"    │                              │                       │                  │
  │◄──────────────────────┤                              │                       │                  │
  │                       │                              │                       │                  │
  │ 4. Select screen      │                              │                       │                  │
  ├──────────────────────►│                              │                       │                  │
  │                       │                              │                       │                  │
  │                5. Get MediaStream                    │                       │                  │
  │                       ├────┐                         │                       │                  │
  │                       │◄───┘                         │                       │                  │
  │                       │  { videoTrack, audioTrack }  │                       │                  │
  │                       │                              │                       │                  │
  │                6. Add Tracks to PeerConnection       │                       │                  │
  │                       ├──────────────────────────────►                       │                  │
  │                       │  pc.addTrack(videoTrack)     │                       │                  │
  │                       │  pc.addTrack(audioTrack)     │                       │                  │
  │                       │                              │                       │                  │
  │                7. Renegotiate (createOffer)          │                       │                  │
  │                       ├──────────────────────────────►                       │                  │
  │                       │                              │                       │                  │
  │                       │                              │  8. ontrack event     │                  │
  │                       │                              ├──────────────────────►│                  │
  │                       │                              │   { streams }         │                  │
  │                       │                              │                       │                  │
  │                       │                              │  9. Attach to <video> │                  │
  │                       │                              │                       ├────┐             │
  │                       │                              │                       │◄───┘             │
  │                       │                              │                       │                  │
  │                       │                              │ 10. Display screen    │                  │
  │                       │                              │                       ├─────────────────►│
  │                       │                              │                       │  [Video stream]  │
  │                       │                              │                       │                  │
  │                       │◄═════════════════════════════════════════════════════►                  │
  │                       │        Video frames transmitted via WebRTC          │                  │
```

### Key Steps

1. **User initiates**: Clicks "Share Screen" button
2. **Permission request**: `navigator.mediaDevices.getDisplayMedia()` called
3. **Browser prompt**: User selects screen/window to share
4. **MediaStream obtained**: Contains video track (and optionally audio track)
5. **Tracks added**: `pc.addTrack()` for each track
6. **Renegotiation**: New SDP offer/answer exchange (automatic)
7. **Peer receives tracks**: `pc.ontrack` event fires with remote streams
8. **Video element**: `<video>` element's `srcObject` set to MediaStream
9. **Rendering**: Browser displays peer's screen in video element

### Code Reference

**Start Screen Share** (`app.js:~750-800`):
```javascript
const startScreenShare = async () => {
  try {
    const stream = await navigator.mediaDevices.getDisplayMedia({
      video: { cursor: 'always' },
      audio: true
    });

    // Add tracks to peer connection
    stream.getTracks().forEach(track => {
      pc.current.addTrack(track, stream);
      localTracks.current.push(track);
    });

    // Show local preview
    localVideoRef.current.srcObject = stream;
    setIsSharing(true);

    // Handle stream end (user clicks "Stop Sharing" in browser)
    stream.getVideoTracks()[0].onended = () => {
      stopScreenShare();
    };
  } catch (err) {
    console.error('Screen share failed:', err);
    alert('Could not start screen sharing');
  }
};
```

**Receive Screen Share** (`app.js:~850-880`):
```javascript
pc.current.ontrack = (event) => {
  console.log('Received remote track:', event.track.kind);

  // Attach to video element
  if (remoteVideoRef.current) {
    remoteVideoRef.current.srcObject = event.streams[0];
    setRemoteSharing(true);
  }
};
```

## 6.4 Remote Control Permission Flow

### Scenario: User B requests control of User A's screen

```
User B              TheCommunity B          Control Channel        TheCommunity A          User A
  │                       │                       │                       │                  │
  │ 1. Click "Request     │                       │                       │                  │
  │    Remote Control"    │                       │                       │                  │
  ├──────────────────────►│                       │                       │                  │
  │                       │                       │                       │                  │
  │                2. Send Control Request        │                       │                  │
  │                       ├───────────────────────►                       │                  │
  │                       │  { type: 'request',   │                       │                  │
  │                       │    action: 'control' }│                       │                  │
  │                       │                       │                       │                  │
  │                       │                       │  3. Receive request   │                  │
  │                       │                       ├──────────────────────►│                  │
  │                       │                       │                       │                  │
  │                       │                       │  4. Show prompt       │                  │
  │                       │                       │                       ├─────────────────►│
  │                       │                       │                       │  "Peer requests  │
  │                       │                       │                       │   control. Allow?"│
  │                       │                       │                       │  [Grant] [Deny]  │
  │                       │                       │                       │                  │
  │                       │                       │  5. User clicks Grant │                  │
  │                       │                       │                       │◄─────────────────┤
  │                       │                       │                       │                  │
  │                       │                       │  6. Send grant message│                  │
  │                       │                       │◄──────────────────────┤                  │
  │                       │                       │  { type: 'grant' }    │                  │
  │                       │                       │                       │                  │
  │                       │  7. Receive grant     │                       │                  │
  │                       │◄──────────────────────┤                       │                  │
  │                       │                       │                       │                  │
  │ 8. Show "Control      │                       │                       │                  │
  │    enabled" status    │                       │                       │                  │
  │◄──────────────────────┤                       │                       │                  │
  │                       │                       │                       │                  │
  │ 9. Move mouse         │                       │                       │                  │
  ├──────────────────────►│                       │                       │                  │
  │                       │                       │                       │                  │
  │               10. Send pointer event          │                       │                  │
  │                       ├───────────────────────►                       │                  │
  │                       │  { type: 'pointer',   │                       │                  │
  │                       │    x: 100, y: 200 }   │                       │                  │
  │                       │                       │                       │                  │
  │                       │                       │ 11. Execute locally   │                  │
  │                       │                       │                       ├────┐             │
  │                       │                       │                       │◄───┘             │
  │                       │                       │  • Verify permission  │                  │
  │                       │                       │  • Check rate limit   │                  │
  │                       │                       │  • Move cursor        │                  │
```

### Key Steps

1. **Request**: User B clicks "Request Remote Control"
2. **Control message**: `{ type: 'request', action: 'control' }` sent via control channel
3. **Permission prompt**: User A sees modal asking for permission
4. **Grant/Deny**: User A explicitly grants or denies
5. **Grant message**: `{ type: 'grant' }` or `{ type: 'deny' }` sent back
6. **State update**: Both sides update permission state
7. **Control enabled**: User B can now send pointer/keyboard events
8. **Rate limiting**: Control messages limited to 60 per 5 seconds
9. **Execution**: User A's browser executes commands (move mouse, type, click)
10. **Revocation**: Either user can revoke permission at any time

### Code Reference

**Request Control** (`app.js:~1050-1070`):
```javascript
const requestRemoteControl = () => {
  if (!controlChannel.current || controlChannel.current.readyState !== 'open') {
    return;
  }

  const message = { type: 'request', action: 'control' };
  controlChannel.current.send(JSON.stringify(message));
  addSystemMessage('Requesting remote control...');
};
```

**Grant Control** (`app.js:~1100-1120`):
```javascript
const grantRemoteControl = () => {
  setRemoteControlAllowed(true);

  const message = { type: 'grant' };
  controlChannel.current.send(JSON.stringify(message));

  addSystemMessage('Remote control granted');
};
```

**Execute Control Command** (`app.js:~1200-1280`):
```javascript
const executeControlCommand = (command) => {
  // Verify permission
  if (!remoteControlAllowed) {
    console.warn('Remote control not allowed');
    return;
  }

  // Check rate limit
  if (!checkControlRateLimit()) {
    console.warn('Control rate limit exceeded');
    return;
  }

  // Execute based on type
  switch (command.type) {
    case 'pointer':
      // Move cursor (simulated with overlay dot)
      updatePointerPosition(command.x, command.y);
      break;
    case 'click':
      // Simulate click
      simulateClick(command.x, command.y);
      break;
    case 'keyboard':
      // Type text
      simulateKeyboard(command.key);
      break;
  }
};
```

## 6.5 Application Startup

### Scenario: User opens application

```
Browser              index.html            CDN              app.js             translations.js
  │                      │                  │                  │                     │
  │ 1. Load HTML         │                  │                  │                     │
  ├─────────────────────►│                  │                  │                     │
  │                      │                  │                  │                     │
  │                      │ 2. Fetch React   │                  │                     │
  │                      ├──────────────────►                  │                     │
  │                      │                  │                  │                     │
  │                      │ 3. React.js      │                  │                     │
  │                      │◄──────────────────                  │                     │
  │                      │                  │                  │                     │
  │                      │ 4. Fetch ReactDOM│                  │                     │
  │                      ├──────────────────►                  │                     │
  │                      │                  │                  │                     │
  │                      │ 5. ReactDOM.js   │                  │                     │
  │                      │◄──────────────────                  │                     │
  │                      │                  │                  │                     │
  │                      │ 6. Fetch translations.js            │                     │
  │                      ├─────────────────────────────────────────────────────────►│
  │                      │                  │                  │                     │
  │                      │ 7. Translations  │                  │                     │
  │                      │◄─────────────────────────────────────────────────────────┤
  │                      │                  │                  │                     │
  │                      │ 8. Fetch app.js  │                  │                     │
  │                      ├──────────────────────────────────────►                     │
  │                      │                  │                  │                     │
  │                      │ 9. app.js        │                  │                     │
  │                      │◄──────────────────────────────────────                     │
  │                      │                  │                  │                     │
  │                      │                  │ 10. Execute app.js                     │
  │                      │                  │                  ├────┐                │
  │                      │                  │                  │◄───┘                │
  │                      │                  │                  │                     │
  │                      │                  │ 11. Read localStorage (theme, lang)    │
  │                      │                  │                  ├────┐                │
  │                      │                  │                  │◄───┘                │
  │                      │                  │                  │                     │
  │                      │                  │ 12. Initialize React state             │
  │                      │                  │                  ├────┐                │
  │                      │                  │                  │◄───┘                │
  │                      │                  │                  │                     │
  │                      │                  │ 13. Render UI    │                     │
  │                      │                  │                  ├────┐                │
  │                      │                  │                  │◄───┘                │
  │                      │                  │                  │                     │
  │ 14. Display UI       │                  │                  │                     │
  │◄─────────────────────┤                  │                  │                     │
  │  [Signaling Panel]   │                  │                  │                     │
  │  [Chat Panel]        │                  │                  │                     │
  │  [Status Bar]        │                  │                  │                     │
```

### Key Steps

1. **HTML Load**: Browser fetches and parses index.html
2. **React CDN**: Load React 18 from unpkg.com
3. **ReactDOM CDN**: Load ReactDOM 18 from unpkg.com
4. **Translations**: Load translations.js (German dialects)
5. **App.js**: Load main application code
6. **Execution**: JavaScript executes, creates React component
7. **localStorage**: Read saved theme and language preferences
8. **State Initialization**: Set up React hooks (useState, useRef, etc.)
9. **Render**: ReactDOM.createRoot() and render UI
10. **Display**: User sees signaling panel, empty chat, status indicators

### Performance Targets

| Metric | Target | Measured |
|--------|--------|----------|
| DOMContentLoaded | < 2s | ~1.5s (typical) |
| Fully Loaded | < 5s | ~3.5s (typical) |
| First Paint | < 1s | ~0.8s (typical) |
| Time to Interactive | < 3s | ~2.5s (typical) |

**Measured by**: `tests/loading-performance.spec.js`

## 6.6 Error Handling Patterns

### Pattern 1: WebRTC Connection Failure

```
User A              TheCommunity A                    TheCommunity B          User B
  │                       │                                  │                  │
  │ Connection attempt    │                                  │                  │
  ├──────────────────────►│                                  │                  │
  │                       │                                  │                  │
  │                       │ ICE negotiation fails            │                  │
  │                       │◄─────────X                       │                  │
  │                       │                                  │                  │
  │                       │ pc.oniceconnectionstatechange    │                  │
  │                       ├────┐  (state: 'failed')          │                  │
  │                       │◄───┘                             │                  │
  │                       │                                  │                  │
  │ Display error message │                                  │                  │
  │◄──────────────────────┤                                  │                  │
  │ "Connection failed.   │                                  │                  │
  │  Try refreshing..."   │                                  │                  │
```

**Handling**:
- Monitor `pc.oniceconnectionstatechange`
- Detect "failed" or "disconnected" states
- Display user-friendly error message
- Suggest refresh or retry

### Pattern 2: Message Validation Failure

```
Peer                TheCommunity (Receiver)
  │                       │
  │ Malicious message     │
  │ (invalid JSON)        │
  ├──────────────────────►│
  │                       │
  │                       │ JSON.parse() fails
  │                       ├────┐
  │                       │◄───┘
  │                       │ catch (err)
  │                       │
  │                       │ Log warning
  │                       ├────┐
  │                       │◄───┘
  │                       │ console.warn('Invalid JSON')
  │                       │
  │                       │ Discard message (silent)
  │                       ├────┐
  │                       │◄───┘
  │                       │
  │                       │ (No user notification)
```

**Handling**:
- Wrap `JSON.parse()` in try-catch
- Validate message structure and fields
- Log warnings for debugging
- Silently discard invalid messages (no UI disruption)
- Never crash on bad input

### Pattern 3: Rate Limit Exceeded

```
User                TheCommunity
  │                       │
  │ Send message (31st    │
  │ in 5 sec window)      │
  ├──────────────────────►│
  │                       │
  │                       │ checkRateLimit()
  │                       ├────┐
  │                       │◄───┘
  │                       │ returns false
  │                       │
  │ Display warning       │
  │◄──────────────────────┤
  │ "Rate limit exceeded. │
  │  Please slow down."   │
  │                       │
  │ (Message not sent)    │
```

**Handling**:
- Check rate limit before sending
- Display friendly warning message
- Do not send message
- Allow user to retry after cooldown

## 6.7 Summary

Key runtime scenarios:

1. **Connection Establishment**: Manual signaling with offer/answer exchange (8+ steps)
2. **Chat Messaging**: Validation → Rate limit → DataChannel → Parse → Display
3. **Screen Sharing**: getDisplayMedia → addTrack → Renegotiate → ontrack → Display
4. **Remote Control**: Request → Permission prompt → Grant/Deny → Command execution
5. **Application Startup**: Load resources → Initialize state → Render UI (< 2s)
6. **Error Handling**: Graceful degradation with user-friendly messages

All scenarios emphasize:
- **Validation**: Never trust incoming data
- **Rate Limiting**: Prevent abuse
- **User Feedback**: Clear status messages
- **Error Handling**: Graceful failures, no crashes
