import { IObject, ObjectApi, ObjectStore } from '@/client';
import type { IWatchApi } from '@/client/event';
import { DefaultWatchApi } from '@/client/event';

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
  watchApi: IWatchApi;
  api: ObjectApi<Commdity>;
  constructor(api: ObjectApi<Commdity>, watchApi: IWatchApi) {
    super();
    this.api = api;
    this.watchApi = watchApi;
  }
}

export const commdityStore = new CommdityStore(commdityApi, new DefaultWatchApi());
