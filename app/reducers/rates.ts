import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import '@ngrx/core/add/operator/select';

import { Rate } from '../models';
import { RatesActions } from '../actions';

export interface RatesState {
  entities: Rate[]
};

const initialState: RatesState = {
  entities: []
};

export default function(state = initialState, action: Action): RatesState {
  switch (action.type) {
    case RatesActions.LOAD_COLLECTION: {
      const rates: Rate[] = action.payload;

      return {
        entities: rates
      };
    }

    default: {
      return state;
    }
  }
}

export function getRateEntities() {
  return (state$: Observable<RatesState>) => state$.select(s => s.entities);
}

export function getRate(id: number) {
  return (state$: Observable<RatesState>) => state$.select(s => s.entities[id]);
}

export function hasRate(id: number) {
  return (state$: Observable<RatesState>) => state$.select(s => s.entities.find(e => e.id === id));
}
