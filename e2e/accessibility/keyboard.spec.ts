import { test, expect } from '@playwright/test';

test.describe('Keyboard Navigation', () => {
  test('skip link should be first focusable element', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('Tab');
    const focused = page.locator(':focus');
    await expect(focused).toContainText(/aller au contenu|skip/i);
  });

  test('all form inputs should be focusable', async ({ page }) => {
    await page.goto('/contact');
    const inputs = page.locator('input, textarea');
    const count = await inputs.count();

    for (let i = 0; i < count; i++) {
      const el = inputs.nth(i);
      await el.focus();
      await expect(el).toBeFocused();
    }
  });

  test('navigation links should be keyboard accessible', async ({ page }) => {
    await page.goto('/');
    const navLinks = page.locator('nav a');
    const count = await navLinks.count();

    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < Math.min(count, 5); i++) {
      const link = navLinks.nth(i);
      await link.focus();
      await expect(link).toBeFocused();
    }
  });
});