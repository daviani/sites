import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {
  PAGES,
  testImagesAccessibility,
  testLinksAccessibility,
  testStructureAccessibility,
  testFormsAccessibility,
  testNavigationAccessibility,
} from './helpers';

/**
 * RGAA 4.1 - Tests d'accessibilité consolidés
 *
 * Ce fichier regroupe les tests des critères RGAA suivants :
 * - Critère 1 : Images
 * - Critère 3 : Couleurs
 * - Critère 6 : Liens
 * - Critère 8 : Éléments obligatoires
 * - Critère 9 : Structuration de l'information
 * - Critère 11 : Formulaires
 * - Critère 12 : Navigation
 */

for (const { name, path } of PAGES) {
  test.describe(`RGAA - ${name}`, () => {
    test.describe.configure({ mode: 'serial' }); // Share navigation between tests

    test.beforeEach(async ({ page }) => {
      await page.goto(path, { waitUntil: 'domcontentloaded' });
    });

    /**
     * Axe-core automated WCAG 2.1 AA scan
     * Catches most common accessibility issues
     */
    test('axe-core WCAG 2.1 AA scan', async ({ page }) => {
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();

      const violations = results.violations.filter(
        (v) => v.impact === 'critical' || v.impact === 'serious'
      );

      if (violations.length > 0) {
        const summary = violations
          .map((v) => `- ${v.id}: ${v.description} (${v.nodes.length} occurrences)`)
          .join('\n');
        expect(violations, `Accessibility violations found:\n${summary}`).toHaveLength(0);
      }
    });

    /**
     * RGAA Critère 1 - Images
     * Vérifie que les images ont des alternatives textuelles appropriées
     */
    test('critère 1 - images accessibility', async ({ page }) => {
      const results = await testImagesAccessibility(page);

      expect(
        results.imgWithoutAlt,
        `Images without alt attribute: ${results.imgWithoutAlt.join(', ')}`
      ).toHaveLength(0);

      expect(
        results.svgWithoutName,
        `SVG images without accessible name: ${results.svgWithoutName.join(', ')}`
      ).toHaveLength(0);

      // Generic alt text is a warning, not a failure
      if (results.genericAltText.length > 0) {
        console.warn(`Warning: Generic alt text found: ${results.genericAltText.join(', ')}`);
      }
    });

    /**
     * RGAA Critère 6 - Liens
     * Vérifie que les liens sont accessibles
     */
    test('critère 6 - links accessibility', async ({ page }) => {
      const results = await testLinksAccessibility(page);

      expect(
        results.emptyLinks,
        `Empty links without accessible name: ${results.emptyLinks.join(', ')}`
      ).toHaveLength(0);

      // Generic link text is a warning
      if (results.genericLinkText.length > 0) {
        console.warn(`Warning: Generic link text: ${results.genericLinkText.join(', ')}`);
      }

      // New window warning is recommended, not required
      if (results.newWindowWithoutWarning.length > 0) {
        console.warn(
          `Warning: Links opening new window without warning: ${results.newWindowWithoutWarning.join(', ')}`
        );
      }
    });

    /**
     * RGAA Critère 8 - Éléments obligatoires
     * Vérifie la présence des éléments HTML obligatoires
     */
    test('critère 8 - mandatory elements', async ({ page }) => {
      // Document has lang attribute
      const lang = await page.locator('html').getAttribute('lang');
      expect(lang, 'HTML element must have lang attribute').toBeTruthy();
      expect(lang, 'Lang must be fr or en').toMatch(/^(fr|en)/);

      // Page has title
      const title = await page.title();
      expect(title, 'Page must have a title').toBeTruthy();
      expect(title.length, 'Title should be meaningful').toBeGreaterThan(3);

      // Viewport meta tag
      const viewport = await page.locator('meta[name="viewport"]').getAttribute('content');
      expect(viewport, 'Viewport meta tag must exist').toBeTruthy();

      // No maximum-scale=1 or user-scalable=no (blocks zoom)
      if (viewport) {
        expect(viewport, 'Viewport should not block zoom').not.toMatch(
          /user-scalable\s*=\s*no/i
        );
        expect(viewport, 'Viewport should not restrict scale').not.toMatch(
          /maximum-scale\s*=\s*1/i
        );
      }
    });

    /**
     * RGAA Critère 9 - Structuration
     * Vérifie la structure du document
     */
    test('critère 9 - structure', async ({ page }) => {
      const results = await testStructureAccessibility(page);

      expect(results.missingH1, 'Page must have an h1 element').toBe(false);
      expect(results.multipleH1, 'Page should have only one h1 element').toBe(false);

      expect(
        results.skippedHeadingLevels,
        `Heading levels skipped: ${results.skippedHeadingLevels.join(', ')}`
      ).toHaveLength(0);

      expect(results.missingMainLandmark, 'Page must have a main landmark').toBe(false);
      expect(results.missingNavLandmark, 'Page should have a nav landmark').toBe(false);
    });

    /**
     * RGAA Critère 11 - Formulaires (if page has forms)
     */
    test('critère 11 - forms accessibility', async ({ page }) => {
      const hasForm = (await page.locator('form').count()) > 0;
      const hasInputs =
        (await page
          .locator('input:not([type="hidden"]):not([type="submit"]), textarea, select')
          .count()) > 0;

      if (!hasForm && !hasInputs) {
        test.skip();
        return;
      }

      const results = await testFormsAccessibility(page);

      expect(
        results.inputsWithoutLabels,
        `Inputs without labels: ${results.inputsWithoutLabels.join(', ')}`
      ).toHaveLength(0);
    });

    /**
     * RGAA Critère 12 - Navigation
     */
    test('critère 12 - navigation', async ({ page }) => {
      const results = await testNavigationAccessibility(page);

      // Skip link is strongly recommended
      if (results.missingSkipLink) {
        console.warn('Warning: No skip link found');
      }

      if (results.skipLinkBroken) {
        expect(results.skipLinkBroken, 'Skip link target must exist').toBe(false);
      }
    });

    /**
     * RGAA Critère 3 - Couleurs (basic contrast check via axe)
     * Note: Full color contrast requires visual regression testing
     */
    test('critère 3 - color contrast', async ({ page }) => {
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2aa'])
        .include('body')
        .analyze();

      const contrastViolations = results.violations.filter((v) =>
        v.id.includes('contrast')
      );

      if (contrastViolations.length > 0) {
        const summary = contrastViolations
          .map((v) => `- ${v.description} (${v.nodes.length} elements)`)
          .join('\n');
        expect(
          contrastViolations,
          `Color contrast violations:\n${summary}`
        ).toHaveLength(0);
      }
    });
  });
}

