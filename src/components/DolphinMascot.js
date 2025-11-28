/**
 * @fileoverview Dolphin mascot component with SVG animation.
 * @module components/DolphinMascot
 */

const { createElement } = React;

/**
 * Dolphin mascot component
 * @param {Object} props
 * @param {Object} props.t - Translation object
 * @returns {React.ReactElement}
 */
export function DolphinMascot({ t }) {
  return createElement(
    'div',
    {
      className: 'dolphin-mascot',
      role: 'img',
      'aria-label': t?.mascot?.ariaLabel || 'Friendly dolphin mascot'
    },
    createElement(
      'svg',
      {
        className: 'dolphin-svg',
        width: '120',
        height: '120',
        viewBox: '0 0 120 120',
        fill: 'none',
        xmlns: 'http://www.w3.org/2000/svg',
        'aria-hidden': 'true',
        focusable: 'false'
      },
      // Water ripples
      createElement('ellipse', {
        key: 'water-ripple-1',
        className: 'dolphin-water-ripple',
        cx: '60',
        cy: '110',
        rx: '40',
        ry: '5',
        fill: '#87CEEB',
        opacity: '0.3'
      }),
      createElement('ellipse', {
        key: 'water-ripple-2',
        className: 'dolphin-water-ripple',
        cx: '60',
        cy: '112',
        rx: '50',
        ry: '4',
        fill: '#87CEEB',
        opacity: '0.2'
      }),
      // Tail
      createElement('path', {
        key: 'tail',
        className: 'dolphin-tail',
        d: 'M20 75 Q10 65 5 70 Q8 80 15 85 Q12 90 10 95 Q15 92 22 82 Z',
        fill: '#4A9FD8',
        stroke: '#2E7FB8',
        strokeWidth: '1.5'
      }),
      // Body
      createElement('ellipse', {
        key: 'body',
        className: 'dolphin-body',
        cx: '55',
        cy: '70',
        rx: '35',
        ry: '22',
        fill: '#5AB4E8',
        stroke: '#2E7FB8',
        strokeWidth: '2'
      }),
      // Belly
      createElement('ellipse', {
        key: 'belly',
        className: 'dolphin-belly',
        cx: '60',
        cy: '75',
        rx: '25',
        ry: '15',
        fill: '#E8F4F8'
      }),
      // Dorsal fin
      createElement('path', {
        key: 'dorsal-fin',
        className: 'dolphin-dorsal-fin',
        d: 'M55 50 Q50 35 52 30 Q58 35 60 50 Z',
        fill: '#4A9FD8',
        stroke: '#2E7FB8',
        strokeWidth: '1.5'
      }),
      // Head
      createElement('ellipse', {
        key: 'head',
        className: 'dolphin-head',
        cx: '75',
        cy: '60',
        rx: '20',
        ry: '18',
        fill: '#5AB4E8',
        stroke: '#2E7FB8',
        strokeWidth: '2'
      }),
      // Snout/beak
      createElement('ellipse', {
        key: 'snout',
        className: 'dolphin-snout',
        cx: '92',
        cy: '62',
        rx: '12',
        ry: '8',
        fill: '#5AB4E8',
        stroke: '#2E7FB8',
        strokeWidth: '2'
      }),
      createElement('ellipse', {
        key: 'snout-bottom',
        className: 'dolphin-snout-bottom',
        cx: '93',
        cy: '65',
        rx: '10',
        ry: '5',
        fill: '#E8F4F8'
      }),
      // Pectoral fin (left)
      createElement('path', {
        key: 'pectoral-fin',
        className: 'dolphin-pectoral-fin',
        d: 'M50 72 Q35 75 30 80 Q38 82 50 78 Z',
        fill: '#4A9FD8',
        stroke: '#2E7FB8',
        strokeWidth: '1.5'
      }),
      // Eye
      createElement('circle', {
        key: 'eye-white',
        className: 'dolphin-eye-white',
        cx: '78',
        cy: '55',
        r: '5',
        fill: 'white'
      }),
      createElement('circle', {
        key: 'eye-pupil',
        className: 'dolphin-eye-pupil',
        cx: '79',
        cy: '56',
        r: '2.5',
        fill: '#1a1a1a'
      }),
      createElement('circle', {
        key: 'eye-shine',
        className: 'dolphin-eye-shine',
        cx: '80',
        cy: '54.5',
        r: '1.5',
        fill: 'white'
      }),
      // Smile
      createElement('path', {
        key: 'smile',
        className: 'dolphin-smile',
        d: 'M85 64 Q88 67 92 66',
        stroke: '#2E7FB8',
        strokeWidth: '1.5',
        fill: 'none',
        strokeLinecap: 'round'
      }),
      // Water splashes (animated)
      createElement('path', {
        key: 'splash-1',
        className: 'dolphin-splash',
        d: 'M95 50 Q98 45 100 48',
        stroke: '#87CEEB',
        strokeWidth: '2',
        fill: 'none',
        strokeLinecap: 'round',
        opacity: '0.6'
      }),
      createElement('path', {
        key: 'splash-2',
        className: 'dolphin-splash',
        d: 'M102 55 Q105 52 107 55',
        stroke: '#87CEEB',
        strokeWidth: '2',
        fill: 'none',
        strokeLinecap: 'round',
        opacity: '0.5'
      })
    )
  );
}
