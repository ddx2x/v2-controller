import { observable } from 'mobx';
import type { ObjectData, Query } from './api';
import { autobind } from './utils';

@autobind()
export abstract class ItemStore<T extends ObjectData = any> {
  @observable protected ctx: Query = { limit: { page: 0, size: 10 }, sort: {} };
  @observable protected isLoaded = observable.box(true);
  @observable count = observable.box(0);
  @observable protected data = observable.array<T>([], { deep: false });

  *[Symbol.iterator]() {
    yield* this.data;
  }
}
