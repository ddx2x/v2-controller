import { TableTemplate, templateManager } from '@/dynamic-components';

export const storeTable: TableTemplate = {
  columns: [
    { dataIndex: 'number', title: '门店编号' },
    { dataIndex: 'name', title: '门店名称' },
    { dataIndex: 'address', title: '门店地址' },
    { dataIndex: 'sort', title: '门店排序' },
    { dataIndex: 'status', title: '门店状态' },
  ],
};

templateManager.register('store', { table: storeTable });

