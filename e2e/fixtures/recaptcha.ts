import type { Page } from '@playwright/test';

/**
 * Mock reCAPTCHA for E2E tests
 * Injects a mock grecaptcha object that always returns a mock token
 */
export async function mockRecaptcha(page: Page): Promise<void> {
  await page.addInitScript(() => {
    // Create mock grecaptcha object
    const mockGrecaptcha = {
      ready: (callback: () => void) => {
        // Execute callback immediately
        callback();
      },
      execute: (_siteKey: string, _options?: { action: string }) => {
        // Return mock token
        return Promise.resolve('mock-recaptcha-token-for-e2e-testing');
      },
      render: (_container: string | HTMLElement, _parameters?: object) => {
        // Return widget ID
        return 1;
      },
      reset: (_widgetId?: number) => {
        // No-op
      },
      getResponse: (_widgetId?: number) => {
        return 'mock-recaptcha-response';
      },
    };

    // Define grecaptcha on window
    Object.defineProperty(window, 'grecaptcha', {
      value: mockGrecaptcha,
      writable: false,
      configurable: true,
    });

    // Also mock the Enterprise version if needed
    Object.defineProperty(window, 'grecaptcha', {
      value: {
        ...mockGrecaptcha,
        enterprise: mockGrecaptcha,
      },
      writable: false,
      configurable: true,
    });
  });
}

/**
 * Mock reCAPTCHA to fail (simulate verification error)
 */
export async function mockRecaptchaFailure(page: Page): Promise<void> {
  await page.addInitScript(() => {
    const mockGrecaptcha = {
      ready: (callback: () => void) => {
        callback();
      },
      execute: () => {
        return Promise.reject(new Error('reCAPTCHA verification failed'));
      },
      render: () => 1,
      reset: () => {},
      getResponse: () => '',
    };

    Object.defineProperty(window, 'grecaptcha', {
      value: {
        ...mockGrecaptcha,
        enterprise: mockGrecaptcha,
      },
      writable: false,
      configurable: true,
    });
  });
}

/**
 * Wait for reCAPTCHA to be ready (mock or real)
 */
export async function waitForRecaptcha(page: Page, timeout = 5000): Promise<boolean> {
  try {
    await page.waitForFunction(
      () => {
        return typeof window.grecaptcha !== 'undefined' && typeof window.grecaptcha.ready === 'function';
      },
      { timeout }
    );
    return true;
  } catch {
    return false;
  }
}
