# 4. Solution Strategy

## 4.1 Technology Decisions

### TD1: WebRTC for Peer-to-Peer Communication

**Decision**: Use WebRTC DataChannels and MediaStreams for all peer communication

**Rationale**:
- Only browser API that enables true P2P without servers
- Built-in NAT traversal with ICE
- Support for both reliable (TCP-like) and unreliable (UDP-like) channels
- Browser security model handles permission prompts

**Consequences**:
- ✅ Zero server costs
- ✅ Low latency (direct peer connection)
- ✅ Browser-enforced security
- ❌ Complex signaling required
- ❌ Connections fail behind restrictive firewalls
- ❌ No native multi-peer support

**Alternatives Considered**:
1. **WebSocket + Server**: Rejected - violates "no backend" constraint
2. **Long Polling**: Rejected - requires server
3. **WebRTC with STUN/TURN**: Partially used - STUN/TURN optional, not required

### TD2: Manual Signaling

**Decision**: Users manually exchange WebRTC signals via external channels (email, chat, etc.)

**Rationale**:
- Eliminates need for signaling server
- Users control exactly what information is shared
- Educational: users see the WebRTC handshake process

**Consequences**:
- ✅ Zero infrastructure
- ✅ Transparent signaling process
- ❌ Poor user experience (copy-paste required)
- ❌ Not suitable for mainstream users
- ❌ Connection setup takes longer

**Alternatives Considered**:
1. **Signaling Server**: Rejected - violates "no backend" constraint
2. **QR Code Exchange**: Considered - could be added as enhancement
3. **Magic Link**: Rejected - requires server to host links

### TD3: React from CDN

**Decision**: Load React 18 from unpkg CDN, use hooks for state management

**Rationale**:
- No build step required
- Well-known library with good documentation
- Hooks API enables functional components
- Easy for contributors to understand

**Consequences**:
- ✅ Zero setup complexity
- ✅ Fast development
- ✅ No build tools needed
- ❌ Larger bundle size (entire React loaded)
- ❌ No tree-shaking
- ❌ Dependent on CDN availability

**Alternatives Considered**:
1. **Vanilla JS**: Rejected - complex state management for this app
2. **Preact**: Rejected - less familiar to contributors
3. **Vue**: Rejected - React more widely known
4. **React with bundler**: Rejected - violates "no build step" constraint

### TD4: Native ES6 Modules

**Decision**: Use browser-native ES6 modules (`<script type="module">`)

**Rationale**:
- Supported in all modern browsers (95%+ market share)
- No bundler required
- Clean import/export syntax
- Enables progressive refactoring

**Consequences**:
- ✅ Simple module system
- ✅ Direct source debugging
- ✅ Easy code splitting
- ❌ Not supported in IE11
- ❌ Requires modern browser
- ❌ No dead code elimination

**Alternatives Considered**:
1. **Webpack**: Rejected - requires build step
2. **AMD/CommonJS**: Rejected - not native
3. **Single file**: Rejected - unmaintainable at scale

### TD5: GitHub Pages for Hosting

**Decision**: Deploy static files to GitHub Pages via GitHub Actions

**Rationale**:
- Free for public repositories
- Automatic HTTPS
- Global CDN
- Integrated with GitHub workflow

**Consequences**:
- ✅ Zero hosting costs
- ✅ Automatic deployment
- ✅ HTTPS enforced
- ❌ Static files only
- ❌ No server-side code
- ❌ No custom response headers

**Alternatives Considered**:
1. **Netlify/Vercel**: Rejected - unnecessary complexity
2. **Self-hosted**: Rejected - violates "no backend" constraint
3. **CloudFlare Pages**: Considered - GitHub Pages simpler for this use case

## 4.2 Top-Level Decomposition

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Application Layer                       │
│  (React Components, UI State Management)                    │
└────────────────────────┬────────────────────────────────────┘
                         │
