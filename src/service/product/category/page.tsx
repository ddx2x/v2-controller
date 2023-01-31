import { StoreTableProps } from '@/dynamic-components';
import { pageManager } from '@/dynamic-view';
import { message } from 'antd';
import { categoryStore } from './store';

const categoryStoreTable: StoreTableProps = {
  store: categoryStore,
  rowKey: 'uid',
  usePagination: true,
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
    },
    {
      dataIndex: 'nav_status',
      title: '导航栏显示',
      hideInSearch: true,
      editable: false,
    },
    {
      dataIndex: 'show_status',
      title: '是否显示',
      hideInSearch: true,
      editable: false,
    },
    {
      dataIndex: 'sort',
      title: '排序',
      hideInSearch: true,
      editable: false,
    },
  ],
  editableValuesChange: (record) => { console.log(record) },
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
  // onNext: (params:any) =>
  //   categoryStore.next({
  //     limit: { page: 0, size: 10 },
  //     sort: { brand_name: 1 },
  //     ...params,
  //   }),
};

pageManager.register('product.category', {
  page: {
    view: [{ kind: 'storeTable', ...categoryStoreTable }],
  },
  stores: [
    {
      store: categoryStore,
      query: { limit: { page: 0, size: 10 }, sort: { version: 1 } },
      load: categoryStore.load,
      exit: categoryStore.reset,
    }
  ],
});
