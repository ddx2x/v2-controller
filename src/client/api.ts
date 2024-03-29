import { merge } from 'lodash';
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
      if (this.store) this.store.count.set(count || 0);
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
    let queryObject: any = {};

    let { limit, sort, filter, ...restQuery } = query ? query : { limit: {}, sort: {}, filter: {} };

    if (limit) queryObject['limit'] = JSON.stringify(limit);
    if (sort) queryObject['sort'] = JSON.stringify(sort);
    if (filter) queryObject['filter'] = JSON.stringify(filter);

    if (restQuery) merge(queryObject, restQuery);

    if (parameter) resourcePath = resourcePath + '/' + parameter;
    if (op) resourcePath = resourcePath + '/op/' + op;

    return '/' + resourcePath + (query ? `?` + stringify(queryObject) : '');
  };

  list = async (parameter?: Parameter, query?: Query, op?: string): Promise<T[]> => {
    return request(this.getUrl(parameter, query, op), { method: 'GET' }).then(this.parseResponse);
  };

  page = async (parameter?: Parameter, query?: Query, op?: string): Promise<T[]> => {
    return request(this.getUrl(parameter, query, op), { method: 'GET' }).then(this.parseResponse);
  };

  get = async (parameter?: Parameter, query?: Query, op?: string): Promise<T> => {
    // const url = this.getUrl(parameter, query, op);
    return request(this.getUrl(parameter, query, op), { method: 'GET' }).then(this.parseResponse);
  };

  create = async (
    parameter?: Parameter,
    partial?: Partial<T>,
    query?: Query,
    op?: string,
  ): Promise<T> => {
    return request(this.getUrl(parameter, query, op), { method: 'POST', data: partial }).then(
      this.parseResponse,
    );
  };

  update = async (
    partial?: Partial<T>,
    parameter?: Parameter,
    query?: Query,
    op?: string,
  ): Promise<T> => {
    return request(this.getUrl(parameter, query, op), { method: 'PUT', data: partial }).then(
      this.parseResponse,
    );
  };

  delete = async (parameter?: Parameter, query?: Query): Promise<T> => {
    return request(this.getUrl(parameter, query), { method: 'DELETE' }).then(this.parseResponse);
  };

  upload = async <D = string | ArrayBuffer>(data: D) => {
    return request(this.getUrl(undefined, {}, 'upload'), { method: 'POST', data }).then(
      this.parseResponse,
    );
  };

  search = async (q: SearchQuery) => {
    return request(this.searchUrl(q), { method: 'GET' });
  };
}
