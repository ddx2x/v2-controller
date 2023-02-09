import { IObject, ObjectApi, ObjectStore } from '@/client';
import { DefaultWatchApi, WatchApi } from '@/client/event';

export class Customer extends IObject {
  constructor(data: Customer) {
    super(data);
    Object.assign(this, data);
  }
}

const customerApi = new ObjectApi<Customer>({
  url: '/api/v1/customer',
  objectConstructor: Customer,
  service: 'custom',
});

class CustomerStore extends ObjectStore<Customer> {
  api: ObjectApi<Customer>;
  watchApi: WatchApi<Customer>;
  constructor(api: ObjectApi<Customer>, watchApi: WatchApi<Customer>) {
    super();
    this.api = api;
    this.watchApi = watchApi;
  }
}


export const customerStore = new CustomerStore(customerApi, new DefaultWatchApi());
