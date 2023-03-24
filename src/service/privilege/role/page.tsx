import { StoreTableProps } from '@/dynamic-components';
import { pageManager } from '@/dynamic-view';
import { notification } from 'antd';
import { DataNode } from 'antd/es/tree';
import { merge } from 'lodash';
import { roleStore } from '../../api/privilegeRole.store';
import { roleTree } from './grant';

const treeData: DataNode[] = [
  {
    title: '商品',
    key: 'shangping',
    children: [
      {
        title: '列表',
        key: 'list',
      },
    ],
  },
  {
    title: '订单',
    key: 'order',
    children: [
      {
        title: '发货',
        key: 'ship',
      },
      {
        title: '关闭',
        key: 'close',
      },
    ],
  },
];

interface TableTreeNode {
  tabTitle: string;
  valueType: string;
  dataNode: DataNode[];
}

const table: StoreTableProps = {
  toolbarTitle: '数据列表',
  rowKey: 'uid',
  store: roleStore,
  search: false,
  size: 'small',
  columns: [
    {
      dataIndex: 'uid',
      hideInTable: true,
      hideInSearch: true,
      editable: false,
    },
    {
      dataIndex: 'name',
      title: '岗位角色',
      fixed: 'left',
      hideInSearch: true,
      editable: false,
    },
    {
      dataIndex: 'type',
      title: '岗位类型',
      hideInSearch: true,
      editable: false,
      valueType: 'select',
      valueEnum: {
        0: '平台岗位',
        1: '门店岗位',
        2: '供应商岗位',
        3: '区域岗位',
      },
    },
    {
      dataIndex: 'privileges',
      title: '权限列表',
      hideInSearch: true,
      editable: false,
    },
  ],
  toolBarMenu: (selectedRows: any) => [
    {
      kind: 'link',
      title: '新增',
      link: `/privilege/role/add`,
    },
  ],
  tableMenu: (record: any, action: any) => [
    {
      kind: 'descriptions',
      dataSource: record,
      title: '新增',
    },
    {
      kind: 'form',
      title: '授权',
      layoutType: 'ModalForm',
      triggerText: '授权',
      style: { width: '100%' },
      columns: [roleTree],
      submitter: {
        // resetButtonProps: false,
        searchConfig: {
          submitText: '保存',
          resetText: '取消',
        },
      },
      fieldProps: {
        initNode: async () => {
          return await [
            { tabTitle: '平台权限', valueType: 'collapse', dataNode: treeData, disabled: true },
            { tabTitle: '区域权限', valueType: 'collapse', dataNode: treeData, disabled: true },
            { tabTitle: '门店权限', valueType: 'collapse', dataNode: treeData },
          ];
        },
        defaultActiveKey: '3',
      },
      onMount: ({ form }) => {
        form.setFieldsValue({
          roleTree: {
            平台权限: ['close'],
          },
        });
      },
      onSubmit({ formRef, values, dataObject, handleClose }) {
        console.log('grantForm values', values);

        return false;
      },
    },
    {
      kind: 'confirm',
      onClick: () => {
        roleStore
          .remove(record.uid)
          .then(() => {
            notification.info({ message: '删除成功' });
          })
          .catch((e) => {
            notification.error(e);
          });
      },
      title: '删除',
      text: `确认删除` + record.name,
    },
  ],
  onRowEvent: [
    {
      mouseEvent: 'onDoubleClick',
      title: '详情',
    },
  ],
  onRequest: ({ query }) => roleStore.next(merge(query, { sort: { version: 1 } })),
};

pageManager.register('privilege.role', {
  page: {
    view: [{ kind: 'storeTable', ...table }],
    container: {
      keepAlive: false,
    },
  },
  stores: [
    {
      store: roleStore,
      exit: roleStore.reset,
    },
  ],
});
