import { Page, expect } from '@playwright/test';

/**
 * Pages to test for accessibility
 */
export const PAGES = [
  { name: 'Home', path: '/' },
  { name: 'Contact', path: '/contact' },
  { name: 'Blog', path: '/blog' },
  { name: 'CV', path: '/cv' },
  { name: 'About', path: '/about' },
  { name: 'Photos', path: '/photos' },
] as const;

export type PageConfig = (typeof PAGES)[number];

/**
 * Generic patterns that indicate non-descriptive alt text
 */
const GENERIC_ALT_PATTERNS = [
  /^image$/i,
  /^photo$/i,
  /^picture$/i,
  /^img$/i,
  /^icon$/i,
  /^\d+$/,
  /^DSC_?\d+/i,
  /^IMG_?\d+/i,
  /\.(jpg|jpeg|png|gif|webp|svg)$/i,
];

/**
 * Check if alt text is generic/non-descriptive
 */
export function isGenericAltText(alt: string): boolean {
  if (!alt || alt.trim() === '') return false;
  return GENERIC_ALT_PATTERNS.some((pattern) => pattern.test(alt.trim()));
}

/**
 * RGAA Image tests - Critère 1
 */
export async function testImagesAccessibility(page: Page) {
  const results = {
    imgWithoutAlt: [] as string[],
    svgWithoutName: [] as string[],
    genericAltText: [] as string[],
  };

  // Test 1.1 - All img elements have alt attribute
  const images = page.locator('img');
  const imgCount = await images.count();
  for (let i = 0; i < imgCount; i++) {
    const img = images.nth(i);
    const alt = await img.getAttribute('alt');
    const src = await img.getAttribute('src');
    if (alt === null) {
      results.imgWithoutAlt.push(src || `img[${i}]`);
    } else if (isGenericAltText(alt)) {
      results.genericAltText.push(`${src}: "${alt}"`);
    }
  }

  // Test 1.1 - SVG images have accessible names
  const svgs = page.locator('svg[role="img"]');
  const svgCount = await svgs.count();
  for (let i = 0; i < svgCount; i++) {
    const svg = svgs.nth(i);
    const ariaLabel = await svg.getAttribute('aria-label');
    const ariaLabelledby = await svg.getAttribute('aria-labelledby');
    const title = await svg.locator('title').textContent().catch(() => null);
    if (!ariaLabel && !ariaLabelledby && !title) {
      results.svgWithoutName.push(`svg[role="img"][${i}]`);
    }
  }

  return results;
}

/**
 * RGAA Links tests - Critère 6
 */
export async function testLinksAccessibility(page: Page) {
  const results = {
    emptyLinks: [] as string[],
    genericLinkText: [] as string[],
    newWindowWithoutWarning: [] as string[],
  };

  const genericLinkPatterns = [
    /^click here$/i,
    /^here$/i,
    /^read more$/i,
    /^learn more$/i,
    /^more$/i,
    /^link$/i,
    /^cliquez ici$/i,
    /^ici$/i,
    /^en savoir plus$/i,
    /^lire la suite$/i,
  ];

  const links = page.locator('a[href]');
  const count = await links.count();

  for (let i = 0; i < count; i++) {
    const link = links.nth(i);
    const text = await link.textContent();
    const ariaLabel = await link.getAttribute('aria-label');
    const href = await link.getAttribute('href');
    const target = await link.getAttribute('target');
    const title = await link.getAttribute('title');

    const accessibleName = ariaLabel || text?.trim() || '';

    // Empty link check
    if (!accessibleName) {
      const hasImage = (await link.locator('img[alt], svg[aria-label]').count()) > 0;
      if (!hasImage) {
        results.emptyLinks.push(href || `link[${i}]`);
      }
    }

    // Generic link text
    if (genericLinkPatterns.some((p) => p.test(accessibleName))) {
      results.genericLinkText.push(`"${accessibleName}" -> ${href}`);
    }

    // New window without warning
    if (target === '_blank') {
      const hasWarning =
        title?.toLowerCase().includes('new window') ||
        title?.toLowerCase().includes('nouvelle fenêtre') ||
        title?.toLowerCase().includes('nouvel onglet') ||
        ariaLabel?.toLowerCase().includes('new window') ||
        ariaLabel?.toLowerCase().includes('nouvelle fenêtre') ||
        text?.includes('(nouvelle fenêtre)') ||
        text?.includes('(new window)');

      if (!hasWarning) {
        results.newWindowWithoutWarning.push(href || `link[${i}]`);
      }
    }
  }

  return results;
}

