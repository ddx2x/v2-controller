import { StoreTableProps } from '@/dynamic-components';
import { pageManager } from '@/dynamic-view';
import { CmsDoor, cmsDoorStore } from '@/service/api/cmsDoor.store';
import { notification } from 'antd';
import { merge } from 'lodash';
import { detail } from './detail';

const storeTable: StoreTableProps = {
  toolbarTitle: '数据列表',
  rowKey: 'uid',
  search: false,
  store: cmsDoorStore,
  size: 'small',
  columns: [
    {
      dataIndex: 'uid',
      hideInSearch: true,
      hideInTable: true,
      editable: false,
    },
    {
      dataIndex: 'first_name',
      title: '主体',
      hideInSearch: true,
      editable: false,
      width: 200,
      fixed: 'left',
      fieldProps: {
        width: 55,
      },
    },
    {
      dataIndex: 'second_name',
      title: '门店',
      hideInSearch: true,
      editable: false,
    },
    {
      dataIndex: 'region_name',
      title: '地区',
      hideInSearch: true,
      editable: false,
    },
    {
      dataIndex: 'address',
      title: '地址',
      hideInSearch: true,
      editable: false,
    },
    {
      dataIndex: 'online_store_status',
      title: '网店状态',
      valueType: 'switch',
      hideInSearch: true,
      valueEnum: {
        true: false,
        false: true,
      },
    },
  ],
  editableValuesChange: (record: CmsDoor) => {},
  toolBarMenu: (selectedRows: any) => [
    {
      kind: 'link',
      title: '新增',
      link: `/cms/door/add`,
    },
  ],
  tableMenu: (record: CmsDoor, action: any) => [
    {
      kind: 'descriptions',
      title: '详情',
      dataSource: record,
      collapse: true,
      ...detail,
    },
    {
      kind: 'link',
      title: '编辑',
      // collapse: true,
      link: '/cms/door/edit?id=' + record.uid,
    },
    {
      kind: 'confirm',
      title: '删除',
      onClick: () => {
        cmsDoorStore
          .remove(record.uid)
          .then(() => {
            notification.info({ message: '删除成功' });
          })
          .catch((e) => {
            notification.error(e);
          });
      },
      text: `确认删除` + record.first_name + '-' + record.second_name,
      collapse: true,
    },
  ],
  onRowEvent: [
    {
      mouseEvent: 'onDoubleClick',
      title: '详情',
    },
  ],
  onRequest: (params) => {
    cmsDoorStore.next(merge(params, { sort: { version: 1 } }));
  },
  batchDelete: (selectedRows) => console.log('batchDelete', selectedRows),
};

pageManager.register('cms.door', {
  page: {
    view: [{ kind: 'storeTable', ...storeTable }],
    container: {
      keepAlive: false,
    },
  },
  stores: [
    {
      store: cmsDoorStore,
      exit: cmsDoorStore.reset,
    },
  ],
});
