# 11. Risks and Technical Debt

This section identifies known risks and technical debt in the system.

## 11.1 Technical Risks

### RISK-1: CDN Dependency (unpkg.com)

**Risk**: Application won't load if unpkg.com is unavailable

| Property | Value |
|----------|-------|
| **Probability** | Low (unpkg.com has 99.9%+ uptime) |
| **Impact** | High (application completely unavailable) |
| **Detection** | Users report loading failures, browser console shows 404 errors |
| **Mitigation** | None currently (accept dependency) |

**Possible Solutions**:
1. **Self-host React**: Bundle React/ReactDOM in repository
   - Pro: No CDN dependency
   - Con: Larger repository, violates "use CDN" decision
2. **Fallback CDN**: Try multiple CDNs (unpkg → jsdelivr → cdnjs)
   - Pro: Redundancy
   - Con: More complex, delays loading on primary CDN failure
3. **Service Worker Cache**: Cache React files locally after first load
   - Pro: Offline support
   - Con: Doesn't help first load

**Decision**: Accept risk (unpkg reliability is high)

### RISK-2: Manual Signaling Complexity

**Risk**: Users struggle with copy-paste signaling, abandon application

| Property | Value |
|----------|-------|
| **Probability** | High (known UX issue) |
| **Impact** | Medium (users abandon, but expected for this project) |
| **Detection** | User feedback, GitHub Issues |
| **Mitigation** | Clear instructions, warning about complexity |

**Possible Solutions**:
1. **QR Code Exchange**: Generate QR code for offer/answer
   - Pro: Easier for mobile users
   - Con: Still manual, doesn't solve fundamental issue
2. **Magic Links via Pastebin**: Temporary signaling via third-party
   - Pro: One-click connection
   - Con: Third-party dependency, privacy concern
3. **Signaling Server**: Traditional WebRTC signaling
   - Pro: Instant connection
   - Con: Violates "no backend" core constraint

**Decision**: Accept as feature, not bug (educational project)

### RISK-3: WebRTC Firewall Issues

**Risk**: Connections fail behind restrictive NATs/firewalls

| Property | Value |
|----------|-------|
| **Probability** | Medium (depends on user network) |
| **Impact** | High (cannot connect at all) |
| **Detection** | ICE state "failed", user reports "can't connect" |
| **Mitigation** | Document STUN/TURN server configuration (user can add) |

**Possible Solutions**:
1. **Default STUN Servers**: Include Google STUN servers
   - Pro: Improves NAT traversal
   - Con: Third-party dependency, may leak IP to Google
2. **TURN Server**: Provide relay server for restrictive NATs
   - Pro: Works in most scenarios
   - Con: Requires backend server (violates constraint), costly
3. **Hybrid Mode**: Fallback to signaling server for difficult networks
   - Pro: Best reliability
   - Con: Violates core principle

**Decision**: Document STUN/TURN configuration, users opt-in

### RISK-4: Monolithic app.js Maintenance

**Risk**: Difficulty maintaining and extending 2810-line monolithic file

| Property | Value |
|----------|-------|
| **Probability** | High (current reality) |
| **Impact** | Medium (slows development, hinders contributions) |
| **Detection** | Developer complaints, slow PR velocity |
| **Mitigation** | Progressive refactoring (Phase 1 and 2 complete, Phase 3 planned) |

**Progress**:
- ✅ Phase 1: Modules extracted (constants, utils, components)
- ✅ Phase 2: Manager extraction (complete)
- 📅 Phase 3: Component extraction (planned)
- 📅 Phase 4: Complete migration (planned)

**Decision**: Address via incremental refactoring (in progress)

### RISK-5: No Server-Side Rate Limiting

**Risk**: Malicious peer bypasses client-side rate limiting

| Property | Value |
|----------|-------|
| **Probability** | Medium (requires technical knowledge) |
| **Impact** | Medium (can flood peer, but peer can disconnect) |
| **Detection** | Peer experiences performance issues, high message rate |
| **Mitigation** | None (inherent limitation of P2P trust model) |

**Possible Solutions**:
1. **Server-Side Enforcement**: Rate limit at server
   - Pro: Cannot be bypassed
   - Con: Requires backend server (violates constraint)
2. **Reputation System**: Block bad actors
   - Pro: Community moderation
   - Con: Requires authentication and backend
3. **Peer-Side Protection**: Receiver disconnects on flood
   - Pro: Self-defense
   - Con: Already possible (user can click disconnect)

**Decision**: Accept limitation, document peer trust model

### RISK-6: Browser API Changes

**Risk**: WebRTC API changes break application

