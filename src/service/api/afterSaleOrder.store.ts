import { IObject, ObjectApi, ObjectStore } from '@/client';
import { DefaultWatchApi, WatchApi } from '@/client/event';
import { MerchandiseList } from './order.store';


export const AfterSaleOrderStateValueEnum = {
  1: { text: '等待商家确认', status: 'success' },
  2: { text: '商家已接受', status: 'processing' },
  3: { text: '商家拒绝', status: 'warning' },

  10: { text: '等待寄回', status: 'processing' },
  11: { text: '商品寄回中', status: 'processing' },
  12: { text: '商品已寄回', status: 'processing' },
  13: { text: '商品已寄出', status: 'processing' },
  14: { text: '商品已到达', status: 'processing' },

  20: { text: '客户确认收货', status: 'processing' },
  21: { text: '已取消', status: 'processing' },
  22: { text: '已完成', status: 'processing' },
}

export const AfterSaleOrderTypeValueEnum = {
  1: { text: '退货', status: 'success' },
  2: { text: '换货', status: 'success' },
  3: { text: '仅退款', status: 'success' },
}


export class AfterSaleOrder extends IObject {
  customer: string | undefined
  typ: number | undefined
  url: string | undefined
  full_id: string | undefined
  is_view: boolean | undefined
  level: number | undefined
  op: number | undefined
  total: number | undefined
  order_sku_list: any | undefined
  deliveries: any | undefined
  state: number | undefined
  order_id: string | undefined
  remark: any | undefined
  // 

  merchandise_list: MerchandiseList[] | undefined
  total_render: number | undefined
  remark_title: string | undefined
  remark_spec: string | undefined


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
