import { StoreTableProps } from '@/dynamic-components';
import { MenuButtonType } from '@/dynamic-components/table/menuButton';
import { pageManager } from '@/dynamic-view';
import { Order, OrderStateValueEnum, orderApi, orderStore } from '@/service/api';
import { merge } from 'lodash';
import { shipForm } from './form';

const shipFormOnMount = async (record: any, form: any, setDataObject: any) => {
  await orderApi.get(record.uid).then((res) => {
    let delivery_map = new Map();

    (res?.order_sku_list || []).map((item: any) => {
      delivery_map.set(item.sku.uid, item.quantity)
    })
    res.deliveries?.map(
      (item: any) => {
        let quantity = delivery_map.get(item.sku_id) - item.quantity
        delivery_map.set(item.sku_id, quantity)
      }
    )
    res.delivery_map = delivery_map
    setDataObject(res)
  })

  let dataSource: any[] = [];
  record.merchandise_list?.map((item: any) => {
    if (record.delivery_map?.get(item.uid) == 0) {
      return
    }
    dataSource.push({
      uid: item.uid,
      merchandise: item,
      number1: record.delivery_map?.get(item.uid),
      number2: record.delivery_map?.get(item.uid)
    })
  })

  form?.setFieldsValue({
    merchandiseTable: {
      dataSource: dataSource,
    },
    orderId: record._id
  });
}

const orderStoreTable: StoreTableProps = {
  rowKey: 'uid',
  store: orderStore,
  search: false,
  size: 'small',
  options: { reload: true },
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
      editable: false,

    },
    {
      dataIndex: 'customer',
      title: '客户信息',
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
      editable: false,
    },
    {
      dataIndex: 'state',
      title: '订单状态',
      valueType: 'select',
      editable: false,
      valueEnum: OrderStateValueEnum
    },
  ],

  toolbarTitle: '订单列表',
  tableMenu: (record: Order, action) => {
    let columns: MenuButtonType[] = [{
      kind: 'link',
      title: '详情',
      link: `/order/order/detail?uid=${record.uid}`,
    },
    ]

    // 已支付状态，才能发货
    if (record.state == 2) {
      columns.push({
        kind: 'form',
        title: '发货',
        onMount: async ({ form, setDataObject, }) => shipFormOnMount(record, form, setDataObject),
        ...shipForm,
      })
    }
    return columns
  },
  onRequest: (params) => {
    const query = merge(params, { sort: { version: 1 } });
    orderStore.next(query)
  },
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
      exit: orderStore.reset
    }
  ],
});
