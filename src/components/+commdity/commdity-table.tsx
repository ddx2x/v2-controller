import { TableTemplate, templateManager } from '@/dynamic-components';

// 商品列表
export const commdityListTable: TableTemplate = {
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
  dataSource: [],
};

templateManager.register('commdity', { table: commdityListTable });

// 商品标签
export const commdityLabelTable: TableTemplate = {
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

templateManager.register('commdity-label', { table: commdityLabelTable });
