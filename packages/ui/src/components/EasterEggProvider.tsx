'use client';

import { createContext, useContext, useState, useCallback, ReactNode, useMemo } from 'react';
import { useKonamiCode } from '../hooks/use-konami-code';
import { useConsoleMessage } from '../hooks/use-console-message';
import { Confetti } from './Confetti';
import { MatrixRain } from './MatrixRain';

interface EasterEggContextType {
  triggerConfetti: () => void;
  triggerMatrix: () => void;
  isConfettiActive: boolean;
  isMatrixActive: boolean;
}

const EasterEggContext = createContext<EasterEggContextType | null>(null);

interface EasterEggProviderProps {
  children: ReactNode;
  enabled?: boolean;
}

export function EasterEggProvider({ children, enabled = true }: EasterEggProviderProps) {
  const [isConfettiActive, setIsConfettiActive] = useState(false);
  const [isMatrixActive, setIsMatrixActive] = useState(false);
  const [konamiCount, setKonamiCount] = useState(0);

  // Console message on first load
  useConsoleMessage({ enabled });

  // Trigger confetti effect
  const triggerConfetti = useCallback(() => {
    setIsConfettiActive(true);
  }, []);

  // Trigger matrix effect
  const triggerMatrix = useCallback(() => {
    setIsMatrixActive(true);
  }, []);

  // Handle Konami code activation
  // First time: confetti, second time: matrix
  const handleKonamiActivate = useCallback(() => {
    const newCount = konamiCount + 1;
    setKonamiCount(newCount);

    if (newCount % 2 === 1) {
      // Odd count: trigger confetti
      triggerConfetti();
    } else {
      // Even count: trigger matrix
      triggerMatrix();
    }
  }, [konamiCount, triggerConfetti, triggerMatrix]);

  // Listen for Konami code
  useKonamiCode({
    onActivate: handleKonamiActivate,
    enabled,
  });

  // Handle confetti completion
  const handleConfettiComplete = useCallback(() => {
    setIsConfettiActive(false);
  }, []);

  // Handle matrix close
  const handleMatrixClose = useCallback(() => {
    setIsMatrixActive(false);
  }, []);

  const value = useMemo(
    () => ({
      triggerConfetti,
      triggerMatrix,
      isConfettiActive,
      isMatrixActive,
    }),
    [triggerConfetti, triggerMatrix, isConfettiActive, isMatrixActive]
  );

  return (
    <EasterEggContext.Provider value={value}>
      {children}
      <Confetti isActive={isConfettiActive} onComplete={handleConfettiComplete} />
      <MatrixRain isActive={isMatrixActive} onClose={handleMatrixClose} />
    </EasterEggContext.Provider>
  );
}

export function useEasterEggs() {
  const context = useContext(EasterEggContext);
  if (!context) {
    throw new Error('useEasterEggs must be used within an EasterEggProvider');
  }
  return context;
}