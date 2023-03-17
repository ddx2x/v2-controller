import { IObject, ObjectApi, ObjectStore } from '@/client';
import { DefaultWatchApi, WatchApi } from '@/client/event';

export class Role extends IObject {
  name: string | undefined;
  type: number | string | undefined;
  privileges: string[] | string | undefined;
  constructor(data: Role) {
    super(data);
    Object.assign(this, data);
    if (this.privileges && Object.keys(this.privileges).length > 0) {
      this.privileges = String(this.privileges);
    }
  }
}

export const roleApi = new ObjectApi<Role>({
  url: '/api/v1/role',
  objectConstructor: Role,
  service: 'base',
});

class UserStore extends ObjectStore<Role> {
  api: ObjectApi<Role>;
  watchApi: WatchApi<Role>;
  constructor(api: ObjectApi<Role>, watchApi: WatchApi<Role>) {
    super();
    this.api = api;
    this.watchApi = watchApi;
  }
}

export const roleStore = new UserStore(roleApi, new DefaultWatchApi());
