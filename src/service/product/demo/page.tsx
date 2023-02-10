import { StoreTableProps } from '@/dynamic-components';
import { pageManager } from '@/dynamic-view';
import { message } from 'antd';
import { DataNode } from 'antd/lib/tree';
import { stringify } from 'querystring';
import { detail } from './detail';
import { brandNameStoreStore, commdityAggregateStore, Commodity, commodityStore } from './store';


// const x = 3;
// const y = 2;
// const z = 1;
const defaultData: DataNode[] = [];

// const generateData = (_level: number, _preKey?: React.Key, _tns?: DataNode[]) => {
//   const preKey = _preKey || '0';
//   const tns = _tns || defaultData;

//   const children: React.Key[] = [];
//   for (let i = 0; i < x; i++) {
//     const key = `${preKey}-${i}`;
//     tns.push({ title: key, key });
//     if (i < y) {
//       children.push(key);
//     }
//   }
//   if (_level < 0) {
//     return tns;
//   }
//   const level = _level - 1;
//   children.forEach((key, index) => {
//     tns[index].children = [];
//     return generateData(level, key, tns[index].children);
//   });
// };
// generateData(z);

// 商品列表
const commdityAggregateTable: StoreTableProps = {
  // useSiderTree: true,
  toolbarTitle: '商品列表',
  store: commdityAggregateStore,
  rowKey: 'uid',
  treeData: defaultData,
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
      // filters: true,
      // onFilter: true,
      ellipsis: true,
      valueType: 'select',
      valueEnum: brandNameStoreStore.selectOptions(),
    },
  ],

  toolBarMenu: () => [
    {
      kind: 'link',
      title: '单品新增',
      link: `/product/list/aggregate_add`,
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
          title: '详情',
          dataSource: record,
          ...detail,
        },
        {
          kind: 'link',
          title: '编辑',
          collapse: true,
          link: `/product/list/aggregate_edit` + `?` + stringify({ name: record.name }),
        },
      ],
    },
  },
  tableMenu: (record, action) => [
    {
      kind: 'descriptions',
      title: '详情',
      dataSource: record,
      collapse: "true",
      ...detail,
    },
    {
      kind: 'confirm',
      title: '删除',
      onClick: () => message.info('删除成功'),
      text: `确认删除` + record.name,
    },

  ],
  onRowEvent: [
    {
      mouseEvent: 'onDoubleClick',
      title: '详情',
    },
  ],
  onRequest: (params) =>
    commdityAggregateStore.next({
      limit: { page: 0, size: 10 },
      sort: { brand_name: 1 },
      ...params,
    }),
};

pageManager.register('product.demo', {
  page: {
    view: [{ kind: 'storeTable', ...commdityAggregateTable }],
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
