import path from 'node:path';
import sharp from 'sharp';

const PUBLIC_DIR = path.join(process.cwd(), 'public');
const cache = new Map<string, { width: number; height: number }>();

/**
 * Read a /public image's intrinsic pixel dimensions, so next/image can reserve
 * layout space (no CLS) for sources whose size isn't known at author time.
 * Server-only (uses fs + sharp). Cached per build. Returns null if unreadable.
 */
export async function imageDimensions(
  src: string
): Promise<{ width: number; height: number } | null> {
  const cached = cache.get(src);
  if (cached) return cached;
  try {
    const filePath = path.join(PUBLIC_DIR, src.replace(/^\//, ''));
    const { width, height } = await sharp(filePath).metadata();
    if (!width || !height) return null;
    const dims = { width, height };
    cache.set(src, dims);
    return dims;
  } catch {
    return null;
  }
}
