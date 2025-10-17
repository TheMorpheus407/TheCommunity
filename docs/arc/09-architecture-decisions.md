# 9. Architecture Decisions

This section documents important architectural decisions with their context, rationale, and consequences.

## 9.1 ADR-001: Use WebRTC for All Communication

**Status**: Accepted | **Date**: Project inception | **Deciders**: Project maintainer

### Context

The project needs to enable real-time communication between users without backend infrastructure.

### Decision

Use WebRTC (Web Real-Time Communication) for all peer-to-peer communication, including chat messages, screen sharing, and remote control.

### Rationale

**Pros**:
- ✅ True peer-to-peer: No server required for communication
- ✅ Built into browsers: No plugins or additional software
- ✅ Low latency: Direct connection between peers
- ✅ Secure: DTLS encryption for data channels
- ✅ Versatile: Supports data channels (chat) and media streams (screen sharing)
- ✅ Zero hosting costs: No server to pay for

**Cons**:
- ❌ Complex signaling: Requires manual signal exchange
- ❌ Firewall issues: May fail behind restrictive NATs
- ❌ No multi-peer: Currently only supports 1-to-1 connections
- ❌ Browser-only: Cannot connect native apps without WebRTC library

### Consequences

- Application is truly serverless
- Users must manually exchange signals (poor UX, but necessary)
- No message persistence (everything is ephemeral)
- No presence system (can't see who's online)
- Educational value: Users understand WebRTC signaling process

### Status

Accepted and implemented. Core constraint defined in CLAUDE.md.

---

## 9.2 ADR-002: Manual Signaling (No Signaling Server)

**Status**: Accepted | **Date**: Project inception | **Deciders**: Project maintainer

### Context

WebRTC requires signaling to exchange SDP offers/answers and ICE candidates. Most applications use a WebSocket server for this.

### Decision

Use manual signaling where users copy-paste WebRTC signals via external channels (email, chat, etc.).

### Rationale

**Pros**:
- ✅ Zero infrastructure: No signaling server to host
- ✅ User control: Users see exactly what information is shared
- ✅ Transparent: Educational, demystifies WebRTC
- ✅ Flexible: Users choose communication channel

**Cons**:
- ❌ Poor UX: Copy-paste is cumbersome
- ❌ Error-prone: Users may copy incomplete signals
- ❌ Slow: Connection setup takes longer
- ❌ Not mainstream-friendly: Too complex for average users

### Alternatives Considered

1. **WebSocket Signaling Server**
   - Rejected: Violates "no backend" constraint
   - Would require hosting, maintenance, costs

2. **QR Code Exchange**
   - Considered: Could be added as enhancement
   - Doesn't eliminate manual exchange, just simplifies it

3. **Magic Links with Pastebin**
   - Rejected: Requires third-party service (privacy concern)
   - Still needs manual sharing

### Consequences

- Users must understand the signaling process
- Connection establishment is manual (not instant)
- Project is educational (shows how WebRTC works)
- Not suitable for mainstream adoption

### Status

Accepted. Considered a feature, not a bug.

---

## 9.3 ADR-003: React from CDN (No Build Step)

**Status**: Accepted | **Date**: Project inception | **Deciders**: Project maintainer

### Context

Need a UI framework for complex state management and reactive rendering.

### Decision

Load React 18 from unpkg.com CDN using UMD builds. No build step (Webpack, Babel, etc.).

### Rationale

**Pros**:
- ✅ Zero setup: No npm, no bundler, no configuration
- ✅ Fast development: Edit and refresh
- ✅ Easy contributions: Lower barrier to entry
- ✅ Direct debugging: No source maps needed
- ✅ Works in any text editor: No IDE required

**Cons**:
- ❌ Larger bundle: Entire React loaded (no tree-shaking)
- ❌ No JSX: Use `React.createElement()` (more verbose)
- ❌ No TypeScript: JavaScript only
- ❌ CDN dependency: App won't load if unpkg.com is down

### Alternatives Considered

1. **React with Build Step (Create React App, Vite)**
   - Rejected: Too complex for this project
   - Requires Node.js, npm, build configuration
   - Violates "no build step" principle

2. **Vanilla JavaScript**
   - Rejected: State management too complex for this app
   - Would need custom reactive system

3. **Preact**
   - Considered: Smaller bundle size
   - Rejected: React more familiar to contributors

4. **Vue, Svelte**
   - Rejected: React more widely known
   - Ecosystem advantages

### Consequences

