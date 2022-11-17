import type { View } from '@/dynamic-components';
import { pageManager } from '@/dynamic-components';
import { commdityStore } from './commdity.store';

// 商品列表
export const commdityListTable: View = {
  kind: 'table',
  columns: [
    {
      dataIndex: 'name',
      title: '商品名称',
    },
    {
      dataIndex: 'price',
      title: '价格',
    },
    {
      dataIndex: 'actualSales',
      title: '实际销量',
    },
    {
      dataIndex: 'salesChannels',
      title: '销售渠道',
    },
    {
      dataIndex: 'creationTime',
      title: '创建时间',
    },
    {
      dataIndex: 'availableStatus',
      title: '可售状态',
    },
    {
      dataIndex: 'sort',
      title: '排序',
    },
  ],
  dataSource: commdityStore.items,
};

pageManager.register('commdity', {
  page: { view: [commdityListTable] },
  stores: [commdityStore],
});

// 商品标签
export const commdityLabelTable: View = {
  kind: 'table',
  dataSource: [],
  columns: [
    {
      dataIndex: 'name',
      title: '标签名称',
    },
    {
      dataIndex: 'numberOfProductLibraryAssociations',
      title: '商品库关联数',
    },
  ],
};

pageManager.register('commdity.lable', { page: { view: [commdityLabelTable] } });
