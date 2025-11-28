/**
 * @fileoverview MorpheusTshirt React component - displays Morpheus's T-shirt of the day
 * @module components/MorpheusTshirt
 */

/**
 * Renders the "Morpheus T-shirt of the Day" feature
 * Shows a different T-shirt each day from the curated collection
 * @param {Object} props
 * @param {Object} props.t - Translation object
 * @param {Object} props.tshirt - T-shirt data object
 * @param {string} props.tshirt.id - Unique identifier
 * @param {string} props.tshirt.description - T-shirt description
 * @param {string} [props.tshirt.color] - Primary color
 * @param {string} [props.tshirt.design] - Design description
 * @param {string} [props.tshirt.videoRef] - Video reference
 * @param {string} [props.tshirt.imageUrl] - Image URL (optional)
 * @param {string} [props.tshirt.imageData] - Base64 image data (optional)
 * @returns {React.ReactElement}
 * @export
 */
export function MorpheusTshirt({ t, tshirt }) {
  // Generate a placeholder visual based on the color
  const getColorHex = (colorName) => {
    const colorMap = {
      'black': '#1a1a1a',
      'navy blue': '#001f3f',
      'dark grey': '#4a4a4a',
      'charcoal': '#36454f',
      'wine red': '#722f37',
      'forest green': '#228b22',
      'steel blue': '#4682b4',
      'dark purple': '#4b0082',
      'olive green': '#808000',
      'burgundy': '#800020'
    };
    return colorMap[colorName?.toLowerCase()] || '#333333';
  };

  const renderPlaceholder = () => {
    const colorHex = getColorHex(tshirt.color);

    // Create a simple T-shirt SVG placeholder
    return React.createElement(
      'svg',
      {
        className: 'morpheus-tshirt-placeholder',
        viewBox: '0 0 200 240',
        xmlns: 'http://www.w3.org/2000/svg',
        'aria-hidden': 'true'
      },
      [
        // T-shirt body
        React.createElement('path', {
          key: 'body',
          d: 'M60 40 L40 60 L40 240 L160 240 L160 60 L140 40 L120 50 L100 45 L80 50 Z',
          fill: colorHex,
          stroke: '#666',
          strokeWidth: '2'
        }),
        // Collar
        React.createElement('path', {
          key: 'collar',
          d: 'M80 40 L90 50 L100 45 L110 50 L120 40 L110 60 L90 60 Z',
          fill: colorHex,
          stroke: '#666',
          strokeWidth: '2'
        }),
        // Left sleeve
        React.createElement('path', {
          key: 'sleeve-left',
          d: 'M60 40 L20 80 L30 100 L40 60 Z',
          fill: colorHex,
          stroke: '#666',
          strokeWidth: '2'
        }),
        // Right sleeve
        React.createElement('path', {
          key: 'sleeve-right',
          d: 'M140 40 L180 80 L170 100 L160 60 Z',
          fill: colorHex,
          stroke: '#666',
          strokeWidth: '2'
        }),
        // Design element (if applicable)
        tshirt.design && React.createElement('text', {
          key: 'design',
          x: '100',
          y: '140',
          textAnchor: 'middle',
          fill: '#888',
          fontSize: '12',
          fontFamily: 'monospace'
        }, '{ }')
      ]
    );
  };

  const renderImage = () => {
    if (tshirt.imageUrl) {
      return React.createElement('img', {
        src: tshirt.imageUrl,
        alt: tshirt.description,
        className: 'morpheus-tshirt-image',
        loading: 'lazy'
      });
    } else if (tshirt.imageData) {
      return React.createElement('img', {
        src: `data:image/png;base64,${tshirt.imageData}`,
        alt: tshirt.description,
        className: 'morpheus-tshirt-image',
        loading: 'lazy'
      });
    } else {
      return renderPlaceholder();
    }
  };

  return React.createElement(
    'div',
    {
      className: 'morpheus-tshirt-container',
      role: 'article',
      'aria-label': t?.morpheusTshirt?.ariaLabel || 'Morpheus T-shirt of the day'
    },
    [
      React.createElement(
        'h3',
        { key: 'title', className: 'morpheus-tshirt-title' },
        t?.morpheusTshirt?.title || 'Morpheus T-shirt of the Day'
      ),
      React.createElement(
        'div',
        { key: 'image-wrapper', className: 'morpheus-tshirt-image-wrapper' },
        renderImage()
      ),
      React.createElement(
        'div',
        { key: 'details', className: 'morpheus-tshirt-details' },
        [
          React.createElement(
            'p',
            { key: 'description', className: 'morpheus-tshirt-description' },
            tshirt.description
          ),
          tshirt.color && React.createElement(
            'p',
            { key: 'color', className: 'morpheus-tshirt-meta' },
            [
              React.createElement('strong', { key: 'color-label' }, t?.morpheusTshirt?.color || 'Color: '),
              tshirt.color
            ]
          ),
          tshirt.design && React.createElement(
            'p',
            { key: 'design', className: 'morpheus-tshirt-meta' },
            [
              React.createElement('strong', { key: 'design-label' }, t?.morpheusTshirt?.design || 'Design: '),
              tshirt.design
            ]
          ),
          React.createElement(
            'p',
            { key: 'contribute', className: 'morpheus-tshirt-contribute' },
            t?.morpheusTshirt?.contribute ||
            'Want to contribute real images? Submit a PR to replace placeholders with actual screenshots from Morpheus\'s videos!'
          )
        ]
      )
    ]
  );
}
