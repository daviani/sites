import type { Page, Locator } from '@playwright/test';

/**
 * Base Page Object Model with common functionality
 */
export abstract class BasePage {
  constructor(protected page: Page) {}

  /**
   * Abstract method - each page must define its URL
   */
  abstract get url(): string;

  /**
   * Navigate to this page
   */
  async goto(): Promise<void> {
    await this.page.goto(this.url);
  }

  /**
   * Wait for page to be fully loaded
   */
  async waitForLoad(): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Get the page title
   */
  async getTitle(): Promise<string> {
    return this.page.title();
  }

  /**
   * Check if current URL matches this page
   */
  async isCurrentPage(): Promise<boolean> {
    const currentUrl = this.page.url();
    return currentUrl.includes(this.url) || currentUrl.endsWith(this.url);
  }

  // Common elements

  /**
   * Header element
   */
  get header(): Locator {
    return this.page.locator('header');
  }

  /**
   * Footer element
   */
  get footer(): Locator {
    return this.page.locator('footer');
  }

  /**
   * Main content area
   */
  get main(): Locator {
    return this.page.locator('main');
  }

  /**
   * Theme toggle button
   */
  get themeToggle(): Locator {
    return this.page.locator(
      'button[aria-label*="theme" i], button[aria-label*="thème" i], button[aria-label*="dark" i], button[aria-label*="sombre" i], button[aria-label*="light" i], button[aria-label*="clair" i]'
    ).first();
  }

  /**
   * Language switcher
   */
  get languageSwitcher(): Locator {
    return this.page.locator(
      'button[aria-label*="language" i], button[aria-label*="langue" i], [data-testid="language-switcher"]'
    ).first();
  }

  // Common actions

  /**
   * Toggle dark/light theme
   */
  async toggleTheme(): Promise<void> {
    const toggle = this.themeToggle;
    if ((await toggle.count()) > 0) {
      await toggle.click();
      await this.page.waitForFunction(() => {
        return (
          document.documentElement.classList.contains('dark') ||
          document.documentElement.classList.contains('light') ||
          document.documentElement.getAttribute('data-theme') !== null
        );
      });
    }
  }

  /**
   * Check if dark mode is active
   */
  async isDarkMode(): Promise<boolean> {
    return this.page.evaluate(() => {
      return (
        document.documentElement.classList.contains('dark') ||
        document.documentElement.getAttribute('data-theme') === 'dark'
      );
    });
  }

  /**
   * Navigate using a navigation link
   */
  async navigateTo(linkText: string): Promise<void> {
    await this.page.getByRole('link', { name: new RegExp(linkText, 'i') }).first().click();
    await this.waitForLoad();
  }
}
