import { describe, it, expect, vi, beforeEach } from 'vitest';
import { checkRateLimit } from '@/lib/rate-limit';

const { mockIncr, mockExpire } = vi.hoisted(() => ({
  mockIncr: vi.fn(),
  mockExpire: vi.fn(),
}));

vi.mock('@vercel/kv', () => ({
  kv: {
    incr: mockIncr,
    expire: mockExpire,
  },
}));

describe('checkRateLimit', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('first request', () => {
    it('allows first request and returns remaining = 4', async () => {
      mockIncr.mockResolvedValue(1);
      mockExpire.mockResolvedValue(true);

      const result = await checkRateLimit('1.2.3.4', 'contact');
      expect(result).toEqual({ allowed: true, remaining: 4 });
    });

    it('sets expiry on first request', async () => {
      mockIncr.mockResolvedValue(1);
      mockExpire.mockResolvedValue(true);

      await checkRateLimit('1.2.3.4', 'contact');
      expect(mockExpire).toHaveBeenCalledWith('rate-limit:contact:1.2.3.4', 60);
    });
  });

  describe('within limit', () => {
    it('allows requests up to MAX_REQUESTS (5)', async () => {
      mockIncr.mockResolvedValue(5);

      const result = await checkRateLimit('1.2.3.4', 'contact');
      expect(result).toEqual({ allowed: true, remaining: 0 });
    });

    it('returns correct remaining count', async () => {
      mockIncr.mockResolvedValue(3);

      const result = await checkRateLimit('1.2.3.4', 'contact');
      expect(result).toEqual({ allowed: true, remaining: 2 });
    });

    it('does not set expiry for subsequent requests', async () => {
      mockIncr.mockResolvedValue(2);

      await checkRateLimit('1.2.3.4', 'contact');
      expect(mockExpire).not.toHaveBeenCalled();
    });
  });

  describe('over limit', () => {
    it('blocks request when over MAX_REQUESTS', async () => {
      mockIncr.mockResolvedValue(6);

      const result = await checkRateLimit('1.2.3.4', 'contact');
      expect(result.allowed).toBe(false);
    });

    it('returns remaining = 0 when over limit', async () => {
      mockIncr.mockResolvedValue(10);

      const result = await checkRateLimit('1.2.3.4', 'contact');
      expect(result.remaining).toBe(0);
    });
  });

  describe('key format', () => {
    it('constructs key as rate-limit:{action}:{ip}', async () => {
      mockIncr.mockResolvedValue(1);
      mockExpire.mockResolvedValue(true);

      await checkRateLimit('1.2.3.4', 'contact');
      expect(mockIncr).toHaveBeenCalledWith('rate-limit:contact:1.2.3.4');
    });
  });

  describe('error handling', () => {
    it('blocks request when KV is unavailable (fail closed)', async () => {
      mockIncr.mockRejectedValue(new Error('KV unavailable'));

      const result = await checkRateLimit('1.2.3.4', 'contact');
      expect(result).toEqual({ allowed: false, remaining: 0 });
    });

    it('logs error when KV fails', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      mockIncr.mockRejectedValue(new Error('KV unavailable'));

      await checkRateLimit('1.2.3.4', 'contact');
      expect(consoleSpy).toHaveBeenCalledWith(
        'Rate limit check failed:',
        expect.any(Error)
      );
      consoleSpy.mockRestore();
    });
  });
});
