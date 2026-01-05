/* eslint-env jest */
import { checkRateLimit } from '@/lib/rate-limit';

// Mock @vercel/kv
jest.mock('@vercel/kv', () => ({
  kv: {
    incr: jest.fn(),
    expire: jest.fn(),
  },
}));

import { kv } from '@vercel/kv';

const mockKv = kv as jest.Mocked<typeof kv>;

describe('Rate Limiter', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('checkRateLimit', () => {
    it('allows first request and sets expiry', async () => {
      mockKv.incr.mockResolvedValue(1);
      mockKv.expire.mockResolvedValue(1);

      const result = await checkRateLimit('192.168.1.1', 'contact');

      expect(result.allowed).toBe(true);
      expect(result.remaining).toBe(4);
      expect(mockKv.incr).toHaveBeenCalledWith('rate-limit:contact:192.168.1.1');
      expect(mockKv.expire).toHaveBeenCalledWith(
        'rate-limit:contact:192.168.1.1',
        60
      );
    });

    it('allows requests within limit', async () => {
      mockKv.incr.mockResolvedValue(3);

      const result = await checkRateLimit('192.168.1.1', 'contact');

      expect(result.allowed).toBe(true);
      expect(result.remaining).toBe(2);
      expect(mockKv.expire).not.toHaveBeenCalled();
    });

    it('allows the 5th request (at limit)', async () => {
      mockKv.incr.mockResolvedValue(5);

      const result = await checkRateLimit('192.168.1.1', 'contact');

      expect(result.allowed).toBe(true);
      expect(result.remaining).toBe(0);
    });

    it('blocks the 6th request (over limit)', async () => {
      mockKv.incr.mockResolvedValue(6);

      const result = await checkRateLimit('192.168.1.1', 'contact');

      expect(result.allowed).toBe(false);
      expect(result.remaining).toBe(0);
    });

    it('uses different keys for different actions', async () => {
      mockKv.incr.mockResolvedValue(1);
      mockKv.expire.mockResolvedValue(1);

      await checkRateLimit('192.168.1.1', 'login');

      expect(mockKv.incr).toHaveBeenCalledWith('rate-limit:login:192.168.1.1');
    });

    it('uses different keys for different IPs', async () => {
      mockKv.incr.mockResolvedValue(1);
      mockKv.expire.mockResolvedValue(1);

      await checkRateLimit('10.0.0.1', 'contact');

      expect(mockKv.incr).toHaveBeenCalledWith('rate-limit:contact:10.0.0.1');
    });

    it('fails closed when KV throws an error (security-first)', async () => {
      mockKv.incr.mockRejectedValue(new Error('KV connection failed'));

      const result = await checkRateLimit('192.168.1.1', 'contact');

      expect(result.allowed).toBe(false);
      expect(result.remaining).toBe(0);
    });
  });
});
