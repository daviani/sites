import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration with separated test projects:
 * - smoke: Quick tests on all browsers
 * - a11y: Accessibility tests (chromium only, faster)
 * - e2e: Full E2E tests on chromium
 * - cross-browser: E2E on all browsers (CI only)
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : 3, // Limit workers to avoid server overload

  // Global timeout settings
  timeout: 30000,
  expect: {
    timeout: 5000,
  },

  reporter: process.env.CI
    ? [
        ['github'],
        ['html', { open: 'never' }],
        ['json', { outputFile: 'playwright-report/results.json' }],
      ]
    : [
        ['list'],
        ['html', { open: 'never' }],
      ],

  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    // Smoke tests - quick validation on all browsers
    {
      name: 'smoke',
      testMatch: /smoke\/.*\.spec\.ts/,
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'smoke-firefox',
      testMatch: /smoke\/.*\.spec\.ts/,
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'smoke-webkit',
      testMatch: /smoke\/.*\.spec\.ts/,
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'smoke-mobile',
      testMatch: /smoke\/.*\.spec\.ts/,
      use: { ...devices['Pixel 5'] },
    },

    // Accessibility tests - chromium only (a11y is browser-agnostic)
    {
      name: 'a11y',
      testMatch: /a11y\/.*\.spec\.ts/,
      use: { ...devices['Desktop Chrome'] },
    },

    // Journey/E2E tests - chromium by default
    {
      name: 'e2e',
      testMatch: /(journeys|forms)\/.*\.spec\.ts/,
      use: { ...devices['Desktop Chrome'] },
    },

    // Cross-browser E2E (optional, for full validation)
    {
      name: 'e2e-firefox',
      testMatch: /(journeys|forms)\/.*\.spec\.ts/,
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'e2e-webkit',
      testMatch: /(journeys|forms)\/.*\.spec\.ts/,
      use: { ...devices['Desktop Safari'] },
    },
  ],

  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120000, // Wait up to 2min for server to start
    stdout: 'pipe',
    stderr: 'pipe',
  },
});