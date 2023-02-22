import { StoreTableProps } from '@/dynamic-components';
import { MenuButtonType } from '@/dynamic-components/table/menuButton';
import { pageManager } from '@/dynamic-view';
import { Order, orderStore } from '@/service/api';
import { merge } from 'lodash';
import { shipForm } from './form';

const orderStoreTable: StoreTableProps = {
  rowKey: 'uid',
  store: orderStore,
  search: false,
  size: 'small',
  columns: [
    {
      dataIndex: 'merchandise_list',
      title: '商品信息',
      hideInSearch: true,
      valueType: 'merchandiseList',
      editable: false,
      width: 300,
      fixed: 'left',
    },
    {
      dataIndex: 'uid',
      title: '订单编号',
      fixed: 'left',
      editable: false,
    },
    {
      dataIndex: 'total_render',
      title: '实收金额',
      valueType: 'money',
      hideInSearch: true,
      editable: false,

    },
    {
      dataIndex: 'customer',
      title: '客户信息',
      hideInSearch: true,
      editable: false,
    },
    {
      dataIndex: 'delivery_type',
      title: '配送方式',
      hideInSearch: true,
      editable: false,
    },
    {
      dataIndex: 'payment_type',
      title: '支付方式',
      hideInSearch: true,
      editable: false,
    },
    {
      dataIndex: 'typ',
      title: '订单状态',
      valueType: 'switch',
      editable: false,
      hideInSearch: true,
      valueEnum: {
        0: false,
        1: true,
      }
    },
  ],

  tableMenu: (record: Order, action: any) => {
    let columns: MenuButtonType[] = [{
      kind: 'link',
      title: '详情',
      link: `/order/list/detail?uid=${record.uid}`,
    }]
    columns.push({
      kind: 'form',
      title: '详情',
      request: async (params) => {
        
        return {
          merchandiseTable: {
            dataSource: record.merchandise_list?.map(item => {
              return {
                uid: item.uid,
                merchandise: item,
                number1: 1,
                number2: 2
              }
            })
          },
          orderId: record._id
        }
      },
      ...shipForm,
    })
    return columns
  },
  onRequest: (params) => {
    const query = merge(params, { sort: { version: 1 } });
    orderStore.next(query)
  },
};

pageManager.register('order.list', {
  page: {
    view: [{ kind: 'storeTable', ...orderStoreTable }],
    container: {
      keepAlive: false,
    },
  },
  stores: [
    {
      store: orderStore,
      exit: orderStore.reset
    }
  ],
});
