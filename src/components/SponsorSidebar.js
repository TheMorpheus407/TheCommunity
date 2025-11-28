/**
 * @fileoverview Sponsor Sidebar Component - Displays sidebar advertisements
 * @module components/SponsorSidebar
 *
 * This component renders a sidebar ad creative in the application.
 * It handles:
 * - Safe rendering of ad content
 * - Click tracking
 * - Vertical layout optimization
 * - Accessibility
 */

/**
 * Sponsor Sidebar Component
 * @param {Object} props - Component props
 * @param {Object|null} props.creative - Ad creative to display
 * @param {Function} props.onAdClick - Click tracking callback
 * @returns {React.Element|null} Sidebar component or null if no creative
 */
export function SponsorSidebar({ creative, onAdClick }) {
  if (!creative || !creative.assets) {
    return null;
  }

  const { assets } = creative;

  const handleClick = (e) => {
    e.preventDefault();

    // Track the click
    if (onAdClick) {
      onAdClick(creative.id, assets.targetUrl);
    }

    // Navigate if it's a hash link
    if (assets.targetUrl.startsWith('#')) {
      window.location.hash = assets.targetUrl;
    } else if (assets.targetUrl.startsWith('http')) {
      // Open external links in new tab
      window.open(assets.targetUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return React.createElement(
    'div',
    {
      className: 'sponsor-sidebar',
      role: 'complementary',
      'aria-label': 'Sponsored content'
    },
    React.createElement(
      'div',
      { className: 'sponsor-label' },
      'Sponsored'
    ),
    React.createElement(
      'a',
      {
        href: assets.targetUrl,
        onClick: handleClick,
        className: 'sponsor-sidebar-link',
        'aria-label': `Sponsored ad: ${assets.title}`
      },
      React.createElement(
        'div',
        { className: 'sponsor-sidebar-content' },
        React.createElement(
          'h4',
          { className: 'sponsor-sidebar-title' },
          assets.title
        ),
        assets.description && React.createElement(
          'p',
          { className: 'sponsor-sidebar-description' },
          assets.description
        ),
        assets.ctaText && React.createElement(
          'button',
          { className: 'sponsor-sidebar-cta', type: 'button' },
          assets.ctaText
        )
      )
    )
  );
}
