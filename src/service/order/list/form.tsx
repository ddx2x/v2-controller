import { FormProps } from '@/dynamic-components';
import { orderApi } from '@/service/api';
import { deliveryInfo, merchandiseTable } from './columns';

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
    let query = {
      update_type:
        2
    }

    let data = []
    data.push({
      delivery_id: values.delivery_id,
      sku_list: values.merchandiseTable.selectedRows.map((row: any) => {
        return {
          sku_id: row.uid,
          quantity: row.number2
        }
      })
    })

    // @ts-ignore
    orderApi.update({ data: data }, dataObject.uid, query).then((res) => {
      console.log(res);
    })
    return true
  },
}
