import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useConsoleMessage } from '../../src/hooks/use-console-message';

describe('useConsoleMessage', () => {
  const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

  beforeEach(() => {
    consoleSpy.mockClear();
    Object.defineProperty(navigator, 'language', {
      writable: true,
      value: 'fr-FR',
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('logs messages to console when enabled', () => {
    renderHook(() => useConsoleMessage({ enabled: true }));

    // Should have logged multiple messages
    expect(consoleSpy).toHaveBeenCalled();
    expect(consoleSpy.mock.calls.length).toBeGreaterThan(0);
  });

  it('does not log when disabled', () => {
    renderHook(() => useConsoleMessage({ enabled: false }));

    expect(consoleSpy).not.toHaveBeenCalled();
  });

  it('logs messages in French when browser is French', () => {
    Object.defineProperty(navigator, 'language', {
      writable: true,
      value: 'fr-FR',
    });

    renderHook(() => useConsoleMessage({ enabled: true }));

    const allLogs = consoleSpy.mock.calls.flat().join(' ');

    expect(allLogs).toContain('Bienvenue');
  });

  it('logs messages in English when browser is not French', () => {
    Object.defineProperty(navigator, 'language', {
      writable: true,
      value: 'en-US',
    });

    renderHook(() => useConsoleMessage({ enabled: true }));

    const allLogs = consoleSpy.mock.calls.flat().join(' ');

    expect(allLogs).toContain('Welcome');
  });

  it('only logs once on multiple renders', () => {
    const { rerender } = renderHook(() => useConsoleMessage({ enabled: true }));

    const initialCallCount = consoleSpy.mock.calls.length;

    rerender();
    rerender();
    rerender();

    // Call count should not increase
    expect(consoleSpy.mock.calls.length).toBe(initialCallCount);
  });

  it('includes ASCII art in output', () => {
    renderHook(() => useConsoleMessage({ enabled: true }));

    const allLogs = consoleSpy.mock.calls.flat().join(' ');

    // The ASCII art spells out "Daviani" in ASCII characters
    expect(allLogs).toContain('____');
    expect(allLogs).toContain('|  _ \\');
  });

  it('includes email in output', () => {
    renderHook(() => useConsoleMessage({ enabled: true }));

    const allLogs = consoleSpy.mock.calls.flat().join(' ');

    expect(allLogs).toContain('hello@daviani.dev');
  });

  it('includes Konami code hint', () => {
    Object.defineProperty(navigator, 'language', {
      writable: true,
      value: 'en-US',
    });

    renderHook(() => useConsoleMessage({ enabled: true }));

    const allLogs = consoleSpy.mock.calls.flat().join(' ');

    expect(allLogs).toContain('Konami');
  });

  it('uses styled console.log calls', () => {
    renderHook(() => useConsoleMessage({ enabled: true }));

    // Check that some calls include CSS styling
    const hasStyledCalls = consoleSpy.mock.calls.some(
      (call) => call.length > 1 && typeof call[1] === 'string' && call[1].includes('color:')
    );

    expect(hasStyledCalls).toBe(true);
  });

  it('defaults to enabled when no options provided', () => {
    renderHook(() => useConsoleMessage());

    expect(consoleSpy).toHaveBeenCalled();
  });
});