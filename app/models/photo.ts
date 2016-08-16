export interface Photo {
  id: number;
  name: string;
  original: string;
  thumb: string;
  author_type: string;
  author_id: number;

  x?: number;
  y?: number;
}
