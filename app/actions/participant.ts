import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';

import { Participant, Photo } from '../models';

@Injectable()
export class ParticipantActions {
  static LOAD_ENTITY = '[Participant] Load entity';
  loadParticipant(participant: Participant): Action {
    return {
      type: ParticipantActions.LOAD_ENTITY,
      payload: participant
    }
  }

  static LOAD_PHOTOS = '[Participant] Load photos';
  loadPhotos(photos: Photo[]): Action {
    return {
      type: ParticipantActions.LOAD_PHOTOS,
      payload: photos
    };
  }
}
