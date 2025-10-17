# 8. Cross-cutting Concepts

This section describes overall, application-wide concepts and patterns that affect multiple parts of the system.

## 8.1 Security Concepts

### Principle: Defense in Depth

Security is implemented at multiple layers:

#### Layer 1: Input Validation

**All external input is validated before processing**

```javascript
// Example: Chat message validation
const validateMessage = (message) => {
  if (!message || typeof message !== 'string') {
    return false;
  }
  if (message.length > MAX_MESSAGE_LENGTH) {
    return false;
  }
  return true;
};
```

**Applied to**:
- Chat messages (length, type)
- WebRTC signals (JSON structure)
- Data channel labels (whitelist)
- Control commands (permission check)
- Image data (size limits)

#### Layer 2: Rate Limiting

**Sliding window algorithm prevents flooding**

```javascript
const checkRateLimit = (timestamps, maxMessages, windowMs) => {
  const now = Date.now();
  const recentTimestamps = timestamps.filter(t => now - t < windowMs);

  if (recentTimestamps.length >= maxMessages) {
    return false; // Limit exceeded
  }

  timestamps.push(now);
  return true; // OK to proceed
};
```

**Rate Limits**:
- Chat: 30 messages per 5 seconds
- Control: 60 messages per 5 seconds
- Images: 10 images per minute

**Enforcement**: Client-side only (no server to enforce)

#### Layer 3: Channel Isolation

**Unexpected data channels are immediately closed**

```javascript
pc.ondatachannel = (event) => {
  const allowedChannels = ['chat', 'control', 'image'];

  if (!allowedChannels.includes(event.channel.label)) {
    console.warn('Unexpected channel:', event.channel.label);
    event.channel.close();
    return;
  }

  // Process expected channel
};
```

**Purpose**: Prevent channel confusion attacks

#### Layer 4: No Credential Storage

**Sensitive data never persisted**

| Data Type | Storage | Duration |
|-----------|---------|----------|
| OpenAI API Key | Memory (React state) | Session-scoped |
| Theme preference | localStorage | Persistent |
| Language preference | localStorage | Persistent |
| Chat messages | Memory (React state) | Session-scoped |
| WebRTC signals | Never stored | Transient |

**Rule**: Never use localStorage for credentials or secrets

### Principle: Transparency

**Users must understand privacy implications**

**Warning Messages**:
- "WebRTC signals contain your network addresses"
- "Your IP is visible to peers"
- "OpenAI key sent directly to api.openai.com"

**No Hidden Data Collection**:
- No analytics
- No tracking pixels
- No fingerprinting
- No cookies

### Principle: Fail-Safe Defaults

**When in doubt, deny**

- Unexpected channel? Close it
- Invalid message? Discard it
- Remote control not granted? Ignore commands
- Rate limit exceeded? Block message

## 8.2 Error Handling

### Principle: Graceful Degradation

**Errors should not crash the application**

#### Pattern 1: Try-Catch Wrappers

```javascript
// JSON parsing (malicious peer could send invalid JSON)
try {
  const data = JSON.parse(event.data);
  processMessage(data);
} catch (err) {
  console.warn('Invalid JSON received:', err);
  // Discard and continue
}
```

#### Pattern 2: Fallback Values

```javascript
// Theme resolution with fallback
const resolveTheme = () => {
  try {
    const stored = localStorage.getItem('theme');
    if (stored && THEME_OPTIONS[stored]) {
      return stored;
    }
  } catch (err) {
    console.warn('localStorage unavailable');
  }

  // Fallback to system preference
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  return prefersDark ? 'dark' : 'light';
};
```

#### Pattern 3: User-Friendly Messages

**Don't expose technical details to users**

❌ Bad:
```javascript
alert('TypeError: Cannot read property send of undefined');
```

✅ Good:
```javascript
addSystemMessage('Connection not established. Please create or accept an offer first.');
```

### Error Logging Strategy

**Development**:
- `console.log()` for debugging
- `console.error()` for exceptions

**Production**:
- `console.warn()` for validation failures (silent to user)
- `console.error()` for exceptions (silent to user)
- System messages for user-actionable errors

**No Remote Logging**:
- Respects user privacy
- No third-party error tracking services

## 8.3 Internationalization (i18n)

### Translation System

**File**: `translations.js`

**Structure**:
```javascript
const translations = {
  'de': {
    connection: {
      status: 'Verbindung: {status}',
      connected: 'Verbunden',
      disconnected: 'Getrennt'
    },
    chat: {
      sendButton: 'Senden',
      placeholder: 'Nachricht eingeben...'
    }
  },
  'de-AT': { /* Austrian German */ },
  'de-CH': { /* Swiss German */ },
  // ...
};
```

**Usage in Code**:
```javascript
const t = translations[currentLanguage];
<button>{t.chat.sendButton}</button>
```

**Supported Languages**:
- Multiple German dialects (de, de-AT, de-CH, de-BY, etc.)
- Easy to add new languages (contribute to translations.js)

**Language Selection**:
1. User preference (dropdown selection)
2. Saved in localStorage
3. Default: Browser language (`navigator.language`)

