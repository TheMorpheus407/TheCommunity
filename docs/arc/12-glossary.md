# 12. Glossary

Important domain and technical terms used in TheCommunity architecture documentation.

## A

### API Key
A secret token used to authenticate with external services. In TheCommunity, refers to the user-provided OpenAI API key stored in memory only.

### arc42
A template for software architecture documentation and communication. Used to structure this documentation.

### ARIA (Accessible Rich Internet Applications)
Web accessibility standard providing attributes to make web content more accessible to people with disabilities.

## B

### Browser API
JavaScript APIs provided by web browsers, such as WebRTC, Fetch, localStorage, Media Capture.

### Building Block
A module, component, or subsystem that is part of the overall system architecture.

## C

### CDN (Content Delivery Network)
A geographically distributed network of servers that deliver web content. TheCommunity uses unpkg.com for React and GitHub's CDN for static files.

### Channel Isolation
Security pattern where unexpected WebRTC data channels are immediately closed to prevent attacks.

### Client-Side
Code and logic that runs in the user's browser (as opposed to server-side). TheCommunity is entirely client-side.

### Co-Authored-By
Git commit trailer indicating multiple authors. Used when Claude AI contributes to code.

### Cross-Cutting Concept
A concept or pattern that affects multiple parts of the system (e.g., security, error handling).

## D

### Data Channel
A WebRTC RTCDataChannel that enables bidirectional data transfer between peers. Used for chat, control messages, and image transfer.

### DTLS (Datagram Transport Layer Security)
Encryption protocol used by WebRTC to secure data channel communication.

### Defense in Depth
Security strategy using multiple layers of protection (validation, rate limiting, isolation, etc.).

## E

### E2E (End-to-End) Testing
Testing methodology that validates entire user workflows from start to finish. TheCommunity uses Playwright for E2E tests.

### ES6 Modules
JavaScript module system using `import` and `export` statements. Supported natively in modern browsers.

### Easter Egg
Hidden feature or joke in software. TheCommunity has Konami code and background soundtrack easter eggs.

## G

### getDisplayMedia()
Browser API for capturing screen content for sharing. Used in TheCommunity's screen sharing feature.

### GitHub Actions
CI/CD platform integrated with GitHub. Used to test and deploy TheCommunity automatically.

### GitHub Pages
Static site hosting service provided by GitHub. Hosts TheCommunity at https://themorpheus407.github.io/TheCommunity/.

### Graceful Degradation
Design approach where system continues functioning when components fail or features are unavailable.

## H

### Hooks (React)
React API for using state and lifecycle features in functional components (useState, useRef, useCallback, useEffect).

## I

### ICE (Interactive Connectivity Establishment)
Protocol for discovering and establishing network paths between WebRTC peers. Finds best route through NATs and firewalls.

### ICE Candidate
Network address and port combination discovered by ICE process. Included in WebRTC signaling.

### i18n (Internationalization)
Process of designing software to support multiple languages and regions. TheCommunity supports multiple German dialects.

## J

### JSDoc
Documentation format using special comments in JavaScript code to describe functions, parameters, and types.

### JSON (JavaScript Object Notation)
Text format for data exchange. Used for WebRTC signaling and message payloads.

## L

### localStorage
Browser API for storing key-value pairs persistently. TheCommunity uses it only for theme and language preferences.

## M

### Manual Signaling
Process where users manually exchange WebRTC signals (offers/answers) via external channels instead of using a signaling server.

### MediaStream
Browser API representing a stream of media content (video and/or audio). Used for screen sharing.

### Mesh Network
Network topology where each node connects to multiple other nodes. TheCommunity currently doesn't support mesh (only 1-to-1).

### Monolithic
Software architecture where all code is in a single large file or module. TheCommunity's app.js is currently monolithic (being refactored).

## N

### NAT (Network Address Translation)
Technique that modifies network address information. Can make WebRTC connections difficult. ICE helps traverse NATs.

### NFR (Non-Functional Requirement)
Requirement defining system quality attributes (performance, security, usability) rather than specific behaviors.

