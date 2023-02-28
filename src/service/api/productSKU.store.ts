import { IObject, ObjectApi, ObjectStore } from '../../client';
import { DefaultWatchApi, WatchApi } from '../../client/event';

export class StockKeepingUnit extends IObject {
  spec_name: string | undefined;
  product_id: string | undefined;
  product_name: string | undefined;
  price: string | number | undefined;
  promotion_price: string | number | undefined;
  stock: string | number | undefined;
  low_stock: string | number | undefined;
  pic: string | object | undefined;

  constructor(data: StockKeepingUnit) {
    super(data);
    Object.assign(this, data);
    this.pic = {
      fileList: [{ url: '/media-t/file/' + this.pic, name: this.pic }],
    };
  }
}

class StockKeepingUnitStore extends ObjectStore<StockKeepingUnit> {
  watchApi: WatchApi<StockKeepingUnit>;
  api: ObjectApi<StockKeepingUnit>;
  constructor(api: ObjectApi<StockKeepingUnit>, watchApi: WatchApi<StockKeepingUnit>) {
    super();
    this.api = api;
    this.watchApi = watchApi;
  }
}

export const StockKeepingUnitApi = new ObjectApi<StockKeepingUnit>({
  url: '/api/v1/stockkeepingunit',
  objectConstructor: StockKeepingUnit,
  service: 'product-t',
});

export const stockKeepingUnitStore = new StockKeepingUnitStore(
  StockKeepingUnitApi,
  new DefaultWatchApi(),
);
