import { FormColumnsType } from '@/dynamic-components';

export const name_column: FormColumnsType = {
  title: '操作名称',
  dataIndex: 'name',
  valueType: 'text',
  fieldProps: {
    placeholder: '请输入操作名称',
  },
  formItemProps: {
    rules: [
      {
        required: true,
        message: '此项为必填项',
      },
    ],
  },
};

export const op: FormColumnsType = {
  title: '操作类型',
  dataIndex: 'op',
  valueType: 'select',
  formItemProps: {
    rules: [
      {
        required: true,
        message: '此项为必填项',
      },
    ],
  },
  valueEnum: {
    2: '相减',
    3: '相乘',
    4: '相除',
  },
};

export const value: FormColumnsType = {
  title: '操作对应值',
  dataIndex: 'value',
  valueType: 'digit',
  formItemProps: {
    rules: [
      {
        required: true,
        message: '此项为必填项',
      },
    ],
  },
};
