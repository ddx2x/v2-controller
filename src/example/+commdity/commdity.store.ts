import { IObject, ObjectApi, ObjectStore, ObjectWatchApi, SearchObject } from '@/client';
import type { WatchApi } from '@/client/event';
import { request } from '@umijs/max';

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

export const commditySearchApi = {
  search: async (
    query: {
      text: string | number,
      offset: number,
      limit: number
    }
  ) => {
    return request(
      '/search/api/v1/Product',
      { method: 'GET', params: query }
    )
  }
}

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
