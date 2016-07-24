import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';

import { Rate } from '../models';

@Injectable()
export class RatesActions {
  static LOAD_COLLECTION = '[Rates] Load collections';
  loadRates(rates: Rate[]) {
    return {
      type: RatesActions.LOAD_COLLECTION,
      payload: rates
    };
  }
}
