import { StoreTableProps } from '@/dynamic-components/table';
import { pageManager } from '@/dynamic-view';
import { message } from 'antd';
import { brandStore } from './store';

const brandStoreTable: StoreTableProps = {
  store: brandStore,
  rowKey: 'uid',
  toolbar: {
    title: '数据列表',
  },
  columns: [
    {
      dataIndex: 'uid',
      title: '名称',
      hideInSearch: true,
      editable: false,
    },
    {
      dataIndex: 'first_letter',
      title: '首字母',
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
      title: '显示制造商',
      hideInSearch: true,
      valueType: 'switch',
    },
    {
      dataIndex: 'show_status',
      title: '显示品牌',
      hideInSearch: true,
      valueType: 'switch',
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
      valueType: 'image',
    },
    {
      dataIndex: 'big_pic',
      title: '专区大图',
      hideInSearch: true,
      editable: false,
    },
    {
      dataIndex: 'lookup_down',
      title: '查看下级',
      hideInSearch: true,
      editable: false,
    },
  ],
  editableValuesChange: (record) => { console.log(record) },
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
      tag: '表单编辑',
    },
  ],
  onNext: (params: any) =>
    brandStore.next({
      limit: { page: 0, size: 10 },
      sort: { version: 1 },
      ...params,
    }),
};

pageManager.register('product.brand', {
  page: {
    view: [{ kind: 'storeTable', ...brandStoreTable }],
  },
  stores: [
    {
      store: brandStore,
      query: { limit: { page: 0, size: 1 }, sort: { version: 1 } },
      load: brandStore.next,
      exit: brandStore.reset,
    }
  ],
});
