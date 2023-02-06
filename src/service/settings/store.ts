import { IObject, ObjectApi, ObjectStore } from '@/client';
import { DefaultWatchApi, WatchApi } from '@/client/event';

export class Shop extends IObject {
  name: string | undefined
  address: string | undefined
  industry: string | undefined
  logo: string | object | undefined
  introduction: string | undefined
  mode: number | string | undefined
  recommend_door: boolean | string | undefined
  recommend_door_name: string | undefined

  constructor(data: Shop) {
    super(data);
    Object.assign(this, data);
  }
}

export const shopApi = new ObjectApi<Shop>({
  url: '/api/v1/shop',
  objectConstructor: Shop,
  service: 'settings',
});

class ShopStore extends ObjectStore<Shop> {
  api: ObjectApi<Shop>;
  watchApi: WatchApi<Shop>;
  constructor(api: ObjectApi<Shop>, watchApi: WatchApi<Shop>) {
    super();
    this.api = api;
    this.watchApi = watchApi;
  }
}

export const shopStore = new ShopStore(shopApi, new DefaultWatchApi());



export class Door extends IObject {
  name: string | undefined

  constructor(data: Door) {
    super(data);
    Object.assign(this, data);
  }

}

class DoorStore extends ObjectStore<Shop> {
  api: ObjectApi<Shop>;
  watchApi: WatchApi<Shop>;
  constructor(api: ObjectApi<Shop>, watchApi: WatchApi<Shop>) {
    super();
    this.api = api;
    this.watchApi = watchApi;
  }

  selectDoorOptions() {
    return this.items.reduce((accumulator, value) => {
      return { ...accumulator, [value.uid]: { text: value.uid } };
    }, {});
  }
}

export const doorApi = new ObjectApi<Door>({
  url: '/api/v1/door',
  objectConstructor: Door,
  service: 'settings',
});
export const doorStore = new DoorStore(shopApi, new DefaultWatchApi());