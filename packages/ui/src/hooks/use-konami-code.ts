'use client';

import { useEffect, useCallback, useRef } from 'react';

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

interface UseKonamiCodeOptions {
  onActivate: () => void;
  enabled?: boolean;
}

export function useKonamiCode({ onActivate, enabled = true }: UseKonamiCodeOptions): void {
  const inputSequence = useRef<string[]>([]);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const resetSequence = useCallback(() => {
    inputSequence.current = [];
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      // Clear previous timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Add key to sequence
      inputSequence.current.push(event.code);

      // Keep only the last N keys (where N is the length of the Konami code)
      if (inputSequence.current.length > KONAMI_CODE.length) {
        inputSequence.current.shift();
      }

      // Check if sequence matches
      const isMatch =
        inputSequence.current.length === KONAMI_CODE.length &&
        inputSequence.current.every((key, index) => key === KONAMI_CODE[index]);

      if (isMatch) {
        onActivate();
        resetSequence();
      }

      // Reset sequence after 2 seconds of inactivity
      timeoutRef.current = setTimeout(resetSequence, 2000);
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [enabled, onActivate, resetSequence]);
}