import { useModel } from '@umijs/max';
import { computed, observable, reaction } from 'mobx';
import { stringify } from 'querystring';
import { apiManager } from './api.manager';
import { EventSourcePolyfill as EventSource } from './eventsource/eventsource';
import { IObject, ObjectStore } from './index';
import { ObjectApi } from './object.api';
import {
  EventCallback,
  IObjectWatchEvent,
  IObjectWatchRouteEvent,
  IWatchRouteQuery,
} from './object.event.api';
import { autobind, EventEmitter } from './utils';

@autobind()
export class ObjectWatchApi {
  protected evtSource!: EventSource;
  protected onData = new EventEmitter<[IObjectWatchEvent]>();
  protected subscribers = observable.map<ObjectApi, number>();
  // protected reconnectInterval = interval(10, this.reconnect); // background reconnect every 5 second if not connected
  // on ssr env,interval use windows is not defined, so reconnectInterval remove
  protected reconnectTimeoutMs = 5000;
  protected maxReconnectsOnError = 10;
  protected reconnectAttempts = this.maxReconnectsOnError;
  protected apiUrl = '/watch';

  constructor() {
    reaction(
      () => this.activeApis,
      () => this.connect(),
      {
        fireImmediately: true,
        delay: 1000,
      },
    );
  }

  @computed get apiURL(): string {
    return this.apiUrl;
  }

  @computed get activeApis() {
    return Array.from(this.subscribers.keys());
  }

  unregister() {}

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

  protected getQuery(): Partial<IWatchRouteQuery> {
    return {
      api: this.activeApis
        .map((api) => {
          return api.getWatchUrl();
        })
        .flat(),
    };
  }

  protected connect() {
    if (this.evtSource) this.disconnect(); // close previous connection
    if (!this.activeApis.length) {
      return;
    }
    const query = this.getQuery();
    const apiUrl = `${this.apiURL}?${stringify(query)}`;
    this.evtSource = new EventSource(apiUrl, {
      headers: {
        Authorization: useModel('userModel').user?.token || '',
      },
    });
    this.evtSource.onmessage = this.onMessage;
    this.evtSource.onerror = this.onError;
    if (!query.api) {
      this.disconnect();
      this.reset();
      this.writeLog('NOT API REGISTERED');
      return;
    }
    this.writeLog('CONNECTING', query.api);
  }

  reconnect() {
    if (!this.evtSource || this.evtSource.readyState !== EventSource.OPEN) {
      this.reconnectAttempts = this.maxReconnectsOnError;
      this.connect();
    }
  }

  protected disconnect() {
    if (!this.evtSource) return;
    this.evtSource.close();
    this.evtSource.onmessage = null;
  }

  protected onMessage(evt: MessageEvent) {
    if (!evt.data) return;
    if (!this.onData) return;
    const data = JSON.parse(evt.data);
    if ((data as IObjectWatchEvent).object) {
      const kind = (data as IObjectWatchEvent).object.kind;
      this.onData.nemit(kind, data);
    } else {
      if (typeof this.onRouteEvent === 'function') {
        this.onRouteEvent(data);
      }
    }
  }

  protected async onRouteEvent({ type, url }: IObjectWatchRouteEvent) {
    if (type === 'STREAM_END') {
      this.disconnect();
      const { apiBase } = ObjectApi.parseApi(url);
      if (apiBase === '') {
        return;
      }
      const api = apiManager.getApi(apiBase);
      if (api) {
        await api.refreshResourceVersion({});
        this.reconnect();
      }
    } else if (type.toLowerCase() === 'ping') {
      // console.log('onMessage: PING');
    } else if (type === 'STREAM_ERROR') {
      this.disconnect();
      // console.log('onMessage: STREAM_ERROR');
    }
  }

  protected onError(evt: MessageEvent) {
    const { reconnectAttempts: attemptsRemain, reconnectTimeoutMs } = this;
    if (evt.eventPhase === EventSource.CLOSED) {
      if (attemptsRemain > 0) {
        this.reconnectAttempts--;
        setTimeout(() => this.connect(), reconnectTimeoutMs);
      }
    }
  }

  protected writeLog(...data: any[]) {
    console.log('%cOBJECT-WATCH-API:', `font-weight: bold`, ...data);
  }

  addListener = <T extends ObjectStore<IObject>>(store: T, ecb: EventCallback) => {
    const listener = (evt: IObjectWatchEvent<IObject>) => {
      if (!evt.object) {
        return;
      }
      const { version } = evt.object;
      store.api.setVersion(version);
      evt.store = store;
      ecb(evt);
    };
    this.onData.naddListener(store.api.apiResource, listener);
    return () => {
      this.onData.nremoveListener(store.api.apiResource);
    };
  };

  reset() {
    this.subscribers.clear();
  }
}

export const objectWatchApi = new ObjectWatchApi();
