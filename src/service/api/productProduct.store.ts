import { IObject, ObjectApi, ObjectStore } from '@/client';
import { DefaultWatchApi, WatchApi } from '@/client/event';

export class Product extends IObject {
    name: string | undefined
    brand_name: string | undefined
    product_category_name: string | undefined
    product_sn: string | undefined
    delete_status: number | string | undefined
    publish_status: number | string | undefined
    new_status: number | string | undefined
    recommand_status: number | string | undefined
    verify_status: number | string | undefined
    sort: number | string | undefined
    
    constructor(data: Product) {
        super(data);
        Object.assign(this, data);
    }
}

class ProductStore extends ObjectStore<Product> {
    watchApi: WatchApi<Product>;
    api: ObjectApi<Product>;
    constructor(api: ObjectApi<Product>, watchApi: WatchApi<Product>) {
        super();
        this.api = api;
        this.watchApi = watchApi;
    }
}

export const productApi = new ObjectApi<Product>(
    {
        url: '/api/v1/product',
        objectConstructor: Product,
        service: 'product-t',
    }
);

export const productStore = new ProductStore(productApi, new DefaultWatchApi());

