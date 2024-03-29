/* eslint-disable @typescript-eslint/no-invalid-this */
import { merge } from 'lodash';
import { action, computed, observable, reaction } from 'mobx';
import { ObjectApi, Parameter, Query, SearchQuery } from './api';
import type { Noop, ObjectWatchEvent, WatchApi } from './event';
import { ItemStore } from './item';
import type { IObject } from './object';
import { autobind } from './utils/bind';

type ModifyIObject<T extends IObject> = (obj: T) => void;

@autobind()
export abstract class ObjectStore<T extends IObject> extends ItemStore<T> {
  abstract api: ObjectApi<T>;
  abstract watchApi: WatchApi<T>;

  public limit: number = -1;

  private defers: Noop[] = [];
  private modifyEvtListeners: ModifyIObject<T>[] = [];
  private deleteEvtListeners: ModifyIObject<T>[] = [];

  private querys = (query?: Query): Query => {
    return merge(query);
  };

  addModifyEvtListeners = (m: ModifyIObject<T>): void => {
    this.modifyEvtListeners.push(m);
  };

  addDeleteEvtListeners = (m: ModifyIObject<T>): void => {
    this.deleteEvtListeners.push(m);
  };

  watch = (): void => {
    if (!this.watchApi) return;
    this.bindWatchEventsUpdater();
    this.defers.push(this.watchApi.addListener(this, this.onWatchApiEvent));
    this.defers.push(this.watchApi.subscribe(this));
  };

  @action reset = (): void => {
    if (this.defers) this.defers.reverse().map((cb) => cb());
    if (this.watchApi) this.watchApi.reset();

    this.data.clear();
    this.isLoaded.set(false);
    this.ctx = { limit: { page: 0, size: 1 }, sort: {} };
  };

  // collect items from watch-api events to avoid UI blowing up with huge streams of data
  protected dataBuffers = observable<T>([], { deep: false });

  protected bindDataBuffersUpdater = (delay = 200) => {
    return reaction(
      () => this.dataBuffers.slice()[0],
      () => {},
      {
        delay: delay,
      },
    );
  };

  @action next = async (query?: Query) => {
    const { limit, sort, filter, ...rest } = !query ? this.ctx : query;

    if (limit === undefined || sort === undefined) return;
    this.reset();

    merge(this.ctx, { limit, sort, filter }, rest);
    this.api.store = this;

    this.api
      .page(undefined, this.ctx)
      .then((res) => {
        this.data.replace(res);
        this.isLoaded.set(true);
      })
      .finally(() => {
        // disposer()
      });
  };

  @action load = async (query?: Query) => {
    const q = this.querys(query);
    this.api
      .list(undefined, q)
      .then((items) => this.data.replace(items))
      .finally(() => {
        this.isLoaded.set(true);
      });
  };

  @action get = async (paramster?: Parameter, query?: Query): Promise<T> => {
    const q = this.querys(query);
    const newItem = await this.api.get(paramster, q);
    const index = this.data.findIndex((old: T) => old.uid === newItem.uid);
    if (index < 1) {
      this.data.push(newItem);
    } else {
      this.data.splice(index, 1, newItem);
    }
    return newItem;
  };

  @action create = async (partial?: Partial<T>, query?: Query): Promise<T> => {
    const q = this.querys(query);
    const newItem = await this.api.create(undefined, partial, q);
    this.data.replace([...this.data, newItem]);
    return newItem;
  };

  @action async update_one(
    item: T,
    partial: Partial<T>,
    fields: string[],
    query?: Query,
  ): Promise<T> {
    const q = this.querys(query);
    const newItem = await item.update(this, { fields: fields, item: partial }, item.getUid(), q);
    const index = this.data.findIndex((old: T) => old.uid === newItem?.uid);
    this.data.splice(index, 1, newItem);
    return newItem;
  }

  @action async update(item: T, partial: Partial<T>, query?: Query): Promise<T> {
    const q = this.querys(query);
    const newItem = await item.update(this, partial, q);
    const index = this.data.findIndex((old: T) => old.uid === newItem.uid);
    this.data.splice(index, 1, newItem);
    return newItem;
  }

  @action remove = async (id: string) => {
    this.api.delete(id).then(() => {
      const remain = this.data.filter((item) => item.uid !== id);
      this.data.replace(remain);
    });
  };

  search = async (sq: SearchQuery): Promise<any> => {
    return this.api.search(sq);
  };

  // collect items from watch-api events to avoid UI blowing up with huge streams of data
  protected eventsBuffer = observable<ObjectWatchEvent<T>>([], { deep: false });

  protected bindWatchEventsUpdater = (delay = 1000) => {
    return reaction(() => this.eventsBuffer.slice()[0], this.updateFromEventsBuffer, {
      delay: delay,
    });
  };

  protected onWatchApiEvent = <T extends IObject>(evt: ObjectWatchEvent<T>): void => {
    if (!this.isLoaded) return;
    const { store } = evt;
    if (!store) return;
    if (store.api.apiResource !== this.api.apiResource) throw new Error('type not supported push');
    store.eventsBuffer.push(evt);
  };

  @computed get items() {
    return this.data.slice().reverse();
  }

  @computed get loading() {
    return !this.isLoaded;
  }

  @action
  protected updateFromEventsBuffer() {
    if (!this.eventsBuffer.length) return;
    // create latest non-observable copy of items to apply updates in one action (==single render)
    let items = this.data.slice();
    this.eventsBuffer.clear().forEach(({ type, object }) => {
      if (!object) return;
      const { uid } = object;
      const index = items.findIndex((item) => item.uid === uid);
      const item = items[index];
      switch (type) {
        case 'ADDED':
        case 'MODIFIED':
          const newItem = new this.api.objectConstructor(object);
          if (!item) {
            items.push(newItem);
          } else {
            items.splice(index, 1, newItem);
          }
          this.modifyEvtListeners.forEach((listener) => listener(newItem));
          break;
        case 'DELETED':
          if (item) {
            const deleteItems = items.splice(index, 1);
            for (const listener of this.deleteEvtListeners) {
              for (const deleteItem of deleteItems) {
                listener(deleteItem);
              }
            }
          }
          break;
      }
    });
    // slice to max allowed items
    if (this.limit && this.limit != -1 && items.length > this.limit) {
      items = items.slice(-this.limit);
    }
    // update items
    this.data.replace(items);
  }
}
