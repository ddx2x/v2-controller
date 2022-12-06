import { IObject, ObjectApi, ObjectStore, ObjectWatchApi } from '@/client';
import { WatchApi } from '@/client/event';

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
  watchApi: WatchApi<Customer, CustomerStore>;
  constructor(api: ObjectApi<Customer>, watchApi: WatchApi<Customer, CustomerStore>) {
    super();
    this.api = api;
    this.watchApi = watchApi;
  }
}

export const objectWatchApi = new ObjectWatchApi();
export const customerStore = new CustomerStore(customerApi, objectWatchApi);
