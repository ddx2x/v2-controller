import { merge } from 'lodash';
import { action, computed, observable, reaction } from 'mobx';
import { ItemStore } from './item.store';
import { IObject } from './object';
import { IObjectApiQueryParams, ObjectApi, WatchApi } from './object.api';
import { IObjectWatchEvent } from './object.event.api';
import { objectWatchApi } from './object.watch.api';
import { autobind } from './utils/bind';

export interface IObjectStoreParams {}

type NoopCB = () => void;

type ModifyIObject<T extends IObject> = (obj: T) => void;

@autobind()
export abstract class ObjectStore<T extends IObject> extends ItemStore<T> {
  abstract api: ObjectApi<T>;
  public limit: number = -1;

  private defers: NoopCB[] = [];
  public modifyEvtListeners: ModifyIObject<T>[] = [];
  public deleteEvtListeners: ModifyIObject<T>[] = [];

  protected watchApi: WatchApi = objectWatchApi;

  watch() {
    this.bindWatchEventsUpdater();
    this.defers.push(...[this.watchApi.addListener(this, this.onWatchApiEvent)]);
    this.defers.push(...this.api.submitSubscribe(this.watchApi));
  }

  stop() {
    this.defers.reverse().map((cb) => cb());
    this.watchApi.reset();
  }

  unregiter() {
    this.defers.reverse().map((cb) => cb());
    this.watchApi.unregister();
  }

  reset() {
    this.unregiter();
    this.watchApi.reset();
  }

  private loadItems = async (ns?: string[]): Promise<T[]> => {
    const { limit } = this;
    const querys = this.querys({ limit });
    if (!ns || ns.length == 0) {
      return this.api.list({}, querys);
    } else {
      return Promise.all(ns.map((ns) => this.api.list({ ns }), querys)).then((items) =>
        items.flat(),
      );
    }
  };

  @action loadAll = async () => {
    let items: T[] = [];
    this.isLoading = true;
    try {
      items = await this.loadItems();
    } catch (e) {
      console.log(this.constructor.name, 'loadAll error:', e);
    } finally {
      if (this._items) {
        this._items.replace(items);
      }
      this.isLoaded = true;
      this.isLoading = false;
    }
  };

  protected async createItem(
    params: IObjectStoreParams,
    data?: Partial<T>,
    query?: IObjectApiQueryParams,
  ): Promise<T> {
    return this.api.create(params, data, query);
  }

  @action async create(
    params: IObjectStoreParams,
    data?: Partial<T>,
    query?: IObjectApiQueryParams,
  ): Promise<T> {
    const querys = this.querys(query);
    const newItem = await this.createItem(params, data, querys);
    if (this._items.findIndex((item) => item?.getId() === newItem?.getId()) > 0) {
      return newItem;
    }
    const items = this.sortItems([...this._items, newItem]);
    this._items.replace(items);
    return newItem;
  }

  @action async apply(
    item: T,
    data?: Partial<T> | undefined,
    query?: IObjectApiQueryParams,
  ): Promise<T> {
    const querys = this.querys(query);
    if (
      this._items.findIndex((item) => {
        item.getId() == item.getId();
      }) > 0
    ) {
      return this.update(item, data, querys);
    }
    return this.create({}, data, querys);
  }

  protected querys(query?: IObjectApiQueryParams): IObjectApiQueryParams {
    // 数据库分库后增加查询条件（database | schmea split by tenant)
    return merge({}, query);
  }

  @action async update(
    item: T,
    data: Partial<T> | undefined,
    query?: IObjectApiQueryParams,
  ): Promise<T> {
    // 从`api update`更新成功以后回写入`itemsStore item`
    const querys = this.querys(query);
    const newItem = await item.update(this, data, querys);
    const index = this._items.findIndex((item) => item.getId() === newItem.getId());
    this._items.splice(index, 1, newItem);
    return newItem;
  }

  @action async remove(
    item: { ns: string; id: string } | T,
    query?: IObjectApiQueryParams,
  ): Promise<T> {
    // 从`api delete`更新成功以后移除`itemsStore item`
    let id, ns;
    if (item instanceof IObject) {
      id = item.getId();
    } else {
      id = item.id;
    }
    const querys = this.querys(query);
    const removeItem = await this.api.delete({ id }, querys).then((item) => {
      this.removeItem(item);
      return item;
    });
    return removeItem;
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

  protected onWatchApiEvent(evt: IObjectWatchEvent) {
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
    return this._items.slice();
  }

  @action
  protected updateFromEventsBuffer() {
    if (!this.eventsBuffer.length) {
      return;
    }
    // create latest non-observable copy of items to apply updates in one action (==single render)
    let items = this._items.slice();
    this.eventsBuffer.clear().forEach(({ type, object }) => {
      if (!object) {
        return;
      }
      const { uid } = object;
      const index = items.findIndex((item) => item.getId() === uid);
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
    this._items.replace(this.sortItems(items));
  }
}
