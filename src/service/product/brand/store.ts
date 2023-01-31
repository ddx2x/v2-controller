import { IObject, ObjectApi, ObjectStore } from '@/client';
import { DefaultWatchApi, WatchApi } from '@/client/event';

export class Brand extends IObject {
    first_letter: string | undefined
    sort: number | undefined
    factory_status: number | undefined
    product_count: number | undefined
    product_comment_count: number | undefined
    show_status: number | undefined
    logo: string | undefined
    big_pic: string | undefined
    brand_story: string | undefined

    constructor(data: Brand) {
        super(data);
        Object.assign(this, data);
    }
}

class BrandStore extends ObjectStore<Brand> {
    watchApi: WatchApi<Brand>;
    api: ObjectApi<Brand>;
    constructor(api: ObjectApi<Brand>, watchApi: WatchApi<Brand>) {
        super();
        this.api = api;
        this.watchApi = watchApi;
    }
}


export const brandApi = new ObjectApi<Brand>(
    {
        url: '/api/v1/brand',
        objectConstructor: Brand,
        service: 'product-t',
    }
);

export const brandStore = new BrandStore(brandApi, new DefaultWatchApi());

