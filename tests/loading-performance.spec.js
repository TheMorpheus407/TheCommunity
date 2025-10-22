/**
 * @fileoverview E2E tests for application loading performance.
 * Measures and validates that the app loads quickly enough for good UX.
 */

import { test, expect } from '@playwright/test';

// Performance thresholds
const THRESHOLDS = {
  domContentLoaded: 2000, // 2 seconds
  fullyLoaded: 5000,      // 5 seconds
  firstPaint: 1000,       // 1 second
  interactive: 3000       // 3 seconds
};

test.describe('Loading Performance', () => {
  test('original app loads within acceptable time', async ({ page }) => {
    const startTime = Date.now();

    // Navigate and wait for load events (skip redirect for testing)
    const response = await page.goto('/index.html?noredirect');
    expect(response.status()).toBe(200);

    // Measure DOMContentLoaded
    await page.waitForLoadState('domcontentloaded');
    const domContentLoadedTime = Date.now() - startTime;

    console.log(`DOMContentLoaded: ${domContentLoadedTime}ms`);
    expect(domContentLoadedTime).toBeLessThan(THRESHOLDS.domContentLoaded);

    // Measure full page load
    await page.waitForLoadState('load');
    const loadTime = Date.now() - startTime;

    console.log(`Full page load: ${loadTime}ms`);
    expect(loadTime).toBeLessThan(THRESHOLDS.fullyLoaded);

    // Verify React app rendered
    await page.waitForSelector('#root', { timeout: 5000 });
    const rootHasContent = await page.evaluate(() => {
      const root = document.getElementById('root');
      return root && root.children.length > 0;
    });
    expect(rootHasContent).toBe(true);

    // Measure time to interactive (React rendered)
    const interactiveTime = Date.now() - startTime;
    console.log(`Time to interactive: ${interactiveTime}ms`);
    expect(interactiveTime).toBeLessThan(THRESHOLDS.interactive);
  });

  test('collects detailed performance metrics', async ({ page }) => {
    await page.goto('/index.html?noredirect');
    await page.waitForLoadState('networkidle');

    // Get detailed performance timing
    const metrics = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0];
      const paint = performance.getEntriesByType('paint');

      return {
        navigation: {
          domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
          loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
          domInteractive: navigation.domInteractive - navigation.fetchStart,
          dnsLookup: navigation.domainLookupEnd - navigation.domainLookupStart,
          tcpConnect: navigation.connectEnd - navigation.connectStart,
          responseTime: navigation.responseEnd - navigation.responseStart,
          domParsing: navigation.domComplete - navigation.domInteractive,
        },
        paint: {
          firstPaint: paint.find(p => p.name === 'first-paint')?.startTime || 0,
          firstContentfulPaint: paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0,
        },
        resources: performance.getEntriesByType('resource').map(r => ({
          name: r.name,
          duration: r.duration,
          size: r.transferSize || 0
        }))
      };
    });

    console.log('Performance Metrics:', JSON.stringify(metrics, null, 2));

    // Validate first paint
    expect(metrics.paint.firstPaint).toBeGreaterThan(0);
    expect(metrics.paint.firstPaint).toBeLessThan(THRESHOLDS.firstPaint);

    // Validate first contentful paint
    expect(metrics.paint.firstContentfulPaint).toBeGreaterThan(0);
    expect(metrics.paint.firstContentfulPaint).toBeLessThan(THRESHOLDS.firstPaint);

    // Report largest resources
    const largestResources = metrics.resources
      .sort((a, b) => b.duration - a.duration)
      .slice(0, 5);

    console.log('Slowest Resources:');
    largestResources.forEach((resource, index) => {
      console.log(`  ${index + 1}. ${resource.name.split('/').pop()} - ${resource.duration.toFixed(2)}ms (${resource.size} bytes)`);
    });
  });

  test('verifies critical resources load efficiently', async ({ page }) => {
    const resourceTimings = [];

    // Monitor resource loading
    page.on('response', (response) => {
      const url = response.url();
      const timing = response.request().timing();
      resourceTimings.push({
        url,
        status: response.status(),
        timing
      });
    });

    await page.goto('/index.html?noredirect');
    await page.waitForLoadState('networkidle');

    // Check that critical resources loaded successfully
    const criticalResources = [
      'app.js',
      'redirect.js',
      'translations.js',
      'styles.css',
      'react.production.min.js',
      'react-dom.production.min.js',
      'qrcode.min.js'
    ];

    for (const resource of criticalResources) {
      const loaded = resourceTimings.find(r => r.url.includes(resource));
      expect(loaded, `${resource} should load`).toBeDefined();
      expect(loaded.status, `${resource} should return 200`).toBe(200);
    }
  });

  test('app remains responsive after load', async ({ page }) => {
    await page.goto('/index.html?noredirect');
    await page.waitForLoadState('networkidle');

    // Test responsiveness by measuring click response time
    const button = page.locator('button').first();
    if (await button.count() > 0) {
      const clickStart = Date.now();
      await button.click();
      const clickTime = Date.now() - clickStart;

      console.log(`Click response time: ${clickTime}ms`);
      expect(clickTime).toBeLessThan(100); // Should respond within 100ms
    }

    // Measure memory usage (if available)
    const memoryUsage = await page.evaluate(() => {
      if (performance.memory) {
        return {
          usedJSHeapSize: performance.memory.usedJSHeapSize,
          totalJSHeapSize: performance.memory.totalJSHeapSize,
          jsHeapSizeLimit: performance.memory.jsHeapSizeLimit
        };
      }
      return null;
    });

    if (memoryUsage) {
      console.log('Memory Usage:', memoryUsage);
      const usedMB = memoryUsage.usedJSHeapSize / 1024 / 1024;
      console.log(`Used JS Heap: ${usedMB.toFixed(2)} MB`);

      // App should not use more than 100MB
      expect(usedMB).toBeLessThan(100);
    }
  });

  // Note: Modular version test removed - modular integration not yet complete
  // Will be added back in Phase 2 when full modular app is implemented
});

test.describe('Functionality Verification', () => {
  test('essential UI elements are present', async ({ page }) => {
    await page.goto('/index.html?noredirect');
    await page.waitForLoadState('networkidle');

    // Verify mascot is rendered
    const mascot = page.locator('.tux-mascot');
    await expect(mascot).toBeVisible();

    // Verify root app container
    const root = page.locator('#root');
    await expect(root).toBeVisible();

    // Verify signaling section exists
    const signaling = page.locator('text=Signalisierung').first();
    await expect(signaling).toBeVisible();
  });

  test('translations system works', async ({ page }) => {
    await page.goto('/index.html?noredirect');
    await page.waitForLoadState('networkidle');

    // Check that German translations are loaded (default)
    const germanText = page.locator('text=Hochdeutsch').first();
    await expect(germanText).toBeVisible();
  });

  test('React is properly loaded and initialized', async ({ page }) => {
    await page.goto('/index.html?noredirect');
    await page.waitForLoadState('networkidle');

    const reactLoaded = await page.evaluate(() => {
      return typeof React !== 'undefined' && typeof ReactDOM !== 'undefined';
    });

    expect(reactLoaded).toBe(true);
  });
});
