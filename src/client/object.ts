import type { ObjectData, ObjectDataList, ObjectStore, Parameter, Query } from '.';

export type IObjectConstructor<T extends IObject = any> = new (
  data: ObjectData | ObjectDataList | any,
) => T & { kind?: string };

export class IObject implements ObjectData {
  uid: string = '';
  _id: string = '';
  kind: string = '';
  version: number = 0;

  constructor(data: ObjectData) {
    Object.assign(this, data);
  }

  getUid = (): string => {
    return this.uid != '' ? this.uid : this._id
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
    parameter?: Parameter,
    query?: Query,
  ): Promise<T> => {
    return store.api.update(partial, parameter, query);
  };
}

export class SearchObject {
  uid: string = '';
  [key: string]: any;

  constructor(data: ObjectData) {
    Object.assign(this, data);
  }
}
