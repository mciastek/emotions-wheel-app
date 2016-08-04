import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';

import { Experiment } from '../models';

@Injectable()
export class ExperimentActions {
  static LOAD_ENTITY = '[Experiment] Load entity';
  loadExperiment(experiment: Experiment): Action {
    return {
      type: ExperimentActions.LOAD_ENTITY,
      payload: experiment
    }
  }

  static SET_AS_COMPLETED = '[Experiment] Set as completed';
  setAsCompleted(): Action {
    return {
      type: ExperimentActions.SET_AS_COMPLETED
    };
  }
}
