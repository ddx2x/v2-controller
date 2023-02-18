import { IObject, ObjectApi, ObjectStore } from '@/client';
import { DefaultWatchApi, WatchApi } from '@/client/event';

export class ProductAttribute extends IObject {
    name: string | undefined
    category_id: string | undefined
    select_type: number | string | undefined
    input_type: number | string | undefined
    input_select_list: string[] | undefined
    // sort: number | undefined
    // filter_type: number | string | undefined
    // search_type: number | string | undefined
    // related_status: number | string | undefined
    // hand_add_status: number | string | undefined
    type: number | string | undefined

    constructor(data: ProductAttribute) {
        super(data);
        Object.assign(this, data);
    }
}

class ProductAttributeStore extends ObjectStore<ProductAttribute> {
    watchApi: WatchApi<ProductAttribute>;
    api: ObjectApi<ProductAttribute>;
    constructor(api: ObjectApi<ProductAttribute>, watchApi: WatchApi<ProductAttribute>) {
        super();
        this.api = api;
        this.watchApi = watchApi;
    }
}

export const productAttributeApi = new ObjectApi<ProductAttribute>(
    {
        url: '/api/v1/product_attribute',
        objectConstructor: ProductAttribute,
        service: 'product-t',
    }
);

export const productAttributeStore = new ProductAttributeStore(productAttributeApi, new DefaultWatchApi());

