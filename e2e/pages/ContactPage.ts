import type { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

/**
 * Page Object Model for Contact Page
 */
export class ContactPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  get url(): string {
    return '/contact';
  }

  // Form elements

  /**
   * Contact form
   */
  get form(): Locator {
    return this.page.locator('form').first();
  }

  /**
   * Name input field
   */
  get nameInput(): Locator {
    return this.page.locator(
      'input[name*="name" i], input[id*="name" i], input[autocomplete="name"]'
    ).first();
  }

  /**
   * Email input field
   */
  get emailInput(): Locator {
    return this.page.locator('input[type="email"], input[name*="email" i]').first();
  }

  /**
   * Message textarea
   */
  get messageInput(): Locator {
    return this.page.locator('textarea').first();
  }

  /**
   * Submit button
   */
  get submitButton(): Locator {
    return this.page.locator('button[type="submit"], input[type="submit"]').first();
  }

  /**
   * Error messages
   */
  get errorMessages(): Locator {
    return this.page.locator('[role="alert"], [aria-invalid="true"], .error-message');
  }

  /**
   * Success message
   */
  get successMessage(): Locator {
    return this.page.locator(
      '[role="status"], .success-message, [data-testid="success"]'
    ).first();
  }

  /**
   * Loading indicator
   */
  get loadingIndicator(): Locator {
    return this.page.locator('[aria-busy="true"], .loading, [data-loading]');
  }

  // Form actions

  /**
   * Fill the contact form
   */
  async fillForm(data: ContactFormData): Promise<void> {
    if ((await this.nameInput.count()) > 0) {
      await this.nameInput.fill(data.name);
    }
    if ((await this.emailInput.count()) > 0) {
      await this.emailInput.fill(data.email);
    }
    if ((await this.messageInput.count()) > 0) {
      await this.messageInput.fill(data.message);
    }
  }

  /**
   * Fill only the name field
   */
  async fillName(name: string): Promise<void> {
    await this.nameInput.fill(name);
  }

  /**
   * Fill only the email field
   */
  async fillEmail(email: string): Promise<void> {
    await this.emailInput.fill(email);
  }

  /**
   * Fill only the message field
   */
  async fillMessage(message: string): Promise<void> {
    await this.messageInput.fill(message);
  }

  /**
   * Submit the form
   */
  async submit(): Promise<void> {
    await this.submitButton.click();
  }

  /**
   * Submit and wait for response
   */
  async submitAndWait(): Promise<void> {
    await this.submitButton.click();

    // Wait for either success message, error, or button to be re-enabled
    await this.page.waitForFunction(
      () => {
        const btn = document.querySelector('button[type="submit"]');
        const success = document.querySelector('[role="status"], .success-message');
        const error = document.querySelector('[role="alert"]');
        return (
          (btn && !btn.hasAttribute('disabled')) ||
          success !== null ||
          error !== null
        );
      },
      { timeout: 15000 }
    ).catch(() => {});
  }

  /**
   * Clear the form
   */
  async clearForm(): Promise<void> {
    await this.nameInput.clear();
    await this.emailInput.clear();
    await this.messageInput.clear();
  }

  // Validation helpers

  /**
   * Check if form has validation errors
   */
  async hasValidationErrors(): Promise<boolean> {
    const errorCount = await this.errorMessages.count();
    return errorCount > 0;
  }

  /**
   * Get all validation error texts
   */
  async getValidationErrors(): Promise<string[]> {
    const errors = await this.errorMessages.allTextContents();
    return errors.filter((e) => e.trim().length > 0);
  }

  /**
   * Check if email field shows invalid state
   */
  async isEmailInvalid(): Promise<boolean> {
    const isInvalid = await this.emailInput.evaluate((el: HTMLInputElement) => {
      return !el.validity.valid || el.getAttribute('aria-invalid') === 'true';
    });
    return isInvalid;
  }

  /**
   * Check if form submission was successful
   */
  async isSubmissionSuccessful(): Promise<boolean> {
    return (await this.successMessage.count()) > 0;
  }

  /**
   * Check if form is currently submitting
   */
  async isSubmitting(): Promise<boolean> {
    const buttonDisabled = await this.submitButton.isDisabled();
    const hasLoading = (await this.loadingIndicator.count()) > 0;
    return buttonDisabled || hasLoading;
  }

  /**
   * Check if all required fields have values
   */
  async areRequiredFieldsFilled(): Promise<boolean> {
    const emptyRequired = await this.page.evaluate(() => {
      const required = document.querySelectorAll(
        'form input[required], form textarea[required]'
      );
      return Array.from(required).filter(
        (el) => !(el as HTMLInputElement).value
      ).length;
    });
    return emptyRequired === 0;
  }

  /**
   * Get the current value of a field
   */
  async getFieldValue(field: 'name' | 'email' | 'message'): Promise<string> {
    const locator =
      field === 'name'
        ? this.nameInput
        : field === 'email'
          ? this.emailInput
          : this.messageInput;
    return locator.inputValue();
  }
}
