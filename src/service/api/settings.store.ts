import { IObject,ObjectApi,ObjectStore } from '@/client';
import { DefaultWatchApi,WatchApi } from '@/client/event';

export class Shop extends IObject {
  name: string | undefined
  address: string | undefined
  industry: string | undefined
  logo: string | object | undefined
  introduction: string | undefined
  mode: number | string | undefined
  recommend_door: boolean | string | undefined
  recommend_door_name: string | undefined

  constructor(data: Shop) {
    super(data);
    Object.assign(this, data);
  }
}

export const shopApi = new ObjectApi<Shop>({
  url: '/api/v1/shop',
  objectConstructor: Shop,
  service: 'settings',
});

class ShopStore extends ObjectStore<Shop> {
  api: ObjectApi<Shop>;
  watchApi: WatchApi<Shop>;
  constructor(api: ObjectApi<Shop>, watchApi: WatchApi<Shop>) {
    super();
    this.api = api;
    this.watchApi = watchApi;
  }
}

export const shopStore = new ShopStore(shopApi, new DefaultWatchApi());



export class ProductSetting extends IObject {
  pic_mode: number | string | undefined;
  product_comment_status: boolean | undefined;
  auto_comment_day: number | string | undefined;
  auto_comment_content: string | undefined;
  product_import_setting: boolean | undefined;
  product_distribute_setting: boolean | undefined;

  constructor(data: ProductSetting) {
    super(data);
    Object.assign(this, data);
    this.pic_mode = String(this.pic_mode);
    this.auto_comment_day = String(this.auto_comment_day);
  }
}

class ProductSettingStore extends ObjectStore<ProductSetting> {
  api: ObjectApi<ProductSetting>;
  watchApi: WatchApi<ProductSetting>;
  constructor(api: ObjectApi<ProductSetting>, watchApi: WatchApi<ProductSetting>) {
    super();
    this.api = api;
    this.watchApi = watchApi;
  }
}

export const productSettingApi = new ObjectApi<ProductSetting>({
  url: '/api/v1/product',
  objectConstructor: ProductSetting,
  service: 'settings',
});

export const productSettingStore = new ProductSettingStore(productSettingApi, new DefaultWatchApi());






export class OrderSetting extends IObject {

  automatically_close_unpaid_orders_time: number | string | undefined
  automatic_receipt_of_shipped_orders_time: number | string | undefined
  types_of_aftermarket_support_after_shipment: number[] | string[] | undefined
  after_sale_coupon_setting: number | string | undefined
  predelivery_and_aftersales_application_settings: boolean | undefined
  after_sale_prompts: string | undefined
  buyer_initiates_refund_request_day: number | string | undefined
  auto_confirm_buyer_has_returned_day: number | string | undefined
  buyer_return_method_setting: number[] | string[] | undefined

  constructor(data: OrderSetting) {
    super(data);
    Object.assign(this, data);

  }

}

class OrderSettingStore extends ObjectStore<OrderSetting> {
  api: ObjectApi<OrderSetting>;
  watchApi: WatchApi<OrderSetting>;
  constructor(api: ObjectApi<OrderSetting>, watchApi: WatchApi<OrderSetting>) {
    super();
    this.api = api;
    this.watchApi = watchApi;
  }
}

export const orderSettingApi = new ObjectApi<OrderSetting>({
  url: '/api/v1/order',
  objectConstructor: OrderSetting,
  service: 'settings',
});

export const orderSettingStore = new OrderSettingStore(orderSettingApi, new DefaultWatchApi());



