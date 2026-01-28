import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

import { verifyRecaptcha } from '@/lib/recaptcha';

function mockFetchResponse(data: Record<string, unknown>) {
  mockFetch.mockResolvedValue({
    json: async () => data,
  });
}

describe('verifyRecaptcha', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv('RECAPTCHA_SECRET_KEY', 'test-secret-key');
  });

  describe('missing secret key', () => {
    it('returns false when RECAPTCHA_SECRET_KEY is not set', async () => {
      vi.stubEnv('RECAPTCHA_SECRET_KEY', '');

      const result = await verifyRecaptcha('some-token');
      expect(result).toBe(false);
    });

    it('logs error when secret key is missing', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      vi.stubEnv('RECAPTCHA_SECRET_KEY', '');

      await verifyRecaptcha('some-token');
      expect(consoleSpy).toHaveBeenCalledWith('RECAPTCHA_SECRET_KEY is not configured');
      consoleSpy.mockRestore();
    });
  });

  describe('successful verification', () => {
    it('returns true when response is success with high score', async () => {
      mockFetchResponse({ success: true, score: 0.9 });

      const result = await verifyRecaptcha('valid-token');
      expect(result).toBe(true);
    });

    it('returns true when response is success with no score (v2)', async () => {
      mockFetchResponse({ success: true });

      const result = await verifyRecaptcha('valid-token');
      expect(result).toBe(true);
    });

    it('returns true when score exactly equals threshold (0.5)', async () => {
      mockFetchResponse({ success: true, score: 0.5 });

      const result = await verifyRecaptcha('valid-token');
      expect(result).toBe(true);
    });
  });

  describe('failed verification', () => {
    it('returns false when response success is false', async () => {
      mockFetchResponse({ success: false, 'error-codes': ['invalid-input-response'] });

      const result = await verifyRecaptcha('invalid-token');
      expect(result).toBe(false);
    });

    it('returns false when score is below threshold', async () => {
      mockFetchResponse({ success: true, score: 0.3 });

      const result = await verifyRecaptcha('low-score-token');
      expect(result).toBe(false);
    });
  });

  describe('network errors', () => {
    it('returns false when fetch throws', async () => {
      mockFetch.mockRejectedValue(new Error('Network error'));

      const result = await verifyRecaptcha('token');
      expect(result).toBe(false);
    });

    it('logs error when fetch fails', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      mockFetch.mockRejectedValue(new Error('Network error'));

      await verifyRecaptcha('token');
      expect(consoleSpy).toHaveBeenCalledWith(
        'ReCaptcha verification error:',
        expect.any(Error)
      );
      consoleSpy.mockRestore();
    });
  });

  describe('request format', () => {
    it('sends POST to correct Google URL', async () => {
      mockFetchResponse({ success: true, score: 0.9 });

      await verifyRecaptcha('test-token');
      expect(mockFetch).toHaveBeenCalledWith(
        'https://www.google.com/recaptcha/api/siteverify',
        expect.objectContaining({ method: 'POST' })
      );
    });

    it('sends form-encoded body with secret and token', async () => {
      mockFetchResponse({ success: true, score: 0.9 });

      await verifyRecaptcha('test-token');
      const callArgs = mockFetch.mock.calls[0];
      const body = callArgs[1].body as URLSearchParams;
      expect(body.get('secret')).toBe('test-secret-key');
      expect(body.get('response')).toBe('test-token');
    });
  });
});
