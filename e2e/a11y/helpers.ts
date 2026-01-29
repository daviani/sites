import { Page } from '@playwright/test';

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
  { name: 'RDV', path: '/rdv' },
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
  const skipLink = page
    .locator(
      'a[href^="#"]:has-text("skip"), a[href^="#"]:has-text("aller au contenu"), a[href^="#"]:has-text("passer")'
    )
    .first();
  const skipLinkExists = (await skipLink.count()) > 0;

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

/**
 * Known acronyms/abbreviations that should have explicit accessible labels
 * Audit VoiceOver: "CV" read as "Cheval Vapeur"
 */
const KNOWN_ACRONYMS = ['CV', 'RSS', 'RDV', 'API', 'URL', 'SEO', 'HTML', 'CSS', 'JS'];

/**
 * Test acronyms/abbreviations accessibility
 * Checks that known acronyms have aria-label, title, or <abbr> wrapper
 */
export async function testAcronymsAccessibility(page: Page) {
  const results = {
    acronymsWithoutLabel: [] as string[],
  };

  for (const acronym of KNOWN_ACRONYMS) {
    // Use more specific selectors to avoid matching parent containers
    // Only match direct text content, not inherited text from children
    const selectors = ['a', 'button', 'h1', 'h2', 'h3'];

    for (const selector of selectors) {
      const elements = page.locator(selector);
      const count = await elements.count().catch(() => 0);

      for (let i = 0; i < Math.min(count, 20); i++) {
        const el = elements.nth(i);

        // Use timeout and catch to handle detached elements
        const text = await el.textContent({ timeout: 2000 }).catch(() => null);
        if (!text) continue;

        // Only check if the acronym appears as a standalone word
        if (!new RegExp(`\\b${acronym}\\b`).test(text)) continue;

        // Skip if element has many children (likely a container, not the actual acronym element)
        const childCount = await el.evaluate((e) => e.children.length).catch(() => 99);
        if (childCount > 3) continue;

        const ariaLabel = await el.getAttribute('aria-label').catch(() => null);
        const title = await el.getAttribute('title').catch(() => null);
        const tagName = await el.evaluate((e) => e.tagName.toLowerCase()).catch(() => selector);

        // Check if wrapped in <abbr> or has aria-label/title
        const hasAbbrWrapper =
          (await el.locator(`abbr`).filter({ hasText: acronym }).count().catch(() => 0)) > 0;
        const hasAriaLabel =
          !!ariaLabel && ariaLabel.toLowerCase() !== acronym.toLowerCase();
        const hasTitle = !!title && title.toLowerCase() !== acronym.toLowerCase();

        if (!hasAbbrWrapper && !hasAriaLabel && !hasTitle) {
          results.acronymsWithoutLabel.push(
            `"${acronym}" in <${tagName}>: "${text?.slice(0, 50)}"`
          );
        }
      }
    }
  }

  // Deduplicate results
  results.acronymsWithoutLabel = [...new Set(results.acronymsWithoutLabel)];

  return results;
}

/**
 * Test form inputs for placeholder-only labels
 * Audit VoiceOver: placeholders read aloud by screen readers cause noise
 */
export async function testPlaceholderOnlyInputs(page: Page) {
  const results = {
    placeholderOnlyInputs: [] as string[],
  };

  const inputs = page.locator(
    'input:not([type="hidden"]):not([type="submit"]):not([type="button"]), textarea, select'
  );
  const count = await inputs.count();

  for (let i = 0; i < count; i++) {
    const input = inputs.nth(i);
    const id = await input.getAttribute('id');
    const name = await input.getAttribute('name');
    const placeholder = await input.getAttribute('placeholder');
    const ariaLabel = await input.getAttribute('aria-label');
    const ariaLabelledby = await input.getAttribute('aria-labelledby');

    if (!placeholder) continue; // No placeholder = not relevant

    // Check if there's a proper visible label
    let hasVisibleLabel = false;
    if (id) {
      hasVisibleLabel = (await page.locator(`label[for="${id}"]`).count()) > 0;
    }
    if (!hasVisibleLabel) {
      hasVisibleLabel = (await input.locator('xpath=ancestor::label').count()) > 0;
    }

    // An input with placeholder but no visible label, even with aria-label,
    // is problematic because placeholders disappear on focus
    if (!hasVisibleLabel && !ariaLabelledby) {
      results.placeholderOnlyInputs.push(
        `${name || id || `input[${i}]`}: placeholder="${placeholder}"`
      );
    }
  }

  return results;
}

