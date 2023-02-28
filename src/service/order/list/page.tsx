import { StoreTableProps } from '@/dynamic-components';
import { MenuButtonType } from '@/dynamic-components/table/menuButton';
import { pageManager } from '@/dynamic-view';
import { Order, orderApi, orderStore } from '@/service/api';
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
    let columns: MenuButtonType[] = [{
      kind: 'link',
      title: '详情',
      link: `/order/list/detail?uid=${record.uid}`,
    },
    {
      kind: 'implement',
      title: '刷新',
      onClick(e) {
        action?.reload()
      },
    }]
    columns.push({
      kind: 'form',
      title: '发货',
      onMount: async ({ form, setDataObject, }) => {
        let data = await orderApi.get(record.uid).then((res) => {
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
          return res;
        })

        let dataSource: any[] = [];
        record.merchandise_list?.map(item => {
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
