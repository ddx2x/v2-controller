import { StoreTableProps } from '@/dynamic-components';
import { pageManager } from '@/dynamic-view';
import { history } from '@umijs/max';
import { notification } from 'antd';
import { merge } from 'lodash';
import { Category, categoryStore, categoryStore2 } from '../../api/productCategory.store';


const columns: StoreTableProps['columns'] = [
  {
    dataIndex: 'uid',
    title: '类型名称',
    hideInSearch: true,
    editable: false,
    fixed: 'left',
  },
  {
    dataIndex: 'nav_status',
    title: '导航栏显示',
    hideInSearch: true,
    editable: false,
    valueType: 'select',
    valueEnum: {
      0: {
        text: '未启用',
        status: 'Processing',
      },
      1: {
        text: '已启用',
        status: 'Processing',
      },
    },
  },
  {
    dataIndex: 'keywords',
    title: '关键字',
    hideInSearch: true,
    editable: false,
    valueType: 'select',
  },
]

const categoryStoreTable: StoreTableProps = {
  toolbarTitle: '数据列表',
  store: categoryStore,
  rowKey: 'uid',
  search: false,
  defaultPageSize: 10,
  columns: columns,
  expand: {
    kind: 'table',
    onData: (record: any) => categoryStore2.api.list(undefined, { limit: { page: 0, size: 10 }, sort: { version: 1 }, filter: { level: 2, full_id: record.uid } }),
    table: {
      options: false,
      tableMenu: (record: Category, action: any) => [
        {
          kind: 'confirm',
          title: '删除',
          onClick: () => {
            categoryStore2.remove(record.uid)
              .then(() => {
                notification.success({ message: "删除成功" });
                history.push(`/product/category`);
              })
              .catch(e => notification.error(e))
          },
          text: `确认删除类型名称` + "'" + record.uid + "'",
        },
        {
          kind: 'link',
          title: '属性参数',
          link: "/product/category/attribute?category_id=" + record.uid,
        },
        {
          kind: 'link',
          title: '编辑',
          link: '/product/category/edit?id=' + record.uid
        },
      ],
      rowKey: 'uid',
      columns: [
        {
          dataIndex: 'uid',
          title: '子类型',
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
          hideInSearch: true,
          editable: false,
          valueType: 'select',
          valueEnum: {
            0: {
              text: '未启用',
              status: 'Processing',
            },
            1: {
              text: '已启用',
              status: 'Processing',
            },
          },
        },
        {
          dataIndex: 'keywords',
          title: '关键字',
          hideInSearch: true,
          editable: false,
          valueType: 'select',
        },
      ],
    },
  },
  editableValuesChange: (record) => { console.log(record) },
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
      link: '/product/category/edit?id=' + record.uid
    },
    {
      kind: 'confirm',
      title: '删除',
      onClick: () => {
        categoryStore.remove(record.uid).then(() => {
          notification.info({ message: "删除成功" });
          history.push(`/product/category`);
        }).catch(e => {
          notification.error(e)
        })
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
  onRequest: (params) => {
    categoryStore.next(merge(params, { filter: { level: 1 }, sort: { version: 1 } }));
  },
  batchDelete: (selectedRows) => console.log('batchDelete', selectedRows)
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
      exit: categoryStore.reset
    }
  ],
});