/**
 * Test language switch accessibility
 * Opquast: language switch label should be in target language
 */
export async function testLanguageSwitchAccessibility(page: Page) {
  const results = {
    switchWithoutTargetLang: [] as string[],
    switchMissingLangAttr: [] as string[],
    switchMissingAriaLabel: [] as string[],
  };

  // Check elements with hreflang attribute (most reliable indicator)
  const hreflangElements = page.locator('a[hreflang]');
  const hreflangCount = await hreflangElements.count().catch(() => 0);

  for (let i = 0; i < hreflangCount; i++) {
    const el = hreflangElements.nth(i);
    const text = await el.textContent({ timeout: 2000 }).catch(() => null);
    const ariaLabel = await el.getAttribute('aria-label').catch(() => null);
    const hreflang = await el.getAttribute('hreflang').catch(() => null);
    const lang = await el.getAttribute('lang').catch(() => null);

    if (!hreflang) continue;

    // Check: the element should have a lang attribute matching target language
    if (!lang) {
      results.switchMissingLangAttr.push(
        `<a> "${text?.trim()}" has hreflang="${hreflang}" but no lang attribute`
      );
    }

    // Check: must have accessible name
    if (!ariaLabel && !text?.trim()) {
      results.switchMissingAriaLabel.push(
        `<a> language switch without accessible name`
      );
    }
  }

  // Check buttons with language-related aria-label
  const langButtons = page.locator('button[aria-label*="langue" i], button[aria-label*="language" i]');
  const langButtonCount = await langButtons.count().catch(() => 0);

  for (let i = 0; i < langButtonCount; i++) {
    const el = langButtons.nth(i);
    const text = await el.textContent({ timeout: 2000 }).catch(() => null);
    const ariaLabel = await el.getAttribute('aria-label').catch(() => null);

    // Check: must have accessible name
    if (!ariaLabel && !text?.trim()) {
      results.switchMissingAriaLabel.push(
        `<button> language switch without accessible name`
      );
    }
  }

  // Check data-lang-switch elements
  const dataLangSwitches = page.locator('[data-lang-switch]');
  const dataLangCount = await dataLangSwitches.count().catch(() => 0);

  for (let i = 0; i < dataLangCount; i++) {
    const el = dataLangSwitches.nth(i);
    const text = await el.textContent({ timeout: 2000 }).catch(() => null);
    const ariaLabel = await el.getAttribute('aria-label').catch(() => null);
    const tagName = await el.evaluate((e) => e.tagName.toLowerCase()).catch(() => 'unknown');

    // Check: must have accessible name
    if (!ariaLabel && !text?.trim()) {
      results.switchMissingAriaLabel.push(
        `<${tagName}> language switch without accessible name`
      );
    }
  }

  return results;
}

/**
 * Test inline language changes (RGAA Critère 8.7)
 * Content in a foreign language should have a lang attribute
 */
export async function testInlineLanguageChanges(page: Page) {
  const results = {
    foreignTextWithoutLang: [] as string[],
  };

  const htmlLang = await page.locator('html').getAttribute('lang');
  const pageLang = htmlLang?.slice(0, 2) || 'fr';

  // Look for common English words/phrases in a French page (or vice versa)
  if (pageLang === 'fr') {
    // Check for English content without lang="en"
    const englishPatterns = [
      'Read more',
      'Learn more',
      'Dark mode',
      'Light mode',
      'Loading',
      'Back to top',
    ];

    for (const pattern of englishPatterns) {
      const elements = page.locator(`*:has-text("${pattern}"):not([lang="en"])`);
      const count = await elements.count();

      for (let i = 0; i < count; i++) {
        const el = elements.nth(i);
        const text = await el.textContent();
        const tagName = await el.evaluate((e) => e.tagName.toLowerCase());

        // Only flag leaf elements (not containers that happen to contain the text)
        const isLeaf = await el.evaluate(
          (e) => e.children.length === 0 || e.childNodes.length === 1
        );
        if (isLeaf && text?.includes(pattern)) {
          // Check if any ancestor has lang="en"
          const hasLangAncestor =
            (await el.locator('xpath=ancestor-or-self::*[@lang="en"]').count()) > 0;
          if (!hasLangAncestor) {
            results.foreignTextWithoutLang.push(
              `<${tagName}>: "${text?.slice(0, 50)}" (expected lang="en")`
            );
          }
        }
      }
    }
  }

  return results;
}

/**
 * Calculate WCAG contrast ratio between two colors
 * Used for explicit contrast checks beyond axe-core
 */
