import { FormProps } from '@/dynamic-components';
import { pageManager } from '@/dynamic-view';
import { notification } from 'antd';
import { cloneDeep } from 'lodash';
import { history } from 'umi';
import { User, userStore } from '../../../service/api';
import { login_type, name, org_name, phone_number } from './columns';

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
  columns: [
    cloneDeep(name),
    //
    login_type,
    cloneDeep(phone_number),
    org_name,
  ],
  onSubmit: ({ formRef, values, dataObject, handleClose }) => {
    const target: Partial<User> = {
      name: values.name,
      login_type: Number(values.login_type),
      phone_number: values.phone_number,
      org_name: values.org_name,
      is_lock: true,
    };

    userStore
      .create(target)
      .then(() => {
        notification.success({ message: '保存成功' });
        history.push(`/privilege/user`);
        formRef.current?.resetFields();
      })
      .catch((e) => {
        notification.error({ message: e });
      });

    handleClose();
    return true;
  },
};

pageManager.register('privilege.user.add', {
  page: {
    view: [{ kind: 'form', ...addForm }],
    container: {
      keepAlive: false,
    },
  },
  stores: [],
});
