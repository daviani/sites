export type Tag = string;

export interface Photo {
  id: string | number;
  title: string;
  src: string;
  alt: string;
  width: number;
  height: number;
  tags: string[];
}

/** Photo type alias for MasonryGrid compatibility */
export type MasonryPhoto = Photo;