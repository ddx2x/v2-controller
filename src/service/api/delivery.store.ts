import { IObject, ObjectApi, ObjectStore } from '@/client';
import { DefaultWatchApi, WatchApi } from '@/client/event';

/*
 "order_id": "64046be66fb1fec6420b2bcd",
    "delivery_type": NumberInt("2"),
    "delivery_content": {
        "Pickup": {
            "pickup_store": "64093a22f8202fd4a0468215",
            "pickup_time": null,
            "pickup_code": "19670113"
        }
    },
    "receiver_name": "dxp",
    "receiver_phone": "dxp",
*/

class Pickup {
  pickup_store: string | undefined;
  pickup_time: string[] | undefined;
  pickup_code: string | undefined;
}

export class Delivery extends IObject {
  order_id: string | undefined;
  receive_address_id:string|undefined;
  delivery_type: string | number | undefined;
  delivery_content: any | undefined;
  receiver_name: string | undefined;
  receiver_phone: string | undefined;

  constructor(data: Delivery) {
    super(data);
    Object.assign(this, data);
  }
}

export const deliveryApi = new ObjectApi<Delivery>({
  url: '/api/v1/delivery',
  objectConstructor: Delivery,
  service: 'trade-t',
});

class DeliveryStore extends ObjectStore<Delivery> {
  api: ObjectApi<Delivery>;
  watchApi: WatchApi<Delivery>;
  constructor(api: ObjectApi<Delivery>, watchApi: WatchApi<Delivery>) {
    super();
    this.api = api;
    this.watchApi = watchApi;
  }
}

export const deliveryStore = new DeliveryStore(deliveryApi, new DefaultWatchApi());
