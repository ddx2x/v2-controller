import { IObject } from './object';
import { ObjectStore } from './object.store';

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

export type EventCallback = (evt: IObjectWatchEvent) => void;
