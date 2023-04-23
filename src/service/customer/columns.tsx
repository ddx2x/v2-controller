import { FormColumnsType } from '@/dynamic-components';

export const name: FormColumnsType = {
  dataIndex: 'name',
  title: '客户名称',
  hideInSearch: true,
  formItemProps: {
    rules: [
      {
        required: true,
        message: '此项为必填项',
      },
      {
        message: '最小6个字符最大64',
        type: 'string',
        min: 1,
        max: 64,
      },
    ],
  },
};

export const customerAddresses: FormColumnsType = {
  dataIndex: 'customerAddresses',
  valueType: 'editableTable',
  title: '收货地址',
  fieldProps: {
    rowKey: 'uid',
    columns: [
      {
        dataIndex: 'uid',
        hideInSearch: true,
        hideInTable: true,
      },
      {
        dataIndex: 'name',
        title: '收货人名称',
        hideInSearch: true,
        valueType: 'text',
      },
      {
        dataIndex: 'phone',
        title: '号码',
        hideInSearch: true,
        editable: false,
        valueType: 'text',
      },
      {
        dataIndex: 'province',
        title: '省',
        editable: false,
        valueType: 'text',
      },
      {
        dataIndex: 'city',
        title: '市',
        editable: false,
        valueType: 'text',
      },
      {
        dataIndex: 'district',
        title: '区',
        editable: false,
        valueType: 'text',
      },
      {
        dataIndex: 'address',
        title: '详细地址',
        editable: false,
        valueType: 'text',
      },
      {
        dataIndex: 'is_default',
        title: '默认地址',
        editable: false,
        valueType: 'switch',
        valueEnum: {
          false: '否',
          true: '是',
        },
      },
    ],
  },
};
