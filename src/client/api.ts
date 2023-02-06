import { stringify } from 'querystring';
import { request } from 'umi';
import { apiManager } from './manager';
import type { IObjectConstructor } from './object';
import { IObject } from './object';
import { ObjectStore } from './store';
import { autobind } from './utils';


export interface JsonApiError {
  code?: number;
  message?: string;
  errors?: any;
}

export interface IObjectApiLinkRef {
  apiPrefix?: string;
  apiVersion?: string;
  apiResource?: string;
  service?: string;
}

export interface ObjectData {
  uid: string;
  _id: string;
  kind: string;
  version: number;
}

export interface ObjectDataList<T = ObjectData> extends ObjectData {
  count?: number;
  items: T[];
}

export interface IObjectApiOptions<T extends IObject> {
  url: string;
  objectConstructor?: IObjectConstructor<T>;
  service?: string;
}

export declare type SearchQuery = {
  text: string;
  offset?: number;
  limit?: number;
};

export declare type Parameter = string | number;

const isObject = (object: Object) => {
  return object != null && typeof object === 'object';
};

export const isDeepEqual = (object1: Object, object2: Object) => {
  const objKeys1 = Object.keys(object1);
  const objKeys2 = Object.keys(object2);
  if (objKeys1.length !== objKeys2.length) return false;
  for (var key of objKeys1) {
    const value1 = object1[key];
    const value2 = object2[key];
    const isObjects = isObject(value1) && isObject(value2);
    if ((isObjects && !isDeepEqual(value1, value2)) || (!isObjects && value1 !== value2)) {
      return false;
    }
  }
  return true;
};

export declare type Query = {
  limit?: {
    page: number;
    size: number;
  };
  sort?: { [key: string]: any };
  filter?: { [key: string]: any };
  [key: string]: any;
};

@autobind()
export class ObjectApi<T extends IObject = any> {
  readonly apiBase: string;
  readonly apiPrefix: string; // api
  readonly apiVersion: string;
  readonly apiResource: string;
  readonly service: string;

  // /api/v1/Product
  static readonly matcher = /([^\/?]+)?\/(v.*?)?\/([^\/?]+).*$/;

  public version: number = 0;
  public count: number = 0;
  public store: ObjectStore<T> | undefined;

  static parseApi(url = '') {
    const [apiBase, apiPrefix, apiVersion, apiResource] = url.match(ObjectApi.matcher) || [];
    return {
      apiBase,
      apiPrefix,
      apiVersion,
      apiResource,
    };
  }

  constructor(options: IObjectApiOptions<T>) {
    const { objectConstructor = IObject as IObjectConstructor } = options;
    const { apiPrefix, apiVersion, apiResource } = ObjectApi.parseApi(options.url);
    this.apiBase = options.url;
    this.apiPrefix = apiPrefix;
    this.apiVersion = apiVersion;
    this.apiResource = apiResource;
    this.service = options.service ? options.service : '';
    this.objectConstructor = objectConstructor;

    apiManager.registerObjectApi(this.apiBase, this);
  }

  public objectConstructor: IObjectConstructor<T>;

  getWatchUrl(version: number): string {
    const { apiPrefix, apiVersion, apiResource } = this;
    const resourcePath = ObjectApi.createLink({
      apiPrefix,
      apiVersion,
      apiResource,
    });
    return stringify({ item: '/' + resourcePath + '/' + version });
  }

  private parseResponse = (data: ObjectData | ObjectDataList): any => {
    if (!data) return;

    if (IObject.isObjectDataList(data)) {
      const { version, count, items } = data;
      if (this.version < version) this.version = version;
      if (this.store) this.store.count = count || 0;
      return items.map((item) => new this.objectConstructor({ ...item }));
    }

    if (Array.isArray(data)) {
      return data.map((item) => {
        const { version } = item;
        if (this.version < version) this.version = version;
        return new this.objectConstructor({ ...item });
      });
    }

    const { version } = data;
    if (this.version < version) this.version = version;

    return new this.objectConstructor(data);
  };

  private parseResponsePage = (data: ObjectDataList): any => {
    if (!data) return;
    const { items, count } = data;
    if (this.store != undefined) this.store.count = count || 0;
    if (!items) return [];
    return items.map((item: any) => new this.objectConstructor({ ...item }));
  };

  static createLink(ref: IObjectApiLinkRef): string {
    const { apiPrefix, apiVersion, apiResource, service } = ref;
    return [service, apiPrefix, apiVersion, apiResource].filter((v) => !!v).join('/');
  }

  searchUrl = (query?: Partial<SearchQuery>) => {
    const { apiPrefix, apiVersion, apiResource } = this;
    const service = 'search';
    const resourcePath = ObjectApi.createLink({
      service,
      apiPrefix,
      apiVersion,
      apiResource,
    });
    return '/' + resourcePath + (query ? `?` + stringify(query) : '');
  };

  getUrl = (parameter?: Parameter, query?: Partial<Query>, op?: string) => {
    const { service, apiPrefix, apiVersion, apiResource } = this;
    let resourcePath = ObjectApi.createLink({ service, apiPrefix, apiVersion, apiResource });
    let obj = {};
    if (query?.limit) obj['limit'] = JSON.stringify(query.limit);
    if (query?.sort) obj['sort'] = JSON.stringify(query.sort);
    if (query?.filter) obj['filter'] = JSON.stringify(query.filter);

    if (parameter) resourcePath = resourcePath + '/' + parameter;
    if (op) return resourcePath + '/op/' + op + (query ? `?` + stringify(obj) : '');

    return '/' + resourcePath + (query ? `?` + stringify(obj) : '');
  };

  list = async (parameter?: Parameter, query?: Query, op?: string): Promise<T[]> => {
    return request(this.getUrl(parameter, query, op), { method: 'GET' }).then(
      this.parseResponse
    );
  };

  page = async (parameter?: Parameter, query?: Query, op?: string): Promise<T[]> => {
    return request(this.getUrl(parameter, query, op), { method: 'GET' }).then(
      this.parseResponse
    );
  };

  get = async (parameter?: Parameter, query?: Query, op?: string): Promise<T> => {
    return request(this.getUrl(parameter, query, op), { method: 'GET' }).then(
      this.parseResponse
    );
  };

  create = async (
    parameter?: Parameter,
    partial?: Partial<T>,
    query?: Query,
    op?: string,
  ): Promise<T> => {
    return request(this.getUrl(parameter, query, op), { method: 'POST', data: partial }).then(
      this.parseResponse
    );
  };

  update = async (
    partial?: Partial<T>,
    parameter?: Parameter,
    query?: Query,
    op?: string,
  ): Promise<T> => {
    return request(this.getUrl(parameter, query, op), { method: 'PUT', data: partial }).then(
      this.parseResponse
    );
  };

  delete = async (parameter?: Parameter, query?: Query): Promise<T> => {
    return request(this.getUrl(parameter, query), { method: 'DELETE' }).then(
      this.parseResponse
    );
  };

  upload = async <D = string | ArrayBuffer>(data: D) => {
    return request(this.getUrl(undefined, {}, 'upload'), { method: 'POST', data }).then(
      this.parseResponse
    );
  };

  search = async (q: SearchQuery) => {
    return request(this.searchUrl(q), { method: 'GET' });
  };
}