| Property | Value |
|----------|-------|
| **Probability** | Low (WebRTC is stable standard) |
| **Impact** | High (application stops working) |
| **Detection** | Users report errors after browser update |
| **Mitigation** | Follow WebRTC standards, test on latest browsers |

**Mitigation Strategy**:
- Use standard APIs (avoid experimental features)
- Test on latest Chrome, Firefox, Safari
- Monitor browser release notes
- Fix issues quickly when reported

**Decision**: Monitor and react (standard APIs are stable)

### RISK-7: GitHub Pages Policy Changes

**Risk**: GitHub changes Pages policies, removes free hosting, or alters capabilities

| Property | Value |
|----------|-------|
| **Probability** | Very Low (GitHub committed to Pages for open source) |
| **Impact** | High (need to migrate hosting) |
| **Detection** | GitHub announcement, service disruption |
| **Mitigation** | Project is forkable, can move to other static hosts |

**Possible Solutions**:
1. **Netlify/Vercel**: Alternative static hosts (also free)
2. **CloudFlare Pages**: Another alternative
3. **Self-Host**: S3 + CloudFront, Nginx, etc.

**Decision**: Accept risk (GitHub Pages is reliable for open source)

## 11.2 Technical Debt

### DEBT-1: Monolithic app.js (2810 lines)

**Status**: Being Addressed | **Priority**: High

**Description**:
- All application logic in single file
- Difficult to understand and modify
- Hinders contributions
- Makes testing harder

**Impact**:
- Slows development velocity
- Higher risk of bugs
- Discourages new contributors

**Plan to Address**:
- ✅ Phase 1: Extract modules (constants, utils) - **COMPLETE**
- ✅ Phase 2: Extract managers (WebRTC, chat, etc.) - **COMPLETE**
- 📅 Phase 3: Extract components - **FUTURE**
- 📅 Phase 4: Complete migration - **FUTURE**

**Estimated Effort**: 4 PRs, ~40 hours total (across all phases)

**Progress**: 50% complete (Phase 1 and 2 done)

### DEBT-2: Limited Test Coverage

**Status**: Open | **Priority**: Medium

**Description**:
- Only E2E tests for loading performance
- No unit tests for business logic
- No integration tests for WebRTC flows
- Manual testing required for most features

**Impact**:
- Risk of regressions during refactoring
- Slower development (manual testing)
- Bugs may escape to production

**Plan to Address**:
1. Add E2E tests for critical paths (connection, messaging)
2. Add unit tests for extracted modules (Phase 2)
3. Mock WebRTC APIs for testing (Phase 2)
4. Target 80% code coverage (Phase 3)

**Estimated Effort**: ~20 hours

**Blocker**: Monolithic architecture makes testing hard (addressed by DEBT-1)

### DEBT-3: No TypeScript

**Status**: Open | **Priority**: Low

**Description**:
- JavaScript only (no static typing)
- Harder to catch type errors at development time
- No autocomplete/IntelliSense for custom types

**Impact**:
- Runtime type errors possible
- Longer debugging time
- Less IDE support

**Plan to Address**:
- Consider TypeScript migration in Phase 4
- Alternatively, use JSDoc type annotations (no build step)

**Trade-offs**:
- TypeScript requires build step (violates current approach)
- JSDoc provides some benefits without build step

**Decision**: Defer until Phase 4, reassess build step trade-off

### DEBT-4: Incomplete Accessibility

**Status**: Open | **Priority**: Medium

**Description**:
- Some ARIA labels missing
- Keyboard navigation incomplete
- Not fully WCAG AA compliant
- No screen reader testing

**Impact**:
- Not accessible to users with disabilities
- Excludes part of potential user base

**Plan to Address**:
1. Audit with aXe or WAVE tools
2. Add missing ARIA labels
3. Improve keyboard navigation
4. Test with screen readers
5. Aim for WCAG AA compliance

**Estimated Effort**: ~10 hours

### DEBT-5: No Content Security Policy (CSP)

**Status**: Open | **Priority**: Low

