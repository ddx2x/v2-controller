import { FormProps } from '@/dynamic-components';


export const rejectForm: FormProps = {
  layoutType: 'ModalForm',
  triggerText: '拒绝',
  title: '拒绝',
  columns: [
    {
      dataIndex: 'title',
      title: '标题',
      initialValue: '拒绝'
    },
    {
      dataIndex: 'spec',
      valueType: 'textarea',
      title: '原因',
    }
  ],
}
