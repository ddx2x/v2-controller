import { FormColumnsType } from '@/dynamic-components';

export const merchandiseList: FormColumnsType = {
  dataIndex: 'merchandiseList',
  title: '商品名称',
  hideInSearch: true,
  valueType: 'merchandiseList',
}

export const uid: FormColumnsType = {
  dataIndex: 'uid',
  title: '订单编号',
  hideInSearch: true,
  valueType: "money",
};


export const merchandiseTable: FormColumnsType = {
  dataIndex: 'merchandiseTable',
  valueType: 'editableTable',
  fieldProps: {
    rowKey: 'uid',
    columns: [
      {
        dataIndex: 'uid',
        hideInSearch: true,
        hideInTable: true,
      },
      {
        dataIndex: 'merchandise',
        title: '商品信息',
        hideInSearch: true,
        valueType: 'merchandise',
      },
      {
        dataIndex: 'number1',
        title: '可发货数量',
        hideInSearch: true,
        editable: false,
        valueType: 'digit',
      },
      {
        dataIndex: 'number2',
        title: '发货数量',
        valueType: 'digit',
      }
    ],
    editableValuesChange: (record) => {
      console.log(record);
    },
  },
}

export const orderId: FormColumnsType = {
  dataIndex: 'orderId',
  title: '订单id',
  fieldProps: {
    disabled: true
  }
}


export const orderTime: FormColumnsType = {
  dataIndex: 'orderTime',
  title: '下单时间',
  fieldProps: {
    disabled: true
  }
}



export const deliveryType: FormColumnsType = {
  dataIndex: 'delivery_type',
  title: '发货类型',
  valueType: 'select',
  initialValue: '1',

  // transform: value => String(value),
  valueEnum: {
    1: '快递',
    2: '自提',
  },
}

export const deliveryInfo: FormColumnsType = {
  dataIndex: 'delivery_id',
  title: '发货单',
}


export const deliveryInfoDependency: FormColumnsType = {
  valueType: 'dependency',
  name: ['delivery_type'],
  columns: ({ delivery_type }) => {
    return delivery_type == 1 ? [deliveryInfo] : []
  },
}