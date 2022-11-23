
import { pageManager } from '@/dynamic-view';
import { View } from '@/dynamic-view/typing';
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
      dataIndex: 'value',
      title: '价格',
    },
  ],
  loading: () => commdityStore.loading,
  onLoading: (actionRef) => commdityStore.next(),
  dataSource: () => commdityStore.items.map(item => { return { uid: item.uid, name: item.name } })
};


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
