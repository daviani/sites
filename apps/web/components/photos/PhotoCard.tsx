'use client';

import { memo } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import type { Photo } from './types';

interface PhotoCardProps {
  photo: Photo;
  onClick: () => void;
  index: number;
}

export const PhotoCard = memo(function PhotoCard({
  photo,
  onClick,
  index,
}: PhotoCardProps) {
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