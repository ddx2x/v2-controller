import { IObject, ObjectApi, ObjectStore, ObjectWatchApi } from '@/client';
import { DefaultWatchApi, WatchApi } from '@/client/event';

export class Commodity extends IObject {
  name?: string;
  images?: any[];
  type?: number; // 重命名为type
  sale_channels?: string[];
  categories: any;
  state?: number;
  slogan: any;
  unit: any;
  stock: any;
  low_stock: any;
  price: any;

  constructor(data: Commodity) {
    super(data);
    Object.assign(this, data);
  }
}

const commdityApi = new ObjectApi<Commodity>({
  url: '/api/v1/commodity',
  objectConstructor: Commodity,
  service: 'prod',
});

class CommdityStore extends ObjectStore<Commodity> {
  api: ObjectApi<Commodity>;
  watchApi: WatchApi<Commodity>;
  constructor(api: ObjectApi<Commodity>, watchApi: WatchApi<Commodity>) {
    super();
    this.api = api;
    this.watchApi = watchApi;
  }
}

export const objectWatchApi = new ObjectWatchApi();
export const commdityStore = new CommdityStore(commdityApi, objectWatchApi);

export class CommodityAggregate extends IObject {
  sub_title?: string;
  image?: string;
  brand_name?: string;
  sale_channels?: number[];

  constructor(data: CommodityAggregate) {
    super(data);
    Object.assign(this, data);
  }
}

const commdityAggregateApi = new ObjectApi<CommodityAggregate>({
  url: '/api/v1/commodity_aggregate',
  objectConstructor: CommodityAggregate,
  service: 'prod',
});

class CommdityAggregateStore extends ObjectStore<CommodityAggregate> {
  watchApi: WatchApi<CommodityAggregate>;
  api: ObjectApi<CommodityAggregate>;
  constructor(
    api: ObjectApi<CommodityAggregate>, watchApi: WatchApi<CommodityAggregate>,
  ) {
    super();
    this.api = api;
    this.watchApi = watchApi;
  }
}

export const commdityAggregateStore = new CommdityAggregateStore(
  commdityAggregateApi,
  new DefaultWatchApi(),
);

export class BrandName extends IObject { }
export const brandNameApi = new ObjectApi<CommodityAggregate>({
  url: '/api/v1/brands',
  objectConstructor: BrandName,
  service: 'prod',
});


export class BrandNameStore extends ObjectStore<BrandName> {
  watchApi: WatchApi<BrandName>;
  api: ObjectApi<BrandName>;

  constructor(api: ObjectApi<BrandName>, watchApi: WatchApi<BrandName>) {
    super();
    this.api = api;
    this.watchApi = watchApi;
  }

  getOptions() {
    const res = Object.fromEntries(this.items.map(item => ({ [item.uid]: { text: item.uid } })));
    console.log("get options", res);

    return res
  }
}

export const watchApi = new ObjectWatchApi();

export const brandNameStoreStore = new BrandNameStore(
  brandNameApi,
  // new DefaultWatchApi(),
  watchApi,
);