/**
 * Keyboard navigation tests
 */
test.describe('Keyboard Navigation', () => {
  test('focus is visible on interactive elements', async ({ page }) => {
    await page.goto('/');

    // Tab through first 10 focusable elements
    for (let i = 0; i < 10; i++) {
      await page.keyboard.press('Tab');

      const focused = page.locator(':focus');
      const isVisible = await focused.isVisible().catch(() => false);

      if (isVisible) {
        // Check that focus is visible (has outline or similar)
        const outlineStyle = await focused.evaluate((el) => {
          const style = window.getComputedStyle(el);
          return {
            outline: style.outline,
            outlineWidth: style.outlineWidth,
            boxShadow: style.boxShadow,
          };
        });

        const hasFocusIndicator =
          outlineStyle.outlineWidth !== '0px' ||
          outlineStyle.boxShadow !== 'none';

        expect(hasFocusIndicator, 'Focused element must have visible focus indicator').toBe(true);
      }
    }
  });

  test('no keyboard trap', async ({ page }) => {
    await page.goto('/');

    // Tab through many elements
    for (let i = 0; i < 50; i++) {
      await page.keyboard.press('Tab');
    }

    // Should not be stuck - we can still interact
    const focused = page.locator(':focus');
    await expect(focused).toBeVisible();
  });
});

/**
 * Reduced motion preference
 */
test.describe('Reduced Motion', () => {
  test('respects prefers-reduced-motion', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');

    // Check that animations are disabled or reduced
    const hasReducedMotionStyles = await page.evaluate(() => {
      const styles = document.styleSheets;
      for (const sheet of styles) {
        try {
          for (const rule of sheet.cssRules) {
            if (rule instanceof CSSMediaRule) {
              if (rule.conditionText?.includes('prefers-reduced-motion')) {
                return true;
              }
            }
          }
        } catch {
          // Cross-origin stylesheets may not be accessible
        }
      }
      return false;
    });

    // This is a soft check - just log if not found
    if (!hasReducedMotionStyles) {
      console.warn('Warning: No prefers-reduced-motion media queries found');
    }
  });
});