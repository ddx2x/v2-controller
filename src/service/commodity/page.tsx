import { pageManager } from '@/dynamic-view';
import { View } from '@/dynamic-view/typing';
import { message } from 'antd';
import { stringify } from 'querystring';
import { detail } from './detail';
import { brandNameStoreStore, commdityAggregateStore, Commodity, commodityStore } from './store';

// 商品列表
const table: View = {
  kind: 'table',
  rowKey: 'uid',
  mount: (location, actionRef, formRef, configMap) => {
    configMap?.replace({
      pagination: {
        total: commdityAggregateStore.count,
      },
      laoding: commdityAggregateStore.loading,
      dataSource: commdityAggregateStore.items,
      columns: [
        {
          dataIndex: 'uid',
          title: '商品标题(SPU)',
          hideInSearch: true,
        },
        {
          dataIndex: 'sub_title',
          title: '子标题',
          hideInSearch: true,
          editable: false,
        },
        {
          dataIndex: 'sale_channels',
          title: '销售渠道',
          valueType: 'checkbox',
          ellipsis: true,
          valueEnum: {
            1: '线上',
            2: '线下',
          },
          hideInSearch: true,
        },
        {
          dataIndex: 'brand_name',
          title: '品牌',
          filters: true,
          onFilter: true,
          ellipsis: true,
          valueType: 'select',
          valueEnum: brandNameStoreStore.selectOptions(),
        },
      ],
    });
  },
  usePagination: true,
  toolbar: {
    title: '商品列表',
  },
  toolBarMenu: () => [
    {
      kind: 'link',
      tag: '新增',
      link: `/commdity/list/aggregate_add`,
      title: '新增',
    },
  ],
  expand: {
    kind: 'table',
    onData: (record: any) => commodityStore.api.list(undefined, { filter: { title: record.uid } }),
    table: {
      options: false,
      rowKey: 'uid',
      columns: [
        {
          dataIndex: 'uid',
          title: 'uid',
          hideInSearch: true,
          hideInTable: true,
        },
        {
          dataIndex: 'name',
          valueType: 'select',
          title: '单品名称',
          editable: false,
        },
        {
          dataIndex: 'price',
          title: '价格',
          editable: false,
        },
        {
          dataIndex: 'stock',
          title: '库存',
        },
      ],
      tableMenu: (record: Commodity, action: any) => [
        {
          kind: 'descriptions',
          tag: '详情',
          dataSource: record,
          ...detail,
        },
        {
          kind: 'link',
          collapse: true,
          link: `/commdity/list/edit` + `?` + stringify({ name: record.name }),
          tag: '编辑',
          title: '编辑',
        },
      ],
      toolBarMenu: () => [
        {
          kind: 'link',
          tag: '新增',
          link: `/commdity/list/add`,
          title: '新增',
        },
      ],
    },
  },
  tableMenu: (record, action) => [
    {
      kind: 'descriptions',
      dataSource: record,
      tag: '详情',
      collapse: "true",
      ...detail,
    },
    {
      kind: 'form',
      title: '编辑',
      triggerText: '编辑',
      tag: '编辑',
      collapse: "true",
      columns: [{
        title: '标题',
        dataIndex: 'title',
        valueType: 'text'
      }]
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
      tag: '编辑',
    },
  ],
  onNext: (params) =>
    commdityAggregateStore.next({
      limit: { page: 0, size: 10 },
      sort: { brand_name: 1 },
      ...params,
    }),
  scrollHeight: '52vh',
  pagination: false,
};

pageManager.register('commdity.list', {
  page: {
    view: [table],
  },
  stores: [
    {
      store: commdityAggregateStore,
      query: { limit: { page: 0, size: 10 }, sort: { brand_name: 1 } },
      load: commdityAggregateStore.next,
      exit: commdityAggregateStore.reset,
    },
    {
      store: brandNameStoreStore,
      load: brandNameStoreStore.load,
      watch: brandNameStoreStore.watch,
      exit: brandNameStoreStore.reset,
    },
  ],
});
