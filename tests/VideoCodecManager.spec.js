/**
 * @fileoverview Unit tests for VideoCodecManager.
 * Tests codec detection, bandwidth estimation, and quality optimization.
 */

import { test, expect } from '@playwright/test';

test.describe('VideoCodecManager Tests', () => {
  test.describe('Codec Support Detection', () => {
    test('detectCodecSupport returns codec support object', async ({ page }) => {
      await page.goto('/index.html?noredirect');

      const result = await page.evaluate(async () => {
        const { createVideoCodecManager } = await import('../src/managers/VideoCodecManager.js');

        const manager = createVideoCodecManager({
          appendSystemMessage: () => {},
          t: { videoQuality: {} }
        });

        const support = await manager.detectCodecSupport();
        return {
          hasVp8: typeof support.vp8 === 'boolean',
          hasVp9: typeof support.vp9 === 'boolean',
          hasAv1: typeof support.av1 === 'boolean',
          hasH264: typeof support.h264 === 'boolean'
        };
      });

      expect(result.hasVp8).toBe(true);
      expect(result.hasVp9).toBe(true);
      expect(result.hasAv1).toBe(true);
      expect(result.hasH264).toBe(true);
    });

    test('getBestCodec returns codec in priority order', async ({ page }) => {
      await page.goto('/index.html?noredirect');

      const result = await page.evaluate(async () => {
        const { createVideoCodecManager } = await import('../src/managers/VideoCodecManager.js');

        const manager = createVideoCodecManager({
          appendSystemMessage: () => {},
          t: { videoQuality: {} }
        });

        // Test with all codecs available (should prefer AV1)
        const allSupport = { vp8: true, vp9: true, av1: true, h264: true };
        const best1 = manager.getBestCodec(allSupport);

        // Test with VP9 as best available
        const vp9Support = { vp8: true, vp9: true, av1: false, h264: true };
        const best2 = manager.getBestCodec(vp9Support);

        // Test with only VP8 available
        const vp8Support = { vp8: true, vp9: false, av1: false, h264: false };
        const best3 = manager.getBestCodec(vp8Support);

        // Test with no codecs available
        const noSupport = { vp8: false, vp9: false, av1: false, h264: false };
        const best4 = manager.getBestCodec(noSupport);

        return { best1, best2, best3, best4 };
      });

      expect(result.best1).toBe('AV1');
      expect(result.best2).toBe('VP9');
      expect(result.best3).toBe('VP8');
      expect(result.best4).toBe(null);
    });
  });

  test.describe('Bandwidth Estimation', () => {
    test('estimateBandwidth returns default when no peer connection', async ({ page }) => {
      await page.goto('/index.html?noredirect');

      const result = await page.evaluate(async () => {
        const { createVideoCodecManager } = await import('../src/managers/VideoCodecManager.js');

        const manager = createVideoCodecManager({
          appendSystemMessage: () => {},
          t: { videoQuality: {} }
        });

        const bandwidth = await manager.estimateBandwidth(null);
        return bandwidth;
      });

      expect(result).toBe(1500000); // Default: 1.5 Mbps
    });

    test('estimateBandwidth handles missing getStats method', async ({ page }) => {
      await page.goto('/index.html?noredirect');

      const result = await page.evaluate(async () => {
        const { createVideoCodecManager } = await import('../src/managers/VideoCodecManager.js');

        const manager = createVideoCodecManager({
          appendSystemMessage: () => {},
          t: { videoQuality: {} }
        });

        // Mock peer connection without getStats
        const mockPc = {};
        const bandwidth = await manager.estimateBandwidth(mockPc);
        return bandwidth;
      });

      expect(result).toBe(1500000); // Default: 1.5 Mbps
    });
  });

  test.describe('Quality Calculation', () => {
    test('calculateOptimalQuality returns LOW for low bandwidth', async ({ page }) => {
      await page.goto('/index.html?noredirect');

      const result = await page.evaluate(async () => {
        const { createVideoCodecManager } = await import('../src/managers/VideoCodecManager.js');

        const manager = createVideoCodecManager({
          appendSystemMessage: () => {},
          t: { videoQuality: {} }
        });

        const quality = manager.calculateOptimalQuality(500000); // 500 kbps
        return quality.name;
      });

      expect(result).toBe('low');
    });

    test('calculateOptimalQuality returns MEDIUM for medium bandwidth', async ({ page }) => {
      await page.goto('/index.html?noredirect');

      const result = await page.evaluate(async () => {
        const { createVideoCodecManager } = await import('../src/managers/VideoCodecManager.js');

        const manager = createVideoCodecManager({
          appendSystemMessage: () => {},
          t: { videoQuality: {} }
        });

        const quality = manager.calculateOptimalQuality(1500000); // 1.5 Mbps
        return quality.name;
      });

      expect(result).toBe('medium');
    });

    test('calculateOptimalQuality returns HIGH for high bandwidth', async ({ page }) => {
      await page.goto('/index.html?noredirect');

      const result = await page.evaluate(async () => {
        const { createVideoCodecManager } = await import('../src/managers/VideoCodecManager.js');

        const manager = createVideoCodecManager({
          appendSystemMessage: () => {},
          t: { videoQuality: {} }
        });

        const quality = manager.calculateOptimalQuality(3000000); // 3 Mbps
        return quality.name;
      });

      expect(result).toBe('high');
    });
  });

  test.describe('SDP Minimization', () => {
    test('minimizeSdpMetadata preserves essential SDP lines', async ({ page }) => {
      await page.goto('/index.html?noredirect');

      const result = await page.evaluate(async () => {
        const { createVideoCodecManager } = await import('../src/managers/VideoCodecManager.js');

        const manager = createVideoCodecManager({
          appendSystemMessage: () => {},
          t: { videoQuality: {} }
        });

        const sampleSdp = `v=0\r\no=user 123456 789012 IN IP4 192.168.1.1\r\ns=-\r\nt=0 0\r\nm=video 9 UDP/TLS/RTP/SAVPF 96\r\na=rtpmap:96 VP9/90000\r\na=ssrc:111222333 cname:uniqueidentifier\r\na=ssrc:111222333 msid:stream track\r\na=mid:0\r\na=fingerprint:sha-256 AA:BB:CC\r\n`;

        const minimized = manager.minimizeSdpMetadata(sampleSdp);

        return {
          hasVersion: minimized.includes('v=0'),
          hasOrigin: minimized.includes('o='),
          hasMedia: minimized.includes('m=video'),
          hasRtpmap: minimized.includes('a=rtpmap'),
          hasSsrc: minimized.includes('a=ssrc:111222333'),
          hasOriginalCname: minimized.includes('uniqueidentifier'),
          hasSanitizedCname: minimized.includes('cname:stream'),
          hasFingerprint: minimized.includes('a=fingerprint')
        };
      });

      expect(result.hasVersion).toBe(true);
      expect(result.hasOrigin).toBe(true);
      expect(result.hasMedia).toBe(true);
      expect(result.hasRtpmap).toBe(true);
      expect(result.hasSsrc).toBe(true);
      expect(result.hasOriginalCname).toBe(false); // Should be sanitized
      expect(result.hasSanitizedCname).toBe(true); // Should have generic value
      expect(result.hasFingerprint).toBe(true);
    });

    test('minimizeSdpMetadata handles null/undefined input', async ({ page }) => {
      await page.goto('/index.html?noredirect');

      const result = await page.evaluate(async () => {
        const { createVideoCodecManager } = await import('../src/managers/VideoCodecManager.js');

        const manager = createVideoCodecManager({
          appendSystemMessage: () => {},
          t: { videoQuality: {} }
        });

        const nullResult = manager.minimizeSdpMetadata(null);
        const undefinedResult = manager.minimizeSdpMetadata(undefined);

        return { nullResult, undefinedResult };
      });

      expect(result.nullResult).toBe(null);
      expect(result.undefinedResult).toBe(undefined);
    });
  });

  test.describe('Codec Description', () => {
    test('getCodecDescription returns valid description', async ({ page }) => {
      await page.goto('/index.html?noredirect');

      const result = await page.evaluate(async () => {
        const { createVideoCodecManager } = await import('../src/managers/VideoCodecManager.js');

        const manager = createVideoCodecManager({
          appendSystemMessage: () => {},
          t: { videoQuality: {} }
        });

        const description = await manager.getCodecDescription();
        return description;
      });

      // Should return one of the known codec descriptions or 'Unknown codec'
      const validDescriptions = [
        'AV1 (highest efficiency)',
        'VP9 (high efficiency)',
        'VP8 (good compatibility)',
        'H.264 (universal compatibility)',
        'Unknown codec'
      ];

      expect(validDescriptions).toContain(result);
    });
  });
});
