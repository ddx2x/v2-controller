import { IObject, ObjectApi, ObjectStore } from '@/client';
import { DefaultWatchApi, WatchApi } from '@/client/event';

export class Category extends IObject {
    level: number | undefined
    parent_id: string | undefined
    full_id: string | undefined
    product_count: number | undefined
    product_unit: string | undefined
    nav_status: number | undefined
    show_status: number | undefined
    sort: number | undefined
    icon: string | undefined
    keywords: string[] | undefined
    description: string | undefined

    constructor(data: Category) {
        super(data);
        Object.assign(this, data);
    }
}

class CategoryStore extends ObjectStore<Category> {
    watchApi: WatchApi<Category>;
    api: ObjectApi<Category>;
    constructor(api: ObjectApi<Category>, watchApi: WatchApi<Category>) {
        super();
        this.api = api;
        this.watchApi = watchApi;
    }
}

export const categoryApi = new ObjectApi<Category>(
    {
        url: '/api/v1/category',
        objectConstructor: Category,
        service: 'product-t',
    }
);

export const categoryStore = new CategoryStore(categoryApi, new DefaultWatchApi());
