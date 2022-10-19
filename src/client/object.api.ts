import { request } from '@umijs/max';
import { stringify } from 'querystring';
import { apiManager } from './api.manager';
import { IObject, IObjectConstructor } from './object';
import { EventCallback } from './object.event.api';
import { ObjectJsonApiData, ObjectJsonApiDataList } from './object.json.api';

export interface WatchApi {
  subscribe(...apis: ObjectApi[]): any;
  addListener(store: any, ecb: EventCallback): any;
  unregister(): any;
  reset(): any;
}

export interface IObjectApiOptions<T extends IObject> {
  kind: string;
  apiBase: string;
  objectConstructor?: IObjectConstructor<T>;
  request?: any;
  resource?: string;
}

export interface IObjectApiQueryParams {
  watch?: boolean | number;
  resourceVersion?: number;
  timeoutSeconds?: number;
  limit?: number; // doesn't work with ?watch
  continue?: string; // might be used with ?limit from second reques
  path?: string; // label update datastructure field
}

export interface IObjectApiQueryParamsExtension extends IObjectApiQueryParams {
  [key: string]: any;
}

export interface IObjectApiLinkRef {
  service?: string;
  apiPrefix?: string;
  apiVersion?: string;
  resource: string;
  id: string;
}

type Noop = () => void;

export class ObjectApi<T extends IObject = any> {
  // /service/api/v1/product
  static matcher = /([^\/?]+)?\/(apis?.*?)?\/(v.*?)?\/([^\/]+)(?:\/([^\/?]+))?.*$/;
  api: any;

  static parseUrl(apiPath = '') {
    if (apiPath === '') {
      throw new Error('Invalid API path');
    }
    apiPath = new URL(apiPath, location.origin).pathname;
    return ObjectApi.parseApi(apiPath);
  }

  static parseApi(apiPath = '') {
    const [, service, apiPrefix, apiVersion, resource, name] =
      apiPath.match(ObjectApi.matcher) || [];
    const apiBase = [service, apiPrefix, apiVersion, resource].filter((v) => v).join('/');
    return {
      apiBase,
      service,
      apiPrefix,
      apiVersion,
      resource,
      name,
    };
  }

  constructor(protected options: IObjectApiOptions<T>) {
    const { kind, objectConstructor = IObject as IObjectConstructor } = options || {};

    const { apiBase, apiVersion, resource } = ObjectApi.parseApi(options.apiBase);

    this.kind = kind;
    this.apiBase = apiBase;
    this.apiVersion = apiVersion;
    this.apiResource = resource;
    this.objectConstructor = objectConstructor;

    this.parseArrayResponse = this.parseArrayResponse.bind(this);
    this.parseResponse = this.parseResponse.bind(this);

    apiManager.registerApi(apiBase, this);
  }

  readonly kind: string;
  readonly apiBase: string;
  readonly apiVersion: string;
  readonly apiResource: string;

  protected versions: number = 0;

  public objectConstructor: IObjectConstructor<T>;

  setVersion(newVersion: number) {
    this.versions = newVersion;
  }

  getVersion(): number {
    return this.versions;
  }

  submitSubscribe(watchApi: WatchApi): Noop[] {
    return [watchApi.subscribe(this)];
  }

  getWatchUrl(query: IObjectApiQueryParams = {}): string {
    return this.getUrl(
      {},
      {
        watch: 1,
        ...query,
      },
    );
  }

  async refreshResourceVersion(params?: {}) {
    return this.list(params, { limit: 1 });
  }

  static createLink(ref: IObjectApiLinkRef): string {
    const { service, apiPrefix = '/api', resource, apiVersion, id } = ref;
    return [service, apiPrefix, apiVersion, resource, id].filter((v) => !!v).join('/');
  }

  private parseArrayResponse(
    data: ObjectJsonApiData | ObjectJsonApiData[] | ObjectJsonApiDataList,
  ): any {
    const ObjectConstructor = this.objectConstructor;
    if (IObject.isJsonApiData(data)) {
      // process single item response
      const { version } = data;
      const currentVersion = this.getVersion();
      if (currentVersion < version) this.setVersion(version);
      return [new ObjectConstructor(data)];
    } else if (IObject.isJsonApiDataList(data)) {
      // process items list response
      const { version, items } = data;
      this.setVersion(version);
      return items.map((item) => new ObjectConstructor({ ...item }));
    } else if (Array.isArray(data)) {
      return data.map((data) => {
        const { version } = data;
        const currentVersion = this.getVersion();
        if (currentVersion < version) this.setVersion(version);
        return new ObjectConstructor(data);
      });
    }
    return [new ObjectConstructor(data)];
  }

  private parseResponse(data: ObjectJsonApiData): any {
    if (!data) return;
    const { version } = data;
    const currentVersion = this.getVersion();
    if (currentVersion < version) this.setVersion(version);
    return new this.objectConstructor(data);
  }

  getUrl = ({ id = '' } = {}, query?: Partial<IObjectApiQueryParams>, op?: string) => {
    const { apiResource } = this;
    const resourcePath = ObjectApi.createLink({
      resource: apiResource,
      id: id,
    });

    op = op ? '/op/' + op : '';
    return resourcePath + op + (query ? `?` + stringify(query) : '');
  };

  list = async ({} = {}, query?: IObjectApiQueryParamsExtension, op?: string): Promise<T[]> => {
    return request(this.getUrl({}, query, op), { method: 'GET' }).then(this.parseArrayResponse);
  };

  get = async (
    { id = '' } = {},
    query?: IObjectApiQueryParamsExtension,
    op?: string,
  ): Promise<T> => {
    return request(this.getUrl({ id }, query, op), { method: 'GET' }).then(this.parseResponse);
  };

  create = async (
    {} = {},
    data?: Partial<T>,
    query?: IObjectApiQueryParamsExtension,
    op?: string,
  ): Promise<T> => {
    const apiUrl = this.getUrl({}, query, op);

    return request(apiUrl, { method: 'POST', data }).then(this.parseResponse);
  };

  update = async (
    { id = '' } = {},
    data?: Partial<T>,
    query?: IObjectApiQueryParamsExtension,
    op?: string,
  ): Promise<T> => {
    return request(this.getUrl({ id }, query, op), { method: 'POST', data }).then(
      this.parseResponse,
    );
  };

  delete = async ({ id = '' } = {}, query?: IObjectApiQueryParamsExtension): Promise<T> => {
    return request(this.getUrl({ id }, query), { method: 'DELETE' }).then(this.parseResponse);
  };

  upload = async <D = string | ArrayBuffer>(data: D) => {
    return request(this.getUrl({}, {}, 'upload'), { method: 'POST', data }).then(
      this.parseResponse,
    );
  };
}
