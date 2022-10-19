import { observable } from 'mobx';
import { IObject } from './object';
import { ObjectApi } from './object.api';
import { ObjectStore } from './object.store';
import { autobind } from './utils';

@autobind()
export class ApiManager<T extends IObject = any> {
  private apis = observable.map<string, ObjectApi>();
  private stores = observable.map<ObjectApi | undefined, ObjectStore<T> | undefined>();

  getApi(pathOrCallback: string | ((api: ObjectApi) => boolean)) {
    const apis = this.apis;
    if (typeof pathOrCallback === 'string') {
      let api = apis.get(pathOrCallback);
      if (!api) {
        const { apiBase } = ObjectApi.parseApi(pathOrCallback);
        api = apis.get(apiBase);
      }
      return api;
    } else {
      return Array.from(apis.values()).find(pathOrCallback);
    }
  }

  registerApi(apiBase: string, api: ObjectApi) {
    if (this.apis.has(apiBase)) return;
    this.apis.set(apiBase, api);
  }

  protected resolveApi(api: string | ObjectApi): ObjectApi | undefined {
    if (typeof api === 'string') return this.getApi(api);
    return api;
  }

  protected unregisterApi(api: string | ObjectApi) {
    if (typeof api === 'string') this.apis.delete(api);
    else {
      const apis = Array.from(this.apis.entries());
      const entry = apis.find((entry) => entry[1] === api);
      if (entry) this.unregisterApi(entry[0]);
    }
  }

  registerStore(api: ObjectApi, store: ObjectStore<T>) {
    this.registerApi(api.apiBase, api);
    this.stores.set(api, store);
  }

  getStore(api: ObjectApi | string): ObjectStore<T> | undefined {
    if (typeof api === 'string') {
      return this.stores.get(this.resolveApi(api));
    }
    return this.stores.get(api);
  }

  getStores(apis: string[]): (ObjectStore<T> | undefined)[] {
    return apis.map((api) => this.getStore(api));
  }
}

export const apiManager = new ApiManager();
