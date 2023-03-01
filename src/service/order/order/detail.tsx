import { DescriptionsProps } from '@/dynamic-components';
import { pageManager } from '@/dynamic-view';
import { orderApi } from '@/service/api';
import { ProDescriptionsItemProps } from '@ant-design/pro-components';

const orderSteps: ProDescriptionsItemProps = {
  dataIndex: 'steps',
  valueType: 'steps',
  plain: true
}

const deliveryInfo: ProDescriptionsItemProps = {
  dataIndex: 'delivery',
  valueType: 'descriptionsCardList',
  fieldProps: {
    title: '配送信息',
    columns: [
      {
        dataIndex: 'delivery_type',
        title: '配送方式',
      },
      {
        dataIndex: 'delivery_time',
        valueType: 'date',
        title: '配送时间',
      },
      {
        dataIndex: 'delivery_id',
        title: '快递单号',
      },
      {
        dataIndex: 'customer',
        title: '买家昵称',
      },
      // {
      //   dataIndex: 'delivery_type',
      //   title: '配送方式',
      // },
      // {
      //   dataIndex: 'delivery_time',
      //   valueType: 'date',
      //   title: '配送时间',
      // },
      // {
      //   dataIndex: 'customer',
      //   title: '买家昵称',
      // },
    ]
  }
}



const orderInfo: ProDescriptionsItemProps = {
  dataIndex: 'orderInfo',
  valueType: 'descriptionsCard',
  fieldProps: {
    title: '订单信息',
    columns: [
      {
        dataIndex: 'order_id',
        title: '订单编号',
      },
      {
        dataIndex: 'order_status',
        valueType: 'date',
        title: '订单状态',
      },
      {
        dataIndex: 'customer',
        title: '买家昵称',
      },
    ]
  },
}


const orderDescription: DescriptionsProps = {
  modal: 'Page',
  bordered: false,
  columns: [
    orderSteps,
    deliveryInfo,
    orderInfo,
  ] as DescriptionsProps['columns'],
  request: async (params) => {
    console.log('request.....');

    return await orderApi.get(params.uid).then((res) => {
      // let delivery_map = new Map();

      // (res?.order_sku_list || []).map((item: any) => {
      //   delivery_map.set(item.sku.uid, item.quantity)
      // })
      // res.deliveries?.map(
      //   (item: any) => {
      //     let quantity = delivery_map.get(item.sku_id) - item.quantity
      //     delivery_map.set(item.sku_id, quantity)
      //   }
      // )
      // res.delivery_map = delivery_map

      let delivery: any[] = [];
      res.deliveries.map((item: any) => {
        delivery.push({
          delivery_type: item.delivery_type == 1 ? '快递配送' : '自提',
          delivery_id: item.delivery_id,
          customer: res.customer,
        })
      })

      console.log('delivery', delivery);


      return {
        success: true,
        data: {
          delivery: delivery,
          orderStatus: {},
          orderInfo: {},
          steps: {
            current: 1,
            items: [
              {
                title: 'Finished',
                description: 'This is a description.',
              },
              {
                title: 'In Progress',
                description: 'This is a description.',
                subTitle: 'Left 00:00:08',
              },
              {
                title: 'Waiting',
                description: 'This is a description.',
              },
            ]
          },
        }
      }
    })





  },
}


pageManager.register('order.order.detail', {
  page: {
    view: [{ kind: 'descriptions', ...orderDescription }],
    container: {
      keepAlive: false,
    },
  },
})