# Architecture Documentation

## Overview

TheCommunity is a peer-to-peer WebRTC chat application that runs entirely in the browser with no backend infrastructure. This document explains the technical architecture, design decisions, and implementation details.

## Core Principles

1. **No Backend**: Zero server-side code - all logic runs in the browser
2. **True P2P**: Direct browser-to-browser communication via WebRTC
3. **Security First**: Multiple layers of validation and rate limiting
4. **Clean Architecture**: Maintainable, extensible codebase
5. **Zero Build Step**: Works directly in browsers without compilation

## Technology Stack

### Frontend
- **HTML5**: Semantic markup with minimal structure
- **React 18**: UI framework loaded via CDN (no build step)
- **Vanilla CSS**: Modern CSS with custom properties and animations
- **WebRTC API**: Native browser APIs for P2P communication

### Development Tools
- **ESLint**: Code quality and consistency
- **Git**: Version control
- **GitHub Pages**: Static hosting and deployment

### Why No Build Step?

This project intentionally avoids build tools (webpack, vite, etc.) to:
- Keep the barrier to entry low
- Make the code easily inspectable
- Reduce complexity and dependencies
- Enable instant deployment to GitHub Pages

## WebRTC Architecture

### Connection Flow

```
Peer A                          Peer B
  |                               |
  |---[1] Create Offer----------->|
  |<--[2] Manual Transfer---------|
  |                               |
  |<--[3] Create Answer-----------|
  |---[4] Manual Transfer-------->|
  |                               |
  |<===== P2P Connection ========>|
  |         (DataChannel)         |
```

### Components

#### 1. RTCPeerConnection
- Manages the P2P connection
- Handles ICE candidate gathering
- No STUN/TURN servers (local connections only)

```javascript
const pc = new RTCPeerConnection({ iceServers: [] });
```

#### 2. DataChannel
- Named channel: 'chat'
- Ordered, reliable delivery (default)
- Text-only messages

```javascript
const channel = pc.createDataChannel('chat');
```

#### 3. Manual Signaling
- No signaling server
- Users manually exchange SDP (Session Description Protocol) messages
- Copy/paste via any out-of-band channel (email, messenger, etc.)

### Security Measures

#### Rate Limiting
```javascript
const MAX_MESSAGES_PER_INTERVAL = 30;  // messages
const MESSAGE_INTERVAL_MS = 5000;       // 5 seconds
```

**Implementation**: Sliding window algorithm using timestamps
- Tracks last N message timestamps
- Filters out old timestamps before checking count
- Blocks messages exceeding rate limit

#### Message Validation
```javascript
const MAX_MESSAGE_LENGTH = 2000;  // characters
```

**Checks**:
1. Type validation (text only, no binary)
2. Size validation (max 2000 chars)
3. Channel label verification
4. Rate limit enforcement

#### Channel Verification
```javascript
const EXPECTED_CHANNEL_LABEL = 'chat';
```

**Purpose**: Prevents unexpected data channels from being accepted

## React Component Architecture

### Component Hierarchy

```
<ErrorBoundary>
  └─ <App>
      ├─ <section id="signaling">  (collapsible)
      │   ├─ Connection controls
      │   ├─ Signal display/input
      │   └─ Status indicators
      │
      └─ <div id="floating-chat">
          └─ <section id="chat">    (minimizable)
              ├─ Message history
              └─ Input controls
```

### State Management

**React Hooks Used**:
- `useState`: UI state and connection state
- `useRef`: Persistent references (RTCPeerConnection, DataChannel, timestamps)
- `useCallback`: Memoized event handlers
- `useEffect`: Side effects (scroll, cleanup, auto-collapse)

**Key State Variables**:
```javascript
// Connection state
const [status, setStatus] = useState('Waiting to connect...');
const [channelStatus, setChannelStatus] = useState('Channel closed');
const [channelReady, setChannelReady] = useState(false);

// Signaling state
const [localSignal, setLocalSignal] = useState('');
const [remoteSignal, setRemoteSignal] = useState('');

// UI state
const [messages, setMessages] = useState([]);
const [inputText, setInputText] = useState('');
const [isSignalingCollapsed, setIsSignalingCollapsed] = useState(false);
const [isChatMinimized, setIsChatMinimized] = useState(false);
```

### Error Boundary

**Purpose**: Catch and handle React rendering errors gracefully

**Features**:
- Displays user-friendly error message
- Shows error details in expandable section
- Provides reload button
- Logs errors to console for debugging

**Implementation**: Class component (required for error boundaries)

## CSS Architecture

### Z-Index Scale

Organized into layers for predictable stacking:

```
1-9:     Base layer (default elements)
10-99:   Content layer (panels, sections)
100-999: Overlay layer (modals, dialogs)
1000+:   Floating widgets (chat, notifications)
```

### Design System

**Colors**:
- Background: Dark gradient (`#0f172a` to `#1f2937`)
- Primary: Cyan blue (`#38bdf8`)
- Accent: Purple gradient (`#0ea5e9` to `#8b5cf6`)
- Text: Light (`#f8fafc`)

**Spacing**: `0.75rem`, `1rem`, `1.2rem`, `1.5rem`, `2rem`

**Border Radius**: `12px`, `14px`, `16px`, `18px`, `999px` (pills)

