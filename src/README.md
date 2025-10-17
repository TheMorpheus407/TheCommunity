# Modular Architecture

This directory contains the modularized components and utilities extracted from the monolithic `app.js`.

## Architecture Overview

The application is being incrementally refactored from a single 2810-line file into well-organized ES6 modules with clear responsibilities.

### Current Structure

```
src/
├── core/
│   └── constants.js          # Application-wide constants and enums
├── components/
│   └── TuxMascot.js          # Mascot React component
├── utils/
│   ├── helpers.js            # Theme resolution and utilities
│   ├── soundEffects.js       # Background audio and Konami code
│   └── contributors.js       # GitHub API integration
└── app.js                    # Main application (in progress)
```

## Modules

### Core

#### `core/constants.js`
Exports all application constants including:
- Channel labels (`EXPECTED_CHANNEL_LABEL`, `CONTROL_CHANNEL_LABEL`, etc.)
- Rate limiting configuration
- Image transfer settings
- Theme options
- Control message types
- Helper function: `getNextThemeValue(currentTheme)`

**API Documentation:**
```javascript
import {
  MAX_MESSAGE_LENGTH,
  THEME_OPTIONS,
  getNextThemeValue
} from './core/constants.js';

// Use constants
console.log(MAX_MESSAGE_LENGTH); // 2000

// Cycle through themes
const nextTheme = getNextThemeValue(THEME_OPTIONS.DARK);
// Returns: 'light'
```

### Components

#### `components/TuxMascot.js`
React component rendering the angry penguin mascot.

**API Documentation:**
```javascript
import { TuxMascot } from './components/TuxMascot.js';

// Usage in React
React.createElement(TuxMascot, { t: translationObject });
```

**Props:**
- `t` (Object): Translation object containing `mascot.ariaLabel`

### Utilities

#### `utils/helpers.js`
Theme resolution and helper functions.

**API Documentation:**
```javascript
import { resolveInitialTheme } from './utils/helpers.js';

const { theme, isStored } = resolveInitialTheme();
// Returns: { theme: 'dark'|'light'|'rgb', isStored: boolean }
```

**Functions:**
- `resolveInitialTheme()`: Determines initial theme from storage or system preferences

#### `utils/soundEffects.js`
Audio easter eggs and background sound management.

**API Documentation:**
```javascript
import { initBackgroundSound, initKonamiCode } from './utils/soundEffects.js';

// Initialize background audio (plays on first user interaction)
initBackgroundSound();

// Enable Konami code easter egg (↑↑↓↓←→←→BA)
initKonamiCode();
```

**Functions:**
- `initBackgroundSound()`: Sets up background audio with browser autoplay handling
- `initKonamiCode()`: Enables Nyan Cat easter egg via Konami code

#### `utils/contributors.js`
GitHub API integration for fetching contributors and statistics.

**API Documentation:**
```javascript
import { fetchContributors, fetchStatistics } from './utils/contributors.js';

// Fetch contributors from GitHub issues
const contributors = await fetchContributors('owner/repo');
// Returns: Array<{ login: string, avatar_url: string, issue_count: number }>

// Fetch Claude AI statistics
const stats = await fetchStatistics('owner/repo');
// Returns: Array<{ number, title, state, url, created_at, closed_at, labels }>
```

**Functions:**
- `fetchContributors(repo)`: Fetches and aggregates contributors from repository issues
- `fetchStatistics(repo)`: Fetches issues labeled with 'claude' for AI statistics

## Benefits of Modular Architecture

### ✅ Separation of Concerns
Pure logic and utilities are separated from React components and state management.

### ✅ Reusability
Modules can be imported anywhere in the application or in future features.

### ✅ Testability
Each module can be unit tested independently without complex mocking.

### ✅ Documentation
Full JSDoc API documentation for all exports.

### ✅ Maintainability
Clear module boundaries make it easier to locate and update code.

### ✅ Performance Potential
ES6 modules enable dynamic imports for code splitting and lazy loading in the future.

### ✅ No Build Step Required
Uses native ES6 module system supported by modern browsers.

## Migration Roadmap

The refactoring is being done incrementally to avoid breaking changes:

### Phase 1: Foundation (Current)
- [x] Extract constants
- [x] Extract utilities
- [x] Extract pure components
- [x] Document architecture

### Phase 2: Manager Classes (Future PR)
- [ ] Extract WebRTC Manager
- [ ] Extract Chat Manager
- [ ] Extract Screen Share Manager
- [ ] Extract Remote Control Manager
- [ ] Extract Image Transfer Manager
- [ ] Extract AI Manager

### Phase 3: React Components (Future PR)
- [ ] Extract About Dialog
- [ ] Extract Signaling Panel
- [ ] Extract Chat Panel
- [ ] Extract Screen Share Panel
- [ ] Extract API Key Modal

### Phase 4: Complete Migration (Future PR)
- [ ] Full modular app.js
- [ ] Remove legacy monolithic file
- [ ] Add dynamic imports for performance
- [ ] Update deployment

## Usage

### In Original App (Current)
The original `app.js` remains unchanged and fully functional.

### With Modules (Future)
```html
<script type="module" src="src/app.js"></script>
```

## Testing

E2E tests verify that:
1. The modular version maintains feature parity
2. Loading time performance meets requirements
3. All WebRTC functionality works correctly
4. Security constraints are maintained

See `tests/` directory for test suites.

## Security Considerations

All modules maintain the security principles:
- No external API calls except to OpenAI (user-provided key) and GitHub (public API)
- WebRTC-only communication (no backend)
- Input validation and rate limiting preserved
- No credential storage

## Development

### Adding a New Module

1. Create the module file in the appropriate directory
2. Add full JSDoc documentation
3. Export functions/classes with clear API
4. Update this README with API documentation
5. Add unit tests
6. Import and use in app.js

### Example Module Template

```javascript
/**
 * @fileoverview Module description
 * @module path/to/module
 */

/**
 * Function description
 * @param {Type} paramName - Parameter description
 * @returns {Type} Return description
 * @export
 */
export function functionName(paramName) {
  // Implementation
}
```

## License

Same as parent project (see LICENSE file in root).
