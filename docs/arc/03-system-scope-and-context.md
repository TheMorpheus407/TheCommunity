# 3. System Scope and Context

## 3.1 Business Context

### System Overview

```
                                    ┌─────────────────────────────────┐
                                    │                                 │
┌─────────────┐                     │        TheCommunity             │                     ┌─────────────┐
│             │                     │    (Browser Application)        │                     │             │
│   User A    │◄───────────────────►│                                 │◄───────────────────►│   User B    │
│  (Peer 1)   │   Manual Signal     │  ┌───────────────────────────┐ │   Manual Signal     │  (Peer 2)   │
│             │   Exchange          │  │   WebRTC P2P Connection   │ │   Exchange          │             │
└─────────────┘                     │  └───────────────────────────┘ │                     └─────────────┘
      │                             │                                 │                           │
      │                             └─────────────────────────────────┘                           │
      │                                           │                                               │
      │                                           │                                               │
      │                             ┌─────────────▼─────────────┐                                │
      │                             │                            │                                │
      └────────────────────────────►│    WebRTC Direct Link     │◄───────────────────────────────┘
                                    │   (Chat, Screen Share,    │
                                    │    Remote Control)        │
                                    └────────────────────────────┘
                                                 │
                                    ┌────────────▼────────────┐
                                    │   External Services     │
                                    │   (Optional)            │
                                    ├─────────────────────────┤
                                    │ • GitHub API (public)   │
                                    │ • OpenAI API (user key) │
                                    └─────────────────────────┘
```

### External Entities

| Entity | Description | Communication | Dependency |
|--------|-------------|---------------|------------|
| **User A (Initiator)** | Creates WebRTC offer, shares via external channel | Manual signal copy-paste | Required |
| **User B (Responder)** | Receives offer, creates answer, shares back | Manual signal copy-paste | Required |
| **GitHub API** | Provides contributor statistics from Issues | HTTPS REST API (read-only) | Optional |
| **OpenAI API** | AI message rewriting service | HTTPS REST API (user API key) | Optional |
| **GitHub Pages** | Static file hosting and delivery | HTTPS (serves HTML/CSS/JS) | Required (hosting) |
| **External Signal Channel** | Email, chat, or any out-of-band communication | User's choice (e.g., email, Discord) | Required (for signaling) |

### Business Interfaces

#### BI1: Manual Signaling Exchange

**Purpose**: Establish WebRTC connection without signaling server

**Process**:
1. User A generates offer (SDP + ICE candidates)
2. User A copies JSON signal to clipboard
3. User A sends signal to User B via external channel (email, chat, etc.)
4. User B pastes signal into application
5. User B generates answer
6. User B copies answer and sends back to User A
7. User A pastes answer
8. WebRTC connection establishes

**Format**: JSON containing SDP offer/answer and ICE candidates

**Security**: Users are warned that signals contain network addresses

#### BI2: GitHub API Integration

**Purpose**: Display contributor statistics and project engagement

**Endpoints Used**:
- `GET /repos/{owner}/{repo}/issues` - Fetch issues for statistics
- Public API, no authentication required

**Data Consumed**:
- Issue authors (usernames, avatars)
- Issue labels (e.g., "claude" for AI stats)
- Issue counts per contributor

**Frequency**: On-demand when contributors panel is opened

**Fallback**: Graceful degradation if API unavailable

#### BI3: OpenAI API Integration

**Purpose**: Optional AI-powered message rewriting

**Endpoints Used**:
- `POST /v1/chat/completions` - Send message draft for rewriting

**Data Sent**:
- User's message draft
- System prompt for rewriting instructions
- User's API key (in Authorization header)

**Data Received**:
- Rewritten message suggestion

**Security**:
- API key stored in memory only (not persisted)
- User explicitly opts-in
- Direct browser-to-OpenAI communication (no proxy)
- User responsible for API usage costs

**Fallback**: Feature disabled if no API key provided

## 3.2 Technical Context

### Technical Interfaces

