import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';

import { Rate } from '../models';

@Injectable()
export class RatesActions {
  static CONNECT_SOCKET = '[Rates] Connect to socket';
  connectSocket() {
    return {
      type: RatesActions.CONNECT_SOCKET
    };
  }

  static JOIN_CHANNEL = '[Rates] Join channel';
  joinChannel(experimentId, participantId) {
    return {
      type: RatesActions.JOIN_CHANNEL,
      payload: {
        experimentId: experimentId,
        participantId: participantId
      }
    };
  }

  static LOAD_COLLECTION = '[Rates] Load collections';
  loadRates(rates: Rate[]) {
    return {
      type: RatesActions.LOAD_COLLECTION,
      payload: rates
    };
  }

  static CONNECT_SOCKET_SUCCESS = '[Rates] Connected to socket';
  static CONNECT_SOCKET_ERROR = '[Rates] Socket connect failure';
}