## O

### Offer (WebRTC)
SDP description created by the connection initiator. Contains media capabilities and network information.

### Answer (WebRTC)
SDP response created by the connection responder in response to an offer.

## P

### P2P (Peer-to-Peer)
Network architecture where participants communicate directly without intermediary servers.

### Playwright
Browser automation framework used for E2E testing. Supports Chrome, Firefox, and Safari.

### Progressive Refactoring
Strategy of refactoring code incrementally in phases without breaking existing functionality.

## Q

### Quality Scenario
Concrete, testable description of a quality requirement with measurable criteria.

## R

### Rate Limiting
Technique to control frequency of operations (e.g., max 30 messages per 5 seconds) to prevent flooding.

### React
JavaScript library for building user interfaces. TheCommunity loads React 18 from CDN.

### Remote Control
Feature allowing one peer to control another peer's mouse and keyboard with explicit permission.

### RTCPeerConnection
Main WebRTC API object representing a connection between local and remote peers.

### RTCDataChannel
WebRTC API for sending arbitrary data between peers. TheCommunity uses channels for chat, control, and images.

## S

### SCTP (Stream Control Transmission Protocol)
Transport protocol used by WebRTC data channels. Supports both reliable (TCP-like) and unreliable (UDP-like) delivery.

### SDP (Session Description Protocol)
Format for describing multimedia sessions in WebRTC. Contains media formats, network addresses, and other metadata.

### Signaling
Process of coordinating communication to establish a WebRTC connection. Includes exchanging SDPs and ICE candidates.

### Signaling Server
Server that facilitates WebRTC signaling by relaying offers, answers, and ICE candidates. TheCommunity doesn't use one (manual signaling).

### Sliding Window
Algorithm for rate limiting that tracks timestamps of recent actions within a time window.

### Stakeholder
Person or group with interest in or influence over the system (users, contributors, maintainers, etc.).

### STUN (Session Traversal Utilities for NAT)
Protocol for discovering public IP address and port to help establish P2P connections. TheCommunity doesn't use STUN by default but users can configure it.

## T

### Technical Debt
Implied cost of additional work in the future due to choosing quick/limited solutions now instead of better approaches that would take longer.

### Theme
Visual appearance mode (light, dark, or RGB). User preference saved in localStorage.

### Translation
UI text in different languages. TheCommunity supports multiple German dialects via translations.js.

### TURN (Traversal Using Relays around NAT)
Protocol for relaying media/data traffic when direct P2P connection fails. Requires relay server. TheCommunity doesn't provide TURN but users can configure their own.

## U

### UMD (Universal Module Definition)
JavaScript module format that works in multiple environments. React CDN uses UMD builds.

### unpkg.com
CDN that serves npm packages via URL. TheCommunity loads React from unpkg.com.

### useCallback
React hook that memoizes functions to prevent unnecessary re-renders.

### useEffect
React hook for performing side effects (subscriptions, timers, API calls, etc.) in functional components.

### useRef
React hook for creating mutable references that persist across renders. Used for WebRTC objects, timers, etc.

### useState
React hook for adding state to functional components. Triggers re-render when state changes.

## V

### Validation
Process of checking input data for correctness, completeness, and safety before processing.

## W

### WebRTC (Web Real-Time Communication)
Browser API for real-time audio, video, and data communication between peers. Core technology in TheCommunity.

### Whitebox
Architecture view showing internal structure of a component or module.

### Blackbox
Architecture view showing only external interfaces of a component, hiding internal details.

## X

### XSS (Cross-Site Scripting)
Security vulnerability where malicious scripts are injected into web pages. React's default escaping protects against XSS.

## Acronyms Quick Reference

