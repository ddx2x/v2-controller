import { FormColumnsType, FormProps } from '@/dynamic-components';

const roleTree: FormColumnsType = {
  title: '权限',
  dataIndex: 'roleTree',
  valueType: 'treeSelect',
  editable: false,
  hideInSearch: true,
  formItemProps: {
    rules: [
      {
        required: true,
        message: '此项为必填项',
      },
      //   {
      //     type: 'string',
      //     pattern: /^1[3456789]\d{9}$/,
      //     message: '请输入正确的手机号码',
      //   },
      //   {
      //     validator: (rule, value, callback) => {
      //       if (!value || value.length != 11) {
      //         callback();
      //         return;
      //       }
      //       userStore.api
      //         .list(value, {}, 'phone_number')
      //         .then((res: User[]) =>
      //           res.length > 0 && res.find((item) => item.phone_number === value)
      //             ? callback('手机号已被注册')
      //             : callback(),
      //         )
      //         .catch((e) => callback('error' + e));
      //     },
      //   },
    ],
  },
};

export const grantForm: FormProps = {
  layoutType: 'ModalForm',
  triggerText: '授权',
  title: '授权',
  style: { width: '100%' },
  columns: [roleTree],

  onMount: async ({ form, setDataObject, location }) => {},
  onSubmit({ formRef, values, dataObject, handleClose }) {
    //   let query = {
    //     update_type:
    //       2
    //   }

    //   let data = {
    //     express_id: values.delivery_id,
    //     delivery_id: "",
    //     delivery_type: Number(values.delivery_type),
    //     sku_list: values.merchandiseTable.selectedRows.map((row: any) => {
    //       return {
    //         sku_id: row.uid,
    //         quantity: row.number2,
    //       }
    //     })
    //   }
    //   // console.log('onSubmit.....', data);

    //   // @ts-ignore
    //   orderApi.update({ data: data, delivery_type: values.delivery_type }, dataObject.uid, query).then((res) => {
    //     console.log(res);
    //   })
    return true;
  },
};
