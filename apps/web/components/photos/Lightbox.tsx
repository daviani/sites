'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { useTranslation } from '@/hooks/use-translation';
import type { Photo } from './types';

interface LightboxProps {
  photo: Photo;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  currentIndex: number;
  total: number;
}

export function Lightbox({
  photo,
  onClose,
  onPrev,
  onNext,
  currentIndex,
  total,
}: LightboxProps) {
  const { t } = useTranslation();
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [direction, setDirection] = useState<'left' | 'right'>('right');
  const prefersReducedMotion = useReducedMotion();

  const minSwipeDistance = 50;
  const instantTransition = { duration: 0 };

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) {
      setDirection('right');
      onNext();
    }
    if (isRightSwipe) {
      setDirection('left');
      onPrev();
    }
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDirection('left');
    onPrev();
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDirection('right');
    onNext();
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') {
        setDirection('left');
        onPrev();
      }
      if (e.key === 'ArrowRight') {
        setDirection('right');
        onNext();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose, onPrev, onNext]);

  return (
    <motion.div
      initial={prefersReducedMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={prefersReducedMotion ? undefined : { opacity: 0 }}
      transition={prefersReducedMotion ? instantTransition : { duration: 0.2 }}
      className="fixed inset-0 z-[60] flex items-center justify-center"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.95)' }}
      role="dialog"
      aria-modal="true"
      aria-label={t('pages.photos.lightbox.photoCounter').replace('{current}', String(currentIndex + 1)).replace('{total}', String(total))}
      onClick={onClose}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Close button */}
      <motion.button
        initial={prefersReducedMotion ? false : { opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        whileTap={prefersReducedMotion ? undefined : { scale: 0.9 }}
        transition={prefersReducedMotion ? instantTransition : { delay: 0.1 }}
        onClick={onClose}
        className="absolute top-6 right-6 p-3 text-nord-4 hover:text-nord-6 transition-colors z-10 cursor-pointer
          focus:outline-none focus:ring-2 focus:ring-nord-6 rounded-full hover:bg-nord-3/20"
        aria-label={t('pages.photos.lightbox.close')}
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </motion.button>

      {/* Navigation - Hidden on mobile (use swipe) */}
      <motion.button
        initial={prefersReducedMotion ? false : { opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        whileTap={prefersReducedMotion ? undefined : { x: -8 }}
        transition={prefersReducedMotion ? instantTransition : { delay: 0.15 }}
        onClick={handlePrev}
        className="absolute left-6 p-3 text-nord-4 hover:text-nord-6 transition-colors cursor-pointer
          focus:outline-none focus:ring-2 focus:ring-nord-6 rounded-full hover:bg-nord-3/20
          hidden md:block"
        aria-label={t('pages.photos.lightbox.previousPhoto')}
      >
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </motion.button>

      <motion.button
        initial={prefersReducedMotion ? false : { opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        whileTap={prefersReducedMotion ? undefined : { x: 8 }}
        transition={prefersReducedMotion ? instantTransition : { delay: 0.15 }}
        onClick={handleNext}
        className="absolute right-6 p-3 text-nord-4 hover:text-nord-6 transition-colors cursor-pointer
          focus:outline-none focus:ring-2 focus:ring-nord-6 rounded-full hover:bg-nord-3/20
          hidden md:block"
        aria-label={t('pages.photos.lightbox.nextPhoto')}
      >
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </motion.button>

      {/* Photo container */}
      <motion.div
        key={photo.id}
        initial={prefersReducedMotion ? false : { opacity: 0, x: direction === 'right' ? 100 : -100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={prefersReducedMotion ? undefined : { opacity: 0, x: direction === 'right' ? -100 : 100 }}
        transition={prefersReducedMotion ? instantTransition : { duration: 0.25, ease: 'easeOut' }}
        className="relative max-w-[90vw] max-h-[85vh]"
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
      >
        <Image
          src={photo.src}
          alt={photo.alt}
          width={photo.width}
          height={photo.height}
          className="max-w-[90vw] max-h-[85vh] w-auto h-auto object-contain rounded-lg"
          priority
        />
      </motion.div>

      {/* Counter and title */}
      <motion.div
        initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={prefersReducedMotion ? instantTransition : { delay: 0.2 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center"
      >
        <div className="text-nord-4 text-sm font-medium tracking-wider">
          {currentIndex + 1} / {total}
        </div>
        <div className="text-nord-5 text-xs mt-1 max-w-[60vw] truncate">
          {photo.title}
        </div>
      </motion.div>
    </motion.div>
  );
}