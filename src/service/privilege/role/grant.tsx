import { FormColumnsType } from '@/dynamic-components';

export const roleTree: FormColumnsType = {
  title: '',
  dataIndex: 'roleTree',
  valueType: 'checkboxsTabs',
  editable: false,
  hideInSearch: true,
  dependencies: ['role'],
  formItemProps: {
    rules: [
      {
        required: true,
        message: '此项为必填项',
      },
    ],
  },
};
