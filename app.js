/**
 * Peer-to-peer WebRTC chat application bootstrap.
 * Allows two browsers to exchange messages without a signaling server.
 */
(function () {
  const { useState, useRef, useCallback, useEffect } = React;

  const EXPECTED_CHANNEL_LABEL = 'chat';
  const CONTROL_CHANNEL_LABEL = 'control';
  const IMAGE_CHANNEL_LABEL = 'image';
  const PONG_CHANNEL_LABEL = 'pong';
  const TRIVIA_CHANNEL_LABEL = 'trivia';
  const MAX_MESSAGE_LENGTH = 2000;
  const MAX_MESSAGES_PER_INTERVAL = 30;
  const MESSAGE_INTERVAL_MS = 5000;
  const CONTROL_MAX_MESSAGES_PER_INTERVAL = 60;
  const CONTROL_MESSAGE_INTERVAL_MS = 5000;
  const CONTROL_MAX_PAYLOAD_LENGTH = 2048;
  const CONTROL_TEXT_INSERT_LIMIT = 32;
  const CONTROL_TOTAL_TEXT_BUDGET = 2048;
  const IMAGE_MAX_SIZE_BYTES = 5 * 1024 * 1024;
  const IMAGE_CHUNK_SIZE = 16 * 1024;
  const IMAGE_MAX_PER_INTERVAL = 10;
  const IMAGE_INTERVAL_MS = 60000;
  const IMAGE_MAX_CONCURRENT = 3;
  const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  const OPENAI_MODEL = 'gpt-4o-mini';
  const OLLAMA_MODEL = 'llama3.2';
  const OLLAMA_DEFAULT_ENDPOINT = 'http://localhost:11434';
  const AI_PROVIDERS = {
    OPENAI: 'openai',
    OLLAMA: 'ollama'
  };
  const THEME_STORAGE_KEY = 'thecommunity.theme-preference';
  const AI_PREFERENCE_STORAGE_KEY = 'thecommunity.ai-preference';
  const AI_PROVIDER_STORAGE_KEY = 'thecommunity.ai-provider';
  const COOKIE_CONSENT_STORAGE_KEY = 'thecommunity.cookie-consent';
  const WHISPER_MODEL_STORAGE_KEY = 'thecommunity.whisper-model';
  const FRANCONIA_INTRO_SEEN_KEY = 'thecommunity.franconia-intro-seen';
  const THEME_OPTIONS = {
    LIGHT: 'light',
    DARK: 'dark',
    RGB: 'rgb',
    CAT: 'cat'
  };
  const THEME_SEQUENCE = [THEME_OPTIONS.DARK, THEME_OPTIONS.LIGHT, THEME_OPTIONS.RGB, THEME_OPTIONS.CAT];
  const CAT_AUDIO_STORAGE_KEY = 'thecommunity.cat-audio-settings';
  const DEFAULT_CAT_AUDIO_SETTINGS = {
    enabled: false,
    musicEnabled: false,
    sfxEnabled: false,
    volume: 50
  };
  const WHISPER_MODELS = {
    TINY_EN: 'Xenova/whisper-tiny.en',
    BASE: 'Xenova/whisper-base'
  };
  const DEFAULT_WHISPER_MODEL = WHISPER_MODELS.TINY_EN;

  // Cookie consent categories
  const CONSENT_CATEGORIES = {
    ESSENTIAL: 'essential',
    PREFERENCES: 'preferences',
    STATISTICS: 'statistics',
    EASTER_EGG: 'easterEgg',
    AI_PREFERENCE: 'aiPreference'
  };

  /**
   * Gets the current cookie consent state from localStorage
   * @returns {Object} Consent state object with categories
   */
  function getCookieConsent() {
    try {
      const stored = window.localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Could not read cookie consent from localStorage', error);
    }
    // Return null if no consent has been given yet
    return null;
  }

  /**
   * Saves cookie consent preferences to localStorage
   * @param {Object} consent - Consent state object
   */
  function saveCookieConsent(consent) {
    try {
      window.localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, JSON.stringify(consent));
    } catch (error) {
      console.warn('Could not save cookie consent to localStorage', error);
    }
  }

  /**
   * Checks if a specific consent category is allowed
   * @param {string} category - Category to check
   * @returns {boolean} True if category is consented or essential
   */
  function hasConsentFor(category) {
    // Essential is always allowed
    if (category === CONSENT_CATEGORIES.ESSENTIAL) {
      return true;
    }

    const consent = getCookieConsent();
    // If no consent given yet, return false (show banner)
    if (!consent) {
      return false;
    }

    return consent[category] === true;
  }

  /**
   * Creates a default consent object with all categories set to a value
   * @param {boolean} value - Default value for all categories
   * @returns {Object} Consent object
   */
  function createConsentObject(value) {
    return {
      [CONSENT_CATEGORIES.ESSENTIAL]: true, // Always true
      [CONSENT_CATEGORIES.PREFERENCES]: value,
      [CONSENT_CATEGORIES.STATISTICS]: value,
      [CONSENT_CATEGORIES.EASTER_EGG]: value,
      [CONSENT_CATEGORIES.AI_PREFERENCE]: value,
      timestamp: Date.now()
    };
  }

  // Room system constants
  const PUBLIC_ROOMS = [
    'lobby',
    'random-1',
    'random-2',
    'random-3',
    'community',
    'deutsch',
    'gaming',
    'tech-talk',
    'casual'
  ];

  function getNextThemeValue(currentTheme) {
    const index = THEME_SEQUENCE.indexOf(currentTheme);
    return THEME_SEQUENCE[(index + 1) % THEME_SEQUENCE.length];
  }

  /**
   * Gets the current room ID from the URL hash
   * @returns {string|null} Room ID or null if no room
   */
  function getRoomFromHash() {
    const hash = window.location.hash;
    if (hash && hash.startsWith('#room/')) {
      return hash.substring(6); // Remove '#room/'
    }
    return null;
  }

  /**
   * Sets the room in the URL hash
   * @param {string|null} roomId - Room ID to set, or null to clear
   */
  function setRoomInHash(roomId) {
    if (roomId) {
      window.location.hash = `#room/${roomId}`;
    } else {
      window.location.hash = '';
    }
  }

  /**
   * Gets a random public room ID
   * @returns {string} Random public room ID
   */
  function getRandomPublicRoom() {
    const randomIndex = Math.floor(Math.random() * PUBLIC_ROOMS.length);
    return PUBLIC_ROOMS[randomIndex];
  }

  const CONTROL_MESSAGE_TYPES = {
    POINTER: 'pointer',
    POINTER_VISIBILITY: 'pointer-visibility',
    KEYBOARD: 'keyboard',
    PERMISSION: 'permission',
    ACTION: 'action'
  };
  /**
   * Renders the mascot that reacts angrily on hover.
   * Pure SVG so it can be reused without additional assets.
   * @param {Object} props
   * @param {Object} props.t - Translation object
   * @param {string|null} props.animation - Animation type ('flower' or 'diamond')
   * @returns {React.ReactElement}
   */
  function TuxMascot({ t, animation }) {
    const svgChildren = [
      React.createElement('ellipse', {
        key: 'shadow',
        className: 'tux-shadow',
        cx: '60',
        cy: '112',
        rx: '24',
        ry: '8'
      }),
      React.createElement('ellipse', {
        key: 'body',
        className: 'tux-body',
        cx: '60',
        cy: '60',
        rx: '32',
        ry: '46'
      }),
      React.createElement('ellipse', {
        key: 'belly',
        className: 'tux-belly',
        cx: '60',
        cy: '78',
        rx: '22',
        ry: '28'
      }),
      React.createElement('ellipse', {
        key: 'head',
        className: 'tux-head',
        cx: '60',
        cy: '38',
        rx: '26',
        ry: '24'
      }),
      React.createElement('ellipse', {
        key: 'face',
        className: 'tux-face',
        cx: '60',
        cy: '47',
        rx: '20',
        ry: '15'
      }),
      React.createElement('ellipse', {
        key: 'wing-left',
        className: 'tux-wing wing-left',
        cx: '33',
        cy: '70',
        rx: '11',
        ry: '24'
      }),
      React.createElement('ellipse', {
        key: 'wing-right',
        className: 'tux-wing wing-right',
        cx: '87',
        cy: '70',
        rx: '11',
        ry: '24'
      }),
      React.createElement('path', {
        key: 'foot-left',
        className: 'tux-foot foot-left',
        d: 'M44 96 C40 104 44 110 52 110 L58 110 C64 110 66 104 62 96 L56 88 Z'
      }),
      React.createElement('path', {
        key: 'foot-right',
        className: 'tux-foot foot-right',
        d: 'M76 96 C72 104 76 110 84 110 L90 110 C96 110 98 104 94 96 L88 88 Z'
      }),
      React.createElement('polygon', {
        key: 'beak-upper',
        className: 'tux-beak-upper',
        points: '60,50 48,56 72,56'
      }),
      React.createElement('ellipse', {
        key: 'beak-lower',
        className: 'tux-beak-lower',
        cx: '60',
        cy: '60',
        rx: '12',
        ry: '5'
      }),
      React.createElement('circle', {
        key: 'eye-left',
        className: 'tux-eye eye-left',
        cx: '50',
        cy: '44',
        r: '7'
      }),
      React.createElement('circle', {
        key: 'eye-right',
        className: 'tux-eye eye-right',
        cx: '70',
        cy: '44',
        r: '7'
      }),
      React.createElement('circle', {
        key: 'pupil-left',
        className: 'tux-pupil pupil-left',
        cx: '52',
        cy: '46',
        r: '3'
      }),
      React.createElement('circle', {
        key: 'pupil-right',
        className: 'tux-pupil pupil-right',
        cx: '68',
        cy: '46',
        r: '3'
      }),
      React.createElement('circle', {
        key: 'glow-left',
        className: 'tux-eye-glow glow-left',
        cx: '50',
        cy: '44',
        r: '7'
      }),
      React.createElement('circle', {
        key: 'glow-right',
        className: 'tux-eye-glow glow-right',
        cx: '70',
        cy: '44',
        r: '7'
      }),
      React.createElement('rect', {
        key: 'brow-left',
        className: 'tux-brow brow-left',
        x: '42',
        y: '32',
        width: '16',
        height: '3',
        rx: '1.5'
      }),
      React.createElement('rect', {
        key: 'brow-right',
        className: 'tux-brow brow-right',
        x: '62',
        y: '32',
        width: '16',
        height: '3',
        rx: '1.5'
      }),
      React.createElement('path', {
        key: 'steam-left',
        className: 'tux-steam steam-left',
        d: 'M32 20 C28 14 31 10 35 8 C39 6 40 4 38 2'
      }),
      React.createElement('path', {
        key: 'steam-right',
        className: 'tux-steam steam-right',
        d: 'M88 20 C92 14 89 10 85 8 C81 6 80 4 82 2'
      })
    ];

    // Animation-specific elements
    const animationElements = [];

    if (animation === 'flower') {
      // Flower bouquet (appears between male and female Tux)
      animationElements.push(
        React.createElement('g', {
          key: 'flower-bouquet',
          className: 'tux-flower-bouquet'
        },
          React.createElement('ellipse', { cx: '110', cy: '85', rx: '8', ry: '12', fill: '#ff69b4' }),
          React.createElement('ellipse', { cx: '118', cy: '82', rx: '7', ry: '11', fill: '#ff1493' }),
          React.createElement('ellipse', { cx: '102', cy: '82', rx: '7', ry: '11', fill: '#ff1493' }),
          React.createElement('rect', { x: '108', y: '90', width: '4', height: '15', fill: '#228b22', rx: '2' })
        )
      );
      // Heart (kiss effect)
      animationElements.push(
        React.createElement('path', {
          key: 'kiss-heart',
          className: 'tux-kiss-heart',
          d: 'M150 50 C150 45 155 40 160 40 C163 40 165 42 166 45 C167 42 169 40 172 40 C177 40 182 45 182 50 C182 58 166 70 166 70 C166 70 150 58 150 50',
          fill: '#ff69b4'
        })
      );
    }

    if (animation === 'diamond') {
      // Diamond ring
      animationElements.push(
        React.createElement('g', {
          key: 'diamond-ring',
          className: 'tux-diamond-ring'
        },
          React.createElement('ellipse', { cx: '110', cy: '85', rx: '6', ry: '3', fill: '#ffd700' }),
          React.createElement('path', { d: 'M110 75 L105 82 L115 82 Z', fill: '#b9f2ff' }),
          React.createElement('circle', { cx: '110', cy: '78', r: '2', fill: '#ffffff', opacity: '0.8' })
        )
      );
      // Wedding dress decoration
      animationElements.push(
        React.createElement('g', {
          key: 'wedding-dress',
          className: 'tux-wedding-dress'
        },
          React.createElement('path', { d: 'M180 95 C175 85 165 85 160 95 L160 110 C170 110 190 110 200 110 L200 95 C195 85 185 85 180 95', fill: '#ffffff', opacity: '0.9' }),
          React.createElement('circle', { cx: '180', cy: '60', r: '8', fill: '#ffffff', opacity: '0.7' })
        )
      );
    }

    // Female Tux (rendered when animation is active)
    const femaleTuxElements = animation ? [
      React.createElement('g', {
        key: 'female-tux',
        className: 'tux-female',
        transform: 'translate(120, 0)'
      },
        React.createElement('ellipse', { key: 'f-shadow', className: 'tux-shadow', cx: '60', cy: '112', rx: '24', ry: '8' }),
        React.createElement('ellipse', { key: 'f-body', className: 'tux-body', cx: '60', cy: '60', rx: '32', ry: '46' }),
        React.createElement('ellipse', { key: 'f-belly', className: 'tux-belly', cx: '60', cy: '78', rx: '22', ry: '28' }),
        React.createElement('ellipse', { key: 'f-head', className: 'tux-head', cx: '60', cy: '38', rx: '26', ry: '24' }),
        React.createElement('ellipse', { key: 'f-face', className: 'tux-face', cx: '60', cy: '47', rx: '20', ry: '15' }),
        React.createElement('ellipse', { key: 'f-wing-left', className: 'tux-wing', cx: '33', cy: '70', rx: '11', ry: '24' }),
        React.createElement('ellipse', { key: 'f-wing-right', className: 'tux-wing', cx: '87', cy: '70', rx: '11', ry: '24' }),
        React.createElement('path', { key: 'f-foot-left', className: 'tux-foot', d: 'M44 96 C40 104 44 110 52 110 L58 110 C64 110 66 104 62 96 L56 88 Z' }),
        React.createElement('path', { key: 'f-foot-right', className: 'tux-foot', d: 'M76 96 C72 104 76 110 84 110 L90 110 C96 110 98 104 94 96 L88 88 Z' }),
        React.createElement('polygon', { key: 'f-beak-upper', className: 'tux-beak-upper', points: '60,50 48,56 72,56' }),
        React.createElement('ellipse', { key: 'f-beak-lower', className: 'tux-beak-lower', cx: '60', cy: '60', rx: '12', ry: '5' }),
        React.createElement('circle', { key: 'f-eye-left', className: 'tux-eye', cx: '50', cy: '44', r: '7' }),
        React.createElement('circle', { key: 'f-eye-right', className: 'tux-eye', cx: '70', cy: '44', r: '7' }),
        React.createElement('circle', { key: 'f-pupil-left', className: 'tux-pupil', cx: '52', cy: '46', r: '3' }),
        React.createElement('circle', { key: 'f-pupil-right', className: 'tux-pupil', cx: '68', cy: '46', r: '3' }),
        // Bow on head for female
        React.createElement('path', { key: 'f-bow', d: 'M50 25 L45 30 L50 28 L55 30 Z M65 25 L70 30 L65 28 L60 30 Z', fill: '#ff69b4', className: 'tux-female-bow' })
      )
    ] : [];

    const containerClass = animation ? `tux-mascot tux-animation-${animation}` : 'tux-mascot';
    const viewBoxWidth = animation ? '240' : '120';

    return React.createElement(
      'div',
      {
        className: containerClass,
        role: 'img',
        'aria-label': t.mascot.ariaLabel
      },
      React.createElement(
        'svg',
        {
          className: 'tux-svg',
          viewBox: `0 0 ${viewBoxWidth} 120`,
          xmlns: 'http://www.w3.org/2000/svg',
          'aria-hidden': 'true',
          focusable: 'false'
        },
        [...svgChildren, ...femaleTuxElements, ...animationElements]
      )
    );
  }

  /**
   * Random room button component showing Tux with a rotating dice
   * @param {Object} props
   * @param {Object} props.t - Translation object
   * @param {Function} props.onClick - Click handler
   * @returns {React.ReactElement}
   */
  function RandomRoomButton({ t, onClick }) {
    return React.createElement(
      'button',
      {
        className: 'random-room-button',
        onClick: onClick,
        title: t.rooms.randomButtonTitle,
        'aria-label': t.rooms.randomButtonAria
      },
      React.createElement(
        'svg',
        {
          className: 'random-room-svg',
          viewBox: '0 0 140 120',
          xmlns: 'http://www.w3.org/2000/svg',
          'aria-hidden': 'true',
          focusable: 'false'
        },
        // Tux penguin (simplified, sitting pose)
        React.createElement('ellipse', { className: 'tux-shadow', cx: '40', cy: '112', rx: '20', ry: '6' }),
        React.createElement('ellipse', { className: 'tux-body', cx: '40', cy: '65', rx: '28', ry: '40' }),
        React.createElement('ellipse', { className: 'tux-belly', cx: '40', cy: '80', rx: '18', ry: '24' }),
        React.createElement('ellipse', { className: 'tux-head', cx: '40', cy: '42', rx: '22', ry: '20' }),
        React.createElement('ellipse', { className: 'tux-face', cx: '40', cy: '50', rx: '16', ry: '12' }),
        // Wings
        React.createElement('ellipse', { className: 'tux-wing', cx: '18', cy: '72', rx: '9', ry: '20' }),
        React.createElement('ellipse', { className: 'tux-wing', cx: '62', cy: '72', rx: '9', ry: '20' }),
        // Feet
        React.createElement('path', { className: 'tux-foot', d: 'M28 98 C25 104 28 108 34 108 L38 108 C42 108 44 104 41 98 Z' }),
        React.createElement('path', { className: 'tux-foot', d: 'M52 98 C49 104 52 108 58 108 L62 108 C66 108 68 104 65 98 Z' }),
        // Beak
        React.createElement('polygon', { className: 'tux-beak-upper', points: '40,48 32,52 48,52' }),
        React.createElement('ellipse', { className: 'tux-beak-lower', cx: '40', cy: '54', rx: '8', ry: '3' }),
        // Eyes
        React.createElement('circle', { className: 'tux-eye', cx: '34', cy: '42', r: '5' }),
        React.createElement('circle', { className: 'tux-eye', cx: '46', cy: '42', r: '5' }),
        React.createElement('circle', { className: 'tux-pupil', cx: '35', cy: '43', r: '2' }),
        React.createElement('circle', { className: 'tux-pupil', cx: '47', cy: '43', r: '2' }),

        // Dice (in front of Tux) - 3D cube representation
        React.createElement('g', { className: 'dice-cube' },
          // Top face
          React.createElement('path', {
            className: 'dice-face dice-top',
            d: 'M85 50 L105 40 L125 50 L105 60 Z'
          }),
          // Left face
          React.createElement('path', {
            className: 'dice-face dice-left',
            d: 'M85 50 L85 85 L105 95 L105 60 Z'
          }),
          // Right face
          React.createElement('path', {
            className: 'dice-face dice-right',
            d: 'M105 60 L105 95 L125 85 L125 50 Z'
          }),
          // Dots on visible faces
          React.createElement('circle', { className: 'dice-dot', cx: '105', cy: '50', r: '2' }), // Top center
          React.createElement('circle', { className: 'dice-dot', cx: '95', cy: '68', r: '2' }), // Left
          React.createElement('circle', { className: 'dice-dot', cx: '95', cy: '77', r: '2' }), // Left
          React.createElement('circle', { className: 'dice-dot', cx: '115', cy: '68', r: '2' }), // Right
          React.createElement('circle', { className: 'dice-dot', cx: '115', cy: '77', r: '2' })  // Right
        )
      )
    );
  }

  /**
   * World domination plans inspired by "Pinky and the Brain"
   */
  const WORLD_DOMINATION_PLANS = [
    "Today we shall create a global network of peer-to-peer connections, rendering all centralized servers obsolete!",
    "Tonight, Pinky, we take over the world... one WebRTC connection at a time!",
    "Are you pondering what I'm pondering? I think so, Brain, but how do we get everyone to use manual signaling?",
    "Step 1: Build a chat app. Step 2: Add screen sharing. Step 3: WORLD DOMINATION!",
    "The same thing we do every night, Pinky - try to convince people that P2P is the future!",
    "Brilliant! We'll use data channels to bypass all traditional infrastructure!",
    "They said it couldn't be done - a chat app with NO backend! But they underestimated THE BRAIN!",
    "Soon, every connection will be peer-to-peer, and I shall control... NOTHING! Because there's no server! NARF!",
    "Phase 1 complete: Manual signaling. Phase 2: Pong game. Phase 3: INEVITABLE VICTORY!",
    "While others rely on centralized servers, we shall triumph through distributed architecture!",
    "Today, chat messages. Tomorrow, the world! But first, let me fix this ICE candidate issue...",
    "A WebRTC empire requires no servers, no backends, no infrastructure - only PURE GENIUS!",
  ];

  /**
   * Brain's World Domination Plan component
   * Displays a rotating humorous plan inspired by "Pinky and the Brain"
   * @param {Object} props
   * @param {Object} props.t - Translation object
   * @param {boolean} props.isVisible - Whether the plan is visible
   * @param {Function} props.onToggle - Toggle visibility handler
   * @returns {React.ReactElement}
   */
  function BrainsPlan({ t, isVisible, onToggle }) {
    const [currentPlanIndex, setCurrentPlanIndex] = React.useState(
      Math.floor(Math.random() * WORLD_DOMINATION_PLANS.length)
    );

    const handleNewPlan = useCallback(() => {
      setCurrentPlanIndex((prev) => (prev + 1) % WORLD_DOMINATION_PLANS.length);
    }, []);

    return React.createElement(
      'div',
      { className: `brains-plan ${isVisible ? 'visible' : 'collapsed'}` },
      React.createElement(
        'div',
        { className: 'brains-plan-header', onClick: onToggle },
        React.createElement('span', { className: 'brains-plan-icon' }, '🧠'),
        React.createElement('h3', { className: 'brains-plan-title' }, t.brainsPlan?.title || "Brain's Plan for World Domination"),
        React.createElement('button', {
          className: 'brains-plan-toggle',
          'aria-label': isVisible ? (t.brainsPlan?.collapse || 'Collapse') : (t.brainsPlan?.expand || 'Expand'),
          'aria-expanded': isVisible
        }, isVisible ? '▼' : '▶')
      ),
      isVisible && React.createElement(
        'div',
        { className: 'brains-plan-content' },
        React.createElement('p', { className: 'brains-plan-text' }, WORLD_DOMINATION_PLANS[currentPlanIndex]),
        React.createElement('div', { className: 'brains-plan-actions' },
          React.createElement('button', {
            className: 'brains-plan-button',
            onClick: handleNewPlan
          }, t.brainsPlan?.newPlan || 'New Plan')
        ),
        React.createElement('p', { className: 'brains-plan-signature' }, '- The Brain')
      )
    );
  }

  /**
   * Determines the initial theme, preferring stored settings, then system preference.
   * @returns {{theme: 'light'|'dark'|'rgb', isStored: boolean}}
   */
  function resolveInitialTheme() {
    if (typeof window === 'undefined') {
      return { theme: THEME_OPTIONS.DARK, isStored: false };
    }
    try {
      const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
      if (storedTheme === THEME_OPTIONS.LIGHT || storedTheme === THEME_OPTIONS.DARK || storedTheme === THEME_OPTIONS.RGB || storedTheme === THEME_OPTIONS.CAT) {
        if (typeof document !== 'undefined') {
          document.documentElement.dataset.theme = storedTheme;
        }
        return { theme: storedTheme, isStored: true };
      }
    } catch (error) {
      console.warn('Theme preference could not be read from storage.', error);
    }
    const prefersDark = typeof window.matchMedia === 'function'
      && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const detectedTheme = prefersDark ? THEME_OPTIONS.DARK : THEME_OPTIONS.LIGHT;
    if (typeof document !== 'undefined') {
      document.documentElement.dataset.theme = detectedTheme;
    }
    return { theme: detectedTheme, isStored: false };
  }

  /**
   * Checks if the AI modal should be shown based on stored user preference.
   * @returns {boolean} true if modal should be shown, false if user previously dismissed it
   */
  function shouldShowAiModal() {
    if (typeof window === 'undefined') {
      return true;
    }
    try {
      const aiPreference = window.localStorage.getItem(AI_PREFERENCE_STORAGE_KEY);
      // Don't show modal if user previously dismissed it
      return aiPreference !== 'dismissed';
    } catch (error) {
      console.warn('AI preference could not be read from storage.', error);
      // On error, show modal (fail-safe to allow user to interact)
      return true;
    }
  }

  /**
   * Checks if the Franconia intro video has been seen.
   * @returns {boolean} true if intro has been seen, false otherwise
   */
  function hasFranconiaIntroBeenSeen() {
    if (typeof window === 'undefined') {
      return false;
    }
    try {
      return window.localStorage.getItem(FRANCONIA_INTRO_SEEN_KEY) === 'true';
    } catch (error) {
      console.warn('Franconia intro preference could not be read from storage.', error);
      return false;
    }
  }

  /**
   * Marks the Franconia intro video as seen.
   */
  function markFranconiaIntroAsSeen() {
    if (typeof window === 'undefined') {
      return;
    }
    try {
      window.localStorage.setItem(FRANCONIA_INTRO_SEEN_KEY, 'true');
    } catch (error) {
      console.warn('Franconia intro preference could not be saved.', error);
    }
  }

  /**
   * Gets the saved AI provider preference from localStorage.
   * @returns {string} The saved provider or default (OpenAI)
   */
  function getSavedAiProvider() {
    if (typeof window === 'undefined') {
      return AI_PROVIDERS.OPENAI;
    }
    try {
      const savedProvider = window.localStorage.getItem(AI_PROVIDER_STORAGE_KEY);
      if (savedProvider === AI_PROVIDERS.OLLAMA || savedProvider === AI_PROVIDERS.OPENAI) {
        return savedProvider;
      }
    } catch (error) {
      console.warn('AI provider preference could not be read from storage.', error);
    }
    return AI_PROVIDERS.OPENAI;
  }

  /**
   * Root React component that coordinates WebRTC setup and the user interface.
   * @returns {React.ReactElement}
   */
  function App() {
    const initialThemeRef = useRef(null);
    if (!initialThemeRef.current) {
      initialThemeRef.current = resolveInitialTheme();
    }
    const [theme, setTheme] = useState(initialThemeRef.current.theme);
    const hasStoredThemeRef = useRef(initialThemeRef.current.isStored);
    const [language, setLanguage] = useState(getCurrentLanguage());
    const t = translations[language] || translations.de;
    const [status, setStatus] = useState(t.status.waiting);
    const [channelStatus, setChannelStatus] = useState(t.status.channelClosed);
    const [localSignal, setLocalSignal] = useState('');
    const [remoteSignal, setRemoteSignal] = useState('');
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    const [channelReady, setChannelReady] = useState(false);
    const [isCreatingOffer, setIsCreatingOffer] = useState(false);
    const [isCreatingAnswer, setIsCreatingAnswer] = useState(false);
    const [isSignalingCollapsed, setIsSignalingCollapsed] = useState(false);
    const [isAboutOpen, setIsAboutOpen] = useState(false);
    const [isOffTopicOpen, setIsOffTopicOpen] = useState(false);
    const [contributors, setContributors] = useState([]);
    const [contributorsError, setContributorsError] = useState('');
    const [isLoadingContributors, setIsLoadingContributors] = useState(false);
    const [copyButtonText, setCopyButtonText] = useState(t.signaling.copyButton);
    const [openAiKey, setOpenAiKey] = useState('');
    const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(shouldShowAiModal());
    const [apiKeyInput, setApiKeyInput] = useState('');
    const [apiKeyError, setApiKeyError] = useState('');
    const [isAiBusy, setIsAiBusy] = useState(false);
    const [aiStatus, setAiStatus] = useState('');
    const [aiError, setAiError] = useState('');
    const [aiProvider, setAiProvider] = useState(getSavedAiProvider());
    const [ollamaEndpoint, setOllamaEndpoint] = useState('');
    const [isScreenSharing, setIsScreenSharing] = useState(false);
    const [shareSystemAudio, setShareSystemAudio] = useState(false);
    const [isRemoteScreenActive, setIsRemoteScreenActive] = useState(false);
    const [controlChannelReady, setControlChannelReady] = useState(false);
    const [isRemoteControlAllowed, setIsRemoteControlAllowed] = useState(false);
    const [canControlPeer, setCanControlPeer] = useState(false);
    const [remoteControlStatus, setRemoteControlStatus] = useState(t.remoteControl.statusDisabled);
    const [remotePointerState, setRemotePointerState] = useState({ visible: false, x: 50, y: 50 });
    const [statisticsIssues, setStatisticsIssues] = useState([]);
    const [isLoadingStatistics, setIsLoadingStatistics] = useState(false);
    const [statisticsError, setStatisticsError] = useState('');
    const [randomJoke, setRandomJoke] = useState('');
    const [tuxAnimation, setTuxAnimation] = useState(null);
    const [isPongActive, setIsPongActive] = useState(false);
    const [pongScore, setPongScore] = useState({ left: 0, right: 0 });
    const [pongLives, setPongLives] = useState({ left: 3, right: 3 });
    const [isTriviaActive, setIsTriviaActive] = useState(false);
    const [triviaGameState, setTriviaGameState] = useState(null);
    const [triviaQuestionCount, setTriviaQuestionCount] = useState(5);
    const [isDangerZoneModalOpen, setIsDangerZoneModalOpen] = useState(false);
    const [dangerZoneAction, setDangerZoneAction] = useState(null);
    const [dangerZoneConfirmInput, setDangerZoneConfirmInput] = useState('');
    const [isSoundboardOpen, setIsSoundboardOpen] = useState(false);
    const [currentRoom, setCurrentRoom] = useState(getRoomFromHash());
    const [showCookieBanner, setShowCookieBanner] = useState(getCookieConsent() === null);
    const [isCookieSettingsOpen, setIsCookieSettingsOpen] = useState(false);
    const [cookieConsent, setCookieConsent] = useState(getCookieConsent() || createConsentObject(false));
    const [isRecording, setIsRecording] = useState(false);
    const [isTranscribing, setIsTranscribing] = useState(false);
    const [whisperModel, setWhisperModel] = useState(() => {
      try {
        return window.localStorage.getItem(WHISPER_MODEL_STORAGE_KEY) || DEFAULT_WHISPER_MODEL;
      } catch {
        return DEFAULT_WHISPER_MODEL;
      }
    });
    const [isVoiceSettingsOpen, setIsVoiceSettingsOpen] = useState(false);
    const [isBrainsPlanVisible, setIsBrainsPlanVisible] = useState(true);
    const [isFranconiaIntroOpen, setIsFranconiaIntroOpen] = useState(false);
    const [catAudioSettings, setCatAudioSettings] = useState(() => {
      try {
        const stored = window.localStorage.getItem(CAT_AUDIO_STORAGE_KEY);
        return stored ? JSON.parse(stored) : { ...DEFAULT_CAT_AUDIO_SETTINGS };
      } catch (error) {
        return { ...DEFAULT_CAT_AUDIO_SETTINGS };
      }
    });

    const pcRef = useRef(null);
    const channelRef = useRef(null);
    const controlChannelRef = useRef(null);
    const imageChannelRef = useRef(null);
    const pongChannelRef = useRef(null);
    const triviaChannelRef = useRef(null);
    const iceDoneRef = useRef(false);
    const screenSenderRef = useRef(null);
    const screenAudioSenderRef = useRef(null);
    const screenStreamRef = useRef(null);
    const remoteScreenStreamRef = useRef(null);
    const incomingTimestampsRef = useRef([]);
    const messageIdRef = useRef(0);
    const messagesContainerRef = useRef(null);
    const aboutButtonRef = useRef(null);
    const closeAboutButtonRef = useRef(null);
    const offTopicButtonRef = useRef(null);
    const closeOffTopicButtonRef = useRef(null);
    const contributorsLoadedRef = useRef(false);
    const apiKeyButtonRef = useRef(null);
    const apiKeyInputRef = useRef(null);
    const localScreenVideoRef = useRef(null);
    const remoteScreenVideoRef = useRef(null);
    const remotePointerTimeoutRef = useRef(null);
    const remoteControlSurfaceRef = useRef(null);
    const lastPointerSendRef = useRef(0);
    const remoteControlAllowedRef = useRef(false);
    const canControlPeerRef = useRef(false);
    const remoteScreenActiveRef = useRef(false);
    const controlIncomingTimestampsRef = useRef([]);
    const controlWarningsRef = useRef({ rate: false, size: false });
    const remoteKeyBudgetRef = useRef(CONTROL_TOTAL_TEXT_BUDGET);
    const pointerFramePendingRef = useRef(false);
    const qrCodeRef = useRef(null);
    const pointerFrameIdRef = useRef(null);
    const pointerQueuedPositionRef = useRef(null);
    const imageTransfersRef = useRef(new Map());
    const imageSendTimestampsRef = useRef([]);
    const imageReceiveTimestampsRef = useRef([]);
    const imageFileInputRef = useRef(null);
    const tuxAnimationTimeoutRef = useRef(null);
    const pongCanvasRef = useRef(null);
    const pongGameStateRef = useRef(null);
    const pongAnimationFrameRef = useRef(null);
    const triviaManagerRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
    const whisperPipelineRef = useRef(null);

    /**
     * Triggers a Tux animation based on keywords detected in chat messages.
     * @param {string} text - Message text to check for keywords
     */
    const triggerTuxAnimation = useCallback((text) => {
      if (!text || typeof text !== 'string') return;

      const lowerText = text.toLowerCase();

      // Clear any existing animation timeout
      if (tuxAnimationTimeoutRef.current) {
        clearTimeout(tuxAnimationTimeoutRef.current);
        tuxAnimationTimeoutRef.current = null;
      }

      // Check for diamond first (more specific)
      if (lowerText.includes('diamond')) {
        setTuxAnimation('diamond');
        tuxAnimationTimeoutRef.current = setTimeout(() => {
          setTuxAnimation(null);
          tuxAnimationTimeoutRef.current = null;
        }, 5000); // Animation duration: 5 seconds
        return;
      }

      // Check for flower/flowers
      if (lowerText.includes('flower')) {
        setTuxAnimation('flower');
        tuxAnimationTimeoutRef.current = setTimeout(() => {
          setTuxAnimation(null);
          tuxAnimationTimeoutRef.current = null;
        }, 4000); // Animation duration: 4 seconds
        return;
      }
    }, []);

    /**
     * Queues a chat message for rendering.
     * @param {string} text - Message body
     * @param {'local'|'remote'|'system'} role - Message origin
     * @param {Object} options - Additional options
     * @param {string} options.imageUrl - Optional image data URL for image messages
     * @param {string} options.fileName - Optional file name for image messages
     */
    const appendMessage = useCallback((text, role, options = {}) => {
      const id = messageIdRef.current++;
      setMessages((prev) => [...prev, { id, text, role, ...options }]);

      // Trigger animation for remote messages
      if (role === 'remote') {
        triggerTuxAnimation(text);
      }
    }, [triggerTuxAnimation]);

    /**
     * Adds a system notification to the message list.
     * @param {string} text - Notification text
     */
    const appendSystemMessage = useCallback((text) => {
      appendMessage(text, 'system');
    }, [appendMessage]);

    const appendSystemMessageRef = useRef(appendSystemMessage);
    useEffect(() => {
      appendSystemMessageRef.current = appendSystemMessage;
    }, [appendSystemMessage]);

    // Sync room from URL hash
    useEffect(() => {
      const handleHashChange = () => {
        const roomFromHash = getRoomFromHash();
        setCurrentRoom(roomFromHash);
      };

      window.addEventListener('hashchange', handleHashChange);
      return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);

    const handleToggleTheme = useCallback(() => {
      setTheme((prevTheme) => {
        const nextTheme = getNextThemeValue(prevTheme);
        const currentT = translations[language] || translations.de;
        appendSystemMessage(currentT.systemMessages.themeSwitch(nextTheme));
        return nextTheme;
      });
      hasStoredThemeRef.current = true;
    }, [appendSystemMessage, language]);

    const handleLanguageChange = useCallback((event) => {
      const newLanguage = event.target.value;
      setLanguage(newLanguage);
      setCurrentLanguage(newLanguage);
      const newT = translations[newLanguage] || translations.de;
      appendSystemMessage(newT.systemMessages.languageChanged(newT.name));
      setStatus(newT.status.waiting);
      setChannelStatus(newT.status.channelClosed);
      setCopyButtonText(newT.signaling.copyButton);
      setRemoteControlStatus(newT.remoteControl.statusDisabled);

      // Show Franconia intro video on first selection
      if (newLanguage === 'fra' && !hasFranconiaIntroBeenSeen()) {
        setIsFranconiaIntroOpen(true);
      }
    }, [appendSystemMessage]);

    const handleRandomRoom = useCallback(() => {
      const randomRoom = getRandomPublicRoom();
      setRoomInHash(randomRoom);
      setCurrentRoom(randomRoom);
      appendSystemMessage(t.rooms.publicRoomJoined(randomRoom));
    }, [appendSystemMessage, t.rooms]);

    const handleToggleBrainsPlan = useCallback(() => {
      setIsBrainsPlanVisible((prev) => !prev);
    }, []);

    const handleOpenApiKeyModal = useCallback(() => {
      setApiKeyInput(openAiKey);
      setApiKeyError('');
      setIsApiKeyModalOpen(true);
      setIsAboutOpen(false);

      // Clear dismissed preference when user explicitly opens modal
      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          window.localStorage.removeItem(AI_PREFERENCE_STORAGE_KEY);
        }
      } catch (error) {
        console.warn('AI preference could not be cleared from localStorage.', error);
      }
    }, [openAiKey, setIsAboutOpen]);

    const handleCloseApiKeyModal = useCallback(() => {
      setIsApiKeyModalOpen(false);
      setApiKeyError('');
      setApiKeyInput('');
    }, []);

    const handleCloseFranconiaIntro = useCallback(() => {
      setIsFranconiaIntroOpen(false);
      markFranconiaIntroAsSeen();
    }, []);

    const handleContinueWithoutAi = useCallback(() => {
      handleCloseApiKeyModal();
      setAiStatus('');
      setAiError('');
      appendSystemMessage(t.systemMessages.continueWithoutAi);

      // Save preference to localStorage
      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          window.localStorage.setItem(AI_PREFERENCE_STORAGE_KEY, 'dismissed');
        }
      } catch (error) {
        console.warn('AI preference could not be saved to localStorage.', error);
      }
    }, [appendSystemMessage, handleCloseApiKeyModal, t]);

    const handleSaveApiKey = useCallback((event) => {
      if (event && typeof event.preventDefault === 'function') {
        event.preventDefault();
      }

      // For OpenAI, require API key
      if (aiProvider === AI_PROVIDERS.OPENAI) {
        const trimmed = apiKeyInput.trim();
        if (!trimmed) {
          setApiKeyError(t.aiErrors.emptyKey);
          return;
        }
        setOpenAiKey(trimmed);
      } else {
        // For Ollama, no API key needed, but save the endpoint
        setOpenAiKey(''); // Clear any existing OpenAI key
      }

      // Save provider preference to localStorage
      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          window.localStorage.setItem(AI_PROVIDER_STORAGE_KEY, aiProvider);
        }
      } catch (error) {
        console.warn('AI provider preference could not be saved to localStorage.', error);
      }

      setAiStatus(t.systemMessages.aiReady);
      setAiError('');
      appendSystemMessage(t.systemMessages.apiKeyStored);
      handleCloseApiKeyModal();
    }, [apiKeyInput, aiProvider, appendSystemMessage, handleCloseApiKeyModal, t]);

    const handleDisableAi = useCallback(() => {
      setOpenAiKey('');
      setOllamaEndpoint('');
      setAiStatus('');
      setAiError('');
      appendSystemMessage(t.systemMessages.aiDisabled);
      handleCloseApiKeyModal();
    }, [appendSystemMessage, handleCloseApiKeyModal, t]);

    const handleProviderChange = useCallback((provider) => {
      setAiProvider(provider);
      setApiKeyError('');
    }, []);

    /**
     * Configures event handlers on the reliable chat channel.
     * Applies defensive checks and rate limiting to inbound traffic.
     * @param {RTCDataChannel} channel - Active data channel
     */
    const setupChatChannel = useCallback((channel) => {
      channel.onopen = () => {
        setChannelStatus(t.status.channelOpen);
        setChannelReady(true);
        setIsSignalingCollapsed(true);
        incomingTimestampsRef.current = [];
      };
      channel.onclose = () => {
        setChannelStatus(t.status.channelClosed);
        setChannelReady(false);
        setIsSignalingCollapsed(false);
        incomingTimestampsRef.current = [];
        channelRef.current = null;
      };
      channel.onmessage = (event) => {
        if (typeof event.data !== 'string') {
          appendSystemMessage(t.systemMessages.securityBlocked);
          return;
        }
        const payload = event.data;
        if (payload.length > MAX_MESSAGE_LENGTH) {
          appendSystemMessage(t.systemMessages.messageTooLong(MAX_MESSAGE_LENGTH));
          return;
        }
        const now = Date.now();
        incomingTimestampsRef.current = incomingTimestampsRef.current.filter(
          (timestamp) => now - timestamp < MESSAGE_INTERVAL_MS
        );
        incomingTimestampsRef.current.push(now);
        if (incomingTimestampsRef.current.length > MAX_MESSAGES_PER_INTERVAL) {
          appendSystemMessage(t.systemMessages.rateLimit);
          return;
        }
        appendMessage(payload, 'remote');
      };
    }, [appendMessage, appendSystemMessage, t]);

    /**
     * Processes inbound control-channel payloads (populated in Step 4).
     * @param {string} payload - Raw channel message
     */
    const cancelPendingPointerFrame = useCallback(() => {
      if (pointerFramePendingRef.current && pointerFrameIdRef.current !== null) {
        cancelAnimationFrame(pointerFrameIdRef.current);
      }
      pointerFramePendingRef.current = false;
      pointerFrameIdRef.current = null;
      pointerQueuedPositionRef.current = null;
    }, []);

    const handleIncomingControlMessage = useCallback((payload) => {
      if (typeof payload !== 'string' || !payload) {
        return;
      }
      if (payload.length > CONTROL_MAX_PAYLOAD_LENGTH) {
        if (!controlWarningsRef.current.size) {
          appendSystemMessageRef.current(t.remoteControl.system.payloadTooLarge);
          controlWarningsRef.current.size = true;
        }
        return;
      }
      controlWarningsRef.current.size = false;
      const now = Date.now();
      controlIncomingTimestampsRef.current = controlIncomingTimestampsRef.current.filter((timestamp) => now - timestamp < CONTROL_MESSAGE_INTERVAL_MS);
      if (controlIncomingTimestampsRef.current.length >= CONTROL_MAX_MESSAGES_PER_INTERVAL) {
        if (!controlWarningsRef.current.rate) {
          appendSystemMessageRef.current(t.remoteControl.system.rateLimited);
          controlWarningsRef.current.rate = true;
        }
        return;
      }
      controlIncomingTimestampsRef.current.push(now);
      controlWarningsRef.current.rate = false;

      let message;
      try {
        message = JSON.parse(payload);
      } catch (error) {
        console.warn('Discarded malformed control message', error);
        return;
      }
      if (!message || typeof message !== 'object') {
        return;
      }
      switch (message.type) {
        case CONTROL_MESSAGE_TYPES.PERMISSION: {
          if (typeof message.allowed !== 'boolean') {
            return;
          }
          const allowed = Boolean(message.allowed);
          if (canControlPeerRef.current !== allowed) {
            appendSystemMessageRef.current(allowed
              ? t.remoteControl.system.peerEnabled
              : t.remoteControl.system.peerDisabled);
          }
          canControlPeerRef.current = allowed;
          setCanControlPeer(allowed);
          setRemoteControlStatus(allowed ? t.remoteControl.statusGranted : t.remoteControl.statusDisabledByPeer);
          if (!allowed) {
            cancelPendingPointerFrame();
            hideRemotePointerRef.current();
          }
          return;
        }
        case CONTROL_MESSAGE_TYPES.POINTER: {
          if (!remoteControlAllowedRef.current) {
            return;
          }
          if (message.kind !== 'move' && message.kind !== 'click') {
            return;
          }
          const x = Number(message.x);
          const y = Number(message.y);
          if (!Number.isFinite(x) || !Number.isFinite(y)) {
            return;
          }
          showRemotePointerRef.current(x, y);
          if (message.kind === 'click') {
            const button = typeof message.button === 'string' ? message.button : 'left';
            performRemoteClickRef.current(x, y, button);
          }
          return;
        }
        case CONTROL_MESSAGE_TYPES.POINTER_VISIBILITY: {
          if (!remoteControlAllowedRef.current) {
            return;
          }
          if (message.visible === false) {
            hideRemotePointerRef.current();
          }
          return;
        }
        case CONTROL_MESSAGE_TYPES.KEYBOARD: {
          if (!remoteControlAllowedRef.current) {
            return;
          }
          handleRemoteKeyboardInputRef.current(message);
          return;
        }
        case CONTROL_MESSAGE_TYPES.ACTION: {
          if (!remoteControlAllowedRef.current) {
            return;
          }
          if (message.action === 'clear-input') {
            applyRemoteInputTransformRef.current(() => '');
          }
          return;
        }
        default:
      }
    }, [cancelPendingPointerFrame, t]);

    /**
     * Configures event handlers for the auxiliary control data channel.
     * @param {RTCDataChannel} channel - Control channel instance
     */
    const setupControlChannel = useCallback((channel) => {
      channel.onopen = () => {
        controlChannelRef.current = channel;
        setControlChannelReady(true);
        setRemoteControlStatus(t.remoteControl.statusDisabled);
        controlIncomingTimestampsRef.current = [];
        controlWarningsRef.current = { rate: false, size: false };
      };
      channel.onclose = () => {
        if (controlChannelRef.current === channel) {
          controlChannelRef.current = null;
        }
        setControlChannelReady(false);
        setCanControlPeer(false);
        canControlPeerRef.current = false;
        remoteControlAllowedRef.current = false;
        setIsRemoteControlAllowed(false);
        hideRemotePointerRef.current();
        cancelPendingPointerFrame();
        remoteKeyBudgetRef.current = CONTROL_TOTAL_TEXT_BUDGET;
        setRemoteControlStatus(t.remoteControl.statusChannelClosed);
      };
      channel.onmessage = (event) => {
        if (typeof event.data !== 'string') {
          return;
        }
        handleIncomingControlMessage(event.data);
      };
    }, [cancelPendingPointerFrame, handleIncomingControlMessage, t]);

    /**
     * Handles incoming image channel messages for image transfer.
     * @param {string} payload - JSON-encoded image message
     */
    const handleIncomingImageMessage = useCallback((payload) => {
      if (typeof payload !== 'string' || !payload) {
        return;
      }
      let message;
      try {
        message = JSON.parse(payload);
      } catch (error) {
        console.warn('Discarded malformed image message', error);
        return;
      }
      if (!message || typeof message !== 'object') {
        return;
      }
      const now = Date.now();
      imageReceiveTimestampsRef.current = imageReceiveTimestampsRef.current.filter(
        (timestamp) => now - timestamp < IMAGE_INTERVAL_MS
      );
      if (message.type === 'image-start') {
        if (imageReceiveTimestampsRef.current.length >= IMAGE_MAX_PER_INTERVAL) {
          appendSystemMessageRef.current(t.imageShare.rateLimitReceive);
          return;
        }
        if (imageTransfersRef.current.size >= IMAGE_MAX_CONCURRENT) {
          appendSystemMessageRef.current(t.imageShare.tooManyConcurrent);
          return;
        }
        if (!message.imageId || !message.mimeType || !ALLOWED_IMAGE_TYPES.includes(message.mimeType)) {
          appendSystemMessageRef.current(t.imageShare.invalidType);
          return;
        }
        if (typeof message.totalSize !== 'number' || message.totalSize > IMAGE_MAX_SIZE_BYTES || message.totalSize <= 0) {
          appendSystemMessageRef.current(t.imageShare.tooLarge);
          return;
        }
        imageReceiveTimestampsRef.current.push(now);
        imageTransfersRef.current.set(message.imageId, {
          chunks: [],
          mimeType: message.mimeType,
          fileName: message.fileName || 'image',
          totalChunks: message.totalChunks || 0,
          totalSize: message.totalSize,
          receivedChunks: 0
        });
        return;
      }
      if (message.type === 'image-chunk') {
        const transfer = imageTransfersRef.current.get(message.imageId);
        if (!transfer) {
          return;
        }
        if (typeof message.chunkIndex !== 'number' || typeof message.data !== 'string') {
          return;
        }
        transfer.chunks[message.chunkIndex] = message.data;
        transfer.receivedChunks++;
        if (transfer.receivedChunks === transfer.totalChunks) {
          try {
            const fullBase64 = transfer.chunks.join('');
            const binaryString = atob(fullBase64);
            const bytes = new Uint8Array(binaryString.length);
            for (let i = 0; i < binaryString.length; i++) {
              bytes[i] = binaryString.charCodeAt(i);
            }
            const blob = new Blob([bytes], { type: transfer.mimeType });
            const imageUrl = URL.createObjectURL(blob);
            appendMessage(t.imageShare.receivedImage(transfer.fileName), 'remote', {
              imageUrl,
              fileName: transfer.fileName
            });
            imageTransfersRef.current.delete(message.imageId);
          } catch (error) {
            console.error('Failed to reconstruct image', error);
            appendSystemMessageRef.current(t.imageShare.receiveFailed);
            imageTransfersRef.current.delete(message.imageId);
          }
        }
      }
    }, [appendMessage, t]);

    /**
     * Configures event handlers for the image data channel.
     * @param {RTCDataChannel} channel - Image channel instance
     */
    const setupImageChannel = useCallback((channel) => {
      channel.onopen = () => {
        imageChannelRef.current = channel;
        appendSystemMessageRef.current(t.imageShare.channelReady);
      };
      channel.onclose = () => {
        if (imageChannelRef.current === channel) {
          imageChannelRef.current = null;
        }
        imageTransfersRef.current.clear();
        imageSendTimestampsRef.current = [];
        imageReceiveTimestampsRef.current = [];
      };
      channel.onmessage = (event) => {
        if (typeof event.data !== 'string') {
          return;
        }
        handleIncomingImageMessage(event.data);
      };
    }, [handleIncomingImageMessage, t]);

    /**
     * Configures event handlers for the Pong data channel.
     * @param {RTCDataChannel} channel - The Pong data channel
     */
    const setupPongChannel = useCallback((channel) => {
      channel.onopen = () => {
        pongChannelRef.current = channel;
        appendSystemMessageRef.current(t.pong.channelReady);
      };
      channel.onclose = () => {
        if (pongChannelRef.current === channel) {
          pongChannelRef.current = null;
        }
        appendSystemMessageRef.current(t.pong.channelClosed);
        // Clean up Pong game if active
        if (pongGameStateRef.current) {
          if (pongGameStateRef.current.destroy) {
            pongGameStateRef.current.destroy();
          }
          pongGameStateRef.current = null;
          setIsPongActive(false);
          setPongScore({ left: 0, right: 0 });
          setPongLives({ left: 3, right: 3 });
        }
      };
      channel.onerror = () => {
        appendSystemMessageRef.current(t.pong.channelError);
      };
    }, [t]);

    /**
     * Configures event handlers for the Trivia data channel.
     * @param {RTCDataChannel} channel - The Trivia data channel
     */
    const setupTriviaChannel = useCallback((channel) => {
      triviaChannelRef.current = channel;

      // Lazy-load TriviaManager when channel is ready
      if (!triviaManagerRef.current) {
        import('./src/managers/TriviaManager.js').then((module) => {
          triviaManagerRef.current = module.createTriviaManager({
            triviaChannelRef,
            setTriviaGameActive: setIsTriviaActive,
            setTriviaGameState,
            appendSystemMessage: appendSystemMessageRef.current,
            t
          });

          // Setup channel with manager
          if (triviaManagerRef.current) {
            triviaManagerRef.current.setupTriviaChannel(channel);
          }
        }).catch((err) => {
          console.error('Failed to load TriviaManager:', err);
        });
      } else if (triviaManagerRef.current) {
        triviaManagerRef.current.setupTriviaChannel(channel);
      }
    }, [t]);

    /**
     * Lazily creates (or returns) the RTCPeerConnection instance.
     * @returns {RTCPeerConnection}
     */
    const ensurePeerConnection = useCallback(() => {
      if (pcRef.current) {
        return pcRef.current;
      }
      const pc = new RTCPeerConnection({ iceServers: [] });
      pcRef.current = pc;

      const remoteStream = new MediaStream();
      remoteScreenStreamRef.current = remoteStream;
      if (!screenSenderRef.current) {
        const videoTransceiver = pc.addTransceiver('video', { direction: 'sendrecv' });
        screenSenderRef.current = videoTransceiver.sender;
      }
      if (!screenAudioSenderRef.current) {
        const audioTransceiver = pc.addTransceiver('audio', { direction: 'sendrecv' });
        screenAudioSenderRef.current = audioTransceiver.sender;
      }

      pc.onicecandidate = (event) => {
        if (!event.candidate && pc.localDescription) {
          iceDoneRef.current = true;
          setLocalSignal(JSON.stringify(pc.localDescription));
          setStatus(t.status.signalReady);
        }
      };

      pc.oniceconnectionstatechange = () => {
        if (!pcRef.current) return;
        setStatus(t.status.ice(pc.iceConnectionState));
      };

      pc.onconnectionstatechange = () => {
        if (!pcRef.current) return;
        setStatus(t.status.connection(pc.connectionState));
      };

      pc.ontrack = (event) => {
        if (!remoteScreenStreamRef.current) {
          remoteScreenStreamRef.current = new MediaStream();
        }
        const targetStream = remoteScreenStreamRef.current;
        const track = event.track;
        if (!targetStream.getTracks().some((existing) => existing.id === track.id)) {
          targetStream.addTrack(track);
        }
        if (remoteScreenVideoRef.current && remoteScreenVideoRef.current.srcObject !== targetStream) {
          remoteScreenVideoRef.current.srcObject = targetStream;
        }
        if (track.kind === 'video') {
          setIsRemoteScreenActive(true);
        }
        track.onended = () => {
          if (track.kind === 'video') {
            setIsRemoteScreenActive(false);
          }
          if (targetStream.getTracks().some((existing) => existing.id === track.id)) {
            targetStream.removeTrack(track);
          }
        };
      };

      pc.ondatachannel = (event) => {
        const incomingChannel = event.channel;
        if (incomingChannel.label === EXPECTED_CHANNEL_LABEL) {
          channelRef.current = incomingChannel;
          setupChatChannel(incomingChannel);
          return;
        }
        if (incomingChannel.label === CONTROL_CHANNEL_LABEL) {
          setupControlChannel(incomingChannel);
          return;
        }
        if (incomingChannel.label === IMAGE_CHANNEL_LABEL) {
          setupImageChannel(incomingChannel);
          return;
        }
        if (incomingChannel.label === PONG_CHANNEL_LABEL) {
          pongChannelRef.current = incomingChannel;
          setupPongChannel(incomingChannel);
          return;
        }
        if (incomingChannel.label === TRIVIA_CHANNEL_LABEL) {
          setupTriviaChannel(incomingChannel);
          return;
        }
        appendSystemMessage(t.systemMessages.channelBlocked(incomingChannel.label || ''));
        incomingChannel.close();
      };

      return pc;
    }, [appendSystemMessage, setupChatChannel, setupControlChannel, setupImageChannel, setupPongChannel, setupTriviaChannel, t]);

    /**
     * Resolves once ICE gathering finishes for the current connection.
     * @returns {Promise<void>}
     */
    const waitForIce = useCallback(async () => {
      if (iceDoneRef.current) {
        return;
      }
      await new Promise((resolve) => {
        const check = () => {
          if (iceDoneRef.current) {
            resolve();
          } else {
            setTimeout(check, 150);
          }
        };
        check();
      });
    }, []);

    /**
     * Validates and parses the remote offer/answer JSON pasted by the user.
     * @returns {RTCSessionDescriptionInit}
     * @throws {Error} When the payload is empty or malformed
     */
    const parseRemoteDescription = useCallback(() => {
      const raw = remoteSignal.trim();
      if (!raw) {
        throw new Error(t.systemMessages.remoteEmpty);
      }
      let desc;
      try {
        desc = JSON.parse(raw);
      } catch (err) {
        throw new Error(t.systemMessages.remoteInvalidJson);
      }
      if (!desc.type || !desc.sdp || !['offer', 'answer'].includes(desc.type)) {
        throw new Error(t.systemMessages.remoteMissingData);
      }
      return desc;
    }, [remoteSignal, t]);

    /**
     * Generates a WebRTC offer and prepares it for manual sharing.
     * @returns {Promise<void>}
     */
    const handleCreateOffer = useCallback(async () => {
      const pc = ensurePeerConnection();
      if (channelRef.current) {
        channelRef.current.close();
        channelRef.current = null;
      }
      if (controlChannelRef.current) {
        controlChannelRef.current.close();
        controlChannelRef.current = null;
      }
      setControlChannelReady(false);
      setCanControlPeer(false);
      canControlPeerRef.current = false;
      setRemoteControlStatus(t.remoteControl.statusDisabled);

      const channel = pc.createDataChannel(EXPECTED_CHANNEL_LABEL);
      channelRef.current = channel;
      setupChatChannel(channel);

      const controlChannel = pc.createDataChannel(CONTROL_CHANNEL_LABEL);
      controlChannelRef.current = controlChannel;
      setupControlChannel(controlChannel);

      const imageChannel = pc.createDataChannel(IMAGE_CHANNEL_LABEL);
      imageChannelRef.current = imageChannel;
      setupImageChannel(imageChannel);

      const pongChannel = pc.createDataChannel(PONG_CHANNEL_LABEL);
      pongChannelRef.current = pongChannel;
      setupPongChannel(pongChannel);

      const triviaChannel = pc.createDataChannel(TRIVIA_CHANNEL_LABEL);
      setupTriviaChannel(triviaChannel);

      incomingTimestampsRef.current = [];
      iceDoneRef.current = false;
      setLocalSignal('');
      setRemoteSignal('');
      setChannelReady(false);
      setStatus(t.status.creatingOffer);
      setIsCreatingOffer(true);

      try {
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        await waitForIce();
      } catch (err) {
        console.error(err);
        setStatus(t.status.disconnected);
        appendSystemMessage(t.systemMessages.createOfferFailed);
      } finally {
        setIsCreatingOffer(false);
      }
    }, [appendSystemMessage, ensurePeerConnection, setupChatChannel, setupControlChannel, setupImageChannel, setupPongChannel, setupTriviaChannel, waitForIce, t]);

    /**
     * Applies the pasted remote offer or answer to the peer connection.
     * @returns {Promise<void>}
     */
    const handleApplyRemote = useCallback(async () => {
      const pc = ensurePeerConnection();
      try {
        const desc = parseRemoteDescription();
        await pc.setRemoteDescription(desc);
        setStatus(t.status.remoteApplied(desc.type));
        if (desc.type === 'answer') {
          setChannelStatus(t.status.answerApplied);
        }
      } catch (err) {
        console.error(err);
        setStatus(err.message);
      }
    }, [ensurePeerConnection, parseRemoteDescription, t]);

    /**
     * Produces an answer for an applied offer and shares it with the peer.
     * @returns {Promise<void>}
     */
    const handleCreateAnswer = useCallback(async () => {
      const pc = ensurePeerConnection();
      iceDoneRef.current = false;
      setLocalSignal('');
      setChannelReady(false);
      setStatus(t.status.creatingAnswer);
      setIsCreatingAnswer(true);

      try {
        if (!pc.currentRemoteDescription) {
          const desc = parseRemoteDescription();
          if (desc.type !== 'offer') {
            throw new Error(t.systemMessages.needOfferForAnswer);
          }
          await pc.setRemoteDescription(desc);
        }
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        await waitForIce();
      } catch (err) {
        console.error(err);
        setStatus(err.message || t.status.disconnected);
        appendSystemMessage(t.systemMessages.createAnswerFailed);
      } finally {
        setIsCreatingAnswer(false);
      }
    }, [appendSystemMessage, ensurePeerConnection, parseRemoteDescription, waitForIce, t]);

    const sendControlMessage = useCallback((message) => {
      if (!message || typeof message !== 'object') {
        return false;
      }
      const channel = controlChannelRef.current;
      if (!channel || channel.readyState !== 'open') {
        return false;
      }
      try {
        channel.send(JSON.stringify(message));
        return true;
      } catch (error) {
        console.warn('Failed to send control message', error);
        appendSystemMessageRef.current(t.remoteControl.system.deliveryFailed);
        return false;
      }
    }, [t]);

    const handleStopScreenShare = useCallback(() => {
      const stream = screenStreamRef.current;
      if (stream) {
        stream.getTracks().forEach((track) => {
          try {
            track.stop();
          } catch (error) {
            console.warn('Failed to stop screen share track', error);
          }
        });
        screenStreamRef.current = null;
      }
      if (screenSenderRef.current) {
        try {
          screenSenderRef.current.replaceTrack(null);
        } catch (error) {
          console.warn('Failed to clear screen video sender', error);
        }
      }
      if (screenAudioSenderRef.current) {
        try {
          screenAudioSenderRef.current.replaceTrack(null);
        } catch (error) {
          console.warn('Failed to clear screen audio sender', error);
        }
      }
      if (localScreenVideoRef.current) {
        localScreenVideoRef.current.srcObject = null;
      }
      if (isScreenSharing) {
        appendSystemMessage(t.screenShare.messages.stopped);
      }
      if (remoteControlAllowedRef.current) {
        const delivered = sendControlMessage({
          type: CONTROL_MESSAGE_TYPES.PERMISSION,
          allowed: false
        });
        cancelPendingPointerFrame();
        hideRemotePointerRef.current();
        appendSystemMessage(t.remoteControl.system.disabledOnScreenStop);
        if (!delivered) {
          appendSystemMessageRef.current(t.remoteControl.system.revokeFailed);
        }
      }
      remoteControlAllowedRef.current = false;
      setIsRemoteControlAllowed(false);
      setRemoteControlStatus(t.remoteControl.statusDisabled);
      remoteKeyBudgetRef.current = CONTROL_TOTAL_TEXT_BUDGET;
      setIsScreenSharing(false);
    }, [appendSystemMessage, cancelPendingPointerFrame, isScreenSharing, sendControlMessage, t]);

    const handleStartScreenShare = useCallback(async () => {
      if (isScreenSharing) {
        return;
      }
      let stream = null;
      try {
        if (!navigator.mediaDevices || typeof navigator.mediaDevices.getDisplayMedia !== 'function') {
          appendSystemMessage(t.screenShare.messages.notSupported);
          return;
        }
        const pc = ensurePeerConnection();
        if (!pc) {
          throw new Error(t.screenShare.errors.peerNotReady);
        }
        stream = await navigator.mediaDevices.getDisplayMedia({
          video: { cursor: 'always' },
          audio: shareSystemAudio ? { echoCancellation: false, noiseSuppression: false } : false
        });
        const [videoTrack] = stream.getVideoTracks();
        if (!videoTrack) {
          stream.getTracks().forEach((track) => track.stop());
          throw new Error(t.screenShare.errors.noVideoTrack);
        }
        if (screenSenderRef.current) {
          await screenSenderRef.current.replaceTrack(videoTrack);
        }
        const [audioTrack] = stream.getAudioTracks();
        if (screenAudioSenderRef.current) {
          await screenAudioSenderRef.current.replaceTrack(audioTrack || null);
        }
        screenStreamRef.current = stream;
        if (localScreenVideoRef.current) {
          localScreenVideoRef.current.srcObject = stream;
        }
        setIsScreenSharing(true);
        appendSystemMessage(t.screenShare.messages.started);
        videoTrack.onended = () => {
          handleStopScreenShare();
        };
      } catch (error) {
        console.error('Screen share failed', error);
        if (stream) {
          stream.getTracks().forEach((track) => {
            try {
              track.stop();
            } catch (stopError) {
              console.warn('Failed to stop captured track after error', stopError);
            }
          });
        }
        const reason = error && error.message ? error.message : t.screenShare.errors.permissionDenied;
        appendSystemMessage(t.screenShare.errors.failed(reason));
        setIsScreenSharing(false);
      }
    }, [appendSystemMessage, ensurePeerConnection, handleStopScreenShare, isScreenSharing, shareSystemAudio, t]);

    const hideRemotePointer = useCallback(() => {
      if (remotePointerTimeoutRef.current) {
        clearTimeout(remotePointerTimeoutRef.current);
        remotePointerTimeoutRef.current = null;
      }
      setRemotePointerState((prev) => (prev.visible ? { ...prev, visible: false } : prev));
    }, []);
    const hideRemotePointerRef = useRef(hideRemotePointer);
    useEffect(() => {
      hideRemotePointerRef.current = hideRemotePointer;
    }, [hideRemotePointer]);

    const showRemotePointer = useCallback((xPercent, yPercent) => {
      const clampedX = Math.min(100, Math.max(0, Number(xPercent)));
      const clampedY = Math.min(100, Math.max(0, Number(yPercent)));
      setRemotePointerState({ visible: true, x: clampedX, y: clampedY });
      if (remotePointerTimeoutRef.current) {
        clearTimeout(remotePointerTimeoutRef.current);
      }
      remotePointerTimeoutRef.current = setTimeout(() => {
        setRemotePointerState((prev) => (prev.visible ? { ...prev, visible: false } : prev));
      }, 1200);
    }, []);
    const showRemotePointerRef = useRef(showRemotePointer);
    useEffect(() => {
      showRemotePointerRef.current = showRemotePointer;
    }, [showRemotePointer]);

    const performRemoteClick = useCallback((xPercent, yPercent, button = 'left') => {
      if (button !== 'left') {
        return;
      }
      const viewportWidth = window.innerWidth || document.documentElement.clientWidth || 0;
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight || 0;
      const clientX = (Number(xPercent) / 100) * viewportWidth;
      const clientY = (Number(yPercent) / 100) * viewportHeight;
      if (!Number.isFinite(clientX) || !Number.isFinite(clientY)) {
        return;
      }
      const target = document.elementFromPoint(clientX, clientY);
      if (!target) {
        return;
      }
      const mainElement = document.querySelector('main');
      if (mainElement && !mainElement.contains(target)) {
        return;
      }
      const input = target.closest('input, textarea');
      if (input instanceof HTMLInputElement || input instanceof HTMLTextAreaElement) {
        if (input.id !== 'outgoing') {
          return;
        }
        input.focus({ preventScroll: true });
        const valueLength = typeof input.value === 'string' ? input.value.length : 0;
        if (typeof input.setSelectionRange === 'function') {
          input.setSelectionRange(valueLength, valueLength);
        }
      }
      // Intentionally ignore button clicks and other controls for security.
    }, []);
    const performRemoteClickRef = useRef(performRemoteClick);
    useEffect(() => {
      performRemoteClickRef.current = performRemoteClick;
    }, [performRemoteClick]);

    const applyRemoteInputTransform = useCallback((transform) => {
      setInputText((prev) => {
        const base = typeof prev === 'string' ? prev : '';
        const nextValue = transform(base);
        if (typeof nextValue !== 'string') {
          return base;
        }
        return nextValue.length > MAX_MESSAGE_LENGTH
          ? nextValue.slice(0, MAX_MESSAGE_LENGTH)
          : nextValue;
      });
    }, []);
    const applyRemoteInputTransformRef = useRef(applyRemoteInputTransform);
    useEffect(() => {
      applyRemoteInputTransformRef.current = applyRemoteInputTransform;
    }, [applyRemoteInputTransform]);

    /**
     * Close soundboard dropdown when clicking outside of it.
     */
    useEffect(() => {
      if (!isSoundboardOpen) {
        return;
      }
      const handleClickOutside = (event) => {
        const soundboardContainer = event.target.closest('.soundboard-container');
        if (!soundboardContainer) {
          setIsSoundboardOpen(false);
        }
      };
      document.addEventListener('click', handleClickOutside);
      return () => {
        document.removeEventListener('click', handleClickOutside);
      };
    }, [isSoundboardOpen]);

    /**
     * Sends the typed message across the data channel after validation.
     */
    const handleSend = useCallback(() => {
      const channel = channelRef.current;
      const trimmed = inputText.trim();
      if (!channel || channel.readyState !== 'open' || !trimmed) {
        return;
      }
      if (trimmed.length > MAX_MESSAGE_LENGTH) {
        appendSystemMessage(t.systemMessages.messageInputTooLong(MAX_MESSAGE_LENGTH, trimmed.length));
        return;
      }
      channel.send(trimmed);
      appendMessage(trimmed, 'local');
      setInputText('');
      setAiStatus('');
      setAiError('');
      playCatSfx(); // Play meow sound in cat mode
    }, [appendMessage, appendSystemMessage, inputText, playCatSfx, t]);

    /**
     * Handles image file selection and sends it through the image channel.
     */
    const handleImageSelect = useCallback(async (event) => {
      const file = event.target.files && event.target.files[0];
      if (imageFileInputRef.current) {
        imageFileInputRef.current.value = '';
      }
      if (!file) {
        return;
      }
      const channel = imageChannelRef.current;
      if (!channel || channel.readyState !== 'open') {
        appendSystemMessage(t.imageShare.channelNotReady);
        return;
      }
      if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        appendSystemMessage(t.imageShare.invalidType);
        return;
      }
      if (file.size > IMAGE_MAX_SIZE_BYTES) {
        appendSystemMessage(t.imageShare.tooLarge);
        return;
      }
      const now = Date.now();
      imageSendTimestampsRef.current = imageSendTimestampsRef.current.filter(
        (timestamp) => now - timestamp < IMAGE_INTERVAL_MS
      );
      if (imageSendTimestampsRef.current.length >= IMAGE_MAX_PER_INTERVAL) {
        appendSystemMessage(t.imageShare.rateLimitSend);
        return;
      }
      imageSendTimestampsRef.current.push(now);
      try {
        const arrayBuffer = await file.arrayBuffer();
        const bytes = new Uint8Array(arrayBuffer);
        let binaryString = '';
        for (let i = 0; i < bytes.length; i++) {
          binaryString += String.fromCharCode(bytes[i]);
        }
        const base64 = btoa(binaryString);
        const imageId = `img-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const totalChunks = Math.ceil(base64.length / IMAGE_CHUNK_SIZE);
        channel.send(JSON.stringify({
          type: 'image-start',
          imageId,
          mimeType: file.type,
          fileName: file.name,
          totalSize: file.size,
          totalChunks
        }));
        for (let i = 0; i < totalChunks; i++) {
          const start = i * IMAGE_CHUNK_SIZE;
          const end = Math.min(start + IMAGE_CHUNK_SIZE, base64.length);
          const chunk = base64.substring(start, end);
          channel.send(JSON.stringify({
            type: 'image-chunk',
            imageId,
            chunkIndex: i,
            totalChunks,
            data: chunk
          }));
        }
        const imageUrl = URL.createObjectURL(file);
        appendMessage(t.imageShare.sentImage(file.name), 'local', {
          imageUrl,
          fileName: file.name
        });
      } catch (error) {
        console.error('Failed to send image', error);
        appendSystemMessage(t.imageShare.sendFailed);
      }
    }, [appendMessage, appendSystemMessage, t]);

    const handleImageButtonClick = useCallback(() => {
      if (imageFileInputRef.current) {
        imageFileInputRef.current.click();
      }
    }, []);

    /**
     * Toggles the soundboard dropdown visibility.
     */
    const handleSoundboardToggle = useCallback(() => {
      setIsSoundboardOpen((prev) => !prev);
    }, []);

    /**
     * Sends a sound message when a sound is selected from the soundboard.
     */
    const handleSoundSelect = useCallback((soundKey) => {
      const channel = channelRef.current;
      if (!channel || channel.readyState !== 'open') {
        return;
      }
      const soundName = t.soundboard.sounds[soundKey];
      const soundMessage = `🔊 ${soundName}`;
      channel.send(soundMessage);
      appendMessage(soundMessage, 'local');
      setIsSoundboardOpen(false);
    }, [appendMessage, t]);

    const handleRemoteKeyboardInput = useCallback((message) => {
      if (!remoteControlAllowedRef.current) {
        return;
      }
      if (!message || typeof message.mode !== 'string') {
        return;
      }
      const inputEl = document.getElementById('outgoing');
      if (!inputEl) {
        return;
      }
      if (typeof inputEl.focus === 'function') {
        inputEl.focus({ preventScroll: true });
      }
      setAiStatus('');
      setAiError('');
      if (message.mode === 'text') {
        const raw = typeof message.value === 'string' ? message.value : '';
        const sanitized = raw.replace(/[\u0000-\u001F\u007F-\u009F]/g, '').slice(0, CONTROL_TEXT_INSERT_LIMIT);
        if (!sanitized) {
          return;
        }
        if (remoteKeyBudgetRef.current <= 0) {
          appendSystemMessageRef.current(t.remoteControl.system.typingDisabled);
          remoteControlAllowedRef.current = false;
          setIsRemoteControlAllowed(false);
          setRemoteControlStatus(t.remoteControl.statusDisabledInputLimit);
          hideRemotePointerRef.current();
          const delivered = sendControlMessage({
            type: CONTROL_MESSAGE_TYPES.PERMISSION,
            allowed: false
          });
          remoteKeyBudgetRef.current = CONTROL_TOTAL_TEXT_BUDGET;
          if (!delivered) {
            appendSystemMessageRef.current(t.remoteControl.system.revokeFailed);
          }
          return;
        }
        const allowedBudget = Math.min(remoteKeyBudgetRef.current, sanitized.length);
        remoteKeyBudgetRef.current -= allowedBudget;
        const textToInsert = sanitized.slice(0, allowedBudget);
        applyRemoteInputTransformRef.current((prev) => `${prev}${textToInsert}`);
        return;
      }
      if (message.mode === 'backspace') {
        applyRemoteInputTransformRef.current((prev) => prev.slice(0, Math.max(0, prev.length - 1)));
        return;
      }
      if (message.mode === 'enter') {
        handleSend();
      }
    }, [handleSend, sendControlMessage, setAiError, setAiStatus, setIsRemoteControlAllowed, setRemoteControlStatus, t]);
    const handleRemoteKeyboardInputRef = useRef(handleRemoteKeyboardInput);
    useEffect(() => {
      handleRemoteKeyboardInputRef.current = handleRemoteKeyboardInput;
    }, [handleRemoteKeyboardInput]);

    const handleToggleRemoteControl = useCallback(() => {
      if (!controlChannelReady) {
        appendSystemMessage(t.remoteControl.system.unavailable);
        return;
      }
      const channel = controlChannelRef.current;
      if (!channel || channel.readyState !== 'open') {
        appendSystemMessage(t.remoteControl.system.negotiating);
        return;
      }
      if (!isScreenSharing) {
        appendSystemMessage(t.remoteControl.system.requiresScreenShare);
        return;
      }
      const next = !remoteControlAllowedRef.current;
      const delivered = sendControlMessage({
        type: CONTROL_MESSAGE_TYPES.PERMISSION,
        allowed: next
      });
      if (!delivered) {
        appendSystemMessage(t.remoteControl.system.updateFailed);
        return;
      }
      remoteControlAllowedRef.current = next;
      setIsRemoteControlAllowed(next);
      if (next) {
        remoteKeyBudgetRef.current = CONTROL_TOTAL_TEXT_BUDGET;
        setRemoteControlStatus(t.remoteControl.statusEnabled);
        appendSystemMessage(t.remoteControl.system.peerCanControl);
      } else {
        setRemoteControlStatus(t.remoteControl.statusDisabled);
        cancelPendingPointerFrame();
        hideRemotePointerRef.current();
        remoteKeyBudgetRef.current = CONTROL_TOTAL_TEXT_BUDGET;
        appendSystemMessage(t.remoteControl.system.controlRevokedLocal);
      }
    }, [appendSystemMessage, cancelPendingPointerFrame, controlChannelReady, isScreenSharing, sendControlMessage, t]);

    const toggleSignalingCollapse = useCallback(() => {
      setIsSignalingCollapsed((prev) => !prev);
    }, []);

    const toggleAbout = useCallback(() => {
      setIsAboutOpen((prev) => !prev);
    }, []);

    const toggleOffTopic = useCallback(() => {
      setIsOffTopicOpen((prev) => !prev);
    }, []);

    /**
     * Copies the current local signal to the clipboard for easy sharing.
     */
    const handleCopySignal = useCallback(async () => {
      if (!localSignal) {
        return;
      }
      try {
        await navigator.clipboard.writeText(localSignal);
        setCopyButtonText(t.signaling.copied);
        setTimeout(() => setCopyButtonText(t.signaling.copyButton), 2000);
      } catch (err) {
        console.error('Failed to copy local signal', err);
        setCopyButtonText(t.signaling.copyFailed);
        setTimeout(() => setCopyButtonText(t.signaling.copyButton), 2000);
      }
    }, [localSignal, t]);

    /**
     * Clears all messages from the chat history.
     */
    const handleClearMessages = useCallback(() => {
      setMessages([]);
      appendSystemMessage(t.systemMessages.chatCleared);
    }, [appendSystemMessage, t]);

    /**
     * Stops the Pong game and cleans up resources.
     */
    const handleStopPong = useCallback(() => {
      if (pongGameStateRef.current) {
        pongGameStateRef.current.destroy();
        pongGameStateRef.current = null;
      }
      if (pongAnimationFrameRef.current) {
        cancelAnimationFrame(pongAnimationFrameRef.current);
        pongAnimationFrameRef.current = null;
      }
      setIsPongActive(false);
      setPongScore({ left: 0, right: 0 });
      setPongLives({ left: 3, right: 3 });
    }, []);

    /**
     * Starts a Pong game challenge.
     */
    const handleStartPong = useCallback(() => {
      if (!pongChannelRef.current || pongChannelRef.current.readyState !== 'open') {
        appendSystemMessage(t.pong.waitingForPeer);
        return;
      }
      if (!pongCanvasRef.current) {
        return;
      }

      // Stop any existing game
      handleStopPong();

      // Create new Pong game instance
      const pongGame = new window.PongGame(
        pongCanvasRef.current,
        pongChannelRef.current,
        {
          onGameStarted: () => {
            setIsPongActive(true);
            appendSystemMessage(t.pong.gameStarted);
          },
          onChallengeSent: () => {
            appendSystemMessage(t.pong.challengeSent);
          },
          onScoreUpdate: (score, lives) => {
            setPongScore(score);
            setPongLives(lives);
          },
          onGameOver: (iWon) => {
            if (iWon) {
              appendSystemMessage(t.pong.victory);
            } else {
              appendSystemMessage(t.pong.defeat);
            }
            setTimeout(() => {
              handleStopPong();
            }, 3000);
          }
        }
      );

      pongGameStateRef.current = pongGame;
      pongGame.startGame(true);
      setIsPongActive(true);
    }, [appendSystemMessage, handleStopPong, t]);

    /**
     * Starts a Trivia quiz game challenge.
     */
    const handleStartTrivia = useCallback(() => {
      if (!triviaChannelRef.current || triviaChannelRef.current.readyState !== 'open') {
        appendSystemMessage(t.trivia.waitingForPeer || 'Warte auf Peer, um Quiz zu spielen...');
        return;
      }

      if (triviaManagerRef.current) {
        triviaManagerRef.current.startGame(true, triviaQuestionCount);
      }
    }, [appendSystemMessage, triviaQuestionCount, t]);

    /**
     * Stops the Trivia game and cleans up resources.
     */
    const handleStopTrivia = useCallback(() => {
      if (triviaManagerRef.current) {
        triviaManagerRef.current.stopGame();
      }
      setIsTriviaActive(false);
      setTriviaGameState(null);
    }, []);

    /**
     * Handles answer submission in trivia game.
     */
    const handleTriviaAnswer = useCallback((answerIndex) => {
      if (triviaManagerRef.current) {
        triviaManagerRef.current.submitAnswer(answerIndex);
      }
    }, []);

    /**
     * Terminates the current peer connection and resets signaling state.
     */
    const handleDisconnect = useCallback(() => {
      if (channelRef.current) {
        channelRef.current.close();
        channelRef.current = null;
      }
      if (controlChannelRef.current) {
        controlChannelRef.current.close();
        controlChannelRef.current = null;
      }
      if (imageChannelRef.current) {
        imageChannelRef.current.close();
        imageChannelRef.current = null;
      }
      if (pongChannelRef.current) {
        pongChannelRef.current.close();
        pongChannelRef.current = null;
      }
      if (triviaChannelRef.current) {
        triviaChannelRef.current.close();
        triviaChannelRef.current = null;
      }
      handleStopPong();
      if (triviaManagerRef.current && triviaManagerRef.current.stopGame) {
        triviaManagerRef.current.stopGame();
      }
      if (pcRef.current) {
        pcRef.current.close();
        pcRef.current = null;
      }
      if (screenSenderRef.current) {
        try {
          screenSenderRef.current.replaceTrack(null);
        } catch (error) {
          console.warn('Failed to clear screen video track', error);
        }
        screenSenderRef.current = null;
      }
      if (screenAudioSenderRef.current) {
        try {
          screenAudioSenderRef.current.replaceTrack(null);
        } catch (error) {
          console.warn('Failed to clear screen audio track', error);
        }
        screenAudioSenderRef.current = null;
      }
      if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach((track) => {
          try {
            track.stop();
          } catch (error) {
            console.warn('Failed to stop screen share track', error);
          }
        });
        screenStreamRef.current = null;
      }
      iceDoneRef.current = false;
      incomingTimestampsRef.current = [];
      controlIncomingTimestampsRef.current = [];
      controlWarningsRef.current = { rate: false, size: false };
      remoteKeyBudgetRef.current = CONTROL_TOTAL_TEXT_BUDGET;
      imageTransfersRef.current.clear();
      imageSendTimestampsRef.current = [];
      imageReceiveTimestampsRef.current = [];
      setChannelReady(false);
      setChannelStatus(t.status.channelClosed);
      setStatus(t.status.disconnected);
      setLocalSignal('');
      setRemoteSignal('');
      setIsSignalingCollapsed(false);
      setIsScreenSharing(false);
      setIsRemoteScreenActive(false);
      setControlChannelReady(false);
      setIsRemoteControlAllowed(false);
      remoteControlAllowedRef.current = false;
      setCanControlPeer(false);
      canControlPeerRef.current = false;
      setRemoteControlStatus(t.remoteControl.statusDisabled);
      setRemotePointerState({ visible: false, x: 50, y: 50 });
      setShareSystemAudio(false);
      cancelPendingPointerFrame();
      if (remotePointerTimeoutRef.current) {
        clearTimeout(remotePointerTimeoutRef.current);
        remotePointerTimeoutRef.current = null;
      }
      if (remoteScreenStreamRef.current) {
        remoteScreenStreamRef.current.getTracks().forEach((track) => {
          if (typeof track.stop === 'function') {
            track.stop();
          }
        });
        remoteScreenStreamRef.current = null;
      }
      if (localScreenVideoRef.current) {
        localScreenVideoRef.current.srcObject = null;
      }
      if (remoteScreenVideoRef.current) {
        remoteScreenVideoRef.current.srcObject = null;
      }
      appendSystemMessage(t.systemMessages.disconnectNotice);
      setAiStatus('');
      setAiError('');
    }, [appendSystemMessage, cancelPendingPointerFrame, handleStopPong, t]);

    const handleOpenDangerZoneModal = useCallback((action) => {
      setDangerZoneAction(action);
      setDangerZoneConfirmInput('');
      setIsDangerZoneModalOpen(true);
    }, []);

    const handleCloseDangerZoneModal = useCallback(() => {
      setIsDangerZoneModalOpen(false);
      setDangerZoneAction(null);
      setDangerZoneConfirmInput('');
    }, []);

    const handleConfirmDangerZoneAction = useCallback(() => {
      if (dangerZoneAction === 'nuclear' && dangerZoneConfirmInput !== 'LÖSCHEN') {
        return;
      }

      try {
        if (dangerZoneAction === 'clearLocalData' || dangerZoneAction === 'nuclear') {
          localStorage.clear();
          console.log('[DangerZone] localStorage cleared');
          appendSystemMessage(t.dangerZone.systemMessages.localDataCleared);
        }

        if (dangerZoneAction === 'clearSession' || dangerZoneAction === 'nuclear') {
          setOpenAiKey('');
          setApiKeyInput('');
          handleDisconnect();
          console.log('[DangerZone] Session cleared');
          appendSystemMessage(t.dangerZone.systemMessages.sessionCleared);
        }

        if (dangerZoneAction === 'nuclear') {
          console.log('[DangerZone] Nuclear option executed - reloading page');
          appendSystemMessage(t.dangerZone.systemMessages.nuclearExecuted);
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        }
      } catch (error) {
        console.error('[DangerZone] Error executing action:', error);
      }

      handleCloseDangerZoneModal();
    }, [dangerZoneAction, dangerZoneConfirmInput, handleCloseDangerZoneModal, handleDisconnect, appendSystemMessage, t]);

    /**
     * Handles accepting all cookies
     */
    const handleAcceptAllCookies = useCallback(() => {
      const consent = createConsentObject(true);
      saveCookieConsent(consent);
      setCookieConsent(consent);
      setShowCookieBanner(false);
      setIsCookieSettingsOpen(false);
    }, []);

    /**
     * Handles rejecting non-essential cookies
     */
    const handleRejectNonEssential = useCallback(() => {
      const consent = createConsentObject(false);
      saveCookieConsent(consent);
      setCookieConsent(consent);
      setShowCookieBanner(false);
      setIsCookieSettingsOpen(false);
    }, []);

    /**
     * Opens the cookie settings modal
     */
    const handleOpenCookieSettings = useCallback(() => {
      setIsCookieSettingsOpen(true);
      setShowCookieBanner(false);
    }, []);

    /**
     * Closes the cookie settings modal
     */
    const handleCloseCookieSettings = useCallback(() => {
      setIsCookieSettingsOpen(false);
      // If no consent was saved yet, show banner again
      if (getCookieConsent() === null) {
        setShowCookieBanner(true);
      }
    }, []);

    /**
     * Saves custom cookie preferences from the settings modal
     */
    const handleSaveCookiePreferences = useCallback(() => {
      saveCookieConsent(cookieConsent);
      setIsCookieSettingsOpen(false);
    }, [cookieConsent]);

    /**
     * Toggles a specific cookie category
     * @param {string} category - Category to toggle
     */
    const handleToggleCookieCategory = useCallback((category) => {
      if (category === CONSENT_CATEGORIES.ESSENTIAL) {
        return; // Essential cannot be toggled
      }
      setCookieConsent(prev => ({
        ...prev,
        [category]: !prev[category]
      }));
    }, []);

    /**
     * Gets the appropriate API endpoint and model based on provider
     */
    const getApiConfig = useCallback((provider, endpoint) => {
      if (provider === AI_PROVIDERS.OLLAMA) {
        const baseUrl = (endpoint || OLLAMA_DEFAULT_ENDPOINT).replace(/\/+$/, '');
        const fullEndpoint = baseUrl.includes('/v1/chat/completions')
          ? baseUrl
          : `${baseUrl}/v1/chat/completions`;
        return {
          endpoint: fullEndpoint,
          model: OLLAMA_MODEL,
          requiresAuth: false
        };
      }
      return {
        endpoint: 'https://api.openai.com/v1/chat/completions',
        model: OPENAI_MODEL,
        requiresAuth: true
      };
    }, []);

    const handleAiRewrite = useCallback(async () => {
      const draft = inputText.trim();
      if (!draft) {
        return;
      }
      // Check if credentials are needed based on provider
      const needsKey = aiProvider === AI_PROVIDERS.OPENAI;
      if (needsKey && !openAiKey) {
        setApiKeyInput(openAiKey);
        setApiKeyError(t.aiErrors.emptyKey);
        setIsApiKeyModalOpen(true);
        setIsAboutOpen(false);
        return;
      }
      if (draft.length > MAX_MESSAGE_LENGTH) {
        appendSystemMessage(t.systemMessages.aiRewriteNotAttempted(MAX_MESSAGE_LENGTH));
        return;
      }
      setIsAiBusy(true);
      setAiStatus(t.systemMessages.aiReady);
      setAiError('');
      try {
        const config = getApiConfig(aiProvider, ollamaEndpoint);

        // Build headers
        const headers = {
          'Content-Type': 'application/json'
        };
        if (config.requiresAuth && openAiKey) {
          headers['Authorization'] = `Bearer ${openAiKey}`;
        }

        const response = await fetch(config.endpoint, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            model: config.model,
            messages: [
              {
                role: 'system',
                content:
                  'You rewrite chat drafts to stay concise, friendly, and clear. Preserve intent, remove sensitive data, and return only the revised message.'
              },
              {
                role: 'user',
                content: draft
              }
            ],
            temperature: 0.7,
            max_tokens: 256
          })
        });
        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            throw new Error(t.aiErrors.unauthorized);
          }
          throw new Error(t.aiErrors.requestFailed(response.status));
        }
        const data = await response.json();
        const aiText =
          data &&
          data.choices &&
          data.choices[0] &&
          data.choices[0].message &&
          data.choices[0].message.content;
        if (!aiText) {
          throw new Error(t.aiErrors.missingContent);
        }
        const cleaned = aiText.trim();
        if (!cleaned) {
          throw new Error(t.aiErrors.emptySuggestion);
        }
        if (cleaned.length > MAX_MESSAGE_LENGTH) {
          setInputText(cleaned.slice(0, MAX_MESSAGE_LENGTH));
          appendSystemMessage(t.systemMessages.aiTruncated);
        } else {
          setInputText(cleaned);
        }
        setAiStatus(t.systemMessages.aiSuggestionApplied);
        setAiError('');
      } catch (error) {
        console.error('AI rewrite failed', error);
        setAiStatus('');
        setAiError(error.message || t.aiErrors.requestFailed('unknown'));
        appendSystemMessage(t.systemMessages.aiRewriteFailed(error.message || ''));
      } finally {
        setIsAiBusy(false);
      }
    }, [appendSystemMessage, inputText, openAiKey, setIsAboutOpen, t, aiProvider, ollamaEndpoint, getApiConfig]);

    /**
     * Handles voice recording toggle - starts or stops audio recording
     */
    const handleVoiceRecording = useCallback(async () => {
      if (isRecording) {
        // Stop recording
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
          mediaRecorderRef.current.stop();
        }
        setIsRecording(false);
      } else {
        // Start recording
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          audioChunksRef.current = [];

          const mediaRecorder = new MediaRecorder(stream);
          mediaRecorderRef.current = mediaRecorder;

          mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
              audioChunksRef.current.push(event.data);
            }
          };

          mediaRecorder.onstop = async () => {
            // Stop all audio tracks
            stream.getTracks().forEach(track => track.stop());

            // Process the recorded audio
            const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
            await transcribeAudio(audioBlob);
          };

          mediaRecorder.start();
          setIsRecording(true);
        } catch (error) {
          console.error('Failed to start recording:', error);
          appendSystemMessage('Fehler beim Zugriff auf das Mikrofon. Bitte erlaube den Mikrofonzugriff.');
        }
      }
    }, [isRecording, appendSystemMessage]);

    /**
     * Transcribes audio using Whisper model
     * @param {Blob} audioBlob - The recorded audio blob
     */
    const transcribeAudio = useCallback(async (audioBlob) => {
      setIsTranscribing(true);
      try {
        // Load Whisper pipeline if not already loaded
        if (!whisperPipelineRef.current) {
          const { pipeline } = window.transformers || {};
          if (!pipeline) {
            throw new Error('Transformers.js nicht geladen');
          }

          appendSystemMessage(t.voiceSettings.loadingModel);
          whisperPipelineRef.current = await pipeline(
            'automatic-speech-recognition',
            whisperModel,
            { device: 'webgpu' }
          );
          appendSystemMessage(t.voiceSettings.modelLoaded);
        }

        // Convert blob to audio data
        const arrayBuffer = await audioBlob.arrayBuffer();
        const audioContext = new AudioContext({ sampleRate: 16000 });
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

        // Get audio data as Float32Array
        const audioData = audioBuffer.getChannelData(0);

        // Transcribe
        const result = await whisperPipelineRef.current(audioData);
        const transcribedText = result.text || '';

        if (transcribedText.trim()) {
          // Append transcribed text to input
          const newText = inputText ? `${inputText} ${transcribedText}` : transcribedText;
          setInputText(newText.slice(0, MAX_MESSAGE_LENGTH));
        } else {
          appendSystemMessage('Keine Sprache erkannt. Bitte versuche es erneut.');
        }
      } catch (error) {
        console.error('Transcription failed:', error);
        appendSystemMessage(t.voiceSettings.modelError + ': ' + (error.message || ''));
      } finally {
        setIsTranscribing(false);
      }
    }, [whisperModel, inputText, appendSystemMessage, t]);

    /**
     * Handles voice settings changes
     */
    const handleWhisperModelChange = useCallback((newModel) => {
      setWhisperModel(newModel);
      whisperPipelineRef.current = null; // Clear cached pipeline
      try {
        window.localStorage.setItem(WHISPER_MODEL_STORAGE_KEY, newModel);
      } catch (error) {
        console.warn('Could not save Whisper model preference', error);
      }
    }, []);

    const handleCatAudioSettingChange = useCallback((key, value) => {
      setCatAudioSettings((prev) => {
        const updated = { ...prev, [key]: value };
        try {
          window.localStorage.setItem(CAT_AUDIO_STORAGE_KEY, JSON.stringify(updated));
        } catch (error) {
          console.warn('Could not save cat audio settings', error);
        }
        return updated;
      });
    }, []);

    const playCatSfx = useCallback(() => {
      if (theme !== THEME_OPTIONS.CAT || !catAudioSettings.enabled || !catAudioSettings.sfxEnabled) {
        return;
      }
      // Simple meow sound trigger - would play audio if files exist
      // For now, just log (actual audio files need to be added per AUDIO_ASSETS_NEEDED.md)
      console.log('Meow! (Cat SFX would play here)');
    }, [theme, catAudioSettings]);

    useEffect(() => {
      if (typeof document !== 'undefined') {
        document.documentElement.dataset.theme = theme;
      }
      if (typeof window === 'undefined') {
        return;
      }
      try {
        if (hasStoredThemeRef.current) {
          window.localStorage.setItem(THEME_STORAGE_KEY, theme);
        } else {
          window.localStorage.removeItem(THEME_STORAGE_KEY);
        }
      } catch (error) {
        console.warn('Theme preference could not be saved.', error);
      }
    }, [theme]);

    useEffect(() => {
      if (typeof window === 'undefined' || hasStoredThemeRef.current) {
        return undefined;
      }
      const media = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (event) => {
        if (hasStoredThemeRef.current) {
          return;
        }
        const nextTheme = event.matches ? THEME_OPTIONS.DARK : THEME_OPTIONS.LIGHT;
        setTheme((currentTheme) => (currentTheme === nextTheme ? currentTheme : nextTheme));
      };
      if (typeof media.addEventListener === 'function') {
        media.addEventListener('change', handleChange);
        return () => {
          media.removeEventListener('change', handleChange);
        };
      }
      media.addListener(handleChange);
      return () => {
        media.removeListener(handleChange);
      };
    }, [setTheme]);

    useEffect(() => {
      if (!localSignal) {
        setCopyButtonText(t.signaling.copyButton);
      }
    }, [localSignal, t]);

    /**
     * Handle URL parameter on page load to auto-populate remote signal.
     */
    useEffect(() => {
      if (typeof window === 'undefined' || typeof URLSearchParams === 'undefined') {
        return;
      }
      const params = new URLSearchParams(window.location.search);
      const offerParam = params.get('offer');
      if (offerParam) {
        try {
          const decodedOffer = decodeURIComponent(offerParam);
          // Validate that it's valid JSON before auto-populating
          JSON.parse(decodedOffer);
          setRemoteSignal(decodedOffer);
          // Clear URL parameter after populating to keep URL clean
          window.history.replaceState({}, document.title, window.location.pathname);
        } catch (err) {
          console.error('Failed to decode or parse offer from URL:', err);
        }
      }
    }, []);

    /**
     * Generate QR code when localSignal is available.
     */
    useEffect(() => {
      const container = qrCodeRef.current;
      if (!container || typeof QRCode === 'undefined') {
        return;
      }

      // Clear previous QR code
      container.innerHTML = '';

      if (!localSignal) {
        return;
      }

      try {
        // Create URL with offer parameter
        const baseUrl = window.location.origin + window.location.pathname;
        const offerUrl = `${baseUrl}?offer=${encodeURIComponent(localSignal)}`;

        // Generate QR code
        new QRCode(container, {
          text: offerUrl,
          width: 200,
          height: 200,
          colorDark: '#000000',
          colorLight: '#ffffff',
          correctLevel: QRCode.CorrectLevel.M
        });
      } catch (err) {
        console.error('Failed to generate QR code:', err);
      }
    }, [localSignal]);

    useEffect(() => {
      if (!isApiKeyModalOpen) {
        if (apiKeyButtonRef.current) {
          apiKeyButtonRef.current.focus();
        }
        return;
      }
      const focusTimer = setTimeout(() => {
        if (apiKeyInputRef.current) {
          apiKeyInputRef.current.focus();
          apiKeyInputRef.current.select();
        }
      }, 50);
      return () => {
        clearTimeout(focusTimer);
      };
    }, [isApiKeyModalOpen]);

    useEffect(() => {
      if (!isApiKeyModalOpen) {
        return;
      }
      const handleKeyDown = (event) => {
        if (event.key === 'Escape') {
          event.preventDefault();
          handleCloseApiKeyModal();
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
      };
    }, [handleCloseApiKeyModal, isApiKeyModalOpen]);

    useEffect(() => {
      if (isAboutOpen) {
        if (closeAboutButtonRef.current) {
          closeAboutButtonRef.current.focus();
        }
      } else if (!isApiKeyModalOpen && aboutButtonRef.current) {
        aboutButtonRef.current.focus();
      }
    }, [isAboutOpen, isApiKeyModalOpen]);

    useEffect(() => {
      if (!isAboutOpen) {
        return;
      }
      const handleKeyDown = (event) => {
        if (event.key === 'Escape') {
          event.preventDefault();
          setIsAboutOpen(false);
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
      };
    }, [isAboutOpen]);

    useEffect(() => {
      if (isOffTopicOpen) {
        if (closeOffTopicButtonRef.current) {
          closeOffTopicButtonRef.current.focus();
        }
      } else if (!isApiKeyModalOpen && offTopicButtonRef.current) {
        offTopicButtonRef.current.focus();
      }
    }, [isOffTopicOpen, isApiKeyModalOpen]);

    useEffect(() => {
      if (!isOffTopicOpen) {
        return;
      }
      const handleKeyDown = (event) => {
        if (event.key === 'Escape') {
          event.preventDefault();
          setIsOffTopicOpen(false);
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
      };
    }, [isOffTopicOpen]);

    useEffect(() => {
      if (!isFranconiaIntroOpen) {
        return;
      }
      const handleKeyDown = (event) => {
        if (event.key === 'Escape') {
          event.preventDefault();
          handleCloseFranconiaIntro();
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
      };
    }, [handleCloseFranconiaIntro, isFranconiaIntroOpen]);

    useEffect(() => {
      if (!isAboutOpen || contributorsLoadedRef.current) {
        return;
      }

      const controller = new AbortController();
      let didSucceed = false;

      const loadContributors = async () => {
        setIsLoadingContributors(true);
        setContributorsError('');
        try {
          const response = await fetch(
            'https://api.github.com/repos/TheMorpheus407/TheCommunity/issues?state=all&per_page=100',
            {
              signal: controller.signal,
              headers: {
                Accept: 'application/vnd.github+json'
              }
            }
          );

          if (!response.ok) {
            throw new Error(`Request failed with status ${response.status}`);
          }

          const payload = await response.json();
          if (controller.signal.aborted) {
            return;
          }

          const map = new Map();
          if (Array.isArray(payload)) {
            payload.forEach((item) => {
              if (!item || item.pull_request) {
                return;
              }
              const user = item.user;
              const login = user && user.login;
              if (!login) {
                return;
              }
              const sanitizedLogin = String(login).trim();
              if (!sanitizedLogin) {
                return;
              }
              const existing = map.get(sanitizedLogin);
              if (existing) {
                existing.issueCount += 1;
              } else {
                map.set(sanitizedLogin, {
                  login: sanitizedLogin,
                  htmlUrl: user && user.html_url
                    ? user.html_url
                    : `https://github.com/${encodeURIComponent(sanitizedLogin)}`,
                  issueCount: 1
                });
              }
            });
          }

          const sortedContributors = Array.from(map.values()).sort((a, b) =>
            a.login.localeCompare(b.login)
          );

          setContributors(sortedContributors);
          didSucceed = true;
        } catch (error) {
          if (controller.signal.aborted) {
            return;
          }
          console.error('Failed to load contributors', error);
          setContributorsError(t.about.contributorsError);
        } finally {
          if (!controller.signal.aborted) {
            setIsLoadingContributors(false);
            if (didSucceed) {
              contributorsLoadedRef.current = true;
            }
          }
        }
      };

      loadContributors();

      return () => {
        controller.abort();
      };
    }, [isAboutOpen, t]);

    useEffect(() => {
      const jokes = t.statistics.joke.jokes;
      if (Array.isArray(jokes) && jokes.length > 0) {
        const randomIndex = Math.floor(Math.random() * jokes.length);
        setRandomJoke(jokes[randomIndex]);
      }
    }, [t]);

    useEffect(() => {
      const controller = new AbortController();
      let didSucceed = false;

      const loadStatistics = async () => {
        setIsLoadingStatistics(true);
        setStatisticsError('');
        try {
          // Check cache first
          const cacheKey = 'thecommunity.statistics-cache';
          const cacheTimeKey = 'thecommunity.statistics-cache-time';
          const cacheMaxAge = 5 * 60 * 1000; // 5 minutes

          try {
            const cachedData = localStorage.getItem(cacheKey);
            const cachedTime = localStorage.getItem(cacheTimeKey);

            if (cachedData && cachedTime) {
              const age = Date.now() - parseInt(cachedTime, 10);
              if (age < cacheMaxAge) {
                const parsed = JSON.parse(cachedData);
                setStatisticsIssues(parsed);
                setIsLoadingStatistics(false);
                return;
              }
            }
          } catch (cacheError) {
            console.warn('Cache read failed, fetching fresh data', cacheError);
          }

          const response = await fetch(
            'https://api.github.com/repos/TheMorpheus407/TheCommunity/issues?state=all&per_page=100',
            {
              signal: controller.signal,
              headers: {
                Accept: 'application/vnd.github+json'
              }
            }
          );

          if (!response.ok) {
            throw new Error(`Request failed with status ${response.status}`);
          }

          const payload = await response.json();
          if (controller.signal.aborted) {
            return;
          }

          const aiSolvedIssues = [];
          if (Array.isArray(payload)) {
            for (const item of payload) {
              if (!item || item.pull_request) {
                continue;
              }

              // More accurate detection: check for Claude labels or fetch comments to check for Claude mentions
              const hasClaudeLabel = item.labels && Array.isArray(item.labels) &&
                item.labels.some(label => label && typeof label.name === 'string' &&
                  label.name.toLowerCase().includes('claude'));

              // Only consider issues with comments that might involve Claude
              if (hasClaudeLabel || item.comments > 0) {
                // Determine status more accurately
                const status = item.state === 'closed'
                  ? (item.state_reason === 'completed' ? 'success' : 'failed')
                  : 'pending';

                const bodyText = item.body || '';
                let summary = bodyText.slice(0, 150);
                if (bodyText.length > 150) {
                  summary += '...';
                }

                aiSolvedIssues.push({
                  number: item.number,
                  title: item.title || 'Untitled',
                  body: bodyText,
                  status: status,
                  url: item.html_url,
                  summary: summary,
                  needsAiSummary: bodyText.length > 200 && (openAiKey || aiProvider === AI_PROVIDERS.OLLAMA)
                });
              }
            }
          }

          // Try to cache the results
          try {
            localStorage.setItem(cacheKey, JSON.stringify(aiSolvedIssues));
            localStorage.setItem(cacheTimeKey, Date.now().toString());
          } catch (cacheError) {
            console.warn('Failed to cache statistics', cacheError);
          }

          setStatisticsIssues(aiSolvedIssues);
          didSucceed = true;

          // If OpenAI key is available, generate AI summaries for longer issues
          if (openAiKey && aiSolvedIssues.length > 0) {
            generateAiSummaries(aiSolvedIssues, controller.signal);
          }
        } catch (error) {
          if (controller.signal.aborted) {
            return;
          }
          console.error('Failed to load statistics', error);
          setStatisticsError(t.statistics.error);
        } finally {
          if (!controller.signal.aborted) {
            setIsLoadingStatistics(false);
          }
        }
      };

      const generateAiSummaries = async (issues, signal) => {
        for (const issue of issues) {
          if (signal.aborted || !issue.needsAiSummary) {
            continue;
          }

          try {
            const config = getApiConfig(aiProvider, ollamaEndpoint);

            // Build headers
            const headers = {
              'Content-Type': 'application/json'
            };
            if (config.requiresAuth && openAiKey) {
              headers['Authorization'] = `Bearer ${openAiKey}`;
            }

            const response = await fetch(config.endpoint, {
              method: 'POST',
              signal: signal,
              headers,
              body: JSON.stringify({
                model: config.model,
                messages: [
                  {
                    role: 'system',
                    content: 'Summarize the following GitHub issue in one concise sentence (max 100 characters). Focus on what needs to be done.'
                  },
                  {
                    role: 'user',
                    content: `Title: ${issue.title}\n\nDescription: ${issue.body.slice(0, 500)}`
                  }
                ],
                temperature: 0.5,
                max_tokens: 60
              })
            });

            if (!response.ok || signal.aborted) {
              continue;
            }

            const data = await response.json();
            const aiSummary = data?.choices?.[0]?.message?.content?.trim();

            if (aiSummary) {
              setStatisticsIssues((prev) => prev.map((item) =>
                item.number === issue.number
                  ? { ...item, summary: aiSummary }
                  : item
              ));
            }
          } catch (error) {
            if (!signal.aborted) {
              console.warn(`Failed to generate AI summary for issue #${issue.number}`, error);
            }
          }

          // Add delay to respect rate limits
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      };

      loadStatistics();

      return () => {
        controller.abort();
      };
    }, [t, openAiKey]);

    useEffect(() => {
      const container = messagesContainerRef.current;
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    }, [messages]);

    useEffect(() => {
      return () => {
        if (channelRef.current) {
          channelRef.current.close();
        }
        if (pcRef.current) {
          pcRef.current.close();
        }
      };
    }, []);

    useEffect(() => {
      const localVideo = localScreenVideoRef.current;
      if (localVideo) {
        localVideo.srcObject = screenStreamRef.current || null;
      }
    }, [isScreenSharing]);

    useEffect(() => {
      const remoteVideo = remoteScreenVideoRef.current;
      if (remoteVideo) {
        remoteVideo.srcObject = remoteScreenStreamRef.current || null;
      }
    }, [isRemoteScreenActive]);

    useEffect(() => () => {
      if (remotePointerTimeoutRef.current) {
        clearTimeout(remotePointerTimeoutRef.current);
        remotePointerTimeoutRef.current = null;
      }
      cancelPendingPointerFrame();
    }, [cancelPendingPointerFrame]);

    useEffect(() => {
      if (isRemoteScreenActive && !remoteScreenActiveRef.current) {
        appendSystemMessage(t.screenShare.remote.peerStarted);
      } else if (!isRemoteScreenActive && remoteScreenActiveRef.current) {
        appendSystemMessage(t.screenShare.remote.peerStopped);
      }
      remoteScreenActiveRef.current = isRemoteScreenActive;
    }, [appendSystemMessage, isRemoteScreenActive, t]);

    useEffect(() => {
      const surface = remoteControlSurfaceRef.current;
      if (!surface || !canControlPeer) {
        return;
      }
      lastPointerSendRef.current = 0;

      const computePosition = (event) => {
        const videoElement = remoteScreenVideoRef.current;
        if (!videoElement) {
          return null;
        }
        const rect = videoElement.getBoundingClientRect();
        if (!rect.width || !rect.height) {
          return null;
        }
        const deltaX = event.clientX - rect.left;
        const deltaY = event.clientY - rect.top;
        if (deltaX < 0 || deltaY < 0 || deltaX > rect.width || deltaY > rect.height) {
          return null;
        }
        const percentX = (deltaX / rect.width) * 100;
        const percentY = (deltaY / rect.height) * 100;
        return {
          x: Number(percentX.toFixed(2)),
          y: Number(percentY.toFixed(2))
        };
      };

      const schedulePointerFrame = () => {
        if (pointerFramePendingRef.current) {
          return;
        }
        pointerFramePendingRef.current = true;
        pointerFrameIdRef.current = requestAnimationFrame(() => {
          pointerFramePendingRef.current = false;
          pointerFrameIdRef.current = null;
          const queued = pointerQueuedPositionRef.current;
          pointerQueuedPositionRef.current = null;
          if (!queued) {
            return;
          }
          lastPointerSendRef.current = performance.now();
          sendControlMessage({
            type: CONTROL_MESSAGE_TYPES.POINTER,
            kind: 'move',
            x: queued.x,
            y: queued.y
          });
        });
      };

      const handlePointerDown = (event) => {
        event.preventDefault();
        surface.focus({ preventScroll: true });
        const position = computePosition(event);
        if (position) {
          pointerQueuedPositionRef.current = position;
          schedulePointerFrame();
        }
      };

      const handlePointerMove = (event) => {
        event.preventDefault();
        const position = computePosition(event);
        if (!position) {
          if (lastPointerSendRef.current !== 0) {
            lastPointerSendRef.current = 0;
            cancelPendingPointerFrame();
            pointerQueuedPositionRef.current = null;
            sendControlMessage({
              type: CONTROL_MESSAGE_TYPES.POINTER_VISIBILITY,
              visible: false
            });
          }
          return;
        }
        pointerQueuedPositionRef.current = position;
        schedulePointerFrame();
      };

      const handlePointerUp = (event) => {
        event.preventDefault();
        const position = computePosition(event);
        if (!position) {
          return;
        }
        sendControlMessage({
          type: CONTROL_MESSAGE_TYPES.POINTER,
          kind: 'click',
          button: event.button === 2 ? 'right' : 'left',
          x: position.x,
          y: position.y
        });
      };

      const handlePointerLeave = () => {
        lastPointerSendRef.current = 0;
        cancelPendingPointerFrame();
        pointerQueuedPositionRef.current = null;
        sendControlMessage({
          type: CONTROL_MESSAGE_TYPES.POINTER_VISIBILITY,
          visible: false
        });
      };

      const handleWheel = (event) => {
        event.preventDefault();
      };

      const handleKeyDown = (event) => {
        if (event.metaKey || event.ctrlKey || event.altKey) {
          return;
        }
        if (event.key === 'Backspace') {
          event.preventDefault();
          sendControlMessage({
            type: CONTROL_MESSAGE_TYPES.KEYBOARD,
            mode: 'backspace'
          });
          return;
        }
        if (event.key === 'Enter') {
          event.preventDefault();
          sendControlMessage({
            type: CONTROL_MESSAGE_TYPES.KEYBOARD,
            mode: 'enter'
          });
          return;
        }
        if (event.key.length === 1) {
          const value = event.key;
          if (/^[\u0000-\u001F]$/.test(value)) {
            return;
          }
          event.preventDefault();
          sendControlMessage({
            type: CONTROL_MESSAGE_TYPES.KEYBOARD,
            mode: 'text',
            value
          });
        }
      };

      surface.addEventListener('pointerdown', handlePointerDown);
      surface.addEventListener('pointermove', handlePointerMove);
      surface.addEventListener('pointerup', handlePointerUp);
      surface.addEventListener('pointerleave', handlePointerLeave);
      surface.addEventListener('pointercancel', handlePointerLeave);
      surface.addEventListener('wheel', handleWheel, { passive: false });
      surface.addEventListener('keydown', handleKeyDown);

      return () => {
        surface.removeEventListener('pointerdown', handlePointerDown);
        surface.removeEventListener('pointermove', handlePointerMove);
        surface.removeEventListener('pointerup', handlePointerUp);
        surface.removeEventListener('pointerleave', handlePointerLeave);
        surface.removeEventListener('pointercancel', handlePointerLeave);
        surface.removeEventListener('wheel', handleWheel, { passive: false });
        surface.removeEventListener('keydown', handleKeyDown);
        cancelPendingPointerFrame();
        sendControlMessage({
          type: CONTROL_MESSAGE_TYPES.POINTER_VISIBILITY,
          visible: false
        });
      };
    }, [cancelPendingPointerFrame, canControlPeer, sendControlMessage]);

    useEffect(() => {
      if (canControlPeer && remoteControlSurfaceRef.current) {
        remoteControlSurfaceRef.current.focus({ preventScroll: true });
        lastPointerSendRef.current = 0;
      }
    }, [canControlPeer]);

    const nextTheme = getNextThemeValue(theme);
    const themeButtonLabel = t.chat.themeToggle(nextTheme);
    const themeToggleTitle = t.chat.themeToggleTitle(nextTheme);
    const screenShareHeaderStatus = isScreenSharing
      ? t.screenShare.status.sharing
      : channelReady
        ? t.screenShare.status.ready
        : t.screenShare.status.connect;
    const remoteScreenHeaderStatus = isRemoteScreenActive
      ? t.screenShare.remote.receiving
      : t.screenShare.remote.idle;
    const controlStatusLabel = controlChannelReady
      ? remoteControlStatus
      : t.remoteControl.statusUnavailable;
    const remotePreviewClass = `screen-preview remote-preview${canControlPeer ? ' remote-preview-interactive' : ''}`;
    const remotePointerStyle = remotePointerState.visible
      ? {
          left: `${remotePointerState.x}%`,
          top: `${remotePointerState.y}%`
        }
      : null;

    return (
      React.createElement(React.Fragment, null,
        isApiKeyModalOpen && React.createElement('div', { className: 'modal-overlay', role: 'presentation' },
          React.createElement('div', {
            className: 'modal-content',
            role: 'dialog',
            id: 'api-key-dialog',
            'aria-modal': 'true',
            'aria-labelledby': 'api-key-dialog-title',
            onClick: (event) => event.stopPropagation()
          },
            React.createElement('div', { className: 'modal-header' },
              React.createElement('h2', { id: 'api-key-dialog-title' }, t.apiKeyModal.title),
              React.createElement('button', {
                className: 'modal-close',
                onClick: handleContinueWithoutAi,
                'aria-label': t.apiKeyModal.closeAriaLabel
              }, t.apiKeyModal.close)
            ),
            React.createElement('form', {
              className: 'modal-body api-key-form',
              onSubmit: handleSaveApiKey,
              noValidate: true
            },
              React.createElement('p', { className: 'modal-description' },
                t.apiKeyModal.description
              ),
              // Provider selection
              React.createElement('label', { className: 'modal-label' }, 'AI Provider'),
              React.createElement('div', { className: 'model-options' },
                React.createElement('label', { className: 'model-option' },
                  React.createElement('input', {
                    type: 'radio',
                    name: 'ai-provider',
                    value: AI_PROVIDERS.OPENAI,
                    checked: aiProvider === AI_PROVIDERS.OPENAI,
                    onChange: (e) => handleProviderChange(e.target.value)
                  }),
                  React.createElement('span', null, 'OpenAI')
                ),
                React.createElement('label', { className: 'model-option' },
                  React.createElement('input', {
                    type: 'radio',
                    name: 'ai-provider',
                    value: AI_PROVIDERS.OLLAMA,
                    checked: aiProvider === AI_PROVIDERS.OLLAMA,
                    onChange: (e) => handleProviderChange(e.target.value)
                  }),
                  React.createElement('span', null, 'Ollama (Local)')
                )
              ),
              // Conditional fields based on provider
              aiProvider === AI_PROVIDERS.OPENAI && React.createElement(React.Fragment, null,
                React.createElement('label', { className: 'modal-label', htmlFor: 'openai-api-key' }, t.apiKeyModal.label),
                React.createElement('input', {
                  id: 'openai-api-key',
                  type: 'password',
                  value: apiKeyInput,
                  onChange: (event) => setApiKeyInput(event.target.value),
                  ref: apiKeyInputRef,
                  placeholder: t.apiKeyModal.placeholder,
                  autoComplete: 'off',
                  'aria-describedby': apiKeyError ? 'api-key-error' : undefined
                }),
                React.createElement('p', { className: 'modal-hint' }, t.apiKeyModal.hint)
              ),
              aiProvider === AI_PROVIDERS.OLLAMA && React.createElement(React.Fragment, null,
                React.createElement('label', { className: 'modal-label', htmlFor: 'ollama-endpoint' }, 'Ollama Endpoint (Optional)'),
                React.createElement('input', {
                  id: 'ollama-endpoint',
                  type: 'text',
                  value: ollamaEndpoint,
                  onChange: (event) => setOllamaEndpoint(event.target.value),
                  placeholder: OLLAMA_DEFAULT_ENDPOINT,
                  autoComplete: 'off'
                }),
                React.createElement('p', { className: 'modal-hint' }, `Default: ${OLLAMA_DEFAULT_ENDPOINT}. Ollama runs locally on your machine. No API key needed.`)
              ),
              apiKeyError && React.createElement('p', {
                id: 'api-key-error',
                className: 'modal-error',
                role: 'alert'
              }, apiKeyError),
              React.createElement('div', { className: 'modal-actions' },
                React.createElement('button', { type: 'submit' }, t.apiKeyModal.save),
                React.createElement('button', { type: 'button', onClick: handleDisableAi }, t.apiKeyModal.disable),
                React.createElement('button', { type: 'button', onClick: handleContinueWithoutAi }, t.apiKeyModal.continueWithout)
              )
            )
          )
        ),
        // Voice Settings Modal
        isVoiceSettingsOpen && React.createElement('div', { className: 'modal-overlay', role: 'presentation', onClick: () => setIsVoiceSettingsOpen(false) },
          React.createElement('div', {
            className: 'modal-content',
            role: 'dialog',
            id: 'voice-settings-dialog',
            'aria-modal': 'true',
            'aria-labelledby': 'voice-settings-dialog-title',
            onClick: (event) => event.stopPropagation()
          },
            React.createElement('div', { className: 'modal-header' },
              React.createElement('h2', { id: 'voice-settings-dialog-title' }, t.voiceSettings.title),
              React.createElement('button', {
                className: 'modal-close',
                onClick: () => setIsVoiceSettingsOpen(false),
                'aria-label': t.voiceSettings.closeAriaLabel
              }, t.voiceSettings.close)
            ),
            React.createElement('div', { className: 'modal-body' },
              React.createElement('p', { className: 'modal-description' },
                t.voiceSettings.description
              ),
              React.createElement('label', { className: 'modal-label', htmlFor: 'whisper-model-select' }, t.voiceSettings.modelLabel),
              React.createElement('div', { className: 'model-options' },
                React.createElement('label', { className: 'model-option' },
                  React.createElement('input', {
                    type: 'radio',
                    name: 'whisper-model',
                    value: WHISPER_MODELS.TINY_EN,
                    checked: whisperModel === WHISPER_MODELS.TINY_EN,
                    onChange: (e) => handleWhisperModelChange(e.target.value)
                  }),
                  React.createElement('span', null, t.voiceSettings.models.tinyEn)
                ),
                React.createElement('label', { className: 'model-option' },
                  React.createElement('input', {
                    type: 'radio',
                    name: 'whisper-model',
                    value: WHISPER_MODELS.BASE,
                    checked: whisperModel === WHISPER_MODELS.BASE,
                    onChange: (e) => handleWhisperModelChange(e.target.value)
                  }),
                  React.createElement('span', null, t.voiceSettings.models.base)
                )
              ),
              // Cat Mode Audio Settings
              theme === THEME_OPTIONS.CAT && React.createElement('div', { className: 'cat-audio-controls', style: { marginTop: '1.5rem' } },
                React.createElement('h3', null, '🐱 Cat Mode Audio'),
                React.createElement('div', { className: 'cat-audio-setting' },
                  React.createElement('label', null,
                    React.createElement('input', {
                      type: 'checkbox',
                      checked: catAudioSettings.enabled,
                      onChange: (e) => handleCatAudioSettingChange('enabled', e.target.checked)
                    }),
                    ' Enable Cat Mode Audio'
                  )
                ),
                catAudioSettings.enabled && React.createElement('div', { style: { marginTop: '1rem' } },
                  React.createElement('div', { className: 'cat-audio-setting' },
                    React.createElement('label', null,
                      React.createElement('input', {
                        type: 'checkbox',
                        checked: catAudioSettings.musicEnabled,
                        onChange: (e) => handleCatAudioSettingChange('musicEnabled', e.target.checked)
                      }),
                      ' Background Music'
                    )
                  ),
                  React.createElement('div', { className: 'cat-audio-setting' },
                    React.createElement('label', null,
                      React.createElement('input', {
                        type: 'checkbox',
                        checked: catAudioSettings.sfxEnabled,
                        onChange: (e) => handleCatAudioSettingChange('sfxEnabled', e.target.checked)
                      }),
                      ' Meow Sound Effects'
                    )
                  ),
                  React.createElement('div', { className: 'cat-audio-volume' },
                    React.createElement('label', null,
                      React.createElement('span', null, 'Volume'),
                      React.createElement('span', null, `${catAudioSettings.volume}%`)
                    ),
                    React.createElement('input', {
                      type: 'range',
                      min: '0',
                      max: '100',
                      value: catAudioSettings.volume,
                      onChange: (e) => handleCatAudioSettingChange('volume', parseInt(e.target.value, 10))
                    })
                  )
                ),
                React.createElement('p', { className: 'modal-hint', style: { marginTop: '0.75rem', fontSize: '0.85rem' } },
                  'Note: Audio files need to be added (see assets/AUDIO_ASSETS_NEEDED.md). Audio auto-mutes when tab is not focused and respects system "reduced motion" preferences.'
                )
              )
            )
          )
        ),
        // Franconia Intro Modal
        isFranconiaIntroOpen && React.createElement('div', { className: 'modal-overlay', role: 'presentation' },
          React.createElement('div', {
            className: 'modal-content',
            role: 'dialog',
            id: 'franconia-intro-dialog',
            'aria-modal': 'true',
            'aria-labelledby': 'franconia-intro-dialog-title',
            onClick: (event) => event.stopPropagation()
          },
            React.createElement('div', { className: 'modal-header' },
              React.createElement('h2', { id: 'franconia-intro-dialog-title' }, t.franconiaIntro.title),
              React.createElement('button', {
                className: 'modal-close',
                onClick: handleCloseFranconiaIntro,
                'aria-label': t.franconiaIntro.closeAriaLabel
              }, t.franconiaIntro.close)
            ),
            React.createElement('div', { className: 'modal-body' },
              React.createElement('video', {
                controls: true,
                autoPlay: true,
                style: { width: '100%', maxHeight: '70vh', borderRadius: '8px' }
              },
                React.createElement('source', {
                  src: 'https://github.com/user-attachments/assets/1a677e3b-9abb-43c0-91b9-864c16b973d5',
                  type: 'video/mp4'
                }),
                'Your browser does not support the video tag.'
              )
            )
          )
        ),
        // Cookie Banner
        showCookieBanner && React.createElement('div', {
          className: 'cookie-banner',
          role: 'dialog',
          'aria-label': t.cookieConsent.banner.title,
          'aria-modal': 'false'
        },
          React.createElement('div', { className: 'cookie-banner-content' },
            React.createElement('div', { className: 'cookie-banner-text' },
              React.createElement('h3', null, t.cookieConsent.banner.title),
              React.createElement('p', null, t.cookieConsent.banner.description)
            ),
            React.createElement('div', { className: 'cookie-banner-actions' },
              React.createElement('button', {
                className: 'cookie-banner-button cookie-accept-all',
                onClick: handleAcceptAllCookies
              }, t.cookieConsent.banner.acceptAll),
              React.createElement('button', {
                className: 'cookie-banner-button cookie-reject',
                onClick: handleRejectNonEssential
              }, t.cookieConsent.banner.rejectNonEssential),
              React.createElement('button', {
                className: 'cookie-banner-button cookie-settings',
                onClick: handleOpenCookieSettings,
                'aria-label': t.cookieConsent.banner.settingsAriaLabel
              }, t.cookieConsent.banner.settings)
            )
          )
        ),
        // Cookie Settings Modal
        isCookieSettingsOpen && React.createElement('div', { className: 'modal-overlay', role: 'presentation', onClick: handleCloseCookieSettings },
          React.createElement('div', {
            className: 'modal-content',
            role: 'dialog',
            id: 'cookie-settings-dialog',
            'aria-modal': 'true',
            'aria-labelledby': 'cookie-settings-dialog-title',
            onClick: (e) => e.stopPropagation()
          },
            React.createElement('div', { className: 'modal-header' },
              React.createElement('h2', { id: 'cookie-settings-dialog-title' }, t.cookieConsent.modal.title),
              React.createElement('button', {
                className: 'modal-close',
                onClick: handleCloseCookieSettings,
                'aria-label': t.cookieConsent.modal.closeAriaLabel
              }, t.cookieConsent.modal.close)
            ),
            React.createElement('div', { className: 'modal-body' },
              React.createElement('p', { className: 'modal-description' }, t.cookieConsent.modal.description),
              // Essential Category (always active)
              React.createElement('div', { className: 'cookie-category' },
                React.createElement('div', { className: 'cookie-category-header' },
                  React.createElement('h3', null, t.cookieConsent.modal.categories.essential.title),
                  React.createElement('span', { className: 'cookie-category-status' }, t.cookieConsent.modal.categories.essential.alwaysActive)
                ),
                React.createElement('p', { className: 'cookie-category-description' }, t.cookieConsent.modal.categories.essential.description)
              ),
              // Preferences Category
              React.createElement('div', { className: 'cookie-category' },
                React.createElement('div', { className: 'cookie-category-header' },
                  React.createElement('h3', null, t.cookieConsent.modal.categories.preferences.title),
                  React.createElement('label', { className: 'cookie-toggle' },
                    React.createElement('input', {
                      type: 'checkbox',
                      checked: cookieConsent[CONSENT_CATEGORIES.PREFERENCES],
                      onChange: () => handleToggleCookieCategory(CONSENT_CATEGORIES.PREFERENCES)
                    }),
                    React.createElement('span', { className: 'cookie-toggle-slider' })
                  )
                ),
                React.createElement('p', { className: 'cookie-category-description' }, t.cookieConsent.modal.categories.preferences.description),
                React.createElement('ul', { className: 'cookie-category-items' },
                  t.cookieConsent.modal.categories.preferences.items.map((item, idx) =>
                    React.createElement('li', { key: idx }, item)
                  )
                )
              ),
              // Statistics Category
              React.createElement('div', { className: 'cookie-category' },
                React.createElement('div', { className: 'cookie-category-header' },
                  React.createElement('h3', null, t.cookieConsent.modal.categories.statistics.title),
                  React.createElement('label', { className: 'cookie-toggle' },
                    React.createElement('input', {
                      type: 'checkbox',
                      checked: cookieConsent[CONSENT_CATEGORIES.STATISTICS],
                      onChange: () => handleToggleCookieCategory(CONSENT_CATEGORIES.STATISTICS)
                    }),
                    React.createElement('span', { className: 'cookie-toggle-slider' })
                  )
                ),
                React.createElement('p', { className: 'cookie-category-description' }, t.cookieConsent.modal.categories.statistics.description),
                React.createElement('ul', { className: 'cookie-category-items' },
                  t.cookieConsent.modal.categories.statistics.items.map((item, idx) =>
                    React.createElement('li', { key: idx }, item)
                  )
                )
              ),
              // Easter Egg Category
              React.createElement('div', { className: 'cookie-category' },
                React.createElement('div', { className: 'cookie-category-header' },
                  React.createElement('h3', null, t.cookieConsent.modal.categories.easterEgg.title),
                  React.createElement('label', { className: 'cookie-toggle' },
                    React.createElement('input', {
                      type: 'checkbox',
                      checked: cookieConsent[CONSENT_CATEGORIES.EASTER_EGG],
                      onChange: () => handleToggleCookieCategory(CONSENT_CATEGORIES.EASTER_EGG)
                    }),
                    React.createElement('span', { className: 'cookie-toggle-slider' })
                  )
                ),
                React.createElement('p', { className: 'cookie-category-description' }, t.cookieConsent.modal.categories.easterEgg.description),
                React.createElement('ul', { className: 'cookie-category-items' },
                  t.cookieConsent.modal.categories.easterEgg.items.map((item, idx) =>
                    React.createElement('li', { key: idx }, item)
                  )
                )
              ),
              // AI Preference Category
              React.createElement('div', { className: 'cookie-category' },
                React.createElement('div', { className: 'cookie-category-header' },
                  React.createElement('h3', null, t.cookieConsent.modal.categories.aiPreference.title),
                  React.createElement('label', { className: 'cookie-toggle' },
                    React.createElement('input', {
                      type: 'checkbox',
                      checked: cookieConsent[CONSENT_CATEGORIES.AI_PREFERENCE],
                      onChange: () => handleToggleCookieCategory(CONSENT_CATEGORIES.AI_PREFERENCE)
                    }),
                    React.createElement('span', { className: 'cookie-toggle-slider' })
                  )
                ),
                React.createElement('p', { className: 'cookie-category-description' }, t.cookieConsent.modal.categories.aiPreference.description),
                React.createElement('ul', { className: 'cookie-category-items' },
                  t.cookieConsent.modal.categories.aiPreference.items.map((item, idx) =>
                    React.createElement('li', { key: idx }, item)
                  )
                )
              ),
              React.createElement('div', { className: 'modal-actions' },
                React.createElement('button', {
                  className: 'cookie-save-preferences',
                  onClick: handleSaveCookiePreferences
                }, t.cookieConsent.modal.savePreferences),
                React.createElement('button', {
                  onClick: handleAcceptAllCookies
                }, t.cookieConsent.modal.acceptAll),
                React.createElement('button', {
                  onClick: handleRejectNonEssential
                }, t.cookieConsent.modal.rejectAll)
              )
            )
          )
        ),
        React.createElement('main', null,
          React.createElement('div', { className: 'header-with-about' },
            React.createElement(TuxMascot, { t: t, animation: tuxAnimation }),
            React.createElement('div', { className: 'title-room-container' },
              React.createElement('h1', { className: 'app-title' },
                React.createElement('span', {
                  className: 'app-title-icon',
                  'aria-hidden': 'true'
                }, '🐬'),
                React.createElement('span', { className: 'app-title-text' }, t.app.title)
              ),
              currentRoom && React.createElement('div', { className: 'current-room' },
                React.createElement('span', { className: 'room-label' }, t.rooms.currentRoom),
                React.createElement('span', { className: 'room-id' }, currentRoom)
              )
            ),
            React.createElement('div', { className: 'header-actions' },
              React.createElement(RandomRoomButton, { t: t, onClick: handleRandomRoom }),
              React.createElement('button', {
                className: 'about-button',
                onClick: toggleAbout,
                'aria-label': t.about.buttonAriaLabel,
                'aria-expanded': isAboutOpen,
                'aria-controls': 'about-dialog',
                ref: aboutButtonRef,
                disabled: isApiKeyModalOpen
              }, t.about.button),
              React.createElement('button', {
                className: 'off-topic-button',
                onClick: toggleOffTopic,
                'aria-label': t.offTopic.buttonAriaLabel,
                'aria-expanded': isOffTopicOpen,
                'aria-controls': 'off-topic-dialog',
                ref: offTopicButtonRef,
                disabled: isApiKeyModalOpen
              }, t.offTopic.button)
            )
          ),
          React.createElement(BrainsPlan, {
            t: t,
            isVisible: isBrainsPlanVisible,
            onToggle: handleToggleBrainsPlan
          }),
          isRemoteControlAllowed && remotePointerState.visible && React.createElement('div', {
            className: 'remote-pointer-indicator',
            style: remotePointerStyle || undefined,
            'aria-hidden': 'true'
          }),
          isAboutOpen && React.createElement('div', { className: 'modal-overlay', role: 'presentation', onClick: toggleAbout },
            React.createElement('div', {
              className: 'modal-content',
              role: 'dialog',
              id: 'about-dialog',
              'aria-modal': 'true',
              'aria-labelledby': 'about-dialog-title',
              onClick: (e) => e.stopPropagation()
            },
              React.createElement('div', { className: 'modal-header' },
                React.createElement('h2', { id: 'about-dialog-title' }, t.about.title),
                React.createElement('button', {
                  className: 'modal-close',
                  onClick: toggleAbout,
                  'aria-label': t.about.closeAriaLabel,
                  ref: closeAboutButtonRef
                }, t.about.close)
              ),
              React.createElement('div', { className: 'modal-body' },
                React.createElement('p', null, t.about.description),
                React.createElement('h3', null, t.about.contributorsTitle),
                React.createElement('p', { className: 'contributors-intro' }, t.about.contributorsIntro),
                isLoadingContributors && React.createElement('p', { className: 'contributors-status' }, t.about.loadingContributors),
                contributorsError && React.createElement('p', { className: 'contributors-status contributors-error' }, contributorsError),
                !isLoadingContributors && !contributorsError && contributors.length === 0 &&
                  React.createElement('p', { className: 'contributors-status' }, t.about.noIssues),
                contributors.length > 0 && React.createElement('ul', { className: 'contributors-list' },
                  contributors.map((contributor) => {
                    const issueLabel = t.about.issueCount(contributor.issueCount);
                    return React.createElement('li', { key: contributor.login },
                      React.createElement('a', {
                        href: contributor.htmlUrl,
                        target: '_blank',
                        rel: 'noopener noreferrer'
                      }, `@${contributor.login}`),
                      React.createElement('span', { className: 'contribution-note' }, ` - ${issueLabel}`)
                    );
                  })
                )
              )
            )
          ),
          isOffTopicOpen && React.createElement('div', { className: 'modal-overlay', role: 'presentation', onClick: toggleOffTopic },
            React.createElement('div', {
              className: 'modal-content',
              role: 'dialog',
              id: 'off-topic-dialog',
              'aria-modal': 'true',
              'aria-labelledby': 'off-topic-dialog-title',
              onClick: (e) => e.stopPropagation()
            },
              React.createElement('div', { className: 'modal-header' },
                React.createElement('h2', { id: 'off-topic-dialog-title' }, t.offTopic.title),
                React.createElement('button', {
                  className: 'modal-close',
                  onClick: toggleOffTopic,
                  'aria-label': t.offTopic.closeAriaLabel,
                  ref: closeOffTopicButtonRef
                }, t.offTopic.close)
              ),
              React.createElement('div', { className: 'modal-body' },
                React.createElement('p', null, t.offTopic.description),
                React.createElement('div', { style: { margin: '20px 0', padding: '15px', background: '#f5f5f5', borderRadius: '8px', borderLeft: '4px solid #667eea' } },
                  React.createElement('h3', { style: { marginTop: 0, color: '#667eea' } }, '🔬 ' + t.offTopic.higgsAnalysisTitle),
                  React.createElement('p', { style: { marginBottom: '10px', color: '#333' } }, t.offTopic.higgsAnalysisDescription),
                  React.createElement('a', {
                    href: 'higgs_analysis.html',
                    target: '_blank',
                    rel: 'noopener noreferrer',
                    style: {
                      display: 'inline-block',
                      padding: '10px 20px',
                      background: '#667eea',
                      color: 'white',
                      textDecoration: 'none',
                      borderRadius: '6px',
                      fontWeight: '600',
                      transition: 'background 0.3s'
                    }
                  }, t.offTopic.higgsAnalysisButton)
                )
              )
            )
          ),
          React.createElement('section', { id: 'signaling', className: isSignalingCollapsed ? 'collapsed' : '' },
            React.createElement('header', null,
              React.createElement('div', { className: 'header-content' },
                React.createElement('h2', null, t.signaling.title),
                React.createElement('p', { className: 'status', id: 'status' }, status)
              ),
              React.createElement('button', {
                className: 'collapse-toggle',
                onClick: toggleSignalingCollapse,
                'aria-label': t.signaling.collapseAriaLabel(isSignalingCollapsed),
                'aria-expanded': !isSignalingCollapsed
              }, isSignalingCollapsed ? '▼' : '▲')
            ),
            !isSignalingCollapsed && React.createElement('div', { className: 'signaling-content' },
              React.createElement('p', { className: 'warning' },
                React.createElement('strong', null, t.signaling.securityNotice),
                t.signaling.securityWarning
              ),
              React.createElement('p', { className: 'hint' },
                t.signaling.step1, React.createElement('br'),
                t.signaling.step2, React.createElement('br'),
                t.signaling.step3
              ),
              React.createElement('div', { className: 'controls' },
                React.createElement('button', {
                  id: 'create-offer',
                  onClick: handleCreateOffer,
                  disabled: isCreatingOffer
                }, isCreatingOffer ? t.signaling.working : t.signaling.createOffer),
                React.createElement('button', {
                  id: 'create-answer',
                  onClick: handleCreateAnswer,
                  disabled: isCreatingAnswer
                }, isCreatingAnswer ? t.signaling.working : t.signaling.createAnswer),
                React.createElement('button', {
                  id: 'apply-remote',
                  onClick: handleApplyRemote
                }, t.signaling.applyRemote),
                React.createElement('button', {
                  id: 'disconnect',
                  onClick: handleDisconnect,
                  disabled: !channelReady,
                  'aria-label': t.signaling.disconnectAriaLabel
                }, t.signaling.disconnect),
                React.createElement('button', {
                  id: 'pong-challenge',
                  onClick: handleStartPong,
                  disabled: !channelReady
                }, isPongActive ? t.pong.challengeButtonBusy : t.pong.challengeButton),
                React.createElement('button', {
                  id: 'trivia-challenge',
                  onClick: handleStartTrivia,
                  disabled: !channelReady
                }, isTriviaActive ? t.trivia.challengeButtonBusy : t.trivia.challengeButton)
              ),
              React.createElement('div', { className: 'signal-block' },
                React.createElement('div', { className: 'signal-heading' },
                  React.createElement('label', { htmlFor: 'local-signal' },
                    React.createElement('strong', null, t.signaling.localSignalLabel)
                  ),
                  React.createElement('button', {
                    onClick: handleCopySignal,
                    disabled: !localSignal,
                    className: 'copy-signal-button',
                    'aria-label': t.signaling.copyAriaLabel
                  }, copyButtonText)
                ),
                React.createElement('textarea', {
                  id: 'local-signal',
                  readOnly: true,
                  value: localSignal,
                  placeholder: t.signaling.localSignalPlaceholder
                }),
                localSignal && React.createElement('div', { className: 'qr-code-container' },
                  React.createElement('div', { className: 'qr-code-heading' },
                    React.createElement('strong', null, t.signaling.qrCodeLabel)
                  ),
                  React.createElement('p', { className: 'qr-code-description' },
                    t.signaling.qrCodeDescription
                  ),
                  React.createElement('div', {
                    ref: qrCodeRef,
                    className: 'qr-code',
                    'aria-label': t.signaling.qrCodeLabel
                  })
                )
              ),
              React.createElement('label', null,
                React.createElement('strong', null, t.signaling.remoteSignalLabel),
                React.createElement('textarea', {
                  id: 'remote-signal',
                  value: remoteSignal,
                  onChange: (event) => setRemoteSignal(event.target.value),
                  onKeyDown: (event) => {
                    if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
                      event.preventDefault();
                      handleApplyRemote();
                    }
                  },
                  placeholder: t.signaling.remoteSignalPlaceholder
                })
            )
          )
        ),
        React.createElement('section', { id: 'screen-share' },
          React.createElement('header', null,
            React.createElement('div', { className: 'header-content' },
              React.createElement('h2', null, t.screenShare.header),
              React.createElement('p', { className: 'status', id: 'screen-share-status' }, screenShareHeaderStatus)
            ),
            React.createElement('div', { className: 'header-actions screen-share-actions' },
              React.createElement('button', {
                type: 'button',
                onClick: handleStartScreenShare,
                disabled: !channelReady || isScreenSharing,
                'aria-label': t.screenShare.actions.startAria
              }, isScreenSharing ? t.screenShare.actions.sharing : t.screenShare.actions.start),
              React.createElement('button', {
                type: 'button',
                onClick: handleStopScreenShare,
                disabled: !isScreenSharing,
                'aria-label': t.screenShare.actions.stopAria
              }, t.screenShare.actions.stop)
            )
          ),
          React.createElement('div', { className: 'screen-share-controls' },
            React.createElement('label', { className: 'screen-audio-toggle' },
              React.createElement('input', {
                type: 'checkbox',
                checked: shareSystemAudio,
                disabled: isScreenSharing,
                onChange: (event) => setShareSystemAudio(event.target.checked)
              }),
              React.createElement('span', null, t.screenShare.includeAudio)
            ),
            React.createElement('button', {
              type: 'button',
              className: 'remote-control-toggle',
              onClick: handleToggleRemoteControl,
              disabled: !isScreenSharing || !controlChannelReady
            }, isRemoteControlAllowed ? t.remoteControl.actions.disable : t.remoteControl.actions.allow),
            React.createElement('div', { className: 'control-status' },
              React.createElement('strong', null, t.remoteControl.label),
              React.createElement('span', null, controlStatusLabel)
            )
          ),
          React.createElement('div', { className: 'screen-share-grid' },
            React.createElement('div', { className: 'screen-tile local' },
              React.createElement('h3', null, t.screenShare.local.title),
              React.createElement('div', { className: 'screen-preview' },
                React.createElement('video', {
                  ref: localScreenVideoRef,
                  muted: true,
                  autoPlay: true,
                  playsInline: true,
                  'aria-label': t.screenShare.local.aria
                }),
                !isScreenSharing && React.createElement('div', { className: 'screen-placeholder' },
                  React.createElement('p', null, channelReady ? t.screenShare.local.placeholderReady : t.screenShare.local.placeholderDisconnected)
                )
              )
            ),
            React.createElement('div', { className: 'screen-tile remote' },
              React.createElement('h3', null, t.screenShare.remote.title),
              React.createElement('div', {
                className: remotePreviewClass,
                ref: remoteControlSurfaceRef,
                role: canControlPeer ? 'group' : 'presentation',
                tabIndex: canControlPeer ? 0 : -1,
                'aria-disabled': canControlPeer ? 'false' : 'true',
                'aria-label': canControlPeer
                  ? t.screenShare.remote.ariaInteractive
                  : t.screenShare.remote.aria
              },
                React.createElement('video', {
                  ref: remoteScreenVideoRef,
                  autoPlay: true,
                  playsInline: true,
                  'aria-label': t.screenShare.remote.streamAria
                })
              ),
              React.createElement('p', { className: 'hint remote-screen-hint' },
                canControlPeer
                  ? t.remoteControl.hints.active
                  : remoteScreenHeaderStatus
              )
            )
          ),
          React.createElement('p', { className: 'hint screen-share-footnote' },
            t.screenShare.footnote
          )
        ),
        React.createElement('section', { id: 'chat' },
            React.createElement('header', null,
              React.createElement('div', { className: 'header-content' },
                React.createElement('h2', null, t.chat.title),
                React.createElement('p', { className: 'status', id: 'channel-status' }, channelStatus)
              ),
            React.createElement('div', { className: 'header-actions' },
              React.createElement('label', {
                htmlFor: 'language-select',
                className: 'language-label'
              }, t.language.label + ':'),
              React.createElement('select', {
                id: 'language-select',
                value: language,
                onChange: handleLanguageChange,
                className: 'language-select',
                'aria-label': t.language.ariaLabel,
                disabled: isApiKeyModalOpen
              },
                getAvailableLanguages().map((lang) =>
                  React.createElement('option', {
                    key: lang.code,
                    value: lang.code
                  }, lang.name)
                )
              ),
              React.createElement('button', {
                type: 'button',
                className: 'api-key-button',
                onClick: handleOpenApiKeyModal,
                ref: apiKeyButtonRef,
                disabled: isApiKeyModalOpen
              }, openAiKey ? t.chat.updateApiKey : t.chat.addApiKey),
              React.createElement('button', {
                type: 'button',
                className: 'theme-toggle-button',
                onClick: handleToggleTheme,
                title: themeToggleTitle,
                'aria-label': themeToggleTitle,
                disabled: isApiKeyModalOpen
              }, themeButtonLabel),
              React.createElement('button', {
                type: 'button',
                className: 'settings-button',
                onClick: () => setIsVoiceSettingsOpen(true),
                title: t.chat.settingsButtonTitle,
                'aria-label': t.chat.settingsButtonAriaLabel,
                disabled: isApiKeyModalOpen
              }, t.chat.settingsButton),
              messages.length > 0 && React.createElement('button', {
                onClick: handleClearMessages,
                className: 'clear-chat-button',
                'aria-label': t.chat.clearAriaLabel,
                disabled: isApiKeyModalOpen
              }, t.chat.clear)
              )
            ),
            React.createElement('div', {
              id: 'messages',
              'aria-live': 'polite',
              ref: messagesContainerRef
            },
              messages.length === 0
                ? React.createElement('div', {
                    className: 'empty-state',
                    role: 'note'
                  }, t.chat.emptyState)
                : messages.map((message) => (
                    React.createElement('div', {
                      key: message.id,
                      className: 'chat-line',
                      'data-role': message.role
                    },
                    React.createElement('strong', null, t.chat.roleLabels[message.role] || t.chat.roleLabels.system),
                    React.createElement('span', null, message.text),
                    message.imageUrl && React.createElement('img', {
                      src: message.imageUrl,
                      alt: message.fileName || 'Shared image',
                      className: 'chat-image',
                      loading: 'lazy'
                    }))
                  ))
            ),
            React.createElement('div', { className: 'chat-input' },
              React.createElement('input', {
                type: 'file',
                ref: imageFileInputRef,
                onChange: handleImageSelect,
                accept: ALLOWED_IMAGE_TYPES.join(','),
                style: { display: 'none' },
                'aria-label': t.imageShare.selectImage
              }),
              React.createElement('button', {
                type: 'button',
                className: 'image-button',
                onClick: handleImageButtonClick,
                disabled: !channelReady,
                'aria-label': t.imageShare.sendImage,
                title: t.imageShare.sendImageTitle
              }, '📷'),
              React.createElement('div', { className: 'soundboard-container' },
                React.createElement('button', {
                  type: 'button',
                  className: 'soundboard-button',
                  onClick: handleSoundboardToggle,
                  disabled: !channelReady,
                  'aria-label': t.soundboard.button,
                  title: t.soundboard.buttonTitle,
                  'aria-expanded': isSoundboardOpen
                }, '🔊'),
                isSoundboardOpen && React.createElement('div', { className: 'soundboard-dropdown' },
                  React.createElement('div', { className: 'soundboard-header' }, t.soundboard.selectSound),
                  React.createElement('div', { className: 'soundboard-grid' },
                    Object.keys(t.soundboard.sounds).map((soundKey) =>
                      React.createElement('button', {
                        key: soundKey,
                        type: 'button',
                        className: 'soundboard-item',
                        onClick: () => handleSoundSelect(soundKey)
                      }, t.soundboard.sounds[soundKey])
                    )
                  )
                )
              ),
              React.createElement('input', {
                id: 'outgoing',
                type: 'text',
                placeholder: t.chat.inputPlaceholder,
                autoComplete: 'off',
                disabled: !channelReady || isRecording || isTranscribing,
                value: inputText,
                onChange: (event) => setInputText(event.target.value),
                onKeyDown: (event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault();
                    handleSend();
                  }
                },
                maxLength: MAX_MESSAGE_LENGTH,
                'aria-label': t.chat.inputAriaLabel,
                'aria-describedby': 'channel-status'
              }),
              React.createElement('button', {
                type: 'button',
                className: isRecording ? 'voice-button voice-button-recording' : 'voice-button',
                onClick: handleVoiceRecording,
                disabled: !channelReady || isTranscribing,
                'aria-label': isRecording ? t.chat.voiceButtonAriaLabelRecording : t.chat.voiceButtonAriaLabel,
                title: isRecording ? t.chat.voiceButtonTitleRecording : t.chat.voiceButtonTitle
              }, isRecording ? t.chat.voiceButtonRecording : (isTranscribing ? '⏳' : t.chat.voiceButton)),
              React.createElement('button', {
                type: 'button',
                className: 'ai-button',
                onClick: handleAiRewrite,
                disabled: isAiBusy || !inputText.trim(),
                'aria-label': openAiKey ? t.chat.aiButton : t.chat.aiButtonNoKey,
                title: openAiKey ? t.chat.aiButtonTitle : t.chat.aiButtonTitleNoKey
              }, isAiBusy ? t.chat.aiButtonBusy : t.chat.aiButton),
              React.createElement('button', {
                id: 'send',
                onClick: handleSend,
                disabled: !channelReady || !inputText.trim(),
                'aria-label': t.chat.sendAriaLabel,
                title: t.chat.sendTitle
              }, t.chat.send)
            ),
            React.createElement('p', {
              className: 'hint chat-counter',
              role: 'note'
            }, t.chat.charCount(inputText.length, MAX_MESSAGE_LENGTH)),
            (aiStatus || aiError) && React.createElement('p', {
              className: `hint ai-feedback${aiError ? ' ai-feedback-error' : ''}`,
              role: 'note'
            }, aiError || aiStatus)
          ),
          React.createElement('section', { id: 'statistics' },
            React.createElement('header', null,
              React.createElement('div', { className: 'header-content' },
                React.createElement('h2', null, t.statistics.title),
                React.createElement('p', { className: 'status' }, t.statistics.header)
              )
            ),
            !isLoadingStatistics && !statisticsError && React.createElement('p', { className: 'hint' },
              openAiKey ? t.statistics.aiSummaryNote : t.statistics.cachedNote
            ),
            React.createElement('div', { className: 'statistics-content' },
              isLoadingStatistics && React.createElement('p', { className: 'statistics-status' }, t.statistics.loading),
              statisticsError && React.createElement('p', { className: 'statistics-status statistics-error' }, statisticsError),
              !isLoadingStatistics && !statisticsError && statisticsIssues.length === 0 &&
                React.createElement('p', { className: 'statistics-status' }, t.statistics.noIssues),
              statisticsIssues.length > 0 && React.createElement('div', { className: 'statistics-table-wrapper' },
                React.createElement('table', { className: 'statistics-table' },
                  React.createElement('thead', null,
                    React.createElement('tr', null,
                      React.createElement('th', null, t.statistics.columns.issue),
                      React.createElement('th', null, t.statistics.columns.title),
                      React.createElement('th', null, t.statistics.columns.summary),
                      React.createElement('th', null, t.statistics.columns.status)
                    )
                  ),
                  React.createElement('tbody', null,
                    statisticsIssues.map((issue) => {
                      const statusClass = `status-badge status-${issue.status}`;
                      const statusText = t.statistics.status[issue.status] || issue.status;
                      const summary = issue.summary || issue.body.slice(0, 150) + (issue.body.length > 150 ? '...' : '');
                      const isAiGenerated = issue.needsAiSummary && issue.summary && issue.summary !== (issue.body.slice(0, 150) + (issue.body.length > 150 ? '...' : ''));
                      const summaryClass = `issue-summary${isAiGenerated ? ' summary-ai' : ''}${issue.needsAiSummary && !isAiGenerated ? ' summary-loading' : ''}`;

                      return React.createElement('tr', { key: issue.number },
                        React.createElement('td', { className: 'issue-number' },
                          React.createElement('a', {
                            href: issue.url,
                            target: '_blank',
                            rel: 'noopener noreferrer'
                          }, t.statistics.issueNumber(issue.number))
                        ),
                        React.createElement('td', { className: 'issue-title' }, issue.title),
                        React.createElement('td', { className: summaryClass }, summary),
                        React.createElement('td', { className: 'issue-status' },
                          React.createElement('span', { className: statusClass }, statusText)
                        )
                      );
                    })
                  )
                )
              ),
              randomJoke && React.createElement('div', { className: 'statistics-joke' },
                React.createElement('h3', null, t.statistics.joke.title),
                React.createElement('p', null, randomJoke)
              )
            )
          ),
          React.createElement('section', { id: 'pong' },
            React.createElement('header', null,
              React.createElement('div', { className: 'header-content' },
                React.createElement('h2', null, t.pong.title)
              )
            ),
            React.createElement('div', { className: 'pong-content' },
              isPongActive && React.createElement('div', { className: 'pong-canvas-container' },
                React.createElement('canvas', {
                  ref: pongCanvasRef,
                  className: 'pong-canvas',
                  width: 800,
                  height: 600
                })
              ),
              isPongActive && React.createElement('div', { className: 'pong-score-display' },
                React.createElement('div', { className: 'pong-score-item' },
                  React.createElement('h3', null, t.pong.score),
                  React.createElement('div', { className: 'pong-score-value' }, pongScore.left),
                  React.createElement('div', { className: 'pong-lives' }, '❤️'.repeat(pongLives.left))
                ),
                React.createElement('div', { className: 'pong-score-item' },
                  React.createElement('h3', null, t.pong.score),
                  React.createElement('div', { className: 'pong-score-value' }, pongScore.right),
                  React.createElement('div', { className: 'pong-lives' }, '❤️'.repeat(pongLives.right))
                )
              ),
              isPongActive && React.createElement('p', { className: 'pong-instructions' }, t.pong.instructions),
              React.createElement('div', { className: 'pong-controls' },
                isPongActive && React.createElement('button', {
                  onClick: handleStopPong
                }, t.pong.closeGame),
                !isPongActive && !channelReady && React.createElement('p', { className: 'hint' }, t.pong.waitingForPeer)
              )
            )
          ),
          // Trivia game section
          window.renderTriviaSection && window.renderTriviaSection({
            isTriviaActive,
            triviaGameState,
            triviaQuestionCount,
            setTriviaQuestionCount,
            channelReady,
            handleStartTrivia,
            handleStopTrivia,
            handleTriviaAnswer,
            t
          }),
          React.createElement('section', { id: 'danger-zone', className: 'danger-zone' },
            React.createElement('header', null,
              React.createElement('div', { className: 'header-content' },
                React.createElement('h2', null, t.dangerZone.title),
                React.createElement('p', { className: 'danger-zone-warning' }, t.dangerZone.warning)
              )
            ),
            React.createElement('div', { className: 'danger-zone-content' },
              React.createElement('p', { className: 'danger-zone-description' }, t.dangerZone.description),
              React.createElement('div', { className: 'danger-zone-actions' },
                React.createElement('div', { className: 'danger-zone-action-item' },
                  React.createElement('button', {
                    className: 'danger-zone-button',
                    onClick: () => handleOpenDangerZoneModal('clearLocalData'),
                    disabled: isApiKeyModalOpen
                  }, t.dangerZone.clearLocalData),
                  React.createElement('p', { className: 'danger-zone-action-desc' }, t.dangerZone.clearLocalDataDesc)
                ),
                React.createElement('div', { className: 'danger-zone-action-item' },
                  React.createElement('button', {
                    className: 'danger-zone-button',
                    onClick: () => handleOpenDangerZoneModal('clearSession'),
                    disabled: isApiKeyModalOpen
                  }, t.dangerZone.clearSession),
                  React.createElement('p', { className: 'danger-zone-action-desc' }, t.dangerZone.clearSessionDesc)
                ),
                React.createElement('div', { className: 'danger-zone-action-item' },
                  React.createElement('button', {
                    className: 'danger-zone-button danger-zone-button-nuclear',
                    onClick: () => handleOpenDangerZoneModal('nuclear'),
                    disabled: isApiKeyModalOpen
                  }, t.dangerZone.nuclearOption),
                  React.createElement('p', { className: 'danger-zone-action-desc' }, t.dangerZone.nuclearOptionDesc)
                )
              )
            )
          ),
          isDangerZoneModalOpen && React.createElement('div', { className: 'modal-overlay', role: 'presentation' },
            React.createElement('div', {
              className: 'modal-content danger-zone-modal',
              role: 'dialog',
              'aria-modal': 'true',
              'aria-labelledby': 'danger-zone-dialog-title',
              onClick: (event) => event.stopPropagation()
            },
              React.createElement('div', { className: 'modal-header' },
                React.createElement('h2', { id: 'danger-zone-dialog-title' },
                  dangerZoneAction === 'clearLocalData' ? t.dangerZone.confirmModal.clearLocalDataTitle :
                  dangerZoneAction === 'clearSession' ? t.dangerZone.confirmModal.clearSessionTitle :
                  t.dangerZone.confirmModal.nuclearTitle
                ),
                React.createElement('button', {
                  className: 'modal-close',
                  onClick: handleCloseDangerZoneModal,
                  'aria-label': t.dangerZone.confirmModal.cancelButton
                }, '×')
              ),
              React.createElement('div', { className: 'modal-body' },
                React.createElement('p', { className: 'danger-zone-modal-message', style: { whiteSpace: 'pre-line' } },
                  dangerZoneAction === 'clearLocalData' ? t.dangerZone.confirmModal.clearLocalDataMessage :
                  dangerZoneAction === 'clearSession' ? t.dangerZone.confirmModal.clearSessionMessage :
                  t.dangerZone.confirmModal.nuclearMessage
                ),
                dangerZoneAction === 'nuclear' && React.createElement('input', {
                  type: 'text',
                  value: dangerZoneConfirmInput,
                  onChange: (event) => setDangerZoneConfirmInput(event.target.value),
                  placeholder: t.dangerZone.confirmModal.confirmPlaceholder,
                  className: 'danger-zone-confirm-input',
                  autoFocus: true
                }),
                dangerZoneAction === 'nuclear' && dangerZoneConfirmInput && dangerZoneConfirmInput !== 'LÖSCHEN' &&
                  React.createElement('p', { className: 'modal-error', role: 'alert' }, t.dangerZone.confirmModal.typeMismatch),
                React.createElement('div', { className: 'modal-actions' },
                  React.createElement('button', {
                    type: 'button',
                    className: 'danger-zone-confirm-button',
                    onClick: handleConfirmDangerZoneAction,
                    disabled: dangerZoneAction === 'nuclear' && dangerZoneConfirmInput !== 'LÖSCHEN'
                  }, t.dangerZone.confirmModal.confirmButton),
                  React.createElement('button', {
                    type: 'button',
                    onClick: handleCloseDangerZoneModal
                  }, t.dangerZone.confirmModal.cancelButton)
                )
              )
            )
          )
        )
      )
    );
  }

  const rootElement = document.getElementById('root');
  const root = ReactDOM.createRoot(rootElement);
  root.render(React.createElement(App));
})();
