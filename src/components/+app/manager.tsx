import { ObjectStore } from '@/client';
import { observable } from 'mobx';
import { DescriptionsLayout, ListLayout, TableLayout } from '../kit';

export type LayoutType = 'table' | 'list' | 'descriptions';

interface ApiResource {
  table?: TableLayout;
  list?: ListLayout;
  descriptions?: DescriptionsLayout;
  stores?: ObjectStore<any>[];
}

export class AppManager {
  private stores = observable.map<string, ApiResource>();

  initStores(route: string) {
    (this.stores.get(route)?.stores || []).map((store) => {
      store.loadAll();
      store.watch();
    });
  }

  clearStores(route: string) {
    (this.stores.get(route)?.stores || []).map((store) => {
      store.stop();
    });
  }

  getLayout(route: string, T: LayoutType) {
    switch (T) {
      case 'table':
        return this.stores.get(route)?.table;
      case 'list':
        return this.stores.get(route)?.list;
      case 'descriptions':
        return this.stores.get(route)?.descriptions;
      default:
        return null;
    }
  }

  register(route: string, apiResource: ApiResource) {
    let exist: ApiResource = apiResource;
    if (this.stores.has(route)) {
      exist = Object.assign(this.stores.get(route) || {}, exist);
    }
    this.stores.set(route, exist);
  }
}

export const appManager = new AppManager();
