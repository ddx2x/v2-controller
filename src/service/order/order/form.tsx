import { FormProps } from '@/dynamic-components';
import { orderApi } from '@/service/api';
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
    let query = { update_type: 2 };

    let data = {
      express_id: values.delivery_id,
      delivery_id: '',
      delivery_type: Number(values.delivery_type),
      sku_list: values.merchandiseTable.selectedRows.map((row: any) => {
        return {
          sku_id: row.uid,
          quantity: row.number2,
        };
      }),
    };
    // @ts-ignore
    orderApi
      .update({ data: data, delivery_type: values.delivery_type }, dataObject.uid, query)
      .then((res) => {
        console.log(res);
      });
    return true;
  },
};
