'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import { Breadcrumb, useTranslation } from '@daviani/ui';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbox, MasonryGrid, PhotoCard, TagFilter } from '@/components/photos';
import type { Photo, Tag } from '@/components/photos';

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

export default function PhotosPage() {
  const { t } = useTranslation();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [activeTag, setActiveTag] = useState<Tag | null>(null);
  const [shuffledPhotos, setShuffledPhotos] = useState<Photo[]>(PHOTOS);

  // Shuffle photos only on client mount to avoid hydration mismatch
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Intentional: Math.random() must run client-side only
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

        {/* Gallery - Masonry layout with animations */}
        <div className="relative z-10">
        {filteredPhotos.length > 0 ? (
          <MasonryGrid
            items={filteredPhotos}
            columns={[4, 3, 3, 2, 1]}
            gap={24}
            duration={0.5}
            stagger={0.04}
            animateFrom="bottom"
            blurToFocus={true}
            renderItem={(photo, index) => (
              <PhotoCard
                photo={photo}
                onClick={() => openLightbox(index)}
              />
            )}
          />
        ) : (
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