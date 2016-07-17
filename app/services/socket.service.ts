import { Injectable } from '@angular/core';

import Phoenix from 'phoenix';

import config from '../config';

@Injectable()
export class SocketService {
  public socket;

  constructor() {
    this.socket = new Phoenix.Socket(config.socket);
  }
}
