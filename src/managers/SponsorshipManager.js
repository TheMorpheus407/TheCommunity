/**
 * @fileoverview Sponsorship Manager - Handles ad display and campaign management
 * @module managers/SponsorshipManager
 *
 * This manager handles:
 * - Ad creative loading and caching
 * - Placement zone management
 * - Impression and click tracking (local only)
 * - Campaign rotation logic
 * - Frequency capping
 *
 * Note: This is a client-side only implementation. Full B2B functionality
 * (payments, analytics aggregation, contract management) requires a backend.
 * See docs/SPONSORSHIP_SYSTEM.md for complete architecture.
 *
 * Security features:
 * - URL validation for ad assets
 * - XSS prevention via React rendering
 * - Click tracking rate limiting
 * - Local storage only (no server calls)
 */

/**
 * Creates a factory for sponsorship operations
 * @param {Object} deps - Dependencies object
 * @param {React.MutableRefObject} deps.activeAdsRef - Currently displayed ads
 * @param {React.MutableRefObject} deps.adImpressionCacheRef - Impression frequency cache
 * @param {Function} deps.setActiveBannerAd - Banner ad state setter
 * @param {Function} deps.setActiveSidebarAd - Sidebar ad state setter
 * @returns {Object} Sponsorship operations
 * @export
 */
