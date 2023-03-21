import { FormColumnsType } from '@/dynamic-components';

export const input_type: FormColumnsType = {
  dataIndex: 'input_type',
  title: '录入方式',
  valueType: 'radio',
  initialValue: '0',
  formItemProps: {
    rules: [
      {
        required: true,
        message: '此项为必填项',
      },
    ],
  },
  valueEnum: {
    0: '手工录入',
    1: '手工录入+从列表中选取',
  },
};

export const input_select_list_dependency: FormColumnsType = {
  valueType: 'dependency',
  name: ['input_type'],
  columns: ({ input_type }) => {
    return input_type === '1' ? [input_select_list] : [];
  },
};

const input_select_list: FormColumnsType = {
  dataIndex: 'input_select_list',
  title: '可选值列表',
  valueType: 'select',
  fieldProps: {
    mode: 'tags',
  },
  formItemProps: {
    rules: [
      {
        required: true,
        message: '此项为必填项',
      },
      {
        pattern: /^[^\u007c]+$/u,
        message: '规格值中不可以包含“|”字符',
      },
    ],
  },
};
