import { IObject, ObjectApi, ObjectStore } from '@/client';
import { DefaultWatchApi, WatchApi } from '@/client/event';
import { computed } from 'mobx';

export class Region extends IObject {
  name: string | undefined;
  level: number | string | undefined;
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

export interface Node {
  title: string;
  key: string;
  children: Node[];
}
class RegionStore extends ObjectStore<Region> {
  api: ObjectApi<Region>;
  watchApi: WatchApi<Region>;
  constructor(api: ObjectApi<Region>, watchApi: WatchApi<Region>) {
    super();
    this.api = api;
    this.watchApi = watchApi;
  }

  @computed get tree() {
    let select: Node[] = [];
    // level 1
    this.items
      .filter((value: Region) => value.level == 1)
      .forEach((value: Region) => {
        if (!value.name) return;
        select.push({ title: value.name, key: value.uid, children: [] });
      });

    // level 2
    this.items
      .filter((value: Region) => value.level === 2)
      .forEach((value: Region) => {
        select
          .filter((node) => node.key === value.uid.substring(0, 2))
          .forEach((level2) => {
            if (!value.name) return;
            level2.children.push({
              title: value.name,
              key: value.uid,
              children: [],
            });
          });
      });

    // level 3
    this.items
      .filter((value: Region) => value.level == 3)
      .forEach((value: Region) => {
        select
          .filter((level2) => level2.key === value.uid.substring(0, 2))
          .forEach((level2) => {
            if (!value.name) return;
            level2.children
              .filter((level3) => level3.key === value.uid.substring(0, 4))
              .forEach((level3) => {
                if (!value.name) return;
                level3.children.push({
                  title: value.name,
                  key: value.uid,
                  children: [],
                });
              });
          });
      });

    return select;
  }
}

export const regionStore = new RegionStore(regionApi, new DefaultWatchApi());
