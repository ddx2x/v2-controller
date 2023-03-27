import { StoreTableProps } from '@/dynamic-components';
import { pageManager } from '@/dynamic-view';
import { cmsDoorStore2, Role, roleStore } from '@/service/api';
import { unixtime2dateformat } from '@/service/common';
import { ProFormInstance } from '@ant-design/pro-components';
import { history } from '@umijs/max';
import { notification } from 'antd';
import { merge } from 'lodash';
import { Dispatch, ReactNode } from 'react';
import { User, userStore } from '../../api/privilegeUser.store';
import { transfer } from './grant';

interface TransferItem {
  key: string;
  title: string;
  description: string;
}

const table: StoreTableProps = {
  toolbarTitle: '数据列表',
  rowKey: 'uid',
  store: userStore,
  // search: false,
  size: 'small',
  treeStore: cmsDoorStore2,
  useSiderTree: true,
  treeCard: { title: '组织架构' },
  columns: [
    {
      dataIndex: 'uid',
      title: '帐号',
      hideInSearch: true,

      fixed: 'left',
      width: 120,
      editable: false,
    },
    {
      dataIndex: 'name',
      title: '名称',
      tooltip: '支持全文索引',
      valueType: 'autoComplete',
      editable: false,
      fieldProps: {
        onSearch: async (text: string) => {
          return Array.from(
            new Set((await userStore.api.list(text, {}, 'name')).map((rs) => rs.name)),
          ).map((v) => {
            return { value: v };
          });
        },
      },
    },
    {
      dataIndex: 'is_lock',
      title: '锁定',
      hideInSearch: true,
      valueType: 'switch',
      valueEnum: {
        0: '停用',
        1: '启用',
      },
      // formItemProps: (form, config) => {
      //   // console.log('form, config', form, config);
      //   return {
      //     rules: [
      //       {
      //         validator(rule, value, callback) {
      //           callback('xxxx')
      //           form.resetFields()
      //         },
      //       }
      //     ]
      //   }
      // }
    },
    {
      dataIndex: 'phone_number',
      title: '手机号',
      tooltip: '支持全文索引',
      valueType: 'autoComplete',
      editable: false,
      fieldProps: {
        onSearch: async (text: string) => {
          return Array.from(
            new Set(
              (await userStore.api.list(text, {}, 'phone_number')).map((rs) => rs.phone_number),
            ),
          ).map((v) => {
            return { value: v };
          });
        },
      },
    },
    {
      dataIndex: 'login_type',
      title: '登陆类型',
      valueType: 'select',
      editable: false,
      hideInSearch: true,
      initialValue: '3',
      valueEnum: {
        1: { text: '手机', icon: 'processing' },
        2: { text: '帐号', icon: 'processing' },
        3: { text: '手机+帐号', icon: 'processing' },
      },
    },
    {
      dataIndex: 'roles',
      title: '角色',
      hideInSearch: true,
      editable: false,
      valueType: 'text',
    },
    {
      dataIndex: 'last_login_time',
      title: '最后登陆',
      hideInSearch: true,
      editable: false,
      valueType: 'date',
      render: (text: ReactNode, record: User, index: number, action: any) => {
        return [
          <>
            {record.last_login_time === 0 ? '-' : unixtime2dateformat(record.last_login_time || 0)}
          </>,
        ];
      },
    },
  ],
  editableValuesChange: (record: User, errors, editorFormRef) => {
    if (errors) {
      const src = userStore.items.find((item) => item.getUid() === record.uid);
      const update: Partial<User> = record;

      if (!src) return;
      if (src?.is_lock !== update.is_lock) {
        if (update.is_lock) {
          update.is_lock = true;
        } else {
          update.is_lock = false;
        }
        userStore
          .update_one(src, update, ['is_lock'])
          .then(() => {
            notification.success({ message: '更新成功' });
            history.push(`/privilege/user`);
          })
          .catch((e) => {
            notification.error({ message: '更新失败:' + e });
          });
      }
      return;
    }

    const src = userStore.items.find((item) => item.getUid() === record.uid);
    const update: Partial<User> = record;
    if (!src) return;
    if (src?.is_lock !== update.is_lock) {
      userStore
        .update_one(src, update, ['is_lock'])
        .then(() => notification.success({ message: '更新成功' }))
        .catch((e) => {
          notification.error({ message: '更新失败:' + e });
        });
    }
  },
  toolBarMenu: (selectedRows: any) => [
    {
      kind: 'link',
      title: '新增',
      link: `/privilege/user/add`,
    },
  ],
  tableMenu: (record: User, action: any) => [
    {
      kind: 'link',
      title: '编辑  ',
      link: `/privilege/user/edit?id=${record.uid}`,
    },
    {
      kind: 'form',
      title: '关联角色',
      layoutType: 'ModalForm',
      triggerText: '关联角色',
      style: { width: '100%' },
      columns: [transfer],
      submitter: {
        // resetButtonProps: false,
        searchConfig: {
          submitText: '保存',
          resetText: '取消',
        },
      },
      fieldProps: {
        initDataSource: async () => {
          const data = await roleStore.api.list(undefined);
          const roleDesc = { '0': '平台岗位', '1': '门店岗位', '2': '供应商岗位', '3': '区域岗位' };
          return data.map((item: Role) => {
            return {
              key: item.uid,
              title: item.name,
              description: item.type ? roleDesc[item.type] : '未知岗位',
            };
          });
        },
        onRender: (item: any) => `${item.title} - ${item.description}`,
      },
      onMount: ({ form }) => {
        form.setFieldsValue({
          transfer: [],
        });
      },
      onSubmit({ formRef, values, dataObject, handleClose }) {
        console.log('grantForm values', values);

        return false;
      },
    },
    {
      kind: 'confirm',
      title: '删除',
      onClick: () => {
        userStore
          .remove(record.uid)
          .then(() => {
            notification.info({ message: '删除成功' });
          })
          .catch((e) => {
            notification.error(e);
          });
      },
      text: `确认删除` + record.name,
    },
  ],
  onRowEvent: [
    {
      mouseEvent: 'onDoubleClick',
      title: '详情',
    },
  ],
  useBatchDelete: true,
  batchDelete: (selectedRows) => console.log('batchDelete', selectedRows),
  onRequest: ({ query }) => {
    const { filter } = query; // treeNode,
    const { treeNode } = filter;

    if (treeNode) {
      delete query['filter']['treeNode'];
      query = merge(query, { filter: { org_name: treeNode.title } });
    }

    userStore.next(merge(query, { sort: { version: 1 } }));
  },
};

pageManager.register('privilege.user', {
  page: {
    view: [{ kind: 'storeTable', ...table }],
    container: {
      keepAlive: false,
    },
  },
  stores: [
    {
      store: userStore,
      exit: userStore.reset,
    },
    {
      store: cmsDoorStore2,
      load: cmsDoorStore2.next,
      exit: cmsDoorStore2.reset,
    },
  ],
});
function grantFormOnMount(
  record: User,
  form: ProFormInstance<any>,
  setDataObject: Dispatch<any>,
): void | PromiseLike<void> {
  throw new Error('Function not implemented.');
}
