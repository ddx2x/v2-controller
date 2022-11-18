
import type { View } from '@/dynamic-components';
import { pageManager } from '@/dynamic-components';
import { commdityStore } from './commdity.store';

// 商品列表
const productTable: View = {
  kind: 'table',
  rowKey: "uid",
  columns: [
    {
      dataIndex: 'name',
      title: '商品名称',
    },
    {
      dataIndex: 'price',
      title: '价格',
    },
  ],
  dataSource: commdityStore.items,
};

// 商品标签
const productLable: View = {
  kind: 'table',
  dataSource: commdityStore.items,
  rowKey: "uid",
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

pageManager.register('product.add', {
  page: { view: [productTable, productLable] },
  stores: [
    {
      store: commdityStore,
      query: { limit: 0 },
      load: commdityStore.next,
      exit: commdityStore.reset,
    },
  ],
});
