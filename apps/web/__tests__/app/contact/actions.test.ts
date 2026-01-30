import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock next/headers
const mockHeadersGet = vi.fn();
vi.mock('next/headers', () => ({
  headers: vi.fn(async () => ({
    get: mockHeadersGet,
  })),
}));

// Mock dependencies — use real contactSchema (no deps)
const mockCheckRateLimit = vi.fn();
vi.mock('@/lib/rate-limit', () => ({
  checkRateLimit: (...args: unknown[]) => mockCheckRateLimit(...args),
}));

const mockVerifyRecaptcha = vi.fn();
vi.mock('@/lib/recaptcha', () => ({
  verifyRecaptcha: (...args: unknown[]) => mockVerifyRecaptcha(...args),
}));

const mockSendContactEmail = vi.fn();
vi.mock('@/lib/email', () => ({
  sendContactEmail: (...args: unknown[]) => mockSendContactEmail(...args),
}));

import { submitContactForm } from '@/app/(site)/contact/actions';

const validInput = {
  name: 'John Doe',
  email: 'john@example.com',
  message: 'Hello, this is a test message.',
  recaptchaToken: 'valid-token',
  favorite_color: '', // honeypot empty
};

describe('submitContactForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Default mocks for success path
    mockHeadersGet.mockImplementation((key: string) => {
      if (key === 'x-forwarded-for') return '1.2.3.4';
      return null;
    });
    mockCheckRateLimit.mockResolvedValue({ allowed: true, remaining: 4 });
    mockVerifyRecaptcha.mockResolvedValue(true);
    mockSendContactEmail.mockResolvedValue({ success: true });
  });

  describe('honeypot detection', () => {
    it('returns bot_detected when honeypot field is filled', async () => {
      const result = await submitContactForm({
        ...validInput,
        favorite_color: 'red',
      });
      expect(result).toEqual({ success: false, error: 'bot_detected' });
    });

    it('does not call any other service when honeypot is triggered', async () => {
      await submitContactForm({ ...validInput, favorite_color: 'red' });
      expect(mockCheckRateLimit).not.toHaveBeenCalled();
      expect(mockVerifyRecaptcha).not.toHaveBeenCalled();
      expect(mockSendContactEmail).not.toHaveBeenCalled();
    });
  });

  describe('rate limiting', () => {
    it('extracts IP from x-forwarded-for header', async () => {
      mockHeadersGet.mockImplementation((key: string) => {
        if (key === 'x-forwarded-for') return '1.2.3.4, 5.6.7.8';
        return null;
      });

      await submitContactForm(validInput);
      expect(mockCheckRateLimit).toHaveBeenCalledWith('1.2.3.4', 'contact');
    });

    it('uses "unknown" when no IP header present', async () => {
      mockHeadersGet.mockReturnValue(null);

      await submitContactForm(validInput);
      expect(mockCheckRateLimit).toHaveBeenCalledWith('unknown', 'contact');
    });

    it('returns rate_limited when rate limit exceeded', async () => {
      mockCheckRateLimit.mockResolvedValue({ allowed: false, remaining: 0 });

      const result = await submitContactForm(validInput);
      expect(result).toEqual({ success: false, error: 'rate_limited' });
    });
  });

  describe('recaptcha verification', () => {
    it('returns recaptcha_failed when token is empty', async () => {
      const result = await submitContactForm({
        ...validInput,
        recaptchaToken: '',
      });
      expect(result).toEqual({ success: false, error: 'recaptcha_failed' });
    });

    it('returns recaptcha_failed when verification fails', async () => {
      mockVerifyRecaptcha.mockResolvedValue(false);

      const result = await submitContactForm(validInput);
      expect(result).toEqual({ success: false, error: 'recaptcha_failed' });
    });

    it('proceeds when recaptcha is valid', async () => {
      mockVerifyRecaptcha.mockResolvedValue(true);

      const result = await submitContactForm(validInput);
      expect(result.error).not.toBe('recaptcha_failed');
    });
  });

  describe('form validation', () => {
    it('returns validation_error with fieldErrors for invalid data', async () => {
      const result = await submitContactForm({
        ...validInput,
        email: 'not-an-email',
      });
      expect(result.success).toBe(false);
      expect(result.error).toBe('validation_error');
      expect(result.fieldErrors).toBeDefined();
      expect(result.fieldErrors!.email).toBeDefined();
    });

    it('returns fieldErrors grouped by field name', async () => {
      const result = await submitContactForm({
        ...validInput,
        name: '',
        message: 'short',
      });
      expect(result.fieldErrors).toBeDefined();
      expect(result.fieldErrors!.name).toBeDefined();
      expect(result.fieldErrors!.message).toBeDefined();
    });

    it('passes validated data to sendContactEmail', async () => {
      await submitContactForm(validInput);
      expect(mockSendContactEmail).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'john@example.com',
        message: 'Hello, this is a test message.',
      });
    });
  });

  describe('email sending', () => {
    it('returns email_error when email fails', async () => {
      mockSendContactEmail.mockResolvedValue({ success: false, error: 'Resend error' });

      const result = await submitContactForm(validInput);
      expect(result).toEqual({ success: false, error: 'email_error' });
    });

    it('returns success true when entire pipeline succeeds', async () => {
      const result = await submitContactForm(validInput);
      expect(result).toEqual({ success: true });
    });
  });

  describe('execution order', () => {
    it('checks honeypot before rate limiting', async () => {
      await submitContactForm({ ...validInput, favorite_color: 'red' });
      expect(mockCheckRateLimit).not.toHaveBeenCalled();
    });

    it('checks rate limit before recaptcha', async () => {
      mockCheckRateLimit.mockResolvedValue({ allowed: false, remaining: 0 });

      await submitContactForm(validInput);
      expect(mockVerifyRecaptcha).not.toHaveBeenCalled();
    });

    it('checks recaptcha before validation', async () => {
      const result = await submitContactForm({
        ...validInput,
        recaptchaToken: '',
        email: 'invalid',
      });
      // Should fail on recaptcha, not validation
      expect(result.error).toBe('recaptcha_failed');
    });

    it('validates before sending email', async () => {
      await submitContactForm({
        ...validInput,
        email: 'invalid-email',
      });
      expect(mockSendContactEmail).not.toHaveBeenCalled();
    });
  });
});
