import { IObject, ObjectApi, ObjectStore } from '@/client';
import { DefaultWatchApi, WatchApi } from '@/client/event';
import { MerchandiseList } from './order.store';


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

  merchandise_list: MerchandiseList[] | undefined
  total_render: number | undefined

  constructor(data: AfterSaleOrder) {
    super(data);
    Object.assign(this, data);


    this.total_render = this.total ? this.total / 100 : 0
    this.merchandise_list = this.order_sku_list?.map(
      (item: any) => {
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
