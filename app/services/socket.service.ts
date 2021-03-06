import { Injectable } from '@angular/core';

import { Socket, Channel } from 'phoenix';

import config from '../config';

@Injectable()
export class SocketService {
  public socket: Socket;
  public channel: Channel;

  constructor() {
    this.socket = new Socket(config.socket);
  }

  connect() {
    this.socket.connect();
  }

  disconnect() {
    this.socket.disconnect();
  }

  join(topic, params?) {
    this.channel = this.socket.channel(topic, params);
    return this.channel.join();
  }

  leave() {
    return this.channel.leave();
  }
}
