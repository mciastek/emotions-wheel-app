import { ExperimentState } from './experiment';
import { PhotoState } from './photo';
import { ParticipantState } from './participant';

export interface AppState {
  experiment: ExperimentState,
  participant: ParticipantState
}
