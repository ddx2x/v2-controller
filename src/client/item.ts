import { observable } from 'mobx';
import type { ObjectData, Query } from './api';
import { autobind } from './utils';


@autobind()
export abstract class ItemStore<T extends ObjectData = any> {
  @observable protected ctx: Query = { page: 0, size: 10 };
  @observable protected isLoaded = observable.box(true);
  @observable protected data = observable.array<T>([], { deep: false });

  *[Symbol.iterator]() {
    yield* this.data;
  }
}