### Design Principles

- **Complete Coverage**: All UI strings in translations.js
- **No Hardcoded Text**: Avoid literals in JSX
- **Nested Structure**: Organize by feature area
- **Fallback Chain**: Language → Dialect → Default

## 8.4 State Management

### React Hooks Strategy

**Application-wide state managed with React hooks**

#### useState: UI State

```javascript
// Connection state
const [connectionStatus, setConnectionStatus] = useState('disconnected');

// Message history
const [messages, setMessages] = useState([]);

// Theme
const [theme, setTheme] = useState('dark');
```

**When to use**: UI state that triggers re-renders

#### useRef: Mutable References

```javascript
// WebRTC objects (don't trigger re-renders)
const pc = useRef(null);
const chatChannel = useRef(null);

// Rate limiting timestamps
const chatTimestamps = useRef([]);

// Timers
const reconnectTimer = useRef(null);
```

**When to use**: Mutable values that don't need to trigger re-renders

#### useCallback: Optimized Callbacks

```javascript
const sendMessage = useCallback(() => {
  // Function body
}, [dependencies]);
```

**When to use**: Functions passed to child components or used in effects

#### useEffect: Side Effects

```javascript
useEffect(() => {
  // Setup WebRTC connection
  setupConnection();

  // Cleanup
  return () => {
    cleanupConnection();
  };
}, [dependencies]);
```

**When to use**: Side effects, subscriptions, cleanup

### No Global State Library

**Rationale**: Application complexity doesn't justify Redux/MobX

**Current Approach**: Lift state up to main App component

**Future**: If complexity grows, consider lightweight state management

## 8.5 Validation and Data Integrity

### Input Validation Principles

1. **Validate at Boundaries**: Check all external input
2. **Whitelist, Don't Blacklist**: Define what's allowed, reject everything else
3. **Validate Type and Structure**: Don't assume JSON structure
4. **Enforce Limits**: Message length, image size, rate limits

### Validation Hierarchy

```
┌─────────────────────────────────────────┐
│         User Input (Browser)            │
└──────────────────┬──────────────────────┘
                   │
                   │ Local validation (client-side)
                   ▼
┌─────────────────────────────────────────┐
│    Validated Data (sent via WebRTC)    │
└──────────────────┬──────────────────────┘
                   │
                   │ Network transmission
                   ▼
┌─────────────────────────────────────────┐
│   Received Data (Peer Browser)          │
└──────────────────┬──────────────────────┘
                   │
                   │ Validation again (never trust peer)
                   ▼
┌─────────────────────────────────────────┐
│     Processed Data (display to user)    │
└─────────────────────────────────────────┘
```

**Defense in Depth**: Validate both before sending AND after receiving

### Data Sanitization

**HTML Injection Prevention**:
- React escapes text by default
- No `dangerouslySetInnerHTML` used
- No `eval()` or `Function()` constructors

**XSS Protection**:
- All user content rendered as text nodes
- No dynamic script tag insertion
- CSP would block inline scripts (if we could set headers)

## 8.6 Performance Optimization

### Loading Performance

**Target**: DOMContentLoaded < 2 seconds

**Strategies**:
1. **Minimal Dependencies**: Only React, ReactDOM, translations
2. **CDN for Libraries**: Fast delivery from unpkg.com
3. **Defer Non-Critical**: Audio files loaded on first interaction
4. **Lightweight Assets**: CSS and JS minified

**Measured**: E2E tests verify performance targets

### Runtime Performance

**Strategies**:
1. **useCallback**: Prevent unnecessary re-renders
2. **Conditional Rendering**: Only render visible components
3. **Lazy Loading**: Audio files loaded on demand
4. **Efficient Data Structures**: Arrays for message history

**Memory Management**:
- Cleanup connections on unmount (`useEffect` return)
- Close data channels when done
- Stop media tracks when sharing ends

### WebRTC Performance

**Low Latency**:
- Direct P2P connection (no relay)
- SCTP over DTLS (built into WebRTC)
- Sub-100ms message latency (typical)

**Bandwidth**:
- Text messages: < 1 KB each
- Screen sharing: Variable (depends on content)
- No server bandwidth consumed

## 8.7 Accessibility

### ARIA Labels

**Screen reader support**:
```html
<button aria-label={t.chat.sendMessage}>
  <SendIcon />
</button>

<input
  aria-label={t.chat.messageInput}
  placeholder={t.chat.placeholder}
/>
```

### Semantic HTML

**Proper element usage**:
- `<button>` for actions (not `<div onclick>`)
- `<input>` for text input
- `<label>` for form fields
- `<nav>` for navigation
- `<main>` for main content

### Keyboard Navigation

**All features accessible via keyboard**:
- Tab through interactive elements
- Enter to submit forms
- Escape to close modals

### Color Contrast

**WCAG AA compliance**:
- Light theme: Dark text on light background
- Dark theme: Light text on dark background
- Sufficient contrast ratios (4.5:1 for normal text)

## 8.8 Testing Strategy

### E2E Testing with Playwright

