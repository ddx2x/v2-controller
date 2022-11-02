import {
  BetaSchemaForm,
  FooterToolbar,
  ProProvider,
  ProRenderFieldPropsType,
  SubmitterProps,
} from '@ant-design/pro-components';
import { Button, Form as AntdForm, FormInstance } from 'antd';
import { ButtonType } from 'antd/lib/button';
import React, { useContext } from 'react';
import { IntlShape } from 'react-intl';
import { CustomColumns, customsValueTypeMap } from './customs';
import { Columns, waitTime } from './tools';

export interface FormProps {
  initialValue?: any;
  title?: string;
  modal?: 'ModalForm' | 'DrawerForm' | 'Form';
  trigger?: string | React.ReactNode;
  triggerButtonType?: ButtonType;
  submitter?: SubmitterProps;
  submitTimeout?: number; // 提交数据时，禁用取消按钮的超时时间（毫秒）。
  columns?: Columns | CustomColumns;
  onFinish?: (form: FormInstance<any> | undefined, values: any) => boolean;
  intl?: IntlShape; // 国际化
  proProviderValueTypeMap?: Record<string, ProRenderFieldPropsType>;
}

export const Form: React.FC<FormProps> = (props) => {
  const [form] = AntdForm.useForm();
  const proProviderValues = useContext(ProProvider);

  const {
    modal,
    columns,
    trigger,
    triggerButtonType,
    submitTimeout,
    onFinish,
    proProviderValueTypeMap,
    ...rest
  } = props;

  const triggerDom = (): any => {
    if (trigger instanceof Object) {
      return trigger;
    }
    return <Button type={triggerButtonType}>{trigger}</Button>;
  };

  const stepsFormRender = (dom: any, submitter: any) => {
    return (
      <>
        {dom}
        <FooterToolbar>{submitter}</FooterToolbar>
      </>
    );
  };

  if (modal == 'Form') {
    rest['stepsFormRender'] = stepsFormRender;
  }

  return (
    <ProProvider.Provider
      value={{
        ...proProviderValues,
        valueTypeMap: { ...customsValueTypeMap, ...proProviderValueTypeMap },
      }}
    >
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
    </ProProvider.Provider>
  );
};

Form.defaultProps = {
  title: '新建表单',
  modal: 'ModalForm',
  trigger: '新增',
  triggerButtonType: 'link',
  submitter: {
    searchConfig: {
      submitText: '确认',
      resetText: '取消',
    },
  },
  submitTimeout: 2000,
  columns: null,
  proProviderValueTypeMap: {},
};

export default Form;

export const useForm = (props: FormProps): [any, {}] => {
  return [<Form {...props} />, {}];
};
