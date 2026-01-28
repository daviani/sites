import { describe, it, expect, vi, beforeEach } from 'vitest';

const { mockSend } = vi.hoisted(() => ({
  mockSend: vi.fn(),
}));

vi.mock('resend', () => {
  return {
    Resend: class MockResend {
      emails = { send: mockSend };
    },
  };
});

import { sendContactEmail } from '@/lib/email';

const validParams = {
  name: 'John Doe',
  email: 'john@example.com',
  message: 'Hello, this is a test message for you.',
};

describe('sendContactEmail', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv('EMAIL_FROM', 'noreply@daviani.dev');
    vi.stubEnv('EMAIL_TO', 'contact@daviani.dev');
    vi.stubEnv('RESEND_API_KEY', 'test-api-key');
  });

  describe('missing configuration', () => {
    it('returns error when EMAIL_FROM is not set', async () => {
      vi.stubEnv('EMAIL_FROM', '');

      const result = await sendContactEmail(validParams);
      expect(result).toEqual({ success: false, error: 'Email configuration error' });
    });

    it('returns error when EMAIL_TO is not set', async () => {
      vi.stubEnv('EMAIL_TO', '');

      const result = await sendContactEmail(validParams);
      expect(result).toEqual({ success: false, error: 'Email configuration error' });
    });

    it('logs error when config is missing', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      vi.stubEnv('EMAIL_FROM', '');

      await sendContactEmail(validParams);
      expect(consoleSpy).toHaveBeenCalledWith('EMAIL_FROM or EMAIL_TO is not configured');
      consoleSpy.mockRestore();
    });
  });

  describe('successful send', () => {
    it('returns success true when email sends', async () => {
      mockSend.mockResolvedValue({ error: null });

      const result = await sendContactEmail(validParams);
      expect(result).toEqual({ success: true });
    });

    it('calls Resend with correct from, to, replyTo, subject', async () => {
      mockSend.mockResolvedValue({ error: null });

      await sendContactEmail(validParams);
      expect(mockSend).toHaveBeenCalledWith(
        expect.objectContaining({
          from: 'noreply@daviani.dev',
          to: 'contact@daviani.dev',
          replyTo: 'john@example.com',
          subject: '[Contact daviani.dev] Message de John Doe',
        })
      );
    });

    it('generates HTML with escaped content', async () => {
      mockSend.mockResolvedValue({ error: null });

      await sendContactEmail({
        name: '<script>alert("xss")</script>',
        email: 'test@example.com',
        message: 'Safe message',
      });

      const html = mockSend.mock.calls[0][0].html;
      expect(html).toContain('&lt;script&gt;');
      expect(html).not.toContain('<script>alert');
    });
  });

  describe('Resend API errors', () => {
    it('returns error when Resend returns an error', async () => {
      mockSend.mockResolvedValue({ error: { message: 'API rate limit exceeded' } });

      const result = await sendContactEmail(validParams);
      expect(result).toEqual({ success: false, error: 'API rate limit exceeded' });
    });

    it('logs Resend error', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const apiError = { message: 'API rate limit exceeded' };
      mockSend.mockResolvedValue({ error: apiError });

      await sendContactEmail(validParams);
      expect(consoleSpy).toHaveBeenCalledWith('Resend error:', apiError);
      consoleSpy.mockRestore();
    });
  });

  describe('unexpected errors', () => {
    it('returns error when send throws an exception', async () => {
      mockSend.mockRejectedValue(new Error('Network failure'));

      const result = await sendContactEmail(validParams);
      expect(result).toEqual({ success: false, error: 'Network failure' });
    });

    it('handles non-Error thrown values', async () => {
      mockSend.mockRejectedValue('string error');

      const result = await sendContactEmail(validParams);
      expect(result).toEqual({ success: false, error: 'Unknown error' });
    });
  });

  describe('escapeHtml — indirect', () => {
    beforeEach(() => {
      mockSend.mockResolvedValue({ error: null });
    });

    it('escapes & character', async () => {
      await sendContactEmail({ ...validParams, name: 'Tom & Jerry' });
      const html = mockSend.mock.calls[0][0].html;
      expect(html).toContain('Tom &amp; Jerry');
    });

    it('escapes < and > characters', async () => {
      await sendContactEmail({ ...validParams, name: '<b>bold</b>' });
      const html = mockSend.mock.calls[0][0].html;
      expect(html).toContain('&lt;b&gt;bold&lt;/b&gt;');
    });

    it('escapes double quotes', async () => {
      await sendContactEmail({ ...validParams, message: 'He said "hello" today.' });
      const html = mockSend.mock.calls[0][0].html;
      expect(html).toContain('&quot;hello&quot;');
    });

    it('escapes single quotes', async () => {
      await sendContactEmail({ ...validParams, message: "it's a test message" });
      const html = mockSend.mock.calls[0][0].html;
      expect(html).toContain('it&#039;s a test message');
    });
  });
});
