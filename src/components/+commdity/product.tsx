
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
  dataSource: () => commdityStore.items.map(item => { return { uid: item.uid, name: item.name } })
};

// // 商品标签
// const productLable: View = {
//   kind: 'table',
//   store: commdityStore,
//   rowKey: "uid",
//   columns: [
//     {
//       dataIndex: 'name',
//       title: '标签名称',
//     },
//     {
//       dataIndex: 'numberOfProductLibraryAssociations',
//       title: '商品库关联数',
//     },
//   ],
// };

pageManager.register('product.add', {
  page: { view: [productTable] },
  stores: [
    {
      store: commdityStore,
      query: { limit: 0 },
      load: commdityStore.load,
      watch: commdityStore.watch,
      exit: commdityStore.reset,
    },
  ],
});
