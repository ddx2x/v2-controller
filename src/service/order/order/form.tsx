import { FormProps } from '@/dynamic-components';
import { Order, orderStore } from '@/service/api';
import { history } from '@umijs/max';
import { cloneDeep, merge } from 'lodash';
import { deliveryInfoDependency, deliveryType, merchandiseTable } from './columns';

export const shipForm: FormProps = {
  layoutType: 'ModalForm',
  triggerText: '发货',
  title: '发货',
  style: { width: '100%' },
  submitter: {
    searchConfig: {
      submitText: '发货',
      resetText: '取消',
    },
  },
  columns: [
    merchandiseTable,
    merge(cloneDeep(deliveryType), {
      fieldProps: {
        disabled: true,
      },
    }),
    deliveryInfoDependency,
  ],

  onSubmit({ formRef, values, dataObject, handleClose }) {
    let order: Order = dataObject;

    if (order.delivery_type === '1' || order.delivery_type === 1) {
      order.express_company = values.express_company;
      order.express_no = values.express_no;
    }

    orderStore.api.update(order, order.uid, {}, 'ship').then((res) => {
      history.push(`/order/order`);
      formRef.current?.resetFields();
      handleClose();
    });
    return true;
  },
};
