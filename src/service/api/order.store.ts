import { IObject, ObjectApi, ObjectStore } from '@/client';
import { DefaultWatchApi, WatchApi } from '@/client/event';


export interface MerchandiseList {
  image: string,
  title: string,
  uid: string,
  attrs: object
}


export class Order extends IObject {
  type: number | undefined
  url: string | undefined
  full_id: string | undefined
  is_view: boolean | undefined
  level: number | undefined
  op: number | undefined
  total: number | undefined
  order_sku_list: any | undefined
  // 
  merchandise_list: MerchandiseList[] | undefined
  total_render: number | undefined


  constructor(data: Order) {
    super(data);
    Object.assign(this, data);
    this.total_render = this.total ? this.total / 100 : 0
    this.merchandise_list = this.order_sku_list?.map(
      (item: any) => {
        let attrs: any = {}
        if (item.quantity) {
          attrs['数量'] = item.quantity
        }
        if (item.amount) {
          attrs['价格'] = item.amount
        }
        if (item.sku.spec_name) {
          attrs['规格'] = item.sku.spec_name
        }
        return {
          image: '/media-t/file/' + item.sku?.pic || '',
          title: item.sku?.product_name,
          uid: item.sku?.uid,
          attrs: attrs
        }
      }
    )


  }
}

export const orderApi = new ObjectApi<Order>({
  url: '/api/v1/order',
  objectConstructor: Order,
  service: 'trade-t',
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