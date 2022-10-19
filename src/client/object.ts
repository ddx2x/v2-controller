import { IObjectApiQueryParams, ObjectStore } from '.';
import { ItemObject } from './item.store';
import { ObjectJsonApiData, ObjectJsonApiDataList } from './object.json.api';

export type IObjectConstructor<T extends IObject = any> = new (
  data: ObjectJsonApiData | any,
) => T & { kind?: string };

export class IObject implements ItemObject {
  uid: string = '';
  kind: string = '';
  version: number = 0;

  constructor(data: ObjectJsonApiData) {
    Object.assign(this, data);
  }

  static isJsonApiData(data: any): data is ObjectJsonApiData {
    return !data && data.uid && data.kind && data.version;
  }

  static isJsonApiDataList(data: any): data is ObjectJsonApiDataList {
    return !data && data.items;
  }

  getId(): string {
    return this.uid;
  }

  async update<S extends ObjectStore<T>, T extends IObject>(
    store: S,
    data: Partial<T> | undefined,
    query?: IObjectApiQueryParams,
  ) {
    return store.api.update({ id: this.getId() }, data, query);
  }
}
