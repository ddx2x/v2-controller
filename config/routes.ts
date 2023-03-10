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
    name: 'index',
    path: '/',
    hideInMenu: true,
    component: './index',
  },
  {
    name: 'login',
    path: '/login',
    layout: false,
    component: './login',
  },
  {
    name: '首页',
    href: null,
    path: '/',
    icon: 'HomeTwoTone',
    routes: [],
  },
  {
    name: '商品',
    path: '/product',
    href: null,
    icon: 'shoppingTwoTone',
    routes: [
      {
        name: '商品列表',
        path: '/product/product',
        component: './dynamic-view',
        icon: 'containerTwoTone',
        routes: [
          {
            name: '商品新增',
            path: '/product/product/add',
            component: './dynamic-view',
            parentKeys: ['/product/product'],
            hideInMenu: true,
          },
          {
            name: '商品编辑',
            path: '/product/product/edit',
            component: './dynamic-view',
            parentKeys: ['/product/product'],
            hideInMenu: true,
          },
          {
            name: '单品存量',
            path: '/product/product/sku',
            component: './dynamic-view',
            parentKeys: ['/product/product'],
            hideInMenu: true,
            routes: [
              {
                name: '单品存量编辑',
                path: '/product/product/sku/edit',
                component: './dynamic-view',
                parentKeys: ['/product/product/sku'],
                hideInMenu: true,
              },
            ],
          },
        ],
      },
      {
        name: '商品分类',
        path: '/product/category',
        component: './dynamic-view',
        icon: 'folderOpenTwoTone',
        routes: [
          {
            name: '商品分类属性',
            path: '/product/category/attribute',
            component: './dynamic-view',
            parentKeys: ['/product/category'],
            hideInMenu: true,
            routes: [
              {
                name: '商品属性编辑',
                path: '/product/category/attribute/edit',
                component: './dynamic-view',
                parentKeys: ['/product/category/attribute'],
                hideInMenu: true,
              },
              {
                name: '商品属性新增',
                path: '/product/category/attribute/add',
                component: './dynamic-view',
                parentKeys: ['/product/category/attribute'],
                hideInMenu: true,
              },
            ],
          },
          {
            name: '商品分类新增',
            path: '/product/category/add',
            component: './dynamic-view',
            parentKeys: ['/product/category'],
            hideInMenu: true,
          },
          {
            name: '商品分类编辑',
            path: '/product/category/edit',
            component: './dynamic-view',
            parentKeys: ['/product/category'],
            hideInMenu: true,
          },
        ],
      },
      {
        name: '商品品牌',
        path: '/product/brand',
        component: './dynamic-view',
        icon: 'TagsTwoTone',
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
          },
        ],
      },
    ],
  },

  {
    name: '订单',
    path: '/order',
    icon: 'solution',
    routes: [
      {
        name: '订单列表',
        path: '/order/order',
        icon: 'fileTextTwoTone',
        component: './dynamic-view',
        routes: [
          {
            name: '订单详情',
            path: '/order/order/detail',
            component: './dynamic-view',
            parentKeys: ['/order/order'],
            hideInMenu: true,
          },
        ],
      },
      {
        name: '售后管理',
        path: '/order/after-sale-order',
        icon: 'profileTwoTone',
        component: './dynamic-view',
        parentKeys: ['/after-sale-order'],
        routes: [
          {
            name: '售后单详情',
            path: '/order/after-sale-order/detail',
            component: './dynamic-view',
            parentKeys: ['/order/after-sale-order'],
            hideInMenu: true,
          },
        ],
      },
    ],
  },

  {
    name: '客户',
    path: '/ums',
    icon: 'flag',
    routes: [
      {
        name: '客户列表',
        path: '/ums/customer',
        component: './dynamic-view',
        icon: 'mehTwoTone',
        routes: [],
      },

      {
        name: '会员权益',
        path: '/ums/member',
        icon: 'propertySafetyTwoTone',
        component: './dynamic-view',
        parentKeys: ['/customer'],
      },
    ],
  },

  {
    name: '店铺',
    path: '/cms',
    icon: 'team',
    routes: [
      {
        name: '个性装修',
        path: '/cms/furnish',
        component: './dynamic-view',
        icon: 'layoutTwoTone',
        routes: [],
      },
      {
        name: '系统页面',
        path: '/cms/main',
        icon: 'toolTwoTone',
        component: './dynamic-view',
        routes: [],
      },
      {
        name: '门店列表',
        path: '/cms/door',
        icon: 'shopTwoTone',
        component: './dynamic-view',
        routes: [
          {
            name: '门店新增',
            path: '/cms/door/add',
            component: './dynamic-view',
            parentKeys: ['/cms/door'],
            hideInMenu: true,
          },
          {
            name: '门店编辑',
            path: '/cms/door/edit',
            component: './dynamic-view',
            parentKeys: ['/cms/door'],
            hideInMenu: true,
          },
        ],
      },
    ],
  },
  {
    name: '权限管理',
    path: '/privilege',
    icon: 'safety',
    routes: [
      {
        name: '用户',
        path: '/privilege/user',
        icon: 'contactsTwoTone',
        component: './dynamic-view',
        routes: [],
      },
      {
        name: '角色',
        path: '/privilege/role',
        component: './dynamic-view',
        icon: 'safetyCertificateTwoTone',
        routes: [],
      },
      {
        name: '资源',
        path: '/privilege/resource',
        component: './dynamic-view',
        icon: 'apiTwoTone',
        routes: [],
      },
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
        icon: 'bankTwoTone',
        component: './dynamic-view',
        routes: [],
      },
      {
        name: '商品设置',
        path: '/setting/product',
        icon: 'appstoreTwoTone',
        component: './dynamic-view',
        routes: [],
      },
      {
        name: '配送设置',
        path: '/setting/delivery',
        component: './dynamic-view',
        icon: 'carTwoTone',
        routes: [
          {
            name: '新增配送设置',
            path: '/setting/delivery/add',
            component: './dynamic-view',
            parentKeys: ['/setting/delivery'],
            hideInMenu: true,
          },
          {
            name: '配送设置编辑',
            path: '/setting/delivery/edit',
            component: './dynamic-view',
            parentKeys: ['/setting/delivery'],
            hideInMenu: true,
          },
          {
            name: '新增配送模板',
            path: '/setting/delivery/tempadd',
            component: './dynamic-view',
            parentKeys: ['/setting/delivery'],
            hideInMenu: true,
          },
          {
            name: '配送模板编辑',
            path: '/setting/delivery/tempedit',
            component: './dynamic-view',
            parentKeys: ['/setting/delivery'],
            hideInMenu: true,
          },

          {
            name: '新增自提点',
            path: '/setting/delivery/storepickupadd',
            component: './dynamic-view',
            parentKeys: ['/setting/delivery'],
            hideInMenu: true,
          },
          {
            name: '自提点编辑',
            path: '/setting/delivery/storepickupedit',
            component: './dynamic-view',
            parentKeys: ['/setting/delivery'],
            hideInMenu: true,
          },
        ],
      },
      {
        name: '订单配置',
        path: '/setting/order',
        component: './dynamic-view',
        icon: 'fileTwoTone',
        routes: [],
      },
    ],
  },
];
