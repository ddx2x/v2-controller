import { StoreTableProps } from '@/dynamic-components';
import { pageManager } from '@/dynamic-view';
import { message } from 'antd';
import { roleStore } from './store';

const roleStoreTable: StoreTableProps = {
  store: roleStore,
  rowKey: 'uid',
  columns: [
    {
      dataIndex: 'uid',
      title: '角色',
      hideInSearch: true,
      editable: false,
    },
    {
      dataIndex: 'is_super_admin',
      title: '是否超级管理员',
      hideInSearch: true,
      editable: false,
    },
    {
      dataIndex: 'privilege_ids',
      title: '权限ids',
      hideInSearch: true,
      editable: false,
    }
  ],
  toolbar: {
    title: '数据列表',
  },
  toolBarMenu: () => [
    {
      kind: 'link',
      tag: '新增',
      link: `/product/brand/add`,
      title: '新增',
    },
  ],
  tableMenu: (record: any, action: any) => [
    {
      kind: 'descriptions',
      dataSource: record,
      tag: '详情',
      collapse: "true",
    },
    {
      kind: 'confirm',
      onClick: () => message.info('删除成功'),
      tag: '删除',
      title: '删除',
      text: `确认删除` + record.name,
    },

  ],
  onRowEvent: [
    {
      mouseEvent: 'onDoubleClick',
      tag: '详情',
    },
  ],
  // onNext: (params: any) =>
  //   roleStore.next({
  //     limit: { page: 0, size: 10 },
  //     sort: { version: 1 },
  //     ...params,
  //   }),
};

pageManager.register('privilege.role', {
  page: {
    view: [{ kind: 'storeTable', ...roleStoreTable }],
  },
  stores: [
    {
      store: roleStore,
      query: { limit: { page: 0, size: 10 }, sort: { version: 1 } },
      load: roleStore.load,
      exit: roleStore.reset,
    }
  ],
});