**Description**:
- Cannot set CSP headers on GitHub Pages
- No protection against XSS (relying on React's default escaping)

**Impact**:
- If XSS vulnerability exists, no additional protection layer
- Cannot restrict external resource loading

**Plan to Address**:
- Document recommended CSP headers (for self-hosted deployments)
- Consider Netlify/Vercel for custom headers (future)
- Ensure code practices prevent XSS (code review)

**Blocker**: GitHub Pages limitation (cannot set custom headers)

**Decision**: Accept limitation, rely on code review and React's XSS protection

### DEBT-6: No Offline Support

**Status**: Open | **Priority**: Low

**Description**:
- Application requires internet for initial load
- No Service Worker for caching
- No offline messaging queue

**Impact**:
- Cannot use app without internet
- Poor experience on unreliable connections

**Plan to Address**:
1. Add Service Worker for caching static assets
2. Implement offline detection and messaging
3. Queue messages when offline, send when reconnected

**Estimated Effort**: ~15 hours

**Considerations**:
- P2P requires connection anyway (offline messaging limited value)
- Service Worker adds complexity
- Low priority for current use case

### DEBT-7: No Multi-Peer Support

**Status**: Open | **Priority**: Low (Feature Limitation)

**Description**:
- Only supports 1-to-1 connections
- No mesh networking
- No group chats

**Impact**:
- Cannot have group conversations
- Limits scalability

**Plan to Address**:
- Future enhancement (not current priority)
- Requires significant architectural changes
- Mesh network = O(N²) connections (complexity)

**Estimated Effort**: ~40 hours (major feature)

**Decision**: Accept as limitation, may address in future based on community demand

### DEBT-8: Hard-Coded Configuration

**Status**: Open | **Priority**: Low

**Description**:
- Rate limits, message sizes hard-coded in constants
- No runtime configuration
- Cannot adjust without code change

**Impact**:
- Users cannot customize limits for their use case
- Must fork and modify code to change

**Plan to Address**:
- Add optional config file or URL parameters
- Allow users to override defaults
- Keep sensible defaults

**Estimated Effort**: ~5 hours

**Considerations**:
- Low priority (current defaults work well)
- Added complexity for little gain

## 11.3 Risk Matrix

| Risk ID | Risk | Probability | Impact | Priority |
|---------|------|-------------|--------|----------|
| **RISK-1** | CDN dependency | Low | High | 🟡 Medium |
| **RISK-2** | Manual signaling UX | High | Medium | 🟢 Low (Feature) |
| **RISK-3** | Firewall issues | Medium | High | 🟡 Medium |
| **RISK-4** | Monolithic code | High | Medium | 🔴 High (Addressing) |
| **RISK-5** | No server-side rate limit | Medium | Medium | 🟢 Low (Accept) |
| **RISK-6** | Browser API changes | Low | High | 🟢 Low (Monitor) |
| **RISK-7** | GitHub Pages changes | Very Low | High | 🟢 Low |

## 11.4 Technical Debt Prioritization

| Debt ID | Technical Debt | Impact | Effort | Priority | Status |
|---------|----------------|--------|--------|----------|--------|
| **DEBT-1** | Monolithic app.js | High | High (40h) | 🔴 P1 | Addressing (25% done) |
| **DEBT-2** | Limited tests | Medium | Medium (20h) | 🟡 P2 | Planned (Phase 2) |
| **DEBT-4** | Accessibility | Medium | Low (10h) | 🟡 P2 | Open |
| **DEBT-6** | No offline support | Low | Medium (15h) | 🟢 P3 | Open |
| **DEBT-5** | No CSP | Low | N/A (blocked) | 🟢 P3 | Accept |
| **DEBT-8** | Hard-coded config | Low | Low (5h) | 🟢 P3 | Open |
| **DEBT-3** | No TypeScript | Low | High (40h) | 🟢 P4 | Defer |
| **DEBT-7** | No multi-peer | Low | High (40h) | 🟢 P4 | Future feature |

**Legend**:
- 🔴 P1: High Priority (address soon)
- 🟡 P2: Medium Priority (address in next 3-6 months)
- 🟢 P3: Low Priority (address when convenient)
- 🟢 P4: Very Low Priority (nice to have)

## 11.5 Risk Mitigation Strategies

### Strategy 1: Progressive Refactoring

**Addresses**: DEBT-1 (Monolithic code), RISK-4 (Maintenance difficulty)

**Approach**:
- Incremental migration over multiple PRs
- Extract modules without breaking production
- Maintain backward compatibility
- Test after each phase

**Progress**: Phase 1 and 2 complete, Phase 3 planned

### Strategy 2: Increase Test Coverage

**Addresses**: DEBT-2 (Limited tests)

**Approach**:
- Add E2E tests for critical paths
- Unit test extracted modules
- Mock WebRTC APIs for testing
- Run tests in CI before every deployment

**Progress**: E2E infrastructure in place, need more tests

### Strategy 3: Documentation and Transparency

**Addresses**: RISK-2 (Manual signaling), RISK-3 (Firewall issues), RISK-5 (Client-side rate limiting)

**Approach**:
- Clear documentation of limitations
- User warnings about complexity
- Instructions for STUN/TURN configuration
- Explain peer trust model

**Progress**: README and ARCHITECTURE.md document limitations

### Strategy 4: Dependency Monitoring

**Addresses**: RISK-1 (CDN), RISK-6 (Browser APIs), RISK-7 (GitHub Pages)

**Approach**:
- Monitor uptime of dependencies
- Follow browser release notes
- Test on latest browser versions
- Have migration plan ready

**Progress**: Passive monitoring, react when issues arise

### Strategy 5: Code Quality Standards

**Addresses**: All technical debt

**Approach**:
- CLAUDE.md enforces clean code
- Code review before every merge
- Security review checklist
- Documentation updated with code

**Progress**: Enforced via PR process

## 11.6 Acceptable Risks and Trade-offs

The following risks/debt are **accepted** as intentional trade-offs:

| Item | Rationale |
|------|-----------|
| **Manual Signaling** | Core feature (no backend), educational value |
| **Client-Side Rate Limiting** | Inherent P2P limitation, users trust peers |
| **No CSP Headers** | GitHub Pages limitation, React protects against XSS |
| **CDN Dependency** | Acceptable for 99.9%+ uptime service |
| **No Multi-Peer** | Future feature, not current priority |
| **No TypeScript** | Build step trade-off, JSDoc provides some benefits |

These are **conscious decisions**, not oversights.

## 11.7 Debt Repayment Plan

### Immediate (Current Sprint)

- ✅ Complete arc42 documentation (DEBT-1 related)

### Phase 2 (Complete)

- ✅ Extract manager classes (DEBT-1)
- 📅 Add unit tests for modules (DEBT-2) - moved to Phase 3
- 📅 Mock WebRTC APIs (DEBT-2) - moved to Phase 3

### Phase 3 (Next 3-6 months)

- 📅 Extract React components (DEBT-1)
- 📅 Accessibility audit and fixes (DEBT-4)
- 📅 Increase E2E test coverage (DEBT-2)

### Phase 4 (Future)

- 📅 Complete migration to modular architecture (DEBT-1)
- 📅 Evaluate TypeScript (DEBT-3)
- 📅 Consider offline support (DEBT-6)
- 📅 Multi-peer networking (DEBT-7)

### Ongoing

- 🔁 Code quality enforcement (CLAUDE.md)
- 🔁 Dependency monitoring (RISK-1, RISK-6)
- 🔁 Documentation updates (all areas)
- 🔁 Security reviews (SECURITY_REVIEW.md)

## 11.8 Monitoring and Tracking

### How Risks Are Tracked

- **GitHub Issues**: Users report issues
- **GitHub Actions Logs**: Deployment failures
- **Code Review**: Identify new risks during PRs
- **Periodic Reviews**: Quarterly risk assessment

### How Debt Is Tracked

- **This Document**: Central registry of known debt
- **GitHub Issues**: "tech-debt" label for tracking items
- **ARCHITECTURE.md**: Migration roadmap
- **PR Descriptions**: Debt addressed in each PR

### Review Frequency

- **Weekly**: GitHub Actions logs, new issues
- **Monthly**: Dependency updates, browser compatibility
- **Quarterly**: Comprehensive risk review, debt assessment
- **Annually**: Architecture review, major planning

## 11.9 Lessons Learned

### What Went Well

- ✅ Progressive refactoring approach prevents breaking changes
- ✅ E2E tests catch regressions before deployment
- ✅ Clear documentation reduces contribution barriers
- ✅ No backend constraint simplifies architecture

### What Could Be Improved

- ⚠️ Test coverage should have been higher from start
- ⚠️ TypeScript might have prevented some bugs (trade-off)
- ⚠️ Accessibility should have been considered earlier
- ⚠️ Monolithic file grew too large before refactoring started

### Future Considerations

- 🔮 Start with modular architecture from beginning
- 🔮 Add tests alongside features (not after)
- 🔮 Consider accessibility in design phase
- 🔮 Document architecture decisions as made (ADRs)

## 11.10 Summary

**Current Risk Level**: 🟡 **Moderate**

**Key Risks**:
- Monolithic code (being addressed)
- CDN dependency (accepted, low probability)
- Firewall issues (documented workaround)

**Key Technical Debt**:
- Monolithic app.js (25% resolved, ongoing)
- Limited test coverage (planned for Phase 2)
- Accessibility (needs improvement)

**Mitigation Status**:
- ✅ Active mitigation: DEBT-1 (refactoring in progress)
- 📅 Planned mitigation: DEBT-2, DEBT-4 (Phases 2-3)
- 🟢 Accepted: RISK-2, RISK-5, DEBT-5 (intentional trade-offs)

**Overall**: Risks are known and manageable. Technical debt is being addressed incrementally without disrupting production. No critical issues.
