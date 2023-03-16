import { StoreTableProps } from '@/dynamic-components';
import { pageManager } from '@/dynamic-view';
import { CmsDoor, cmsDoorStore, cmsDoorStore2 } from '@/service/api/cmsDoor.store';
import { notification } from 'antd';
import { merge } from 'lodash';
import { detail } from './detail';

const storeTable: StoreTableProps = {
  toolbarTitle: '数据列表',
  rowKey: 'uid',
  // search: false,
  store: cmsDoorStore,
  size: 'small',
  treeStore: cmsDoorStore2,
  useSiderTree: true,
  treeCard: { title: '组织架构' },
  columns: [
    {
      dataIndex: 'uid',
      hideInSearch: true,
      hideInTable: true,
      editable: false,
    },
    {
      dataIndex: 'second_name',
      title: '门店名称',
      hideInSearch: true,
      editable: false,
      width: 200,
      fixed: 'left',
      fieldProps: {
        width: 55,
      },
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
      sorter: true,
    },
    {
      dataIndex: 'region_name',
      title: '地区',
      // hideInSearch: true,
      editable: false,
      sorter: true,
    },
    {
      dataIndex: 'address',
      title: '地址',
      hideInSearch: true,
      editable: false,
    },
    {
      dataIndex: 'first_name',
      title: '企业主体',
      hideInSearch: true,
      editable: false,
    },
  ],
  editableValuesChange: (record: CmsDoor) => {
    const src = cmsDoorStore.items.find((item) => item.getUid() === record.uid);
    const update: Partial<CmsDoor> = record;

    if (!src) return;
    if (src?.online_store_status !== update.online_store_status) {
      if (update.online_store_status) {
        update.online_store_status = true;
      } else {
        update.online_store_status = false;
      }
      cmsDoorStore
        .update_one(src, update, ['online_store_status'])
        .then(() => {
          notification.success({ message: '更新成功' });
        })
        .catch((e) => {
          notification.error({ message: '更新失败:' + e });
        });
    }
  },
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
      // collapse: true,
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
      // collapse: true,
    },
  ],
  // onRowEvent: [
  //   {
  //     mouseEvent: 'onDoubleClick',
  //     title: '详情',
  //   },
  // ],
  onRequest: ({ query }) => {
    const { filter } = query; // treeNode,
    const { treeNode } = filter;

    if (treeNode) {
      delete query['filter']['treeNode'];

      if (treeNode.key === '') {
      } else if (treeNode.children && treeNode.children.length > 0) {
        query = merge(query, { filter: { first_name: treeNode.title } });
      } else {
        query = merge(query, { filter: { second_name: treeNode.title } });
      }
    }

    cmsDoorStore.next(merge(query, { sort: { version: 1 } }));
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

    {
      store: cmsDoorStore2,
      load: cmsDoorStore2.next,
      exit: cmsDoorStore2.reset,
    },
  ],
});
