import { FormColumnsType, StoreTableProps } from '@/dynamic-components';
import { pageManager } from '@/dynamic-view';
import { history } from '@umijs/max';
import { message, notification } from 'antd';
import { merge } from 'lodash';
import { parse } from 'querystring';
import { request } from 'umi';
import { StockKeepingUnit, stockKeepingUnitStore } from '../../api/productSKU.store';
import { ProductAttribute } from '../attribute';

const table: StoreTableProps = {
  toolbarTitle: '数据列表',
  rowKey: 'uid',
  search: false,
  store: stockKeepingUnitStore,
  columns: [
    {
      dataIndex: 'uid',
      hideInSearch: true,
      hideInTable: true,
      editable: false,
    },
    {
      dataIndex: 'product_name',
      title: '商品名称',
      hideInSearch: true,
      editable: false,
      valueType: 'text',
      fixed: 'left',
      width: 100,
    },
    {
      dataIndex: 'pic',
      title: '图片',
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
      dataIndex: 'spec_name',
      title: '规格名称',
      hideInSearch: true,
      editable: false,
      valueType: 'text',
    },
    {
      dataIndex: 'publish_status',
      title: '上架状态',
      hideInSearch: true,
      valueType: 'switch',
      valueEnum: {
        false: false,
        true: true,
      },
    },
    {
      dataIndex: 'price',
      title: '销售价格',
      hideInSearch: true,
      valueType: 'money',
      editable: false,
    },
    {
      dataIndex: 'promotion_price',
      title: '促销价格',
      hideInSearch: true,
      valueType: 'money',
      editable: false,
    },
    {
      dataIndex: 'stock',
      title: '商品库存',
      hideInSearch: true,
      editable: false,
      valueType: 'digit',
    },
    {
      dataIndex: 'low_stock',
      title: '库存预警',
      valueType: 'digit',
      editable: false,
    },
    {
      dataIndex: 'sale',
      title: '销量',
      valueType: 'digit',
      editable: false,
    },
  ],
  editableValuesChange: (record: StockKeepingUnit) => {
    const src = stockKeepingUnitStore.items.find((item) => item.getUid() === record.uid);
    const update: Partial<StockKeepingUnit> = record;

    // TODO: 当价格没有设置时，不更新,当前不支持reject editedtable

    if (!src) return;
    if (src?.publish_status !== update.publish_status) {
      if (update.publish_status) {
        update.publish_status = true;
      } else {
        update.publish_status = false;
      }
      stockKeepingUnitStore
        .update_one(src, update, ['publish_status'])
        .then(() => {
          notification.success({ message: '更新成功' });
        })
        .catch((e) => {
          notification.error({ message: '更新失败:' + e });
        });
    }
  },
  toolBarMenu: (selectedRows, location) => [
    {
      kind: 'form',
      layoutType: 'ModalForm',
      columns: [],
      triggerText: '生成单品存量',
      title: '生成单品存量',
      onMount({ form, setColumns, setDataObject }) {
        const query: any = parse(location?.search.split('?')[1] || '');
        const product_id = query['product_id'];
        setDataObject({ product_id: product_id });

        request(`/product-t/api/v1/product_other/${product_id}`)
          .then((rs: ProductAttribute[]) => {
            const fields = rs.map((r) => {
              const valueEnum = r.input_select_list
                ?.map((item, index) => {
                  return { val: item };
                })
                .reduce(function (map: any, obj: any) {
                  map[obj.val] = obj.val;
                  return map;
                }, {});

              return {
                dataIndex: r.name,
                title: r.name,
                tooltip: `${r.category_id}-${r.name}-${
                  r.input_type === 1 ? '只能从列表选择' : '支持手工添加'
                }`,
                valueType: 'select',
                hideInSearch: true,
                fieldProps: {
                  mode: r.input_type === 1 ? 'multiple' : 'tags',
                },
                editable: false,
                valueEnum: valueEnum,
              } as FormColumnsType;
            });
            setColumns(fields);
          })
          .catch((e) => {
            message.error(e);
          });
      },
      onSubmit: ({ values, dataObject, handleClose }) => {
        request(`/product-t/api/v1/product_other`, {
          method: 'POST',
          data: merge({}, { product_id: dataObject.product_id, values: values }),
        })
          .then(() => {
            notification.info({ message: '生成成功' });
            history.push(`/product/product/sku?product_id=${dataObject.product_id}`);
          })
          .catch((e) => notification.error(e));

        handleClose();
        return true;
      },
    },
  ],
  tableMenu: (record: StockKeepingUnit, action: any) => [
    {
      kind: 'confirm',
      title: '删除',
      onClick: () => {
        stockKeepingUnitStore
          .remove(record.uid)
          .then(() => {
            notification.info({ message: '删除成功' });
          })
          .catch((e) => {
            notification.error(e);
          });
      },
      text: `确认删除` + record.spec_name,
    },
    {
      kind: 'link',
      title: '编辑',
      link: `/product/product/sku/edit?id=${record.uid}`,
    },
  ],
  onRowEvent: [
    {
      mouseEvent: 'onDoubleClick',
      title: '详情',
    },
  ],
  onRequest: (params) => {
    const query = merge(
      params,
      { filter: parse(location?.search.split('?')[1] || '') },
      { sort: { spec_name: 1 } },
    );
    stockKeepingUnitStore.next(query);
  },
  defaultPageSize: 10,
  batchDelete: (selectedRows) => console.log('batchDelete', selectedRows),
};

pageManager.register('product.product.sku', {
  page: {
    view: [{ kind: 'storeTable', ...table }],
    container: {
      keepAlive: false,
    },
  },
  stores: [
    {
      store: stockKeepingUnitStore,
      exit: stockKeepingUnitStore.reset,
    },
  ],
});
