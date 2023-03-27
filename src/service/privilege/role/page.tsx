import { StoreTableProps } from '@/dynamic-components';
import { pageManager } from '@/dynamic-view';
import { notification } from 'antd';
import { DataNode } from 'antd/es/tree';
import { merge } from 'lodash';
import { Role, rolePrivilegeApi, roleStore } from '../../api/privilegeRole.store';
import { privilegeStore } from '../resource';
import { roleTree } from './grant';

const roleTypeDict = {
  0: '平台权限',
  1: '区域权限',
  2: '门店权限',
  3: '供应商权限',
};

interface TableTreeNode {
  tabTitle: string;
  valueType: string;
  dataNode: DataNode[];
}

const table: StoreTableProps = {
  toolbarTitle: '数据列表',
  rowKey: 'uid',
  store: roleStore,
  search: false,
  size: 'small',
  columns: [
    {
      dataIndex: 'uid',
      hideInTable: true,
      hideInSearch: true,
      editable: false,
    },
    {
      dataIndex: 'name',
      title: '岗位角色',
      fixed: 'left',
      hideInSearch: true,
      editable: false,
    },
    {
      dataIndex: 'type',
      title: '岗位类型',
      hideInSearch: true,
      editable: false,
      valueType: 'select',
      valueEnum: {
        0: '平台',
        1: '区域',
        2: '门店',
        3: '供应商',
      },
    },
    {
      dataIndex: 'use_count',
      title: '使用账号数量',
      hideInSearch: true,
      editable: false,
    },
  ],
  toolBarMenu: (selectedRows: any) => [
    {
      kind: 'link',
      title: '新增',
      link: `/privilege/role/add`,
    },
  ],
  tableMenu: (record: Role, action: any) => [
    {
      kind: 'descriptions',
      dataSource: record,
      title: '新增',
    },
    {
      kind: 'form',
      title: '授权管理',
      layoutType: 'ModalForm',
      triggerText: '授权管理',
      style: { width: '100%' },
      columns: [roleTree],
      submitter: {
        // resetButtonProps: false,
        searchConfig: {
          submitText: '保存',
          resetText: '取消',
        },
      },
      fieldProps: {
        initTreeNode: async () => {
          if (record.type === undefined) return [];
          const data = privilegeStore.privilegeTree();
          const data_set = [
            {
              tabTitle: roleTypeDict[0],
              valueType: 'collapse',
              dataNode: data,
              disabled: record.type !== 0,
            },
            {
              tabTitle: roleTypeDict[1],
              valueType: 'collapse',
              dataNode: data,
              disabled: record.type !== 1,
            },
            {
              tabTitle: roleTypeDict[2],
              valueType: 'collapse',
              dataNode: data,
              disabled: record.type !== 2,
            },
            {
              tabTitle: roleTypeDict[3],
              valueType: 'collapse',
              dataNode: data,
              disabled: record.type !== 3,
            },
          ];
          return data_set;
        },
        defaultActiveKey: String(record.type && Number(record.type) + 1),
      },
      onMount: ({ form }) => {
        form.resetFields();

        if (record.type === undefined) return;
        rolePrivilegeApi.list(record.uid).then((rs) => {
          const privileges = rs.map((item) => item.privilege_id);
          form.setFieldsValue({
            roleTree: {
              平台权限: record.type === 0 ? privileges : [],
              区域权限: record.type === 1 ? privileges : [],
              门店权限: record.type === 2 ? privileges : [],
              供应商权限: record.type === 3 ? privileges : [],
            },
          });
        });
      },
      onSubmit({ formRef, values, dataObject, handleClose }) {
        let target: Partial<Role> = record;
        // @ts-ignore
        const key = roleTypeDict[record.type];
        target.privileges = values.roleTree[key];
        roleStore
          .update_one(record, target, ['privileges'])
          .then((rs) => {
            notification.success({ message: '保存成功' });
          })
          .catch((e) => {
            notification.error({ message: '保存失败' });
          });
        formRef.current?.resetFields();
        return true;
      },
    },
    {
      kind: 'confirm',
      onClick: () => {
        roleStore
          .remove(record.uid)
          .then(() => {
            notification.info({ message: '删除成功' });
          })
          .catch((e) => {
            notification.error(e);
          });
      },
      title: '删除',
      text: `确认删除` + record.name,
    },
  ],
  onRowEvent: [
    {
      mouseEvent: 'onDoubleClick',
      title: '详情',
    },
  ],
  onRequest: ({ query }) => roleStore.next(merge(query, { sort: { version: 1 } })),
};

pageManager.register('privilege.role', {
  page: {
    view: [{ kind: 'storeTable', ...table }],
    container: {
      keepAlive: false,
    },
  },
  stores: [
    {
      store: roleStore,
      exit: roleStore.reset,
    },

    {
      store: privilegeStore,
      load: privilegeStore.load,
      // watch: privilegeStore.watch,
      exit: privilegeStore.reset,
    },
  ],
});