┌────────────────────────┼────────────────────────────────────┐
│                   Business Logic Layer                       │
│                                                              │
│  ┌─────────────┐  ┌─────────────┐  ┌──────────────────┐   │
│  │   WebRTC    │  │    Chat     │  │  Screen Share    │   │
│  │   Manager   │  │   Manager   │  │    Manager       │   │
│  └─────────────┘  └─────────────┘  └──────────────────┘   │
│                                                              │
│  ┌─────────────┐  ┌─────────────┐  ┌──────────────────┐   │
│  │   Remote    │  │    Image    │  │      AI          │   │
│  │   Control   │  │  Transfer   │  │    Manager       │   │
│  └─────────────┘  └─────────────┘  └──────────────────┘   │
└────────────────────────┬────────────────────────────────────┘
                         │
┌────────────────────────┼────────────────────────────────────┐
│                  Utility & Core Layer                        │
│                                                              │
│  ┌─────────────┐  ┌─────────────┐  ┌──────────────────┐   │
│  │  Constants  │  │   Helpers   │  │  Contributors    │   │
│  │   (Config)  │  │   (Theme)   │  │  (GitHub API)    │   │
│  └─────────────┘  └─────────────┘  └──────────────────┘   │
│                                                              │
│  ┌─────────────┐  ┌─────────────┐                          │
│  │    Sound    │  │ Translations│                          │
│  │   Effects   │  │   (i18n)    │                          │
│  └─────────────┘  └─────────────┘                          │
└────────────────────────┬────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────┐
│                     Browser APIs                             │
│  (WebRTC, DOM, Fetch, localStorage, Media Capture)          │
└──────────────────────────────────────────────────────────────┘
```

### Layer Responsibilities

#### Application Layer
- Render UI with React
- Handle user interactions
- Manage React state (useState, useRef)
- Coordinate between managers
- Display feedback and errors

#### Business Logic Layer
- **WebRTC Manager**: Connection lifecycle, signaling, ICE handling
- **Chat Manager**: Message validation, rate limiting, message history
- **Screen Share Manager**: Media stream capture, track management
- **Remote Control Manager**: Permission system, coordinate messages
- **Image Transfer Manager**: Chunking, reassembly, progress tracking
- **AI Manager**: OpenAI API integration, draft rewriting

#### Utility & Core Layer
- **Constants**: Configuration values, enums
- **Helpers**: Theme resolution, pure utility functions
- **Contributors**: GitHub API integration
- **Sound Effects**: Audio features, easter eggs
- **Translations**: Multi-language support

#### Browser APIs
- WebRTC APIs for P2P communication
- DOM APIs for rendering
- Fetch API for external HTTP requests
- localStorage for preferences
- Media Capture for screen sharing

## 4.3 Quality Goal Achievement Strategy

### QG1: Security and Privacy

**Strategy**: Defense in depth with multiple layers of protection

| Mechanism | Implementation |
|-----------|----------------|
| **Input Validation** | Validate all messages at receiver before processing |
| **Rate Limiting** | Client-side sliding window algorithm per channel |
| **Channel Isolation** | Immediately close unexpected data channels |
| **No Credential Storage** | Session-scoped API keys only, never persisted |
| **User Warnings** | Explicit warnings about network address exposure |
| **Security Reviews** | Every PR must pass security review |

**Key Files**:
- `SECURITY_REVIEW.md` - Security analysis template
- `CLAUDE.md` - Mandates security checks for all changes

### QG2: Reliability and Stability

**Strategy**: Progressive enhancement with zero breaking changes

| Mechanism | Implementation |
|-----------|----------------|
| **Incremental Refactoring** | Extract modules without changing production code |
| **E2E Testing** | Playwright tests for critical user paths |
| **Performance Monitoring** | Tests verify load time targets |
| **Error Boundaries** | Catch and display errors gracefully |
| **Graceful Degradation** | Optional features fail without breaking core |
| **Rollback Plan** | Every PR can be reverted cleanly |

**Key Files**:
- `tests/loading-performance.spec.js` - E2E tests
- `playwright.config.js` - Test configuration

### QG3: Maintainability and Extensibility

**Strategy**: Modular architecture with clear separation of concerns

| Mechanism | Implementation |
|-----------|----------------|
| **Module Separation** | Business logic separated from UI |
| **JSDoc Documentation** | All exports fully documented |
| **Architecture Docs** | arc42 documentation (this document) |
| **Clean Code** | CLAUDE.md mandates clean code practices |
| **Community Process** | Issues drive feature development |

**Key Files**:
- `ARCHITECTURE.md` - Technical architecture
- `docs/arc/` - arc42 documentation
- `src/README.md` - Module API documentation

## 4.4 Architectural Patterns

### Pattern 1: Manager Pattern

**Purpose**: Encapsulate complex state and behavior

**Usage**:
- WebRTC connection lifecycle
- Chat message handling
- Screen share coordination
- Image transfer orchestration

**Structure**:
```javascript
class WebRTCManager {
  constructor(callbacks) {
    this.pc = null;
    this.callbacks = callbacks;
  }

