import { IObject, ObjectApi, ObjectStore } from '@/client';
import type { IWatchApi } from '@/client/event';
import { DefaultWatchApi } from '@/client/event';

class Commdity extends IObject {
  name?: string = '';
  price?: number = 0;
  actualSales?: number = 0;
  salesChannels?: number = 0;
  creationTime?: string = '';
  availableStatus?: boolean = false;
}

const commdityApi = new ObjectApi<Commdity>({
  url: '/api/v1/commdity',
  objectConstructor: Commdity,
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
