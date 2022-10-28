import { appManager, ListLayout } from '@/components/+app';
import { Progress } from 'antd';

const dataSource = [
  {
    title: '语雀的天空',
    avatar:
      'https://gw.alipayobjects.com/zos/antfincdn/efFD%24IOql2/weixintupian_20170331104822.jpg',
  },
  {
    title: 'Ant Design',
    avatar:
      'https://gw.alipayobjects.com/zos/antfincdn/efFD%24IOql2/weixintupian_20170331104822.jpg',
  },
  {
    title: '蚂蚁金服体验科技',
    avatar:
      'https://gw.alipayobjects.com/zos/antfincdn/efFD%24IOql2/weixintupian_20170331104822.jpg',
  },
  {
    title: 'TechUI',
    avatar:
      'https://gw.alipayobjects.com/zos/antfincdn/efFD%24IOql2/weixintupian_20170331104822.jpg',
  },
];

const metas = {
  title: {},
  description: {
    render: () => {
      return 'Ant Design, a design language for background applications, is refined by Ant UED Team';
    },
  },
  avatar: {},
  extra: {
    render: () => (
      <div
        style={{
          minWidth: 200,
          flex: 1,
          display: 'flex',
          justifyContent: 'flex-end',
        }}
      >
        <div
          style={{
            width: '200px',
          }}
        >
          <div>发布中</div>
          <Progress percent={80} />
        </div>
      </div>
    ),
  },
  actions: {
    render: () => {
      return [<a key="init">邀请</a>, '发布'];
    },
  },
};

const storeList: ListLayout = {
  containerProps: {
    header: {
      title: '肚子饿了',
    },
  },
  metas,
  dataSource,
  useBatchDelete: true,
};

appManager.register('store-list', { list: storeList });
