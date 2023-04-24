import { StoreTableProps } from '@/dynamic-components';
import { pageManager } from '@/dynamic-view';
import { history } from '@umijs/max';
import { notification } from 'antd';
import { merge } from 'lodash';
import { categoryStore, categoryStore2 } from '../../api/productCategory.store';

const columns: StoreTableProps['columns'] = [
  {
    dataIndex: 'uid',
    title: '分类名称',
    hideInSearch: true,
    editable: false,
    fixed: 'left',
  },
  {
    dataIndex: 'parent_id',
    title: '父类型',
    hideInSearch: true,
    editable: false,
  },
  {
    dataIndex: 'nav_status',
    title: '导航栏显示',
    editable: false,
    valueType: 'select',
    valueEnum: {
      0: {
        text: '未启用',
        // status: 'Processing',
      },
      1: {
        text: '已启用',
        // status: 'Processing',
      },
    },
  },
  {
    dataIndex: 'level',
    title: '分类级别',
    editable: false,
    valueType: 'select',
    valueEnum: {
      1: 1,
      2: 2,
      3: 3,
    },
  },
  {
    dataIndex: 'keywords',
    title: '关键字',
    hideInSearch: true,
    editable: false,
    valueType: 'select',
  },
];

const categoryStoreTable: StoreTableProps = {
  toolbarTitle: '数据列表',
  store: categoryStore,
  rowKey: 'uid',
  treeStore: categoryStore2,
  useSiderTree: true,
  // style: {
  //   width: '100%',
  //   height: '100%',
  //   zoom: 0.9,
  // },
  treeCard: { title: '分类层级', collapsible: false, defaultCollapsed: false },
  search: {
    defaultCollapsed: false,
  },
  defaultPageSize: 10,
  columns: columns,

  editableValuesChange: (record) => {},
  toolBarMenu: (selectedRows) => [
    {
      kind: 'link',
      title: '新增',
      link: `/product/category/add`,
    },
  ],
  tableMenu: (record: any, action: any) => [
    {
      kind: 'link',
      title: '编辑',
      link: '/product/category/edit?id=' + record.uid,
    },
    {
      kind: 'link',
      title: '属性参数',
      link: '/product/category/attribute?category_id=' + record.uid,
    },
    {
      kind: 'confirm',
      title: '删除',
      onClick: () => {
        categoryStore
          .remove(record.uid)
          .then(() => {
            notification.info({ message: '删除成功' });
            history.push(`/product/category`);
          })
          .catch((e) => {
            notification.error(e);
          });
      },
      text: `确认删除` + record.uid,
    },
  ],
  onRowEvent: [
    {
      mouseEvent: 'onDoubleClick',
      title: '详情',
    },
  ],
  batchDelete: (selectedRows) => {},
  onRequest: ({ query }) => {
    const { filter } = query; // treeNode,
    const { treeNode } = filter;

    if (treeNode) {
      const category = query['filter']['treeNode'].value;
      delete query['filter']['treeNode'];
      query = merge(query, { filter: { full_id: category.uid } });
    }

    categoryStore.next(merge(query, { filter: {}, sort: { level: 2, version: 1 } }));
  },
};

pageManager.register('product.category', {
  page: {
    view: [{ kind: 'storeTable', ...categoryStoreTable }],
    container: {
      keepAlive: false,
    },
  },
  stores: [
    {
      store: categoryStore,
      exit: categoryStore.reset,
    },

    {
      store: categoryStore2,
      load: categoryStore2.load,
      exit: categoryStore2.reset,
    },
  ],
});
