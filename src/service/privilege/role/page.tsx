import { StoreTableProps } from '@/dynamic-components';
import { pageManager } from '@/dynamic-view';
import { notification } from 'antd';
import { merge } from 'lodash';
import { roleStore } from '../../api/privilegeRole.store';

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
      collapse: 'true',
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
