/* eslint-disable @typescript-eslint/no-invalid-this */
import { merge } from 'lodash';
import { action, computed, observable, reaction } from 'mobx';
import type { IQuery, ObjectApi } from './api';
import type { IObjectWatchEvent, IWatchApi, Noop } from './event';
import { ItemStore } from './item';
import type { IObject } from './object';
import { autobind } from './utils/bind';


type ModifyIObject<T extends IObject> = (obj: T) => void;

@autobind()
export abstract class ObjectStore<T extends IObject> extends ItemStore<T> {
  abstract api: ObjectApi<T>;

  public limit: number = -1;
  public version: number = 0;

  private defers: Noop[] = [];
  private modifyEvtListeners: ModifyIObject<T>[] = [];
  private deleteEvtListeners: ModifyIObject<T>[] = [];

  protected watchApi: IWatchApi;

  constructor(watchApi: IWatchApi) {
    super();
    this.watchApi = watchApi
  }

  private querys = (query?: IQuery): IQuery => {
    return merge({ limit: this.limit }, query);
  }

  addModifyEvtListeners = (m: ModifyIObject<T>): void => {
    this.modifyEvtListeners.push(m)
  }

  addDeleteEvtListeners = (m: ModifyIObject<T>): void => {
    this.deleteEvtListeners.push(m)
  }

  watch = (): void => {
    this.bindWatchEventsUpdater();
    this.defers.push(this.watchApi.addListener(this, this.onWatchApiEvent));
    this.defers.push(this.watchApi.subscribe(this.api));
  }

  @action reset = (): void => {
    this.defers.reverse().map((cb) => cb());
    this.watchApi.reset();
    this.data.clear();
    this.isLoaded = false;
  }

  @action loadAll = async (query?: IQuery) => {
    const q = this.querys(query);
    this.api.list(q).
      then((items) => this.data.replace(items)).
      finally(() => { this.isLoaded = true })
  };

  @action create = async (
    partial?: Partial<T>,
    query?: IQuery,
  ): Promise<T> => {
    const q = this.querys(query);
    const newItem = await this.api.create(partial, q);
    this.data.replace([...this.data, newItem]);
    return newItem;
  }

  @action async update(
    item: T,
    partial: Partial<T>,
    query?: IQuery,
  ): Promise<T> {
    const q = this.querys(query);
    const newItem = await item.update(this, partial, q);
    const index = this.data.findIndex((old: T) => old.uid === newItem.uid);
    this.data.splice(index, 1, newItem);
    return newItem;
  }

  @action remove = async (
    id: string
  ) => {
    const q = this.querys({ id: id });
    this.api.delete(q).
      then(() => {
        this.data.filter((item) => item.uid === id);
      });
  }

  // collect items from watch-api events to avoid UI blowing up with huge streams of data
  protected eventsBuffer = observable<IObjectWatchEvent<IObject>>([], {
    deep: false,
  });

  protected bindWatchEventsUpdater(delay = 1000) {
    return reaction(() => this.eventsBuffer.slice()[0], this.updateFromEventsBuffer, {
      delay: delay,
    });
  }

  protected onWatchApiEvent = (evt: IObjectWatchEvent): void => {
    if (!this.isLoaded) return;
    const { store } = evt;
    if (!store) {
      return;
    }
    if (store.api.apiResource !== this.api.apiResource) {
      throw new Error('type not supported push');
    }
    store.eventsBuffer.push(evt);
  }

  @computed get items() {
    return this.data.slice();
  }

  @action
  protected updateFromEventsBuffer() {
    if (!this.eventsBuffer.length) {
      return;
    }
    // create latest non-observable copy of items to apply updates in one action (==single render)
    let items = this.data.slice();
    this.eventsBuffer.clear().forEach(({ type, object }) => {
      if (!object) {
        return;
      }
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