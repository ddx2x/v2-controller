import { IObject, ObjectApi, ObjectStore } from '@/client';
import { DefaultWatchApi, WatchApi } from '@/client/event';

export class Shop extends IObject {
  name: string | undefined;
  address: string | undefined;
  industry: string | undefined;
  logo: string | object | undefined;
  introduction: string | undefined;
  mode: number | string | undefined;
  recommend_door: boolean | string | undefined;
  recommend_door_name: string | undefined;

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

export const productSettingStore = new ProductSettingStore(
  productSettingApi,
  new DefaultWatchApi(),
);

export class OrderSetting extends IObject {
  automatically_close_unpaid_orders_time: number | string | undefined;
  automatic_receipt_of_shipped_orders_time: number | string | undefined;
  types_of_aftermarket_support_after_shipment: number[] | string[] | undefined;
  after_sale_coupon_setting: number | string | undefined;
  predelivery_and_aftersales_application_settings: boolean | undefined;
  after_sale_prompts: string | undefined;
  buyer_initiates_refund_request_day: number | undefined;
  auto_confirm_buyer_has_returned_day: number | undefined;
  buyer_return_method_setting: number[] | string[] | undefined;

  constructor(data: OrderSetting) {
    super(data);
    Object.assign(this, data);
    this.types_of_aftermarket_support_after_shipment =
      this.types_of_aftermarket_support_after_shipment?.map((item) => String(item));
    this.after_sale_coupon_setting = String(this.after_sale_coupon_setting);
    this.buyer_return_method_setting = this.buyer_return_method_setting?.map((item) =>
      String(item),
    );
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

export class DeliverySetting extends IObject {
  name: string | undefined;
  type: number | string | undefined;
  pricing_method: number | string | undefined;
  constructor(data: DeliverySetting) {
    super(data);
    Object.assign(this, data);
    this.type = String(this.type);
    this.pricing_method = String(this.pricing_method);
  }
}

class DeliverySettingStore extends ObjectStore<DeliverySetting> {
  api: ObjectApi<DeliverySetting>;
  watchApi: WatchApi<DeliverySetting>;
  constructor(api: ObjectApi<DeliverySetting>, watchApi: WatchApi<DeliverySetting>) {
    super();
    this.api = api;
    this.watchApi = watchApi;
  }
}

export const deliverySettingApi = new ObjectApi<DeliverySetting>({
  url: '/api/v1/delivery',
  objectConstructor: DeliverySetting,
  service: 'settings',
});

export const deliverySettingStore = new DeliverySettingStore(
  deliverySettingApi,
  new DefaultWatchApi(),
);

export class DeliverySettingTemplate extends IObject {
  region: string[] | string | undefined;
  delivery_id: string | undefined; //配送模板ID
  first: number | string | undefined; //首件/首重/首体积
  freight: number | string | undefined; //运费
  continuation: number | string | undefined; //续件/续重/续体积
  continuation_freight: number | string | undefined; //续费

  constructor(data: DeliverySettingTemplate) {
    super(data);
    Object.assign(this, data);
    if (typeof this.region == 'string') {
      return;
    }
    this.region = this.region?.join('、');
  }
}

class DeliverySettingTemplateStore extends ObjectStore<DeliverySettingTemplate> {
  api: ObjectApi<DeliverySettingTemplate>;
  watchApi: WatchApi<DeliverySettingTemplate>;
  constructor(
    api: ObjectApi<DeliverySettingTemplate>,
    watchApi: WatchApi<DeliverySettingTemplate>,
  ) {
    super();
    this.api = api;
    this.watchApi = watchApi;
  }
}

export const deliverySettingTemplateApi = new ObjectApi<DeliverySettingTemplate>({
  url: '/api/v1/delivery_template',
  objectConstructor: DeliverySettingTemplate,
  service: 'settings',
});

export const deliverySettingTemplateStore = new DeliverySettingTemplateStore(
  deliverySettingTemplateApi,
  new DefaultWatchApi(),
);

//
export class StorePickup extends IObject {
  pick_up_name: string | undefined;
  pick_up_address: string | undefined;
  owner_store_name: string | undefined;
  contact: string | undefined;
  business_days: string[] | undefined;
  coordinates: string[] | number[] | string | undefined;
  state: boolean | undefined;
  constructor(data: StorePickup) {
    super(data);
    Object.assign(this, data);
  }
}

class StorePickupStore extends ObjectStore<StorePickup> {
  api: ObjectApi<StorePickup>;
  watchApi: WatchApi<StorePickup>;
  constructor(api: ObjectApi<StorePickup>, watchApi: WatchApi<StorePickup>) {
    super();
    this.api = api;
    this.watchApi = watchApi;
  }
}

export const storePickupApi = new ObjectApi<StorePickup>({
  url: '/api/v1/store_pickup',
  objectConstructor: StorePickup,
  service: 'settings',
});

export const storePickupStore = new StorePickupStore(storePickupApi, new DefaultWatchApi());

export class ExpressCompany extends IObject {
  name: string | undefined;
  ename: string | undefined;
  service_number: string | undefined;
  constructor(data: ExpressCompany) {
    super(data);
    Object.assign(this, data);
  }
}

class ExpressCompanyStore extends ObjectStore<ExpressCompany> {
  api: ObjectApi<ExpressCompany>;
  watchApi: WatchApi<ExpressCompany>;
  constructor(api: ObjectApi<ExpressCompany>, watchApi: WatchApi<ExpressCompany>) {
    super();
    this.api = api;
    this.watchApi = watchApi;
  }
}

export const expressCompanyApi = new ObjectApi<ExpressCompany>({
  url: '/api/v1/express_company',
  objectConstructor: ExpressCompany,
  service: 'settings',
});

export const expressCompanyStore = new ExpressCompanyStore(
  expressCompanyApi,
  new DefaultWatchApi(),
);
