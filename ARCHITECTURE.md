# Architecture Documentation

## Overview

This document describes the architecture of TheCommunity chat application and the ongoing refactoring from a monolithic structure to a modular ES6-based architecture.

## Current State

### Before Refactoring
- **app.js**: Single 2810-line file containing all logic
- **translations.js**: 523-line translation system (well-structured, kept as-is)
- **No test infrastructure**
- **No module separation**

### After Refactoring (Phase 1 - In Progress)
- **Extracted modules**: Constants, utilities, and components (ready for future use)
- **Full JSDoc documentation** for all extracted modules
- **E2E test infrastructure** with Playwright
- **Performance monitoring** built into tests
- **Original app.js unchanged**: Production still uses monolithic file (zero breaking changes)

## Architecture Principles

### 1. No Backend Constraint
All communication happens via WebRTC peer-to-peer. There is no signaling server, no traditional backend.

### 2. Progressive Enhancement
Refactoring happens incrementally to avoid breaking the live application.

### 3. Native ES6 Modules
Uses browser-native module system without build tools to maintain simplicity.

### 4. Security First
- Input validation preserved
- Rate limiting maintained
- No credential storage
- WebRTC-only communication

## Module Organization

```
/
├── src/                      # Extracted modules (not yet integrated)
│   ├── core/                 # Core application constants and configuration
│   │   └── constants.js      # All configuration constants (extracted)
│   ├── components/           # React UI components
│   │   └── TuxMascot.js      # Mascot component (extracted)
│   ├── utils/                # Utility functions
│   │   ├── helpers.js        # Theme utilities (extracted)
│   │   ├── soundEffects.js   # Audio features (extracted)
│   │   └── contributors.js   # GitHub API (extracted)
│   └── README.md             # Module documentation
├── tests/                    # E2E test suites
│   └── loading-performance.spec.js
├── app.js                    # Original monolithic file (ACTIVE - used in production)
├── translations.js           # Translation system (kept as-is)
├── index.html                # Production entry point (uses original app.js)
├── playwright.config.js      # Test configuration
└── package.json              # Dependencies and scripts
```

## Key Modules

### Core Layer

#### `src/core/constants.js`
Central location for all application constants:
- Channel configuration
- Rate limiting parameters
- Image transfer settings
- Theme options
- Message type enums

**Responsibility**: Provide single source of truth for configuration values.

### Component Layer

#### `src/components/TuxMascot.js`
React component rendering the animated mascot.

**Responsibility**: Pure presentational component with no business logic.

### Utility Layer

#### `src/utils/helpers.js`
Theme resolution and general utilities.

**Responsibility**: Pure functions for theme management.

#### `src/utils/soundEffects.js`
Audio features and easter eggs.

**Responsibility**: Initialize background sound and Konami code.

#### `src/utils/contributors.js`
GitHub API integration.

**Responsibility**: Fetch contributor data and statistics from GitHub.

## Data Flow

```
User Interaction
      ↓
React Components (UI Layer)
      ↓
Event Handlers (App Component)
      ↓
Business Logic (Managers)
      ↓
WebRTC / Data Channels
      ↓
Peer Browser
```

## State Management

Currently using React hooks for state management:
- `useState` for component state
- `useRef` for mutable references (WebRTC objects, timers)
- `useCallback` for optimized event handlers
- `useEffect` for lifecycle management

## WebRTC Architecture

### Peer Connection
- **No STUN/TURN servers**: Direct peer-to-peer only
- **Manual signaling**: Users exchange SDP offers/answers via copy-paste
- **No signaling server**: True serverless architecture

### Data Channels
1. **Chat Channel** (`'chat'`)
   - Reliable ordered delivery
   - Rate limited (30 msgs / 5 sec)
   - Max message length: 2000 chars

2. **Control Channel** (`'control'`)
   - Remote control commands
   - Pointer, keyboard, permissions
   - Rate limited (60 msgs / 5 sec)

3. **Image Channel** (`'image'`)
   - Chunked image transfer
   - Max 5MB per image
   - Rate limited (10 images / minute)

### Media Tracks
- **Video track**: Screen sharing
- **Audio track**: System audio capture
- Bidirectional transceivers for screen sharing

## Security Model

### Input Validation
- All incoming messages validated for type and length
- JSON parsing wrapped in try-catch
- Malformed messages discarded silently

### Rate Limiting
- Sliding window algorithm
- Per-channel rate limits
- Warnings on limit exceeded

### Data Channel Isolation
- Unexpected channels immediately closed
- Only predefined channel labels accepted

### No Credential Storage
- API keys stored in memory only (session-scoped)
- No localStorage for sensitive data
- No cookies

## Performance Characteristics

### Loading Performance Targets
- **DOMContentLoaded**: < 2 seconds
- **Fully Loaded**: < 5 seconds
- **First Paint**: < 1 second
- **Time to Interactive**: < 3 seconds

