import { DescriptionsProps } from '@/dynamic-components';
import { pageManager } from '@/dynamic-view';
import { AfterSaleOrderStateValueEnum, afterSaleorderApi } from '@/service/api';
import { ProDescriptionsItemProps } from '@ant-design/pro-components';

const orderSteps: ProDescriptionsItemProps = {
  dataIndex: 'steps',
  valueType: 'steps',
  plain: true
}

const orderInfo: ProDescriptionsItemProps = {
  dataIndex: 'orderInfo',
  valueType: 'descriptionsCard',
  fieldProps: {
    title: '售后单信息',
    columns: [
      {
        dataIndex: '_id',
        title: '售后单编号',
      },
      {
        dataIndex: 'order_id',
        title: '订单编号',
      },
      {
        dataIndex: 'customer',
        title: '买家昵称',
      },
      {
        dataIndex: 'state',
        valueType: 'select',
        title: '订单状态',
        valueEnum: AfterSaleOrderStateValueEnum
      },
      {
        dataIndex: 'remark_title',
        title: '商家操作',
      },
      {
        dataIndex: 'remark_spec',
        title: '详情',
      },

    ]
  },
}

const orderDescription: DescriptionsProps = {
  modal: 'Page',
  bordered: false,
  columns: [
    orderSteps,
    orderInfo,
  ] as DescriptionsProps['columns'],
  request: async (params) => {
    let res = await afterSaleorderApi.get(params.uid).then((res) => {
      res.remark_title = res.remark?.title
      res.remark_spec = res.remark?.spec
      return res;
    })


    return {
      success: true,
      data: {
        // delivery: delivery,
        orderStatus: {},
        orderInfo: res,
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


pageManager.register('order.after-sale-order.detail', {
  page: {
    view: [{ kind: 'descriptions', ...orderDescription }],
    container: {
      keepAlive: false,
    },
  },
})