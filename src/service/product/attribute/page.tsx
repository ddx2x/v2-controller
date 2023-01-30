import { pageManager } from '@/dynamic-view';
import { View } from '@/dynamic-view/typing';
import { message } from 'antd';
import { productAttributeStore } from './store';

const table: View = {
  kind: 'table',
  rowKey: 'uid',
  mount: (location: any, actionRef: any, formRef: any, configMap: any) => {
    configMap?.replace({
      pagination: {
        total: 1,
      },
      laoding: productAttributeStore.loading,
      dataSource: productAttributeStore.items,
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
    });
  },
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
    productAttributeStore.next({
      limit: { page: 0, size: 10 },
      sort: { brand_name: 1 },
      ...params,
    }),
};

pageManager.register('product.category.attribute', {
  page: {
    view: [table],
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