- Simple development workflow
- Anyone can contribute with basic JS knowledge
- Larger initial download (~170 KB for React + ReactDOM)
- Dependent on CDN availability (99.9%+ uptime)

### Status

Accepted. Aligns with "simplicity over optimization" principle.

---

## 9.4 ADR-004: Native ES6 Modules (No Bundler)

**Status**: Accepted | **Date**: Phase 1 refactoring | **Deciders**: Project maintainer

### Context

Monolithic app.js (2810 lines) is hard to maintain. Need modularization.

### Decision

Use browser-native ES6 modules (`<script type="module">`) without bundler.

### Rationale

**Pros**:
- ✅ Native browser support: Works in 95%+ of browsers
- ✅ Clean syntax: `import`/`export` statements
- ✅ Code splitting: Can lazy-load modules
- ✅ No build step: Consistent with project philosophy
- ✅ Direct debugging: Source maps not needed

**Cons**:
- ❌ Not supported in IE11: Acceptable (WebRTC isn't either)
- ❌ No dead code elimination: Entire modules loaded
- ❌ More HTTP requests: One per module (mitigated by HTTP/2)

### Alternatives Considered

1. **Webpack/Rollup**
   - Rejected: Requires build step
   - Adds complexity

2. **AMD/RequireJS**
   - Rejected: Outdated, not native

3. **Stay Monolithic**
   - Rejected: Unmaintainable at scale
   - Hinders contributions

### Consequences

- Progressive refactoring enabled
- Modules extracted without breaking production
- Modern browser required (acceptable trade-off)
- Slightly more HTTP requests (negligible with HTTP/2)

### Status

Accepted. Phase 1 (module extraction) complete.

---

## 9.5 ADR-005: GitHub Pages for Hosting

**Status**: Accepted | **Date**: Project inception | **Deciders**: Project maintainer

### Context

Need hosting for static site with automatic deployments.

### Decision

Use GitHub Pages with deployment via GitHub Actions.

### Rationale

**Pros**:
- ✅ Free for public repositories
- ✅ Automatic HTTPS (Let's Encrypt)
- ✅ Global CDN (Fastly)
- ✅ Integrated with GitHub workflow
- ✅ Git-backed deployments (gh-pages branch)
- ✅ Zero maintenance

**Cons**:
- ❌ Static only: No server-side code (acceptable - we don't need it)
- ❌ No custom headers: Cannot set CSP (would be nice to have)
- ❌ GitHub dependency: Vendor lock-in (acceptable trade-off)

### Alternatives Considered

1. **Netlify/Vercel**
   - Rejected: Unnecessary complexity
   - GitHub Pages simpler for this use case

2. **Self-Hosted**
   - Rejected: Requires server (violates "no backend")
   - Hosting costs and maintenance

3. **CloudFlare Pages**
   - Considered: Similar to GitHub Pages
   - GitHub Pages simpler integration with repository

### Consequences

- Zero hosting costs
- Automatic deployments on merge to main
- Cannot set custom response headers (CSP, HSTS, etc.)
- Dependent on GitHub's infrastructure (99.9%+ uptime)

### Status

Accepted. Working well in production.

---

## 9.6 ADR-006: Client-Side Rate Limiting (No Server Enforcement)

**Status**: Accepted | **Date**: Phase 1 development | **Deciders**: Project maintainer

### Context

Need to prevent message flooding attacks between peers.

### Decision

Implement rate limiting client-side using sliding window algorithm. No server to enforce limits.

### Rationale

**Pros**:
- ✅ No server required: Aligns with "no backend" constraint
- ✅ Simple implementation: Array of timestamps
- ✅ User-friendly: Gradual limit, not hard cutoff
- ✅ Prevents accidental flooding: Protects both peers

**Cons**:
- ❌ Not enforceable: Malicious peer can bypass by modifying code
- ❌ One-sided protection: Each peer protects themselves only
- ❌ No global rate limit: Per-connection basis

### Alternatives Considered

1. **Server-Side Rate Limiting**
   - Rejected: Requires backend server
   - Violates core constraint

2. **No Rate Limiting**
   - Rejected: Vulnerable to accidental flooding
   - Poor user experience (browser hangs)

3. **Token Bucket**
   - Considered: More complex, similar results
   - Sliding window simpler to implement

### Consequences

- Prevents accidental flooding (e.g., script error sending loop)
- Does not prevent determined attacker (they can modify client code)
- Acceptable trade-off: P2P inherently trusts peer
- Users are warned about peer trust model

### Status

Accepted. Working as intended for honest peers.

---

## 9.7 ADR-007: Session-Scoped API Keys (No Persistence)

**Status**: Accepted | **Date**: AI feature addition | **Deciders**: Project maintainer

### Context

OpenAI integration requires API key. How to handle user credentials?

### Decision

Store API key in memory (React state) only. Never persist to localStorage or cookies. Clear on page refresh.

### Rationale

**Pros**:
- ✅ Privacy: Key not stored persistently
- ✅ Security: Reduces exposure window
- ✅ User control: Explicit opt-in each session
- ✅ No credential theft: Can't steal what's not stored

**Cons**:
- ❌ Inconvenient: Must re-enter key each session
- ❌ Key in memory: Vulnerable to XSS (but so is localStorage)

### Alternatives Considered

1. **localStorage for API Key**
   - Rejected: Persistent storage increases risk
   - Key survives session, more exposure

2. **Encrypted localStorage**
   - Rejected: JavaScript cannot securely encrypt (key in code)
   - False sense of security

3. **Backend Proxy for OpenAI**
   - Rejected: Requires backend server
   - Violates "no backend" constraint
   - Costs money (API calls)

### Consequences

- Users must paste API key each session
- More secure (shorter exposure window)
- Transparent about key usage
- Users responsible for their API costs

### Status

Accepted. Privacy and security over convenience.

---

## 9.8 ADR-008: Progressive Refactoring Strategy

**Status**: Accepted | **Date**: Phase 1 planning | **Deciders**: Project maintainer

### Context

Monolithic app.js needs refactoring, but must not break production.

### Decision

Refactor incrementally in phases:
1. Phase 1: Extract modules (no integration yet)
2. Phase 2: Extract managers
3. Phase 3: Extract components
4. Phase 4: Switch to modular entry point

### Rationale

**Pros**:
- ✅ Zero downtime: Production never broken
- ✅ Incremental validation: Test each phase
- ✅ Rollback capability: Can revert any phase
- ✅ Parallel work: Modules ready before integration
- ✅ Review-friendly: Smaller PRs

**Cons**:
- ❌ Slower: Multiple PRs instead of one big change
- ❌ Temporary duplication: Modules exist but unused (Phase 1)

### Alternatives Considered

1. **Big Bang Refactoring**
   - Rejected: High risk of breaking production
   - Difficult code review (massive PR)

2. **Feature Freeze During Refactoring**
   - Rejected: Blocks community contributions
   - Not aligned with community-driven principle

### Consequences

- Longer migration timeline (acceptable)
- Multiple PRs required (more review work)
- Production stable throughout refactoring
- Modules documented and tested before integration

### Status

Accepted. Phase 1 complete, Phase 2 planned.

---

## 9.9 ADR-009: Playwright for E2E Testing

**Status**: Accepted | **Date**: Phase 1 refactoring | **Deciders**: Project maintainer

### Context

Need automated testing to prevent regressions during refactoring.

### Decision

Use Playwright for E2E testing with focus on loading performance and smoke tests.

### Rationale

**Pros**:
- ✅ Cross-browser: Chrome, Firefox, Safari support
- ✅ Modern API: Async/await, auto-waiting
- ✅ Performance testing: Built-in metrics
- ✅ Headless: Runs in CI without display
- ✅ Maintained by Microsoft: Active development

**Cons**:
- ❌ Large dependency: ~100 MB download
- ❌ Slow tests: E2E tests take longer than unit tests

### Alternatives Considered

1. **Cypress**
   - Rejected: Chromium-only (at the time)
   - More opinionated, less flexible

2. **Selenium**
   - Rejected: Older API, more complex setup
   - Playwright more modern

3. **Jest + React Testing Library**
   - Rejected: Unit tests don't catch integration issues
   - Wanted E2E coverage

### Consequences

- E2E tests run in CI before deployment
- Performance regression detection
- Slower test execution (acceptable for CI)
- Confident refactoring (tests catch breaks)

### Status

Accepted. Tests running in CI successfully.

---

## 9.10 ADR-010: No Authentication System

**Status**: Accepted | **Date**: Project inception | **Deciders**: Project maintainer

### Context

Should users have accounts, profiles, authentication?

### Decision

No authentication system. Anonymous, peer-to-peer only.

### Rationale

**Pros**:
- ✅ Privacy: No user data collected
- ✅ Simplicity: No backend, no database, no auth server
- ✅ Zero maintenance: No password resets, no account issues
- ✅ Instant use: No signup required

**Cons**:
- ❌ No identity: Can't verify who you're talking to
- ❌ No user profiles: Can't save preferences server-side
- ❌ No reputation system: Can't track good/bad actors

### Alternatives Considered

1. **WebAuthn for Authentication**
   - Rejected: No backend to verify credentials
   - No user profiles to authenticate against

2. **Decentralized Identity (DID)**
   - Considered: Could be future enhancement
   - Complex, not MVP

3. **GitHub OAuth**
   - Rejected: Requires backend for OAuth flow
   - Not aligned with "no backend" constraint

### Consequences

- Users are anonymous
- No way to verify peer identity
- Users trust peers explicitly (manual signaling)
- No persistent user data

### Status

Accepted. Feature, not limitation.

---

## 9.11 ADR-011: arc42 for Architecture Documentation

**Status**: Accepted | **Date**: Issue #53 | **Deciders**: Community (Issue request)

### Context

Project needs comprehensive architecture documentation for contributors and maintainers.

### Decision

Use arc42 template for architecture documentation in `docs/arc/` directory.

### Rationale

**Pros**:
- ✅ Proven template: Used in many projects
- ✅ Comprehensive: Covers all architecture aspects
- ✅ Browseable: Markdown format, readable on GitHub
- ✅ Standardized: Contributors familiar with structure
- ✅ Maintainable: Sections can be updated independently

**Cons**:
- ❌ Verbose: 12 sections (but thorough)
- ❌ Initial effort: Takes time to document

### Alternatives Considered

1. **C4 Model**
   - Considered: Good for diagrams
   - arc42 more comprehensive (includes C4-style diagrams)

2. **ADR (Architecture Decision Records) Only**
   - Rejected: Too narrow, doesn't cover all aspects
   - ADRs are part of arc42 (section 9)

3. **Wiki or Notion**
   - Rejected: Want documentation in repository
   - Version controlled with code

### Consequences

- Comprehensive documentation for new contributors
- Standard structure (easier to navigate)
- Markdown files in repository (version controlled)
- Maintenance overhead (docs must stay up-to-date)

### Status

Accepted. Documentation being created.

---

## 9.12 Summary of Key Decisions

| ADR | Decision | Rationale |
|-----|----------|-----------|
| **ADR-001** | WebRTC for communication | True P2P, no backend, low latency |
| **ADR-002** | Manual signaling | No signaling server, user control |
| **ADR-003** | React from CDN | No build step, simple development |
| **ADR-004** | ES6 modules | Native browser support, clean syntax |
| **ADR-005** | GitHub Pages hosting | Free, HTTPS, integrated |
| **ADR-006** | Client-side rate limiting | No server, prevents accidental flooding |
| **ADR-007** | Session-scoped API keys | Privacy over convenience |
| **ADR-008** | Progressive refactoring | Zero downtime, incremental |
| **ADR-009** | Playwright E2E tests | Cross-browser, performance testing |
| **ADR-010** | No authentication | Privacy, simplicity, no backend |
| **ADR-011** | arc42 documentation | Comprehensive, standardized |

## 9.13 Decision-Making Process

### Criteria for Architectural Decisions

1. **Alignment with Core Constraint**: Does it maintain "no backend" principle?
2. **Security Impact**: Does it introduce vulnerabilities?
3. **Maintainability**: Can the community maintain it?
4. **Simplicity**: Is it the simplest solution that works?
5. **User Privacy**: Does it respect user privacy?

### Who Decides?

- **Core Architecture**: Project maintainer (TheMorpheus407)
- **Features**: Community (via Issues) + maintainer approval
- **Implementation Details**: Contributors + code review

### How to Propose New Decisions

1. Create GitHub Issue describing problem and proposed solution
2. Discuss alternatives and trade-offs
3. If approved, implement and document decision in this file
4. Link to decision from relevant code comments

## 9.14 Living Document

This document is a living record of architectural decisions. As the project evolves, new ADRs will be added. Existing ADRs may be superseded but will remain for historical context with status updated to "Superseded".

**Format for New ADRs**:
```markdown
## 9.X ADR-XXX: Decision Title

**Status**: Proposed/Accepted/Superseded | **Date**: YYYY-MM-DD | **Deciders**: Name(s)

### Context
Describe the problem requiring a decision.

### Decision
State the decision clearly.

### Rationale
Explain pros, cons, and why this decision was made.

### Alternatives Considered
List other options and why they were rejected.

### Consequences
Describe the impact of this decision.

### Status
Current status and notes.
```
