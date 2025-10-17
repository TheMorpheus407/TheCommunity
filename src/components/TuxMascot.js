/**
 * @fileoverview TuxMascot React component - angry penguin that reacts on hover.
 * @module components/TuxMascot
 */

/**
 * Renders the mascot that reacts angrily on hover.
 * Pure SVG so it can be reused without additional assets.
 * @param {Object} props
 * @param {Object} props.t - Translation object
 * @returns {React.ReactElement}
 * @export
 */
export function TuxMascot({ t }) {
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

  return React.createElement(
    'div',
    {
      className: 'tux-mascot',
      role: 'img',
      'aria-label': t.mascot.ariaLabel
    },
    React.createElement(
      'svg',
      {
        className: 'tux-svg',
        viewBox: '0 0 120 120',
        xmlns: 'http://www.w3.org/2000/svg',
        'aria-hidden': 'true',
        focusable: 'false'
      },
      svgChildren
    )
  );
}
