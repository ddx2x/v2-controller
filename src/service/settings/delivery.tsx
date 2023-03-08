import { StoreTableProps } from '@/dynamic-components';
import { pageManager } from '@/dynamic-view';
import { history } from '@umijs/max';
import { notification } from 'antd';
import { merge } from 'lodash';
import {
  deliverySettingStore,
  DeliverySettingTemplate,
  deliverySettingTemplateStore,
} from '../api';

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

const defaultStoreTable1: StoreTableProps = {
  toolbarTitle: '商家配送',
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
      tableMenu: (record: DeliverySettingTemplate, action: any) => [
        {
          kind: 'confirm',
          title: '删除',
          onClick: () => {
            deliverySettingTemplateStore
              .remove(record.uid)
              .then(() => {
                notification.success({ message: '删除成功' });
                history.push(`/setting/delivery`);
              })
              .catch((e) => notification.error(e));
          },
          text: `确认删除类型名称` + "'" + record.region + "'",
        },
        {
          kind: 'link',
          title: '编辑',
          link: '/setting/delivery/tempedit?id=' + record.uid,
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
          fixed: 'left',
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
      kind: 'link',
      title: '新增',
      link: '/setting/delivery/tempadd?id=' + record.uid,
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

const defaultStoreTable2: StoreTableProps = {
  toolbarTitle: '门店自提',
  store: deliverySettingStore,
  rowKey: 'uid',
  search: false,
  defaultPageSize: 10,
  columns: [
    {
      dataIndex: 'uid',
      title: 'uid',
      hideInSearch: true,
      editable: false,
      hideInTable: true,
    },
    {
      dataIndex: 'pick_up_name',
      title: '自提点名称',
      hideInSearch: true,
      editable: false,
    },
    {
      dataIndex: 'pick_up_address',
      title: '自提点地址',
      hideInSearch: true,
      editable: false,
    },
    {
      dataIndex: 'owner_store_name',
      title: '所属门店',
      hideInSearch: true,
      editable: false,
    },
    {
      dataIndex: 'contact',
      title: '联系方式',
      hideInSearch: true,
      editable: false,
    },
    {
      dataIndex: 'business_hours',
      title: '营业时间',
      hideInSearch: true,
      editable: false,
    },
    {
      dataIndex: 'state',
      title: '状态',
      hideInSearch: true,
      editable: false,
    },
  ],
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
    view: [
      { kind: 'storeTable', ...defaultStoreTable1 },
      { kind: 'storeTable', ...defaultStoreTable2 },
    ],
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
