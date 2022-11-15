import type { ObjectApi } from './api';
import type { IObject } from './object';
import type { ObjectStore } from './store';

export interface IWatchRouteQuery {
  api: string | string[];
}
export interface IObjectWatchEvent<T extends IObject = any> {
  type: 'ADDED' | 'MODIFIED' | 'DELETED';
  object?: T;
  store?: ObjectStore<T>;
}
export interface IObjectWatchRouteEvent {
  type: string;
  url: string;
  status: number;
}

export type Noop = () => void;

export type EventHandle = (evt: IObjectWatchEvent) => void;

export interface IWatchApi {
  subscribe: (...apis: ObjectApi[]) => Noop;
  addListener: (store: any, ecb: EventHandle) => Noop;
  reset: () => any;
}

