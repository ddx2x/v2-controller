import { IObject, ObjectApi, ObjectStore } from '@/client';
import { DefaultWatchApi, WatchApi } from '@/client/event';


export interface Predicate {
    name: string | undefined;
    key: number | undefined;
    value: number | undefined;
}

export interface Action {
    name: string | undefined;
    op: number | undefined;
    value: number | undefined;
}

export interface Rule {
    predicate: Predicate | undefined;
    action: Action | undefined;
}


export const MarketingActivityStateValueEnum = {
    1: { text: '可用', status: 'available' },
    2: { text: '不可用', status: 'unavailable' },
};


export class MarketingActivity extends IObject {
    name: string | undefined;
    description: string | undefined;
    start_time: number | undefined;
    end_time: number | undefined;

    rule: Rule | undefined;
    merchant: string | undefined;
    global: boolean | undefined;
    state: number | undefined;

    //
    start_time_format: String | undefined;
    end_time_format: String | undefined;

    constructor(data: MarketingActivity) {
        super(data);
        Object.assign(this, data);


        let date = new Date(this.start_time ? this.start_time * 1000 : 0);
        let year = date.getFullYear();
        let month = date.getMonth() + 1; // 月份是从0开始计数的，所以要加1
        let day = date.getDate();
        let hours = date.getHours();
        let minutes = date.getMinutes();

        this.start_time_format = `${year}-${month}-${day} ${hours}:${minutes}`;


        date = new Date(this.end_time ? this.end_time * 1000 : 0);
        year = date.getFullYear();
        month = date.getMonth() + 1; // 月份是从0开始计数的，所以要加1
        day = date.getDate();
        hours = date.getHours();
        minutes = date.getMinutes();

        this.end_time_format = `${year}-${month}-${day} ${hours}:${minutes}`;


    }
}

export const marketingActivityApi = new ObjectApi<MarketingActivity>({
    url: '/api/v1/marketing_activity',
    objectConstructor: MarketingActivity,
    service: 'trade-t',
});

class MarketingActivityStore extends ObjectStore<MarketingActivity> {
    api: ObjectApi<MarketingActivity>;
    watchApi: WatchApi<MarketingActivity>;
    constructor(api: ObjectApi<MarketingActivity>, watchApi: WatchApi<MarketingActivity>) {
        super();
        this.api = api;
        this.watchApi = watchApi;
    }
}

export const marketingActivityStore = new MarketingActivityStore(marketingActivityApi, new DefaultWatchApi());
