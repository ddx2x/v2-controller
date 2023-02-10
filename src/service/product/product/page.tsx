import { StoreTableProps } from '@/dynamic-components';
import { pageManager } from '@/dynamic-view';
import { message, notification } from 'antd';
import { merge } from 'lodash';
import { Product, productStore } from '../../api/productProduct.store';
import { detail } from './detail';

const productStoreTable: StoreTableProps = {
  toolbarTitle: '数据列表',
  rowKey: 'uid',
  search: false,
  store: productStore,
  columns: [
    {
      dataIndex: 'uid',
      hideInSearch: true,
      hideInTable: true,
      editable: false,
    },
    {
      dataIndex: 'name',
      title: '商品名称',
      hideInSearch: true,
      editable: false,
    },
    {
      dataIndex: 'brand_name',
      title: '品牌名称',
      hideInSearch: true,
      editable: false,
    },
    {
      dataIndex: 'product_category_name',
      title: '产品分类',
      hideInSearch: true,
      editable: false,
    },
    {
      dataIndex: 'product_price_sn',
      title: '价格/货号',
      hideInSearch: true,
      editable: false,
    },
    {
      dataIndex: 'delete_status',
      title: '删除状态',
      hideInSearch: true,
      editable: false,
      valueType: "select",
      valueEnum: {
        0: { text: "是", status: "Error" },
        1: { text: "否", status: "Success" }
      }
    },
    {
      dataIndex: 'new_status',
      title: '新品状态',
      hideInSearch: true,
      editable: false,
      valueType: "select",
      valueEnum: {
        0: { text: "否", status: "Error" },
        1: { text: "是", status: "Success" }
      }
    },

    {
      dataIndex: 'recommand_status',
      title: '推荐状态',
      hideInSearch: true,
      editable: false,
      valueType: "select",
      valueEnum: {
        0: { text: "否", status: "Error" },
        1: { text: "是", status: "Success" }
      }
    },
    {
      dataIndex: 'verify_status',
      title: '审核状态',
      hideInSearch: true,
      editable: false,
      valueType: "select",
      valueEnum: {
        0: { text: "否", status: "Error" },
        1: { text: "是", status: "Success" }
      }
    },
    {
      dataIndex: 'sort',
      title: '排序',
      hideInSearch: true,
      editable: false,
    },
  ],
  editableValuesChange: (record) => { console.log(record) },
  toolBarMenu: (selectedRows) => [
    {
      kind: 'link',
      title: '新增',
      link: `/product/product/add`,
    },
    {
      kind: 'implement',
      title: '批量商品上架',
      onClick: (e) => {
        if (selectedRows.length <= 0) {
          message.warning('请批量选择商品'); return
        }
        message.info('批量商品上架成功')
      },
      collapse: true
    },
    {
      kind: 'implement',
      title: '批量商品下架',
      onClick: (e) => {
        if (selectedRows.length <= 0) {
          message.warning('请批量选择商品'); return
        }
        message.info('批量商品下架成功')
      },
      collapse: true
    },
  ],
  tableMenu: (record: Product, action: any) => [
    {
      kind: 'descriptions',
      title: '详情',
      dataSource: record,
      ...detail
    },
    {
      kind: 'link',
      title: '编辑',
      link: '/product/product/edit?id=' + record.uid
    },
    {
      kind: 'confirm',
      title: '删除',
      onClick: () => {
        productStore.remove(record.uid).then(() => {
          notification.info({ message: "删除成功" })
        }).catch(e => {
          notification.error(e)
        })
      },
      text: `确认删除` + record.name,
    },
  ],
  onRowEvent: [
    {
      mouseEvent: 'onDoubleClick',
      title: '详情',
    },
  ],
  onRequest: (params) => {
    const query = merge(params, { sort: { version: 1 } });
    productStore.next(query);
  },
  batchDelete: (selectedRows) => console.log('batchDelete', selectedRows)
};

pageManager.register('product.product', {
  page: {
    view: [{ kind: 'storeTable', ...productStoreTable }],
    container: {
      keepAlive: false,
    },
  },
  stores: [
    {
      store: productStore,
      exit: productStore.reset
    }
  ],
});
