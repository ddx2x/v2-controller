import { IObject, ObjectApi, ObjectStore } from '@/client';
import { DefaultWatchApi, WatchApi } from '@/client/event';

export class Privilege extends IObject {
  type: number | undefined
  url: string | undefined
  full_id: string | undefined
  is_view: boolean | undefined
  level: number | undefined
  op: number | undefined

  constructor(data: Privilege) {
    super(data);
    Object.assign(this, data);
  }
}

export const privilegeApi = new ObjectApi<Privilege>({
  url: '/api/v1/privilege',
  objectConstructor: Privilege,
  service: 'base',
});

class UserStore extends ObjectStore<Privilege> {
  api: ObjectApi<Privilege>;
  watchApi: WatchApi<Privilege>;
  constructor(api: ObjectApi<Privilege>, watchApi: WatchApi<Privilege>) {
    super();
    this.api = api;
    this.watchApi = watchApi;
  }
}

export const privilegeStore = new UserStore(privilegeApi, new DefaultWatchApi());
