'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import { useTranslation } from '@nordic-island/ui';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbox } from './Lightbox';
import { MasonryGrid } from './MasonryGrid';
import { PhotoCard } from './PhotoCard';
import { TagFilter } from './TagFilter';
import type { Photo, Tag } from './types';

interface PhotosPageContentProps {
  photos: Photo[];
  tags: Tag[];
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function PhotosPageContent({ photos, tags }: PhotosPageContentProps) {
  const { t } = useTranslation();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [activeTag, setActiveTag] = useState<Tag | null>(null);
  const [shuffledPhotos, setShuffledPhotos] = useState<Photo[]>(photos);

  // Shuffle photos only on client mount to avoid hydration mismatch
  useEffect(() => {
    setShuffledPhotos(shuffleArray(photos));
  }, [photos]);

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
    <>
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
      {tags.length > 0 && (
        <TagFilter
          tags={tags}
          activeTag={activeTag}
          onTagChange={setActiveTag}
        />
      )}

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
    </>
  );
}
