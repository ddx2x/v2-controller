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
  deliveries: any | undefined
  // 
  merchandise_list: MerchandiseList[] | undefined
  total_render: number | undefined
  delivery_map: Map<string, number> | undefined


  constructor(data: Order) {
    super(data);
    Object.assign(this, data);

    let delivery_map = new Map();

    this.total_render = this.total ? this.total / 100 : 0
    this.merchandise_list = this.order_sku_list?.map(
      (item: any) => {
        delivery_map.set(item.sku.uid, item.quantity)
        let attrs: any = {}
        attrs['数量'] = item.quantity
        attrs['价格'] = item.amount

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


    this.deliveries?.map(
      (item: any) => {
        item.sku_list?.map((sku: any) => {
          let quantity = delivery_map.get(sku.sku_id) - sku.quantity
          delivery_map.set(sku.sku_id, quantity)
        })


      }
    )
    this.delivery_map = delivery_map
    console.log('delivery_map', this.delivery_map);

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
