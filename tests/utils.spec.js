/**
 * @fileoverview Unit tests for utility modules.
 * Tests the extracted utility functions in isolation.
 */

import { test, expect } from '@playwright/test';

// Import utilities as ES6 modules in the browser context
test.describe('Utility Module Tests', () => {
  test.describe('contributors.js', () => {
    test('fetchContributors validates repo format', async ({ page }) => {
      await page.goto('/index.html');

      // Test with valid repo format
      const validResult = await page.evaluate(async () => {
        const { fetchContributors } = await import('../src/utils/contributors.js');

        try {
          // Note: This will actually call GitHub API, but that's okay for E2E
          // In a real unit test environment, we'd mock the fetch
          await fetchContributors('TheMorpheus407/TheCommunity');
          return { success: true };
        } catch (error) {
          return { success: false, error: error.message };
        }
      });

      expect(validResult.success).toBe(true);
    });

    test('fetchContributors rejects invalid repo formats', async ({ page }) => {
      await page.goto('/index.html');

      const testCases = [
        { input: '', description: 'empty string' },
        { input: 'invalid', description: 'no slash' },
        { input: 'owner/', description: 'missing repo' },
        { input: '/repo', description: 'missing owner' },
        { input: 'owner/repo/extra', description: 'too many slashes' },
        { input: 'owner repo', description: 'space instead of slash' },
        { input: null, description: 'null value' },
        { input: 123, description: 'number instead of string' },
      ];

      for (const testCase of testCases) {
        const result = await page.evaluate(async (input) => {
          const { fetchContributors } = await import('../src/utils/contributors.js');

          try {
            await fetchContributors(input);
            return { rejected: false };
          } catch (error) {
            return {
              rejected: true,
              message: error.message,
              isValidationError: error.message.includes('Invalid repository format')
            };
          }
        }, testCase.input);

        expect(result.rejected, `Should reject ${testCase.description}`).toBe(true);
        expect(result.isValidationError, `Should be validation error for ${testCase.description}`).toBe(true);
      }
    });

    test('fetchStatistics validates repo format', async ({ page }) => {
      await page.goto('/index.html');

      // Test with invalid format
      const result = await page.evaluate(async () => {
        const { fetchStatistics } = await import('../src/utils/contributors.js');

        try {
          await fetchStatistics('invalid-format');
          return { rejected: false };
        } catch (error) {
          return {
            rejected: true,
            isValidationError: error.message.includes('Invalid repository format')
          };
        }
      });

      expect(result.rejected).toBe(true);
      expect(result.isValidationError).toBe(true);
    });
  });

  test.describe('helpers.js', () => {
    test('resolveInitialTheme returns valid theme object', async ({ page }) => {
      await page.goto('/index.html');

      const result = await page.evaluate(async () => {
        const { resolveInitialTheme } = await import('../src/utils/helpers.js');
        return resolveInitialTheme();
      });

      expect(result).toHaveProperty('theme');
      expect(result).toHaveProperty('isStored');
      expect(typeof result.theme).toBe('string');
      expect(typeof result.isStored).toBe('boolean');
      expect(['light', 'dark', 'auto']).toContain(result.theme);
    });

    test('resolveInitialTheme respects localStorage', async ({ page }) => {
      await page.goto('/index.html');

      // Test with stored theme
      const resultWithStored = await page.evaluate(async () => {
        localStorage.setItem('theme', 'dark');
        const { resolveInitialTheme } = await import('../src/utils/helpers.js');
        return resolveInitialTheme();
      });

      expect(resultWithStored.theme).toBe('dark');
      expect(resultWithStored.isStored).toBe(true);

      // Test without stored theme
      const resultWithoutStored = await page.evaluate(async () => {
        localStorage.removeItem('theme');
        const { resolveInitialTheme } = await import('../src/utils/helpers.js');
        return resolveInitialTheme();
      });

      expect(resultWithoutStored.isStored).toBe(false);
    });
  });

  test.describe('constants.js', () => {
    test('exports expected constant values', async ({ page }) => {
      await page.goto('/index.html');

      const constants = await page.evaluate(async () => {
        const module = await import('../src/core/constants.js');
        return {
          EXPECTED_CHANNEL_LABEL: module.EXPECTED_CHANNEL_LABEL,
          MAX_MESSAGE_LENGTH: module.MAX_MESSAGE_LENGTH,
          MAX_MESSAGES_PER_INTERVAL: module.MAX_MESSAGES_PER_INTERVAL,
          THEME_OPTIONS: module.THEME_OPTIONS,
        };
      });

      // Verify critical constants have expected values
      expect(constants.EXPECTED_CHANNEL_LABEL).toBe('chat');
      expect(constants.MAX_MESSAGE_LENGTH).toBe(2000);
      expect(constants.MAX_MESSAGES_PER_INTERVAL).toBe(30);
      expect(Array.isArray(constants.THEME_OPTIONS)).toBe(true);
      expect(constants.THEME_OPTIONS).toContain('light');
      expect(constants.THEME_OPTIONS).toContain('dark');
      expect(constants.THEME_OPTIONS).toContain('auto');
    });

    test('getNextThemeValue cycles through themes correctly', async ({ page }) => {
      await page.goto('/index.html');

      const results = await page.evaluate(async () => {
        const { getNextThemeValue } = await import('../src/core/constants.js');
        return {
          afterLight: getNextThemeValue('light'),
          afterDark: getNextThemeValue('dark'),
          afterAuto: getNextThemeValue('auto'),
        };
      });

      expect(results.afterLight).toBe('dark');
      expect(results.afterDark).toBe('auto');
      expect(results.afterAuto).toBe('light');
    });
  });

  test.describe('TuxMascot.js', () => {
    test('TuxMascot component exports and has expected structure', async ({ page }) => {
      await page.goto('/index.html');

      const componentInfo = await page.evaluate(async () => {
        const module = await import('../src/components/TuxMascot.js');
        return {
          hasExport: typeof module.TuxMascot !== 'undefined',
          isFunction: typeof module.TuxMascot === 'function',
        };
      });

      expect(componentInfo.hasExport).toBe(true);
      expect(componentInfo.isFunction).toBe(true);
    });

    test('TuxMascot renders with translations', async ({ page }) => {
      await page.goto('/index.html');

      await page.evaluate(async () => {
        const { TuxMascot } = await import('../src/components/TuxMascot.js');
        const mockTranslations = {
          mascot: {
            altText: 'Test Mascot',
            title: 'Test Title'
          }
        };

        const container = document.createElement('div');
        container.id = 'test-mascot';
        document.body.appendChild(container);

        const root = ReactDOM.createRoot(container);
        root.render(React.createElement(TuxMascot, { t: mockTranslations }));
      });

      // Wait for component to render
      await page.waitForTimeout(100);

      const mascotExists = await page.evaluate(() => {
        const container = document.getElementById('test-mascot');
        return container && container.children.length > 0;
      });

      expect(mascotExists).toBe(true);
    });
  });
});
