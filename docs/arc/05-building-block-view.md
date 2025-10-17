# 5. Building Block View

## 5.1 Whitebox Overall System

### Overview

```
┌──────────────────────────────────────────────────────────────────────┐
│                          TheCommunity                                 │
│                                                                       │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │                        index.html                              │  │
│  │  (Entry Point - loads React and app.js)                       │  │
│  └────────────────────────────┬──────────────────────────────────┘  │
│                               │                                      │
│  ┌────────────────────────────▼──────────────────────────────────┐  │
│  │                         app.js                                 │  │
│  │          (Main Application - React Component)                  │  │
│  │                                                                 │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌─────────────────────┐ │  │
│  │  │  WebRTC      │  │   Chat       │  │  Screen Share       │ │  │
│  │  │  Logic       │  │   Logic      │  │  Logic              │ │  │
│  │  └──────────────┘  └──────────────┘  └─────────────────────┘ │  │
│  │                                                                 │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌─────────────────────┐ │  │
│  │  │  Remote      │  │   Image      │  │   AI                │ │  │
│  │  │  Control     │  │   Transfer   │  │   Integration       │ │  │
│  │  └──────────────┘  └──────────────┘  └─────────────────────┘ │  │
│  └─────────────────────────────────────────────────────────────────┘  │
│                               │                                      │
│  ┌────────────────────────────▼──────────────────────────────────┐  │
│  │                      src/ (Modules)                            │  │
│  │                                                                 │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌───────────────────────┐ │  │
│  │  │ core/       │  │ utils/      │  │ components/           │ │  │
│  │  │ constants.js│  │ helpers.js  │  │ TuxMascot.js          │ │  │
│  │  │             │  │ soundEffects│  │                       │ │  │
│  │  │             │  │ contributors│  │                       │ │  │
│  │  └─────────────┘  └─────────────┘  └───────────────────────┘ │  │
│  └─────────────────────────────────────────────────────────────────┘  │
│                               │                                      │
│  ┌────────────────────────────▼──────────────────────────────────┐  │
│  │                   translations.js                              │  │
│  │             (Internationalization - German dialects)           │  │
│  └─────────────────────────────────────────────────────────────────┘  │
│                                                                       │
└──────────────────────────────────────────────────────────────────────┘
```

### Contained Building Blocks

