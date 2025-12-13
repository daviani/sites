'use client';

import { useState, useCallback, useEffect, useMemo, memo } from 'react';
import { Breadcrumb, useTranslation } from '@daviani/ui';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

type Tag = 'nature' | 'nocturne' | 'macro' | 'portrait' | 'urbain';

interface Photo {
  id: number;
  src: string;
  alt: string;
  width: number;
  height: number;
  tags: Tag[];
}

const ALL_TAGS: Tag[] = ['nature', 'nocturne', 'macro', 'portrait', 'urbain'];

// TODO: Remplacer par Keystatic
const PHOTOS: Photo[] = [
  { id: 1, src: '/photos/1.jpeg', alt: 'Photo 1', width: 1330, height: 2364, tags: ['nature'] },
  { id: 2, src: '/photos/2.jpeg', alt: 'Photo 2', width: 666, height: 1182, tags: ['nature'] },
  { id: 3, src: '/photos/3.jpeg', alt: 'Photo 3', width: 666, height: 1182, tags: ['nature'] },
  { id: 4, src: '/photos/4.jpeg', alt: 'Photo 4', width: 666, height: 1182, tags: ['nocturne'] },
  { id: 5, src: '/photos/5.jpeg', alt: 'Photo 5', width: 1182, height: 666, tags: ['nature'] },
  { id: 6, src: '/photos/6.jpeg', alt: 'Photo 6', width: 1182, height: 666, tags: ['nature'] },
  { id: 7, src: '/photos/7.jpeg', alt: 'Photo 7', width: 2268, height: 4032, tags: ['portrait'] },
  { id: 8, src: '/photos/8.jpeg', alt: 'Photo 8', width: 2364, height: 1330, tags: ['urbain'] },
  { id: 9, src: '/photos/9.jpeg', alt: 'Photo 9', width: 666, height: 1182, tags: ['nature'] },
  { id: 10, src: '/photos/10.jpeg', alt: 'Photo 10', width: 1182, height: 666, tags: ['nature'] },
  { id: 11, src: '/photos/11.jpeg', alt: 'Photo 11', width: 1182, height: 666, tags: ['nature'] },
];

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

const TagFilter = memo(function TagFilter({
  tags,
  activeTag,
  onTagChange,
}: {
  tags: Tag[];
  activeTag: Tag | null;
  onTagChange: (tag: Tag | null) => void;
}) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-wrap justify-center gap-3 mb-12">
      <button
        onClick={() => onTagChange(null)}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
          ${activeTag === null
            ? 'bg-nord-10 text-nord-6'
            : 'bg-nord-5 dark:bg-nord-2 text-nord-3 dark:text-nord-4 hover:bg-nord-4 dark:hover:bg-nord-3'
          }`}
      >
        {t('pages.photos.tags.all')}
      </button>
      {tags.map((tag) => (
        <button
          key={tag}
          onClick={() => onTagChange(tag)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
            ${activeTag === tag
              ? 'bg-nord-10 text-nord-6'
              : 'bg-nord-5 dark:bg-nord-2 text-nord-3 dark:text-nord-4 hover:bg-nord-4 dark:hover:bg-nord-3'
            }`}
        >
          {t(`pages.photos.tags.${tag}`)}
        </button>
      ))}
    </div>
  );
});

