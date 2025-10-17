# 2. Architecture Constraints

## 2.1 Technical Constraints

### TC1: WebRTC-Only Communication

**Constraint**: All communication MUST run over WebRTC. There is NO real backend, not even a broker.

| Aspect | Impact |
|--------|--------|
| **Rationale** | Core project principle defined in CLAUDE.md |
| **Implications** | - No traditional REST APIs for chat<br>- No WebSocket servers<br>- No signaling server (manual exchange)<br>- No STUN/TURN servers by default |
| **Exceptions** | - GitHub API for contributor statistics (UI only, not app functionality)<br>- OpenAI API for optional AI features (user-provided key) |
| **Enforcement** | Security reviews must verify no new backend communication |

### TC2: No Build Step

**Constraint**: The application must run directly in browsers without compilation or bundling.

| Aspect | Impact |
|--------|--------|
| **Rationale** | Keep development simple, maintain accessibility for contributors |
| **Implications** | - Use native ES6 modules<br>- Load React from CDN<br>- No TypeScript, no Webpack, no Babel<br>- Modern JavaScript only (ES6+) |
| **Trade-offs** | - Cannot use latest TS features<br>- No advanced optimizations<br>- Larger bundle size (React CDN) |
| **Benefits** | - Zero setup time<br>- Any text editor works<br>- Direct debugging |

### TC3: GitHub Pages Deployment

**Constraint**: Application is deployed as static files on GitHub Pages.

| Aspect | Impact |
|--------|--------|
| **Rationale** | Free hosting, automatic deployment via GitHub Actions |
| **Implications** | - Static files only (HTML, CSS, JS)<br>- No server-side code<br>- No .htaccess or URL rewrites<br>- HTTPS enforced by GitHub |
| **Limitations** | - Cannot set custom response headers<br>- No server-side rendering<br>- No API endpoints |
| **Benefits** | - Automatic HTTPS<br>- Global CDN<br>- Zero cost |

### TC4: Browser Compatibility

**Constraint**: Must support modern browsers with WebRTC and ES6 modules.

| Browser | Minimum Version | Constraints |
|---------|----------------|-------------|
| Chrome/Edge | 56+ | Full support |
| Firefox | 44+ | Full support |
| Safari | 11+ | Full support (ES6 modules added in 10.1, WebRTC in 11) |
| Mobile Safari | 11+ | Touch interactions required |

**Key Requirements**:
- WebRTC APIs (RTCPeerConnection, RTCDataChannel)
- ES6 modules (`<script type="module">`)
- Async/await
- Optional chaining (fallback to older syntax if needed)

### TC5: Zero Backend Dependencies

**Constraint**: Application must function without any backend services under developer control.

| Aspect | Impact |
|--------|--------|
| **Rationale** | True serverless architecture, no hosting costs, no maintenance |
| **Implications** | - No user authentication<br>- No message persistence<br>- No user profiles<br>- No presence system |
| **External Services** | - GitHub API (optional, UI only)<br>- OpenAI API (optional, user key) |
| **Testing** | Must work completely offline after initial load |

## 2.2 Organizational Constraints

### OC1: Community-Driven Development

**Constraint**: The community steers where this project goes entirely via Issues.

| Aspect | Impact |
|--------|--------|
| **Rationale** | Defined in CLAUDE.md as core principle |
| **Process** | 1. User creates Issue<br>2. Community discusses<br>3. Approved Issues get implemented<br>4. PRs reviewed before merge |
| **Decision Authority** | Project maintainer (TheMorpheus407) has final say |
| **Contributor Freedom** | Anyone can propose features, but maintainer approves direction |

### OC2: AI-Assisted Development

**Constraint**: Claude AI assistant implements features following CLAUDE.md guidelines.

| Aspect | Impact |
|--------|--------|
| **Workflow** | Issues are assigned to Claude via GitHub Action |
| **Guidelines** | Must follow CLAUDE.md rules (clean code, security checks, multiple reasoning passes) |
| **Quality Standards** | - Always leave code cleaner<br>- Explore top 5 solutions<br>- Security reviews required<br>- Verify changes before PR |
| **Human Oversight** | All PRs reviewed by maintainer before merge |

