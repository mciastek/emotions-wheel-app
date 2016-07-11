import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import '@ngrx/core/add/operator/select';

import { Participant } from '../models';
import { ParticipantActions } from '../actions';

export interface ParticipantState {
  entity: Participant
}

const initialState: ParticipantState = {
  entity: <Participant>{}
}

export default function(state = initialState, action: Action): ParticipantState {
  switch (action.type) {
    case ParticipantActions.LOAD_PARTICIPANT: {
      const participant: Participant = action.payload;

      return {
        entity: Object.assign({}, state.entity, participant)
      }
    }

    default: {
      return state;
    }
  }
}

export function getParticipant() {
  return (state$: Observable<ParticipantState>) => state$.select(s => s.entity);
}
