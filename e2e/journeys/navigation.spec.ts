import { test, expect } from '@playwright/test';

/**
 * E2E Journey Tests - Navigation
 * Tests des parcours utilisateur liés à la navigation
 */

test.describe('Navigation Journey', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('User can navigate to all main pages from home', async ({ page }) => {
    // Home
    await page.goto('/');
    await expect(page.locator('h1')).toBeVisible();

    // Blog
    await page.goto('/blog');
    await expect(page.locator('h1')).toBeVisible();

    // Contact
    await page.goto('/contact');
    await expect(page.locator('h1')).toBeVisible();

    // CV
    await page.goto('/cv');
    await expect(page.locator('h1')).toBeVisible();

    // About
    await page.goto('/about');
    await expect(page.locator('h1')).toBeVisible();
  });

  test('User can navigate back and forward', async ({ page }) => {
    // Navigate to blog
    await page.goto('/blog');
    await expect(page).toHaveURL(/\/blog/);

    // Navigate to contact
    await page.goto('/contact');
    await expect(page).toHaveURL(/\/contact/);

    // Go back
    await page.goBack();
    await expect(page).toHaveURL(/\/blog/);

    // Go forward
    await page.goForward();
    await expect(page).toHaveURL(/\/contact/);
  });

  test('Logo or site title links to home', async ({ page }) => {
    // Navigate away from home
    await page.goto('/blog');

    // Click on logo/site title
    const homeLink = page.locator(
      'a[href="/"] img, a[href="/"][aria-label*="home" i], a[href="/"][aria-label*="accueil" i], header a[href="/"]'
    ).first();

    if ((await homeLink.count()) > 0) {
      await homeLink.click();
      await expect(page).toHaveURL(/\/$/);
    }
  });

  test('Mobile menu works', async ({ page, isMobile }) => {
    if (!isMobile) {
      // Skip on desktop
      test.skip();
    }

    // Look for hamburger menu button
    const menuButton = page.locator(
      'button[aria-label*="menu" i], button[aria-expanded]'
    ).first();

    if ((await menuButton.count()) > 0) {
      // Open menu
      await menuButton.click();

      // Menu should be visible
      const menu = page.locator('nav[role="navigation"], nav');
      await expect(menu.first()).toBeVisible();

      // Navigate via menu
      const blogLink = page.locator('nav a[href="/blog"]');
      await blogLink.click();
      await expect(page).toHaveURL(/\/blog/);
    }
  });
});

test.describe('Skip Link Journey', () => {
  test('Skip link works correctly', async ({ page }) => {
    await page.goto('/');

    // Press Tab to reveal skip link
    await page.keyboard.press('Tab');

    // Find skip link
    const skipLink = page.locator(
      'a[href="#main"], a[href="#content"], a[href="#main-content"]'
    ).first();

    if ((await skipLink.count()) > 0) {
      // Activate skip link
      await page.keyboard.press('Enter');

      // Main content should be focused or scrolled into view
      const main = page.locator('main, #main, #content').first();
      await expect(main).toBeInViewport();
    }
  });
});

test.describe('Breadcrumb Journey', () => {
  test('Breadcrumb navigation works', async ({ page }) => {
    // Go to a nested page if exists
    await page.goto('/blog');

    const breadcrumb = page.locator(
      '[aria-label*="breadcrumb" i], .breadcrumb, nav[aria-label*="fil" i]'
    );

    if ((await breadcrumb.count()) > 0) {
      // Click on home link in breadcrumb
      const homeLink = breadcrumb.locator('a[href="/"]').first();
      if ((await homeLink.count()) > 0) {
        await homeLink.click();
        await expect(page).toHaveURL(/\/$/);
      }
    }
  });
});

test.describe('Footer Navigation Journey', () => {
  test('Footer links work', async ({ page }) => {
    await page.goto('/');

    // Scroll to footer
    await page.locator('footer').scrollIntoViewIfNeeded();

    // Check legal page link (footer has desktop + mobile variants)
    const legalLink = page.locator('footer a[href="/legal"]').first();
    if ((await legalLink.count()) > 0) {
      await legalLink.click();
      await expect(page).toHaveURL(/\/legal/);
    }

    // Go back
    await page.goBack();

    // Check accessibility page link (footer has desktop + mobile variants)
    const a11yLink = page.locator('footer a[href="/accessibility"]').first();
    if ((await a11yLink.count()) > 0) {
      await a11yLink.click();
      await expect(page).toHaveURL(/\/accessibility/);
    }
  });

  test('Social links open in new tab', async ({ page, context }) => {
    await page.goto('/');

    // Find social links in footer (filter to visible only)
    const socialLinks = page.locator(
      'footer a[target="_blank"], footer a[rel*="external"]'
    );
    const count = await socialLinks.count();

    if (count > 0) {
      // Find the first visible link
      let firstVisible = null;
      for (let i = 0; i < count; i++) {
        const link = socialLinks.nth(i);
        if (await link.isVisible()) {
          firstVisible = link;
          break;
        }
      }

      if (firstVisible) {
        const [newPage] = await Promise.all([
          context.waitForEvent('page'),
          firstVisible.click(),
        ]);

        // New page should have opened
        expect(newPage).toBeTruthy();
        await newPage.close();
      }
    }
  });
});