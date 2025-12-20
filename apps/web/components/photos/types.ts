export type Tag = 'nature' | 'nocturne' | 'macro' | 'portrait' | 'urbain';

export interface Photo {
  id: number;
  src: string;
  alt: string;
  width: number;
  height: number;
  tags: Tag[];
}

/** Photo type alias for MasonryGrid compatibility */
export type MasonryPhoto = Photo;