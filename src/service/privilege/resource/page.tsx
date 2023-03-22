import { StoreTableProps } from '@/dynamic-components';
import { pageManager } from '@/dynamic-view';
import { merge } from 'lodash';
import { privilegeStore } from '../../api/privilegeResource.store';

const table: StoreTableProps = {
  store: privilegeStore,
  search: false,
  rowKey: 'uid',
  columns: [
    {
      dataIndex: 'uid',
      title: '权限名称',
      hideInSearch: true,
      fixed: 'left',
      width: 120,
      editable: false,
    },
    {
      dataIndex: 'route',
      title: '路由',
      hideInSearch: true,
      editable: false,
    },
    {
      dataIndex: 'full_id',
      title: '全路径',
      hideInSearch: true,
      editable: false,
    },
    {
      dataIndex: 'type',
      title: '类型',
      hideInSearch: true,
      editable: false,
      valueType: 'select',
      valueEnum: {
        1: '菜单',
        2: '数据',
        3: '菜单+数据',
      },
    },
    {
      dataIndex: 'hide_in_menu',
      title: '是否隐藏',
      hideInSearch: true,
      editable: false,
      valueType: 'switch',
      valueEnum: {
        false: '否',
        true: '是',
      },
    },
    {
      dataIndex: 'level',
      title: '层级',
      hideInSearch: true,
      editable: false,
    },

    {
      dataIndex: 'resource',
      title: '资源',
      hideInSearch: true,
      editable: false,
    },

    {
      dataIndex: 'field',
      title: '字段',
      hideInSearch: true,
      editable: false,
    },

    {
      dataIndex: 'op',
      title: '操作类型',
      hideInSearch: true,
      editable: false,
      fixed: 'right',
      valueEnum: {
        0: '无',
        1: '查看',
        2: '修改',
        3: '查看+修改',
        4: '删除',
        5: '查看+删除',
        6: '修改+删除',
        7: '查看+修改+删除',
      },
    },
  ],
  useTableMoreOption: false, // 关闭更多操作
  toolBarMenu: () => [],
  tableMenu: (record: any, action: any) => [],
  onRowEvent: [],
  onRequest: ({ query }) => {
    privilegeStore.next(merge(query, { sort: { _id: 1, route: 1, level: 1 } }));
  },
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
      exit: privilegeStore.reset,
    },
  ],
});
