import { test, expect } from '@playwright/test';

const pages = [
  { name: 'Home', path: '/' },
  { name: 'Contact', path: '/contact' },
  { name: 'Blog', path: '/blog' },
  { name: 'CV', path: '/cv' },
  { name: 'About', path: '/about' },
  { name: 'Photos', path: '/photos' },
  { name: 'Accessibility', path: '/accessibility' },
];

for (const { name, path } of pages) {
  test(`${name} page should load`, async ({ page }) => {
    const response = await page.goto(path);
    expect(response?.status()).toBe(200);
    await expect(page.locator('h1')).toBeVisible();
  });
}