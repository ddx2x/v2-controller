import { request } from '@umijs/max';
import { stringify } from 'querystring';
import { apiManager } from './manager';
import type { IObjectConstructor } from './object';
import { IObject } from './object';
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
}

export interface ObjectData {
  uid: string;
  kind: string;
  version: number;
}

export interface ObjectDataList<T = ObjectData> extends ObjectData {
  items: T[];
}

export interface IObjectApiOptions<T extends IObject> {
  url: string;
  objectConstructor?: IObjectConstructor<T>;
  service?: string;
}

export interface IQuery {
  id?: string | number;
  watch?: boolean | number;
  resourceVersion?: number;
  timeoutSeconds?: number;
  continue?: string; // might be used with ?limit from second reques
  path?: string; // label update datastructure field
  [key: string]: any;
}

@autobind()
export class ObjectApi<T extends IObject = any> {
  readonly apiBase: string;
  readonly apiPrefix: string; // api
  readonly apiVersion: string;
  readonly apiResource: string;

  // /api/v1/Product
  static readonly matcher = /([^\/?]+)?\/(v.*?)?\/([^\/?]+).*$/;

  protected version: number = 0;

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
    this.objectConstructor = objectConstructor;

    apiManager.registerObjectApi(this.apiBase, this);
  }

  public objectConstructor: IObjectConstructor<T>;

  getWatchUrl(query: IQuery = {}): string {
    return this.getUrl({
      watch: 1,
      ...query,
    });
  }

  private parseResponse = (data: ObjectData | ObjectDataList[]): any => {
    if (!data) return;

    if (IObject.isObjectDataList(data)) {
      const { version, items } = data;
      if (this.version < version) this.version = version;
      return items.map((item) => new this.objectConstructor({ ...item }));
    }

    if (Array.isArray(data)) {
      return data.map((item) => {
        const { version } = item;
        if (this.version < version) this.version = version;
        new this.objectConstructor({ ...item });
      });
    }

    const { version } = data;
    if (this.version < version) this.version = version;

    return new this.objectConstructor(data);
  };

  static createLink(ref: IObjectApiLinkRef): string {
    const { apiPrefix: prefix, apiVersion: version, apiResource: resource } = ref;
    return [prefix, version, resource].filter((v) => !!v).join('/');
  }

  getUrl = (query?: Partial<IQuery>, op?: string) => {
    const { apiPrefix, apiVersion, apiResource } = this;
    const resourcePath = ObjectApi.createLink({
      apiPrefix,
      apiVersion,
      apiResource,
    });

    // eslint-disable-next-line no-param-reassign
    op = op ? '/op/' + op : '';
    return resourcePath + op + (query ? `?` + stringify(query) : '');
  };

  list = async (query?: IQuery, op?: string): Promise<T[]> => {
    return request(this.getUrl(query, op), { method: 'GET' }).then(this.parseResponse);
  };

  get = async (query?: IQuery, op?: string): Promise<T> => {
    return request(this.getUrl(query, op), { method: 'GET' }).then(this.parseResponse);
  };

  create = async (partial?: Partial<T>, query?: IQuery, op?: string): Promise<T> => {
    return request(this.getUrl(query, op), { method: 'POST', partial }).then(this.parseResponse);
  };

  update = async (partial?: Partial<T>, query?: IQuery, op?: string): Promise<T> => {
    return request(this.getUrl(query, op), { method: 'POST', partial }).then(this.parseResponse);
  };

  delete = async (query?: IQuery): Promise<T> => {
    return request(this.getUrl({ id: query?.id }), { method: 'DELETE' }).then(this.parseResponse);
  };

  upload = async <D = string | ArrayBuffer>(data: D) => {
    return request(this.getUrl({}, 'upload'), { method: 'POST', data }).then(this.parseResponse);
  };
}
