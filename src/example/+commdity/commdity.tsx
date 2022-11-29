
import { DescriptionsProps, FormProps } from '@/dynamic-components';
import { pageManager } from '@/dynamic-view';
import { View } from '@/dynamic-view/typing';
import { message } from 'antd';
import { commdityStore } from './commdity.store';

const editCommdity: FormProps = {
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

const detailCommdity: DescriptionsProps = {
  modal: 'Drawer',
  items: [
    {
      title: 'Id',
      dataIndex: 'uid',
      key: 'id',
    },
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
    }
  ]
}


// 商品列表
const commdityTable: View = {
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
    { btkind: 'descriptions', fold: true, dataSource: record, ...detailCommdity },
    { btkind: 'form', fold: true, initialValues: record, ...editCommdity },
    { btkind: 'link', fold: true, link: '/commdity/edit', title: '全量编辑' },
    { btkind: 'confirm', onClick: () => message.info('删除成功'), title: '删除', text: `确认删除${record.name}` }
  ],
  dataSource: () => commdityStore.items,
  loading: () => commdityStore.loading,
  onLoading: (actionRef) => commdityStore.next(),
  onSubmit: (params) => commdityStore.next({ per_page: 0, ...params }),
};

pageManager.register('commdity', {
  page: { view: [commdityTable] },
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
