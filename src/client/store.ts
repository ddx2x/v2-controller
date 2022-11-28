/* eslint-disable @typescript-eslint/no-invalid-this */
import { merge } from 'lodash';
import { action, computed, observable, reaction } from 'mobx';
import type { ObjectApi, Query } from './api';
import type { Noop, ObjectWatchEvent, WatchApi } from './event';
import { ItemStore } from './item';
import type { IObject } from './object';
import { autobind } from './utils/bind';

type ModifyIObject<T extends IObject> = (obj: T) => void;

@autobind()
export abstract class ObjectStore<T extends IObject> extends ItemStore<T> {
  abstract api: ObjectApi<T>;
  abstract watchApi: WatchApi<T, ObjectStore<T>>;

  public limit: number = -1;
  public version: number = 0;

  private defers: Noop[] = [];
  private modifyEvtListeners: ModifyIObject<T>[] = [];
  private deleteEvtListeners: ModifyIObject<T>[] = [];

  private querys = (query?: Query): Query => {
    return merge({ limit: this.limit }, query);
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
  };

  @action next = async (query?: Query) => {
    // 0,10 | 10,10 | 20,30 | 50,10 |....
    const { per_page, sort, limit, ...rest } = !query ? { per_page: ((this.ctx.per_page || 0) + (this.ctx.page || 10)), sort: '""', limit: -1 } : query;
    this.limit = limit;

    if (this.ctx.sort !== sort || this.ctx.per_page !== per_page) this.reset();

    const q = this.querys({ ...this.ctx, ...rest });
    this.api.list(q).
      then((items) => {
        this.data.push(...items);
        this.isLoaded.set(true);
        this.ctx = { per_page: per_page, page: this.ctx.page, sort };
      });
  };

  @action load = async (query?: Query) => {
    const q = this.querys(query);
    this.api
      .list(q)
      .then((items) => this.data.replace(items))
      .finally(() => {
        this.isLoaded.set(true);
      });
  };

  @action create = async (partial?: Partial<T>, query?: Query): Promise<T> => {
    const q = this.querys(query);
    const newItem = await this.api.create(partial, q);
    this.data.replace([...this.data, newItem]);
    return newItem;
  };

  @action async update(item: T, partial: Partial<T>, query?: Query): Promise<T> {
    const q = this.querys(query);
    const newItem = await item.update(this, partial, q);
    const index = this.data.findIndex((old: T) => old.uid === newItem.uid);
    this.data.splice(index, 1, newItem);
    return newItem;
  }

  @action remove = async (id: string) => {
    const q = this.querys({ id: id });
    this.api.delete(q).then(() => {
      this.data.filter((item) => item.uid === id);
    });
  };

  // collect items from watch-api events to avoid UI blowing up with huge streams of data
  protected eventsBuffer = observable<ObjectWatchEvent<T>>([], { deep: false });

  protected bindWatchEventsUpdater = (delay = 1000) => {
    return reaction(() =>
      this.eventsBuffer.slice()[0],
      this.updateFromEventsBuffer,
      {
        delay: delay,
      },
    );
  }

  protected onWatchApiEvent = <T extends IObject>(evt: ObjectWatchEvent<T>): void => {
    if (!this.isLoaded) return;
    const { store } = evt;
    if (!store) return;
    if (store.api.apiResource !== this.api.apiResource) throw new Error('type not supported push');
    store.eventsBuffer.push(evt);
  };

  @computed get items() {
    return this.data.slice();
  }

  @computed get loading() {
    return !this.isLoaded
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
