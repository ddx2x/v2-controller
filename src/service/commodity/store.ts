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
  watchApi: WatchApi<Commodity, CommdityStore>;
  constructor(api: ObjectApi<Commodity>, watchApi: WatchApi<Commodity, CommdityStore>) {
    super();
    this.api = api;
    this.watchApi = watchApi;
  }
}

export const objectWatchApi = new ObjectWatchApi();
export const commdityStore = new CommdityStore(commdityApi, objectWatchApi);

class CommodityAggregate extends IObject {
  sub_title?: string;
  image?: string;
  brand_name?: string;

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
  watchApi: WatchApi<CommodityAggregate, CommdityAggregateStore>;
  api: ObjectApi<CommodityAggregate>;
  constructor(
    api: ObjectApi<CommodityAggregate>,
    watchApi: WatchApi<CommodityAggregate, CommdityAggregateStore>,
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

export class BrandName extends IObject {}
export const brandNameApi = new ObjectApi<CommodityAggregate>({
  url: '/api/v1/brands',
  objectConstructor: CommodityAggregate,
  service: 'prod',
});