export function calculateContrastRatio(
  fg: { r: number; g: number; b: number },
  bg: { r: number; g: number; b: number }
): number {
  const luminance = (color: { r: number; g: number; b: number }) => {
    const [r, g, b] = [color.r, color.g, color.b].map((c) => {
      const sRGB = c / 255;
      return sRGB <= 0.03928 ? sRGB / 12.92 : Math.pow((sRGB + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };

  const l1 = luminance(fg);
  const l2 = luminance(bg);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Parse CSS color string to RGB
 */
export function parseColor(color: string): { r: number; g: number; b: number } | null {
  // rgb(r, g, b) or rgba(r, g, b, a)
  const rgbMatch = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (rgbMatch) {
    return {
      r: parseInt(rgbMatch[1]),
      g: parseInt(rgbMatch[2]),
      b: parseInt(rgbMatch[3]),
    };
  }
  return null;
}

/**
 * Test explicit contrast on critical UI elements
 * Audit manuel: Dark mode has contrast issues (e.g., #5f81ac on #424a5c = 2.21:1)
 */
export async function testExplicitContrast(page: Page) {
  const results = {
    failingElements: [] as {
      selector: string;
      text: string;
      fgColor: string;
      bgColor: string;
      ratio: number;
      required: number;
    }[],
  };

  // Critical selectors to check (headings, nav, footer, buttons)
  const criticalSelectors = [
    { selector: 'h1', minRatio: 4.5 },
    { selector: 'h2', minRatio: 4.5 },
    { selector: 'h3', minRatio: 4.5 },
    { selector: 'nav a', minRatio: 4.5 },
    { selector: 'footer', minRatio: 4.5 },
    { selector: 'button', minRatio: 4.5 },
    { selector: 'a', minRatio: 4.5 },
    { selector: 'p', minRatio: 4.5 },
  ];

  for (const { selector, minRatio } of criticalSelectors) {
    const elements = page.locator(selector);
    const count = await elements.count();

    for (let i = 0; i < Math.min(count, 5); i++) {
      // Limit to first 5 per selector
      const el = elements.nth(i);
      const isVisible = await el.isVisible().catch(() => false);
      if (!isVisible) continue;

      const colors = await el.evaluate((e) => {
        const style = window.getComputedStyle(e);
        return {
          color: style.color,
          backgroundColor: style.backgroundColor,
        };
      });

      const fg = parseColor(colors.color);
      const bg = parseColor(colors.backgroundColor);

      // Skip transparent backgrounds (inherit from parent)
      if (!fg || !bg) continue;
      if (bg.r === 0 && bg.g === 0 && bg.b === 0 && colors.backgroundColor.includes('0)'))
        continue; // rgba with 0 alpha

      const ratio = calculateContrastRatio(fg, bg);

      if (ratio < minRatio) {
        const text = (await el.textContent())?.slice(0, 30) || '';
        results.failingElements.push({
          selector: `${selector}[${i}]`,
          text,
          fgColor: colors.color,
          bgColor: colors.backgroundColor,
          ratio: Math.round(ratio * 100) / 100,
          required: minRatio,
        });
      }
    }
  }

  return results;
}

/**
 * Test ARIA roles and properties completeness
 * Additional audit beyond basic checks
 */
export async function testAriaCompleteness(page: Page) {
  const results = {
    dialogsWithoutLabel: [] as string[],
    tabsWithoutRoles: [] as string[],
    liveRegionsIssues: [] as string[],
    buttonsWithoutType: [] as string[],
  };

  // Check dialogs/modals have accessible names
  const dialogs = page.locator('[role="dialog"], dialog');
  const dialogCount = await dialogs.count();
  for (let i = 0; i < dialogCount; i++) {
    const dialog = dialogs.nth(i);
    const ariaLabel = await dialog.getAttribute('aria-label');
    const ariaLabelledby = await dialog.getAttribute('aria-labelledby');
    if (!ariaLabel && !ariaLabelledby) {
      results.dialogsWithoutLabel.push(`dialog[${i}]`);
    }
  }

  // Check buttons have type attribute (to prevent form submission)
  const buttons = page.locator('button:not([type])');
  const btnCount = await buttons.count();
  for (let i = 0; i < btnCount; i++) {
    const btn = buttons.nth(i);
    const text = await btn.textContent();
    // Only flag buttons inside forms
    const isInForm = (await btn.locator('xpath=ancestor::form').count()) > 0;
    if (isInForm) {
      results.buttonsWithoutType.push(text?.slice(0, 30) || `button[${i}]`);
    }
  }

  return results;
}