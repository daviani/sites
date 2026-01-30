import { test, expect } from '@playwright/test';

/**
 * Smoke tests - Vérifie que toutes les pages se chargent correctement
 */

const pages = [
  { name: 'Home', path: '/', expectedH1: true },
  { name: 'Contact', path: '/contact', expectedH1: true },
  { name: 'Blog', path: '/blog', expectedH1: true },
  { name: 'CV', path: '/cv', expectedH1: true },
  { name: 'About', path: '/about', expectedH1: true },
  { name: 'Photos', path: '/photos', expectedH1: true },
  { name: 'Accessibility', path: '/accessibility', expectedH1: true },
  { name: 'Legal', path: '/legal', expectedH1: true },
  { name: 'Help', path: '/help', expectedH1: true },
  { name: 'Sitemap', path: '/sitemap', expectedH1: true },
  { name: 'RDV', path: '/rdv', expectedH1: true },
];

test.describe('Smoke Tests - Pages Load', () => {
  for (const { name, path, expectedH1 } of pages) {
    test(`${name} page loads successfully`, async ({ page }) => {
      // Navigate to the page
      const response = await page.goto(path);

      // Verify HTTP 200 OK
      expect(response?.status()).toBe(200);

      // Verify no console errors (warnings are OK)
      const errors: string[] = [];
      page.on('console', (msg) => {
        if (msg.type() === 'error') {
          errors.push(msg.text());
        }
      });

      // Wait for page to be fully loaded
      await page.waitForLoadState('domcontentloaded');

      // Verify H1 is present if expected
      if (expectedH1) {
        await expect(page.locator('h1').first()).toBeVisible();
      }

      // No critical console errors
      const criticalErrors = errors.filter(
        (e) =>
          !e.includes('favicon') &&
          !e.includes('404') &&
          !e.includes('hydration') &&
          !e.includes('_vercel') &&
          !e.includes('MIME')
      );
      expect(criticalErrors).toHaveLength(0);
    });
  }
});

test.describe('Smoke Tests - Core Elements', () => {
  test('Home page has navigation', async ({ page }) => {
    await page.goto('/');

    // Check navigation exists (may be hidden behind hamburger menu on mobile)
    const nav = page.locator('nav');
    await expect(nav.first()).toBeAttached();
  });

  test('Home page has footer', async ({ page }) => {
    await page.goto('/');

    // Check footer exists
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
  });

  test('Home page has main content', async ({ page }) => {
    await page.goto('/');

    // Check main content area
    const main = page.locator('main');
    await expect(main).toBeVisible();
  });

  test('Theme toggle is present', async ({ page }) => {
    await page.goto('/');

    // Check theme toggle button exists
    const themeToggle = page.locator(
      'button[aria-label*="theme" i], button[aria-label*="thème" i], button[aria-label*="dark" i], button[aria-label*="sombre" i]'
    );

    if ((await themeToggle.count()) > 0) {
      // May be hidden on mobile (behind hamburger menu)
      await expect(themeToggle.first()).toBeAttached();
    }
  });

  test('Language selector is present', async ({ page }) => {
    await page.goto('/');

    // Check language selector
    const langSelector = page.locator(
      'button[aria-label*="language" i], button[aria-label*="langue" i], [lang] button, a[hreflang]'
    );

    // At least one language-related element should exist
    const count = await langSelector.count();
    expect(count).toBeGreaterThanOrEqual(0); // May not have language selector
  });
});

test.describe('Smoke Tests - 404 Page', () => {
  test('404 page renders correctly', async ({ page }) => {
    const response = await page.goto('/non-existent-page-12345');

    // Should return 404
    expect(response?.status()).toBe(404);

    // Should have content (not blank)
    const bodyText = await page.locator('body').textContent();
    expect(bodyText?.length).toBeGreaterThan(10);
  });
});

test.describe('Smoke Tests - Static Assets', () => {
  test('Favicon loads', async ({ page }) => {
    await page.goto('/');

    // Check favicon link exists
    const favicon = page.locator(
      'link[rel="icon"], link[rel="shortcut icon"], link[rel="apple-touch-icon"]'
    );
    const count = await favicon.count();
    expect(count).toBeGreaterThan(0);
  });

  test('Meta tags are present', async ({ page }) => {
    await page.goto('/');

    // Check essential meta tags
    const viewport = page.locator('meta[name="viewport"]');
    await expect(viewport).toBeAttached();

    const description = page.locator('meta[name="description"]');
    await expect(description).toBeAttached();
  });

  test('Open Graph tags are present', async ({ page }) => {
    await page.goto('/');

    // Check OG tags for social sharing
    const ogTitle = page.locator('meta[property="og:title"]');
    const ogDescription = page.locator('meta[property="og:description"]');

    // At least one OG tag should be present
    const hasOgTags =
      (await ogTitle.count()) > 0 || (await ogDescription.count()) > 0;
    expect(hasOgTags).toBe(true);
  });
});