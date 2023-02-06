import { StoreTableProps } from '@/dynamic-components';
import { pageManager } from '@/dynamic-view';
import { message } from 'antd';
import { Category, categoryStore, categoryStore2 } from './store';


const categoryStoreTable: StoreTableProps = {
  toolbarTitle: '数据列表',
  store: categoryStore,
  rowKey: 'uid',
  search: false,
  pageSize: 10,
  columns: [
    {
      dataIndex: 'uid',
      title: '类型名称',
      hideInSearch: true,
      editable: false,
    },
    {
      dataIndex: 'product_count',
      title: '商品数量',
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
      dataIndex: 'show_status',
      title: '是否显示',
      hideInSearch: true,
      editable: false,
      valueType: 'select',
      valueEnum: {
        1: {
          text: '未显示',
          status: 'Error',
        },
        0: {
          text: '已显示',
          status: 'Success',
        },
      },
    },
    {
      dataIndex: 'sort',
      title: '排序',
      hideInSearch: true,
      editable: false,
    },
  ],

  expand: {
    kind: 'table',
    onData: (record: any) => categoryStore2.api.list(undefined, { limit: { page: 0, size: 10 }, sort: { version: 1 }, filter: { level: 2, full_id: record.uid } }),
    table: {
      options: false,
      tableMenu: (record: Category, action: any) => [
        {
          kind: 'confirm',
          onClick: () => message.info('删除成功'),
          tag: '删除',
          title: '删除',
          text: `确认删除类型名称` + "'" + record.uid + "'",
        },
        {
          kind: 'link',
          title: '属性参数',
          tag: '属性参数',
          link: "/product/category/attribute?category_id=" + record.uid,
        }
      ],
      rowKey: 'uid',
      columns: [
        {
          dataIndex: 'uid',
          title: '类型名称',
          hideInSearch: true,
          editable: false,
        },
        {
          dataIndex: 'product_count',
          title: '商品数量',
          hideInSearch: true,
          editable: false,
        },
        {
          dataIndex: 'product_unit',
          title: '商品单位',
          hideInSearch: true,
          editable: false,
          valueType: 'tag',
          valueEnum: {
            '辆': {
              status: 'success',
            },
            '件': {
              status: 'success',
            },
          },
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
          dataIndex: 'show_status',
          title: '是否显示',
          hideInSearch: true,
          editable: false,
          valueType: 'select',
          valueEnum: {
            1: {
              text: '未显示',
              status: 'Error',
            },
            0: {
              text: '已显示',
              status: 'Success',
            },
          },
        },
        {
          dataIndex: 'sort',
          title: '排序',
          hideInSearch: true,
          editable: false,
        },
      ],
    },
  },
  editableValuesChange: (record) => { console.log(record) },
  toolBarMenu: (selectedRows) => [
    {
      kind: 'link',
      tag: '新增',
      title: '新增',
      link: `/product/brand/add`,
    },
    {
      kind: 'implement',
      tag: '批量商品上架',
      title: '批量商品上架',
      onClick: (e) => {
        console.log('批量商品上架 selectedRows', selectedRows);
        if (selectedRows.length <= 0) {
          message.warning('请批量选择商品'); return
        }
        message.info('批量商品上架成功')
      },
      collapse: true
    },
    {
      kind: 'implement',
      tag: '批量商品下架',
      title: '批量商品下架',
      onClick: (e) => {
        console.log('批量商品下架 selectedRows', selectedRows);
        if (selectedRows.length <= 0) {
          message.warning('请批量选择商品'); return
        }
        message.info('批量商品下架成功')
      },
      collapse: true
    },
  ],
  tableMenu: (record: any, action: any) => [
    {
      kind: 'descriptions',
      dataSource: record,
      tag: '详情',
      columns: [],
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
  batchDelete: (selectedRows) => console.log('batchDelete', selectedRows)
};

pageManager.register('product.category', {
  page: {
    view: [{ kind: 'storeTable', ...categoryStoreTable }],
  },
  stores: [
    {
      store: categoryStore,
      query: { limit: { page: 0, size: 10 }, sort: { version: 1 }, filter: { level: 1 } },
      load: categoryStore.next,
      exit: categoryStore.reset,
    }
  ],
});
