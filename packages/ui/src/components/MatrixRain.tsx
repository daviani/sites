'use client';

import { useRef, useEffect, useCallback } from 'react';
import { useMatrixRain } from '../hooks/use-matrix-rain';

interface MatrixRainProps {
  isActive: boolean;
  onClose?: () => void;
  duration?: number;
  closeHint?: string;
}

export function MatrixRain({ isActive, onClose, duration = 10000, closeHint = 'Click or press Escape to close' }: MatrixRainProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useMatrixRain({
    isActive,
    canvasRef,
  });

  const handleClose = useCallback(() => {
    onClose?.();
  }, [onClose]);

  // Auto-close after duration
  useEffect(() => {
    if (!isActive || !duration) return;

    const timer = setTimeout(handleClose, duration);
    return () => clearTimeout(timer);
  }, [isActive, duration, handleClose]);

  // Close on Escape key
  useEffect(() => {
    if (!isActive) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isActive, handleClose]);

  if (!isActive) return null;

  return (
    <div
      className="fixed inset-0"
      style={{ zIndex: 9998 }}
      onClick={handleClose}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleClose()}
      aria-label={closeHint}
    >
      <canvas ref={canvasRef} className="w-full h-full" />
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-green-400 font-mono text-sm animate-pulse">
        {closeHint}
      </div>
    </div>
  );
}