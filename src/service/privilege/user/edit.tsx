import { FormProps } from '@/dynamic-components';
import { pageManager } from '@/dynamic-view';
import { User, userStore } from '@/service/api';
import { history } from '@umijs/max';
import { notification } from 'antd';
import { merge } from 'lodash';
import { parse } from 'querystring';
import { login_type, name, org_name, phone_number } from './columns';

const editForm: FormProps = {
  submitter: {
    resetButtonProps: false,
  },
  onMount: ({ location, form, setDataObject }) => {
    form?.resetFields();
    if (location === undefined) return;
    const query: any = parse(location?.search.split('?')[1] || '');
    userStore.api
      .get(query.id)
      .then((rs: User) => {
        setDataObject(rs);
        form?.setFieldsValue(rs);
      })
      .catch((e) => notification.error({ message: e }));
  },
  layoutType: 'Form',
  shouldUpdate: false,
  columns: [
    merge(name, { fieldProps: { disabled: true } }),
    login_type,
    merge(phone_number, { fieldProps: { disabled: true } }),
    org_name,
  ],
  onSubmit: ({ values, dataObject, handleClose }) => {
    let target: Partial<User> = {
      ...values,
    };

    target.org_name = values.org_name;
    target.login_type = values.login_type;

    userStore
      .update_one(dataObject, target, ['org_name', 'login_type'])
      .then(() => {
        notification.success({ message: '保存成功' });
        history.push(`/privilege/user`);
      })
      .catch((e) => notification.error(e));

    handleClose();
    return true;
  },
};

pageManager.register('privilege.user.edit', {
  page: {
    view: [{ kind: 'form', ...editForm }],
    container: {
      keepAlive: false,
    },
  },
  stores: [],
});
