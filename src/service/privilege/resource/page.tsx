import { StoreTableProps } from '@/dynamic-components';
import { pageManager } from '@/dynamic-view';
import { merge } from 'lodash';
import { Privilege, privilegeStore } from '../../api/privilegeResource.store';

const table: StoreTableProps = {
  store: privilegeStore,
  search: false,
  rowKey: 'uid',
  columns: [
    {
      dataIndex: 'uid',
      title: '资源名',
      hideInSearch: true,
      fixed: 'left',
      width: 120,
      editable: false,
    },
    {
      dataIndex: 'type',
      title: '类型',
      hideInSearch: true,
      editable: false,
      render: (text: any, record: Privilege, index: number, action: any) => {
        return [<>{record.type == 0 ? '页面' : '数据'}</>];
      },
    },
    {
      dataIndex: 'url',
      title: '路由模式',
      hideInSearch: true,
      width: 300,
      editable: false,
    },
    {
      dataIndex: 'is_view',
      title: '是否显示',
      hideInSearch: true,
      editable: false,
      render: (text: any, record: Privilege, index: number, action: any) => {
        return [<>{record.is_view ? '是' : '否'}</>];
      },
    },
    {
      dataIndex: 'op',
      title: '操作类型',
      hideInSearch: true,
      editable: false,
      valueEnum: {
        1: '查看',
        2: '修改',
        4: '查看+修改',
      },
    },
  ],

  toolbar: {
    title: '数据列表',
  },
  toolBarMenu: () => [
    // {
    //   kind: 'link',
    //   title: '新增',
    //   link: `/product/brand/add`,
    // },
  ],
  tableMenu: (record: any, action: any) => [
    // {
    //   kind: 'confirm',
    //   onClick: () => message.info('删除成功'),
    //   title: '删除',
    //   text: `确认删除` + record.uid,
    // },
  ],
  onRowEvent: [
    // {
    //   mouseEvent: 'onDoubleClick',
    //   title: '详情',
    // },
  ],
  onRequest: ({ query }) => privilegeStore.next(merge(query, { sort: { version: 1 } })),
};

pageManager.register('privilege.resource', {
  page: {
    view: [{ kind: 'storeTable', ...table }],
    container: {
      keepAlive: false,
    },
  },
  stores: [
    {
      store: privilegeStore,
      // query: { limit: { page: 0, size: 10 }, sort: { version: 1 } },
      // load: privilegeStore.load,
      exit: privilegeStore.reset,
    },
  ],
});
