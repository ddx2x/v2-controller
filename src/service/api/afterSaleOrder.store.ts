import { IObject, ObjectApi, ObjectStore } from '@/client';
import { DefaultWatchApi, WatchApi } from '@/client/event';


export class AfterSaleOrder extends IObject {
  customer: string | undefined
  type: number | undefined
  url: string | undefined
  full_id: string | undefined
  is_view: boolean | undefined
  level: number | undefined
  op: number | undefined
  total: number | undefined
  order_sku_list: any | undefined
  deliveries: any | undefined
  // 

  constructor(data: AfterSaleOrder) {
    super(data);
    Object.assign(this, data);

  }
}

export const afterSaleorderApi = new ObjectApi<AfterSaleOrder>({
  url: '/api/v1/after_sale_order',
  objectConstructor: AfterSaleOrder,
  service: 'trade-t',
});

class AfterSaleOrderStore extends ObjectStore<AfterSaleOrder> {
  api: ObjectApi<AfterSaleOrder>;
  watchApi: WatchApi<AfterSaleOrder>;
  constructor(api: ObjectApi<AfterSaleOrder>, watchApi: WatchApi<AfterSaleOrder>) {
    super();
    this.api = api;
    this.watchApi = watchApi;
  }
}



export const afterSaleOrderStore = new AfterSaleOrderStore(afterSaleorderApi, new DefaultWatchApi());
