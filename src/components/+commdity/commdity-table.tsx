import { StepFormTemplate, TableTemplate, templateManager } from '@/dynamic-components';

// form
// table

export const commdityTable: TableTemplate = {
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

templateManager.register('commdity', { table: commdityTable });
