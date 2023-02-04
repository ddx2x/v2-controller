import { StoreTableProps } from '@/dynamic-components';
import { pageManager } from '@/dynamic-view';
import { unixtime2dateformat } from '@/service';
import { message, notification } from 'antd';
import { ReactNode } from 'react';
import { User, userStore } from './store';

const userStoreTable: StoreTableProps = {
  store: userStore,
  rowKey: 'uid',
  columns: [
    {
      dataIndex: 'uid',
      title: '帐户',
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
      valueType: "select",
      editable: false,
      initialValue: "4",
      valueEnum: {
        1: { text: "手机", icon: "processing" },
        2: { text: "帐号", icon: "processing" },
        4: { text: "手机+帐号", icon: "processing" }
      }
    },
    {
      dataIndex: 'last_login_time',
      title: '最后登陆',
      hideInSearch: true,
      editable: false,
      valueType: 'date',
      render: (text: ReactNode, record: User, index: number, action: any) => {
        return [<>{record.last_login_time == 0 ? "-" : unixtime2dateformat(record.last_login_time || 0)}</>]
      },
    },
    {
      dataIndex: 'is_lock',
      title: '锁定',
      hideInSearch: true,
      valueType: "switch",
      valueEnum: {
        0: '停用',
        1: '启用'
      },
    },
  ],
  editableValuesChange: (record) => {
    const src = userStore.items.find((item) => item.getUid() == record.uid);
    const update: Partial<User> = record;

    if (!src) return;
    userStore.update(src, update).then(() =>
      notification.success({ message: "更新成功" })).catch(e => {
        notification.error({ message: "更新失败" });
      })
  },
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
    userStore.next({
      limit: { page: 0, size: 10 },
      sort: { version: 1 },
      ...params,
    }),

  pageSize: 10,
};

pageManager.register('privilege.user', {
  page: {
    view: [{ kind: 'storeTable', ...userStoreTable }],
  },
  stores: [
    {
      store: userStore,
      query: { limit: { page: 0, size: 10 }, sort: { version: 1 } },
      load: userStore.next,
      exit: userStore.reset,
    }
  ],
});
