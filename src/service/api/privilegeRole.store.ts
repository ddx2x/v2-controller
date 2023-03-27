import { IObject, ObjectApi, ObjectStore } from '@/client';
import { DefaultWatchApi, WatchApi } from '@/client/event';

export class Role extends IObject {
  name: string | undefined;
  type: number | string | undefined;
  privileges: string[] | undefined;
  use_count: number | undefined;
  constructor(data: Role) {
    super(data);
    Object.assign(this, data);
    this.use_count = data.use_count || 0;
  }
}

export const roleApi = new ObjectApi<Role>({
  url: '/api/v1/role',
  objectConstructor: Role,
  service: 'base',
});

class RoleStore extends ObjectStore<Role> {
  api: ObjectApi<Role>;
  watchApi: WatchApi<Role>;
  constructor(api: ObjectApi<Role>, watchApi: WatchApi<Role>) {
    super();
    this.api = api;
    this.watchApi = watchApi;
  }
}

export const roleStore = new RoleStore(roleApi, new DefaultWatchApi());

export class RolePrivilege extends IObject {
  role_id: string | undefined;
  privilege_id: string | undefined;
  privilege_name: string | undefined;
  constructor(data: Role) {
    super(data);
    Object.assign(this, data);
  }
}

export const rolePrivilegeApi = new ObjectApi<RolePrivilege>({
  url: '/api/v1/role_privileges',
  service: 'base',
});
