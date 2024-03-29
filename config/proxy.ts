/**
 * @name 代理的配置
 * @see 在生产环境 代理是无法生效的，所以这里没有生产环境的配置
 * -------------------------------
 * The agent cannot take effect in the production environment
 * so there is no configuration of the production environment
 * For details, please see
 * https://pro.ant.design/docs/deploy
 *
 * @doc https://umijs.org/docs/guides/proxy
 */
export default {
  dev: {
    // localhost:8000/api/** -> https://preview.pro.ant.design/api/**
    '/api/': {
      // 要代理的地址
      target: 'http://127.0.0.1:8082',
      // 配置了这个可以从 http 代理到 https
      // 依赖 origin 的功能可能需要这个，比如 cookie
      changeOrigin: true,
      logger: console,
    },
    '/product-t/**': {
      target: 'http://127.0.0.1:3000',
      changeOrigin: true,
      logger: console,
    },
    '/trade-t/**': {
      target: 'http://127.0.0.1:3000',
      changeOrigin: true,
      logger: console,
    },
    '/cms-t/**': {
      target: 'http://127.0.0.1:3000',
      changeOrigin: true,
      logger: console,
    },
    '/settings/**': {
      target: 'http://127.0.0.1:3000',
      changeOrigin: true,
      logger: console,
    },
    '/base/**': {
      target: 'http://127.0.0.1:3000',
      changeOrigin: true,
      logger: console,
    },
    '/search/**': {
      target: 'http://127.0.0.1:3000',
      // changeOrigin: true,
      logger: console,
    },
    '/watch/**': {
      target: 'http://127.0.0.1:3000',
      // changeOrigin: true,
      logger: console,
    },
    '/superset/': {
      target: 'http://10.200.100.200:8088',
      // changeOrigin: true,
    },
    '/media-t/**': {
      target: 'http://0.0.0.0:3000',
    },
    '/ums-t/**': {
      target: 'http://0.0.0.0:3000',
    },
    '/search-t/**': {
      target: 'http://0.0.0.0:3000',
    },
  },
};