**Test Coverage**:
- Loading performance
- UI element presence
- Basic interactions
- Resource loading

**Run Frequency**:
- Every PR (before merge)
- Before deployment
- Manual (npm test)

### Manual Testing

**Test Scenarios**:
- Connection establishment
- Message sending
- Screen sharing
- Remote control
- Error handling

**Browsers**:
- Chrome (primary)
- Firefox
- Safari
- Edge

### No Unit Tests (Yet)

**Current**: Monolithic app.js makes unit testing difficult

**Future**: Extracted modules enable unit testing
- Test pure functions (helpers, constants)
- Mock WebRTC APIs
- Test validation logic

## 8.9 Documentation Strategy

### Multi-Level Documentation

1. **User Docs** (README.md)
   - Getting started
   - How to use
   - Troubleshooting

2. **Architecture Docs** (docs/arc/)
   - arc42 structure
   - High-level design
   - Decision rationale

3. **Technical Docs** (ARCHITECTURE.md)
   - Implementation details
   - Migration roadmap
   - Module organization

4. **API Docs** (src/README.md)
   - Module APIs
   - Usage examples
   - Code references

5. **Security Docs** (SECURITY_REVIEW.md)
   - Security analysis
   - Threat model
   - Recommendations

6. **Code Comments** (JSDoc)
   - Function documentation
   - Parameter types
   - Return values

### Documentation Principles

- **Keep Up-to-Date**: Update docs with code changes
- **Multiple Audiences**: Users, contributors, maintainers
- **Searchable**: Markdown, browseable on GitHub
- **Examples**: Include code snippets
- **Cross-Reference**: Link between documents

## 8.10 Development Workflow

### Contribution Process

1. **Create Issue**: Describe feature or bug
2. **Discussion**: Community discusses approach
3. **Assignment**: Issue assigned (human or Claude AI)
4. **Implementation**: Feature developed in branch
5. **Testing**: E2E tests run
6. **PR**: Pull request created with description
7. **Review**: Maintainer reviews code
8. **Merge**: PR merged to main
9. **Deploy**: GitHub Actions deploys automatically

### Branch Strategy

- **main**: Production branch (protected)
- **claude/issue-X-YYYYMMDD-HHMM**: Feature branches (AI-generated)
- **feature/name**: Feature branches (human contributors)

### Code Review Checklist

- ✅ Follows CLAUDE.md guidelines
- ✅ Clean code (no code smells)
- ✅ Tests pass
- ✅ Documentation updated
- ✅ Security review done
- ✅ No breaking changes

## 8.11 Dependency Management

### Minimal Dependencies

**Runtime Dependencies**:
- React 18 (CDN)
- ReactDOM 18 (CDN)

**Development Dependencies**:
- @playwright/test (E2E testing)

**No Other Dependencies**:
- No state management library
- No UI component library
- No utility library (lodash, etc.)
- No CSS framework

**Rationale**: Keep it simple, reduce attack surface, lower maintenance

### Dependency Updates

**React Updates**:
- Pin to major version (18)
- Test before updating
- Update CDN URLs manually

**Playwright Updates**:
- Run `npm update` periodically
- Check for breaking changes
- Update workflow if needed

## 8.12 Monitoring and Observability

### Client-Side Logging

**Console Levels**:
- `console.log()`: Debug info (development)
- `console.warn()`: Validation failures (production)
- `console.error()`: Exceptions (production)

**No Telemetry**:
- No remote logging
- No analytics
- No error tracking service
- No performance monitoring service

**Rationale**: Privacy-first, no backend, no third-party tracking

### User Feedback

**Issue Reporting**:
- Users report bugs via GitHub Issues
- Provide browser, OS, steps to reproduce
- Maintainer triages and fixes

**No Crash Reports**:
- No automatic crash reporting
- Users describe issues manually
- Privacy preserved

## 8.13 Configuration Management

### Configuration Location

**Hard-Coded** (`src/core/constants.js`):
- Rate limits
- Message size limits
- Channel labels
- Theme options

**User-Configurable** (localStorage):
- Theme preference
- Language preference

**Not Configurable**:
- WebRTC configuration (iceServers: [])
- API endpoints (GitHub, OpenAI)

### No Environment Variables

**Reason**: Static site, no build step, no server

**Alternative**: Hard-coded constants with code comments

## 8.14 Summary

**Key Cross-Cutting Concepts**:

1. **Security**: Defense in depth (validation, rate limiting, isolation, no storage)
2. **Error Handling**: Graceful degradation, user-friendly messages
3. **i18n**: Translations in separate file, easy to extend
4. **State Management**: React hooks (useState, useRef, useCallback, useEffect)
5. **Validation**: Input validation at boundaries, never trust external data
6. **Performance**: Minimize dependencies, lazy loading, efficient rendering
7. **Accessibility**: ARIA labels, semantic HTML, keyboard navigation
8. **Testing**: E2E tests before deployment
9. **Documentation**: Multi-level docs for different audiences
10. **Development**: Issue-driven, PR-based, automated deployment

These concepts apply across all features and components, ensuring consistency and quality throughout the application.
