import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';

import { Experiment } from '../models';

@Injectable()
export class ExperimentActions {
  static LOAD_EXPERIMENT = '[Experiment] Load Experiment';
  loadExperiment(experiment: Experiment): Action {
    return {
      type: ExperimentActions.LOAD_EXPERIMENT,
      payload: experiment
    }
  }
}
