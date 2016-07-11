import '@ngrx/core/add/operator/select';
import 'rxjs/add/operator/let';
import { Observable } from 'rxjs/Observable';

import { compose } from '@ngrx/core/compose';
import { combineReducers } from '@ngrx/store';

import ExperimentReducer, { ExperimentState, getExperiment } from './experiment';
import ParticipantReducer, { ParticipantState, getParticipant } from './participant';

export interface AppState {
  participant: ParticipantState,
  experiment: ExperimentState
}

export default compose(combineReducers)({
  participant: ParticipantReducer,
  experiment: ExperimentReducer
});

export function getParticipantState() {
  return (state$: Observable<AppState>) => state$.select(s => s.participant);
}

export function getExperimentState() {
  return (state$: Observable<AppState>) => state$.select(s => s.experiment);
}

export function getParticipant() {
  return compose(getParticipant(), getParticipantState());
}

export function getExperiment() {
  return compose(getExperiment(), getExperimentState());
}
