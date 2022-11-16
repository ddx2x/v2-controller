import type { TableTemplate } from '@/dynamic-components';
import { templateManager } from '@/dynamic-components';
import { commdityStore } from './commdity.store';

// 商品列表
export const productTable: TableTemplate = {
  kind: "Table",
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

// 商品标签
export const productLable: TableTemplate = {
  kind: "Table",
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

templateManager.register('product.add', { template: [productTable, productLable] });
templateManager.register('product.update', { template: productTable });

// register("/commdity","view", {template: [table,list,serche]})
