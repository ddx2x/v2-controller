import { IObject, ObjectApi, ObjectStore } from '@/client';
import { DefaultWatchApi, WatchApi } from '@/client/event';
import { computed } from 'mobx';

export class Category extends IObject {
  level: number | string | undefined;
  parent_id: string | undefined;
  full_id: string | undefined;
  nav_status: number | string | undefined;
  keywords: string[] | undefined;
  description: string | string | undefined;

  constructor(data: Category) {
    super(data);
    Object.assign(this, data);
  }
}

interface TreeNode {
  title: string;
  key: string;
  value: any;
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

  createTree() {
    const tree: TreeNode[] = [];

    const map = new Map();
    let level1 = this.items.filter((value) => value.level === 1);
    for (const item of level1) {
      tree.push({
        title: item.uid,
        value: item,
        key: item.uid,
        children: [],
      });
    }

    let level2 = this.items.filter((value) => value.level === 2);

    for (const item of level2) {
      tree
        .find((value) => value.title === item.parent_id)
        ?.children.push({
          title: item.uid,
          value: item,
          key: item.uid,
          children: [],
        });
    }

    let level3 = this.items.filter((value) => value.level === 3);
    for (const item of level3) {
      tree.forEach((value) => {
        value?.children
          .find((value) => value.title === item.parent_id)
          ?.children.push({
            title: item.uid,
            value: item,
            key: item.uid,
            children: [],
          });
      });
    }

    return tree;
  }

  @computed get tree() {
    return this.createTree();
  }
}

export const categoryApi = new ObjectApi<Category>({
  url: '/api/v1/category',
  objectConstructor: Category,
  service: 'product-t',
});

export const categoryStore = new CategoryStore(categoryApi, new DefaultWatchApi());
export const categoryStore2 = new CategoryStore(categoryApi, new DefaultWatchApi());
