/* eslint-disable @typescript-eslint/no-invalid-this */
import { observable } from 'mobx';
import type { ObjectApi } from './api';
import type { IObject } from './object';
import type { ObjectStore } from './store';
import { autobind } from './utils';

@autobind()
export class ApiManager<T extends IObject = any> {
  private apiBases = observable.map<string, ObjectApi<T>>();
  private stores = observable.map<ObjectApi<T>, ObjectStore<T>>();

  getObjectApi(api: string): ObjectApi<T> | undefined {
    return this.apiBases.get(api);
  }

  registerObjectApi(apiBase: string, api: ObjectApi) {
    this.apiBases.set(apiBase, api);
  }

  registerStore(api: ObjectApi, store: ObjectStore<T>) {
    this.registerObjectApi(api.apiBase, api);
    this.stores.set(api, store);
  }

  getStore(api: string): ObjectStore<T> | undefined {
    const objectApi = this.getObjectApi(api);
    if (!objectApi) {
      return;
    }
    return this.stores.get(objectApi);
  }

  getStores(apis: string[]): (ObjectStore<T> | undefined)[] {
    return apis.map((api) => this.getStore(api));
  }
}

export const apiManager = new ApiManager();
