'use client';

import { memo } from 'react';
import Image from 'next/image';
import type { Photo } from './types';

interface PhotoCardProps {
  photo: Photo;
  onClick: () => void;
}

export const PhotoCard = memo(function PhotoCard({
  photo,
  onClick,
}: PhotoCardProps) {
  return (
    <button
      onClick={onClick}
      className="photo-card group relative w-full h-full overflow-hidden rounded-xl bg-surface-hi dark:bg-surface
        cursor-pointer
        focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-4
        dark:focus:ring-offset-bg
        transition-shadow duration-300 ease-out
        hover:shadow-2xl hover:shadow-black/30 dark:hover:shadow-black/50"
      aria-label={photo.alt}
    >
      <Image
        src={photo.src}
        alt={photo.alt}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
        className="object-cover transition-all duration-500 md:grayscale md:group-hover:grayscale-0 group-hover:scale-105"
      />
      {/* Color shift overlay on hover - purple/pink tint */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent-3/30 via-accent/20 to-accent-3/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 mix-blend-color" />
      {/* Subtle gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-t from-bg/50 via-transparent to-bg/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      {/* Title on hover */}
      <div className="absolute top-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <h3 className="text-sm font-semibold text-fg drop-shadow-lg truncate">
          {photo.title}
        </h3>
      </div>
      {/* Tags on hover */}
      <div className="absolute bottom-3 left-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        {photo.tags.map((tag) => (
          <span
            key={tag}
            className="px-2 py-1 text-xs font-medium bg-surface/90 dark:bg-bg/90 text-fg rounded-md backdrop-blur-sm"
          >
            {tag}
          </span>
        ))}
      </div>
    </button>
  );
});