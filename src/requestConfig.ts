import type { AxiosResponse, RequestOptions } from '@@/plugin-request/request';
import type { RequestConfig } from '@umijs/max';
import { message, notification } from 'antd';

export const writeLog = (log: AxiosResponse) => {
  const { config, ...params } = log;
  let textStyle = 'font-weight: bold;';
  if (params.status !== 200) {
    textStyle += 'background: red; color: white;';
  } else {
    textStyle += 'background: green; color: white;';
  }
  console.log(`%c${config.method} ${config.url}`, textStyle, params);
};

/**
 * @name 错误处理
 * pro 自带的错误处理， 可以在这里做自己的改动
 * @doc https://umijs.org/docs/max/request#配置
 */
export const requestConfig: RequestConfig = {
  headers: {
    'Cache-Control': 'no-transform',
    'Content-Type': 'application/json',
  },
  transformResponse: (data) => {
    try {
      return JSON.parse(data);
    } catch (e) {
      return data;
    }
  },
  // 错误处理： umi@3 的错误处理方案。
  errorConfig: {
    // 错误抛出
    errorThrower: (res) => {
      message.error(res);
    },
    // 错误接收及处理
    errorHandler: (error: any, opts: any) => {
      if (error.response.status === 401) {
        notification.warning({ message: '登录过期，请重新登录' });
      } else if (error.response.status === 403) {
        notification.warning({ message: '没有权限，请联系系统管理员' });
      } else if (error.response.status > 500) {
        notification.error({ message: '服务器错误，请联系管理员' });
      }
    },
  },
  // 请求拦截器
  requestInterceptors: [
    (config: RequestOptions) => {
      config.headers = {
        ...config.headers,
        'Cache-Control': 'no-transform',
        'Content-Type': 'application/json',
        // 13922313389
        // 'Authorization':'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJuYW1lIjoiMTM5MjIzMTMzODkiLCJpYXQiOjE2ODIwNDE2NjEsImV4cCI6MTY4MjA2MzI2MX0.Mj9-ho604KOROIDuLbMFlT_XlX7QML9K70HfcKLvE8A',
        // admin
        Authorization:
          'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJuYW1lIjoiYWRtaW4iLCJpYXQiOjE2ODIwNDE2OTIsImV4cCI6MjA0MjA0MTY5Mn0.5MToBq8m1NI8y8QgzRw8fRfv3iCd6z2RcKVdOH8ERN0',
      };
      return config;
    },
  ],
  // 响应拦截器
  responseInterceptors: [
    (response) => {
      process.env.NODE_ENV === 'development' && writeLog(response);
      // 拦截响应数据，进行个性化处理
      return response;
    },
  ],
};
