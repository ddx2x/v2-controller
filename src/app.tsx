import Footer from '@/components/layout/footer';
import RightContent from '@/components/layout/right-content';
import { ClearOutlined, SearchOutlined } from '@ant-design/icons';
import type { MenuDataItem, Settings as LayoutSettings } from '@ant-design/pro-components';
import { SettingDrawer } from '@ant-design/pro-components';
import { history, Link, RunTimeLayoutConfig, useAliveController, useLocation } from '@umijs/max';
import { Button, Input, Popconfirm, Space } from 'antd';
import { useState } from 'react';
import defaultSettings from '../config/defaultSettings';
import { isCachingNode } from './components/kit/container';
import { errorConfig } from './requestErrorConfig';
import { currentUser as queryCurrentUser } from './services/ant-design-pro/api';

const isDev = process.env.NODE_ENV === 'development';
const loginPath = '/user/login';

// 搜索过滤菜单
const filterByMenuDate = (data: MenuDataItem[], keyWord: string): MenuDataItem[] =>
  data
    .map((item) => {
      if (
        (item.name && item.name.includes(keyWord)) ||
        filterByMenuDate(item.children || [], keyWord).length > 0
      ) {
        return {
          ...item,
          children: filterByMenuDate(item.children || [], keyWord),
        };
      }

      return undefined;
    })
    .filter((item) => item) as MenuDataItem[];

const loopMenuItem = (menus: any[]): MenuDataItem[] =>
  menus.map(({ icon, routes, ...item }) => ({
    ...item,
    children: routes && loopMenuItem(routes),
  }));

const menuRender = (
  item: MenuDataItem & {
    isUrl: boolean;
  },
  dom: any,
  collapsed: boolean,
) => {
  const { dropScope } = useAliveController();
  const location = useLocation();

  let canClear = false;
  canClear = isCachingNode(item.path);

  return (
    <Space align="baseline" size={150}>
      <Link to={item.path as string}>{dom}</Link>
      {!collapsed && canClear && (
        <Popconfirm
          title="是否清除缓存"
          okText="是"
          cancelText="否"
          onConfirm={() => item.path && dropScope(item.path)}
        >
          <Button
            disabled={location.pathname == item.path}
            onClick={(e) => e.stopPropagation()}
            type="link"
            icon={<ClearOutlined />}
          />
        </Popconfirm>
      )}
    </Space>
  );
};

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  currentUser?: API.CurrentUser;
  loading?: boolean;
  fetchUserInfo?: () => Promise<API.CurrentUser | undefined>;
}> {
  const fetchUserInfo = async () => {
    try {
      const msg = await queryCurrentUser({
        skipErrorHandler: true,
      });
      return msg.data;
    } catch (error) {
      history.push(loginPath);
    }
    return undefined;
  };
  // 如果不是登录页面，执行
  if (window.location.pathname !== loginPath) {
    // const currentUser = await fetchUserInfo();
    const currentUser = { name: 'admin' };
    return {
      fetchUserInfo,
      currentUser,
      settings: defaultSettings,
    };
  }
  return {
    fetchUserInfo,
    settings: defaultSettings,
  };
}

// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({ initialState, setInitialState }) => {
  const [keyWord, setKeyWord] = useState('');
  const [collapsed, setCollapsed] = useState(true);

  return {
    rightContentRender: () => <RightContent />,
    // waterMarkProps: {
    //   content: initialState?.currentUser?.name,
    // },
    footerRender: () => <Footer />,
    onPageChange: () => {
      // 如果没有登录，重定向到 login
      const { location } = history;
      if (!initialState?.currentUser && location.pathname !== loginPath) {
        history.push(loginPath);
      }
    },
    layoutBgImgList: [
      {
        src: 'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/D2LWSqNny4sAAAAAAAAAAAAAFl94AQBr',
        left: 85,
        bottom: 100,
        height: '303px',
      },
      {
        src: 'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/C2TWRpJpiC0AAAAAAAAAAAAAFl94AQBr',
        bottom: -68,
        right: -45,
        height: '303px',
      },
      {
        src: 'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/F6vSTbj8KpYAAAAAAAAAAAAAFl94AQBr',
        bottom: 0,
        left: 0,
        width: '331px',
      },
    ],
    links: isDev
      ? [
          // <Link key="openapi" to="/umi/plugin/openapi" target="_blank">
          //   <LinkOutlined />
          //   <span>OpenAPI 文档</span>
          // </Link>,
        ]
      : [],
    // 自定义菜单
    collapsed: collapsed,
    onCollapse: (collapsed) => setCollapsed(collapsed),
    menuExtraRender: ({ collapsed }) =>
      !collapsed && (
        <Input
          style={{
            borderRadius: 4,
            marginBottom: 10,
            backgroundColor: 'rgba(0,0,0,0.03)',
          }}
          prefix={
            <SearchOutlined
              style={{
                color: 'rgba(0, 0, 0, 0.15)',
              }}
            />
          }
          placeholder="搜索菜单"
          bordered={false}
          onChange={(e) => {
            setKeyWord((e.target as HTMLInputElement).value);
          }}
        />
      ),
    postMenuData: (menus) => filterByMenuDate(menus || [], keyWord),
    menuItemRender: (item, dom) => menuRender(item, dom, collapsed),
    menuHeaderRender: undefined,
    // 自定义 403 页面
    // unAccessible: <div>unAccessible</div>,
    // 增加一个 loading 的状态
    childrenRender: (children, props) => {
      // if (initialState?.loading) return <PageLoading />;
      return (
        <>
          {children}
          {!props.location?.pathname?.includes('/login') && (
            <SettingDrawer
              disableUrlParams
              enableDarkTheme
              settings={initialState?.settings}
              onSettingChange={(settings) => {
                setInitialState((preInitialState) => ({
                  ...preInitialState,
                  settings,
                }));
              }}
            />
          )}
        </>
      );
    },
    ...initialState?.settings,
  };
};

/**
 * @name request 配置，可以配置错误处理
 * 它基于 axios 和 ahooks 的 useRequest 提供了一套统一的网络请求和错误处理方案。
 * @doc https://umijs.org/docs/max/request#配置
 */
export const request = {
  ...errorConfig,
};
