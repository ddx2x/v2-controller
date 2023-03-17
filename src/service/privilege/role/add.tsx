import { FormProps } from '@/dynamic-components';
import { pageManager } from '@/dynamic-view';
import { notification } from 'antd';
import { cloneDeep } from 'lodash';
import { history } from 'umi';
import { Role, roleStore } from '../../../service/api';
import { name, privileges, type } from './columns';

// kind: form
const addForm: FormProps = {
  submitter: {
    resetButtonProps: false,
  },
  onMount: ({ location, form }) => {
    form?.resetFields();
    if (location === undefined) return;
  },
  layoutType: 'Form',
  shouldUpdate: false,
  grid: true,
  columns: [cloneDeep(name), cloneDeep(type), cloneDeep(privileges)],
  onSubmit: ({ formRef, values, dataObject, handleClose }) => {
    const target: Partial<Role> = {
      name: values.name,
      type: Number(values.type),
    };

    roleStore
      .create(target)
      .then(() => {
        notification.success({ message: '保存成功' });
        history.push(`/privilege/role`);
        formRef.current?.resetFields();
      })
      .catch((e) => {
        notification.error({ message: e });
      });

    handleClose();
    return true;
  },
};

pageManager.register('privilege.role.add', {
  page: {
    view: [{ kind: 'form', ...addForm }],
    container: {
      keepAlive: false,
    },
  },
  stores: [],
});
