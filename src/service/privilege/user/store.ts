import { IObject, ObjectApi, ObjectStore } from '@/client';
import { DefaultWatchApi, WatchApi } from '@/client/event';

export class User extends IObject {
  name: string | undefined
  phone_number: string | undefined
  login_type: number | undefined
  last_login_time: number | undefined
  is_lock: boolean | undefined

  constructor(data: User) {
    super(data);
    Object.assign(this, data);
  }
}

export const userApi = new ObjectApi<User>({
  url: '/api/v1/user',
  objectConstructor: User,
  service: 'base',
});

class UserStore extends ObjectStore<User> {
  api: ObjectApi<User>;
  watchApi: WatchApi<User>;
  constructor(api: ObjectApi<User>, watchApi: WatchApi<User>) {
    super();
    this.api = api;
    this.watchApi = watchApi;
  }
}


export const userStore = new UserStore(userApi, new DefaultWatchApi());
