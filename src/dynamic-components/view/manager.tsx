import type { IObject, ObjectStore, Query } from '@/client';
import type { PageContainerProps } from '../container';
import type { DescriptionsProps } from '../descriptions';
import type { FormProps, StepFormProps } from '../form';
import type { ListProps } from '../list';
import type { TableProps } from '../table';

export declare type View =
  { kind: 'table'; } & TableProps |
  { kind: 'list'; } & ListProps |
  { kind: 'form'; } & FormProps |
  { kind: 'stepForm'; } & StepFormProps |
  { kind: 'descriptions'; } & DescriptionsProps

export declare type Page = { view: View[], container?: PageContainerProps }

export declare type Store = {
  store: ObjectStore<IObject>;
  query?: Query;
  load: (query?: Query) => Promise<void>;
  watch?: () => void;
  exit: () => void;
}

export declare type PageSchema<S extends Store> = {
  page: Page;
  stores?: S[];
}

export class PageManager<S extends Store> {
  private stores = new Map<string, PageSchema<S>>();

  init = (key: string) => {
    (this.stores.get(key)?.stores || []).map(async (store) => {
      store.load && store.load(store.query).
        then(() => {
          if (store.watch) store.watch()
        })
    });
  }

  clear(key: string) {
    (this.stores.get(key)?.stores || []).map((store) => {
      store.exit && store.exit();
    });
  }

  page(key: string): Page | undefined {
    return this.stores.get(key)?.page;
  }

  register(key: string, schema: PageSchema<S>) {
    this.stores.set(key, schema);
  }
}

export const pageManager = new PageManager();