```
┌─────────────────────────────────────────────────────────────────┐
│                      Browser Environment                         │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                  TheCommunity Application                   │ │
│  │                                                              │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐ │ │
│  │  │   React UI   │  │   WebRTC     │  │  External APIs   │ │ │
│  │  │  Components  │  │   Manager    │  │  (GitHub/OpenAI) │ │ │
│  │  └──────────────┘  └──────────────┘  └──────────────────┘ │ │
│  └───────┬───────────────────┬────────────────────┬───────────┘ │
│          │                   │                    │              │
│          │                   │                    │              │
│  ┌───────▼───────┐   ┌───────▼────────┐   ┌──────▼──────────┐  │
│  │   DOM API     │   │  WebRTC APIs   │   │   Fetch API     │  │
│  │ (React render)│   │ - RTCPeerConn  │   │ (HTTPS requests)│  │
│  └───────────────┘   │ - RTCDataChan  │   └─────────────────┘  │
│                      │ - MediaStream  │                         │
│                      └────────────────┘                         │
└─────────────────────────────────────────────────────────────────┘
                               │
                ┌──────────────┼──────────────┐
                │              │              │
        ┌───────▼──────┐  ┌────▼─────┐  ┌────▼─────────┐
        │   Network    │  │ WebRTC   │  │   External   │
        │  (Browser)   │  │ Protocol │  │   Services   │
        └──────────────┘  └──────────┘  └──────────────┘
                │
        ┌───────▼────────┐
        │  Peer Browser  │
        │ (User B / A)   │
        └────────────────┘
```

### TI1: WebRTC APIs

**Interface**: Browser WebRTC APIs (W3C Standard)

| API | Purpose | Usage Pattern |
|-----|---------|---------------|
| `RTCPeerConnection` | Main WebRTC connection object | Created per peer connection |
| `createOffer()` | Generate SDP offer | Initiator calls to start connection |
| `createAnswer()` | Generate SDP answer | Responder calls after receiving offer |
| `setLocalDescription()` | Set local SDP | Called after creating offer/answer |
| `setRemoteDescription()` | Set remote SDP | Called when receiving peer's SDP |
| `RTCDataChannel` | Message channel | Created for chat, control, image transfer |
| `addIceCandidate()` | Add ICE candidate | Called when ICE candidates received |
| `getDisplayMedia()` | Screen capture | Used for screen sharing feature |

**Data Formats**:
- **SDP (Session Description Protocol)**: Text format describing media capabilities
- **ICE Candidates**: JSON objects with network address information
- **Data Channel Messages**: String or ArrayBuffer payloads

**Configuration**:
```javascript
const config = {
  iceServers: [] // No STUN/TURN servers by default
};
```

### TI2: React from CDN

**Interface**: External JavaScript library loaded via script tag

**Source**:
```html
<script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
<script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
```

**Dependency Management**:
- Version pinned to React 18
- Loaded synchronously before app.js
- No npm install required

**API Used**:
- `React.createElement()`
- `React.useState()`
- `React.useRef()`
- `React.useCallback()`
- `React.useEffect()`
- `ReactDOM.createRoot()`

### TI3: GitHub REST API

**Interface**: HTTPS REST API (public, no auth)

**Base URL**: `https://api.github.com`

**Endpoints**:
```
GET /repos/TheMorpheus407/TheCommunity/issues
  Query: state=all, per_page=100
  Response: JSON array of issue objects
```

**Headers**:
```
Accept: application/vnd.github.v3+json
User-Agent: TheCommunity-App
```

**Rate Limiting**:
- 60 requests/hour (unauthenticated)
- Handled gracefully with error messages

**Error Handling**:
- HTTP errors caught and logged
- Fallback: Contributor panel shows error message

### TI4: OpenAI REST API

**Interface**: HTTPS REST API (authenticated with user key)

**Base URL**: `https://api.openai.com`

