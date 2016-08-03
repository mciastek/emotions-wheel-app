import { Photo } from './photo';
import { Researcher } from './researcher';

export interface Experiment {
  id: number;
  name: string;
  kind: string;
  start_date: string;
  end_date: string;
  photos: Photo[];
  researcher: Researcher;
  is_active?: boolean;
  has_completed?: boolean;
}
