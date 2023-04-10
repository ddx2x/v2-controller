import { FormColumnsType } from '@/dynamic-components';

export const merchandiseList: FormColumnsType = {
  dataIndex: 'merchandiseList',
  title: '商品名称',
  hideInSearch: true,
  valueType: 'merchandiseList',
};

export const uid: FormColumnsType = {
  dataIndex: 'uid',
  title: '订单编号',
  hideInSearch: true,
  valueType: 'money',
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
        dependencies: ['number1'],
        fieldProps: {
          style: { width: '100%' },
        },
        // formItemProps: (form: any) => {
        //   let max = form.getFieldValue('number1') || 0
        //   console.log('max', max);
        //   return {
        //     rules: [
        //       {
        //         max: max,
        //         whitespace: true,
        //         message: `最长为 ${max} 位`,
        //       },
        //       {
        //         min: 0,
        //         whitespace: true,
        //         message: '最小为 0 位',
        //       },
        //     ]
        //   }
        // }
      },
    ],
    editableValuesChange: (record) => {
      console.log(record);
    },
  },
};

export const orderId: FormColumnsType = {
  dataIndex: 'orderId',
  title: '订单id',
  fieldProps: {
    disabled: true,
  },
};

export const orderTime: FormColumnsType = {
  dataIndex: 'orderTime',
  title: '下单时间',
  fieldProps: {
    disabled: true,
  },
};

export const deliveryType: FormColumnsType = {
  dataIndex: 'delivery_type',
  title: '发货类型',
  valueType: 'select',
  editable: false,
  valueEnum: {
    '1': '快递',
    '2': '自提',
    '3': '无需发货',
  },
};

export const expressNo: FormColumnsType = {
  dataIndex: 'express_no',
  title: '快递单号',
};

export const expressCompany: FormColumnsType = {
  dataIndex: 'express_company',
  title: '快递公司',
};

export const pickup_code: FormColumnsType = {
  dataIndex: 'pickup_code',
  title: '自提码',
  fieldProps: {
    disabled: true,
  },
};

export const deliveryInfoDependency: FormColumnsType = {
  valueType: 'dependency',
  name: ['delivery_type'],
  columns: ({ delivery_type }) => {
    if (delivery_type == 1) {
      return [expressCompany, expressNo];
    } else if (delivery_type == 2) {
      return [pickup_code];
    } else {
      return [];
    }
  },
};
