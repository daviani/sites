/* eslint-env jest */
import { verifyRecaptcha } from '@/lib/recaptcha';

// Mock fetch globally
const mockFetch = jest.fn();
global.fetch = mockFetch;

describe('ReCaptcha Verifier', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...originalEnv, RECAPTCHA_SECRET_KEY: 'test-secret-key' };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('verifyRecaptcha', () => {
    it('returns true for valid token with high score', async () => {
      mockFetch.mockResolvedValue({
        json: () => Promise.resolve({ success: true, score: 0.9 }),
      });

      const result = await verifyRecaptcha('valid-token');

      expect(result).toBe(true);
      expect(mockFetch).toHaveBeenCalledWith(
        'https://www.google.com/recaptcha/api/siteverify',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        })
      );
    });

    it('returns true for score exactly at threshold (0.5)', async () => {
      mockFetch.mockResolvedValue({
        json: () => Promise.resolve({ success: true, score: 0.5 }),
      });

      const result = await verifyRecaptcha('valid-token');

      expect(result).toBe(true);
    });

    it('returns false for score below threshold', async () => {
      mockFetch.mockResolvedValue({
        json: () => Promise.resolve({ success: true, score: 0.3 }),
      });

      const result = await verifyRecaptcha('low-score-token');

      expect(result).toBe(false);
    });

    it('returns false when success is false', async () => {
      mockFetch.mockResolvedValue({
        json: () =>
          Promise.resolve({
            success: false,
            'error-codes': ['invalid-input-response'],
          }),
      });

      const result = await verifyRecaptcha('invalid-token');

      expect(result).toBe(false);
    });

    it('returns false when secret key is not configured', async () => {
      delete process.env.RECAPTCHA_SECRET_KEY;

      const result = await verifyRecaptcha('any-token');

      expect(result).toBe(false);
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it('returns false when fetch throws an error', async () => {
      mockFetch.mockRejectedValue(new Error('Network error'));

      const result = await verifyRecaptcha('any-token');

      expect(result).toBe(false);
    });

    it('sends correct form data to Google API', async () => {
      mockFetch.mockResolvedValue({
        json: () => Promise.resolve({ success: true, score: 0.9 }),
      });

      await verifyRecaptcha('my-recaptcha-token');

      const callArgs = mockFetch.mock.calls[0];
      const body = callArgs[1].body as URLSearchParams;

      expect(body.get('secret')).toBe('test-secret-key');
      expect(body.get('response')).toBe('my-recaptcha-token');
    });

    it('handles response without score (v2 compatibility)', async () => {
      mockFetch.mockResolvedValue({
        json: () => Promise.resolve({ success: true }),
      });

      const result = await verifyRecaptcha('v2-token');

      expect(result).toBe(true);
    });
  });
});
