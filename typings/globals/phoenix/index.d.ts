declare namespace Phoenix {
  export class Socket {
    constructor(endPoint: string, opts?: Object): Socket;

    protocol(): string;
    endPointURL(): string;

    disconnect(callback: Function, code: string, reason: any): void;
    connect(params: any): void;

    log(kind: string, msg: string, data: any): void;

    onOpen(callback: Function): void;
    onClose(callback: Function): void;
    onError(callback: Function): void;
    onMessage(callback: Function): void;

    onConnOpen(): void;
    onConnClose(event: any): void;
    onConnError(error: any): void;

    triggerChanError(): void;

    connectionState(): string;

    isConnected(): boolean;

    remove(channel: Channel): void;
    channel(topic: string, chanParams: Object): Channel;

    push(data: any): void;
  }

  export class Channel {
    constructor(topic: string, params?: Object, socket?: Socket): Channel;

    join(timeout?: number): void;
    leave(timeout?: number): void;

    onClose(callback: Function): void;
    onError(callback: Function): void;

    on(event: string, callback: Function): void;
    off(event: string): void;

    canPush(): boolean;

    push(event: string, payload: Object, timeout?: number): void;
    receive(eventName: string, callback: Function)
  }

  export var Presence: {
    syncState(currentState: any, newState: any, onJoin: Function, onLeave: Function): any;
    syncDiff(currentState: any, stateFromServer: Object, onJoin: Function, onLeave: Function): any;

    list(presences: any, chooser: Function): any;
  }
}

declare module "phoenix" {
  export class Socket extends Phoenix.Socket {};
  export class Channel extends Phoenix.Channel {};
  export var Presence = Phoenix.Presence;
}