| Block | Responsibility | Source File |
|-------|----------------|-------------|
| **index.html** | Entry point, loads dependencies | `index.html` |
| **app.js** | Main application logic, React component | `app.js` |
| **src/core/** | Configuration constants | `src/core/constants.js` |
| **src/utils/** | Utility functions | `src/utils/helpers.js`<br>`src/utils/soundEffects.js`<br>`src/utils/contributors.js` |
| **src/components/** | Reusable React components | `src/components/TuxMascot.js` |
| **translations.js** | Multi-language support | `translations.js` |
| **styles.css** | Application styling | `styles.css` |

### Important Interfaces

| Interface | Description |
|-----------|-------------|
| **Browser WebRTC APIs** | RTCPeerConnection, RTCDataChannel for P2P communication |
| **React Hooks API** | State management within app.js |
| **ES6 Module Imports** | app.js imports from src/ modules |
| **GitHub REST API** | Fetch contributor data (optional) |
| **OpenAI REST API** | AI message rewriting (optional) |

## 5.2 Level 1: Main Application (app.js)

### Whitebox app.js

The main application file contains the entire React application in a single component (current production version).

```
┌─────────────────────────────────────────────────────────────────┐
│                             app.js                               │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                   React State Management                    │ │
│  │  (useState, useRef, useCallback, useEffect)                │ │
│  └────────────────────────────────────────────────────────────┘ │
│                              │                                   │
│  ┌───────────┬───────────┬───┴─────────┬──────────┬───────────┐ │
│  │           │           │             │          │           │ │
│  │  WebRTC   │   Chat    │   Screen    │  Remote  │   Image   │ │
│  │  Manager  │  Manager  │   Share     │ Control  │ Transfer  │ │
│  │  Functions│ Functions │  Functions  │Functions │ Functions │ │
│  │           │           │             │          │           │ │
│  └───────────┴───────────┴─────────────┴──────────┴───────────┘ │
│                              │                                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                   React Component Tree                      │ │
│  │                                                             │ │
│  │  • SignalingPanel (offer/answer exchange)                  │ │
│  │  • ChatPanel (message display and input)                   │ │
│  │  • ScreenSharePanel (sharing controls)                     │ │
│  │  • AboutDialog (info and contributors)                     │ │
│  │  • APIKeyModal (OpenAI key management)                     │ │
│  │  • TuxMascot (animated penguin)                            │ │
│  │  • StatusIndicators (connection state)                     │ │
│  │  • ThemeToggle, LanguageSelector                           │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

### Contained Building Blocks

#### WebRTC Manager Functions

**Location**: `app.js` (lines ~150-450)

**Responsibilities**:
- Create RTCPeerConnection with configuration
- Generate SDP offers and answers
- Handle ICE candidate collection
- Apply remote descriptions
- Manage connection state
- Create and handle data channels
- Cleanup on disconnect

**Key Functions**:
- `createOffer()` - Generate offer SDP
- `createAnswer()` - Generate answer SDP
- `applyRemote()` - Apply remote SDP
- `handleDataChannel()` - Process incoming data channels
- `cleanup()` - Close connections and clean up resources

#### Chat Manager Functions

**Location**: `app.js` (lines ~500-700)

**Responsibilities**:
- Send and receive chat messages
- Validate message length and format
- Enforce rate limiting (30 messages per 5 seconds)
- Maintain message history
- Handle message display formatting

**Key Functions**:
- `sendMessage()` - Send validated message via DataChannel
- `receiveMessage()` - Process incoming messages
- `checkChatRateLimit()` - Enforce sending limits
- `addMessageToHistory()` - Update UI with new messages

#### Screen Share Functions

**Location**: `app.js` (lines ~750-950)

**Responsibilities**:
- Capture screen via getDisplayMedia()
- Add video track to peer connection
- Handle track negotiation
- Stop sharing and remove tracks
- Coordinate sharing state with peer

**Key Functions**:
- `startScreenShare()` - Initiate screen capture
- `stopScreenShare()` - End sharing and cleanup
- `handleRemoteTrack()` - Display peer's screen

#### Remote Control Functions

**Location**: `app.js` (lines ~1000-1300)

**Responsibilities**:
- Manage permission system (explicit opt-in/out)
- Send pointer coordinates and click events
- Send keyboard events
- Enforce rate limiting (60 messages per 5 seconds)
- Execute remote commands locally

**Key Functions**:
- `requestRemoteControl()` - Ask peer for permission
- `grantRemoteControl()` - Allow peer to control
- `revokeRemoteControl()` - Disable remote control
- `sendControlMessage()` - Send pointer/keyboard events
- `executeControlCommand()` - Execute incoming commands

#### Image Transfer Functions

**Location**: `app.js` (lines ~1350-1550)

**Responsibilities**:
- Chunk images into transferable pieces
- Send chunks via image data channel
- Reassemble chunks into image
- Validate image size (max 5MB)
- Display transferred images in chat

**Key Functions**:
- `sendImage()` - Chunk and send image
- `receiveImageChunk()` - Reassemble chunks
- `validateImageSize()` - Check size limits

#### AI Integration Functions

**Location**: `app.js` (lines ~1600-1750)

**Responsibilities**:
- Manage OpenAI API key (in memory only)
- Send draft to OpenAI for rewriting
- Display rewritten suggestion
- Handle API errors gracefully

**Key Functions**:
- `updateAPIKey()` - Store key in state
- `rewriteWithAI()` - Call OpenAI API
- `handleAIResponse()` - Update draft with suggestion

### Important Interfaces

#### Internal Interfaces

| Interface | Type | Description |
|-----------|------|-------------|
| React State | Hook | `useState()` for UI state (messages, connection status, theme) |
| Refs | Hook | `useRef()` for mutable objects (RTCPeerConnection, timers) |
| Callbacks | Hook | `useCallback()` for optimized event handlers |
| Effects | Hook | `useEffect()` for side effects (connection setup, cleanup) |

#### External Interfaces

| Interface | Type | Description |
|-----------|------|-------------|
| WebRTC APIs | Browser API | RTCPeerConnection, RTCDataChannel, MediaStream |
| Fetch API | Browser API | HTTP requests to GitHub and OpenAI |
| localStorage | Browser API | Theme and language persistence |
| DOM APIs | Browser API | React rendering target |

## 5.3 Level 2: Extracted Modules (src/)

### Whitebox src/core/

```
┌────────────────────────────────────────────────┐
│            src/core/constants.js                │
│                                                 │
│  ┌───────────────────────────────────────────┐ │
│  │       Configuration Constants             │ │
│  │                                           │ │
│  │  • MAX_MESSAGE_LENGTH = 2000             │ │
│  │  • RATE_LIMIT_WINDOW_MS = 5000           │ │
│  │  • MAX_MESSAGES = 30                     │ │
│  │  • MAX_IMAGE_SIZE = 5 * 1024 * 1024      │ │
│  │  • THEME_OPTIONS = {...}                 │ │
│  │  • MESSAGE_TYPES = {...}                 │ │
│  └───────────────────────────────────────────┘ │
│                                                 │
│  ┌───────────────────────────────────────────┐ │
│  │       Helper Functions                    │ │
│  │                                           │ │
│  │  • getNextThemeValue(currentTheme)       │ │
│  └───────────────────────────────────────────┘ │
└────────────────────────────────────────────────┘
```

**Responsibilities**:
- Single source of truth for configuration
- Provide typed constants (avoid magic numbers)
- Theme cycling logic

**Usage**: Imported by app.js and tests

**API Reference**: See `src/README.md`

### Whitebox src/utils/

```
┌─────────────────────────────────────────────────────────────────┐
│                      src/utils/                                  │
│                                                                  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                  helpers.js                                │  │
│  │                                                            │  │
│  │  • resolveInitialTheme()                                  │  │
│  │    → Reads localStorage and system preferences           │  │
│  │    → Returns { theme, isStored }                          │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │              soundEffects.js                              │  │
│  │                                                            │  │
│  │  • initBackgroundSound()                                  │  │
│  │    → Plays "oiia oiia" soundtrack on first interaction   │  │
│  │  • initKonamiCode()                                       │  │
│  │    → Enables Nyan Cat easter egg                          │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │             contributors.js                               │  │
│  │                                                            │  │
│  │  • fetchContributors(repo)                                │  │
│  │    → Fetches GitHub issues                                │  │
│  │    → Aggregates contributors by issue count               │  │
│  │  • fetchStatistics(repo)                                  │  │
│  │    → Fetches issues labeled 'claude'                      │  │
│  │    → Returns AI statistics                                │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

**Responsibilities**:
- **helpers.js**: Theme resolution with localStorage and system preferences
- **soundEffects.js**: Audio features and easter eggs
- **contributors.js**: GitHub API integration for UI

**Dependencies**:
- helpers.js: localStorage, matchMedia API
- soundEffects.js: Audio API, DOM
- contributors.js: Fetch API, GitHub REST API

**Usage**: Imported by app.js for specific features

### Whitebox src/components/

```
┌────────────────────────────────────────────────┐
│         src/components/TuxMascot.js             │
│                                                 │
│  ┌───────────────────────────────────────────┐ │
│  │        TuxMascot Component                │ │
│  │                                           │ │
│  │  Props: { t }                            │ │
│  │    t = translation object                │ │
│  │                                           │ │
│  │  Renders: SVG of angry penguin           │ │
│  │           with ARIA label                │ │
│  └───────────────────────────────────────────┘ │
└────────────────────────────────────────────────┘
```

**Responsibilities**:
- Pure presentational component
- No business logic
- Accessibility via ARIA

**Dependencies**: React (prop types)

**Usage**: Rendered in About dialog

## 5.4 Level 2: Translations

### Whitebox translations.js

```
┌────────────────────────────────────────────────┐
│              translations.js                    │
│                                                 │
│  ┌───────────────────────────────────────────┐ │
│  │      Translation Object                   │ │
│  │                                           │ │
│  │  {                                        │ │
│  │    'de': { ...German translations },      │ │
│  │    'de-AT': { ...Austrian German },       │ │
│  │    'de-CH': { ...Swiss German },          │ │
│  │    'de-BY': { ...Bavarian },              │ │
│  │    ...                                    │ │
│  │  }                                        │ │
│  └───────────────────────────────────────────┘ │
│                                                 │
│  ┌───────────────────────────────────────────┐ │
│  │      Translation Keys                     │ │
│  │                                           │ │
│  │  • connection.* (status messages)         │ │
│  │  • chat.* (UI labels)                     │ │
│  │  • signaling.* (WebRTC UI)                │ │
│  │  • about.* (dialog content)               │ │
│  │  • errors.* (error messages)              │ │
│  └───────────────────────────────────────────┘ │
└────────────────────────────────────────────────┘
```

**Responsibilities**:
- Provide translations for all UI strings
- Support multiple German dialects
- Enable language switching

**Structure**: Nested object with language codes as keys

**Usage**: Imported by app.js, accessed via `t.path.to.key`

## 5.5 Migration Architecture (Phase 1 Complete)

### Current Structure

```
Production (Active):
  index.html
    → React CDN
    → app.js (monolithic, 2810 lines)
    → translations.js

Extracted Modules (Ready, Not Yet Integrated):
  src/
    core/constants.js
    utils/helpers.js
    utils/soundEffects.js
    utils/contributors.js
    components/TuxMascot.js
```

### Future Structure (Phase 2+)

```
Future Production:
  index.html
    → React CDN
    → src/app.js (modular entry point)
      → src/managers/WebRTCManager.js
      → src/managers/ChatManager.js
      → src/managers/ScreenShareManager.js
      → src/managers/RemoteControlManager.js
      → src/managers/ImageTransferManager.js
      → src/managers/AIManager.js
      → src/components/SignalingPanel.js
      → src/components/ChatPanel.js
      → src/components/AboutDialog.js
      → src/core/constants.js
      → src/utils/helpers.js
      → translations.js
```

**Migration Path**: See `ARCHITECTURE.md` for detailed phase plan

## 5.6 Directory Structure

```
TheCommunity/
├── index.html                    # Production entry point
├── app.js                        # Main application (monolithic, active)
├── translations.js               # i18n support
├── styles.css                    # All styling
│
├── src/                          # Extracted modules (Phase 1 complete)
│   ├── README.md                 # Module documentation
│   ├── core/
│   │   └── constants.js          # Configuration constants
│   ├── utils/
│   │   ├── helpers.js            # Theme utilities
│   │   ├── soundEffects.js       # Audio features
│   │   └── contributors.js       # GitHub API
│   └── components/
│       └── TuxMascot.js          # Mascot component
│
├── docs/                         # Architecture documentation
│   └── arc/                      # arc42 template
│       ├── README.md
│       ├── 01-introduction-and-goals.md
│       ├── 02-architecture-constraints.md
│       └── ...
│
├── tests/                        # E2E tests
│   ├── loading-performance.spec.js
│   └── utils.spec.js
│
├── assets/                       # Static assets
│   ├── oiia.mp3                  # Background sound
│   └── nyan.mp3                  # Konami easter egg
│
├── ARCHITECTURE.md               # Technical architecture
├── SECURITY_REVIEW.md            # Security analysis
├── CLAUDE.md                     # Development guidelines
├── README.md                     # User documentation
├── package.json                  # Dependencies
└── playwright.config.js          # Test configuration
```

## 5.7 Build and Deployment View

```
┌─────────────────────────────────────────────────────────┐
│               GitHub Repository                          │
│                                                          │
│  main branch                                            │
│    │                                                     │
│    │ PR merged                                           │
│    ▼                                                     │
│  ┌────────────────────────────────────────────────────┐ │
│  │         GitHub Actions Workflow                    │ │
│  │                                                    │ │
│  │  1. Checkout code                                 │ │
│  │  2. Run tests (npm test)                          │ │
│  │  3. Deploy to gh-pages branch                     │ │
│  │     • Copy index.html, app.js, etc.               │ │
│  │     • No build step required                      │ │
│  └────────────────────────────────────────────────────┘ │
│                         │                                │
└─────────────────────────┼────────────────────────────────┘
                          │
                          ▼
         ┌────────────────────────────────────┐
         │       GitHub Pages                  │
         │  (Static File Server + CDN)         │
         │                                     │
         │  https://themorpheus407.github.io/  │
         │  TheCommunity/                      │
         └────────────────────────────────────┘
                          │
                          │ HTTPS
                          ▼
              ┌──────────────────────┐
              │   User's Browser     │
              └──────────────────────┘
```

**Key Points**:
- No build step - files deployed as-is
- Tests run in CI before deployment
- Automatic deployment on merge to main
- HTTPS enforced by GitHub Pages
- Global CDN for fast delivery

## 5.8 Summary

The building block view shows:

1. **Current Production**: Monolithic app.js with all logic (2810 lines)
2. **Phase 1 Modules**: Extracted but not yet integrated (constants, utils, components)
3. **Future Structure**: Fully modular with managers and components separated
4. **Zero Build Step**: Files deployed as-is to GitHub Pages
5. **Clear Separation**: UI (React) → Logic (managers) → Utils → Browser APIs

The architecture supports progressive refactoring without breaking production.
