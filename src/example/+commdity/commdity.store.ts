import { IObject, ObjectApi, ObjectStore, ObjectWatchApi } from '@/client';
import type { WatchApi } from '@/client/event';

class Commodity extends IObject {
  name?: string
  title?: string
  sub_title?: string
  images?: any[]
  brand_name?: string
  state?: number

  constructor(data: Commodity) {
    super(data);
    Object.assign(this, data);
  }
}

const commdityApi = new ObjectApi<Commodity>({
  url: '/api/v1/commodity',
  objectConstructor: Commodity,
  service: "prod",
});

class CommdityStore extends ObjectStore<Commodity> {
  watchApi: WatchApi<Commodity, CommdityStore>;
  api: ObjectApi<Commodity>;
  constructor(api: ObjectApi<Commodity>, watchApi: WatchApi<Commodity, CommdityStore>) {
    super();
    this.api = api;
    this.watchApi = watchApi;
  }
}

export const productWatchApi = new ObjectWatchApi();
export const commdityStore = new CommdityStore(commdityApi, productWatchApi);
