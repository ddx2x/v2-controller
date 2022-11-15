import { IObject, ObjectApi, ObjectStore, ObjectWatchApi } from '@/client';
import { IWatchApi } from '@/client/event';

class Commdity extends IObject {
  name?: string;
  price?: number;
  actualSales?: number;
  salesChannels?: number;
  creationTime?: string;
  availableStatus?: boolean;
}

const commdityApi = new ObjectApi<Commdity>({
  url: '/api/v1/commdity',
  objectConstructor: Commdity,
});

export const watchApi = new ObjectWatchApi();

class CommdityStore extends ObjectStore<Commdity> {
  watchApi: IWatchApi | null;
  api: ObjectApi<Commdity>;

  constructor(api: ObjectApi<Commdity>, watchApi: IWatchApi | null) {
    super();
    this.api = api;
    this.watchApi = watchApi;
  }
}

export const commdityStore = new CommdityStore(commdityApi, null);
