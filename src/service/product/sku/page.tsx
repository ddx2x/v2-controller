import { StoreTableProps } from '@/dynamic-components';
import { pageManager } from '@/dynamic-view';
import { notification } from 'antd';
import { merge } from 'lodash';
import { parse } from 'querystring';
import { StockKeepingUnit, stockKeepingUnitStore } from '../../api/productSKU.store';

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
      dataIndex: 'name',
      title: '商品名称',
      hideInSearch: true,
      editable: false,
      valueType: 'text',
      width: 100,
      fixed: 'left',
      fieldProps: {
        width: 55,
      },
      colSpan: 1,
    },
    {
      dataIndex: 'spec_name',
      title: '规格名称',
      hideInSearch: true,

    },

    {
      dataIndex: 'price',
      title: '价格',
      hideInSearch: true,
      editable: false,
    },
    {
      dataIndex: 'stock',
      title: '库存',
      hideInSearch: true,
      editable: false,
    },
    {
      dataIndex: 'low_stock',
      title: '库存预警',
    },
  ],
  editableValuesChange: (record: StockKeepingUnit) => { },
  toolBarMenu: (selectedRows: any, location: any) => [
    {
      kind: 'form',
      layoutType: 'ModalForm',
      columns: [],
      triggerText: '生成单品存量',
      title: '生成单品存量',
      onMount({ form, setColumns }) {
        setTimeout(() =>
          setColumns([{
            dataIndex: 'stock',
            title: '库存',
            hideInSearch: true,
            editable: false,
          },
          {
            dataIndex: 'low_stock',
            title: '库存预警',
          }
          ]), 200)
        form.setFieldsValue({ stock: 1, low_stock: 2 })
      },
      onClick: () => {
        // stockKeepingUnitStore.remove(record.uid).then(() => {
        notification.info({ message: "生成成功" + location })
        // }).catch(e => {
        //   notification.error(e)
        // })
      },
    },
  ],
  tableMenu: (record: StockKeepingUnit, action: any) => [
    {
      kind: 'confirm',
      title: '删除',
      onClick: () => {
        stockKeepingUnitStore.remove(record.uid).then(() => {
          notification.info({ message: "删除成功" })
        }).catch(e => {
          notification.error(e)
        })
      },
      text: `确认删除` + record.uid,
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
    const query = merge(params,
      { filter: parse(location?.search.split('?')[1] || '') },
      { sort: { spec_name: 1 } },
    );
    stockKeepingUnitStore.next(query);
  },
  defaultPageSize: 10,
  batchDelete: (selectedRows) => console.log('batchDelete', selectedRows)
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
      exit: stockKeepingUnitStore.reset
    }
  ],
});
