import { Photo } from './photo';

export interface Experiment {
  id: number;
  name: string;
  kind: string;
  start_date: string;
  end_date: string;
  researcher_id: number;
  photos: Photo[];
}
