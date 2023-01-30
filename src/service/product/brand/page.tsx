import { pageManager } from '@/dynamic-view';
import { View } from '@/dynamic-view/typing';
import { message } from 'antd';
import { brandStore } from './store';

const table: View = {
  kind: 'storeTable',
  store: brandStore,
  rowKey: 'uid',
  columns: [
    {
      dataIndex: 'uid',
      hideInSearch: true,
      editable: false,
    },
    {
      dataIndex: 'uid',
      title: '名称',
      hideInSearch: true,
      editable: false,
    },
    {
      dataIndex: 'first_letter',
      title: '首字母',
      hideInSearch: true,
      editable: false,
    },
    {
      dataIndex: 'sort',
      title: '排序',
      hideInSearch: true,
      editable: false,
    },
    {
      dataIndex: 'factory_status',
      title: '制造商',
      hideInSearch: true,
      editable: false,
    },
    {
      dataIndex: 'show_status',
      title: '品牌',
      hideInSearch: true,
      editable: false,
    },
    {
      dataIndex: 'product_count',
      title: '商品数',
      hideInSearch: true,
      editable: false,
    },
    {
      dataIndex: 'product_comment_count',
      title: '评论数',
      hideInSearch: true,
      editable: false,
    },
    {
      dataIndex: 'logo',
      title: '品牌logo',
      hideInSearch: true,
      editable: false,
    },
    {
      dataIndex: 'big_pic',
      title: '专区大图',
      hideInSearch: true,
      editable: false,
    },
    {
      dataIndex: 'big_pic',
      title: '专区大图',
      hideInSearch: true,
      editable: false,
    },
  ],
  usePagination: true,
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
  tableMenu: (record, action) => [
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
  onNext: (params) =>
    brandStore.next({
      limit: { page: 0, size: 10 },
      sort: { version: 1 },
      ...params,
    }),
};

pageManager.register('product.brand', {
  page: {
    view: [table],
  },
  stores: [
    {
      store: brandStore,
      query: { limit: { page: 0, size: 10 }, sort: { version: 1 } },
      load: brandStore.load,
      exit: brandStore.reset,
    }
  ],
});
