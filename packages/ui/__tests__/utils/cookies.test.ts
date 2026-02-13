import { describe, it, expect } from 'vitest';
import { getCookieDomain } from '../../src/utils/cookies';

describe('getCookieDomain', () => {
  it('always returns empty string (no cross-subdomain sharing needed)', () => {
    expect(getCookieDomain()).toBe('');
  });
});
