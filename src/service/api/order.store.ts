import { IObject, ObjectApi, ObjectStore } from '@/client';
import { DefaultWatchApi, WatchApi } from '@/client/event';

export class Order extends IObject {
  type: number | undefined
  url: string | undefined
  full_id: string | undefined
  is_view: boolean | undefined
  level: number | undefined
  op: number | undefined

  constructor(data: Order) {
    super(data);
    Object.assign(this, data);
  }
}

export const orderApi = new ObjectApi<Order>({
  url: '/api/v1/order',
  objectConstructor: Order,
  service: 'base',
});

class OrderStore extends ObjectStore<Order> {
  api: ObjectApi<Order>;
  watchApi: WatchApi<Order>;
  constructor(api: ObjectApi<Order>, watchApi: WatchApi<Order>) {
    super();
    this.api = api;
    this.watchApi = watchApi;
  }
}



export const orderStore = new OrderStore(orderApi, new DefaultWatchApi());
