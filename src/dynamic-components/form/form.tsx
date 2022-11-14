import { BetaSchemaForm, ProProvider } from '@ant-design/pro-components';
import { FormSchema } from '@ant-design/pro-form/es/components/SchemaForm';
import { Button, Form as AntdForm, FormInstance } from 'antd';
import { ButtonType } from 'antd/lib/button';
import React, { useContext } from 'react';
import { IntlShape } from 'react-intl';
import { FormColumnsType } from '.';
import { waitTime } from './tools';
import { valueTypeMapStore } from './valueTypeMap';

export type FormProps = {
  triggerText?: string;
  triggerButtonType?: ButtonType;
  columns?: FormColumnsType;
  submitTimeout?: number; // 提交数据时，禁用取消按钮的超时时间（毫秒）。
  onSubmit?: (form: FormInstance<any> | undefined, values: any) => boolean;
  intl?: IntlShape; // 国际化
} & Omit<FormSchema, 'columns' | 'trigger'>;

export const Form: React.FC<FormProps> = (props) => {
  const [form] = AntdForm.useForm();
  const proProviderValues = useContext(ProProvider);

  const { columns, triggerText, triggerButtonType, submitTimeout, onSubmit, intl, ...rest } = props;

  switch (props.layoutType) {
    case 'ModalForm':
      rest['modalProps'] = {
        destroyOnClose: true,
      };
    case 'DrawerForm':
      rest['drawerProps'] = {
        destroyOnClose: true,
      };
  }

  return (
    <ProProvider.Provider
      value={{
        ...proProviderValues,
        valueTypeMap: valueTypeMapStore.stores,
      }}
    >
      <BetaSchemaForm
        columns={columns as any}
        layoutType="ModalForm"
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

export default Form;

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
};
