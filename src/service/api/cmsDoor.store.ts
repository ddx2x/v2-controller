import { IObject, ObjectApi, ObjectStore } from '@/client';
import { DefaultWatchApi, WatchApi } from '@/client/event';
import { computed } from 'mobx';

export interface BusinessDay {
  days: number[] | string[];
  hours: string[];
}

export class CmsDoor extends IObject {
  first_name: string | undefined;
  second_name: string | undefined;
  address: string | undefined;
  region_name: string | undefined;
  business_days: BusinessDay[] | undefined;
  contact: string | undefined;
  admin_name: string | undefined;
  admin_account: string | undefined;
  logo: string | object | undefined;
  roles: string[] | undefined;
  online_store_status: boolean | undefined;
  store_status: boolean | undefined;
  lables: string[] | undefined;
  sort: number | undefined;
  coordinates: string[] | number[] | string | undefined;
  head_quarters: string | undefined;

  constructor(data: CmsDoor) {
    super(data);
    Object.assign(this, data);
    this.logo = {
      fileList: [
        {
          url: '/media-t/file/' + this.logo,
          name: this.logo,
        },
      ],
    };
    if (!this.business_days || this.business_days.length === 0) return;
    this.business_days = this.business_days.map((item) => {
      item.days = item.days.map((day) => String(day));
      return item;
    });
  }
}

export const cmsDoorApi = new ObjectApi<CmsDoor>({
  url: '/api/v1/door',
  objectConstructor: CmsDoor,
  service: 'cms-t',
});

interface TreeNode {
  title: string;
  key: string;
  value: string;
  children: TreeNode[];
}

class DoorStore extends ObjectStore<CmsDoor> {
  api: ObjectApi<CmsDoor>;
  watchApi: WatchApi<CmsDoor>;
  constructor(api: ObjectApi<CmsDoor>, watchApi: WatchApi<CmsDoor>) {
    super();
    this.api = api;
    this.watchApi = watchApi;
  }

  createTree() {
    const tree: TreeNode[] = [];

    let headquarters = '';
    // Create a map of first names to arrays of second names
    const map = new Map();
    for (const item of this.items) {
      const { head_quarters, first_name, second_name } = item;
      headquarters = head_quarters || '总部';
      if (!map.has(first_name)) {
        map.set(first_name, []);
      }
      map.get(first_name).push(second_name);
    }

    let sub_tree = [];

    // Convert the map to an array of objects with nested children

    for (const [first_name, second_names] of map) {
      const children = second_names.map((second_name: any) => ({
        title: second_name,
        value: second_name,
        key: second_name,
      }));
      sub_tree.push({
        title: first_name,
        value: first_name,
        key: first_name,
        children,
      });
    }

    tree.push({
      title: headquarters,
      value: '',
      key: '',
      children: sub_tree,
    });

    return tree;
  }

  @computed get tree() {
    return this.createTree();
  }
}

export const cmsDoorStore = new DoorStore(cmsDoorApi, new DefaultWatchApi());
export const cmsDoorStore2 = new DoorStore(cmsDoorApi, new DefaultWatchApi());
