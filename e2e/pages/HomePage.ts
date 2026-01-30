import type { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Page Object Model for Home Page
 */
export class HomePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  get url(): string {
    return '/';
  }

  // Page-specific elements

  /**
   * Main hero section
   */
  get heroSection(): Locator {
    return this.page.locator('[data-testid="hero"], .hero, section').first();
  }

  /**
   * Main heading (h1)
   */
  get mainHeading(): Locator {
    return this.page.locator('h1').first();
  }

  /**
   * Navigation links in header
   */
  get navLinks(): Locator {
    return this.header.locator('a, button[role="link"]');
  }

  /**
   * Link to blog
   */
  get blogLink(): Locator {
    return this.page.getByRole('link', { name: /blog/i }).first();
  }

  /**
   * Link to contact
   */
  get contactLink(): Locator {
    return this.page.getByRole('link', { name: /contact/i }).first();
  }

  /**
   * Link to CV
   */
  get cvLink(): Locator {
    return this.page.getByRole('link', { name: /cv|resume/i }).first();
  }

  /**
   * Link to about
   */
  get aboutLink(): Locator {
    return this.page.getByRole('link', { name: /about|à propos/i }).first();
  }

  /**
   * Social links
   */
  get socialLinks(): Locator {
    return this.page.locator('a[href*="github"], a[href*="linkedin"], a[href*="twitter"]');
  }

  // Page-specific actions

  /**
   * Go to Blog page
   */
  async goToBlog(): Promise<void> {
    await this.blogLink.click();
    await this.waitForLoad();
  }

  /**
   * Go to Contact page
   */
  async goToContact(): Promise<void> {
    await this.contactLink.click();
    await this.waitForLoad();
  }

  /**
   * Go to CV page
   */
  async goToCv(): Promise<void> {
    await this.cvLink.click();
    await this.waitForLoad();
  }

  /**
   * Go to About page
   */
  async goToAbout(): Promise<void> {
    await this.aboutLink.click();
    await this.waitForLoad();
  }

  /**
   * Get hero heading text
   */
  async getHeroHeading(): Promise<string> {
    return (await this.mainHeading.textContent()) || '';
  }

  /**
   * Check if all main navigation links are visible
   */
  async hasAllNavLinks(): Promise<boolean> {
    const hasAbout = (await this.aboutLink.count()) > 0;
    const hasBlog = (await this.blogLink.count()) > 0;
    const hasContact = (await this.contactLink.count()) > 0;
    const hasCv = (await this.cvLink.count()) > 0;

    return hasAbout && hasBlog && hasContact && hasCv;
  }

  /**
   * Get all social link URLs
   */
  async getSocialLinkUrls(): Promise<string[]> {
    const links = await this.socialLinks.all();
    const urls: string[] = [];
    for (const link of links) {
      const href = await link.getAttribute('href');
      if (href) urls.push(href);
    }
    return urls;
  }
}
