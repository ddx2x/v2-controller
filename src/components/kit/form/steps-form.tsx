import { BetaSchemaForm, SubmitterProps } from '@ant-design/pro-components';
import { Form as AntdForm, FormInstance } from 'antd';
import { ButtonType } from 'antd/lib/button';
import React from 'react';
import { Columns, waitTime } from './tools';

export interface StepsFormConfig {
  initialValue?: any;
  title?: string;
  modal: 'Modal' | 'Drawer' | 'Form';
  layoutType?: 'StepForm' | 'StepsForm';
  trigger?: string | React.ReactNode;
  submitter?: SubmitterProps;
  submitterButtonType?: ButtonType;
  submitTimeout?: number; // 提交数据时，禁用取消按钮的超时时间（毫秒）。
  columns?: Columns;
  onFinish?: (form: FormInstance<any> | undefined, values: any) => boolean;
}

export const StepsForm: React.FC<StepsFormConfig> = (props) => {
  const [form] = AntdForm.useForm();

  const {
    modal,
    layoutType,
    columns,
    trigger,
    submitterButtonType,
    submitTimeout,
    onFinish,
    ...rest
  } = props;

  const stepsForm = () => (
    <BetaSchemaForm
      form={form}
      layoutType={layoutType}
      autoFocusFirstInput
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

  return stepsForm();
};

StepsForm.defaultProps = {
  title: '新建表单',
  modal: 'Form',
  layoutType: 'StepForm',
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

export default StepsForm;

export const useStepsForm = (props: StepsFormConfig): [any, {}] => {
  return [<StepsForm {...props} />, {}];
};
