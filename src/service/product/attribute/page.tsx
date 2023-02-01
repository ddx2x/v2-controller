import { StoreTableProps } from '@/dynamic-components';
import { pageManager } from '@/dynamic-view';
import { message } from 'antd';
import { productAttributeStore } from './store';

const attributeStoretable: StoreTableProps = {
  store: productAttributeStore,
  rowKey: 'uid',
  columns: [
    {
      dataIndex: 'uid',
      hideInSearch: true,
      editable: false,
    },
    {
      dataIndex: 'name',
      title: '属性名称',
      hideInSearch: true,
      editable: false,
    },
    {
      dataIndex: 'category_id',
      title: '商品类型',
      hideInSearch: true,
      editable: false,
    },
    {
      dataIndex: 'select_type',
      title: '是否多选',
      hideInSearch: true,
      editable: false,
    },
    {
      dataIndex: 'input_type',
      title: '录入方式',
      hideInSearch: true,
      editable: false,
    },
    {
      dataIndex: 'input_select_list',
      title: '可选值列表',
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
  toolbarTitle: '数据列表',
  toolBarMenu: () => [
    {
      kind: 'link',
      tag: '新增',
      link: `/product/attribute/add`,
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
  // onNext: (params: any) =>
  //   productAttributeStore.next({
  //     limit: { page: 0, size: 10 },
  //     sort: { brand_name: 1 },
  //     ...params,
  //   }),
};

pageManager.register('product.category.attribute', {
  page: {
    view: [{ kind: 'storeTable', ...attributeStoretable }],
  },
  stores: [
    {
      store: productAttributeStore,
      query: { limit: { page: 0, size: 10 }, sort: { version: 1 } },
      load: productAttributeStore.next,
      exit: productAttributeStore.reset,
    }
  ],
});
