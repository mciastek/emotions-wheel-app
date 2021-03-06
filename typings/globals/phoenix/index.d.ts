declare module "phoenix" {
  class Push {
    constructor(channel: Channel, event: string, payload: any, timeout: number);

    resend(timeout: number): void;
    send(): void;

    receive(status: string, callback: Function): Push;
  }

  export class Socket {
    constructor(endPoint: string, opts?: Object);

    protocol(): string;
    endPointURL(): string;

    disconnect(callback?: Function, code?: string, reason?: any): void;
    connect(params?: any): void;

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
    channel(topic: string, chanParams?: Object): Channel;

    push(data: any): void;
  }

  export class Channel {
    constructor(topic: string, params?: Object, socket?: Socket);

    join(timeout?: number): Push;
    leave(timeout?: number): Push;

    onClose(callback: Function): void;
    onError(callback: Function): void;

    on(event: string, callback: Function): void;
    off(event: string): void;

    canPush(): boolean;

    push(event: string, payload: Object, timeout?: number): Push;
  }

  export var Presence: {
    syncState(currentState: any, newState: any, onJoin: Function, onLeave: Function): any;
    syncDiff(currentState: any, stateFromServer: Object, onJoin: Function, onLeave: Function): any;

    list(presences: any, chooser: Function): any;
  }
}
