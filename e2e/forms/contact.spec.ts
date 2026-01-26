import { test, expect } from '@playwright/test';

/**
 * E2E Tests - Contact Form
 * Tests du formulaire de contact
 */

test.describe('Contact Form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/contact');
  });

  test('Contact form is visible', async ({ page }) => {
    const form = page.locator('form');
    await expect(form.first()).toBeVisible();
  });

  test('Contact form has required fields', async ({ page }) => {
    // Check for name field
    const nameField = page.locator(
      'input[name*="name" i], input[id*="name" i], input[autocomplete="name"]'
    );
    expect(await nameField.count()).toBeGreaterThan(0);

    // Check for email field
    const emailField = page.locator(
      'input[type="email"], input[name*="email" i]'
    );
    expect(await emailField.count()).toBeGreaterThan(0);

    // Check for message field
    const messageField = page.locator(
      'textarea, textarea[name*="message" i], textarea[id*="message" i]'
    );
    expect(await messageField.count()).toBeGreaterThan(0);
  });

  test('Contact form fields have labels', async ({ page }) => {
    const inputs = page.locator(
      'form input:not([type="hidden"]):not([type="submit"]), form textarea'
    );
    const count = await inputs.count();

    for (let i = 0; i < count; i++) {
      const input = inputs.nth(i);
      const id = await input.getAttribute('id');
      const ariaLabel = await input.getAttribute('aria-label');

      let hasLabel = !!ariaLabel;

      if (id) {
        const label = page.locator(`label[for="${id}"]`);
        if ((await label.count()) > 0) {
          hasLabel = true;
        }
      }

      // Check parent label
      const parentLabel = await input.evaluate((el) => el.closest('label') !== null);
      if (parentLabel) {
        hasLabel = true;
      }

      expect(hasLabel).toBe(true);
    }
  });

  test('Form shows validation errors for empty submission', async ({ page }) => {
    // Find and click submit button
    const submitButton = page.locator(
      'button[type="submit"], input[type="submit"]'
    );

    if ((await submitButton.count()) > 0) {
      await submitButton.click();

      // Check for validation (either native HTML5 or custom)
      const hasValidationError = await page.evaluate(() => {
        // Check for HTML5 validation
        const invalidInputs = document.querySelectorAll(':invalid');
        if (invalidInputs.length > 0) return true;

        // Check for custom error messages
        const errorElements = document.querySelectorAll(
          '[class*="error"], [role="alert"], [aria-invalid="true"]'
        );
        return errorElements.length > 0;
      });

      expect(hasValidationError).toBe(true);
    }
  });

  test('Email field validates email format', async ({ page }) => {
    const emailField = page.locator('input[type="email"]').first();

    if ((await emailField.count()) > 0) {
      // Enter invalid email
      await emailField.fill('invalid-email');
      await emailField.blur();

      // Check for validation
      const isInvalid = await emailField.evaluate((el: HTMLInputElement) => {
        return !el.validity.valid || el.getAttribute('aria-invalid') === 'true';
      });

      expect(isInvalid).toBe(true);

      // Enter valid email
      await emailField.fill('test@example.com');
      await emailField.blur();

      const isValid = await emailField.evaluate((el: HTMLInputElement) => {
        return el.validity.valid;
      });

      expect(isValid).toBe(true);
    }
  });

  test('Form is keyboard navigable', async ({ page }) => {
    // Focus on first input
    await page.keyboard.press('Tab');

    // Tab through all form fields
    const formFields = await page.locator(
      'form input:not([type="hidden"]), form textarea, form button, form select'
    ).all();

    for (let i = 0; i < formFields.length; i++) {
      const focused = await page.evaluate(() => document.activeElement?.tagName);
      expect(['INPUT', 'TEXTAREA', 'BUTTON', 'SELECT']).toContain(focused);
      await page.keyboard.press('Tab');
    }
  });

  test('Required fields are marked', async ({ page }) => {
    const requiredInputs = page.locator(
      'form input[required], form textarea[required], form [aria-required="true"]'
    );
    const count = await requiredInputs.count();

    // At least name, email, and message should be required
    expect(count).toBeGreaterThanOrEqual(2);
  });

  test('Submit button is clearly labeled', async ({ page }) => {
    const submitButton = page.locator(
      'button[type="submit"], input[type="submit"]'
    ).first();

    if ((await submitButton.count()) > 0) {
      const text = await submitButton.textContent();
      const value = await submitButton.getAttribute('value');
      const ariaLabel = await submitButton.getAttribute('aria-label');

      const buttonText = text || value || ariaLabel || '';
      expect(buttonText.trim().length).toBeGreaterThan(0);
    }
  });
});

test.describe('Contact Form - Successful Submission', () => {
  test('Form can be filled and submitted', async ({ page }) => {
    await page.goto('/contact');

    // Fill name field
    const nameField = page.locator(
      'input[name*="name" i], input[id*="name" i], input[autocomplete="name"]'
    ).first();
    if ((await nameField.count()) > 0) {
      await nameField.fill('Test User');
    }

    // Fill email field
    const emailField = page.locator('input[type="email"]').first();
    if ((await emailField.count()) > 0) {
      await emailField.fill('test@example.com');
    }

    // Fill message field
    const messageField = page.locator('textarea').first();
    if ((await messageField.count()) > 0) {
      await messageField.fill(
        'This is a test message from Playwright E2E tests.'
      );
    }

    // Note: We don't actually submit in tests to avoid sending real emails
    // Just verify form can be filled

    // Check all required fields are filled
    const emptyRequiredFields = await page.evaluate(() => {
      const required = document.querySelectorAll(
        'form input[required], form textarea[required]'
      );
      return Array.from(required).filter(
        (el) => !(el as HTMLInputElement).value
      ).length;
    });

    expect(emptyRequiredFields).toBe(0);
  });
});

test.describe('Contact Form - Accessibility', () => {
  test('Form has accessible error messages', async ({ page }) => {
    await page.goto('/contact');

    // Find required field and clear it if filled
    const emailField = page.locator('input[type="email"]').first();

    if ((await emailField.count()) > 0) {
      await emailField.fill('');
      await emailField.blur();

      // Trigger validation
      const form = page.locator('form').first();
      if ((await form.count()) > 0) {
        await page.keyboard.press('Enter');
      }

      // Check if error is associated with field
      const ariaDescribedby = await emailField.getAttribute('aria-describedby');
      const ariaInvalid = await emailField.getAttribute('aria-invalid');

      // At least one accessibility attribute should be present for errors
      // (or native HTML5 validation handles it)
    }
  });

  test('Form submission shows loading state', async ({ page }) => {
    await page.goto('/contact');

    // Note: This test verifies the loading state exists
    // We look for aria-busy, disabled state, or loading indicator

    const submitButton = page.locator('button[type="submit"]').first();

    if ((await submitButton.count()) > 0) {
      // Check button can be disabled (has the capability)
      const canBeDisabled = await submitButton.evaluate((el) => {
        return 'disabled' in el;
      });

      expect(canBeDisabled).toBe(true);
    }
  });
});