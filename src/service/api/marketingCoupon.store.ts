import { IObject, ObjectApi, ObjectStore } from '@/client';
import { DefaultWatchApi, WatchApi } from '@/client/event';


export interface Predicate {
    uid: string | undefined;
    _id: string | undefined;
    name: string | undefined;
    key: number | undefined;
    value: number | undefined;
}

export interface Action {
    uid: string | undefined;
    _id: string | undefined;
    name: string | undefined;
    op: number | undefined;
    value: number | undefined;
}

export interface Rule {
    predicate: Predicate | undefined;
    action: Action | undefined;
}

export const MarketingCouponStateValueEnum = {
    1: { text: '可用', status: 'available' },
    2: { text: '不可用', status: 'unavailable' },
};

export class MarketingCoupon extends IObject {
    name: string | undefined;
    description: string | undefined;
    expire: number | undefined;
    perpetual: boolean | undefined;

    rule: Rule | undefined;
    merchant: string | undefined;
    global: boolean | undefined;
    state: number | undefined;
    max_claimable: number | undefined;
    //
    expire_format: String | undefined;
    global_format: String | undefined;

    constructor(data: MarketingCoupon) {
        super(data);
        Object.assign(this, data);

        this.global_format = this.global ? '是' : '否';

        let date = new Date(this.expire ? this.expire * 1000 : 0);
        let year = date.getFullYear();
        let month = date.getMonth() + 1; // 月份是从0开始计数的，所以要加1
        let day = date.getDate();
        let hours = date.getHours();
        let minutes = date.getMinutes();

        this.expire_format = `${year}-${month}-${day} ${hours}:${minutes}`;
    }
}

export const marketingCouponApi = new ObjectApi<MarketingCoupon>({
    url: '/api/v1/marketing_coupon',
    objectConstructor: MarketingCoupon,
    service: 'trade-t',
});

class MarketingCouponStore extends ObjectStore<MarketingCoupon> {
    api: ObjectApi<MarketingCoupon>;
    watchApi: WatchApi<MarketingCoupon>;
    constructor(api: ObjectApi<MarketingCoupon>, watchApi: WatchApi<MarketingCoupon>) {
        super();
        this.api = api;
        this.watchApi = watchApi;
    }
}

export const marketingCouponStore = new MarketingCouponStore(marketingCouponApi, new DefaultWatchApi());
