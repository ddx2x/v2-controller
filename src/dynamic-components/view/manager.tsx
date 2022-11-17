import type { IObject, ObjectStore } from '@/client';
import { PageContainerProps } from '../container';
import { DescriptionsProps } from '../descriptions';
import { FormProps, StepFormProps } from '../form';
import { ListProps } from '../list';
import { TableProps } from '../table';

export declare type View =
  { kind: 'table'; } & TableProps |
  { kind: 'list'; } & ListProps |
  { kind: 'form'; } & FormProps |
  { kind: 'stepForm'; } & StepFormProps |
  { kind: 'descriptions'; } & DescriptionsProps

export declare type Page = { view: View[], container?: PageContainerProps }

export declare type PageSchema<S extends ObjectStore<IObject>> = {
  page: Page;
  stores?: S[];
}

export class PageManager<S extends ObjectStore<IObject>> {
  private stores = new Map<string, PageSchema<S>>();

  init(key: string) {
    (this.stores.get(key)?.stores || []).map((store) => {
      store.next(10, '');
    });
  }

  clear(key: string) {
    (this.stores.get(key)?.stores || []).map((store) => {
      store.reset();
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
