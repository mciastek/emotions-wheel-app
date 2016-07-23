import { Injectable } from '@angular/core';

import { Socket } from 'phoenix';

import config from '../config';

@Injectable()
export class SocketService {
  public socket;

  constructor() {
    this.socket = new Socket(config.socket);
  }

  connect() {
    this.socket.connect();
  }
}
