import { StoreTableProps } from '@/dynamic-components';
import { pageManager } from '@/dynamic-view';
import { message } from 'antd';
import { merge } from 'lodash';
import { parse } from 'querystring';
import { productAttributeStore } from '../../api/productAttribute.store';

const attributeStoretable: StoreTableProps = {
  store: productAttributeStore,
  rowKey: 'uid',
  search: false,
  toolbarTitle: '数据列表',
  columns: [
    {
      dataIndex: 'uid',
      hideInSearch: true,
      editable: false,
      hideInTable: true,
    },
    {
      dataIndex: 'name',
      title: '名称',
      hideInSearch: true,
      editable: false,
      fixed: 'left',
      width: 100,
    },
    // {
    //   dataIndex: 'type',
    //   title: '类型',
    //   hideInSearch: true,
    //   editable: false,
    //   valueEnum: {
    //     0: '规格',
    //     1: '参数',
    //   },
    // },
    {
      dataIndex: 'category_id',
      title: '商品类型',
      hideInSearch: true,
      editable: false,
    },
    // {
    //   dataIndex: 'select_type',
    //   title: '是否多选',
    //   hideInSearch: true,
    //   editable: false,
    //   valueEnum: {
    //     1: '单选',
    //     2: '多选',
    //   },
    // },
    {
      dataIndex: 'input_type',
      title: '录入方式',
      hideInSearch: true,
      editable: false,
      valueEnum: {
        0: '手工录入',
        1: '手工录入+从列表中选取',
      },
    },
    {
      dataIndex: 'input_select_list',
      title: '可选值列表',
      hideInSearch: true,
      editable: false,
      valueType: 'select',
    },
  ],
  toolBarMenu: (selectedRows, location) => {
    const query = parse(location?.search.split('?')[1] || '');
    return [
      {
        kind: 'link',
        title: '新增',
        link: `/product/category/attribute/add?id=` + query.category_id,
      },
    ];
  },
  tableMenu: (record, action) => [
    {
      kind: 'link',
      title: '编辑',
      link: '/product/category/attribute/edit?id=' + record.uid,
    },
    {
      kind: 'confirm',
      onClick: () => {
        productAttributeStore
          .remove(record.uid)
          .then((_) => {
            message.info('删除成功');
          })
          .catch((e) => {
            message.error('删除失败');
          });
      },
      title: '删除',
      text: `确认删除` + record.name,
    },
  ],
  // onRowEvent: [
  //   {
  //     mouseEvent: 'onDoubleClick',
  //     title: '详情',
  //   },
  // ],
  useBatchDelete: true,
  batchDelete: (selectedRows) => console.log('batchDelete', selectedRows),
  onRequest: ({ query, location }) =>
    productAttributeStore.next(
      merge(query, { sort: { type: 1 } }, { filter: parse(location?.search.split('?')[1] || '') }),
    ),
};

pageManager.register('product.category.attribute', {
  page: {
    view: [{ kind: 'storeTable', ...attributeStoretable }],
    container: {
      keepAlive: false,
    },
  },
  stores: [],
});
