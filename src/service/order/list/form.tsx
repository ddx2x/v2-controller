import { FormProps } from '@/dynamic-components';
import { deliveryInfo, merchandiseTable, orderId, orderTime } from './columns';

export const shipForm: FormProps = {
  layoutType: 'ModalForm',
  triggerText: '发货',
  title: '发货',
  style: { width: '100%' },
  columns: [
    merchandiseTable,
    orderId,
    orderTime,
    deliveryInfo,
  ],
  onSubmit({ formRef, values, handleClose }) {
    console.log('values', values);
    return true
  },
}