| Acronym | Full Name |
|---------|-----------|
| ADR | Architecture Decision Record |
| API | Application Programming Interface |
| ARIA | Accessible Rich Internet Applications |
| CDN | Content Delivery Network |
| CI/CD | Continuous Integration / Continuous Deployment |
| CSP | Content Security Policy |
| DTLS | Datagram Transport Layer Security |
| E2E | End-to-End |
| ES6 | ECMAScript 2015 (JavaScript version) |
| HTML | HyperText Markup Language |
| HTTP | HyperText Transfer Protocol |
| HTTPS | HTTP Secure |
| ICE | Interactive Connectivity Establishment |
| IDE | Integrated Development Environment |
| i18n | Internationalization |
| JSON | JavaScript Object Notation |
| JSX | JavaScript XML (React syntax extension) |
| NAT | Network Address Translation |
| NFR | Non-Functional Requirement |
| P2P | Peer-to-Peer |
| PR | Pull Request |
| REST | Representational State Transfer |
| RTC | Real-Time Communication |
| SCTP | Stream Control Transmission Protocol |
| SDP | Session Description Protocol |
| STUN | Session Traversal Utilities for NAT |
| SVG | Scalable Vector Graphics |
| TLS | Transport Layer Security |
| TURN | Traversal Using Relays around NAT |
| UDP | User Datagram Protocol |
| UI | User Interface |
| UMD | Universal Module Definition |
| URL | Uniform Resource Locator |
| UX | User Experience |
| WCAG | Web Content Accessibility Guidelines |
| WebRTC | Web Real-Time Communication |
| XSS | Cross-Site Scripting |

## Domain-Specific Terms

### TheCommunity-Specific

| Term | Definition |
|------|------------|
| **CLAUDE.md** | File containing development guidelines for AI assistants and humans |
| **oiia oiia** | Background soundtrack that plays after first user interaction (Issue #73) |
| **Nyan Cat** | Easter egg audio activated by Konami code |
| **Konami Code** | ↑↑↓↓←→←→BA - classic cheat code sequence |
| **Tux Mascot** | Angry penguin SVG mascot shown in About dialog |
| **Phase 1/2/3/4** | Progressive refactoring phases for modularization |

### Project-Specific Channels

| Channel Label | Purpose |
|---------------|---------|
| **'chat'** | Text messaging between peers |
| **'control'** | Remote control commands (pointer, keyboard) |
| **'image'** | Chunked image transfer |

### Rate Limits

| Context | Limit | Window |
|---------|-------|--------|
| **Chat messages** | 30 messages | 5 seconds |
| **Control commands** | 60 messages | 5 seconds |
| **Image transfers** | 10 images | 60 seconds (1 minute) |

### Performance Targets

| Metric | Target |
|--------|--------|
| **DOMContentLoaded** | < 2 seconds |
| **Fully Loaded** | < 5 seconds |
| **First Paint** | < 1 second |
| **Time to Interactive** | < 3 seconds |
| **Message Latency** | < 100 milliseconds |
| **Memory Usage** | < 100 MB heap |

## References

For more detailed explanations of architectural concepts, see:

- **Section 1**: Introduction and Goals
- **Section 2**: Architecture Constraints
- **Section 3**: System Scope and Context
- **Section 4**: Solution Strategy
- **Section 5**: Building Block View
- **Section 6**: Runtime View
- **Section 7**: Deployment View
- **Section 8**: Cross-cutting Concepts
- **Section 9**: Architecture Decisions
- **Section 10**: Quality Requirements
- **Section 11**: Risks and Technical Debt

For technical implementation details, see:
- **ARCHITECTURE.md**: Technical architecture details
- **README.md**: User-facing documentation
- **SECURITY_REVIEW.md**: Security analysis
- **src/README.md**: Module API documentation

## Contributing to Glossary

When introducing new terms in code or documentation:

1. Add definition to this glossary
2. Use term consistently throughout codebase
3. Link to glossary from first usage in long documents
4. Keep definitions concise (1-3 sentences)
5. Include acronym expansion in parentheses on first use

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2025-10-17 | Initial glossary created for arc42 documentation |

---

**Note**: This glossary is a living document. As the project evolves and new terms are introduced, they should be added here to maintain a comprehensive reference for all stakeholders.