### OC3: Zero-Downtime Requirement

**Constraint**: The app is LIVE via GitHub Actions; changes must never break production.

| Aspect | Impact |
|--------|--------|
| **Rationale** | Application is publicly accessible; users depend on stability |
| **Implications** | - All changes must be backward compatible<br>- Progressive refactoring only<br>- Extensive testing before deployment<br>- Rollback plan for every PR |
| **Testing Strategy** | - E2E tests with Playwright<br>- Manual testing in preview environment<br>- Performance regression tests |
| **Deployment** | Automated via GitHub Actions on main branch merge |

### OC4: Open Source and Transparent

**Constraint**: All code is open source (MIT License), all development is public.

| Aspect | Impact |
|--------|--------|
| **License** | MIT - permissive open source |
| **Repository** | Public on GitHub |
| **Development** | All Issues, PRs, and discussions are public |
| **Privacy** | No proprietary code, no hidden tracking, no secrets in repo |

## 2.3 Conventions

### CV1: Code Style

| Convention | Rule |
|------------|------|
| **Language** | Modern JavaScript (ES6+) |
| **Formatting** | - Indentation: 2 spaces<br>- Semicolons: Consistent usage<br>- Quotes: Single quotes preferred |
| **Naming** | - camelCase for variables and functions<br>- PascalCase for React components<br>- UPPER_CASE for constants |
| **Comments** | - JSDoc for all exported functions<br>- Inline comments for complex logic |

### CV2: Documentation Standards

| Convention | Rule |
|------------|------|
| **Architecture** | arc42 template (this document) |
| **API Docs** | JSDoc format in source code |
| **README** | User-facing guide in README.md |
| **Technical Docs** | ARCHITECTURE.md for implementation details |
| **Security** | SECURITY_REVIEW.md for security analysis |

### CV3: Version Control

| Convention | Rule |
|------------|------|
| **Branching** | - `main` branch for production<br>- Feature branches: `claude/issue-X-YYYYMMDD-HHMM`<br>- No direct commits to main |
| **Commit Messages** | - Descriptive messages<br>- Co-authored-by for AI commits |
| **Pull Requests** | - Must reference Issue<br>- Must pass tests<br>- Require maintainer approval |

### CV4: Testing Standards

| Convention | Rule |
|------------|------|
| **E2E Tests** | Playwright tests for critical paths |
| **Performance** | - DOMContentLoaded < 2s<br>- Fully Loaded < 5s<br>- First Paint < 1s |
| **Browser Coverage** | Test on Chrome, Firefox, Safari |
| **Test Execution** | `npm test` before every PR |

## 2.4 Security Constraints

### SC1: No Credential Storage

**Constraint**: Application must never store user credentials.

| Aspect | Impact |
|--------|--------|
| **Rationale** | Privacy-first design, minimize attack surface |
| **Rules** | - No localStorage for passwords/tokens<br>- No cookies for authentication<br>- Session-scoped API keys only (memory) |
| **OpenAI Key** | Stored in memory only, cleared on refresh |
| **WebRTC** | No authentication required (peer-to-peer) |

### SC2: Rate Limiting Mandatory

**Constraint**: All message channels must have rate limits.

| Channel | Rate Limit |
|---------|------------|
| Chat | 30 messages per 5 seconds |
| Control | 60 messages per 5 seconds |
| Image | 10 images per minute |

**Enforcement**: Client-side sliding window algorithm.

### SC3: Input Validation Required

**Constraint**: All external input must be validated.

| Input Type | Validation |
|------------|------------|
| Chat messages | Max 2000 characters, type checking |
| WebRTC signals | JSON parsing with try-catch |
| Data channel labels | Whitelist of expected labels |
| Image chunks | Max 5MB total size |

## 2.5 Summary

The most restrictive constraints are:

1. **WebRTC-only communication** - Fundamentally shapes the entire architecture
2. **Zero backend** - Eliminates entire classes of features (persistence, auth, presence)
3. **No build step** - Limits tooling and optimization options
4. **Zero downtime** - Requires extremely careful, incremental changes
5. **Community-driven** - Development pace depends on community engagement

These constraints are **intentional** and define the unique character of TheCommunity as an educational, experimental, serverless P2P application.