### Responsive Design

**Breakpoint**: `768px` (mobile)

**Mobile Adaptations**:
- Stacked button layout
- Vertical chat input
- Adjusted padding
- Optimized floating chat size

## Security Architecture

### Threat Model

**Threats Addressed**:
1. ✅ Message flooding (rate limiting)
2. ✅ Oversized messages (size limits)
3. ✅ Binary exploits (text-only validation)
4. ✅ Unexpected channels (label verification)
5. ✅ XSS attacks (React auto-escaping)

**Known Limitations**:
1. ❌ IP address exposure in ICE candidates
2. ❌ No peer authentication
3. ❌ No message encryption beyond WebRTC defaults
4. ❌ Vulnerable to MITM during signaling

### Defense in Depth

**Layer 1: Input Validation**
- Type checking on received data
- Length validation
- Character encoding (React handles)

**Layer 2: Rate Limiting**
- Per-peer message limits
- Sliding window algorithm
- Graceful degradation (ignore, don't disconnect)

**Layer 3: Channel Control**
- Label verification
- Close unexpected channels immediately
- System messages for blocked events

**Layer 4: Error Handling**
- Error boundary catches React errors
- Try-catch blocks for WebRTC operations
- User-friendly error messages

## File Structure

```
TheCommunity/
├── index.html              # Entry point, React CDN imports
├── app.js                  # Main application logic
│   ├── ErrorBoundary      # Error handling component
│   ├── App                # Main application component
│   ├── WebRTC logic       # Connection management
│   └── React rendering    # Component tree
├── styles.css              # All styling
├── .nojekyll               # GitHub Pages config
├── .eslintrc.json          # Linting rules
├── package.json            # Dev dependencies and scripts
├── CLAUDE.md               # AI assistant guidelines
├── ARCHITECTURE.md         # This file
└── README.md               # User documentation
```

## Development Guidelines

### Code Style

**JavaScript**:
- Use `const` and `let` (no `var`)
- Arrow functions for callbacks
- Template literals for strings
- Semicolons required

**React**:
- Functional components with hooks
- `React.createElement` (no JSX - no build step)
- Proper hook dependencies
- Cleanup in `useEffect`

**CSS**:
- Mobile-first approach
- CSS custom properties for theming
- BEM-like naming where applicable
- Avoid `!important`

### Adding New Features

When adding features, follow these principles:

1. **Maintain P2P Constraint**: No backend calls allowed
2. **Security Review**: Consider attack vectors
3. **Backward Compatibility**: Don't break existing functionality
4. **Clean Code**: Match existing style and architecture
5. **Documentation**: Update this file and README.md

### Testing Strategy

**Current State**: No automated tests (initial version)

**Future Testing Plans**:
1. ESLint for static analysis (✅ implemented)
2. Manual testing protocol
3. Browser compatibility matrix
4. Security testing checklist

## Deployment

### GitHub Pages

**Deployment Flow**:
```
1. Push to main branch
2. GitHub Actions runs
3. Files deployed to gh-pages
4. Live at themorpheus407.github.io/TheCommunity
```

**Configuration**:
- `.nojekyll` file prevents Jekyll processing
- All files in root directory are served
- No build step required

### Continuous Deployment

- Every merge to `main` triggers deployment
- Zero-downtime deployments
- Instant rollback via git revert

## Performance Considerations

### Optimization Strategies

1. **React via CDN**: Leverages browser caching across sites
2. **Minimal Dependencies**: Only React and ReactDOM
3. **No Build Step**: Instant load, no bundle parsing
4. **CSS-only Animations**: Hardware-accelerated
5. **Efficient Re-renders**: Memoized callbacks, proper deps

### Bundle Size

- `index.html`: ~0.5 KB
- `app.js`: ~15 KB
- `styles.css`: ~6 KB
- **Total (app code)**: ~21.5 KB

React is loaded from CDN (not counted in bundle size)

## Future Architecture Considerations

### Potential Enhancements

1. **Service Worker**: Offline support, caching
2. **IndexedDB**: Local message history
3. **File Sharing**: Extend DataChannel for file transfer
4. **Video/Audio**: Add RTCPeerConnection media streams
5. **Multi-peer**: Support group chats (mesh or SFU topology)

### Constraints to Maintain

- No backend services (per CLAUDE.md)
- No npm build step
- Security-first approach
- Clean, extensible architecture

## Troubleshooting

### Common Issues

**Issue**: "Missing ;" JavaScript error
- **Cause**: Jekyll processing corrupting JS files
- **Solution**: `.nojekyll` file (implemented in PR #9)

**Issue**: Connection fails to establish
- **Cause**: NAT/firewall blocking, no STUN/TURN servers
- **Solution**: Use on same network or add STUN/TURN configuration

**Issue**: Chat not visible
- **Cause**: Channel not established
- **Solution**: Follow full signaling flow (offer → answer → apply)

## Contributing to Architecture

When proposing architectural changes:

1. Open a GitHub Issue explaining the change
2. Discuss trade-offs and alternatives
3. Consider security implications
4. Update this document with approved changes
5. Maintain consistency with CLAUDE.md guidelines

---

**Last Updated**: 2025-10-11
**Version**: 1.0
**Status**: Living Document (updated as architecture evolves)
