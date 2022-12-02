import type { ObjectData, ObjectDataList, ObjectStore, Query } from '.';

export type IObjectConstructor<T extends IObject = any> = new (
  data: ObjectData | ObjectDataList | any,
) => T & { kind?: string };

export class IObject implements ObjectData {
  uid: string = '';
  kind: string = '';
  version: number = 0;

  constructor(data: ObjectData) {
    Object.assign(this, data);
  }

  static isObjectData(data: any): data is ObjectData {
    return data && data.uid && data.kind && data.version;
  }

  static isObjectDataList(data: any): data is ObjectDataList {
    return data && data.items;
  }

  update: any = async <S extends ObjectStore<T>, T extends IObject>(
    store: S,
    partial: Partial<T>,
    query?: Query,
  ): Promise<T> => {
    return store.api.update(partial, query);
  };
}


export class SearchObject {
  uid: string = '';
  name: string = '';
  title: string = '';
  brand_name: string = '';
  img: string = '';

  constructor(data: ObjectData) {
    Object.assign(this, data);
  }
}