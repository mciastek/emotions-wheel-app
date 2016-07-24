import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';

import { Participant } from '../models';

@Injectable()
export class ParticipantActions {
  static LOAD_ENTITY = '[Participant] Load entity';
  loadParticipant(participant: Participant): Action {
    return {
      type: ParticipantActions.LOAD_ENTITY,
      payload: participant
    }
  }
}
