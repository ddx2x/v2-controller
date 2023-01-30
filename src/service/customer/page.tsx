import { pageManager } from '@/dynamic-view';
import { View } from '@/dynamic-view/typing';
import { customerStore } from './store';

// 商品列表
const table: View = {
  kind: 'storeTable',
  store: customerStore,
  rowKey: 'uid',
  columns: [
    {
      dataIndex: 'brand_name',
      title: '品牌',
      width: 200,
    },
    {
      dataIndex: 'uid',
      title: '商品名称',
      width: 200,
    },
    {
      dataIndex: 'title',
      title: '标题',
      width: 200,
    },
    {
      dataIndex: 'sub_title',
      title: '标题',
      width: 100,
    },
  ],
  expand: {
    kind: 'table',
    onData: (record: any) => {
      [record];
    },
    table: {
      columns: [
        {
          dataIndex: 'type',
          title: '商品类型',
        },
        {
          dataIndex: 'sale_channels',
          title: '销售渠道',
        },
        {
          dataIndex: 'price',
          title: '价格',
        },
        {
          dataIndex: 'stock',
          title: '库存',
        },
      ],
    },
  },
  tableMenu: (record: any) => [
    {
      kind: 'descriptions',
      tag: '详情',
      collapse: true,
      dataSource: {
        id: '这是一段文本columns',
        date: '20200809',
        money: '1212100',
        state: 'closed',
        state2: 'open',
        ...record,
      },
      // ...detail
    },
    // { kind: 'form', collapse: true, initialValues: record, ...eidt },
    // { kind: 'link', collapse: true, link: `/commdity/list/edit/?uid=${record.uid}&name=${record.name}`, title: '全量编辑' },
    // { kind: 'confirm', onClick: () => message.info('删除成功'), title: '删除', text: `确认删除${record.name}` }
  ],
  // globalSearch: {
  //     onSearch: (value, setGlobalSearchOptions) => {
  //         version.search({ text: value || '', offset: 0, limit: 10 })
  //             .then(res => {
  //                 if (!Array.isArray(res)) {
  //                     return
  //                 }
  //                 const options = res.map(item => {
  //                     return { label: <SearchLabel key={item.uid} searchObject={item} />, value: item.name }
  //                 })
  //                 setGlobalSearchOptions([...options])
  //             })
  //     }
  // },

  onNext: (actionRef) => customerStore.next({ order: { version: 1 } }),
  onSubmit: (params) => customerStore.next({ order: { version: 1 } }),
};

pageManager.register('customer.list', {
  page: { view: [table] },
  stores: [
    {
      store: customerStore,
      query: { order: { version: 1 } },
      load: customerStore.next,
      exit: customerStore.reset,
    },
  ],
});
