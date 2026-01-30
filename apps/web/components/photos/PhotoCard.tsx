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
      className="photo-card group relative w-full h-full overflow-hidden rounded-xl bg-nord-5 dark:bg-nord-1
        cursor-pointer
        focus:outline-none focus:ring-2 focus:ring-nord-10 focus:ring-offset-4
        dark:focus:ring-offset-nord-0
        transition-shadow duration-300 ease-out
        hover:shadow-2xl hover:shadow-nord-0/30 dark:hover:shadow-nord-0/50"
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
      <div className="absolute inset-0 bg-gradient-to-br from-nord-15/30 via-nord-10/20 to-nord-15/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 mix-blend-color" />
      {/* Subtle gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-t from-nord-0/50 via-transparent to-nord-0/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      {/* Title on hover */}
      <div className="absolute top-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <h3 className="text-sm font-semibold text-nord-6 drop-shadow-lg truncate">
          {photo.title}
        </h3>
      </div>
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
  );
});