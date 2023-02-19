import { StoreTableProps } from '@/dynamic-components';
import { MenuButtonType } from '@/dynamic-components/table/menuButton';
import { pageManager } from '@/dynamic-view';
import { orderStore } from '@/service/api';
import { merge } from 'lodash';
import { Product, productStore } from '../../api/productProduct.store';
import { shipForm } from './form';

const orderStoreTable: StoreTableProps = {
  rowKey: 'uid',
  store: orderStore,
  search: false,
  size: 'small',
  columns: [
    {
      dataIndex: 'model_commodity',
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
  value: [{
    "uid": '12344321421',
    "model_commodity": [{
      image: '/media-t/file/3prFcPQUTwpbBe9fgBaWRw_1676282738491.png',
      title: '美孚(Mobil)美孚速霸2000 全合成机油 5W-40 SP级 4L',
      attrs: {
        '数量': '10',
        '单价': '4752',
        '仓库': '智慧零售_6013610787967'
      }
    },
    {
      image: '/media-t/file/3prFcPQUTwpbBe9fgBaWRw_1676282738491.png',
      title: '美孚(Mobil)美孚速霸2000 全合成机油 5W-40 SP级 4L',
      attrs: {
        '数量': '10',
        '单价': '4752',
        '仓库': '智慧零售_6013610787967'
      }
    }],
    "total": 100.25,
    "customer": '鑫新智联',
  }],
  tableMenu: (record: Product, action: any) => {
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
          merchandiseTable: [
            {
              id: '1',
              merchandise: {
                image: '/media-t/file/3prFcPQUTwpbBe9fgBaWRw_1676282738491.png',
                title: '美孚(Mobil)美孚速霸2000 全合成机油 5W-40 SP级 4L',
                attrs: {
                  '数量': '10',
                  '单价': '4752',
                  '仓库': '智慧零售_6013610787967'
                }
              },
              orderId: '1234412'
            },
            {
              id: '2',
              merchandise: {
                image: '/media-t/file/3prFcPQUTwpbBe9fgBaWRw_1676282738491.png',
                title: '美孚(Mobil)美孚速霸2000 全合成机油 5W-40 SP级 4L',
                attrs: {
                  '数量': '10',
                  '单价': '4752',
                  '仓库': '智慧零售_6013610787967'
                }
              },
            }],
          orderId: '1234412'
        }
      },
      ...shipForm,
    })
    return columns
  },
  onRequest: (params) => {
    const query = merge(params, { sort: { version: 1 } });
    productStore.next(query);
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
