/**
 * @fileoverview Brain's World Domination Plan easter egg component.
 * @module components/BrainsPlan
 */

const { useState, useCallback, createElement } = React;

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
export function BrainsPlan({ t, isVisible, onToggle }) {
  const [currentPlanIndex, setCurrentPlanIndex] = useState(
    Math.floor(Math.random() * WORLD_DOMINATION_PLANS.length)
  );

  const handleNewPlan = useCallback(() => {
    setCurrentPlanIndex((prev) => (prev + 1) % WORLD_DOMINATION_PLANS.length);
  }, []);

  return createElement(
    'div',
    { className: `brains-plan ${isVisible ? 'visible' : 'collapsed'}` },
    createElement(
      'div',
      { className: 'brains-plan-header', onClick: onToggle },
      createElement('span', { className: 'brains-plan-icon' }, '🧠'),
      createElement('h3', { className: 'brains-plan-title' }, t.brainsPlan?.title || "Brain's Plan for World Domination"),
      createElement('button', {
        className: 'brains-plan-toggle',
        'aria-label': isVisible ? (t.brainsPlan?.collapse || 'Collapse') : (t.brainsPlan?.expand || 'Expand'),
        'aria-expanded': isVisible
      }, isVisible ? '▼' : '▶')
    ),
    isVisible && createElement(
      'div',
      { className: 'brains-plan-content' },
      createElement('p', { className: 'brains-plan-text' }, WORLD_DOMINATION_PLANS[currentPlanIndex]),
      createElement('div', { className: 'brains-plan-actions' },
        createElement('button', {
          className: 'brains-plan-button',
          onClick: handleNewPlan
        }, t.brainsPlan?.newPlan || 'New Plan')
      ),
      createElement('p', { className: 'brains-plan-signature' }, '- The Brain')
    )
  );
}
