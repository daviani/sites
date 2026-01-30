'use client';

import { memo } from 'react';
import { useTranslation } from '@daviani/ui';
import type { Tag } from './types';

interface TagFilterProps {
  tags: Tag[];
  activeTag: Tag | null;
  onTagChange: (tag: Tag | null) => void;
}

export const TagFilter = memo(function TagFilter({
  tags,
  activeTag,
  onTagChange,
}: TagFilterProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-wrap justify-center gap-3 mb-12">
      <button
        onClick={() => onTagChange(null)}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
          ${activeTag === null
            ? 'bg-nord-3 text-nord-6'
            : 'bg-nord-5 dark:bg-nord-2 text-nord-3 dark:text-nord-4 hover:bg-nord-4 dark:hover:bg-nord-3'
          }`}
      >
        {t('pages.photos.tags.all')}
      </button>
      {tags.map((tag) => (
        <button
          key={tag}
          onClick={() => onTagChange(tag)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 capitalize
            ${activeTag === tag
              ? 'bg-nord-3 text-nord-6'
              : 'bg-nord-5 dark:bg-nord-2 text-nord-3 dark:text-nord-4 hover:bg-nord-4 dark:hover:bg-nord-3'
            }`}
        >
          {tag}
        </button>
      ))}
    </div>
  );
});