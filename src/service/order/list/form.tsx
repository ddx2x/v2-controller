import { FormProps } from '@/dynamic-components';
import { orderApi } from '@/service/api';
import { deliveryInfo, merchandiseTable, orderId, orderTime } from './columns';

export const shipForm: FormProps = {
  layoutType: 'ModalForm',
  triggerText: '发货',
  title: '发货',
  style: { width: '100%' },
  columns: [
    merchandiseTable,
    deliveryInfo,
  ],
  onSubmit({ formRef, values, dataObject, handleClose }) {
    console.log('values', values, dataObject);
    return false
  },
}
