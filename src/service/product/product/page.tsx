import { StoreTableProps } from '@/dynamic-components';
import { pageManager } from '@/dynamic-view';
import { history } from '@umijs/max';
import { message, notification } from 'antd';
import { merge } from 'lodash';
import { Product, productApi, productStore } from '../../api/productProduct.store';
import { detail } from './detail';

const productStoreTable: StoreTableProps = {
  toolbarTitle: '数据列表',
  rowKey: 'uid',
  store: productStore,
  // search: false,
  size: 'small',
  columns: [
    {
      dataIndex: 'uid',
      hideInSearch: true,
      hideInTable: true,
      editable: false,
    },

    {
      dataIndex: 'album_pics',
      title: '商品图',
      hideInSearch: true,
      valueType: 'imageUpload',
      editable: false,
      hideInTable: true,
    },
    {
      dataIndex: 'album_pic',
      title: '商品图',
      hideInSearch: true,
      valueType: 'imageUpload',
      editable: false,
      width: 100,
      fixed: 'left',
      fieldProps: {
        width: 55,
      },
    },
    {
      dataIndex: 'name',
      title: '商品名称',
      // hideInSearch: true,
      editable: false,
      fieldProps: {
        autoComplete: true,
      },
    },
    {
      dataIndex: 'price',
      title: '价格(起)',
      hideInSearch: true,
      editable: false,
      valueType: 'money',
    },
    {
      dataIndex: 'brand_name',
      title: '品牌名称',
      // hideInSearch: true,
      editable: false,
    },
    {
      dataIndex: 'product_category_name',
      title: '产品分类',
      hideInSearch: true,
      editable: false,
    },
    {
      dataIndex: 'publish_status',
      title: '上架状态',
      valueType: 'switch',
      valueEnum: {
        0: false,
        1: true,
      },
    },

    {
      dataIndex: 'new_status',
      title: '新品状态',
      hideInSearch: true,
      editable: false,
      valueType: 'select',
      valueEnum: {
        false: { text: '否', status: 'Error' },
        true: { text: '是', status: 'Success' },
      },
    },

    {
      dataIndex: 'recommand_status',
      title: '推荐状态',
      hideInSearch: true,
      editable: false,
      valueType: 'select',
      valueEnum: {
        false: { text: '否', status: 'Error' },
        true: { text: '是', status: 'Success' },
      },
    },

    {
      dataIndex: 'delete_status',
      title: '删除状态',
      hideInSearch: true,
      editable: false,
      valueType: 'radio',
      valueEnum: {
        0: { text: '否', status: 'Success' },
        1: { text: '是', status: 'Error' },
      },
    },
  ],
  editableValuesChange: (record: Product) => {
    const src = productStore.items.find((item) => item.getUid() === record.uid);
    const update: Partial<Product> = record;

    if (!src) return;
    if (src?.publish_status !== update.publish_status) {
      if (update.publish_status) {
        update.publish_status = 1;
      } else {
        update.publish_status = 0;
      }
      productStore
        .update_one(src, update, ['publish_status'])
        .then(() => {
          notification.success({ message: '更新成功' });
        })
        .catch((e) => {
          notification.error({ message: '更新失败:' + e });
        });
    }
  },
  toolBarMenu: (selectedRows: any) => [
    {
      kind: 'link',
      title: '新增',
      link: `/product/product/add`,
    },
    {
      kind: 'implement',
      title: '批量商品上架',
      onClick: (e) => {
        const rows: Product[] = selectedRows;
        if (rows.length <= 0) {
          message.warning('请批量选择商品');
          return;
        }
        rows.map((row) => {
          productStore
            .update_one(row, { publish_status: 1 }, ['publish_status'])
            .then(() => {
              message.info(`"${row.name}" 上架成功`);
              history.push(`/product/product`);
            })
            .catch((e) => {
              message.error(e);
            });
        });
      },
      collapse: true,
    },
    {
      kind: 'implement',
      title: '批量商品下架',
      onClick: (e) => {
        const rows: Product[] = selectedRows;
        if (rows.length <= 0) {
          message.warning('请批量选择商品');
          return;
        }
        rows.map((row) => {
          productStore
            .update_one(row, { publish_status: 0 }, ['publish_status'])
            .then(() => {
              message.info(`"${row.name}" 下架成功`);
              history.push(`/product/product`);
            })
            .catch((e) => {
              message.error(e);
            });
        });
      },
      collapse: true,
    },
  ],
  tableMenu: (record: Product, action: any) => [
    {
      kind: 'descriptions',
      title: '详情',
      collapse: true,
      request: async (params) => {
        return await productApi.get(record.uid).then((rs) => {
          return { data: rs, success: true };
        });
      },
      ...detail,
    },
    {
      kind: 'link',
      title: '编辑',
      // collapse: true,
      link: '/product/product/edit?id=' + record.uid,
    },
    {
      kind: 'link',
      title: '存货',
      link: '/product/product/sku?product_id=' + record.uid,
      // collapse: true,
    },
    {
      kind: 'confirm',
      title: '删除',
      onClick: () => {
        productStore
          .remove(record.uid)
          .then(() => {
            notification.info({ message: '删除成功' });
          })
          .catch((e) => {
            notification.error(e);
          });
      },
      text: `确认删除` + record.name,
      collapse: true,
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
  batchDelete: (selectedRows) => console.log('batchDelete', selectedRows),
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
      exit: productStore.reset,
    },
  ],
});