const PhotoCard = memo(function PhotoCard({
  photo,
  onClick,
  index,
}: {
  photo: Photo;
  onClick: () => void;
  index: number;
}) {
  const aspectRatio = photo.width / photo.height;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05, ease: 'easeOut' }}
      className="w-full"
    >
      <button
        onClick={onClick}
        className="photo-card group relative w-full overflow-hidden rounded-xl bg-nord-5 dark:bg-nord-1
          focus:outline-none focus:ring-2 focus:ring-nord-10 focus:ring-offset-4
          dark:focus:ring-offset-nord-0
          transition-[transform,box-shadow] duration-300 ease-out
          hover:-translate-y-2 hover:shadow-2xl hover:shadow-nord-0/30 dark:hover:shadow-nord-0/50"
        style={{ aspectRatio }}
        aria-label={photo.alt}
      >
        <Image
          src={photo.src}
          alt={photo.alt}
          width={photo.width}
          height={photo.height}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Subtle gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-nord-0/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        {/* Tags on hover */}
        <div className="absolute bottom-3 left-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {photo.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 text-xs font-medium bg-nord-6/90 dark:bg-nord-0/90 text-nord-0 dark:text-nord-6 rounded-md backdrop-blur-sm"
            >
              {tag}
            </span>
          ))}
        </div>
      </button>
    </motion.div>
  );
});

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
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const minSwipeDistance = 50;

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
    if (isLeftSwipe) onNext();
    if (isRightSwipe) onPrev();
  };

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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.95)' }}
      role="dialog"
      aria-modal="true"
      aria-label={`Photo ${currentIndex + 1} sur ${total}`}
      onClick={onClose}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Close button */}
      <motion.button
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        onClick={onClose}
        className="absolute top-6 right-6 p-3 text-nord-4 hover:text-nord-6 transition-colors z-10
          focus:outline-none focus:ring-2 focus:ring-nord-6 rounded-full hover:bg-nord-3/20"
        aria-label="Fermer"
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </motion.button>

      {/* Navigation - Hidden on mobile (use swipe) */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.15 }}
        onClick={(e: React.MouseEvent) => { e.stopPropagation(); onPrev(); }}
        className="absolute left-6 p-3 text-nord-4 hover:text-nord-6 transition-colors
          focus:outline-none focus:ring-2 focus:ring-nord-6 rounded-full hover:bg-nord-3/20
          hidden md:block"
        aria-label="Photo précédente"
      >
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </motion.button>

      <motion.button
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.15 }}
        onClick={(e: React.MouseEvent) => { e.stopPropagation(); onNext(); }}
        className="absolute right-6 p-3 text-nord-4 hover:text-nord-6 transition-colors
          focus:outline-none focus:ring-2 focus:ring-nord-6 rounded-full hover:bg-nord-3/20
          hidden md:block"
        aria-label="Photo suivante"
      >
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </motion.button>

      {/* Photo container */}
      <motion.div
        key={photo.id}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
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

      {/* Counter - minimal */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-nord-4 text-sm font-medium tracking-wider"
      >
        {currentIndex + 1} / {total}
      </motion.div>
    </motion.div>
  );
}

export default function PhotosPage() {
  const { t } = useTranslation();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [activeTag, setActiveTag] = useState<Tag | null>(null);
  const [shuffledPhotos, setShuffledPhotos] = useState<Photo[]>(PHOTOS);

  // Shuffle photos only on client mount to avoid hydration mismatch
  useEffect(() => {
    setShuffledPhotos(shuffleArray(PHOTOS));
  }, []);

  // Filter by tag
  const filteredPhotos = useMemo(() => {
    if (activeTag === null) return shuffledPhotos;
    return shuffledPhotos.filter((photo) => photo.tags.includes(activeTag));
  }, [shuffledPhotos, activeTag]);

  const openLightbox = useCallback((index: number) => {
    setSelectedIndex(index);
  }, []);

  const closeLightbox = useCallback(() => {
    setSelectedIndex(null);
  }, []);

  const goToPrev = useCallback(() => {
    setSelectedIndex((prev) =>
      prev !== null ? (prev - 1 + filteredPhotos.length) % filteredPhotos.length : null
    );
  }, [filteredPhotos.length]);

  const goToNext = useCallback(() => {
    setSelectedIndex((prev) =>
      prev !== null ? (prev + 1) % filteredPhotos.length : null
    );
  }, [filteredPhotos.length]);

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-5 pb-24">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Breadcrumb items={[{ href: '/photos', labelKey: 'nav.photos.title' }]} />
        </div>

        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-nord-0 dark:text-nord-6">
            {t('pages.photos.title')}
          </h1>
          <p className="text-lg text-nord-3 dark:text-nord-4 max-w-2xl mx-auto leading-relaxed">
            {t('pages.photos.subtitle')}
          </p>
        </div>

        {/* Tag filter */}
        <TagFilter
          tags={ALL_TAGS}
          activeTag={activeTag}
          onTagChange={setActiveTag}
        />

        {/* Gallery - Masonry layout with generous spacing */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 lg:gap-8">
          {filteredPhotos.map((photo, index) => (
            <div key={photo.id} className="mb-6 lg:mb-8 break-inside-avoid">
              <PhotoCard
                photo={photo}
                onClick={() => openLightbox(index)}
                index={index}
              />
            </div>
          ))}
        </div>

        {/* Empty state */}
        {filteredPhotos.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <p className="text-nord-3 dark:text-nord-4">
              {t('pages.photos.noPhotos')}
            </p>
          </motion.div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedIndex !== null && (
          <Lightbox
            photo={filteredPhotos[selectedIndex]}
            onClose={closeLightbox}
            onPrev={goToPrev}
            onNext={goToNext}
            currentIndex={selectedIndex}
            total={filteredPhotos.length}
          />
        )}
      </AnimatePresence>
    </div>
  );
}