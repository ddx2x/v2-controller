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
    href: null,
    path: '/product',
    icon: 'compass',
    routes: [
      {
        name: '商品列表',
        path: '/product/list',
        icon: 'setting',
        component: './dynamic-view',
        routes: [
          {
            name: '单品新增',
            path: '/product/list/aggregate_add',
            icon: 'setting',
            component: './dynamic-view',
            parentKeys: ['/product/list'],
            hideInMenu: true,
          },
          {
            name: '单品编辑',
            path: '/product/list/aggregate_edit',
            icon: 'setting',
            component: './dynamic-view',
            parentKeys: ['/product/list'],
            hideInMenu: true,
          },
        ],
      },
      {
        name: '商品分类',
        path: '/product/category',
        icon: 'setting',
        component: './dynamic-view',
        routes: [
          {
            name: '商品分类属性',
            path: '/product/category/attribute',
            icon: 'setting',
            component: './dynamic-view',
            parentKeys: ['/product/category'],
            hideInMenu: true,
            routes: [
              {
                name: '商品属性编辑',
                path: '/product/category/attribute/edit',
                icon: 'setting',
                component: './dynamic-view',
                parentKeys: ['/product/category/attribute'],
                hideInMenu: true,
              },
              {
                name: '商品属性新增',
                path: '/product/category/attribute/add',
                icon: 'setting',
                component: './dynamic-view',
                parentKeys: ['/product/category/attribute'],
                hideInMenu: true,
              }
            ]
          },
          {
            name: '商品分类新增',
            path: '/product/category/add',
            icon: 'setting',
            component: './dynamic-view',
            parentKeys: ['/product/category'],
            hideInMenu: true,
          },
          {
            name: '商品分类编辑',
            path: '/product/category/edit',
            icon: 'setting',
            component: './dynamic-view',
            parentKeys: ['/product/category'],
            hideInMenu: true,
          },
        ]
      },
      {
        name: '商品品牌',
        path: '/product/brand',
        icon: 'setting',
        component: './dynamic-view',
        routes: [
          {
            name: '商品品牌编辑',
            path: '/product/brand/edit',
            component: './dynamic-view',
            parentKeys: ['/product/brand'],
            hideInMenu: true,
          },
          {
            name: '商品品牌新增',
            path: '/product/brand/add',
            component: './dynamic-view',
            parentKeys: ['/product/brand'],
            hideInMenu: true,
          }
        ]
      }
    ],
  },

  {
    name: '订单',
    path: '/order',
    icon: 'solution',
    routes: [
      {
        name: '订单列表',
        path: '/order/list',
        icon: 'setting',
        component: './dynamic-view',
        routes: [],
      },

      {
        name: '发货管理',
        path: '/order/deliverlist',
        icon: 'setting',
        component: './dynamic-view',
        parentKeys: ['/order'],
      },
    ],
  },

  {
    name: '客户',
    path: '/customer',
    icon: 'flag',
    routes: [
      {
        name: '客户列表',
        path: '/customer/list',
        icon: 'setting',
        component: './dynamic-view',
        routes: [],
      },

      {
        name: '会员权益',
        path: '/customer/integral',
        icon: 'setting',
        component: './dynamic-view',
        parentKeys: ['/customer'],
      },
    ],
  },

  {
    name: '店铺',
    path: '/door',
    icon: 'team',
    routes: [
      {
        name: '个性装修',
        path: '/door/furnish',
        component: './dynamic-view',
        routes: [],
      },
      {
        name: '系统页面',
        path: '/door/main',
        component: './dynamic-view',
        routes: [],
      },
      {
        name: '门店列表',
        path: '/door/list',
        component: './dynamic-view',
        routes: [],
      },
    ],
  },

  {
    name: '权限管理',
    path: '/privilege',
    icon: 'setting',
    routes: [
      {
        name: '用户',
        path: '/privilege/user',
        component: './dynamic-view',
        routes: [],
      },
      {
        name: '角色',
        path: '/privilege/role',
        component: './dynamic-view',
        routes: [],
      },
      {
        name: '资源',
        path: '/privilege/resource',
        component: './dynamic-view',
        routes: [],
      }
    ],
  },

  {
    name: '设置',
    path: '/setting',
    icon: 'setting',
    routes: [
      {
        name: '商户设置',
        path: '/setting/shop',
        icon: 'setting',
        component: './dynamic-view',
        routes: [],
      },
      {
        name: '商品设置',
        path: '/setting/product',
        icon: 'setting',
        component: './dynamic-view',
        routes: [],
      },
      {
        name: '配送设置',
        path: '/setting/logistics',
        icon: 'setting',
        component: './dynamic-view',
        routes: [],
      },
      {
        name: '订单配置',
        path: '/setting/order',
        icon: 'setting',
        component: './dynamic-view',
        routes: [],
      }
    ],
  },
];
