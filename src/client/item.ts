import { observable } from 'mobx';
import type { ObjectData, Query } from './api';
import { autobind } from './utils';


@autobind()
export abstract class ItemStore<T extends ObjectData = any> {
  @observable protected ctx: Query = { page: 100, per_page: 0, sort: '""' };
  @observable protected isLoaded = observable.box(true);
  @observable protected data = observable.array<T>([], { deep: false });

  *[Symbol.iterator]() {
    yield* this.data;
  }
}
