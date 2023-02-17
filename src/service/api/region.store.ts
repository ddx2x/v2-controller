import { IObject, ObjectApi, ObjectStore } from '@/client';
import { DefaultWatchApi, WatchApi } from '@/client/event';

export class Region extends IObject {
    name: string | undefined
    level: number | string | undefined
    constructor(data: Region) {
        super(data);
        Object.assign(this, data);
    }
}

const regionApi = new ObjectApi<Region>({
    url: '/api/v1/region',
    objectConstructor: Region,
    service: 'cms-t',
});

class RegionStore extends ObjectStore<Region> {
    api: ObjectApi<Region>;
    watchApi: WatchApi<Region>;
    constructor(api: ObjectApi<Region>, watchApi: WatchApi<Region>) {
        super();
        this.api = api;
        this.watchApi = watchApi;
    }
}

export const regionStore = new RegionStore(regionApi, new DefaultWatchApi());
