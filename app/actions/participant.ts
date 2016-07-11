import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';

import { Participant } from '../models';

@Injectable()
export class ParticipantActions {
  static LOAD_PARTICIPANT = '[Participant] Load Participant';
  loadParticipant(participant: Participant): Action {
    return {
      type: ParticipantActions.LOAD_PARTICIPANT,
      payload: participant
    }
  }
}
