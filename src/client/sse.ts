/* eslint-disable @typescript-eslint/no-invalid-this */
import { action, computed, observable, reaction } from 'mobx';
import type {
  EventHandle, Noop, ObjectWatchEvent, WatchApi
} from './event';
import { EventSourcePolyfill as EventSource } from './eventsource/eventsource';
import type { IObject, ObjectStore } from './index';
import { autobind, EventEmitter } from './utils';

@autobind()
export class ObjectWatchApi<T extends IObject, S extends ObjectStore<T> = any> implements WatchApi<T, S> {
  protected evtSource!: EventSource;
  protected onData = new EventEmitter<[ObjectWatchEvent<T>]>();
  protected subscribers = observable.map<S, number>();
  // protected reconnectInterval = interval(10, this.reconnect); // background reconnect every 5 second if not connected
  // on ssr env,interval use windows is not defined, so reconnectInterval remove
  protected reconnectTimeoutMs = 5000;
  protected maxReconnectsOnError = 10;
  protected reconnectAttempts = this.maxReconnectsOnError;
  @observable protected apiUrl = '/watch';

  constructor() {
    reaction(
      () => this.activeStores,
      () => this.connect(),
      {
        fireImmediately: true,
        delay: 1000,
      },
    );
  }

  @action setApiURL(url: string) {
    this.apiUrl = url
  }

  @computed get apiURL(): string {
    return this.apiUrl;
  }

  @computed get activeStores() { return Array.from(this.subscribers.keys()); }

  getSubscribersCount = (s: S) => { return this.subscribers.get(s) || 0; }

  subscribe = (...stores: S[]): Noop => {
    stores.forEach((store) => {
      this.subscribers.set(store, this.getSubscribersCount(store) + 1);
    });
    return () =>
      stores.forEach((store) => {
        const count = this.getSubscribersCount(store) - 1;
        if (count <= 0) this.subscribers.delete(store);
        else this.subscribers.set(store, count);
      });
  }

  protected getQuery = (): string[] => {
    return this.activeStores
      .map((store) => {
        return store.api.getWatchUrl(store.api.version);
      })
  }

  protected connect = () => {
    if (this.evtSource) this.disconnect(); // close previous connection
    if (!this.activeStores.length) return;

    const apiUrl = `${this.apiURL}?${this.getQuery().join("&")}`;
    this.evtSource = new EventSource(apiUrl, {
      headers: {
        Authorization: "test"
      },
    });
    this.evtSource.onmessage = this.onMessage;
    this.evtSource.onerror = this.onError;
  }

  reconnect = () => {
    if (!this.evtSource || this.evtSource.readyState !== EventSource.OPEN) {
      this.reconnectAttempts = this.maxReconnectsOnError;
      this.connect();
    }
  }

  protected disconnect = () => {
    if (!this.evtSource) return;
    this.evtSource.close();
    this.evtSource.onmessage = null;
  }

  protected onMessage = (evt: MessageEvent) => {
    console.log("evt", evt);
    if (!evt.data) return;
    if (!this.onData) return;

    const data = JSON.parse(evt.data);
    if ((data as ObjectWatchEvent<T>).object) {
      const object = (data as ObjectWatchEvent<T>).object;
      this.onData.nemit(object?.kind || "", data);
      return;
    }
  }

  protected onRouteEvent = async (evt: string) => {
    if (evt === 'STREAM_END') {
      this.disconnect();
    } else if (evt.toLowerCase() === 'ping') {
    }
  }

  protected onError = (evt: MessageEvent) => {
    const { reconnectAttempts: attemptsRemain, reconnectTimeoutMs } = this;
    if (evt.eventPhase === EventSource.CLOSED) {
      if (attemptsRemain > 0) {
        this.reconnectAttempts--;
        setTimeout(() => this.connect(), reconnectTimeoutMs);
      }
    }
  }

  protected writeLog = (...data: any[]) => {
    console.log('%cOBJECT-WATCH-API:', `font-weight: bold`, ...data);
  }

  addListener = (store: S, ecb: EventHandle) => {
    const listener = (evt: ObjectWatchEvent<T>) => {
      if (!evt.object) {
        return;
      }
      const { version } = evt.object;
      store.api.version = version;
      evt.store = store;
      ecb(evt);
    };
    this.onData.naddListener(store.api.apiResource, listener);
    return () => {
      this.onData.nremoveListener(store.api.apiResource);
    };
  };

  reset = () => {
    this.subscribers.clear();
  }
}

export const objectWatchApi = new ObjectWatchApi();
