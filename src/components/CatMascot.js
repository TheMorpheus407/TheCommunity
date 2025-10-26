/**
 * @fileoverview Cat mascot component for cat theme.
 * @module components/CatMascot
 */

import React from 'react';

/**
 * CatMascot - A cute SVG cat mascot for the cat theme
 * @returns {React.ReactElement} Cat mascot SVG
 */
export function CatMascot() {
  return React.createElement(
    'svg',
    {
      className: 'cat-mascot',
      width: '64',
      height: '64',
      viewBox: '0 0 64 64',
      fill: 'none',
      xmlns: 'http://www.w3.org/2000/svg',
      role: 'img',
      'aria-label': 'Cute cat mascot'
    },
    // Left ear
    React.createElement('path', {
      d: 'M18 12 L12 2 L22 8 Z',
      fill: '#ff85c8',
      stroke: '#ff69b4',
      strokeWidth: '1.5',
      className: 'cat-ear-left'
    }),
    // Right ear
    React.createElement('path', {
      d: 'M46 12 L52 2 L42 8 Z',
      fill: '#ff85c8',
      stroke: '#ff69b4',
      strokeWidth: '1.5',
      className: 'cat-ear-right'
    }),
    // Inner left ear
    React.createElement('path', {
      d: 'M18 10 L15 4 L21 9 Z',
      fill: '#ffa8d8',
      className: 'cat-ear-inner'
    }),
    // Inner right ear
    React.createElement('path', {
      d: 'M46 10 L49 4 L43 9 Z',
      fill: '#ffa8d8',
      className: 'cat-ear-inner'
    }),
    // Head (main circle)
    React.createElement('circle', {
      cx: '32',
      cy: '32',
      r: '20',
      fill: '#ffb3d9',
      stroke: '#ff69b4',
      strokeWidth: '2',
      className: 'cat-head'
    }),
    // Left cheek
    React.createElement('circle', {
      cx: '22',
      cy: '34',
      r: '6',
      fill: '#ffc9e6',
      className: 'cat-cheek'
    }),
    // Right cheek
    React.createElement('circle', {
      cx: '42',
      cy: '34',
      r: '6',
      fill: '#ffc9e6',
      className: 'cat-cheek'
    }),
    // Left eye outer
    React.createElement('ellipse', {
      cx: '26',
      cy: '28',
      rx: '4',
      ry: '6',
      fill: '#4a4a4a',
      className: 'cat-eye'
    }),
    // Right eye outer
    React.createElement('ellipse', {
      cx: '38',
      cy: '28',
      rx: '4',
      ry: '6',
      fill: '#4a4a4a',
      className: 'cat-eye'
    }),
    // Left eye shine
    React.createElement('ellipse', {
      cx: '26',
      cy: '26',
      rx: '2',
      ry: '3',
      fill: 'white',
      className: 'cat-eye-shine',
      opacity: '0.8'
    }),
    // Right eye shine
    React.createElement('ellipse', {
      cx: '38',
      cy: '26',
      rx: '2',
      ry: '3',
      fill: 'white',
      className: 'cat-eye-shine',
      opacity: '0.8'
    }),
    // Nose
    React.createElement('path', {
      d: 'M32 34 L30 36 L34 36 Z',
      fill: '#ff69b4',
      className: 'cat-nose'
    }),
    // Mouth left
    React.createElement('path', {
      d: 'M32 36 Q28 40 24 38',
      stroke: '#ff69b4',
      strokeWidth: '1.5',
      fill: 'none',
      strokeLinecap: 'round',
      className: 'cat-mouth'
    }),
    // Mouth right
    React.createElement('path', {
      d: 'M32 36 Q36 40 40 38',
      stroke: '#ff69b4',
      strokeWidth: '1.5',
      fill: 'none',
      strokeLinecap: 'round',
      className: 'cat-mouth'
    }),
    // Left whisker 1
    React.createElement('line', {
      x1: '12',
      y1: '30',
      x2: '20',
      y2: '32',
      stroke: '#ff85c8',
      strokeWidth: '1',
      className: 'cat-whisker'
    }),
    // Left whisker 2
    React.createElement('line', {
      x1: '12',
      y1: '34',
      x2: '20',
      y2: '34',
      stroke: '#ff85c8',
      strokeWidth: '1',
      className: 'cat-whisker'
    }),
    // Left whisker 3
    React.createElement('line', {
      x1: '12',
      y1: '38',
      x2: '20',
      y2: '36',
      stroke: '#ff85c8',
      strokeWidth: '1',
      className: 'cat-whisker'
    }),
    // Right whisker 1
    React.createElement('line', {
      x1: '52',
      y1: '30',
      x2: '44',
      y2: '32',
      stroke: '#ff85c8',
      strokeWidth: '1',
      className: 'cat-whisker'
    }),
    // Right whisker 2
    React.createElement('line', {
      x1: '52',
      y1: '34',
      x2: '44',
      y2: '34',
      stroke: '#ff85c8',
      strokeWidth: '1',
      className: 'cat-whisker'
    }),
    // Right whisker 3
    React.createElement('line', {
      x1: '52',
      y1: '38',
      x2: '44',
      y2: '36',
      stroke: '#ff85c8',
      strokeWidth: '1',
      className: 'cat-whisker'
    }),
    // Heart accent on forehead
    React.createElement('path', {
      d: 'M32 20 C32 20, 30 18, 28 18 C26 18, 25 19, 25 21 C25 23, 32 28, 32 28 C32 28, 39 23, 39 21 C39 19, 38 18, 36 18 C34 18, 32 20, 32 20 Z',
      fill: '#ff69b4',
      opacity: '0.5',
      className: 'cat-heart'
    })
  );
}

/**
 * Paw print icon component
 * @param {Object} props - Component props
 * @param {string} [props.size='24'] - Icon size
 * @param {string} [props.className=''] - Additional CSS classes
 * @returns {React.ReactElement} Paw print SVG
 */
export function PawIcon({ size = '24', className = '' }) {
  return React.createElement(
    'svg',
    {
      className: `paw-icon ${className}`,
      width: size,
      height: size,
      viewBox: '0 0 24 24',
      fill: 'none',
      xmlns: 'http://www.w3.org/2000/svg',
      role: 'img',
      'aria-label': 'Paw print'
    },
    // Main pad
    React.createElement('ellipse', {
      cx: '12',
      cy: '16',
      rx: '5',
      ry: '4',
      fill: 'currentColor'
    }),
    // Top left toe
    React.createElement('circle', {
      cx: '7',
      cy: '10',
      r: '2',
      fill: 'currentColor'
    }),
    // Top middle left toe
    React.createElement('circle', {
      cx: '10',
      cy: '7',
      r: '2',
      fill: 'currentColor'
    }),
    // Top middle right toe
    React.createElement('circle', {
      cx: '14',
      cy: '7',
      r: '2',
      fill: 'currentColor'
    }),
    // Top right toe
    React.createElement('circle', {
      cx: '17',
      cy: '10',
      r: '2',
      fill: 'currentColor'
    })
  );
}
