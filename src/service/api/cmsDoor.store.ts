import { IObject, ObjectApi, ObjectStore } from '@/client';
import { DefaultWatchApi, WatchApi } from '@/client/event';

export interface BusinessDay {
    days: number[] | string[]
    hours: string[]
}

export class CmsDoor extends IObject {
    first_name: string | undefined
    second_name: string | undefined
    address: string | undefined
    region_name: string | undefined
    business_days: BusinessDay[] | undefined
    contact: string | undefined
    admin_name: string | undefined
    admin_account: string | undefined
    logo: string | object | undefined
    roles: any[] | undefined
    online_store_status: boolean | undefined
    store_status: boolean | undefined
    lables: any[] | undefined
    sort: number | undefined

    constructor(data: CmsDoor) {
        super(data);
        Object.assign(this, data);
        if (!this.business_days || this.business_days.length === 0) return;
        this.business_days =
            this.business_days.map(item => {
                item.days = item.days.map((day) => String(day));
                return item;
            });

        this.logo = {
            fileList: [{
                url: '/media-t/file/' + this.logo, name: this.logo
            }]
        }
    }
}

const cmsDoorApi = new ObjectApi<CmsDoor>({
    url: '/api/v1/door',
    objectConstructor: CmsDoor,
    service: 'cms-t',
});

class DoorStore extends ObjectStore<CmsDoor> {
    api: ObjectApi<CmsDoor>;
    watchApi: WatchApi<CmsDoor>;
    constructor(api: ObjectApi<CmsDoor>, watchApi: WatchApi<CmsDoor>) {
        super();
        this.api = api;
        this.watchApi = watchApi;
    }
}

export const cmsDoorStore = new DoorStore(cmsDoorApi, new DefaultWatchApi());