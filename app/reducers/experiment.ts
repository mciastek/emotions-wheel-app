import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import '@ngrx/core/add/operator/select';

import { Experiment } from '../models';
import { ExperimentActions } from '../actions';

export interface ExperimentState {
  entity: Experiment
}

const initialState: ExperimentState = {
  entity: <Experiment>{}
}

export default function(state = initialState, action: Action): ExperimentState {
  switch (action.type) {
    case ExperimentActions.LOAD_ENTITY: {
      const experiment: Experiment = action.payload;

      return {
        entity: Object.assign({}, state.entity, experiment)
      }
    }

    default: {
      return state;
    }
  }
}

export function getExperiment() {
  return (state$: Observable<ExperimentState>) => state$.select(s => s.entity);
}
