/**
 * @fileoverview Sponsor Banner Component - Displays banner advertisements
 * @module components/SponsorBanner
 *
 * This component renders a banner ad creative in the application.
 * It handles:
 * - Safe rendering of ad content
 * - Click tracking
 * - Responsive design
 * - Accessibility
 */

/**
 * Sponsor Banner Component
 * @param {Object} props - Component props
 * @param {Object|null} props.creative - Ad creative to display
 * @param {Function} props.onAdClick - Click tracking callback
 * @returns {React.Element|null} Banner component or null if no creative
 */
export function SponsorBanner({ creative, onAdClick }) {
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
      className: 'sponsor-banner',
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
        className: 'sponsor-banner-link',
        'aria-label': `Sponsored ad: ${assets.title}`
      },
      React.createElement(
        'div',
        { className: 'sponsor-banner-content' },
        React.createElement(
          'h3',
          { className: 'sponsor-banner-title' },
          assets.title
        ),
        assets.description && React.createElement(
          'p',
          { className: 'sponsor-banner-description' },
          assets.description
        ),
        assets.ctaText && React.createElement(
          'span',
          { className: 'sponsor-banner-cta' },
          assets.ctaText
        )
      )
    )
  );
}
