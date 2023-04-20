import { IObject, ObjectApi, ObjectStore } from '@/client';
import { DefaultWatchApi, WatchApi } from '@/client/event';

export const MarketingActivityStateValueEnum = {
    1: { text: '按价格满减', status: 'price' },
    2: { text: '按数量满减', status: 'quantity' },
};

export class MarketingPredicate extends IObject {
    name: string | undefined;
    key: number | undefined;
    value: number | undefined;

    constructor(data: MarketingPredicate) {
        super(data);
        Object.assign(this, data);
    }
}

export const marketingPredicateApi = new ObjectApi<MarketingPredicate>({
    url: '/api/v1/marketing_predicate',
    objectConstructor: MarketingPredicate,
    service: 'trade-t',
});

class MarketingPredicateStore extends ObjectStore<MarketingPredicate> {
    api: ObjectApi<MarketingPredicate>;
    watchApi: WatchApi<MarketingPredicate>;
    constructor(api: ObjectApi<MarketingPredicate>, watchApi: WatchApi<MarketingPredicate>) {
        super();
        this.api = api;
        this.watchApi = watchApi;
    }
}

export const marketingPredicateStore = new MarketingPredicateStore(marketingPredicateApi, new DefaultWatchApi());
