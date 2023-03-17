import { StoreTableProps } from '@/dynamic-components';
import { pageManager } from '@/dynamic-view';
import { cmsDoorStore2 } from '@/service/api';
import { unixtime2dateformat } from '@/service/common';
import { notification } from 'antd';
import { merge } from 'lodash';
import { ReactNode } from 'react';
import { User, userStore } from '../../api/privilegeUser.store';

const table: StoreTableProps = {
  toolbarTitle: '数据列表',
  rowKey: 'uid',
  store: userStore,
  search: false,
  size: 'small',
  treeStore: cmsDoorStore2,
  useSiderTree: true,
  treeCard: { title: '组织架构' },
  columns: [
    {
      dataIndex: 'uid',
      title: '帐号',
      hideInSearch: true,
      fixed: 'left',
      width: 120,
      editable: false,
    },
    {
      dataIndex: 'name',
      title: '名称',
      hideInSearch: true,
      editable: false,
    },
    {
      dataIndex: 'is_lock',
      title: '锁定',
      hideInSearch: true,
      valueType: 'switch',
      valueEnum: {
        0: '停用',
        1: '启用',
      },
      formItemProps: {
        rules: [],
      },
    },
    {
      dataIndex: 'phone_number',
      title: '手机号',
      editable: false,
      hideInSearch: true,
    },
    {
      dataIndex: 'login_type',
      title: '登陆类型',
      valueType: 'select',
      editable: false,
      hideInSearch: true,
      initialValue: '3',
      valueEnum: {
        1: { text: '手机', icon: 'processing' },
        2: { text: '帐号', icon: 'processing' },
        3: { text: '手机+帐号', icon: 'processing' },
      },
    },
    {
      dataIndex: 'roles',
      title: '角色组',
      hideInSearch: true,
      editable: false,
      valueType: 'text',
    },
    {
      dataIndex: 'last_login_time',
      title: '最后登陆',
      hideInSearch: true,
      editable: false,
      valueType: 'date',
      render: (text: ReactNode, record: User, index: number, action: any) => {
        return [
          <>
            {record.last_login_time === 0 ? '-' : unixtime2dateformat(record.last_login_time || 0)}
          </>,
        ];
      },
    },
  ],
  editableValuesChange: (record: User) => {
    const src = userStore.items.find((item) => item.getUid() === record.uid);
    const update: Partial<User> = record;

    if (!src) return;
    if (src?.is_lock !== update.is_lock) {
      userStore
        .update_one(src, update, ['is_lock'])
        .then(() => notification.success({ message: '更新成功' }))
        .catch((e) => {
          notification.error({ message: '更新失败:' + e });
        });
    }
  },
  toolBarMenu: (selectedRows: any) => [
    {
      kind: 'link',
      title: '新增',
      link: `/privilege/user/add`,
    },
  ],
  tableMenu: (record: User, action: any) => [
    {
      kind: 'link',
      title: '编辑  ',
      link: `/privilege/user/edit?id=${record.uid}`,
    },
    {
      kind: 'link',
      title: '授权',
      link: `/privilege/user/grant`,
    },
    {
      kind: 'confirm',
      title: '删除',
      onClick: () => {
        userStore
          .remove(record.uid)
          .then(() => {
            notification.info({ message: '删除成功' });
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
  useBatchDelete: true,
  batchDelete: (selectedRows) => console.log('batchDelete', selectedRows),
  onRequest: ({ query }) => {
    const { filter } = query; // treeNode,
    const { treeNode } = filter;

    if (treeNode) {
      delete query['filter']['treeNode'];
      query = merge(query, { filter: { org_name: treeNode.title } });
    }

    userStore.next(merge(query, { sort: { version: 1 } }));
  },
};

pageManager.register('privilege.user', {
  page: {
    view: [{ kind: 'storeTable', ...table }],
    container: {
      keepAlive: false,
    },
  },
  stores: [
    {
      store: userStore,
      exit: userStore.reset,
    },
    {
      store: cmsDoorStore2,
      load: cmsDoorStore2.next,
      exit: cmsDoorStore2.reset,
    },
  ],
});
