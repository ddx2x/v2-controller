
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
  triggerText: '详情',
  columns: [
    {
      title: '文本',
      key: 'text',
      dataIndex: 'id',
      ellipsis: true,
      copyable: true,
    },
    {
      title: '状态',
      key: 'state',
      dataIndex: 'state',
      valueType: 'select',
      valueEnum: {
        all: { text: '全部', status: 'Default' },
        open: {
          text: '未解决',
          status: 'Error',
        },
        closed: {
          text: '已解决',
          status: 'Success',
        },
      },
    },
    {
      title: '状态2',
      key: 'state2',
      dataIndex: 'state2',
    },
    {
      title: '时间',
      key: 'date',
      dataIndex: 'date',
      valueType: 'date',
    },
    {
      title: 'money',
      key: 'money',
      dataIndex: 'money',
      valueType: 'money',
    },
    {
      title: 'Id',
      key: 'uid',
      dataIndex: 'uid'
    },
    {
      title: '名称',
      key: 'name',
      dataIndex: 'name',
    },
    {
      title: '名称',
      key: 'name',
      dataIndex: 'name',
      valueType: 'imageUpload',
    },
    {
      title: '操作',
      valueType: 'option',
      render: () => [
        <a target="_blank" rel="noopener noreferrer" key="link">
          链路
        </a>,
        <a target="_blank" rel="noopener noreferrer" key="warning">
          报警
        </a>,
        <a target="_blank" rel="noopener noreferrer" key="view">
          查看
        </a>,
      ],
    },
  ],
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
  expand: {
    kind: 'table',
    onDataRender: (record) => [record],
    table: {
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
    },
  },
  moreMenuButton: (record) => [
    {
      btkind: 'descriptions',
      fold: true,
      dataSource: {
        id: '这是一段文本columns',
        date: '20200809',
        money: '1212100',
        state: 'closed',
        state2: 'open',
        ...record
      },
      ...detailCommdity
    },
    { btkind: 'form', fold: true, initialValues: record, ...editCommdity },
    { btkind: 'link', fold: true, link: `/commdity/page/edit/?uid=${record.uid}&name=${record.name}`, title: '全量编辑' },
    { btkind: 'confirm', onClick: () => message.info('删除成功'), title: '删除', text: `确认删除${record.name}` }
  ],
  dataSource: () => commdityStore.items,
  loading: () => commdityStore.loading,
  onLoading: (actionRef) => commdityStore.next(),
  onSubmit: (params) => commdityStore.next({ per_page: 0, ...params }),
};

pageManager.register('commdity.page', {
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
