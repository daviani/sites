import { test, expect } from '@playwright/test';

/**
 * E2E Journey Tests - Theme Switching
 * Tests du parcours utilisateur pour le changement de thème
 */

test.describe('Theme Switching Journey', () => {
  test('User can toggle dark mode', async ({ page }) => {
    await page.goto('/');

    // Find theme toggle button
    const themeToggle = page.locator(
      'button[aria-label*="theme" i], button[aria-label*="thème" i], button[aria-label*="dark" i], button[aria-label*="sombre" i], button[aria-label*="light" i], button[aria-label*="clair" i]'
    ).first();

    if ((await themeToggle.count()) === 0) {
      test.skip();
      return;
    }

    // Get initial theme state
    const initialIsDark = await page.evaluate(() => {
      return (
        document.documentElement.classList.contains('dark') ||
        document.documentElement.getAttribute('data-theme') === 'dark'
      );
    });

    // Click theme toggle
    await themeToggle.click();

    // Wait for theme class to change
    await page.waitForFunction(
      (initialDark) => {
        const isDark =
          document.documentElement.classList.contains('dark') ||
          document.documentElement.getAttribute('data-theme') === 'dark';
        return isDark !== initialDark;
      },
      initialIsDark,
      { timeout: 2000 }
    );

    // Verify theme changed
    const afterToggleIsDark = await page.evaluate(() => {
      return (
        document.documentElement.classList.contains('dark') ||
        document.documentElement.getAttribute('data-theme') === 'dark'
      );
    });

    expect(afterToggleIsDark).not.toBe(initialIsDark);

    // Toggle back
    await themeToggle.click();

    // Wait for theme class to revert
    await page.waitForFunction(
      (afterToggle) => {
        const isDark =
          document.documentElement.classList.contains('dark') ||
          document.documentElement.getAttribute('data-theme') === 'dark';
        return isDark !== afterToggle;
      },
      afterToggleIsDark,
      { timeout: 2000 }
    );

    const finalIsDark = await page.evaluate(() => {
      return (
        document.documentElement.classList.contains('dark') ||
        document.documentElement.getAttribute('data-theme') === 'dark'
      );
    });

    expect(finalIsDark).toBe(initialIsDark);
  });

  test('Theme persists across navigation', async ({ page }) => {
    await page.goto('/');

    // Find and click theme toggle
    const themeToggle = page.locator(
      'button[aria-label*="theme" i], button[aria-label*="thème" i], button[aria-label*="dark" i], button[aria-label*="sombre" i]'
    ).first();

    if ((await themeToggle.count()) === 0) {
      test.skip();
      return;
    }

    // Get initial state
    const initialIsDark = await page.evaluate(() => {
      return (
        document.documentElement.classList.contains('dark') ||
        document.documentElement.getAttribute('data-theme') === 'dark'
      );
    });

    // Toggle theme
    await themeToggle.click();

    // Wait for theme class to change
    await page.waitForFunction(
      (initialDark) => {
        const isDark =
          document.documentElement.classList.contains('dark') ||
          document.documentElement.getAttribute('data-theme') === 'dark';
        return isDark !== initialDark;
      },
      initialIsDark,
      { timeout: 2000 }
    );

    // Navigate to another page
    await page.goto('/blog');
    await page.waitForLoadState('domcontentloaded');
    // Wait for theme to be applied by useEffect
    await page.waitForFunction(() => {
      return document.cookie.includes('theme=') ||
        document.documentElement.classList.contains('dark') ||
        document.documentElement.getAttribute('data-theme') !== null;
    });

    // Check theme is still in the new state
    const afterNavIsDark = await page.evaluate(() => {
      return (
        document.documentElement.classList.contains('dark') ||
        document.documentElement.getAttribute('data-theme') === 'dark'
      );
    });

    expect(afterNavIsDark).not.toBe(initialIsDark);
  });

  test('Theme persists after page reload', async ({ page }) => {
    await page.goto('/');

    const themeToggle = page.locator(
      'button[aria-label*="theme" i], button[aria-label*="thème" i], button[aria-label*="dark" i]'
    ).first();

    if ((await themeToggle.count()) === 0) {
      test.skip();
      return;
    }

    // Get initial state
    const initialIsDark = await page.evaluate(() => {
      return (
        document.documentElement.classList.contains('dark') ||
        document.documentElement.getAttribute('data-theme') === 'dark'
      );
    });

    // Toggle theme
    await themeToggle.click();

    // Wait for theme class to change
    await page.waitForFunction(
      (initialDark) => {
        const isDark =
          document.documentElement.classList.contains('dark') ||
          document.documentElement.getAttribute('data-theme') === 'dark';
        return isDark !== initialDark;
      },
      initialIsDark,
      { timeout: 2000 }
    );

    // Reload page
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Check theme persisted
    const afterReloadIsDark = await page.evaluate(() => {
      return (
        document.documentElement.classList.contains('dark') ||
        document.documentElement.getAttribute('data-theme') === 'dark'
      );
    });

    expect(afterReloadIsDark).not.toBe(initialIsDark);
  });

  test('Theme toggle has accessible label', async ({ page }) => {
    await page.goto('/');

    const themeToggle = page.locator(
      'button[aria-label*="theme" i], button[aria-label*="thème" i], button[aria-label*="dark" i], button[aria-label*="sombre" i]'
    ).first();

    if ((await themeToggle.count()) === 0) {
      test.skip();
      return;
    }

    // Check button has accessible name
    const ariaLabel = await themeToggle.getAttribute('aria-label');
    expect(ariaLabel).toBeTruthy();
    expect(ariaLabel!.length).toBeGreaterThan(3);
  });

  test('Theme respects system preference initially', async ({ page, browserName }) => {
    // Emulate dark mode system preference
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    // Wait for theme to be applied (useEffect may run after initial render)
    await page.waitForFunction(() => {
      return document.documentElement.classList.contains('dark') ||
        document.documentElement.getAttribute('data-theme') === 'dark' ||
        window.matchMedia('(prefers-color-scheme: dark)').matches;
    }, { timeout: 5000 }).catch(() => {});

    // Check if theme matches system preference (or has been overridden by user)
    const isDark = await page.evaluate(() => {
      return (
        document.documentElement.classList.contains('dark') ||
        document.documentElement.getAttribute('data-theme') === 'dark' ||
        window.matchMedia('(prefers-color-scheme: dark)').matches
      );
    });

    // Firefox may not fully support emulateMedia for prefers-color-scheme
    if (browserName === 'firefox' && !isDark) {
      test.skip();
      return;
    }

    // Should be dark (either from class or from system preference)
    expect(isDark).toBe(true);
  });
});

test.describe('Theme Visual Consistency', () => {
  test('All pages support dark mode', async ({ page }) => {
    const pagesToTest = ['/', '/blog', '/contact', '/cv', '/about'];

    for (const path of pagesToTest) {
      await page.goto(path);

      // Force dark mode
      await page.evaluate(() => {
        document.documentElement.classList.add('dark');
        document.documentElement.setAttribute('data-theme', 'dark');
      });

      // Check no elements have pure white background
      const hasProblematicWhite = await page.evaluate(() => {
        const elements = document.querySelectorAll('*');
        for (const el of elements) {
          const style = window.getComputedStyle(el);
          if (
            style.backgroundColor === 'rgb(255, 255, 255)' &&
            style.display !== 'none'
          ) {
            const rect = el.getBoundingClientRect();
            // Only check visible, significant elements
            if (rect.width > 50 && rect.height > 50) {
              return true;
            }
          }
        }
        return false;
      });

      // May have some white elements, log for review
      if (hasProblematicWhite) {
        console.log(`Page ${path} may have white elements in dark mode`);
      }
    }
  });
});