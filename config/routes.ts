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
    name: 'login',
    path: '/login',
    layout: false,
    component: './login',
  },
  {
    name: '商品',
    path: '/commdity',
    icon: 'compass',
    routes: [
      {
        name: '商品列表',
        path: '/commdity/list',
        icon: 'setting',
        component: './dynamic-view',
        routes: [
          {
            name: '商品编辑',
            path: '/commdity/list/edit',
            hideInMenu: true,
            icon: 'setting',
            component: './dynamic-view',
            parentKeys: ['/commdity/list']
          },
        ]
      },
      {
        name: '商品新增',
        path: '/commdity/add',
        icon: 'setting',
        component: './dynamic-view',
        parentKeys: ['/commdity']
      },

    ]
  },

  {
    name: '订单',
    path: '/order',
    icon: 'setting',
    routes: [
      {
        name: '订单列表',
        path: '/order/list',
        icon: 'setting',
        component: './dynamic-view',
        routes: [

        ]
      },

      {
        name: '发货管理',
        path: '/order/deliverlist',
        icon: 'setting',
        component: './dynamic-view',
        parentKeys: ['/order']
      },

    ]
  },


  {
    name: '客户',
    path: '/customer',
    icon: 'setting',
    routes: [
      {
        name: '客户列表',
        path: '/customer/list',
        icon: 'setting',
        component: './dynamic-view',
        routes: [

        ]
      },

      {
        name: '积分',
        path: '/customer/integral',
        icon: 'setting',
        component: './dynamic-view',
        parentKeys: ['/customer']
      },

    ]
  },



  {
    name: '门店',
    path: '/door',
    icon: 'setting',
    routes: [
      {
        name: '门店列表',
        path: '/door/list',
        icon: 'setting',
        component: './dynamic-view',
        routes: [

        ]
      },
    ]
  },

  {
    name: '设置',
    path: '/settings',
    icon: 'setting',
    routes: [
      {
        name: '商户设置',
        path: '/settings/shop',
        icon: 'setting',
        component: './dynamic-view',
        routes: [
        ]
      },
      {
        name: '网店设置',
        path: '/settings/door',
        icon: 'setting',
        component: './dynamic-view',
        routes: [
        ]
      },
      {
        name: '配送设置',
        path: '/settings/door',
        icon: 'setting',
        component: './dynamic-view',
        routes: [
        ]
      },
    ]
  },
];
