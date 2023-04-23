import { StoreTableProps } from '@/dynamic-components';
import { MenuButtonType } from '@/dynamic-components/table/menuButton';
import { pageManager } from '@/dynamic-view';
import {
  Customer,
  customerStore,
  Order,
  orderApi,
  OrderStateValueEnum,
  orderStore,
} from '@/service/api';
import { Delivery, deliveryApi } from '@/service/api/delivery.store';
import { unixtime2dateformat } from '@/service/common';
import { merge } from 'lodash';
import { ReactNode } from 'react';
import { shipForm } from './form';

const shipFormOnMount = async (record: any, form: any, setDataObject: any) => {
  await orderApi.get(record.uid).then((res) => {
    let delivery_map = new Map();

    (res?.order_sku_list || []).map((item: any) => {
      delivery_map.set(item.sku.uid, item.quantity);
    });
    res.deliveries?.map((item: any) => {
      let quantity = delivery_map.get(item.sku_id) - item.quantity;
      delivery_map.set(item.sku_id, quantity);
    });
    res.delivery_map = delivery_map;
    setDataObject(res);
  });

  let dataSource: any[] = [];
  record.merchandise_list?.map((item: any) => {
    if (record.delivery_map?.get(item.uid) == 0) {
      return;
    }
    dataSource.push({
      uid: item.uid,
      merchandise: item,
      number1: record.delivery_map?.get(item.uid),
      number2: record.delivery_map?.get(item.uid),
    });
  });

  await deliveryApi.get(record.uid).then((res: Delivery) => {
    record.pickup_code = res.delivery_content?.Pickup?.pickup_code;
    record.pickup_store = res.delivery_content?.Pickup?.pickup_store;
    record.pickup_time = res.delivery_content?.Pickup?.pickup_time;

    record.receive_address_id = res.receive_address_id || '';
  });

  form?.setFieldsValue({
    merchandiseTable: {
      dataSource: dataSource,
    },
    orderId: record._id,
    ...record,
  });
};

const orderStoreTable: StoreTableProps = {
  rowKey: 'uid',
  store: orderStore,
  size: 'small',
  options: { reload: true },
  search: {
    defaultCollapsed: false,
  },
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
      hideInSearch: true,
      width: 205,
    },
    {
      dataIndex: 'crate_at',
      title: '创建时间',
      valueType: 'date',
      editable: false,
      width: 150,
      render: (text: ReactNode, record: Order, index: number, action: any) => {
        return [<>{record.crate_at === 0 ? '-' : unixtime2dateformat(record.crate_at || 0)}</>];
      },
    },
    {
      dataIndex: 'total_render',
      title: '实收金额',
      valueType: 'money',
      editable: false,
      hideInSearch: true,
      width: 200,
    },
    {
      dataIndex: 'customer',
      title: '客户信息',
      tooltip: '支持模糊搜索',
      editable: false,
      width: 300,
      valueType: 'autoComplete',
      fieldProps: {
        onSearch: async (text: string) => {
          return await customerStore.api
            .list(text, {}, 'name')
            .then((res: Customer[]) => res.map((value: Customer) => ({ value: value.name })));
        },
      },
    },
    {
      dataIndex: 'delivery_type',
      title: '配送方式',
      hideInSearch: true,
      editable: false,
      width: 100,
      valueEnum: {
        1: '快递',
        2: '自提',
        3: '无需发货',
      },
    },
    {
      dataIndex: 'payment_type',
      title: '支付方式',
      editable: false,
      width: 100,
      valueEnum: {
        0: '未支付',
        1: '微信',
        2: '支付宝',
      },
    },
    {
      dataIndex: 'state',
      title: '订单状态',
      valueType: 'select',
      editable: false,
      width: 100,
      valueEnum: OrderStateValueEnum,
    },
    {
      dataIndex: 'error_info',
      title: '错误信息',
      valueType: 'text',
      width: 200,
      hideInSearch: true,
      editable: false,
    },
  ],

  toolbarTitle: '订单列表',
  tableMenu: (record: Order, action) => {
    let columns: MenuButtonType[] = [
      {
        kind: 'link',
        title: '详情',
        link: `/order/order/detail?uid=${record.uid}`,
      },
    ];

    // 已支付状态，才能发货
    if (record.state == 2) {
      columns.push({
        kind: 'form',
        title: '发货',
        onMount: async ({ form, setDataObject }) => shipFormOnMount(record, form, setDataObject),
        ...shipForm,
      });
    }
    return columns;
  },
  onRequest: ({ query }) => orderStore.next(merge(query, { sort: { version: 1 } })),
};

pageManager.register('order.order', {
  page: {
    view: [{ kind: 'storeTable', ...orderStoreTable }],
    container: {
      keepAlive: false,
    },
  },
  stores: [
    {
      store: orderStore,
      exit: orderStore.reset,
    },
  ],
});
