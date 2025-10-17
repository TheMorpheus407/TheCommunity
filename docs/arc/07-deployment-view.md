# 7. Deployment View

## 7.1 Infrastructure Overview

```
┌────────────────────────────────────────────────────────────────────────┐
│                         GitHub Ecosystem                                │
│                                                                         │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                    GitHub Repository                              │  │
│  │              TheMorpheus407/TheCommunity                         │  │
│  │                                                                   │  │
│  │  • Source code (main branch)                                     │  │
│  │  • Pull requests                                                 │  │
│  │  • Issues                                                        │  │
│  │  • GitHub Actions workflows                                      │  │
│  └────────────────────────────┬─────────────────────────────────────┘  │
│                               │                                         │
│                               │ Push to main                            │
│                               ▼                                         │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                    GitHub Actions CI/CD                          │  │
│  │                                                                   │  │
│  │  1. Checkout code                                                │  │
│  │  2. Setup Node.js                                                │  │
│  │  3. Install dependencies (npm install)                           │  │
│  │  4. Run tests (npm test)                                         │  │
│  │  5. Deploy to gh-pages branch (if tests pass)                    │  │
│  └────────────────────────────┬─────────────────────────────────────┘  │
│                               │                                         │
│                               │ Deploy                                  │
│                               ▼                                         │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                    gh-pages Branch                                │  │
│  │                                                                   │  │
│  │  • index.html                                                    │  │
│  │  • app.js                                                        │  │
│  │  • translations.js                                               │  │
│  │  • styles.css                                                    │  │
│  │  • assets/*                                                      │  │
│  │  • src/* (extracted modules)                                     │  │
│  └────────────────────────────┬─────────────────────────────────────┘  │
│                               │                                         │
└───────────────────────────────┼─────────────────────────────────────────┘
                                │
                                │ Served via HTTPS
                                ▼
┌────────────────────────────────────────────────────────────────────────┐
│                         GitHub Pages CDN                                │
│                                                                         │
│  URL: https://themorpheus407.github.io/TheCommunity/                   │
│                                                                         │
│  • Global CDN (Fastly)                                                 │
│  • Automatic HTTPS (Let's Encrypt)                                     │
│  • HTTP/2 support                                                      │
│  • Gzip compression                                                    │
│  • Cache-Control headers                                               │
└────────────────────────────┬───────────────────────────────────────────┘
                             │
                             │ HTTPS GET
                             ▼
                    ┌──────────────────┐
                    │  User's Browser  │
                    │                  │
                    │  • Chrome 56+    │
                    │  • Firefox 44+   │
                    │  • Safari 11+    │
                    │  • Edge 79+      │
                    └──────────────────┘
```

## 7.2 Production Environment

### Deployment Target: GitHub Pages

