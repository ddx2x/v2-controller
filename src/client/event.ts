import type { IObject } from './object';
import type { ObjectStore } from './store';

export declare type WatchRouteQuery = {
  api: string;
  version: number;
};

export declare type ObjectWatchEvent<T extends IObject> = {
  type: 'ADDED' | 'MODIFIED' | 'DELETED';
  object?: T;
  store?: ObjectStore<T>;
};

export declare type ObjectWatchRouteEvent = {
  type: string;
  url: string;
  status: number;
};

export type Noop = () => void;

export type EventHandle = <T extends IObject>(evt: ObjectWatchEvent<T>) => void;

export declare type WatchApi<T extends IObject> = {
  subscribe: <S extends ObjectStore<T>>(...stores: S[]) => Noop;
  addListener: <S extends ObjectStore<T>>(store: S, ecb: EventHandle) => Noop;
  reset: () => any;
};

export class DefaultWatchApi<T extends IObject> implements WatchApi<T> {
  subscribe<S extends ObjectStore<T>>(...stores: S[]): Noop {
    return () => {};
  }
  addListener<S extends ObjectStore<T>>(store: S, ecb: EventHandle): Noop {
    return () => {};
  }

  reset() {}
}
