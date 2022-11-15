import { observable } from 'mobx';
import type { ObjectData } from './api';
import { autobind } from './utils';


@autobind()
export abstract class ItemStore<T extends ObjectData = any> {
  abstract load(): Promise<T>;
  abstract next(): Promise<T>;

  @observable protected isLoaded = false;
  @observable protected data = observable.array<T>([], { deep: false });

  *[Symbol.iterator]() {
    yield* this.data;
  }
}
