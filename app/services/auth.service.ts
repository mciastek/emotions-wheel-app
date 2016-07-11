import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Observable }     from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import config from '../config';

import { Participant, Experiment } from '../models';

export interface AuthResponse {
  participant: Participant;
  experiment: Experiment;
}

@Injectable()
export class AuthService {
  constructor(public http: Http) {

  }

  authenticate(token) : Observable<Object> {
    const body = JSON.stringify({ token });
    const headers = new Headers();

    headers.append('Content-Type', 'application/json');

    return this.http.post(`${config.api}app/sign-in`, body, {
      headers: headers
    })
    .map(res => res.json());
  }
}
