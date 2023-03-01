import { StoreTableProps } from '@/dynamic-components';
import { MenuButtonType } from '@/dynamic-components/table/menuButton';
import { pageManager } from '@/dynamic-view';
import { Order, afterSaleOrderStore } from '@/service/api';
import { merge } from 'lodash';

const afterSaleOrderStoreTable: StoreTableProps = {
  rowKey: 'uid',
  store: afterSaleOrderStore,
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
      dataIndex: 'total',
      title: '应退金额',
      valueType: 'money',
      editable: false,
    },
    {
      dataIndex: 'customer',
      title: '客户信息',
      editable: false,
    },
    // {
    //   dataIndex: 'delivery_type',
    //   title: '配送方式',
    //   hideInSearch: true,
    //   editable: false,
    // },
    // {
    //   dataIndex: 'payment_type',
    //   title: '支付方式',
    //   editable: false,
    // },
    {
      dataIndex: 'typ',
      title: '订单状态',
      valueType: 'switch',
      editable: false,
      valueEnum: {
        0: false,
        1: true,
      }
    },
  ],

  toolbarTitle: '订单列表',
  tableMenu: (record: Order, action) => {
    let columns: MenuButtonType[] = [
      {
        kind: 'link',
        title: '详情',
        link: `/order/after-sale-order/detail?uid=${record.uid}`,
      },
      {
        kind: 'implement',
        title: '刷新',
        onClick(e) {
          action?.reload()
        },
      },
      {
        kind: 'implement',
        collapse: true,

        title: '通过',
        onClick(e) {
        },
      },
      {
        kind: 'implement',
        title: '拒绝',
        collapse: true,

        onClick(e) {
        },
      },
    ]
    return columns
  },
  onRequest: (params) => {
    const query = merge(params, { sort: { version: 1 } });
    afterSaleOrderStore.next(query)
  },
};

pageManager.register('order.after-sale-order', {
  page: {
    view: [{ kind: 'storeTable', ...afterSaleOrderStoreTable }],
    container: {
      keepAlive: false,
    },
  },
  stores: [
    {
      store: afterSaleOrderStore,
      exit: afterSaleOrderStore.reset
    }
  ],
});
