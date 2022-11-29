
import { FormProps } from '@/dynamic-components';
import { pageManager } from '@/dynamic-view';
import { View } from '@/dynamic-view/typing';
import { message } from 'antd';
import { commdityStore } from './commdity.store';

const editFormColumns: FormProps = {
  triggerText: '编辑',
  title: '编辑商品',
  layoutType: 'ModalForm',
  columns: [{
    title: '商品名称',
    dataIndex: 'name'
  }],
  onSubmit: (form, values) => {
    console.log(values);
    message.success('提交成功')
    return true
  }
}

// 商品列表
const productTable: View = {
  kind: 'table',
  rowKey: "uid",
  columns: [
    {
      dataIndex: 'uid',
      title: 'id',
    },
    {
      dataIndex: 'name',
      title: '商品名称',
    },
    {
      dataIndex: 'value',
      title: '价格',
    },
  ],
  moreMenuButton: (record) => [
    { kind: 'form', initialValues: record, ...editFormColumns },
    { kind: 'link', link: '/product/add', title: '详情页' },
    { kind: 'confirm', onClick: () => message.info('删除成功'), title: '删除' }
  ],
  dataSource: () => commdityStore.items,
  loading: () => commdityStore.loading,
  onLoading: (actionRef) => commdityStore.next(),
  onSubmit: (params) => commdityStore.next({ per_page: 0, ...params }),
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
