import type { Metadata } from 'next';
import { Breadcrumb } from '@nordic-island/ui';
import { PhotosPageContent } from '@/components/photos';
import { getAllPhotos } from '@/lib/content/photos';
import type { Tag } from '@/components/photos';

export const metadata: Metadata = {
  title: 'Photos',
};

// Extract unique tags from photos
function getUniqueTags(photos: { tags: string[] }[]): Tag[] {
  const tagSet = new Set<string>();
  for (const photo of photos) {
    for (const tag of photo.tags) {
      tagSet.add(tag);
    }
  }
  return Array.from(tagSet) as Tag[];
}

export default function PhotosPage() {
  const photos = getAllPhotos();
  const tags = getUniqueTags(photos);

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-5 pb-24">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Breadcrumb items={[{ href: '/photos', label: 'Photos' }]} homeLabel="Accueil" ariaLabel="Fil d'Ariane" />
        </div>

        <PhotosPageContent photos={photos} tags={tags} />
      </div>
    </div>
  );
}
