/**
 * @fileoverview TuxMascot React component - angry penguin that reacts on hover.
 * @module components/TuxMascot
 */

/**
 * Renders the mascot that reacts angrily on hover.
 * Pure SVG so it can be reused without additional assets.
 * @param {Object} props
 * @param {Object} props.t - Translation object
 * @param {string|null} props.animation - Animation type ('flower' or 'diamond')
 * @returns {React.ReactElement}
 * @export
 */
export function TuxMascot({ t, animation }) {
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
