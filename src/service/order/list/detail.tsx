import { DescriptionsProps } from '@/dynamic-components';
import { pageManager } from '@/dynamic-view';
import { ProDescriptionsItemProps } from '@ant-design/pro-components';

const orderSteps: ProDescriptionsItemProps = {
  dataIndex: 'steps',
  valueType: 'steps',
  plain: true
}

const deliveryInfo: ProDescriptionsItemProps = {
  dataIndex: 'delivery',
  valueType: 'descriptionsCard',
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
        dataIndex: 'customer',
        title: '买家昵称',
      },
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
        dataIndex: 'customer',
        title: '买家昵称',
      },
    ]
  }
}

const orderStatus: ProDescriptionsItemProps = {
  dataIndex: 'orderStatus',
  valueType: 'descriptionsCard',
  fieldProps: {
    title: '订单状态',
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
        dataIndex: 'customer',
        title: '买家昵称',
      },
    ]
  },
}

const orderInfo: ProDescriptionsItemProps = {
  dataIndex: 'orderInfo',
  valueType: 'descriptionsCard',
  fieldProps: {
    title: '订单信息',
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
    orderStatus,
    orderInfo,
  ] as DescriptionsProps['columns'],
  request: async (params) => {
    return {
      success: true,
      data: {
        delivery: {
          delivery_type: '商家配送'
        },
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
  },
}


pageManager.register('order.list.detail', {
  page: {
    view: [{ kind: 'descriptions', ...orderDescription }],
    container: {
      keepAlive: false,
    },
  },
})