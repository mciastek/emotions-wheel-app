import '@ngrx/core/add/operator/select';
import 'rxjs/add/operator/let';
import { Observable } from 'rxjs/Observable';

import { compose } from '@ngrx/core/compose';
import { combineReducers } from '@ngrx/store';

import ExperimentReducer, { ExperimentState, getExperiment } from './experiment';
import ParticipantReducer, { ParticipantState, getParticipant } from './participant';
import RatesReducer, { RatesState, getRateEntities, getRate, hasRate } from './rates';
import UIReducer, { UIState, getPhotoPreview, getBoardOverlay } from './ui';

export interface AppState {
  participant: ParticipantState,
  experiment: ExperimentState,
  rates: RatesState,
  ui: UIState
}

export default compose(combineReducers)({
  participant: ParticipantReducer,
  experiment: ExperimentReducer,
  rates: RatesReducer,
  ui: UIReducer
});

// State functions

export function getParticipantState() {
  return (state$: Observable<AppState>) => state$.select(s => s.participant);
}

export function getExperimentState() {
  return (state$: Observable<AppState>) => state$.select(s => s.experiment);
}

export function getRatesState() {
  return (state$: Observable<AppState>) => state$.select(s => s.rates);
}

export function getUIState() {
  return (state$: Observable<AppState>) => state$.select(s => s.ui);
}

// Select function

export function getParticipant() {
  return compose(getParticipant(), getParticipantState());
}

export function getExperiment() {
  return compose(getExperiment(), getExperimentState());
}

export function getRatesEntities() {
  return compose(getRateEntities(), getRatesState());
}

export function getRate(id: number) {
  return compose(getRate(id), getRatesState());
}

export function hasRate(id: number) {
  return compose(hasRate(id), getRatesState());
}

export function getPhotoPreview() {
  return compose(getPhotoPreview(), getUIState());
}

export function getBoardOverlay() {
  return compose(getBoardOverlay(), getUIState());
}
