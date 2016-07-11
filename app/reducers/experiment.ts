import { PhotoState } from './photo';

export interface ExperimentState {
  id: number;
  name: string;
  kind: string;
  start_date: string;
  end_date: string;
  researcher_id: number;
  photos: PhotoState[];
}
