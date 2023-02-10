import { StoreTableProps } from '@/dynamic-components';
import { pageManager } from '@/dynamic-view';
import { message } from 'antd';
import { Role, roleStore } from '../../api/privilegeRole';

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
      render: (text: any, record: Role, index: number, action: any) => {
        return [<>{record.is_super_admin ? "是" : "否"}</>]
      }
    },
    // {
    //   dataIndex: 'privilege_ids',
    //   title: '权限ids',
    //   hideInSearch: true,
    //   editable: false,
    // }
  ],
  toolbar: {
    title: '数据列表',
  },
  toolBarMenu: () => [
    {
      kind: 'link',
      title: '新增',
      link: `/product/brand/add`,

    },
  ],
  tableMenu: (record: any, action: any) => [
    {
      kind: 'descriptions',
      dataSource: record,
      title: '新增',
      collapse: "true",
    },
    {
      kind: 'confirm',
      onClick: () => message.info('删除成功'),
      title: '删除',
      text: `确认删除` + record.uid,
    },

  ],
  onRowEvent: [
    {
      mouseEvent: 'onDoubleClick',
      title: '详情',
    },
  ],
  onRequest: (params: any) =>
    roleStore.next({
      limit: { page: 0, size: 10 },
      sort: { version: 1 },
      ...params,
    }),
  pageSize: 10,
};

pageManager.register('privilege.role', {
  page: {
    view: [{ kind: 'storeTable', ...roleStoreTable }],
  },
  stores: [
    {
      store: roleStore,
      query: { limit: { page: 0, size: 10 }, sort: { version: 1 } },
      load: roleStore.next,
      exit: roleStore.reset,
    }
  ],
});
