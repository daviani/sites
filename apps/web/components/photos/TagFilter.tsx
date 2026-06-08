'use client';

import { memo } from 'react';
import { useTranslation } from '@/hooks/use-translation';
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
            ? 'bg-accent text-on-accent'
            : 'bg-surface-hi/60 text-fg-muted hover:bg-surface-hi hover:text-fg'
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
              ? 'bg-accent text-on-accent'
              : 'bg-surface-hi/60 text-fg-muted hover:bg-surface-hi hover:text-fg'
            }`}
        >
          {tag}
        </button>
      ))}
    </div>
  );
});