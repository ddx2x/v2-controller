import { IObject, ObjectApi, ObjectStore } from '@/client';
import { DefaultWatchApi, WatchApi } from '@/client/event';

export class Customer extends IObject {
  name: string | undefined
  phone: string | undefined
  become_time: string | undefined
  is_member: boolean | undefined
  become_member_time: string | undefined
  level: number | string | undefined
  icon: string | undefined
  integral: number | string | undefined
  amount_of_consumption: number | string | undefined
  last_consumption_time: string | undefined
  after_sales_amount: number | string | undefined
  after_sales_times: number | undefined
  freeze: boolean | undefined

  constructor(data: Customer) {
    super(data);
    Object.assign(this, data);
  }
}

const customerApi = new ObjectApi<Customer>({
  url: '/api/v1/customer',
  objectConstructor: Customer,
  service: 'ums-t',
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
