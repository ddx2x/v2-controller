import { IObject, ObjectApi, ObjectStore, ObjectWatchApi } from '@/client';
import type { WatchApi } from '@/client/event';

class Commdity extends IObject {
  name?: string;
  title?: string;
  brand_name?: string;


  constructor(data: Commdity) {
    super(data);
    Object.assign(this, data);
  }
}

const commdityApi = new ObjectApi<Commdity>({
  url: '/api/v1/Product',
  objectConstructor: Commdity,
  service: "prod",
});

class CommdityStore extends ObjectStore<Commdity> {
  watchApi: WatchApi<Commdity, CommdityStore>;
  api: ObjectApi<Commdity>;
  constructor(api: ObjectApi<Commdity>, watchApi: WatchApi<Commdity, CommdityStore>) {
    super();
    this.api = api;
    this.watchApi = watchApi;
  }
}

export const productWatchApi = new ObjectWatchApi();
export const commdityStore = new CommdityStore(commdityApi, productWatchApi);
