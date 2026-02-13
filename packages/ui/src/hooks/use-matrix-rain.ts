'use client';

import { useEffect, useRef, useCallback } from 'react';
import { NORD_14 } from '../constants/nord-colors';

interface UseMatrixRainOptions {
  isActive: boolean;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  fontSize?: number;
  color?: string;
}

// Characters to use in the matrix rain (mix of katakana and latin)
const MATRIX_CHARS =
  'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

export function useMatrixRain({
  isActive,
  canvasRef,
  fontSize = 14,
  color = NORD_14,
}: UseMatrixRainOptions) {
  const animationRef = useRef<number | null>(null);
  const dropsRef = useRef<number[]>([]);

  const draw = useCallback(
    (ctx: CanvasRenderingContext2D, width: number, height: number) => {
      // Semi-transparent black to create fade effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = color;
      ctx.font = `${fontSize}px monospace`;

      const columns = Math.floor(width / fontSize);

      // Initialize drops if needed
      if (dropsRef.current.length !== columns) {
        dropsRef.current = Array(columns)
          .fill(0)
          .map(() => Math.random() * -100);
      }

      for (let i = 0; i < dropsRef.current.length; i++) {
        const char = MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)];
        const x = i * fontSize;
        const y = dropsRef.current[i] * fontSize;

        ctx.fillText(char, x, y);

        // Reset drop to top with random delay when it reaches bottom
        if (y > height && Math.random() > 0.975) {
          dropsRef.current[i] = 0;
        }

        dropsRef.current[i]++;
      }
    },
    [fontSize, color]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isActive) {
      // Clear drops when deactivated
      dropsRef.current = [];
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      // Reset drops on resize
      dropsRef.current = [];
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Fill with black initially
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const animate = () => {
      draw(ctx, canvas.width, canvas.height);
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isActive, canvasRef, draw]);
}