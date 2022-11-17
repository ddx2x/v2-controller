import { observable } from 'mobx';
import type { ObjectData, Query } from './api';
import { autobind } from './utils';


@autobind()
export abstract class ItemStore<T extends ObjectData = any> {
  @observable protected ctx: Query = { page: 0, per_page: 10, sort: '' };
  @observable protected isLoaded = false;
  @observable protected data = observable.array<T>([], { deep: false });

  *[Symbol.iterator]() {
    yield* this.data;
  }
}
