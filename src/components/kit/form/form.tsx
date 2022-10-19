import { BetaSchemaForm, ProFormColumnsType, SubmitterProps } from '@ant-design/pro-components';
import { Button, Form as AntdForm, FormInstance } from 'antd';
import React from 'react';
import { waitTime } from './tools';

type Columns =
  | ProFormColumnsType<any, 'text'>[]
  | ProFormColumnsType<any, 'text'>[][]
  | null
  | undefined;

interface FormProps {
  form?: FormInstance<any> | undefined;
  initialValue?: any;
  title?: string;
  modal?: 'ModalForm' | 'DrawerForm' | 'Form' | 'StepForm' | 'StepsForm';
  trigger?: string | React.ReactNode;
  submitter?: SubmitterProps;
  submitTimeout?: number; // 提交数据时，禁用取消按钮的超时时间（毫秒）。
  columns?: Columns;
  onFinish?: (form: FormInstance<any> | undefined, values: any) => boolean;
}

export const Form: React.FC<FormProps> = (props) => {
  const trigger = (): any => {
    if (props.trigger instanceof Object) {
      return props.trigger;
    }
    return <Button type="primary">{props.trigger}</Button>;
  };

  return (
    <BetaSchemaForm
      form={props.form}
      initialValue={props.initialValue}
      title={props.title}
      layoutType={props.modal}
      trigger={trigger()}
      submitter={props.submitter}
      autoFocusFirstInput
      drawerProps={{
        destroyOnClose: true,
      }}
      submitTimeout={props.submitTimeout}
      // @ts-ignore
      columns={props.columns}
      onFinish={async (values) => {
        console.log(values);
        if (!props.onFinish) return false;
        await waitTime(props.submitTimeout);
        return props.onFinish(props.form, values);
      }}
    />
  );
};

Form.defaultProps = {
  form: undefined,
  title: '新建表单',
  modal: 'ModalForm',
  trigger: '新增',
  submitter: {
    searchConfig: {
      submitText: '确认',
      resetText: '取消',
    },
  },
  submitTimeout: 2000,
  columns: null,
};

export const useForm = (props: FormProps): [any, { form: FormInstance<any> | undefined }] => {
  const [form] = AntdForm.useForm();
  return [<Form form={form} {...props} />, { form }];
};