### Runtime Performance
- **Message latency**: Sub-100ms (WebRTC RTT)
- **UI responsiveness**: < 100ms click response
- **Memory usage**: < 100MB heap

### Optimization Strategies
1. **Lazy loading potential**: ES6 modules enable dynamic imports
2. **Code splitting**: Can be added without build step
3. **Resource optimization**: Defer non-critical scripts
4. **Minimal dependencies**: Only React, ReactDOM, and translations

## Testing Strategy

### E2E Tests (Playwright)
- **Loading performance**: Validates load time targets
- **Functionality verification**: Ensures UI elements present
- **Resource monitoring**: Tracks resource load times
- **Memory profiling**: Monitors heap usage
- **Cross-browser**: Chrome, Firefox, Safari

### Future Testing
- Unit tests for pure modules
- Integration tests for managers
- WebRTC connection tests (mocked)

## Migration Path

### Phase 1: Module Extraction ✅ (Current PR)
**Status**: Complete - Modules extracted but not yet integrated

**What's Included:**
- ✅ Extracted `constants.js` - All configuration constants
- ✅ Extracted `helpers.js` - Theme utilities
- ✅ Extracted `soundEffects.js` - Audio features
- ✅ Extracted `contributors.js` - GitHub API integration
- ✅ Extracted `TuxMascot.js` - Mascot React component
- ✅ E2E test infrastructure with Playwright
- ✅ Comprehensive documentation (ARCHITECTURE.md, SECURITY_REVIEW.md, src/README.md)
- ✅ Input validation added to API functions

**What's NOT Included:**
- ❌ Integration with main app.js (remains for Phase 2)
- ❌ Modular version of the app (incomplete, removed)
- ❌ Any changes to production code (zero breaking changes)

**Purpose**: Create foundation for future refactoring with well-documented, tested modules ready for integration.

### Phase 2: Manager Extraction ✅ (Complete)
**Status**: Complete - All 6 managers extracted with full documentation

**What's Included:**
- ✅ Extracted WebRTC manager - Connection lifecycle and signaling
- ✅ Extracted chat manager - Messaging with rate limiting
- ✅ Extracted screen share manager - Screen capture and streaming
- ✅ Extracted remote control manager - Remote control with security
- ✅ Extracted image transfer manager - Chunked image transfer
- ✅ Extracted AI manager - OpenAI API integration
- ✅ Comprehensive JSDoc documentation for all managers
- ✅ Complete API documentation in src/README.md
- ✅ All security measures preserved
- ✅ Factory pattern for React state integration
- ✅ Backward compatibility maintained (no changes to production app.js)

**What's NOT Included:**
- ❌ Integration with main app.js (remains for Phase 3)
- ❌ Any changes to production code (zero breaking changes)

### Phase 3: Component Extraction (Future PR)
- Extract React components
- Create component library
- Update main app to use components
- **Gradual migration**

### Phase 4: Complete Migration (Future PR)
- Remove monolithic app.js
- Switch to modular entry point
- Add dynamic imports
- Optimize bundle loading
- **Full cutover with rollback plan**

## Build and Deployment

### Development
```bash
# Install dependencies
npm install

# Run tests
npm test

# Run tests in headed mode
npm run test:headed

# Run loading performance tests only
npm run test:loading
```

### Deployment
- Static files deployed to GitHub Pages
- No build step required
- ES6 modules work natively in modern browsers
- Fallback to original app.js if needed

## Browser Compatibility

### Required Features
- ES6 Modules (`<script type="module">`)
- WebRTC (RTCPeerConnection, RTCDataChannel)
- React 18
- Modern JavaScript (async/await, optional chaining, etc.)

### Supported Browsers
- Chrome/Edge 90+
- Firefox 89+
- Safari 15+

## Contributing

### Adding a New Module
1. Create file in appropriate `src/` subdirectory
2. Add full JSDoc documentation
3. Export functions/classes with clear API
4. Update `src/README.md` with API docs
5. Add tests
6. Import and use in app

### Code Style
- JSDoc comments for all exports
- ESLint configuration (to be added)
- Prettier formatting (to be added)
- Descriptive variable names
- Pure functions where possible

## Future Enhancements

### Performance
- [ ] Dynamic imports for lazy loading
- [ ] Service worker for offline support
- [ ] WebAssembly for intensive computations

### Architecture
- [ ] State management library (if needed)
- [ ] Component library
- [ ] Module bundling (optional)
- [ ] TypeScript migration (optional)

### Features
- [ ] File transfer beyond images
- [ ] Voice/video chat
- [ ] Encrypted messaging
- [ ] Multi-peer support (mesh network)

## References

- [WebRTC Specification](https://www.w3.org/TR/webrtc/)
- [ES6 Modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)
- [React Documentation](https://react.dev/)
- [Playwright Testing](https://playwright.dev/)

## License

Same as parent project.
