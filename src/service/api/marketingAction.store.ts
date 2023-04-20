import { IObject, ObjectApi, ObjectStore } from '@/client';
import { DefaultWatchApi, WatchApi } from '@/client/event';

export const MarketingActionOpValueEnum = {
    2: { text: '减', status: 'subtraction' },
    4: { text: '除', status: 'division' },
};

export class MarketingAction extends IObject {
    name: string | undefined;
    op: number | undefined;
    value: number | undefined;

    constructor(data: MarketingAction) {
        super(data);
        Object.assign(this, data);
    }
}

export const marketingActionApi = new ObjectApi<MarketingAction>({
    url: '/api/v1/marketing_action',
    objectConstructor: MarketingAction,
    service: 'trade-t',
});

class MarketingActionStore extends ObjectStore<MarketingAction> {
    api: ObjectApi<MarketingAction>;
    watchApi: WatchApi<MarketingAction>;
    constructor(api: ObjectApi<MarketingAction>, watchApi: WatchApi<MarketingAction>) {
        super();
        this.api = api;
        this.watchApi = watchApi;
    }
}

export const marketingActionStore = new MarketingActionStore(marketingActionApi, new DefaultWatchApi());
