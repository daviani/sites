'use client';

import { useState, useCallback, useEffect } from 'react';
import { Breadcrumb, useTranslation } from '@daviani/ui';
import Image from 'next/image';

interface Photo {
  id: number;
  src: string;
  alt: string;
  width: number;
  height: number;
}

// TODO: Remplacer par un système de chargement dynamique
const PHOTOS: Photo[] = [
  { id: 1, src: '/photos/4895F994-512A-4A00-96E8-68E0138C1F4E_4_5005_c.jpeg', alt: 'Photo 1', width: 310, height: 552 },
  { id: 2, src: '/photos/678D9B45-E3E6-4F04-86DB-98D13D874B79_4_5005_c.jpeg', alt: 'Photo 2', width: 310, height: 552 },
  { id: 3, src: '/photos/6AFE295C-731C-4498-B89A-98C582D40ACB_4_5005_c.jpeg', alt: 'Photo 3', width: 310, height: 552 },
  { id: 4, src: '/photos/712DEC21-CECF-4BBE-B602-C4D6FA7302EC_4_5005_c.jpeg', alt: 'Photo 4', width: 310, height: 552 },
  { id: 5, src: '/photos/7179D116-B1F0-4696-9610-E117CC074029_1_105_c.jpeg', alt: 'Photo 5', width: 1182, height: 666 },
  { id: 6, src: '/photos/7906A0A8-8E4C-4819-B97D-2F148D964E24_1_105_c.jpeg', alt: 'Photo 6', width: 1182, height: 666 },
  { id: 7, src: '/photos/B3A110A8-9950-45BE-A509-17B244D96174_1_201_a.jpeg', alt: 'Photo 7', width: 2268, height: 4032 },
  { id: 8, src: '/photos/C0B51A07-4EDD-48D4-813A-06D0938F25CA_4_5005_c.jpeg', alt: 'Photo 8', width: 552, height: 310 },
  { id: 9, src: '/photos/C9A0FC36-342C-4EC8-AB9F-E221DDA82462_1_105_c.jpeg', alt: 'Photo 9', width: 666, height: 1182 },
  { id: 10, src: '/photos/D3AE76B1-485C-4FC0-9813-7C6142A13AE9_4_5005_c.jpeg', alt: 'Photo 10', width: 552, height: 310 },
  { id: 11, src: '/photos/E66A8C0A-6B3F-4173-8176-8F6FD6916A1D_4_5005_c.jpeg', alt: 'Photo 11', width: 552, height: 310 },
];

function PhotoCard({ photo, onClick }: { photo: Photo; onClick: () => void }) {
  const aspectRatio = photo.width / photo.height;

  return (
    <button
      onClick={onClick}
      className="group relative w-full overflow-hidden rounded-lg bg-nord-5 dark:bg-nord-1
        focus:outline-none focus:ring-2 focus:ring-nord-10 focus:ring-offset-2
        dark:focus:ring-offset-nord-0 transition-shadow duration-300
        hover:shadow-2xl hover:shadow-nord-0/40 dark:hover:shadow-nord-0/70"
      style={{ aspectRatio }}
      aria-label={photo.alt}
    >
      <Image
        src={photo.src}
        alt={photo.alt}
        width={photo.width}
        height={photo.height}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
      />
    </button>
  );
}

function Lightbox({
  photo,
  onClose,
  onPrev,
  onNext,
  currentIndex,
  total,
}: {
  photo: Photo;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  currentIndex: number;
  total: number;
}) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose, onPrev, onNext]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-nord-0/95 dark:bg-nord-0/98"
      role="dialog"
      aria-modal="true"
      aria-label={`Photo ${currentIndex + 1} sur ${total}`}
      onClick={onClose}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 text-nord-4 hover:text-nord-6 transition-colors z-10
          focus:outline-none focus:ring-2 focus:ring-nord-6 rounded-full"
        aria-label="Fermer"
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Navigation */}
      <button
        onClick={(e) => { e.stopPropagation(); onPrev(); }}
        className="absolute left-4 p-2 text-nord-4 hover:text-nord-6 transition-colors
          focus:outline-none focus:ring-2 focus:ring-nord-6 rounded-full"
        aria-label="Photo précédente"
      >
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={(e) => { e.stopPropagation(); onNext(); }}
        className="absolute right-4 p-2 text-nord-4 hover:text-nord-6 transition-colors
          focus:outline-none focus:ring-2 focus:ring-nord-6 rounded-full"
        aria-label="Photo suivante"
      >
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Photo container */}
      <div
        className="relative max-w-[90vw] max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={photo.src}
          alt={photo.alt}
          width={photo.width}
          height={photo.height}
          className="max-w-[90vw] max-h-[85vh] w-auto h-auto object-contain rounded-lg"
          priority
        />
      </div>

      {/* Counter */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-nord-4 text-sm">
        {currentIndex + 1} / {total}
      </div>
    </div>
  );
}

export default function PhotosPage() {
  const { t } = useTranslation();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const openLightbox = useCallback((index: number) => {
    setSelectedIndex(index);
  }, []);

  const closeLightbox = useCallback(() => {
    setSelectedIndex(null);
  }, []);

  const goToPrev = useCallback(() => {
    setSelectedIndex((prev) =>
      prev !== null ? (prev - 1 + PHOTOS.length) % PHOTOS.length : null
    );
  }, []);

  const goToNext = useCallback(() => {
    setSelectedIndex((prev) =>
      prev !== null ? (prev + 1) % PHOTOS.length : null
    );
  }, []);

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 pt-5 pb-16">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Breadcrumb items={[{ href: '/photos', labelKey: 'nav.photos.title' }]} />
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-nord-0 dark:text-nord-6">
            {t('pages.photos.title')}
          </h1>
          <p className="text-lg text-nord-3 dark:text-nord-4 max-w-2xl mx-auto">
            {t('pages.photos.subtitle')}
          </p>
        </div>

        {/* Gallery - Masonry layout */}
        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4">
          {PHOTOS.map((photo, index) => (
            <div key={photo.id} className="mb-4 break-inside-avoid">
              <PhotoCard photo={photo} onClick={() => openLightbox(index)} />
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {selectedIndex !== null && (
        <Lightbox
          photo={PHOTOS[selectedIndex]}
          onClose={closeLightbox}
          onPrev={goToPrev}
          onNext={goToNext}
          currentIndex={selectedIndex}
          total={PHOTOS.length}
        />
      )}
    </div>
  );
}