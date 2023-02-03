import { StoreTableProps } from '@/dynamic-components';
import { pageManager } from '@/dynamic-view';
import { message } from 'antd';
import { userStore } from './store';

const userStoreTable: StoreTableProps = {
  store: userStore,
  rowKey: 'uid',
  columns: [
    {
      dataIndex: 'uid',
      title: 'id',
      hideInSearch: true,
      editable: false,
    },
    {
      dataIndex: 'name',
      title: '名称',
      hideInSearch: true,
      editable: false,
    },
    {
      dataIndex: 'login_type',
      title: '登陆类型',
      hideInSearch: true,
      editable: false,
    },
    {
      dataIndex: 'last_login_time',
      title: '最后登陆',
      hideInSearch: true,
      editable: false,
      valueType: 'second',
    },
    {
      dataIndex: 'is_lock',
      title: '锁定',
      hideInSearch: true,
      valueType: "switch",
      valueEnum: {
        0: '停用',
        1: '启用'
      }
    },
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
};

pageManager.register('privilege.user', {
  page: {
    view: [{ kind: 'storeTable', ...userStoreTable }],
  },
  stores: [
    {
      store: userStore,
      query: { limit: { page: 0, size: 10 }, sort: { version: 1 } },
      load: userStore.load,
      exit: userStore.reset,
    }
  ],
});