  createOffer() { /* ... */ }
  applyAnswer() { /* ... */ }
  cleanup() { /* ... */ }
}
```

**Benefits**:
- Testable in isolation
- Clear lifecycle management
- Stateful logic encapsulated

### Pattern 2: React Hooks for State

**Purpose**: Manage component state and side effects

**Usage**:
- `useState`: UI state (messages, connection status)
- `useRef`: Mutable references (WebRTC objects, timers)
- `useCallback`: Optimized event handlers
- `useEffect`: Side effects (connection setup, cleanup)

**Benefits**:
- Functional components
- Easy to understand
- Built-in cleanup

### Pattern 3: Data Channel Isolation

**Purpose**: Security through channel validation

**Implementation**:
```javascript
pc.ondatachannel = (event) => {
  if (event.channel.label !== EXPECTED_CHANNEL_LABEL) {
    event.channel.close();
    return;
  }
  // Process expected channel
};
```

**Benefits**:
- Prevents channel confusion attacks
- Clear security boundary
- Fail-safe default (close unexpected)

### Pattern 4: Rate Limiting via Sliding Window

**Purpose**: Prevent message flooding

**Implementation**:
```javascript
const checkRateLimit = (timestamps, limit, windowMs) => {
  const now = Date.now();
  const recentTimestamps = timestamps.filter(t => now - t < windowMs);
  return recentTimestamps.length < limit;
};
```

**Benefits**:
- Simple to implement
- No server coordination needed
- User-friendly (gradual limit)

### Pattern 5: Progressive Refactoring

**Purpose**: Modernize codebase without breaking changes

**Approach**:
1. **Phase 1**: Extract modules (utilities, constants, components)
2. **Phase 2**: Extract managers (WebRTC, chat, etc.)
3. **Phase 3**: Extract React components
4. **Phase 4**: Switch to modular entry point

**Current Status**: Phase 1 complete, Phase 2 planned

**Benefits**:
- Zero downtime
- Incremental validation
- Rollback at any phase

## 4.5 Achieving the Main Constraint

### "Backend communication ONLY runs over WebRTC"

**Strategy**: Strict enforcement with documented exceptions

**Allowed**:
- ✅ WebRTC DataChannels and MediaStreams (primary communication)
- ✅ GitHub API (read-only, UI metadata only, not app functionality)
- ✅ OpenAI API (optional, user-initiated, user-provided key)

**Prohibited**:
- ❌ WebSocket servers
- ❌ REST APIs for chat messages
- ❌ Signaling servers
- ❌ Backend databases
- ❌ Authentication servers

**Enforcement**:
- Security reviews check for new HTTP requests
- CLAUDE.md explicitly forbids backend communication
- Code reviews validate no server dependencies added

**Result**: True peer-to-peer application with optional read-only external APIs for UI enhancement

## 4.6 Summary

The solution strategy revolves around three key pillars:

1. **WebRTC + Manual Signaling**: Achieves "no backend" by using browser P2P APIs with user-controlled signaling
2. **Simple Tooling**: CDN React + ES6 modules eliminate build complexity
3. **Progressive Enhancement**: Incremental refactoring maintains stability while improving architecture

These choices create a unique application that demonstrates serverless P2P communication while remaining accessible to community contributors.
