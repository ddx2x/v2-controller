import { FormColumnsType } from '@/dynamic-components';

export const merchandiseList: FormColumnsType = {
  dataIndex: 'product_name',
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
        dataIndex: 'id',
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
        initialValue: 1
      },
      {
        dataIndex: 'number2',
        title: '发货数量',
        valueType: 'digit',
        initialValue: 1
      }
    ],
    onSelectedRows: (selectedRows) => {
      console.log('selectedRows', selectedRows)
    }
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


export const deliveryInfo: FormColumnsType = {
  dataIndex: 'deliveryInfo',
  title: '收货信息',
  fieldProps: {
    disabled: true
  }
}

