import { StoreTableProps } from '@/dynamic-components';
import { pageManager } from '@/dynamic-view';
import { history } from '@umijs/max';
import { notification } from 'antd';
import { merge } from 'lodash';
import { DeliverySetting, deliverySettingStore, deliverySettingTemplateStore } from '../api';

const columns: StoreTableProps['columns'] = [
  {
    dataIndex: 'uid',
    title: 'uid',
    hideInSearch: true,
    editable: false,
    hideInTable: true,
  },
  {
    dataIndex: 'name',
    title: '模板名称',
    hideInSearch: true,
    editable: false,
    fixed: 'left',
  },
  {
    dataIndex: 'type',
    title: '模板类型',
    hideInSearch: true,
    editable: false,
    valueType: 'radio',
    valueEnum: {
      0: {
        text: '买家承担运费',
      },
      1: {
        text: '卖家包邮',
      },
    },
  },
  {
    dataIndex: 'pricing_method',
    title: '计件方式',
    hideInSearch: true,
    editable: false,
    valueType: 'select',
    valueEnum: {
      0: '按件数',
      1: '按重量',
      2: '按体积',
    },
  },
];

const defaultStoreTable: StoreTableProps = {
  toolbarTitle: '数据列表',
  store: deliverySettingStore,
  rowKey: 'uid',
  search: false,
  defaultPageSize: 10,
  columns: columns,
  expand: {
    kind: 'table',
    onData: (record: any) =>
      deliverySettingTemplateStore.api.list(undefined, {
        limit: { page: 0, size: 10 },
        sort: { version: 1 },
        filter: { delivery_id: record.uid },
      }),
    table: {
      options: false,
      tableMenu: (record: DeliverySetting, action: any) => [
        {
          kind: 'confirm',
          title: '删除',
          onClick: () => {
            // categoryStore2
            //   .remove(record.uid)
            //   .then(() => {
            //     notification.success({ message: '删除成功' });
            //     history.push(`/product/category`);
            //   })
            //   .catch((e) => notification.error(e));
          },
          text: `确认删除类型名称` + "'" + record.uid + "'",
        },
        {
          kind: 'link',
          title: '编辑',
          link: '/setting/delivery/edit?id=' + record.uid,
        },
      ],
      rowKey: 'uid',
      columns: [
        {
          dataIndex: 'uid',
          hideInSearch: true,
          editable: false,
          hideInTable: true,
          fixed: 'left',
        },
        {
          dataIndex: 'region',
          title: '可配送区域',
          hideInSearch: true,
          editable: false,
        },
        {
          dataIndex: 'first',
          title: '首件（个）',
          hideInSearch: true,
          editable: false,
          valueType: 'digit',
        },
        {
          dataIndex: 'freight',
          title: '首费（元）',
          hideInSearch: true,
          editable: false,
          valueType: 'digit',
        },
        {
          dataIndex: 'continuation',
          title: '续件（个）',
          hideInSearch: true,
          editable: false,
          valueType: 'digit',
        },
        {
          dataIndex: 'continuation_freight',
          title: '续费（元）',
          hideInSearch: true,
          editable: false,
          valueType: 'digit',
        },
      ],
    },
  },
  editableValuesChange: (record) => {
    console.log(record);
  },
  toolBarMenu: (selectedRows) => [
    {
      kind: 'link',
      title: '新增',
      link: `/setting/delivery/add`,
    },
  ],
  tableMenu: (record: any, action: any) => [
    {
      kind: 'link',
      title: '编辑',
      link: '/setting/delivery/edit?id=' + record.uid,
    },
    {
      kind: 'confirm',
      title: '删除',
      onClick: () => {
        deliverySettingStore
          .remove(record.uid)
          .then(() => {
            notification.info({ message: '删除成功' });
            history.push(`/setting/delivery`);
          })
          .catch((e) => {
            notification.error(e);
          });
      },
      text: `确认删除` + record.name,
    },
  ],
  onRowEvent: [
    {
      mouseEvent: 'onDoubleClick',
      title: '详情',
    },
  ],
  onRequest: (params) => {
    deliverySettingStore.next(merge(params, { sort: { version: 1 } }));
  },
  batchDelete: (selectedRows) => console.log('batchDelete', selectedRows),
};

pageManager.register('setting.delivery', {
  page: {
    view: [{ kind: 'storeTable', ...defaultStoreTable }],
    container: {
      keepAlive: false,
    },
  },
  stores: [
    {
      store: deliverySettingStore,
      exit: deliverySettingStore.reset,
    },
  ],
});
