import { FormOnSumbit, StoreTableProps } from '@/dynamic-components';
import { MenuButtonType } from '@/dynamic-components/table/menuButton';
import { pageManager } from '@/dynamic-view';
import { AfterSaleOrder, afterSaleorderApi, AfterSaleOrderStateValueEnum, afterSaleOrderStore, AfterSaleOrderTypeValueEnum } from '@/service/api';
import { merge } from 'lodash';
import { rejectForm } from './form';

const rejectFormOnSubmit = (action: any, { formRef, values, dataObject, handleClose }: FormOnSumbit) => {
  let query = {
    update_type:
      1
  }
  console.log(values);
  // @ts-ignore
  afterSaleorderApi.update({ title: values.title, spec: values.spec }, dataObject.uid, query).then((res) => {
    action?.reload()
  })
  return true
}

const afterSaleOrderStoreTable: StoreTableProps = {
  rowKey: 'uid',
  store: afterSaleOrderStore,
  search: false,
  size: 'small',
  columns: [
    {
      dataIndex: 'merchandise_list',
      title: '商品信息',
      hideInSearch: true,
      valueType: 'merchandiseList',
      editable: false,
      width: 300,
      fixed: 'left',
    },
    {
      dataIndex: 'uid',
      title: '订单编号',
      fixed: 'left',
      editable: false,
    },
    {
      dataIndex: 'total_render',
      title: '应退金额',
      valueType: 'money',
      editable: false,
    },
    {
      dataIndex: 'customer',
      title: '客户信息',
      editable: false,
    },
    {
      dataIndex: 'typ',
      title: '售后类型',
      valueType: 'select',
      editable: false,
      valueEnum: AfterSaleOrderTypeValueEnum
    },
    {
      dataIndex: 'state',
      title: '售后状态',
      valueType: 'select',
      editable: false,
      valueEnum: AfterSaleOrderStateValueEnum
    },
  ],

  toolbarTitle: '订单列表',
  tableMenu: (record: AfterSaleOrder, action) => {
    let columns: MenuButtonType[] = [
      {
        kind: 'link',
        title: '详情',
        link: `/order/after-sale-order/detail?uid=${record.uid}`,
      },
    ]
    if (record.state == 1) {
      columns.push(
        {
          kind: 'implement',
          collapse: true,

          title: '通过',
          onClick(e) {
            let query = {
              update_type: 2
            }
            // @ts-ignore
            afterSaleorderApi.update({}, record.uid, query).then(() => {
              action?.reload()
            })
          },
        },
        {
          kind: 'form',
          title: '拒绝',
          collapse: true,
          onMount: async ({ form, setDataObject, }) => {
            setDataObject(record)
          },
          onSubmit(params) {
            return rejectFormOnSubmit(action, params)
          },
          ...rejectForm,
        },
      )
    }
    return columns
  },
  onRequest: ({ query }) =>
    afterSaleOrderStore.next(merge(query, { sort: { version: 1 } }))
};

pageManager.register('order.after-sale-order', {
  page: {
    view: [{ kind: 'storeTable', ...afterSaleOrderStoreTable }],
    container: {
      keepAlive: false,
    },
  },
  stores: [
    {
      store: afterSaleOrderStore,
      exit: afterSaleOrderStore.reset
    }
  ],
});
