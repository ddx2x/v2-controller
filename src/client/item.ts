import { observable } from 'mobx';
import type { ObjectData } from './api';
import { autobind } from './utils';


export interface Pagination {
  page: number;
  per_page: number;
  sort: string;
}

@autobind()
export abstract class ItemStore<T extends ObjectData = any> {
  @observable protected ctx: Pagination = { page: 0, per_page: 10, sort: "" };
  @observable protected isLoaded = false;
  @observable protected data = observable.array<T>([], { deep: false });

  *[Symbol.iterator]() {
    yield* this.data;
  }
}
