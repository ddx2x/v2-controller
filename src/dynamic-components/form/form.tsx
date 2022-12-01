import { BetaSchemaForm, FooterToolbar, ProProvider } from '@ant-design/pro-components';
import { FormSchema } from '@ant-design/pro-form/es/components/SchemaForm';
import { Button, Form as AntdForm, FormInstance } from 'antd';
import { ButtonSize, ButtonType } from 'antd/lib/button';
import type { Location } from "history";
import { observer } from 'mobx-react';
import React, { useContext, useEffect } from 'react';
import { IntlShape } from 'react-intl';
import { waitTime } from '../helper/wait';
import { RouterHistory } from '../router';
import { valueTypeMapStore } from './valueTypeMap';

export declare type FormProps = Omit<FormSchema, 'layoutType'> & {
  layoutType?: FormSchema['layoutType'];
  triggerText?: string;
  triggerButtonType?: ButtonType;
  triggerButtonSize?: ButtonSize;
  submitTimeout?: number; // 提交数据时，禁用取消按钮的超时时间（毫秒）。
  onSubmit?: (form: FormInstance<any> | undefined, values: any) => boolean;
  intl?: IntlShape; // 国际化
} & RouterHistory & {
  mount?: (
    location: Location | undefined,
    form: FormInstance
  ) => void
  unMount?: (
    location: Location | undefined,
    form: FormInstance
  ) => void
}

export const Form: React.FC<FormProps> = observer((props) => {
  const {
    location,
    mount,
    unMount,
    triggerText,
    triggerButtonType,
    triggerButtonSize,
    submitTimeout,
    onSubmit,
    intl,
    ...rest
  } = props;
  // ref
  const [form] = AntdForm.useForm();

  useEffect(() => {
    form && mount && form && mount(location, form)
    return () => form && unMount && form && unMount(location, form)
  }, [])

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

  const proProviderValues = useContext(ProProvider);

  return (
    <ProProvider.Provider
      value={{
        ...proProviderValues,
        valueTypeMap: valueTypeMapStore.stores,
      }}
    >
      <BetaSchemaForm
        // @ts-ignore
        form={form}
        // @ts-ignore
        trigger={<Button size={triggerButtonSize} type={triggerButtonType} block>{triggerText}</Button>}
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
});

Form.defaultProps = {
  title: '新建表单',
  layoutType: 'ModalForm',
  triggerText: '新增',
  triggerButtonType: 'link',
  triggerButtonSize: 'small',
  submitter: {
    searchConfig: {
      submitText: '确认',
      resetText: '取消',
    },
  },
  submitTimeout: 1000,
  columns: [],
};