**Endpoints**:
```
POST /v1/chat/completions
  Headers:
    Authorization: Bearer {user-api-key}
    Content-Type: application/json
  Body:
    {
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "Rewrite this message..." },
        { role: "user", content: "{user-draft}" }
      ]
    }
  Response:
    {
      choices: [{ message: { content: "{rewritten-text}" } }]
    }
```

**Security**:
- User provides API key explicitly
- Key stored in memory only (React state)
- Sent only to api.openai.com
- Not logged or persisted

**Error Handling**:
- Network errors shown to user
- API errors (rate limit, invalid key) displayed
- Feature degrades gracefully without key

### TI5: Browser Storage APIs

**Interface**: Web Storage API (localStorage)

**Usage**:
- `localStorage.getItem('theme')` - Read saved theme preference
- `localStorage.setItem('theme', value)` - Save theme preference
- `localStorage.getItem('language')` - Read saved language preference
- `localStorage.setItem('language', value)` - Save language preference

**Data Stored**:
- Theme preference: `'light'` | `'dark'` | `'rgb'`
- Language preference: Language code

**Data NOT Stored**:
- No user credentials
- No API keys
- No chat history
- No WebRTC signals

**Privacy**: Local to user's browser, not transmitted

### TI6: Browser Media APIs

**Interface**: Media Capture and Streams API

**Usage**:
```javascript
navigator.mediaDevices.getDisplayMedia({
  video: { cursor: "always" },
  audio: true
})
```

**Purpose**: Screen sharing feature

**Permissions**: Browser prompts user to select screen/window

**Tracks**:
- Video track: Screen content
- Audio track: System audio (optional)

**Transmission**: Via WebRTC peer connection (not uploaded to server)

## 3.3 Context Boundary

### What is Inside TheCommunity

**Core Application**:
- WebRTC connection management
- Chat message handling and validation
- Screen sharing coordination
- Remote control permission system
- Image transfer chunking
- UI rendering (React components)
- Theme and language management
- Rate limiting enforcement
- Input validation

### What is Outside TheCommunity

**External Dependencies**:
- WebRTC signaling (user's responsibility via external channel)
- React library (CDN)
- Browser WebRTC implementation
- Network connectivity
- GitHub API (optional)
- OpenAI API (optional)

**Not Provided**:
- User authentication
- Message persistence
- Signaling server
- STUN/TURN servers
- Backend database
- User profiles
- Multi-peer mesh networking

## 3.4 Integration Patterns

### Pattern 1: Manual Signaling

**Problem**: WebRTC needs signaling, but we have no signaling server

**Solution**: Users manually exchange signals via external channels

**Trade-off**:
- ✅ Zero server infrastructure
- ❌ Complex user experience
- ✅ Complete user control over data sharing

### Pattern 2: Client-Side Only

**Problem**: Need features like AI, but no backend allowed

**Solution**:
- Use client-side APIs with user-provided credentials
- Make requests directly from browser to third-party services

**Trade-off**:
- ✅ No backend infrastructure
- ❌ User must provide API keys
- ❌ Browser limited to CORS-enabled APIs

### Pattern 3: Progressive Enhancement

**Problem**: Optional features shouldn't break core functionality

**Solution**:
- GitHub API and OpenAI features degrade gracefully
- Core chat works without external services

**Trade-off**:
- ✅ Reliable core functionality
- ✅ Optional enhancements don't cause failures
- ❌ More complex error handling

## 3.5 External Communication Summary

| Service | Protocol | Direction | Required | Data Sensitivity | Rate Limit |
|---------|----------|-----------|----------|------------------|------------|
| Peer Browser | WebRTC (UDP/SCTP) | Bidirectional | Yes | Chat messages (not encrypted) | 30 msg/5s |
| GitHub API | HTTPS REST | Outbound | No | Public repository data | 60 req/hr |
| OpenAI API | HTTPS REST | Outbound | No | User message drafts | User's quota |
| GitHub Pages | HTTPS | Inbound | Yes (hosting) | Static files (public) | N/A |
| Signal Exchange | User's choice | Manual | Yes | WebRTC signals (network IPs) | Manual |
