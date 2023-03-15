import { FormColumnsType, FormProps } from '@/dynamic-components';
import { pageManager } from '@/dynamic-view';
import { customerStore, User, userStore } from '@/service/api';
import { notification } from 'antd';
import { history } from 'umi';

interface TreeSelect {
  title: string;
  value: string;
  phone: string;
  children: TreeSelect[];
}

const name: FormColumnsType = {
  title: '用户名称',
  dataIndex: 'name',
  valueType: 'select',
  tooltip: '必须选择来自客户',
  fieldProps: {
    showSearch: true,
  },
  formItemProps: {
    rules: [
      {
        required: true,
        message: '此项为必填项',
      },
    ],
  },
  request: async () => {
    try {
      const rs = await customerStore.api.list(undefined, {});
      let select: TreeSelect[] = [];
      rs.map((r) => {
        if (!r.name) return;
        select.push({
          title: r.uid,
          value: r.name,
          phone: r.phone || '',
          children: [],
        });
      });
      return select;
    } catch (e) {
      return [];
    }
  },
};

const phone_number: FormColumnsType = {
  title: '手机号',
  dataIndex: 'phone_number',
  valueType: 'text',
  fieldProps: {
    type: 'tel',
  },
  editable: false,
  hideInSearch: true,
  formItemProps: {
    rules: [
      {
        required: true,
        message: '此项为必填项',
      },
    ],
  },
};

const login_type: FormColumnsType = {
  title: '登陆方式',
  dataIndex: 'login_type',
  valueType: 'select',
  editable: false,
  hideInSearch: true,
  valueEnum: {
    1: { text: '手机', icon: 'processing' },
    2: { text: '帐号', icon: 'processing' },
    3: { text: '手机+帐号', icon: 'processing' },
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
  // layout: 'horizontal',
  // colProps: { flex: 'auto' },
  columns: [name, login_type, phone_number],
  onSubmit: ({ formRef, values, dataObject, handleClose }) => {
    const target: Partial<User> = {
      name: values.name,
      login_type: Number(values.login_type),
      phone_number: values.phone_number,
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
