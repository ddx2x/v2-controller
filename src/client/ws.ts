/* eslint-disable @typescript-eslint/no-invalid-this */
import { computed, observable, reaction } from 'mobx';
import type { IMessageEvent } from 'websocket';
import { w3cwebsocket as WebSocket } from 'websocket';
import { ObjectApi } from './api';
import type { EventHandle, IObjectWatchEvent, IObjectWatchRouteEvent } from './event';
import type { IObject, ObjectStore } from './index';
import { apiManager } from './manager';
import { autobind, EventEmitter } from './utils';

@autobind()
export class ObjectWebSockApi {
  protected socket: WebSocket | undefined;
  protected onData = new EventEmitter<[IObjectWatchEvent]>();
  protected subscribers = observable.map<ObjectApi, number>();
  protected reconnectTimeoutMs = 500;
  protected maxReconnectsOnError = 10;
  protected reconnectAttempts = this.maxReconnectsOnError;
  protected apiUrl = '/ws/watch';

  constructor() {
    reaction(
      () => this.activeApis,
      () => this.connect(),
      {
        fireImmediately: true,
        delay: 100,
      },
    );

    setInterval(() => {
      if (this.activeApis.length === 0) {
        return;
      }
      if (!this.socket) this.createSocket();
    }, 1000);
  }

  public sendMessage(message: any) {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    this.socket && this.socket.send(message);
  }

  @computed get apiURL(): string {
    const { hostname, protocol, port } = location;
    const wss = protocol === 'https:' ? 'wss' : 'ws';
    return `${wss}://${hostname}:${port}${this.apiUrl}`;
  }

  @computed get activeApis() {
    return Array.from(this.subscribers.keys());
  }

  getSubscribersCount(api: ObjectApi) {
    return this.subscribers.get(api) || 0;
  }

  subscribe(...apis: ObjectApi[]) {
    apis.forEach((api) => {
      this.subscribers.set(api, this.getSubscribersCount(api) + 1);
    });
    return () =>
      apis.forEach((api) => {
        const count = this.getSubscribersCount(api) - 1;
        if (count <= 0) this.subscribers.delete(api);
        else this.subscribers.set(api, count);
      });
  }

  protected getQuery() {
    return this.activeApis.map((api) => `"${api.getWatchUrl()}"`).join(',');
  }

  protected register() {
    if (!this.socket) return;
    if (this.socket.readyState === this.socket.OPEN) {
      this.socket?.send(`{"op":0,"urls":[${this.getQuery()}]}`)
    }
  }

  public unregister() {
    if (!this.socket) return;
    if (this.activeApis.length === 0) {
      if (this.socket && this.socket.readyState === WebSocket.OPEN) {
        this.socket?.send(`{"op":3,"urls":[]}`);
      }
    }
  }

  protected connect() {
    if (this.socket) {
      this.register();
      return;
    }

    if (this.activeApis.length === 0) {
      return;
    }

    const query = this.getQuery();
    if (!query) {
      this.disconnect();
      this.reset();
      this.writeLog('NOT API REGISTERED');
      return;
    }

    this.createSocket();
  }

  createSocket() {
    if (!this.socket) {
      this.socket = new WebSocket(this.apiURL);
      this.socket.onmessage = this.onMessage;
      this.socket.onerror = this.onError;
      this.socket.onopen = () => {
        this.register();
      };
    }
  }

  reconnect() {
    if (!this.socket || !this.socket.OPEN) {
      this.reconnectAttempts = this.maxReconnectsOnError;
      this.connect();
    }
  }

  protected disconnect() {
    if (!this.socket) return;
    this.socket.close();
  }

  protected onMessage(evt: IMessageEvent) {
    // console.log("websocket ws onMessage", evt.data)

    if (!evt.data) return;
    if (!this.onData) return;
    if (typeof evt.data !== 'string') {
      return;
    }

    const data = JSON.parse(evt.data);
    if ((data as IObjectWatchEvent).object) {
      const kind = (data as IObjectWatchEvent).object.kind;
      this.onData.nemit(kind, data);
      return;
    }

    if (typeof this.onRouteEvent === 'function') {
      this.onRouteEvent(data);
      return;
    }
  }

  protected async onRouteEvent({ type, url }: IObjectWatchRouteEvent) {
    if (type === 'STREAM_END') {
      this.disconnect();
      const { apiBase } = ObjectApi.parseApi(url);
      if (!apiBase) {
        return;
      }
      const api = apiManager.getObjectApi(apiBase);
      if (api) {
        this.reconnect();
      }
    } else if (type.toLowerCase() === 'ping') {
      // console.log('onMessage: PING');
    } else if (type === 'STREAM_ERROR') {
      this.disconnect();
      // console.log('onMessage: STREAM_ERROR');
    } else if (type === 'USER_CONFIG') {
      // 用户信息经过 watch 推流
      // console.log('onMessage: update config');
    }
  }

  protected onError() {
    const { socket, reconnectAttempts: attemptsRemain, reconnectTimeoutMs } = this;
    if (socket && (socket.CLOSING || socket.CLOSED)) {
      if (attemptsRemain > 0) {
        this.reconnectAttempts--;
        setTimeout(() => this.connect(), reconnectTimeoutMs);
      }
    }
  }

  protected writeLog(...data: any[]) {
    console.log('%cOBJECT-WATCH-API:', `font-weight: bold`, ...data);
  }

  addListener = <T extends ObjectStore<IObject>>(store: T, ecb: EventHandle) => {
    const listener = (evt: IObjectWatchEvent<IObject>) => {
      if (!evt.object) {
        return;
      }
      const { version } = evt.object;
      store.version = version;
      evt.store = store;
      ecb(evt);
    };
    this.onData.naddListener(store.api.apiResource, listener);
    return () => {
      this.onData.nremoveListener(store.api.apiResource);
    };
  };

  reset() {
    this.disconnect();
    this.subscribers.clear();
  }
}

export const objectWebSockApi = new ObjectWebSockApi();
