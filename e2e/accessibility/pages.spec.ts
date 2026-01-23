import { test, expect } from '../fixtures/axe';

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
  test.describe(`${name} Page - WCAG AA`, () => {
    test('should have no accessibility violations', async ({
      page,
      makeAxeBuilder,
    }) => {
      await page.goto(path);
      const results = await makeAxeBuilder().analyze();
      expect(results.violations).toEqual([]);
    });
  });
}