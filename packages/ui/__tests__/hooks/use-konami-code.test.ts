import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useKonamiCode } from '../../src/hooks/use-konami-code';

describe('useKonamiCode', () => {
  const KONAMI_CODE = [
    'ArrowUp',
    'ArrowUp',
    'ArrowDown',
    'ArrowDown',
    'ArrowLeft',
    'ArrowRight',
    'ArrowLeft',
    'ArrowRight',
  ];

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  function dispatchKeyDown(code: string) {
    const event = new KeyboardEvent('keydown', { code });
    window.dispatchEvent(event);
  }

  it('calls onActivate when Konami code is entered', () => {
    const onActivate = vi.fn();

    renderHook(() => useKonamiCode({ onActivate }));

    // Enter Konami code
    for (const key of KONAMI_CODE) {
      dispatchKeyDown(key);
    }

    expect(onActivate).toHaveBeenCalledTimes(1);
  });

  it('does not call onActivate with incorrect sequence', () => {
    const onActivate = vi.fn();

    renderHook(() => useKonamiCode({ onActivate }));

    // Enter wrong sequence
    dispatchKeyDown('ArrowUp');
    dispatchKeyDown('ArrowDown');
    dispatchKeyDown('ArrowLeft');
    dispatchKeyDown('ArrowRight');

    expect(onActivate).not.toHaveBeenCalled();
  });

  it('does not call onActivate with partial sequence', () => {
    const onActivate = vi.fn();

    renderHook(() => useKonamiCode({ onActivate }));

    // Enter partial sequence
    dispatchKeyDown('ArrowUp');
    dispatchKeyDown('ArrowUp');
    dispatchKeyDown('ArrowDown');
    dispatchKeyDown('ArrowDown');

    expect(onActivate).not.toHaveBeenCalled();
  });

  it('resets sequence after timeout', () => {
    const onActivate = vi.fn();

    renderHook(() => useKonamiCode({ onActivate }));

    // Enter partial sequence
    dispatchKeyDown('ArrowUp');
    dispatchKeyDown('ArrowUp');
    dispatchKeyDown('ArrowDown');
    dispatchKeyDown('ArrowDown');

    // Wait for timeout (2 seconds)
    vi.advanceTimersByTime(2500);

    // Continue with remaining keys (should not complete code)
    dispatchKeyDown('ArrowLeft');
    dispatchKeyDown('ArrowRight');
    dispatchKeyDown('ArrowLeft');
    dispatchKeyDown('ArrowRight');

    expect(onActivate).not.toHaveBeenCalled();
  });

  it('does not listen when disabled', () => {
    const onActivate = vi.fn();

    renderHook(() => useKonamiCode({ onActivate, enabled: false }));

    // Enter Konami code
    for (const key of KONAMI_CODE) {
      dispatchKeyDown(key);
    }

    expect(onActivate).not.toHaveBeenCalled();
  });

  it('can be activated multiple times', () => {
    const onActivate = vi.fn();

    renderHook(() => useKonamiCode({ onActivate }));

    // Enter Konami code first time
    for (const key of KONAMI_CODE) {
      dispatchKeyDown(key);
    }

    expect(onActivate).toHaveBeenCalledTimes(1);

    // Enter Konami code second time
    for (const key of KONAMI_CODE) {
      dispatchKeyDown(key);
    }

    expect(onActivate).toHaveBeenCalledTimes(2);
  });

  it('ignores extra keys in the middle', () => {
    const onActivate = vi.fn();

    renderHook(() => useKonamiCode({ onActivate }));

    // Enter Konami code with extra key
    dispatchKeyDown('ArrowUp');
    dispatchKeyDown('ArrowUp');
    dispatchKeyDown('KeyA'); // Extra key
    dispatchKeyDown('ArrowDown');
    dispatchKeyDown('ArrowDown');
    dispatchKeyDown('ArrowLeft');
    dispatchKeyDown('ArrowRight');
    dispatchKeyDown('ArrowLeft');
    dispatchKeyDown('ArrowRight');

    expect(onActivate).not.toHaveBeenCalled();
  });

  it('only keeps last N keys in sequence', () => {
    const onActivate = vi.fn();

    renderHook(() => useKonamiCode({ onActivate }));

    // Enter many wrong keys first
    for (let i = 0; i < 20; i++) {
      dispatchKeyDown('KeyA');
    }

    // Then enter correct Konami code
    for (const key of KONAMI_CODE) {
      dispatchKeyDown(key);
    }

    expect(onActivate).toHaveBeenCalledTimes(1);
  });

  it('cleans up event listener on unmount', () => {
    const onActivate = vi.fn();
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');

    const { unmount } = renderHook(() => useKonamiCode({ onActivate }));

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      'keydown',
      expect.any(Function)
    );
  });
});