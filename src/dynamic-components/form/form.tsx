import {
  BetaSchemaForm,
  ProFormInstance,
  ProProvider,
  RouteContextType,
} from '@ant-design/pro-components';
import { FormSchema } from '@ant-design/pro-form/es/components/SchemaForm';
import { Button } from 'antd';
import { ButtonSize, ButtonType } from 'antd/lib/button';
import type { Location } from 'history';
import { observer } from 'mobx-react';
import React, { useContext, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { IntlShape } from 'react-intl';
import { waitTime } from '../helper/wait';
import { RouterHistory } from '../router';
import { valueTypeMapStore } from './valueTypeMap';

export declare type FormRef = {
  open: () => void;
};

export declare type FormProps = Omit<FormSchema, 'layoutType'> & {
  layoutType?: FormSchema['layoutType'];
  triggerText?: string;
  buttonType?: ButtonType;
  buttonSize?: ButtonSize;
  submitTimeout?: number; // 提交数据时，禁用取消按钮的超时时间（毫秒）。
  onSubmit?: (
    formRef: React.MutableRefObject<ProFormInstance<any> | undefined>,
    values: any,
  ) => boolean;
  intl?: IntlShape; // 国际化
  routeContext?: RouteContextType;
} & RouterHistory & {
    mount?: (
      location: Location | undefined,
      formRef: React.MutableRefObject<ProFormInstance<any> | undefined>,
    ) => void;
    unMount?: (
      location: Location | undefined,
      formRef: React.MutableRefObject<ProFormInstance<any> | undefined>,
    ) => void;
    trigger?: () => void;
  };

export const Form = observer(
  React.forwardRef((props: FormProps, forwardRef) => {
    const {
      location,
      mount,
      unMount,
      triggerText,
      buttonType,
      buttonSize,
      submitTimeout,
      onSubmit,
      intl,
      ...rest
    } = props;

    useImperativeHandle(forwardRef, () => {
      return {
        open: () => showModal(),
      };
    });

    const formRef = useRef<ProFormInstance>();
    const [modalVisible, setModalVisible] = useState<boolean>(false);

    const showModal = () => {
      setModalVisible(true);
    };

    useEffect(() => {
      if (formRef && mount) {
        mount(location, formRef);
      }
      return () => {
        if (formRef && unMount) {
          unMount(location, formRef);
        }
      };
    }, []);

    switch (props.layoutType) {
      case 'ModalForm':
        rest['modalprops'] = {
          destroyOnClose: true,
        };
      case 'DrawerForm':
        rest['drawerprops'] = {
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
          formRef={formRef}
          // @ts-ignore
          trigger={
            <Button size={buttonSize} type={buttonType} block onClick={showModal}>
              {triggerText}
            </Button>
          }
          open={modalVisible}
          onOpenChange={setModalVisible}
          autoFocusFirstInput
          onFinish={async (values) => {
            if (!onSubmit) return false;
            const b = onSubmit(formRef, values);
            await waitTime(submitTimeout);
            return b;
          }}
          {...rest}
        />
      </ProProvider.Provider>
    );
  }),
);

Form.defaultProps = {
  title: '新建表单',
  layoutType: 'ModalForm',
  triggerText: '新增',
  buttonType: 'link',
  buttonSize: 'small',
  submitter: {
    searchConfig: {
      submitText: '确认',
      resetText: '取消',
    },
  },
  submitTimeout: 1000,
  columns: [],
};

export const useForm = (props: FormProps): React.ReactNode => {
  return <Form {...props} />;
};
