import { StoreTableProps } from '@/dynamic-components';
import { pageManager } from '@/dynamic-view';
import { Modal, notification } from 'antd';
import { merge } from 'lodash';
import { Customer, customerStore } from '../api/customer.store';
import { detail } from './detail';

const defaultStoreTable: StoreTableProps = {
  toolbarTitle: '数据列表',
  store: customerStore,
  rowKey: 'uid',
  search: false,
  defaultPageSize: 10,
  columns: [
    {
      dataIndex: 'uid',
      hideInSearch: true,
      hideInTable: true,
    },
    {
      dataIndex: 'name',
      title: '客户信息',
      hideInSearch: true,
      editable: false,
      fixed: 'left',
      width: 100,
    },
    {
      dataIndex: 'phone',
      title: '手机号',
      hideInSearch: true,
      editable: false,
      fixed: 'left',
      width: 120
    },
    {
      dataIndex: 'icon',
      title: '头像',
      valueType: 'imageUpload',
      hideInSearch: true,
      editable: false,
    },
    {
      dataIndex: 'become_time',
      title: '成为客户时间',
      hideInSearch: true,
      editable: false,
    },
    {
      dataIndex: 'become_member_time',
      title: '成为会员时间',
      hideInSearch: true,
      editable: false,
    },
    {
      dataIndex: 'bind_up_level',
      title: '绑定的推荐人',
      hideInSearch: true,
      editable: false,
    },

    {
      dataIndex: 'bind_up_level_time',
      title: '绑定推荐人时间',
      hideInSearch: true,
      editable: false,
    },
    {
      dataIndex: 'is_member',
      title: '是否会员',
      hideInSearch: true,
      editable: false,
    },

    {
      dataIndex: 'integral',
      title: '积分',
      hideInSearch: true,
      editable: false,
    },

    {
      dataIndex: 'accumulated_integral',
      title: '累计积分',
      hideInSearch: true,
      editable: false,
    },

    {
      dataIndex: 'amount_of_consumption',
      title: '消费金额',
      hideInSearch: true,
      editable: false,
    },
    {
      dataIndex: 'consumption_times',
      title: '消费次数',
      hideInSearch: true,
      editable: false,
    },
    {
      dataIndex: 'last_consumption_time',
      title: '最后消费时间',
      hideInSearch: true,
      editable: false,
    },
    {
      dataIndex: 'after_sales_amount',
      title: '售后金额',
      hideInSearch: true,
      editable: false,
    },
    {
      dataIndex: 'after_sales_times',
      title: '售后次数',
      hideInSearch: true,
      editable: false,
    },
    {
      dataIndex: 'freeze',
      title: '是否冻结',
      valueType: 'select',
      valueEnum: {
        false: '否',
        true: '是',
      },
      hideInSearch: true,
      editable: false,
    }
  ],
  editableValuesChange: (record: any) => { console.log(record) },
  toolBarMenu: (selectedRows: any) => [
    // {
    //   kind: 'link',
    //   title: '新增',
    //   link: `/product/category/add`,
    // },
  ],
  tableMenu: (record: Customer, action: any) => [
    {
      kind: 'implement',
      title: record.freeze ? '解冻结' : '冻结',
      onClick: (e) => {
        Modal.confirm({
          title: record.freeze ? '解冻结' : '冻结',
          content: record.freeze ? '解冻结后可以使用积分、余额' : '冻结后将无法使用积分、余额',
          onOk: () => {
            customerStore.
              update_one(record, { freeze: !record.freeze }, ["freeze"]).
              then((r) => {
                notification.info({ message: r.freeze ? "冻结成功" : "解冻结成功" });
              }).
              catch((e) => {
                notification.error(e);
              });
          },
          onCancel: () => { }
        });
      },
    },
    {
      kind: 'descriptions',
      title: '详情',
      collapse: true,
      request: async (params) => {
        return await customerStore.api.get(record.uid).then(rs => { return { data: rs, success: true } })
      },
      ...detail
    },
  ],
  onRowEvent: [
    {
      mouseEvent: 'onDoubleClick',
      title: '详情',
    },
  ],
  batchDelete: (selectedRows: any) => console.log('batchDelete', selectedRows),
  onRequest: ({ query }) =>
    customerStore.next(merge(query, { filter: { level: 1 }, sort: { version: 1 } }))
};


pageManager.register('ums.customer', {
  page: {
    view: [{ kind: 'storeTable', ...defaultStoreTable }],
    container: {
      keepAlive: false
    }
  },
  stores: [
    {
      store: customerStore,
      exit: customerStore.reset,
    },
  ],
});
