/* eslint-env jest */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { submitContactForm } from '@/app/(site)/contact/actions';

// Mock dependencies
jest.mock('@/lib/rate-limit', () => ({
  checkRateLimit: jest.fn(),
}));

jest.mock('@/lib/recaptcha', () => ({
  verifyRecaptcha: jest.fn(),
}));

jest.mock('@/lib/email', () => ({
  sendContactEmail: jest.fn(),
}));

// Mock next/headers
jest.mock('next/headers', () => ({
  headers: jest.fn(() => ({
    get: jest.fn((key: string) => {
      if (key === 'x-forwarded-for') return '192.168.1.1';
      return null;
    }),
  })),
}));

import { checkRateLimit } from '@/lib/rate-limit';
import { verifyRecaptcha } from '@/lib/recaptcha';
import { sendContactEmail } from '@/lib/email';

const mockCheckRateLimit = checkRateLimit as jest.MockedFunction<
  typeof checkRateLimit
>;
const mockVerifyRecaptcha = verifyRecaptcha as jest.MockedFunction<
  typeof verifyRecaptcha
>;
const mockSendContactEmail = sendContactEmail as jest.MockedFunction<
  typeof sendContactEmail
>;

describe('Contact Server Action', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockCheckRateLimit.mockResolvedValue({ allowed: true, remaining: 4 });
    mockVerifyRecaptcha.mockResolvedValue(true);
    mockSendContactEmail.mockResolvedValue({ success: true });
  });

  const validFormData = {
    name: 'John Doe',
    email: 'john@example.com',
    message: 'This is a test message for the contact form.',
    recaptchaToken: 'valid-token',
    favorite_color: '', // Honeypot field - should be empty
  };

  describe('successful submission', () => {
    it('sends email when all validations pass', async () => {
      const result = await submitContactForm(validFormData);

      expect(result.success).toBe(true);
      expect(mockSendContactEmail).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'john@example.com',
        message: 'This is a test message for the contact form.',
      });
    });

    it('checks rate limit with IP and action', async () => {
      await submitContactForm(validFormData);

      expect(mockCheckRateLimit).toHaveBeenCalledWith('192.168.1.1', 'contact');
    });

    it('verifies recaptcha token', async () => {
      await submitContactForm(validFormData);

      expect(mockVerifyRecaptcha).toHaveBeenCalledWith('valid-token');
    });
  });

  describe('honeypot protection', () => {
    it('rejects submission when honeypot field is filled', async () => {
      const botFormData = {
        ...validFormData,
        favorite_color: 'blue',
      };

      const result = await submitContactForm(botFormData);

      expect(result.success).toBe(false);
      expect(result.error).toBe('bot_detected');
      expect(mockSendContactEmail).not.toHaveBeenCalled();
    });

    it('allows submission when honeypot is empty string', async () => {
      const result = await submitContactForm(validFormData);

      expect(result.success).toBe(true);
    });
  });

  describe('rate limiting', () => {
    it('rejects when rate limit exceeded', async () => {
      mockCheckRateLimit.mockResolvedValue({ allowed: false, remaining: 0 });

      const result = await submitContactForm(validFormData);

      expect(result.success).toBe(false);
      expect(result.error).toBe('rate_limited');
      expect(mockVerifyRecaptcha).not.toHaveBeenCalled();
      expect(mockSendContactEmail).not.toHaveBeenCalled();
    });
  });

  describe('recaptcha validation', () => {
    it('rejects when recaptcha fails', async () => {
      mockVerifyRecaptcha.mockResolvedValue(false);

      const result = await submitContactForm(validFormData);

      expect(result.success).toBe(false);
      expect(result.error).toBe('recaptcha_failed');
      expect(mockSendContactEmail).not.toHaveBeenCalled();
    });

    it('rejects when recaptcha token is missing', async () => {
      const noTokenData = { ...validFormData, recaptchaToken: '' };

      const result = await submitContactForm(noTokenData);

      expect(result.success).toBe(false);
      expect(result.error).toBe('recaptcha_failed');
    });
  });

  describe('form validation', () => {
    it('rejects invalid name', async () => {
      const invalidData = { ...validFormData, name: 'J' };

      const result = await submitContactForm(invalidData);

      expect(result.success).toBe(false);
      expect(result.error).toBe('validation_error');
      expect(result.fieldErrors).toBeDefined();
    });

    it('rejects invalid email', async () => {
      const invalidData = { ...validFormData, email: 'not-an-email' };

      const result = await submitContactForm(invalidData);

      expect(result.success).toBe(false);
      expect(result.error).toBe('validation_error');
    });

    it('rejects short message', async () => {
      const invalidData = { ...validFormData, message: 'Hi' };

      const result = await submitContactForm(invalidData);

      expect(result.success).toBe(false);
      expect(result.error).toBe('validation_error');
    });
  });

  describe('email sending', () => {
    it('returns error when email sending fails', async () => {
      mockSendContactEmail.mockResolvedValue({
        success: false,
        error: 'SMTP error',
      });

      const result = await submitContactForm(validFormData);

      expect(result.success).toBe(false);
      expect(result.error).toBe('email_error');
    });
  });

  describe('execution order', () => {
    it('validates in correct order: honeypot -> rate limit -> recaptcha -> form -> email', async () => {
      const callOrder: string[] = [];

      mockCheckRateLimit.mockImplementation(async () => {
        callOrder.push('rate_limit');
        return { allowed: true, remaining: 4 };
      });

      mockVerifyRecaptcha.mockImplementation(async () => {
        callOrder.push('recaptcha');
        return true;
      });

      mockSendContactEmail.mockImplementation(async () => {
        callOrder.push('email');
        return { success: true };
      });

      await submitContactForm(validFormData);

      expect(callOrder).toEqual(['rate_limit', 'recaptcha', 'email']);
    });
  });
});