/**
 * RGAA Structure tests - Critère 9
 */
export async function testStructureAccessibility(page: Page) {
  const results = {
    missingH1: false,
    multipleH1: false,
    skippedHeadingLevels: [] as string[],
    missingMainLandmark: false,
    missingNavLandmark: false,
  };

  // Check h1
  const h1Count = await page.locator('h1').count();
  results.missingH1 = h1Count === 0;
  results.multipleH1 = h1Count > 1;

  // Check heading hierarchy
  const headings = await page.locator('h1, h2, h3, h4, h5, h6').all();
  let previousLevel = 0;
  for (const heading of headings) {
    const tagName = await heading.evaluate((el) => el.tagName.toLowerCase());
    const currentLevel = parseInt(tagName.replace('h', ''));
    if (previousLevel > 0 && currentLevel > previousLevel + 1) {
      const text = await heading.textContent();
      results.skippedHeadingLevels.push(
        `h${previousLevel} -> h${currentLevel}: "${text?.slice(0, 30)}..."`
      );
    }
    previousLevel = currentLevel;
  }

  // Check landmarks
  results.missingMainLandmark = (await page.locator('main, [role="main"]').count()) === 0;
  results.missingNavLandmark = (await page.locator('nav, [role="navigation"]').count()) === 0;

  return results;
}

/**
 * RGAA Forms tests - Critère 11
 */
export async function testFormsAccessibility(page: Page) {
  const results = {
    inputsWithoutLabels: [] as string[],
    requiredWithoutAriaRequired: [] as string[],
    invalidWithoutAriaInvalid: [] as string[],
  };

  const inputs = page.locator(
    'input:not([type="hidden"]):not([type="submit"]):not([type="button"]), textarea, select'
  );
  const count = await inputs.count();

  for (let i = 0; i < count; i++) {
    const input = inputs.nth(i);
    const id = await input.getAttribute('id');
    const ariaLabel = await input.getAttribute('aria-label');
    const ariaLabelledby = await input.getAttribute('aria-labelledby');
    const placeholder = await input.getAttribute('placeholder');
    const name = await input.getAttribute('name');

    // Check for label
    let hasLabel = !!ariaLabel || !!ariaLabelledby;
    if (id && !hasLabel) {
      hasLabel = (await page.locator(`label[for="${id}"]`).count()) > 0;
    }
    if (!hasLabel) {
      // Check if wrapped in label
      hasLabel = (await input.locator('xpath=ancestor::label').count()) > 0;
    }

    if (!hasLabel) {
      results.inputsWithoutLabels.push(name || id || `input[${i}]`);
    }

    // Check required fields
    const required = await input.getAttribute('required');
    const ariaRequired = await input.getAttribute('aria-required');
    if (required !== null && ariaRequired !== 'true') {
      // This is a warning, not always required
    }
  }

  return results;
}

/**
 * RGAA Navigation tests - Critère 12
 */
export async function testNavigationAccessibility(page: Page) {
  const results = {
    missingSkipLink: false,
    skipLinkNotFirst: false,
    skipLinkBroken: false,
  };

  // Check skip link
  const skipLink = page.locator('a[href^="#"]:has-text("skip"), a[href^="#"]:has-text("aller au contenu"), a[href^="#"]:has-text("passer")').first();
  const skipLinkExists = await skipLink.count() > 0;

  results.missingSkipLink = !skipLinkExists;

  if (skipLinkExists) {
    // Check if skip link target exists
    const href = await skipLink.getAttribute('href');
    if (href && href.startsWith('#')) {
      const targetId = href.slice(1);
      const targetExists = (await page.locator(`#${targetId}`).count()) > 0;
      results.skipLinkBroken = !targetExists;
    }
  }

  return results;
}