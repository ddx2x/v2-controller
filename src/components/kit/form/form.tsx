import {
  BetaSchemaForm,
  ProFormColumnsType,
  StepFormProps,
  SubmitterProps,
} from '@ant-design/pro-components';
import { Button, Form as AntdForm, FormInstance } from 'antd';
import { ButtonType } from 'antd/lib/button';
import React from 'react';
import { waitTime } from './tools';

type Columns =
  | ProFormColumnsType<any, 'text'>[]
  | ProFormColumnsType<any, 'text'>[][]
  | null
  | undefined;

interface FormProps {
  initialValue?: any;
  title?: string;
  modal?: 'ModalForm' | 'DrawerForm' | 'Form' | 'StepForm' | 'StepsForm';
  steps?: StepFormProps[];
  trigger?: string | React.ReactNode;
  submitter?: SubmitterProps;
  submitterButtonType?: ButtonType;
  submitTimeout?: number; // 提交数据时，禁用取消按钮的超时时间（毫秒）。
  columns?: Columns;
  onFinish?: (form: FormInstance<any> | undefined, values: any) => boolean;
}

export interface FormConfig extends FormProps {}

export const Form: React.FC<FormProps> = (props) => {
  const [form] = AntdForm.useForm();
  const { modal, columns, trigger, submitterButtonType, submitTimeout, onFinish, ...rest } = props;

  const triggerDom = (): any => {
    if (trigger instanceof Object) {
      return trigger;
    }
    return <Button type={submitterButtonType}>{trigger}</Button>;
  };

  return (
    <BetaSchemaForm
      form={form}
      layoutType={modal}
      trigger={triggerDom()}
      autoFocusFirstInput
      drawerProps={{
        destroyOnClose: true,
      }}
      // @ts-ignore
      columns={columns}
      onFinish={async (values) => {
        if (!onFinish) return false;
        await waitTime(submitTimeout);
        return onFinish(form, values);
      }}
      {...rest}
    />
  );
};

Form.defaultProps = {
  title: '新建表单',
  modal: 'ModalForm',
  trigger: '新增',
  submitter: {
    searchConfig: {
      submitText: '确认',
      resetText: '取消',
    },
  },
  submitterButtonType: 'link',
  submitTimeout: 2000,
  columns: null,
};

export default Form;

export const useForm = (props: FormConfig): [any, {}] => {
  return [<Form {...props} />, {}];
};