| Property | Value |
|----------|-------|
| **Provider** | GitHub Pages (GitHub, Inc.) |
| **URL** | https://themorpheus407.github.io/TheCommunity/ |
| **Protocol** | HTTPS (TLS 1.2+) |
| **CDN** | Fastly (GitHub's CDN provider) |
| **Deployment Method** | GitHub Actions workflow |
| **Deployment Trigger** | Push/merge to `main` branch |
| **Build Required** | No - static files deployed as-is |
| **Hosting Cost** | $0 (free for public repositories) |

### Infrastructure Characteristics

**Advantages**:
- ✅ Zero hosting costs
- ✅ Automatic HTTPS with valid certificate
- ✅ Global CDN for low latency
- ✅ Integrated with GitHub workflow
- ✅ Version controlled deployments (gh-pages branch)
- ✅ Automatic compression (gzip/brotli)
- ✅ HTTP/2 support

**Limitations**:
- ❌ Static files only (no server-side code)
- ❌ Cannot set custom response headers (e.g., CSP)
- ❌ No .htaccess or URL rewrites
- ❌ No server-side rendering
- ❌ No backend APIs
- ❌ Soft bandwidth limit (100GB/month recommended)

**Acceptable Trade-offs**:
- All limitations align with "no backend" constraint
- Static hosting is sufficient for WebRTC P2P application
- Custom headers not critical (browser defaults acceptable)

## 7.3 Deployment Process

### GitHub Actions Workflow

**File**: `.github/workflows/deploy.yml`

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  workflow_dispatch:

jobs:
  test-and-deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm install

      - name: Run tests
        run: npm test

      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./
          publish_branch: gh-pages
          exclude_assets: '.github,tests,node_modules'
```

### Deployment Steps

1. **Trigger**: Developer merges PR to `main` branch
2. **Checkout**: Actions runner clones repository
3. **Setup**: Install Node.js 18 and npm dependencies
4. **Test**: Run Playwright E2E tests
   - If tests fail: Deployment aborted
   - If tests pass: Continue to deployment
5. **Deploy**: Copy files to `gh-pages` branch
   - Include: `index.html`, `app.js`, `translations.js`, `styles.css`, `assets/`, `src/`
   - Exclude: `.github/`, `tests/`, `node_modules/`, `package.json`, `playwright.config.js`
6. **Publish**: GitHub Pages serves updated files from `gh-pages` branch
7. **CDN Propagation**: Fastly CDN caches updated files (~1-5 minutes)

### Rollback Strategy

**Option 1: Revert Commit**
```bash
git revert <commit-hash>
git push origin main
# Triggers new deployment with reverted code
```

**Option 2: Redeploy Previous Version**
```bash
git checkout <previous-commit>
git push -f origin gh-pages
# Force-pushes old version to gh-pages
```

**Option 3: GitHub Pages Settings**
- Temporarily disable GitHub Pages
- Fix issue in main branch
- Re-enable GitHub Pages

## 7.4 Client Runtime Environment

### Browser Requirements

| Capability | Requirement | Reason |
|------------|-------------|--------|
| **JavaScript** | ES6+ (2015) | Native modules, async/await, arrow functions |
| **WebRTC** | Full support | RTCPeerConnection, RTCDataChannel, getDisplayMedia |
| **ES6 Modules** | `<script type="module">` | Module imports without bundler |
| **Media Capture** | `navigator.mediaDevices` | Screen sharing feature |
| **Fetch API** | Native fetch() | GitHub API, OpenAI API |
| **localStorage** | Full support | Theme and language persistence |

### Supported Browsers

| Browser | Minimum Version | Market Share | Notes |
|---------|----------------|--------------|-------|
| **Chrome** | 56+ (2017) | ~65% | Full support, best performance |
| **Edge** | 79+ (2020) | ~5% | Chromium-based, same as Chrome |
| **Firefox** | 44+ (2016) | ~3% | Full support |
| **Safari** | 11+ (2017) | ~20% | ES6 modules since 10.1, WebRTC since 11 |
| **Mobile Safari** | 11+ | ~15% | Touch interactions supported |
| **Opera** | 43+ | <1% | Chromium-based |

**Total Coverage**: ~98% of global browser market share (excluding IE11)

**Intentionally Unsupported**:
- Internet Explorer 11 (no ES6 modules, no WebRTC DataChannels)
- Safari 10 and below (incomplete WebRTC)
- Chrome 55 and below (missing features)

### Client-Side Resources

**Downloaded on First Load**:

| Resource | Source | Size (approx) | Cacheable |
|----------|--------|---------------|-----------|
| **index.html** | GitHub Pages | 1-2 KB | Yes (with ETag) |
| **app.js** | GitHub Pages | 100 KB | Yes |
| **translations.js** | GitHub Pages | 20 KB | Yes |
| **styles.css** | GitHub Pages | 35 KB | Yes |
| **React** | unpkg.com CDN | 130 KB (gzipped) | Yes (long cache) |
| **ReactDOM** | unpkg.com CDN | 40 KB (gzipped) | Yes (long cache) |
| **assets/oiia.mp3** | GitHub Pages | ~500 KB | Yes |
| **assets/nyan.mp3** | GitHub Pages | ~300 KB | Yes (lazy loaded) |

**Total First Load**: ~1.1 MB (excluding audio)
**Total with Audio**: ~1.9 MB

**Load Time** (on 10 Mbps connection):
- HTML + CSS + JS: ~1.5 seconds
- With audio: ~2.5 seconds
- Measured in tests: ~1.5-2.0s DOMContentLoaded

## 7.5 External Dependencies

### CDN Dependencies

```
┌────────────────────────────────────────────────────────────┐
│                      User's Browser                         │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              TheCommunity Application                 │  │
│  └────────┬─────────────────┬────────────────────────────┘  │
│           │                 │                               │
│           │                 │                               │
│    ┌──────▼─────┐    ┌──────▼────────┐                     │
│    │   React    │    │  ReactDOM     │                     │
│    │  (unpkg)   │    │   (unpkg)     │                     │
│    └────────────┘    └───────────────┘                     │
│                                                             │
└────────────────────────────────────────────────────────────┘
```

**React from unpkg.com**:
- **URL**: `https://unpkg.com/react@18/umd/react.production.min.js`
- **Purpose**: UI library
- **Version**: 18.x (pinned)
- **Fallback**: None (required dependency)
- **Risk**: CDN outage prevents app load
- **Mitigation**: unpkg has 99.9%+ uptime

**ReactDOM from unpkg.com**:
- **URL**: `https://unpkg.com/react-dom@18/umd/react-dom.production.min.js`
- **Purpose**: React renderer
- **Version**: 18.x (pinned)
- **Fallback**: None (required dependency)

### External API Dependencies

```
┌────────────────────────────────────────────────────────────┐
│                   TheCommunity (Browser)                    │
│                                                             │
│  ┌──────────────────┐              ┌──────────────────┐    │
│  │  Contributors    │              │   AI Rewrite     │    │
│  │  Feature         │              │   Feature        │    │
│  │  (Optional)      │              │   (Optional)     │    │
│  └────────┬─────────┘              └────────┬─────────┘    │
│           │                                 │               │
└───────────┼─────────────────────────────────┼───────────────┘
            │                                 │
            │ HTTPS GET                       │ HTTPS POST
            │ (public API)                    │ (user API key)
            │                                 │
    ┌───────▼──────────┐              ┌──────▼──────────┐
    │   GitHub API     │              │   OpenAI API    │
    │                  │              │                 │
    │ api.github.com   │              │ api.openai.com  │
    └──────────────────┘              └─────────────────┘
```

**GitHub API**:
- **Purpose**: Fetch contributor statistics (UI only)
- **Authentication**: None (public API)
- **Rate Limit**: 60 requests/hour (unauthenticated)
- **Required**: No (optional feature)
- **Fallback**: Feature disabled, error message shown

**OpenAI API**:
- **Purpose**: AI message rewriting
- **Authentication**: User-provided API key
- **Rate Limit**: User's quota
- **Required**: No (optional feature)
- **Fallback**: Feature disabled without API key

## 7.6 Deployment Environments

### Production

| Property | Value |
|----------|-------|
| **URL** | https://themorpheus407.github.io/TheCommunity/ |
| **Branch** | `gh-pages` |
| **Update Frequency** | On every merge to `main` |
| **Testing** | E2E tests run before deployment |
| **Monitoring** | GitHub Actions logs |
| **Rollback** | Manual (revert commit or force-push) |

### Staging

**No dedicated staging environment**

**Rationale**:
- Static site with no backend
- E2E tests validate functionality before deployment
- Preview can be done locally or via PR preview tools

**Alternative Preview Options**:
1. **Local Testing**: `python -m http.server` or `npx http-server`
2. **Fork Testing**: Contributors can deploy to their own GitHub Pages fork
3. **PR Preview**: Can be added via Netlify/Vercel PR previews (future enhancement)

### Development

| Property | Value |
|----------|-------|
| **Environment** | Developer's local machine |
| **Requirements** | Modern browser, optional local web server |
| **Dependencies** | npm (for tests only) |
| **Testing** | `npm test` (Playwright E2E tests) |

**Setup**:
```bash
# Clone repository
git clone https://github.com/TheMorpheus407/TheCommunity.git
cd TheCommunity

# Install test dependencies (optional)
npm install

# Serve locally
python -m http.server 8000
# or
npx http-server

# Run tests (optional)
npm test
```

## 7.7 Monitoring and Observability

### Available Metrics

**GitHub Actions**:
- ✅ Deployment success/failure
- ✅ Test results
- ✅ Build time
- ✅ Deploy time

**GitHub Pages**:
- ✅ Uptime (99.9%+ SLA)
- ❌ No access to traffic analytics
- ❌ No error tracking
- ❌ No performance monitoring

### Logging

**Server-Side**: None (static hosting)

**Client-Side**:
- `console.log()` for debugging (development)
- `console.warn()` for invalid messages (production)
- `console.error()` for exceptions (production)
- No centralized log aggregation

**User Error Reporting**:
- Users can report issues via GitHub Issues
- No automatic error reporting (respects privacy)

### Alerting

**Deployment Failures**:
- GitHub Actions sends email on workflow failure
- Maintainer notified of test failures

**Production Issues**:
- No automatic monitoring
- Users report issues via GitHub Issues

## 7.8 Scalability

### Traffic Capacity

**GitHub Pages Limits**:
- **Bandwidth**: 100 GB/month (soft limit, can be higher)
- **File Size**: 100 MB per file (hard limit)
- **Repository Size**: 1 GB recommended (hard limit at 5 GB with warnings)
- **Deployment Frequency**: Recommended < 10 deploys/hour

**Current Usage**:
- ~1.9 MB per user load (with audio)
- 100 GB / 1.9 MB = ~52,000 page loads per month
- Sufficient for current project scale

**CDN Scaling**:
- Fastly CDN handles millions of requests
- No scaling action required from maintainer

### Peer-to-Peer Scaling

**Connection Limit**:
- Current: 1-to-1 connections only
- Each user connects directly to one peer
- No centralized bottleneck (true P2P)

**Future Multi-Peer**:
- Mesh network would require each user to connect to N-1 peers
- O(N²) connection complexity
- Browser limits: ~50-100 WebRTC connections per browser
- Requires significant architectural changes

## 7.9 Security in Deployment

### HTTPS Enforcement

- GitHub Pages enforces HTTPS (no HTTP option)
- TLS 1.2+ with strong cipher suites
- Certificate: Let's Encrypt (auto-renewed)

### Response Headers

**Default GitHub Pages Headers**:
```
Content-Security-Policy: None (cannot be set)
X-Frame-Options: DENY (cannot be customized)
X-Content-Type-Options: nosniff (set by GitHub)
```

**Limitation**: Cannot add custom CSP header to restrict external resources

**Mitigation**: Code review ensures no unexpected external requests

### Secrets Management

**No Secrets Required**:
- No API keys in repository
- No backend credentials
- OpenAI key provided by user at runtime (not stored)

**GitHub Actions**:
- Uses `GITHUB_TOKEN` (automatic, scoped to repository)
- No additional secrets needed

## 7.10 Disaster Recovery

### Backup Strategy

**Source Code**:
- Git repository backed up by GitHub
- Contributors have local clones
- Forked by community members

**Deployed Files**:
- `gh-pages` branch is Git-backed
- Can redeploy from any commit in `main`

**Recovery Time Objective (RTO)**: < 5 minutes
- Redeploy from previous commit
- GitHub Actions workflow takes ~2-3 minutes

**Recovery Point Objective (RPO)**: 0 (no data loss)
- All code in version control
- No user data stored (stateless application)

### Failure Scenarios

| Scenario | Impact | Recovery |
|----------|--------|----------|
| **Deployment failure** | No impact (previous version still live) | Fix issue, merge new PR |
| **GitHub Pages outage** | App unavailable | Wait for GitHub to restore service |
| **CDN issue** | Slow loading or unavailable | GitHub handles CDN failover |
| **Bad deployment** | App broken for all users | Revert commit, redeploy (< 5 min) |
| **Repository deleted** | Complete loss | Restore from fork or local clone |
| **React CDN outage** | App won't load | No immediate mitigation (dependency) |

## 7.11 Summary

**Deployment Architecture**:
- Static files hosted on GitHub Pages
- Deployed via GitHub Actions on merge to main
- Zero-downtime deployments (atomic updates)
- Global CDN for low latency
- HTTPS enforced

**Key Characteristics**:
- ✅ Zero hosting cost
- ✅ Zero maintenance overhead
- ✅ Automatic deployments
- ✅ Rollback capability
- ❌ No server-side code
- ❌ No custom headers
- ❌ Limited monitoring

**Aligns Perfectly with**:
- "No backend" constraint
- WebRTC-only communication
- Static hosting requirements
- Community-driven development workflow
