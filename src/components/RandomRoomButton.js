/**
 * @fileoverview Random room button component with Tux and dice animation.
 * @module components/RandomRoomButton
 */

const { createElement } = React;

/**
 * Random room button component showing Tux with a rotating dice
 * @param {Object} props
 * @param {Object} props.t - Translation object
 * @param {Function} props.onClick - Click handler
 * @returns {React.ReactElement}
 */
export function RandomRoomButton({ t, onClick }) {
  return createElement(
    'button',
    {
      className: 'random-room-button',
      onClick: onClick,
      title: t.rooms.randomButtonTitle,
      'aria-label': t.rooms.randomButtonAria
    },
    createElement(
      'svg',
      {
        className: 'random-room-svg',
        viewBox: '0 0 140 120',
        xmlns: 'http://www.w3.org/2000/svg',
        'aria-hidden': 'true',
        focusable: 'false'
      },
      // Tux penguin (simplified, sitting pose)
      createElement('ellipse', { className: 'tux-shadow', cx: '40', cy: '112', rx: '20', ry: '6' }),
      createElement('ellipse', { className: 'tux-body', cx: '40', cy: '65', rx: '28', ry: '40' }),
      createElement('ellipse', { className: 'tux-belly', cx: '40', cy: '80', rx: '18', ry: '24' }),
      createElement('ellipse', { className: 'tux-head', cx: '40', cy: '42', rx: '22', ry: '20' }),
      createElement('ellipse', { className: 'tux-face', cx: '40', cy: '50', rx: '16', ry: '12' }),
      // Wings
      createElement('ellipse', { className: 'tux-wing', cx: '18', cy: '72', rx: '9', ry: '20' }),
      createElement('ellipse', { className: 'tux-wing', cx: '62', cy: '72', rx: '9', ry: '20' }),
      // Feet
      createElement('path', { className: 'tux-foot', d: 'M28 98 C25 104 28 108 34 108 L38 108 C42 108 44 104 41 98 Z' }),
      createElement('path', { className: 'tux-foot', d: 'M52 98 C49 104 52 108 58 108 L62 108 C66 108 68 104 65 98 Z' }),
      // Beak
      createElement('polygon', { className: 'tux-beak-upper', points: '40,48 32,52 48,52' }),
      createElement('ellipse', { className: 'tux-beak-lower', cx: '40', cy: '54', rx: '8', ry: '3' }),
      // Eyes
      createElement('circle', { className: 'tux-eye', cx: '34', cy: '42', r: '5' }),
      createElement('circle', { className: 'tux-eye', cx: '46', cy: '42', r: '5' }),
      createElement('circle', { className: 'tux-pupil', cx: '35', cy: '43', r: '2' }),
      createElement('circle', { className: 'tux-pupil', cx: '47', cy: '43', r: '2' }),

      // Dice (in front of Tux) - 3D cube representation
      createElement('g', { className: 'dice-cube' },
        // Top face
        createElement('path', {
          className: 'dice-face dice-top',
          d: 'M85 50 L105 40 L125 50 L105 60 Z'
        }),
        // Left face
        createElement('path', {
          className: 'dice-face dice-left',
          d: 'M85 50 L85 85 L105 95 L105 60 Z'
        }),
        // Right face
        createElement('path', {
          className: 'dice-face dice-right',
          d: 'M105 60 L105 95 L125 85 L125 50 Z'
        }),
        // Dots on visible faces
        createElement('circle', { className: 'dice-dot', cx: '105', cy: '50', r: '2' }), // Top center
        createElement('circle', { className: 'dice-dot', cx: '95', cy: '68', r: '2' }), // Left
        createElement('circle', { className: 'dice-dot', cx: '95', cy: '77', r: '2' }), // Left
        createElement('circle', { className: 'dice-dot', cx: '115', cy: '68', r: '2' }), // Right
        createElement('circle', { className: 'dice-dot', cx: '115', cy: '77', r: '2' })  // Right
      )
    )
  );
}
