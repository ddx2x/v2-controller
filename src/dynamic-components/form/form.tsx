import { BetaSchemaForm, ProProvider, ProRenderFieldPropsType } from '@ant-design/pro-components';
import { FormSchema } from '@ant-design/pro-form/es/components/SchemaForm';
import { Button, Form as AntdForm, FormInstance } from 'antd';
import { ButtonType } from 'antd/lib/button';
import React, { useContext } from 'react';
import { IntlShape } from 'react-intl';
import { customsValueTypeMap } from './customs';
import { waitTime } from './tools';
import { FormColumnsType } from './typing';

export type FormProps = FormSchema & {
  triggerText?: string;
  triggerButtonType?: ButtonType;
  layoutType?: 'ModalForm' | 'DrawerForm' | 'Form';
  columns: FormColumnsType | any;
  submitTimeout?: number; // 提交数据时，禁用取消按钮的超时时间（毫秒）。
  onSubmit?: (form: FormInstance<any> | undefined, values: any) => boolean;
  intl?: IntlShape; // 国际化
  proProviderValueTypeMap?: Record<string, ProRenderFieldPropsType>;
};

export const Form: React.FC<FormProps> = (props) => {
  const [form] = AntdForm.useForm();
  const proProviderValues = useContext(ProProvider);

  const {
    layoutType,
    triggerText,
    triggerButtonType,
    submitTimeout,
    onSubmit,
    proProviderValueTypeMap,
    intl,
    ...rest
  } = props;

  if (layoutType == 'Form') {
    rest['layoutType'] = layoutType;
  }
  if (layoutType == 'ModalForm') {
    rest['layoutType'] = layoutType;
    rest['modalProps'] = {
      destroyOnClose: true,
    };
  }
  if (layoutType == 'DrawerForm') {
    rest['layoutType'] = layoutType;
    rest['drawerProps'] = {
      destroyOnClose: true,
    };
  }

  return (
    <ProProvider.Provider
      value={{
        ...proProviderValues,
        valueTypeMap: { ...customsValueTypeMap, ...proProviderValueTypeMap },
      }}
    >
      <BetaSchemaForm
        // @ts-ignore
        form={form}
        // @ts-ignore
        trigger={<Button type={triggerButtonType}>{triggerText}</Button>}
        autoFocusFirstInput
        onFinish={async (values) => {
          if (!onSubmit) return false;
          const b = onSubmit(form, values);
          await waitTime(submitTimeout);
          return b;
        }}
        {...rest}
      />
    </ProProvider.Provider>
  );
};

Form.defaultProps = {
  title: '新建表单',
  layoutType: 'ModalForm',
  triggerText: '新增',
  triggerButtonType: 'link',
  submitter: {
    searchConfig: {
      submitText: '确认',
      resetText: '取消',
    },
  },
  submitTimeout: 2000,
  proProviderValueTypeMap: {},
};

export default Form;

export const useForm = (props: FormProps): [any, {}] => {
  return [<Form {...props} />, {}];
};
