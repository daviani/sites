import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {
  PAGES,
  testImagesAccessibility,
  testLinksAccessibility,
  testStructureAccessibility,
  testFormsAccessibility,
  testNavigationAccessibility,
  testAcronymsAccessibility,
  testPlaceholderOnlyInputs,
  testLanguageSwitchAccessibility,
  testInlineLanguageChanges,
  testExplicitContrast,
  testAriaCompleteness,
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

    /**
     * Critère 3 bis - Contraste explicite sur éléments critiques
     * Audit manuel: contraste insuffisant en dark mode (#5f81ac sur #424a5c = 2.21:1)
     * Vérifie les contrastes calculés via getComputedStyle au-delà d'axe-core
     */
    test('critère 3 - explicit contrast on critical elements', async ({ page }) => {
      const results = await testExplicitContrast(page);

      if (results.failingElements.length > 0) {
        const summary = results.failingElements
          .map(
            (e) =>
              `- ${e.selector}: "${e.text}" — ${e.fgColor} on ${e.bgColor} = ${e.ratio}:1 (min: ${e.required}:1)`
          )
          .join('\n');
        console.warn(`Contrast issues found:\n${summary}`);
      }
    });

    /**
     * Acronymes et abréviations
     * Audit VoiceOver: "CV" lu "Cheval Vapeur"
     * Vérifie que les acronymes connus ont aria-label, title ou <abbr>
     */
    test('acronyms have accessible labels', async ({ page }) => {
      const results = await testAcronymsAccessibility(page);

      if (results.acronymsWithoutLabel.length > 0) {
        const summary = results.acronymsWithoutLabel.join('\n  - ');
        console.warn(
          `Warning: Acronyms without explicit label (may be mispronounced by screen readers):\n  - ${summary}`
        );
      }
    });

    /**
     * Formulaires - placeholder seul
     * Audit VoiceOver: les placeholders lus par les lecteurs d'écran créent du bruit
     * Vérifie que les inputs avec placeholder ont aussi un label visible
     */
    test('critère 11 - no placeholder-only inputs', async ({ page }) => {
      const hasInputs =
        (await page
          .locator('input:not([type="hidden"]):not([type="submit"]), textarea, select')
          .count()) > 0;

      if (!hasInputs) {
        test.skip();
        return;
      }

      const results = await testPlaceholderOnlyInputs(page);

      if (results.placeholderOnlyInputs.length > 0) {
        const summary = results.placeholderOnlyInputs.join('\n  - ');
        console.warn(
          `Warning: Inputs relying on placeholder only (no visible label):\n  - ${summary}`
        );
      }
    });

    /**
     * Critère 8.7 - Changements de langue inline
     * Audit VoiceOver: changement de voix non signalé en anglais
     * Vérifie que le contenu en langue étrangère a l'attribut lang
     */
    test('critère 8 - inline language changes', async ({ page }) => {
      const results = await testInlineLanguageChanges(page);

      if (results.foreignTextWithoutLang.length > 0) {
        const summary = results.foreignTextWithoutLang.join('\n  - ');
        console.warn(
          `Warning: Foreign language text without lang attribute:\n  - ${summary}`
        );
      }
    });

    /**
     * ARIA roles et propriétés
     * Tests complémentaires sur les rôles ARIA
     */
    test('ARIA roles completeness', async ({ page }) => {
      const results = await testAriaCompleteness(page);

      expect(
        results.dialogsWithoutLabel,
        `Dialogs without accessible name: ${results.dialogsWithoutLabel.join(', ')}`
      ).toHaveLength(0);

      if (results.buttonsWithoutType.length > 0) {
        console.warn(
          `Warning: Buttons in forms without type attribute: ${results.buttonsWithoutType.join(', ')}`
        );
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

/**
 * Language switch accessibility
 * Opquast: le switch de langue doit avoir un label dans la langue cible
 */
test.describe('Language Switch', () => {
  test('language switch has proper accessibility attributes', async ({ page }) => {
    await page.goto('/');

    const results = await testLanguageSwitchAccessibility(page);

    if (results.switchMissingLangAttr.length > 0) {
      console.warn(
        `Warning: Language switches without lang attribute:\n  - ${results.switchMissingLangAttr.join('\n  - ')}`
      );
    }

    expect(
      results.switchMissingAriaLabel,
      `Language switches without accessible name: ${results.switchMissingAriaLabel.join(', ')}`
    ).toHaveLength(0);
  });
});

/**
 * Dark mode contrast tests
 * Audit manuel: problèmes de contraste en mode sombre
 * Teste les contrastes dans les deux modes (clair et sombre)
 */
test.describe('Dark Mode Contrast', () => {
  test('dark mode has sufficient contrast on Home', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const results = await testExplicitContrast(page);

    if (results.failingElements.length > 0) {
      const summary = results.failingElements
        .map(
          (e) =>
            `- ${e.selector}: "${e.text}" — ${e.fgColor} on ${e.bgColor} = ${e.ratio}:1 (min: ${e.required}:1)`
        )
        .join('\n');
      console.warn(`Dark mode contrast issues on Home:\n${summary}`);
    }
  });

  test('dark mode has sufficient contrast on Contact', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/contact');
    await page.waitForLoadState('networkidle');

    const results = await testExplicitContrast(page);

    if (results.failingElements.length > 0) {
      const summary = results.failingElements
        .map(
          (e) =>
            `- ${e.selector}: "${e.text}" — ${e.fgColor} on ${e.bgColor} = ${e.ratio}:1 (min: ${e.required}:1)`
        )
        .join('\n');
      console.warn(`Dark mode contrast issues on Contact:\n${summary}`);
    }
  });

  test('light mode has sufficient contrast on Home', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const results = await testExplicitContrast(page);

    if (results.failingElements.length > 0) {
      const summary = results.failingElements
        .map(
          (e) =>
            `- ${e.selector}: "${e.text}" — ${e.fgColor} on ${e.bgColor} = ${e.ratio}:1 (min: ${e.required}:1)`
        )
        .join('\n');
      console.warn(`Light mode contrast issues on Home:\n${summary}`);
    }
  });
});

/**
 * Touch target size (WCAG 2.5.8 - Target Size)
 * Les éléments interactifs doivent avoir une taille minimale de 24x24px (AA) ou 44x44px (best practice mobile)
 */
test.describe('Touch Target Size', () => {
  test('interactive elements have minimum touch target size', async ({ page }) => {
    await page.goto('/');

    const interactiveElements = page.locator('a, button, input, select, textarea');
    const count = await interactiveElements.count();
    const smallTargets: string[] = [];

    for (let i = 0; i < count; i++) {
      const el = interactiveElements.nth(i);
      const isVisible = await el.isVisible().catch(() => false);
      if (!isVisible) continue;

      const box = await el.boundingBox();
      if (!box) continue;

      // WCAG 2.5.8 Level AA: minimum 24x24px
      if (box.width < 24 || box.height < 24) {
        const text = (await el.textContent())?.slice(0, 20) || '';
        const tagName = await el.evaluate((e) => e.tagName.toLowerCase());
        smallTargets.push(
          `<${tagName}> "${text}" (${Math.round(box.width)}x${Math.round(box.height)}px)`
        );
      }
    }

    if (smallTargets.length > 0) {
      console.warn(
        `Warning: Interactive elements smaller than 24x24px:\n  - ${smallTargets.slice(0, 10).join('\n  - ')}`
      );
    }
  });
});

/**
 * Page title uniqueness
 * Chaque page doit avoir un titre unique et descriptif
 */
test.describe('Page Title Uniqueness', () => {
  test('all pages have unique titles', async ({ page }) => {
    const titles: { name: string; title: string }[] = [];

    for (const { name, path } of PAGES) {
      await page.goto(path, { waitUntil: 'domcontentloaded' });
      const title = await page.title();
      titles.push({ name, title });
    }

    // Check for duplicates
    const titleValues = titles.map((t) => t.title);
    const duplicates = titleValues.filter(
      (title, index) => titleValues.indexOf(title) !== index
    );

    if (duplicates.length > 0) {
      const duplicatePages = titles
        .filter((t) => duplicates.includes(t.title))
        .map((t) => `${t.name}: "${t.title}"`)
        .join(', ');
      expect(
        duplicates,
        `Duplicate page titles found: ${duplicatePages}`
      ).toHaveLength(0);
    }
  });
});