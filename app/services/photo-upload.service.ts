import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import config from '../config';

import { Photo } from '../models';

@Injectable()
export class PhotoUploadService {
  constructor(public http: Http) {

  }

  save(endpoint: string, imageData: string, fileName = 'photo.jpg', params = {}): Observable<Object> {
    const blob = this.b64toBlob(imageData, 'image/jpeg');
    const formData = new FormData();
    const headers = new Headers();

    for (let prop in params) {
      formData.append(`photo[${prop}]`, params[prop]);
    }

    formData.append('photo[file]', blob, fileName);

    return this.http.post(`${config.api}app/${endpoint}`, formData, {
      headers: headers
    })
    .map(res => res.json());
  }

  // see: http://stackoverflow.com/a/16245768/3029319
  private b64toBlob(b64Data, contentType = '', sliceSize = 512) {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, {type: contentType});
    return blob;
  }
}
