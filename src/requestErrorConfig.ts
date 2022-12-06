import type { AxiosResponse, RequestOptions } from '@@/plugin-request/request';
import type { RequestConfig } from '@umijs/max';
import { message } from 'antd';

const writeLog = (log: AxiosResponse) => {
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
export const errorConfig: RequestConfig = {
  headers: { 'Cache-Control': 'no-transform' },
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
      message.error(res, 3000);
    },
    // 错误接收及处理
    errorHandler: (error: any, opts: any) => {
      message.error(error.message, 3000);
    },
  },

  // 请求拦截器
  requestInterceptors: [
    (config: RequestOptions) => {
      // 拦截请求配置，进行个性化处理。
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
