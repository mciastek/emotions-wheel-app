import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import config from '../config';

import { Photo } from '../models';

@Injectable()
export class PhotosService {
  constructor(public http: Http) {}

  fetchAll(participantId: number): Observable<{ photos: Photo[] }> {
    const headers = new Headers();

    return this.http.get(`${config.api}app/participants/${participantId}/photos`, {
      headers: headers
    })
    .map(res => res.json());
  }
}
