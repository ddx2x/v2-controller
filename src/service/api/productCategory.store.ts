import { IObject, ObjectApi, ObjectStore } from '@/client';
import { DefaultWatchApi, WatchApi } from '@/client/event';
import { computed } from 'mobx';

export class Category extends IObject {
    level: number | string | undefined
    parent_id: string | undefined
    full_id: string | undefined
    nav_status: number | string | undefined
    keywords: string[] | undefined
    description: string | string | undefined

    constructor(data: Category) {
        super(data);
        Object.assign(this, data);
    }
}

interface TreeNode {
    title: string;
    key: string;
    value: string;
    children: TreeNode[];
  }
  
export class CategoryStore extends ObjectStore<Category> {
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
export const categoryStore2 = new CategoryStore(categoryApi, new DefaultWatchApi());

