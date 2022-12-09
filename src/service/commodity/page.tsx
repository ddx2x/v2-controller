import { DescriptionsProps, FormProps } from '@/dynamic-components';
import { pageManager } from '@/dynamic-view';
import { View } from '@/dynamic-view/typing';
import { message } from 'antd';
import { commdityAggregateStore, commdityStore } from './store';

const eidt: FormProps = {
  triggerText: '编辑',
  title: '编辑商品',
  layoutType: 'ModalForm',
  columns: [
    {
      title: '商品名称',
      dataIndex: 'sub_title',
    },
  ],
  onSubmit: (form, values) => {
    console.log(values);
    message.success('提交成功');
    return true;
  },
};

const detail: DescriptionsProps = {
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
      dataIndex: 'uid',
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
};

// 商品列表
const table: View = {
  kind: 'table',
  rowKey: 'uid',
  mount: (location, actionRef, formRef, configMap) => {
    configMap?.replace({
      pagination: {
        total: commdityAggregateStore.items.length
      },
      laoding: commdityAggregateStore.loading,
      dataSource: commdityAggregateStore.items,
    })
  },
  toolbar: {
    title: '商品列表',
  },
  toolBarMenu: () => [
    {
      kind: 'descriptions',
      tag: '详情',
      ...detail,
    },
    {
      kind: 'form',
      tag: '编辑',
      collapse: true,
      ...eidt
    },
    {
      kind: 'link',
      tag: '新增',
      link: `/commdity/list/add`,
      title: '新增',
    },
  ],
  columns: [
    {
      dataIndex: 'uid',
      title: '商品标题',
      // width: 150,
      // sorter: true,
    },
    {
      dataIndex: 'sub_title',
      title: '子标题',
      // width: 100,
    },
    {
      dataIndex: 'brand_name',
      title: '品牌',
      filters: true,
      onFilter: true,
      ellipsis: true,
      valueType: 'select',
      valueEnum: {}
      // valueEnum: getBrandName(),
    },
  ],
  expand: {
    kind: 'table',
    onData: (record: any) => commdityStore.api.list(record.uid),
    table: {
      rowKey: 'uid',
      columns: [
        {
          dataIndex: 'uid',
          title: 'uid',
        },
        {
          dataIndex: 'name',
          title: '名称',
        },
        {
          dataIndex: 'sale_channels',
          title: '销售渠道',
        },
        {
          dataIndex: 'price',
          title: '价格',
        },
        {
          dataIndex: 'stock',
          title: '库存',
        },
      ],
      tableMenu: (record: any, action: any) => [
        {
          kind: 'descriptions',
          tag: '详情',
          dataSource: record,
          ...detail,
        },
        {
          kind: 'implement',
          tag: '表格编辑',
          title: '表格编辑',
          onClick() {
            record.uid && action?.startEditable?.(record?.uid);
          },
        },
      ],
    },
  },
  tableMenu: (record, action) => [
    {
      kind: 'descriptions',
      dataSource: record,
      tag: '详情',
      ...detail,
    },
    {
      kind: 'form',
      tag: '编辑',
      collapse: true,
      initialValues: record,
      ...eidt
    },
    {
      kind: 'link',
      collapse: true,
      link: `/commdity/list/edit/?uid=${record.uid}&name=${record.name}`,
      tag: '全量编辑',
      title: '全量编辑',
    },
    {
      kind: 'confirm',
      onClick: () => message.info('删除成功'),
      tag: '删除',
      title: '删除',
      text: `确认删除${record.name}`,
    },
    {
      kind: 'implement',
      key: 't5',
      collapse: true,
      tag: '表格编辑',
      title: '表格编辑',
      onClick(e) { record.uid && action?.startEditable?.(record?.uid) },
    },
  ],
  onRowEvent: [
    {
      mouseEvent: 'onDoubleClick',
      tag: '详情'
    }
  ],
  onNext: (params, actionRef) => commdityAggregateStore.next({ order: { brand_name: 1 }, ...params }),
};

pageManager.register('commdity.list', {
  page: {
    view: [table],
    container: {
      keepAlive: true
    }
  },
  stores: [
    {
      store: commdityAggregateStore,
      query: { order: { brand_name: 1 } },
      load: commdityAggregateStore.next,
      exit: commdityAggregateStore.reset,
    },
  ],
});
