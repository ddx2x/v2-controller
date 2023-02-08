import { StoreTableProps } from '@/dynamic-components';
import { pageManager } from '@/dynamic-view';
import { message } from 'antd';
import { parse } from 'querystring';
import { productAttributeStore } from './store';

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
    },
    {
      dataIndex: 'type',
      title: '类型',
      hideInSearch: true,
      editable: false,
      valueEnum: {
        0: "规格",
        1: "参数",
      }
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
      valueEnum: {
        0: "唯一",
        1: "单选",
        2: "多选",
      }
    },
    {
      dataIndex: 'input_type',
      title: '录入方式',
      hideInSearch: true,
      editable: false,
      valueEnum: {
        0: "手工录入",
        1: "从列表中选取"
      }
    },
    {
      dataIndex: 'input_select_list',
      title: '可选值列表',
      hideInSearch: true,
      editable: false,
      valueType: 'select',
    },
    {
      dataIndex: 'sort',
      title: '排序',
      hideInSearch: true,
      editable: false,
    },
  ],
  toolBarMenu: (selectedRows, location) => {
    const query = parse(location?.search.split('?')[1] || '');
    return [
      {
        kind: 'link',
        tag: '新增',
        link: `/product/category/attribute/add?id=` + query.category_id,
        title: '新增',
      },
    ]
  },
  tableMenu: (record, action) => [
    {
      kind: 'link',
      tag: "编辑",
      title: "编辑",
      link: "/product/category/attribute/edit?id=" + record.uid,
    },
    {
      kind: 'confirm',
      onClick: () => {
        productAttributeStore.
          remove(record.uid).then((_) => {
            message.info('删除成功')
          }).catch((e) => {
            message.error('删除失败')
          })
      },
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
  onNext: (params: any, sort, filter, location) => {
    let data = location?.search.split('?')[1] || '';
    let query = parse(data);
    productAttributeStore.next({
      limit: { page: 0, size: 10 },
      sort: { brand_name: 1 },
      filter: query,
    });
  }
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
