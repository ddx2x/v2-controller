import { IObject, ObjectApi, ObjectStore } from '@/client';
import { DefaultWatchApi, WatchApi } from '@/client/event';

export class Privilege extends IObject {
  type: number | string | undefined;
  url: string | undefined;
  full_id: string | undefined;
  route: boolean | undefined;
  level: number | undefined;
  op: number | undefined;

  constructor(data: Privilege) {
    super(data);
    Object.assign(this, data);
    this.type = String(this.type);
  }
}

export const privilegeApi = new ObjectApi<Privilege>({
  url: '/api/v1/privilege',
  objectConstructor: Privilege,
  service: 'base',
});

class PrivilegeStore extends ObjectStore<Privilege> {
  api: ObjectApi<Privilege>;
  watchApi: WatchApi<Privilege>;
  constructor(api: ObjectApi<Privilege>, watchApi: WatchApi<Privilege>) {
    super();
    this.api = api;
    this.watchApi = watchApi;
  }

  // {
  //   title: '商品',
  //   key: 'shangping',
  //   children: [
  //     {
  //       title: '列表',
  //       key: 'list',
  //     },
  //   ],
  // },

  privilegeTree() {
    let tree: TreeData[] = [];

    this.items
      .filter((item) => item.level === 1)
      .forEach((item) => {
        tree.push({
          title: item._id,
          key: item._id,
          children: [],
        });
      });

    this.items
      .filter((item) => item.level === 2)
      .sort((a, b) => {
        return a._id.localeCompare(b._id);
      })
      .forEach((item) => {
        tree.forEach((t) => {
          if (!item.full_id) return;
          if (t.key === item.full_id.split('.')[0]) {
            t.children.push({
              title: item._id,
              key: item._id,
              children: [],
            });
          }
        });
      });
    return tree;
  }
}

interface TreeData {
  title: string;
  key: string;
  children: TreeData[];
}

export const privilegeStore = new PrivilegeStore(privilegeApi, new DefaultWatchApi());
