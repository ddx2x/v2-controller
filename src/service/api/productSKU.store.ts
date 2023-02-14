import { IObject, ObjectApi, ObjectStore } from '../../client';
import { DefaultWatchApi, WatchApi } from '../../client/event';

export class StockKeepingUnit extends IObject {

    constructor(data: StockKeepingUnit) {
        super(data);
        Object.assign(this, data);
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

export const StockKeepingUnitApi = new ObjectApi<StockKeepingUnit>(
    {
        url: '/api/v1/StockKeepingUnit',
        objectConstructor: StockKeepingUnit,
        service: 'product-t',
    }
);

export const stockKeepingUnitStore = new StockKeepingUnitStore(StockKeepingUnitApi, new DefaultWatchApi());

