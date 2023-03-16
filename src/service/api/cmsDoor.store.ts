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

  @computed get tree() {
    return Array.from(new Set(this.items.map((item) => item.first_name))).map((item) => {
      return {
        title: item,
        key: item,
        children: [],
      };
    });
  }
}

export const cmsDoorStore = new DoorStore(cmsDoorApi, new DefaultWatchApi());
export const cmsDoorStore2= new DoorStore(cmsDoorApi, new DefaultWatchApi());
