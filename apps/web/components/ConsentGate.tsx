'use client';

import { useState, ReactNode } from 'react';
import { useRecaptcha } from '@nordic-island/ui';
import { useTranslation } from '@/hooks/use-translation';

interface ConsentGateProps {
  children: ReactNode;
  buttonText?: string;
  consentText?: string;
  action?: string;
}

export function ConsentGate({
  children,
  buttonText,
  consentText,
  action = 'show_calendly',
}: ConsentGateProps) {
  const { t } = useTranslation();
  const { execute } = useRecaptcha();
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    try {
      await execute(action);
      setIsVerified(true);
    } catch (error) {
      console.error('Verification failed:', error);
      setIsLoading(false);
    }
  };

  if (isVerified) {
    return <>{children}</>;
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4 p-6 glass-card">
      <p className="text-nord-3 dark:text-nord-4 text-center max-w-md">
        {consentText || t('rdv.consent')}
      </p>
      <button
        onClick={handleClick}
        disabled={isLoading}
        className="px-6 py-3 rounded-full font-semibold bg-nord-btn text-white hover:bg-nord-btn-hover hover:scale-105 focus:outline-none focus:ring-4 focus:ring-nord-8 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer"
      >
        {isLoading ? t('rdv.loading') : buttonText || t('rdv.showCalendar')}
      </button>
    </div>
  );
}
