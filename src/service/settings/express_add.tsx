import { FormColumnsType, FormProps } from '@/dynamic-components';
import { pageManager } from '@/dynamic-view';
import { history } from '@umijs/max';
import { notification } from 'antd';
import { ExpressCompany, expressCompanyStore } from '../api';

const name: FormColumnsType = {
  title: '快递公司名称',
  dataIndex: 'name',
  valueType: 'text',
  fieldProps: {
    placeholder: '请输模板名称',
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

const ename: FormColumnsType = {
  title: '简写',
  dataIndex: 'ename',
  valueType: 'text',
  fieldProps: {},
  formItemProps: {
    rules: [
      {
        required: true,
        message: '此项为必填项',
      },
    ],
  },
};

const service_number: FormColumnsType = {
  dataIndex: 'service_number',
  title: '服务电话',
  valueType: 'text',
  formItemProps: {
    rules: [
      {
        // required: true,
        // message: '此项为必填项',
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
  columns: [name, ename, service_number],
  onSubmit: ({ formRef, values, dataObject, handleClose }) => {
    const target: Partial<ExpressCompany> = {
      name: values.name,
      ename: values.ename,
      service_number: values.service_number,
    };

    expressCompanyStore
      .create(target)
      .then(() => {
        notification.success({ message: '保存成功' });
        history.push(`/setting/delivery`);
        formRef.current?.resetFields();
      })
      .catch((e) => {
        notification.error({ message: e });
      });

    handleClose();
    return true;
  },
};

pageManager.register('setting.delivery.expresscompanyadd', {
  page: {
    view: [{ kind: 'form', ...addForm }],
    container: {
      keepAlive: false,
    },
  },
  stores: [],
});
