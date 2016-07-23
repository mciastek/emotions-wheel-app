import { Injectable } from '@angular/core';
import { Effect, StateUpdates, toPayload } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/switchMapTo';
import 'rxjs/add/operator/take';

import { AppState } from '../reducers';
import { RatesActions } from '../actions';

import { SocketService } from '../services';

@Injectable()
export class RatesEffects {
  constructor(
    private updates$: StateUpdates<AppState>,
    private socketService: SocketService,
    private ratesActions: RatesActions
  ) {}

  @Effect() setSocket$ = this.updates$
    .whenAction(RatesActions.CONNECT_SOCKET)
    .map((update) => {
      this.socketService.connect();
      return update;
    });

  @Effect() joinChannel$ = this.updates$
    .whenAction(RatesActions.JOIN_CHANNEL)
    .take(1)
    .map(update => update.action.payload)
    .map(({ experimentId, participantId }) => {
      this.socketService.join(`experiments:${experimentId}`, { participant_id: participantId });
      return { experimentId, participantId };
    })
}
