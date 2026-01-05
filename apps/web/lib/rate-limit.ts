import { kv } from '@vercel/kv';

const RATE_LIMIT_WINDOW = 60; // 60 seconds
const MAX_REQUESTS = 5;

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
}

export async function checkRateLimit(
  ip: string,
  action: string
): Promise<RateLimitResult> {
  const key = `rate-limit:${action}:${ip}`;

  try {
    const current = await kv.incr(key);

    if (current === 1) {
      await kv.expire(key, RATE_LIMIT_WINDOW);
    }

    const remaining = Math.max(0, MAX_REQUESTS - current);
    const allowed = current <= MAX_REQUESTS;

    return { allowed, remaining };
  } catch (error) {
    console.error('Rate limit check failed:', error);
    // Fail closed - block requests if KV is unavailable (security-first approach)
    return { allowed: false, remaining: 0 };
  }
}
