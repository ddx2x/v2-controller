import { FormColumnsType, FormProps } from '@/dynamic-components';
import { DataNode } from 'antd/es/tree';

const treeData: DataNode[] = [
  {
    title: '0-0',
    key: '0-0',
    children: [
      {
        title: '0-0-0',
        key: '0-0-0',
        children: [
          { title: '0-0-0-0', key: '0-0-0-0' },
          { title: '0-0-0-1', key: '0-0-0-1' },
          { title: '0-0-0-2', key: '0-0-0-2' },
        ],
      },
      {
        title: '0-0-1',
        key: '0-0-1',
        children: [
          { title: '0-0-1-0', key: '0-0-1-0' },
          { title: '0-0-1-1', key: '0-0-1-1' },
          { title: '0-0-1-2', key: '0-0-1-2' },
        ],
      },
      {
        title: '0-0-2',
        key: '0-0-2',
      },
    ],
  },
  {
    title: '0-1',
    key: '0-1',
    children: [
      { title: '0-1-0-0', key: '0-1-0-0' },
      { title: '0-1-0-1', key: '0-1-0-1' },
      { title: '0-1-0-2', key: '0-1-0-2' },
    ],
  },
  {
    title: '0-2',
    key: '0-2',
  },
];

const roleTree: FormColumnsType = {
  title: '',
  dataIndex: 'roleTree',
  valueType: 'checkboxsTabs',
  editable: false,
  hideInSearch: true,
  // initialValue: [['0-0-0', '0-0-1'], []],
  fieldProps: {
    initNode: async () => {
      return await [
        { tabTitle: '新建商家权限 1', valueType: 'collapse', dataNode: treeData },
        { tabTitle: '新建商家权限 2', valueType: 'tree', dataNode: treeData }
      ]
    }
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

export const grantForm: FormProps = {
  layoutType: 'ModalForm',
  triggerText: '授权',
  title: '授权',
  style: { width: '100%' },
  columns: [roleTree],
  onMount: async ({ form, setDataObject, location }) => { },
  onSubmit({ formRef, values, dataObject, handleClose }) {
    console.log('grantForm values', values);

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
    return false;
  },
};
