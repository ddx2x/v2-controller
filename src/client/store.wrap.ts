import type { IObject } from '.';
import type { ObjectStore } from './store';

export interface IStore<T extends ObjectStore<IObject>> {
  stores: Store<T>[];
  getStore: (key: keyof T) => T;
}
export interface Store<S extends ObjectStore<IObject>> {
  store: S;
  iswatch: boolean;
}

export function storeables(stores: Store<any>[]) {
  return function classes<T extends { new(...args: any[]): any }>(constructor: T) {
    return class extends constructor {
      stores = stores;
      componentDidMount() {
        stores.map((item) => {
          const { store, iswatch } = item;
          store
            .loadAll()
            .then(() => {
              if (!store.isLoaded && iswatch) {
                store.watch()
              }
            })
        });
      }
      componentWillUnmount() {
        stores.map((item) => {
          const { store } = item;
          store.reset();
        });
      }
    };
  };
}
