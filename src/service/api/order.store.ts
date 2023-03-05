import { IObject, ObjectApi, ObjectStore } from '@/client';
import { DefaultWatchApi, WatchApi } from '@/client/event';


export interface MerchandiseList {
  image: string,
  title: string,
  uid: string,
  attrs: object
}

export const OrderStateValueEnum = {
  0: { text: '待支付', status: 'processing' },
  1: { text: '待确认', status: 'processing' },
  2: { text: '已支付', status: 'processing' },
  3: { text: '处理中', status: 'processing' },
  4: { text: '已订购', status: 'processing' },

  30: { text: '已入库', status: 'processing' },
  31: { text: '待支付运费', status: 'processing' },
  32: { text: '包裹处理中', status: 'processing' },
  33: { text: '已打包', status: 'processing' },
  34: { text: '已发货', status: 'processing' },
  35: { text: '部分已发货', status: 'processing' },
  36: { text: '全部已发货', status: 'processing' },
  37: { text: '等待客户上门服务（自提）', status: 'processing' },

  100: { text: '部分退款', status: 'processing' },
  101: { text: '已退款', status: 'processing' },
  102: { text: '超期', status: 'Error' },
  103: { text: '包裹退回', status: 'success' },
  104: { text: '无效', status: 'Error' },

  200: { text: '已完成', status: 'Success' },
  201: { text: '已取消', status: 'Success' },
  202: { text: '售后', status: 'Error' },
}


export class Order extends IObject {
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
        delivery_map.set(item.sku._id, item.quantity)
        let attrs: any = {}
        attrs['数量'] = item.quantity
        attrs['价格'] = item.amount

        if (item.sku.spec_name) {
          attrs['规格'] = item.sku.spec_name
        }
        return {
          image: '/media-t/file/' + item.sku?.pic || '',
          title: item.sku?.product_name,
          uid: item.sku?._id,
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
