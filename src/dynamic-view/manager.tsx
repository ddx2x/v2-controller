import { Page, PageSchema, Store } from './typing';

class PageManager<S extends Store<any>> {
  private stores = new Map<string, PageSchema<S>>();

  init = (key: string) =>
    (this.stores.get(key)?.stores || []).map(async (store) => {
      store.load &&
        store.load(store.query).then(() => {
          store.watch && store.watch();
        });
    });

  clear = (key: string) =>
    (this.stores.get(key)?.stores || []).map((store) => {
      store.exit && store.exit();
    });

  page = (key: string): Page | undefined => this.stores.get(key)?.page;

  register = (key: string, schema: PageSchema<S>) => this.stores.set(key, schema);
}

export const pageManager = new PageManager();