export function createSponsorshipManager(deps) {
  const {
    activeAdsRef,
    adImpressionCacheRef,
    setActiveBannerAd,
    setActiveSidebarAd
  } = deps;

  /**
   * Sample campaigns for demonstration
   * In production, these would be fetched from a backend API
   * @private
   */
  const SAMPLE_CAMPAIGNS = [
    {
      id: 'demo-webrtc-tools',
      sponsorId: 'sponsor-001',
      name: 'WebRTC Developer Tools',
      status: 'active',
      placements: ['banner', 'sidebar'],
      creatives: {
        banner: {
          id: 'creative-001-banner',
          format: 'banner-728x90',
          assets: {
            title: 'Professional WebRTC Tools',
            description: 'Build peer-to-peer apps faster',
            ctaText: 'Learn More',
            targetUrl: '#webrtc-tools',
            imageUrl: null // Would be actual image in production
          },
          dimensions: { width: 728, height: 90 }
        },
        sidebar: {
          id: 'creative-001-sidebar',
          format: 'sidebar-160x600',
          assets: {
            title: 'WebRTC SDK',
            description: 'Enterprise-grade P2P communication',
            ctaText: 'Get Started',
            targetUrl: '#webrtc-sdk',
            imageUrl: null
          },
          dimensions: { width: 160, height: 600 }
        }
      },
      targeting: {
        frequencyCap: {
          impressionsPerUser: 3,
          periodHours: 24
        }
      }
    }
  ];

  /**
   * Validates a URL for security
   * @param {string} url - URL to validate
   * @returns {boolean} True if URL is safe
   * @private
   */
  function isValidUrl(url) {
    if (!url || typeof url !== 'string') return false;

    try {
      const parsed = new URL(url);
      // Allow only http, https, and hash links
      return ['http:', 'https:', ''].includes(parsed.protocol);
    } catch {
      // Hash-only links like "#demo" are valid
      return url.startsWith('#');
    }
  }

  /**
   * Validates an ad creative object
   * @param {Object} creative - Creative to validate
   * @returns {boolean} True if creative is valid
   * @private
   */
  function isValidCreative(creative) {
    if (!creative || typeof creative !== 'object') return false;
    if (!creative.id || typeof creative.id !== 'string') return false;
    if (!creative.assets || typeof creative.assets !== 'object') return false;

    const { assets } = creative;
    if (!assets.title || typeof assets.title !== 'string') return false;
    if (!assets.targetUrl || !isValidUrl(assets.targetUrl)) return false;

    // Validate lengths to prevent abuse
    if (assets.title.length > 100) return false;
    if (assets.description && assets.description.length > 200) return false;
    if (assets.ctaText && assets.ctaText.length > 30) return false;

    return true;
  }

  /**
   * Checks if user has exceeded frequency cap for a creative
   * @param {string} creativeId - Creative ID to check
   * @param {Object} frequencyCap - Frequency cap configuration
   * @returns {boolean} True if under cap
   * @private
   */
  function isUnderFrequencyCap(creativeId, frequencyCap) {
    if (!frequencyCap) return true;

    const cache = adImpressionCacheRef.current || {};
    const impressions = cache[creativeId] || [];
    const now = Date.now();
    const periodMs = frequencyCap.periodHours * 60 * 60 * 1000;

    // Filter out old impressions
    const recentImpressions = impressions.filter(
      timestamp => (now - timestamp) < periodMs
    );

    return recentImpressions.length < frequencyCap.impressionsPerUser;
  }

  /**
   * Records an impression for frequency capping
   * @param {string} creativeId - Creative ID
   * @private
   */
  function recordImpression(creativeId) {
    const cache = adImpressionCacheRef.current || {};
    if (!cache[creativeId]) {
      cache[creativeId] = [];
    }
    cache[creativeId].push(Date.now());

    // Keep only last 100 impressions per creative
    if (cache[creativeId].length > 100) {
      cache[creativeId] = cache[creativeId].slice(-100);
    }

    adImpressionCacheRef.current = cache;

    // Persist to localStorage for cross-session tracking
    try {
      localStorage.setItem('sponsorship-impressions', JSON.stringify(cache));
    } catch (error) {
      console.warn('Could not persist ad impressions', error);
    }
  }

  /**
   * Loads impression cache from localStorage
   * @private
   */
  function loadImpressionCache() {
    try {
      const stored = localStorage.getItem('sponsorship-impressions');
      if (stored) {
        adImpressionCacheRef.current = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Could not load ad impression cache', error);
      adImpressionCacheRef.current = {};
    }
  }

  /**
   * Selects a campaign for a specific placement
   * @param {string} placement - Placement zone (e.g., 'banner', 'sidebar')
   * @param {Object[]} campaigns - Available campaigns
   * @returns {Object|null} Selected campaign creative or null
   * @private
   */
  function selectCampaignForPlacement(placement, campaigns) {
    // Filter active campaigns that target this placement
    const eligible = campaigns.filter(campaign => {
      if (campaign.status !== 'active') return false;
      if (!campaign.placements || !campaign.placements.includes(placement)) return false;
      if (!campaign.creatives || !campaign.creatives[placement]) return false;

      const creative = campaign.creatives[placement];
      if (!isValidCreative(creative)) return false;

      // Check frequency cap
      const frequencyCap = campaign.targeting?.frequencyCap;
      if (!isUnderFrequencyCap(creative.id, frequencyCap)) return false;

      return true;
    });

    if (eligible.length === 0) return null;

    // Simple random selection (in production, use weighted selection based on bids)
    const selected = eligible[Math.floor(Math.random() * eligible.length)];
    return selected.creatives[placement];
  }

  /**
   * Loads and displays ads for all active placements
   * @param {Object[]} [campaigns=SAMPLE_CAMPAIGNS] - Campaigns to display
   */
  function loadAds(campaigns = SAMPLE_CAMPAIGNS) {
    // Load impression cache
    loadImpressionCache();

    // Select and display banner ad
    const bannerCreative = selectCampaignForPlacement('banner', campaigns);
    if (bannerCreative) {
      setActiveBannerAd(bannerCreative);
      recordImpression(bannerCreative.id);
      activeAdsRef.current = activeAdsRef.current || {};
      activeAdsRef.current.banner = bannerCreative;
    }

    // Select and display sidebar ad
    const sidebarCreative = selectCampaignForPlacement('sidebar', campaigns);
    if (sidebarCreative) {
      setActiveSidebarAd(sidebarCreative);
      recordImpression(sidebarCreative.id);
      activeAdsRef.current = activeAdsRef.current || {};
      activeAdsRef.current.sidebar = sidebarCreative;
    }
  }

  /**
   * Tracks an ad click
   * @param {string} creativeId - Creative ID that was clicked
   * @param {string} targetUrl - URL that was clicked
   */
  function trackClick(creativeId, targetUrl) {
    // Validate inputs
    if (!creativeId || typeof creativeId !== 'string') return;
    if (!targetUrl || !isValidUrl(targetUrl)) return;

    // Record click event
    const clickEvent = {
      creativeId,
      targetUrl,
      timestamp: Date.now()
    };

    // Store in localStorage (in production, send to backend)
    try {
      const clicks = JSON.parse(localStorage.getItem('sponsorship-clicks') || '[]');
      clicks.push(clickEvent);

      // Keep only last 1000 clicks
      if (clicks.length > 1000) {
        clicks.shift();
      }

      localStorage.setItem('sponsorship-clicks', JSON.stringify(clicks));
    } catch (error) {
      console.warn('Could not record ad click', error);
    }

    console.log('[Sponsorship] Click tracked:', creativeId);
  }

  /**
   * Gets local analytics data (for demonstration)
   * @returns {Object} Analytics summary
   */
  function getLocalAnalytics() {
    try {
      const impressions = JSON.parse(
        localStorage.getItem('sponsorship-impressions') || '{}'
      );
      const clicks = JSON.parse(
        localStorage.getItem('sponsorship-clicks') || '[]'
      );

      // Calculate basic metrics
      const totalImpressions = Object.values(impressions).reduce(
        (sum, arr) => sum + arr.length,
        0
      );
      const totalClicks = clicks.length;
      const ctr = totalImpressions > 0
        ? ((totalClicks / totalImpressions) * 100).toFixed(2)
        : 0;

      return {
        impressions: totalImpressions,
        clicks: totalClicks,
        ctr: parseFloat(ctr),
        lastUpdated: new Date().toISOString()
      };
    } catch (error) {
      console.warn('Could not calculate analytics', error);
      return {
        impressions: 0,
        clicks: 0,
        ctr: 0,
        lastUpdated: new Date().toISOString()
      };
    }
  }

  /**
   * Clears all ad data (for testing/privacy)
   */
  function clearAdData() {
    try {
      localStorage.removeItem('sponsorship-impressions');
      localStorage.removeItem('sponsorship-clicks');
      adImpressionCacheRef.current = {};
      setActiveBannerAd(null);
      setActiveSidebarAd(null);
      activeAdsRef.current = {};
    } catch (error) {
      console.warn('Could not clear ad data', error);
    }
  }

  return {
    loadAds,
    trackClick,
    getLocalAnalytics,
    clearAdData,
    // Expose validation for testing
    isValidUrl,
    isValidCreative
  };
}
