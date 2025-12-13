export type Tag = 'nature' | 'nocturne' | 'macro' | 'portrait' | 'urbain';

export interface Photo {
  id: number;
  src: string;
  alt: string;
  width: number;
  height: number;
  tags: Tag[];
}