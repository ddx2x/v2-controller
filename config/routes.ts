/**
 * @name umi 的路由配置
 * @description 只支持 path,component,routes,redirect,wrappers,title 的配置
 * @param path  path 只支持两种占位符配置，第一种是动态参数 :id 的形式，第二种是 * 通配符，通配符只能出现路由字符串的最后。
 * @param component 配置 location 和 path 匹配后用于渲染的 React 组件路径。可以是绝对路径，也可以是相对路径，如果是相对路径，会从 src/pages 开始找起。
 * @param routes 配置子路由，通常在需要为多个路径增加 layout 组件时使用。
 * @param redirect 配置路由跳转
 * @param wrappers 配置路由组件的包装组件，通过包装组件可以为当前的路由组件组合进更多的功能。 比如，可以用于路由级别的权限校验
 * @doc https://umijs.org/docs/guides/routes
 * @doc https://www.iconfont.cn/collections/detail?spm=a313x.7781069.1998910419.d9df05512&cid=9402
 */
export default [
  {
    path: '*',
    layout: false,
    component: './404',
  },
  {
    path: '/user',
    layout: false,
    routes: [
      {
        name: 'login',
        path: '/user/login',
        component: './user/login',
      },
    ],
  },
  {
    path: '/',
    redirect: '/commodity/table',
  },
  {
    icon: 'mail',
    name: '商品',
    path: '/',
    routes: [
      {
        icon: 'chrome',
        path: '/commodity/table',
        name: '商品列表',
        component: './app',
      },
      {
        path: '/commodity-add/step-form',
        name: '新增商品',
        component: './app',
      },
      {
        path: '/commodity-sale/table',
        name: '商品标签',
        component: './app',
      },
      {
        path: '/goods-sale/table',
        name: '在售商品',
        component: './app',
      },
      {
        path: '/store-list/list',
        name: '商店',
        component: './app',
      },
    ],
  },
];
