/* eslint-env jest */
/* eslint-disable @typescript-eslint/no-explicit-any */

// Mock resend at the top level
const mockSend = jest.fn();

jest.mock('resend', () => ({
  Resend: jest.fn().mockImplementation(() => ({
    emails: {
      send: mockSend,
    },
  })),
}));

describe('Email Sender', () => {
  const originalEnv = process.env;
  let sendContactEmail: typeof import('@/lib/email').sendContactEmail;

  beforeEach(async () => {
    jest.clearAllMocks();
    jest.resetModules();

    process.env = {
      ...originalEnv,
      RESEND_API_KEY: 'test-api-key',
      EMAIL_FROM: 'noreply@daviani.dev',
      EMAIL_TO: 'hello@daviani.dev',
    };

    // Re-import the module to get fresh instance
    const emailModule = await import('@/lib/email');
    sendContactEmail = emailModule.sendContactEmail;
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('sendContactEmail', () => {
    const validParams = {
      name: 'John Doe',
      email: 'john@example.com',
      message: 'Hello, this is a test message.',
    };

    it('sends email successfully', async () => {
      mockSend.mockResolvedValue({ data: { id: 'msg-123' }, error: null });

      const result = await sendContactEmail(validParams);

      expect(result.success).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('calls Resend with correct parameters', async () => {
      mockSend.mockResolvedValue({ data: { id: 'msg-123' }, error: null });

      await sendContactEmail(validParams);

      expect(mockSend).toHaveBeenCalledWith(
        expect.objectContaining({
          from: 'noreply@daviani.dev',
          to: 'hello@daviani.dev',
          replyTo: 'john@example.com',
          subject: '[Contact daviani.dev] Message de John Doe',
        })
      );
    });

    it('includes HTML template with escaped content', async () => {
      mockSend.mockResolvedValue({ data: { id: 'msg-123' }, error: null });

      await sendContactEmail({
        name: '<script>alert("xss")</script>',
        email: 'test@example.com',
        message: 'Message with <b>HTML</b>',
      });

      const callArgs = mockSend.mock.calls[0][0];
      expect(callArgs.html).toContain('&lt;script&gt;');
      expect(callArgs.html).toContain('&lt;b&gt;HTML&lt;/b&gt;');
      expect(callArgs.html).not.toContain('<script>');
    });

    it('returns error when Resend returns an error', async () => {
      mockSend.mockResolvedValue({
        data: null,
        error: { message: 'Invalid API key' },
      });

      const result = await sendContactEmail(validParams);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Invalid API key');
    });

    it('returns error when EMAIL_FROM is not configured', async () => {
      delete process.env.EMAIL_FROM;

      const result = await sendContactEmail(validParams);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Email configuration error');
      expect(mockSend).not.toHaveBeenCalled();
    });

    it('returns error when EMAIL_TO is not configured', async () => {
      delete process.env.EMAIL_TO;

      const result = await sendContactEmail(validParams);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Email configuration error');
    });

    it('handles Resend throwing an exception', async () => {
      mockSend.mockRejectedValue(new Error('Network error'));

      const result = await sendContactEmail(validParams);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Network error');
    });

    it('handles non-Error exceptions', async () => {
      mockSend.mockRejectedValue('String error');

      const result = await sendContactEmail(validParams);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Unknown error');
    });
  });
});
