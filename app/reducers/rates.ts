import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import '@ngrx/core/add/operator/select';

import { Rate } from '../models';
import { RatesActions } from '../actions';

export interface RatesState {
  ids: number[],
  entities: { [id: number]: Rate }
};

const initialState: RatesState = {
  ids: [],
  entities: {}
};

export default function(state = initialState, action: Action): RatesState {
  switch (action.type) {
    case RatesActions.LOAD_COLLECTION: {
      const rates: Rate[] = action.payload;

      const ids = rates.map((rate) => rate.id);

      const entities = rates.reduce((acc, rate: Rate) => {
        return Object.assign(acc, {
          [rate.id]: rate
        });
      }, {});

      return {
        ids: ids,
        entities: entities
      };
    }

    default: {
      return state;
    }
  }
}

