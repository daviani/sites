'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { NORD_AURORA } from '../constants/nord-colors';

interface ConfettiPiece {
  id: number;
  x: number;
  color: string;
  delay: number;
  duration: number;
  size: number;
}

interface ConfettiProps {
  isActive: boolean;
  duration?: number;
  pieceCount?: number;
  onComplete?: () => void;
}

export function Confetti({
  isActive,
  duration = 3000,
  pieceCount = 100,
  onComplete,
}: ConfettiProps) {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);

  const generatePieces = useCallback(() => {
    return Array.from({ length: pieceCount }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      color: NORD_AURORA[Math.floor(Math.random() * NORD_AURORA.length)],
      delay: Math.random() * 0.5,
      duration: 2 + Math.random() * 2,
      size: 6 + Math.random() * 8,
    }));
  }, [pieceCount]);

  useEffect(() => {
    if (isActive) {
      setPieces(generatePieces());

      const timer = setTimeout(() => {
        setPieces([]);
        onComplete?.();
      }, duration);

      return () => clearTimeout(timer);
    } else {
      setPieces([]);
    }
  }, [isActive, duration, generatePieces, onComplete]);

  const styles = useMemo(
    () => `
    @keyframes confetti-fall {
      0% {
        top: -10%;
        opacity: 1;
      }
      100% {
        top: 110%;
        opacity: 0;
      }
    }
    @keyframes confetti-shake {
      0%, 100% {
        transform: translateX(0) rotate(0deg);
      }
      25% {
        transform: translateX(-15px) rotate(180deg);
      }
      50% {
        transform: translateX(0) rotate(360deg);
      }
      75% {
        transform: translateX(15px) rotate(540deg);
      }
    }
  `,
    []
  );

  if (pieces.length === 0) return null;

  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 9999 }}
      aria-hidden="true"
    >
      <style>{styles}</style>
      {pieces.map((piece) => (
        <div
          key={piece.id}
          style={{
            position: 'absolute',
            left: `${piece.x}%`,
            top: '-10%',
            width: piece.size,
            height: piece.size,
            backgroundColor: piece.color,
            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
            animation: `confetti-fall ${piece.duration}s ease-out ${piece.delay}s forwards, confetti-shake ${piece.duration}s linear ${piece.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}