import { describe, it, expect } from 'vitest';
import manifest from '@/app/manifest';

describe('manifest', () => {
  const m = manifest();

  it('exposes the core PWA fields', () => {
    expect(m.name).toBeTruthy();
    expect(m.short_name).toBe('Daviani.dev');
    expect(m.start_url).toBe('/');
    expect(m.display).toBe('standalone');
  });

  it('declares at least one icon with a src', () => {
    expect(m.icons?.length).toBeGreaterThan(0);
    expect(m.icons?.[0]).toHaveProperty('src');
  });

  it('uses the Kaamos (dark) theme color', () => {
    expect(m.theme_color).toBe('#0B1120');
    expect(m.background_color).toBe('#0B1120');
  });
});
