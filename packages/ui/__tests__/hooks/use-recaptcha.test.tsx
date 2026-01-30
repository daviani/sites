import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useRecaptcha } from '../../src/hooks/use-recaptcha';

describe('useRecaptcha', () => {
  const SITE_KEY = 'test-site-key-123';

  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv('NEXT_PUBLIC_RECAPTCHA_SITE_KEY', SITE_KEY);

    // Reset window.grecaptcha
    (window as Record<string, unknown>).grecaptcha = undefined;

    // Clean up scripts
    document.head.querySelectorAll('script').forEach((s) => s.remove());
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  describe('initial state', () => {
    it('returns isLoaded false initially', () => {
      const { result } = renderHook(() => useRecaptcha());
      expect(result.current.isLoaded).toBe(false);
    });

    it('returns isLoading false initially', () => {
      const { result } = renderHook(() => useRecaptcha());
      expect(result.current.isLoading).toBe(false);
    });

    it('returns execute function', () => {
      const { result } = renderHook(() => useRecaptcha());
      expect(typeof result.current.execute).toBe('function');
    });

    it('returns load function', () => {
      const { result } = renderHook(() => useRecaptcha());
      expect(typeof result.current.load).toBe('function');
    });
  });

  describe('load', () => {
    it('appends recaptcha script to head', async () => {
      const { result } = renderHook(() => useRecaptcha());

      await act(async () => {
        result.current.load();
      });

      const script = document.head.querySelector('script[src*="recaptcha"]');
      expect(script).not.toBeNull();
      expect(script?.getAttribute('src')).toContain(`render=${SITE_KEY}`);
    });

    it('sets script as async and defer', async () => {
      const { result } = renderHook(() => useRecaptcha());

      await act(async () => {
        result.current.load();
      });

      const script = document.head.querySelector('script[src*="recaptcha"]') as HTMLScriptElement;
      expect(script.async).toBe(true);
      expect(script.defer).toBe(true);
    });

    it('does not append duplicate scripts', async () => {
      const { result } = renderHook(() => useRecaptcha());

      await act(async () => {
        result.current.load();
        result.current.load();
      });

      const scripts = document.head.querySelectorAll('script[src*="recaptcha"]');
      expect(scripts.length).toBe(1);
    });

    it('sets isLoaded after script loads', async () => {
      const mockReady = vi.fn((cb: () => void) => cb());
      (window as Record<string, unknown>).grecaptcha = {
        ready: mockReady,
        execute: vi.fn(),
      };

      const { result } = renderHook(() => useRecaptcha());

      await act(async () => {
        result.current.load();
        const script = document.head.querySelector('script[src*="recaptcha"]') as HTMLScriptElement;
        script.onload?.(new Event('load'));
      });

      expect(result.current.isLoaded).toBe(true);
      expect(result.current.isLoading).toBe(false);
    });
  });

  describe('loadOnMount', () => {
    it('auto-loads when loadOnMount is true', async () => {
      renderHook(() => useRecaptcha({ loadOnMount: true }));

      const script = document.head.querySelector('script[src*="recaptcha"]');
      expect(script).not.toBeNull();
    });

    it('does not auto-load when loadOnMount is false', () => {
      renderHook(() => useRecaptcha({ loadOnMount: false }));

      const script = document.head.querySelector('script[src*="recaptcha"]');
      expect(script).toBeNull();
    });

    it('does not auto-load by default', () => {
      renderHook(() => useRecaptcha());

      const script = document.head.querySelector('script[src*="recaptcha"]');
      expect(script).toBeNull();
    });
  });

  describe('execute', () => {
    it('throws when grecaptcha becomes unavailable', async () => {
      // Set up for successful load so loadPromiseRef gets resolved
      const s = document.createElement('script');
      s.src = `https://www.google.com/recaptcha/api.js?render=${SITE_KEY}`;
      document.head.appendChild(s);
      (window as Record<string, unknown>).grecaptcha = {
        ready: vi.fn((cb: () => void) => cb()),
        execute: vi.fn(),
      };

      const { result } = renderHook(() => useRecaptcha());
      // Capture functions before any act() — result.current becomes null after state changes
      const loadFn = result.current.load;
      const executeFn = result.current.execute;

      // Load to populate loadPromiseRef with a resolved promise
      await act(async () => {
        await loadFn();
      });

      // Remove grecaptcha to simulate it becoming unavailable
      (window as Record<string, unknown>).grecaptcha = undefined;

      // execute: stale closure has isLoaded=false, calls load() which returns
      // the existing resolved Promise, then checks window.grecaptcha → throws
      await expect(
        act(async () => {
          await executeFn('submit');
        })
      ).rejects.toThrow('ReCaptcha not loaded');
    });

    it('calls grecaptcha.execute with site key and action', async () => {
      // Pre-load: script in DOM + grecaptcha ready before hook renders
      const existingScript = document.createElement('script');
      existingScript.src = `https://www.google.com/recaptcha/api.js?render=${SITE_KEY}`;
      document.head.appendChild(existingScript);

      const mockExecute = vi.fn().mockResolvedValue('test-token');
      (window as Record<string, unknown>).grecaptcha = {
        ready: vi.fn((cb: () => void) => cb()),
        execute: mockExecute,
      };

      const { result } = renderHook(() => useRecaptcha());

      // Capture the execute function immediately — result.current becomes null after act()
      const executeFn = result.current.execute;

      let token: string | undefined;
      await act(async () => {
        token = await executeFn('submit');
      });

      expect(mockExecute).toHaveBeenCalledWith(SITE_KEY, { action: 'submit' });
      expect(token).toBe('test-token');
    });

    it('propagates execution errors', async () => {
      const existingScript = document.createElement('script');
      existingScript.src = `https://www.google.com/recaptcha/api.js?render=${SITE_KEY}`;
      document.head.appendChild(existingScript);

      const mockExecute = vi.fn().mockRejectedValue(new Error('ReCaptcha failed'));
      (window as Record<string, unknown>).grecaptcha = {
        ready: vi.fn((cb: () => void) => cb()),
        execute: mockExecute,
      };

      const { result } = renderHook(() => useRecaptcha());
      const executeFn = result.current.execute;

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      await expect(
        act(async () => {
          await executeFn('submit');
        })
      ).rejects.toThrow('ReCaptcha failed');

      consoleSpy.mockRestore();
    });
  });

  describe('already loaded script', () => {
    it('does not add duplicate script when one already exists', async () => {
      const existingScript = document.createElement('script');
      existingScript.src = 'https://www.google.com/recaptcha/api.js?render=key';
      document.head.appendChild(existingScript);

      const mockReady = vi.fn((cb: () => void) => cb());
      (window as Record<string, unknown>).grecaptcha = {
        ready: mockReady,
        execute: vi.fn(),
      };

      const { result } = renderHook(() => useRecaptcha());
      const loadFn = result.current.load;

      await act(async () => {
        await loadFn();
      });

      // Should not have added another script
      const scripts = document.head.querySelectorAll('script[src*="recaptcha"]');
      expect(scripts.length).toBe(1);
      expect(mockReady).toHaveBeenCalled();
    });
  });
});