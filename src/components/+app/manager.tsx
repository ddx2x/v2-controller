import { observable } from 'mobx';
import { DescriptionsLayout, ListLayout, TableLayout } from '../kit';

export type LayoutType = 'table' | 'list' | 'descriptions';

interface Layout {
  table?: TableLayout;
  list?: ListLayout;
  descriptions?: DescriptionsLayout;
}

export class AppManager {
  private stores = observable.map<string, Layout>();

  get(route: string, T: LayoutType) {
    console.log('stores', this.stores);

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

  register(route: string, layout: Layout) {
    let exist: Layout = layout;
    if (this.stores.has(route)) {
      exist = Object.assign(this.stores.get(route) || {}, exist);
    }
    this.stores.set(route, exist);
  }
}

export const appManager = new AppManager();
