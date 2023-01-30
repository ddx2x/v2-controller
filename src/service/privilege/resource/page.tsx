import { pageManager } from '@/dynamic-view';
import { View } from '@/dynamic-view/typing';
import { message } from 'antd';
import { privilegeStore } from './store';

const table: View = {
  kind: 'storeTable',
  store: privilegeStore,
  rowKey: 'uid',
  columns: [
    {
      dataIndex: 'uid',
      title: '资源名',
      hideInSearch: true,
      editable: false,
    },
    {
      dataIndex: 'type',
      title: '类型',
      hideInSearch: true,
      editable: false,
    },
    {
      dataIndex: 'url',
      title: '路由模式',
      hideInSearch: true,
      editable: false,
    },
    {
      dataIndex: 'is_view',
      title: '是否显示',
      hideInSearch: true,
      editable: false,
    },
    {
      dataIndex: 'op',
      title: '操作权限',
      hideInSearch: true,
      editable: false,
    }
  ],
  usePagination: true,
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
  onNext: (params: any) =>
    privilegeStore.next({
      limit: { page: 0, size: 10 },
      sort: { version: 1 },
      ...params,
    }),
};

pageManager.register('privilege.resource', {
  page: {
    view: [table],
  },
  stores: [
    {
      store: privilegeStore,
      query: { limit: { page: 0, size: 10 }, sort: { version: 1 } },
      load: privilegeStore.load,
      exit: privilegeStore.reset,
    }
  ],
});
